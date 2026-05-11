/**
 * Axis 9 — TV-infection state resolver (Phase H.D).
 *
 * Reads narrative flags from game state and synthesises the
 * appropriate {@link TVInfectionState} for compositeResolver
 * consumption.
 *
 * Canonical states (per INCEPTION §6.5 13-axis grid + producer-art
 * library state variants):
 *
 *   clean       — no TV infection visible (default)
 *   exposed     — first signs (wisps, motes, subtle hints)
 *   spreading   — TV-corruption visible in details (mycelium, etc.)
 *   corrupted   — heavy TV-corruption (voidblack pooling, severe rim shift)
 *   quarantined — yellow tape + sealed-X + Mechronis quarantine markers
 *
 * Two flag families drive the resolver:
 *
 *   GLOBAL    `tv_phase_<n>`         n = 0..4 ; 0 = clean, 4 = quarantined
 *   PER-ROOM  `room_<zipDir>_tv_<state>`  one-shot override
 *             (specific room is at <state>, ignoring global phase)
 *
 * Priority:
 *   1. per-room quarantined override (locks the room visually)
 *   2. per-room corrupted / spreading / exposed override
 *   3. global tv_phase_<n>
 *   4. default → "clean"
 */

import type { TVInfectionState } from "./stateVariantRegistry";

/** Read-only slice of GameState needed by the resolver. */
export interface Axis9GameSlice {
  /** Narrative flag map (per `apps/shared/flags/narrativeFlagRegistry.ts`). */
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
}

const TV_STATES_ASCENDING: readonly TVInfectionState[] = [
  "clean",
  "exposed",
  "spreading",
  "corrupted",
  "quarantined",
];

/** Canonical global flag id for `tv_phase_<n>` (0..4). */
export function tvPhaseFlag(n: 0 | 1 | 2 | 3 | 4): string {
  return `tv_phase_${n}`;
}

/** Canonical per-room override flag id. */
export function tvRoomOverrideFlag(
  zipDir: string,
  state: TVInfectionState,
): string {
  return `room_${zipDir}_tv_${state}`;
}

/**
 * Resolve the Axis 9 TV-infection state for a specific room.
 *
 * @param game        Read-only GameState slice (narrativeFlags map).
 * @param zipDir      Producer zipDir (= manifest folder name).
 * @returns           Canonical TVInfectionState; "clean" when no
 *                    flags drive the resolver.
 */
export function resolveAxis9State(
  game: Axis9GameSlice,
  zipDir: string,
): TVInfectionState {
  const flags = game.narrativeFlags;

  // 1. Per-room override (descending severity)
  for (const state of [...TV_STATES_ASCENDING].reverse()) {
    if (flags[tvRoomOverrideFlag(zipDir, state)]) {
      return state;
    }
  }

  // 2. Global tv_phase (highest set wins)
  for (let n = 4; n >= 0; n--) {
    if (flags[tvPhaseFlag(n as 0 | 1 | 2 | 3 | 4)]) {
      return TV_STATES_ASCENDING[n];
    }
  }

  // 3. Default
  return "clean";
}

/**
 * The full ordered list of TV-infection states (for tests + UI
 * enumerations).
 */
export const ALL_TV_STATES: readonly TVInfectionState[] = TV_STATES_ASCENDING;
