/* ═══════════════════════════════════════════════════════
   FRONTIER ROTATION SERVICE — §8.10 of the Trade Empire
   merge spec. Maintains the singleton "current frontier"
   state: which two sectors are flagged frontier this
   season. Rotates on the interregnum→prologue transition.

   In-memory only for now (Phase D state is short-lived;
   restart restores from a fresh rotation). The history is
   tracked so a sector can't be re-frontier within
   FRONTIER_COOLDOWN_SEASONS. Convergence-Climax open phase
   freezes rotation per the §8.10 spec.
   ═══════════════════════════════════════════════════════ */

import {
  FRONTIER_CANDIDATES,
  pickFrontierRotation,
} from "@shared/tradeEmpire/frontier";

/** Reward multiplier applied to mission completion in a frontier sector. */
export const FRONTIER_REWARD_MULTIPLIER = 1.5;
/** Saturation bump multiplier in a frontier sector (the rush floods them). */
export const FRONTIER_SATURATION_MULTIPLIER = 1.25;
/** Seasons a sector must wait before becoming frontier again. */
export const FRONTIER_COOLDOWN_SEASONS = 2;

interface FrontierState {
  /** Sectors currently flagged frontier — typically [opening, lastOpened]
   *  during the current season. */
  activeFrontierIds: ReadonlyArray<string>;
  /** Per-sector season number when it was last opened as frontier. Used
   *  to enforce the cooldown. */
  lastOpenedSeason: Record<string, number>;
  /** The single most-recent opening, used by pickFrontierRotation
   *  as `lastOpened` so it relaxes back next rotation. */
  lastOpening: string | null;
}

let state: FrontierState = {
  activeFrontierIds: [],
  lastOpenedSeason: {},
  lastOpening: null,
};

export function getActiveFrontierIds(): ReadonlyArray<string> {
  return state.activeFrontierIds;
}

export function isFrontierSector(sectorId: string): boolean {
  return state.activeFrontierIds.includes(sectorId);
}

/**
 * Drives the seasonal rotation. Call from seasonTickService when the
 * phase transitions interregnum → prologue. `seasonNumber` is the new
 * season we're rotating into; `climaxOpen` true freezes the rotation.
 *
 * Returns the picked rotation for the caller to log / post as
 * public knowledge.
 */
export function rotateFrontier(
  seasonNumber: number,
  climaxOpen: boolean,
  rng: () => number = Math.random,
): { opening: string; relaxing: string | null; frozen: boolean } {
  if (climaxOpen) {
    return {
      opening: state.lastOpening ?? FRONTIER_CANDIDATES[0],
      relaxing: null,
      frozen: true,
    };
  }
  // Skip candidates currently on cooldown.
  const eligible = FRONTIER_CANDIDATES.filter(s => {
    const last = state.lastOpenedSeason[s] ?? -Infinity;
    return s !== state.lastOpening
      && seasonNumber - last >= FRONTIER_COOLDOWN_SEASONS;
  });
  // If everything is on cooldown (happens when CANDIDATES.length is
  // small relative to cooldown), fall back to the original picker.
  let pick;
  if (eligible.length === 0) {
    pick = pickFrontierRotation(state.lastOpening, rng);
  } else {
    const opening = eligible[Math.floor(rng() * eligible.length)];
    pick = { opening, relaxing: state.lastOpening };
  }
  // Active frontier this season = the new opening + the one relaxing
  // (the relaxing one is still frontier-flavoured during transition).
  const activeFrontierIds = pick.relaxing
    ? [pick.opening, pick.relaxing]
    : [pick.opening];
  state = {
    activeFrontierIds,
    lastOpenedSeason: { ...state.lastOpenedSeason, [pick.opening]: seasonNumber },
    lastOpening: pick.opening,
  };
  return { ...pick, frozen: false };
}

/** Test hook. */
export function _resetFrontierState(): void {
  state = {
    activeFrontierIds: [],
    lastOpenedSeason: {},
    lastOpening: null,
  };
}
