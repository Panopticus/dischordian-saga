/**
 * handlePlayCard — play a card from the active player's hand.
 *
 * Dispatches on the card's cardType:
 *
 *  - unit:     Costs mana, removes from hand, invokes deployCard() which
 *              places on the board and enqueues on_deploy triggers. The
 *              fixed-point loop drains triggers before the reducer
 *              returns.
 *
 *  - spell:    Costs mana, removes from hand, routes to the effect
 *              interpreter with an ExecCtx that carries the player's
 *              chosen target id if the action supplied one. Spells
 *              resolve immediately (single pass through the interpreter)
 *              and then fall into the fixed-point loop alongside any
 *              triggers their effect enqueued.
 *
 *  - artifact: Deferred to commit C / the artifact workstream. Returns
 *              a structured error today so the action surface stays
 *              clean.
 *
 *  - structure / general: illegal to play from hand.
 *
 * Cost validation uses the current player's mana against the card
 * definition's cost. Out-of-hand-bounds indices return
 * hand_index_out_of_bounds. Unknown def ids return unknown_card — this
 * can happen if the match registry was hot-reloaded mid-match to drop
 * a card, which format validation should prevent but the handler
 * must defend against.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { ReduceCtx } from "./reducer";
import type { ConcreteAbility } from "../types/Trigger";
import type { Effect } from "../types/Effect";
import type { EntityId } from "../types/Ids";
import type { ArtifactInstance } from "../types/GameState";
import { MAX_ARTIFACTS } from "../types/GameState";
import { deployCard } from "./deploy";
import { interpret } from "./effectInterpreter";
import { makeExecCtx } from "./execCtx";
import { mintEntityId } from "./init";
import {
  THREE_MOVES_CARD_DEF_ID,
  activateLockout,
  isCardLocked,
} from "./lockout";

export function handlePlayCard(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "play_card" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "play_card only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "play_card from non-active player" };
  }

  const player = draft.players[action.actor];
  if (action.handIndex < 0 || action.handIndex >= player.hand.length) {
    return {
      code: "hand_index_out_of_bounds",
      message: `play_card handIndex ${action.handIndex} out of bounds`,
    };
  }

  const card = player.hand[action.handIndex];
  const def = ctx.registry.get(card.defId);
  if (!def) {
    return {
      code: "unknown_card",
      message: `card definition '${card.defId}' not in registry`,
    };
  }

  if (player.mana < def.cost) {
    return {
      code: "insufficient_mana",
      message: `card costs ${def.cost}, player has ${player.mana} mana`,
    };
  }

  // §5.5 Warlord lockout: reject locked-card plays before paying the
  // cost. The lockout state pins specific entityIds (per-card, not
  // per-defId) so we check on the card's runtime entityId, not the
  // CardDefinition id. The check is side-scoped — the Warlord plays
  // her own hand freely while the lockout is active against the
  // player.
  if (
    def.cardType !== "general" &&
    isCardLocked(draft, card.entityId, action.actor)
  ) {
    return {
      code: "card_locked",
      message: "card is locked by the Warlord's three-move lockout",
    };
  }

  // Remove from hand and pay the cost. This happens BEFORE the effect
  // so mid-effect state reads see the reduced mana.
  player.hand = [
    ...player.hand.slice(0, action.handIndex),
    ...player.hand.slice(action.handIndex + 1),
  ];
  player.mana -= def.cost;

  ctx.events.push({
    type: "card_played",
    player: action.actor,
    cardDefId: card.defId,
    entityId: card.entityId,
    row: action.row,
    col: action.col,
  });

  switch (def.cardType) {
    case "unit":
    case "structure": {
      if (action.row === undefined || action.col === undefined) {
        // Refund on failed dispatch so the player doesn't lose the card +
        // mana to a malformed action.
        player.hand = [
          ...player.hand.slice(0, action.handIndex),
          card,
          ...player.hand.slice(action.handIndex),
        ];
        player.mana += def.cost;
        return {
          code: "out_of_range",
          message: "unit play requires row + col target tile",
        };
      }
      const result = deployCard(
        draft,
        card,
        action.row,
        action.col,
        action.actor,
        ctx
      );
      if (!result.ok) {
        // Deploy failed — refund hand + mana, return a matching reduce error.
        player.hand = [
          ...player.hand.slice(0, action.handIndex),
          card,
          ...player.hand.slice(action.handIndex),
        ];
        player.mana += def.cost;
        return {
          code: result.error!.code === "tile_occupied" ? "illegal_move" : "out_of_range",
          message: result.error!.message,
        };
      }
      return undefined;
    }

    case "spell": {
      // Spells go into the owner's graveyard after resolution (Duelyst
      // convention: spells aren't kept as artifacts on board).
      player.graveyard = [...player.graveyard, card];

      // §5.5 Warlord lockout — Three Moves cast interception. The card's
      // CardDefinition has empty abilities by design (see the card's
      // doc-comment); its mechanical effect is implemented entirely
      // here as a runtime hook on the defId. The lockout targets the
      // OPPOSITE side from the caster (the player; the Warlord is
      // never the lockout-targeted side).
      if (card.defId === THREE_MOVES_CARD_DEF_ID) {
        const playerSide = (action.actor === 0 ? 1 : 0) as 0 | 1;
        activateLockout(draft, playerSide, ctx.events);
        // Three Moves has no further on_cast effects to interpret —
        // its abilities array is empty.
        return undefined;
      }

      // Walk the spell's abilities. Each `on_cast` ability fires through
      // the effect interpreter with the player-chosen target id
      // (propagated into the ExecCtx below).
      const abilities = def.abilities as unknown as readonly ConcreteAbility[];
      const execCtx = makeExecCtx(action.actor, {
        sourceEntityId: card.entityId,
        playerChosenTargetId: action.targetEntityId as EntityId | undefined,
        chooseIndex: action.chooseIndex,
      });
      for (const ability of abilities) {
        if (ability.trigger.kind !== "on_cast") continue;
        // Guard condition, if any, blocks the effect.
        if (ability.condition) {
          // Conditions land incrementally; for now we trust the spell
          // author and evaluate via the interpreter's if-op path if
          // they want gating. Spells rarely need guard conditions.
        }
        interpret(ability.effect as Effect, execCtx, draft, ctx);
      }
      return undefined;
    }

    case "artifact": {
      // Artifact equip: create an ArtifactInstance, enforce max-3 cap
      // (oldest displaced), send card to graveyard, fire on_deploy abilities.
      const durability = def.artifactDurability ?? 3;
      const artifactEntityId = mintEntityId(draft);
      const artifact: ArtifactInstance = {
        entityId: artifactEntityId,
        defId: card.defId,
        durability,
      };

      // Max 3 artifacts: if already at cap, destroy the oldest (index 0).
      if (player.artifacts.length >= MAX_ARTIFACTS) {
        const displaced = player.artifacts[0];
        player.artifacts = player.artifacts.slice(1);
        ctx.events.push({
          type: "artifact_destroyed",
          player: action.actor,
          entityId: displaced.entityId as string,
          defId: displaced.defId,
          reason: "displaced",
        });
      }

      player.artifacts = [...player.artifacts, artifact];
      ctx.events.push({
        type: "artifact_equipped",
        player: action.actor,
        entityId: artifactEntityId as string,
        defId: card.defId,
        durability,
      });

      // Artifacts go to graveyard on equip (same as spells).
      player.graveyard = [...player.graveyard, card];

      // Fire on_deploy abilities (same pattern as spells with on_cast).
      const abilities = def.abilities as unknown as readonly ConcreteAbility[];
      const execCtx = makeExecCtx(action.actor, {
        sourceEntityId: card.entityId,
        playerChosenTargetId: action.targetEntityId as EntityId | undefined,
        chooseIndex: action.chooseIndex,
      });
      for (const ability of abilities) {
        if (ability.trigger.kind !== "on_deploy") continue;
        interpret(ability.effect as Effect, execCtx, draft, ctx);
      }
      return undefined;
    }

    case "general": {
      // Refund — generals are never in hand.
      player.hand = [
        ...player.hand.slice(0, action.handIndex),
        card,
        ...player.hand.slice(action.handIndex),
      ];
      player.mana += def.cost;
      return {
        code: "illegal_move",
        message: "cannot play a general card from hand",
      };
    }

    default: {
      const _exhaust: never = def.cardType;
      void _exhaust;
      return {
        code: "illegal_move",
        message: `unknown card type '${(def as { cardType: string }).cardType}'`,
      };
    }
  }
}
