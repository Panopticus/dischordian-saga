/**
 * MatchView — read-only Team-aware projection over a GameState.
 *
 * Tier 3 next slice. Provides a stable view layer that 2v2 / co-op /
 * FFA consumer code can program against, even while the underlying
 * reducer remains 1v1 (Side = 0 | 1) internally. When the reducer
 * eventually migrates to native N-player, the view contract stays
 * the same and the projection becomes a pass-through.
 *
 * Pure / no I/O / serialisable.
 */
import type { GameState } from "./GameState";
import type { Side } from "./Ids";
import type {
  MatchPlayerSlot,
  Team,
  TurnOrder,
} from "./Teams";
import {
  TURN_ORDER_1V1,
  teams1v1,
} from "./Teams";

/**
 * The team-aware view over a match. Read-only by contract; consumers
 * build their own action payloads using `actorSlot` and pass them to
 * the reducer (which still sees Side internally).
 */
export interface MatchView {
  readonly matchId: string;
  /** Slots present in the match. For 1v1 this is [0, 1]. */
  readonly slots: readonly MatchPlayerSlot[];
  readonly teams: readonly Team[];
  readonly turnOrder: TurnOrder;
  readonly currentSlot: MatchPlayerSlot;
  readonly winnerSlot: MatchPlayerSlot | null;
}

/**
 * Project a 1v1 GameState into the team-aware view. The returned
 * view is structurally identical for 1v1 callers — they get
 * `slots: [0, 1]` and the canonical `teams1v1()` partition.
 */
export function viewOf(state: GameState): MatchView {
  return {
    matchId: state.matchId,
    slots: [0, 1],
    teams: teams1v1(),
    turnOrder: TURN_ORDER_1V1,
    currentSlot: state.currentPlayer,
    winnerSlot: state.winner,
  };
}

/**
 * Adapter — given a `Side` action target (existing 1v1 calls), return
 * the equivalent `MatchPlayerSlot`. Used at the boundary between
 * legacy 1v1 callers and team-aware downstream code.
 */
export function actorSlotFromSide(side: Side): MatchPlayerSlot {
  return side;
}

/**
 * Inverse — given a `MatchPlayerSlot` (team-aware code) and a
 * `MatchView`, ensure the slot is legal for the current view. Returns
 * the slot as a `Side` for routing into the existing reducer.
 *
 * For 1v1 views, slot must be 0 or 1. For multi-team views (future),
 * the caller is responsible for ensuring the slot belongs to a
 * controlled-by-this-client team before calling.
 */
export function sideFromActorSlot(
  view: MatchView,
  slot: MatchPlayerSlot,
): Side {
  if (!view.slots.includes(slot)) {
    throw new Error(`sideFromActorSlot: slot ${slot} not in view (slots=${view.slots.join(",")})`);
  }
  if (slot !== 0 && slot !== 1) {
    throw new Error(`sideFromActorSlot: slot ${slot} not representable as Side`);
  }
  return slot as Side;
}

/**
 * Apply a "next turn" tick using the view's turn order. Returns the
 * slot that will play next. Pure — does not mutate state. The
 * reducer remains the only writer.
 */
export function peekNextSlot(view: MatchView): MatchPlayerSlot {
  const idx = view.turnOrder.slots.indexOf(view.currentSlot);
  if (idx < 0) return view.turnOrder.slots[0] ?? view.currentSlot;
  return view.turnOrder.slots[(idx + 1) % view.turnOrder.slots.length] ?? view.currentSlot;
}
