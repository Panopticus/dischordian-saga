/* ═══════════════════════════════════════════════════════
   BONUS CHAPTER-INTRO TRIGGERS — alternate-timeline variants

   The 2026-05-10 producer drop ships 3 BONUS chapter intros that
   don't correspond to scripted opponents in the Acts 2-7 spine.
   They fire as alternate-timeline / world-state-conditional
   variants when:

     ch19_nilmorg_BONUS — player has reached the corporate
       prestige tier (Act 5 trade-empire path settled).
       WRITER-REVIEW: gating flag `prestige_corporate_tier` is
       engineering's best guess; writer ratification needed.

     ch20_conexus_BONUS — player has chosen Authority alignment
       (CoNexus is the Authority's cosmic peer).
       WRITER-REVIEW: gating flag `authority_alignment_chosen`
       is engineering's best guess; writer ratification needed.

     ch21_shadow_tongue_BONUS — Shadow Tongue emergent event has
       activated server-side. This flag IS canonical
       (`useLivingUniverseSync.ts` mirrors the active set into
       `living_universe_event_<id>_active` flags).

   Each fires once per save; the BonusChapterIntroRouter
   idempotents on the standard `chapter_intro_<id>_seen` flag.

   Pure resolver pattern mirrors `pickHumanRevealBranchToFire`
   (apps/client/src/hooks/useHumanRevealTrigger.ts).
   ═══════════════════════════════════════════════════════ */

import {
  CHAPTER_INTROS,
  type ChapterIntroDef,
} from "./chapterIntroCutscenes";

export interface BonusChapterIntroGate {
  /** ChapterIntroDef.id of the BONUS variant. */
  introId: string;
  /** Narrative-flag key the BonusChapterIntroRouter watches. */
  triggerFlag: string;
  /** Minimum narrativeAct at which the BONUS becomes eligible. */
  minAct: number;
  /** True when the gating flag name is engineering's best guess
   *  (writer should ratify). False when the flag is canonical. */
  writerReview: boolean;
}

export const BONUS_CHAPTER_INTRO_GATES: readonly BonusChapterIntroGate[] = [
  {
    introId: "ch19_nilmorg_BONUS",
    triggerFlag: "prestige_corporate_tier",
    minAct: 5,
    writerReview: true,
  },
  {
    introId: "ch20_conexus_BONUS",
    triggerFlag: "authority_alignment_chosen",
    minAct: 7,
    writerReview: true,
  },
  {
    introId: "ch21_shadow_tongue_BONUS",
    // Canonical event-active flag emitted by useLivingUniverseSync
    // when the SHADOW_TONGUE_EDIT_EVENT crosses pressure threshold.
    triggerFlag: "living_universe_event_shadow_tongue_edit_active",
    minAct: 7,
    writerReview: false,
  },
];

const INTRO_BY_ID = new Map<string, ChapterIntroDef>(
  CHAPTER_INTROS.map((d) => [d.id, d]),
);

export const bonusChapterIntroSeenFlag = (introId: string): string =>
  `chapter_intro_${introId}_seen`;

export interface BonusChapterIntroDecisionInput {
  narrativeAct: number;
  flags: Readonly<Record<string, unknown>>;
}

/** Pure decision function: should we fire a BONUS chapter-intro
 *  trigger flag now, and if so for which variant? Returns the
 *  ChapterIntroDef + gate info, or null when no fire is warranted
 *  (already seen, gate flag not set, or below minAct).
 *
 *  Iteration order matches BONUS_CHAPTER_INTRO_GATES — if multiple
 *  gates fire simultaneously, the first canonical one wins. */
export function pickBonusChapterIntroToFire(
  input: BonusChapterIntroDecisionInput,
): { def: ChapterIntroDef; gate: BonusChapterIntroGate } | null {
  const { narrativeAct, flags } = input;
  for (const gate of BONUS_CHAPTER_INTRO_GATES) {
    if (narrativeAct < gate.minAct) continue;
    if (flags[gate.triggerFlag] !== true) continue;
    if (flags[bonusChapterIntroSeenFlag(gate.introId)] === true) continue;
    const def = INTRO_BY_ID.get(gate.introId);
    if (!def) continue;
    return { def, gate };
  }
  return null;
}
