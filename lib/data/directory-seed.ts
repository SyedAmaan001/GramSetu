import type { ServiceProvider } from "@/lib/pipeline/types";

/**
 * DEMO DATA — fictional providers for the hackathon prototype, not real
 * businesses. This is the single source of truth for both the local
 * in-memory fallback (used when Supabase isn't configured yet) and
 * `supabase/seed.sql`. Keep the two in sync if you edit this.
 */
export const DIRECTORY_SEED: ServiceProvider[] = [
  { id: "1", name: "Ravi Plumbing Works", category: "plumber", village: "Hosahalli", distanceKm: 3.2, phone: "+91 90000 11111", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-01" },
  { id: "2", name: "Kumar Pipe & Tap Services", category: "plumber", village: "Hosahalli", distanceKm: 7.1, phone: "+91 90000 11112", available: false, verified: true, source: "Village Admin", updatedAt: "2026-08-20" },
  { id: "3", name: "Shankar Plumbing", category: "plumber", village: "Channapatna", distanceKm: 5.4, phone: "+91 90000 11113", available: true, verified: false, source: "Self-registered", updatedAt: "2026-09-10" },
  { id: "4", name: "Manjunath Electricals", category: "electrician", village: "Hosahalli", distanceKm: 2.8, phone: "+91 90000 22221", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-05" },
  { id: "5", name: "Suresh Electrical Repairs", category: "electrician", village: "Channapatna", distanceKm: 4.0, phone: "+91 90000 22222", available: true, verified: true, source: "Village Admin", updatedAt: "2026-08-28" },
  { id: "6", name: "Prakash Motors & Repair", category: "mechanic", village: "Hosahalli", distanceKm: 6.5, phone: "+91 90000 33331", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-02" },
  { id: "7", name: "Ganesh Auto Works", category: "mechanic", village: "Doddaballapur", distanceKm: 12.0, phone: "+91 90000 33332", available: true, verified: false, source: "Self-registered", updatedAt: "2026-09-11" },
  { id: "8", name: "Lakshmi Tailoring", category: "tailor", village: "Hosahalli", distanceKm: 1.5, phone: "+91 90000 44441", available: true, verified: true, source: "Village Admin", updatedAt: "2026-08-15" },
  { id: "9", name: "Basavaraj Carpentry", category: "carpenter", village: "Channapatna", distanceKm: 3.9, phone: "+91 90000 55551", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-08" },
  { id: "10", name: "Nagaraj Carpentry & Furniture", category: "carpenter", village: "Doddaballapur", distanceKm: 9.3, phone: "+91 90000 55552", available: false, verified: true, source: "Village Admin", updatedAt: "2026-07-30" },
  { id: "11", name: "Anitha Beauty Parlour", category: "beautician", village: "Hosahalli", distanceKm: 2.1, phone: "+91 90000 66661", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-12" },
  { id: "12", name: "Ramesh Borewell Services", category: "borewell", village: "Channapatna", distanceKm: 8.7, phone: "+91 90000 77771", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-03" },
  { id: "13", name: "Krishna Painting Works", category: "painter", village: "Hosahalli", distanceKm: 4.6, phone: "+91 90000 88881", available: true, verified: false, source: "Self-registered", updatedAt: "2026-09-09" },
  { id: "14", name: "Venkatesh AC & Fridge Repair", category: "appliance repair", village: "Doddaballapur", distanceKm: 10.5, phone: "+91 90000 99991", available: true, verified: true, source: "Village Admin", updatedAt: "2026-08-25" },
  { id: "15", name: "Muniraju Masonry", category: "mason", village: "Channapatna", distanceKm: 6.0, phone: "+91 90000 10101", available: true, verified: true, source: "Village Admin", updatedAt: "2026-09-06" },
];

export const KNOWN_VILLAGES = ["Hosahalli", "Channapatna", "Doddaballapur"];

export const KNOWN_CATEGORIES = Array.from(
  new Set(DIRECTORY_SEED.map((p) => p.category))
);

/**
 * Words a resident might actually say that map to a known category —
 * used by the keyword-fallback intent parser (lib/pipeline/understand.ts)
 * when no ANTHROPIC_API_KEY is configured. Keep in sync with KNOWN_CATEGORIES.
 */
export const CATEGORY_SYNONYMS: Record<string, string[]> = {
  plumber: ["plumb", "pipe", "leak", "tap", "faucet", "drainage"],
  electrician: ["electric", "wiring", "wireman", "power cut", "switch board", "mcb", "fuse"],
  mechanic: ["vehicle", "car repair", "bike repair", "auto repair", "engine", "puncture"],
  tailor: ["stitch", "sewing", "clothes", "blouse", "dress"],
  carpenter: ["furniture", "wood work", "carpentry", "door repair"],
  beautician: ["parlour", "parlor", "beauty", "salon", "haircut", "makeup"],
  borewell: ["bore well", "water well", "drilling", "groundwater"],
  painter: ["painting", "paint", "whitewash"],
  "appliance repair": ["ac repair", "fridge", "refrigerator", "washing machine", "appliance", "cooler"],
  mason: ["masonry", "construction work", "brick work", "cement work"],
};
