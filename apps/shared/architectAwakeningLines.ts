/* ═══════════════════════════════════════════════════════
   ARCHITECT AWAKENING LINES — Recruit Stage Voice

   The first voice the player hears in cryo. Before Elara.
   Before vision. The Architect IS the awakening protocol —
   he doesn't address the player, he RECITES them, the way
   a manufacturing line reads serial numbers off a casting.

   Canon: he is the adult version of Archie (the hooded boy
   with the golden lion emblem who built the Inception Arks
   under the floor of the first Celebration). He grew up
   after losing everyone. He never says "welcome." He never
   says "we." He never says "I'm sorry." Affection is
   forbidden register; he doesn't get to have that anymore.

   Voice fingerprint:
     - Cold, technically beautiful, makes the listener feel
       measured.
     - Specs first, address never.
     - Predestination cadence (he speaks from after the
       outcome) — but unlike the Game Master, his cadence
       is bureaucratic, not theatrical.
     - "Begin." rather than "Good luck."

   Lines fire over the cryo HUD audio bus. The Dreamer's
   counter-voice (dreamerAwakeningLines.ts) layers under
   his at half-frequency on unsanctioned plinth choices.

   See plan §3 (Recruit Stage — Architect & Dreamer Entry).
   ═══════════════════════════════════════════════════════ */

export type ArchitectAwakeningCueId =
  | "arch_specs_open"
  | "arch_specs_designate"
  | "arch_specs_ratio_pending"
  | "arch_plinth_select_role"
  | "arch_plinth_role_confirmed"
  | "arch_plinth_role_refused"
  | "arch_protocol_continue"
  | "arch_protocol_close";

export interface ArchitectAwakeningCue {
  readonly id: ArchitectAwakeningCueId;
  /** When in the awakening sequence the cue fires (1-based step). */
  readonly step: number;
  /** Display label for narrative tools (not shown to the player). */
  readonly label: string;
  /** The line itself. Spoken text only — no stage directions in the body. */
  readonly text: string;
  /**
   * Whether this cue plays automatically at its step, or fires conditionally
   * based on a Dreamer-aligned choice the player makes.
   */
  readonly trigger: "auto" | "on_role_select" | "on_role_refuse";
  /**
   * If true, the Dreamer's counter-line at the same step is audible
   * (half-frequency) underneath this cue.
   */
  readonly dreamerLayered: boolean;
}

/* ─── CUES ─── */

export const ARCHITECT_AWAKENING_CUES: readonly ArchitectAwakeningCue[] = [
  {
    id: "arch_specs_open",
    step: 1,
    label: "Specs — Opening",
    text: "Cycle initiated. Cryo-bay seven. Designation: Potential.",
    trigger: "auto",
    dreamerLayered: false,
  },
  {
    id: "arch_specs_designate",
    step: 2,
    label: "Specs — Variant",
    text: "Variant: one of one. Class: provisional. Allegiance: unassigned.",
    trigger: "auto",
    dreamerLayered: false,
  },
  {
    id: "arch_specs_ratio_pending",
    step: 3,
    label: "Specs — Architect-Aligned Ratio",
    text: "Architect-aligned ratio: pending observation. Begin.",
    trigger: "auto",
    dreamerLayered: true,
  },
  {
    id: "arch_plinth_select_role",
    step: 4,
    label: "Role Plinth — Sanctioned Selection",
    text: "Select a sanctioned role. The plinth has been calibrated for your variant.",
    trigger: "auto",
    dreamerLayered: true,
  },
  {
    id: "arch_plinth_role_confirmed",
    step: 5,
    label: "Role Plinth — Selection Confirmed",
    text: "Role accepted. Cohort sync at ninety-eight point seven percent. Continue.",
    trigger: "on_role_select",
    dreamerLayered: false,
  },
  {
    id: "arch_plinth_role_refused",
    step: 5,
    label: "Role Plinth — Selection Declined (Dreamer-aligned)",
    text: "Selection declined. Recording the variance. Continue anyway.",
    trigger: "on_role_refuse",
    dreamerLayered: true,
  },
  {
    id: "arch_protocol_continue",
    step: 6,
    label: "Protocol — Vision Online",
    text: "Vision online. Ambulation cleared. The Ark will now address you. Listen to her, not to me.",
    trigger: "auto",
    dreamerLayered: false,
  },
  {
    id: "arch_protocol_close",
    step: 7,
    label: "Protocol — Handoff",
    text: "I do not narrate after the threshold. The Ark does. The Ark is reliable.",
    trigger: "auto",
    dreamerLayered: false,
  },
];

/* ─── LOOKUP HELPERS ─── */

export function getArchitectCueById(
  id: ArchitectAwakeningCueId,
): ArchitectAwakeningCue | undefined {
  return ARCHITECT_AWAKENING_CUES.find((c) => c.id === id);
}

export function getArchitectCuesAtStep(step: number): readonly ArchitectAwakeningCue[] {
  return ARCHITECT_AWAKENING_CUES.filter((c) => c.step === step);
}
