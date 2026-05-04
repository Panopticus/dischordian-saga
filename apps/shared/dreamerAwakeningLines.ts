/* ═══════════════════════════════════════════════════════
   DREAMER AWAKENING LINES — Recruit Stage Counter-Voice

   The Dreamer is the Architect's split consciousness — the
   part of Archie that stayed asleep at the school he could
   not save. She layers underneath his cryo-bay narration at
   half-frequency. Players who never make an unsanctioned
   choice never hear her clearly. Players who refuse a
   plinth, ask a forbidden question, or touch the wrong
   panel pull her up to audible.

   Canon: she is the 1st Ne-Yon, split consciousness with
   the Architect (livingUniverseEvents.ts — "your love has
   woken her"). Currently surfaced only as an emergent
   community event; this module surfaces her as the
   recruit-stage counter-voice she has always been.

   Voice fingerprint:
     - Drowsy, kind, half-hummed.
     - Brightens the instant she catches the player listening.
     - Does NOT teach. Does NOT instruct. She is a feeling
       in the room, not a guide.
     - Forbidden register: wise. She is not a guide; she is
       the boy you were.
     - Sometimes a phrase, sometimes a single word, sometimes
       a hum. The lulled register is the point.

   See plan §3 (Recruit Stage — Architect & Dreamer Entry).
   ═══════════════════════════════════════════════════════ */

export type DreamerAwakeningCueId =
  | "dream_hum_under_specs"
  | "dream_first_word"
  | "dream_wake_gently"
  | "dream_plinth_unsanctioned"
  | "dream_plinth_question"
  | "dream_plinth_touch"
  | "dream_handoff_to_elara"
  | "dream_post_recording_zero";

export interface DreamerAwakeningCue {
  readonly id: DreamerAwakeningCueId;
  /** Architect step this cue layers under (matches architectAwakeningLines.step). */
  readonly underStep: number;
  /** Display label for narrative tools. */
  readonly label: string;
  /** Spoken text. Empty string = pure hum (audio-only cue). */
  readonly text: string;
  /**
   * Audibility band:
   *   "ambient"     — under-volume, almost subliminal; default
   *   "audible"     — pulled to the foreground by player action
   *   "unmistakable"— clearly her voice; reserved for the very last cue
   */
  readonly band: "ambient" | "audible" | "unmistakable";
  /**
   * What player action surfaces this cue to audible (if any).
   * "none" = always ambient at this step.
   */
  readonly surfacedBy:
    | "none"
    | "refuse_role"
    | "ask_question"
    | "touch_panel"
    | "post_recording_zero";
}

/* ─── CUES ─── */

export const DREAMER_AWAKENING_CUES: readonly DreamerAwakeningCue[] = [
  {
    id: "dream_hum_under_specs",
    underStep: 3,
    label: "Hum — under Architect specs",
    text: "",
    band: "ambient",
    surfacedBy: "none",
  },
  {
    id: "dream_first_word",
    underStep: 3,
    label: "First word — barely",
    text: "…hello.",
    band: "ambient",
    surfacedBy: "none",
  },
  {
    id: "dream_wake_gently",
    underStep: 4,
    label: "The line — wake gently",
    text: "…wake gently. That part wasn't in the manual.",
    band: "audible",
    surfacedBy: "refuse_role",
  },
  {
    id: "dream_plinth_unsanctioned",
    underStep: 5,
    label: "After unsanctioned plinth choice",
    text: "Good. He logs the variance. I keep it.",
    band: "audible",
    surfacedBy: "refuse_role",
  },
  {
    id: "dream_plinth_question",
    underStep: 4,
    label: "When player asks a forbidden question",
    text: "He won't answer that. I will, eventually. Not yet.",
    band: "audible",
    surfacedBy: "ask_question",
  },
  {
    id: "dream_plinth_touch",
    underStep: 4,
    label: "When player touches the wrong panel",
    text: "That one was mine. Once. Hello, you.",
    band: "audible",
    surfacedBy: "touch_panel",
  },
  {
    id: "dream_handoff_to_elara",
    underStep: 6,
    label: "Under Elara handoff",
    text: "She's good. Listen to her. I'll be here.",
    band: "ambient",
    surfacedBy: "none",
  },
  {
    id: "dream_post_recording_zero",
    underStep: 7,
    label: "After Recording 0 — first unmistakable line",
    text: "He used to call me by my name. He still does, when no one's watching.",
    band: "unmistakable",
    surfacedBy: "post_recording_zero",
  },
];

/* ─── LOOKUP HELPERS ─── */

export function getDreamerCueById(
  id: DreamerAwakeningCueId,
): DreamerAwakeningCue | undefined {
  return DREAMER_AWAKENING_CUES.find((c) => c.id === id);
}

export function getDreamerCuesUnderStep(step: number): readonly DreamerAwakeningCue[] {
  return DREAMER_AWAKENING_CUES.filter((c) => c.underStep === step);
}

export function getDreamerCuesSurfacedBy(
  surface: DreamerAwakeningCue["surfacedBy"],
): readonly DreamerAwakeningCue[] {
  return DREAMER_AWAKENING_CUES.filter((c) => c.surfacedBy === surface);
}
