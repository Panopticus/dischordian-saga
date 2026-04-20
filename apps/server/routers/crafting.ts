import { logger } from "../logger";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { trackCraftAction, trackDisenchant, trackCollectionSize } from "../achievementTracker";
import { cards, userCards, craftingLog, disenchantLog, dreamBalance, userProgress, citizenCharacters } from "../../db/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveCraftingBonuses } from "../traitResolver";
import { ripple } from "../services/rippleEngine";
import { getConsequences } from "../services/universeConsequences";
import { checkFeatureFlag } from "../middleware/featureFlag";
import { TRPCError } from "@trpc/server";
import {
  getRecipe,
  type SuitRecipeId,
} from "../../shared/suitRecipes";
import {
  isSchematicEligibleForOperative,
  SCHEMATICS,
  type OperativeIdentity,
} from "../../shared/schematics";
import type { ClassKey, ElementKey } from "../../shared/earnedLoadouts";
import type {
  FoundationKey,
  StarterSpecies,
} from "../../shared/starterLoadout";

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
  // Foil upgrade: Convert 5 regular copies into a shiny foil version
  {
    id: "foil_upgrade",
    name: "Foil Upgrade",
    description: "Convert 5 regular copies of the same card into a shiny foil version",
    type: "fusion",
    inputCount: 5,
    sameCard: true,
    outputRarity: "same",
    creditsCost: 0,
    dreamCost: 50,
    successRate: 1.0,
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

  // Get duplicate cards (for fusion). Returns both foil and non-foil
  // groupings so the client can target each collection independently.
  getDuplicates: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Find cards the user has 2+ copies of (either foil or non-foil)
    const dupes = await db
      .select({
        cardId: userCards.cardId,
        quantity: userCards.quantity,
        isFoil: userCards.isFoil,
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
      /**
       * When true, the craft targets foil copies from the user's collection
       * instead of non-foil. Required for foil disenchant (3x Dream bonus).
       * The `foil_upgrade` recipe ignores this flag and always consumes
       * non-foil copies to produce a foil version.
       */
      inputIsFoil: z.boolean().optional(),
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

      // Foil upgrade always reads non-foil rows. Everything else honours the
      // caller's flag (defaulting to non-foil for backward compatibility).
      const targetIsFoil: 0 | 1 = recipe.id === "foil_upgrade" ? 0 : (input.inputIsFoil ? 1 : 0);

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

      // Validate user owns the cards (scoped to the target foil state so
      // foil and non-foil collections are tracked independently).
      const ownedCards = await db
        .select()
        .from(userCards)
        .where(and(
          eq(userCards.userId, ctx.user.id),
          eq(userCards.isFoil, targetIsFoil),
          inArray(userCards.cardId, input.inputCardIds)
        ));

      // Check quantities
      const cardCounts: Record<string, number> = {};
      for (const id of input.inputCardIds) {
        cardCounts[id] = (cardCounts[id] || 0) + 1;
      }

      // Enforce sameCard: recipes that require duplicates of the same card
      // (fusion, foil_upgrade) must receive all identical card IDs.
      if (recipe.sameCard && Object.keys(cardCounts).length > 1) {
        return { success: false, message: "This recipe requires all inputs to be copies of the same card" };
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

        const baseDream = DREAM_PER_RARITY[cardDetail[0]?.rarity ?? "common"] ?? 1;
        // Foil copies yield 3x Dream on disenchant.
        const dreamGain = targetIsFoil ? baseDream * 3 : baseDream;

        // Remove card (scoped to the foil state being disenchanted)
        const owned = ownedCards.find(c => c.cardId === input.inputCardIds[0]);
        if (owned && owned.quantity > 1) {
          await db.update(userCards)
            .set({ quantity: owned.quantity - 1 })
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, input.inputCardIds[0]),
              eq(userCards.isFoil, targetIsFoil),
            ));
        } else {
          await db.delete(userCards)
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, input.inputCardIds[0]),
              eq(userCards.isFoil, targetIsFoil),
            ));
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

        // Log to craftingLog (shared with all recipe types)
        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: 1 })),
          outputCardId: `dream_${dreamGain}`,
          success: 1,
          creditsCost: 0,
        });

        // Audit 5A — dedicated disenchantLog entry. Previously the
        // disenchant_log table existed in schema but was never written
        // to (orphaned). This write denormalizes the disenchant-specific
        // fields (cardName, cardRarity, materialsReceived, dreamReceived)
        // so analytics can query disenchant history without filtering
        // craftingLog by recipeType.
        try {
          await db.insert(disenchantLog).values({
            userId: ctx.user.id,
            cardId: input.inputCardIds[0],
            cardName: cardDetail[0]?.name ?? input.inputCardIds[0],
            cardRarity: cardDetail[0]?.rarity ?? "common",
            materialsReceived: {},
            dreamReceived: dreamGain,
          });
        } catch (e) {
          logger.warn("[Crafting] disenchantLog insert failed (non-blocking):", e);
        }

        // Achievement auto-tracking for disenchant
        trackDisenchant(ctx.user.id).catch(e => logger.error("[Crafting] Achievement error:", e));

        return {
          success: true,
          message: targetIsFoil
            ? `Disenchanted foil card for ${dreamGain} Dream! (3x bonus)`
            : `Disenchanted for ${dreamGain} Dream!`,
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

      // Remove input cards (scoped to the target foil state)
      for (const [cardId, needed] of Object.entries(cardCounts)) {
        const owned = ownedCards.find(c => c.cardId === cardId);
        if (!owned) continue;
        if (owned.quantity > needed) {
          await db.update(userCards)
            .set({ quantity: owned.quantity - needed })
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, cardId),
              eq(userCards.isFoil, targetIsFoil),
            ));
        } else {
          await db.delete(userCards)
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, cardId),
              eq(userCards.isFoil, targetIsFoil),
            ));
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

      // Handle upgrade (same card, boosted stats persist via cardLevel)
      if (recipe.type === "upgrade") {
        // NOTE: the input card was removed above as part of "remove input cards"
        // even though upgrades should keep the row. Restore it by either
        // incrementing the existing target row or inserting a fresh one at
        // the new cardLevel. We fetch the current level first so we can
        // bump to level+1.
        const upgradeCardId = input.inputCardIds[0];
        const currentRow = await db
          .select()
          .from(userCards)
          .where(and(
            eq(userCards.userId, ctx.user.id),
            eq(userCards.cardId, upgradeCardId),
            eq(userCards.isFoil, targetIsFoil),
          ))
          .limit(1);

        const prevLevel = ownedCards.find(c => c.cardId === upgradeCardId)?.cardLevel ?? 1;
        const newLevel = Math.min(10, prevLevel + 1);

        if (currentRow.length > 0) {
          // Row still exists (quantity was > 1). Bump its level.
          await db.update(userCards)
            .set({ cardLevel: newLevel })
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, upgradeCardId),
              eq(userCards.isFoil, targetIsFoil),
            ));
        } else {
          // Row was fully consumed; re-insert at the upgraded level.
          await db.insert(userCards).values({
            userId: ctx.user.id,
            cardId: upgradeCardId,
            quantity: 1,
            isFoil: targetIsFoil,
            cardLevel: newLevel,
            obtainedVia: "crafting_upgrade",
          });
        }

        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: 1 })),
          outputCardId: `${upgradeCardId}_lvl${newLevel}`,
          success: 1,
          creditsCost: recipe.creditsCost,
        });

        return {
          success: true,
          message: `Card enhanced to level ${newLevel}! +1 Power, +1 Health.`,
          outputCard: null,
        };
      }

      // Handle foil_upgrade: produce a foil copy of the same cardId. The
      // non-foil copies have already been consumed above. Add (or increment)
      // a foil row for that same cardId.
      if (recipe.id === "foil_upgrade") {
        const foilCardId = input.inputCardIds[0];
        const foilCardDetail = await db
          .select()
          .from(cards)
          .where(eq(cards.cardId, foilCardId))
          .limit(1);

        if (!foilCardDetail[0]) {
          return { success: false, message: "Card not found for foil upgrade" };
        }

        const existingFoil = await db
          .select()
          .from(userCards)
          .where(and(
            eq(userCards.userId, ctx.user.id),
            eq(userCards.cardId, foilCardId),
            eq(userCards.isFoil, 1),
          ))
          .limit(1);

        if (existingFoil.length > 0) {
          await db.update(userCards)
            .set({ quantity: existingFoil[0].quantity + 1 })
            .where(and(
              eq(userCards.userId, ctx.user.id),
              eq(userCards.cardId, foilCardId),
              eq(userCards.isFoil, 1),
            ));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id,
            cardId: foilCardId,
            quantity: 1,
            isFoil: 1,
            obtainedVia: "crafting_foil",
          });
        }

        await db.insert(craftingLog).values({
          userId: ctx.user.id,
          recipeType: recipe.id,
          inputCards: input.inputCardIds.map(id => ({ cardId: id, quantity: cardCounts[id] })),
          outputCardId: `${foilCardId}_foil`,
          success: 1,
          creditsCost: recipe.creditsCost,
        });

        trackCraftAction(ctx.user.id, foilCardDetail[0].rarity || undefined)
          .catch(e => logger.error("[Crafting] Achievement error:", e));

        await ripple.emit("craft_result", {
          userId: ctx.user.id,
          success: true,
          recipeId: input.recipeId,
          rarity: foilCardDetail[0].rarity,
        });

        return {
          success: true,
          message: `Upgraded ${foilCardDetail[0].name} to foil!`,
          outputCard: {
            cardId: foilCardDetail[0].cardId,
            name: foilCardDetail[0].name,
            rarity: foilCardDetail[0].rarity,
            imageUrl: foilCardDetail[0].imageUrl,
            power: foilCardDetail[0].power,
            health: foilCardDetail[0].health,
            isFoil: true,
          },
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
    const DEFAULT_SKILLS = (): Record<string, { level: number; xp: number }> => ({
      weaponsmith: { level: 1, xp: 0 },
      armorsmith: { level: 1, xp: 0 },
      enchanting: { level: 1, xp: 0 },
      alchemy: { level: 1, xp: 0 },
      engineering: { level: 1, xp: 0 },
    });

    const db = await getDb();
    if (!db) {
      return {
        skills: DEFAULT_SKILLS(),
        materials: {} as Record<string, number>,
        craftedItems: [] as Array<{ itemId: string; craftedAt: number }>,
      };
    }

    const row = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);
    const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;

    // Migrate skills: accept either Record<string, number> or
    // Record<string, {level, xp}>, normalise to the new shape.
    const skills = DEFAULT_SKILLS();
    const rawSkills = gameData.craftingSkills;
    if (rawSkills && typeof rawSkills === "object") {
      for (const [skillId, value] of Object.entries(rawSkills as Record<string, unknown>)) {
        if (typeof value === "number") {
          skills[skillId] = { level: Math.max(1, value), xp: 0 };
        } else if (value && typeof value === "object" && "level" in value) {
          const v = value as { level?: unknown; xp?: unknown };
          skills[skillId] = {
            level: typeof v.level === "number" ? v.level : 1,
            xp: typeof v.xp === "number" ? v.xp : 0,
          };
        }
      }
    }

    // Materials may live under gameData.materials (new) or
    // gameData.craftingMaterials (old gameState.save format).
    const rawMaterials =
      (gameData.materials as Record<string, number> | undefined) ??
      (gameData.craftingMaterials as Record<string, number> | undefined) ??
      {};

    return {
      skills,
      materials: { ...rawMaterials },
      craftedItems: (gameData.craftedItems ?? []) as Array<{ itemId: string; craftedAt: number }>,
    };
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
      skill: z.enum(["weaponsmith", "armorsmith", "enchanting", "alchemy", "engineering"]),
      requiredLevel: z.number(),
      materials: z.record(z.string(), z.number()), // materialId -> amount needed
      dreamCost: z.number(),
      baseSuccessRate: z.number(),
      xpGain: z.number(),
      outputItemId: z.string(),
      outputQuantity: z.number().default(1),
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

      // Migrate skills from either Record<string, number> (old gameState.save
      // format) or Record<string, {level, xp}> (new format).
      const skills: Record<string, { level: number; xp: number }> = {
        weaponsmith: { level: 1, xp: 0 },
        armorsmith: { level: 1, xp: 0 },
        enchanting: { level: 1, xp: 0 },
        alchemy: { level: 1, xp: 0 },
        engineering: { level: 1, xp: 0 },
      };
      const rawSkills = gameData.craftingSkills;
      if (rawSkills && typeof rawSkills === "object") {
        for (const [skillId, value] of Object.entries(rawSkills as Record<string, unknown>)) {
          if (typeof value === "number") {
            skills[skillId] = { level: Math.max(1, value), xp: 0 };
          } else if (value && typeof value === "object" && "level" in value) {
            const v = value as { level?: unknown; xp?: unknown };
            skills[skillId] = {
              level: typeof v.level === "number" ? v.level : 1,
              xp: typeof v.xp === "number" ? v.xp : 0,
            };
          }
        }
      }

      // Materials may live under .materials (new) or .craftingMaterials (old).
      const rawMaterials =
        (gameData.materials as Record<string, number> | undefined) ??
        (gameData.craftingMaterials as Record<string, number> | undefined) ??
        {};
      const materials = { ...rawMaterials };
      const craftedItems = [...((gameData.craftedItems ?? []) as Array<{ itemId: string; craftedAt: number }>)];

      // Validate skill level
      const playerSkillLevel = skills[input.skill]?.level ?? 1;
      if (playerSkillLevel < input.requiredLevel) {
        return { success: false, error: `Need ${input.skill} level ${input.requiredLevel}, have ${playerSkillLevel}` };
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
      skillData.xp += xpAwarded;

      // Level up check (XP thresholds: 0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000)
      const XP_THRESHOLDS = [0, 50, 120, 220, 360, 550, 800, 1100, 1500, 2000];
      while (skillData.level < 10 && skillData.xp >= (XP_THRESHOLDS[skillData.level] ?? Infinity)) {
        skillData.level++;
      }
      skills[input.skill] = skillData;

      // Add crafted item on success
      if (succeeded) {
        for (let i = 0; i < input.outputQuantity; i++) {
          craftedItems.push({ itemId: input.outputItemId, craftedAt: Date.now() });
        }
      }

      // Save state
      await db.update(userProgress)
        .set({ gameData: { ...gameData, craftingSkills: skills, materials, craftedItems } })
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

      await ripple.emit("craft_result", { userId: ctx.user.id, success: succeeded, recipeId: input.recipeId, rarity: "crafted" });

      return {
        success: true,
        crafted: succeeded,
        message: succeeded
          ? `Crafted ${input.outputItemId.replace(/_/g, " ")}!`
          : "Crafting failed — materials consumed, partial XP awarded.",
        xpAwarded,
        newSkillLevel: skillData.level,
        newSkillXp: skillData.xp,
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

  /**
   * §G.9 bench mutation — attempt to craft a suit recipe. Validates
   * the recipe id against the canonical registry, checks that the
   * operative is schematic-eligible for the set (creation-choice
   * gate per §G.7), rolls success against the recipe's base
   * percentage, and on success writes the piece into
   * citizenCharacters.gear keyed by slot.
   *
   * Material deduction awaits the suit-materials inventory system
   * (not yet on schema). This mutation is the load-bearing wire;
   * the material check drops in once the inventory lands.
   */
  attemptSuitCraft: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      let recipe: ReturnType<typeof getRecipe>;
      try {
        recipe = getRecipe(input.recipeId as SuitRecipeId);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown suit recipe id.",
        });
      }

      const [character] = await db
        .select()
        .from(citizenCharacters)
        .where(
          and(
            eq(citizenCharacters.userId, ctx.user.id),
            eq(citizenCharacters.isPrimary, 1),
          ),
        )
        .limit(1);
      if (!character) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Create a Citizen before crafting.",
        });
      }

      // §G.7 eligibility gate — creation-choice axes must line up.
      const operative: OperativeIdentity = {
        species: character.species as StarterSpecies,
        characterClass: character.characterClass as ClassKey,
        element: character.element as ElementKey,
        foundation: "humanity", // default until citizenCharacters.foundation column lands
      };
      const schematic = SCHEMATICS.find((s) => s.setId === recipe.setId);
      if (!schematic || !isSchematicEligibleForOperative(schematic, operative)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `This operative cannot craft the ${recipe.setId} set.`,
        });
      }

      // Material deduction is deferred until the suit-materials
      // inventory lands. Until then, the mutation grants-or-denies
      // based on the recipe's baseSuccessPct alone.

      const roll = Math.random() * 100;
      const succeeded = roll < recipe.baseSuccessPct;

      if (!succeeded) {
        // Plan §G.9 failure state: partial refund + "Ruined Draft."
        // Persist nothing (no materials system yet); surface a tag the
        // client can toast.
        return {
          success: false as const,
          recipeId: recipe.id,
          outcome: "ruined_draft" as const,
        };
      }

      const currentGear = (character.gear as Record<string, unknown>) ?? {};
      const pieceId = `${recipe.setId}:${recipe.rarity}:${recipe.slot}`;
      const nextGear: Record<string, unknown> = {
        ...currentGear,
        [recipe.slot]: {
          id: pieceId,
          setId: recipe.setId,
          rarity: recipe.rarity,
          slot: recipe.slot,
          source: "crafted",
        },
      };
      await db
        .update(citizenCharacters)
        .set({ gear: nextGear })
        .where(eq(citizenCharacters.id, character.id));

      logger.info(
        `[suit-craft] ${ctx.user.id} crafted ${pieceId} (roll ${roll.toFixed(2)}/${recipe.baseSuccessPct})`,
      );

      return {
        success: true as const,
        recipeId: recipe.id,
        piece: { id: pieceId, setId: recipe.setId, rarity: recipe.rarity, slot: recipe.slot },
      };
    }),
});
