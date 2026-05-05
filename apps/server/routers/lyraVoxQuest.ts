/* ═══════════════════════════════════════════════════════
   LYRA VOX QUEST ROUTER

   Player-facing API for the 5-step investigation (item 11).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

import { protectedProcedure, router } from "../_core/trpc";
import {
  getStatus,
  pickPrompt,
  LYRA_VOX_STEPS,
} from "../services/lyraVoxQuestService";
import type { LyraVoxStepId } from "../../shared/lyraVoxQuestline";

const stepIdSchema = z.enum([
  "file",
  "lab",
  "testimony",
  "confrontation",
  "inscription",
]);

export const lyraVoxQuestRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return getStatus(ctx.user.id);
  }),

  pickPrompt: protectedProcedure
    .input(z.object({
      stepId: stepIdSchema,
      promptId: z.string().min(1).max(64),
    }))
    .mutation(async ({ ctx, input }) => {
      return pickPrompt({
        userId: ctx.user.id,
        stepId: input.stepId as LyraVoxStepId,
        promptId: input.promptId,
      });
    }),

  /**
   * Read-only access to the canonical step registry — gives
   * the client the prompt list per step without having to
   * import the shared module directly.
   */
  listSteps: protectedProcedure.query(() => {
    return LYRA_VOX_STEPS.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      prompts: s.prompts.map((p) => ({
        id: p.id,
        label: p.label,
        body: p.body,
      })),
      earliestAct: s.earliestAct,
    }));
  }),
});
