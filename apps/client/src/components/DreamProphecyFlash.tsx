/* ═══════════════════════════════════════════════════════
   DREAM PROPHECY FLASH

   Renders one of Daniel Cross's bookend prophecy lines as a
   monochrome flash before / after a dream-mode slideshow.
   Three-phase animation: fade-in (0.6s) → hold (1.8s) → fade-
   out (0.6s) = 3s total. Calls onDone when the fade-out
   completes so the parent can advance.

   The visual register matches the existing Vision 1-4 caption
   style: black background, monochrome serif text, no chrome.
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";
import { motion } from "framer-motion";
import type { DanielCrossProphecy } from "@shared/danielCrossProphecies";

export interface DreamProphecyFlashProps {
  prophecy: DanielCrossProphecy;
  /** Fired when the flash has finished its fade-out — parent
   *  uses this to advance into the body or close the dream. */
  onDone: () => void;
}

const FADE_IN_MS = 600;
const HOLD_MS = 1800;
const FADE_OUT_MS = 600;
const TOTAL_MS = FADE_IN_MS + HOLD_MS + FADE_OUT_MS;

export default function DreamProphecyFlash({
  prophecy,
  onDone,
}: DreamProphecyFlashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, TOTAL_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: TOTAL_MS / 1000,
        times: [0, FADE_IN_MS / TOTAL_MS, (FADE_IN_MS + HOLD_MS) / TOTAL_MS, 1],
        ease: "linear",
      }}
      className="fixed inset-0 z-[10001] bg-black flex items-center justify-center"
      role="img"
      aria-label="Prophecy of Daniel Cross"
    >
      <div className="text-center px-8 max-w-2xl">
        {prophecy.text.split("\n").map((line, i) => (
          <p
            key={i}
            className="font-display text-xl sm:text-3xl text-white/90 tracking-wide leading-relaxed"
            style={{ fontStyle: "italic" }}
          >
            {line}
          </p>
        ))}
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-6">
          Daniel Cross
        </p>
      </div>
    </motion.div>
  );
}

/** The total run-time of one flash, exported for parent timing. */
export const DREAM_PROPHECY_FLASH_MS = TOTAL_MS;
