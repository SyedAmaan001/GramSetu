"use client";

import { useCallback, useRef, useState } from "react";

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
  onerror: (() => void) | null;
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

export function useBrowserVoice(lang: VoiceLang) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const listen = useCallback(
    (onTranscript: (text: string) => void) => {
      const Recognition = getSpeechRecognition();
      if (!Recognition) return;

      const recognition = new Recognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
      setListening(true);
      recognition.start();
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang === lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  return { listen, stop, speak, listening };
}
