"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PipelineResult } from "@/lib/pipeline/types";

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; result: PipelineResult };

const EXAMPLES = [
  "I need a plumber near my village",
  "Is there an electrician available in Hosahalli?",
  "I need a lawyer",
];

export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const result: PipelineResult = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", result }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          result: {
            reply: "Something went wrong reaching GramConnect. Please try again.",
            understood: { category: null, village: null, language: "en", rawText: trimmed },
            matches: [],
            verified: false,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 p-4 sm:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">GramConnect — live demo</h1>
        <p className="text-sm text-muted-foreground">
          Ask in your own words, like you would ask a neighbour. Every answer is checked
          against a verified local directory — the system will say so when it can&apos;t verify.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <Button key={ex} variant="outline" size="sm" onClick={() => send(ex)} disabled={loading}>
            {ex}
          </Button>
        ))}
      </div>

      <Card className="flex-1">
        <CardContent className="flex flex-col gap-3 p-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Try: &ldquo;I need a plumber near my village&rdquo;
            </p>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                {m.text}
              </div>
            ) : (
              <div key={i} className="mr-auto max-w-[90%] space-y-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <p>{m.result.reply}</p>
                {m.result.matches.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      {m.result.matches.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 text-xs">
                          <span>
                            {p.name} · {p.distanceKm} km · {p.village}
                          </span>
                          <Badge variant={p.verified ? "default" : "secondary"}>
                            {p.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          )}

          {loading && <p className="text-xs text-muted-foreground">GramConnect is checking the directory…</p>}
        </CardContent>
      </Card>

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
          placeholder="I need a plumber near my village…"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </main>
  );
}
