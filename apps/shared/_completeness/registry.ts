/**
 * Completeness gate — registry.
 *
 * Add subsystems here as their parity checks land. The harness
 * (`scripts/ship-check.ts`) iterates this list and the matching vitest
 * suite (`apps/shared/_completeness/registry.test.ts`) keeps the entries
 * well-formed.
 *
 * Each entry's `check` function does its own scanning and returns a
 * {@link RawParityCount}. The harness folds in PASS/FAIL/RATCHET status
 * from the count and the entry's ratchet config — check functions do
 * NOT compute their own status.
 *
 * Empty initial state is intentional: Part A of the rollout ships the
 * harness; Part B onward registers checks one at a time, each one
 * accompanied by the implementation work that closes its gap.
 */
import type { CompletenessEntry } from "./types";

export const COMPLETENESS_REGISTRY: ReadonlyArray<CompletenessEntry> = [
  // First entry lands with B1 (effect-op coverage):
  //   {
  //     id: "tcg.effect_op_coverage",
  //     name: "effect.op handlers",
  //     description: "Every Effect op declared in the schema has an interpreter case.",
  //     check: () => checkEffectOpCoverage(),
  //   },
];
