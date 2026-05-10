/* ═══════════════════════════════════════════════════════
   IRON LION BROADCAST OVERLAY — Cades transmissions

   Surfaces the seven Iron Lion broadcasts from
   apps/shared/ironLionBroadcasts.ts as a red-toned
   transmission overlay. Each broadcast unlocks when the
   paired Cades mission completes (cades_m1_complete .. m7);
   the overlay queues them in canonical order and renders
   the first triggered-but-unread one.

   Mounted globally; triggered by the existing
   cades_m*_complete flags fired by the CADES FPS bridge or
   the M7 placeholder (Act5InterludePage).
   ═══════════════════════════════════════════════════════ */

import { useMemo, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pendingIronLionBroadcast } from "@shared/ironLionBroadcasts";
import { useGame } from "@/contexts/GameContext";

export function IronLionBroadcastOverlay(): ReactElement | null {
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

  const broadcast = useMemo(() => pendingIronLionBroadcast(flags), [flags]);

  if (!broadcast) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={broadcast.id}
        role="dialog"
        aria-label={`Iron Lion broadcast: ${broadcast.title}`}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[68] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
        data-testid={`iron-lion-broadcast-${broadcast.id}`}
      >
        <div className="relative max-w-2xl rounded-md border border-red-700/60 bg-red-950/95 p-8 shadow-2xl">
          <header className="border-b border-red-700/40 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-300/80">
              Cades signal · Veridian VI · M{broadcast.pairedMission}
            </p>
            <h2 className="mt-1 font-display text-2xl text-red-100">
              {broadcast.title}
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/60">
              transmission {broadcast.sequenceIndex} of 7 · Iron Lion
            </p>
          </header>
          <article className="mt-5 font-mono text-[12px] leading-relaxed text-red-50 whitespace-pre-line">
            {broadcast.transcript}
          </article>
          <footer className="mt-6 flex items-center justify-end gap-3 border-t border-red-700/40 pt-4">
            <button
              type="button"
              onClick={() => setNarrativeFlag(broadcast.seenFlag, true)}
              className="rounded-md border border-red-700/60 bg-red-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-red-100 hover:bg-red-800/60"
              data-testid={`iron-lion-broadcast-dismiss-${broadcast.id}`}
            >
              Acknowledge transmission
            </button>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default IronLionBroadcastOverlay;
