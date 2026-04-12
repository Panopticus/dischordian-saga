/**
 * CIRCUIT SEASON SERVICE — Bi-monthly Dead Man's Circuit lifecycle.
 *
 * Handles opening new seasons on schedule, advancing phase as the
 * 28-day window progresses, and closing seasons that have ended.
 * Called from a setInterval tick in _core/index.ts and lazily from
 * the deadMansCircuit router so production never has a "no season"
 * window even on a freshly-deployed instance.
 */
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  circuitSeasons,
  circuitLeaderboard,
  circuitClones,
  type CircuitSeasonRow,
} from "../../db/schema";
import {
  getCurrentPhase,
  getSeasonName,
  getSeasonSchedule,
  isCircuitOpen,
  SEASON_MONTHS,
  type SeasonPhase,
} from "../../shared/deadMansCircuit";
import { logger } from "../logger";

const SEASON_DURATION_DAYS = 28;

/**
 * Compute the start date of the bi-monthly season window that contains
 * `now`, or null if `now` is between seasons.
 */
function computeCurrentSeasonStart(now: Date): Date | null {
  const month = now.getMonth();
  const day = now.getDate();
  if (!SEASON_MONTHS.includes(month as typeof SEASON_MONTHS[number])) return null;
  if (day < 1 || day > SEASON_DURATION_DAYS) return null;
  const start = new Date(now.getFullYear(), month, 1, 0, 0, 0, 0);
  return start;
}

/**
 * Compute season number from a start date. Season 1 = the season that
 * begins in the first SEASON_MONTH of the earliest meaningful year.
 * We anchor on Jan 2026 = season 1, then add 1 per bi-monthly slot.
 */
function computeSeasonNumber(startDate: Date): number {
  const ANCHOR_YEAR = 2026;
  const ANCHOR_MONTH = 0; // January
  const yearDiff = startDate.getFullYear() - ANCHOR_YEAR;
  const monthIdx = SEASON_MONTHS.indexOf(startDate.getMonth() as typeof SEASON_MONTHS[number]);
  const anchorIdx = SEASON_MONTHS.indexOf(ANCHOR_MONTH as typeof SEASON_MONTHS[number]);
  if (monthIdx < 0 || anchorIdx < 0) return 1;
  const slot = yearDiff * SEASON_MONTHS.length + (monthIdx - anchorIdx);
  return Math.max(1, slot + 1);
}

/**
 * Insert a new active season for the given start date if one does not
 * already exist. Idempotent — safe to call from multiple ticks.
 */
async function openSeasonIfMissing(start: Date): Promise<CircuitSeasonRow | null> {
  const db = await getDb();
  if (!db) return null;

  const schedule = getSeasonSchedule(start);
  const seasonNumber = computeSeasonNumber(start);

  // Already opened?
  const existing = await db.select().from(circuitSeasons)
    .where(and(
      eq(circuitSeasons.seasonNumber, seasonNumber),
    ))
    .limit(1);
  if (existing[0]) return existing[0];

  const phase: SeasonPhase = getCurrentPhase(schedule.seasonStart);
  const trackPreset = phase === 3 ? "the_dead_run" : phase === 2 ? "bone_corridor" : "the_first_circuit";

  await db.insert(circuitSeasons).values({
    seasonNumber,
    name: getSeasonName(seasonNumber),
    phase,
    startsAt: schedule.seasonStart,
    endsAt: schedule.seasonEnd,
    status: "active",
    trackPreset,
    boneObstacles: [],
    totalRaces: 0,
    totalDeaths: 0,
    activeUniverseEvents: [],
  });

  const [created] = await db.select().from(circuitSeasons)
    .where(eq(circuitSeasons.seasonNumber, seasonNumber))
    .limit(1);

  if (created) {
    logger.info(`[Circuit] Opened ${created.name} (id=${created.id}, phase=${phase})`);
  }
  return created ?? null;
}

/**
 * Tick the season state machine:
 *   1. Close any seasons whose endsAt has passed (status active → ended).
 *      Records the championUserId from the leaderboard.
 *   2. If we're in a season window and no active season matches it, open one.
 *   3. Advance the phase column on the active season if the day has rolled.
 */
export async function tickCircuitSeasons(now: Date = new Date()): Promise<{
  opened: number | null;
  advanced: number | null;
  closed: number[];
}> {
  const db = await getDb();
  if (!db) return { opened: null, advanced: null, closed: [] };

  const closed: number[] = [];

  // 1. Close any active seasons past their end
  const active = await db.select().from(circuitSeasons)
    .where(eq(circuitSeasons.status, "active"));
  for (const s of active) {
    if (s.endsAt.getTime() <= now.getTime()) {
      // Find the champion (highest CP on the leaderboard)
      const [top] = await db.select().from(circuitLeaderboard)
        .where(eq(circuitLeaderboard.seasonId, s.id))
        .orderBy(desc(circuitLeaderboard.totalCp))
        .limit(1);

      await db.update(circuitSeasons)
        .set({
          status: "ended",
          championUserId: top?.userId ?? null,
          closedAt: now,
        })
        .where(eq(circuitSeasons.id, s.id));

      // Mark all surviving clones from this season as severed
      await db.update(circuitClones)
        .set({ status: "severed" })
        .where(and(
          eq(circuitClones.seasonId, s.id),
          eq(circuitClones.status, "active"),
        ));

      closed.push(s.id);
      logger.info(`[Circuit] Closed ${s.name} (id=${s.id}, champion=${top?.userId ?? "none"})`);
    }
  }

  // 2. Open the current window's season if missing
  let opened: number | null = null;
  const windowStart = computeCurrentSeasonStart(now);
  if (windowStart && isCircuitOpen(now)) {
    const created = await openSeasonIfMissing(windowStart);
    if (created) opened = created.id;
  }

  // 3. Advance phase on whichever season is now active
  let advanced: number | null = null;
  const [activeNow] = await db.select().from(circuitSeasons)
    .where(eq(circuitSeasons.status, "active"))
    .orderBy(desc(circuitSeasons.startsAt))
    .limit(1);
  if (activeNow) {
    const expectedPhase = getCurrentPhase(activeNow.startsAt, now);
    if (expectedPhase !== activeNow.phase) {
      await db.update(circuitSeasons)
        .set({ phase: expectedPhase })
        .where(eq(circuitSeasons.id, activeNow.id));
      advanced = activeNow.id;
      logger.info(`[Circuit] Phase advanced: season ${activeNow.id} → phase ${expectedPhase}`);
    }
  }

  return { opened, advanced, closed };
}

/**
 * Lazy helper: returns the currently active season, opening one
 * on-demand if today is in a season window but no row exists yet.
 * Used by the router's read path so first-visit-after-deploy works.
 */
export async function getOrOpenActiveSeason(): Promise<CircuitSeasonRow | null> {
  const db = await getDb();
  if (!db) return null;

  const [existing] = await db.select().from(circuitSeasons)
    .where(eq(circuitSeasons.status, "active"))
    .orderBy(desc(circuitSeasons.startsAt))
    .limit(1);
  if (existing) {
    // Cheap phase advance check on every read so the UI never lags
    const now = new Date();
    if (existing.endsAt.getTime() <= now.getTime()) {
      // Past its end — kick the tick to close it
      await tickCircuitSeasons(now);
      const [refreshed] = await db.select().from(circuitSeasons)
        .where(eq(circuitSeasons.status, "active"))
        .orderBy(desc(circuitSeasons.startsAt))
        .limit(1);
      return refreshed ?? null;
    }
    const expectedPhase = getCurrentPhase(existing.startsAt, now);
    if (expectedPhase !== existing.phase) {
      await db.update(circuitSeasons)
        .set({ phase: expectedPhase })
        .where(eq(circuitSeasons.id, existing.id));
      return { ...existing, phase: expectedPhase } as CircuitSeasonRow;
    }
    return existing;
  }

  // No active season — open one if we're inside a window
  const now = new Date();
  const windowStart = computeCurrentSeasonStart(now);
  if (!windowStart || !isCircuitOpen(now)) return null;
  return openSeasonIfMissing(windowStart);
}

/**
 * Append a bone obstacle to the active season's stored list. Capped so
 * the JSON column does not grow without bound. Cap is multiplied by the
 * supplied modifier so Necromancer Return etc. can grow the cap.
 */
export async function appendBoneObstacle(
  seasonId: number,
  obstacle: { x: number; z: number },
  cap: number = 200,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const [s] = await db.select().from(circuitSeasons)
    .where(eq(circuitSeasons.id, seasonId))
    .limit(1);
  if (!s) return;
  const list = (s.boneObstacles ?? []).slice(0);
  list.push(obstacle);
  // FIFO eviction once we exceed the cap so the JSON column has bounded size
  while (list.length > cap) list.shift();
  await db.update(circuitSeasons)
    .set({ boneObstacles: list })
    .where(eq(circuitSeasons.id, seasonId));
}

/** Persist the universe event snapshot on the active season. */
export async function snapshotUniverseEvents(seasonId: number, eventIds: string[]): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(circuitSeasons)
    .set({ activeUniverseEvents: eventIds })
    .where(eq(circuitSeasons.id, seasonId));
}

/** Increment season-level race/death counters. */
export async function bumpSeasonStats(
  seasonId: number,
  raceDelta: number,
  deathDelta: number,
  phase: SeasonPhase,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(circuitSeasons)
    .set({
      totalRaces: sql`${circuitSeasons.totalRaces} + ${raceDelta}`,
      totalDeaths: sql`${circuitSeasons.totalDeaths} + ${deathDelta}`,
      phase,
    })
    .where(eq(circuitSeasons.id, seasonId));
}
