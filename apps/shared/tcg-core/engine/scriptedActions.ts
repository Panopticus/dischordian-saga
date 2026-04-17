/**
 * Scripted-action queue for set-piece boss matches.
 *
 * Some campaign matches require deterministic, story-critical plays
 * the generic AI heuristic can't guarantee. The §5.5 Warlord Zero
 * encounter is the canonical example: the Warlord MUST cast her
 * `s1_warlord_three_moves` card on her third turn to trigger the
 * three-move lockout (spec §2.2). The lockout's runtime
 * (engine/lockout.ts) is wired through the standard cast intercept,
 * but it never fires unless something causes that cast to happen.
 *
 * This module provides a per-match scripted-action queue authored on
 * `MatchConfig.scriptedActions` (and persisted on
 * `GameState.scriptedActions`). The queue is drained automatically
 * after each turn-refresh: any action whose `(globalTurn, side)`
 * matches the new active turn is performed before the player's or
 * AI's input is consulted.
 *
 * Currently the only kind is `force_play_card`. Extensions (scripted
 * board edits, scripted summons, scripted state-flag mutations) land
 * here as additional kind variants when their stories need them.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { Side } from "../types/Ids";
import type {
  ScriptedAction,
  ScriptedForcePlayCard,
  ScriptedOfferProgrammerGift,
} from "../types/ScriptedAction";
import type { ReduceCtx } from "./reducer";
import { handlePlayCard } from "./playCard";
import { offerGift } from "./programmerGift";

export type { ScriptedAction, ScriptedForcePlayCard, ScriptedOfferProgrammerGift };

/**
 * Walk `state.scriptedActions` and run every action whose
 * `(globalTurn, side)` matches the new active turn. Emits structured
 * events (`scripted_action_fired` / `scripted_action_skipped`) for
 * every attempt so debugging the queue is straightforward.
 *
 * Called from reducer.handleEndTurn AFTER refreshTurnForPlayer so
 * the active player's turn is fully set up (mana refreshed, hand
 * drawn) before the scripted action runs.
 */
export function drainScriptedActions(
  draft: Draft<GameState>,
  activeSide: Side,
  ctx: ReduceCtx,
): void {
  const queue = draft.scriptedActions;
  if (!queue || queue.length === 0) return;
  for (const sa of queue) {
    if (sa.globalTurn !== draft.turnNumber) continue;
    if (sa.side !== activeSide) continue;
    if (sa.kind === "force_play_card") {
      runForcePlayCard(draft, sa, ctx);
    } else if (sa.kind === "offer_programmer_gift") {
      runOfferProgrammerGift(draft, sa, ctx);
    }
  }
}

/** Pseudo-cardDefId used on event payloads for non-card scripted
 *  actions. Keeps the existing `scripted_action_{fired,skipped}`
 *  event shape stable (both require `cardDefId: string`). */
const OFFER_PROGRAMMER_GIFT_EVENT_TAG = "offer_programmer_gift";

function runOfferProgrammerGift(
  draft: Draft<GameState>,
  sa: ScriptedOfferProgrammerGift,
  ctx: ReduceCtx,
): void {
  // Must be inside a §5.6 match. No-op otherwise.
  if (!draft.programmerGift) {
    ctx.events.push({
      type: "scripted_action_skipped",
      reason: "no_gift_state",
      cardDefId: OFFER_PROGRAMMER_GIFT_EVENT_TAG,
      side: sa.side,
      globalTurn: sa.globalTurn,
    });
    return;
  }
  const before = draft.programmerGift;
  const after = offerGift(before, draft.turnNumber);
  if (after === before) {
    // Idempotent: already offered / already resolved / earliest-turn
    // guard rejected. Not an error — just nothing to do.
    ctx.events.push({
      type: "scripted_action_skipped",
      reason: `gift_transition_rejected_${before.status}`,
      cardDefId: OFFER_PROGRAMMER_GIFT_EVENT_TAG,
      side: sa.side,
      globalTurn: sa.globalTurn,
    });
    return;
  }
  draft.programmerGift = after;
  ctx.events.push({
    type: "scripted_action_fired",
    cardDefId: OFFER_PROGRAMMER_GIFT_EVENT_TAG,
    side: sa.side,
    globalTurn: sa.globalTurn,
  });
}

function runForcePlayCard(
  draft: Draft<GameState>,
  sa: ScriptedForcePlayCard,
  ctx: ReduceCtx,
): void {
  const player = draft.players[sa.side];

  // Find in hand first; if absent, move from deck to hand. Defs are
  // a static identity, so first match is canonical.
  let handIndex = player.hand.findIndex((c) => c.defId === sa.cardDefId);
  if (handIndex === -1) {
    const deckIndex = player.deck.findIndex((c) => c.defId === sa.cardDefId);
    if (deckIndex === -1) {
      ctx.events.push({
        type: "scripted_action_skipped",
        reason: "card_not_in_hand_or_deck",
        cardDefId: sa.cardDefId,
        side: sa.side,
        globalTurn: sa.globalTurn,
      });
      return;
    }
    const card = player.deck[deckIndex];
    player.deck = [
      ...player.deck.slice(0, deckIndex),
      ...player.deck.slice(deckIndex + 1),
    ];
    player.hand = [...player.hand, card];
    handIndex = player.hand.length - 1;
  }

  // Reuse the standard play_card handler so cast intercepts (e.g.,
  // §5.5 lockout) and graveyard placement run identically to a
  // player-driven play.
  const action = {
    kind: "play_card" as const,
    actor: sa.side,
    seq: draft.actionSeq,
    handIndex,
  };
  const err = handlePlayCard(draft, action, ctx);
  if (err) {
    ctx.events.push({
      type: "scripted_action_skipped",
      reason: `play_card_error_${err.code}`,
      cardDefId: sa.cardDefId,
      side: sa.side,
      globalTurn: sa.globalTurn,
    });
  } else {
    ctx.events.push({
      type: "scripted_action_fired",
      cardDefId: sa.cardDefId,
      side: sa.side,
      globalTurn: sa.globalTurn,
    });
  }
}
