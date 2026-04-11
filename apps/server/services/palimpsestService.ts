/* ═══════════════════════════════════════════════════════
   PALIMPSEST SERVICE — Signal/Noise meter state

   Thin per-user store for the Palimpsest dual meter. Pure
   reducers live in apps/shared/palimpsest.ts — this service
   only holds the state and exposes apply/read helpers that
   the ripple engine and routers can call.

   The in-memory store is intentional for Phase 1: no DB
   migration required, and the Chronicle system already
   persists episode outcomes for the narrative timeline.
   When (or if) cross-session persistence is needed, swap
   the Map for a DB-backed key-value store — the signatures
   don't change.
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
import { logger } from "../logger";

/** Per-user state. Global state is derived by summing. */
const userStates = new Map<number, PalimpsestState>();

/** Server-wide aggregate (used by the Governance Hub panel). */
let globalState: PalimpsestState = { ...DEFAULT_PALIMPSEST_STATE };

function getOrInit(userId: number): PalimpsestState {
  const existing = userStates.get(userId);
  if (existing) return existing;
  const fresh: PalimpsestState = {
    ...DEFAULT_PALIMPSEST_STATE,
    lastDecayAt: new Date().toISOString(),
    history: [],
  };
  userStates.set(userId, fresh);
  return fresh;
}

export const palimpsestService = {
  /** Get a user's current Palimpsest state (with passive decay applied). */
  get(userId: number): PalimpsestState {
    const decayed = applyPassiveDecay(getOrInit(userId));
    userStates.set(userId, decayed);
    return decayed;
  },

  /** Global aggregate — used by the illuminated manuscript panel on Governance Hub. */
  getGlobal(): PalimpsestState {
    return applyPassiveDecay(globalState);
  },

  /**
   * Apply a canonical delta to both the user's state and the global state.
   * Returns the new per-user state so callers can inspect phase transitions.
   */
  apply(
    userId: number,
    key: PalimpsestDeltaKey,
    multiplier: number = 1,
  ): PalimpsestState {
    const before = palimpsestService.get(userId);
    const after = applyPalimpsestDelta(before, key, multiplier);
    userStates.set(userId, after);
    globalState = applyPalimpsestDelta(globalState, key, multiplier);
    logger.debug(`[Palimpsest] user=${userId} applied=${key}x${multiplier}`, {
      signal: after.signal,
      noise: after.noise,
      phase: getPhase(after),
    });
    return after;
  },

  /** Apply a raw (signal, noise) delta. Used by tests and cross-system handlers. */
  applyRaw(userId: number, signalDelta: number, noiseDelta: number): PalimpsestState {
    const before = palimpsestService.get(userId);
    const after = applyRawDelta(before, signalDelta, noiseDelta);
    userStates.set(userId, after);
    globalState = applyRawDelta(globalState, signalDelta, noiseDelta);
    return after;
  },

  /** Record a Palimpsest episode outcome into the user's history. */
  recordEpisode(userId: number, record: Omit<EpisodeRecord, "completedAt">): PalimpsestState {
    const before = palimpsestService.get(userId);
    const after = recordEpisode(before, record);
    userStates.set(userId, after);
    return after;
  },

  /** Check whether the Host's mask should visibly slip on the next broadcast. */
  isMaskSlipping(userId: number): boolean {
    return shouldHostMaskSlip(palimpsestService.get(userId));
  },

  /** TEST ONLY — reset state. */
  _resetForTests(): void {
    userStates.clear();
    globalState = { ...DEFAULT_PALIMPSEST_STATE, history: [] };
  },
};
