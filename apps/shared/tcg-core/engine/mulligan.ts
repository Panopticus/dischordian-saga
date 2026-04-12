/**
 * Mulligan handlers.
 *
 * The mulligan phase lets each player swap any subset of their opening
 * hand for fresh draws before the match proper begins. Implementation:
 *
 *  - `handleMulligan` removes the indicated cards from the acting player's
 *    hand, shuffles them back into the deck, draws that many fresh cards
 *    into the hand. Deterministic from the match RNG. Each player may
 *    mulligan exactly once.
 *  - `handleFinishMulligan` advances phase to "playing" once both players
 *    have submitted. Until both are done, phase stays "mulligan" and only
 *    mulligan / finish_mulligan / concede actions are legal.
 *
 * Tracks per-player "has finished mulligan" via PlayerState.replaceUsed
 * repurposed during mulligan phase. This is a minor overload — in
 * "playing" phase replaceUsed tracks the once-per-turn Replace action.
 * Separate the field (add `mulliganDone: boolean`) if this becomes
 * ambiguous in the future. For now it's an intentional dual-purpose
 * flag, documented here.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { ReduceCtx } from "./reducer";
import { rngShuffle } from "./rng";
import { refreshTurnForPlayer } from "./turn";

export function handleMulligan(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "mulligan" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "mulligan") {
    return {
      code: "wrong_phase",
      message: "mulligan action is only legal during mulligan phase",
    };
  }
  const player = draft.players[action.actor];
  if (player.replaceUsed) {
    return {
      code: "action_already_used",
      message: "this player has already completed mulligan",
    };
  }
  // Validate indices.
  const indices = [...action.replaceIndices].sort((a, b) => b - a);
  for (const i of indices) {
    if (i < 0 || i >= player.hand.length) {
      return {
        code: "hand_index_out_of_bounds",
        message: `mulligan index ${i} out of bounds (hand size ${player.hand.length})`,
      };
    }
  }

  // Remove the selected cards from hand, push them into the deck.
  const removed: typeof player.hand = [];
  for (const i of indices) {
    removed.push(player.hand[i]);
    player.hand = [...player.hand.slice(0, i), ...player.hand.slice(i + 1)];
  }
  player.deck = [...player.deck, ...removed];

  // Shuffle deck via match RNG so the fresh draws are deterministic.
  player.deck = rngShuffle(ctx.rng, player.deck);

  // Draw `removed.length` fresh cards into the hand.
  const drawCount = Math.min(removed.length, player.deck.length);
  const drawn = player.deck.slice(0, drawCount);
  player.deck = player.deck.slice(drawCount);
  player.hand = [...player.hand, ...drawn];

  // Mark mulligan done for this player. Event for UI/log.
  player.replaceUsed = true;
  ctx.events.push({
    type: "mulligan_drawn",
    player: action.actor,
    replaced: drawCount,
  });

  return undefined;
}

export function handleFinishMulligan(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "finish_mulligan" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "mulligan") {
    return {
      code: "wrong_phase",
      message: "finish_mulligan only legal during mulligan phase",
    };
  }
  const player = draft.players[action.actor];
  if (!player.replaceUsed) {
    // Treat finish_mulligan as "mulligan nothing" — zero replace is
    // always legal. This saves the UI from having to send a redundant
    // mulligan action with an empty array first.
    player.replaceUsed = true;
    ctx.events.push({
      type: "mulligan_drawn",
      player: action.actor,
      replaced: 0,
    });
  }
  ctx.events.push({ type: "mulligan_finished", player: action.actor });

  // Advance phase once both players have committed.
  const bothDone = draft.players[0].replaceUsed && draft.players[1].replaceUsed;
  if (bothDone) {
    // Reset replaceUsed flags since they're about to be repurposed as
    // the once-per-turn Replace gate in "playing" phase.
    draft.players[0].replaceUsed = false;
    draft.players[1].replaceUsed = false;
    draft.phase = "playing";
    draft.currentPlayer = 0;
    draft.turnNumber = 1;
    // Refresh P0 for their first turn: +1 mana, draw a card, refresh
    // units (none at this point — just generals which don't act on turn 1
    // but still get actionsRemaining reset).
    refreshTurnForPlayer(draft, 0, ctx);
    ctx.events.push({ type: "turn_started", player: 0, turnNumber: 1 });
  }
  return undefined;
}
