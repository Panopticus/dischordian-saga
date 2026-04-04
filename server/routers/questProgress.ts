/* ═══════════════════════════════════════════════════════
   QUEST PROGRESS — Server-side quest tracking
   Persists daily/weekly/epoch quest progress per player.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";

export const questProgressRouter = router({
  /** Get all quest progress for the current player */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return {};
      const { userProgress } = await import("../../drizzle/schema");
      const result = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, "quest_progress")))
        .limit(1);
      if (!result[0]) return {};
      return JSON.parse(result[0].value);
    } catch { return {}; }
  }),

  /** Update progress for a specific quest */
  updateProgress: protectedProcedure
    .input(z.object({
      questId: z.string(),
      progress: z.number(),
      completed: z.boolean(),
      claimedReward: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };
        const { userProgress } = await import("../../drizzle/schema");
        const key = "quest_progress";

        // Load existing progress
        const existing = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)))
          .limit(1);

        const allProgress = existing[0] ? JSON.parse(existing[0].value) : {};
        allProgress[input.questId] = {
          questId: input.questId,
          progress: input.progress,
          completed: input.completed,
          claimedReward: input.claimedReward ?? false,
          updatedAt: Date.now(),
        };

        const value = JSON.stringify(allProgress);
        if (existing[0]) {
          await db.update(userProgress).set({ value, updatedAt: new Date() })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, key, value });
        }

        return { success: true };
      } catch { return { success: false }; }
    }),

  /** Claim a quest reward */
  claimReward: protectedProcedure
    .input(z.object({ questId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };
        const { userProgress, dreamBalance } = await import("../../drizzle/schema");
        const { sql } = await import("drizzle-orm");
        const key = "quest_progress";

        const existing = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)))
          .limit(1);

        if (!existing[0]) return { success: false };
        const allProgress = JSON.parse(existing[0].value);
        const quest = allProgress[input.questId];
        if (!quest || !quest.completed || quest.claimedReward) return { success: false };

        // Mark as claimed
        quest.claimedReward = true;
        quest.claimedAt = Date.now();
        await db.update(userProgress).set({ value: JSON.stringify(allProgress), updatedAt: new Date() })
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)));

        // Award Dream tokens if quest has dream reward
        // (The actual reward amounts are defined client-side in quests.ts)
        // This endpoint just marks the claim — client applies the reward

        return { success: true };
      } catch { return { success: false }; }
    }),

  /** Increment a quest counter (for tracking kills, wins, etc.) */
  increment: protectedProcedure
    .input(z.object({
      questId: z.string(),
      amount: z.number().default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return { success: false };
        const { userProgress } = await import("../../drizzle/schema");
        const key = "quest_progress";

        const existing = await db.select().from(userProgress)
          .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)))
          .limit(1);

        const allProgress = existing[0] ? JSON.parse(existing[0].value) : {};
        if (!allProgress[input.questId]) {
          allProgress[input.questId] = { questId: input.questId, progress: 0, completed: false, claimedReward: false };
        }
        allProgress[input.questId].progress += input.amount;
        allProgress[input.questId].updatedAt = Date.now();

        const value = JSON.stringify(allProgress);
        if (existing[0]) {
          await db.update(userProgress).set({ value, updatedAt: new Date() })
            .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.key, key)));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, key, value });
        }

        return { success: true, newProgress: allProgress[input.questId].progress };
      } catch { return { success: false }; }
    }),
});
