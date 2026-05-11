/**
 * Axis 12 — faction-livery state resolver (Phase H.F).
 *
 * Reads faction-binding state from narrative flags and synthesises
 * the appropriate {@link FactionLivery} for compositeResolver
 * consumption.
 *
 * Canonical states (per INCEPTION §6.5 13-axis grid):
 *
 *   none         — no faction allegiance committed (default)
 *   hierarchy    — Hierarchy-aligned
 *   dreamers     — Dreamers-aligned
 *   pureflame    — Pureflame-aligned
 *   insurgency   — Insurgency-aligned
 *   panopticon   — Panopticon-aligned
 *   collectors   — Collectors-aligned
 *   multi        — multiple factions committed simultaneously (player
 *                  has bound multiple faction-aspect rooms / oaths)
 *
 * Two flag families drive the resolver:
 *
 *   GLOBAL    `faction_bound_<id>`     — player has committed to <id>
 *                                       Multiple set → "multi"
 *   PER-ROOM  `room_<zipDir>_faction_<state>`  — locks one specific
 *                                                room to a faction-livery
 *                                                regardless of bindings
 *
 * Priority:
 *   1. per-room override
 *   2. count of faction_bound_* flags:
 *      0 set → "none"
 *      1 set → that faction
 *      2+ set → "multi"
 */

import type { FactionLivery } from "./stateVariantRegistry";

/** Read-only slice needed by the Axis 12 resolver. */
export interface Axis12GameSlice {
  /** Narrative flag map. */
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
}

/** All canonical Axis 12 states. */
export const ALL_FACTION_STATES: readonly FactionLivery[] = [
  "none",
  "hierarchy",
  "dreamers",
  "pureflame",
  "insurgency",
  "panopticon",
  "collectors",
  "multi",
];

/** Bindable faction ids (excludes "none" + "multi" which are computed). */
const BINDABLE_FACTIONS: readonly FactionLivery[] = [
  "hierarchy",
  "dreamers",
  "pureflame",
  "insurgency",
  "panopticon",
  "collectors",
];

/** Canonical global faction-binding flag id. */
export function factionBoundFlag(id: FactionLivery): string {
  return `faction_bound_${id}`;
}

/** Canonical per-room faction-livery override flag id. */
export function factionRoomOverrideFlag(
  zipDir: string,
  state: FactionLivery,
): string {
  return `room_${zipDir}_faction_${state}`;
}

/**
 * Resolve the Axis 12 faction-livery state for a specific room.
 *
 * @param game        Read-only GameState slice.
 * @param zipDir      Producer zipDir (= manifest folder name).
 * @returns           Canonical FactionLivery; "none" when no flags drive.
 */
export function resolveAxis12State(
  game: Axis12GameSlice,
  zipDir: string,
): FactionLivery {
  const flags = game.narrativeFlags;

  // 1. Per-room override — check each canonical state
  for (const state of ALL_FACTION_STATES) {
    if (flags[factionRoomOverrideFlag(zipDir, state)]) {
      return state;
    }
  }

  // 2. Count global faction bindings
  const bound: FactionLivery[] = BINDABLE_FACTIONS.filter(
    (id) => flags[factionBoundFlag(id)],
  );

  if (bound.length === 0) return "none";
  if (bound.length === 1) return bound[0];
  return "multi";
}
