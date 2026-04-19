/* ═══════════════════════════════════════════════════════
   ACT N OPPONENT TAUNT OVERLAY

   Generalized sibling of Act1OpponentTauntOverlay. Takes
   the canonical OpponentTauntHooks shape from
   actOpponentTaunts.ts and renders the three-phase mid-
   match taunts for ANY act's opponent (1, 3, 4, 6, 7).

   The Act 1 overlay remains for consumers that already
   hold an Act1OpponentDialog and want to skip the adapter
   hop. New consumers (Act 3 Substrate gates, Act 4 path
   battles, Act 6 confession matches, Act 7 finale) use
   this component.

   Phase contract is identical to the Act 1 overlay:
     - early: turn 1 (or parent-computed equivalent)
     - mid:   turn 3 / HP crosses 60%
     - late:  turn 5 / HP crosses 30%

   Accent colour is driven by `sourceAct` — Act 1 and Act 3
   use the default rose/substrate palette; Act 4 shifts to
   cyan (Elara-led); Act 6 goes warmer; Act 7 is neutral
   so the dual-narration frame reads correctly.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { OpponentTauntHooks } from "@shared/actOpponentTaunts";

export type ActNTauntPhase = "early" | "mid" | "late";

export interface ActNOpponentTauntOverlayProps {
  /** Canonical hooks. Render is a no-op if undefined. */
  hooks?: OpponentTauntHooks;
  /** Display name shown above the taunt body. */
  opponentName: string;
  /** Currently active phase; null clears. */
  phase?: ActNTauntPhase | null;
  /** How long each taunt stays visible (ms). Infinity = parent-controlled. */
  holdMs?: number;
}

const DEFAULT_HOLD_MS = 8_000;

type Accent = { border: string; mono: string; text: string };

const ACCENT_BY_ACT: Record<OpponentTauntHooks["sourceAct"], Accent> = {
  1: {
    border: "border-rose-500/50",
    mono: "text-rose-300/80",
    text: "text-rose-50",
  },
  3: {
    border: "border-purple-500/50",
    mono: "text-purple-300/80",
    text: "text-purple-50",
  },
  4: {
    border: "border-cyan-500/50",
    mono: "text-cyan-300/80",
    text: "text-cyan-50",
  },
  6: {
    border: "border-amber-500/50",
    mono: "text-amber-300/80",
    text: "text-amber-50",
  },
  7: {
    border: "border-stone-400/50",
    mono: "text-stone-300/80",
    text: "text-stone-50",
  },
};

export function ActNOpponentTauntOverlay({
  hooks,
  opponentName,
  phase = null,
  holdMs = DEFAULT_HOLD_MS,
}: ActNOpponentTauntOverlayProps) {
  const [active, setActive] = useState<ActNTauntPhase | null>(null);

  useEffect(() => {
    if (!hooks) return;
    if (!phase) {
      setActive(null);
      return;
    }
    setActive(phase);
    if (!Number.isFinite(holdMs)) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current === phase ? null : current));
    }, holdMs);
    return () => window.clearTimeout(timer);
  }, [hooks, phase, holdMs]);

  if (!hooks) return null;
  const accent = ACCENT_BY_ACT[hooks.sourceAct];
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
            className={`rounded-md border ${accent.border} bg-stone-950/85 p-3 shadow-lg backdrop-blur`}
          >
            <p
              className={`font-mono text-[9px] uppercase tracking-[0.25em] ${accent.mono}`}
            >
              {opponentName} · Act {hooks.sourceAct} · {active}
            </p>
            <p
              className={`mt-1 font-serif italic text-[13px] leading-relaxed ${accent.text}`}
            >
              "{text}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
