/* ═══════════════════════════════════════════════════════
   CHAT MODERATION ROUTER

   Three procedures:

     report         (player) submit a moderation report against a
                    chat message. Snapshots the message text at
                    report time; uniq-keyed on (reporter, message)
                    so a player can't pile-on, but multiple
                    different reporters can flag the same message.

     listReports    (mod/admin) browse the queue. Filterable by
                    status; ordered by createdAt DESC.

     resolveReport  (mod/admin) close a report with an outcome
                    (`dismissed` or `actioned`). Records the
                    reviewer, timestamp, and optional reviewer
                    notes. The actual mute/ban side-effects of
                    "actioned" are intentionally out of scope here
                    — that surface needs a policy decision and
                    its own router.

   Why a separate `chat` router rather than folding into `guild`:
   moderation is cross-cutting. The same primitives need to serve
   spectator chat and DMs once those surfaces grow. The
   `sourceType` enum in chat_reports is the extension point.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";

import { protectedProcedure, moderatorProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { chatReports, guildChat } from "../../db/schema";
import { logger } from "../logger";

const REPORT_REASONS = [
  "harassment",
  "hate_speech",
  "spam",
  "doxxing",
  "other",
] as const;

const REPORT_STATUSES = ["open", "reviewed", "dismissed", "actioned"] as const;

export const chatRouter = router({
  /**
   * Submit a moderation report against a guild_chat message.
   * Looks up the message, snapshots its content, and inserts a
   * report row. Idempotent under retry by virtue of the
   * (reporter, sourceType, sourceMessageId) unique key — a second
   * call returns the existing report rather than creating a
   * duplicate.
   */
  report: protectedProcedure
    .input(
      z.object({
        guildChatMessageId: z.number().int().positive(),
        reason: z.enum(REPORT_REASONS),
        notes: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const targetRows = await db
        .select()
        .from(guildChat)
        .where(eq(guildChat.id, input.guildChatMessageId))
        .limit(1);
      const target = targetRows[0];
      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }
      if (target.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot report your own message",
        });
      }

      try {
        await db.insert(chatReports).values({
          reporterUserId: ctx.user.id,
          reportedUserId: target.userId,
          sourceType: "guild_chat",
          sourceMessageId: target.id,
          messageSnapshot: target.message,
          reason: input.reason,
          notes: input.notes ?? null,
          status: "open",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        // Duplicate key — the same reporter has already filed against
        // this message. Treat as success so retries are idempotent.
        if (/duplicate|unique/i.test(msg)) {
          return { success: true, alreadyReported: true };
        }
        logger.warn(`[chat.report] insert failed: ${msg}`);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return { success: true, alreadyReported: false };
    }),

  /**
   * Mod/admin: list reports filtered by status. Returns the most
   * recent first so the queue surface lands on the latest activity.
   */
  listReports: moderatorProcedure
    .input(
      z.object({
        status: z.enum(REPORT_STATUSES).optional(),
        limit: z.number().int().min(1).max(200).default(50),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const where = input.status
        ? eq(chatReports.status, input.status)
        : undefined;

      const rows = await db
        .select()
        .from(chatReports)
        .where(where)
        .orderBy(desc(chatReports.createdAt))
        .limit(input.limit);

      return rows;
    }),

  /**
   * Mod/admin: close a report. Action side-effects (mute/ban) are
   * intentionally out of scope for the MVP — record-keeping only.
   */
  resolveReport: moderatorProcedure
    .input(
      z.object({
        reportId: z.number().int().positive(),
        action: z.enum(["dismiss", "action_taken"]),
        reviewerNotes: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db
        .select()
        .from(chatReports)
        .where(eq(chatReports.id, input.reportId))
        .limit(1);
      if (!existing[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });
      }
      if (existing[0].status !== "open") {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Report already ${existing[0].status}`,
        });
      }

      const newStatus = input.action === "dismiss" ? "dismissed" : "actioned";
      await db
        .update(chatReports)
        .set({
          status: newStatus,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
          reviewerNotes: input.reviewerNotes ?? null,
        })
        .where(
          and(
            eq(chatReports.id, input.reportId),
            eq(chatReports.status, "open"),
          ),
        );

      return { success: true, status: newStatus };
    }),
});
