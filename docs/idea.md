# GramConnect — idea (condensed)

Full concept doc from the fetcher exists in team chat history; this file is the short, buildable version we actually ship against. When in doubt, this file and `problem-statement.md` win over the long doc.

## One-line pitch

> GramConnect is an agentic last-mile access layer for rural communities: it converts a resident's natural-language request into a verified, location-aware, actionable local service response, delivered over voice or SMS — even with no smartphone or steady internet.

## Killer line

"Don't make villagers learn technology to access services; make technology understand how villagers ask for services."

## The pipeline (what actually gets built)

```
Resident request (text, SMS, or voice)
        -> Understand   (intent, service category, location, language)
        -> Retrieve      (query the verified local directory)
        -> Verify/Rank   (only verified listings; rank by distance + availability)
        -> Respond        (sourced answer, or an honest "couldn't verify")
        -> Deliver        (web chat / voice TTS / SMS reply)
```

This is presented as an "agentic pipeline" for the pitch, but implemented as a straightforward, testable function pipeline — not a multi-agent orchestration framework. Depth over framework theatre.

## Novelty pillars (for the pitch, R1 "Innovation & Originality")

1. **Local-first, not generic** — answers come from a verified village directory, never open-web search.
2. **Verification layer** — every answer carries a source and a verified/unverified status; the system says "I don't know" rather than guessing.
3. **Channel independence** — the same backend answers a web chat, a voice request, and a real SMS message identically.
4. **Multilingual voice** — Kannada + English via Sarvam AI (ASR/translation) + ElevenLabs (TTS), so a resident can just speak.
5. **Action-oriented, not a directory** — output is "here's Ravi Plumbing, 3km, verified, available today, here's the number" — not a list of ten links.

## The one worked scenario we build deeply (per PS's own example)

> "I need a plumber near my village."

End to end: resident asks (text, voice, or SMS) → system extracts {service: plumber, location: resident's village} → looks up the seeded directory → finds verified, available providers near that village → replies with the best match, distance, phone number, and verification source → falls back to an honest "no verified plumber found nearby" if none exist.

## What we are NOT building this hackathon

- Live Twilio Voice phone calls / IVR menus (text-based SMS proves the "low-bandwidth" requirement without live telephony risk)
- Kiosk hardware or kiosk-specific UI
- Offline-first sync/caching
- Multi-village scaling tooling, business model artifacts, pricing
- Admin authentication beyond a shared password
- More than ~15-20 seeded directory listings across 2-3 sample villages

## Fallback ladder (if a dependency misbehaves on demo day)

1. Ideal: live mic → Sarvam Kannada ASR → pipeline → ElevenLabs/Sarvam TTS spoken reply.
2. Fallback A: English-only voice via the browser's built-in speech recognition; Kannada shown as a pre-recorded, clearly labeled sample.
3. Fallback B: cut voice entirely, demo text only (web chat + real SMS) — this alone fully answers the PS's challenge question.

All mocked/simulated data or fallback states used in the live demo must be labeled as such in `PROGRESS.md` — never claimed as real in the pitch.
