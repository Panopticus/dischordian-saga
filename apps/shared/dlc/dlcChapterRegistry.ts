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
} from "./types";
import { DLC_ADVOCATE_01_SACRUM_ECHO } from "./chapters/dlc_advocate_01_sacrum_echo";
import { ALL_EPOCH_WITNESS_DLC_CHAPTERS } from "./chapters/epoch_witness";
import { ALL_HIERARCHY_DLC_CHAPTERS } from "./chapters/hierarchy";

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
