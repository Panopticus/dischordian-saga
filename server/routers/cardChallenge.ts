import { logger } from "../logger";
/* ═══════════════════════════════════════════════════════
   CARD CHALLENGE ROUTER — Async multiplayer card battles
   Players challenge each other from the leaderboard.
   AI plays the defender's deck when they're offline.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cardGameMatches, users, userProgress } from "../../drizzle/schema";
import { eq, or, and, desc } from "drizzle-orm";
import { trackAiResult } from "../achievementTracker";

export const cardChallengeRouter = router({
  /**
   * Create a challenge — store attacker's deck snapshot.
   */
  create: protectedProcedure
    .input(z.object({
      targetUserId: z.number(),
      attackerDeck: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["unit", "spell", "artifact"]),
        cost: z.number(),
        attack: z.number(),
        defense: z.number(),
        ability: z.string().optional(),
        rarity: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      // Can't challenge yourself
      if (input.targetUserId === ctx.user.id) {
        return { success: false, error: "Cannot challenge yourself" };
      }

      // Check for existing pending challenge between these players
      const existing = await db
        .select()
        .from(cardGameMatches)
        .where(
          and(
            eq(cardGameMatches.player1Id, ctx.user.id),
            eq(cardGameMatches.player2Id, input.targetUserId),
            eq(cardGameMatches.status, "waiting"),
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: false, error: "Challenge already pending" };
      }

      await db.insert(cardGameMatches).values({
        player1Id: ctx.user.id,
        player2Id: input.targetUserId,
        status: "waiting",
        gameState: {
          attackerDeck: input.attackerDeck,
          defenderDeck: null,
          result: null,
          challengedAt: Date.now(),
        } as Record<string, unknown>,
      });

      return { success: true };
    }),

  /**
   * Get pending challenges (incoming + outgoing).
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { incoming: [], outgoing: [], completed: [] };

    const allMatches = await db
      .select({
        id: cardGameMatches.id,
        player1Id: cardGameMatches.player1Id,
        player2Id: cardGameMatches.player2Id,
        status: cardGameMatches.status,
        winnerId: cardGameMatches.winnerId,
        gameState: cardGameMatches.gameState,
        startedAt: cardGameMatches.startedAt,
        endedAt: cardGameMatches.endedAt,
        p1Name: users.name,
      })
      .from(cardGameMatches)
      .innerJoin(users, eq(cardGameMatches.player1Id, users.id))
      .where(
        or(
          eq(cardGameMatches.player1Id, ctx.user.id),
          eq(cardGameMatches.player2Id, ctx.user.id),
        )
      )
      .orderBy(desc(cardGameMatches.startedAt))
      .limit(50);

    // We need p2 names too — fetch separately
    const p2Ids = Array.from(new Set(allMatches.map(m => m.player2Id)));
    const p2Users: Record<number, string> = {};
    for (const pid of p2Ids) {
      const u = await db.select({ name: users.name }).from(users).where(eq(users.id, pid)).limit(1);
      p2Users[pid] = u[0]?.name ?? "Unknown";
    }

    const enriched = allMatches.map(m => ({
      id: m.id,
      player1Id: m.player1Id,
      player2Id: m.player2Id,
      player1Name: m.p1Name ?? "Unknown",
      player2Name: p2Users[m.player2Id] ?? "Unknown",
      status: m.status,
      winnerId: m.winnerId,
      gameState: m.gameState as Record<string, unknown>,
      startedAt: m.startedAt?.toISOString() ?? null,
      endedAt: m.endedAt?.toISOString() ?? null,
    }));

    return {
      incoming: enriched.filter(m => m.player2Id === ctx.user.id && m.status === "waiting"),
      outgoing: enriched.filter(m => m.player1Id === ctx.user.id && m.status === "waiting"),
      completed: enriched.filter(m => m.status === "completed").slice(0, 20),
    };
  }),

  /**
   * Accept and resolve a challenge.
   * Defender provides their deck, AI simulates the battle.
   */
  accept: protectedProcedure
    .input(z.object({
      matchId: z.number(),
      defenderDeck: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["unit", "spell", "artifact"]),
        cost: z.number(),
        attack: z.number(),
        defense: z.number(),
        ability: z.string().optional(),
        rarity: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const match = await db
        .select()
        .from(cardGameMatches)
        .where(
          and(
            eq(cardGameMatches.id, input.matchId),
            eq(cardGameMatches.player2Id, ctx.user.id),
            eq(cardGameMatches.status, "waiting"),
          )
        )
        .limit(1);

      if (!match[0]) return { success: false, error: "Challenge not found" };

      const gs = match[0].gameState as Record<string, unknown>;
      const attackerDeck = (gs.attackerDeck ?? []) as Array<Record<string, unknown>>;

      // Simulate battle — compare total deck power
      const attackerPower = attackerDeck.reduce((sum, c) => sum + ((c.attack as number) ?? 0) + ((c.defense as number) ?? 0), 0);
      const defenderPower = input.defenderDeck.reduce((sum, c) => sum + (c.attack ?? 0) + (c.defense ?? 0), 0);

      // Add randomness (±20%)
      const attackerRoll = attackerPower * (0.8 + Math.random() * 0.4);
      const defenderRoll = defenderPower * (0.8 + Math.random() * 0.4);

      const winnerId = attackerRoll > defenderRoll ? match[0].player1Id : ctx.user.id;
      const loserId = winnerId === match[0].player1Id ? ctx.user.id : match[0].player1Id;

      await db
        .update(cardGameMatches)
        .set({
          status: "completed",
          winnerId,
          gameState: {
            ...gs,
            defenderDeck: input.defenderDeck,
            result: {
              winnerId,
              loserId,
              attackerPower: Math.round(attackerRoll),
              defenderPower: Math.round(defenderRoll),
              resolvedAt: Date.now(),
            },
          } as Record<string, unknown>,
          result: {
            winnerId,
            loserId,
            margin: Math.abs(attackerRoll - defenderRoll),
          } as Record<string, unknown>,
          endedAt: new Date(),
        })
        .where(eq(cardGameMatches.id, input.matchId));

      // Award XP to winner
      const winnerProgress = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, winnerId))
        .limit(1);

      if (winnerProgress[0]) {
        await db
          .update(userProgress)
          .set({ xp: (winnerProgress[0].xp ?? 0) + 50, points: (winnerProgress[0].points ?? 0) + 25 })
          .where(eq(userProgress.userId, winnerId));
      }

      // Achievement auto-tracking for async PvP
      trackAiResult(winnerId, true).catch(e => logger.error("[CardChallenge] Achievement error:", e));
      trackAiResult(loserId, false).catch(e => logger.error("[CardChallenge] Achievement error:", e));

      // Award civil skill XP (tactics) to winner
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(winnerId, "win_card_battle").catch(() => {});

      return {
        success: true,
        winnerId,
        isWinner: winnerId === ctx.user.id,
        attackerPower: Math.round(attackerRoll),
        defenderPower: Math.round(defenderRoll),
      };
    }),

  /**
   * Decline a challenge.
   */
  decline: protectedProcedure
    .input(z.object({ matchId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db
        .update(cardGameMatches)
        .set({ status: "abandoned" })
        .where(
          and(
            eq(cardGameMatches.id, input.matchId),
            eq(cardGameMatches.player2Id, ctx.user.id),
            eq(cardGameMatches.status, "waiting"),
          )
        );

      return { success: true };
    }),
});
