"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplitFlapText } from "@/components/marketing/split-flap-text";
import { ScrollMarquee } from "@/components/marketing/scroll-marquee";

/**
 * Video-plays-then-scroll-reveals-the-wordmark pattern, per the team's
 * inspo doc reference (mont-rural.emblematica.agency).
 */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // Fully legible from the first frame; scroll only adds a gentle zoom.
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.6], [0.92, 1.05]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  function scrollToMain() {
    document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section ref={ref} className="relative h-[145vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/village-hero.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-scrim)_0%,transparent_70%)] opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/40 via-transparent to-background" />

        <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col items-center gap-8 px-5 text-center">
          <motion.div style={{ scale: wordmarkScale }} className="flex flex-col items-center gap-3">
            <h1 className="font-display text-[clamp(4.25rem,17vw,11.5rem)] leading-[0.9] font-bold tracking-tight text-on-media [text-shadow:0_2px_4px_var(--color-scrim),0_8px_40px_var(--color-scrim)]">
              Gram<span className="italic">Setu</span>
            </h1>
            <span aria-hidden className="h-1 w-24 rounded-full bg-brand sm:w-32" />
            <p className="max-w-xs px-2 text-sm font-medium text-on-media sm:max-w-md sm:px-0 [text-shadow:0_1px_12px_var(--color-scrim)] sm:text-lg">
              A bridge between your village and verified help.
            </p>
          </motion.div>

          <SplitFlapText
            words={["ENTER SITE", "ASK. VERIFY.", "GO LIVE"]}
            fontSize={20}
            tileColor="#201F1B"
            textColor="#EDE0CE"
            onClick={scrollToMain}
          />

          <div className="w-full max-w-xl text-sm font-medium text-on-media [text-shadow:0_1px_10px_var(--color-scrim)] sm:text-base">
            <ScrollMarquee text={"Ask in your own words. Get a verified, local answer — not a search result.  ·  "} defaultVelocity={1.6} />
            <ScrollMarquee text={"Voice, SMS, or web. No smartphone required.  ·  "} defaultVelocity={-1.6} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
