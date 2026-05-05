/**
 * Condition evaluator.
 *
 * Evaluates a `Condition` node against the current ExecCtx and draft.
 * Returns a boolean; interpreters use this to decide whether an `if`
 * branch fires, or whether an ability's guard condition is satisfied
 * before running its effect.
 *
 * Scope today:
 *  - `counter_gte` — used by The Antiquarian's evolve-at-4 condition
 *  - `and`/`or`/`not` — trivial combinators, included for compositional
 *    completeness since they add <10 lines and let authors write compound
 *    guards immediately
 *
 * Other condition kinds (self_damaged, self_at_health, allies_with,
 * mana_available, target_exists) throw UnsupportedConditionError. They
 * land when a card author hits them.
 */
import type { GameState } from "../types/GameState";
import type { Condition, TargetRef, UnitFilter } from "../types/Effect";
import type { ExecCtx } from "./execCtx";
import { resolveTargetRef, findBoardEntity, resolveTargetSelector } from "./targeting";

export function evaluateCondition(
  cond: Condition,
  ctx: ExecCtx,
  state: GameState
): boolean {
  switch (cond.kind) {
    case "counter_gte": {
      // The counter is read from `self` by convention. When a future card
      // needs to check a counter on some other entity, extend Condition
      // with an `of: TargetRef` field rather than overloading here.
      const selfRef: TargetRef = { kind: "self" };
      const ids = resolveTargetRef(selfRef, ctx, state);
      if (ids.length === 0) return false;
      const entity = findBoardEntity(state, ids[0]);
      if (!entity) return false;
      const current = entity.card.counters[cond.counter] ?? 0;
      return current >= cond.value;
    }
    case "and":
      return cond.all.every((c) => evaluateCondition(c, ctx, state));
    case "or":
      return cond.any.some((c) => evaluateCondition(c, ctx, state));
    case "not":
      return !evaluateCondition(cond.c, ctx, state);
    case "self_damaged": {
      // True iff the source entity has taken damage this match
      // (currentHealth < maxHealth).
      const selfRef: TargetRef = { kind: "self" };
      const ids = resolveTargetRef(selfRef, ctx, state);
      if (ids.length === 0) return false;
      const entity = findBoardEntity(state, ids[0]);
      if (!entity) return false;
      return entity.card.currentHealth < entity.card.maxHealth;
    }
    case "self_at_health": {
      // Compare source entity's currentHealth against `value` per `op`.
      const selfRef: TargetRef = { kind: "self" };
      const ids = resolveTargetRef(selfRef, ctx, state);
      if (ids.length === 0) return false;
      const entity = findBoardEntity(state, ids[0]);
      if (!entity) return false;
      const hp = entity.card.currentHealth;
      return cond.op === "gte" ? hp >= cond.value : hp <= cond.value;
    }
    case "allies_with": {
      // Count board entities matching the filter on the source's side
      // and compare against the threshold per `op`.
      const selfRef: TargetRef = { kind: "self" };
      const ids = resolveTargetRef(selfRef, ctx, state);
      if (ids.length === 0) return false;
      const self = findBoardEntity(state, ids[0]);
      if (!self) return false;
      const ownerSide = self.card.owner;
      const matching = countBoardMatches(state, cond.filter, ownerSide, self.entityId);
      switch (cond.op) {
        case "gte": return matching >= cond.count;
        case "lte": return matching <= cond.count;
        case "eq":  return matching === cond.count;
      }
      return false;
    }
    case "mana_available": {
      // Read the active player's mana from the player state.
      const selfRef: TargetRef = { kind: "self" };
      const ids = resolveTargetRef(selfRef, ctx, state);
      if (ids.length === 0) return false;
      const self = findBoardEntity(state, ids[0]);
      const ownerSide = self?.card.owner ?? state.currentPlayer;
      const player = state.players[ownerSide];
      return (player?.mana ?? 0) >= cond.amount;
    }
    case "target_exists": {
      // True iff resolveTargetSelector() finds at least one match for
      // the provided selector. Wrapped in try/catch so unrecognized
      // selector kinds don't bubble (return false instead).
      try {
        const matches = resolveTargetSelector(cond.selector, ctx, state);
        return matches.length > 0;
      } catch {
        return false;
      }
    }
    default: {
      const _exhaust: never = cond;
      void _exhaust;
      return false;
    }
  }
}

export class UnsupportedConditionError extends Error {
  constructor(message: string) {
    super(`UnsupportedConditionError: ${message}`);
    this.name = "UnsupportedConditionError";
  }
}

/** Count board entities on `ownerSide` matching `filter`, excluding
 *  the source entity. Used by the `allies_with` condition. */
function countBoardMatches(
  state: GameState,
  filter: UnitFilter,
  ownerSide: number,
  excludeEntityId: string,
): number {
  let n = 0;
  for (const entity of Object.values(state.board)) {
    if (entity.entityId === excludeEntityId) continue;
    if (entity.card.owner !== ownerSide) continue;
    if (filter.controller === "opponent") continue; // already on owner's side
    if (filter.keywords?.has) {
      const have = new Set<string>(entity.card.activeKeywords);
      let ok = true;
      for (const k of filter.keywords.has) if (!have.has(k)) { ok = false; break; }
      if (!ok) continue;
    }
    if (filter.keywords?.lacks) {
      const have = new Set<string>(entity.card.activeKeywords);
      let ok = true;
      for (const k of filter.keywords.lacks) if (have.has(k)) { ok = false; break; }
      if (!ok) continue;
    }
    n++;
  }
  return n;
}
