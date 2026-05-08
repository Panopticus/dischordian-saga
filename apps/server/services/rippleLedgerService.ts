/* ═══════════════════════════════════════════════════════
   RIPPLE LEDGER SERVICE — persistent ripple history

   Every cross-system ripple emit can be appended here for the
   World Tapestry recent-ripples ticker. Writes are fire-and-
   forget — the ledger is observability, not state.

   A daily prune cron drops rows older than 30 days; for now the
   prune helper exists but is wired by the scheduler tick.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { rippleEvents } from "../../db/schema";
import { sql } from "drizzle-orm";
import { logger } from "../logger";

const PRUNE_DAYS = 30;

export interface LedgerEvent {
  eventType: string;
  userId?: number | null;
  fromSystem?: string | null;
  toSystems: string[];
  payload?: Record<string, unknown> | null;
}

export const rippleLedgerService = {
  /**
   * Append one ripple to the ledger. Swallows errors — a missing
   * table or transient DB failure must not break the emit chain.
   */
  async record(event: LedgerEvent): Promise<void> {
    try {
      const db = await getDb();
      if (!db) return;
      await db.insert(rippleEvents).values({
        eventType: event.eventType,
        userId: event.userId ?? null,
        fromSystem: event.fromSystem ?? null,
        toSystems: event.toSystems,
        payload: event.payload ?? null,
      });
    } catch (err) {
      logger.error("[rippleLedger] record failed:", err);
    }
  },

  /**
   * Read the most recent N ledger entries, optionally filtered by
   * userId. Used by the World Tapestry recent-ripples ticker.
   */
  async recent(opts: {
    limit?: number;
    userId?: number;
  } = {}): Promise<
    Array<{
      id: number;
      eventType: string;
      userId: number | null;
      fromSystem: string | null;
      toSystems: string[];
      emittedAt: Date;
    }>
  > {
    const limit = Math.min(Math.max(1, opts.limit ?? 50), 200);
    const db = await getDb();
    if (!db) return [];
    try {
      // Lazy-import for explicit eq import (avoids unused at top level).
      const { eq, desc } = await import("drizzle-orm");
      const q = db
        .select({
          id: rippleEvents.id,
          eventType: rippleEvents.eventType,
          userId: rippleEvents.userId,
          fromSystem: rippleEvents.fromSystem,
          toSystems: rippleEvents.toSystems,
          emittedAt: rippleEvents.emittedAt,
        })
        .from(rippleEvents)
        .orderBy(desc(rippleEvents.emittedAt))
        .limit(limit);
      const rows = await (opts.userId !== undefined
        ? q.where(eq(rippleEvents.userId, opts.userId))
        : q);
      return rows.map((r) => ({
        id: Number(r.id),
        eventType: r.eventType,
        userId: r.userId,
        fromSystem: r.fromSystem,
        toSystems: (r.toSystems as string[] | null) ?? [],
        emittedAt: r.emittedAt as Date,
      }));
    } catch (err) {
      logger.error("[rippleLedger] recent failed:", err);
      return [];
    }
  },

  /**
   * Drop ledger rows older than {@link PRUNE_DAYS}. Called from the
   * yearly-event scheduler tick (alongside its own activation work).
   */
  async prune(): Promise<number> {
    try {
      const db = await getDb();
      if (!db) return 0;
      const result = await db.execute(
        sql`DELETE FROM ripple_events WHERE emittedAt < (NOW() - INTERVAL ${PRUNE_DAYS} DAY)`,
      );
      // MySQL2 returns [ResultSetHeader, undefined]; affectedRows lives there.
      const affected =
        Array.isArray(result) && result[0] && typeof result[0] === "object"
          ? Number(
              (result[0] as { affectedRows?: number }).affectedRows ?? 0,
            )
          : 0;
      return affected;
    } catch (err) {
      logger.error("[rippleLedger] prune failed:", err);
      return 0;
    }
  },
};
