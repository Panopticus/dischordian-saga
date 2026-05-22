/* ═══════════════════════════════════════════════════════
   THREE CLOCKS WARNING — pre-match ambient indicator

   docs/design/NEXUS_TRIAL_PLAN.md → Three Clocks Panel UI

   A one-line ambient strip that renders only when any of
   the three clocks is in *critical* state. Suitable for
   mounting above any pre-match / loadout / lobby surface
   where the panel itself would be too much.

   Critical conditions (mirrors the plan):
     - Vortex     vortex_advance phase
     - Necromancer manifesting / returned phase
     - Politician seatStatus === "open" (post-Trial worst case)

   If none of the above fires, the component renders null.
   ═══════════════════════════════════════════════════════ */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import type { ThreeClocksState } from "@shared/threeClocks/state";

interface CriticalSignal {
  /** Stable id for the strip's `data-signal` attribute. */
  id: "vortex" | "necromancer" | "politician";
  /** Diegetic one-line copy from the plan. */
  text: string;
  /** Token controlling the strip's accent color. */
  token: string;
}

/** Resolve every critical signal that is currently firing. The order
 *  is stable across renders so the strip's left-to-right order is
 *  deterministic. */
export function criticalSignals(state: ThreeClocksState): CriticalSignal[] {
  const signals: CriticalSignal[] = [];
  if (state.vortex.phase === "vortex_advance") {
    signals.push({
      id: "vortex",
      text: "The drum is here.",
      token: "void-text-error",
    });
  }
  if (
    state.necromancer.phase === "manifesting" ||
    state.necromancer.phase === "returned"
  ) {
    signals.push({
      id: "necromancer",
      text: "He is at the gate.",
      token: "void-text-premium",
    });
  }
  if (state.politician.seatStatus === "open") {
    signals.push({
      id: "politician",
      text: "Her seat is open.",
      token: "void-text-system",
    });
  }
  return signals;
}

/** Pure render — exposed for tests so callers can render against a
 *  known state without standing up a tRPC client. Returns null when
 *  no clock is critical, matching the live panel's behaviour. */
export function ThreeClocksWarningView({
  state,
}: {
  state: ThreeClocksState;
}) {
  const reduceMotion = useReducedMotion();
  const signals = criticalSignals(state);

  return (
    <AnimatePresence initial={false}>
      {signals.length > 0 && (
        <motion.aside
          key="three-clocks-warning"
          data-component="three-clocks-warning"
          data-signal-count={signals.length}
          className="void-radius-sm void-border border void-bg-sunk px-3 py-2 font-mono flex items-center gap-3 text-[10px] tracking-[0.2em]"
          role="status"
          aria-live="polite"
          aria-label="Three Clocks critical warning"
          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
        >
          {signals.map((sig, i) => (
            <span
              key={sig.id}
              data-signal={sig.id}
              className={`flex items-center ${sig.token}`}
            >
              {i > 0 && (
                <span className="void-text-muted mr-3" aria-hidden="true">
                  ·
                </span>
              )}
              {sig.text}
            </span>
          ))}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function ThreeClocksWarning() {
  const query = trpc.threeClocks.get.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 60_000,
    retry: 1,
  });
  if (!query.data) return null;
  return <ThreeClocksWarningView state={query.data} />;
}
