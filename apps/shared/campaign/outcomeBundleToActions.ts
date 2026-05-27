/* ═══════════════════════════════════════════════════════
   OUTCOME BUNDLE → ENGINE ACTIONS

   Plan §"Stakes Stream engine generalization", connector
   slice. Given an `OutcomeBundle` (produced by
   `applyDialogChoiceOutcomes`) and the side of the player
   making the choice, produce engine `Action` objects the
   in-match dialog runner can dispatch through the
   reducer.

   Today this bridge produces exactly one action shape:
   `apply_dialog_stakes` — the in-match consumer of the
   bundle's `stakesWrites`. Other bundle write categories
   (flagWrites / trustWrites / factionRepWrites / etc.) are
   already routed through the server-authoritative
   `npc.recordDialogChoiceOutcome` procedure for persistent
   state; they do NOT need engine actions because they
   don't move match-resident state.

   The function is pure — no dispatch, no side effects.
   Callers receive a list and choose where to dispatch.
   Returns an empty list when the bundle has no
   stakesWrites; callers can short-circuit on
   `actions.length === 0`.

   `seq` is the caller's responsibility — engine actions
   carry a monotonic seq the reducer enforces. The bridge
   takes a `nextSeq` callback so callers can mint
   per-action seq numbers from their own counter
   (typically the GameContext's action-seq tracker).
   ═══════════════════════════════════════════════════════ */

import type { Action } from "../tcg-core/types/Action";
import type { Side } from "../tcg-core/types/Ids";
import type { OutcomeBundle } from "./applyDialogChoice";

/** Build the in-match engine actions corresponding to an
 *  OutcomeBundle. Today produces zero-or-one
 *  `apply_dialog_stakes` actions (zero when the bundle has no
 *  stakes intents). Returns a stable, deterministic array — the
 *  order is fixed by the bundle's order so the same bundle
 *  always produces the same action sequence. */
export function outcomeBundleToEngineActions(
  bundle: OutcomeBundle,
  actor: Side,
  nextSeq: () => number,
): ReadonlyArray<Action> {
  const out: Action[] = [];

  if (bundle.stakesWrites.length > 0) {
    out.push({
      kind: "apply_dialog_stakes",
      actor,
      outcomeId: bundle.outcomeId,
      deltas: bundle.stakesWrites.map((w) => ({
        axisId: w.axisId,
        delta: w.delta,
      })),
      seq: nextSeq(),
    });
  }

  return out;
}
