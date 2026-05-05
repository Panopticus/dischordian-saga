/* ═══════════════════════════════════════════════════════
   ROMANCE ROUTER

   Player-facing API for the five romance ladders. Wraps
   romanceLadderService:

     - getStatus()                  list of all candidates'
                                    current stage + advancement
                                    eligibility
     - advance(npcId)               advance one stage if gates
                                    are met; returns the new
                                    stage's scene line-ids for
                                    the client to play
     - commitExclusivity(npcId)     stage-3 commitment beat;
                                    force-ends other exclusive
                                    romances and writes the
                                    sticky committed flag
     - end(npcId)                   end a single romance
                                    (player-initiated breakup)
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  advanceRomanceStage,
  commitExclusivity,
  endRomance,
  getRomanceStatus,
} from "../services/romanceLadderService";
import { ROMANCE_NPC_IDS } from "../../shared/romanceLadders";

const npcIdSchema = z.enum([
  "locke",
  "vex",
  "elara",
  "dmc_companion",
  "jericho_jones",
]);

export const romanceRouter = router({
  /**
   * Read the romance status for every candidate. Read-only.
   * Drives the romance status widget on the companion ask
   * wheel.
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return getRomanceStatus(ctx.user.id);
  }),

  /**
   * Try to advance the named romance by one stage. Idempotent
   * if already at or past the target. On success the response
   * includes the scene's line-ids the client should play
   * through the existing toast pipeline.
   */
  advance: protectedProcedure
    .input(z.object({ npcId: npcIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const result = await advanceRomanceStage(ctx.user.id, input.npcId);
      return {
        ok: result.ok,
        newStage: result.newStage ?? null,
        sceneLineIds: result.scene?.map((s) => s.lineId) ?? [],
        blocked: result.blocked ?? null,
      };
    }),

  /**
   * Commit at stage 3+. Force-ends every other exclusive
   * romance the player is currently in. Writes the sticky
   * committed flag and the ended flag for the broken-off
   * partners. Idempotent.
   */
  commitExclusivity: protectedProcedure
    .input(z.object({ npcId: npcIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const result = await commitExclusivity(ctx.user.id, input.npcId);
      return {
        ok: result.ok,
        endedNpcIds: result.endedNpcIds,
        blocked: result.blocked ?? null,
      };
    }),

  /**
   * End a single romance. Player-initiated breakup. Sets the
   * ended sticky flag the post-romance reactivity ('the one I
   * lost') reads.
   */
  end: protectedProcedure
    .input(z.object({ npcId: npcIdSchema }))
    .mutation(async ({ ctx, input }) => {
      return endRomance(ctx.user.id, input.npcId);
    }),

  /**
   * Coverage check helper — returns the canonical NpcId list
   * the client iterates for the status widget. Useful in tests
   * and for the UI that wants to render even ladders with no
   * row in the DB yet.
   */
  listCandidates: protectedProcedure.query(() => {
    return ROMANCE_NPC_IDS;
  }),
});
