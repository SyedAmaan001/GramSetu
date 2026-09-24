"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export interface SplitFlapTextProps {
  words: string[];
  /** Seconds for one character's flip to complete. */
  flipDuration?: number;
  /** Seconds of delay between neighboring tiles starting their flip. */
  stagger?: number;
  /** Milliseconds to hold a settled word before cycling to the next. */
  cycleDelay?: number;
  /** How many random characters flash before a tile lands on its target — the classic departure-board look. */
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number;
  gap?: number;
  fontSize?: number;
  loop?: boolean;
  /** Pad every word to this many characters (default: the longest word). */
  padTo?: number;
  className?: string;
  onClick?: () => void;
}

function Tile({
  targetChar,
  flipDuration,
  flipsPerChar,
  tileColor,
  textColor,
  tileRadius,
  fontSize,
}: {
  targetChar: string;
  flipDuration: number;
  flipsPerChar: number;
  tileColor: string;
  textColor: string;
  tileRadius: number;
  fontSize: number;
}) {
  const [shown, setShown] = useState(targetChar);
  const stepRef = useRef(0);

  useEffect(() => {
    if (shown === targetChar) return;

    const stepMs = (flipDuration * 1000) / Math.max(flipsPerChar, 1);
    stepRef.current = 0;

    const interval = setInterval(() => {
      stepRef.current += 1;
      if (stepRef.current >= flipsPerChar) {
        setShown(targetChar);
        clearInterval(interval);
        return;
      }
      const random = ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
      setShown(random);
    }, stepMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetChar]);

  return (
    <div
      className="relative overflow-hidden [perspective:300px]"
      style={{
        width: fontSize * 0.72,
        height: fontSize * 1.15,
        backgroundColor: tileColor,
        borderRadius: tileRadius,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={shown}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: flipDuration / Math.max(flipsPerChar, 1), ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center font-mono font-bold [backface-visibility:hidden]"
          style={{ color: textColor, fontSize }}
        >
          {shown === " " ? " " : shown}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Built for GramSetu — the inspo doc only had a usage example for this
 * component (airport split-flap display), not its source, so this is a
 * from-scratch implementation matching that reference's behavior.
 * Sits below the hero wordmark; clicking it moves on to the main site.
 */
export function SplitFlapText({
  words,
  flipDuration = 0.5,
  stagger = 0.04,
  cycleDelay = 2400,
  flipsPerChar = 6,
  tileColor,
  textColor,
  tileRadius = 8,
  gap = 6,
  fontSize = 28,
  loop = true,
  padTo,
  className,
  onClick,
}: SplitFlapTextProps) {
  const width = padTo ?? Math.max(...words.map((w) => w.length));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!loop || words.length < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % words.length), cycleDelay + flipDuration * 1000);
    return () => clearTimeout(timer);
  }, [index, loop, words.length, cycleDelay, flipDuration]);

  const target = words[index].toUpperCase().padEnd(width, " ").slice(0, width);
  const resolvedTileColor = tileColor ?? "var(--foreground)";
  const resolvedTextColor = textColor ?? "var(--background)";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]", className)}
      style={{ gap }}
      aria-label={words[index]}
    >
      {target.split("").map((char, i) => (
        <motion.div key={i} style={{ transitionDelay: `${i * stagger}s` }}>
          <Tile
            targetChar={char}
            flipDuration={flipDuration}
            flipsPerChar={flipsPerChar}
            tileColor={resolvedTileColor}
            textColor={resolvedTextColor}
            tileRadius={tileRadius}
            fontSize={fontSize}
          />
        </motion.div>
      ))}
    </button>
  );
}
