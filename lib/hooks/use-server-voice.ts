"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Real voice via Sarvam (speech-to-text) + ElevenLabs (text-to-speech) —
 * the "ideal" rung of the fallback ladder in docs/idea.md. Every method
 * here returns null/false on failure instead of throwing, so callers can
 * fall back to lib/hooks/use-browser-voice.ts without special-casing.
 */
export function useServerVoice() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return false;

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
      setRecording(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const stopAndTranscribe = useCallback(async (): Promise<{ transcript: string; language: string | null } | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return null;

    const mimeType = recorder.mimeType || "audio/webm";
    const audioBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: mimeType }));
      recorder.stop();
    });

    streamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    setRecording(false);
    setTranscribing(true);

    try {
      const form = new FormData();
      form.append("audio", audioBlob, "recording.webm");
      const res = await fetch("/api/voice/transcribe", { method: "POST", body: form });
      if (!res.ok) return null;

      const data = await res.json();
      if (!data.transcript) return null;
      return { transcript: data.transcript, language: data.language ?? null };
    } catch {
      return null;
    } finally {
      setTranscribing(false);
    }
  }, []);

  const cancelRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    setRecording(false);
  }, []);

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
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  return { recording, transcribing, startRecording, stopAndTranscribe, cancelRecording, speak };
}
