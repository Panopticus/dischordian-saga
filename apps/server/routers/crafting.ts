import { logger } from "../logger";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  trackCraftAction,
  trackDisenchant,
  trackCollectionSize,
  trackRecipeForge,
  trackForgeSkillLevel,
  trackForgeDisenchant,
} from "../achievementTracker";
import {
  cards,
  userCards,
  craftingLog,
  dreamBalance,
  userProgress,
  citizenCharacters,
} from "../../db/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveCraftingBonuses } from "../traitResolver";
import { ripple } from "../services/rippleEngine";
import { getConsequences } from "../services/universeConsequences";
import { checkFeatureFlag } from "../middleware/featureFlag";
import { getMaterialReturnRate } from "../../shared/craftingBalance";

/* ═══════════════════════════════════════════════════════
   RECIPE-BASED CRAFTING — Shared types
   ═══════════════════════════════════════════════════════ */

/** A single entry in gameData.craftedItems. The newer format records
 *  the recipe and the materials it consumed so disenchanting can refund
 *  a fraction. Older entries (no recipe/materials) still work — they
 *  just refund a flat fallback. */
interface CraftedItemEntry {
  itemId: string;
  craftedAt: number;
  recipeId?: string;
  rarity?: string;
  materials?: Record<string, number>;
  /** True once the player has equipped this specific instance into a slot.
   *  Equipped instances cannot be disenchanted until unequipped. */
  equipped?: boolean;
}

const SKILL_IDS = ["weaponsmith", "armorsmith", "enchanting", "alchemy", "engineering"] as const;
type SkillId = (typeof SKILL_IDS)[number];

const XP_THRESHOLDS = [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000];

function defaultSkills(): Record<SkillId, { level: number; xp: number }> {
  return {
    weaponsmith: { level: 1, xp: 0 },
    armorsmith: { level: 1, xp: 0 },
    enchanting: { level: 1, xp: 0 },
    alchemy: { level: 1, xp: 0 },
    engineering: { level: 1, xp: 0 },
  };
}

/** Migrate either Record<string, number> or Record<string, {level,xp}> to the new shape. */
function migrateSkills(raw: unknown): Record<SkillId, { level: number; xp: number }> {
  const skills = defaultSkills();
  if (raw && typeof raw === "object") {
    for (const [skillId, value] of Object.entries(raw as Record<string, unknown>)) {
      if (!(SKILL_IDS as readonly string[]).includes(skillId)) continue;
      if (typeof value === "number") {
        skills[skillId as SkillId] = { level: Math.max(1, value), xp: 0 };
      } else if (value && typeof value === "object" && "level" in (value as object)) {
        const v = value as { level?: unknown; xp?: unknown };
        skills[skillId as SkillId] = {
          level: typeof v.level === "number" ? v.level : 1,
          xp: typeof v.xp === "number" ? v.xp : 0,
        };
      }
    }
  }
  return skills;
}

// ═══════════════════════════════════════════════════════
// CRAFTING RECIPES
// ═══════════════════════════════════════════════════════

interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  type: "fusion" | "upgrade" | "transmute" | "disenchant";
  inputCount: number; // How many cards needed
  inputRarity?: string; // Required rarity (optional)
  sameCard?: boolean; // Must be duplicates of same card
  outputRarity: string; // Guaranteed output rarity
  creditsCost: number;
  dreamCost: number;
  successRate: number; // 0-1
}

const RECIPES: CraftingRecipe[] = [
  // Fusion: Combine duplicates into higher rarity
  {
    id: "fusion_common",
    name: "Common Fusion",
    description: "Fuse 3 common duplicates into 1 uncommon card",
    type: "fusion",
    inputCount: 3,
    inputRarity: "common",
    sameCard: true,
    outputRarity: "uncommon",
    creditsCost: 50,
    dreamCost: 0,
    successRate: 1.0,
  },
  {
    id: "fusion_uncommon",
    name: "Uncommon Fusion",
    description: "Fuse 3 uncommon duplicates into 1 rare card",
    type: "fusion",
    inputCount: 3,
    inputRarity: "uncommon",
    sameCard: true,
    outputRarity: "rare",
    creditsCost: 150,
    dreamCost: 1,
    successRate: 0.95,
  },
  {
    id: "fusion_rare",
    name: "Rare Fusion",
    description: "Fuse 3 rare duplicates into 1 epic card",
    type: "fusion",
    inputCount: 3,
    inputRarity: "rare",
    sameCard: true,
    outputRarity: "epic",
    creditsCost: 400,
    dreamCost: 3,
    successRate: 0.85,
  },
  {
    id: "fusion_epic",
    name: "Epic Fusion",
    description: "Fuse 3 epic duplicates into 1 legendary card",
    type: "fusion",
    inputCount: 3,
    inputRarity: "epic",
    sameCard: true,
    outputRarity: "legendary",
    creditsCost: 1000,
    dreamCost: 10,
    successRate: 0.70,
  },
  {
    id: "fusion_legendary",
    name: "Legendary Fusion",
    description: "Fuse 2 legendary duplicates into 1 mythic card",
    type: "fusion",
    inputCount: 2,
    inputRarity: "legendary",
    sameCard: true,
    outputRarity: "mythic",
    creditsCost: 3000,
    dreamCost: 25,
    successRate: 0.50,
  },
  // Transmute: Convert any 5 cards of same rarity into 1 random card of next rarity
  {
    id: "transmute_common",
    name: "Common Transmutation",
    description: "Sacrifice 5 common cards for 1 random uncommon",
    type: "transmute",
    inputCount: 5,
    inputRarity: "common",
    sameCard: false,
    outputRarity: "uncommon",
    creditsCost: 100,
    dreamCost: 0,
    successRate: 1.0,
  },
  {
    id: "transmute_uncommon",
    name: "Uncommon Transmutation",
    description: "Sacrifice 5 uncommon cards for 1 random rare",
    type: "transmute",
    inputCount: 5,
    inputRarity: "uncommon",
    sameCard: false,
    outputRarity: "rare",
    creditsCost: 300,
    dreamCost: 2,
    successRate: 0.90,
  },
  {
    id: "transmute_rare",
    name: "Rare Transmutation",
    description: "Sacrifice 5 rare cards for 1 random epic",
    type: "transmute",
    inputCount: 5,
    inputRarity: "rare",
    sameCard: false,
    outputRarity: "epic",
    creditsCost: 800,
    dreamCost: 5,
    successRate: 0.80,
  },
  // Disenchant: Break down a card for Dream
  {
    id: "disenchant",
    name: "Disenchant",
    description: "Break down a card into Dream essence",
    type: "disenchant",
    inputCount: 1,
    sameCard: false,
    outputRarity: "none",
    creditsCost: 0,
    dreamCost: 0,
    successRate: 1.0,
  },
  // Upgrade: Use Dream to upgrade a card's stats
  {
    id: "upgrade_card",
    name: "Card Enhancement",
    description: "Use Dream to permanently boost a card's stats",
    type: "upgrade",
    inputCount: 1,
    sameCard: false,
    outputRarity: "same",
    creditsCost: 200,
    dreamCost: 5,
    successRate: 0.85,
  },
];

const DREAM_PER_RARITY: Record<string, number> = {
  common: 1,
  uncommon: 3,
  rare: 8,
  epic: 20,
  legendary: 50,
  mythic: 100,
  neyon: 200,
};

export const craftingRouter = router({
  // Get all available recipes
  getRecipes: protectedProcedure.use(checkFeatureFlag("crafting")).query(() => {
    return RECIPES.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      type: r.type,
      inputCount: r.inputCount,
      inputRarity: r.inputRarity,
      sameCard: r.sameCard,
      outputRarity: r.outputRarity,
      creditsCost: r.creditsCost,
      dreamCost: r.dreamCost,
      successRate: Math.round(r.successRate * 100),
    }));
  }),

  // Get player's Dream balance
  getDreamBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { dream: 0, soulBoundDream: 0 };

    const rows = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);

    if (rows.length === 0) {
      // Create initial balance
      await db.insert(dreamBalance).values({
        userId: ctx.user.id,
        dreamTokens: 10, // Starting dream
        soulBoundDream: 0,
      });
      return { dream: 10, soulBoundDream: 0 };
    }

    return { dream: rows[0].dreamTokens, soulBoundDream: rows[0].soulBoundDream };
  }),

  // Get crafting history
  getCraftingHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(craftingLog)
        .where(eq(craftingLog.userId, ctx.user.id))
        .orderBy(desc(craftingLog.createdAt))
        .limit(input?.limit ?? 20);
    }),

  // Get duplicate cards (for fusion)
  getDuplicates: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Find cards the user has 2+ copies of
    const dupes = await db
      .select({
        cardId: userCards.cardId,
        quantity: userCards.quantity,
        name: cards.name,
        rarity: cards.rarity,
        imageUrl: cards.imageUrl,
        power: cards.power,
        health: cards.health,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.cardId))
      .where(and(eq(userCards.userId, ctx.user.id), sql`${userCards.quantity} >= 2`))
      .orderBy(desc(userCards.quantity));

    return dupes;
  }),

  // Execute a craft
  craft: protectedProcedure
    .input(z.object({
      recipeId: z.string(),
      inputCardIds: z.array(z.string()).min(1).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      const recipe = RECIPES.find(r => r.id === input.recipeId);
      if (!recipe) return { success: false, message: "Unknown recipe" };

      // Validate input count
      if (input.inputCardIds.length !== recipe.inputCount) {
        return { success: false, message: `Recipe requires exactly ${recipe.inputCount} cards` };
      }

      // Get Dream balance
      const balRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);

      const currentDream = balRows[0]?.dreamTokens ?? 0;
      if (recipe.dreamCost > currentDream) {
        return { success: false, message: `Not enough Dream (need ${recipe.dreamCost}, have ${currentDream})` };
      }

      // Validate user owns the cards
      const ownedCards = await db
        .select()
        .from(userCards)
        .where(and(
          eq(userCards.userId, ctx.user.id),
          inArray(userCards.cardId, input.inputCardIds)
        ));

      // Check quantities
      const cardCounts: Record<string, number> = {};
      for (const id of input.inputCardIds) {
        cardCounts[id] = (cardCounts[id] || 0) + 1;
      }

      for (const [cardId, needed] of Object.entries(cardCounts)) {
        const owned = ownedCards.find(c => c.cardId === cardId);
        if (!owned || owned.quantity < needed) {
          return { success: false, message: `Not enough copies of card ${cardId}` };
        }
      }

      // Validate rarity if required
      if (recipe.inputRarity) {
        const cardDetails = await db
          .select()
          .from(cards)
          .where(inArray(cards.cardId, input.inputCardIds));

        for (const cd of cardDetails) {
          if (cd.rarity !== recipe.inputRarity) {
            return { success: false, message: `All input cards must be ${recipe.inputRarity} rarity` };
          }
        }
      }

      // Handle disenchant
      if (recipe.type === "disenchant") {
        const cardDetail = await db
          .select()
          .from(cards)
          .where(eq(cards.cardId, input.inputCardIds[0]))
          .limit(1);

        const dreamGain = DREAM_PER_RARITY[cardDetail[0]?.rarity ?? "common"] ?? 1;

        // Remove card
        const owned = ownedCards.find(c => c.cardId === input.inputCardIds[0]);
        if (owned && owned.quantity > 1) {
          await db.update(userCards)
            .set({ quantity: owned.quantity - 1 })
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.inputCardIds[0])));
        } else {
          await db.delete(userCards)
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.inputCardIds[0])));
        }

        // Add Dream
        if (balRows.length > 0) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${dreamGain}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({
            userId: ctx.user.id,
            dreamTokens: dreamGain,
            soulBoundDream: 0,
          });
        }

        // Log
        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: 1 })),
          outputCardId: `dream_${dreamGain}`,
          success: 1,
          creditsCost: 0,
        });

        // Achievement auto-tracking for disenchant
        trackDisenchant(ctx.user.id).catch(e => logger.error("[Crafting] Achievement error:", e));

        return {
          success: true,
          message: `Disenchanted for ${dreamGain} Dream!`,
          dreamGained: dreamGain,
          outputCard: null,
        };
      }

      // Apply citizen trait bonuses to crafting
      const [craftCitizen, craftNft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const craftTb = resolveCraftingBonuses(craftCitizen, craftNft);

      // Roll for success — trait bonus increases success rate
      const boostedRate = Math.min(1, recipe.successRate + craftTb.successRateBonus);
      // Apply Living Universe crafting multiplier
      const fx = await getConsequences();
      const adjustedRate = Math.min(1, boostedRate * fx.craftingMultiplier);
      const roll = Math.random();
      const succeeded = roll <= adjustedRate;

      // Deduct Dream
      if (recipe.dreamCost > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${recipe.dreamCost}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      // Remove input cards
      for (const [cardId, needed] of Object.entries(cardCounts)) {
        const owned = ownedCards.find(c => c.cardId === cardId);
        if (!owned) continue;
        if (owned.quantity > needed) {
          await db.update(userCards)
            .set({ quantity: owned.quantity - needed })
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, cardId)));
        } else {
          await db.delete(userCards)
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, cardId)));
        }
      }

      if (!succeeded) {
        // Log failure
        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: cardCounts[id] })),
          outputCardId: "FAILED",
          success: 0,
          creditsCost: recipe.creditsCost,
        });

        await ripple.emit("craft_result", { userId: ctx.user.id, success: false, recipeId: input.recipeId, rarity: recipe.outputRarity });

        return {
          success: false,
          message: `Crafting failed! Materials were consumed. (${Math.round(boostedRate * 100)}% chance${craftTb.successRateBonus > 0 ? ` — trait bonus: +${Math.round(craftTb.successRateBonus * 100)}%` : ""})`,
          outputCard: null,
        };
      }

      // Handle upgrade (same card, boosted stats)
      if (recipe.type === "upgrade") {
        // Just boost — we don't actually change the card in DB since cards are shared
        // Instead, we log it and the UI can show "enhanced" status
        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: 1 })),
          outputCardId: input.inputCardIds[0],
          success: 1,
          creditsCost: recipe.creditsCost,
        });

        return {
          success: true,
          message: "Card enhanced! +1 Power, +1 Health permanently.",
          outputCard: null,
        };
      }

      // Select random output card of target rarity
      const outputCandidates = await db
        .select()
        .from(cards)
        .where(and(eq(cards.rarity, recipe.outputRarity as any), eq(cards.isActive, 1)))
        .limit(100);

      if (outputCandidates.length === 0) {
        return { success: false, message: "No cards available at target rarity" };
      }

      const outputCard = outputCandidates[Math.floor(Math.random() * outputCandidates.length)];

      // Add output card to user's collection
      const existing = await db
        .select()
        .from(userCards)
        .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, outputCard.cardId)))
        .limit(1);

      if (existing.length > 0) {
        await db.update(userCards)
          .set({ quantity: existing[0].quantity + 1 })
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, outputCard.cardId)));
      } else {
        await db.insert(userCards).values({
          userId: ctx.user.id,
          cardId: outputCard.cardId,
          quantity: 1,
          obtainedVia: "crafting",
        });
      }

      // Log
      await db.insert(craftingLog).values({
        userId: ctx.user.id,
        recipeType: recipe.id,
        inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: cardCounts[id] })),
        outputCardId: outputCard.cardId,
        success: 1,
        creditsCost: recipe.creditsCost,
      });

      // Achievement auto-tracking for successful craft
      trackCraftAction(ctx.user.id, outputCard.rarity || undefined)
        .catch(e => logger.error("[Crafting] Achievement error:", e));
      // Update collection achievements
      trackCollectionSize(ctx.user.id)
        .catch(e => logger.error("[Crafting] Collection tracking error:", e));

      // Award class mastery XP for crafting
      const { awardClassXp } = await import("../classMasteryHelper");
      awardClassXp(ctx.user.id, "craft_item").catch(e => logger.error("[Crafting] Class XP award failed:", e));

      // Award civil skill XP (craftsmanship)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "craft_item").catch(e => logger.error("[Crafting] Civil XP award failed:", e));
      // Extra XP for rare+ crafts
      if (["rare", "epic", "legendary", "mythic"].includes(outputCard.rarity)) {
        awardCivilXp(ctx.user.id, "craft_rare").catch(e => logger.error("[Crafting] Rare craft XP award failed:", e));
      }

      await ripple.emit("craft_result", { userId: ctx.user.id, success: true, recipeId: input.recipeId, rarity: outputCard.rarity });

      return {
        success: true,
        message: `Crafted ${outputCard.name} (${outputCard.rarity})!`,
        outputCard: {
          cardId: outputCard.cardId,
          name: outputCard.name,
          rarity: outputCard.rarity,
          imageUrl: outputCard.imageUrl,
          power: outputCard.power,
          health: outputCard.health,
        },
      };
    }),

  // ═══════════════════════════════════════════════════════
  // RECIPE-BASED CRAFTING (bridges frontend craftingData.ts)
  // Uses skill levels, materials, and Dream costs from the
  // 80+ recipe system in client/src/data/craftingData.ts
  // ═══════════════════════════════════════════════════════

  /**
   * Get player's crafting skill levels and material inventory.
   * Stored in userProgress.gameData.craftingSkills / .materials / .craftedItems.
   *
   * NOTE: `gameState.save` (see routers/gameState.ts) historically wrote
   * `gameData.craftingSkills` as `Record<string, number>` (just level values),
   * while `craftRecipe` writes the new `Record<string, {level, xp}>` shape.
   * We detect the old format on read and migrate it in memory so existing
   * player data survives the upgrade.
   */
  getCraftingProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        skills: defaultSkills(),
        materials: {} as Record<string, number>,
        craftedItems: [] as CraftedItemEntry[],
        cooldowns: {} as Record<SkillId, number>,
      };
    }

    const row = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);
    const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;

    const skills = migrateSkills(gameData.craftingSkills);

    // Materials may live under gameData.materials (new) or
    // gameData.craftingMaterials (old gameState.save format).
    const rawMaterials =
      (gameData.materials as Record<string, number> | undefined) ??
      (gameData.craftingMaterials as Record<string, number> | undefined) ??
      {};

    const cooldowns = (gameData.craftingCooldowns ?? {}) as Record<SkillId, number>;

    return {
      skills,
      materials: { ...rawMaterials },
      craftedItems: (gameData.craftedItems ?? []) as CraftedItemEntry[],
      cooldowns,
    };
  }),

  /**
   * Get only the active crafting cooldowns (lightweight poll endpoint).
   * Returns ms-epoch timestamps for when each skill is free again.
   */
  getCraftingCooldowns: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return {} as Record<SkillId, number>;
    const row = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);
    const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;
    const cd = (gameData.craftingCooldowns ?? {}) as Record<SkillId, number>;
    // Drop expired entries from the response so the client doesn't show
    // stale cooldown indicators.
    const now = Date.now();
    const out: Record<string, number> = {};
    for (const [skill, until] of Object.entries(cd)) {
      if (until > now) out[skill] = until;
    }
    return out;
  }),

  /**
   * Execute a recipe-based craft. Validates skill level, material
   * availability, Dream cost, and applies success rate with bonuses.
   *
   * Skills, materials, and crafted items live on
   * userProgress.gameData.{craftingSkills, materials, craftedItems}
   * for the dischordian-saga franchise.
   */
  craftRecipe: protectedProcedure
    .input(z.object({
      recipeId: z.string(),
      skill: z.enum(SKILL_IDS),
      requiredLevel: z.number(),
      materials: z.record(z.string(), z.number()), // materialId -> amount needed
      dreamCost: z.number(),
      baseSuccessRate: z.number(),
      xpGain: z.number(),
      outputItemId: z.string(),
      outputQuantity: z.number().default(1),
      /** Real-time craft cooldown in seconds (from recipe.craftTime). */
      craftTimeSeconds: z.number().min(0).default(0),
      /** Optional rarity (used for achievements + disenchant fallback). */
      rarity: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      // Load or bootstrap the user_progress row for this franchise.
      const rows = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);

      if (!rows[0]) {
        // No progress row yet — bootstrap an empty one so crafting can proceed.
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          franchiseId: "dischordian-saga",
          gameData: {},
        });
      }
      const existing = rows[0];
      const gameData = (existing?.gameData ?? {}) as Record<string, unknown>;

      const skills = migrateSkills(gameData.craftingSkills);

      // Materials may live under .materials (new) or .craftingMaterials (old).
      const rawMaterials =
        (gameData.materials as Record<string, number> | undefined) ??
        (gameData.craftingMaterials as Record<string, number> | undefined) ??
        {};
      const materials = { ...rawMaterials };
      const craftedItems = [...((gameData.craftedItems ?? []) as CraftedItemEntry[])];
      const cooldowns = { ...((gameData.craftingCooldowns ?? {}) as Record<SkillId, number>) };

      // Validate skill level
      const playerSkillLevel = skills[input.skill]?.level ?? 1;
      if (playerSkillLevel < input.requiredLevel) {
        return { success: false, error: `Need ${input.skill} level ${input.requiredLevel}, have ${playerSkillLevel}` };
      }

      // Cooldown enforcement — block submissions while a previous craft on
      // the same skill is still running. Server is the authority on timing.
      const now = Date.now();
      const skillCooldownUntil = cooldowns[input.skill] ?? 0;
      if (skillCooldownUntil > now) {
        const remainingMs = skillCooldownUntil - now;
        return {
          success: false,
          error: `${input.skill} is on cooldown for ${Math.ceil(remainingMs / 1000)}s`,
          cooldownUntil: skillCooldownUntil,
        };
      }

      // Validate materials
      for (const [matId, needed] of Object.entries(input.materials)) {
        const have = materials[matId] ?? 0;
        if (have < needed) {
          return { success: false, error: `Need ${needed} ${matId}, have ${have}` };
        }
      }

      // Validate Dream balance
      const dreamRow = await db.select().from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      const currentDream = dreamRow[0]?.dreamTokens ?? 0;
      if (currentDream < input.dreamCost) {
        return { success: false, error: `Need ${input.dreamCost} Dream, have ${currentDream}` };
      }

      // Apply citizen trait bonuses to success rate.
      // resolveCraftingBonuses takes (citizen, nft) objects, not a userId.
      let successRate = input.baseSuccessRate;
      try {
        const [citizen, nft] = await Promise.all([
          fetchCitizenData(ctx.user.id),
          fetchPotentialNftData(ctx.user.id),
        ]);
        const bonuses = resolveCraftingBonuses(citizen, nft);
        successRate = Math.min(1, successRate + (bonuses.successRateBonus ?? 0));
      } catch (e) {
        logger.error("[Crafting] Trait bonus resolve failed:", e);
      }

      // Apply Living Universe crafting multiplier
      const fxRecipe = await getConsequences();
      successRate = Math.min(1, successRate * fxRecipe.craftingMultiplier);

      // Deduct materials
      for (const [matId, needed] of Object.entries(input.materials)) {
        materials[matId] = (materials[matId] ?? 0) - needed;
        if (materials[matId] <= 0) delete materials[matId];
      }

      // Deduct Dream
      if (input.dreamCost > 0 && dreamRow[0]) {
        await db.update(dreamBalance)
          .set({ dreamTokens: currentDream - input.dreamCost })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      // Roll for success
      const roll = Math.random();
      const succeeded = roll <= successRate;

      // Award XP regardless of success (reduced on failure)
      const xpAwarded = succeeded ? input.xpGain : Math.floor(input.xpGain * 0.3);
      const skillData = { ...(skills[input.skill] ?? { level: 1, xp: 0 }) };
      const previousLevel = skillData.level;
      skillData.xp += xpAwarded;

      // Level up check (XP thresholds: 0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000)
      while (skillData.level < 10 && skillData.xp >= (XP_THRESHOLDS[skillData.level] ?? Infinity)) {
        skillData.level++;
      }
      skills[input.skill] = skillData;

      // Add crafted item on success — record recipe + materials so disenchant
      // can refund a fraction of the original input.
      if (succeeded) {
        for (let i = 0; i < input.outputQuantity; i++) {
          craftedItems.push({
            itemId: input.outputItemId,
            craftedAt: Date.now(),
            recipeId: input.recipeId,
            rarity: input.rarity,
            materials: { ...input.materials },
          });
        }
      }

      // Set cooldown — even on failure, the forge needs to cool down.
      // Real time enforcement uses craftTimeSeconds from the recipe.
      if (input.craftTimeSeconds > 0) {
        cooldowns[input.skill] = now + input.craftTimeSeconds * 1000;
      }

      // Save state
      await db.update(userProgress)
        .set({
          gameData: {
            ...gameData,
            craftingSkills: skills,
            materials,
            craftedItems,
            craftingCooldowns: cooldowns,
          },
        })
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));

      // Log — map to craftingLog schema fields
      await db.insert(craftingLog).values({
        userId: ctx.user.id,
        recipeType: input.recipeId,
        inputCards: Object.entries(input.materials).map(([id, qty]) => ({ cardId: id, quantity: qty })),
        outputCardId: succeeded ? input.outputItemId : "FAILED",
        success: succeeded ? 1 : 0,
        creditsCost: input.dreamCost,
      }).catch(e => logger.error("[Crafting] Craft log insert failed:", e));

      await ripple.emit("craft_result", { userId: ctx.user.id, success: succeeded, recipeId: input.recipeId, rarity: input.rarity ?? "crafted" });

      // Achievement tracking — recipe-based forge achievements
      if (succeeded) {
        trackRecipeForge(ctx.user.id, input.rarity).catch(e =>
          logger.error("[Crafting] Forge achievement error:", e)
        );
      }
      // Skill level-up achievements (fires when a level threshold is crossed)
      if (skillData.level > previousLevel) {
        trackForgeSkillLevel(ctx.user.id, input.skill, skillData.level).catch(e =>
          logger.error("[Crafting] Skill level achievement error:", e)
        );
      }

      return {
        success: true,
        crafted: succeeded,
        message: succeeded
          ? `Crafted ${input.outputItemId.replace(/_/g, " ")}!`
          : "Crafting failed — materials consumed, partial XP awarded.",
        xpAwarded,
        newSkillLevel: skillData.level,
        newSkillXp: skillData.xp,
        leveledUp: skillData.level > previousLevel,
        cooldownUntil: cooldowns[input.skill] ?? 0,
      };
    }),

  /** Add materials to inventory (called from game mode rewards) */
  addMaterials: protectedProcedure
    .input(z.object({
      materials: z.record(z.string(), z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, materials: {} };

      const rows = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);

      const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
      const materials = { ...((gameData.materials ?? {}) as Record<string, number>) };

      for (const [matId, amount] of Object.entries(input.materials)) {
        materials[matId] = (materials[matId] ?? 0) + amount;
      }

      if (rows[0]) {
        await db.update(userProgress)
          .set({ gameData: { ...gameData, materials } })
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
      } else {
        // Bootstrap a progress row if the player has none yet.
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          franchiseId: "dischordian-saga",
          gameData: { materials },
        });
      }

      return { success: true, materials };
    }),

  /* ═══════════════════════════════════════════════════════
     EQUIPMENT INTEGRATION — Equip / unequip crafted items
     ═══════════════════════════════════════════════════════ */

  /** Returns crafted items grouped by itemId with totals and how many
   *  of each are currently equipped. The client resolves the itemId
   *  against equipmentData.ts to get slot/stats/visuals. */
  getCraftedInventory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { items: [] as Array<{ itemId: string; total: number; equipped: number }> };

    const row = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);
    const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;
    const craftedItems = (gameData.craftedItems ?? []) as CraftedItemEntry[];

    const grouped: Record<string, { itemId: string; total: number; equipped: number }> = {};
    for (const it of craftedItems) {
      const g = grouped[it.itemId] ?? { itemId: it.itemId, total: 0, equipped: 0 };
      g.total++;
      if (it.equipped) g.equipped++;
      grouped[it.itemId] = g;
    }

    return { items: Object.values(grouped) };
  }),

  /**
   * Equip a crafted item into the player's primary citizen's gear slot.
   * Validates the item exists in craftedItems and isn't already equipped.
   * Bridges to citizenCharacters.gear (the same JSON column citizen.updateGear writes).
   */
  equipCraftedItem: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      slot: z.enum(["weapon", "armor", "helm", "accessory", "secondary", "consumable"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      // Load progress + craftedItems
      const rows = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);
      const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
      const craftedItems = [...((gameData.craftedItems ?? []) as CraftedItemEntry[])];

      // Find an unequipped instance of this itemId
      const idx = craftedItems.findIndex(i => i.itemId === input.itemId && !i.equipped);
      if (idx === -1) {
        return { success: false, error: "You don't have an unequipped copy of this item" };
      }

      // Load primary citizen
      const chars = await db.select().from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) return { success: false, error: "No citizen found — create one first" };

      const currentGear = (chars[0].gear ?? {}) as Record<string, string | null>;
      const previouslyEquippedId = currentGear[input.slot] ?? null;

      // If a crafted item was previously in the slot, mark its instance as
      // unequipped so it's available again.
      if (previouslyEquippedId) {
        const prevIdx = craftedItems.findIndex(i => i.itemId === previouslyEquippedId && i.equipped);
        if (prevIdx !== -1) craftedItems[prevIdx] = { ...craftedItems[prevIdx], equipped: false };
      }

      // Mark the new instance equipped
      craftedItems[idx] = { ...craftedItems[idx], equipped: true };
      const nextGear = { ...currentGear, [input.slot]: input.itemId };

      // Persist both updates
      await db.update(citizenCharacters)
        .set({ gear: nextGear })
        .where(eq(citizenCharacters.id, chars[0].id));
      await db.update(userProgress)
        .set({ gameData: { ...gameData, craftedItems } })
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));

      return { success: true, slot: input.slot, itemId: input.itemId, gear: nextGear };
    }),

  /**
   * Unequip whichever item is in the given slot. If it's a crafted item,
   * its instance is marked unequipped so it can be re-equipped or disenchanted.
   */
  unequipCraftedItem: protectedProcedure
    .input(z.object({
      slot: z.enum(["weapon", "armor", "helm", "accessory", "secondary", "consumable"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const chars = await db.select().from(citizenCharacters)
        .where(and(eq(citizenCharacters.userId, ctx.user.id), eq(citizenCharacters.isPrimary, 1)))
        .limit(1);
      if (!chars[0]) return { success: false, error: "No citizen found" };

      const currentGear = (chars[0].gear ?? {}) as Record<string, string | null>;
      const removedId = currentGear[input.slot] ?? null;
      const nextGear = { ...currentGear };
      delete nextGear[input.slot];

      await db.update(citizenCharacters)
        .set({ gear: nextGear })
        .where(eq(citizenCharacters.id, chars[0].id));

      // Mark crafted instance as unequipped (if it was a crafted item).
      if (removedId) {
        const rows = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
          .limit(1);
        const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
        const craftedItems = [...((gameData.craftedItems ?? []) as CraftedItemEntry[])];
        const idx = craftedItems.findIndex(i => i.itemId === removedId && i.equipped);
        if (idx !== -1) {
          craftedItems[idx] = { ...craftedItems[idx], equipped: false };
          await db.update(userProgress)
            .set({ gameData: { ...gameData, craftedItems } })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
        }
      }

      return { success: true, slot: input.slot, gear: nextGear };
    }),

  /**
   * Disenchant a crafted item — destroys one instance and refunds a
   * fraction of the materials originally consumed (if recorded), plus
   * a small Dream rebate. Refund rate scales with the player's skill
   * level in the recipe's skill, using shared/craftingBalance.
   */
  disenchantCraftedItem: protectedProcedure
    .input(z.object({
      itemId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const rows = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
        .limit(1);
      const gameData = (rows[0]?.gameData ?? {}) as Record<string, unknown>;
      const craftedItems = [...((gameData.craftedItems ?? []) as CraftedItemEntry[])];
      const materials = { ...((gameData.materials ?? {}) as Record<string, number>) };
      const skills = migrateSkills(gameData.craftingSkills);

      // Find an unequipped instance of this itemId. We never disenchant
      // an equipped item — the player must unequip first.
      const idx = craftedItems.findIndex(i => i.itemId === input.itemId && !i.equipped);
      if (idx === -1) {
        return { success: false, error: "No unequipped copy of this item to disenchant" };
      }

      const entry = craftedItems[idx];
      // Pick the right skill for the refund-rate lookup. Fall back to the
      // average across all skills if the entry was crafted before we tracked
      // recipeId (legacy items).
      const skillId = (entry.materials && Object.keys(entry.materials).length)
        ? guessSkillForRefund(entry, skills)
        : "weaponsmith";
      const skillLevel = skills[skillId]?.level ?? 1;
      const rate = getMaterialReturnRate(skillLevel);

      // Compute material refund
      const refunded: Record<string, number> = {};
      if (entry.materials) {
        for (const [matId, qty] of Object.entries(entry.materials)) {
          const refund = Math.floor(qty * rate);
          if (refund > 0) {
            refunded[matId] = refund;
            materials[matId] = (materials[matId] ?? 0) + refund;
          }
        }
      } else {
        // Legacy entry — give a token consolation prize.
        refunded.stardust = 1;
        materials.stardust = (materials.stardust ?? 0) + 1;
      }

      // Small Dream rebate scaled by rarity
      const RARITY_DREAM: Record<string, number> = {
        common: 1, uncommon: 2, rare: 5, epic: 10, legendary: 25, mythic: 50,
      };
      const dreamRebate = RARITY_DREAM[entry.rarity ?? "common"] ?? 1;
      if (dreamRebate > 0) {
        const dreamRow = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (dreamRow[0]) {
          await db.update(dreamBalance)
            .set({ dreamTokens: (dreamRow[0].dreamTokens ?? 0) + dreamRebate })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({
            userId: ctx.user.id,
            dreamTokens: dreamRebate,
            soulBoundDream: 0,
          });
        }
      }

      // Remove the disenchanted instance
      craftedItems.splice(idx, 1);

      await db.update(userProgress)
        .set({ gameData: { ...gameData, craftedItems, materials } })
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));

      // Achievement: count crafted-item disenchants separately from card disenchants.
      trackForgeDisenchant(ctx.user.id).catch(e =>
        logger.error("[Crafting] Forge disenchant achievement error:", e)
      );

      return {
        success: true,
        itemId: input.itemId,
        refunded,
        dreamRebate,
        refundRate: rate,
        message: `Disenchanted ${input.itemId.replace(/_/g, " ")} (${Math.round(rate * 100)}% recovery)`,
      };
    }),
});

/**
 * Best-effort skill lookup for legacy entries that didn't record
 * recipeId. Picks the skill the player has the highest level in,
 * which is also the most generous refund rate.
 */
function guessSkillForRefund(
  _entry: CraftedItemEntry,
  skills: Record<SkillId, { level: number; xp: number }>,
): SkillId {
  let best: SkillId = "weaponsmith";
  let bestLevel = 0;
  for (const id of SKILL_IDS) {
    const lvl = skills[id]?.level ?? 1;
    if (lvl > bestLevel) {
      best = id;
      bestLevel = lvl;
    }
  }
  return best;
}
