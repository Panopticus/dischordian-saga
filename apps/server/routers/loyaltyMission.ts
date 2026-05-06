/* ═══════════════════════════════════════════════════════
   LOYALTY MISSION ROUTER — per-companion arc surfacing

   Plan §B2. Surfaces the active stage of each companion's
   loyalty mission to the client by reading the player's
   narrative-flag bag + bond level and resolving against
   the pure helpers in apps/shared/loyaltyMissions.ts.

   Stage advancement is performed by setting the stage's
   completionFlag through the existing setNarrativeFlag
   pipeline — this router only READS state, plus exposes a
   markStageComplete mutation that pushes the flag through
   the canonical writer so narrativeFlagAudit / cross-game
   ledger / story-mode systems all see it.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  LOYALTY_MISSIONS,
  activeStage,
  getLoyaltyMission,
  isLoyaltyComplete,
  stageStatus,
  type LoyaltyMission,
} from "../../shared/loyaltyMissions";
import type { CompanionRosterId } from "../../shared/companionRoomRegistry";

const companionSchema = z.enum([
  "elara",
  "the_human",
  "the_antiquarian",
  "adjudicator_locke",
  "vex_solene",
  "jericho_jones",
  "agent_zero",
  "shadow_tongue",
  "the_source",
]);

interface ResolutionContext {
  flags: Record<string, boolean | undefined>;
  bondLevel: number;
}

async function loadContext(userId: number): Promise<{
  raw: Record<string, unknown>;
  flags: Record<string, boolean | undefined>;
  bonds: Record<string, number>;
}> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  }
  const row = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const raw = (row[0]?.gameData ?? {}) as Record<string, unknown>;
  const flags = ((raw.narrativeFlags ?? {}) as Record<string, boolean | undefined>);
  // Companion bonds are stored under several keys in gameData. The
  // canonical surface is `companionRelationships`; older saves used
  // per-NPC scalars (elaraTrust / humanTrust / npcTrust). Read both
  // and prefer the more-recent.
  const bonds: Record<string, number> = {};
  const rels = raw.companionRelationships as Record<string, number> | undefined;
  if (rels) Object.assign(bonds, rels);
  if (typeof raw.elaraTrust === "number") bonds.elara = bonds.elara ?? (raw.elaraTrust as number);
  if (typeof raw.humanTrust === "number") bonds.the_human = bonds.the_human ?? (raw.humanTrust as number);
  return { raw, flags, bonds };
}

function summarise(mission: LoyaltyMission, ctx: ResolutionContext) {
  return {
    companionId: mission.companionId,
    title: mission.title,
    introLine: mission.introLine ?? null,
    isComplete: isLoyaltyComplete(mission.companionId, ctx.flags),
    activeStage: activeStage(mission, ctx),
    stages: mission.stages.map((stage) => ({
      ...stage,
      status: stageStatus(stage, ctx),
    })),
  };
}

export const loyaltyMissionRouter = router({
  /** All loyalty missions with stage-status snapshots for the player. */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { flags, bonds } = await loadContext(ctx.user.id);
    return LOYALTY_MISSIONS.map((mission) => {
      const bondLevel = bonds[mission.companionId] ?? 0;
      return summarise(mission, { flags, bondLevel });
    });
  }),

  /** Single mission by companion id. */
  get: protectedProcedure
    .input(z.object({ companionId: companionSchema }))
    .query(async ({ ctx, input }) => {
      const mission = getLoyaltyMission(input.companionId as CompanionRosterId);
      if (!mission) return null;
      const { flags, bonds } = await loadContext(ctx.user.id);
      const bondLevel = bonds[mission.companionId] ?? 0;
      return summarise(mission, { flags, bondLevel });
    }),

  /** Mark a stage complete by writing its completionFlag to
   *  narrativeFlags. The mutation refuses to write if the stage
   *  is currently locked (prereqs unmet). */
  markStageComplete: protectedProcedure
    .input(z.object({ companionId: companionSchema, stageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const mission = getLoyaltyMission(input.companionId as CompanionRosterId);
      if (!mission) return { ok: false, error: "Unknown companion" };
      const stage = mission.stages.find((s) => s.id === input.stageId);
      if (!stage) return { ok: false, error: "Unknown stage" };

      const { raw, flags, bonds } = await loadContext(ctx.user.id);
      const bondLevel = bonds[mission.companionId] ?? 0;
      const status = stageStatus(stage, { flags, bondLevel });
      if (status === "locked") {
        return { ok: false, error: "Stage is locked — prereqs unmet" };
      }
      if (status === "complete") {
        return { ok: true, alreadyComplete: true };
      }

      flags[stage.completionFlag] = true;
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }
      await db
        .update(userProgress)
        .set({ gameData: { ...raw, narrativeFlags: flags } })
        .where(eq(userProgress.userId, ctx.user.id));
      return { ok: true, completionFlag: stage.completionFlag };
    }),
});
