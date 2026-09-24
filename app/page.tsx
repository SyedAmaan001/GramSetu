import Link from "next/link";
import { SiteNav } from "@/components/marketing/site-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { FlippingWordSwap } from "@/components/marketing/flipping-word-swap";
import { ScrollSplitCard } from "@/components/marketing/scroll-split-card";
import { CaseStudyFlipStack, type CaseStudyFlipItem } from "@/components/marketing/case-study-flip-stack";
import { LiveAskBlock } from "@/components/marketing/live-ask-block";
import { KNOWN_CATEGORIES, KNOWN_VILLAGES } from "@/lib/data/directory-seed";

const TECH_SWAPS = [
  { label: "Turning words into intent", word1: "Understanding", word2: "Claude" },
  { label: "Where verified listings live", word1: "Directory", word2: "Supabase" },
  { label: "Speaking and listening", word1: "Voice", word2: "Sarvam + Browser Speech" },
  { label: "Reaching a resident's phone", word1: "Messages", word2: "Twilio SMS" },
];

const HOW_IT_WORKS_CARDS = [
  {
    title: "Understand",
    description: "A plain-language request — spoken, typed, or texted — is turned into a service category, a village, and a language.",
    bgColor: "#9C4C34",
    textColor: "#FBF3E6",
  },
  {
    title: "Retrieve & Verify",
    description: "We check the local directory for that category and village, and rank verified, available listings first — never a guess.",
    bgColor: "#496D68",
    textColor: "#F6EFE3",
  },
  {
    title: "Respond",
    description: "A sourced, actionable answer goes back over whichever channel the resident used — or an honest \"couldn't verify\" if nothing checks out.",
    bgColor: "#652B1D",
    textColor: "#FBF3E6",
  },
];

const USE_CASES: CaseStudyFlipItem[] = [
  {
    eyebrow: "Rural Services",
    title: "Finding a plumber shouldn't take an afternoon of asking around",
    description: "\"I need a plumber near my village\" — GramSetu checks the verified directory and returns a real, contactable option, or says honestly if there isn't one nearby yet.",
    image: "/images/village-1.jpg",
    imageAlt: "Aerial view of a rural village",
    background: "#9C4C34",
    foreground: "#FBF3E6",
  },
  {
    eyebrow: "Government Access",
    title: "Which office, which day, which form?",
    description: "The same pipeline extends to government service information — residents ask in their own words instead of navigating a notice board.",
    image: "/images/village-3.jpg",
    imageAlt: "Aerial view of village roads and homes",
    background: "#496D68",
    foreground: "#F6EFE3",
  },
  {
    eyebrow: "Utilities & Announcements",
    title: "Is there a water cut today?",
    description: "Local announcements — water supply, power, community notices — become something a resident can just ask about, over SMS or voice.",
    image: "/images/village-4.jpg",
    imageAlt: "Aerial view of village fields and rooftops",
    background: "#652B1D",
    foreground: "#FBF3E6",
  },
];

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
      <HeroSection />

      <section id="solution" className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">Solution</p>
        <h2 className="mt-3 font-display text-3xl italic text-foreground sm:text-5xl">
          One pipeline. Any channel. Always a sourced answer.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          GramSetu converts a plain-language request into a verified, location-aware, actionable local-service
          response — over web chat, voice, or real SMS, even with no smartphone.
        </p>

        <p className="mt-12 text-xs tracking-wide text-muted-foreground uppercase">Hover each row to see the tech behind it</p>
        <div className="mx-auto mt-4 grid max-w-xl gap-4 text-left">
          {TECH_SWAPS.map((swap) => (
            <div
              key={swap.word1}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-4"
            >
              <span className="text-sm text-muted-foreground">{swap.label}</span>
              <FlippingWordSwap
                word1={swap.word1}
                word2={swap.word2}
                className="font-display text-lg text-brand"
                toClassName="text-primary"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="px-5 pt-16 text-center sm:px-8">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">How It Works</p>
        <h2 className="mt-3 font-display text-3xl italic text-foreground sm:text-5xl">Ask. Verify. Connect.</h2>
      </section>
      <ScrollSplitCard imageSrc="/images/village-2.jpg" cards={HOW_IT_WORKS_CARDS} />

      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">Try it</p>
          <h2 className="mt-3 font-display text-3xl italic text-foreground sm:text-5xl">Ask GramSetu something</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Press and hold the mic to speak, or type your request. This hits the same pipeline our SMS and admin
            console use — no separate demo backend.
          </p>
        </div>
        <LiveAskBlock />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo directory covers {KNOWN_CATEGORIES.length} categories across {KNOWN_VILLAGES.join(", ")} — fictional
          listings for this prototype, clearly labeled as such in{" "}
          <Link href="https://github.com/SyedAmaan001/GramSetu" className="underline">
            the repo
          </Link>
          .
        </p>
      </section>

      <section id="use-cases">
        <CaseStudyFlipStack items={USE_CASES} heading="Built for the request behind the search." endLabel="GramSetu" />
      </section>
      </main>

      <footer className="border-t border-border px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <span className="font-display text-xl italic text-brand">GramSetu</span>
          <p className="max-w-md text-sm text-muted-foreground">
            An agentic last-mile access platform for rural communities — PS-02, Track 04 Rural Innovation,
            Innovators Conclave 2026.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/demo" className="text-foreground/80 hover:text-foreground">
              Web demo
            </Link>
            <Link href="/demo/sms" className="text-foreground/80 hover:text-foreground">
              SMS demo
            </Link>
            <Link href="/admin" className="text-foreground/80 hover:text-foreground">
              Admin login
            </Link>
            <Link href="https://github.com/SyedAmaan001/GramSetu" className="text-foreground/80 hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
