import { NextRequest, NextResponse } from "next/server";
import { elevenLabsTextToSpeech } from "@/lib/clients/elevenlabs";

/**
 * Real text-to-speech via ElevenLabs — the "ideal" rung of the voice
 * fallback ladder (docs/idea.md). The client falls back to the browser's
 * built-in speechSynthesis if this route is unavailable or errors.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const audio = await elevenLabsTextToSpeech(text);
  if (!audio) {
    return NextResponse.json({ error: "speech synthesis unavailable" }, { status: 502 });
  }

  return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
}
