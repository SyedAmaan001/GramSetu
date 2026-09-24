# GramConnect (GramSetu)

24-hour hackathon build. PS-02 "GramConnect", Track 04 Rural Innovation, Innovators Conclave 2026.

## Pitch

A last-mile access platform that turns a rural resident's plain-language request ("I need a plumber near my village") into a verified, local, actionable answer — over web chat, voice, or real SMS. Full details: [docs/idea.md](docs/idea.md). Official brief: [docs/problem-statement.md](docs/problem-statement.md).

## Stack

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, deployed on Vercel. Supabase (Postgres) for the verified directory. Anthropic (Claude) for intent understanding. Sarvam AI for Indic ASR/translation. ElevenLabs for TTS. Twilio for SMS.

## Rules

- **Never build outside the MVP** in [the approved plan](C:\Users\syeda\.claude\plans\c-users-syeda-downloads-all-problem-sta-idempotent-dijkstra.md): (1) verified-answer pipeline, (2) multilingual voice on the web demo, (3) real SMS + admin verification console. If a feature isn't one of these three, it doesn't get built without an explicit scope change.
- Read `/docs` before building anything — `problem-statement.md` and `idea.md` are the source of truth, not the long fetcher doc.
- One shared pipeline (`lib/pipeline/*`) powers all channels (web chat, web voice, SMS). Never duplicate intent/retrieval/verification logic per channel.
- Use design tokens (Tailwind theme / CSS variables), never hard-coded colors.
- Never invent directory data, provider names, or metrics presented as real — seeded/demo data must be labeled as such in PROGRESS.md.
- Every answer the pipeline returns must carry a source/verification status, or say "couldn't verify" — never a confident guess.
- Update `PROGRESS.md` after every meaningful step so a fresh session can resume.

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build
npm run lint      # lint
```

## Folder structure

```
app/                     # Next.js routes
  demo/page.tsx           # live demo: web chat + mic + SMS simulator
  admin/page.tsx          # directory CRUD + verify toggle
  api/query/route.ts       # shared text pipeline endpoint
  api/voice/route.ts        # audio -> ASR -> pipeline -> TTS
  api/sms/route.ts           # Twilio SMS webhook
lib/
  pipeline/                 # understand.ts, retrieve.ts, respond.ts, translate.ts
  clients/                  # anthropic.ts, sarvam.ts, elevenlabs.ts, twilio.ts, supabase.ts
supabase/schema.sql        # service_providers table
docs/                      # problem-statement.md, idea.md
PROGRESS.md, demo-script.md
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
