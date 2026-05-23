/* ═══════════════════════════════════════════════════════
   PREPARATION MISSIONS ROUTER — Nexus Trial loyalty arc
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 (November)

   Player-facing endpoints for the five Preparation Missions:
     - list:       read player state + mission catalog
     - start:      mark a mission in_progress
     - complete:   apply evaluation, persist new state

   audit-allow-proc: list start complete submit
   (The client consumers land in Sprints 6 & 8 alongside the
   individual mission UIs; the server-side contract stands up
   first so the mission gameplay code can author against a
   stable router. Removing this waiver becomes a Sprint 8 task.)

   All protected — preparation is per-player; anonymous
   callers shouldn't be able to advance someone else's
   ladder. Per-IP rate limits come from the Express gateway.

   Sprints 6 & 8 wire individual mission gameplay; this
   router accepts whatever MissionEvaluation each mission's
   implementation produces.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  completeMission,
  listMissionsForPlayer,
  startMission,
  submitMission,
  type MissionSubmission,
} from "../services/preparationMissionService";
import { REVERSE_TRIAL_PHASES } from "@shared/preparationMissions/missions/reverseTrial";
import { BIDDING_WAR_FACTIONS } from "@shared/preparationMissions/missions/biddingWar";

const missionEvaluationSchema = z.object({
  passed: z.boolean(),
  reason: z.string().min(1).max(280),
  rewards: z
    .object({
      witnessHandSize: z.number().int().min(0).max(10).optional(),
      filedBuff: z.boolean().optional(),
      elaraConfessionVisibility: z.boolean().optional(),
      humanConfessionWeight: z.number().min(0.5).max(3.0).optional(),
      factionMultipliers: z.record(z.string(), z.number().min(0.5).max(3.0)).optional(),
      recoveredBurntCardIds: z.array(z.string().max(64)).max(20).optional(),
      pledgedCardIds: z.array(z.string().max(64)).max(60).optional(),
    })
    .optional(),
  penalties: z
    .object({
      witnessHandSize: z.number().int().min(0).max(10).optional(),
      filedBuff: z.boolean().optional(),
      elaraConfessionVisibility: z.boolean().optional(),
      humanConfessionWeight: z.number().min(0.5).max(3.0).optional(),
      factionMultipliers: z.record(z.string(), z.number().min(0.5).max(3.0)).optional(),
    })
    .optional(),
});

export const preparationMissionsRouter = router({
  /** Returns the player's current preparation state alongside the
   *  static mission catalog. One request renders the full ladder. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return listMissionsForPlayer(ctx.user.id);
  }),

  /** Mark a mission in_progress for this player. Rejected if the
   *  mission's prerequisites aren't met or if it's already resolved. */
  start: protectedProcedure
    .input(z.object({ missionId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      return startMission(ctx.user.id, input.missionId);
    }),

  /** Apply a mission evaluation. Gameplay surfaces (Sprints 6 & 8)
   *  produce the evaluation; the service applies the patch and
   *  persists. Single-attempt rule: a passed/failed mission can't be
   *  re-attempted. */
  complete: protectedProcedure
    .input(
      z.object({
        missionId: z.string().min(1).max(64),
        evaluation: missionEvaluationSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return completeMission(ctx.user.id, input.missionId, input.evaluation);
    }),

  /** Submit a mission's gameplay data. The server scores the
   *  submission and applies the resulting evaluation — clients
   *  cannot claim `passed: true` without supplying real submission
   *  data. Sprint 6 ships scorers for `salvage` and `reverse_trial`. */
  submit: protectedProcedure
    .input(
      z.discriminatedUnion("missionId", [
        z.object({
          missionId: z.literal("salvage"),
          payload: z.object({
            drafted: z.array(z.string().min(1).max(64)).length(5),
            recovered: z.array(z.string().min(1).max(64)).max(5),
          }),
        }),
        z.object({
          missionId: z.literal("reverse_trial"),
          payload: z.object({
            outcomes: z
              .array(
                z.object({
                  phase: z.enum(REVERSE_TRIAL_PHASES),
                  won: z.boolean(),
                  verdictDelta: z.number(),
                }),
              )
              .length(REVERSE_TRIAL_PHASES.length),
          }),
        }),
        z.object({
          missionId: z.literal("tribunal_elara"),
          payload: z.object({
            verdictDelta: z.number(),
            romanceGateUnlocked: z.boolean(),
            romancePhaseCompleted: z.boolean().optional(),
          }),
        }),
        z.object({
          missionId: z.literal("the_question"),
          payload: z.object({
            verdictDelta: z.number(),
            turnsPlayed: z.number().int().min(0).max(20),
          }),
        }),
        z.object({
          missionId: z.literal("bidding_war"),
          payload: z.object({
            pledges: z
              .array(
                z.object({
                  subHouseId: z.string().min(1).max(64),
                  cardIds: z.array(z.string().min(1).max(64)).max(3),
                  faction: z.enum(BIDDING_WAR_FACTIONS),
                  alignment: z.enum(["aligned", "neutral", "hostile"]),
                }),
              )
              .max(72),
          }),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      return submitMission(ctx.user.id, input as MissionSubmission);
    }),
});
