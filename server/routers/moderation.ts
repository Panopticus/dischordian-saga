/**
 * MODERATION ROUTER
 * ──────────────────────────────────────────────────
 * Player-facing:
 *   • block.add / block.remove / block.list — player-level blocklist.
 *   • report.create — file a report against another player / piece of content.
 *
 * Moderator-facing (admin-only):
 *   • report.listPending — triage queue.
 *   • report.resolve — mark a report as resolved or dismissed, writing an
 *     entry to the moderator audit log.
 *   • audit.recent — recent moderator actions for compliance review.
 *
 * Rationale:
 *   The previous social layer had no T&S surface. A single harasser could
 *   DM, friend-spam, or guild-spam without any self-serve player recourse
 *   and without any moderator workflow. This router gives us the minimum
 *   floor — blocks, reports, audit log — needed to open real-time social
 *   features to a real player base. Category is intentionally a free-form
 *   string so product can iterate (harassment, spam, hate_speech, csam,
 *   impersonation, threats, self_harm, cheating, …) without migrations.
 */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure, rateLimit } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb, isDuplicateKeyError } from "../db";
import {
  userBlocks, userReports, moderatorAuditLog, friends, directMessages,
} from "../../drizzle/schema";
import { eq, and, or, desc } from "drizzle-orm";

function requireDb<T>(db: T | null): asserts db is T {
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }
}

export const moderationRouter = router({
  /* ─── BLOCKS (player) ─── */
  blockAdd: protectedProcedure
    .use(rateLimit({
      key: "moderation.blockAdd",
      maxTokens: 20,
      refillRate: 1,
    }))
    .input(z.object({
      targetUserId: z.number().int().positive(),
      reason: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      if (input.targetUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot block yourself",
        });
      }

      try {
        await db.insert(userBlocks).values({
          userId: ctx.user.id,
          blockedUserId: input.targetUserId,
          reason: input.reason,
        });
      } catch (err) {
        // The unique index makes re-blocking a no-op.
        if (isDuplicateKeyError(err)) {
          return { blocked: true, alreadyBlocked: true };
        }
        throw err;
      }

      // Automatically demote any accepted friendship so the blocked user
      // stops showing up in the blocker's friends list.
      await db.update(friends)
        .set({ status: "removed" })
        .where(and(
          or(
            and(eq(friends.userId, ctx.user.id), eq(friends.friendId, input.targetUserId)),
            and(eq(friends.userId, input.targetUserId), eq(friends.friendId, ctx.user.id)),
          ),
          eq(friends.status, "accepted"),
        ));

      return { blocked: true, alreadyBlocked: false };
    }),

  blockRemove: protectedProcedure
    .input(z.object({ targetUserId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      await db.delete(userBlocks)
        .where(and(
          eq(userBlocks.userId, ctx.user.id),
          eq(userBlocks.blockedUserId, input.targetUserId),
        ));

      return { unblocked: true };
    }),

  blockList: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    requireDb(db);
    return db.select().from(userBlocks)
      .where(eq(userBlocks.userId, ctx.user.id))
      .orderBy(desc(userBlocks.createdAt));
  }),

  /* ─── REPORTS (player) ─── */
  reportCreate: protectedProcedure
    .use(rateLimit({
      key: "moderation.reportCreate",
      maxTokens: 5,
      refillRate: 1,
      refillIntervalMs: 60_000, // 5 burst, then 1 per minute
      message: "You're filing reports too quickly. Please slow down.",
    }))
    .input(z.object({
      reportedUserId: z.number().int().positive(),
      category: z.string().min(1).max(64),
      details: z.string().max(2000).optional(),
      contextType: z.string().max(64).optional(),
      contextId: z.string().max(128).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      if (input.reportedUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot report yourself",
        });
      }

      const [result] = await db.insert(userReports).values({
        reporterUserId: ctx.user.id,
        reportedUserId: input.reportedUserId,
        category: input.category,
        details: input.details,
        contextType: input.contextType,
        contextId: input.contextId,
      }).$returningId();

      return { reportId: result.id };
    }),

  /* ─── REPORTS (moderator) ─── */
  reportListPending: adminProcedure
    .input(z.object({
      status: z.enum(["pending", "triaged", "resolved", "dismissed"]).optional(),
      limit: z.number().int().min(1).max(200).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      requireDb(db);
      const status = input?.status ?? "pending";
      const limit = input?.limit ?? 50;
      return db.select().from(userReports)
        .where(eq(userReports.status, status))
        .orderBy(desc(userReports.createdAt))
        .limit(limit);
    }),

  reportResolve: adminProcedure
    .input(z.object({
      reportId: z.number().int().positive(),
      resolution: z.enum(["resolved", "dismissed"]),
      notes: z.string().max(2000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      const [report] = await db.select().from(userReports)
        .where(eq(userReports.id, input.reportId))
        .limit(1);
      if (!report) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });
      }

      await db.update(userReports)
        .set({
          status: input.resolution,
          resolvedByUserId: ctx.user.id,
          resolvedAt: new Date(),
          resolutionNotes: input.notes,
        })
        .where(eq(userReports.id, input.reportId));

      await db.insert(moderatorAuditLog).values({
        moderatorUserId: ctx.user.id,
        action: `report.${input.resolution}`,
        targetUserId: report.reportedUserId,
        targetType: "report",
        targetId: String(report.id),
        payload: {
          category: report.category,
          resolutionNotes: input.notes ?? null,
        },
      });

      return { ok: true };
    }),

  /**
   * Hard-delete a run of direct messages after a substantiated report.
   * Always writes an audit trail so the action is reviewable.
   */
  purgeDirectMessagesBetween: adminProcedure
    .input(z.object({
      userAId: z.number().int().positive(),
      userBId: z.number().int().positive(),
      reportId: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      requireDb(db);

      await db.delete(directMessages)
        .where(or(
          and(eq(directMessages.fromUserId, input.userAId), eq(directMessages.toUserId, input.userBId)),
          and(eq(directMessages.fromUserId, input.userBId), eq(directMessages.toUserId, input.userAId)),
        ));

      await db.insert(moderatorAuditLog).values({
        moderatorUserId: ctx.user.id,
        action: "dm.purge_between",
        targetUserId: input.userAId,
        targetType: "direct_messages_pair",
        targetId: `${input.userAId}-${input.userBId}`,
        payload: {
          userAId: input.userAId,
          userBId: input.userBId,
          reportId: input.reportId ?? null,
        },
      });

      return { purged: true };
    }),

  /* ─── AUDIT (moderator) ─── */
  auditRecent: adminProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(500).default(100),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      requireDb(db);
      return db.select().from(moderatorAuditLog)
        .orderBy(desc(moderatorAuditLog.createdAt))
        .limit(input?.limit ?? 100);
    }),
});
