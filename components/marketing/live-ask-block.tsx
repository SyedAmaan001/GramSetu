"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoldToTalkButton } from "@/components/marketing/hold-to-talk-button";
import { VoicePoweredOrb } from "@/components/marketing/voice-orb";
import { useBrowserVoice, useVoiceSupported, type VoiceLang } from "@/lib/hooks/use-browser-voice";
import type { PipelineResult } from "@/lib/pipeline/types";

/** The live "ask GramSetu" block on the home page — same /api/query pipeline as /demo and /demo/sms. */
export function LiveAskBlock() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [lang, setLang] = useState<VoiceLang>("en-IN");
  const voiceSupported = useVoiceSupported();
  const { listen, stop, speak, listening } = useBrowserVoice(lang);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setInput(trimmed);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data: PipelineResult = await res.json();
      setResult(data);
      speak(data.reply);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-3xl border border-border bg-card p-8 sm:p-12">
      <div className="relative h-40 w-40">
        <VoicePoweredOrb enableVoiceControl={listening} hue={listening ? 340 : 20} />
        {voiceSupported && (
          <div className="absolute inset-0 flex items-center justify-center">
            <HoldToTalkButton
              listening={listening}
              onPressStart={() => listen((transcript) => ask(transcript))}
              onPressEnd={stop}
              disabled={loading}
            />
          </div>
        )}
      </div>

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
        <p className="text-xs text-muted-foreground">Voice needs Chrome or Edge — type your request instead.</p>
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
