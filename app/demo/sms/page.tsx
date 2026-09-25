"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PipelineResult } from "@/lib/pipeline/types";

type SmsMessage = { role: "resident" | "gramconnect"; text: string };

/**
 * SMS simulator: styled like a real SMS thread, but calls the exact same
 * /api/query pipeline as the web chat and the real Twilio webhook
 * (app/api/sms/route.ts). If live Twilio has any issue on demo day
 * (number provisioning, venue wifi, carrier delay), this proves the
 * identical backend logic without any telephony risk — see the fallback
 * ladder in docs/idea.md.
 */
export default function SmsSimulatorPage() {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: "resident", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const result: PipelineResult = await res.json();
      setMessages((prev) => [...prev, { role: "gramconnect", text: result.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "gramconnect", text: "Delivery failed. Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-3 bg-muted p-4">
      <header className="rounded-lg bg-card p-3 text-center shadow-sm">
        <p className="text-xs text-muted-foreground">SMS · no smartphone or internet needed</p>
        <p className="font-semibold">GramSetu</p>
        <a href="/demo" className="text-xs text-muted-foreground underline underline-offset-2">
          ← Back to chat/voice demo
        </a>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-card p-3 shadow-sm">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Send a text like &ldquo;I need a plumber near my village&rdquo;
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "resident"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm"
            }
          >
            {m.text}
          </div>
        ))}
        {sending && <p className="text-center text-xs text-muted-foreground">Delivering…</p>}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Text message…"
          disabled={sending}
        />
        <Button type="submit" disabled={sending}>
          Send
        </Button>
      </form>
    </main>
  );
}
