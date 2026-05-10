/* ═══════════════════════════════════════════════════════
   CONVERGENCE SEAT GOODBYE — pre-final-battle walkthrough

   Surfaces the 14-NPC procession from
   apps/shared/convergenceSeatGoodbye.ts as a single overlay
   the player walks through before the Convergence Seat
   battle. Each met NPC speaks one line. Player advances by
   pressing Continue; on the last line, "Take the seat"
   closes the overlay and sets the seen flag so it never
   replays in the same prestige cycle.

   Mounted from Act7CardLadderPage when the player is about
   to face the 4th opponent (the Convergence Seat itself).
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { getConvergenceGoodbyeLines } from "@shared/convergenceSeatGoodbye";

const SEEN_FLAG = "convergence_seat_goodbye_walked";

export interface ConvergenceSeatGoodbyeProps {
  /** Called when the player has heard every met-NPC's line and
   *  pressed "Take the seat". The Act 7 page resumes. */
  onComplete: () => void;
}

export function ConvergenceSeatGoodbye({
  onComplete,
}: ConvergenceSeatGoodbyeProps): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();

  const flags = useMemo(
    () =>
      new Set(
        Object.entries(state.narrativeFlags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [state.narrativeFlags],
  );

  const lines = useMemo(() => getConvergenceGoodbyeLines(flags), [flags]);
  const [idx, setIdx] = useState(0);

  if (flags.has(SEEN_FLAG)) return null;
  if (lines.length === 0) {
    // No met NPCs (edge case — shouldn't happen at Act 7 but guard).
    setNarrativeFlag(SEEN_FLAG, true);
    onComplete();
    return null;
  }

  const isLast = idx >= lines.length - 1;
  const current = lines[idx];

  const handleNext = () => {
    if (isLast) {
      setNarrativeFlag(SEEN_FLAG, true);
      onComplete();
      return;
    }
    setIdx((i) => i + 1);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.npcId}
        role="dialog"
        aria-label={`${current.speakerName} speaks at the Convergence Seat`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
        data-testid="convergence-seat-goodbye"
      >
        <div className="relative max-w-2xl rounded-md border border-stone-500/40 bg-stone-950/95 p-8 shadow-2xl">
          <header className="border-b border-stone-500/30 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
              Convergence Seat · {idx + 1} of {lines.length}
            </p>
            <h2 className="mt-1 font-display text-2xl text-stone-100">
              {current.speakerName}
            </h2>
          </header>
          <p className="mt-6 font-serif text-[16px] italic leading-relaxed text-stone-50">
            {current.line}
          </p>
          <footer className="mt-8 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md border border-stone-400/60 bg-stone-800/60 px-5 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700/60"
              data-testid="convergence-seat-goodbye-next"
            >
              {isLast ? "Take the seat" : "Continue"}
            </button>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConvergenceSeatGoodbye;
