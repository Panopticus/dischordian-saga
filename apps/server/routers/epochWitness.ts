/* Epoch Witness Router — tRPC procedures */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { epochWitnessService } from "../services/epochWitnessService";

const editTypeSchema = z.enum(["scrub", "rewrite", "elevate"]);

const activeEditInputSchema = z.object({
  id: z.string().min(1).max(120),
  room: z.string().min(1).max(60).regex(/^[a-z0-9_-]+$/),
  artifact: z.string().min(1).max(60).regex(/^[a-z0-9_-]+$/),
  type: editTypeSchema,
});

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

  /** Full Shadow Tongue state — power, activeEdits map, grandEditActive,
   *  lastUpdated. CorruptibleBio + uncorruption-bench read this. */
  getShadowTongueState: publicProcedure
    .query(async () => {
      return epochWitnessService.getShadowTongueState();
    }),

  /** Record a new ST edit on a room artifact. Server stamps createdAt
   *  with the current wall-clock ms — the engine tick from the server's
   *  perspective. Caller supplies id/room/artifact/type. */
  recordActiveEdit: protectedProcedure
    .input(activeEditInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tickAt = Date.now();
      return epochWitnessService.recordActiveEdit(ctx.user.id, {
        id: input.id,
        room: input.room,
        artifact: input.artifact,
        type: input.type,
        createdAt: tickAt,
        uncorruptedAt: null,
      });
    }),

  /** Clear an active edit (idempotent). Server stamps uncorruptedAt
   *  with current wall-clock ms. */
  clearActiveEdit: protectedProcedure
    .input(z.object({ id: z.string().min(1).max(120) }))
    .mutation(async ({ ctx, input }) => {
      const tickAt = Date.now();
      return epochWitnessService.clearActiveEdit(ctx.user.id, input.id, tickAt);
    }),

  getVotesForEpoch: publicProcedure
    .input(z.object({ epoch: z.string() }))
    .query(async ({ input }) => {
      return epochWitnessService.getAllVotesForEpoch(input.epoch);
    }),
});
