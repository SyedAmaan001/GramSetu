import { understand } from "@/lib/pipeline/understand";
import { retrieve } from "@/lib/pipeline/retrieve";
import { respond } from "@/lib/pipeline/respond";
import type { PipelineResult } from "@/lib/pipeline/types";

/**
 * The single shared pipeline. Every channel (web chat, web voice, SMS)
 * calls this and only this — never duplicate understand/retrieve/respond
 * logic per channel.
 */
export async function runPipeline(text: string): Promise<PipelineResult> {
  const understood = await understand(text);
  const matches = await retrieve(understood);
  return respond(understood, matches);
}
