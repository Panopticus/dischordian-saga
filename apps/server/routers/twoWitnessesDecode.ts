/* ═══════════════════════════════════════════════════════
   TWO WITNESSES DECODE ROUTER

   Player-facing API for the decode quest (item 10).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  getStaticKeyHints,
  listFragments,
  submitKey,
} from "../services/twoWitnessesDecodeService";
import type { DecodeFragmentId } from "../../shared/twoWitnessesDecode";

const fragmentIdSchema = z.enum([
  "fragment_1_call",
  "fragment_2_witness",
  "fragment_3_continuity",
  "fragment_4_recurrence",
  "fragment_5_signature",
]);

export const twoWitnessesDecodeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listFragments(ctx.user.id);
  }),

  submitKey: protectedProcedure
    .input(z.object({
      fragmentId: fragmentIdSchema,
      submittedKey: z.union([z.string(), z.number()]),
    }))
    .mutation(async ({ ctx, input }) => {
      return submitKey({
        userId: ctx.user.id,
        fragmentId: input.fragmentId as DecodeFragmentId,
        submittedKey: input.submittedKey,
      });
    }),

  /**
   * Static-key hints for fragments 1 and 2 — the cycle phase
   * and day-count mod 7. Lets the UI fill the placeholder
   * automatically rather than requiring the player to look up
   * the dischordia panel manually.
   */
  staticHints: protectedProcedure.query(() => {
    return getStaticKeyHints();
  }),
});
