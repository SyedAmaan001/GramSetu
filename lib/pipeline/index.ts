import { understand } from "@/lib/pipeline/understand";
import { retrieve } from "@/lib/pipeline/retrieve";
import { respond } from "@/lib/pipeline/respond";
import { sarvamTranslate } from "@/lib/clients/sarvam";
import type { PipelineResult } from "@/lib/pipeline/types";

/**
 * The single shared pipeline. Every channel (web chat, web voice, SMS)
 * calls this and only this — never duplicate understand/retrieve/respond
 * logic per channel.
 */
export async function runPipeline(text: string): Promise<PipelineResult> {
  const understood = await understand(text);
  const matches = await retrieve(understood);
  const result = respond(understood, matches);

  if (understood.language === "kn") {
    const translated = await sarvamTranslate(result.reply, "en-IN", "kn-IN");
    if (translated) result.reply = translated;
  }

  return result;
}
