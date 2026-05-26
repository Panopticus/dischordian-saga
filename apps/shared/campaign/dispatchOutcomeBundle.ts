/* ═══════════════════════════════════════════════════════
   DISPATCH OUTCOME BUNDLE — effect dispatcher

   Plan §"BioWare-Style Dialog Design" — the bridge between
   the pure `applyDialogChoiceOutcomes()` resolver and the
   existing server backends.

   `applyDialogChoiceOutcomes()` produces an `OutcomeBundle`
   — a typed list of writes. This module dispatches those
   writes to the right backend, but does NOT import any
   backend directly. Effects are injected via
   `OutcomeDispatchContext`, mirroring the existing
   `SetNarrativeFlagFn` convention used by
   `apps/shared/flags/*Producers.ts`.

   Why DI:
     • The server's `applyTrustDelta` lives inside
       `apps/server/routers/npc.ts` as a file-scope helper
       (not exported). Wrapping it in an injected callback
       avoids forcing a refactor on Day 1.
     • The same dispatcher runs client-side for optimistic
       UI: the client supplies callbacks that update React
       state instead of writing to a DB.
     • Tests pass mocks and assert "this bundle would have
       triggered these writes" without spinning up a DB.

   Stakes / card-unlock / deck-mutation are recorded as
   *intent* in Phase 1 — the consuming subsystems
   (StoryEncounter.stakesMode, expansionUnlockService's
   `dialog_choice` family, bossDeckResolver) land in later
   slices. The intent recorder is optional so a partial
   context still dispatches the supported writes cleanly.

   Pure module — no I/O, no React, no engine state.
   ═══════════════════════════════════════════════════════ */

import type { OutcomeBundle } from "./applyDialogChoice";

/** Reasonable subset of every writer the dispatcher can call.
 *  Each writer is async-tolerant (`PromiseLike | void`) so a
 *  server-side caller can return real DB promises and a
 *  client-side caller can stay synchronous. */
export interface OutcomeDispatchContext {
  /** Identity context — passed for logging only; the writers
   *  themselves know which user they target. */
  userId: number | string;
  /** The NPC the dialog tree is owned by, when relevant.
   *  Required for trust writes; optional otherwise. */
  npcKey?: string;

  /** Writes a private narrative flag — the canonical
   *  `narrativeFlags[<flag>] = value` mutation. */
  setNarrativeFlag: (flag: string, value: boolean) => PromiseLike<void> | void;

  /** Writes a cross-NPC public flag. Optional — bundles
   *  without `publicFlag` writes do not need it. */
  setNpcPublicFlag?: (flag: string, value: boolean) => PromiseLike<void> | void;

  /** Adjusts the NPC's trust score; the writer clamps. */
  applyTrustDelta?: (
    npcKey: string,
    delta: number,
  ) => PromiseLike<void> | void;

  /** Adjusts a player aggregation axis. */
  applyAxisDelta?: (axis: string, delta: number) => PromiseLike<void> | void;

  /** Adjusts faction reputation. Server-side this forwards
   *  to `applyFactionReputationDelta()`. */
  applyFactionRepDelta?: (
    factionKey: string,
    delta: number,
  ) => PromiseLike<void> | void;

  /** Records a stakes-axis intent. Phase 1 default is no-op
   *  recording; Phase 2 wires the StoryEncounter reducer. */
  recordStakesIntent?: (axisId: string, delta: number) => void;

  /** Records a card-unlock intent. Phase 1 default is no-op
   *  recording; Phase 2 wires the unlock service. */
  recordCardUnlockIntent?: (cardDefId: string, via: string) => void;

  /** Records a future-encounter deck mutation intent.
   *  Phase 1 default is no-op recording; Phase 2 wires the
   *  StoryEncounter.bossDeckResolver. */
  recordDeckMutationIntent?: (
    encounterId: string,
    addCardDefId: string,
  ) => void;

  /** Optional logger — invoked once per dispatch with a
   *  structured summary the caller can route to telemetry. */
  log?: (event: string, payload: Record<string, unknown>) => void;
}

export interface OutcomeDispatchResult {
  outcomeId: string;
  /** Writes that the dispatcher *attempted* to call. */
  attempted: {
    flagWrites: number;
    trustWrites: number;
    axisWrites: number;
    factionRepWrites: number;
    stakesIntents: number;
    cardUnlockIntents: number;
    deckMutationIntents: number;
  };
  /** Writes the dispatcher SKIPPED because the context
   *  did not supply a writer for that kind. Skipped
   *  writes are a soft warning — the bundle still
   *  succeeds — but the caller may want to surface them
   *  in dev builds. */
  skipped: ReadonlyArray<{ kind: string; reason: string }>;
  /** Errors thrown by individual writers. The dispatcher
   *  swallows each one so a single failed write does not
   *  abandon the rest of the bundle; callers receive the
   *  list to log / retry. */
  errors: ReadonlyArray<{ kind: string; detail: unknown }>;
}

/**
 * Dispatch every write in an `OutcomeBundle` to the injected
 * effects. Returns a structured result describing what was
 * attempted, skipped, and errored.
 *
 * The dispatcher fires writes sequentially so DB-bound
 * callers see deterministic ordering (a trust write before a
 * flag write before a faction-rep write); writers that
 * benefit from parallelism can be parallelised inside the
 * callback if desired.
 */
export async function dispatchOutcomeBundle(
  bundle: OutcomeBundle,
  ctx: OutcomeDispatchContext,
): Promise<OutcomeDispatchResult> {
  const skipped: { kind: string; reason: string }[] = [];
  const errors: { kind: string; detail: unknown }[] = [];

  const attempted = {
    flagWrites: 0,
    trustWrites: 0,
    axisWrites: 0,
    factionRepWrites: 0,
    stakesIntents: 0,
    cardUnlockIntents: 0,
    deckMutationIntents: 0,
  };

  /* ─── Flag writes ─── */
  for (const w of bundle.flagWrites) {
    if (w.scope === "narrative") {
      attempted.flagWrites += 1;
      try {
        await ctx.setNarrativeFlag(w.flag, true);
      } catch (err) {
        errors.push({ kind: "narrative_flag", detail: err });
      }
    } else {
      if (!ctx.setNpcPublicFlag) {
        skipped.push({
          kind: "npc_public_flag",
          reason: `no setNpcPublicFlag writer for flag "${w.flag}"`,
        });
        continue;
      }
      attempted.flagWrites += 1;
      try {
        await ctx.setNpcPublicFlag(w.flag, true);
      } catch (err) {
        errors.push({ kind: "npc_public_flag", detail: err });
      }
    }
  }

  /* ─── Trust writes ─── */
  for (const w of bundle.trustWrites) {
    if (!ctx.applyTrustDelta) {
      skipped.push({
        kind: "trust",
        reason: `no applyTrustDelta writer for delta ${w.delta}`,
      });
      continue;
    }
    if (!ctx.npcKey) {
      skipped.push({
        kind: "trust",
        reason: `applyTrustDelta requires ctx.npcKey; bundle delta ${w.delta} dropped`,
      });
      continue;
    }
    attempted.trustWrites += 1;
    try {
      await ctx.applyTrustDelta(ctx.npcKey, w.delta);
    } catch (err) {
      errors.push({ kind: "trust", detail: err });
    }
  }

  /* ─── Axis writes ─── */
  for (const w of bundle.axisWrites) {
    if (!ctx.applyAxisDelta) {
      skipped.push({
        kind: "axis",
        reason: `no applyAxisDelta writer for axis "${w.axis}"`,
      });
      continue;
    }
    attempted.axisWrites += 1;
    try {
      await ctx.applyAxisDelta(w.axis, w.delta);
    } catch (err) {
      errors.push({ kind: "axis", detail: err });
    }
  }

  /* ─── Faction reputation writes ─── */
  for (const w of bundle.factionRepWrites) {
    if (!ctx.applyFactionRepDelta) {
      skipped.push({
        kind: "faction_rep",
        reason: `no applyFactionRepDelta writer for faction "${w.faction}"`,
      });
      continue;
    }
    attempted.factionRepWrites += 1;
    try {
      await ctx.applyFactionRepDelta(w.faction, w.delta);
    } catch (err) {
      errors.push({ kind: "faction_rep", detail: err });
    }
  }

  /* ─── Stakes intents (Phase 1: record only) ─── */
  for (const w of bundle.stakesWrites) {
    attempted.stakesIntents += 1;
    try {
      ctx.recordStakesIntent?.(w.axisId, w.delta);
    } catch (err) {
      errors.push({ kind: "stakes_intent", detail: err });
    }
  }

  /* ─── Card unlock intents (Phase 1: record only) ─── */
  for (const w of bundle.cardUnlockWrites) {
    attempted.cardUnlockIntents += 1;
    try {
      ctx.recordCardUnlockIntent?.(w.cardDefId, w.via);
    } catch (err) {
      errors.push({ kind: "card_unlock_intent", detail: err });
    }
  }

  /* ─── Deck mutation intents (Phase 1: record only) ─── */
  for (const w of bundle.deckMutationWrites) {
    attempted.deckMutationIntents += 1;
    try {
      ctx.recordDeckMutationIntent?.(w.encounterId, w.addCardDefId);
    } catch (err) {
      errors.push({ kind: "deck_mutation_intent", detail: err });
    }
  }

  ctx.log?.("dispatch_outcome_bundle", {
    outcomeId: bundle.outcomeId,
    userId: ctx.userId,
    npcKey: ctx.npcKey,
    attempted,
    skipped: skipped.length,
    errors: errors.length,
  });

  return {
    outcomeId: bundle.outcomeId,
    attempted,
    skipped,
    errors,
  };
}
