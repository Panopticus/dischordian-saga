/**
 * Factions router — Phase D10.
 *
 * Public API for the faction allegiance system. Any TCG match-end
 * UI calls `recordMatchResult` with the player's chosen faction
 * and whether they won; the server runs the full pipeline
 * (increment stats → unlock tier cards → send notification).
 *
 * Procedures:
 *   recordMatchResult — fire-and-grant pipeline
 *   getMyAllegiance — full read of the player's per-faction stats
 *   getFactionAllegiance — single-faction read
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  processFactionMatchEnd,
  listFactionStats,
  getFactionStats,
  type AllegianceFaction,
} from "../services/factionAllegianceService";

const factionEnum = z.enum([
  "architect",
  "insurgency",
  "dreamer",
  "new_babylon",
  "antiquarian",
  "thought_virus",
]);

export const factionsRouter = router({
  /** Record a TCG match result and process any allegiance unlocks.
   *  Idempotency: the caller is responsible for firing this once
   *  per real match — the service does not dedupe. */
  recordMatchResult: protectedProcedure
    .input(
      z.object({
        faction: factionEnum,
        won: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const result = await processFactionMatchEnd(db, {
        userId: ctx.user.id,
        faction: input.faction as AllegianceFaction,
        won: input.won,
      });
      return result;
    }),

  /** Full per-faction allegiance read for the gallery UI. Returns
   *  one row per faction the player has played at least once. */
  getMyAllegiance: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    return listFactionStats(db, ctx.user.id);
  }),

  /** Single-faction read — used by the deckbuilder UI to show
   *  "Insurgency: 24 played, 8 won, tier 2 unlocked". */
  getFactionAllegiance: protectedProcedure
    .input(z.object({ faction: factionEnum }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      return getFactionStats(db, ctx.user.id, input.faction as AllegianceFaction);
    }),
});
