# GramConnect

**A last-mile access platform that turns a rural resident's plain-language request into a verified, local, actionable answer — over web chat, voice, or SMS.**

Built for **PS-02 "GramConnect"**, Track 04 (Rural Innovation), Innovators Conclave 2026 — a 24-hour hackathon.

> "I need a plumber near my village."
> → GramConnect finds Ravi Plumbing Works, 3.2 km away, verified by the village admin, available today, with a phone number to call. If nothing verified exists nearby, it says so honestly instead of guessing.

## The problem

In rural India, information about local services — plumbers, electricians, government offices, water points, repair workers — is fragmented across notice boards, phone calls and word of mouth. Residents often have no smartphone, patchy connectivity and no reliable way to tell a verified provider from an unverified one. Full brief: [docs/problem-statement.md](docs/problem-statement.md).

## The solution

GramConnect is a single backend pipeline — **understand → retrieve → verify → respond** — exposed over multiple low-barrier channels, so the same verified answer reaches a resident however they can access it:

```
Resident request (web chat / voice / SMS)
        │
        ▼
 1. Understand    — extract service category, village, language from plain language
        │            (Claude when configured, keyword fallback otherwise — never blocks on a missing key)
        ▼
 2. Retrieve       — query the local service directory (Supabase, or an in-memory
        │             seed set when no database is configured yet)
        ▼
 3. Verify & rank  — verified + available listings first, ranked by distance;
        │             never returns a hallucinated or unverified-looking answer
        ▼
 4. Respond         — a sourced, actionable answer ("Ravi Plumbing, 3.2km, verified
        │              by Village Admin, call +91...") or an honest "couldn't verify"
        ▼
 Delivered over: web chat demo · voice (planned) · SMS (planned)
```

One shared pipeline (`lib/pipeline/`) powers every channel — no duplicated logic between web, voice and SMS.

## What's built vs. planned

This is an active 24-hour build; status below is accurate as of the last commit (see [PROGRESS.md](PROGRESS.md) for the live log).

| Feature | Status |
|---|---|
| **1. Verified-answer pipeline** (understand → retrieve → verify → respond) | ✅ Built and browser-tested end-to-end |
| **1a. Web chat demo** (`/demo`) | ✅ Built |
| **3a. Admin verification console** (`/admin`) — add/verify/toggle/remove listings | ✅ Built |
| **2. Multilingual voice** (Sarvam ASR + ElevenLabs/Sarvam TTS, English + Kannada) | ⏳ Planned next |
| **3b. Real SMS channel** (Twilio, live number) + web SMS-simulator fallback | ⏳ Planned next |
| Supabase-backed persistence (currently running on an in-memory fallback) | ⏳ Blocked on a Supabase project being created |
| Deployment (Vercel) | ⏳ Blocked on a Vercel login |

Everything above the line runs today with **zero external API keys** — the pipeline and admin console fall back to an in-memory, clearly-labeled demo directory (`lib/data/directory-seed.ts`) and keyword-based intent parsing until real credentials are supplied, then upgrade automatically. See "What we deliberately did not build" below.

## Try it locally

```bash
npm install
npm run dev
```

- **`/demo`** — the resident-facing web chat. Try: *"I need a plumber near my village"*.
- **`/admin`** — the village admin console. Password: your `ADMIN_PASSWORD` env var, or `demo` in local dev if unset.

No `.env.local` is required to try either page — see [.env.example](.env.example) for what upgrades the pipeline from mock to real (Claude reasoning, a persistent Supabase directory, voice, SMS).

## Tech stack

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, deployed on Vercel · Supabase (Postgres) for the verified directory · Anthropic (Claude) for intent understanding · Sarvam AI for Indic ASR/translation · ElevenLabs for text-to-speech · Twilio for SMS.

## Trust & verification, not a generic chatbot

Every answer the pipeline returns carries a verification status and source (e.g. "Village Admin"), or it says it couldn't verify anything — it never invents a provider. That trust layer is enforced in code (`lib/pipeline/respond.ts`) and is what the [official PS-02 brief](docs/problem-statement.md) explicitly requires: *"Every answer should be traceable to a verified source, and the system must say so when it does not know."*

## What we deliberately did not build

To keep the 24-hour scope honest and demo-safe, this hackathon build does **not** include: live Twilio Voice/IVR phone calls, kiosk hardware, offline-first sync, multi-village scaling tooling, a business model artifact, or admin authentication beyond a shared password. Full reasoning: [docs/idea.md](docs/idea.md).

## Project structure

```
app/
  demo/page.tsx              # resident-facing web chat demo
  admin/page.tsx              # village admin console
  api/query/route.ts           # shared text pipeline endpoint
  api/admin/listings/route.ts   # directory CRUD (Supabase or in-memory)
lib/
  pipeline/                    # understand.ts, retrieve.ts, respond.ts, index.ts
  data/                         # directory-seed.ts (demo data), directory-store.ts (in-memory fallback)
  clients/                      # supabase.ts, map-provider-row.ts
supabase/schema.sql, seed.sql  # Postgres schema + seed for the real directory
docs/problem-statement.md      # condensed official PS-02 brief
docs/idea.md                    # our scoped-down concept and MVP reasoning
PROGRESS.md                     # live build log (done / next / known bugs / demo-path status)
```

## Responsible AI note

Directory listings in this prototype are **fictional demo data** (e.g. "Ravi Plumbing Works"), clearly labeled as such in [PROGRESS.md](PROGRESS.md) and never presented as real deployed data. The system is designed to disclose uncertainty ("couldn't verify") rather than fabricate a confident-sounding answer, and to always attribute a source for verified information. No real resident data is collected or processed in this prototype.
