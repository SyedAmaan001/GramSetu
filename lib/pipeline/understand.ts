import Anthropic from "@anthropic-ai/sdk";
import { CATEGORY_SYNONYMS, KNOWN_CATEGORIES, KNOWN_VILLAGES } from "@/lib/data/directory-seed";
import type { UnderstoodRequest } from "@/lib/pipeline/types";

const KANNADA_RANGE = /[ಀ-೿]/;

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GOOGLE_API_KEY,
].filter((k): k is string => Boolean(k));

function matchCategory(lower: string): string | null {
  const direct = KNOWN_CATEGORIES.find((c) => lower.includes(c));
  if (direct) return direct;

  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.some((word) => lower.includes(word))) return category;
  }
  return null;
}

/** Keyword + synonym fallback used when no LLM provider is configured or reachable. */
function understandWithKeywords(text: string): UnderstoodRequest {
  const lower = text.toLowerCase();
  const category = matchCategory(lower);
  const village = KNOWN_VILLAGES.find((v) => lower.includes(v.toLowerCase())) ?? null;
  const language = KANNADA_RANGE.test(text) ? "kn" : "en";

  return { category, village, language, rawText: text };
}

const LLM_INSTRUCTIONS =
  `Extract a structured service request from a rural resident's plain-language message. ` +
  `Known service categories: ${KNOWN_CATEGORIES.join(", ")}. ` +
  `Known villages: ${KNOWN_VILLAGES.join(", ")}. ` +
  `Respond with ONLY a JSON object: {"category": string|null, "village": string|null, "language": "en"|"kn"}. ` +
  `Use null for category/village if you cannot confidently match them to the known lists above ` +
  `(do not invent a category or village that isn't in those lists). ` +
  `Set language to "kn" if the message is in Kannada (script or romanized), otherwise "en".`;

function parseLLMJson(raw: string, text: string): UnderstoodRequest {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    category: parsed.category ?? null,
    village: parsed.village ?? null,
    language: parsed.language === "kn" ? "kn" : "en",
    rawText: text,
  };
}

async function understandWithClaude(text: string): Promise<UnderstoodRequest> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 300,
    system: LLM_INSTRUCTIONS,
    messages: [{ role: "user", content: text }],
  });

  const block = message.content.find((c) => c.type === "text");
  const raw = block && block.type === "text" ? block.text : "{}";
  return parseLLMJson(raw, text);
}

async function understandWithGemini(text: string): Promise<UnderstoodRequest> {
  for (const key of GEMINI_KEYS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${LLM_INSTRUCTIONS}\n\nMessage: ${text}` }] }],
          }),
        }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) continue;
      return parseLLMJson(raw, text);
    } catch {
      // try next key
    }
  }
  throw new Error("no Gemini key succeeded");
}

export async function understand(text: string): Promise<UnderstoodRequest> {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await understandWithClaude(text);
    } catch {
      // fall through to the next rung of the ladder
    }
  }

  if (GEMINI_KEYS.length > 0) {
    try {
      return await understandWithGemini(text);
    } catch {
      // fall through to the keyword fallback
    }
  }

  return understandWithKeywords(text);
}
