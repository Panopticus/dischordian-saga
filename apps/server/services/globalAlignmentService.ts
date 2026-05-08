/* ═══════════════════════════════════════════════════════
   GLOBAL ALIGNMENT SERVICE — NARRATIVE_ARCHITECTURE.md §0

   The community-wide Light/Dark balance meter. Where
   per-player morality lives on `characterSheets.moralityScore`
   (-100..+100; positive = humanity / light, negative =
   machine / dark) and on `pressureEvents.pressureType`
   ("moralityHumanity" / "moralityMachine" totals), this
   service rolls those per-player signals up into a single
   singleton row at `globalAlignment.id = 1` so the Hierarchy
   invasion cadence, Architect-Triggered Events, Soul Stones
   drop rates, and the client meter can read one number
   instead of joining dozens of tables.

   Recompute cadence: hourly cron (registered in
   apps/server/_core/index.ts). Idempotent — every tick
   recomputes from source. The aggregator never throws; a
   stuck row should never kill other ticks.

   The seeded singleton row at id=1 (see migration
   apps/db/0075_global_alignment_meter.sql) is always
   UPDATE-d, never INSERT-d, so callers can rely on `get()`
   returning a row even mid-recompute.
   ═══════════════════════════════════════════════════════ */

import { eq, gte, ne, or, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  characterSheets,
  globalAlignment,
  pressureEvents,
  users,
  type GlobalAlignmentRow,
} from "../../db/schema";
import { logger } from "../logger";

/** Singleton row id — seeded by migration 0075. */
const SINGLETON_ID = 1;

/** A user is "active" if they have non-zero alignment OR signed in
 *  within this many days. Mirrors the cohort cutoff used by
 *  retentionService for the activity heuristic. */
const ACTIVE_PLAYER_WINDOW_DAYS = 30;

/** Phase derivation: a side is "dominant" when its total exceeds
 *  the other by 20 % or more. Below that — or if both totals are
 *  zero — the meter is "balanced". The 1.2 ratio matches §0's
 *  "tilt threshold" callout in NARRATIVE_ARCHITECTURE.md. */
const DOMINANCE_RATIO = 1.2;

/** Output of {@link recomputeGlobalAlignment}; mirrors the row that
 *  was written to MySQL plus a fresh `computedAt`. */
export interface RecomputeResult {
  lightTotal: number;
  darkTotal: number;
  playerCount: number;
  phase: "light_dominant" | "balanced" | "dark_dominant";
  computedAt: Date;
}

/** Derive the meter phase from light/dark totals.
 *
 *  - light_dominant ⇔ lightTotal > darkTotal × DOMINANCE_RATIO
 *  - dark_dominant  ⇔ darkTotal  > lightTotal × DOMINANCE_RATIO
 *  - balanced       otherwise (including both-zero baseline)
 *
 *  Pure for testability; no DB calls.
 */
export function derivePhase(
  lightTotal: number,
  darkTotal: number,
): RecomputeResult["phase"] {
  if (lightTotal <= 0 && darkTotal <= 0) return "balanced";
  if (lightTotal > darkTotal * DOMINANCE_RATIO) return "light_dominant";
  if (darkTotal > lightTotal * DOMINANCE_RATIO) return "dark_dominant";
  return "balanced";
}

/**
 * Recompute the global Light/Dark aggregate from per-player state
 * and write it to the singleton row.
 *
 * Reads three signals:
 *   1. SUM of positive `characterSheets.moralityScore` → light
 *   2. SUM of |negative `characterSheets.moralityScore`| → dark
 *   3. SUM of `pressureEvents.amount` for moralityHumanity (light)
 *      and moralityMachine (dark) — additive on top of (1)/(2)
 *      because pressure events accumulate over time even when the
 *      character sheet's instantaneous score has been spent.
 *
 * Player count = users with non-zero alignment OR last-signed-in
 * within ACTIVE_PLAYER_WINDOW_DAYS.
 *
 * Returns `null` if the DB is unavailable so the cron can swallow
 * it without throwing. Otherwise returns the freshly written row.
 *
 * Idempotent: running back-to-back yields the same row contents
 * (modulo `computedAt`). Errors are logged and re-thrown to the
 * caller; the cron wrapper in apps/server/_core/index.ts catches
 * and logs without escalating.
 */
export async function recomputeGlobalAlignment(): Promise<RecomputeResult | null> {
  const db = await getDb();
  if (!db) {
    logger.warn("[GlobalAlignment] DB unavailable; skipping recompute");
    return null;
  }

  // ─── Character-sheet morality (instantaneous) ─────────────
  // moralityScore is signed (-100..+100). Split at zero so positive
  // scores accrue to light, negative magnitudes to dark.
  const [sheetTotalsRow] = await db
    .select({
      lightFromSheets: sql<number>`COALESCE(SUM(CASE WHEN ${characterSheets.moralityScore} > 0 THEN ${characterSheets.moralityScore} ELSE 0 END), 0)`,
      darkFromSheets: sql<number>`COALESCE(SUM(CASE WHEN ${characterSheets.moralityScore} < 0 THEN -${characterSheets.moralityScore} ELSE 0 END), 0)`,
      sheetActiveCount: sql<number>`COUNT(CASE WHEN ${characterSheets.moralityScore} <> 0 THEN 1 END)`,
    })
    .from(characterSheets);

  const lightFromSheets = Number(sheetTotalsRow?.lightFromSheets ?? 0);
  const darkFromSheets = Number(sheetTotalsRow?.darkFromSheets ?? 0);
  const sheetActiveCount = Number(sheetTotalsRow?.sheetActiveCount ?? 0);

  // ─── Pressure-event totals (cumulative) ───────────────────
  // pressure_events.amount > 0 always; the pressureType column
  // discriminates the side. We don't filter by recency — the
  // meter is the all-time community cumulative as §0 specifies.
  const [pressureTotalsRow] = await db
    .select({
      lightFromPressure: sql<number>`COALESCE(SUM(CASE WHEN ${pressureEvents.pressureType} = 'moralityHumanity' THEN ${pressureEvents.amount} ELSE 0 END), 0)`,
      darkFromPressure: sql<number>`COALESCE(SUM(CASE WHEN ${pressureEvents.pressureType} = 'moralityMachine' THEN ${pressureEvents.amount} ELSE 0 END), 0)`,
    })
    .from(pressureEvents);

  const lightFromPressure = Number(pressureTotalsRow?.lightFromPressure ?? 0);
  const darkFromPressure = Number(pressureTotalsRow?.darkFromPressure ?? 0);

  const lightTotal = lightFromSheets + lightFromPressure;
  const darkTotal = darkFromSheets + darkFromPressure;

  // ─── Active-player count ──────────────────────────────────
  // "Active" = signed in within the last ACTIVE_PLAYER_WINDOW_DAYS.
  // We add the count of character sheets with non-zero morality
  // separately because some users contribute alignment without
  // having signed in recently (legacy NPC-bank carry-overs).
  const cutoff = new Date(
    Date.now() - ACTIVE_PLAYER_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );
  const [activeUsersRow] = await db
    .select({
      activeCount: sql<number>`COUNT(*)`,
    })
    .from(users)
    .where(
      or(
        gte(users.lastSignedIn, cutoff),
        // Soft-deleted accounts shouldn't count even if their
        // sheet still has a non-zero morality score.
        ne(users.id, 0),
      ),
    );
  const recentlyActiveCount = Number(activeUsersRow?.activeCount ?? 0);

  // Use the larger of "recently signed in" or "non-zero sheet".
  // Both are upper-bounds on "players whose state is in the
  // aggregate"; taking the max is the most-charitable read.
  const playerCount = Math.max(recentlyActiveCount, sheetActiveCount);

  // ─── Derive phase + persist ───────────────────────────────
  const phase = derivePhase(lightTotal, darkTotal);
  const computedAt = new Date();

  await db
    .update(globalAlignment)
    .set({
      lightTotal,
      darkTotal,
      playerCount,
      phase,
      computedAt,
    })
    .where(eq(globalAlignment.id, SINGLETON_ID));

  return { lightTotal, darkTotal, playerCount, phase, computedAt };
}

/**
 * Read the current global alignment row. Returns the seeded
 * baseline (`lightTotal=0, darkTotal=0, phase="balanced"`) if
 * the cron hasn't fired yet, and `null` if the DB is unavailable
 * so callers can render a placeholder without throwing.
 */
export async function getGlobalAlignment(): Promise<GlobalAlignmentRow | null> {
  const db = await getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(globalAlignment)
    .where(eq(globalAlignment.id, SINGLETON_ID))
    .limit(1);

  return row ?? null;
}
