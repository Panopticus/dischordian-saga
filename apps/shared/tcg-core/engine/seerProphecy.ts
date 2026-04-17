/**
 * §4.9 Seer prophecy-mechanic — pure state transitions.
 *
 * Pure helpers for the pending-future bake/consume cycle and for
 * the outcome-derivation logic that picks between "defeated",
 * "scripted_loss", and "fled". Reducer integration (retroactive
 * re-routing of player card effects, silent re-routes on
 * contradictions) is a follow-up PR; this module owns the state
 * shape, sampling, and outcome rules.
 *
 * Spec: docs/production/act1/seer-prophecy-mechanic.md.
 */

import {
  BURNT_CARD_PLACEHOLDER_ID,
  type ProphecyModeConfig,
  type SeerOutcome,
  type SeerPendingFuture,
  type SeerProphecyState,
} from "../types/SeerProphecy";
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { ReduceCtx } from "./reducer";
import { rngPick } from "./rng";
import { handlePlayCard } from "./playCard";

/** Default scripted-loss sequence length. Spec §4 says "6-8 turns". */
export const DEFAULT_PROPHECY_TURN_COUNT = 6;

/**
 * Initial state. No pending play baked yet — the first bake happens
 * at the start of the first player turn, triggered by the reducer's
 * turn-refresh hook (follow-up PR).
 */
export function initSeerProphecyState(
  _config: ProphecyModeConfig = {},
): SeerProphecyState {
  return { pending: null, playsPerformed: 0 };
}

/**
 * Read the configured turn count, clamped to a sane range. Spec §4
 * says "6-8". Values <1 or non-finite fall back to the default.
 */
export function prophecyTurnCount(config: ProphecyModeConfig = {}): number {
  const t = config.turnCount;
  if (typeof t !== "number" || !Number.isFinite(t) || t < 1) {
    return DEFAULT_PROPHECY_TURN_COUNT;
  }
  return Math.floor(t);
}

/**
 * Bake a future play into the state. Caller supplies the sampled
 * cardDefId (drawn from the Seer's future-turn possibilities) and
 * the turnIndex the play will land on. No-op when a pending future
 * is already baked — spec §3.1 says the pending future is
 * one-directional; overwriting would break the invariant.
 */
export function bakeSeerFuture(
  state: SeerProphecyState,
  cardDefId: string,
  turnIndex: number,
): SeerProphecyState {
  if (state.pending) return state;
  if (!cardDefId) return state;
  if (!Number.isFinite(turnIndex) || turnIndex < 1) return state;
  return {
    ...state,
    pending: {
      cardDefId,
      turnIndex: Math.floor(turnIndex),
    },
  };
}

/**
 * Consume a pending future when its turn arrives. Returns the
 * consumed SeerPendingFuture (for the caller to play) and a new
 * state with pending cleared + playsPerformed incremented. Returns
 * null pending when there was nothing to consume — the caller treats
 * that as a no-op.
 */
export function consumeSeerFuture(
  state: SeerProphecyState,
  currentTurn: number,
): {
  consumed: SeerPendingFuture | null;
  next: SeerProphecyState;
} {
  if (!state.pending) return { consumed: null, next: state };
  if (state.pending.turnIndex !== currentTurn) {
    // Not time yet — leave the bake in place.
    return { consumed: null, next: state };
  }
  return {
    consumed: state.pending,
    next: {
      pending: null,
      playsPerformed: state.playsPerformed + 1,
    },
  };
}

/**
 * True when the player's deck carries the burnt-card placeholder
 * (spec §3.3 — the one winnable path). The card is reserved in the
 * schema but never populated in a normal live card pool; Acts 2+
 * unlock routes deliver it retroactively.
 */
export function playerDeckUnlocksWinnablePath(
  deckCardDefIds: readonly string[],
): boolean {
  return deckCardDefIds.includes(BURNT_CARD_PLACEHOLDER_ID);
}

/** Outcome-derivation inputs. */
export interface DeriveSeerOutcomeInput {
  /** Did the player concede mid-match? */
  conceded: boolean;
  /** Did the player's general kill the Seer? (Combat outcome.) */
  seerGeneralKilled: boolean;
  /** Does the player's deck carry the burnt-card placeholder? */
  winnablePathUnlocked: boolean;
  /** How many Seer prophecy plays landed? Scripted-loss triggers
   *  when this reaches the configured turnCount. */
  playsPerformed: number;
  /** Configured total prophecy plays for the match. */
  turnCount: number;
}

/**
 * Decide which of the three terminal outcomes applies (spec §5).
 * Priority order:
 *   1. fled           conceded at any time
 *   2. defeated       seer general killed AND winnable path unlocked
 *   3. scripted_loss  prophecy sequence completed
 *   4. null           match still in progress / not terminal
 */
export function deriveSeerOutcome(
  input: DeriveSeerOutcomeInput,
): SeerOutcome | null {
  if (input.conceded) return "fled";
  if (input.seerGeneralKilled && input.winnablePathUnlocked) {
    return "defeated";
  }
  if (input.playsPerformed >= input.turnCount) {
    return "scripted_loss";
  }
  return null;
}

/** How far ahead the Seer may "see" into her deck. Spec §3.1 says
 *  plays are "drawn from a future turn" — the window bounds how
 *  far into the future the engine samples from. */
export const SEER_FUTURE_LOOKAHEAD_WINDOW = 5;

/**
 * Sample the cardDefId of the future card the Seer will play.
 *
 * Draws from the first N entries of her deck (post-current-draws).
 * Per spec §3.1 these are the "future-turn draws" the Seer can see;
 * picking one uniformly is the canonical sampling rule.
 *
 * Falls back to the first card in hand when the deck window is
 * empty, and returns null when hand + deck are both empty (match
 * should be over anyway — the consumer no-ops cleanly).
 */
export function sampleSeerFutureCard(
  draft: Draft<GameState>,
  ctx: ReduceCtx,
): string | null {
  const seer = draft.players[1];
  const windowSlice = seer.deck
    .slice(0, SEER_FUTURE_LOOKAHEAD_WINDOW)
    .map((c) => c.defId);
  if (windowSlice.length > 0) {
    return rngPick(ctx.rng, windowSlice) ?? null;
  }
  // Deck exhausted — fall back to whatever's still in hand so the
  // prophecy sequence can complete cleanly.
  if (seer.hand.length > 0) {
    return rngPick(
      ctx.rng,
      seer.hand.map((c) => c.defId),
    ) ?? null;
  }
  return null;
}

/**
 * Force the Seer (side 1) to play the given cardDefId. Mirrors
 * scriptedActions.runForcePlayCard but adds the spec §2.1
 * "hand-count does not decrement" semantic: after the play resolves,
 * the Seer draws one card to restore her hand size.
 *
 * Emits a `scripted_action_fired` event tagged with the actual
 * cardDefId so the UI can render the prophecy play without new
 * event-schema surface.
 */
export function forceSeerPlay(
  draft: Draft<GameState>,
  cardDefId: string,
  ctx: ReduceCtx,
): void {
  const seer = draft.players[1];
  let handIndex = seer.hand.findIndex((c) => c.defId === cardDefId);
  if (handIndex === -1) {
    const deckIndex = seer.deck.findIndex((c) => c.defId === cardDefId);
    if (deckIndex === -1) {
      ctx.events.push({
        type: "scripted_action_skipped",
        reason: "seer_card_not_in_hand_or_deck",
        cardDefId,
        side: 1,
        globalTurn: draft.turnNumber,
      });
      return;
    }
    const card = seer.deck[deckIndex];
    seer.deck = [
      ...seer.deck.slice(0, deckIndex),
      ...seer.deck.slice(deckIndex + 1),
    ];
    seer.hand = [...seer.hand, card];
    handIndex = seer.hand.length - 1;
  }

  const handCountBefore = seer.hand.length;
  const err = handlePlayCard(
    draft,
    {
      kind: "play_card" as const,
      actor: 1,
      seq: draft.actionSeq,
      handIndex,
    },
    ctx,
  );
  if (err) {
    ctx.events.push({
      type: "scripted_action_skipped",
      reason: `seer_play_card_error_${err.code}`,
      cardDefId,
      side: 1,
      globalTurn: draft.turnNumber,
    });
    return;
  }

  // Spec §2.1 — her hand-count indicator does not decrement.
  // Re-draw one card from the deck (if any remain) so hand size
  // holds steady at handCountBefore.
  if (draft.players[1].hand.length < handCountBefore && draft.players[1].deck.length > 0) {
    const drawn = draft.players[1].deck[0];
    draft.players[1].deck = draft.players[1].deck.slice(1);
    draft.players[1].hand = [...draft.players[1].hand, drawn];
  }

  ctx.events.push({
    type: "scripted_action_fired",
    cardDefId,
    side: 1,
    globalTurn: draft.turnNumber,
  });
}
