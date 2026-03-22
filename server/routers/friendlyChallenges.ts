/**
 * FRIENDLY CHALLENGES ROUTER
 * ──────────────────────────────────────────────────
 * Unranked matches, custom rules, challenge of the day.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { friendlyChallenges, users } from "../../drizzle/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { CHALLENGE_RULES, getDailyChallenge } from "../../shared/friendlyChallenges";

export const friendlyChallengesRouter = router({
  /** Create a challenge */
  createChallenge: protectedProcedure
    .input(z.object({
      opponentId: z.number().optional(),
      gameType: z.string(),
      rules: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [result] = await db.insert(friendlyChallenges).values({
        challengerId: ctx.user.id,
        opponentId: input.opponentId ?? null,
        gameType: input.gameType,
        rules: input.rules || null,
        status: "pending",
      }).$returningId();
      return { challengeId: result.id };
    }),

  /** Accept a challenge */
  acceptChallenge: protectedProcedure
    .input(z.object({ challengeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [challenge] = await db.select().from(friendlyChallenges).where(eq(friendlyChallenges.id, input.challengeId));
      if (!challenge) throw new Error("Challenge not found");
      if (challenge.status !== "pending") throw new Error("Challenge already handled");
      if (challenge.opponentId && challenge.opponentId !== ctx.user.id) throw new Error("Not your challenge");

      await db.update(friendlyChallenges)
        .set({ opponentId: ctx.user.id, status: "active" })
        .where(eq(friendlyChallenges.id, input.challengeId));

      return { accepted: true };
    }),

  /** Complete a challenge */
  completeChallenge: protectedProcedure
    .input(z.object({ challengeId: z.number(), winnerId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(friendlyChallenges)
        .set({
          status: "completed",
          winnerId: input.winnerId ?? null,
          completedAt: new Date(),
        })
        .where(eq(friendlyChallenges.id, input.challengeId));
      return { completed: true };
    }),

  /** Get my challenges */
  getMyChallenges: protectedProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      let query = db.select().from(friendlyChallenges)
        .where(or(eq(friendlyChallenges.challengerId, ctx.user.id), eq(friendlyChallenges.opponentId, ctx.user.id)))
        .orderBy(desc(friendlyChallenges.createdAt))
        .limit(30);
      return query;
    }),

  /** Get open challenges (anyone can accept) */
  getOpenChallenges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(friendlyChallenges)
      .where(and(eq(friendlyChallenges.status, "pending")))
      .orderBy(desc(friendlyChallenges.createdAt))
      .limit(20);
  }),

  /** Get daily challenge */
  getDailyChallenge: protectedProcedure.query(async () => {
    const today = new Date().toISOString().slice(0, 10);
    return getDailyChallenge(today);
  }),

  /** Get available rules */
  getAvailableRules: protectedProcedure.query(async () => {
    return CHALLENGE_RULES;
  }),
});
