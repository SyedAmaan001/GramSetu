"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBrowserVoice, type VoiceLang } from "@/lib/hooks/use-browser-voice";
import { useServerVoice } from "@/lib/hooks/use-server-voice";

export type VoiceStatus = "idle" | "recording" | "listening" | "transcribing";

const BROWSER_ERRORS: Record<string, string> = {
  "not-allowed": "Microphone permission is blocked — allow it from the address bar and try again.",
  "service-not-allowed": "Microphone permission is blocked — allow it from the address bar and try again.",
  "no-speech": "Didn't hear anything — try again, a little closer to the mic.",
  "audio-capture": "No microphone found on this device.",
  network: "This browser's speech recognition needs internet — type your request instead.",
  unsupported: "Voice isn't supported in this browser — type your request instead.",
};

/**
 * One voice loop for every web surface (/demo, the home page's live block):
 * record → Sarvam transcription first, browser SpeechRecognition only when
 * recording isn't possible; replies spoken via /api/voice/speak first,
 * browser speechSynthesis as fallback. Every failure becomes a visible
 * `error` message instead of silently doing nothing.
 *
 * Call `start()` / `stop()` directly from the press/click handler.
 */
export function useVoiceConversation(lang: VoiceLang, onTranscript: (text: string) => void) {
  const server = useServerVoice();
  const browser = useBrowserVoice(lang);
  const [error, setError] = useState("");
  const pressedRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const status: VoiceStatus = server.recording
    ? "recording"
    : server.transcribing
      ? "transcribing"
      : browser.listening
        ? "listening"
        : "idle";

  const start = useCallback(async () => {
    pressedRef.current = true;
    setError("");
    server.unlockAudio();

    const recording = await server.startRecording();
    if (!recording) {
      browser.listen(
        (text) => onTranscriptRef.current(text),
        (code) => setError(BROWSER_ERRORS[code] ?? "Voice didn't work that time — try again or type instead.")
      );
      return;
    }

    // Released while the browser's mic-permission prompt was still open.
    if (!pressedRef.current) {
      server.cancelRecording();
      setError("Microphone is ready — now press and hold while you speak.");
    }
  }, [server, browser]);

  const stop = useCallback(async () => {
    pressedRef.current = false;

    if (browser.listening) {
      browser.stop();
      return;
    }

    const result = await server.stopAndTranscribe();
    if (result.ok) {
      onTranscriptRef.current(result.transcript);
    } else if (result.reason === "too-short") {
      setError("Keep holding while you speak, then let go.");
    } else if (result.reason === "transcription-failed") {
      setError("Couldn't make out that recording — try again or type your request.");
    }
  }, [server, browser]);

  const speakReply = useCallback(
    async (text: string) => {
      const spokenByServer = await server.speak(text);
      if (!spokenByServer) browser.speak(text);
    },
    [server, browser]
  );

  return { status, error, start, stop, speakReply, unlockAudio: server.unlockAudio };
}
