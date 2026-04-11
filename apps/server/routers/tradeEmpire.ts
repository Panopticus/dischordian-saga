/**
 * Trade Empire Router — Mission execution, completion, and reward granting.
 *
 * Bridges the Trade Empire UI (which manages state locally) with
 * server-side persistence and reward integration into the unified economy.
 *
 * State stored in userProgress.gameData.tradeEmpire
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, dreamBalance } from "../../db/schema";
import { eq, and } from "drizzle-orm";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

interface MissionState {
  id: string;
  name: string;
  sectorId: string;
  dispatchedAt: number;
  durationMs: number;
  reward: {
    dream?: number;
    salvage?: number;
    influence?: number;
    voidCrystals?: number;
    xp?: number;
    material?: string;
    materialAmount?: number;
  };
}

interface TradeEmpireState {
  activeMissions: MissionState[];
  completedMissionIds: string[];
  totalMissionsCompleted: number;
  totalDreamEarned: number;
  totalInfluenceEarned: number;
  sectors: Record<string, { controlLevel: number; reputation: number }>;
}

const DEFAULT_STATE: TradeEmpireState = {
  activeMissions: [],
  completedMissionIds: [],
  totalMissionsCompleted: 0,
  totalDreamEarned: 0,
  totalInfluenceEarned: 0,
  sectors: {},
};

async function getEmpireState(userId: number): Promise<TradeEmpireState> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const gameData = row[0]?.gameData as any;
  return gameData?.tradeEmpire ?? DEFAULT_STATE;
}

async function saveEmpireState(userId: number, state: TradeEmpireState) {
  const db = await getDb();
  if (!db) dbUnavailable();
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const existing = row[0]?.gameData as any ?? {};
  await db.update(userProgress)
    .set({ gameData: { ...existing, tradeEmpire: state } })
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")));
}

export const tradeEmpireRouter = router({
  getState: protectedProcedure.query(async ({ ctx }) => {
    const state = await getEmpireState(ctx.user.id);
    // Auto-check for completed missions
    const now = Date.now();
    const completed: MissionState[] = [];
    const stillActive: MissionState[] = [];
    for (const m of state.activeMissions) {
      if (now >= m.dispatchedAt + m.durationMs) {
        completed.push(m);
      } else {
        stillActive.push(m);
      }
    }
    return {
      ...state,
      activeMissions: stillActive,
      pendingCompletions: completed,
    };
  }),

  dispatchMission: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      sectorId: z.string(),
      durationMs: z.number().min(1000),
      reward: z.object({
        dream: z.number().optional(),
        salvage: z.number().optional(),
        influence: z.number().optional(),
        voidCrystals: z.number().optional(),
        xp: z.number().optional(),
        material: z.string().optional(),
        materialAmount: z.number().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);

      // Max 3 concurrent missions
      if (state.activeMissions.length >= 3) {
        return { success: false, error: "Maximum 3 active missions" };
      }

      // Don't allow duplicate mission IDs
      if (state.activeMissions.some(m => m.id === input.id)) {
        return { success: false, error: "Mission already dispatched" };
      }

      state.activeMissions.push({
        id: input.id,
        name: input.name,
        sectorId: input.sectorId,
        dispatchedAt: Date.now(),
        durationMs: input.durationMs,
        reward: input.reward,
      });

      await saveEmpireState(ctx.user.id, state);
      return { success: true, endsAt: Date.now() + input.durationMs };
    }),

  completeMission: protectedProcedure
    .input(z.object({ missionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const idx = state.activeMissions.findIndex(m => m.id === input.missionId);
      if (idx === -1) return { success: false, error: "Mission not found" };

      const mission = state.activeMissions[idx];
      const now = Date.now();
      if (now < mission.dispatchedAt + mission.durationMs) {
        return { success: false, error: "Mission not yet complete" };
      }

      // Remove from active
      state.activeMissions.splice(idx, 1);
      state.completedMissionIds.push(mission.id);
      state.totalMissionsCompleted++;

      // Grant rewards
      const r = mission.reward;
      const db = await getDb();
  if (!db) dbUnavailable();

      // Dream
      if (r.dream && r.dream > 0) {
        state.totalDreamEarned += r.dream;
        const dreamRow = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (dreamRow[0]) {
          await db.update(dreamBalance)
            .set({ dreamTokens: (dreamRow[0].dreamTokens ?? 0) + r.dream })
            .where(eq(dreamBalance.userId, ctx.user.id));
        }
      }

      // Influence
      if (r.influence && r.influence > 0) {
        state.totalInfluenceEarned += r.influence;
      }

      // Materials (add to crafting inventory)
      if (r.material && r.materialAmount) {
        const row = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
          .limit(1);
        const gameData = row[0]?.gameData as any ?? {};
        const materials = gameData.materials ?? {};
        materials[r.material] = (materials[r.material] ?? 0) + r.materialAmount;
        await db.update(userProgress)
          .set({ gameData: { ...gameData, materials } })
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
      }

      // Sector reputation
      const sector = state.sectors[mission.sectorId] ?? { controlLevel: 0, reputation: 0 };
      sector.reputation += 10;
      if (sector.reputation >= 100) {
        sector.controlLevel = Math.min(5, sector.controlLevel + 1);
        sector.reputation -= 100;
      }
      state.sectors[mission.sectorId] = sector;

      await saveEmpireState(ctx.user.id, state);

      return {
        success: true,
        rewards: r,
        sectorReputation: sector.reputation,
        sectorControlLevel: sector.controlLevel,
        totalCompleted: state.totalMissionsCompleted,
      };
    }),

  cancelMission: protectedProcedure
    .input(z.object({ missionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const idx = state.activeMissions.findIndex(m => m.id === input.missionId);
      if (idx === -1) return { success: false, error: "Mission not found" };
      state.activeMissions.splice(idx, 1);
      await saveEmpireState(ctx.user.id, state);
      return { success: true };
    }),
});
