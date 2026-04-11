/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS ROUTER — Client-facing API over
   thoughtVirusService.

   Exposes read + mutation endpoints for the virus infection
   system so the client InfectionPanel, residue-item hotspots,
   and cure UI can all call through tRPC.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  loadVirusState,
  recordResidueLog,
  recordResidueQuarantine,
  runPropagationTick,
  runCure,
  addLoad,
} from "../services/thoughtVirusService";
import {
  getVirusSummary,
  getVirusStage,
  VIRUS_STAGES,
  RESIDUE_ITEMS,
  CURES,
  canApplyCure,
  type CureAction,
} from "@shared/thoughtVirus";

const CURE_IDS = [
  "medbay_course",
  "voltari_ritual",
  "companion_sacrifice",
  "source_bargain",
  "antiquarian_purge",
] as const satisfies readonly CureAction[];

export const thoughtVirusRouter = router({
  /** Read-only snapshot for the InfectionPanel / dashboard widget. */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const state = await loadVirusState(ctx.user.id);
    const summary = getVirusSummary(state);
    return {
      state,
      summary,
      availableCures: CURES.filter(c => canApplyCure(c.id, state)).map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        cost: c.cost,
        loadReduction: c.loadReduction,
        moralityDelta: c.moralityDelta,
      })),
    };
  }),

  /** Static data the client needs to render the infection UI. */
  getStaticData: protectedProcedure.query(() => ({
    stages: VIRUS_STAGES,
    residueItems: RESIDUE_ITEMS,
    cures: CURES,
  })),

  /** Record that the player found + logged a residue item in a room scene. */
  logResidue: protectedProcedure
    .input(z.object({ itemId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const { state, delta } = await recordResidueLog(ctx.user.id, input.itemId);
      return { state, delta, stage: getVirusStage(state.load) };
    }),

  /** Record that the player quarantined / destroyed a residue item. */
  quarantineResidue: protectedProcedure
    .input(z.object({ itemId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const { state, delta } = await recordResidueQuarantine(ctx.user.id, input.itemId);
      return { state, delta, stage: getVirusStage(state.load) };
    }),

  /** Run a propagation tick for this player (idempotent — noop if <6h). */
  tick: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await runPropagationTick(ctx.user.id);
    return {
      state: result.state,
      newlyInfectedRooms: result.newlyInfectedRooms,
      loadGained: result.loadGained,
    };
  }),

  /** Apply a cure. Returns false if the cure is illegal at the current stage. */
  applyCure: protectedProcedure
    .input(z.object({ cureId: z.enum(CURE_IDS) }))
    .mutation(async ({ ctx, input }) => {
      const { state, success } = await runCure(ctx.user.id, input.cureId);
      return { state, success, stage: getVirusStage(state.load) };
    }),

  /**
   * Admin / debug endpoint — push a raw load delta. Not exposed in the UI;
   * used by combat systems (fight engine, substrate dungeon) that want to
   * report "the player took virus damage in a way we don't otherwise track".
   */
  addLoad: protectedProcedure
    .input(z.object({
      delta: z.number().int().min(-100).max(100),
      source: z.string().min(1).max(128),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await addLoad(ctx.user.id, input.delta, input.source);
      return { state, stage: getVirusStage(state.load) };
    }),
});
