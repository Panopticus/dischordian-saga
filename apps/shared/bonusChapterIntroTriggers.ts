/* ═══════════════════════════════════════════════════════
   BONUS CHAPTER-INTRO TRIGGERS — alternate-timeline variants

   The 2026-05-10 producer drop ships 3 BONUS chapter intros that
   don't correspond to scripted opponents in the Acts 2-7 spine.
   All three are now gated, with writer ratification status surfaced
   per row.

     ch19_nilmorg_BONUS — player has completed the Trade Empire
       arc (Act 5 trade-empire path settled).
       WRITER-REVIEW: gating flag `trade_empire_arc_completed`
       is engineering's best guess; writer ratification needed.

     ch21_shadow_tongue_BONUS — Shadow Tongue emergent event has
       activated server-side. This flag IS canonical
       (`useLivingUniverseSync.ts` mirrors the active set into
       `living_universe_event_<id>_active` flags).

     ch20_conexus_BONUS — Authority alignment is `aligned`
       (player's loop landed on the Authority canon-favorable side
       at Act 7 close). The {@link AuthorityAlignment} enum is
       defined below; the producer flag is
       `authority_alignment_aligned`. WRITER-REVIEW: the
       enum + producer mapping is engineering's best guess;
       writer ratifies and either keeps `aligned` or swaps in a
       different value. The canon-locked deferral entry in
       `apps/shared/livingDeferralCanon.ts` tracks the spec gap.

   Each registered variant fires once per save; the
   BonusChapterIntroRouter idempotents on the standard
   `chapter_intro_<id>_seen` flag.

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

/**
 * Authority alignment — the player's standing with the Authority at
 * Act 7 close. The four values cover the canonical possibilities the
 * writers have hinted at; the producer of this value lives at Act 7
 * resolution time. WRITER-REVIEW: the spec is engineering's best guess;
 * writer may collapse to a different shape (e.g. a 3-axis tuple or a
 * single scalar). The {@link DeferredSurface} in
 * `apps/shared/livingDeferralCanon.ts` tracks the spec gap.
 */
export type AuthorityAlignment =
  | "aligned"
  | "neutral"
  | "opposed"
  | "architect_leaning";

/**
 * The narrative flag the BonusChapterIntroRouter watches for the
 * Conexus BONUS. Set when Act-7 resolution lands the player on the
 * Authority's canon-favorable side.
 */
export const AUTHORITY_ALIGNMENT_ALIGNED_FLAG = "authority_alignment_aligned";

export const BONUS_CHAPTER_INTRO_GATES: readonly BonusChapterIntroGate[] = [
  {
    introId: "ch19_nilmorg_BONUS",
    triggerFlag: "trade_empire_arc_completed",
    minAct: 5,
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
  {
    introId: "ch20_conexus_BONUS",
    // Engineering best-guess gate: fires when Act-7 resolution lands
    // the player on the Authority's canon-favorable side. The flag
    // setter is intentionally absent today (writer ratifies the
    // {@link AuthorityAlignment} enum + setter location). The canon
    // spine entry in apps/shared/livingDeferralCanon.ts records the
    // spec gap; this row prevents the producer MP4 from sitting
    // structurally orphaned once the setter lands.
    triggerFlag: AUTHORITY_ALIGNMENT_ALIGNED_FLAG,
    minAct: 7,
    writerReview: true,
  },
];

/**
 * Surfaces that remain canon-locked deferred even with a gate row
 * present. Kept for backwards-compat with consumers that filter
 * deferred variants by id; the operative deferral registry lives in
 * `apps/shared/livingDeferralCanon.ts`.
 *
 * Empty by design once a writer-ratified spec lands.
 */
export const DEFERRED_BONUS_INTRO_IDS: readonly string[] = [];

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
