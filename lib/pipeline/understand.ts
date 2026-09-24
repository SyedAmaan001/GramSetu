import Anthropic from "@anthropic-ai/sdk";
import { KNOWN_CATEGORIES, KNOWN_VILLAGES } from "@/lib/data/directory-seed";
import type { UnderstoodRequest } from "@/lib/pipeline/types";

const KANNADA_RANGE = /[ಀ-೿]/;

/** Very small keyword fallback used when no ANTHROPIC_API_KEY is configured. */
function understandWithKeywords(text: string): UnderstoodRequest {
  const lower = text.toLowerCase();
  const category =
    KNOWN_CATEGORIES.find((c) => lower.includes(c)) ??
    (lower.includes("plumb") ? "plumber" : null) ??
    (lower.includes("electric") ? "electrician" : null) ??
    (lower.includes("mechanic") || lower.includes("vehicle") ? "mechanic" : null) ??
    null;

  const village = KNOWN_VILLAGES.find((v) => lower.includes(v.toLowerCase())) ?? null;
  const language = KANNADA_RANGE.test(text) ? "kn" : "en";

  return { category, village, language, rawText: text };
}

async function understandWithClaude(text: string): Promise<UnderstoodRequest> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 300,
    system:
      `Extract a structured service request from a rural resident's plain-language message. ` +
      `Known service categories: ${KNOWN_CATEGORIES.join(", ")}. ` +
      `Known villages: ${KNOWN_VILLAGES.join(", ")}. ` +
      `Respond with ONLY a JSON object: {"category": string|null, "village": string|null, "language": "en"|"kn"}. ` +
      `Use null for category/village if you cannot confidently match them to the known lists above ` +
      `(do not invent a category or village that isn't in those lists).`,
    messages: [{ role: "user", content: text }],
  });

  const block = message.content.find((c) => c.type === "text");
  const raw = block && block.type === "text" ? block.text : "{}";

  try {
    const parsed = JSON.parse(raw);
    return {
      category: parsed.category ?? null,
      village: parsed.village ?? null,
      language: parsed.language === "kn" ? "kn" : "en",
      rawText: text,
    };
  } catch {
    return understandWithKeywords(text);
  }
}

export async function understand(text: string): Promise<UnderstoodRequest> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return understandWithKeywords(text);
  }

  try {
    return await understandWithClaude(text);
  } catch {
    // Fallback ladder: never let an LLM outage break the pipeline.
    return understandWithKeywords(text);
  }
}
