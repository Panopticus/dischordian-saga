/* ═══════════════════════════════════════════════════════
   SOUL STONES SERVICE — weekly reset + collect helpers.

   Owns the weekly soft-cap (§1.2): each player has a
   `weeklyCollected` counter and a `weekResetAt` timestamp.
   The cron loop in apps/server/_core/index.ts ticks
   `tickSoulStoneWeeklyResets` hourly; rows whose
   `weekResetAt` is older than ONE_WEEK get their
   `weeklyCollected` zeroed and `weekResetAt` advanced.

   Shape mirrors tradeRouteSaturationService.ts so the cron
   wiring is consistent.
   ═══════════════════════════════════════════════════════ */
import { eq, lt, sql } from "drizzle-orm";
import { getDb } from "../db";
import { soulStones } from "../../db/schema";
import { logger } from "../logger";
import {
  WEEKLY_COLLECT_CAP,
  dropSourceCountsTowardWeeklyCap,
  type SoulStoneDropSource,
} from "@shared/soulStones";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Ensure a `soulStones` row exists for the given user and return it.
 *  Idempotent — concurrent first-contact calls converge thanks to the
 *  unique(`userId`) index. */
export async function ensureSoulStonesRow(userId: number): Promise<typeof soulStones.$inferSelect | null> {
  const db = await getDb();
  if (!db) return null;
  const [existing] = await db
    .select()
    .from(soulStones)
    .where(eq(soulStones.userId, userId))
    .limit(1);
  if (existing) return existing;
  await db
    .insert(soulStones)
    .values({ userId })
    // unique(userId) makes this a no-op if a parallel call beat us
    .onDuplicateKeyUpdate({ set: { userId: sql`${soulStones.userId}` } });
  const [row] = await db
    .select()
    .from(soulStones)
    .where(eq(soulStones.userId, userId))
    .limit(1);
  return row ?? null;
}

/**
 * Drop a stone from a combat source, respecting the weekly soft-cap.
 * Wired from victory hooks (e.g. cardGame.playCardInMatch) — the call
 * site doesn't need to know about the cap; this helper drops it on
 * the floor when the player is over-limit and returns `{ capped: true }`.
 *
 * Narrative drops (story chapters, trust milestones) should call
 * `grantSoulStones` directly with the raw count and skip the cap.
 */
export async function awardCombatDropStone(
  userId: number,
  source: SoulStoneDropSource,
): Promise<{ awarded: boolean; capped: boolean }> {
  try {
    const db = await getDb();
    if (!db) return { awarded: false, capped: false };
    const row = await ensureSoulStonesRow(userId);
    if (!row) return { awarded: false, capped: false };

    if (dropSourceCountsTowardWeeklyCap(source) && row.weeklyCollected >= WEEKLY_COLLECT_CAP) {
      return { awarded: false, capped: true };
    }
    await db
      .update(soulStones)
      .set({
        violetCount: sql`${soulStones.violetCount} + 1`,
        lifetimeCollected: sql`${soulStones.lifetimeCollected} + 1`,
        weeklyCollected: sql`${soulStones.weeklyCollected} + 1`,
      })
      .where(eq(soulStones.userId, userId));
    return { awarded: true, capped: false };
  } catch (err) {
    logger.warn("soul_stones_award_failed", "soulStonesService", {
      userId,
      source,
      err: String(err),
    });
    return { awarded: false, capped: false };
  }
}

/**
 * Cron tick — reset `weeklyCollected` to zero on every row whose
 * `weekResetAt` is older than ONE_WEEK_MS. Bulk UPDATE; idempotent.
 * Fire-and-forget: errors are logged but never thrown so the cron
 * host stays alive. Mirrors tradeRouteSaturationService.decaySaturation.
 */
export async function tickSoulStoneWeeklyResets(): Promise<{ rowsTouched: number }> {
  try {
    const db = await getDb();
    if (!db) return { rowsTouched: 0 };
    const cutoff = new Date(Date.now() - ONE_WEEK_MS);
    const result = await db
      .update(soulStones)
      .set({ weeklyCollected: 0, weekResetAt: new Date() })
      .where(lt(soulStones.weekResetAt, cutoff));
    const rowsTouched = (result as unknown as { affectedRows?: number }).affectedRows ?? 0;
    return { rowsTouched };
  } catch (err) {
    logger.warn("soul_stones_weekly_reset_failed", "soulStonesService", {
      err: String(err),
    });
    return { rowsTouched: 0 };
  }
}
