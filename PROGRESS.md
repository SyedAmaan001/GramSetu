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
- Built `/admin` console (password-gated: `ADMIN_PASSWORD` env var, defaults to `demo` in local dev only) with full add/verify/toggle-availability/remove CRUD, backed by the same in-memory store (auto-upgrades to Supabase once configured) via `lib/data/directory-store.ts` and `app/api/admin/listings/route.ts`. This is the trust-layer half of MVP feature 3. `npm run build` passes with `/admin` included. **Verified live**: toggling a listing's verified status in `/admin` immediately changes what `/demo` returns for that category/village — the trust layer is real, not decorative.
- Built MVP feature 2 (multilingual voice) using the **browser's built-in speech APIs** (`lib/hooks/use-browser-voice.ts`) — zero API keys, works today. This *is* Fallback A/B from `docs/idea.md`, built first since it needs no external account: a mic button + English/ಕನ್ನಡ toggle on `/demo`, feeding the same `/api/query` pipeline, with the reply spoken back via `speechSynthesis`. Sarvam/ElevenLabs remain a possible upgrade for nicer Kannada quality once those accounts exist, but the MVP no longer depends on them. Confirmed rendering correctly in a real Chromium browser (mic button shows, language toggle works); **not yet tested with a real microphone/speaker** — do that next on a normal machine before the demo.

## In progress

- Nothing actively in progress; next block below is unstarted.

## Next

1. **You**: test the mic button on `/demo` with a real microphone (English first, then Kannada) and confirm `speechSynthesis` actually speaks the reply — this is the one piece I couldn't verify in the sandboxed browser.
2. Deploy skeleton to Vercel (blocked on user's Vercel login — see below).
3. Create the real Supabase project and run `schema.sql` + `seed.sql` (currently running on the in-memory fallback only).
4. Twilio SMS webhook + web SMS-simulator fallback panel (the other half of MVP feature 3).
5. Optional upgrade: swap browser voice for Sarvam ASR/translation + ElevenLabs TTS if those accounts get set up and browser voice quality (especially Kannada) isn't good enough live.

## Known bugs

_None yet._

## Demo-path status

**Core text pipeline is live and working** (web chat only, in-memory data, no voice/SMS yet). This alone already answers the PS's challenge question end-to-end. Not yet demo-rehearsed with `demo-script.md` (that comes at H21-23).

## Mocked / labeled-demo data

- Directory listings will be realistic but fictional (e.g. "Ravi Plumbing") — not real businesses. Must stay labeled as demo data in the pitch, never presented as real deployed data.

## Blocked on user

Need API keys (as env vars, see `.env.example`) for: Anthropic, Sarvam AI, ElevenLabs, Twilio (trial), Supabase project. Also need a Vercel login (`vercel login` / linking the project) to deploy the skeleton. These require account creation/login the user must do themselves — the pipeline runs fine locally without any of them in the meantime.
