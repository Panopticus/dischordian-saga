/* ═══════════════════════════════════════════════════════
   PALIMPSEST SERVICE — Signal/Noise meter state

   DB-backed per-user store for the Palimpsest dual meter.
   Pure reducers live in apps/shared/palimpsest.ts — this
   service reads/writes `palimpsest_state` rows and exposes
   apply/read helpers that the ripple engine and routers can
   call.

   Hot reads are memoized in a per-request LRU — each ripple
   handler calls `get()` and then `apply*()` in sequence, and
   we don't want two round trips when the reducer is pure.
   The cache is invalidated on every write.
   ═══════════════════════════════════════════════════════ */

import {
  DEFAULT_PALIMPSEST_STATE,
  applyPalimpsestDelta,
  applyRawDelta,
  applyPassiveDecay,
  recordEpisode,
  getPhase,
  shouldHostMaskSlip,
  type PalimpsestState,
  type PalimpsestDeltaKey,
  type EpisodeRecord,
} from "@shared/palimpsest";
import { getDb } from "../db";
import { palimpsestState as palimpsestTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../logger";

/** Lightweight write-through cache. Keyed by userId. */
const cache = new Map<number, PalimpsestState>();

/** Global aggregate — read by the Governance Hub panel. */
let globalAggregate: PalimpsestState = {
  ...DEFAULT_PALIMPSEST_STATE,
  lastDecayAt: new Date().toISOString(),
  history: [],
};

function rowToState(row: typeof palimpsestTable.$inferSelect): PalimpsestState {
  return {
    signal: row.signal,
    noise: row.noise,
    lastDecayAt: row.lastDecayAt.toISOString(),
    currentEpisode: row.currentEpisode,
    hostMaskSlipped: row.hostMaskSlipped === 1,
    history: (row.history ?? []) as unknown as PalimpsestState["history"],
  };
}

async function readFromDb(userId: number): Promise<PalimpsestState> {
  const db = await getDb();
  if (!db) return { ...DEFAULT_PALIMPSEST_STATE, history: [] };

  const [row] = await db
    .select()
    .from(palimpsestTable)
    .where(eq(palimpsestTable.userId, userId))
    .limit(1);

  if (!row) {
    // Lazy create on first read.
    const fresh: PalimpsestState = {
      ...DEFAULT_PALIMPSEST_STATE,
      lastDecayAt: new Date().toISOString(),
      history: [],
    };
    try {
      await db.insert(palimpsestTable).values({
        userId,
        signal: 0,
        noise: 0,
        currentEpisode: 1,
        hostMaskSlipped: 0,
        history: [],
      });
    } catch (e) {
      logger.warn(`[Palimpsest] Failed to lazy-create row for user ${userId}:`, e);
    }
    return fresh;
  }

  return rowToState(row);
}

async function writeToDb(userId: number, state: PalimpsestState): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(palimpsestTable)
    .set({
      signal: state.signal,
      noise: state.noise,
      lastDecayAt: new Date(state.lastDecayAt),
      currentEpisode: state.currentEpisode,
      hostMaskSlipped: state.hostMaskSlipped ? 1 : 0,
      history: state.history as unknown as Record<string, unknown>[],
    })
    .where(eq(palimpsestTable.userId, userId));
}

export const palimpsestService = {
  /** Get a user's current Palimpsest state (with passive decay applied). */
  async get(userId: number): Promise<PalimpsestState> {
    const cached = cache.get(userId);
    const base = cached ?? (await readFromDb(userId));
    const decayed = applyPassiveDecay(base);
    cache.set(userId, decayed);
    // If decay changed state, flush.
    if (decayed.signal !== base.signal || decayed.noise !== base.noise) {
      writeToDb(userId, decayed).catch((e) =>
        logger.warn(`[Palimpsest] decay flush failed for user ${userId}:`, e),
      );
    }
    return decayed;
  },

  /** Global aggregate — used by the illuminated manuscript panel on Governance Hub. */
  getGlobal(): PalimpsestState {
    const decayed = applyPassiveDecay(globalAggregate);
    globalAggregate = decayed; // Persist decay so lastDecayAt stays fresh.
    return decayed;
  },

  /**
   * Apply a canonical delta to both the user's state and the global state.
   * Returns the new per-user state so callers can inspect phase transitions.
   */
  async apply(
    userId: number,
    key: PalimpsestDeltaKey,
    multiplier: number = 1,
  ): Promise<PalimpsestState> {
    const before = await palimpsestService.get(userId);
    const after = applyPalimpsestDelta(before, key, multiplier);
    cache.set(userId, after);
    globalAggregate = applyPalimpsestDelta(globalAggregate, key, multiplier);
    writeToDb(userId, after).catch((e) =>
      logger.warn(`[Palimpsest] write failed for user ${userId}:`, e),
    );
    logger.debug(`[Palimpsest] user=${userId} applied=${key}x${multiplier}`, {
      signal: after.signal,
      noise: after.noise,
      phase: getPhase(after),
    });
    return after;
  },

  /** Apply a raw (signal, noise) delta. Used by tests and cross-system handlers. */
  async applyRaw(userId: number, signalDelta: number, noiseDelta: number): Promise<PalimpsestState> {
    const before = await palimpsestService.get(userId);
    const after = applyRawDelta(before, signalDelta, noiseDelta);
    cache.set(userId, after);
    globalAggregate = applyRawDelta(globalAggregate, signalDelta, noiseDelta);
    writeToDb(userId, after).catch((e) =>
      logger.warn(`[Palimpsest] write failed for user ${userId}:`, e),
    );
    return after;
  },

  /** Record a Palimpsest episode outcome into the user's history. */
  async recordEpisode(
    userId: number,
    record: Omit<EpisodeRecord, "completedAt">,
  ): Promise<PalimpsestState> {
    const before = await palimpsestService.get(userId);
    const after = recordEpisode(before, record);
    cache.set(userId, after);
    writeToDb(userId, after).catch((e) =>
      logger.warn(`[Palimpsest] recordEpisode flush failed for user ${userId}:`, e),
    );
    return after;
  },

  /** Check whether the Host's mask should visibly slip on the next broadcast. */
  async isMaskSlipping(userId: number): Promise<boolean> {
    return shouldHostMaskSlip(await palimpsestService.get(userId));
  },

  /** TEST ONLY — reset state. */
  _resetForTests(): void {
    cache.clear();
    globalAggregate = {
      ...DEFAULT_PALIMPSEST_STATE,
      lastDecayAt: new Date().toISOString(),
      history: [],
    };
  },
};
