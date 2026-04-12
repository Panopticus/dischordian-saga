/**
 * Mastery Tree Router — Persist mastery node unlocks.
 *
 * Uses userProgress.gameData JSON column:
 *   gameData.mastery: { unlockedNodeIds: string[], totalPointsSpent: number }
 *
 * Validates prerequisites, point costs, and available points server-side.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { eq, and } from "drizzle-orm";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

// Node definitions (mirrors shared/masteryTree.ts)
interface NodeDef {
  id: string;
  branch: string;
  tier: number;
  stat: string;
  bonusPercent: number;
  pointCost: number;
  prerequisiteNodeId: string | null;
}

const NODES: NodeDef[] = [
  // Combat
  { id: "c1", branch: "combat", tier: 1, stat: "damage", bonusPercent: 5, pointCost: 1, prerequisiteNodeId: null },
  { id: "c2", branch: "combat", tier: 2, stat: "crit_chance", bonusPercent: 3, pointCost: 2, prerequisiteNodeId: "c1" },
  { id: "c3", branch: "combat", tier: 3, stat: "boss_damage", bonusPercent: 10, pointCost: 3, prerequisiteNodeId: "c2" },
  { id: "c4", branch: "combat", tier: 4, stat: "attack_speed", bonusPercent: 7, pointCost: 4, prerequisiteNodeId: "c3" },
  { id: "c5", branch: "combat", tier: 5, stat: "crit_damage", bonusPercent: 15, pointCost: 5, prerequisiteNodeId: "c4" },
  // Survival
  { id: "s1", branch: "survival", tier: 1, stat: "max_hp", bonusPercent: 10, pointCost: 1, prerequisiteNodeId: null },
  { id: "s2", branch: "survival", tier: 2, stat: "healing", bonusPercent: 5, pointCost: 2, prerequisiteNodeId: "s1" },
  { id: "s3", branch: "survival", tier: 3, stat: "armor", bonusPercent: 15, pointCost: 3, prerequisiteNodeId: "s2" },
  { id: "s4", branch: "survival", tier: 4, stat: "low_hp_damage", bonusPercent: 20, pointCost: 4, prerequisiteNodeId: "s3" },
  { id: "s5", branch: "survival", tier: 5, stat: "revive_speed", bonusPercent: 10, pointCost: 5, prerequisiteNodeId: "s4" },
  // Utility
  { id: "u1", branch: "utility", tier: 1, stat: "xp_gain", bonusPercent: 10, pointCost: 1, prerequisiteNodeId: null },
  { id: "u2", branch: "utility", tier: 2, stat: "resource_gain", bonusPercent: 5, pointCost: 2, prerequisiteNodeId: "u1" },
  { id: "u3", branch: "utility", tier: 3, stat: "trust_gain", bonusPercent: 10, pointCost: 3, prerequisiteNodeId: "u2" },
  { id: "u4", branch: "utility", tier: 4, stat: "drop_rate", bonusPercent: 8, pointCost: 4, prerequisiteNodeId: "u3" },
  { id: "u5", branch: "utility", tier: 5, stat: "all_stats", bonusPercent: 5, pointCost: 5, prerequisiteNodeId: "u4" },
];

const NODE_MAP = new Map(NODES.map(n => [n.id, n]));

interface MasteryState {
  unlockedNodeIds: string[];
  totalPointsSpent: number;
}

const DEFAULT_STATE: MasteryState = { unlockedNodeIds: [], totalPointsSpent: 0 };

async function getMasteryState(userId: number): Promise<MasteryState> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const gameData = row[0]?.gameData as any;
  return gameData?.mastery ?? DEFAULT_STATE;
}

async function saveMasteryState(userId: number, state: MasteryState) {
  const db = await getDb();
  if (!db) dbUnavailable();
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const existing = row[0]?.gameData as any ?? {};
  await db.update(userProgress)
    .set({ gameData: { ...existing, mastery: state } })
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")));
}

export const masteryTreeRouter = router({
  getState: protectedProcedure.query(async ({ ctx }) => {
    return getMasteryState(ctx.user.id);
  }),

  unlockNode: protectedProcedure
    .input(z.object({ nodeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getMasteryState(ctx.user.id);
      const node = NODE_MAP.get(input.nodeId);
      if (!node) return { success: false, error: "Unknown node" };

      if (state.unlockedNodeIds.includes(input.nodeId)) {
        return { success: false, error: "Already unlocked" };
      }

      // Check prerequisite
      if (node.prerequisiteNodeId && !state.unlockedNodeIds.includes(node.prerequisiteNodeId)) {
        return { success: false, error: "Prerequisite not unlocked" };
      }

      // Check available points (from player level — 1 point per 5 levels)
      const db = await getDb();
  if (!db) dbUnavailable();
      const row = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);
      const level = row[0]?.level ?? 1;
      const totalAvailable = Math.floor(level / 5);
      const pointsRemaining = totalAvailable - state.totalPointsSpent;

      if (pointsRemaining < node.pointCost) {
        return { success: false, error: `Need ${node.pointCost} points, have ${pointsRemaining}` };
      }

      state.unlockedNodeIds.push(input.nodeId);
      state.totalPointsSpent += node.pointCost;
      await saveMasteryState(ctx.user.id, state);

      return {
        success: true,
        unlocked: input.nodeId,
        bonuses: { stat: node.stat, bonusPercent: node.bonusPercent },
        pointsRemaining: pointsRemaining - node.pointCost,
      };
    }),

  getBonuses: protectedProcedure.query(async ({ ctx }) => {
    const state = await getMasteryState(ctx.user.id);
    const bonuses: Record<string, number> = {};
    for (const nodeId of state.unlockedNodeIds) {
      const node = NODE_MAP.get(nodeId);
      if (node) {
        bonuses[node.stat] = (bonuses[node.stat] ?? 0) + node.bonusPercent;
      }
    }
    return bonuses;
  }),
});
