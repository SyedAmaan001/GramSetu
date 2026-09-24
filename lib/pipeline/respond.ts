import { KNOWN_CATEGORIES } from "@/lib/data/directory-seed";
import type { PipelineResult, ServiceProvider, UnderstoodRequest } from "@/lib/pipeline/types";

function describe(provider: ServiceProvider): string {
  const status = provider.verified ? `verified by ${provider.source}` : "not yet verified";
  const availability = provider.available ? "available now" : "currently unavailable";
  return `${provider.name} — ${provider.distanceKm} km away in ${provider.village}, ${availability}, ${status}. Contact: ${provider.phone}.`;
}

export function respond(understood: UnderstoodRequest, matches: ServiceProvider[]): PipelineResult {
  if (!understood.category) {
    return {
      reply: `I couldn't tell what service you need. I can help find: ${KNOWN_CATEGORIES.join(", ")}. Could you say which one, and your village?`,
      understood,
      matches: [],
      verified: false,
    };
  }

  if (matches.length === 0) {
    const where = understood.village ? ` near ${understood.village}` : "";
    return {
      reply: `I couldn't verify a ${understood.category}${where} in our directory yet. I don't want to guess — please check with your village office directly, or try again once more providers are listed.`,
      understood,
      matches: [],
      verified: false,
    };
  }

  const best = matches[0];
  const alternatives = matches.slice(1, 3);

  let reply = `I found a ${understood.category}: ${describe(best)}`;
  if (!best.verified) {
    reply += ` Note: this listing is self-registered and not yet verified by the village admin — please confirm before relying on it.`;
  }
  if (alternatives.length > 0) {
    reply += ` Other options: ${alternatives.map((p) => `${p.name} (${p.distanceKm} km)`).join("; ")}.`;
  }

  return {
    reply,
    understood,
    matches,
    verified: best.verified,
  };
}
