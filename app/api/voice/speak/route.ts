import { NextRequest, NextResponse } from "next/server";
import { elevenLabsTextToSpeech } from "@/lib/clients/elevenlabs";
import { sarvamTextToSpeech } from "@/lib/clients/sarvam";

const KANNADA_RANGE = /[ಀ-೿]/;

/**
 * Real text-to-speech — the "ideal" rung of the voice fallback ladder
 * (docs/idea.md). Kannada replies go to Sarvam first (ElevenLabs'
 * multilingual model doesn't support Kannada); English goes to ElevenLabs
 * first with Sarvam as backup. The client falls back to the browser's
 * built-in speechSynthesis if this route errors.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (KANNADA_RANGE.test(text)) {
    const wav = await sarvamTextToSpeech(text, "kn-IN");
    if (wav) return new Response(wav, { headers: { "Content-Type": "audio/wav" } });
    return NextResponse.json({ error: "speech synthesis unavailable" }, { status: 502 });
  }

  const mp3 = await elevenLabsTextToSpeech(text);
  if (mp3) return new Response(mp3, { headers: { "Content-Type": "audio/mpeg" } });

  const wav = await sarvamTextToSpeech(text, "en-IN");
  if (wav) return new Response(wav, { headers: { "Content-Type": "audio/wav" } });

  return NextResponse.json({ error: "speech synthesis unavailable" }, { status: 502 });
}
