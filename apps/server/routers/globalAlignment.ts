/* ═══════════════════════════════════════════════════════
   GLOBAL ALIGNMENT ROUTER — NARRATIVE_ARCHITECTURE.md §0

   Reader endpoint for the community-wide Light/Dark meter.
   The aggregate is recomputed hourly by the cron in
   apps/server/_core/index.ts via
   apps/server/services/globalAlignmentService.ts; this
   router just exposes the seeded singleton row to clients.

   Public on purpose — the meter is a community surface. No
   per-user state crosses this endpoint.
   ═══════════════════════════════════════════════════════ */

import { publicProcedure, router } from "../_core/trpc";
import { getGlobalAlignment } from "../services/globalAlignmentService";

/** Shape returned to the client. Mirrors the DB row plus a stable
 *  `available` flag so a DB-down render can show a friendly
 *  placeholder rather than crashing the meter component. */
export interface GlobalAlignmentReadout {
  available: boolean;
  lightTotal: number;
  darkTotal: number;
  playerCount: number;
  phase: "light_dominant" | "balanced" | "dark_dominant";
  computedAt: number | null;
}

export const globalAlignmentRouter = router({
  /**
   * Returns the most recently aggregated Light/Dark totals,
   * derived phase, and timestamp of the last recompute. Safe for
   * unauthenticated callers — the meter is a global community
   * surface.
   */
  get: publicProcedure.query(async (): Promise<GlobalAlignmentReadout> => {
    const row = await getGlobalAlignment();
    if (!row) {
      return {
        available: false,
        lightTotal: 0,
        darkTotal: 0,
        playerCount: 0,
        phase: "balanced",
        computedAt: null,
      };
    }
    return {
      available: true,
      lightTotal: row.lightTotal,
      darkTotal: row.darkTotal,
      playerCount: row.playerCount,
      phase: row.phase,
      computedAt: row.computedAt.getTime(),
    };
  }),
});
