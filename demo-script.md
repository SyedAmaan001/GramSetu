# GramConnect — demo script

Exact click path for the live pitch, with a fallback for every step. Update this as the build changes; rehearse it at least twice before presenting (H21-23 per the plan).

## Setup before you walk on stage

- [ ] Live URL: **https://gramsetu-delta.vercel.app** — confirm it loads. `npm run dev` (`localhost:3000`) is the fallback if venue wifi is unreliable.
- [ ] Laptop on charger, do-not-disturb on, browser zoom at 100%.
- [ ] Confirm venue wifi works; if not, switch to phone hotspot or run fully local — the pipeline needs no internet once the app is loaded, since it runs on in-memory data by default.
- [ ] Open three tabs in advance: `/` (landing), `/demo`, `/demo/sms`. Keep `/admin` in a fourth tab, logged in, for the trust-layer beat. (Admin password is in the team's shared secrets, not in this file — ask whoever set it up if you don't have it.)
- [ ] If presenting voice: test the mic once in the actual room (ambient noise, mic permissions) before going live.

## The path

1. **Landing page (`/`)** — 15 seconds.
   State the one-liner: "GramConnect turns a plain-language request into a verified local answer, over web, voice, or SMS — no smartphone needed." Point at the four pillars, don't read them aloud.
   *Fallback: if the page fails to load, skip straight to step 2 and say the line instead of showing it.*

2. **Web chat, golden path (`/demo`)** — 30 seconds.
   Type (or click the example chip): **"I need a plumber near my village."**
   Expect: a verified match (Ravi Plumbing Works, ~3.2km, Village Admin-verified), with a phone number and alternatives.
   Narrate: "That's not a search result — it's a specific, sourced, actionable answer."
   *Fallback: if the deployed pipeline errors, switch to the local `npm run dev` tab — same code, same data.*

3. **Honest "I don't know" (`/demo`)** — 15 seconds.
   Type: **"I need a lawyer."**
   Expect: the system declines to guess and lists what it *can* help with.
   Narrate: "It never invents a provider — this is the trust requirement from the brief, enforced in code."
   *Fallback: none needed — this path has no external dependency and cannot fail unless the whole app is down.*

4. **Voice (`/demo`)** — 30 seconds, only if mic-tested in the room beforehand.
   Click **Speak**, say "I need an electrician in Channapatna," let it reply and speak back.
   Toggle to ಕನ್ನಡ and repeat in Kannada if comfortable doing so live.
   *Fallback A: if Kannada recognition is unreliable in the room, stay in English only and mention Kannada support without demoing it live.*
   *Fallback B: if voice fails entirely (mic permission denied, no sound in the room), skip this step and say "voice uses the browser's built-in speech APIs — same pipeline, no extra API keys" while showing the toggle exists.*

5. **SMS view (`/demo/sms`)** — 20 seconds.
   Type the same plumber question into the phone-styled thread.
   Narrate: "This is the exact same backend — the real Twilio number sends this same request in, same answer out." If a live Twilio number is wired up by then, either show a text sent from a real phone here, or say "and here's the same thing over a real SMS number" and switch to a phone if you have one on stage.
   *Fallback: this page has no external dependency (it calls the same `/api/query` route the web chat uses), so it should never fail if step 2 worked. If Twilio itself is being demoed live and misbehaves, drop back to this simulator without missing a beat — don't apologize, just say "and here it is over SMS" and continue.*

6. **Trust layer (`/admin`)** — 20 seconds.
   Show the directory list already loaded (log in beforehand). Toggle a listing's verified status live, then switch back to `/demo` and re-ask the same category — show the answer change.
   Narrate: "This is what makes 'verified' a real claim, not a hard-coded label."
   *Fallback: if you can't re-authenticate live, skip the toggle-and-reask and just narrate what it does over the static listing view.*

7. **Close** — 15 seconds.
   One line: "Everything you saw is live in production right now, running on zero external API keys — the moment we add Sarvam, ElevenLabs, a real Twilio number, and a persistent Supabase directory, this becomes the exact same product with real data behind it." State what's next (Supabase persistence, real voice/SMS providers) honestly as next steps, not as already done.

## If everything breaks

Have a second device (phone) with the `/demo` page already open and a screen recording of a successful run as an absolute last resort. Never present a broken demo as if it's working — say "here's a recording from our last test run" and move on. Judges penalize a demo that doesn't run live far more than they penalize honesty about a hiccup.

## Things to never claim

- Directory listings are fictional demo data — never call them real registered providers.
- Don't claim Sarvam/ElevenLabs/Twilio/Supabase are wired in production unless they actually are by demo time (check PROGRESS.md).
- Don't claim the confidence score / verification badge is proof — it's the system's best available signal, and the pitch should say so if asked.
