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
import type { GameState, BoardEntity, PlayerState } from "../types/GameState";
import { posKey } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { ReduceCtx } from "./reducer";
import type { Side } from "../types/Ids";
import type { ConcreteAbility } from "../types/Trigger";
import { enqueueTrigger } from "./triggerQueue";
import { enqueueKillTriggers } from "./stateBasedActions";

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
  // Flanking (plan §C1) only applies to the *attacker* side — pass
  // the target so effectiveAttackPower can pick up the bonus when
  // an ally is also adjacent to the target.
  const attackDamage = Math.max(0, effectiveAttackPower(draft, attacker, target));
  const retaliationDamage = isRangedLike ? 0 : Math.max(0, effectivePower(draft, target));

  applyCombatDamage(draft, attacker, target, attackDamage, ctx);
  if (retaliationDamage > 0) {
    applyCombatDamage(draft, target, attacker, retaliationDamage, ctx);
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
 *
 * When the dest is a general and damage is not absorbed, all equipped
 * artifacts on that general lose 1 durability (Duelyst convention).
 * Artifacts that reach 0 durability are cleaned up by SBA.
 */
function applyCombatDamage(
  draft: Draft<GameState>,
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

  // Enqueue on_damage_dealt triggers for the source entity, then
  // on_damage_taken for the victim. Order matters: source-side
  // triggers (drain heals, payback, etc.) must enqueue before the
  // victim's reactive triggers so APNAP ordering reflects the
  // actor-then-target convention.
  enqueueDamageDealtTriggers(draft, source, dest, ctx);
  enqueueDamageTakenTriggers(draft, dest, ctx);

  // Wire on_kill triggers when this damage instance lethaled the
  // dest. enqueueKillTriggers is defined in stateBasedActions.ts but
  // had no production caller before this commit — combat is the
  // canonical site that knows both the killer and that the victim
  // is dropping to ≤ 0 HP.
  if (dest.card.currentHealth <= 0) {
    enqueueKillTriggers(draft, source, ctx);
  }

  // Artifact durability loss: when a general takes real damage, each
  // equipped artifact loses 1 durability.
  if (dest.isGeneral) {
    const owner: Draft<PlayerState> = draft.players[dest.card.owner as Side];
    for (const artifact of owner.artifacts) {
      artifact.durability = artifact.durability - 1;
    }
  }
}

/**
 * Enqueue on_damage_taken triggers for the victim entity after taking
 * un-absorbed damage. Forcefield-absorbed damage does NOT fire
 * on_damage_taken — matches the canonical TCG semantics where a
 * blocker / shield prevents the "took damage" event entirely.
 *
 * Closes the `tcg.trigger_kind_coverage` gap for `on_damage_taken`.
 */
function enqueueDamageTakenTriggers(
  draft: Draft<GameState>,
  victim: Draft<BoardEntity>,
  ctx: ReduceCtx,
): void {
  const def = ctx.registry.get(victim.card.defId);
  if (!def) return;
  const abilities = def.abilities as unknown as ConcreteAbility[];
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].trigger.kind !== "on_damage_taken") continue;
    enqueueTrigger(draft, {
      sourceEntityId: victim.entityId,
      sourceOwner: victim.card.owner,
      sourceRow: victim.row,
      sourceCol: victim.col,
      abilityIdx: i,
      context: { triggerSourceId: victim.entityId },
    });
  }
}

/**
 * Enqueue on_damage_dealt triggers for the source entity after dealing damage.
 */
function enqueueDamageDealtTriggers(
  draft: Draft<GameState>,
  source: Draft<BoardEntity>,
  victim: Draft<BoardEntity>,
  ctx: ReduceCtx
): void {
  const def = ctx.registry.get(source.card.defId);
  if (!def) return;
  const abilities = def.abilities as unknown as ConcreteAbility[];
  for (let i = 0; i < abilities.length; i++) {
    const trigger = abilities[i].trigger;
    if (trigger.kind === "on_damage_dealt" && trigger.by === "self") {
      enqueueTrigger(draft, {
        sourceEntityId: source.entityId,
        sourceOwner: source.card.owner,
        sourceRow: source.row,
        sourceCol: source.col,
        abilityIdx: i,
        context: {
          triggerSourceId: source.entityId,
          triggerVictimId: victim.entityId,
        },
      });
    }
  }
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

/**
 * Effective combat power including positional + keyword bonuses.
 *
 * Zeal: while the unit is king-adjacent to its owner's general, add
 * +1 to its combat power. Wired here (and at retaliation in attack)
 * so the bonus follows the unit on both sides of a swing without
 * mutating currentPower itself — the bonus is read fresh each combat
 * resolution against current board geometry.
 *
 * Pack: +1 per OTHER allied unit on the board with the same faction
 * tag (excluding the pack unit itself + the general). Read fresh each
 * combat so deploys/deaths flip the bonus immediately.
 *
 * Audit 2026-05 §3.3 lifted the "// reserved" annotations on `zeal`
 * and `pack` once these hooks landed. (Backwards-compatible alias
 * `effectivePowerWithZeal` is preserved for the existing zeal test.)
 */
const ZEAL_BONUS = 1;
const PACK_BONUS_PER_ALLY = 1;
/** Flanking damage bonus when the attacker has the keyword AND an
 *  allied unit (other than the attacker) is also king-adjacent to
 *  the target at the moment of impact. XCOM-style positional pressure;
 *  the new strategic axis introduced by plan §C1. */
const FLANKING_BONUS = 2;

export function effectivePower(
  draft: Draft<GameState> | GameState,
  unit: Draft<BoardEntity> | BoardEntity,
): number {
  let p = unit.card.currentPower;
  if (
    unit.card.activeKeywords.includes("zeal") &&
    isAdjacentToOwnGeneral(draft, unit)
  ) {
    p += ZEAL_BONUS;
  }
  if (unit.card.activeKeywords.includes("pack")) {
    p += packBonus(draft, unit);
  }
  return p;
}

/** @deprecated Use effectivePower; kept so existing tests keep linking. */
export function effectivePowerWithZeal(
  draft: Draft<GameState> | GameState,
  unit: Draft<BoardEntity> | BoardEntity,
): number {
  return effectivePower(draft, unit);
}

/**
 * Attacker-side power including the flanking bonus when applicable.
 * Wraps effectivePower so retaliation (which calls effectivePower
 * directly) never picks up the attacker-only bonus.
 *
 * Flanking semantics (plan §C1): the attacker has the `flanking`
 * keyword AND there is at least one allied unit, other than the
 * attacker itself, king-adjacent to the target at the moment of
 * impact. The bonus is fixed at FLANKING_BONUS regardless of how
 * many allies are flanking — it's a positional unlock, not a stack.
 */
export function effectiveAttackPower(
  draft: Draft<GameState> | GameState,
  attacker: Draft<BoardEntity> | BoardEntity,
  target: Draft<BoardEntity> | BoardEntity,
): number {
  let p = effectivePower(draft, attacker);
  if (
    attacker.card.activeKeywords.includes("flanking") &&
    isFlanking(draft, attacker, target)
  ) {
    p += FLANKING_BONUS;
  }
  return p;
}

/** True iff the attacker is flanking the target — i.e. some other
 *  allied unit is also king-adjacent to the target. The attacker
 *  itself doesn't count (otherwise every adjacent attack would
 *  trivially flank). Pure helper, exported for tests. */
export function isFlanking(
  draft: Draft<GameState> | GameState,
  attacker: Draft<BoardEntity> | BoardEntity,
  target: Draft<BoardEntity> | BoardEntity,
): boolean {
  const allySide = attacker.card.owner;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = target.row + dr;
      const nc = target.col + dc;
      const neighbor = draft.board[posKey(nr, nc)];
      if (!neighbor) continue;
      if (neighbor.entityId === attacker.entityId) continue;
      if (neighbor.card.owner !== allySide) continue;
      return true;
    }
  }
  return false;
}

function packBonus(
  draft: Draft<GameState> | GameState,
  unit: Draft<BoardEntity> | BoardEntity,
): number {
  // Faction lookup needs the static card def; reading the def requires
  // a registry, which combat callers wire through ReduceCtx. For the
  // dynamic check we fall back to an inline scan keyed on the
  // CardInstance's def-id captured on the entity at deploy time.
  // Same-defId stacking is a sane proxy for "same faction" until
  // engine/registry threading is plumbed through every call site.
  const myDef = unit.card.defId;
  const myOwner = unit.card.owner;
  let count = 0;
  for (const e of Object.values(draft.board)) {
    if (!e || e.entityId === unit.entityId) continue;
    if (e.isGeneral) continue;
    if (e.card.owner !== myOwner) continue;
    if (e.card.defId === myDef) count++;
  }
  return count * PACK_BONUS_PER_ALLY;
}

function isAdjacentToOwnGeneral(
  draft: Draft<GameState> | GameState,
  unit: Draft<BoardEntity> | BoardEntity,
): boolean {
  const ownerSide = unit.card.owner;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = unit.row + dr;
      const nc = unit.col + dc;
      const neighbor = draft.board[posKey(nr, nc)];
      if (!neighbor) continue;
      if (neighbor.isGeneral && neighbor.card.owner === ownerSide) return true;
    }
  }
  return false;
}
