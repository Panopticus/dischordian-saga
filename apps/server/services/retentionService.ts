/* ═══════════════════════════════════════════════════════
   DATA RETENTION SWEEPS

   Implements the cron jobs described in
   docs/legal/RETENTION_POLICY.md §"Cron jobs":

     - account-cleanup       : hard-deletes users whose
                               soft-delete grace window
                               (30 days) has elapsed
     - chat-message-purge    : deletes guild_chat rows
                               older than 90 days
     - analytics-purge       : deletes analytics_events
                               rows older than 24 months

   Each function is idempotent (date-bounded WHERE clause)
   and fire-and-forget — errors are logged but never throw,
   so a single failure can't take down the cron tick or
   block startup.

   The cron driver lives in apps/server/_core/index.ts —
   it calls these on an hourly setInterval. Hourly is fine
   for daily / monthly cadences because the WHERE clauses
   are date-bounded; running 24 times a day just gives
   very-recently-aged-out rows a faster sweep.
   ═══════════════════════════════════════════════════════ */
import { lt, eq, and, isNotNull } from "drizzle-orm";
import { getDb } from "../db";
import {
  users,
  userProgress,
  guildChat,
  analyticsEvents,
  adminAuditLog,
} from "../../db/schema";
import { logger } from "../logger";

/** Soft-deleted accounts hard-delete after this many days. */
export const ACCOUNT_GRACE_DAYS = 30;

/** Guild-chat messages purge after this many days. */
export const CHAT_RETENTION_DAYS = 90;

/** Analytics events purge after this many months. */
export const ANALYTICS_RETENTION_MONTHS = 24;

/**
 * Hard-delete users whose `deletedAt` is older than the
 * 30-day grace window, plus their `userProgress` row.
 * Logs each deletion to `adminAuditLog` for compliance.
 *
 * Returns counts so callers can log the sweep size.
 */
export async function runAccountCleanupTick(): Promise<{
  hardDeleted: number;
}> {
  try {
    const db = await getDb();
    if (!db) return { hardDeleted: 0 };

    const cutoff = new Date(
      Date.now() - ACCOUNT_GRACE_DAYS * 24 * 60 * 60 * 1000,
    );

    const expired = await db
      .select({ id: users.id })
      .from(users)
      .where(and(isNotNull(users.deletedAt), lt(users.deletedAt, cutoff)));

    if (expired.length === 0) return { hardDeleted: 0 };

    let hardDeleted = 0;
    for (const row of expired) {
      try {
        // Compliance audit trail. Recorded BEFORE the delete so the
        // ledger entry survives even if the user delete fails halfway.
        // adminId = 0 marks "system" (no human admin invoked this).
        await db.insert(adminAuditLog).values({
          adminId: 0,
          action: "retention.account_hard_delete",
          details: { userId: row.id, graceDays: ACCOUNT_GRACE_DAYS },
        }).catch(() => {/* best-effort */});

        await db
          .delete(userProgress)
          .where(eq(userProgress.userId, row.id))
          .catch(() => {/* may already be empty */});

        await db.delete(users).where(eq(users.id, row.id));
        hardDeleted++;
      } catch (err) {
        logger.warn("retention_account_delete_failed", "retentionService", {
          userId: row.id,
          err: String(err),
        });
      }
    }

    if (hardDeleted > 0) {
      logger.info("retention_account_cleanup", "retentionService", {
        hardDeleted,
      });
    }
    return { hardDeleted };
  } catch (err) {
    console.error("[Retention] account cleanup failed:", err);
    return { hardDeleted: 0 };
  }
}

/**
 * Delete guild_chat rows older than `CHAT_RETENTION_DAYS`. Idempotent.
 */
export async function runChatMessagePurgeTick(): Promise<{ pruned: number }> {
  try {
    const db = await getDb();
    if (!db) return { pruned: 0 };
    const cutoff = new Date(
      Date.now() - CHAT_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );
    const result = await db
      .delete(guildChat)
      .where(lt(guildChat.createdAt, cutoff));
    const pruned =
      (result as unknown as { affectedRows?: number }).affectedRows ?? 0;
    if (pruned > 0) {
      logger.info("retention_chat_purge", "retentionService", { pruned });
    }
    return { pruned };
  } catch (err) {
    console.error("[Retention] chat purge failed:", err);
    return { pruned: 0 };
  }
}

/**
 * Delete analytics_events rows older than `ANALYTICS_RETENTION_MONTHS`.
 * Computed as a 30-day-per-month approximation (close enough for a
 * monthly retention sweep).
 */
export async function runAnalyticsPurgeTick(): Promise<{ pruned: number }> {
  try {
    const db = await getDb();
    if (!db) return { pruned: 0 };
    const cutoff = new Date(
      Date.now() - ANALYTICS_RETENTION_MONTHS * 30 * 24 * 60 * 60 * 1000,
    );
    const result = await db
      .delete(analyticsEvents)
      .where(lt(analyticsEvents.createdAt, cutoff));
    const pruned =
      (result as unknown as { affectedRows?: number }).affectedRows ?? 0;
    if (pruned > 0) {
      logger.info("retention_analytics_purge", "retentionService", { pruned });
    }
    return { pruned };
  } catch (err) {
    console.error("[Retention] analytics purge failed:", err);
    return { pruned: 0 };
  }
}

/** Run all three retention sweeps. Wired into the hourly cron tick. */
export async function runRetentionTick(): Promise<void> {
  await runAccountCleanupTick();
  await runChatMessagePurgeTick();
  await runAnalyticsPurgeTick();
}
