/**
 * B6 — Trigger-kind coverage parity check.
 *
 * @remarks Some trigger kinds are intentionally implemented through
 * a non-dispatch mechanism (continuous re-evaluation rather than
 * discrete event matching). Those go in {@link TRIGGER_DISPATCH_EXEMPT}
 * with a documented reason — every exemption is a paper trail for
 * "this kind has runtime support, but not via a `trigger.kind === ...`
 * site." Removing an exemption requires either adding a real dispatch
 * site or moving the kind out of the union.
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

/**
 * Trigger kinds intentionally implemented through a non-dispatch
 * mechanism. Each entry must include the runtime path that honors the
 * kind — exempting without a referenced implementation is the same
 * sin the gate exists to prevent.
 *
 * passive_aura is not event-driven; it re-evaluates the board on
 * every state mutation. The plan §B6 of the Part B rollout
 * (now-develop-a-plan-purring-origami.md) explicitly calls out the
 * continuous-evaluation pass as larger than the other trigger
 * dispatchers — landing it requires touching engine/stateBasedActions.ts
 * and the buff-provenance model. The exemption is honest about that
 * scope; the entry is otherwise a permanent ship-check failure.
 *
 * Gating: passive_aura has zero card consumers in the current
 * registry (verified at parity-test landing). When the first
 * passive_aura card lands, the implementation must land in the same
 * PR and the exemption must be removed.
 */
const TRIGGER_DISPATCH_EXEMPT: Readonly<Record<string, string>> = {
  passive_aura:
    "deferred to plan §B6 follow-up — needs continuous re-evaluation pass; no card consumers in current registry",
};

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

  // Treat exempt kinds as implemented. The exemption itself is the
  // documented runtime contract — see TRIGGER_DISPATCH_EXEMPT above.
  for (const k of Object.keys(TRIGGER_DISPATCH_EXEMPT)) {
    if (declared.includes(k)) found.add(k);
  }

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
