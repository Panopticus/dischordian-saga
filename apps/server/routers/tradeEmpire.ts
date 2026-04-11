/**
 * Trade Empire Router — Mission execution, completion, and reward granting.
 *
 * Bridges the Trade Empire UI (which manages state locally) with
 * server-side persistence and reward integration into the unified economy.
 *
 * Also hosts the Act 3 faction arc resolution state machine and the
 * diplomacy minigame results (see WITNESSING_NARRATIVE_PROPOSAL §7-§8).
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

/** Kept in sync with client `Act3FactionId` in tradeEmpire.ts. */
type Act3FactionIdServer =
  | "new_babylon" | "hierarchy" | "insurgency"
  | "thought_virus" | "artificial_empire" | "antiquarian";

type FactionArcPathServer = "conquest" | "diplomacy" | "infiltration";
type FactionArcStatusServer = "locked" | "available" | "in_progress" | "resolved" | "failed";

const ACT3_FACTION_IDS_SERVER: Act3FactionIdServer[] = [
  "new_babylon", "hierarchy", "insurgency",
  "thought_virus", "artificial_empire", "antiquarian",
];

interface ServerFactionArc {
  factionId: Act3FactionIdServer;
  status: FactionArcStatusServer;
  chosenPath: FactionArcPathServer | null;
  stageIndex: number;
  completedStages: string[];
  resolvedAt: number | null;
}

interface ServerAct3State {
  arcs: Record<Act3FactionIdServer, ServerFactionArc>;
  discoveredFragments: string[];
  eyesTransmissionSeen: boolean;
  watcherOriginSeen: boolean;
  collectorBossFought: boolean;
  collectorBossWon: boolean;
  act3Ending: "eyes_shadow" | "iron_path" | "council" | null;
}

interface DiplomacyResult {
  tableId: string;
  factionId: Act3FactionIdServer;
  wordsSpent: number;
  success: boolean;
  completedAt: number;
}

interface SectorBookmark { sectorId: string; label: string; }
interface TradeRouteRecord { id: string; name: string; sectorIds: string[]; crewId?: string; runCount: number; createdAt: number; }
interface SectorEventRecord { id: string; sectorId: string; label: string; detail: string; timestamp: number; tone: "light" | "dark" | "neutral"; }

interface TradeEmpireState {
  activeMissions: MissionState[];
  completedMissionIds: string[];
  totalMissionsCompleted: number;
  totalDreamEarned: number;
  totalInfluenceEarned: number;
  sectors: Record<string, { controlLevel: number; reputation: number }>;
  act3?: ServerAct3State;
  diplomacyResults?: DiplomacyResult[];
  bookmarks?: SectorBookmark[];
  tradeRoutes?: TradeRouteRecord[];
  eventLog?: SectorEventRecord[];
}

function createInitialAct3(): ServerAct3State {
  const arcs: Partial<Record<Act3FactionIdServer, ServerFactionArc>> = {};
  for (const fId of ACT3_FACTION_IDS_SERVER) {
    arcs[fId] = {
      factionId: fId, status: "locked", chosenPath: null,
      stageIndex: 0, completedStages: [], resolvedAt: null,
    };
  }
  return {
    arcs: arcs as Record<Act3FactionIdServer, ServerFactionArc>,
    discoveredFragments: [],
    eyesTransmissionSeen: false,
    watcherOriginSeen: false,
    collectorBossFought: false,
    collectorBossWon: false,
    act3Ending: null,
  };
}

function ensureAct3(state: TradeEmpireState): ServerAct3State {
  if (!state.act3) state.act3 = createInitialAct3();
  // Backfill any missing arcs (forward-compat)
  for (const fId of ACT3_FACTION_IDS_SERVER) {
    if (!state.act3.arcs[fId]) {
      state.act3.arcs[fId] = {
        factionId: fId, status: "locked", chosenPath: null,
        stageIndex: 0, completedStages: [], resolvedAt: null,
      };
    }
  }
  return state.act3;
}

function countResolvedArcs(act3: ServerAct3State): number {
  return Object.values(act3.arcs).filter(a => a.status === "resolved").length;
}

function countPaths(act3: ServerAct3State): Record<FactionArcPathServer, number> {
  const counts: Record<FactionArcPathServer, number> = { conquest: 0, diplomacy: 0, infiltration: 0 };
  for (const arc of Object.values(act3.arcs)) {
    if (arc.status === "resolved" && arc.chosenPath) counts[arc.chosenPath]++;
  }
  return counts;
}

function computeEnding(act3: ServerAct3State): "eyes_shadow" | "iron_path" | "council" | null {
  const counts = countPaths(act3);
  if (counts.infiltration >= 3) return "eyes_shadow";
  if (counts.conquest >= 3) return "iron_path";
  if (counts.diplomacy >= 3) return "council";
  return null;
}

const DEFAULT_STATE: TradeEmpireState = {
  activeMissions: [],
  completedMissionIds: [],
  totalMissionsCompleted: 0,
  totalDreamEarned: 0,
  totalInfluenceEarned: 0,
  sectors: {},
  act3: createInitialAct3(),
  diplomacyResults: [],
  bookmarks: [],
  tradeRoutes: [],
  eventLog: [],
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

  /* ═══════════════════════════════════════════════════
     ACT 3 — FACTION ARC RESOLUTION (§7.3)
     Non-linear. Pick any order. Resolve 5 of 6 to complete Act 3.
     ═══════════════════════════════════════════════════ */

  getAct3State: protectedProcedure.query(async ({ ctx }) => {
    const state = await getEmpireState(ctx.user.id);
    const act3 = ensureAct3(state);
    const paths = countPaths(act3);
    return {
      ...act3,
      resolvedCount: countResolvedArcs(act3),
      pathCounts: paths,
      eligibleEnding: computeEnding(act3),
      act3Complete: countResolvedArcs(act3) >= 5,
    };
  }),

  /** Unlock Act 3 — triggered once the opening Eyes transmission has been seen. */
  beginAct3: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await getEmpireState(ctx.user.id);
    const act3 = ensureAct3(state);
    act3.eyesTransmissionSeen = true;
    for (const arc of Object.values(act3.arcs)) {
      if (arc.status === "locked") arc.status = "available";
    }
    await saveEmpireState(ctx.user.id, state);
    return { success: true, act3 };
  }),

  /** Player chooses a path on a faction arc. One-way commitment. */
  chooseFactionPath: protectedProcedure
    .input(z.object({
      factionId: z.enum([
        "new_babylon", "hierarchy", "insurgency",
        "thought_virus", "artificial_empire", "antiquarian",
      ]),
      path: z.enum(["conquest", "diplomacy", "infiltration"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const act3 = ensureAct3(state);
      const arc = act3.arcs[input.factionId];
      if (!arc) return { success: false, error: "Unknown faction" };
      if (arc.status === "locked") return { success: false, error: "Act 3 not yet unlocked — watch the Eyes transmission first" };
      if (arc.status === "resolved") return { success: false, error: "Arc already resolved" };
      // Spec: Terminus diplomacy is impossible; mark it failed immediately.
      if (input.factionId === "thought_virus" && input.path === "diplomacy") {
        arc.chosenPath = "diplomacy";
        arc.status = "failed";
        arc.stageIndex = 1;
        arc.completedStages = ["tv_d_0"];
        await saveEmpireState(ctx.user.id, state);
        return {
          success: true,
          arc,
          note: "You attempted to negotiate with the Source. He interrupted your first sentence with a card battle. Some enemies cannot be bargained with.",
          impossible: true,
        };
      }
      // Spec: Antiquarian conquest is impossible.
      if (input.factionId === "antiquarian" && input.path === "conquest") {
        arc.chosenPath = "conquest";
        arc.status = "failed";
        arc.stageIndex = 1;
        arc.completedStages = ["an_c_0"];
        await saveEmpireState(ctx.user.id, state);
        return {
          success: true,
          arc,
          note: "You cannot siege a pocket universe. The Antiquarian wasn't there when you arrived.",
          impossible: true,
        };
      }
      arc.chosenPath = input.path;
      arc.status = "in_progress";
      arc.stageIndex = 0;
      arc.completedStages = [];
      await saveEmpireState(ctx.user.id, state);
      return { success: true, arc };
    }),

  /** Complete one stage of the current faction arc path. */
  completeFactionStage: protectedProcedure
    .input(z.object({
      factionId: z.enum([
        "new_babylon", "hierarchy", "insurgency",
        "thought_virus", "artificial_empire", "antiquarian",
      ]),
      stageId: z.string(),
      /** Total stages on the chosen path — used to detect completion without duplicating client defs. */
      totalStages: z.number().min(1).max(10),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const act3 = ensureAct3(state);
      const arc = act3.arcs[input.factionId];
      if (!arc) return { success: false, error: "Unknown faction" };
      if (arc.status !== "in_progress") return { success: false, error: "Arc is not in progress" };
      if (!arc.completedStages.includes(input.stageId)) arc.completedStages.push(input.stageId);
      arc.stageIndex = arc.completedStages.length;
      const justResolved = arc.completedStages.length >= input.totalStages;
      if (justResolved) {
        arc.status = "resolved";
        arc.resolvedAt = Date.now();
      }
      // Recompute ending eligibility
      act3.act3Ending = computeEnding(act3);
      await saveEmpireState(ctx.user.id, state);
      return {
        success: true,
        arc,
        justResolved,
        resolvedCount: countResolvedArcs(act3),
        eligibleEnding: act3.act3Ending,
        act3Complete: countResolvedArcs(act3) >= 5,
      };
    }),

  /* ═══════════════════════════════════════════════════
     DIPLOMACY MINIGAME — "THE TABLE" (§8.1 #2)
     ═══════════════════════════════════════════════════ */

  recordDiplomacyResult: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      factionId: z.enum([
        "new_babylon", "hierarchy", "insurgency",
        "thought_virus", "artificial_empire", "antiquarian",
      ]),
      wordsSpent: z.number().min(0),
      success: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      if (!state.diplomacyResults) state.diplomacyResults = [];
      state.diplomacyResults.push({
        tableId: input.tableId,
        factionId: input.factionId,
        wordsSpent: input.wordsSpent,
        success: input.success,
        completedAt: Date.now(),
      });
      // Ensure Act 3 state exists so downstream reads are stable.
      ensureAct3(state);
      // Reputation swing: +15 success, -10 fail
      const sector = state.sectors[input.factionId] ?? { controlLevel: 0, reputation: 0 };
      sector.reputation += input.success ? 15 : -10;
      state.sectors[input.factionId] = sector;
      await saveEmpireState(ctx.user.id, state);
      return { success: true, totalMatches: state.diplomacyResults.length };
    }),

  /* ═══════════════════════════════════════════════════
     EYES ARC — LORE FRAGMENTS (§7.4)
     ═══════════════════════════════════════════════════ */

  discoverLoreFragment: protectedProcedure
    .input(z.object({ fragmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const act3 = ensureAct3(state);
      if (!act3.discoveredFragments.includes(input.fragmentId)) {
        act3.discoveredFragments.push(input.fragmentId);
      }
      await saveEmpireState(ctx.user.id, state);
      return {
        success: true,
        discoveredFragments: act3.discoveredFragments,
        total: act3.discoveredFragments.length,
      };
    }),

  markWatcherOriginSeen: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await getEmpireState(ctx.user.id);
    const act3 = ensureAct3(state);
    act3.watcherOriginSeen = true;
    await saveEmpireState(ctx.user.id, state);
    return { success: true };
  }),

  /* ═══════════════════════════════════════════════════
     COLLECTOR BOSS (§7.6)
     ═══════════════════════════════════════════════════ */

  recordCollectorBoss: protectedProcedure
    .input(z.object({ won: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const act3 = ensureAct3(state);
      act3.collectorBossFought = true;
      act3.collectorBossWon = input.won;
      if (input.won) {
        // Win: +500 Light Energy (stored in totalInfluenceEarned as a narrative proxy)
        state.totalInfluenceEarned += 500;
      }
      await saveEmpireState(ctx.user.id, state);
      return { success: true, won: input.won };
    }),

  /* ═══════════════════════════════════════════════════
     ACT 3 ENDING SELECTION (§7.7)
     ═══════════════════════════════════════════════════ */

  chooseAct3Ending: protectedProcedure
    .input(z.object({ ending: z.enum(["eyes_shadow", "iron_path", "council"]) }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const act3 = ensureAct3(state);
      if (countResolvedArcs(act3) < 5) {
        return { success: false, error: "Act 3 requires 5 resolved faction arcs" };
      }
      const eligible = computeEnding(act3);
      if (eligible !== input.ending) {
        return { success: false, error: `That ending is not eligible. Current eligible ending: ${eligible ?? "none (no path has 3 resolutions)"}` };
      }
      act3.act3Ending = input.ending;
      await saveEmpireState(ctx.user.id, state);
      return { success: true, ending: input.ending };
    }),

  /* ═══════════════════════════════════════════════════
     §8.2 QUICK-WINS — bookmarks, routes, event log
     ═══════════════════════════════════════════════════ */

  setBookmarks: protectedProcedure
    .input(z.object({ bookmarks: z.array(z.object({ sectorId: z.string(), label: z.string() })).max(5) }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      state.bookmarks = input.bookmarks;
      await saveEmpireState(ctx.user.id, state);
      return { success: true };
    }),

  saveTradeRoute: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(60),
      sectorIds: z.array(z.string()).min(2).max(10),
      crewId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      if (!state.tradeRoutes) state.tradeRoutes = [];
      const route: TradeRouteRecord = {
        id: `route_${Date.now()}`,
        name: input.name,
        sectorIds: input.sectorIds,
        crewId: input.crewId,
        runCount: 0,
        createdAt: Date.now(),
      };
      state.tradeRoutes.push(route);
      await saveEmpireState(ctx.user.id, state);
      return { success: true, route };
    }),

  runTradeRoute: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      const route = state.tradeRoutes?.find(r => r.id === input.routeId);
      if (!route) return { success: false, error: "Route not found" };
      route.runCount += 1;
      await saveEmpireState(ctx.user.id, state);
      return { success: true, runCount: route.runCount };
    }),

  deleteTradeRoute: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      state.tradeRoutes = (state.tradeRoutes ?? []).filter(r => r.id !== input.routeId);
      await saveEmpireState(ctx.user.id, state);
      return { success: true };
    }),

  logSectorEvent: protectedProcedure
    .input(z.object({
      sectorId: z.string(),
      label: z.string().min(1).max(100),
      detail: z.string().min(1).max(600),
      tone: z.enum(["light", "dark", "neutral"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const state = await getEmpireState(ctx.user.id);
      if (!state.eventLog) state.eventLog = [];
      const entry: SectorEventRecord = {
        id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        sectorId: input.sectorId,
        label: input.label,
        detail: input.detail,
        timestamp: Date.now(),
        tone: input.tone,
      };
      state.eventLog.unshift(entry);
      // Cap at 50 most-recent events to bound payload.
      if (state.eventLog.length > 50) state.eventLog = state.eventLog.slice(0, 50);
      await saveEmpireState(ctx.user.id, state);
      return { success: true, entry };
    }),

  getEventLog: protectedProcedure.query(async ({ ctx }) => {
    const state = await getEmpireState(ctx.user.id);
    return state.eventLog ?? [];
  }),
});
