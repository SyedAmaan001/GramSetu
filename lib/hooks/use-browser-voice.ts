"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

/**
 * Voice loop using the browser's built-in speech APIs — zero API keys,
 * zero external accounts, works today. This is Fallback A/B from
 * docs/idea.md: a real English+Kannada voice demo while Sarvam/ElevenLabs
 * accounts are still being set up. Swap in a Sarvam/ElevenLabs-backed
 * implementation later without changing callers (same hook shape).
 *
 * Support varies by browser: reliable in Chrome/Edge, absent in Firefox.
 */

export type VoiceLang = "en-IN" | "kn-IN";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isVoiceSupported(): boolean {
  return getSpeechRecognition() !== null && typeof window !== "undefined" && "speechSynthesis" in window;
}

const noopSubscribe = () => () => {};

/**
 * Hydration-safe "is voice supported" check: renders `false` on the server
 * and during the initial client render (matching SSR output), then flips to
 * the real value. Uses useSyncExternalStore instead of a setState-in-effect
 * "isMounted" pattern, since the value never changes after mount and this
 * is the pattern React recommends for read-only browser feature detection.
 */
export function useVoiceSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isVoiceSupported, () => false);
}

/** True if *any* voice-input path works: recording for Sarvam, or the browser's own recognition. */
function isMicSupported(): boolean {
  if (typeof window === "undefined") return false;
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== "undefined";
  return canRecord || getSpeechRecognition() !== null;
}

export function useMicSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isMicSupported, () => false);
}

const KANNADA_RANGE = /[ಀ-೿]/;

export function useBrowserVoice(lang: VoiceLang) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const listen = useCallback(
    (onTranscript: (text: string) => void, onError?: (error: string) => void): boolean => {
      const Recognition = getSpeechRecognition();
      if (!Recognition) {
        onError?.("unsupported");
        return false;
      }

      const recognition = new Recognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };
      recognition.onerror = (event) => {
        setListening(false);
        onError?.(event.error ?? "unknown");
      };
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        onError?.("start-failed");
        return false;
      }
      setListening(true);
      return true;
    },
    [lang]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      // Speak in the reply's language, not whichever toggle is selected.
      const replyLang = KANNADA_RANGE.test(text) ? "kn-IN" : lang;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = replyLang;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang === replyLang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  return { listen, stop, speak, listening };
}
