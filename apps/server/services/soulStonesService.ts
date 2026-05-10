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
 * Narrative grant — bypasses the weekly soft-cap. Called from story
 * surfaces (chapter completion, conspiracy board solve, trust
 * milestones) where the design intent is "this moment manifests a
 * stone in the player's hand," not "they ground out a combat drop."
 *
 * Stones granted here count toward `lifetimeCollected` (for prestige
 * accounting) but NOT toward `weeklyCollected` (which would otherwise
 * eat into the player's combat-drop budget for the week).
 *
 * Idempotent at the caller's discretion — the caller must gate on a
 * transition (e.g., the user's `solvedAt` flipping from null → now)
 * to avoid double-granting on repeated invocations.
 */
export async function grantSoulStones(
  userId: number,
  count: number,
  reason: string,
): Promise<{ granted: boolean }> {
  if (count <= 0) return { granted: false };
  try {
    const db = await getDb();
    if (!db) return { granted: false };
    const row = await ensureSoulStonesRow(userId);
    if (!row) return { granted: false };
    await db
      .update(soulStones)
      .set({
        violetCount: sql`${soulStones.violetCount} + ${count}`,
        lifetimeCollected: sql`${soulStones.lifetimeCollected} + ${count}`,
      })
      .where(eq(soulStones.userId, userId));
    logger.info("soul_stones_narrative_grant", "soulStonesService", {
      userId,
      count,
      reason,
    });
    return { granted: true };
  } catch (err) {
    logger.warn("soul_stones_narrative_grant_failed", "soulStonesService", {
      userId,
      count,
      reason,
      err: String(err),
    });
    return { granted: false };
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
