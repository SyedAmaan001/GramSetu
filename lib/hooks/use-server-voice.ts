"use client";

import { useCallback, useRef, useState } from "react";

// A tiny silent WAV, played during the user's tap so the browser treats
// later (post-network-wait) playback as user-initiated and doesn't block it.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

// Recordings shorter than this are almost always a tap, not speech.
const MIN_RECORDING_MS = 400;

/** Point the shared player at new audio and start it (kept outside the hook so it isn't treated as hook state). */
function playOn(audio: HTMLAudioElement, src: string, onEnded?: () => void): Promise<void> {
  audio.src = src;
  audio.onended = onEnded ?? null;
  return audio.play();
}

export type StopResult =
  | { ok: true; transcript: string; language: string | null }
  | { ok: false; reason: "not-recording" | "too-short" | "transcription-failed" };

/**
 * Real voice via Sarvam (speech-to-text) + ElevenLabs/Sarvam (text-to-speech) —
 * the "ideal" rung of the fallback ladder in docs/idea.md. Methods never
 * throw, so callers can fall back to lib/hooks/use-browser-voice.ts.
 */
export function useServerVoice() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** Call synchronously inside a click/press handler, before any await. */
  const unlockAudio = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    playOn(audioRef.current, SILENT_WAV).catch(() => {});
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    setRecording(false);
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setRecording(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const stopAndTranscribe = useCallback(async (): Promise<StopResult> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return { ok: false, reason: "not-recording" };

    const duration = Date.now() - startedAtRef.current;
    const mimeType = recorder.mimeType || "audio/webm";
    const audioBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: mimeType }));
      recorder.stop();
    });
    releaseStream();

    if (duration < MIN_RECORDING_MS || audioBlob.size === 0) return { ok: false, reason: "too-short" };

    setTranscribing(true);
    try {
      const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("audio", audioBlob, `recording.${extension}`);
      const res = await fetch("/api/voice/transcribe", { method: "POST", body: form });
      if (!res.ok) return { ok: false, reason: "transcription-failed" };

      const data = await res.json();
      const transcript = typeof data.transcript === "string" ? data.transcript.trim() : "";
      if (!transcript) return { ok: false, reason: "transcription-failed" };
      return { ok: true, transcript, language: data.language ?? null };
    } catch {
      return { ok: false, reason: "transcription-failed" };
    } finally {
      setTranscribing(false);
    }
  }, [releaseStream]);

  const cancelRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    releaseStream();
  }, [releaseStream]);

  const speak = useCallback(async (text: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return false;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      setSpeaking(true);
      await playOn(audioRef.current, url, () => {
        URL.revokeObjectURL(url);
        setSpeaking(false);
      });
      return true;
    } catch {
      setSpeaking(false);
      return false;
    }
  }, []);

  return { recording, transcribing, speaking, unlockAudio, startRecording, stopAndTranscribe, cancelRecording, speak };
}
