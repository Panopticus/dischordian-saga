/**
 * WORLD MOOD ROUTER
 * ──────────────────────────────────────────────────
 * Read-only access to the Four-Horsemen world mood + recent
 * cross-system ripples for the World Tapestry page and the
 * persistent <WorldMoodWidget /> mounted in the chrome.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { worldMoodService } from "../services/worldMoodService";
import { rippleLedgerService } from "../services/rippleLedgerService";

export const worldMoodRouter = router({
  /** Active player's personal world mood. */
  getMine: protectedProcedure.query(async ({ ctx }) => {
    return worldMoodService.forPlayer(ctx.user.id);
  }),

  /** Saga-global world mood (shared across all players). */
  getGlobal: publicProcedure.query(async () => {
    return worldMoodService.global();
  }),

  /**
   * Recent cross-system ripples for the World Tapestry ticker.
   * Defaults to the latest 50 across all players; pass userId to
   * scope to a single player's history.
   */
  recentRipples: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(200).optional(),
          userId: z.number().int().positive().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return rippleLedgerService.recent({
        limit: input?.limit ?? 50,
        userId: input?.userId,
      });
    }),
});
