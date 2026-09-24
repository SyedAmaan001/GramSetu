import { DIRECTORY_SEED } from "@/lib/data/directory-seed";
import type { ServiceProvider } from "@/lib/pipeline/types";

/**
 * In-memory mutable directory, used only when Supabase isn't configured.
 * Resets on server restart — fine for local dev and demo rehearsal, but
 * NOT a substitute for the real Supabase table before the live pitch.
 */
let store: ServiceProvider[] = DIRECTORY_SEED.map((p) => ({ ...p }));

export function listProviders(): ServiceProvider[] {
  return store;
}

export function addProvider(input: Omit<ServiceProvider, "id" | "updatedAt">): ServiceProvider {
  const provider: ServiceProvider = {
    ...input,
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  store = [provider, ...store];
  return provider;
}

export function updateProvider(id: string, patch: Partial<ServiceProvider>): ServiceProvider | null {
  let updated: ServiceProvider | null = null;
  store = store.map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...patch, id: p.id, updatedAt: new Date().toISOString() };
    return updated;
  });
  return updated;
}

export function removeProvider(id: string): boolean {
  const before = store.length;
  store = store.filter((p) => p.id !== id);
  return store.length < before;
}
