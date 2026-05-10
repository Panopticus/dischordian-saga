/* ═══════════════════════════════════════════════════════
   THE RESURRECTIONIST — breeding gate

   Vox could not finish the bloodline experiments before her
   death. The Resurrectionist (Vox's chosen successor — not
   the same entity as the endgame Necromancer-event faction
   of the same name; both inherit the title) was placed in
   cryo as a fail-safe. He wakes when the Ark has 12 crew —
   a critical mass that justifies waking him. At that point
   the breeding system unlocks with his arrival cinematic.

   This module surfaces the gate as data so the Cryo Bay
   page can render the Resurrectionist's pod state and the
   /breeding (or equivalent) page can guard correctly.

   Pure module.
   ═══════════════════════════════════════════════════════ */

export const RESURRECTIONIST_WAKE_CREW_COUNT = 12;

export type ResurrectionistPodState = "sealed" | "thawing" | "awake";

export interface ResurrectionistGateInput {
  /** Total crew the player has cloned (alive). */
  crewCount: number;
  /** Whether the player has already triggered the Awakening cinematic. */
  hasMet: boolean;
}

export function podStateForGate(
  input: ResurrectionistGateInput,
): ResurrectionistPodState {
  if (input.hasMet) return "awake";
  if (input.crewCount >= RESURRECTIONIST_WAKE_CREW_COUNT) return "thawing";
  return "sealed";
}

export interface ResurrectionistGateLine {
  state: ResurrectionistPodState;
  label: string;
  copy: string;
}

export const RESURRECTIONIST_GATE_LINES: ReadonlyArray<ResurrectionistGateLine> = [
  {
    state: "sealed",
    label: "The amber pod — sealed",
    copy:
      "There is a pod in your Cryo Bay you have not opened. The canopy reads amber, not cyan. The amber shielding is non-medical — designed for a human sleeper, not a clone. Vox left a note on the lid. The note says: 'Wake me when there are twelve.'",
  },
  {
    state: "thawing",
    label: "The amber pod — thawing",
    copy:
      "The pod's amber has shifted to gold. Internal temperature is rising. Whoever is inside is about to be outside. Twelve crew were the threshold. You crossed it. The canopy will open in approximately three of your hours. You may want to be present when it does.",
  },
  {
    state: "awake",
    label: "The Resurrectionist — awake",
    copy:
      "He is shorter than his note suggested. He has Vox's notes in a cloth roll under his arm. He says he is sorry it took so long, that twelve was the threshold she calibrated, and that he would like to teach you how to continue what she started. Bloodlines. The system is yours when he is ready. He says he is ready.",
  },
];

export function getResurrectionistLine(
  state: ResurrectionistPodState,
): ResurrectionistGateLine {
  return (
    RESURRECTIONIST_GATE_LINES.find((l) => l.state === state) ??
    RESURRECTIONIST_GATE_LINES[0]
  );
}
