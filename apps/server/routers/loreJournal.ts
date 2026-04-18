/**
 * LORE JOURNAL ROUTER
 * ──────────────────────────────────────────────────
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { awardFragments } from "../services/imprintService";
import { getImprintNpc } from "@shared/tcg-core";
import {
  loreJournalEntries, citizenCharacters, civilSkillProgress,
  writingStreaks,
} from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  JOURNAL_CATEGORIES, calculateWritingXP, resolveWritingBonuses,
  type JournalCategory,
} from "../../shared/loreJournal";
import { ripple } from "../services/rippleEngine";
import { battlePassXp } from "../services/battlePassXp";

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

      // Ripple: lore discovery triggers Antiquarian/Timelines event
      await ripple.emit("loredex_entry_discovered", { userId: ctx.user.id, entryId: input.linkedEntityId || "journal_entry", entryType: "journal" });
      // Battle pass XP: lore discovery
      battlePassXp.award(ctx.user.id, "lore_discovery").catch(() => {});

      // Grant card reward at 10 journal entries
      const entryCount = await db.select({ count: sql<number>`count(*)` }).from(loreJournalEntries)
        .where(eq(loreJournalEntries.userId, ctx.user.id));
      if (entryCount[0]?.count === 10) {
        try {
          await grantCardReward(ctx.user.id, "lore_journal_10");
        } catch (e) {
          logger.warn("Failed to grant lore journal card reward", e);
        }
      }

      // Phase F7 — when a journal entry is linked to an entity
      // that maps to an imprint NPC slug, grant 1 fragment to that
      // NPC. The linkedEntityId is free-form, so unknown ids
      // silently no-op via getImprintNpc returning undefined.
      if (input.linkedEntityId) {
        const npc = getImprintNpc(input.linkedEntityId);
        if (npc) {
          try {
            await awardFragments(db, {
              userId: ctx.user.id,
              npcSlug: npc.slug,
              source: "lore_entry",
              sourceDetail: `journal_${result.id}`,
            });
          } catch (e) {
            logger.warn(`[Imprints] lore_entry grant failed for ${npc.slug}`, e);
          }
        }
      }

      // Audit 5A — persist writing streaks to the dedicated
      // writing_streaks table. Orphan-table close: previously the
      // streak was only computed on-the-fly in getMyStats (still
      // works; this adds a denormalized cache the analytics /
      // achievements layer can read without a full scan).
      const todayStr = new Date().toISOString().slice(0, 10);
      const existingStreak = await db
        .select()
        .from(writingStreaks)
        .where(eq(writingStreaks.userId, ctx.user.id))
        .limit(1);
      if (existingStreak.length === 0) {
        await db.insert(writingStreaks).values({
          userId: ctx.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastWriteDate: todayStr,
          totalWordsWritten: wordCount,
          totalEntries: 1,
        });
      } else {
        const prior = existingStreak[0];
        const last = prior.lastWriteDate ?? "";
        let nextStreak = prior.currentStreak;
        if (last === todayStr) {
          // Same day — don't touch the streak, just accumulate totals.
        } else {
          // Compute whether yesterday was the last write day.
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
          nextStreak = last === yesterday ? prior.currentStreak + 1 : 1;
        }
        const nextLongest = Math.max(prior.longestStreak, nextStreak);
        await db
          .update(writingStreaks)
          .set({
            currentStreak: nextStreak,
            longestStreak: nextLongest,
            lastWriteDate: todayStr,
            totalWordsWritten: prior.totalWordsWritten + wordCount,
            totalEntries: prior.totalEntries + 1,
          })
          .where(eq(writingStreaks.userId, ctx.user.id));
      }

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
