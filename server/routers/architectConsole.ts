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
  citizenCharacters,
  companionRelationships,
  eidolonBonds,
  eidolonMemorial,
  contentParticipation,
  pressureEvents,
  universeEventState,
  battlePassProgress,
  battlePassSeasons,
  guildMembers,
  guilds,
  featureUnlocks,
  featureFlags,
  marketTransactions,
  marketListings,
  storePurchases,
  loreJournalEntries,
} from "../../drizzle/schema";
import { eq, sql, desc, and, lte, gte, or, isNull, type SQL } from "drizzle-orm";
import { pressureService } from "../services/pressureService";
import { ripple } from "../services/rippleEngine";
import { invalidateFeatureFlagCache } from "../middleware/featureFlag";

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

      // Ripple: governance vote cast
      await ripple.emit("governance_vote_cast", { userId: ctx.user.id, voteId: input.voteId, optionNumber: input.optionNumber });

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

  // ═══════════════════════════════════════════════════
  //  7.1 — PLAYER STATE INSPECTOR
  // ═══════════════════════════════════════════════════

  /** Complete player state in one response (read-only) */
  inspectPlayer: adminProcedure
    .input(z.object({ userId: z.number().int() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [
        [user],
        [progress],
        [character],
        [citizen],
        [balance],
        companions,
        eidolons,
        memorials,
        episodes,
        [battlePass],
        [activeSeason],
        guildMembership,
        unlockedFeatures,
        journalEntries,
      ] = await Promise.all([
        db.select().from(users).where(eq(users.id, input.userId)).limit(1),
        db.select().from(userProgress).where(eq(userProgress.userId, input.userId)).limit(1),
        db.select().from(characterSheets).where(eq(characterSheets.userId, input.userId)).limit(1),
        db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, input.userId)).limit(1),
        db.select().from(dreamBalance).where(eq(dreamBalance.userId, input.userId)).limit(1),
        db.select().from(companionRelationships).where(eq(companionRelationships.userId, input.userId)),
        db.select().from(eidolonBonds).where(eq(eidolonBonds.userId, input.userId)),
        db.select().from(eidolonMemorial).where(eq(eidolonMemorial.userId, input.userId)),
        db.select().from(contentParticipation).where(
          and(eq(contentParticipation.userId, input.userId), eq(contentParticipation.contentType, "episode"))
        ),
        db.select().from(battlePassProgress).where(eq(battlePassProgress.userId, input.userId)).limit(1),
        db.select().from(battlePassSeasons).where(eq(battlePassSeasons.status, "active")).limit(1),
        db.select().from(guildMembers).where(eq(guildMembers.userId, input.userId)).limit(1),
        db.select().from(featureUnlocks).where(eq(featureUnlocks.userId, input.userId)),
        db.select({ count: sql<number>`COUNT(*)` }).from(loreJournalEntries).where(eq(loreJournalEntries.userId, input.userId)),
      ]);

      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      // Parse game state from JSON blob
      const gameData = (progress?.gameData || {}) as Record<string, any>;
      const progressData = (progress?.progressData || {}) as Record<string, any>;
      const narrativeFlags = gameData.narrativeFlags || {};
      const rooms = gameData.rooms || {};
      const unlockedRooms = Object.values(rooms).filter((r: any) => r?.unlocked).length;
      const totalRooms = Object.keys(rooms).length;

      // Guild name lookup
      let guildName: string | null = null;
      if (guildMembership[0]) {
        const [guild] = await db.select({ name: guilds.name })
          .from(guilds).where(eq(guilds.id, guildMembership[0].guildId)).limit(1);
        guildName = guild?.name ?? null;
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          loginMethod: user.loginMethod,
          createdAt: user.createdAt,
          lastSignedIn: user.lastSignedIn,
        },
        character: character ? {
          name: character.characterName,
          species: character.species,
          class: character.characterClass,
          alignment: character.alignment,
          element: character.element,
          moralityScore: character.moralityScore,
          prestigeTier: character.prestigeTier,
          prestigeState: character.prestigeState,
          credits: character.credits,
        } : null,
        citizen: citizen ? {
          name: citizen.name,
          species: citizen.species,
          class: citizen.characterClass,
          alignment: citizen.alignment,
          element: citizen.element,
          level: citizen.level,
          xp: citizen.xp,
          classLevel: citizen.classLevel,
        } : null,
        level: progress?.level ?? 1,
        xp: progress?.xp ?? 0,
        economy: {
          dreamTokens: balance?.dreamTokens ?? 0,
          soulBoundDream: balance?.soulBoundDream ?? 0,
          dnaCode: balance?.dnaCode ?? 0,
          totalDreamEarned: balance?.totalDreamEarned ?? 0,
          credits: character?.credits ?? 0,
        },
        npcTrust: companions.map(c => ({
          npcId: c.companionId,
          trust: c.relationshipLevel,
          totalMessages: c.totalMessages,
          romanceActive: c.romanceActive,
        })),
        companions: eidolons.map(e => ({
          eidolonId: e.eidolonId,
          nickname: e.nickname,
          bond: e.bond,
          level: e.level,
          stage: e.stage,
          rarity: e.rarity,
          health: e.health,
          transformState: e.transformState,
          isSpectral: e.isSpectral,
        })),
        fallenCompanions: memorials.length,
        narrativeFlags: Object.keys(narrativeFlags).filter(k => narrativeFlags[k]),
        rooms: { unlocked: unlockedRooms, total: totalRooms },
        featureUnlocks: unlockedFeatures.map(f => f.featureKey),
        guild: guildMembership[0] ? {
          guildId: guildMembership[0].guildId,
          name: guildName,
          role: guildMembership[0].role,
        } : null,
        battlePass: battlePass ? {
          seasonId: battlePass.seasonId,
          tier: battlePass.currentTier,
          xp: battlePass.currentXp,
          isPremium: battlePass.isPremium,
        } : null,
        episodesWatched: episodes.filter((e: any) => e.completed).length,
        totalEpisodes: episodes.length,
        questsCompleted: (gameData.claimedQuestRewards || []).length,
        achievementCount: (gameData.achievementsEarned || []).length,
        loredexEntries: Number(journalEntries[0]?.count ?? 0),
        completedGames: (gameData.completedGames || []).length,
        progressData: {
          battlesWon: progressData.battlesWon ?? 0,
          puzzlesSolved: progressData.puzzlesSolved ?? 0,
          cardsCollected: progressData.cardsCollected ?? 0,
          roomsUnlocked: progressData.roomsUnlocked ?? 0,
        },
      };
    }),

  // ═══════════════════════════════════════════════════
  //  7.2 — PLAYER STATE MANIPULATION
  // ═══════════════════════════════════════════════════

  setMorality: adminProcedure
    .input(z.object({ userId: z.number().int(), score: z.number().int().min(-100).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(characterSheets)
        .set({ moralityScore: input.score })
        .where(eq(characterSheets.userId, input.userId));
      await auditLog(db, ctx.user.id, "set_morality", { targetUserId: input.userId, score: input.score });
      return { success: true, moralityScore: input.score };
    }),

  setLevel: adminProcedure
    .input(z.object({ userId: z.number().int(), level: z.number().int().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(userProgress)
        .set({ level: input.level })
        .where(eq(userProgress.userId, input.userId));
      await db.update(citizenCharacters)
        .set({ level: input.level })
        .where(eq(citizenCharacters.userId, input.userId));
      await auditLog(db, ctx.user.id, "set_level", { targetUserId: input.userId, level: input.level });
      return { success: true, level: input.level };
    }),

  setNPCTrust: adminProcedure
    .input(z.object({ userId: z.number().int(), npcId: z.string(), trust: z.number().int().min(0).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [existing] = await db.select().from(companionRelationships)
        .where(and(eq(companionRelationships.userId, input.userId), eq(companionRelationships.companionId, input.npcId)))
        .limit(1);
      if (existing) {
        await db.update(companionRelationships)
          .set({ relationshipLevel: input.trust })
          .where(eq(companionRelationships.id, existing.id));
      } else {
        await db.insert(companionRelationships).values({
          userId: input.userId,
          companionId: input.npcId,
          relationshipLevel: input.trust,
        });
      }
      await auditLog(db, ctx.user.id, "set_npc_trust", { targetUserId: input.userId, npcId: input.npcId, trust: input.trust });
      return { success: true, npcId: input.npcId, trust: input.trust };
    }),

  setNarrativeFlag: adminProcedure
    .input(z.object({ userId: z.number().int(), flag: z.string(), value: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, input.userId)).limit(1);
      if (!progress) throw new TRPCError({ code: "NOT_FOUND", message: "Player progress not found" });
      const gameData = (progress.gameData || {}) as Record<string, any>;
      const flags = gameData.narrativeFlags || {};
      if (input.value) {
        flags[input.flag] = true;
      } else {
        delete flags[input.flag];
      }
      gameData.narrativeFlags = flags;
      await db.update(userProgress)
        .set({ gameData: gameData as any })
        .where(eq(userProgress.userId, input.userId));
      await auditLog(db, ctx.user.id, "set_narrative_flag", { targetUserId: input.userId, flag: input.flag, value: input.value });
      return { success: true, flag: input.flag, value: input.value };
    }),

  setGamePhase: adminProcedure
    .input(z.object({
      userId: z.number().int(),
      phase: z.enum(["FIRST_VISIT", "AWAKENING", "QUARTERS_UNLOCKED", "EXPLORING", "FULL_ACCESS"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, input.userId)).limit(1);
      if (!progress) throw new TRPCError({ code: "NOT_FOUND", message: "Player progress not found" });
      const gameData = (progress.gameData || {}) as Record<string, any>;
      gameData.phase = input.phase;
      await db.update(userProgress)
        .set({ gameData: gameData as any })
        .where(eq(userProgress.userId, input.userId));
      await auditLog(db, ctx.user.id, "set_game_phase", { targetUserId: input.userId, phase: input.phase });
      return { success: true, phase: input.phase };
    }),

  setPrestige: adminProcedure
    .input(z.object({ userId: z.number().int(), tier: z.number().int().min(0).max(7) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(characterSheets)
        .set({ prestigeTier: input.tier })
        .where(eq(characterSheets.userId, input.userId));
      await auditLog(db, ctx.user.id, "set_prestige", { targetUserId: input.userId, tier: input.tier });
      return { success: true, tier: input.tier };
    }),

  grantItem: adminProcedure
    .input(z.object({
      userId: z.number().int(),
      itemType: z.enum(["dream", "soulBoundDream", "credits", "dnaCode", "card"]),
      itemId: z.string().optional(),
      amount: z.number().int().min(1).max(1_000_000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.itemType === "dream") {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${input.amount}`, totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${input.amount}` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "soulBoundDream") {
        await db.update(dreamBalance)
          .set({ soulBoundDream: sql`${dreamBalance.soulBoundDream} + ${input.amount}` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "credits") {
        await db.update(characterSheets)
          .set({ credits: sql`${characterSheets.credits} + ${input.amount}` })
          .where(eq(characterSheets.userId, input.userId));
      } else if (input.itemType === "dnaCode") {
        await db.update(dreamBalance)
          .set({ dnaCode: sql`${dreamBalance.dnaCode} + ${input.amount}` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "card" && input.itemId) {
        const [existing] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.itemId)))
          .limit(1);
        if (existing) {
          await db.update(userCards)
            .set({ quantity: sql`${userCards.quantity} + ${input.amount}` })
            .where(eq(userCards.id, existing.id));
        } else {
          await db.insert(userCards).values({
            userId: input.userId, cardId: input.itemId, quantity: input.amount,
            isFoil: 0, cardLevel: 1, obtainedVia: "admin",
          });
        }
      }

      await auditLog(db, ctx.user.id, "grant_item", input);
      return { success: true };
    }),

  removeItem: adminProcedure
    .input(z.object({
      userId: z.number().int(),
      itemType: z.enum(["dream", "soulBoundDream", "credits", "dnaCode", "card"]),
      itemId: z.string().optional(),
      amount: z.number().int().min(1).max(1_000_000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (input.itemType === "dream") {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`GREATEST(0, ${dreamBalance.dreamTokens} - ${input.amount})` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "soulBoundDream") {
        await db.update(dreamBalance)
          .set({ soulBoundDream: sql`GREATEST(0, ${dreamBalance.soulBoundDream} - ${input.amount})` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "credits") {
        await db.update(characterSheets)
          .set({ credits: sql`GREATEST(0, ${characterSheets.credits} - ${input.amount})` })
          .where(eq(characterSheets.userId, input.userId));
      } else if (input.itemType === "dnaCode") {
        await db.update(dreamBalance)
          .set({ dnaCode: sql`GREATEST(0, ${dreamBalance.dnaCode} - ${input.amount})` })
          .where(eq(dreamBalance.userId, input.userId));
      } else if (input.itemType === "card" && input.itemId) {
        await db.update(userCards)
          .set({ quantity: sql`GREATEST(0, ${userCards.quantity} - ${input.amount})` })
          .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.itemId)));
      }

      await auditLog(db, ctx.user.id, "remove_item", input);
      return { success: true };
    }),

  unlockRoom: adminProcedure
    .input(z.object({ userId: z.number().int(), roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, input.userId)).limit(1);
      if (!progress) throw new TRPCError({ code: "NOT_FOUND", message: "Player progress not found" });
      const gameData = (progress.gameData || {}) as Record<string, any>;
      const rooms = gameData.rooms || {};
      if (!rooms[input.roomId]) {
        rooms[input.roomId] = { id: input.roomId, unlocked: true, visited: false, visitCount: 0, itemsFound: [], elaraDialogSeen: false };
      } else {
        rooms[input.roomId].unlocked = true;
      }
      gameData.rooms = rooms;
      await db.update(userProgress)
        .set({ gameData: gameData as any })
        .where(eq(userProgress.userId, input.userId));
      await auditLog(db, ctx.user.id, "unlock_room", { targetUserId: input.userId, roomId: input.roomId });
      return { success: true, roomId: input.roomId };
    }),

  unlockFeature: adminProcedure
    .input(z.object({ userId: z.number().int(), featureId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [existing] = await db.select().from(featureUnlocks)
        .where(and(eq(featureUnlocks.userId, input.userId), eq(featureUnlocks.featureKey, input.featureId)))
        .limit(1);
      if (!existing) {
        await db.insert(featureUnlocks).values({
          userId: input.userId,
          featureKey: input.featureId,
          unlockedVia: "admin",
          sourceId: `admin_${ctx.user.id}`,
        });
      }
      await auditLog(db, ctx.user.id, "unlock_feature", { targetUserId: input.userId, featureId: input.featureId });
      return { success: true, featureId: input.featureId };
    }),

  // ═══════════════════════════════════════════════════
  //  7.3 — ECONOMY DASHBOARD
  // ═══════════════════════════════════════════════════

  economyDashboard: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      [circulationResult],
      [avgMedianResult],
      [earnedTodayResult],
      [spentTodayResult],
      [marketVolumeResult],
      [marketTxCountResult],
      [guildTreasuryResult],
      [weeklyEarnResult],
      [weeklySpentResult],
    ] = await Promise.all([
      // Total Dream in circulation
      db.select({
        totalDream: sql<number>`COALESCE(SUM(${dreamBalance.dreamTokens}), 0)`,
        totalSoulBound: sql<number>`COALESCE(SUM(${dreamBalance.soulBoundDream}), 0)`,
        playerCount: sql<number>`COUNT(*)`,
      }).from(dreamBalance),
      // Average/Median
      db.select({
        avgDream: sql<number>`COALESCE(AVG(${dreamBalance.dreamTokens}), 0)`,
      }).from(dreamBalance),
      // Dream earned today (from store purchases as reverse indicator — use totalDreamEarned change)
      db.select({
        earned: sql<number>`COALESCE(SUM(${dreamBalance.totalDreamEarned}), 0)`,
      }).from(dreamBalance).where(gte(dreamBalance.updatedAt, oneDayAgo)),
      // Dream spent today (store purchases)
      db.select({
        spent: sql<number>`COALESCE(SUM(${storePurchases.amount}), 0)`,
      }).from(storePurchases).where(gte(storePurchases.createdAt, oneDayAgo)),
      // Marketplace volume
      db.select({
        volume: sql<number>`COALESCE(SUM(${marketTransactions.priceDream}), 0)`,
      }).from(marketTransactions).where(gte(marketTransactions.createdAt, oneDayAgo)),
      // Marketplace transaction count
      db.select({
        count: sql<number>`COUNT(*)`,
      }).from(marketTransactions).where(gte(marketTransactions.createdAt, oneDayAgo)),
      // Guild treasury
      db.select({
        total: sql<number>`COALESCE(SUM(${guilds.treasuryDream}), 0)`,
      }).from(guilds),
      // 7-day earn
      db.select({
        earned: sql<number>`COALESCE(SUM(${dreamBalance.totalDreamEarned}), 0)`,
      }).from(dreamBalance).where(gte(dreamBalance.updatedAt, sevenDaysAgo)),
      // 7-day spend
      db.select({
        spent: sql<number>`COALESCE(SUM(${storePurchases.amount}), 0)`,
      }).from(storePurchases).where(gte(storePurchases.createdAt, sevenDaysAgo)),
    ]);

    const totalCirculation = Number(circulationResult?.totalDream ?? 0);
    const totalSoulBound = Number(circulationResult?.totalSoulBound ?? 0);
    const playerCount = Number(circulationResult?.playerCount ?? 0);
    const avgBalance = Number(avgMedianResult?.avgDream ?? 0);
    const dailyEarned = Number(earnedTodayResult?.earned ?? 0);
    const dailySpent = Number(spentTodayResult?.spent ?? 0);
    const netFlow = dailyEarned - dailySpent;
    const weeklyNetFlow = Number(weeklyEarnResult?.earned ?? 0) - Number(weeklySpentResult?.spent ?? 0);

    // Health status
    let healthStatus: "healthy" | "watch" | "intervene" = "healthy";
    if (dailyEarned > 0) {
      const ratio = Math.abs(netFlow) / dailyEarned;
      if (ratio > 0.5) healthStatus = "intervene";
      else if (ratio > 0.2) healthStatus = "watch";
    }

    return {
      totalCirculation,
      totalSoulBound,
      playerCount,
      averageBalance: Math.round(avgBalance),
      dailyEarned,
      dailySpent,
      netFlow,
      weeklyNetFlow,
      healthStatus,
      guildTreasuries: Number(guildTreasuryResult?.total ?? 0),
      marketplaceVolume: Number(marketVolumeResult?.volume ?? 0),
      marketplaceTransactions: Number(marketTxCountResult?.count ?? 0),
    };
  }),

  // ═══════════════════════════════════════════════════
  //  7.4 — LIVING UNIVERSE CONTROL PANEL
  // ═══════════════════════════════════════════════════

  getPressureMeters: adminProcedure.query(async () => {
    return await pressureService.getAllPressures();
  }),

  setPressure: adminProcedure
    .input(z.object({
      type: z.string(),
      score: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Insert a correction event to set the pressure to the desired level
      const currentPressure = await pressureService.getPressure(input.type as any);
      const delta = input.score - currentPressure;
      if (delta !== 0) {
        await db.insert(pressureEvents).values({
          userId: ctx.user.id,
          pressureType: input.type,
          amount: delta,
          source: `admin_override_${ctx.user.id}`,
        });
      }
      await auditLog(db, ctx.user.id, "set_pressure", { type: input.type, from: currentPressure, to: input.score });
      return { success: true, type: input.type, score: input.score };
    }),

  forceActivateEvent: adminProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [existing] = await db.select().from(universeEventState)
        .where(eq(universeEventState.eventId, input.eventId)).limit(1);

      if (existing) {
        await db.update(universeEventState)
          .set({ isActive: 1, activatedAt: new Date(), occurrenceCount: existing.occurrenceCount + 1 })
          .where(eq(universeEventState.id, existing.id));
      } else {
        await db.insert(universeEventState).values({
          eventId: input.eventId,
          isActive: 1,
          pressureScore: 100,
          activatedAt: new Date(),
          occurrenceCount: 1,
        });
      }
      await auditLog(db, ctx.user.id, "force_activate_event", { eventId: input.eventId });
      return { success: true };
    }),

  forceResolveEvent: adminProcedure
    .input(z.object({ eventId: z.string(), resolutionType: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(universeEventState)
        .set({ isActive: 0, resolvedAt: new Date(), cycleData: { resolutionType: input.resolutionType || "admin_forced" } as any })
        .where(eq(universeEventState.eventId, input.eventId));
      await auditLog(db, ctx.user.id, "force_resolve_event", { eventId: input.eventId, resolutionType: input.resolutionType });
      return { success: true };
    }),

  getEventHistory: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(universeEventState).orderBy(desc(universeEventState.updatedAt));
  }),

  getActiveUniverseEvents: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(universeEventState).where(eq(universeEventState.isActive, 1));
  }),

  // ═══════════════════════════════════════════════════
  //  7.5 — FEATURE FLAGS
  // ═══════════════════════════════════════════════════

  listFeatureFlags: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(featureFlags).orderBy(featureFlags.featureName);
  }),

  setFeatureFlag: adminProcedure
    .input(z.object({ name: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [existing] = await db.select().from(featureFlags)
        .where(eq(featureFlags.featureName, input.name)).limit(1);

      if (existing) {
        await db.update(featureFlags)
          .set({ enabled: input.enabled ? 1 : 0, updatedBy: String(ctx.user.id) })
          .where(eq(featureFlags.id, existing.id));
      } else {
        await db.insert(featureFlags).values({
          featureName: input.name,
          enabled: input.enabled ? 1 : 0,
          updatedBy: String(ctx.user.id),
        });
      }

      invalidateFeatureFlagCache(input.name);
      await auditLog(db, ctx.user.id, "set_feature_flag", { name: input.name, enabled: input.enabled });
      return { success: true, name: input.name, enabled: input.enabled };
    }),

  /** Seed all standard feature flags if they don't exist yet */
  seedFeatureFlags: adminProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const flags = [
      "guild_system", "pvp_arena", "pet_battles", "marketplace",
      "crafting", "chess", "tower_defense", "casino", "trade_wars",
      "prestige", "governance", "companion_death", "soul_stones",
      "eidolon_system", "living_universe_events", "seasonal_events",
      "battle_pass", "christmas_event", "card_battles", "draft_tournament",
      "coop_raids", "space_station", "bounties", "bestiary",
      "faction_wars", "diplomacy", "lore_journal", "fight_arena",
    ];

    let seeded = 0;
    for (const flag of flags) {
      const [existing] = await db.select().from(featureFlags)
        .where(eq(featureFlags.featureName, flag)).limit(1);
      if (!existing) {
        await db.insert(featureFlags).values({
          featureName: flag,
          enabled: 1,
          updatedBy: String(ctx.user.id),
        });
        seeded++;
      }
    }

    await auditLog(db, ctx.user.id, "seed_feature_flags", { seeded, total: flags.length });
    invalidateFeatureFlagCache();
    return { success: true, seeded, total: flags.length };
  }),

  // ═══════════════════════════════════════════════════
  //  GAME MODE TEST LAUNCHER
  //  Returns all playable game routes for instant admin testing
  // ═══════════════════════════════════════════════════

  getGameModes: adminProcedure.query(() => {
    return [
      { id: "fight", name: "Collector's Arena (Fighting)", path: "/fight", category: "combat" },
      { id: "card_battle", name: "Card Battle (PvE)", path: "/battle", category: "cards" },
      { id: "pvp_arena", name: "PvP Card Arena", path: "/pvp", category: "cards" },
      { id: "draft", name: "Draft Tournament", path: "/draft", category: "cards" },
      { id: "card_challenge", name: "Card Challenge", path: "/card-challenge", category: "cards" },
      { id: "chess", name: "Gamemaster's Chess", path: "/chess", category: "strategy" },
      { id: "duelyst", name: "Duelyst", path: "/duelyst", category: "strategy" },
      { id: "duelyst_classic", name: "Duelyst Classic", path: "/duelyst-play", category: "strategy" },
      { id: "terminus_swarm", name: "Terminus Swarm (Tower Defense)", path: "/terminus-swarm", category: "defense" },
      { id: "tower_defense", name: "Warden's Vigil (Tower Defense)", path: "/tower-defense", category: "defense" },
      { id: "pet_battles", name: "Pet Battles", path: "/pet-battles", category: "combat" },
      { id: "boss_battle", name: "Boss Battle", path: "/boss-battle", category: "combat" },
      { id: "boss_mastery", name: "Boss Mastery", path: "/boss-mastery", category: "combat" },
      { id: "competitive_arena", name: "Competitive Arena", path: "/competitive-arena", category: "combat" },
      { id: "gamemasters_arena", name: "Gamemaster's Arena", path: "/gamemasters-arena", category: "combat" },
      { id: "casino", name: "Degen's Casino", path: "/casino", category: "social" },
      { id: "trade_empire", name: "Trade Empire", path: "/trade-empire", category: "strategy" },
      { id: "trade_wars", name: "Trade Wars", path: "/trade-empire", category: "strategy" },
      { id: "war_map", name: "War Map", path: "/war-map", category: "strategy" },
      { id: "faction_wars", name: "Faction Wars", path: "/faction-wars", category: "strategy" },
      { id: "alliance_war", name: "Alliance War", path: "/alliance-war", category: "strategy" },
      { id: "coop_raids", name: "Co-Op Raids", path: "/coop-raids", category: "combat" },
      { id: "friendly_challenges", name: "Friendly Challenges", path: "/friendly-challenges", category: "social" },
      { id: "signal_decryption", name: "Signal Decryption", path: "/signal-decryption", category: "puzzle" },
      { id: "star_chart", name: "Star Chart", path: "/star-chart", category: "puzzle" },
      { id: "hacking", name: "Hacking Puzzle", path: "/hacking", category: "puzzle" },
      { id: "research_minigame", name: "Research Lab Minigame", path: "/research-minigame", category: "puzzle" },
      { id: "lore_quiz", name: "Lore Quiz", path: "/quiz", category: "social" },
      { id: "soul_stones", name: "Soul Stones", path: "/soul-stones", category: "combat" },
      { id: "space_station", name: "Space Station", path: "/space-station", category: "strategy" },
      { id: "bounties", name: "Bounty Board", path: "/bounties", category: "combat" },
      { id: "christmas_casino", name: "Christmas Casino", path: "/christmas-in-july", category: "social" },
    ];
  }),

  /** Get audit log (last N entries) */
  getAuditLog: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const limit = input?.limit ?? 50;
      return db.select().from(adminAuditLog).orderBy(desc(adminAuditLog.createdAt)).limit(limit);
    }),
});
