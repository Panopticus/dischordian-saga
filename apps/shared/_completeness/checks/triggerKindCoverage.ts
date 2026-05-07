/**
 * B6 — Trigger-kind coverage parity check.
 *
 * Compares the `Trigger` discriminated union in
 * `apps/shared/tcg-core/types/Trigger.ts` against the dispatch sites
 * in the engine — every `<expr>.kind === "<kind>"` or `!== "<kind>"`
 * pattern in the engine source.
 *
 * Triggers are not driven by a single switch statement. Different
 * engine subsystems own different dispatch sites:
 *   - combat.ts        on_damage_dealt
 *   - movement.ts      on_move
 *   - turn.ts          on_turn_start
 *   - playCard.ts      on_cast, on_card_played
 *   - deploy.ts        on_deploy, on_summoned_near_me
 *   - stateBasedActions.ts  on_death, on_any_unit_dies, on_kill
 *   - reducer.ts       activated
 *
 * A kind without a `<expr>.kind === "<kind>"` site anywhere in the
 * engine is structurally dead — the type accepts it, the schema
 * accepts it, cards declare it, and the engine never matches it.
 *
 * Caveat: a kind whose dispatcher exists but is never CALLED (e.g.
 * `enqueueKillTriggers` defined but unwired) will report as
 * "implemented" by this check. That class of bug is a separate
 * gate covered by the replay-determinism work in B4 — playing a
 * card with a real on_kill trigger and asserting the effect fired.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  REPO_ROOT,
  extractUnionDiscriminantsInAlias,
  walkSourceFiles,
  findKindReferences,
} from "../scanner";
import type { RawParityCount } from "../types";

const TRIGGER_TYPES_PATH = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/types/Trigger.ts",
);
const ENGINE_DIR = path.join(REPO_ROOT, "apps/shared/tcg-core/engine");

export function checkTriggerKindCoverage(): RawParityCount {
  const triggerSrc = fs.readFileSync(TRIGGER_TYPES_PATH, "utf-8");
  const declared = extractUnionDiscriminantsInAlias(
    triggerSrc,
    "Trigger",
    "kind",
  );
  if (declared.length === 0) {
    throw new Error(
      "checkTriggerKindCoverage: Trigger union not found in Trigger.ts",
    );
  }
  const engineFiles = walkSourceFiles(ENGINE_DIR);
  const { found } = findKindReferences(engineFiles, declared);

  const missing = declared.filter((k) => !found.has(k));

  return {
    declared: declared.length,
    implemented: declared.length - missing.length,
    missing: missing.map(
      (k) =>
        `${k}: no \`trigger.kind === "${k}"\` dispatch site in apps/shared/tcg-core/engine/`,
    ),
  };
}
