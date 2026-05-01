/**
 * Team / multiplayer types — Tier 3 foundation.
 *
 * Introduces N-player types ADDITIVELY alongside the existing
 * `Side = 0 | 1` model. All existing 1v1 code keeps working
 * unchanged; new 2v2 / FFA / co-op code uses these types from
 * day one. A later sub-PR will migrate `Side` callers to
 * `MatchPlayerSlot` once the engine is fully N-player aware.
 *
 * Design invariants:
 *   - For 1v1: slot 0 ↔ Side 0, slot 1 ↔ Side 1. Conversion is a
 *     no-op cast in both directions; see `sideToSlot` /
 *     `slotToSide`.
 *   - For 2v2: slots are 0..3, teams partition them into two sets
 *     of two. Default turn order is alternating
 *     (T1A → T2A → T1B → T2B).
 *   - For co-op: one team is `isAi: true`. Turn order interleaves
 *     player + AI turns the same way 2v2 alternates teams.
 *   - For FFA (4-player free-for-all): four single-player teams,
 *     turn order is round-robin 0 → 1 → 2 → 3.
 */
import type { Side } from "./Ids";

/**
 * Index of a player's slot within a match. Generalises `Side`.
 * 1v1: 0 or 1. 2v2: 0..3. FFA: 0..3.
 *
 * Explicitly NOT a branded type because:
 *   - Existing code uses `Side` (0 | 1) widely; promoting to a
 *     branded type would force `as` casts at every callsite.
 *   - This type is small and meaningful enough that misuse is
 *     unlikely and TS will warn on out-of-range literals.
 */
export type MatchPlayerSlot = number;

/** Branded team identifier. */
export type TeamId = string & { readonly __brand: "TeamId" };
export const TeamId = (s: string): TeamId => s as TeamId;

/**
 * Team membership. For 1v1 each team has one slot; for 2v2 each
 * team has two; for co-op one team has `isAi: true`.
 */
export interface Team {
  readonly id: TeamId;
  readonly playerSlots: readonly MatchPlayerSlot[];
  /** Optional human-readable label ("Team A", "Witnesses", "Hierarchy"). */
  readonly name?: string;
  /** AI-controlled team — used for co-op encounters. */
  readonly isAi?: boolean;
  /** Optional shared flags (e.g. shared mana pool, shared draws).
   *  Empty for the default "shared general HP only" 2v2 model. */
  readonly sharedFlags?: Readonly<Record<string, unknown>>;
}

/**
 * Turn-order configuration. The match reducer cycles through
 * `slots` in order, wrapping at the end. Default for 1v1 is
 * `[0, 1]` which exactly mirrors the legacy `currentPlayer` flip.
 */
export interface TurnOrder {
  readonly slots: readonly MatchPlayerSlot[];
}

/** Match shape — what kind of multiplayer match this is. */
export type MatchShape =
  | { kind: "1v1" }
  | { kind: "2v2" }
  | { kind: "ffa"; playerCount: 3 | 4 }
  | { kind: "coop"; humanCount: 1 | 2; aiCount: 1 };

/** Convenience: standard 1v1 turn order. */
export const TURN_ORDER_1V1: TurnOrder = { slots: [0, 1] };

/** Convenience: default 2v2 alternating turn order (T1A→T2A→T1B→T2B). */
export const TURN_ORDER_2V2_ALTERNATING: TurnOrder = { slots: [0, 1, 2, 3] };

/** Convenience: 4-player FFA round-robin. */
export const TURN_ORDER_FFA_4: TurnOrder = { slots: [0, 1, 2, 3] };

/** Convenience: co-op (humans on team A, AI on team B). */
export const TURN_ORDER_COOP_2V1: TurnOrder = { slots: [0, 1, 2] };

/* ─── Adapter helpers (Side ↔ MatchPlayerSlot) ──────────────── */

/** No-op cast for legibility — Side IS a MatchPlayerSlot for 1v1. */
export function sideToSlot(s: Side): MatchPlayerSlot {
  return s;
}

/** Inverse direction — only safe when slot ∈ {0, 1}. */
export function slotToSide(slot: MatchPlayerSlot): Side {
  if (slot !== 0 && slot !== 1) {
    throw new Error(`slotToSide called with non-Side slot ${slot}`);
  }
  return slot as Side;
}

/* ─── Team-aware navigation ─────────────────────────────────── */

/** Look up which team a slot belongs to. */
export function teamForSlot(
  teams: readonly Team[],
  slot: MatchPlayerSlot,
): Team | undefined {
  return teams.find((t) => t.playerSlots.includes(slot));
}

/** Every slot belonging to the same team as `slot` (excluding `slot`). */
export function alliedSlots(
  teams: readonly Team[],
  slot: MatchPlayerSlot,
): readonly MatchPlayerSlot[] {
  const team = teamForSlot(teams, slot);
  if (!team) return [];
  return team.playerSlots.filter((s) => s !== slot);
}

/** Every slot NOT on the same team as `slot`. */
export function enemySlots(
  teams: readonly Team[],
  slot: MatchPlayerSlot,
): readonly MatchPlayerSlot[] {
  const team = teamForSlot(teams, slot);
  if (!team) return [];
  return teams
    .filter((t) => t.id !== team.id)
    .flatMap((t) => t.playerSlots);
}

/** Next slot in turn order, wrapping. */
export function nextSlotInOrder(
  order: TurnOrder,
  current: MatchPlayerSlot,
): MatchPlayerSlot {
  const idx = order.slots.indexOf(current);
  if (idx < 0) {
    // current isn't in the order — fall back to first slot.
    return order.slots[0] ?? current;
  }
  return order.slots[(idx + 1) % order.slots.length] ?? current;
}

/* ─── Standard-shape constructors ──────────────────────────── */

const TEAM_A = TeamId("team_a");
const TEAM_B = TeamId("team_b");
const TEAM_C = TeamId("team_c");
const TEAM_D = TeamId("team_d");

/** Build the canonical 1v1 team set: { team_a: [0], team_b: [1] }. */
export function teams1v1(): readonly Team[] {
  return [
    { id: TEAM_A, playerSlots: [0], name: "Player 1" },
    { id: TEAM_B, playerSlots: [1], name: "Player 2" },
  ];
}

/** Build a 2v2 team set: { team_a: [0,2], team_b: [1,3] } using
 *  alternating turn order. */
export function teams2v2(): readonly Team[] {
  return [
    { id: TEAM_A, playerSlots: [0, 2], name: "Team A" },
    { id: TEAM_B, playerSlots: [1, 3], name: "Team B" },
  ];
}

/** Co-op: humans on team A (slots 0,1), AI boss on team B (slot 2). */
export function teamsCoop2v1(): readonly Team[] {
  return [
    { id: TEAM_A, playerSlots: [0, 1], name: "Witnesses" },
    { id: TEAM_B, playerSlots: [2], name: "Boss", isAi: true },
  ];
}

/** 4-player FFA: each slot is its own team. */
export function teamsFfa4(): readonly Team[] {
  return [
    { id: TEAM_A, playerSlots: [0], name: "Player 1" },
    { id: TEAM_B, playerSlots: [1], name: "Player 2" },
    { id: TEAM_C, playerSlots: [2], name: "Player 3" },
    { id: TEAM_D, playerSlots: [3], name: "Player 4" },
  ];
}
