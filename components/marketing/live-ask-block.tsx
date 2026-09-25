"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoldToTalkButton } from "@/components/marketing/hold-to-talk-button";
import { VoicePoweredOrb } from "@/components/marketing/voice-orb";
import { useMicSupported, type VoiceLang } from "@/lib/hooks/use-browser-voice";
import { useVoiceConversation } from "@/lib/hooks/use-voice-conversation";
import type { PipelineResult } from "@/lib/pipeline/types";

/** The live "ask GramSetu" block on the home page — same /api/query pipeline as /demo and /demo/sms. */
export function LiveAskBlock() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [lang, setLang] = useState<VoiceLang>("en-IN");
  const [queryError, setQueryError] = useState("");
  const voiceSupported = useMicSupported();
  const voice = useVoiceConversation(lang, (transcript) => ask(transcript, true));
  const active = voice.status === "recording" || voice.status === "listening";

  const statusText =
    voice.status === "recording" || voice.status === "listening"
      ? "Listening… let go when you're done"
      : voice.status === "transcribing"
        ? "Understanding what you said…"
        : loading
          ? "Checking the verified directory…"
          : "Press and hold to speak";

  async function ask(text: string, spoken = false) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (!spoken) voice.unlockAudio();
    setLoading(true);
    setQueryError("");
    setInput(trimmed);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error(`query failed: ${res.status}`);
      const data: PipelineResult = await res.json();
      setResult(data);
      await voice.speakReply(data.reply);
    } catch {
      setQueryError("Couldn't reach GramSetu just now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-3xl border border-border bg-card p-8 sm:p-12">
      <div className="relative h-40 w-40">
        <VoicePoweredOrb enableVoiceControl={active} hue={active ? 340 : 20} />
        {voiceSupported && (
          <div className="absolute inset-0 flex items-center justify-center">
            <HoldToTalkButton
              listening={active}
              onPressStart={voice.start}
              onPressEnd={voice.stop}
              disabled={loading || voice.status === "transcribing"}
            />
          </div>
        )}
      </div>

      {voiceSupported && (
        <p aria-live="polite" className="-mt-4 text-center text-sm text-muted-foreground">
          {statusText}
          {voice.error && <span className="mt-1 block text-destructive">{voice.error}</span>}
        </p>
      )}

      {voiceSupported ? (
        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setLang("en-IN")}
            className={`rounded-full px-3 py-1 ${lang === "en-IN" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("kn-IN")}
            className={`rounded-full px-3 py-1 ${lang === "kn-IN" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            ಕನ್ನಡ
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Voice isn&apos;t available in this browser — type your request instead.</p>
      )}

      <form
        className="flex w-full max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="I need a plumber near my village…" disabled={loading} />
        <Button type="submit" disabled={loading}>
          Ask
        </Button>
      </form>

      {queryError && <p className="text-sm text-destructive">{queryError}</p>}

      {result && (
        <div className="w-full space-y-3 rounded-2xl bg-muted p-5 text-left text-sm">
          <p>{result.reply}</p>
          {result.matches.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {result.matches.slice(0, 3).map((p) => (
                <Badge key={p.id} variant={p.verified ? "default" : "secondary"}>
                  {p.name} · {p.distanceKm}km
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
