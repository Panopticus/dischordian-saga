/* ═══════════════════════════════════════════════════════
   BONUS OBJECTIVES ROUTER

   Thin tRPC wrapper around apps/shared/bonusObjectives.ts.
   Exposes the 2-hour refresh cycle to clients plus the
   Appendix A.3 narrator_callback delivery channel.

   Per §A.3: after daily quests are complete, the refresh
   cycle becomes the channel for companion callback
   objectives. This router returns BOTH the standard pool
   AND a narrator_callback objective whenever the player
   has at least one narrator still active.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  generateBonusObjectives,
  generateNarratorCallbackObjective,
  getCurrentRefreshSlot,
  getTimeUntilRefresh,
  REFRESH_INTERVAL_MS,
  type BonusObjective,
} from "@shared/bonusObjectives";

export const bonusObjectivesRouter = router({
  /**
   * Returns the player's current bonus objectives for the
   * active 2-hour refresh slot. Includes an Appendix A.3
   * narrator_callback objective whenever the caller passes
   * `hasActiveNarrator: true` — the server has no way to
   * introspect the client's active-companion flag directly,
   * so the caller supplies it.
   */
  list: protectedProcedure
    .input(
      z
        .object({
          /** If true, a narrator_callback objective is included. */
          hasActiveNarrator: z.boolean().optional(),
          /** Averaged daily-quest reward for scaling. */
          dailyQuestRewardAvg: z.number().int().positive().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      const now = new Date();
      const slot = getCurrentRefreshSlot(now);
      const base: BonusObjective[] = generateBonusObjectives(
        ctx.user.id,
        slot,
        input?.dailyQuestRewardAvg ?? 100,
      );

      // §A.3 — when narrators are active, append a
      // narrator_callback objective from the dedicated pool.
      const callback = input?.hasActiveNarrator
        ? generateNarratorCallbackObjective(ctx.user.id, slot)
        : null;

      const objectives = callback ? [...base, callback] : base;

      return {
        objectives,
        refreshSlot: slot,
        refreshIntervalMs: REFRESH_INTERVAL_MS,
        msUntilNextRefresh: getTimeUntilRefresh(now),
      };
    }),
});
