"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollMarqueeProps {
  text: string;
  defaultVelocity?: number;
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
}

/** Ported from the team's inspo doc ("ScrollBasedVelocity"), slowed down for a tagline. */
function ParallaxText({ children, baseVelocity, className, containerRef }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll(containerRef ? { container: containerRef } : undefined);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-12.5, 0, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap" style={{ width: "100%" }}>
      <motion.div className={cn("flex whitespace-nowrap", className)} style={{ x }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mr-10 block last:mr-10">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollMarquee({ text, defaultVelocity = 2, className, containerRef }: ScrollMarqueeProps) {
  return (
    <section className="relative w-full">
      <ParallaxText baseVelocity={defaultVelocity} className={className} containerRef={containerRef}>
        {text}
      </ParallaxText>
      <ParallaxText baseVelocity={-defaultVelocity} className={className} containerRef={containerRef}>
        {text}
      </ParallaxText>
    </section>
  );
}
