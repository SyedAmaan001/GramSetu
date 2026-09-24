# Progress

H0 = hackathon start. Update this after every meaningful step.

## Done

- Read official PS-02 brief + rubric, condensed into `docs/problem-statement.md`.
- Condensed teammate's GramConnect concept into `docs/idea.md`, scoped to a 3-feature MVP.
- Wrote `CLAUDE.md` with rules, stack, folder structure.
- Scaffolded Next.js + Tailwind + shadcn/ui, `git init` + first commit. `npm run build` passes.
- Built the shared pipeline (`lib/pipeline/{understand,retrieve,respond,index}.ts`): works with **zero API keys** via an in-memory seed directory (`lib/data/directory-seed.ts`) and keyword-based intent extraction; automatically upgrades to Claude + Supabase once `ANTHROPIC_API_KEY` / Supabase env vars are set (see `.env.example`).
- `supabase/schema.sql` + `supabase/seed.sql` written (not yet run against a real project — no Supabase project created yet).
- Built `/demo` web chat UI on `/api/query`. **Verified in the browser**: "I need a plumber near my village" returns a real verified match (Ravi Plumbing Works, 3.2km, Village Admin-verified) with ranked alternatives; "I need a lawyer" honestly declines instead of guessing. This is the H4-H10 vertical-slice milestone — done well ahead of schedule.

## In progress

- Nothing actively in progress; next block below is unstarted.

## Next

1. Deploy skeleton to Vercel (blocked on user's Vercel login — see below).
2. Create the real Supabase project and run `schema.sql` + `seed.sql` (currently running on the in-memory fallback only).
3. Voice layer (Sarvam ASR + ElevenLabs/Sarvam TTS) per the fallback ladder in `docs/idea.md`.
4. Twilio SMS webhook + web SMS-simulator fallback panel.
5. `/admin` verify/CRUD page.

## Known bugs

_None yet._

## Demo-path status

**Core text pipeline is live and working** (web chat only, in-memory data, no voice/SMS yet). This alone already answers the PS's challenge question end-to-end. Not yet demo-rehearsed with `demo-script.md` (that comes at H21-23).

## Mocked / labeled-demo data

- Directory listings will be realistic but fictional (e.g. "Ravi Plumbing") — not real businesses. Must stay labeled as demo data in the pitch, never presented as real deployed data.

## Blocked on user

Need API keys (as env vars, see `.env.example`) for: Anthropic, Sarvam AI, ElevenLabs, Twilio (trial), Supabase project. Also need a Vercel login (`vercel login` / linking the project) to deploy the skeleton. These require account creation/login the user must do themselves — the pipeline runs fine locally without any of them in the meantime.
