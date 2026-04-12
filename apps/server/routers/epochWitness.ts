/* Epoch Witness Router — tRPC procedures */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { epochWitnessService } from "../services/epochWitnessService";

export const epochWitnessRouter = router({
  castVote: protectedProcedure
    .input(z.object({ voteId: z.string(), optionChosen: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return epochWitnessService.castVote(ctx.user.id, input.voteId, input.optionChosen);
    }),

  getTally: publicProcedure
    .input(z.object({ voteId: z.string() }))
    .query(async ({ input }) => {
      return epochWitnessService.getTally(input.voteId);
    }),

  getMyProgress: protectedProcedure
    .query(async ({ ctx }) => {
      return epochWitnessService.getPlayerProgress(ctx.user.id);
    }),

  getShadowTonguePower: publicProcedure
    .query(async () => {
      return { power: await epochWitnessService.getShadowTonguePower() };
    }),

  getVotesForEpoch: publicProcedure
    .input(z.object({ epoch: z.string() }))
    .query(async ({ input }) => {
      return epochWitnessService.getAllVotesForEpoch(input.epoch);
    }),
});
