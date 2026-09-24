import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/clients/supabase";
import { mapRowToProvider, providerToRow } from "@/lib/clients/map-provider-row";
import { addProvider, listProviders, removeProvider, updateProvider } from "@/lib/data/directory-store";
import type { ServiceProvider } from "@/lib/pipeline/types";

/**
 * MVP-only auth: a single shared admin password, per CLAUDE.md's rule
 * against building real auth for this hackathon. In local dev, if
 * ADMIN_PASSWORD isn't set yet, "demo" works so the console is still
 * demoable before secrets are configured.
 */
function isAuthorized(req: NextRequest): boolean {
  const supplied = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return process.env.NODE_ENV !== "production" && supplied === "demo";
  return supplied === expected;
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("service_providers")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ providers: (data ?? []).map(mapRowToProvider), source: "supabase" });
  }

  return NextResponse.json({ providers: listProviders(), source: "in-memory" });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const body = (await req.json().catch(() => null)) as Partial<ServiceProvider> | null;
  if (!body?.name || !body.category || !body.village || !body.phone) {
    return NextResponse.json({ error: "name, category, village and phone are required" }, { status: 400 });
  }

  const input = {
    name: body.name,
    category: body.category,
    village: body.village,
    distanceKm: body.distanceKm ?? 0,
    phone: body.phone,
    available: body.available ?? true,
    verified: body.verified ?? false,
    source: body.source ?? "Village Admin",
  };

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("service_providers")
      .insert(providerToRow(input))
      .select()
      .single();
    if (error || !data) return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
    return NextResponse.json({ provider: mapRowToProvider(data) }, { status: 201 });
  }

  return NextResponse.json({ provider: addProvider(input) }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const body = (await req.json().catch(() => null)) as ({ id: string } & Partial<ServiceProvider>) | null;
  if (!body?.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("service_providers")
      .update(providerToRow(body))
      .eq("id", body.id)
      .select()
      .single();
    if (error || !data) return NextResponse.json({ error: error?.message ?? "update failed" }, { status: 500 });
    return NextResponse.json({ provider: mapRowToProvider(data) });
  }

  const updated = updateProvider(body.id, body);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ provider: updated });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("service_providers").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const ok = removeProvider(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
