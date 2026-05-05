/* ═══════════════════════════════════════════════════════
   ACT 1 OPPONENT TAUNT OVERLAY

   Surfaces the three mid-match opponent taunts from
   act1OpponentDialog.ts during an Act 1 ladder battle.

   The overlay is a pure render surface: callers drive the
   phase transitions through the `phase` prop, which the
   Act1CardLadderPage computes from DuelystGameUI's turn-
   change and HP-change callbacks:

     - early: fires on opponent turn 1
     - mid:   fires on opponent turn 3 (or HP crosses 60%)
     - late:  fires on opponent turn 5 (or HP crosses 30%)

   Each taunt fades in, sits, then fades out automatically
   when the parent advances the phase or clears it. No timer
   logic inside the component — the timer-based fallback
   that used to live here is gone; the DuelystGameUI
   onTurnChange / onBossHpChange contract replaces it.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildOpponentTauntHooks,
  type Act1OpponentDialog,
} from "@shared/act1OpponentDialog";
import { useAct1TauntsVO } from "@/hooks/useAct1TauntsVO";

export type Act1TauntPhase = "early" | "mid" | "late";

export interface Act1OpponentTauntOverlayProps {
  /** Dialog table for the current opponent. Render is a no-op if undefined. */
  dialog?: Act1OpponentDialog;
  /** Display name shown above the taunt body. */
  opponentName: string;
  /**
   * The currently active taunt phase, or null to clear the overlay.
   * Parent computes this from turn-change / HP-change events. When
   * this changes, the overlay cross-fades to the new phase (or
   * clears, if null).
   */
  phase?: Act1TauntPhase | null;
  /**
   * How long each taunt stays visible before auto-clearing. Default
   * 8000 ms. Pass `Infinity` to keep the taunt up until the parent
   * sets `phase` to null.
   */
  holdMs?: number;
}

const DEFAULT_HOLD_MS = 8_000;

export function Act1OpponentTauntOverlay({
  dialog,
  opponentName,
  phase = null,
  holdMs = DEFAULT_HOLD_MS,
}: Act1OpponentTauntOverlayProps) {
  const hooks = useMemo(
    () => (dialog ? buildOpponentTauntHooks(dialog) : null),
    [dialog],
  );
  const [active, setActive] = useState<Act1TauntPhase | null>(null);
  const tauntsVO = useAct1TauntsVO();

  // Follow parent-driven phase changes, then auto-clear after holdMs.
  // If the dialog declares tauntVoIds (audit 2026-05-05 §4.1), also
  // play the matching VO line. Lines whose VO id is missing from the
  // manifest fall back to text-only — useNpcVO logs a warn.
  useEffect(() => {
    if (!hooks) return;
    if (!phase) {
      setActive(null);
      return;
    }
    setActive(phase);
    const lineId = dialog?.tauntVoIds?.[phase];
    if (lineId) tauntsVO.speak(lineId);
    if (!Number.isFinite(holdMs)) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current === phase ? null : current));
    }, holdMs);
    return () => window.clearTimeout(timer);
  }, [hooks, phase, holdMs, dialog, tauntsVO]);

  if (!hooks) return null;
  const text =
    active === "early"
      ? hooks.early.text
      : active === "mid"
        ? hooks.mid.text
        : active === "late"
          ? hooks.late.text
          : null;

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-40 max-w-sm">
      <AnimatePresence>
        {active && text && (
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="rounded-md border border-rose-500/50 bg-stone-950/85 p-3 shadow-lg backdrop-blur"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-rose-300/80">
              {opponentName} · {active}
            </p>
            <p className="mt-1 font-serif italic text-[13px] leading-relaxed text-rose-50">
              "{text}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
