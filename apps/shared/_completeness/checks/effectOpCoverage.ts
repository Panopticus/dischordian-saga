/**
 * B1 — Effect-op coverage parity check.
 *
 * Compares the discriminated-union members of `Effect` (op-tagged) in
 * `apps/shared/tcg-core/types/Effect.ts` against the `case "<op>":`
 * branches in the interpreter at `engine/effectInterpreter.ts`.
 *
 * Hard parity: any declared op without an interpreter case is a
 * silently-broken effect on every card that uses it. The interpreter
 * must handle every op the schema accepts, period.
 *
 * Per the 2026-05 audit, this should currently report PASS — proves
 * the gate works on a happy-path subsystem before subsequent checks
 * surface real gaps.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  REPO_ROOT,
  extractUnionDiscriminants,
  extractSwitchCases,
} from "../scanner";
import type { RawParityCount } from "../types";

const EFFECT_TYPES_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/types/Effect.ts",
);
const INTERPRETER_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/engine/effectInterpreter.ts",
);

export function checkEffectOpCoverage(): RawParityCount {
  const effectsSrc = fs.readFileSync(EFFECT_TYPES_PATH, "utf-8");
  const interpreterSrc = fs.readFileSync(INTERPRETER_PATH, "utf-8");

  const declared = extractUnionDiscriminants(effectsSrc, "op");
  const handled = new Set(extractSwitchCases(interpreterSrc));

  const missing: string[] = declared.filter((op) => !handled.has(op));

  return {
    declared: declared.length,
    implemented: declared.length - missing.length,
    missing: missing.map((op) => `${op}: no \`case "${op}":\` in effectInterpreter.ts`),
  };
}
