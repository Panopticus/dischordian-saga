/**
 * Engineer's Logs router.
 *
 * Surfaces the FNORD-23 log library to the client. The logs
 * themselves live as static content in
 * `apps/shared/tcg-core/story/engineerLogs.ts` — this router
 * only tracks per-user discovery and read state.
 *
 * Procedures:
 *   - getAll: list every authored log with the current user's
 *     unlocked/read state joined in. Locked logs still appear but
 *     with `unlocked: false` — the FNORD-23 UI can show them as
 *     greyed-out slots so the player has something to work toward.
 *   - markRead: mark a single log as read (clears unread badge).
 *   - unlockLog: award a log to the current user. Called from
 *     other routers (tutorial completion, match-end handlers)
 *     when the player first encounters the mechanic.
 *   - getUnlockedCount: small helper for the library badge count.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { engineerLogUnlocks, notifications } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../logger";
import { ENGINEER_LOGS, ENGINEER_LOG_MAP } from "@shared/tcg-core/story/engineerLogs";

export const engineerLogsRouter = router({
  /** All logs, with per-user unlock state. */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      // Fallback: return static content only, no unlock state.
      return ENGINEER_LOGS.map((log) => ({
        ...log,
        unlocked: false,
        read: false,
        unlockedAt: null as Date | null,
      }));
    }
    const rows = await db
      .select()
      .from(engineerLogUnlocks)
      .where(eq(engineerLogUnlocks.userId, ctx.user.id));
    const unlockMap = new Map(rows.map((r) => [r.logId, r]));
    return ENGINEER_LOGS.map((log) => {
      const row = unlockMap.get(log.id);
      return {
        ...log,
        unlocked: !!row,
        read: row?.read === 1,
        unlockedAt: row?.unlockedAt ?? null,
      };
    });
  }),

  /** Mark a log as read — clears the unread badge. */
  markRead: protectedProcedure
    .input(z.object({ logId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false };
      if (!ENGINEER_LOG_MAP[input.logId]) {
        return { ok: false, error: "unknown_log" };
      }
      await db
        .update(engineerLogUnlocks)
        .set({ read: 1 })
        .where(
          and(
            eq(engineerLogUnlocks.userId, ctx.user.id),
            eq(engineerLogUnlocks.logId, input.logId),
          ),
        );
      return { ok: true };
    }),

  /** Unlock a log for the current user. Idempotent. */
  unlockLog: protectedProcedure
    .input(
      z.object({
        logId: z.string().min(1).max(64),
        source: z.string().min(1).max(128).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false };
      const log = ENGINEER_LOG_MAP[input.logId];
      if (!log) {
        return { ok: false, error: "unknown_log" };
      }

      // Idempotent insert. MySQL "ON DUPLICATE KEY UPDATE" approach.
      try {
        await db.insert(engineerLogUnlocks).values({
          userId: ctx.user.id,
          logId: input.logId,
          read: 0,
          unlockSource: input.source ?? null,
        });
      } catch {
        // Already exists — nothing to do.
        return { ok: true, alreadyUnlocked: true };
      }

      // Notification toast.
      try {
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "achievement",
          title: `Engineer's Log Unlocked: ${log.title}`,
          message: log.mechanicExplanation,
          metadata: { event: "engineer_log_unlock", logId: input.logId },
        });
      } catch (e) {
        logger.warn("Failed to send engineer log unlock notification", e);
      }

      return { ok: true, alreadyUnlocked: false, log };
    }),

  /** Count of unlocked logs for the library badge. */
  getUnlockedCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { total: ENGINEER_LOGS.length, unlocked: 0, unread: 0 };
    const rows = await db
      .select({
        unlocked: sql<number>`COUNT(*)`,
        unread: sql<number>`SUM(CASE WHEN ${engineerLogUnlocks.read} = 0 THEN 1 ELSE 0 END)`,
      })
      .from(engineerLogUnlocks)
      .where(eq(engineerLogUnlocks.userId, ctx.user.id));
    const row = rows[0] ?? { unlocked: 0, unread: 0 };
    return {
      total: ENGINEER_LOGS.length,
      unlocked: Number(row.unlocked ?? 0),
      unread: Number(row.unread ?? 0),
    };
  }),
});
