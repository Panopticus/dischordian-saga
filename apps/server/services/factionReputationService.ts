/* ═══════════════════════════════════════════════════════
   FACTION REPUTATION SERVICE

   Server-derived faction reputation, replacing the
   client-supplied input that was disabled in G11.

   Source of truth: `userProgress.gameData.factionReputation`
   as `Record<factionKey, number>`. Mutated by
   `tradeContracts.ts` when contract effects of kind
   `faction_reputation_delta` fire (and any future system
   that adjusts reputation).

   Bounded to ±REP_BOUND so a corrupted state can't yield
   absurd trade discounts. Bleeds toward zero by 1 unit
   per hourly tick so a one-time max-out doesn't grant
   permanent discounts.

   See docs/operations/TRADE_DIPLOMACY.md for the
   re-enable rationale.
   ═══════════════════════════════════════════════════════ */
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";

/** Hard reputation clamp range. Values outside [-REP_BOUND, REP_BOUND]
 *  are treated as their bound — defense-in-depth against any path that
 *  bypasses the mutation helpers. */
export const REP_BOUND = 1000;

/** Maximum trade-price discount (or markup) a player can pull from
 *  faction reputation. Matches the legacy disabled-block ceiling. */
export const MAX_TRADE_DISCOUNT = 0.15;

/** Linear decay per hourly tick. Slow enough that high reputations
 *  feel earned (rep=1000 fully decays in ~42 days) but fast enough
 *  that decade-old grinds don't give permanent discounts. */
export const DECAY_PER_TICK = 1;

type GameDataLike = Record<string, unknown>;

function readFactionRepFromGameData(
  gameData: GameDataLike | null | undefined,
): Record<string, number> {
  if (!gameData) return {};
  const raw = gameData.factionReputation;
  if (!raw || typeof raw !== "object") return {};
  return raw as Record<string, number>;
}

/** Clamp a reputation value into the bounded range. */
export function boundReputation(rep: number): number {
  if (!Number.isFinite(rep)) return 0;
  if (rep > REP_BOUND) return REP_BOUND;
  if (rep < -REP_BOUND) return -REP_BOUND;
  return Math.trunc(rep);
}

/**
 * Compute the trade-price discount factor from a bounded reputation.
 * Returns a number in `[1 - MAX_TRADE_DISCOUNT, 1 + MAX_TRADE_DISCOUNT]`
 * (note: positive rep ↦ <1 multiplier ↦ cheaper buy / better sell).
 * Pure — no DB, fully unit-testable.
 */
export function computeTradePriceMultiplier(rep: number): number {
  const bounded = boundReputation(rep);
  const ratio = bounded / REP_BOUND; // in [-1, 1]
  // Positive rep cheapens prices; negative rep marks them up.
  return 1 - ratio * MAX_TRADE_DISCOUNT;
}

/**
 * Read the full faction reputation map for a user. Returns `{}` if
 * no row, no DB, or no faction reputation has been written yet.
 */
export async function getFactionReputation(
  userId: number,
): Promise<Record<string, number>> {
  try {
    const db = await getDb();
    if (!db) return {};
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    return readFactionRepFromGameData(rows[0]?.gameData as GameDataLike);
  } catch (err) {
    logger.warn("faction_rep_read_failed", "factionReputationService", {
      userId,
      err: String(err),
    });
    return {};
  }
}

/**
 * Read a single faction's reputation for a user, bounded into
 * the ±REP_BOUND range. Returns 0 when no value exists.
 */
export async function getReputationFor(
  userId: number,
  factionKey: string,
): Promise<number> {
  const rep = await getFactionReputation(userId);
  return boundReputation(rep[factionKey] ?? 0);
}

/**
 * Pure transform — apply a delta to a faction key inside a gameData
 * blob. Bounded on both sides: the previous value is clamped before
 * the addition (defense against corrupted state) and the next value
 * is clamped after (so a +9999 delta can't escape the ±REP_BOUND
 * range). Exposed for unit testing the math without DB.
 */
export function applyDeltaToGameData(
  gameData: GameDataLike | null | undefined,
  factionKey: string,
  delta: number,
): { nextGameData: GameDataLike; previousValue: number; nextValue: number } {
  const safe = (gameData ?? {}) as GameDataLike;
  const rep = readFactionRepFromGameData(safe);
  const previousValue = boundReputation(rep[factionKey] ?? 0);
  const proposed = Number.isFinite(delta) ? previousValue + delta : previousValue;
  const nextValue = boundReputation(proposed);
  const nextRep = { ...rep, [factionKey]: nextValue };
  return {
    nextGameData: { ...safe, factionReputation: nextRep },
    previousValue,
    nextValue,
  };
}

/**
 * Apply a bounded delta to one faction's reputation and persist.
 * Owns the read-modify-write round-trip end-to-end so callers
 * can't bypass the ±REP_BOUND clamp by composing ad-hoc reads
 * with their own writes (the bug shape the audit flagged in
 * tradeContracts.ts before this helper existed).
 *
 * Returns null when the DB is unavailable or the row insert/update
 * fails; otherwise returns the previous and next bounded values.
 */
export async function applyFactionReputationDelta(
  userId: number,
  factionKey: string,
  delta: number,
): Promise<{ previousValue: number; nextValue: number } | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const row = rows[0];
    const { nextGameData, previousValue, nextValue } = applyDeltaToGameData(
      (row?.gameData as GameDataLike) ?? {},
      factionKey,
      delta,
    );
    if (row) {
      await db
        .update(userProgress)
        .set({ gameData: nextGameData })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({ userId, gameData: nextGameData });
    }
    return { previousValue, nextValue };
  } catch (err) {
    logger.warn("faction_rep_apply_failed", "factionReputationService", {
      userId,
      factionKey,
      delta,
      err: String(err),
    });
    return null;
  }
}

/**
 * Bleed every non-zero faction-reputation row toward zero by
 * DECAY_PER_TICK. Idempotent (running twice in a row just decays
 * twice). Fire-and-forget — errors are logged but never throw.
 *
 * Implementation note: walks every userProgress row with a
 * non-empty factionReputation map. The cost scales with the
 * active player base, not total signups. For larger deployments
 * this should move to a paginated batch loop, but at the current
 * scale a single sweep is fine.
 */
export async function runFactionReputationDecayTick(): Promise<{
  rowsTouched: number;
}> {
  try {
    const db = await getDb();
    if (!db) return { rowsTouched: 0 };

    const rows = await db
      .select({ userId: userProgress.userId, gameData: userProgress.gameData })
      .from(userProgress);

    let rowsTouched = 0;
    for (const row of rows) {
      const gameData = (row.gameData as GameDataLike) ?? {};
      const rep = readFactionRepFromGameData(gameData);
      const keys = Object.keys(rep);
      if (keys.length === 0) continue;

      let mutated = false;
      const next: Record<string, number> = {};
      for (const k of keys) {
        const cur = boundReputation(rep[k]);
        if (cur === 0) {
          next[k] = 0;
          continue;
        }
        const decayed = cur > 0
          ? Math.max(0, cur - DECAY_PER_TICK)
          : Math.min(0, cur + DECAY_PER_TICK);
        next[k] = decayed;
        if (decayed !== rep[k]) mutated = true;
      }
      if (!mutated) continue;

      const nextGameData: GameDataLike = {
        ...gameData,
        factionReputation: next,
      };
      await db
        .update(userProgress)
        .set({ gameData: nextGameData })
        .where(eq(userProgress.userId, row.userId))
        .catch(() => {/* best-effort */});
      rowsTouched++;
    }

    if (rowsTouched > 0) {
      logger.info("faction_rep_decay_tick", "factionReputationService", {
        rowsTouched,
        decayPerTick: DECAY_PER_TICK,
      });
    }
    return { rowsTouched };
  } catch (err) {
    console.error("[FactionReputation] decay tick failed:", err);
    return { rowsTouched: 0 };
  }
}
