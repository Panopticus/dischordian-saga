/* ═══════════════════════════════════════════════════════
   LOCKE INBOX BRIDGE OVERLAY — global between-act messages

   Surfaces Adjudicator Locke's five between-act inbox messages
   (see apps/shared/lockeInboxBridges.ts) as a cyan-toned
   envelope overlay. The first triggered-but-unseen message
   appears whenever the player advances to a new act.

   Behavior:
     - Reads pending message via pendingLockeInboxBridge
     - Resolves the path/alignment variant body via
       resolveLockeInboxBridgeBody
     - "Mark as read" sets the seenFlag — next pending message
       (if any) takes the slot
   ═══════════════════════════════════════════════════════ */

import { useMemo, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  pendingLockeInboxBridge,
  resolveLockeInboxBridgeBody,
} from "@shared/lockeInboxBridges";
import { useGame } from "@/contexts/GameContext";

export function LockeInboxBridgeOverlay(): ReactElement | null {
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

  const entry = useMemo(() => pendingLockeInboxBridge(flags), [flags]);
  const body = useMemo(
    () => (entry ? resolveLockeInboxBridgeBody(entry, flags) : ""),
    [entry, flags],
  );

  if (!entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={entry.id}
        role="dialog"
        aria-label={`Inbox message from Adjudicator Locke: ${entry.subject}`}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
        data-testid={`locke-bridge-${entry.id}`}
      >
        <div className="relative max-w-2xl rounded-md border border-cyan-500/60 bg-slate-950/95 p-8 shadow-2xl">
          <header className="border-b border-cyan-500/30 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
              Inbox · New Babylon
            </p>
            <h2 className="mt-1 font-display text-2xl text-cyan-100">
              {entry.subject}
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/60">
              from Adjudicator Locke
            </p>
          </header>
          <article className="mt-5 space-y-4 font-serif text-[14px] leading-relaxed text-cyan-50 whitespace-pre-line">
            {body}
          </article>
          <footer className="mt-6 flex items-center justify-end gap-3 border-t border-cyan-500/30 pt-4">
            <button
              type="button"
              onClick={() => setNarrativeFlag(entry.seenFlag, true)}
              className="rounded-md border border-cyan-500/60 bg-cyan-900/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-800/60"
              data-testid={`locke-bridge-dismiss-${entry.id}`}
            >
              Mark as read
            </button>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LockeInboxBridgeOverlay;
