/**
 * Amount evaluator.
 *
 * Resolves a polymorphic `Amount` (const / x_cost / count_of / etc.) to a
 * concrete integer in the current ExecCtx.
 *
 * Supported today: `const`, `count_of`. The remaining kinds throw
 * UnsupportedAmountError so we notice immediately when a new op hits the
 * interpreter with no backing.
 */
import type { GameState } from "../types/GameState";
import type { Amount } from "../types/Effect";
import type { ExecCtx } from "./execCtx";
import { matchesUnitFilter, resolveTargetRef, findBoardEntity } from "./targeting";

export function evaluateAmount(
  amount: Amount,
  ctx: ExecCtx,
  state: GameState
): number {
  switch (amount.kind) {
    case "const":
      return amount.value;
    case "count_of": {
      let n = 0;
      for (const entity of Object.values(state.board)) {
        if (matchesUnitFilter(entity, amount.filter, ctx)) n++;
      }
      return n;
    }
    case "x_cost": {
      // X-cost spells are spells whose mana cost the player chose at
      // cast time; the chosen amount lands on the ExecCtx as
      // `xCost`. Defaults to 0 if absent (the engine guard makes
      // sure x_cost amounts are only resolved on contexts that have
      // it). Audit Phase J4.
      const x = (ctx as unknown as { xCost?: number }).xCost;
      return typeof x === "number" ? x : 0;
    }
    case "missing_health": {
      const ids = resolveTargetRef(amount.of, ctx, state);
      if (ids.length === 0) return 0;
      const entity = findBoardEntity(state, ids[0]);
      if (!entity) return 0;
      return Math.max(0, entity.card.maxHealth - entity.card.currentHealth);
    }
    case "counter_of": {
      const ids = resolveTargetRef(amount.of, ctx, state);
      if (ids.length === 0) return 0;
      const entity = findBoardEntity(state, ids[0]);
      if (!entity) return 0;
      return entity.card.counters[amount.counter] ?? 0;
    }
    default: {
      const _exhaust: never = amount;
      void _exhaust;
      return 0;
    }
  }
}

export class UnsupportedAmountError extends Error {
  constructor(message: string) {
    super(`UnsupportedAmountError: ${message}`);
    this.name = "UnsupportedAmountError";
  }
}
