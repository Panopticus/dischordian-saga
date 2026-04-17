/**
 * §5.6 Programmer match — gift-mechanic state machine.
 *
 * Pure state transitions over ProgrammerGiftState. No GameState
 * knowledge, no reducer coupling — callers compose this into
 * their match state wherever they need it.
 *
 * Transition rules:
 *   not_offered → offered    via offerGift(state, currentTurn)
 *   offered     → accepted   via acceptGift(state, currentTurn)
 *   offered     → declined   via declineGift(state, currentTurn)
 *
 * Any transition that doesn't match the above is a no-op (returns
 * the same reference) so callers can chain them safely.
 *
 * Spec: ACT1_NARRATIVE_STRUCTURE.md §5.6.
 */

import type {
  GiftModeConfig,
  ProgrammerGiftState,
} from "../types/ProgrammerGift";

/** Default earliest turn on which the gift can be offered. */
export const DEFAULT_EARLIEST_OFFER_TURN = 3;

/**
 * Initial state for a match that opts into giftMode. Always starts
 * "not_offered" so the match can open with legitimate plays before
 * the Programmer's AI triggers the gesture.
 */
export function initProgrammerGiftState(
  _config: GiftModeConfig = {},
): ProgrammerGiftState {
  return { status: "not_offered" };
}

/**
 * Read the earliest-offer turn from a gift config, with the
 * canonical default. Callers (AI scripted-action layer) use this
 * to gate their offer trigger.
 */
export function earliestOfferTurn(config: GiftModeConfig = {}): number {
  const t = config.earliestOfferTurn;
  return typeof t === "number" && Number.isFinite(t) && t >= 1
    ? Math.floor(t)
    : DEFAULT_EARLIEST_OFFER_TURN;
}

/**
 * True when the player may legitimately accept or decline right now
 * — i.e., the gift is currently on the table.
 */
export function isGiftPending(state: ProgrammerGiftState): boolean {
  return state.status === "offered";
}

/**
 * True once the player has made a terminal choice. Useful for the
 * AI to stop re-offering and for the UI to dismiss the pillar.
 */
export function isGiftResolved(state: ProgrammerGiftState): boolean {
  return state.status === "accepted" || state.status === "declined";
}

/**
 * Programmer AI transition: offer the gift on the given turn.
 * No-op unless status is `not_offered`. Enforces the earliest-turn
 * guard so the AI can't offer before the match has developed.
 */
export function offerGift(
  state: ProgrammerGiftState,
  currentTurn: number,
  config: GiftModeConfig = {},
): ProgrammerGiftState {
  if (state.status !== "not_offered") return state;
  if (currentTurn < earliestOfferTurn(config)) return state;
  return {
    status: "offered",
    offeredOnTurn: currentTurn,
  };
}

/**
 * Player transition: accept the throw. No-op unless status is
 * `offered`. Writes the resolution turn for analytics + replays.
 */
export function acceptGift(
  state: ProgrammerGiftState,
  currentTurn: number,
): ProgrammerGiftState {
  if (state.status !== "offered") return state;
  return {
    ...state,
    status: "accepted",
    resolvedOnTurn: currentTurn,
  };
}

/**
 * Player transition: decline the throw and keep fighting. No-op
 * unless status is `offered`. The match continues under standard
 * rules; the campaign flag records the refusal via a follow-up
 * write (Acts 2+ branch differently on declined vs never-offered).
 */
export function declineGift(
  state: ProgrammerGiftState,
  currentTurn: number,
): ProgrammerGiftState {
  if (state.status !== "offered") return state;
  return {
    ...state,
    status: "declined",
    resolvedOnTurn: currentTurn,
  };
}
