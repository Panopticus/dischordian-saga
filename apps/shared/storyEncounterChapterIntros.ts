/* ═══════════════════════════════════════════════════════
   STORY-ENCOUNTER → CHAPTER-INTRO RESOLVER

   Bridges the bible's saga-wide chapter numbering (chapters 5-21
   in `docs/production/NANO_BANANA_VEO_FULL_PROMPT_BOOK.md §3`)
   to the engine's per-Act chapterIds + opponentIds. The bible
   describes each intro by character + scene; the canonical
   chapter/opponent records in the engine match those characters
   1:1, so the mapping is direct (and verified one-by-one against
   the bible's NB2 START frame descriptions).

   Two flavors:
     - StoryModePage picks `StoryEncounter` records (chapter mode)
     - Act1CardLadderPage picks `Act1Opponent` records (cycle mode)

   Each surface has its own hook into this resolver. Adding a new
   mapping is a one-line append; the parity test ensures every
   mapped key resolves to a real ChapterIntroDef.

   IMPORTANT — what's deliberately UNMAPPED:
   - Saga chapters 6 (Necromancer), 12 (Collector rematch),
     14 (Source), 15 (Jailer), 16 (Iron Lion rematch),
     17 (Elara glitched), 20 (Dreamer), 21 (Oracle/Meme)
     have no engine-side equivalent today (Acts 2-7 chapter
     pages haven't shipped, or the bible character predates
     the canonical opponent record). Their MP4s sit on CDN
     and the registry knows them; only the consumer-site
     bridge is missing. Add a row below the moment the
     consumer page lands.
   - The 3 BONUS variants (nilmorg, conexus, shadow_tongue)
     are alternate-timeline branches the bible doesn't cover
     in §3; producer/writer needs to pick the gating flag
     before they can be wired.
   ═══════════════════════════════════════════════════════ */

import {
  CHAPTER_INTROS,
  type ChapterIntroDef,
} from "./chapterIntroCutscenes";

/** Bible-confirmed: engine chapterId → producer chapter-intro id.
 *  See section refs in NANO_BANANA_VEO_FULL_PROMPT_BOOK.md. */
const CHAPTER_ID_TO_INTRO_ID: Readonly<Record<string, string>> = {
  // §3.15 Chapter 19 — The Antiquarian. Engine: ch4 "The Red Death"
  // (boss_faction: antiquarian). The bible's red-death pocket-dimension
  // tableau matches the chapter description.
  ch4: "ch19_antiquarian",
  // §3.6 Chapter 10 — The Human (Detective phase). Engine: ch8
  // "The Detective" — description literally reads "The Human — the
  // only non-augmented fighter in the Arena."
  ch8: "ch10_human",
  // §3.9 Chapter 13 — The Architect (final form). Engine: ch12
  // "The Architect's Design" (boss_faction: architect).
  ch12: "ch13_architect",
  // §3.7 Chapter 11 — The Game Master (cyborg). Bible specifies
  // "render BOTH variants" (human + robot); we play the human
  // variant by default. The robot variant ships staged at
  // ch11_gamemaster_robot for any consumer that wants to pick it
  // explicitly via the resolver's optional override.
  ch_game_master: "ch11_gamemaster_human",
};

/** Bible-confirmed: engine Act 1 cycle opponentId → producer chapter-intro id.
 *  Cycle opponents (Act1Opponent records) are loaded by Act1CardLadderPage,
 *  not StoryModePage; they need their own hook. */
const OPPONENT_ID_TO_INTRO_ID: Readonly<Record<string, string>> = {
  // §3.3 Chapter 7 — The Meme. Engine: minnie_meme (Cycle A).
  minnie_meme: "ch07_meme",
  // §3.4 Chapter 8 — The Collector. Engine: corey_collector (Cycle A).
  corey_collector: "ch08_collector",
  // §3.1 Chapter 5 — The Watcher. Engine: kanshi_sha_watcher (Cycle A).
  kanshi_sha_watcher: "ch05_watcher",
  // §3.5 Chapter 9 — Kael (Recruiter). Engine: young_kael (Cycle B).
  young_kael: "ch09_kael_recruiter",
  // §3.14 Chapter 18 — Agent Zero. Engine: young_agent_zero (Cycle B).
  young_agent_zero: "ch18_agent_zero",
};

const INTRO_BY_ID = new Map<string, ChapterIntroDef>(
  CHAPTER_INTROS.map((d) => [d.id, d]),
);

function lookupIntro(introId: string | undefined): ChapterIntroDef | null {
  if (!introId) return null;
  return INTRO_BY_ID.get(introId) ?? null;
}

/** Resolve the chapter intro to fire when a StoryEncounter is loaded.
 *  Returns null when the engine chapterId has no bible-confirmed
 *  intro mapping (so the caller skips silently — no wrong-content
 *  fires). */
export function resolveChapterIntroForChapter(
  chapterId: string,
): ChapterIntroDef | null {
  return lookupIntro(CHAPTER_ID_TO_INTRO_ID[chapterId]);
}

/** Resolve the chapter intro to fire when an Act1Opponent (cycle)
 *  is engaged. Returns null when the opponent id has no
 *  bible-confirmed intro mapping. */
export function resolveChapterIntroForOpponent(
  opponentId: string,
): ChapterIntroDef | null {
  return lookupIntro(OPPONENT_ID_TO_INTRO_ID[opponentId]);
}

/** Exposed for tests + diagnostics — keeps the mapping tables
 *  inspectable without exporting them as mutable state. */
export const STORY_CHAPTER_INTRO_MAPPINGS = {
  byChapterId: { ...CHAPTER_ID_TO_INTRO_ID },
  byOpponentId: { ...OPPONENT_ID_TO_INTRO_ID },
} as const;
