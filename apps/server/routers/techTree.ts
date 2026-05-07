/**
 * Tech Tree Router — Persist technology research progress.
 *
 * Uses userProgress.gameData JSON column to store tech state,
 * avoiding schema migrations. State shape:
 *   gameData.techTree: { researched: string[], currentResearch: {...} | null }
 *
 * Validates prerequisites and costs server-side before allowing research.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, dreamBalance } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../logger";
import { ripple } from "../services/rippleEngine";

// Inline tech definitions (mirrors shared/techTree.ts) to avoid import issues
// In a full refactor, shared/ types would be imported directly
const TECH_COSTS: Record<string, { influence: number; dream?: number; voidCrystals?: number }> = {
  mil_basic_tactics: { influence: 10 },
  mil_armor_plating: { influence: 15 },
  mil_advanced_weapons: { influence: 30, dream: 50 },
  mil_rapid_deployment: { influence: 25 },
  mil_terminus_doctrine: { influence: 50, dream: 100 },
  mil_archon_tactics: { influence: 80, dream: 200, voidCrystals: 10 },
  mil_iron_lion_legacy: { influence: 150, dream: 500, voidCrystals: 25 },
  mil_doctrine_aggression: { influence: 35, dream: 60 },
  mil_doctrine_attrition: { influence: 35, dream: 60 },
  eco_trade_routes: { influence: 10 },
  eco_cargo_optimization: { influence: 12 },
  eco_market_manipulation: { influence: 25, dream: 40 },
  eco_resource_extraction: { influence: 20, dream: 30 },
  eco_new_babylon_accord: { influence: 50, dream: 100 },
  eco_void_harvesting: { influence: 80, dream: 200, voidCrystals: 5 },
  eco_galactic_monopoly: { influence: 150, dream: 500, voidCrystals: 25 },
  eco_doctrine_free_market: { influence: 35, dream: 50 },
  eco_doctrine_command_economy: { influence: 35, dream: 50 },
  dip_first_contact: { influence: 10 },
  dip_intelligence_network: { influence: 15 },
  dip_faction_envoys: { influence: 25, dream: 30 },
  dip_espionage: { influence: 30, dream: 40 },
  dip_alliance_charter: { influence: 50, dream: 100 },
  dip_shadow_diplomacy: { influence: 80, dream: 200, voidCrystals: 10 },
  dip_architects_accord: { influence: 150, dream: 500, voidCrystals: 25 },
  dip_doctrine_open: { influence: 30, dream: 40 },
  dip_doctrine_realpolitik: { influence: 30, dream: 40 },
};

const TECH_PREREQS: Record<string, string[]> = {
  mil_advanced_weapons: ["mil_basic_tactics"],
  mil_rapid_deployment: ["mil_armor_plating"],
  mil_terminus_doctrine: ["mil_advanced_weapons", "mil_rapid_deployment"],
  mil_archon_tactics: ["mil_terminus_doctrine"],
  mil_iron_lion_legacy: ["mil_archon_tactics"],
  mil_doctrine_aggression: ["mil_basic_tactics"],
  mil_doctrine_attrition: ["mil_armor_plating"],
  eco_market_manipulation: ["eco_trade_routes"],
  eco_resource_extraction: ["eco_cargo_optimization"],
  eco_new_babylon_accord: ["eco_market_manipulation", "eco_resource_extraction"],
  eco_void_harvesting: ["eco_new_babylon_accord"],
  eco_galactic_monopoly: ["eco_void_harvesting"],
  eco_doctrine_free_market: ["eco_trade_routes"],
  eco_doctrine_command_economy: ["eco_cargo_optimization"],
  dip_faction_envoys: ["dip_first_contact"],
  dip_espionage: ["dip_intelligence_network"],
  dip_alliance_charter: ["dip_faction_envoys", "dip_espionage"],
  dip_shadow_diplomacy: ["dip_alliance_charter"],
  dip_architects_accord: ["dip_shadow_diplomacy"],
  dip_doctrine_open: ["dip_first_contact"],
  dip_doctrine_realpolitik: ["dip_intelligence_network"],
};

/** Civics-style mutual exclusion. Symmetric — keep parity with the
 *  client `mutexWith` declarations in apps/client/src/game/techTree.ts. */
const TECH_MUTEX: Record<string, string[]> = {
  mil_doctrine_aggression: ["mil_doctrine_attrition"],
  mil_doctrine_attrition: ["mil_doctrine_aggression"],
  eco_doctrine_free_market: ["eco_doctrine_command_economy"],
  eco_doctrine_command_economy: ["eco_doctrine_free_market"],
  dip_doctrine_open: ["dip_doctrine_realpolitik"],
  dip_doctrine_realpolitik: ["dip_doctrine_open"],
};

const TECH_HOURS: Record<string, number> = {
  mil_basic_tactics: 2, mil_armor_plating: 3, mil_advanced_weapons: 6,
  mil_rapid_deployment: 5, mil_terminus_doctrine: 12, mil_archon_tactics: 24,
  mil_iron_lion_legacy: 48,
  mil_doctrine_aggression: 6, mil_doctrine_attrition: 6,
  eco_trade_routes: 2, eco_cargo_optimization: 2, eco_market_manipulation: 5,
  eco_resource_extraction: 4, eco_new_babylon_accord: 10, eco_void_harvesting: 20,
  eco_galactic_monopoly: 48,
  eco_doctrine_free_market: 6, eco_doctrine_command_economy: 6,
  dip_first_contact: 2, dip_intelligence_network: 3, dip_faction_envoys: 5,
  dip_espionage: 6, dip_alliance_charter: 10, dip_shadow_diplomacy: 24,
  dip_architects_accord: 48,
  dip_doctrine_open: 5, dip_doctrine_realpolitik: 5,
};

// Zod schema for TechTreeState — validates JSON blob data integrity
const techTreeStateSchema = z.object({
  researched: z.array(z.string()),
  currentResearch: z.object({
    techId: z.string(),
    startedAt: z.number(),
    endsAt: z.number(),
  }).nullable(),
});

type TechTreeState = z.infer<typeof techTreeStateSchema>;

const DEFAULT_STATE: TechTreeState = { researched: [], currentResearch: null };

async function getTechState(userId: number): Promise<TechTreeState> {
  const db = await getDb();
  if (!db) return DEFAULT_STATE;
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;
  const raw = gameData.techTree;
  // Validate stored data against schema — fallback to default if corrupted
  const parsed = techTreeStateSchema.safeParse(raw);
  if (!parsed.success) {
    if (raw !== undefined) logger.warn("[TechTree] Corrupted techTree data for user " + userId + ", using defaults");
    return DEFAULT_STATE;
  }
  return parsed.data;
}

async function saveTechState(userId: number, state: TechTreeState) {
  const db = await getDb();
  if (!db) return;
  const row = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
    .limit(1);
  const existing = (row[0]?.gameData ?? {}) as Record<string, unknown>;
  await db.update(userProgress)
    .set({ gameData: { ...existing, techTree: state } })
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")));
}

export const techTreeRouter = router({
  getState: protectedProcedure.query(async ({ ctx }) => {
    return getTechState(ctx.user.id);
  }),

  startResearch: protectedProcedure
    .input(z.object({ techId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await getTechState(ctx.user.id);
      const { techId } = input;

      if (state.researched.includes(techId)) {
        return { success: false, error: "Already researched" };
      }
      if (state.currentResearch) {
        return { success: false, error: "Already researching something" };
      }

      const cost = TECH_COSTS[techId];
      if (!cost) return { success: false, error: "Unknown technology" };

      const prereqs = TECH_PREREQS[techId] ?? [];
      const missingPrereqs = prereqs.filter(p => !state.researched.includes(p));
      if (missingPrereqs.length > 0) {
        return { success: false, error: `Missing prerequisites: ${missingPrereqs.join(", ")}` };
      }

      const mutex = TECH_MUTEX[techId] ?? [];
      const blocking = mutex.filter(m => state.researched.includes(m) || state.currentResearch?.techId === m);
      if (blocking.length > 0) {
        return { success: false, error: `Excluded by mutually exclusive doctrine: ${blocking.join(", ")}` };
      }

      // Deduct economy costs — Dream from dreamBalance table, influence/voidCrystals from gameData
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      // Check and deduct Dream tokens if required.
      // Read-then-write wrapped in a transaction so a concurrent
      // tech-tree purchase can't double-spend Dream below 0. Plan §C3.
      if (cost.dream && cost.dream > 0) {
        const dreamCost = cost.dream;
        const insufficient = await db.transaction(async (tx) => {
          const balRow = await tx.select().from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
          const currentDream = balRow[0]?.dreamTokens ?? 0;
          if (currentDream < dreamCost) {
            return { error: `Need ${dreamCost} Dream, have ${currentDream}` };
          }
          await tx.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${dreamCost}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
          return null;
        });
        if (insufficient) {
          return { success: false, error: insufficient.error };
        }
      }

      // Check and deduct influence + voidCrystals from gameData resources
      const progressRow = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);
      const gameData = (progressRow[0]?.gameData ?? {}) as Record<string, unknown>;
      const resources = (gameData.resources ?? { influence: 0, voidCrystals: 0 }) as { influence: number; voidCrystals: number };

      if (cost.influence > (resources.influence ?? 0)) {
        return { success: false, error: `Need ${cost.influence} Influence, have ${resources.influence ?? 0}` };
      }
      if (cost.voidCrystals && cost.voidCrystals > (resources.voidCrystals ?? 0)) {
        return { success: false, error: `Need ${cost.voidCrystals} Void Crystals, have ${resources.voidCrystals ?? 0}` };
      }

      resources.influence = (resources.influence ?? 0) - cost.influence;
      if (cost.voidCrystals) {
        resources.voidCrystals = (resources.voidCrystals ?? 0) - cost.voidCrystals;
      }

      const hours = TECH_HOURS[techId] ?? 2;
      const now = Date.now();
      state.currentResearch = {
        techId,
        startedAt: now,
        endsAt: now + hours * 3600 * 1000,
      };

      // Save both tech state and updated resources atomically
      await db.update(userProgress)
        .set({ gameData: { ...gameData, techTree: state, resources } })
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));

      return { success: true, endsAt: state.currentResearch.endsAt, cost };
    }),

  completeResearch: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await getTechState(ctx.user.id);
    if (!state.currentResearch) {
      return { success: false, error: "No active research" };
    }
    if (Date.now() < state.currentResearch.endsAt) {
      return { success: false, error: "Research not yet complete" };
    }
    state.researched.push(state.currentResearch.techId);
    const completedTech = state.currentResearch.techId;
    state.currentResearch = null;
    await saveTechState(ctx.user.id, state);

    await ripple.emit("tech_researched", { userId: ctx.user.id, techId: completedTech });

    return { success: true, completedTech };
  }),

  cancelResearch: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await getTechState(ctx.user.id);
    if (!state.currentResearch) {
      return { success: false, error: "No active research" };
    }
    state.currentResearch = null;
    await saveTechState(ctx.user.id, state);
    return { success: true };
  }),
});
