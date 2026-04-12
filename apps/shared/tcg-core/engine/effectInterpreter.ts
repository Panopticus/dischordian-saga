/**
 * Effect interpreter.
 *
 * Walks an `Effect` tree against the current ExecCtx and mutates an Immer
 * draft of GameState. This is the single chokepoint that turns authored
 * card data into real state changes.
 *
 * Design rules:
 *  - Single entry point: `interpret(effect, ctx, draft, reduceCtx)`.
 *  - Pure recursion: control-flow nodes (`sequence`, `with_target`, `if`,
 *    etc.) call `interpret` back with a derived ExecCtx. The caller is
 *    responsible for propagating `previousTarget` / `it`.
 *  - Non-fatal resolution: unsupported ops throw `UnsupportedOpError`, which
 *    the trigger-queue runner catches and converts into a logged event.
 *    In dev we re-throw so tests surface the issue loudly.
 *  - Every successful primitive emits a GameEvent via `reduceCtx.events`,
 *    so UI/replay can reconstruct what happened without diffing state.
 *
 * Scope today (driven by the 3 reference cards — Antiquarian, Agent Zero,
 * Enigma's Lament):
 *
 *  Primitives
 *    - add_counter
 *    - buff
 *    - grant_keyword
 *    - remove_keyword
 *
 *  Control flow
 *    - sequence
 *    - with_target
 *    - if (uses the condition evaluator)
 *
 * Everything else (deal_damage, heal, summon, etc.) throws
 * UnsupportedOpError until a card in the authoring queue needs it.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { Effect, Duration } from "../types/Effect";
import type { ReduceCtx } from "./reducer";
import type { ExecCtx } from "./execCtx";
import { withIt } from "./execCtx";
import { resolveTargetRef, resolveTargetSelector, findBoardEntity } from "./targeting";
import { evaluateCondition } from "./conditions";
import { evaluateAmount } from "./amounts";

// Re-export so reducer.ts + call sites get a single source of truth.
export type { Effect } from "../types/Effect";

/**
 * Interpret an effect tree. Mutates the draft via Immer; pushes events
 * into `reduceCtx.events`.
 */
export function interpret(
  effect: Effect,
  ctx: ExecCtx,
  draft: Draft<GameState>,
  reduceCtx: ReduceCtx
): void {
  switch (effect.op) {
    /* ─── Control flow ─── */

    case "sequence":
      for (const step of effect.steps) {
        interpret(step, ctx, draft, reduceCtx);
      }
      return;

    case "with_target": {
      const targets = resolveTargetSelector(effect.selector, ctx, draft);
      if (targets.length === 0) return;
      // For single-target selectors we only iterate the first result.
      // Multi-target aggregation lives on `foreach`.
      const newCtx = withIt(ctx, targets[0]);
      interpret(effect.do, newCtx, draft, reduceCtx);
      return;
    }

    case "if": {
      const branch = evaluateCondition(effect.cond, ctx, draft);
      if (branch) {
        interpret(effect.then, ctx, draft, reduceCtx);
      } else if (effect.else) {
        interpret(effect.else, ctx, draft, reduceCtx);
      }
      return;
    }

    /* ─── Primitives (scope: 3 reference cards) ─── */

    case "add_counter": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const current = entity.card.counters[effect.kind] ?? 0;
        const next = Math.max(0, current + effect.amount);
        entity.card.counters[effect.kind] = next;
        reduceCtx.events.push({
          type: "counter_added",
          targetId: id,
          counterKind: effect.kind,
          delta: effect.amount,
          newValue: next,
        });
      }
      return;
    }

    case "buff": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const power = effect.stats.power ?? 0;
        const health = effect.stats.health ?? 0;
        entity.card.currentPower += power;
        entity.card.maxHealth += health;
        entity.card.currentHealth += health;
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        entity.card.buffs = [
          ...entity.card.buffs,
          {
            source: ctx.sourceEntityId ?? "effect",
            powerDelta: power,
            healthDelta: health,
            expiresAtTurn,
          },
        ];
        reduceCtx.events.push({
          type: "buff_applied",
          sourceId: ctx.sourceEntityId ?? "effect",
          targetId: id,
          powerDelta: power,
          healthDelta: health,
          expiresAtTurn,
        });
      }
      return;
    }

    case "grant_keyword": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        if (!entity.card.activeKeywords.includes(effect.keyword)) {
          entity.card.activeKeywords = [
            ...entity.card.activeKeywords,
            effect.keyword,
          ];
        }
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        reduceCtx.events.push({
          type: "keyword_granted",
          targetId: id,
          keyword: effect.keyword,
          expiresAtTurn,
        });
      }
      return;
    }

    case "remove_keyword": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const before = entity.card.activeKeywords;
        const after = before.filter((k) => k !== effect.keyword);
        if (after.length !== before.length) {
          entity.card.activeKeywords = after;
          reduceCtx.events.push({
            type: "keyword_removed",
            targetId: id,
            keyword: effect.keyword,
          });
        }
      }
      return;
    }

    /* ─── Primitives: damage, heal, draw (new batch) ─── */

    case "deal_damage": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const charges = entity.card.counters.forcefield_charges ?? 0;
        if (charges > 0) {
          entity.card.counters.forcefield_charges = charges - 1;
          reduceCtx.events.push({
            type: "damage_dealt",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount,
            absorbed: true,
          });
        } else {
          entity.card.currentHealth -= amount;
          reduceCtx.events.push({
            type: "damage_dealt",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount,
            absorbed: false,
          });
        }
      }
      return;
    }

    case "heal": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const before = entity.card.currentHealth;
        entity.card.currentHealth = Math.min(
          entity.card.maxHealth,
          entity.card.currentHealth + amount
        );
        const healed = entity.card.currentHealth - before;
        if (healed > 0) {
          reduceCtx.events.push({
            type: "healed",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount: healed,
          });
        }
      }
      return;
    }

    case "draw": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const side = effect.who === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0);
      const player = draft.players[side];
      for (let i = 0; i < amount; i++) {
        if (player.deck.length === 0) {
          reduceCtx.events.push({
            type: "card_burned",
            player: side,
            reason: "deck_empty",
          });
          break;
        }
        const top = player.deck[0];
        player.deck = player.deck.slice(1);
        if (player.hand.length >= 6) {
          player.graveyard = [...player.graveyard, top];
          reduceCtx.events.push({
            type: "card_burned",
            player: side,
            reason: "hand_full",
          });
        } else {
          player.hand = [...player.hand, top];
          reduceCtx.events.push({
            type: "card_drawn",
            player: side,
            cardDefId: top.defId,
            entityId: top.entityId,
          });
        }
      }
      return;
    }

    case "destroy": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity || entity.isGeneral) continue;
        entity.card.currentHealth = 0;
        // SBA will clean up the 0-HP entity on the next fixed-point pass.
      }
      return;
    }

    case "dispel": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        // Strip all buffs and revert stats to base.
        for (const b of entity.card.buffs) {
          entity.card.currentPower -= b.powerDelta;
          entity.card.maxHealth -= b.healthDelta;
          if (entity.card.currentHealth > entity.card.maxHealth) {
            entity.card.currentHealth = entity.card.maxHealth;
          }
        }
        // Emit keyword_removed for each stripped keyword.
        for (const kw of entity.card.activeKeywords) {
          reduceCtx.events.push({
            type: "keyword_removed",
            targetId: id,
            keyword: kw,
          });
        }
        entity.card.buffs = [];
        entity.card.activeKeywords = [];
        entity.card.counters = {};
        entity.isStunned = false;
      }
      return;
    }

    case "stun": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        entity.isStunned = true;
      }
      return;
    }

    case "debuff": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const power = -(effect.stats.power ?? 0);
        const health = -(effect.stats.health ?? 0);
        entity.card.currentPower += power;
        entity.card.maxHealth += health;
        if (entity.card.currentHealth > entity.card.maxHealth) {
          entity.card.currentHealth = entity.card.maxHealth;
        }
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        entity.card.buffs = [
          ...entity.card.buffs,
          {
            source: ctx.sourceEntityId ?? "effect",
            powerDelta: power,
            healthDelta: health,
            expiresAtTurn,
          },
        ];
        reduceCtx.events.push({
          type: "buff_applied",
          sourceId: ctx.sourceEntityId ?? "effect",
          targetId: id,
          powerDelta: power,
          healthDelta: health,
          expiresAtTurn,
        });
      }
      return;
    }

    case "summon": {
      // Find an empty tile near the summoner (or at the specified position).
      const posSelector = effect.at;
      let row = 0;
      let col = 0;
      if (posSelector.kind === "specific") {
        row = posSelector.row;
        col = posSelector.col;
      } else if (posSelector.kind === "random_empty") {
        // Find all empty tiles and pick one via RNG.
        const empty: Array<{ row: number; col: number }> = [];
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 9; c++) {
            const k = `${r},${c}`;
            if (!draft.board[k]) empty.push({ row: r, col: c });
          }
        }
        if (empty.length === 0) return;
        const pick = empty[Math.floor(reduceCtx.rng.next() * empty.length)];
        row = pick.row;
        col = pick.col;
      } else {
        // origin_offset: offset from the source entity's position.
        const sourceIds = resolveTargetRef({ kind: "self" }, ctx, draft);
        const sourceEntity = sourceIds.length > 0 ? findBoardEntity(draft, sourceIds[0]) : null;
        if (!sourceEntity) return;
        row = sourceEntity.row + (posSelector.dRow ?? 0);
        col = sourceEntity.col + (posSelector.dCol ?? 0);
      }
      const k = `${row},${col}`;
      if (draft.board[k]) return; // occupied
      if (row < 0 || row >= 5 || col < 0 || col >= 9) return; // OOB
      const side = effect.controller === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0);
      // Mint a new entity for the token.
      const counter = draft.nextEntityCounter;
      draft.nextEntityCounter += 1;
      const entityId = `e_${draft.matchId}_${counter}`;
      const tokenDef = reduceCtx.registry.get(effect.tokenId);
      const tokenCard = {
        entityId: entityId as any,
        defId: effect.tokenId as any,
        owner: side,
        currentPower: tokenDef?.baseStats?.power ?? 1,
        currentHealth: tokenDef?.baseStats?.health ?? 1,
        maxHealth: tokenDef?.baseStats?.health ?? 1,
        counters: {} as Record<string, number>,
        activeKeywords: tokenDef?.keywords ? [...tokenDef.keywords] : [] as any[],
        buffs: [] as any[],
        flags: {} as Record<string, boolean>,
      };
      draft.board[k] = {
        entityId: entityId as any,
        card: tokenCard,
        row,
        col,
        actionsRemaining: 0,
        hasMoved: true,
        hasAttacked: true,
        isGeneral: false,
        isStunned: false,
      };
      reduceCtx.events.push({
        type: "token_summoned",
        tokenId: effect.tokenId,
        owner: side,
        row,
        col,
        entityId,
      });
      return;
    }

    /* ─── Unsupported (thrown by design) ─── */

    case "silence":
    case "teleport":
    case "push":
    case "gain_mana":
    case "discard":
    case "mill":
    case "return_to_hand":
    case "transform":
    case "foreach":
    case "choose_one":
    case "repeat":
    case "sacrifice_then":
      throw new UnsupportedOpError(
        `effect op '${(effect as { op: string }).op}' not yet implemented`
      );

    default: {
      // Exhaustiveness: the compiler should reject any missed case above.
      const _exhaust: never = effect as never;
      void _exhaust;
      throw new UnsupportedOpError(
        `unknown effect op: ${JSON.stringify(effect)}`
      );
    }
  }
}

/**
 * Compute the concrete turn number a buff/keyword grant expires at,
 * given its Duration. -1 for permanent, a future turn number otherwise.
 */
function expiresAtTurnFor(duration: Duration, currentTurn: number): number {
  switch (duration.kind) {
    case "permanent":
      return -1;
    case "this_turn":
      return currentTurn;
    case "until_end_of_opponent_turn":
      // Opponent turn ends on the cycle after ours; approximated as
      // currentTurn. Real semantics need more tracking and land with the
      // full turn system port.
      return currentTurn;
    case "n_turns":
      return currentTurn + duration.n;
    default: {
      const _exhaust: never = duration;
      void _exhaust;
      return -1;
    }
  }
}

export class UnsupportedOpError extends Error {
  constructor(message: string) {
    super(`UnsupportedOpError: ${message}`);
    this.name = "UnsupportedOpError";
  }
}

