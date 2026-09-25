import Anthropic from "@anthropic-ai/sdk";
import { CATEGORY_SYNONYMS, KNOWN_CATEGORIES, KNOWN_VILLAGES, VILLAGE_ALIASES } from "@/lib/data/directory-seed";
import { sarvamTranslate } from "@/lib/clients/sarvam";
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

/**
 * Speech-to-text often splits village names ("Hosa Halli") or returns them
 * in Kannada script / another spelling, so compare with spaces removed
 * against the name and its aliases.
 */
function matchVillage(text: string): string | null {
  const squashed = text.toLowerCase().replace(/\s+/g, "");
  return (
    KNOWN_VILLAGES.find((v) =>
      [v, ...(VILLAGE_ALIASES[v] ?? [])].some((name) => squashed.includes(name.toLowerCase()))
    ) ?? null
  );
}

/**
 * Keyword + synonym fallback used when no LLM provider is configured or
 * reachable. Kannada is translated to English first (Sarvam) so it gets the
 * full synonym list; Kannada keywords in the synonym list cover the case
 * where translation is down too.
 */
async function understandWithKeywords(text: string): Promise<UnderstoodRequest> {
  const language = KANNADA_RANGE.test(text) ? "kn" : "en";
  const english = language === "kn" ? await sarvamTranslate(text, "kn-IN", "en-IN") : null;
  const searchable = `${text} ${english ?? ""}`;

  const category = matchCategory(searchable.toLowerCase());
  const village = matchVillage(searchable);

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
    village: parsed.village ? matchVillage(parsed.village) : null,
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

// Gemini's free tier often 429s/503s; cap how long a resident can be kept
// waiting before we drop to the keyword fallback.
const GEMINI_ATTEMPT_TIMEOUT_MS = 4000;
const GEMINI_TOTAL_BUDGET_MS = 6000;
// After every key fails, skip Gemini for a while instead of making each
// following request wait out the same failures (a simple circuit breaker).
const GEMINI_COOLDOWN_MS = 60_000;
let geminiDownUntil = 0;

async function understandWithGemini(text: string): Promise<UnderstoodRequest> {
  const deadline = Date.now() + GEMINI_TOTAL_BUDGET_MS;
  for (const key of GEMINI_KEYS) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${LLM_INSTRUCTIONS}\n\nMessage: ${text}` }] }],
          }),
          signal: AbortSignal.timeout(Math.min(GEMINI_ATTEMPT_TIMEOUT_MS, remaining)),
        }
      );
      if (!res.ok) {
        console.error(`[understandWithGemini] ${res.status} ${res.statusText}`);
        continue;
      }

      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) continue;
      return parseLLMJson(raw, text);
    } catch (err) {
      console.error("[understandWithGemini] request failed:", err);
    }
  }
  geminiDownUntil = Date.now() + GEMINI_COOLDOWN_MS;
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

  if (GEMINI_KEYS.length > 0 && Date.now() >= geminiDownUntil) {
    try {
      return await understandWithGemini(text);
    } catch {
      // every key failed — fall through to the keyword fallback
    }
  }

  return understandWithKeywords(text);
}
