# Progress

H0 = hackathon start. Update this after every meaningful step.

## Done

- Read official PS-02 brief + rubric, condensed into `docs/problem-statement.md`.
- Condensed teammate's GramConnect concept into `docs/idea.md`, scoped to a 3-feature MVP.
- Wrote `CLAUDE.md` with rules, stack, folder structure.

## In progress

- Scaffolding Next.js + Tailwind + shadcn/ui skeleton.

## Next

1. `supabase/schema.sql` + seed data (~15-20 listings, 2-3 villages, clearly labeled as demo data).
2. Shared pipeline (`lib/pipeline/*`): understand -> retrieve -> verify -> respond.
3. `/demo` web chat UI on top of the pipeline (H4-H10 vertical-slice milestone).
4. Deploy skeleton to Vercel.
5. Voice layer (Sarvam ASR + ElevenLabs/Sarvam TTS) per the fallback ladder in `docs/idea.md`.
6. Twilio SMS webhook + web SMS-simulator fallback panel.
7. `/admin` verify/CRUD page.

## Known bugs

_None yet._

## Demo-path status

Not yet built. Target: web chat golden path ("I need a plumber near my village" -> verified answer) working by H10.

## Mocked / labeled-demo data

- Directory listings will be realistic but fictional (e.g. "Ravi Plumbing") — not real businesses. Must stay labeled as demo data in the pitch, never presented as real deployed data.

## Blocked on user

Need API keys (as env vars) for: Anthropic, Sarvam AI, ElevenLabs, Twilio (trial), Supabase project, Vercel project. These require account creation the user must do themselves.
