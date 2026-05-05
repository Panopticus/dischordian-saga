/**
 * @deprecated Concept merged into `dailyQuests.ts` (registered as
 * `trpc.quests`). This router has no client surface and no internal
 * server callers. Scheduled for deletion in audit Phase E1; see
 * docs/HIDDEN_SYSTEMS_AUDIT_2026-05.md §2.1.
 *
 * QUEST PROGRESS — Server-side quest tracking
 * Persists daily/weekly/epoch quest progress per player.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";

export const questProgressRouter = router({
  /** Get all quest progress for the current player */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) return {};
      const { userProgress } = await import("../../db/schema");
      const result = await db.select().from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);
      if (!result[0]) return {};
      const data = result[0].progressData as Record<string, unknown> | null;
      const questProgress = data?.quest_progress;
      if (!questProgress || typeof questProgress !== "object") return {};
      return questProgress as Record<string, unknown>;
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
        const { userProgress } = await import("../../db/schema");

        // Load existing progress
        const existing = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        const progressData = (existing[0]?.progressData as Record<string, unknown> | null) ?? {};
        const allProgress = (typeof progressData.quest_progress === "object" && progressData.quest_progress !== null
          ? progressData.quest_progress : {}) as Record<string, unknown>;
        allProgress[input.questId] = {
          questId: input.questId,
          progress: input.progress,
          completed: input.completed,
          claimedReward: input.claimedReward ?? false,
          updatedAt: Date.now(),
        };

        const newProgressData = { ...progressData, quest_progress: allProgress };
        if (existing[0]) {
          await db.update(userProgress).set({ progressData: newProgressData, updatedAt: new Date() })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, progressData: newProgressData });
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
        const { userProgress } = await import("../../db/schema");

        const existing = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        if (!existing[0]) return { success: false };
        const progressData = (existing[0].progressData as Record<string, unknown> | null) ?? {};
        const allProgress = (typeof progressData.quest_progress === "object" && progressData.quest_progress !== null
          ? progressData.quest_progress : {}) as Record<string, unknown>;
        const quest = allProgress[input.questId] as Record<string, unknown> | undefined;
        if (!quest || !quest.completed || quest.claimedReward) return { success: false };

        // Mark as claimed
        quest.claimedReward = true;
        quest.claimedAt = Date.now();
        const newProgressData = { ...progressData, quest_progress: allProgress };
        await db.update(userProgress).set({ progressData: newProgressData, updatedAt: new Date() })
          .where(eq(userProgress.userId, ctx.user.id));

        // Award Dream tokens if quest has dream reward
        // (The actual reward amounts are defined client-side in quests.ts)
        // This endpoint just marks the claim — client applies the reward

        await ripple.emit("quest_completed", { userId: ctx.user.id, questId: input.questId });

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
        const { userProgress } = await import("../../db/schema");

        const existing = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        const progressData = (existing[0]?.progressData as Record<string, unknown> | null) ?? {};
        const allProgress = (typeof progressData.quest_progress === "object" && progressData.quest_progress !== null
          ? progressData.quest_progress : {}) as Record<string, unknown>;
        if (!allProgress[input.questId]) {
          allProgress[input.questId] = { questId: input.questId, progress: 0, completed: false, claimedReward: false };
        }
        const quest = allProgress[input.questId] as Record<string, unknown>;
        quest.progress = (quest.progress as number) + input.amount;
        quest.updatedAt = Date.now();

        const newProgressData = { ...progressData, quest_progress: allProgress };
        if (existing[0]) {
          await db.update(userProgress).set({ progressData: newProgressData, updatedAt: new Date() })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({ userId: ctx.user.id, progressData: newProgressData });
        }

        return { success: true, newProgress: quest.progress as number };
      } catch { return { success: false }; }
    }),
});
