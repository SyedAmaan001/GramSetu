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
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.6], [0.7, 1]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />

        <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col items-center gap-8 px-5 text-center">
          <motion.h1
            style={{ scale: wordmarkScale, opacity: wordmarkOpacity }}
            className="font-display text-[clamp(3.5rem,14vw,9rem)] leading-none font-semibold text-brand drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            GramSetu
          </motion.h1>

          <SplitFlapText
            words={["ENTER SITE", "ASK. VERIFY.", "GO LIVE"]}
            fontSize={20}
            tileColor="#201F1B"
            textColor="#EDE0CE"
            onClick={scrollToMain}
          />

          <div className="w-full max-w-xl text-sm font-medium text-background sm:text-base">
            <ScrollMarquee text={"Ask in your own words. Get a verified, local answer — not a search result.  ·  "} defaultVelocity={1.6} />
            <ScrollMarquee text={"Voice, SMS, or web. No smartphone required.  ·  "} defaultVelocity={-1.6} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
