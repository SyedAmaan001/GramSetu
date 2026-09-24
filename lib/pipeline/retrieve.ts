import { getSupabase } from "@/lib/clients/supabase";
import { mapRowToProvider } from "@/lib/clients/map-provider-row";
import { listProviders } from "@/lib/data/directory-store";
import type { ServiceProvider, UnderstoodRequest } from "@/lib/pipeline/types";

function rank(providers: ServiceProvider[]): ServiceProvider[] {
  return [...providers].sort((a, b) => {
    // Verified + available first, then by distance.
    const score = (p: ServiceProvider) => (p.verified ? 0 : 2) + (p.available ? 0 : 1);
    const diff = score(a) - score(b);
    return diff !== 0 ? diff : a.distanceKm - b.distanceKm;
  });
}

async function retrieveFromSupabase(understood: UnderstoodRequest): Promise<ServiceProvider[] | null> {
  const supabase = getSupabase();
  if (!supabase || !understood.category) return null;

  let query = supabase.from("service_providers").select("*").eq("category", understood.category);
  if (understood.village) query = query.eq("village", understood.village);

  const { data, error } = await query;
  if (error || !data) return null;

  return data.map(mapRowToProvider);
}

function retrieveFromStore(understood: UnderstoodRequest): ServiceProvider[] {
  if (!understood.category) return [];
  return listProviders().filter(
    (p) =>
      p.category === understood.category &&
      (!understood.village || p.village === understood.village)
  );
}

export async function retrieve(understood: UnderstoodRequest): Promise<ServiceProvider[]> {
  const fromDb = await retrieveFromSupabase(understood);
  const matches = fromDb ?? retrieveFromStore(understood);
  return rank(matches);
}
