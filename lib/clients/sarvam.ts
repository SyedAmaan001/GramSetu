const SARVAM_KEYS = [
  process.env.SARVAM_API_KEY,
  process.env.SARVAM_API_KEY_1,
  process.env.SARVAM_API_KEY_2,
  process.env.SARVAM_API_KEY_3,
  process.env.SARVAM_API_KEY_4,
  process.env.SARVAM_API_KEY_5,
].filter((k): k is string => Boolean(k));

/** Tries each configured key in turn, skipping to the next on a 429 (rate limit) or network error. */
async function withKeyRotation(fn: (key: string) => Promise<Response>): Promise<Response | null> {
  for (const key of SARVAM_KEYS) {
    try {
      const res = await fn(key);
      if (res.status !== 429) return res;
    } catch {
      // try next key
    }
  }
  return null;
}

export function isSarvamConfigured(): boolean {
  return SARVAM_KEYS.length > 0;
}

export async function sarvamSpeechToText(
  audio: Blob,
  filename = "recording.webm"
): Promise<{ transcript: string; languageCode: string | null } | null> {
  if (SARVAM_KEYS.length === 0) return null;

  const res = await withKeyRotation((key) => {
    const form = new FormData();
    form.append("file", audio, filename);
    form.append("model", "saaras:v3");
    form.append("language_code", "unknown");
    return fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: { "api-subscription-key": key },
      body: form,
    });
  });

  if (!res || !res.ok) return null;
  const data = await res.json();
  if (!data.transcript) return null;
  return { transcript: data.transcript, languageCode: data.language_code ?? null };
}

export async function sarvamTranslate(
  text: string,
  sourceLanguageCode: string,
  targetLanguageCode: string
): Promise<string | null> {
  if (SARVAM_KEYS.length === 0 || !text.trim()) return null;

  const res = await withKeyRotation((key) =>
    fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: { "api-subscription-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLanguageCode,
        target_language_code: targetLanguageCode,
      }),
    })
  );

  if (!res || !res.ok) return null;
  const data = await res.json();
  return data.translated_text ?? null;
}
