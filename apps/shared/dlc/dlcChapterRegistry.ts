/* ═══════════════════════════════════════════════════════
   DLC CHAPTER REGISTRY

   Canonical list of every DLC chapter the game knows about.
   Adding a chapter is a two-line edit to this file: import
   from `./chapters/<id>/index.ts` + spread into the array.

   Wave 2 ships the foundation with an empty registry — the
   shape, gate, and router all exist but no chapters are
   registered yet. Wave 3 onwards lands content.
   ═══════════════════════════════════════════════════════ */

import type {
  DlcChapter,
  DlcParentSection,
  DlcStep,
} from "./types";
import { DLC_ADVOCATE_01_SACRUM_ECHO } from "./chapters/dlc_advocate_01_sacrum_echo";
import { ALL_EPOCH_WITNESS_DLC_CHAPTERS } from "./chapters/epoch_witness";
import { ALL_HIERARCHY_DLC_CHAPTERS } from "./chapters/hierarchy";
import { ALL_BREEDING_DLC_CHAPTERS } from "./chapters/breeding";
// Year-1 + early-Year-2 quarterly mini-DLCs. Each carries a
// producer-delivered intro cinematic at step 0 (registered in
// apps/shared/expansionArt/cinematicsManifest.ts under the
// y1q*/y2q1 ids); subsequent steps are narration/choice content.
import { DLC_Y1Q1_FIRST_CHARTER } from "./chapters/dlc_y1q1_first_charter";
import { DLC_Y1Q2_PALE_INHERITANCE } from "./chapters/dlc_y1q2_pale_inheritance";
import { DLC_Y1Q3_CURRICULUM_CRISIS } from "./chapters/dlc_y1q3_curriculum_crisis";
import { DLC_Y1Q4_WITNESS_PLAZA } from "./chapters/dlc_y1q4_witness_plaza";
import { DLC_Y2Q1_CHARTER_SCHISM } from "./chapters/dlc_y2q1_charter_schism";

/** Single source of truth for every DLC chapter. Frozen so a
 *  caller can't accidentally mutate the registry.
 *
 *  Adding a chapter:
 *    1. Author the folder under `./chapters/<id>/`
 *    2. Import the chapter constant here
 *    3. Spread it into the array below
 *    4. Run pnpm test apps/shared/dlc — the registry tests will
 *       fail loudly on duplicate ids, sequence collisions, or a
 *       missing canonical completion flag.
 *
 *  Epoch Witness votes (Insurgency / Revelation / Fall) are
 *  derived from the existing vote payloads in
 *  `epochWitnessVotesLate.ts` via `buildDlcChapterFromVote()`
 *  so adding a new vote there auto-registers a DLC chapter.
 *
 *  Hierarchy ladder (5 chapters: Xeth'Raal → Taskmaster → Syl'Vex
 *  → Mol'Garath → Yog-Nathal teaser) chains strictly in lore
 *  order via dlc_chapter_completion prerequisites. */
export const ALL_DLC_CHAPTERS: readonly DlcChapter[] = Object.freeze([
  DLC_ADVOCATE_01_SACRUM_ECHO,
  ...ALL_EPOCH_WITNESS_DLC_CHAPTERS,
  ...ALL_HIERARCHY_DLC_CHAPTERS,
  ...ALL_BREEDING_DLC_CHAPTERS,
  // Y1Q–Y2Q1 (5 chapters; producer videos delivered + wired via
  // cinematic_ref step at start of each chapter).
  DLC_Y1Q1_FIRST_CHARTER,
  DLC_Y1Q2_PALE_INHERITANCE,
  DLC_Y1Q3_CURRICULUM_CRISIS,
  DLC_Y1Q4_WITNESS_PLAZA,
  DLC_Y2Q1_CHARTER_SCHISM,
] as DlcChapter[]);

/* ─── Lookup helpers ─── */

/** Lookup a chapter by id. Returns undefined for unknown ids. */
export function getDlcChapter(id: string): DlcChapter | undefined {
  return ALL_DLC_CHAPTERS.find((c) => c.id === id);
}

/** Predicate: do two parent sections refer to the same surface? */
export function sameParentSection(
  a: DlcParentSection,
  b: DlcParentSection,
): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "act":
      return a.act === (b as { act: number }).act;
    case "galactic_dance":
      return a.faction === (b as { faction: string }).faction;
    case "epoch_witness":
      return (
        a.epoch === (b as { epoch: string }).epoch &&
        a.archetype === (b as { archetype?: string }).archetype
      );
    case "silence_in_heaven":
      return (
        a.trackNumber === (b as { trackNumber: number }).trackNumber
      );
    case "breeding_program":
      return a.tier === (b as { tier: string }).tier;
    case "authority_trial":
    case "advocate_arc":
    case "hierarchy_arc":
    case "endgame":
      return true;
  }
}

/** Chapters whose parentSection matches `section`, ordered by
 *  declared sequence. */
export function getDlcChaptersForSection(
  section: DlcParentSection,
): DlcChapter[] {
  return ALL_DLC_CHAPTERS
    .filter((c) => sameParentSection(c.parentSection, section))
    .slice()
    .sort((a, b) => a.sequence - b.sequence);
}

/** Stable `dlc_chapter_<id>_complete` flag for a chapter id.
 *  The registry auto-injects this onto every chapter (see
 *  registry test) so the unlock service + completion gate can
 *  rely on its presence. */
export function dlcChapterCompletionFlag(chapterId: string): string {
  return `dlc_chapter_${chapterId}_complete`;
}

/** True when a step's reactive-visibility gate is satisfied by the
 *  player's current narrativeFlags. A step with neither gate is
 *  always visible; `requiresFlag` demands presence, `requiresAbsentFlag`
 *  demands absence, and both may be combined (AND). */
export function isDlcStepVisible(
  step: DlcStep,
  flags: Readonly<Record<string, unknown>> | null | undefined,
): boolean {
  if (step.kind !== "narration") return true;
  const has = (f: string) => Boolean(flags?.[f]);
  if (step.requiresFlag && !has(step.requiresFlag)) return false;
  if (step.requiresAbsentFlag && has(step.requiresAbsentFlag)) return false;
  return true;
}

/** The chapter's steps filtered to those visible under the player's
 *  current flags. This is what the renderer walks — an earlier
 *  choice's setFlag thereby branches which aftermath narration the
 *  player reads. Non-narration steps (choices, encounters, cinematics)
 *  are never gated and always pass through. */
export function visibleDlcChapterSteps(
  chapter: DlcChapter,
  flags: Readonly<Record<string, unknown>> | null | undefined,
): readonly DlcStep[] {
  return chapter.steps.filter((s) => isDlcStepVisible(s, flags));
}
