"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

export interface CaseStudyFlipItem {
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  background: string;
  foreground?: string;
}

interface CaseStudyFlipStackProps {
  items: CaseStudyFlipItem[];
  className?: string;
  hint?: string;
  heading?: string;
  endLabel?: string;
}

function FlipCard({
  item,
  index,
  total,
  progress,
  reduceMotion,
}: {
  item: CaseStudyFlipItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const segment = 1 / Math.max(total, 1);
  const start = index * segment;
  const end = Math.min(start + segment, 1);
  const entryStart = Math.max(0, start - segment);
  const entryEnd = index === 0 ? 0.0001 : Math.min(start, entryStart + segment * 0.7);
  const exitStart = start;
  const exitEnd = end;
  const stackedCardGap = Math.min(24, 72 / Math.max(total - 1, 1));
  const stackedOffset = index * stackedCardGap;
  const restingOffset = Math.min(index * 12, 34);
  const restingScale = 1 - Math.min(index * 0.012, 0.035);

  const exitYPercent = useTransform(progress, [exitStart, exitEnd], reduceMotion ? [0, 0] : [0, -118]);
  const exitStackOffset = useTransform(progress, [exitStart, exitEnd], reduceMotion ? [0, 0] : [0, stackedOffset]);
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
  const rotateX = useTransform(progress, [exitStart, exitEnd], reduceMotion ? [0, 0] : [0, 22]);
  const opacity = useTransform(progress, [exitStart, exitEnd], reduceMotion ? [1, 0] : [1, 1]);
  const entryScale = useTransform(progress, [entryStart, entryEnd], index === 0 ? [1, 1] : [restingScale, 1]);
  const entryY = useTransform(progress, [entryStart, entryEnd], index === 0 ? [0, 0] : [restingOffset, 0]);

  return (
    <motion.article
      className="absolute inset-x-0 top-0 aspect-[3/4] will-change-transform sm:aspect-[1.76/1]"
      style={{
        y: exitY,
        rotateX,
        opacity,
        zIndex: total - index,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <motion.div
        className="grid h-full overflow-hidden rounded-[clamp(18px,2vw,30px)] shadow-[0_16px_50px_rgba(20,17,10,0.18)] sm:grid-cols-[1.15fr_0.85fr]"
        style={{
          backgroundColor: item.background,
          color: item.foreground ?? "white",
          y: entryY,
          scale: entryScale,
          transformOrigin: "50% 100%",
        }}
      >
        <div className="flex min-w-0 flex-col p-[clamp(24px,3vw,48px)] md:pr-[clamp(22px,3vw,48px)]">
          <span className="text-[clamp(24px,2.5vw,36px)] leading-none font-medium tracking-[-0.06em]">
            {item.number ?? String(index + 1).padStart(2, "0")}
          </span>
          <div className="mt-auto max-w-[46rem] pt-8">
            <p className="mb-[clamp(10px,1.5vw,22px)] text-[10px] font-semibold tracking-[0.16em] uppercase opacity-70 sm:text-xs">
              {item.eyebrow}
            </p>
            <h2 className="max-w-[16ch] text-[clamp(28px,3.25vw,48px)] leading-[0.96] font-semibold tracking-[-0.05em] text-balance">
              {item.title}
            </h2>
            <p className="mt-[clamp(16px,1.8vw,24px)] max-w-[42rem] text-[clamp(13px,1.1vw,16px)] leading-[1.5] opacity-82">
              {item.description}
            </p>
          </div>
        </div>
        <div className="relative m-[clamp(10px,1.2vw,18px)] min-h-[180px] overflow-hidden rounded-[clamp(12px,1.4vw,22px)] sm:ml-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.imageAlt} className="h-full w-full object-cover" loading={index < 2 ? "eager" : "lazy"} draggable={false} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
        </div>
      </motion.div>
    </motion.article>
  );
}

/** Ported from the team's inspo doc ("CaseStudyFlipStack") — used for case studies, right before the footer. */
export function CaseStudyFlipStack({ items, className, hint = "Scroll Down", heading = "Design that delivers.", endLabel = "The End" }: CaseStudyFlipStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const safeItems = items.length > 0 ? items : [];
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.8, restDelta: 0.0005 });
  const cardProgress = reduceMotion ? scrollYProgress : smoothProgress;

  return (
    <div className={cn("relative bg-muted font-sans text-foreground", className)}>
      <section className="relative h-[82vh] min-h-[640px] overflow-hidden px-5 sm:px-10">
        <div className="absolute inset-x-0 top-[clamp(110px,16vh,165px)] flex items-center justify-center gap-[clamp(14px,2.5vw,32px)] text-[clamp(26px,3.5vw,52px)] font-medium tracking-[-0.055em]">
          <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { y: [0, 10, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
            ↓
          </motion.span>
          <span>{hint}</span>
          <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { y: [0, 10, 0] }} transition={{ duration: 1.4, delay: 0.18, repeat: Infinity, ease: "easeInOut" }}>
            ↓
          </motion.span>
        </div>
        <div className="absolute inset-x-5 top-[clamp(330px,43vh,440px)] flex justify-center sm:inset-x-10">
          <h1 className="max-w-[18ch] text-center text-[clamp(42px,5.5vw,82px)] leading-[0.92] font-semibold tracking-[-0.06em] text-brand">{heading}</h1>
        </div>
      </section>

      <div ref={stackRef} className="relative" style={{ height: `${(Math.max(safeItems.length, 1) + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-[clamp(14px,4vw,64px)] py-8">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[860px] [perspective:800px] sm:aspect-[1.76/1]">
            {[...safeItems].reverse().map((item, reverseIndex) => {
              const index = safeItems.length - reverseIndex - 1;
              return <FlipCard key={`${item.title}-${index}`} item={item} index={index} total={safeItems.length} progress={cardProgress} reduceMotion={reduceMotion} />;
            })}
          </div>
        </div>
      </div>

      <section className="flex min-h-[60vh] items-center justify-center px-5 sm:px-10">
        <p className="text-center text-[clamp(40px,7vw,110px)] leading-none font-semibold tracking-[-0.07em] text-foreground">{endLabel}</p>
      </section>
    </div>
  );
}
