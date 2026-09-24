-- GramConnect verified service directory.
-- Run this in the Supabase SQL editor once a project exists.

create table if not exists service_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  village text not null,
  distance_km numeric not null default 0,
  phone text not null,
  available boolean not null default true,
  verified boolean not null default false,
  source text not null default 'Self-registered',
  updated_at timestamptz not null default now()
);

create index if not exists service_providers_category_idx on service_providers (category);
create index if not exists service_providers_village_idx on service_providers (village);

alter table service_providers enable row level security;

-- Public read access (the resident-facing pipeline only ever reads).
create policy "public read" on service_providers
  for select using (true);

-- Writes go through the service-role key from the admin API route only;
-- no public insert/update/delete policy is defined.
