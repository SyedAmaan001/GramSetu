import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PILLARS = [
  {
    title: "Local-first, not generic",
    body: "Answers come from a verified village directory, never open-web search.",
  },
  {
    title: "Verification layer",
    body: "Every answer carries a source and a verified/unverified status. If it can't verify something, it says so.",
  },
  {
    title: "Channel independence",
    body: "The same backend pipeline answers a web chat, a spoken request, and a real SMS message identically.",
  },
  {
    title: "Multilingual voice",
    body: "Speak in English or Kannada — no smartphone literacy or typing required.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-8">
      <section className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">PS-02 · GramConnect · Rural Innovation</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">GramConnect</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A last-mile access platform that turns a rural resident&apos;s plain-language request into a
          verified, local, actionable answer — over web chat, voice, or SMS. No smartphone or steady
          internet required.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/demo" className={buttonVariants({ size: "lg" })}>
            Try the live demo
          </Link>
          <Link href="/demo/sms" className={buttonVariants({ size: "lg", variant: "outline" })}>
            See it as SMS
          </Link>
        </div>
      </section>

      <section className="rounded-lg border bg-muted/40 p-6">
        <p className="text-sm text-muted-foreground">A resident asks, in their own words:</p>
        <p className="mt-2 text-xl font-medium">&ldquo;I need a plumber near my village.&rdquo;</p>
        <p className="mt-3 text-sm text-muted-foreground">
          GramConnect finds a verified provider nearby, tells you their distance and availability, gives
          you a phone number to call — and says so honestly if nothing verified exists yet, instead of
          guessing.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What makes this different from a chatbot</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                <CardTitle className="text-base">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Built for Innovators Conclave 2026 · Track 04, Rural Innovation ·{" "}
        <Link href="/admin" className="underline underline-offset-2">
          Village admin console
        </Link>
      </footer>
    </main>
  );
}
