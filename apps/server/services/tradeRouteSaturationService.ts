/* ═══════════════════════════════════════════════════════
   TRADE ROUTE SATURATION SERVICE — Phase D.5

   Per-sector oversupply meter (0..200). Every completed
   trade run on sector X bumps that sector's saturation
   score; a periodic decay loop bleeds saturation back
   toward zero. Effective trade prices then scale with
   `1 - saturation/400` so a fully saturated route
   (score=200) suffers a 50 % price crash.

   Schema: apps/db/schema.ts:6974 (tradeRouteSaturation,
   audit-allow: pending-feature Phase D.5).
   ═══════════════════════════════════════════════════════ */
import { eq, gt, sql } from "drizzle-orm";
import { getDb } from "../db";
import { tradeRouteSaturation } from "../../db/schema";
import { logger } from "../logger";

/** Maximum saturation score; >100 yields oversupply price-crash penalty. */
export const SATURATION_MAX = 200;

/** Default per-completed-run bump applied at trade completion sites. */
export const SATURATION_BUMP_PER_RUN = 8;

/** Per-tick decay magnitude. ~5 points per hourly tick → a fully
 *  saturated route (200) cools to zero in ~40 hours of inactivity. */
export const SATURATION_DECAY_PER_TICK = 5;

/** Divisor for the price-crash math: `1 - saturation/PRICE_CRASH_DIVISOR`.
 *  At saturation=200 with divisor=400 the multiplier is 0.5 (50 % crash). */
export const PRICE_CRASH_DIVISOR = 400;

/**
 * Increment saturation on the given sector by `delta`, clamped to
 * `[0, SATURATION_MAX]`. Creates the row on first contact.
 *
 * Game-mechanic: implements the Phase D.5 oversupply meter — see schema
 * line 6974 (`audit-allow: pending-feature`). Wired into every
 * trade-completion site so saturation actually grows.
 */
export async function bumpSaturation(
  sectorId: string,
  delta: number = SATURATION_BUMP_PER_RUN,
): Promise<{ saturation: number } | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const [existing] = await db
      .select()
      .from(tradeRouteSaturation)
      .where(eq(tradeRouteSaturation.sectorId, sectorId))
      .limit(1);

    if (!existing) {
      const next = Math.max(0, Math.min(SATURATION_MAX, delta));
      await db
        .insert(tradeRouteSaturation)
        .values({ sectorId, saturation: next })
        // Idempotent on the unique sectorId index — concurrent first-
        // contact runs converge on the larger of the two values.
        .onDuplicateKeyUpdate({
          set: {
            saturation: sql`LEAST(${SATURATION_MAX}, GREATEST(0, ${tradeRouteSaturation.saturation} + ${delta}))`,
          },
        });
      return { saturation: next };
    }

    const next = Math.max(
      0,
      Math.min(SATURATION_MAX, (existing.saturation ?? 0) + delta),
    );
    await db
      .update(tradeRouteSaturation)
      .set({ saturation: next })
      .where(eq(tradeRouteSaturation.id, existing.id));
    return { saturation: next };
  } catch (err) {
    logger.warn(
      "trade_route_saturation_bump_failed",
      "tradeRouteSaturationService",
      { sectorId, delta, err: String(err) },
    );
    return null;
  }
}

/**
 * Read current saturation score for a sector. Returns 0 when no row
 * exists. Used by price-resolution paths.
 */
export async function getSaturation(sectorId: string): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;
    const [row] = await db
      .select({ saturation: tradeRouteSaturation.saturation })
      .from(tradeRouteSaturation)
      .where(eq(tradeRouteSaturation.sectorId, sectorId))
      .limit(1);
    return row?.saturation ?? 0;
  } catch (err) {
    logger.warn(
      "trade_route_saturation_read_failed",
      "tradeRouteSaturationService",
      { sectorId, err: String(err) },
    );
    return 0;
  }
}

/**
 * Pure helper: apply the saturation price-crash to a base price.
 * `effectivePrice = basePrice * max(0.5, 1 - saturation/PRICE_CRASH_DIVISOR)`.
 * The 0.5 floor keeps a fully crashed route from going free.
 *
 * Game-mechanic: oversupply price-crash penalty per the Phase D.5
 * audit-allow note on tradeRouteSaturation.
 */
export function applySaturationToPrice(
  basePrice: number,
  saturation: number,
): number {
  const safeSaturation = Math.max(0, Math.min(SATURATION_MAX, saturation));
  const multiplier = Math.max(0.5, 1 - safeSaturation / PRICE_CRASH_DIVISOR);
  return Math.round(basePrice * multiplier);
}

/**
 * Async sugar: read saturation for a sector and apply the price crash
 * to a base price in one call. Used by trade-pricing surfaces.
 */
export async function effectivePriceForSector(
  sectorId: string,
  basePrice: number,
): Promise<number> {
  const saturation = await getSaturation(sectorId);
  return applySaturationToPrice(basePrice, saturation);
}

/**
 * Decay every non-zero saturation row toward zero by
 * SATURATION_DECAY_PER_TICK. Idempotent. Fire-and-forget; errors
 * are logged but never thrown so the cron host stays alive.
 *
 * Cron entry-point: scheduled hourly from apps/server/_core/index.ts
 * alongside the rest of the trade-empire ticks.
 */
export async function decaySaturation(): Promise<{ rowsTouched: number }> {
  try {
    const db = await getDb();
    if (!db) return { rowsTouched: 0 };

    // Single bulk UPDATE — saturation = max(0, saturation - decay)
    // for every row with saturation > 0. Avoids row-by-row work.
    const result = await db
      .update(tradeRouteSaturation)
      .set({
        saturation: sql`GREATEST(0, ${tradeRouteSaturation.saturation} - ${SATURATION_DECAY_PER_TICK})`,
      })
      .where(gt(tradeRouteSaturation.saturation, 0));

    // drizzle-mysql returns a header object whose affectedRows is the
    // count we want. Match the pattern used elsewhere (retentionService.ts).
    const rowsTouched =
      (result as unknown as { affectedRows?: number }).affectedRows ?? 0;
    return { rowsTouched };
  } catch (err) {
    logger.warn(
      "trade_route_saturation_decay_failed",
      "tradeRouteSaturationService",
      { err: String(err) },
    );
    return { rowsTouched: 0 };
  }
}
