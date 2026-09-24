import { NextRequest, NextResponse } from "next/server";
import { sarvamSpeechToText } from "@/lib/clients/sarvam";

/**
 * Real speech-to-text via Sarvam AI (Indic ASR), the "ideal" rung of the
 * voice fallback ladder (docs/idea.md). The client falls back to the
 * browser's built-in SpeechRecognition if this route is unavailable or
 * returns an error — this is never the only way to use voice.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const audio = form.get("audio");

  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "audio file is required" }, { status: 400 });
  }

  const result = await sarvamSpeechToText(audio);
  if (!result) {
    return NextResponse.json({ error: "transcription unavailable" }, { status: 502 });
  }

  return NextResponse.json({ transcript: result.transcript, language: result.languageCode });
}
