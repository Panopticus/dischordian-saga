/* ═══════════════════════════════════════════════════════
   PRESTIGE — cycle measurement + typed baseline

   Roadmap Implication §4: "Save-state must support prestige
   from day 1 — witnessingIntegrations.ts defines concrete
   multipliers. Schema needs base vs. prestige copies."

   Historically GameContext tracked the prestige count as
   `(prev as any).prestige` and performPrestige didn't apply
   any of the §15 P3 carryover multipliers. This module
   fixes the measurement side: given a GameState-shaped bag,
   it extracts the six PrestigeCycleStats numbers so
   applyPrestigeCarryover (in witnessingIntegrations.ts) can
   turn them into the next-cycle baseline.

   Pure module. No React, no server imports.
   ═══════════════════════════════════════════════════════ */

import type { PrestigeCycleStats } from "./witnessingIntegrations";

export type { PrestigeCycleStats };

/** All-zero baseline. Equivalent to "never prestiged". */
export const EMPTY_PRESTIGE_CYCLE_STATS: PrestigeCycleStats = {
  loredexEntries: 0,
  bondPeakMemories: 0,
  narratorDominanceEnergy: 0,
  dischordiaCards: 0,
  witnessingMilestones: 0,
  memorableMoments: 0,
};

/** The three canonical §14.1 bond-peak milestones. */
const BOND_PEAK_FLAGS = [
  "event_two_witnesses_remember",
  "event_silence_of_two_witnesses",
  "event_two_witnesses_meet",
] as const;

/** Prefix that marks a §14.1 Living Universe milestone flag. */
const WITNESSING_MILESTONE_FLAG_PREFIX = "event_";

/**
 * Measure the current cycle's stats from GameState-shaped inputs.
 *
 * Two of the six fields (narratorDominanceEnergy + memorableMoments)
 * live in external stores (dischordiaCycleStore, memorableMomentsStore).
 * The caller supplies them as numbers so this helper stays pure.
 *
 * Missing/null inputs yield zeros — never throws.
 */
export function measurePrestigeCycleStats(input: {
  loredexDiscovered?: readonly string[] | null;
  collectedCards?: readonly string[] | null;
  narrativeFlags?: Record<string, unknown> | null;
  /** From dischordiaCycleStore. */
  externalNarratorDominanceEnergy?: number;
  /** From memorableMomentsStore. */
  externalMemorableMoments?: number;
}): PrestigeCycleStats {
  const flags = input.narrativeFlags ?? {};
  const bondPeakMemories = BOND_PEAK_FLAGS.filter(
    (f) => Boolean(flags[f]),
  ).length;
  const witnessingMilestones = Object.keys(flags).filter(
    (k) =>
      k.startsWith(WITNESSING_MILESTONE_FLAG_PREFIX) && Boolean(flags[k]),
  ).length;
  return {
    loredexEntries: input.loredexDiscovered?.length ?? 0,
    bondPeakMemories,
    narratorDominanceEnergy: Number.isFinite(
      input.externalNarratorDominanceEnergy,
    )
      ? (input.externalNarratorDominanceEnergy as number)
      : 0,
    dischordiaCards: input.collectedCards?.length ?? 0,
    witnessingMilestones,
    memorableMoments: Number.isFinite(input.externalMemorableMoments)
      ? (input.externalMemorableMoments as number)
      : 0,
  };
}

/**
 * Add two PrestigeCycleStats component-wise. Used when rolling a
 * cycle measurement into the existing baseline before applying
 * the carryover multipliers.
 */
export function addPrestigeCycleStats(
  a: PrestigeCycleStats,
  b: PrestigeCycleStats,
): PrestigeCycleStats {
  return {
    loredexEntries: a.loredexEntries + b.loredexEntries,
    bondPeakMemories: a.bondPeakMemories + b.bondPeakMemories,
    narratorDominanceEnergy:
      a.narratorDominanceEnergy + b.narratorDominanceEnergy,
    dischordiaCards: a.dischordiaCards + b.dischordiaCards,
    witnessingMilestones: a.witnessingMilestones + b.witnessingMilestones,
    memorableMoments: a.memorableMoments + b.memorableMoments,
  };
}
