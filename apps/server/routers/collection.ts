import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userCards, decks, dreamBalance } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const collectionRouter = router({
  /* ─── Get all cards in user's collection ─── */
  getCollection: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const cards = await db
      .select()
      .from(userCards)
      .where(eq(userCards.userId, ctx.user.id));

    return cards;
  }),

  /* ─── Get all user's decks ─── */
  getDecks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const userDecks = await db
      .select()
      .from(decks)
      .where(and(eq(decks.userId, ctx.user.id), eq(decks.isActive, 1)));

    return userDecks;
  }),

  /* ─── Get a single deck with card list ─── */
  getDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const rows = await db
        .select()
        .from(decks)
        .where(
          and(
            eq(decks.id, input.deckId),
            eq(decks.userId, ctx.user.id),
            eq(decks.isActive, 1),
          )
        )
        .limit(1);

      if (rows.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }

      return rows[0];
    }),

  /* ─── Create a new deck ─── */
  createDeck: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        cardList: z.array(
          z.object({
            cardId: z.string(),
            quantity: z.number().int().min(1),
          })
        ),
        deckType: z.enum(["crypt", "library", "combined"]).default("combined"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.insert(decks).values({
        userId: ctx.user.id,
        name: input.name,
        cardList: input.cardList,
        deckType: input.deckType,
      });

      const insertedId = result[0].insertId;

      return { success: true, deckId: insertedId };
    }),

  /* ─── Update an existing deck ─── */
  updateDeck: protectedProcedure
    .input(
      z.object({
        deckId: z.number(),
        name: z.string().min(1).max(256).optional(),
        cardList: z
          .array(
            z.object({
              cardId: z.string(),
              quantity: z.number().int().min(1),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify ownership
      const existing = await db
        .select()
        .from(decks)
        .where(
          and(
            eq(decks.id, input.deckId),
            eq(decks.userId, ctx.user.id),
            eq(decks.isActive, 1),
          )
        )
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }

      const updates: Record<string, unknown> = {};
      if (input.name !== undefined) updates.name = input.name;
      if (input.cardList !== undefined) updates.cardList = input.cardList;

      if (Object.keys(updates).length === 0) {
        return { success: true };
      }

      await db
        .update(decks)
        .set(updates)
        .where(eq(decks.id, input.deckId));

      return { success: true };
    }),

  /* ─── Soft-delete a deck ─── */
  deleteDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify ownership
      const existing = await db
        .select()
        .from(decks)
        .where(
          and(
            eq(decks.id, input.deckId),
            eq(decks.userId, ctx.user.id),
            eq(decks.isActive, 1),
          )
        )
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deck not found" });
      }

      await db
        .update(decks)
        .set({ isActive: 0 })
        .where(eq(decks.id, input.deckId));

      return { success: true };
    }),

  /* ─── Get user's dream balance ─── */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const rows = await db
      .select({
        dreamTokens: dreamBalance.dreamTokens,
        soulBoundDream: dreamBalance.soulBoundDream,
        gems: dreamBalance.gems,
      })
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);

    if (rows.length === 0) {
      return { dreamTokens: 0, soulBoundDream: 0, gems: 0 };
    }

    return rows[0];
  }),
});
