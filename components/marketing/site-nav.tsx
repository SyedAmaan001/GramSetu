"use client";

import Link from "next/link";

const LINKS = [
  { href: "#solution", label: "Solution" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#use-cases", label: "Use Cases" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-display text-xl italic text-brand">
          GramSetu
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-foreground/80 sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>
        <Link
          href="/admin"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent-hover"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
