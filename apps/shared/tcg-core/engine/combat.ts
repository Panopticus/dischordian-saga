/**
 * Combat.
 *
 * handleAttack resolves a single attacker vs defender combat through the
 * reducer. Rules (pared down from duelyst/engine.ts — more keyword
 * interactions will land as cards require them):
 *
 *  - Attacker must belong to the active player, be on the board, not
 *    exhausted, not stunned, and not a structure.
 *  - Target must exist on the board and be owned by the opponent.
 *  - Melee: attacker must be king-adjacent to target. Ranged and flying
 *    skip the adjacency check.
 *  - Damage pipeline (applied to defender first, then — for melee only —
 *    retaliation damage back to attacker):
 *      1. If defender has forcefield_charges counter > 0, absorb one
 *         damage unit (the whole swing), decrement the counter, and
 *         skip direct HP loss.
 *      2. Otherwise subtract attacker.currentPower from
 *         defender.currentHealth.
 *    SBA picks up <=0 HP casualties and handles death + win condition.
 *  - Ranged attackers take no retaliation.
 *  - Attacker's action counters bump: hasAttacked = true and
 *    actionsRemaining decrements; if it reaches 0, the unit is done for
 *    the turn.
 *
 * Things explicitly deferred until a card needs them:
 *  - Pierce / ignore_armor_N math (we emit the keyword on Agent Zero
 *    but the combat model below doesn't use `armor` yet)
 *  - Backstab positional bonus
 *  - Frenzy / blast / cleave multi-target
 *  - Counterattack-suppression keywords
 *
 * All of these will be additive — commit here is about the pipeline.
 */
import type { Draft } from "immer";
import type { GameState, BoardEntity } from "../types/GameState";
import { posKey } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { ReduceCtx } from "./reducer";

export function handleAttack(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "attack" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "attack only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "attack from non-active player" };
  }

  // Locate attacker and target on the draft.
  let attacker: Draft<BoardEntity> | null = null;
  let target: Draft<BoardEntity> | null = null;
  for (const entity of Object.values(draft.board)) {
    if (entity.entityId === action.attackerId) attacker = entity;
    if (entity.entityId === action.targetId) target = entity;
  }
  if (!attacker) {
    return {
      code: "illegal_attack",
      message: `attacker entity not found: ${action.attackerId}`,
    };
  }
  if (!target) {
    return {
      code: "illegal_attack",
      message: `target entity not found: ${action.targetId}`,
    };
  }
  if (attacker.card.owner !== action.actor) {
    return {
      code: "illegal_attack",
      message: "can only attack with your own units",
    };
  }
  if (target.card.owner === action.actor) {
    return {
      code: "illegal_attack",
      message: "cannot attack your own unit",
    };
  }
  if (attacker.hasAttacked) {
    return {
      code: "action_already_used",
      message: "this unit has already attacked this turn",
    };
  }
  if (attacker.isStunned) {
    return { code: "illegal_attack", message: "attacker is stunned" };
  }
  if (attacker.card.activeKeywords.includes("structure")) {
    return { code: "illegal_attack", message: "structures cannot attack" };
  }

  // Provoke: if there's an adjacent enemy with provoke, attacker must
  // target it first. Ranged/flying bypass this.
  const isRangedLike =
    attacker.card.activeKeywords.includes("ranged") ||
    attacker.card.activeKeywords.includes("flying");
  if (!isRangedLike) {
    const provoker = findAdjacentEnemyWithKeyword(draft, attacker, "provoke");
    if (provoker && provoker.entityId !== target.entityId) {
      return {
        code: "illegal_attack",
        message: `must attack the adjacent provoking unit (${provoker.entityId})`,
      };
    }
    // Melee range check.
    if (!isKingAdjacent(attacker.row, attacker.col, target.row, target.col)) {
      return {
        code: "illegal_attack",
        message: "melee attacker is not adjacent to target",
      };
    }
  }

  // Duelyst combat is simultaneous: both sides deal damage based on
  // their currentPower at the moment of impact, and SBA cleans up any
  // casualties afterwards. Capture both power values before applying
  // either damage so a lethal blow doesn't cancel the defender's
  // retaliation.
  const attackDamage = Math.max(0, attacker.card.currentPower);
  const retaliationDamage = isRangedLike ? 0 : Math.max(0, target.card.currentPower);

  applyCombatDamage(attacker, target, attackDamage, ctx);
  if (retaliationDamage > 0) {
    applyCombatDamage(target, attacker, retaliationDamage, ctx);
  }

  attacker.hasAttacked = true;
  attacker.actionsRemaining = Math.max(0, attacker.actionsRemaining - 1);
  if (attacker.actionsRemaining <= 0) {
    attacker.hasMoved = true;
  }

  return undefined;
}

/**
 * Apply `damage` from `source` to `dest` through the standard damage
 * pipeline: forcefield charges absorb first, then raw HP loss. Emits
 * the damage_dealt event with `absorbed` set appropriately.
 */
function applyCombatDamage(
  source: Draft<BoardEntity>,
  dest: Draft<BoardEntity>,
  damage: number,
  ctx: ReduceCtx
): void {
  if (damage <= 0) return;
  const charges = dest.card.counters.forcefield_charges ?? 0;
  if (charges > 0) {
    // Forcefield absorbs the whole swing, decrementing by one charge.
    // Damage is not reduced per-point — one hit = one charge consumed.
    dest.card.counters.forcefield_charges = charges - 1;
    ctx.events.push({
      type: "damage_dealt",
      sourceId: source.entityId,
      targetId: dest.entityId,
      amount: damage,
      absorbed: true,
    });
    return;
  }
  dest.card.currentHealth = dest.card.currentHealth - damage;
  ctx.events.push({
    type: "damage_dealt",
    sourceId: source.entityId,
    targetId: dest.entityId,
    amount: damage,
    absorbed: false,
  });
}

function isKingAdjacent(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

function findAdjacentEnemyWithKeyword(
  draft: Draft<GameState>,
  unit: Draft<BoardEntity>,
  keyword: string
): Draft<BoardEntity> | null {
  const enemySide = unit.card.owner === 0 ? 1 : 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = unit.row + dr;
      const nc = unit.col + dc;
      const neighbor = draft.board[posKey(nr, nc)];
      if (!neighbor) continue;
      if (neighbor.card.owner !== enemySide) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((neighbor.card.activeKeywords as any[]).includes(keyword)) {
        return neighbor;
      }
    }
  }
  return null;
}
