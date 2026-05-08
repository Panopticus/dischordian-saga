/* ═══════════════════════════════════════════════════════
   WORLD MOOD SERVICE — Four Horsemen as derived weather

   Pure derivation: composes a {@link WorldMood} from existing
   pressure / palimpsest / narrative-flag signals plus the
   broken-seal baseline contributions. No DB writes.

   Two scopes:
     - forPlayer(userId) — that player's personal weather
     - global()          — the saga's weather, flag-derived

   In-process LRU cache, 60s TTL. Mood is read-only.

   The seal baseline contributions live in
   apps/shared/worldMood.ts (SEAL_HORSEMAN_BASELINE) and tighten
   each horseman as the spine cracks. The Mercy blend (charity
   donations, social counter-tick) subtracts from Famine + Death.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import {
  composeWorldMood,
  sumContributions,
  SEAL_HORSEMAN_BASELINE,
  type WorldMood,
  type MoodContribution,
} from "@shared/worldMood";
import { isSealBroken, type SealNumber } from "@shared/sevenSeals";
import { pressureService } from "./pressureService";
import { palimpsestService } from "./palimpsestService";
import { logger } from "../logger";

const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  mood: WorldMood;
  expiresAt: number;
}

const moodCache = new Map<string, CacheEntry>();

function cacheKey(userId: number | "global"): string {
  return typeof userId === "number" ? `u:${userId}` : "global";
}

function getCached(key: string): WorldMood | null {
  const entry = moodCache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    moodCache.delete(key);
    return null;
  }
  return entry.mood;
}

function setCached(key: string, mood: WorldMood): void {
  moodCache.set(key, { mood, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * Normalize a raw pressure count to a 0..1 axis tilt.
 *
 * Picks a soft saturation curve so a small amount of pressure has
 * visible effect but the axis never pegs at 1.0 from a single cause.
 * `count / (count + halfPoint)` gives 0.5 at halfPoint, 0.67 at 2x,
 * 0.83 at 5x — adequate range for the gauge.
 */
function tilt(count: number, halfPoint: number): number {
  if (count <= 0) return 0;
  return count / (count + halfPoint);
}

/**
 * Fetch the broken-seal set for a single player from
 * `userProgress.gameData.narrativeFlags`. Reads `act_<n>_complete`
 * flags. Returns an empty array on missing DB, missing row, or
 * unexpected shape — Mercy is additive, never required.
 */
async function brokenSealsForPlayer(
  userId: number,
): Promise<ReadonlyArray<SealNumber>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const { userProgress } = await import("../../db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const data = rows[0]?.gameData as
      | { narrativeFlags?: Record<string, unknown> }
      | null
      | undefined;
    const flags = data?.narrativeFlags;
    if (!flags || typeof flags !== "object") return [];
    const out: SealNumber[] = [];
    for (const [name, value] of Object.entries(flags)) {
      if (value !== true) continue;
      const m = /^act_([1-7])_complete[d]?$/.exec(name);
      if (m) out.push(Number(m[1]) as SealNumber);
    }
    return out;
  } catch (err) {
    logger.error("[worldMood] brokenSealsForPlayer failed:", err);
    return [];
  }
}

/**
 * Compose the seal-baseline contribution from a list of broken-seal
 * numbers. Pure function — exposed for tests.
 */
export function sealBaselineContribution(
  brokenSeals: ReadonlyArray<SealNumber>,
): MoodContribution {
  const parts: MoodContribution[] = [];
  for (const n of brokenSeals) {
    const baseline = SEAL_HORSEMAN_BASELINE[n];
    if (baseline) parts.push(baseline);
  }
  return sumContributions(parts);
}

/**
 * Compose the runtime-derived contribution from a snapshot of
 * pressure signals. Pure function — exposed for tests.
 *
 * The mapping is deliberately conservative: each pressure family
 * only feeds one or two axes, so the gauge stays interpretable.
 *
 * - deaths / casualty crawl → Death
 * - trustGains              → -Death (companionship offsets)
 * - viralExposures          → War + Death (Terminus advance)
 * - betrayals               → War
 * - exploration             → Conquest
 * - loreDiscoveries         → Conquest
 * - moralityHumanity        → -Famine, -Death (Mercy precursor)
 * - healingDone             → -Famine
 *
 * Pressure values are large counters; we soft-saturate via {@link tilt}
 * so a noisy week doesn't peg the gauge.
 */
export function pressureContribution(p: {
  deaths: number;
  trustGains: number;
  viralExposures: number;
  betrayals: number;
  exploration: number;
  loreDiscoveries: number;
  moralityHumanity: number;
  healingDone: number;
}): MoodContribution {
  return {
    conquest:
      tilt(p.exploration, 50) * 0.5 + tilt(p.loreDiscoveries, 30) * 0.3,
    war: tilt(p.viralExposures, 40) * 0.4 + tilt(p.betrayals, 20) * 0.4,
    famine: -tilt(p.healingDone, 50) * 0.2 - tilt(p.moralityHumanity, 50) * 0.1,
    death:
      tilt(p.deaths, 30) * 0.5 +
      tilt(p.viralExposures, 60) * 0.2 -
      tilt(p.trustGains, 40) * 0.15 -
      tilt(p.moralityHumanity, 50) * 0.1,
  };
}

/**
 * Compute the current Mercy blend — donations + social counter-tick
 * minus Famine and Death. Returns the *positive* magnitude so the
 * mood widget can display it as a single number.
 *
 * In environments without DB or when the donation table is missing,
 * returns 0 — Mercy is additive, never required.
 */
export async function computeMercyOffset(): Promise<number> {
  // Stub for now — wire to apps/shared/donationSystem totals + the
  // social counter-tick aggregator in a follow-up. The gauge handles
  // mercyOffset === undefined gracefully.
  return 0;
}

export const worldMoodService = {
  /**
   * Compute or return cached world mood for a single player. The
   * player's broken seals add the canonical horseman baselines on
   * top of their personal pressure-derived axes.
   */
  async forPlayer(userId: number): Promise<WorldMood> {
    const key = cacheKey(userId);
    const cached = getCached(key);
    if (cached) return cached;

    const [pressure, seals, mercyOffset] = await Promise.all([
      pressureService.getAllPressures().catch(() => null),
      brokenSealsForPlayer(userId),
      computeMercyOffset(),
    ]);

    const parts: MoodContribution[] = [];
    if (pressure) parts.push(pressureContribution(pressure));
    parts.push(sealBaselineContribution(seals));
    if (mercyOffset > 0) parts.push({ famine: -mercyOffset, death: -mercyOffset });

    const mood = composeWorldMood(sumContributions(parts), {
      contributingSeals: seals,
      mercyOffset,
    });
    setCached(key, mood);
    return mood;
  },

  /**
   * Compute or return cached *global* world mood — the saga's
   * weather, flag-derived from the union of broken seals across
   * all active players.
   *
   * Conservative implementation: aggregates pressure across recent
   * activity rather than per-player. Refines in a follow-up when
   * the daily-brief surface needs it.
   */
  async global(): Promise<WorldMood> {
    const key = cacheKey("global");
    const cached = getCached(key);
    if (cached) return cached;

    const [pressure, mercyOffset] = await Promise.all([
      pressureService.getAllPressures().catch(() => null),
      computeMercyOffset(),
    ]);

    // Global seal contribution: assume the saga's most-progressed
    // cohort breaks all 7 seals eventually. For now, fall back to
    // an empty seal set; the worldMood router exposes a hook for
    // admins to override with the canonical "today" seal count.
    const parts: MoodContribution[] = [];
    if (pressure) parts.push(pressureContribution(pressure));
    if (mercyOffset > 0) parts.push({ famine: -mercyOffset, death: -mercyOffset });

    const mood = composeWorldMood(sumContributions(parts), {
      contributingSeals: [],
      mercyOffset,
    });
    setCached(key, mood);
    return mood;
  },

  /** Test-seam: clear the in-process cache. Used in vitest. */
  _clearCache() {
    moodCache.clear();
  },

  /** Test-seam: low-level composer for synthetic data. */
  _compose(
    pressureSnapshot: Parameters<typeof pressureContribution>[0],
    brokenSeals: ReadonlyArray<SealNumber>,
    mercyOffset: number,
  ): WorldMood {
    const parts: MoodContribution[] = [
      pressureContribution(pressureSnapshot),
      sealBaselineContribution(brokenSeals),
    ];
    if (mercyOffset > 0) parts.push({ famine: -mercyOffset, death: -mercyOffset });
    return composeWorldMood(sumContributions(parts), {
      contributingSeals: brokenSeals,
      mercyOffset,
    });
  },
};

// Re-export for convenience.
export { isSealBroken };
