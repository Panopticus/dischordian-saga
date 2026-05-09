// apps/shared/universe/dreamerPlot.ts
//
// DREAMER PLOT BEATS — typed event queue for the Dreamer's
// long-game prophecy reveals (NPC depth #12).
//
// Where the Architect's beats are operational (a piece moved, a
// surveillance shifted), the Dreamer's beats are revelatory (a
// prophecy fragment surfaces, the Oracle dictates, the Seer
// schisms). The Dreamer Shield is canonically opaque per houses.ts;
// these beats are what *reaches* the player from inside the shield.
//
// Pure data; same shape as architectPlot.ts.

import type { CanonicalFactionId } from "../factionCrosswalk";

export interface DreamerPlotBeat {
  beatId: string;
  label: string;
  loreContext: string;
  prerequisiteMilestones: ReadonlyArray<string>;
  minAct?: number;
  consequences: ReadonlyArray<DreamerPlotConsequence>;
  summary: string;
  voId?: string;
}

export type DreamerPlotConsequence =
  | { kind: "shadow_tongue_power_delta"; delta: number }
  | { kind: "faction_standing_delta"; faction: CanonicalFactionId; delta: number }
  | { kind: "public_flag_set"; flag: string }
  | { kind: "loredex_entry_revealed"; entryId: string }
  | {
      kind: "prophecy_fragment_dictated";
      /** Free-form fragment id the Oracle's bank may match against. */
      fragmentId: string;
    };

export const DREAMER_PLOT_BEATS: ReadonlyArray<DreamerPlotBeat> = [
  {
    beatId: "dreamer.first_fragment_dictated",
    label: "The Oracle dictates a first fragment",
    loreContext:
      "The Dreamer dreams forward. The Oracle delivers the first prophecy fragment — privately, to a single witness. The Antiquarian receives a copy through the cross-reference desk; if the player has reached Witnessed band on the Oracle, the player is the witness.",
    prerequisiteMilestones: [],
    consequences: [
      {
        kind: "prophecy_fragment_dictated",
        fragmentId: "fragment.s1.opening",
      },
      { kind: "public_flag_set", flag: "dreamer_fragment_s1_opening" },
      { kind: "faction_standing_delta", faction: "dreamer_order", delta: 2 },
    ],
    summary:
      "The Dreamer dreamt forward: the Oracle dictated a first prophecy fragment.",
  },
  {
    beatId: "dreamer.public_reading_lands",
    label: "A public reading lands at Thaloria",
    loreContext:
      "The Oracle reads the fragment in full at the Council of Harmony's antechamber, the Hierophant in the next room writing a name. The Architect's Court loses its three-century editorial privilege over the prophecy. Players who reached the antechamber during the reading are named in the interpretation.",
    prerequisiteMilestones: [],
    minAct: 2,
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: -6 },
      { kind: "public_flag_set", flag: "dreamer_public_reading_thaloria" },
      { kind: "faction_standing_delta", faction: "architect_order", delta: -4 },
      { kind: "faction_standing_delta", faction: "dreamer_order", delta: 4 },
    ],
    summary:
      "The Dreamer dreamt forward: a public reading landed at Thaloria. The Architect's Court lost suppression rights for the season.",
  },
  {
    beatId: "dreamer.seer_schism",
    label: "The Seer schisms from the Oracle's reading",
    loreContext:
      "The Seer disagrees with the Oracle's interpretation of the latest fragment. The schism is canon (per the Oracle's bible — prophecy as witnessed dictation, never as instruction); the runtime simply records it as a public flag the dialog selectors can match. Players at high Oracle-trust hear one side; high Seer-trust hears the other.",
    prerequisiteMilestones: ["antiquarian.restore_attribution::graph_scaffolded"],
    consequences: [
      { kind: "public_flag_set", flag: "dreamer_seer_schism_s1" },
      { kind: "faction_standing_delta", faction: "dreamer_order", delta: 0 },
    ],
    summary:
      "The Dreamer dreamt forward: the Seer broke from the Oracle's interpretation. Two readings exist now.",
  },
  {
    beatId: "dreamer.inventor_amplifies_fragment",
    label: "The Inventor amplifies an erased fragment",
    loreContext:
      "The Inventor — the Loredex's silent restorer — pulls one previously-redacted Loredex entry back to readability for the duration of the season. The choice of entry tracks the Dreamer's current fragment; players see the entry surface naturally without having to fire a reveal trigger.",
    prerequisiteMilestones: ["dreamer.first_fragment_dictated"],
    consequences: [
      { kind: "loredex_entry_revealed", entryId: "entity_105" },
      { kind: "shadow_tongue_power_delta", delta: -4 },
      { kind: "public_flag_set", flag: "inventor_amplification_s1" },
    ],
    summary:
      "The Dreamer dreamt forward: the Inventor amplified a redacted entry. Marion Kell is readable again, briefly.",
  },
  {
    beatId: "dreamer.fragment_unfolds_at_endgame",
    label: "The fragment unfolds at endgame",
    loreContext:
      "All earlier fragments converge. The Dreamer's full prophecy is finally legible — to the players who have done the witnessing-and-cross-referencing work. Players who haven't see only the silhouette of the prophecy through other characters' reactions.",
    prerequisiteMilestones: [
      "antiquarian.restore_attribution::citation_published",
      "insurgency.awaken_the_faithful::broadcast_meets_inheritance",
    ],
    minAct: 6,
    consequences: [
      { kind: "shadow_tongue_power_delta", delta: -10 },
      { kind: "public_flag_set", flag: "dreamer_endgame_fragment_legible" },
      { kind: "faction_standing_delta", faction: "dreamer_order", delta: 8 },
    ],
    summary:
      "The Dreamer dreamt forward: the full prophecy is legible to players who did the work.",
  },
];

export function validateDreamerPlotBeat(b: DreamerPlotBeat): ReadonlyArray<string> {
  const errors: string[] = [];
  if (b.consequences.length === 0) errors.push(`${b.beatId}: requires ≥ 1 consequence`);
  if (b.summary.length < 12) errors.push(`${b.beatId}: summary too short`);
  return errors;
}

export function validateAllDreamerPlotBeats(): ReadonlyArray<string> {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const b of DREAMER_PLOT_BEATS) {
    if (ids.has(b.beatId)) errors.push(`Duplicate beatId: ${b.beatId}`);
    ids.add(b.beatId);
    errors.push(...validateDreamerPlotBeat(b));
  }
  return errors;
}

export function eligibleDreamerBeats(
  firedMilestones: ReadonlySet<string>,
  alreadyFiredBeats: ReadonlySet<string>,
  currentAct = 0,
): ReadonlyArray<DreamerPlotBeat> {
  return DREAMER_PLOT_BEATS.filter(b => {
    if (alreadyFiredBeats.has(b.beatId)) return false;
    if (b.minAct !== undefined && currentAct < b.minAct) return false;
    return b.prerequisiteMilestones.every(m => firedMilestones.has(m));
  });
}
