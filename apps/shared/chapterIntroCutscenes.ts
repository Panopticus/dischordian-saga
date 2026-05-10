/* ═══════════════════════════════════════════════════════
   CHAPTER INTRO CUTSCENES — story-mode chapter openers

   Producer 2026-05-10 drop (FIGHT_INTROS_COMPLETE.zip) ships
   21 chapter-opener cinematics — one per scripted Act 2-7
   chapter, named by chapter number. These play BEFORE the
   chapter's first card battle (or its first narrative beat
   if the chapter has no battle gate), distinct from the per-
   fighter intro overlay (`FighterIntroOverlay.tsx`) which
   is text-only and continues to live alongside.

   The mapping below matches the bundle filenames; the chapter
   numbers correspond to the chapter sequence in the Acts 2-7
   structure docs. A chapter slot may be a numbered "BONUS"
   variant (e.g. ch19_nilmorg vs ch19_antiquarian) — both fire
   under the same chapter number, distinguished by `slug`,
   so chapters with multiple openers can pick by world-state.
   ═══════════════════════════════════════════════════════ */

export interface ChapterIntroDef {
  /** Stable id — matches the delivered MP4 basename minus
   *  the `_complete` suffix. */
  id: string;
  /** Chapter number (5..21). May be shared by multiple
   *  intros when the chapter has variant openers. */
  chapter: number;
  /** Disambiguating slug for variant openers (e.g. "watcher",
   *  "nilmorg_BONUS"). Authors set the chosen slug in narrative
   *  state to pick which variant plays. */
  slug: string;
  /** Path under apps/client/public/videos/ — pass through `assetUrl()`. */
  videoRelPath: string;
  /** True for "BONUS" / alternate-timeline variants. The default
   *  variant (the non-BONUS one) is what plays unless narrative
   *  state explicitly opts into the bonus. */
  isBonusVariant: boolean;
}

const VIDEO_DIR = "videos/fight-intros";

const RAW: ReadonlyArray<{ chapter: number; slug: string; bonus?: true }> = [
  { chapter: 5, slug: "watcher" },
  { chapter: 6, slug: "necromancer" },
  { chapter: 7, slug: "meme" },
  { chapter: 8, slug: "collector" },
  { chapter: 9, slug: "kael_recruiter" },
  { chapter: 10, slug: "human" },
  { chapter: 11, slug: "gamemaster_human" },
  { chapter: 11, slug: "gamemaster_robot" },
  { chapter: 12, slug: "collector_rematch" },
  { chapter: 13, slug: "architect" },
  { chapter: 14, slug: "source" },
  { chapter: 15, slug: "jailer" },
  { chapter: 16, slug: "ironlion_rematch" },
  { chapter: 17, slug: "elara_glitched" },
  { chapter: 18, slug: "agent_zero" },
  { chapter: 19, slug: "antiquarian" },
  { chapter: 19, slug: "nilmorg_BONUS", bonus: true },
  { chapter: 20, slug: "conexus_BONUS", bonus: true },
  { chapter: 20, slug: "dreamer" },
  { chapter: 21, slug: "oracle_meme" },
  { chapter: 21, slug: "shadow_tongue_BONUS", bonus: true },
];

export const CHAPTER_INTROS: readonly ChapterIntroDef[] = RAW.map((r) => {
  const ch = String(r.chapter).padStart(2, "0");
  const fileSlug = r.slug; // bundle preserves the BONUS suffix in the dir name
  return {
    id: `ch${ch}_${fileSlug}`,
    chapter: r.chapter,
    slug: r.slug,
    videoRelPath: `${VIDEO_DIR}/ch${ch}_${fileSlug}_complete.mp4`,
    isBonusVariant: Boolean(r.bonus),
  };
});

const BY_ID = new Map<string, ChapterIntroDef>(
  CHAPTER_INTROS.map((d) => [d.id, d]),
);

const BY_CHAPTER = new Map<number, ChapterIntroDef[]>();
for (const def of CHAPTER_INTROS) {
  const existing = BY_CHAPTER.get(def.chapter);
  if (existing) existing.push(def);
  else BY_CHAPTER.set(def.chapter, [def]);
}

/** Resolve a chapter intro by its stable id. */
export function getChapterIntro(id: string): ChapterIntroDef | undefined {
  return BY_ID.get(id);
}

/** All chapter intros for a given chapter number. Returns the
 *  primary (non-bonus) variant first; bonus variants follow.
 *  Empty array if no intros exist for that chapter. */
export function chapterIntrosFor(chapter: number): readonly ChapterIntroDef[] {
  const entries = BY_CHAPTER.get(chapter) ?? [];
  return [...entries].sort(
    (a, b) => Number(a.isBonusVariant) - Number(b.isBonusVariant),
  );
}

/** Pick the canonical opener for a chapter. Returns undefined if
 *  the chapter has no opener registered. When a chapter has
 *  multiple variants, callers should pass `preferSlug` to opt
 *  into a non-default branch (e.g. the BONUS opener). */
export function resolveChapterIntro(
  chapter: number,
  preferSlug?: string,
): ChapterIntroDef | undefined {
  const variants = chapterIntrosFor(chapter);
  if (variants.length === 0) return undefined;
  if (preferSlug) {
    const match = variants.find((v) => v.slug === preferSlug);
    if (match) return match;
  }
  return variants[0]; // primary (non-bonus first by chapterIntrosFor sort)
}

export const CHAPTER_INTRO_TOTAL = CHAPTER_INTROS.length;
