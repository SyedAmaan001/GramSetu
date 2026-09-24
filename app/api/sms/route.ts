import { NextRequest } from "next/server";
import { runPipeline } from "@/lib/pipeline";

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Twilio SMS webhook: Twilio POSTs incoming messages as form-encoded data
 * with a `Body` field, and expects a TwiML response back. Point a Twilio
 * phone number's "A message comes in" webhook at this route once
 * TWILIO_* env vars are configured (see .env.example) — no code changes
 * needed, this route works the moment the number is wired up.
 *
 * Testable right now without any Twilio account:
 *   curl -X POST http://localhost:3000/api/sms --data "Body=I need a plumber near Hosahalli"
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const body = String(form.get("Body") ?? "");

  const result = await runPipeline(body);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(result.reply)}</Message></Response>`;
  return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
}
