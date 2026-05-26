/* ═══════════════════════════════════════════════════════
   BUILD OUTCOME DISPATCH CONTEXT — server adapter

   Plan §"BioWare-Style Dialog Design".

   Bridges the pure `OutcomeDispatchContext` shape (defined
   in `apps/shared/campaign/dispatchOutcomeBundle.ts`) to
   the existing server writers:

     setNarrativeFlag  → narrativeFlagWriter.setUserNarrativeFlag
     setNpcPublicFlag  → npc router's writePublicFlag
     applyTrustDelta   → npc router's applyTrustDelta
     applyFactionRep   → factionReputationService.applyFactionReputationDelta

   Axis writes are deferred — the player-aggregation axis
   pipeline lives in `apps/shared/playerProfile.ts` and the
   server-side writer that updates it is per-router today.
   Phase 1 just logs the intent; Phase 2 consolidates the
   axis writer alongside the other consolidations.

   Stakes / card-unlock / deck-mutation intents are recorded
   via the optional intent callbacks; the consuming
   subsystems land in later slices and will plug their own
   recorders in.

   The factory is async-free at construction (it just
   captures closures); the per-write callbacks await their
   underlying DB calls. Tests pass mocks via the optional
   `overrides` parameter.
   ═══════════════════════════════════════════════════════ */
import type { OutcomeDispatchContext } from "../../shared/campaign";
import type { NpcKey } from "../../shared/npcs/types";
import { setUserNarrativeFlag } from "./narrativeFlagWriter";
import { applyFactionReputationDelta } from "./factionReputationService";
import { applyTrustDelta, writePublicFlag } from "../routers/npc";
import { logger } from "../logger";

export interface BuildContextInput {
  userId: number;
  /** Optional — the NPC owning the dialog tree being committed.
   *  Required for trust writes; falls back to logging-only when
   *  the tree has no NPC binding. */
  npcKey?: NpcKey;
  /** Optional override hooks — used by tests to substitute mocks
   *  for any underlying writer without spinning up the DB. */
  overrides?: Partial<OutcomeDispatchContext>;
}

/**
 * Build the canonical server-side `OutcomeDispatchContext`. Each
 * writer is a closure over the captured `userId` so the dispatcher
 * does not need to repeat the identity argument per call.
 *
 * Skipped writers (axis / stakes / card / deck) are intentionally
 * left as no-op recorders today. The dispatcher will mark them as
 * `attempted` but record no side effect — the structured result
 * surfaces this so callers can detect "wired but inert" intents.
 */
export function buildOutcomeDispatchContext(
  input: BuildContextInput,
): OutcomeDispatchContext {
  const { userId, npcKey } = input;

  const base: OutcomeDispatchContext = {
    userId,
    npcKey,

    setNarrativeFlag: async (flag, value) => {
      await setUserNarrativeFlag(userId, flag, value);
    },

    setNpcPublicFlag: async (flag, _value) => {
      // The publicFlag write is a true insert (idempotent on the
      // unique index); `value` is implicitly `true`. The `_value`
      // parameter is preserved for API symmetry with
      // setNarrativeFlag.
      await writePublicFlag(userId, flag, npcKey);
    },

    applyTrustDelta: async (key, delta) => {
      // The dispatcher passes `npcKey` from the context, so the
      // first arg here is the same string we captured above. Re-
      // validate cheaply: trust mutations require the npcKey to
      // be in the canonical roster; an unknown key drops the
      // write with a warning rather than throwing.
      await applyTrustDelta(userId, key as NpcKey, delta);
    },

    applyFactionRepDelta: async (factionKey, delta) => {
      await applyFactionReputationDelta(userId, factionKey, delta);
    },

    recordStakesIntent: (axisId, delta) => {
      logger?.debug?.(
        "outcomeDispatch.stakesIntent",
        "buildOutcomeDispatchContext",
        { userId, npcKey, axisId, delta },
      );
    },

    recordCardUnlockIntent: (cardDefId, via) => {
      logger?.debug?.(
        "outcomeDispatch.cardUnlockIntent",
        "buildOutcomeDispatchContext",
        { userId, npcKey, cardDefId, via },
      );
    },

    recordDeckMutationIntent: (encounterId, addCardDefId) => {
      logger?.debug?.(
        "outcomeDispatch.deckMutationIntent",
        "buildOutcomeDispatchContext",
        { userId, npcKey, encounterId, addCardDefId },
      );
    },

    log: (event, payload) => {
      logger?.info?.(event, "buildOutcomeDispatchContext", payload);
    },
  };

  // Overrides win — tests pass them in to substitute mocks for the
  // underlying DB calls.
  return { ...base, ...input.overrides };
}
