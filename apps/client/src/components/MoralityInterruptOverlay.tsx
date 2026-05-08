/* ═══════════════════════════════════════════════════════
   MoralityInterruptOverlay — paragon/renegade-style sigil

   Plan §B4. Renders a two-sigil interrupt prompt over the
   current scene with a depleting timer ring. ME2's signature
   QTE; this is a thin presentational layer over the
   useMoralityInterrupt state machine.

   Mount it once per scene; pass the hook's state in. Caller is
   responsible for calling arm() at the right narrative beat
   and for converting the chosen side into game state changes
   (typically applyMoralityChoice on commit).
   ═══════════════════════════════════════════════════════ */

import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Flame } from "lucide-react";
import type { MoralitySide } from "@/hooks/useMoralityInterrupt";

export interface MoralityInterruptOverlayProps {
  isArmed: boolean;
  remainingFraction: number;
  onCommit: (side: MoralitySide) => void;
  /** Optional one-line label per side — replaces the default
   *  "Order" / "Chaos" caption. */
  orderLabel?: string;
  chaosLabel?: string;
}

export default function MoralityInterruptOverlay({
  isArmed,
  remainingFraction,
  onCommit,
  orderLabel = "Order",
  chaosLabel = "Chaos",
}: MoralityInterruptOverlayProps) {
  return (
    <AnimatePresence>
      {isArmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          data-testid="morality-interrupt-overlay"
        >
          <div className="pointer-events-auto flex flex-col items-center gap-6">
            {/* Timer ring */}
            <div className="relative w-28 h-28">
              <svg
                className="absolute inset-0 -rotate-90"
                viewBox="0 0 100 100"
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="color-mix(in oklch, var(--text-primary) 15%, transparent)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - remainingFraction)}`}
                  className="text-primary transition-[stroke-dashoffset] duration-75 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs text-white/60 tracking-widest">
                  COMMIT
                </span>
              </div>
            </div>

            {/* Two-sigil pair */}
            <div className="flex items-center gap-12">
              <button
                type="button"
                onClick={() => onCommit("order")}
                aria-label={`Commit to ${orderLabel}`}
                data-testid="interrupt-order"
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full void-bg-error void-border-error border-2 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                  <Cpu size={28} className="void-text-error" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase void-text-error">
                  {orderLabel}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onCommit("chaos")}
                aria-label={`Commit to ${chaosLabel}`}
                data-testid="interrupt-chaos"
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full void-bg-success void-border-success border-2 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                  <Flame size={28} className="void-text-energy" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase void-text-energy">
                  {chaosLabel}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
