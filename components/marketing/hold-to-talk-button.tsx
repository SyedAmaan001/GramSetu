"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export interface HoldToTalkButtonProps {
  listening: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  size?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Built for GramSetu — the inspo doc's "HoldButton" only had a usage
 * example (a fixed-duration hold-to-confirm pattern), not its source.
 * Real speech has no fixed duration, so this is a from-scratch
 * press-and-hold-to-talk control: press down starts listening, release
 * stops it — a walkie-talkie, not a timed confirm button.
 */
export function HoldToTalkButton({ listening, onPressStart, onPressEnd, size = 88, className, disabled }: HoldToTalkButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-pressed={listening}
      aria-label={listening ? "Listening — release to stop" : "Press and hold to speak"}
      className={cn(
        "relative flex touch-none items-center justify-center rounded-full text-primary-foreground select-none",
        "bg-primary shadow-[0_8px_30px_-8px_rgba(149,15,13,0.45)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.94 }}
      animate={listening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={listening ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onPressStart();
      }}
      onPointerUp={onPressEnd}
      onPointerLeave={() => listening && onPressEnd()}
    >
      {listening && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/40"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <Mic className="relative z-10" size={size * 0.36} />
    </motion.button>
  );
}
