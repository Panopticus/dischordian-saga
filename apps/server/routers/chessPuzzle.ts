/* ═══════════════════════════════════════════════════════
   CHESS PUZZLES — daily rotation + solve submission + streak.

   The `chess_puzzle_progress` table (from 0043) already tracks
   which puzzles each user has solved. This router surfaces the
   daily rotation picked deterministically by day-of-year, and
   provides submit + streak endpoints.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, desc, and, gte } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { chessPuzzleProgress, chessGameReviews } from "../../db/schema";
import {
  CHESS_PUZZLES,
  getDailyPuzzle,
  validateSolution,
} from "@shared/chessPuzzles";

/** Day-of-year in UTC for the caller's current date. */
function currentDayOfYear(): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  return Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));
}

export const chessPuzzleRouter = router({
  /** The puzzle for today, with solution stripped. Everyone on
   *  the same UTC date gets the same puzzle. */
  puzzleOfTheDay: protectedProcedure.query(async () => {
    const day = currentDayOfYear();
    const puzzle = getDailyPuzzle(day);
    const { solutionMoves: _s, ...rest } = puzzle;
    return { day, puzzle: rest };
  }),

  /** Submit a solution. Returns correct/incorrect; on correct,
   *  records the solve idempotently. */
  submitPuzzleSolution: protectedProcedure
    .input(
      z.object({
        puzzleId: z.string().min(1),
        moves: z.array(z.string()).min(1).max(16),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const correct = validateSolution(input.puzzleId, input.moves);
      if (!correct) return { correct: false as const };

      const db = (await getDb())!;
      await db
        .insert(chessPuzzleProgress)
        .values({
          userId: ctx.user.id,
          puzzleId: input.puzzleId,
          solvedAt: new Date(),
          attempts: 1,
        })
        .onDuplicateKeyUpdate({
          set: { attempts: 1 }, // idempotent — solved row already exists
        });
      return { correct: true as const };
    }),

  /** Consecutive-day solve streak. We look back up to 90 days of
   *  solve rows and count the trailing run of distinct days
   *  that includes today or yesterday. */
  getPuzzleStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const earliest = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const rows = await db
      .select({ solvedAt: chessPuzzleProgress.solvedAt })
      .from(chessPuzzleProgress)
      .where(
        and(
          eq(chessPuzzleProgress.userId, ctx.user.id),
          gte(chessPuzzleProgress.solvedAt, earliest),
        ),
      )
      .orderBy(desc(chessPuzzleProgress.solvedAt));

    // Bucket each solve to UTC day-of-year, newest first.
    const days = new Set<string>();
    for (const r of rows) {
      const d = r.solvedAt;
      if (!d) continue;
      days.add(
        `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`,
      );
    }

    // Count the trailing streak. Walk backwards from today; stop
    // on the first missing day.
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      if (days.has(key)) streak += 1;
      else if (i === 0) {
        // Missing today is fine IFF yesterday is solved — we
        // start counting from yesterday in that case.
        continue;
      } else {
        break;
      }
    }
    return { streak, totalSolved: days.size };
  }),

  /** Save a post-game review (PGN + classified mistakes) so the
   *  Game Master can reference specific games later. */
  saveGameReview: protectedProcedure
    .input(
      z.object({
        pgn: z.string().min(1).max(20000),
        playerSide: z.enum(["white", "black"]),
        mistakes: z
          .array(
            z.object({
              moveNumber: z.number().int().min(1).max(300),
              side: z.enum(["white", "black"]),
              type: z.string().min(1).max(64),
              centipawnLoss: z.number().min(0).max(10000),
              substitutions: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
            }),
          )
          .min(0)
          .max(50),
        summary: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      await db.insert(chessGameReviews).values({
        userId: ctx.user.id,
        pgn: input.pgn,
        playerSide: input.playerSide,
        mistakes: input.mistakes,
        summary: input.summary ?? null,
      });
      return { ok: true };
    }),

  /** Read-only recent review history for this user. */
  getMyGameReviews: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db
        .select()
        .from(chessGameReviews)
        .where(eq(chessGameReviews.userId, ctx.user.id))
        .orderBy(desc(chessGameReviews.createdAt))
        .limit(input.limit);
      return rows;
    }),

  /** Admin/preview: list all puzzles' ids + themes so the daily
   *  rotation is debuggable. */
  listAllPuzzleIds: protectedProcedure.query(async () => {
    return CHESS_PUZZLES.map((p) => ({
      id: p.id,
      category: p.category,
      theme: p.theme,
      difficulty: p.difficulty,
    }));
  }),
});
