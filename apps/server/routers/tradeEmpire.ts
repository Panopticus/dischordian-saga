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
import { characterSheets, userProgress, dreamBalance } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import type {
  CoverIdentityActivatedEvent,
  CoverIdentityBlownEvent,
  GeneralsDilemmaResolvedEvent,
  OracleFuturePurchasedEvent,
} from "../services/rippleEngine";
import {
  CLASS_SECTOR_ACCESS,
  CLASS_EXCLUSIVE_MISSIONS,
  SPY_COVER_IDENTITIES,
} from "@shared/classTradeAccess";
import type { CharClass } from "@shared/characterCreationImpact";

/** Max trade cycles ahead an Oracle can buy a futures contract. */
const PROBABILITY_FUTURES_WINDOW = 3;

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

      // Thought Virus integration — running the Vox Corridor adds real viral
      // exposure on top of the normal reward, per thoughtVirus.ts lore.
      if (mission.id.startsWith("vox_corridor")) {
        const { addLoad } = await import("../services/thoughtVirusService");
        await addLoad(ctx.user.id, 6, "mission_vox_corridor");
      }

      await saveEmpireState(ctx.user.id, state);

      // Cross-system: feed Dead Man's Circuit "Kinetic Acquisition" side quest
      await ripple.emit("trade_run_complete", { userId: ctx.user.id, missionId: mission.id });

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

  /* ═══════════════════════════════════════════════════════
     POTENTIAL IDENTITY SYSTEM — Class-exclusive Trade Empire
     ═══════════════════════════════════════════════════════ */

  /** Returns the caller's class + the sectors they are allowed to enter. */
  getMyClassAccess: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    const [sheet] = await db
      .select()
      .from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id))
      .limit(1);
    const characterClass = (sheet?.characterClass ?? null) as CharClass | null;
    const sectors = characterClass ? CLASS_SECTOR_ACCESS[characterClass] ?? [] : [];
    const missions = characterClass ? CLASS_EXCLUSIVE_MISSIONS[characterClass] ?? [] : [];
    return { characterClass, sectors, missions };
  }),

  /**
   * Server-side gate check: refuses the unlock if the caller is not the
   * right class (or does not have the unlock flag set).
   */
  unlockClassSector: protectedProcedure
    .input(z.object({ sectorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      const characterClass = (sheet?.characterClass ?? null) as CharClass | null;
      if (!characterClass) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Character sheet not found",
        });
      }
      const allowed = CLASS_SECTOR_ACCESS[characterClass] ?? [];
      if (!allowed.includes(input.sectorId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `${characterClass} cannot access sector ${input.sectorId}`,
        });
      }
      const state = await getEmpireState(ctx.user.id);
      if (!state.completedMissionIds.includes(`unlocked:${input.sectorId}`)) {
        state.completedMissionIds.push(`unlocked:${input.sectorId}`);
        await saveEmpireState(ctx.user.id, state);
      }
      return { success: true, sectorId: input.sectorId, characterClass };
    }),

  /**
   * Oracle-only: purchase a futures contract on a commodity, 1-3 trade
   * cycles ahead of the current market spot.
   */
  purchaseFutures: protectedProcedure
    .input(
      z.object({
        sectorId: z.string(),
        commodity: z.enum(["credits", "materials", "influence", "intelligence"]),
        cyclesAhead: z.number().int().min(1).max(PROBABILITY_FUTURES_WINDOW),
        strikePrice: z.number().int().min(1),
        projectedPrice: z.number().int().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "oracle") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Oracles can trade probability futures.",
        });
      }
      await ripple.emit("oracle_future_purchased", {
        userId: ctx.user.id,
        sectorId: input.sectorId,
        commodity: input.commodity,
        cyclesAhead: input.cyclesAhead,
        projectedPrice: input.projectedPrice,
      } as OracleFuturePurchasedEvent);
      return {
        success: true,
        sectorId: input.sectorId,
        commodity: input.commodity,
        cyclesAhead: input.cyclesAhead,
        strikePrice: input.strikePrice,
        projectedPrice: input.projectedPrice,
      };
    }),

  /** Spy-only: activate a time-boxed cover identity. */
  activateCoverIdentity: protectedProcedure
    .input(
      z.object({
        coverId: z.string(),
        targetFactionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "spy") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Spies can activate cover identities.",
        });
      }
      const cover = SPY_COVER_IDENTITIES.find((c) => c.id === input.coverId);
      if (!cover) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown cover identity: ${input.coverId}`,
        });
      }
      const expiresAt = Date.now() + cover.durationHours * 60 * 60 * 1000;
      const state = await getEmpireState(ctx.user.id);
      (state as TradeEmpireState & { activeCover?: { id: string; target: string; expiresAt: number } }).activeCover = {
        id: cover.id,
        target: input.targetFactionId,
        expiresAt,
      };
      await saveEmpireState(ctx.user.id, state);
      await ripple.emit("cover_identity_activated", {
        userId: ctx.user.id,
        coverId: cover.id,
        targetFactionId: input.targetFactionId,
        expiresAt,
      } as CoverIdentityActivatedEvent);
      return { success: true, coverId: cover.id, expiresAt };
    }),

  /**
   * Rolls a perception check whenever a Spy-in-cover interacts with a
   * faction NPC. On failure, fires `cover_identity_blown` — handlers in
   * rippleEngine apply the -15 Unity Meter penalty and notify the player.
   */
  blowCoverCheck: protectedProcedure
    .input(
      z.object({
        npcPerception: z.number().int().min(0).max(30),
        detectionCheckDifficulty: z.number().int().min(0).max(30),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const activeCover = (state as TradeEmpireState & { activeCover?: { id: string; target: string; expiresAt: number } }).activeCover;
      if (!activeCover) return { triggered: false };
      const roll = Math.floor(Math.random() * 20) + 1 + input.npcPerception;
      if (roll >= input.detectionCheckDifficulty + 10) {
        await ripple.emit("cover_identity_blown", {
          userId: ctx.user.id,
          coverId: activeCover.id,
          targetFactionId: activeCover.target,
          detectedBy: "faction_npc",
        } as CoverIdentityBlownEvent);
        (state as TradeEmpireState & { activeCover?: unknown }).activeCover = undefined;
        await saveEmpireState(ctx.user.id, state);
        return { triggered: true, blown: true };
      }
      return { triggered: true, blown: false };
    }),

  /** Soldier-only: resolve The General's Dilemma. */
  resolveGeneralsDilemma: protectedProcedure
    .input(z.object({ resolution: z.enum(["expose", "protect"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const [sheet] = await db
        .select()
        .from(characterSheets)
        .where(eq(characterSheets.userId, ctx.user.id))
        .limit(1);
      if ((sheet?.characterClass as CharClass | undefined) !== "soldier") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Soldiers can resolve The General's Dilemma.",
        });
      }
      await ripple.emit("generals_dilemma_resolved", {
        userId: ctx.user.id,
        resolution: input.resolution,
      } as GeneralsDilemmaResolvedEvent);
      return { success: true, resolution: input.resolution };
    }),
});
