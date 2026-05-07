/**
 * Turn refresh.
 *
 * Called whenever control passes to a player — either at match start (P0's
 * first turn after mulligan) or between player turns. Handles:
 *
 *  1. Max mana ramp by +1 (capped at MAX_MANA = 9).
 *  2. Reset current mana to the new max.
 *  3. Draw one card into the active player's hand, with proper hand-full
 *     burn + deck-empty chip.
 *  4. Refresh bloodbornUsed / replaceUsed flags for the new turn.
 *  5. Refresh each of the active player's on-board entities:
 *     - hasMoved = false / hasAttacked = false
 *     - actionsRemaining = 2 if celerity, else 1
 *     - isStunned cleared
 *     - ephemeral units enqueued for SBA-driven destruction
 *     - grow units bumped by their growAmount (if we later encode grow
 *       semantics — deferred)
 *  6. Emits `turn_started`, `mana_gained`, and `card_drawn` / `card_burned`
 *     events so the UI animates correctly.
 *
 * This function does NOT advance `currentPlayer` or `turnNumber` — the
 * reducer's end_turn handler does that before calling refreshTurn for the
 * new active player.
 *
 * Pure in contract; mutates the supplied Immer draft.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import { MAX_MANA } from "../types/GameState";
import type { Side } from "../types/Ids";
import type { ReduceCtx } from "./reducer";
import type { ConcreteAbility } from "../types/Trigger";
import { enqueueTrigger } from "./triggerQueue";
import { reevaluateLockout } from "./lockout";

export function refreshTurnForPlayer(
  draft: Draft<GameState>,
  side: Side,
  ctx: ReduceCtx
): void {
  const player = draft.players[side];

  // Mana ramp — cap at MAX_MANA.
  const newMax = Math.min(MAX_MANA, player.maxMana + 1);
  const gained = newMax - player.maxMana;
  player.maxMana = newMax;
  player.mana = newMax;
  if (gained > 0) {
    ctx.events.push({
      type: "mana_gained",
      player: side,
      amount: gained,
      max: newMax,
    });
  }

  // Draw a card into the active player's hand.
  if (player.deck.length > 0) {
    const top = player.deck[0];
    player.deck = player.deck.slice(1);
    const handIsFull = player.hand.length >= 6; // MAX_HAND, inlined for draft clarity
    if (handIsFull) {
      player.graveyard = [...player.graveyard, top];
      ctx.events.push({
        type: "card_burned",
        player: side,
        reason: "hand_full",
      });
    } else {
      player.hand = [...player.hand, top];
      ctx.events.push({
        type: "card_drawn",
        player: side,
        cardDefId: top.defId,
        entityId: top.entityId,
      });
      enqueueCardDrawnTriggers(draft, side, top.defId, ctx);
    }
  } else {
    ctx.events.push({
      type: "card_burned",
      player: side,
      reason: "deck_empty",
    });
  }

  // Per-turn flags.
  player.bloodbornUsed = false;
  player.replaceUsed = false;

  // Refresh the active player's on-board entities.
  for (const entity of Object.values(draft.board)) {
    if (entity.card.owner !== side) continue;
    entity.hasMoved = false;
    entity.hasAttacked = false;
    entity.isStunned = false;
    // celerity → 2 actions per turn; default → 1
    entity.actionsRemaining = entity.card.activeKeywords.includes("celerity")
      ? 2
      : 1;

    // H2 — grow: at the start of the owner's turn, gain `growAmount`
    // permanent stats. The buff is sourced as `grow:<entityId>:t<turn>`
    // so each turn's bump is its own buff record (replay-stable +
    // dispel-stable). Default amount is +1/+1 unless the
    // CardDefinition specifies otherwise.
    if (entity.card.activeKeywords.includes("grow")) {
      const def = ctx.registry.get(entity.card.defId);
      const growAmount =
        (def as { growAmount?: { power: number; health: number } } | undefined)
          ?.growAmount ?? { power: 1, health: 1 };
      entity.card.currentPower += growAmount.power;
      entity.card.maxHealth += growAmount.health;
      entity.card.currentHealth += growAmount.health;
      entity.card.buffs = [
        ...entity.card.buffs,
        {
          source: `grow:${entity.entityId}:t${draft.turnNumber}`,
          powerDelta: growAmount.power,
          healthDelta: growAmount.health,
          expiresAtTurn: -1, // permanent
        },
      ];
      ctx.events.push({
        type: "buff_applied",
        sourceId: entity.entityId,
        targetId: entity.entityId,
        powerDelta: growAmount.power,
        healthDelta: growAmount.health,
        expiresAtTurn: -1,
      });
    }
  }

  // Enqueue on_turn_start triggers for the active player's entities.
  for (const entity of Object.values(draft.board)) {
    if (entity.card.owner !== side) continue;
    const def = ctx.registry.get(entity.card.defId);
    if (!def) continue;
    const abilities = def.abilities as unknown as ConcreteAbility[];
    for (let i = 0; i < abilities.length; i++) {
      const trigger = abilities[i].trigger;
      if (
        trigger.kind === "on_turn_start" &&
        (trigger.owner === "self" || trigger.owner === "either")
      ) {
        enqueueTrigger(draft, {
          sourceEntityId: entity.entityId,
          sourceOwner: entity.card.owner,
          sourceRow: entity.row,
          sourceCol: entity.col,
          abilityIdx: i,
          context: { triggerSourceId: entity.entityId },
        });
      }
    }
  }

  // §5.5 Warlord lockout: at the start of the lockout's target side's
  // turn, recompute which hand cards are playable. The Warlord
  // re-evaluates the narrowing per-turn (spec §2.4.3) — cards drawn
  // or added during the lockout become eligible for selection. No-op
  // when no lockout is active or when the side starting their turn
  // is not the lockout's target.
  if (draft.lockout && draft.lockout.targetSide === side) {
    reevaluateLockout(draft, side, ctx.registry, ctx.events);
  }
}

/**
 * Enqueue `on_card_drawn` triggers across the board when `drawingSide`
 * draws `drawnDefId` into hand. Fires for every on-board entity (any
 * side) whose ability has an `on_card_drawn` trigger — the trigger's
 * optional `filter` is matched at dispatch time by the trigger
 * runner's matchesCardFilter check, so observers on either side may
 * react.
 *
 * Caveat: pre-game draws (mulligan, init.ts opening hand) do NOT call
 * this — those phases run before the board exists. Mid-game draws
 * via the turn-refresh path and the `draw` effect op do call it.
 *
 * Closes the `tcg.trigger_kind_coverage` gap for `on_card_drawn`.
 */
export function enqueueCardDrawnTriggers(
  draft: Draft<GameState>,
  drawingSide: Side,
  _drawnDefId: string,
  ctx: ReduceCtx,
): void {
  // The trigger's filter (if any) is applied by the runner against
  // the drawn card definition at resolution time. At enqueue we only
  // need to match the kind. Walk every entity on the board so
  // friendly + opposing observers both get a chance to react.
  void drawingSide;
  for (const entity of Object.values(draft.board)) {
    const def = ctx.registry.get(entity.card.defId);
    if (!def) continue;
    const abilities = def.abilities as unknown as ConcreteAbility[];
    for (let i = 0; i < abilities.length; i++) {
      if (abilities[i].trigger.kind !== "on_card_drawn") continue;
      enqueueTrigger(draft, {
        sourceEntityId: entity.entityId,
        sourceOwner: entity.card.owner,
        sourceRow: entity.row,
        sourceCol: entity.col,
        abilityIdx: i,
        context: { triggerSourceId: entity.entityId },
      });
    }
  }
}

/**
 * Enqueue `on_turn_end` triggers for entities controlled by the side
 * whose turn is ending. Called from the reducer's `end_turn` handler
 * before the turn switch and before {@link refreshTurnForPlayer} runs
 * for the incoming player.
 *
 * Mirror of the on_turn_start enqueue loop in {@link refreshTurnForPlayer},
 * applied to the OUTGOING side. `owner: "either"` triggers fire for
 * any side's turn end; `owner: "self"` only when their own turn ends;
 * `owner: "opponent"` only when the opposing side's turn ends.
 *
 * Lands B6 part of the ship:check completeness gate — closes the
 * `tcg.trigger_kind_coverage` gap for `on_turn_end`.
 */
export function enqueueTurnEndTriggers(
  draft: Draft<GameState>,
  endingSide: Side,
  ctx: ReduceCtx,
): void {
  for (const entity of Object.values(draft.board)) {
    const def = ctx.registry.get(entity.card.defId);
    if (!def) continue;
    const abilities = def.abilities as unknown as ConcreteAbility[];
    for (let i = 0; i < abilities.length; i++) {
      const trigger = abilities[i].trigger;
      if (trigger.kind !== "on_turn_end") continue;
      const ownsThisSide = entity.card.owner === endingSide;
      const matchesOwner =
        trigger.owner === "either" ||
        (trigger.owner === "self" && ownsThisSide) ||
        (trigger.owner === "opponent" && !ownsThisSide);
      if (!matchesOwner) continue;
      enqueueTrigger(draft, {
        sourceEntityId: entity.entityId,
        sourceOwner: entity.card.owner,
        sourceRow: entity.row,
        sourceCol: entity.col,
        abilityIdx: i,
        context: { triggerSourceId: entity.entityId },
      });
    }
  }

  // H2 — ephemeral: units owned by the ending side and tagged
  // `ephemeral` die at end of their owner's turn. Setting
  // currentHealth to 0 lets SBA Pass 1 collect them through the
  // canonical death path (on_death triggers, deathwatch, etc. all
  // fire correctly). The pass runs AFTER the on_turn_end trigger
  // enqueue so those triggers see the unit alive when they fire —
  // matches Hearthstone's "die at end of turn" timing.
  for (const entity of Object.values(draft.board)) {
    if (entity.card.owner !== endingSide) continue;
    if (entity.isGeneral) continue;
    if (!entity.card.activeKeywords.includes("ephemeral")) continue;
    entity.card.currentHealth = 0;
  }
}
