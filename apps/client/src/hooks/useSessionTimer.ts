/* ═══════════════════════════════════════════════════════
   useSessionTimer — casino session-length harm reduction

   audit/16 GA5. Tracks elapsed time + cumulative wagered for
   the player's current casino session. At pre-defined
   thresholds (2h, 4h, 6h after >=500D wagered), dispatches a
   "casino-session-interrupt" CustomEvent that
   SessionInterruptModal listens for. Each threshold fires at
   most once per session.

   Pure helper `shouldFireSessionInterrupt(...)` is exported
   for unit tests so the threshold logic can be exercised
   without React.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";

const HOUR_MS = 60 * 60 * 1000;
const HOUR_2_MS = 2 * HOUR_MS;
const HOUR_4_MS = 4 * HOUR_MS;
const HOUR_6_MS = 6 * HOUR_MS;

/** Min wagered Dream before the 2h interrupt fires — gates short
 *  visits where the player is just window-shopping. */
const MIN_WAGERED_FOR_2H = 500;

export type SessionInterruptHours = 2 | 4 | 6;

/**
 * Pure threshold helper. Returns the most-recent unfired hour
 * threshold the player has crossed, or null if no interrupt
 * should fire right now.
 *
 * Behaviour:
 * - elapsed >= 6h, lastFired < 6 → 6 (always)
 * - elapsed >= 4h, lastFired < 4 → 4 (always)
 * - elapsed >= 2h, lastFired < 2, wagered >= 500 → 2 (gated)
 * - else → null
 *
 * Each higher threshold supersedes lower ones in the same call;
 * the modal will only fire for the strictest unfired bound.
 */
export function shouldFireSessionInterrupt(
  elapsedMs: number,
  wageredD: number,
  lastFiredHours: 0 | 2 | 4 | 6,
): SessionInterruptHours | null {
  if (elapsedMs >= HOUR_6_MS && lastFiredHours < 6) return 6;
  if (elapsedMs >= HOUR_4_MS && lastFiredHours < 4) return 4;
  if (
    elapsedMs >= HOUR_2_MS &&
    lastFiredHours < 2 &&
    wageredD >= MIN_WAGERED_FOR_2H
  ) {
    return 2;
  }
  return null;
}

/**
 * React hook. Mount on DegensCasinoPage; reads the live
 * `totalWagered` (or `dailyWagered`) from CasinoState and ticks
 * once per minute. Dispatches the session-interrupt CustomEvent
 * when a threshold crosses.
 */
export function useSessionTimer(wageredD: number): void {
  const startMs = useRef(Date.now());
  const lastFired = useRef<0 | 2 | 4 | 6>(0);

  useEffect(() => {
    const tick = () => {
      const elapsedMs = Date.now() - startMs.current;
      const fire = shouldFireSessionInterrupt(elapsedMs, wageredD, lastFired.current);
      if (fire) {
        lastFired.current = fire;
        window.dispatchEvent(
          new CustomEvent("casino-session-interrupt", { detail: { hours: fire } }),
        );
      }
    };
    // Tick immediately on mount + then once per minute.
    tick();
    const handle = window.setInterval(tick, 60_000);
    return () => window.clearInterval(handle);
  }, [wageredD]);
}
