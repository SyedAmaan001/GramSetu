import type { ServiceProvider } from "@/lib/pipeline/types";

/** Shared Supabase row <-> ServiceProvider mapping, used by retrieve.ts and the admin API route. */

export function mapRowToProvider(row: Record<string, unknown>): ServiceProvider {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    village: row.village as string,
    distanceKm: Number(row.distance_km),
    phone: row.phone as string,
    available: row.available as boolean,
    verified: row.verified as boolean,
    source: row.source as string,
    updatedAt: row.updated_at as string,
  };
}

export function providerToRow(p: Partial<ServiceProvider>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.category !== undefined) row.category = p.category;
  if (p.village !== undefined) row.village = p.village;
  if (p.distanceKm !== undefined) row.distance_km = p.distanceKm;
  if (p.phone !== undefined) row.phone = p.phone;
  if (p.available !== undefined) row.available = p.available;
  if (p.verified !== undefined) row.verified = p.verified;
  if (p.source !== undefined) row.source = p.source;
  return row;
}
