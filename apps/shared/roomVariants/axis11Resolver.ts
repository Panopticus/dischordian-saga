/**
 * Axis 11 — cycle-phase / time-of-day resolver (Phase H.E).
 *
 * Maps the wall-clock-derived {@link DayPhase} from
 * `apps/shared/timeOfDay.ts` into the canonical
 * {@link CyclePhaseState} the producer-art library indexes.
 *
 * Per H.A inventory the only cycle-axis variant currently delivered
 * is `state_cycle_longnight.png` (30 rooms). The producer's
 * "longnight" value is an extended-darkness atmosphere that
 * supersedes the standard "nightwatch" phase under specific
 * narrative + per-room conditions.
 *
 * Per-room phase-locks (per `_PRODUCTION_FINAL.md` §AC.8.2):
 *   - Warden's Dock (`dest.warden_dock`) — dawn-locked
 *   - Memory Library (`ark.memory_card_library`) — nightwatch-biased
 *   - The Forge (`ark.the_forge`) — nightwatch-biased (ember-glow strongest)
 *   - Day-21 Mechronis audits — dawn-locked
 *
 * These phase-locks override the wall-clock resolution; useful for
 * narrative beats that should fire at a specific atmospheric phase
 * regardless of when the player visits.
 */

import { currentPhase, type DayPhase } from "../timeOfDay";
import type { CyclePhaseState } from "./stateVariantRegistry";

/** Read-only slice needed by the Axis 11 resolver. */
export interface Axis11GameSlice {
  /** Narrative flag map. */
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
  /** Optional override for tests / replays (defaults to system clock). */
  readonly now?: Date;
}

/**
 * Per-room phase-lock registry (canonical from
 * `_PRODUCTION_FINAL.md` §AC.8.2).
 *
 * If a room is here, the resolver forces the locked phase
 * regardless of wall-clock or narrative state.
 */
export const ROOM_PHASE_LOCKS: ReadonlyMap<string, CyclePhaseState> =
  new Map<string, CyclePhaseState>([
    // dawn-locked (narrative-required atmospheric phase)
    ["warden_dock", "dawn"],
    // nightwatch-biased (atmospheric strongest at this phase, but
    // technically still visitable at other phases — we still hard-lock
    // here because the producer-art delivers the nightwatch overlay
    // as the canonical "atmospheric" variant)
    ["memory_card_library", "nightwatch"],
    ["the_forge", "nightwatch"],
  ]);

/**
 * Per-room narrative flag → forced "longnight" phase.
 *
 * "longnight" is a producer-axis value (see H.A taxonomy: 30
 * `state_cycle_longnight.png` files). The narrative system fires
 * `longnight_active` to globally tip every cycle-aware room into
 * the extended-darkness state.
 */
export const LONGNIGHT_GLOBAL_FLAG = "longnight_active";

/**
 * Resolve Axis 11 cycle-phase for a specific room.
 *
 * Priority:
 *   1. Per-room phase-lock (Warden's Dock dawn-only, etc.)
 *   2. Global `longnight_active` flag → "longnight"
 *   3. Wall-clock `currentPhase()` → DayPhase
 */
export function resolveAxis11State(
  game: Axis11GameSlice,
  zipDir: string,
): CyclePhaseState {
  // 1. Per-room phase-lock
  const locked = ROOM_PHASE_LOCKS.get(zipDir);
  if (locked) return locked;

  // 2. Global longnight override
  if (game.narrativeFlags[LONGNIGHT_GLOBAL_FLAG]) {
    return "longnight";
  }

  // 3. Wall-clock fallback
  const phase: DayPhase = currentPhase(game.now);
  return phase; // DayPhase is a subset of CyclePhaseState
}

/** All canonical Axis 11 states (DayPhase + longnight). */
export const ALL_CYCLE_STATES: readonly CyclePhaseState[] = [
  "dawn",
  "midday",
  "dusk",
  "nightwatch",
  "longnight",
];
