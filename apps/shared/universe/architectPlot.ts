// apps/shared/universe/architectPlot.ts
//
// ARCHITECT PLOT BEATS — typed event queue for the Architect's
// long-game schemes (NPC depth #12).
//
// The bibles describe the Architect as actively plotting; this
// module models that: a queue of typed plot beats the universe-tick
// service fires when prerequisite faction-objective milestones land.
// Each beat has a player-visible consequence (a Loredex update, a
// public flag, a tick_event row) so the player encounters the
// Architect's continuing scheme as runtime fact, not lore-only
// description.
//
// Pure data. The runtime queue (which beats have fired for a given
// player or season) lives in the seasonTickService + tick_events
// table; this file declares what's possible.

import type { CanonicalFactionId } from "../factionCrosswalk";

/**
 * One beat in the Architect's long game. Fires when its
 * prerequisite milestones are reached on the world clock.
 */
export interface ArchitectPlotBeat {
  beatId: string;
  /** Human-readable label. */
  label: string;
  /** Long-form context for audit / lore-codex display. */
  loreContext: string;
  /**
   * Faction-objective milestones that must have fired for this beat
   * to be eligible. Strings of shape `${objectiveId}::${milestoneId}`.
   * Empty array → beat is eligible from session start.
   */
  prerequisiteMilestones: ReadonlyArray<string>;
  /** Optional saga-act minimum. */
  minAct?: number;
  /** What the beat does in the world when it fires. */
  consequences: ReadonlyArray<ArchitectPlotConsequence>;
  /** Player-facing summary for tick_events surfacing. */
  summary: string;
  /** Optional VO sting key (in a manifest the team can populate). */
  voId?: string;
}

/**
 * A consequence the runtime applies when an Architect plot beat fires.
 * Each kind hooks into an existing subsystem.
 */
export type ArchitectPlotConsequence =
  | {
      kind: "shadow_tongue_power_delta";
      /** Add (or subtract) this amount from the global powerLevel. */
      delta: number;
    }
  | {
      kind: "faction_standing_delta";
      faction: CanonicalFactionId;
      /** Per-player standing delta to apply (architect_remnants etc.). */
      delta: number;
    }
  | {
      kind: "public_flag_set";
      flag: string;
    }
  | {
      kind: "loredex_entry_redacted";
      entryId: string;
    }
  | {
      kind: "loredex_entry_revealed";
      entryId: string;
    };

/**
 * The authored beat queue. Order is *not* execution order — the
 * tick service picks any beat whose prerequisites are met and that
 * hasn't fired yet for the season.
 */
export const ARCHITECT_PLOT_BEATS: ReadonlyArray<ArchitectPlotBeat> = [
  {
    beatId: "architect.dormant_archive_activates",
    label: "A dormant archive comes back online",
    loreContext:
      "One of the Architect's pre-Fall surveillance archives — believed cold for centuries — quietly resumes recording. The Antiquarian Circle notices the new bandwidth before the Insurgency does. Two Loredex entries previously redacted return briefly to readability before the Architect's order edits them back.",
    prerequisiteMilestones: [],
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: 5 },
      { kind: "loredex_entry_revealed", entryId: "entity_18" },
      { kind: "public_flag_set", flag: "architect_archive_reactivated_s1" },
    ],
    summary:
      "The Architect's order moved a piece: a dormant archive came back online. The Antiquarian noticed first.",
  },
  {
    beatId: "architect.rewrite_the_engineer_attribution",
    label: "The Engineer's attribution gets a fresh edit",
    loreContext:
      "The Architect's editorial reach extends. The Engineer's attribution chain — partially restored by the Antiquarian's published citation — receives a Shadow Tongue overlay that obscures three of the new entries. The Coda flags the editorial change but cannot reverse it on its own.",
    prerequisiteMilestones: [
      "antiquarian.restore_attribution::citation_published",
    ],
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: 8 },
      { kind: "loredex_entry_redacted", entryId: "entity_18" },
      { kind: "faction_standing_delta", faction: "architect_order", delta: -2 },
    ],
    summary:
      "The Architect's order moved a piece: the Engineer's restored attribution received a Shadow Tongue overlay. Three entries re-redacted.",
  },
  {
    beatId: "architect.suppress_the_meme_irregularities",
    label: "Coda's Meme-irregularity broadcast gets a counter-broadcast",
    loreContext:
      "Vex's Coda has been logging irregularities consistent with a Meme broadcast presence. The Architect's Court releases a counter-broadcast — a corrected official record of the Battle of Light — that subtly contradicts the Coda's findings. Players learn the contradiction by reading both records side-by-side.",
    prerequisiteMilestones: [
      "insurgency.awaken_the_faithful::first_audit",
    ],
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: 6 },
      {
        kind: "public_flag_set",
        flag: "architect_meme_counter_broadcast_aired_s1",
      },
    ],
    summary:
      "The Architect's order moved a piece: a counter-broadcast aired against the Coda's Meme-irregularity record.",
  },
  {
    beatId: "architect.intern_a_locke_clerk",
    label: "An Authority's Ledger clerk is quietly recruited",
    loreContext:
      "One of Adjudicator Locke's law clerks accepts a quiet stipend from an Architect-aligned entity. Locke notices the change in the clerk's posture before noticing the change in the budget. The clerk continues to serve the Authority. The clerk also continues to file copies elsewhere.",
    prerequisiteMilestones: [
      "hierarchy.consolidate_the_trench::trench_resolved",
    ],
    consequences: [
      { kind: "faction_standing_delta", faction: "architect_order", delta: 3 },
      { kind: "faction_standing_delta", faction: "new_babylon", delta: -2 },
      { kind: "public_flag_set", flag: "architect_locke_clerk_compromised_s1" },
    ],
    summary:
      "The Architect's order moved a piece: a Locke clerk was quietly recruited. The Authority's Ledger has a leak it hasn't found.",
  },
  {
    beatId: "architect.oracle_silence_attempt",
    label: "An attempt is made on the Oracle's broadcast access",
    loreContext:
      "When the Oracle reaches the public-reading milestone of her prophecy fragment, the Architect's Court attempts to silence the broadcast at the substrate layer. The attempt fails — the Inventor catches it — but leaves a record. The Coda inherits the record. The Antiquarian cross-references it.",
    prerequisiteMilestones: [],
    minAct: 3,
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: 4 },
      { kind: "public_flag_set", flag: "architect_oracle_silence_attempt_s1" },
      { kind: "faction_standing_delta", faction: "dreamer_order", delta: 5 },
    ],
    summary:
      "The Architect's order moved a piece: a substrate-layer silencing of the Oracle's broadcast was attempted. The Inventor caught it.",
  },
];

// --- Validation ----------------------------------------------------------

export function validateArchitectPlotBeat(
  b: ArchitectPlotBeat,
): ReadonlyArray<string> {
  const errors: string[] = [];
  if (b.consequences.length === 0) {
    errors.push(`${b.beatId}: requires ≥ 1 consequence`);
  }
  if (b.summary.length < 12) {
    errors.push(`${b.beatId}: summary too short`);
  }
  return errors;
}

export function validateAllArchitectPlotBeats(): ReadonlyArray<string> {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const b of ARCHITECT_PLOT_BEATS) {
    if (ids.has(b.beatId)) {
      errors.push(`Duplicate beatId: ${b.beatId}`);
    }
    ids.add(b.beatId);
    errors.push(...validateArchitectPlotBeat(b));
  }
  return errors;
}

/** Beats whose prerequisites are all in the firedMilestones set. */
export function eligibleBeats(
  firedMilestones: ReadonlySet<string>,
  alreadyFiredBeats: ReadonlySet<string>,
  currentAct = 0,
): ReadonlyArray<ArchitectPlotBeat> {
  return ARCHITECT_PLOT_BEATS.filter(b => {
    if (alreadyFiredBeats.has(b.beatId)) return false;
    if (b.minAct !== undefined && currentAct < b.minAct) return false;
    return b.prerequisiteMilestones.every(m => firedMilestones.has(m));
  });
}
