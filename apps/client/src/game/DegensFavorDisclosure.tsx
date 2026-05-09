/* ═══════════════════════════════════════════════════════
   DEGEN'S FAVOR DISCLOSURE — transparency surface

   audit/16 GA8. The Degen's Favor system tracks a hidden
   trust score (0-100) that gates cosmetic + narrative
   unlocks. Pre-audit it was undocumented inside the UI; the
   Vegas pit-boss persona flagged that "any hidden meter that
   adjusts in response to play looks like rigged odds, even
   if it does nothing to the math".

   This component is a one-shot disclosure modal. Surfaces:
   - Auto-open on first casino visit after this lands (gated
     on localStorage key + a server-side narrative flag so
     it persists across devices).
   - On-demand via the help-icon button next to the favor
     display.

   NEVER shown more than once on auto-open per device. The
   server-side flag is best-effort — the localStorage key is
   the canonical "user has seen this" gate.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, X } from "lucide-react";

const STORAGE_KEY = "casino:degen_favor_disclosed:v1";

export function useDegenFavorDisclosure(): {
  open: () => void;
  close: () => void;
  shouldAutoOpen: boolean;
  isOpen: boolean;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShouldAutoOpen(true);
      setIsOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setShouldAutoOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
  }, []);

  const open = useCallback(() => setIsOpen(true), []);

  return { open, close, shouldAutoOpen, isOpen };
}

/** Help-icon button — sits next to the favor display so a
 *  player can re-read the disclosure any time. */
export function DegensFavorHelpButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="What is Degen's Favor?"
      className="void-text-muted hover:void-text-accent transition-colors ml-1.5"
      data-testid="degen-favor-help"
    >
      <Info size={11} />
    </button>
  );
}

export function DegensFavorDisclosure({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          data-testid="degen-favor-disclosure"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-lg w-[92%] mx-4 rounded-xl border void-border bg-gradient-to-b from-purple-950/40 to-black/85 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="void-text-accent" />
                <h2 className="font-display text-base tracking-widest void-text-accent uppercase">
                  Degen&apos;s Favor — Disclosure
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Dismiss"
                className="void-text-muted hover:void-text-accent transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-[12px] text-foreground/85 leading-relaxed">
              <p>
                The Degen tracks a hidden trust score from{" "}
                <span className="void-text-accent">0 to 100</span>. It goes up
                when you play, faster when you bet bigger, fastest when you
                hit jackpots.
              </p>

              <div className="rounded-md border void-border bg-black/40 p-3">
                <p className="font-bold void-text-accent uppercase text-[10px] tracking-widest mb-1.5">
                  What it does NOT do
                </p>
                <p>
                  It does <span className="font-bold">not</span> change your
                  odds. The casino math is the casino math; published house
                  edges (3% — 20%) are what the RNG actually produces. There
                  is no &quot;rubber-band&quot; bonus and no hidden multiplier
                  for liked players.
                </p>
              </div>

              <div className="rounded-md border void-border bg-black/40 p-3">
                <p className="font-bold void-text-accent uppercase text-[10px] tracking-widest mb-1.5">
                  What it DOES do
                </p>
                <p>
                  It unlocks cosmetic chips, table felts, and narrative beats
                  with the Degen NPC. The scaffolding is on the audit roadmap
                  for milestone unlocks at 25 / 50 / 75 / 100. Hitting 100
                  earns the &quot;Equilibrium Touched&quot; achievement.
                </p>
              </div>

              <p className="text-[11px] text-foreground/60 italic">
                Audit transparency commitment: if the math ever changes,
                this disclosure changes with it. The whole point is that
                the meter is honest about what it is.
              </p>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border void-border void-text-accent hover:bg-amber-950/30 transition-colors text-sm font-mono uppercase tracking-wider"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
