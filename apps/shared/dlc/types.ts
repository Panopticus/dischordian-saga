/* ═══════════════════════════════════════════════════════
   DLC CHAPTER SYSTEM — types

   An "episodic DLC chapter" is a self-contained narrative
   beat that extends an existing section (any act, the
   Authority Trial, the Galactic Dance, the Advocate arc,
   the Hierarchy ladder, the Endgame, or the Silence-in-
   Heaven album). One PR per chapter. No spine refactor,
   no gate edits.

   Pure, serialisable types — no functions on the types
   themselves; runtime helpers live in
   `dlcChapterRegistry.ts` + `dlcChapterCompletionGate.ts`.
   ═══════════════════════════════════════════════════════ */

/** A Galactic-Dance faction id. Kept loose as a string here
 *  to avoid a hard import dependency on the questline files;
 *  the registry tests assert the value matches the canonical
 *  faction roster when chapters reference one. */
export type GalacticDanceFactionId = string;

/** Where a DLC chapter inserts itself in the saga's structure.
 *  The discriminator chooses how the chapter is surfaced in
 *  the UI (which menu, which gate to chain on). */
export type DlcParentSection =
  | { kind: "act"; act: 1 | 2 | 3 | 4 | 4.5 | 5 | 6 | 7 }
  | { kind: "authority_trial" }
  | { kind: "galactic_dance"; faction: GalacticDanceFactionId }
  | { kind: "advocate_arc" }
  | { kind: "hierarchy_arc" }
  | { kind: "endgame" }
  | { kind: "epoch_witness"; epoch: number; archetype?: string }
  | { kind: "silence_in_heaven"; trackNumber: number };

/** Discriminated union of prerequisites a chapter can require
 *  before becoming available. AND-combined (every prerequisite
 *  must hold). */
export type DlcPrerequisite =
  | { kind: "flag"; flag: string }
  | { kind: "act_completion"; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: "secret"; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: "dlc_chapter_completion"; chapterId: string }
  | {
      kind: "entitlement";
      key: "foundingAuthor" | "authorsEditionS2" | string;
    };

/** Reward bundle delivered when a chapter completes. All fields
 *  optional — a chapter that's pure narrative ships rewards: {}. */
export interface DlcRewardBundle {
  /** Player XP grant. */
  readonly xp?: number;
  /** Soul-bound dream currency grant. */
  readonly soulBoundDream?: number;
  /** Light-energy contribution to the community pool (§3 of the
   *  Witnessing proposal — same units as slideshow rewards). */
  readonly lightEnergyReward?: number;
  /** Card-definition ids granted to the player on completion. */
  readonly cardIds?: readonly string[];
  /** Loredex entry ids unlocked on completion. */
  readonly loredexEntries?: readonly string[];
  /** Cosmetic ids granted on completion (theme tokens, sprites,
   *  voice-line banks, etc). Strings stay loose at the foundation
   *  layer to avoid coupling to the cosmetics system. */
  readonly cosmeticIds?: readonly string[];
}

/** Speaker on a narration / dialog step. Loose string at the
 *  shared layer so chapters can author for any character without
 *  importing a client-side roster; the renderer is responsible
 *  for resolving the speaker id to a portrait. */
export type DlcStepSpeakerId = string;

/** A choice option offered by a `choice` step. Selecting it
 *  optionally raises a flag (consumed by future steps' visibility
 *  logic or by the chapter's reward derivation). */
export interface DlcStepChoice {
  readonly id: string;
  readonly text: string;
  /** Optional narrative flag set when this choice is selected. */
  readonly setFlag?: string;
}

/** Discriminated union of step kinds a DLC chapter may declare.
 *  Renderable by a future client component without coupling to
 *  the rich client-only `TutorialStep` (which embeds Elara/Human
 *  dialog-wheel semantics that don't apply to every chapter). */
export type DlcStep =
  | {
      readonly kind: "narration";
      readonly id: string;
      readonly speaker: DlcStepSpeakerId;
      readonly text: string;
      readonly subtitle?: string;
    }
  | {
      readonly kind: "choice";
      readonly id: string;
      readonly speaker: DlcStepSpeakerId;
      readonly prompt: string;
      readonly options: readonly DlcStepChoice[];
    }
  | {
      /** Reference to a StoryEncounter id in the TCG-core encounter
       *  registry. The renderer fires the encounter and waits for
       *  the standard win/loss flag before advancing. */
      readonly kind: "encounter_ref";
      readonly id: string;
      readonly encounterId: string;
    }
  | {
      /** Reference to a cinematic id in the cinematics manifest. */
      readonly kind: "cinematic_ref";
      readonly id: string;
      readonly cinematicId: string;
    };

/** Reference to a StoryEncounter id. The full StoryEncounter
 *  shape lives in `apps/shared/tcg-core/story/encounter.ts`. */
export interface DlcStoryEncounterRef {
  readonly id: string;
  readonly encounterId: string;
}

/** A canonical DLC chapter. One per folder under
 *  `apps/shared/dlc/chapters/<id>/index.ts`. */
export interface DlcChapter {
  /** Stable id, e.g. "dlc_advocate_01_sacrum_echo". Snake-case
   *  prefix `dlc_` enforced by the registry test. */
  readonly id: string;
  /** Human-readable title. */
  readonly title: string;
  /** One- or two-sentence pitch. Surfaced on the chapter card. */
  readonly synopsis: string;
  /** Where this chapter inserts itself. */
  readonly parentSection: DlcParentSection;
  /** Ordering hint within the parent section (1-indexed). Two
   *  chapters with the same sequence + parent flag a registry
   *  invariant violation. */
  readonly sequence: number;
  /** AND-combined prerequisites. Empty array means the chapter
   *  is always available. */
  readonly prerequisites: readonly DlcPrerequisite[];
  /** Narrative steps in player order. Renderable via a switch on
   *  step.kind — see DlcStep for the discriminated union. */
  readonly steps: readonly DlcStep[];
  /** Optional TCG encounter references fired at specific steps. */
  readonly encounters?: readonly DlcStoryEncounterRef[];
  /** Optional cinematic id (resolved against the cinematics manifest). */
  readonly cinematicId?: string;
  /** Reward bundle delivered on completion. */
  readonly rewards: DlcRewardBundle;
  /** Narrative flags raised when the chapter completes. The
   *  registry auto-injects `dlc_chapter_<id>_complete` if not
   *  declared. */
  readonly setsFlagsOnComplete: readonly string[];
}

/** Computed status of a chapter for the active player. */
export interface DlcChapterStatus {
  readonly chapterId: string;
  readonly available: boolean;
  readonly alreadyComplete: boolean;
  /** The prerequisites that AREN'T satisfied. Empty when
   *  available is true. */
  readonly missingPrerequisites: readonly DlcPrerequisite[];
}
