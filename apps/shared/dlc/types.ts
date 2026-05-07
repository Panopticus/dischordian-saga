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

/** Forward declaration for the runtime step type. The actual
 *  shape lives in `apps/client/src/data/narrativeActs.ts`
 *  (TutorialStep). The DLC layer types it as `unknown` so the
 *  type system stays decoupled from React. */
export type DlcTutorialStep = unknown;

/** Forward declaration for the TCG encounter type. The actual
 *  shape lives in `apps/shared/tcg-core/story/chapters.ts`
 *  (StoryEncounter). Same decoupling rationale as steps. */
export type DlcStoryEncounter = unknown;

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
  /** Narrative steps in player order. Typed as
   *  TutorialStep at the runtime layer — see DlcTutorialStep. */
  readonly steps: readonly DlcTutorialStep[];
  /** Optional TCG encounters fired at specific steps. */
  readonly encounters?: readonly DlcStoryEncounter[];
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
