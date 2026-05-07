/**
 * Condition-kind coverage parity check.
 *
 * Compares the `Condition` discriminated union in
 * `apps/shared/tcg-core/types/Effect.ts` against the `case "<kind>":`
 * branches in `engine/conditions.ts`.
 *
 * Hard parity: any declared condition kind without an evaluator
 * branch silently never fires its guard, so abilities gated on it
 * always pass (or always fail, depending on the default-case
 * behavior). Either way it's a correctness bug.
 *
 * Per the 2026-05 audit, this should currently report PASS.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  REPO_ROOT,
  extractUnionDiscriminantsInAlias,
  extractSwitchCases,
} from "../scanner";
import type { RawParityCount } from "../types";

const EFFECT_TYPES_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/types/Effect.ts",
);
const CONDITIONS_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/engine/conditions.ts",
);

export function checkConditionKindCoverage(): RawParityCount {
  const effectsSrc = fs.readFileSync(EFFECT_TYPES_PATH, "utf-8");
  const conditionsSrc = fs.readFileSync(CONDITIONS_PATH, "utf-8");

  const declared = extractUnionDiscriminantsInAlias(
    effectsSrc,
    "Condition",
    "kind",
  );
  if (declared.length === 0) {
    throw new Error(
      "checkConditionKindCoverage: Condition union not found in Effect.ts — refactor moved it?",
    );
  }
  const handled = new Set(extractSwitchCases(conditionsSrc));
  const missing = declared.filter((k) => !handled.has(k));

  return {
    declared: declared.length,
    implemented: declared.length - missing.length,
    missing: missing.map((k) => `${k}: no \`case "${k}":\` in conditions.ts`),
  };
}
