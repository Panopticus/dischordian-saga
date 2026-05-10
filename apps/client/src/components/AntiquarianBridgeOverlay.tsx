/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN BRIDGE OVERLAY — global between-act journal

   Surfaces the Antiquarian's five between-act journal pages
   (see apps/shared/antiquarianLoredexBridges.ts) as a
   parchment-styled overlay. The first triggered-but-unseen
   entry appears whenever the player advances to a new act.

   Behavior:
     - Reads pending entry via pendingAntiquarianBridge
     - Renders as a parchment scroll card with handwritten
       typography (font-serif italic, sepia palette)
     - "Mark as read" sets the seenFlag — the next pending
       entry (if any) takes the slot on the next paint
   ═══════════════════════════════════════════════════════ */

import { useMemo, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pendingAntiquarianBridge } from "@shared/antiquarianLoredexBridges";
import { useGame } from "@/contexts/GameContext";

export function AntiquarianBridgeOverlay(): ReactElement | null {
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

  const entry = useMemo(() => pendingAntiquarianBridge(flags), [flags]);

  if (!entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={entry.id}
        role="dialog"
        aria-label={`Antiquarian's Loredex entry: ${entry.title}`}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
        data-testid={`antiquarian-bridge-${entry.id}`}
      >
        <div className="relative max-w-2xl rounded-md border border-amber-700/60 bg-amber-950/95 p-8 shadow-2xl">
          <header className="border-b border-amber-700/40 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
              {entry.entryNumber}
            </p>
            <h2 className="mt-1 font-serif text-2xl italic text-amber-100">
              {entry.title}
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/60">
              by the Antiquarian
            </p>
          </header>
          <article className="mt-5 space-y-4 font-serif text-[14px] italic leading-relaxed text-amber-50 whitespace-pre-line">
            {entry.body}
          </article>
          <footer className="mt-6 flex items-center justify-end gap-3 border-t border-amber-700/40 pt-4">
            <button
              type="button"
              onClick={() => setNarrativeFlag(entry.seenFlag, true)}
              className="rounded-md border border-amber-700/60 bg-amber-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-800/60"
              data-testid={`antiquarian-bridge-dismiss-${entry.id}`}
            >
              Mark as read
            </button>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AntiquarianBridgeOverlay;
