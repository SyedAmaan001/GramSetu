"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ServiceProvider } from "@/lib/pipeline/types";

const emptyForm = { name: "", category: "", village: "", distanceKm: "", phone: "" };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [source, setSource] = useState<"supabase" | "in-memory" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  async function authorizedFetch(input: string, init: RequestInit = {}) {
    return fetch(input, {
      ...init,
      headers: { ...init.headers, "x-admin-password": password, "Content-Type": "application/json" },
    });
  }

  async function loadProviders() {
    const res = await authorizedFetch("/api/admin/listings");
    if (res.status === 401) {
      setAuthorized(false);
      setAuthError("Wrong password.");
      return;
    }
    const data = await res.json();
    setProviders(data.providers ?? []);
    setSource(data.source ?? null);
    setAuthorized(true);
    setAuthError("");
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    await loadProviders();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || !form.village || !form.phone) return;
    setBusy(true);
    try {
      await authorizedFetch("/api/admin/listings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          distanceKm: Number(form.distanceKm) || 0,
          available: true,
          verified: false,
          source: "Village Admin",
        }),
      });
      setForm(emptyForm);
      await loadProviders();
    } finally {
      setBusy(false);
    }
  }

  async function toggle(p: ServiceProvider, field: "verified" | "available") {
    setBusy(true);
    try {
      await authorizedFetch("/api/admin/listings", {
        method: "PATCH",
        body: JSON.stringify({ id: p.id, [field]: !p[field] }),
      });
      await loadProviders();
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: ServiceProvider) {
    setBusy(true);
    try {
      await authorizedFetch(`/api/admin/listings?id=${p.id}`, { method: "DELETE" });
      await loadProviders();
    } finally {
      setBusy(false);
    }
  }

  if (!authorized) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-4 p-4">
        <h1 className="text-xl font-semibold">GramConnect admin</h1>
        <p className="text-sm text-muted-foreground">
          Village admin console for verifying and managing local service listings.
        </p>
        <form onSubmit={handleUnlock} className="flex flex-col gap-2">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Unlock</Button>
          {authError && <p className="text-sm text-destructive">{authError}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">GramConnect admin</h1>
        <p className="text-sm text-muted-foreground">
          Add, verify and manage the local service directory. Source: {source ?? "unknown"}
          {source === "in-memory" && " (no Supabase configured yet — changes reset on server restart)"}.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Village" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
            <Input placeholder="Distance (km)" value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit" disabled={busy} className="col-span-2 sm:col-span-5">
              Add listing (unverified until confirmed)
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          {providers.length === 0 && <p className="text-sm text-muted-foreground">No listings yet.</p>}
          {providers.map((p) => (
            <div key={p.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {p.name} <span className="text-muted-foreground">· {p.category}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.village} · {p.distanceKm} km · {p.phone} · source: {p.source}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={p.verified ? "default" : "secondary"}
                    className="cursor-pointer"
                    render={<button type="button" aria-label={`Toggle verified status for ${p.name}`} />}
                    onClick={() => toggle(p, "verified")}
                  >
                    {p.verified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge
                    variant={p.available ? "default" : "outline"}
                    className="cursor-pointer"
                    render={<button type="button" aria-label={`Toggle availability for ${p.name}`} />}
                    onClick={() => toggle(p, "available")}
                  >
                    {p.available ? "Available" : "Unavailable"}
                  </Badge>
                  <Button size="sm" variant="destructive" disabled={busy} onClick={() => remove(p)}>
                    Remove
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
