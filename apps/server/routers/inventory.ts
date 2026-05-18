import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userCards, dreamBalance, cards } from "../../db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/* ═══ DISENCHANT VALUES BY RARITY ═══ */
const DISENCHANT_VALUES: Record<string, { dream: number; dust: number; essence: number }> = {
  common: { dream: 5, dust: 10, essence: 0 },
  uncommon: { dream: 10, dust: 20, essence: 1 },
  rare: { dream: 25, dust: 50, essence: 3 },
  epic: { dream: 50, dust: 100, essence: 8 },
  legendary: { dream: 100, dust: 200, essence: 15 },
  mythic: { dream: 250, dust: 500, essence: 30 },
};

/* ═══ CRAFTING MATERIAL TYPES ═══ */
const MATERIAL_TYPES = [
  "star_dust", "void_crystal", "neural_thread", "quantum_shard",
  "dream_essence", "shadow_ink", "chrono_flux", "bio_matrix",
  "cipher_key", "plasma_core", "echo_fragment", "null_stone",
] as const;

export const inventoryRouter = router({
  /* ─── Get full inventory summary ─── */
  summary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { cards: 0, materials: {}, dream: 0 };

    // Card count
    const cards = await db.select({
      total: sql<number>`SUM(${userCards.quantity})`,
    }).from(userCards).where(eq(userCards.userId, ctx.user.id));

    // Dream balance
    const balRow = await db.select().from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);

    return {
      cards: cards[0]?.total || 0,
      dream: balRow[0]?.dreamTokens || 0,
    };
  }),

  /* ─── Get all cards with quantities ─── */
  myCards: protectedProcedure
    .input(z.object({
      rarity: z.string().optional(),
      sortBy: z.enum(["name", "rarity", "quantity", "recent"]).default("recent"),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { cards: [], total: 0 };

      const query = db.select().from(userCards)
        .where(eq(userCards.userId, ctx.user.id))
        .$dynamic();

      const allCards = await query;

      // Filter by rarity using the cards table
      let filtered = allCards;
      if (input?.rarity) {
        const cardIds = allCards.map(c => c.cardId);
        if (cardIds.length > 0) {
          const matchingCards = await db.select({ cardId: cards.cardId })
            .from(cards)
            .where(and(inArray(cards.cardId, cardIds), eq(cards.rarity, input.rarity as any)));
          const matchingSet = new Set(matchingCards.map(c => c.cardId));
          filtered = allCards.filter(c => matchingSet.has(c.cardId));
        }
      }

      return { cards: filtered, total: filtered.length };
    }),

  /* ─── Disenchant cards ─── */
  disenchant: protectedProcedure
    .input(z.object({
      cardId: z.string(),
      quantity: z.number().min(1).max(99),
      rarity: z.string().default("common"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Calculate rewards
      const values = DISENCHANT_VALUES[input.rarity] || DISENCHANT_VALUES.common;
      const totalDream = values.dream * input.quantity;
      const totalDust = values.dust * input.quantity;
      const totalEssence = values.essence * input.quantity;

      // Execute card removal + Dream grant atomically
      const result = await db.transaction(async (tx) => {
        // Check ownership inside transaction
        const owned = await tx.select().from(userCards)
          .where(and(
            eq(userCards.userId, ctx.user.id),
            eq(userCards.cardId, input.cardId),
          ))
          .limit(1);

        if (!owned[0] || owned[0].quantity < input.quantity) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not enough cards to disenchant" });
        }

        // Remove cards
        const newQty = owned[0].quantity - input.quantity;
        if (newQty <= 0) {
          await tx.delete(userCards).where(eq(userCards.id, owned[0].id));
        } else {
          await tx.update(userCards)
            .set({ quantity: newQty })
            .where(eq(userCards.id, owned[0].id));
        }

        // Add Dream tokens
        if (totalDream > 0) {
          const bal = await tx.select().from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
          if (bal[0]) {
            await tx.update(dreamBalance)
              .set({ dreamTokens: bal[0].dreamTokens + totalDream, totalDreamEarned: bal[0].totalDreamEarned + totalDream })
              .where(eq(dreamBalance.id, bal[0].id));
          } else {
            await tx.insert(dreamBalance).values({
              userId: ctx.user.id,
              dreamTokens: totalDream,
              totalDreamEarned: totalDream,
            });
          }
        }

        return newQty > 0 ? newQty : 0;
      });

      return {
        success: true,
        rewards: {
          dream: totalDream,
          dust: totalDust,
          essence: totalEssence,
        },
        remainingCards: result,
      };
    }),

  /* ─── Bulk disenchant duplicates ─── */
  disenchantDuplicates: protectedProcedure
    .input(z.object({
      keepCount: z.number().min(1).max(4).default(2),
      rarity: z.string().optional(), // Only disenchant this rarity
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let totalDream = 0;
      let totalDust = 0;
      let totalEssence = 0;
      let cardsDisenchanted = 0;

      // Persist F8 — the duplicate-burn (N userCards quantity writes)
      // and the Dream credit must be atomic: a failure mid-loop must
      // not destroy cards without paying out, or pay out without
      // burning. Read inside the tx so the burn sees a consistent set.
      await db.transaction(async (tx) => {
        const allCards = await tx.select().from(userCards)
          .where(eq(userCards.userId, ctx.user.id));

        for (const card of allCards) {
          if (card.quantity <= input.keepCount) continue;

          const excess = card.quantity - input.keepCount;
          const values = DISENCHANT_VALUES.common; // Default rarity
          totalDream += values.dream * excess;
          totalDust += values.dust * excess;
          totalEssence += values.essence * excess;
          cardsDisenchanted += excess;

          await tx.update(userCards)
            .set({ quantity: input.keepCount })
            .where(eq(userCards.id, card.id));
        }

        // Add Dream tokens
        if (totalDream > 0) {
          const bal = await tx.select().from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
          if (bal[0]) {
            await tx.update(dreamBalance)
              .set({ dreamTokens: bal[0].dreamTokens + totalDream, totalDreamEarned: bal[0].totalDreamEarned + totalDream })
              .where(eq(dreamBalance.id, bal[0].id));
          }
        }
      });

      return {
        success: true,
        cardsDisenchanted,
        rewards: { dream: totalDream, dust: totalDust, essence: totalEssence },
      };
    }),

  /* ─── Get disenchant value preview ─── */
  disenchantPreview: protectedProcedure
    .input(z.object({
      rarity: z.string(),
      quantity: z.number().min(1),
    }))
    .query(({ input }) => {
      const values = DISENCHANT_VALUES[input.rarity] || DISENCHANT_VALUES.common;
      return {
        dream: values.dream * input.quantity,
        dust: values.dust * input.quantity,
        essence: values.essence * input.quantity,
      };
    }),
});
