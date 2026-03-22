/**
 * LORE JOURNAL ROUTER
 * ──────────────────────────────────────────────────
 * Personal journal, word count XP, writing streaks, RPG integration.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  loreJournalEntries, citizenCharacters, civilSkillProgress,
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  JOURNAL_CATEGORIES, calculateWritingXP, resolveWritingBonuses,
  type JournalCategory,
} from "../../shared/loreJournal";

export const loreJournalRouter = router({
  /** Get my journal entries */
  getMyEntries: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(loreJournalEntries)
        .where(eq(loreJournalEntries.userId, ctx.user.id))
        .orderBy(desc(loreJournalEntries.createdAt))
        .limit(input.limit);
    }),

  /** Create a journal entry */
  createEntry: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(10).max(50000),
      category: z.string().default("general"),
      linkedEntityId: z.string().optional(),
      published: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // Get RPG state for XP calculation
      const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
      const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
      const skillMap: Record<string, number> = {};
      for (const s of civilSkills) skillMap[s.skillKey] = s.level;

      const wordCount = input.content.split(/\s+/).filter(Boolean).length;
      const bonuses = resolveWritingBonuses({
        characterClass: char?.characterClass,
        civilSkills: skillMap,
      });
      const xpEarned = calculateWritingXP(wordCount, input.category as JournalCategory, bonuses);

      const [result] = await db.insert(loreJournalEntries).values({
        userId: ctx.user.id,
        title: input.title,
        content: input.content,
        category: input.category,
        linkedEntityId: input.linkedEntityId ?? null,
        wordCount,
        xpEarned,
        published: input.published,
      }).$returningId();

      return { entryId: result.id, wordCount, xpEarned };
    }),

  /** Update a journal entry */
  updateEntry: protectedProcedure
    .input(z.object({
      entryId: z.number(),
      title: z.string().min(1).max(200).optional(),
      content: z.string().min(10).max(50000).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [entry] = await db.select().from(loreJournalEntries)
        .where(and(eq(loreJournalEntries.id, input.entryId), eq(loreJournalEntries.userId, ctx.user.id)));
      if (!entry) throw new Error("Entry not found");

      const updates: Record<string, unknown> = {};
      if (input.title) updates.title = input.title;
      if (input.content) {
        updates.content = input.content;
        updates.wordCount = input.content.split(/\s+/).filter(Boolean).length;
      }
      if (input.published !== undefined) updates.published = input.published;

      await db.update(loreJournalEntries)
        .set(updates)
        .where(eq(loreJournalEntries.id, input.entryId));
      return { updated: true };
    }),

  /** Delete a journal entry */
  deleteEntry: protectedProcedure
    .input(z.object({ entryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [entry] = await db.select().from(loreJournalEntries)
        .where(and(eq(loreJournalEntries.id, input.entryId), eq(loreJournalEntries.userId, ctx.user.id)));
      if (!entry) throw new Error("Entry not found");

      await db.delete(loreJournalEntries).where(eq(loreJournalEntries.id, input.entryId));
      return { deleted: true };
    }),

  /** Get public entries (community) */
  getPublicEntries: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.select().from(loreJournalEntries)
        .where(eq(loreJournalEntries.published, true))
        .orderBy(desc(loreJournalEntries.createdAt))
        .limit(input.limit);
    }),

  /** Get writing stats */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const entries = await db.select().from(loreJournalEntries)
      .where(eq(loreJournalEntries.userId, ctx.user.id));

    const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
    const totalXp = entries.reduce((sum, e) => sum + (e.xpEarned || 0), 0);
    const totalEntries = entries.length;

    // Calculate writing streak
    const sortedDates = entries
      .map(e => new Date(e.createdAt).toISOString().slice(0, 10))
      .sort()
      .reverse();
    const uniqueDates = Array.from(new Set(sortedDates));
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      if (uniqueDates[i] === expected) streak++;
      else break;
    }

    return { totalWords, totalXp, totalEntries, writingStreak: streak };
  }),

  /** Get journal categories */
  getCategories: publicProcedure.query(async () => {
    return JOURNAL_CATEGORIES;
  }),
});
