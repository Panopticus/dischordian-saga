/**
 * COMMUNITY CODEX ROUTER
 * ──────────────────────────────────────────────────
 * tRPC router for the Community Codex Contributions system.
 * Lets players submit lore theories, vote on contributions,
 * and lets admins moderate/feature entries.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  codexContributions,
  codexVotes,
} from "../../db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import {
  CODEX_CATEGORIES,
  validateContribution,
  calculateContributionXP,
  MAX_SUBMISSIONS_PER_DAY,
  type CodexCategory,
  type CodexContribution,
} from "../../shared/communityCodex";

const codexCategoryEnum = z.enum([
  "theory",
  "analysis",
  "alternate_history",
  "character_study",
  "prophecy_interpretation",
]);

export const communityCodexRouter = router({
  /**
   * Submit a new codex contribution (protected, rate limited 3/day).
   */
  submit: protectedProcedure
    .input(
      z.object({
        category: codexCategoryEnum,
        title: z.string().min(1).max(200),
        content: z.string().min(100).max(2000),
        referencedEntities: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Validate content with shared logic
      const validation = validateContribution(input.content, input.referencedEntities);
      if (!validation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validation.errors.join(" "),
        });
      }

      // Rate limit: max 3 submissions per day
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaySubmissions = await db
        .select({ count: sql<number>`count(*)` })
        .from(codexContributions)
        .where(
          and(
            eq(codexContributions.authorId, ctx.user.id),
            sql`${codexContributions.createdAt} >= ${startOfDay}`,
          ),
        );

      const submissionCount = todaySubmissions[0]?.count ?? 0;
      if (submissionCount >= MAX_SUBMISSIONS_PER_DAY) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `You can submit at most ${MAX_SUBMISSIONS_PER_DAY} contributions per day.`,
        });
      }

      const [result] = await db.insert(codexContributions).values({
        authorId: ctx.user.id,
        category: input.category,
        title: input.title,
        content: input.content,
        referencedEntities: input.referencedEntities,
        upvotes: 0,
        downvotes: 0,
        featured: false,
        status: "pending",
      }).$returningId();

      return { contributionId: result.id };
    }),

  /**
   * List contributions (public). Filters by category, sorts by votes or newest.
   */
  list: publicProcedure
    .input(
      z.object({
        category: codexCategoryEnum.optional(),
        sort: z.enum(["votes", "newest"]).default("newest"),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const conditions = [
        // Only show approved or featured contributions publicly
        sql`${codexContributions.status} IN ('approved', 'featured')`,
      ];
      if (input.category) {
        conditions.push(eq(codexContributions.category, input.category));
      }

      const orderBy =
        input.sort === "votes"
          ? desc(sql`${codexContributions.upvotes} - ${codexContributions.downvotes}`)
          : desc(codexContributions.createdAt);

      const rows = await db
        .select()
        .from(codexContributions)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(input.offset);

      return {
        contributions: rows,
        categories: CODEX_CATEGORIES,
      };
    }),

  /**
   * Vote on a contribution (protected, one vote per user per entry).
   */
  vote: protectedProcedure
    .input(
      z.object({
        contributionId: z.number(),
        direction: z.enum(["up", "down"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Check contribution exists
      const [contribution] = await db
        .select()
        .from(codexContributions)
        .where(eq(codexContributions.id, input.contributionId));

      if (!contribution) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Contribution not found" });
      }

      // Prevent self-voting
      if (contribution.authorId === ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You cannot vote on your own contribution." });
      }

      // Check if already voted
      const [existingVote] = await db
        .select()
        .from(codexVotes)
        .where(
          and(
            eq(codexVotes.contributionId, input.contributionId),
            eq(codexVotes.userId, ctx.user.id),
          ),
        );

      if (existingVote) {
        if (existingVote.direction === input.direction) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already voted in this direction.",
          });
        }
        // Change vote direction
        await db
          .update(codexVotes)
          .set({ direction: input.direction })
          .where(eq(codexVotes.id, existingVote.id));

        // Adjust counts: reverse old vote and apply new one
        const upDelta = input.direction === "up" ? 1 : -1;
        const downDelta = input.direction === "down" ? 1 : -1;
        await db
          .update(codexContributions)
          .set({
            upvotes: sql`${codexContributions.upvotes} + ${upDelta}`,
            downvotes: sql`${codexContributions.downvotes} + ${downDelta}`,
          })
          .where(eq(codexContributions.id, input.contributionId));

        return { voted: true, changed: true };
      }

      // Insert new vote
      await db.insert(codexVotes).values({
        contributionId: input.contributionId,
        userId: ctx.user.id,
        direction: input.direction,
      });

      // Update contribution vote counts
      if (input.direction === "up") {
        await db
          .update(codexContributions)
          .set({ upvotes: sql`${codexContributions.upvotes} + 1` })
          .where(eq(codexContributions.id, input.contributionId));
      } else {
        await db
          .update(codexContributions)
          .set({ downvotes: sql`${codexContributions.downvotes} + 1` })
          .where(eq(codexContributions.id, input.contributionId));
      }

      // Nemesis hook — community-codex voting is the saga's
      // closest analog to a hub-governance vote. An up-vote
      // signals constructive participation in the chronicle,
      // which the Nemesis's hub_counter_vote_campaign plan
      // tries to suppress. Down-votes are neutral here (player
      // is rejecting a contribution, not the chronicle itself).
      if (input.direction === "up") {
        try {
          const { hubVoteOutcome } = await import(
            "../../shared/nemesisIntegration"
          );
          const { recordSurfaceEvent } = await import(
            "../services/nemesisEncounterService"
          );
          const record = hubVoteOutcome({
            voteTitle: `codex#${input.contributionId}`,
            counterVoteCarried: false,
            hadActivePlanToDisrupt: true,
          });
          recordSurfaceEvent({
            userId: ctx.user.id,
            encounterKind: record.encounterKind,
            source: "hub",
            detail: record.detail,
            disruptPlanKind: record.disruptPlanKind,
          }).catch((e) => console.warn("[Nemesis] hub-vote hook failed", e));
        } catch (nemesisErr) {
          console.warn("[Nemesis] hub-vote hook import failed", nemesisErr);
        }
      }

      return { voted: true, changed: false };
    }),

  /**
   * Get featured contributions (public).
   */
  getFeatured: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      }).optional(),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const limit = input?.limit ?? 10;

      const rows = await db
        .select()
        .from(codexContributions)
        .where(
          and(
            eq(codexContributions.featured, true),
            eq(codexContributions.status, "featured"),
          ),
        )
        .orderBy(desc(codexContributions.createdAt))
        .limit(limit);

      return { featured: rows };
    }),

  /**
   * Moderate a contribution (admin only): approve, reject, or feature.
   */
  moderate: adminProcedure
    .input(
      z.object({
        contributionId: z.number(),
        action: z.enum(["approve", "reject", "feature"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const [contribution] = await db
        .select()
        .from(codexContributions)
        .where(eq(codexContributions.id, input.contributionId));

      if (!contribution) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Contribution not found" });
      }

      const updates: Record<string, unknown> = {};

      switch (input.action) {
        case "approve":
          updates.status = "approved";
          break;
        case "reject":
          updates.status = "rejected";
          break;
        case "feature":
          updates.status = "featured";
          updates.featured = true;
          break;
      }

      await db
        .update(codexContributions)
        .set(updates)
        .where(eq(codexContributions.id, input.contributionId));

      // Calculate and return updated XP for the contribution
      const [updated] = await db
        .select()
        .from(codexContributions)
        .where(eq(codexContributions.id, input.contributionId));

      const xp = calculateContributionXP(updated as unknown as CodexContribution);

      return {
        moderated: true,
        newStatus: updates.status,
        contributionXP: xp,
      };
    }),
});
