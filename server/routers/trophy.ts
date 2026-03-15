import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { trophyDisplays, userCards, cards } from "../../drizzle/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";

export const trophyRouter = router({
  // Get user's trophy displays
  myDisplays: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(trophyDisplays)
      .where(eq(trophyDisplays.userId, ctx.user.id))
      .orderBy(desc(trophyDisplays.updatedAt));
  }),

  // Get a public trophy display
  getDisplay: publicProcedure
    .input(z.object({ displayId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(trophyDisplays)
        .where(and(eq(trophyDisplays.id, input.displayId), eq(trophyDisplays.isPublic, 1)))
        .limit(1);
      if (!rows[0]) return null;

      // Resolve card details for displayed cards
      const cardIds = (rows[0].displayedCards ?? []) as string[];
      let cardDetails: any[] = [];
      if (cardIds.length > 0) {
        cardDetails = await db
          .select()
          .from(cards)
          .where(inArray(cards.cardId, cardIds));
      }

      return { display: rows[0], cards: cardDetails };
    }),

  // Create a new trophy display
  createDisplay: protectedProcedure
    .input(z.object({
      displayName: z.string().min(1).max(256),
      theme: z.enum([
        "panopticon", "insurgency", "babylon", "ark", "void",
        "crystal", "neon", "ancient", "digital", "custom"
      ]).default("ark"),
      displayedCards: z.array(z.string()).max(20).optional(),
      layout: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Verify user owns the cards
      if (input.displayedCards && input.displayedCards.length > 0) {
        const owned = await db
          .select()
          .from(userCards)
          .where(and(
            eq(userCards.userId, ctx.user.id),
            inArray(userCards.cardId, input.displayedCards)
          ));
        const ownedIds = new Set(owned.map(c => c.cardId));
        const allOwned = input.displayedCards.every(id => ownedIds.has(id));
        if (!allOwned) {
          return { success: false, message: "You can only display cards you own" };
        }
      }

      await db.insert(trophyDisplays).values({
        userId: ctx.user.id,
        displayName: input.displayName,
        theme: input.theme,
        displayedCards: input.displayedCards ?? [],
        layout: input.layout ?? {},
        isPublic: 1,
      });

      return { success: true };
    }),

  // Update a trophy display
  updateDisplay: protectedProcedure
    .input(z.object({
      displayId: z.number(),
      displayName: z.string().optional(),
      theme: z.enum([
        "panopticon", "insurgency", "babylon", "ark", "void",
        "crystal", "neon", "ancient", "digital", "custom"
      ]).optional(),
      displayedCards: z.array(z.string()).max(20).optional(),
      layout: z.record(z.string(), z.unknown()).optional(),
      isPublic: z.number().min(0).max(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const updateData: Record<string, unknown> = {};
      if (input.displayName) updateData.displayName = input.displayName;
      if (input.theme) updateData.theme = input.theme;
      if (input.displayedCards) updateData.displayedCards = input.displayedCards;
      if (input.layout) updateData.layout = input.layout;
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

      await db
        .update(trophyDisplays)
        .set(updateData)
        .where(and(eq(trophyDisplays.id, input.displayId), eq(trophyDisplays.userId, ctx.user.id)));

      return { success: true };
    }),

  // Delete a trophy display
  deleteDisplay: protectedProcedure
    .input(z.object({ displayId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Soft delete by making private
      await db
        .update(trophyDisplays)
        .set({ isPublic: 0 })
        .where(and(eq(trophyDisplays.id, input.displayId), eq(trophyDisplays.userId, ctx.user.id)));

      return { success: true };
    }),

  // Get collection stats for trophy display
  getCollectionStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalCards: 0, uniqueCards: 0, totalAvailable: 0, rarityBreakdown: [] };

    const [uniqueCount, totalCount, totalAvailable, rarityBreakdown] = await Promise.all([
      db.select({ count: sql<number>`COUNT(DISTINCT ${userCards.cardId})` })
        .from(userCards)
        .where(eq(userCards.userId, ctx.user.id)),
      db.select({ count: sql<number>`SUM(${userCards.quantity})` })
        .from(userCards)
        .where(eq(userCards.userId, ctx.user.id)),
      db.select({ count: sql<number>`COUNT(*)` }).from(cards).where(eq(cards.isActive, 1)),
      db.select({
        rarity: cards.rarity,
        owned: sql<number>`COUNT(DISTINCT ${userCards.cardId})`,
      })
        .from(cards)
        .leftJoin(userCards, and(eq(cards.cardId, userCards.cardId), eq(userCards.userId, ctx.user.id)))
        .where(eq(cards.isActive, 1))
        .groupBy(cards.rarity),
    ]);

    return {
      uniqueCards: Number(uniqueCount[0]?.count ?? 0),
      totalCards: Number(totalCount[0]?.count ?? 0),
      totalAvailable: Number(totalAvailable[0]?.count ?? 0),
      rarityBreakdown: rarityBreakdown.map(r => ({
        rarity: r.rarity,
        owned: Number(r.owned ?? 0),
      })),
    };
  }),
});
