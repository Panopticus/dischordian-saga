/**
 * Amount evaluator.
 *
 * Resolves a polymorphic `Amount` (const / x_cost / count_of / etc.) to a
 * concrete integer in the current ExecCtx.
 *
 * Scope today: `const` only — the 3 reference cards use only constant
 * amounts. Each further-authored card batch grows this file as needed.
 * The unsupported kinds throw UnsupportedAmountError so we notice
 * immediately when a new op hits the interpreter with no backing.
 */
import type { GameState } from "../types/GameState";
import type { Amount } from "../types/Effect";
import type { ExecCtx } from "./execCtx";

export function evaluateAmount(
  amount: Amount,
  _ctx: ExecCtx,
  _state: GameState
): number {
  switch (amount.kind) {
    case "const":
      return amount.value;
    case "x_cost":
    case "count_of":
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
