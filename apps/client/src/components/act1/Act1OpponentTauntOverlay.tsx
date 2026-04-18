/* ═══════════════════════════════════════════════════════
   ACT 1 OPPONENT TAUNT OVERLAY

   Surfaces the three mid-match opponent taunts from
   act1OpponentDialog.ts during an Act 1 ladder battle.

   This is a timer-based bridge: DuelystGameUI does not yet
   expose a turn-change callback, so taunts reveal on a
   fixed schedule (early ~10s, mid ~45s, late ~90s). When
   the engine grows an onTurnChange / onBossHpChange hook,
   swap the timers out for real triggers — the prop shape
   and render stay the same.

   Positioned fixed to the top-right corner so it does not
   occlude the board. Each taunt fades in, sits for 8s, and
   fades out; the component is passive outside those windows.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildOpponentTauntHooks,
  type Act1OpponentDialog,
} from "@shared/act1OpponentDialog";

export interface Act1OpponentTauntOverlayProps {
  /** Dialog table for the current opponent. Render is a no-op if undefined. */
  dialog?: Act1OpponentDialog;
  /** Display name shown above the taunt body. */
  opponentName: string;
  /**
   * Optional overrides for the reveal timing (ms from mount).
   * Defaults approximate the early/mid/late NarrativeHook triggers.
   */
  earlyMs?: number;
  midMs?: number;
  lateMs?: number;
  /** How long each taunt stays visible before fading. */
  holdMs?: number;
}

type TauntPhase = "early" | "mid" | "late";

const DEFAULT_EARLY_MS = 10_000;
const DEFAULT_MID_MS = 45_000;
const DEFAULT_LATE_MS = 90_000;
const DEFAULT_HOLD_MS = 8_000;

export function Act1OpponentTauntOverlay({
  dialog,
  opponentName,
  earlyMs = DEFAULT_EARLY_MS,
  midMs = DEFAULT_MID_MS,
  lateMs = DEFAULT_LATE_MS,
  holdMs = DEFAULT_HOLD_MS,
}: Act1OpponentTauntOverlayProps) {
  const hooks = useMemo(
    () => (dialog ? buildOpponentTauntHooks(dialog) : null),
    [dialog],
  );
  const [active, setActive] = useState<TauntPhase | null>(null);

  useEffect(() => {
    if (!hooks) return;
    const timers: number[] = [];
    const reveal = (phase: TauntPhase, at: number) => {
      timers.push(
        window.setTimeout(() => setActive(phase), at),
        window.setTimeout(() => {
          setActive((current) => (current === phase ? null : current));
        }, at + holdMs),
      );
    };
    reveal("early", earlyMs);
    reveal("mid", midMs);
    reveal("late", lateMs);
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [hooks, earlyMs, midMs, lateMs, holdMs]);

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
