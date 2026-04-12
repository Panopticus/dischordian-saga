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
import type { Condition, TargetRef } from "../types/Effect";
import type { ExecCtx } from "./execCtx";
import { resolveTargetRef, findBoardEntity } from "./targeting";

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
    case "self_damaged":
    case "self_at_health":
    case "allies_with":
    case "mana_available":
    case "target_exists":
      throw new UnsupportedConditionError(
        `condition kind '${cond.kind}' not yet implemented`
      );
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
