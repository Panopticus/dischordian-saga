// apps/shared/tradeEmpire/dreamerShieldMystery.ts
//
// §8.7 Dreamer's Shield playable mystery. The 5-step investigation
// chain plus a checker function that resolves a player's progress
// from their narrative-flag set.
//
// Pure data + helpers — no DB, no service. Story-team-owned. The
// sectorFirstEntered ripple sets the canonical flags; the dialog
// trees gate on them. Once step 5 fires, dreamer_barrier becomes
// enterable.

import type { NpcKey } from "../npcs/types";

export interface DreamerStep {
  stepIndex: number;
  stepKey: string;
  /** The narrative flag set when this step completes. */
  flagKey: string;
  /** Which NPC voices the step's dialog node. */
  ownerNpcKey: NpcKey;
  /** One-line action prompt rendered in the Court tab. */
  actionPrompt: string;
  /** What the player must do to set the flag (described, not encoded). */
  trigger: string;
}

export const DREAMER_SHIELD_CHAIN: ReadonlyArray<DreamerStep> = [
  {
    stepIndex: 1,
    stepKey: "find_the_seam",
    flagKey: "dreamer_seam_found",
    ownerNpcKey: "the_antiquarian",
    actionPrompt:
      "Visit Terminus Approach with ≥30 standing among the Antiquarian Shelf-mates. Daniel Cross will annotate the seam.",
    trigger:
      "On sectorFirstEntered(terminus_approach) AND tradeSubHouseReputation.antiquarian_shelfmates ≥ 30, set dreamer_seam_found.",
  },
  {
    stepIndex: 2,
    stepKey: "verify_the_math",
    flagKey: "dreamer_math_verified",
    ownerNpcKey: "the_antiquarian",
    actionPrompt:
      "Sign three Antiquarian contracts of any tier. The Cross-References Desk corroborates the seam math.",
    trigger:
      "On contract_signed.brokerKey starting with broker_antiquarian_archive, count signatures; at 3 set dreamer_math_verified.",
  },
  {
    stepIndex: 3,
    stepKey: "find_the_artifact",
    flagKey: "dreamer_artifact_recovered",
    ownerNpcKey: "wraith_calder",
    actionPrompt:
      "Run an exploration mission in Panopticon Ruins. Recover the artifact Wraith Calder names in dialog.",
    trigger:
      "On completeMission whose sectorId === panopticon_ruins AND mission tag includes \"artifact\", set dreamer_artifact_recovered.",
  },
  {
    stepIndex: 4,
    stepKey: "tribute_the_artifact",
    flagKey: "dreamer_artifact_tributed",
    ownerNpcKey: "the_antiquarian",
    actionPrompt:
      "Tribute the artifact to the Antiquarian Shelf-mates. Daniel Cross writes the proof; the Casino's spreads close worthless.",
    trigger:
      "On payTribute.targetSubHouseKey === antiquarian_shelfmates AND tribute item ID matches the recovered artifact, set dreamer_artifact_tributed.",
  },
  {
    stepIndex: 5,
    stepKey: "the_crossing",
    flagKey: "dreamer_crossed",
    ownerNpcKey: "wraith_calder",
    actionPrompt:
      "Walk into the Dreamer Barrier. The Shield does not respond; it simply does not refuse. Choose alone or with Wraith Calder.",
    trigger:
      "On sectorFirstEntered(dreamer_barrier) AND prior 4 flags set. Sets dreamer_crossed plus a sub-flag for the choice variant.",
  },
];

export const DREAMER_CHAIN_FLAG_PREREQS: ReadonlyArray<string> =
  DREAMER_SHIELD_CHAIN.slice(0, 4).map(s => s.flagKey);

/**
 * Compute the player's current step in the chain (0..5). 0 = not
 * started; 5 = crossed (chain complete).
 */
export function dreamerProgress(flagKeys: ReadonlySet<string>): number {
  let i = 0;
  for (const step of DREAMER_SHIELD_CHAIN) {
    if (!flagKeys.has(step.flagKey)) break;
    i = step.stepIndex;
  }
  return i;
}

export function isDreamerBarrierEnterable(flagKeys: ReadonlySet<string>): boolean {
  return DREAMER_CHAIN_FLAG_PREREQS.every(f => flagKeys.has(f));
}

export interface DreamerCrossingChoice {
  choiceKey: "alone" | "with_calder";
  flagKey: string;
  cinematicSummary: string;
}

export const DREAMER_CROSSING_CHOICES: ReadonlyArray<DreamerCrossingChoice> = [
  {
    choiceKey: "alone",
    flagKey: "dreamer_crossed_alone",
    cinematicSummary:
      "The player walks through alone. The Shield does not refuse. The vessel disappears for nine minutes; when it returns, no one inside speaks for the rest of the day.",
  },
  {
    choiceKey: "with_calder",
    flagKey: "dreamer_crossed_with_calder",
    cinematicSummary:
      "Wraith Calder accompanies, lighting a candle the moment the Shield closes behind them. Inside, the candle does not gutter. The Hierophant returns with a name added to the recovery ledger and refuses to read it aloud.",
  },
];
