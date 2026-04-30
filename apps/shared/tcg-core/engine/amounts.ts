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
import { matchesUnitFilter } from "./targeting";

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
    case "x_cost":
    case "missing_health":
    case "counter_of":
      throw new UnsupportedAmountError(
        `amount kind '${amount.kind}' not yet implemented`
      );
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
