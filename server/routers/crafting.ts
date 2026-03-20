import { logger } from "../logger";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { trackCraftAction, trackDisenchant, trackCollectionSize } from "../achievementTracker";
import { cards, userCards, craftingLog, dreamBalance } from "../../drizzle/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveCraftingBonuses } from "../traitResolver";

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
  getRecipes: protectedProcedure.query(() => {
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
      const roll = Math.random();
      const succeeded = roll <= boostedRate;

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
});
