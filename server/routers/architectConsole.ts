/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S CONSOLE — Admin Surveillance & Control
   Lore-native admin panel: analytics, community votes,
   live event management, resource awards, audit logging.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  users,
  userProgress,
  characterSheets,
  cards,
  userCards,
  fightMatches,
  fightLeaderboard,
  cardGameMatches,
  dreamBalance,
  communityVotes,
  voteOptions,
  playerVotes,
  adminEvents,
  adminAuditLog,
} from "../../drizzle/schema";
import { eq, sql, desc, and, lte, gte, or, isNull, type SQL } from "drizzle-orm";

/* ─── Helper: write audit log ─── */
async function auditLog(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, adminId: number, action: string, details?: unknown) {
  await db.insert(adminAuditLog).values({
    adminId,
    action,
    details: details as any,
  });
}

export const architectConsoleRouter = router({
  // ═══════════════════════════════════════════════════
  //  ANALYTICS
  // ═══════════════════════════════════════════════════

  /** High-level dashboard metrics: player counts, DAU approximation */
  getDashboardMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      [totalUsers],
      [dauCount],
      [wauCount],
      [totalCharacters],
    ] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(users),
      db.select({ count: sql<number>`COUNT(*)` }).from(users).where(gte(users.lastSignedIn, oneDayAgo)),
      db.select({ count: sql<number>`COUNT(*)` }).from(users).where(gte(users.lastSignedIn, sevenDaysAgo)),
      db.select({ count: sql<number>`COUNT(*)` }).from(characterSheets),
    ]);

    return {
      totalUsers: Number(totalUsers?.count ?? 0),
      dailyActiveUsers: Number(dauCount?.count ?? 0),
      weeklyActiveUsers: Number(wauCount?.count ?? 0),
      totalCharacters: Number(totalCharacters?.count ?? 0),
    };
  }),

  /** Aggregate game stats: fights, cards, matches */
  getGameMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const [
      [totalCards],
      [totalUserCards],
      [totalFights],
      [totalCardMatches],
    ] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(cards),
      db.select({ count: sql<number>`COUNT(*)` }).from(userCards),
      db.select({ count: sql<number>`COUNT(*)` }).from(fightMatches),
      db.select({ count: sql<number>`COUNT(*)` }).from(cardGameMatches),
    ]);

    return {
      totalCards: Number(totalCards?.count ?? 0),
      totalUserCards: Number(totalUserCards?.count ?? 0),
      totalFightMatches: Number(totalFights?.count ?? 0),
      totalCardGameMatches: Number(totalCardMatches?.count ?? 0),
    };
  }),

  /** Morality alignment distribution across all characters */
  getMoralityDistribution: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db.select({
      bucket: sql<string>`
        CASE
          WHEN ${characterSheets.moralityScore} <= -50 THEN 'machine'
          WHEN ${characterSheets.moralityScore} < 0 THEN 'leaning_machine'
          WHEN ${characterSheets.moralityScore} = 0 THEN 'neutral'
          WHEN ${characterSheets.moralityScore} <= 50 THEN 'leaning_humanity'
          ELSE 'humanity'
        END
      `,
      count: sql<number>`COUNT(*)`,
    }).from(characterSheets).groupBy(sql`bucket`);

    const distribution: Record<string, number> = {
      machine: 0,
      leaning_machine: 0,
      neutral: 0,
      leaning_humanity: 0,
      humanity: 0,
    };
    for (const row of rows) {
      distribution[row.bucket] = Number(row.count);
    }
    return distribution;
  }),

  /** Species choice distribution */
  getSpeciesDistribution: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db.select({
      species: characterSheets.species,
      count: sql<number>`COUNT(*)`,
    }).from(characterSheets).groupBy(characterSheets.species);

    const distribution: Record<string, number> = {};
    for (const row of rows) {
      distribution[row.species ?? "unknown"] = Number(row.count);
    }
    return distribution;
  }),

  // ═══════════════════════════════════════════════════
  //  COMMUNITY VOTES
  // ═══════════════════════════════════════════════════

  /** Create a community vote with 3-5 options */
  createVote: adminProcedure
    .input(z.object({
      voteId: z.string().min(1).max(128),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.enum(["lore", "event", "content", "quest", "sacrifice"]),
      endsAt: z.string().datetime(),
      impactType: z.string().max(128).optional(),
      impactPayload: z.record(z.string(), z.unknown()).optional(),
      options: z.array(z.object({
        optionNumber: z.number().int().min(1),
        optionText: z.string().min(1).max(255),
        description: z.string().optional(),
        rewardOnWin: z.record(z.string(), z.unknown()).optional(),
      })).min(3).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(communityVotes).values({
        voteId: input.voteId,
        title: input.title,
        description: input.description,
        category: input.category,
        endsAt: new Date(input.endsAt),
        impactType: input.impactType,
        impactPayload: input.impactPayload as any,
        createdBy: ctx.user.id,
      });

      await db.insert(voteOptions).values(
        input.options.map(opt => ({
          voteId: input.voteId,
          optionNumber: opt.optionNumber,
          optionText: opt.optionText,
          description: opt.description,
          rewardOnWin: opt.rewardOnWin as any,
        })),
      );

      await auditLog(db, ctx.user.id, "create_vote", { voteId: input.voteId, title: input.title });
      return { success: true, voteId: input.voteId };
    }),

  /** List all votes with stats (admin) */
  listVotes: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(25),
      status: z.enum(["active", "closed", "announced"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { votes: [], total: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 25;
      const offset = (page - 1) * limit;

      const conditions: SQL[] = [];
      if (input?.status) {
        conditions.push(eq(communityVotes.status, input.status));
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [votes, countResult] = await Promise.all([
        db.select().from(communityVotes).where(whereClause).orderBy(desc(communityVotes.createdAt)).limit(limit).offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(communityVotes).where(whereClause),
      ]);

      // Fetch options for each vote
      const voteIds = votes.map(v => v.voteId);
      const allOptions = voteIds.length > 0
        ? await db.select().from(voteOptions).where(
            sql`${voteOptions.voteId} IN (${sql.join(voteIds.map(id => sql`${id}`), sql`,`)})`
          )
        : [];

      const optionsByVote = new Map<string, typeof allOptions>();
      for (const opt of allOptions) {
        const existing = optionsByVote.get(opt.voteId) ?? [];
        existing.push(opt);
        optionsByVote.set(opt.voteId, existing);
      }

      return {
        votes: votes.map(v => ({
          ...v,
          options: optionsByVote.get(v.voteId) ?? [],
        })),
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  /** Close voting and declare winner */
  closeVote: adminProcedure
    .input(z.object({
      voteId: z.string(),
      winnerOptionNumber: z.number().int().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Verify vote exists and is active
      const [vote] = await db.select().from(communityVotes).where(eq(communityVotes.voteId, input.voteId)).limit(1);
      if (!vote) throw new TRPCError({ code: "NOT_FOUND", message: "Vote not found" });
      if (vote.status !== "active") throw new TRPCError({ code: "BAD_REQUEST", message: "Vote is not active" });

      // Close the vote
      await db.update(communityVotes)
        .set({ status: "closed" })
        .where(eq(communityVotes.voteId, input.voteId));

      // Mark the winner
      await db.update(voteOptions)
        .set({ isWinner: true })
        .where(and(
          eq(voteOptions.voteId, input.voteId),
          eq(voteOptions.optionNumber, input.winnerOptionNumber),
        ));

      await auditLog(db, ctx.user.id, "close_vote", { voteId: input.voteId, winner: input.winnerOptionNumber });
      return { success: true };
    }),

  /** Cast a vote — one per user per vote (player) */
  submitVote: protectedProcedure
    .input(z.object({
      voteId: z.string(),
      optionNumber: z.number().int().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Verify vote is active
      const [vote] = await db.select().from(communityVotes).where(eq(communityVotes.voteId, input.voteId)).limit(1);
      if (!vote) throw new TRPCError({ code: "NOT_FOUND", message: "Vote not found" });
      if (vote.status !== "active") throw new TRPCError({ code: "BAD_REQUEST", message: "Voting is closed" });
      if (new Date() > vote.endsAt) throw new TRPCError({ code: "BAD_REQUEST", message: "Voting period has ended" });

      // Check option exists
      const [option] = await db.select().from(voteOptions)
        .where(and(eq(voteOptions.voteId, input.voteId), eq(voteOptions.optionNumber, input.optionNumber)))
        .limit(1);
      if (!option) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid option" });

      // Check if user already voted
      const [existing] = await db.select().from(playerVotes)
        .where(and(eq(playerVotes.voteId, input.voteId), eq(playerVotes.userId, ctx.user.id)))
        .limit(1);
      if (existing) throw new TRPCError({ code: "BAD_REQUEST", message: "You have already voted" });

      // Cast vote
      await db.insert(playerVotes).values({
        voteId: input.voteId,
        userId: ctx.user.id,
        optionNumber: input.optionNumber,
      });

      // Increment vote count
      await db.update(voteOptions)
        .set({ voteCount: sql`${voteOptions.voteCount} + 1` })
        .where(and(eq(voteOptions.voteId, input.voteId), eq(voteOptions.optionNumber, input.optionNumber)));

      return { success: true };
    }),

  /** Get current active votes for player UI */
  getActiveVotes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const now = new Date();
    const activeVotes = await db.select().from(communityVotes)
      .where(and(
        eq(communityVotes.status, "active"),
        gte(communityVotes.endsAt, now),
      ))
      .orderBy(desc(communityVotes.createdAt));

    if (activeVotes.length === 0) return [];

    const voteIds = activeVotes.map(v => v.voteId);
    const allOptions = await db.select().from(voteOptions).where(
      sql`${voteOptions.voteId} IN (${sql.join(voteIds.map(id => sql`${id}`), sql`,`)})`
    );

    // Check which votes the user has already voted on
    const userVotes = await db.select().from(playerVotes)
      .where(and(
        eq(playerVotes.userId, ctx.user.id),
        sql`${playerVotes.voteId} IN (${sql.join(voteIds.map(id => sql`${id}`), sql`,`)})`,
      ));

    const userVoteMap = new Map<string, number>();
    for (const uv of userVotes) {
      userVoteMap.set(uv.voteId, uv.optionNumber);
    }

    const optionsByVote = new Map<string, typeof allOptions>();
    for (const opt of allOptions) {
      const existing = optionsByVote.get(opt.voteId) ?? [];
      existing.push(opt);
      optionsByVote.set(opt.voteId, existing);
    }

    return activeVotes.map(v => ({
      ...v,
      options: optionsByVote.get(v.voteId) ?? [],
      userVotedOption: userVoteMap.get(v.voteId) ?? null,
    }));
  }),

  // ═══════════════════════════════════════════════════
  //  EVENT MANAGEMENT
  // ═══════════════════════════════════════════════════

  /** Create an admin event */
  createEvent: adminProcedure
    .input(z.object({
      eventKey: z.string().min(1).max(128),
      eventName: z.string().min(1).max(255),
      eventType: z.enum(["notification", "living_universe", "seasonal_bonus", "instance_spawn", "narrative_trigger", "multiplier"]),
      message: z.string().optional(),
      targetAudience: z.enum(["all", "by_level", "by_guild", "specific"]).default("all"),
      targetPayload: z.record(z.string(), z.unknown()).optional(),
      gameStateChanges: z.record(z.string(), z.unknown()).optional(),
      scheduledFor: z.string().datetime().optional(),
      expiresAt: z.string().datetime().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(adminEvents).values({
        eventKey: input.eventKey,
        eventName: input.eventName,
        eventType: input.eventType,
        message: input.message,
        targetAudience: input.targetAudience,
        targetPayload: input.targetPayload as any,
        gameStateChanges: input.gameStateChanges as any,
        scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        createdBy: ctx.user.id,
      });

      await auditLog(db, ctx.user.id, "create_event", { eventKey: input.eventKey, eventName: input.eventName });
      return { success: true, eventKey: input.eventKey };
    }),

  /** Activate an event immediately */
  activateEvent: adminProcedure
    .input(z.object({ eventKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const [event] = await db.select().from(adminEvents).where(eq(adminEvents.eventKey, input.eventKey)).limit(1);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      await db.update(adminEvents)
        .set({ isActive: true, activatedAt: new Date() })
        .where(eq(adminEvents.eventKey, input.eventKey));

      await auditLog(db, ctx.user.id, "activate_event", { eventKey: input.eventKey });
      return { success: true };
    }),

  /** Deactivate a running event */
  deactivateEvent: adminProcedure
    .input(z.object({ eventKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const [event] = await db.select().from(adminEvents).where(eq(adminEvents.eventKey, input.eventKey)).limit(1);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      await db.update(adminEvents)
        .set({ isActive: false })
        .where(eq(adminEvents.eventKey, input.eventKey));

      await auditLog(db, ctx.user.id, "deactivate_event", { eventKey: input.eventKey });
      return { success: true };
    }),

  /** List all events with status (admin) */
  listEvents: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(25),
      activeOnly: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { events: [], total: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 25;
      const offset = (page - 1) * limit;

      const conditions: SQL[] = [];
      if (input?.activeOnly) {
        conditions.push(eq(adminEvents.isActive, true));
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [events, countResult] = await Promise.all([
        db.select().from(adminEvents).where(whereClause).orderBy(desc(adminEvents.createdAt)).limit(limit).offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(adminEvents).where(whereClause),
      ]);

      return {
        events,
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  /** Get events affecting the current player */
  getActiveEvents: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const now = new Date();

    // Get all active events that haven't expired
    const events = await db.select().from(adminEvents).where(
      and(
        eq(adminEvents.isActive, true),
        or(
          isNull(adminEvents.expiresAt),
          gte(adminEvents.expiresAt, now),
        ),
      ),
    ).orderBy(desc(adminEvents.activatedAt));

    // Filter by target audience
    // For "all" events, always include. For targeted events, check player context.
    const character = await db.select().from(characterSheets)
      .where(eq(characterSheets.userId, ctx.user.id))
      .limit(1);

    const playerLevel = character[0]
      ? (await db.select().from(userProgress).where(eq(userProgress.userId, ctx.user.id)).limit(1))[0]?.level ?? 1
      : 1;

    return events.filter(event => {
      if (event.targetAudience === "all") return true;
      const payload = event.targetPayload as Record<string, any> | null;
      if (!payload) return true;

      if (event.targetAudience === "by_level" && payload.minLevel) {
        return playerLevel >= payload.minLevel;
      }
      if (event.targetAudience === "specific" && payload.playerIds) {
        return (payload.playerIds as number[]).includes(ctx.user.id);
      }
      // by_guild would require guild membership check — include by default for now
      return true;
    }).map(event => ({
      eventKey: event.eventKey,
      eventName: event.eventName,
      eventType: event.eventType,
      message: event.message,
      gameStateChanges: event.gameStateChanges,
      activatedAt: event.activatedAt,
      expiresAt: event.expiresAt,
    }));
  }),

  // ═══════════════════════════════════════════════════
  //  RESOURCE AWARDS
  // ═══════════════════════════════════════════════════

  /** Award dream currency, credits, or cards to a player */
  awardResources: adminProcedure
    .input(z.object({
      userId: z.number().int(),
      dreamTokens: z.number().int().min(0).optional(),
      soulBoundDream: z.number().int().min(0).optional(),
      credits: z.number().int().min(0).optional(),
      cardId: z.string().optional(),
      cardQuantity: z.number().int().min(1).max(10).default(1),
      reason: z.string().min(1).max(255),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Award dream tokens
      if (input.dreamTokens && input.dreamTokens > 0) {
        const [existing] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, input.userId)).limit(1);
        if (existing) {
          await db.update(dreamBalance)
            .set({
              dreamTokens: sql`${dreamBalance.dreamTokens} + ${input.dreamTokens}`,
              totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${input.dreamTokens}`,
            })
            .where(eq(dreamBalance.userId, input.userId));
        } else {
          await db.insert(dreamBalance).values({
            userId: input.userId,
            dreamTokens: input.dreamTokens,
            totalDreamEarned: input.dreamTokens,
          });
        }
      }

      // Award soul-bound dream
      if (input.soulBoundDream && input.soulBoundDream > 0) {
        const [existing] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, input.userId)).limit(1);
        if (existing) {
          await db.update(dreamBalance)
            .set({ soulBoundDream: sql`${dreamBalance.soulBoundDream} + ${input.soulBoundDream}` })
            .where(eq(dreamBalance.userId, input.userId));
        } else {
          await db.insert(dreamBalance).values({
            userId: input.userId,
            soulBoundDream: input.soulBoundDream,
          });
        }
      }

      // Award credits
      if (input.credits && input.credits > 0) {
        await db.update(characterSheets)
          .set({ credits: sql`${characterSheets.credits} + ${input.credits}` })
          .where(eq(characterSheets.userId, input.userId));
      }

      // Award card
      if (input.cardId) {
        const [existing] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.cardId)))
          .limit(1);

        if (existing) {
          await db.update(userCards)
            .set({ quantity: sql`${userCards.quantity} + ${input.cardQuantity}` })
            .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.cardId)));
        } else {
          await db.insert(userCards).values({
            userId: input.userId,
            cardId: input.cardId,
            quantity: input.cardQuantity,
            isFoil: 0,
            cardLevel: 1,
            obtainedVia: "admin",
          });
        }
      }

      await auditLog(db, ctx.user.id, "award_resources", {
        targetUserId: input.userId,
        dreamTokens: input.dreamTokens,
        soulBoundDream: input.soulBoundDream,
        credits: input.credits,
        cardId: input.cardId,
        cardQuantity: input.cardQuantity,
        reason: input.reason,
      });

      return { success: true };
    }),

  /** Bulk award resources to multiple players */
  bulkAwardResources: adminProcedure
    .input(z.object({
      userIds: z.array(z.number().int()).min(1).max(500),
      dreamTokens: z.number().int().min(0).optional(),
      soulBoundDream: z.number().int().min(0).optional(),
      credits: z.number().int().min(0).optional(),
      cardId: z.string().optional(),
      cardQuantity: z.number().int().min(1).max(10).default(1),
      reason: z.string().min(1).max(255),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, awarded: 0 };

      let awarded = 0;

      for (const userId of input.userIds) {
        try {
          // Award dream tokens
          if (input.dreamTokens && input.dreamTokens > 0) {
            const [existing] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, userId)).limit(1);
            if (existing) {
              await db.update(dreamBalance)
                .set({
                  dreamTokens: sql`${dreamBalance.dreamTokens} + ${input.dreamTokens}`,
                  totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${input.dreamTokens}`,
                })
                .where(eq(dreamBalance.userId, userId));
            } else {
              await db.insert(dreamBalance).values({
                userId,
                dreamTokens: input.dreamTokens,
                totalDreamEarned: input.dreamTokens,
              });
            }
          }

          // Award soul-bound dream
          if (input.soulBoundDream && input.soulBoundDream > 0) {
            const [existing] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, userId)).limit(1);
            if (existing) {
              await db.update(dreamBalance)
                .set({ soulBoundDream: sql`${dreamBalance.soulBoundDream} + ${input.soulBoundDream}` })
                .where(eq(dreamBalance.userId, userId));
            } else {
              await db.insert(dreamBalance).values({
                userId,
                soulBoundDream: input.soulBoundDream,
              });
            }
          }

          // Award credits
          if (input.credits && input.credits > 0) {
            await db.update(characterSheets)
              .set({ credits: sql`${characterSheets.credits} + ${input.credits}` })
              .where(eq(characterSheets.userId, userId));
          }

          // Award card
          if (input.cardId) {
            const [existing] = await db.select().from(userCards)
              .where(and(eq(userCards.userId, userId), eq(userCards.cardId, input.cardId)))
              .limit(1);

            if (existing) {
              await db.update(userCards)
                .set({ quantity: sql`${userCards.quantity} + ${input.cardQuantity}` })
                .where(and(eq(userCards.userId, userId), eq(userCards.cardId, input.cardId)));
            } else {
              await db.insert(userCards).values({
                userId,
                cardId: input.cardId,
                quantity: input.cardQuantity,
                isFoil: 0,
                cardLevel: 1,
                obtainedVia: "admin",
              });
            }
          }

          awarded++;
        } catch {
          // Skip failed individual awards, continue with the rest
        }
      }

      await auditLog(db, ctx.user.id, "bulk_award_resources", {
        targetUserIds: input.userIds,
        awarded,
        dreamTokens: input.dreamTokens,
        soulBoundDream: input.soulBoundDream,
        credits: input.credits,
        cardId: input.cardId,
        reason: input.reason,
      });

      return { success: true, awarded };
    }),
});
