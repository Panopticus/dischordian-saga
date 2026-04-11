/* ═══════════════════════════════════════════════════════
   CRAFTING REWARDS SERVICE — Award materials from any
   game system into the shared `gameData.materials` bag.

   Usage:
     import { craftingRewards } from "../services/craftingRewards";
     await craftingRewards.award(userId, { battle_shard: 2 });

   Central entry point so fight / card / trade / disenchant
   all funnel into the same Forge economy without each
   duplicating userProgress JSON plumbing.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";

const FRANCHISE_ID = "dischordian-saga";

/**
 * Known crafting material IDs — mirrors MATERIALS in
 * client/src/data/craftingData.ts. Used as a server-side whitelist so
 * routers that accept reward payloads from client callers (notably
 * tradeEmpire.dispatchMission) can't be abused to grant arbitrary keys.
 * Keep this list in sync whenever new materials are added to MATERIALS.
 */
export const KNOWN_MATERIAL_IDS: ReadonlySet<string> = new Set([
  // Card sacrifice
  "card_essence", "rare_essence", "legendary_essence", "soul_fragment",
  // Trade Empire
  "iron_ore", "crystal_shard", "void_metal", "quantum_flux", "stardust",
  // Combat drops
  "battle_shard", "champions_mark", "void_catalyst", "architects_tear",
  // Exploration
  "ark_fragment", "dream_crystal",
  // Crafted intermediates
  "refined_alloy", "enchanted_crystal", "void_ingot",
]);

export function isKnownMaterial(id: string): boolean {
  return KNOWN_MATERIAL_IDS.has(id);
}

export interface FightRewardContext {
  /** Was the match a win? Losses grant nothing. */
  won: boolean;
  /** Match difficulty (easy/normal/hard/legendary etc). */
  difficulty: string;
  /** Current winStreak after this match. */
  winStreak: number;
}

export interface CardBattleRewardContext {
  won: boolean;
}

/**
 * Merge a material delta into gameData.materials for the given
 * user. Creates the user_progress row if it does not exist yet.
 * Returns the updated material map (or null on database error).
 *
 * All callers should swallow errors — reward grants are best-effort
 * and must never block the originating action (a fight win, a card
 * battle finish, a bulk disenchant) from completing.
 */
async function award(
  userId: number,
  materials: Record<string, number>,
): Promise<Record<string, number> | null> {
  if (!materials || Object.keys(materials).length === 0) return null;

  const db = await getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE_ID)))
      .limit(1);

    const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
    const existing =
      (gameData.materials as Record<string, number> | undefined) ??
      (gameData.craftingMaterials as Record<string, number> | undefined) ??
      {};
    const merged = { ...existing };
    for (const [matId, amount] of Object.entries(materials)) {
      if (!amount || amount <= 0) continue;
      merged[matId] = (merged[matId] ?? 0) + amount;
    }

    if (rows[0]) {
      await db
        .update(userProgress)
        .set({ gameData: { ...gameData, materials: merged } })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE_ID)));
    } else {
      await db.insert(userProgress).values({
        userId,
        franchiseId: FRANCHISE_ID,
        gameData: { materials: merged },
      });
    }

    return merged;
  } catch (e) {
    logger.error("[craftingRewards] award failed:", e);
    return null;
  }
}

/**
 * Compute the crafting material drops for a fight-arena match.
 * Mirrors the sourceDetail hints in client/src/data/craftingData.ts:
 *   - battle_shard: any arena win
 *   - champions_mark: win streak ≥ 3
 *   - void_catalyst: hard+ difficulty win
 *   - architects_tear: legendary difficulty win
 */
function forFight(ctx: FightRewardContext): Record<string, number> {
  if (!ctx.won) return {};
  const drops: Record<string, number> = { battle_shard: 1 };
  if (ctx.winStreak >= 3) drops.champions_mark = 1;
  const diff = (ctx.difficulty ?? "").toLowerCase();
  if (diff === "hard" || diff === "elite" || diff === "legendary") {
    drops.void_catalyst = 1;
  }
  if (diff === "legendary") {
    drops.architects_tear = 1;
  }
  return drops;
}

/**
 * Card battle win → grants a small amount of card_essence. Losses
 * grant nothing. We intentionally stay light here so the Forge
 * economy remains dominated by the main card-sacrifice pipeline.
 */
function forCardBattle(ctx: CardBattleRewardContext): Record<string, number> {
  if (!ctx.won) return {};
  return { card_essence: 2 };
}

/**
 * Bulk-disenchant reward — convert excess card quantity into
 * card_essence plus rare_essence for the non-common buckets.
 */
function forDisenchant(counts: { common: number; rare: number; legendary: number }): Record<string, number> {
  const drops: Record<string, number> = {};
  if (counts.common > 0) drops.card_essence = counts.common;
  if (counts.rare > 0) drops.rare_essence = counts.rare;
  if (counts.legendary > 0) drops.legendary_essence = counts.legendary;
  return drops;
}

export const craftingRewards = {
  award,
  forFight,
  forCardBattle,
  forDisenchant,
};
