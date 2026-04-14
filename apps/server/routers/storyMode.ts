import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { campaignProgress, campaignState, notifications } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { awardFragments } from "../services/imprintService";
import { CHAPTER_TO_IMPRINT_NPCS } from "@shared/tcg-core";

/* ═══════════════════════════════════════════════════════
   STORY MODE ROUTER — Campaign persistence (WS6)

   Tracks per-chapter completion, branch choices, morality
   axis shifts, and global campaign state. All chapter
   content/dialog lives client-side in storyModeChapters.ts;
   this router handles the state machine.
   ═══════════════════════════════════════════════════════ */

/** Chapter IDs that are always available from the start. */
const STARTING_CHAPTERS = ["ch1_dead_signal"];

/** Chapter unlock graph — completing a chapter unlocks the next. */
const CHAPTER_UNLOCK_GRAPH: Record<string, string[]> = {
  ch1_dead_signal: ["ch2_arenas_law"],
  ch2_arenas_law: ["ch3a_generals_honor", "ch3b_ghosts_gambit"],
  ch3a_generals_honor: ["ch4_red_death"],
  ch3b_ghosts_gambit: ["ch4_red_death"],
  ch4_red_death: ["ch5_dead_code_rising"],
  ch5_dead_code_rising: ["ch6_false_prophet"],
  ch6_false_prophet: ["ch7_project_vector"],
  ch7_project_vector: ["ch8_the_detective"],
  ch8_the_detective: ["ch9a_unknown_variable", "ch9b_gamblers_truth"],
  ch9a_unknown_variable: ["ch10_panoptic_warden"],
  ch9b_gamblers_truth: ["ch10_panoptic_warden"],
  ch10_panoptic_warden: ["ch11_harvesters_reckoning"],
  ch11_harvesters_reckoning: ["ch12_architects_design"],
};

export const storyModeRouter = router({
  /* ─── Get player's global campaign state ─── */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db.select().from(campaignState)
      .where(eq(campaignState.userId, ctx.user.id))
      .limit(1);

    if (!rows[0]) {
      // Auto-create initial state.
      const initial = {
        userId: ctx.user.id,
        currentChapter: 1,
        branches: {},
        moralityAxes: { truth: 0, defiance: 0, empathy: 0, acceptance: 0 },
        corruptionArcCompleted: [],
        sourceBossDefeated: 0,
        finaleCompleted: 0,
        totalStars: 0,
        unlockedFighters: [],
        unlockedVideos: [],
      };
      await db.insert(campaignState).values(initial);
      return initial;
    }
    return rows[0];
  }),

  /* ─── Get all chapter progress for a player ─── */
  getChapters: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const chapters = await db.select().from(campaignProgress)
      .where(eq(campaignProgress.userId, ctx.user.id));

    // Ensure starting chapters exist.
    const existing = new Set(chapters.map(c => c.chapterId));
    const toInsert = STARTING_CHAPTERS.filter(id => !existing.has(id));
    if (toInsert.length > 0) {
      await db.insert(campaignProgress).values(
        toInsert.map(chapterId => ({
          userId: ctx.user.id,
          chapterId,
          status: "unlocked" as const,
          stars: 0,
          completionCount: 0,
        }))
      );
      return db.select().from(campaignProgress)
        .where(eq(campaignProgress.userId, ctx.user.id));
    }
    return chapters;
  }),

  /* ─── Start a chapter ─── */
  startChapter: protectedProcedure
    .input(z.object({ chapterId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(campaignProgress)
        .where(and(
          eq(campaignProgress.userId, ctx.user.id),
          eq(campaignProgress.chapterId, input.chapterId),
        ))
        .limit(1);

      if (!rows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
      }
      if (rows[0].status === "locked") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Chapter is locked" });
      }

      await db.update(campaignProgress)
        .set({ status: "in_progress", lastPlayedAt: new Date() })
        .where(and(
          eq(campaignProgress.userId, ctx.user.id),
          eq(campaignProgress.chapterId, input.chapterId),
        ));

      return { ok: true };
    }),

  /* ─── Complete a chapter ─── */
  completeChapter: protectedProcedure
    .input(z.object({
      chapterId: z.string().min(1).max(64),
      stars: z.number().int().min(1).max(3),
      turns: z.number().int().min(1).optional(),
      matchId: z.number().int().optional(),
      dialogChoices: z.array(z.string()).optional(),
      branchChoice: z.object({
        key: z.string(),
        value: z.string(),
      }).optional(),
      moralityShifts: z.record(z.string(), z.number()).optional(),
      memoryFragment: z.string().optional(),
      powerGained: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(campaignProgress)
        .where(and(
          eq(campaignProgress.userId, ctx.user.id),
          eq(campaignProgress.chapterId, input.chapterId),
        ))
        .limit(1);

      if (!rows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
      }

      const existing = rows[0];
      const isFirstCompletion = existing.completionCount === 0;
      const newStars = Math.max(existing.stars, input.stars);
      const newBest = input.turns
        ? Math.min(existing.bestTurns ?? Infinity, input.turns)
        : existing.bestTurns;

      // Update chapter progress.
      await db.update(campaignProgress)
        .set({
          status: "completed",
          stars: newStars,
          completionCount: existing.completionCount + 1,
          bestTurns: newBest === Infinity ? null : newBest,
          matchId: input.matchId ?? existing.matchId,
          dialogChoices: input.dialogChoices ?? existing.dialogChoices,
          branchChoices: input.branchChoice
            ? { ...existing.branchChoices, [input.branchChoice.key]: input.branchChoice.value }
            : existing.branchChoices,
          moralityShifts: input.moralityShifts ?? existing.moralityShifts,
          memoryFragments: input.memoryFragment
            ? [...(existing.memoryFragments ?? []), input.memoryFragment]
            : existing.memoryFragments,
          powersGained: input.powerGained
            ? [...(existing.powersGained ?? []), input.powerGained]
            : existing.powersGained,
          firstCompletedAt: existing.firstCompletedAt ?? new Date(),
          lastPlayedAt: new Date(),
        })
        .where(and(
          eq(campaignProgress.userId, ctx.user.id),
          eq(campaignProgress.chapterId, input.chapterId),
        ));

      // Update global campaign state.
      const stateRows = await db.select().from(campaignState)
        .where(eq(campaignState.userId, ctx.user.id))
        .limit(1);

      if (stateRows[0]) {
        const state = stateRows[0];
        const axes = (state.moralityAxes ?? { truth: 0, defiance: 0, empathy: 0, acceptance: 0 }) as Record<string, number>;
        if (input.moralityShifts) {
          for (const [axis, shift] of Object.entries(input.moralityShifts)) {
            axes[axis] = (axes[axis] ?? 0) + shift;
          }
        }
        const branches = (state.branches ?? {}) as Record<string, string>;
        if (input.branchChoice) {
          branches[input.branchChoice.key] = input.branchChoice.value;
        }

        await db.update(campaignState)
          .set({
            moralityAxes: axes,
            branches,
            totalStars: (state.totalStars ?? 0) + (newStars - existing.stars),
          })
          .where(eq(campaignState.userId, ctx.user.id));
      }

      // Unlock next chapters.
      const nextChapters = CHAPTER_UNLOCK_GRAPH[input.chapterId] ?? [];
      if (nextChapters.length > 0 && isFirstCompletion) {
        for (const nextId of nextChapters) {
          const exists = await db.select().from(campaignProgress)
            .where(and(
              eq(campaignProgress.userId, ctx.user.id),
              eq(campaignProgress.chapterId, nextId),
            ))
            .limit(1);

          if (!exists[0]) {
            await db.insert(campaignProgress).values({
              userId: ctx.user.id,
              chapterId: nextId,
              status: "unlocked",
              stars: 0,
              completionCount: 0,
            });
          } else if (exists[0].status === "locked") {
            await db.update(campaignProgress)
              .set({ status: "unlocked" })
              .where(and(
                eq(campaignProgress.userId, ctx.user.id),
                eq(campaignProgress.chapterId, nextId),
              ));
          }
        }
      }

      // Send notification on first completion.
      if (isFirstCompletion) {
        try {
          await db.insert(notifications).values({
            userId: ctx.user.id,
            type: "achievement",
            title: "Chapter Completed!",
            message: `You completed ${input.chapterId} with ${input.stars} star${input.stars > 1 ? "s" : ""}!`,
            metadata: { chapterId: input.chapterId, stars: input.stars },
          });
        } catch (e) {
          logger.warn("Failed to send chapter completion notification", e);
        }
      }

      // Grant NPC imprint fragments for every NPC featured in this
      // chapter (Phase F4). Each chapter awards story_chapter (+5)
      // per featured NPC. Repeat completions also award fragments —
      // replaying a chapter is a valid path for grinding the higher
      // imprint tiers without forcing the player off the main loop.
      const imprintNpcs = CHAPTER_TO_IMPRINT_NPCS[input.chapterId] ?? [];
      const imprintGrants: Array<{ npcSlug: string; tiers: number[] }> = [];
      for (const npcSlug of imprintNpcs) {
        try {
          const result = await awardFragments(db, {
            userId: ctx.user.id,
            npcSlug,
            source: "story_chapter",
            sourceDetail: input.chapterId,
          });
          if (result.ok && result.unlockedTiers.length > 0) {
            imprintGrants.push({
              npcSlug,
              tiers: [...result.unlockedTiers],
            });
          }
        } catch (e) {
          logger.warn(`[Imprints] story_chapter grant failed for ${npcSlug}`, e);
        }
      }

      // Grant chapter-completion card reward on first completion.
      let cardReward: string | null = null;
      if (isFirstCompletion) {
        try {
          const chapterNum = input.chapterId.replace(/\D/g, "").slice(0, 2);
          const result = await grantCardReward(
            ctx.user.id,
            `campaign_ch${chapterNum}`,
            { moralityAxes: input.moralityShifts }
          );
          cardReward = result?.cardDefId ?? null;
        } catch (e) {
          logger.warn("Failed to grant chapter card reward", e);
        }
      }

      return {
        ok: true,
        stars: newStars,
        isFirstCompletion,
        nextChaptersUnlocked: isFirstCompletion ? nextChapters : [],
        cardReward,
        imprintGrants,
      };
    }),

  /* ─── Get morality summary ─── */
  getMorality: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { truth: 0, defiance: 0, empathy: 0, acceptance: 0 };

    const rows = await db.select().from(campaignState)
      .where(eq(campaignState.userId, ctx.user.id))
      .limit(1);

    return (rows[0]?.moralityAxes ?? { truth: 0, defiance: 0, empathy: 0, acceptance: 0 }) as Record<string, number>;
  }),

  /* ─── Record a finale vote ─── */
  castFinaleVote: protectedProcedure
    .input(z.object({
      vote: z.enum(["redemption", "sacrifice", "resurrection", "mercy"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const rows = await db.select().from(campaignState)
        .where(eq(campaignState.userId, ctx.user.id))
        .limit(1);

      if (!rows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No campaign state" });
      }
      if (!rows[0].sourceBossDefeated) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Source boss not defeated" });
      }

      await db.update(campaignState)
        .set({ finaleVote: input.vote, finaleCompleted: 1 })
        .where(eq(campaignState.userId, ctx.user.id));

      return { ok: true, vote: input.vote };
    }),

  /* ─── Campaign leaderboard (by total stars) ─── */
  leaderboard: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select({
        userId: campaignState.userId,
        totalStars: campaignState.totalStars,
        currentChapter: campaignState.currentChapter,
        finaleCompleted: campaignState.finaleCompleted,
      })
        .from(campaignState)
        .orderBy(desc(campaignState.totalStars))
        .limit(input.limit);
    }),
});
