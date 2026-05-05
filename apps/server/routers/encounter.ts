/* ═══════════════════════════════════════════════════════
   ENCOUNTER ROUTER

   Player-facing API for the Hierarchy / Malkia / Source-Kael
   encounters. Wraps encounterDispatcher.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  advancePhase,
  chooseBranch,
  currentLines,
  ENCOUNTER_IDS,
  getEncounterStatus,
  openEncounter,
} from "../services/encounterDispatcher";

const encounterIdSchema = z.enum([
  "master_of_rlyeh",
  "pale_emissary",
  "reckoning_daughter",
  "malkia_revolution",
  "source_kael",
]);

export const encounterRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return getEncounterStatus(ctx.user.id);
  }),

  open: protectedProcedure
    .input(z.object({ encounterId: encounterIdSchema }))
    .mutation(async ({ ctx, input }) => {
      return openEncounter(ctx.user.id, input.encounterId);
    }),

  /**
   * Read the line bundle the player should see right now.
   * Returns the lineId / speaker / text / setsFlags for each
   * line; the client renders them in order through the
   * EncounterPlayer modal.
   */
  currentLines: protectedProcedure
    .input(z.object({ encounterId: encounterIdSchema }))
    .query(async ({ ctx, input }) => {
      const lines = await currentLines(ctx.user.id, input.encounterId);
      return lines.map((l) => ({
        lineId: l.lineId,
        speaker: l.speaker,
        text: l.text,
        phase: l.phase,
        setsFlags: l.setsFlags ?? [],
      }));
    }),

  /**
   * Record the player's branch pick. The branch flag must be
   * one of the encounter's setsFlags entries (e.g.
   * 'rlyeh_resolution_purchase' / 'emissary_signed' /
   * 'reckoning_accepted').
   */
  chooseBranch: protectedProcedure
    .input(z.object({
      encounterId: encounterIdSchema,
      branchFlag: z.string().min(1).max(64),
    }))
    .mutation(async ({ ctx, input }) => {
      return chooseBranch(ctx.user.id, input.encounterId, input.branchFlag);
    }),

  advancePhase: protectedProcedure
    .input(z.object({ encounterId: encounterIdSchema }))
    .mutation(async ({ ctx, input }) => {
      return advancePhase(ctx.user.id, input.encounterId);
    }),

  listEncounters: protectedProcedure.query(() => ENCOUNTER_IDS),
});
