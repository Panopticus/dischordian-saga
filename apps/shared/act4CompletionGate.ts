/* ═══════════════════════════════════════════════════════
   ACT 4 COMPLETION GATE — §9 "The Prisoner / The Revelation"

   Three conditions must all hold (AND narrativeAct >= 4) for
   Act 4 to complete:

     1. Opening cinematic played:
        `slideshow_act_4_revelation_intro_complete`

     2. A path chosen in Act 3 must have resolved. Exactly ONE
        of the three Act-1 path flags (from the Human's §3.1
        disclosure branch) drives Act 4's narrative surface:
          - act1_path_A          (Willing Disclosure)
          - act3_partial_share   (Discovery)
          - act3_full_secret     (Betrayal)
        If none is raised, Act 4's branching machine cannot pick
        a scene — the gate stays closed.

     3. At least one of the four Prisoner chapters cleared via
        the Collectors Arena story mode (ACT_4_PRISONER_CHAPTERS
        in actsFourFiveShells.ts). The canon chapters are:
          - act4_prisoner_cell_complete        (The Cell)
          - act4_prisoner_extraction_complete  (The Extraction)
          - act4_prisoner_warlord_complete     (Warlord Rematch)
          - act4_prisoner_oracle_complete      (White Oracle)
        Clearing ANY one of these advances Act 4; the full set
        is satisfying but not required for the gate.

   When all three conditions are met the hook fires
   `act_4_complete` + `act_4_5_started` + `act_5_started`,
   and advances `narrativeAct` to 5. The 4.5 start flag is a
   SIBLING trigger — Dead Man's Circuit content is optional
   and doesn't block Act 5.

   Mirror of apps/shared/act3CompletionGate.ts.
   ═══════════════════════════════════════════════════════ */

/** The four Act-1 path flags that Act 4's branching narrative
 *  keys off of. Exactly ONE should be raised in a canonical
 *  playthrough; we allow the OR for save compatibility. */
export const ACT_4_PATH_FLAGS = [
  "act1_path_A",
  "act3_partial_share",
  "act3_full_secret",
] as const;
export type Act4PathFlag = (typeof ACT_4_PATH_FLAGS)[number];

/** Per-chapter completion flags from ACT_4_PRISONER_CHAPTERS. */
export const ACT_4_PRISONER_CHAPTER_FLAGS = [
  "act4_prisoner_cell_complete",
  "act4_prisoner_extraction_complete",
  "act4_prisoner_warlord_complete",
  "act4_prisoner_oracle_complete",
] as const;
export type Act4PrisonerChapterFlag =
  (typeof ACT_4_PRISONER_CHAPTER_FLAGS)[number];

export type Act4CompletionRequiredFlag =
  "slideshow_act_4_revelation_intro_complete";

export const ACT_4_COMPLETION_REQUIRED_FLAGS: readonly Act4CompletionRequiredFlag[] = [
  "slideshow_act_4_revelation_intro_complete",
] as const;

export interface Act4CompletionInput {
  narrativeAct: number | undefined;
  flags: Record<string, unknown> | undefined;
}

export interface Act4CompletionStatus {
  alreadyComplete: boolean;
  allConditionsMet: boolean;
  readyToFire: boolean;
  requiredFlagStatus: Record<Act4CompletionRequiredFlag, boolean>;
  /** Which Act-1 path flag is active (first found, canonical order). */
  activePathFlag: Act4PathFlag | null;
  /** Which Prisoner chapters have been cleared. */
  chaptersCleared: Act4PrisonerChapterFlag[];
  /** The first chapter flag raised, or null. */
  primaryChapter: Act4PrisonerChapterFlag | null;
  chaptersClearedCount: number;
  requiredMet: number;
}

/** Pure evaluator. */
export function deriveAct4CompletionStatus(
  input: Act4CompletionInput,
): Act4CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_4_complete);
  const inAct4 = (input.narrativeAct ?? 0) >= 4;

  const requiredFlagStatus = {
    slideshow_act_4_revelation_intro_complete: Boolean(
      flags.slideshow_act_4_revelation_intro_complete,
    ),
  } as Record<Act4CompletionRequiredFlag, boolean>;
  const requiredMet = ACT_4_COMPLETION_REQUIRED_FLAGS.reduce(
    (n, f) => n + (requiredFlagStatus[f] ? 1 : 0),
    0,
  );
  const allRequiredMet = requiredMet === ACT_4_COMPLETION_REQUIRED_FLAGS.length;

  const activePathFlag =
    ACT_4_PATH_FLAGS.find((f) => Boolean(flags[f])) ?? null;
  const pathPicked = activePathFlag !== null;

  const chaptersCleared = ACT_4_PRISONER_CHAPTER_FLAGS.filter((f) =>
    Boolean(flags[f]),
  );
  const primaryChapter = chaptersCleared[0] ?? null;
  const anyChapterCleared = chaptersCleared.length > 0;

  const allConditionsMet = allRequiredMet && pathPicked && anyChapterCleared;
  const readyToFire = inAct4 && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    activePathFlag,
    chaptersCleared,
    primaryChapter,
    chaptersClearedCount: chaptersCleared.length,
    requiredMet,
  };
}

/** Shorthand used by Hub panels. */
export function isAct4Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_4_complete);
}
