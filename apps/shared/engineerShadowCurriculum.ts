/* ═══════════════════════════════════════════════════════
   THE ENGINEER — JOURNAL OF THE SHADOW CURRICULUM

   Per mechronisProfessors.ts, the Mechronis Academy is
   staffed by Architect-programmed teaching copies. The
   Engineer's copy is "Artificer Vent" (prof_engineer); the
   real Engineer (LOREDEX entity_18) is canonically
   "unaccounted for."

   He is unaccounted for because he hid himself in his own
   workshop — and left a journal. The journal predates
   Vent's tenure; Vent walks past it every shift without
   recognising the handwriting. Twelve pages, four chapters,
   bound in leather salvaged from an Inception Ark crate.
   The lock is the way you breathe when you concentrate.

   Mechanically, this module ships the Distinction-tier
   payoff the daily lesson grade ladder always implied but
   never delivered: every time the player earns a
   Distinction grade in any Mechronis lesson, they discover
   one **Journal Page** of the Engineer's shadow curriculum.
   Each chapter (3 pages) unlocks a Signature Technique the
   player can equip in card matches.

   The journal voice is the Engineer's, written — not
   spoken. Per his canon: terse, second-person addressed to
   "the next reader," never about himself, signs nothing.
   Each page is dated with an Entry mark in his own
   archaic numbering rather than a calendar — he is writing
   to a future the calendar does not reach.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

/* ─── JOURNAL PAGES ─── */

/**
 * A Journal Page is the unit currency: one Distinction grade =
 * one page recovered. Pages are ordered; the Nth Distinction
 * recovers the Nth page. Capped at TOTAL_JOURNAL_PAGES.
 */
export const PAGES_PER_CHAPTER = 3;
export const TOTAL_JOURNAL_PAGES = 12; // 4 chapters × 3 pages
export const TOTAL_CHAPTERS = TOTAL_JOURNAL_PAGES / PAGES_PER_CHAPTER;

/** Backwards-compat alias: the constant was previously named
 *  TOTAL_CIPHER_PAGES. Kept exported as an alias to prevent
 *  silent breakage in any in-flight reads of the older name. */
export const TOTAL_CIPHER_PAGES = TOTAL_JOURNAL_PAGES;

export interface JournalPage {
  /** Page number (1..12). */
  pageNumber: number;
  /** Which chapter this page belongs to (1..4). */
  chapterNumber: number;
  /** Stable id; format: "engineer.journal.<n>". */
  id: string;
  /** The Engineer's archaic Entry mark for the page (e.g. "Entry the First"). */
  entryMark: string;
  /** The journal entry's text — written, not spoken. */
  text: string;
}

/** Backwards-compat alias for downstream consumers that read
 *  CipherPage as the type name. */
export type CipherPage = JournalPage;

const ENTRY_MARKS: Record<number, string> = {
  1:  "Entry the First",
  2:  "Entry the Second",
  3:  "Entry the Third",
  4:  "Entry the Fourth",
  5:  "Entry the Fifth",
  6:  "Entry the Sixth",
  7:  "Entry the Seventh",
  8:  "Entry the Eighth",
  9:  "Entry the Ninth",
  10: "Entry the Tenth",
  11: "Entry the Eleventh",
  12: "Entry the Twelfth, the Last",
};

/**
 * The journal text. Each entry is written in the Engineer's hand:
 * second-person addressed to "the next reader", never first-person
 * about himself, no signature, no date. Lines are short. The
 * margin notes are deliberate.
 */
const JOURNAL_TEXT: Record<number, string> = {
  1:  "If the lesson felt easy, you have read it correctly. Vent grades as the Architect would. The grading is the test. The lesson is the rehearsal.",
  2:  "The bench in the corner of the workshop has a false drawer. The drawer is not for you yet. It is for whoever you become at Entry the Sixth.",
  3:  "Tools the Architect approved: forty-one. Tools left behind for the next reader: three. The third is in plain view. The next reader has already touched it.",
  4:  "The power source assumed to be the reactor is not the reactor. It is the loneliness of the people who built the reactor. The math is simpler than that sentence makes it sound.",
  5:  "Vent will declare a weapon finished. The declaration is incorrect. A weapon is finished when the person holding it puts it down. The next reader does not put it down.",
  6:  "The Forge Task is rigged. Cruel solutions score 3x. The 3x is not for the next reader. The 1x is. Ask, when nobody is grading, why the multiplier exists.",
  7:  "If the lesson asks the next reader to choose between two students, both die. If the lesson does not ask, both live. The prompt is the trap.",
  8:  "Half of what was built here was for someone the writer was not permitted to name. The other half was for the person who would find this page. The proportion is exactly half. The writer measured.",
  9:  "There is a frequency only one device answers to. If the next reader has heard a hum and could not place it, the next reader is within range. Do not speak inside the range.",
  10: "The Inception Ark was meant to be one ship. It is twelve. The other eleven are in worse shape than this one. None of them have the next reader.",
  11: "Vent's classroom door changes by season. The lock does not. The lock belongs to the writer. The key is the way the next reader breathes when concentrating.",
  12: "The journal closes here. The writer is not unaccounted for. The writer was waiting for the next reader to finish reading. The next reader has finished. The writer will be where the next reader was already going.",
};

/** Build a journal page object for a given page number (1..12). */
export function getJournalPage(pageNumber: number): JournalPage | null {
  if (pageNumber < 1 || pageNumber > TOTAL_JOURNAL_PAGES) return null;
  return {
    pageNumber,
    chapterNumber: chapterFromPage(pageNumber),
    id: `engineer.journal.${pageNumber}`,
    entryMark: ENTRY_MARKS[pageNumber],
    text: JOURNAL_TEXT[pageNumber],
  };
}

/** Backwards-compat alias. */
export const getCipherPage = getJournalPage;

/** Page n → chapter (1..4). Pages 1-3 chapter 1, 4-6 chapter 2, etc. */
export function chapterFromPage(pageNumber: number): number {
  return Math.ceil(pageNumber / PAGES_PER_CHAPTER);
}

/* ─── CHAPTERS / SIGNATURE TECHNIQUES ─── */

/**
 * Each chapter is unlocked by recovering all PAGES_PER_CHAPTER
 * pages it contains. Completing a chapter awards a Signature
 * Technique — a one-slot off-deck modifier the player can equip
 * in card matches. The four techniques are themed to the four
 * sections of the journal: Pre-Loaded Hammer (chapter on workshop
 * preparation), Reactor Bypass (chapter on power & loneliness),
 * Forge Hand (chapter on the rigged Forge Task), Last Page
 * (the closing chapter, which the journal addresses to the
 * "next reader").
 */
export interface SignatureTechnique {
  id: string;
  chapterNumber: number;
  name: string;
  /** Short description for tooltips. */
  description: string;
  /** Effect-keyword the engine can branch on. Intentionally a
   *  string union (not enum) so future techniques can extend
   *  without forcing a migration. */
  effectKeyword: SignatureEffect;
  /** Numeric magnitude tied to the keyword (interpreted by engine). */
  magnitude: number;
}

export type SignatureEffect =
  | "first_strike_advantage"   // ch.1 — early-turn bonus damage
  | "shield_overcharge"        // ch.2 — durability buff once per match
  | "bench_swap_grace"         // ch.3 — free swap once per match
  | "final_chapter_revelation"; // ch.4 — match-ending narrative + reward

const SIGNATURE_TECHNIQUES: ReadonlyArray<SignatureTechnique> = [
  {
    id: "engineer.signature.1",
    chapterNumber: 1,
    name: "Pre-Loaded Hammer",
    description:
      "Your first card played each match deals +2 damage. Entry the Third anticipated the next reader hitting first.",
    effectKeyword: "first_strike_advantage",
    magnitude: 2,
  },
  {
    id: "engineer.signature.2",
    chapterNumber: 2,
    name: "Reactor Bypass",
    description:
      "Once per match, when a unit would die, it survives at 1 HP. The bypass is in Entry the Fourth's margin, not yours.",
    effectKeyword: "shield_overcharge",
    magnitude: 1,
  },
  {
    id: "engineer.signature.3",
    chapterNumber: 3,
    name: "Forge Hand",
    description:
      "Once per match, swap a card from your hand for a card from the bench at no resource cost.",
    effectKeyword: "bench_swap_grace",
    magnitude: 1,
  },
  {
    id: "engineer.signature.4",
    chapterNumber: 4,
    name: "Last Page",
    description:
      "When you win the match, draw a Lore Fragment. When you lose, the journal notes the loss in a hand that is not yours. The next reader was always going to be read.",
    effectKeyword: "final_chapter_revelation",
    magnitude: 1,
  },
];

export function getSignatureTechnique(chapterNumber: number): SignatureTechnique | null {
  return SIGNATURE_TECHNIQUES.find(t => t.chapterNumber === chapterNumber) ?? null;
}

export function allSignatureTechniques(): ReadonlyArray<SignatureTechnique> {
  return SIGNATURE_TECHNIQUES;
}

/* ─── PROGRESS / UNLOCK FLOW ─── */

export interface CurriculumProgress {
  /** Pages the player has unlocked, in order (1..12). */
  pagesUnlocked: number[];
  /** Chapters fully completed (1..4). */
  chaptersCompleted: number[];
  /** The currently equipped signature technique chapter, or null. */
  equippedChapter: number | null;
}

export function emptyCurriculumProgress(): CurriculumProgress {
  return {
    pagesUnlocked: [],
    chaptersCompleted: [],
    equippedChapter: null,
  };
}

/**
 * Recover the next journal page given the player has just earned a
 * Distinction. Returns the new progress and the page recovered (so
 * the UI can render the Engineer's entry). If the player has
 * already recovered all 12 pages, returns null for the page and
 * leaves progress unchanged.
 *
 * Exported as both `recoverJournalPage` and the legacy alias
 * `awardCipherPage` so older consumers keep working.
 *
 * Idempotency: this function is the single increment path. The
 * caller should call it exactly once per Distinction event; the
 * function itself does not guard against being called twice for
 * the same lesson.
 */
export function recoverJournalPage(
  progress: CurriculumProgress,
): { progress: CurriculumProgress; page: CipherPage | null; chapterUnlocked: number | null } {
  if (progress.pagesUnlocked.length >= TOTAL_CIPHER_PAGES) {
    return { progress, page: null, chapterUnlocked: null };
  }
  const nextPageNumber = progress.pagesUnlocked.length + 1;
  const page = getCipherPage(nextPageNumber);
  const pagesUnlocked = [...progress.pagesUnlocked, nextPageNumber];

  // Chapter unlock check — runs after each page unlock.
  const chapter = chapterFromPage(nextPageNumber);
  const chapterPages = pagesUnlocked.filter(p => chapterFromPage(p) === chapter);
  let chapterUnlocked: number | null = null;
  let chaptersCompleted = progress.chaptersCompleted;
  if (
    chapterPages.length === PAGES_PER_CHAPTER &&
    !progress.chaptersCompleted.includes(chapter)
  ) {
    chaptersCompleted = [...progress.chaptersCompleted, chapter];
    chapterUnlocked = chapter;
  }

  return {
    progress: { ...progress, pagesUnlocked, chaptersCompleted },
    page,
    chapterUnlocked,
  };
}

/**
 * Equip a signature technique chapter. The player can swap freely
 * between unlocked chapters; only one is active at a time.
 * Returns updated progress, or the same progress with an error
 * code if the chapter isn't yet unlocked.
 */
export function equipSignature(
  progress: CurriculumProgress,
  chapterNumber: number | null,
): { progress: CurriculumProgress; ok: boolean; reason?: "chapter_locked" } {
  if (chapterNumber === null) {
    return { progress: { ...progress, equippedChapter: null }, ok: true };
  }
  if (!progress.chaptersCompleted.includes(chapterNumber)) {
    return { progress, ok: false, reason: "chapter_locked" };
  }
  return { progress: { ...progress, equippedChapter: chapterNumber }, ok: true };
}

/**
 * Resolve the currently equipped signature technique, or null. Card
 * match code can read this once at match start to apply the modifier.
 */
export function resolveEquippedSignature(
  progress: CurriculumProgress,
): SignatureTechnique | null {
  if (progress.equippedChapter === null) return null;
  return getSignatureTechnique(progress.equippedChapter);
}

/* ─── BACKWARDS-COMPAT ALIASES ─── */

/** Legacy name for recoverJournalPage; preserved for any in-flight
 *  consumers that imported it before the journal rename. */
export const awardCipherPage = recoverJournalPage;
