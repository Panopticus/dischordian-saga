/* ═══════════════════════════════════════════════════════
   PROPHECY ACHIEVEMENTS — the Witness ladder

   Six tiers earned from prophecy completions. Predicates
   over the player's completion sets; granted idempotently
   by apps/server/services/prophecyAchievements.ts after every
   markProphecyCompleted call.

   Tiers:
     1. Marquee full-watch — per-dream reward (handled inline).
     2. Whisper / Static full-watch (in Index) — per-vision.
     3. Album Witness — all marquees in one album, full.
     4. Album Film Witness — watched the album end-to-end as
        a continuous film.
     5. Album Archivist — all marquees + whispers + statics
        for an album, all full-watched.
     6. Full Tapestry — every marquee completed full, across
        every album.
     7. Antiquarian's Codex — Full Tapestry + every Whisper +
        every Static + every Album Film viewed (Act 7+).
   ═══════════════════════════════════════════════════════ */

import {
  PROPHECY_VISIONS,
  listVisionsForAlbum,
  type AlbumSlug,
  type ProphecyVision,
} from "./prophecyVisionMap";

/* ─── PLAYER PROGRESS SHAPE ─── */

export interface ProphecyProgress {
  /** Vision ids the player has watched in full as marquees. */
  readonly marqueesCompleted: ReadonlySet<string>;
  /** Vision ids the player has watched in full from the Index
   *  (whispers + statics, and replayed marquees). */
  readonly indexViewed: ReadonlySet<string>;
  /** Album slugs the player has watched end-to-end as films. */
  readonly albumFilmsCompleted: ReadonlySet<AlbumSlug>;
  /** True iff the player is in or past act 7. */
  readonly postAct7: boolean;
}

/* ─── ACHIEVEMENT DEFINITIONS ─── */

export type AchievementKind =
  | "album_witness"
  | "album_film_witness"
  | "album_archivist"
  | "full_tapestry"
  | "antiquarians_codex";

export interface ProphecyAchievement {
  /** Stable id ("ach_album_witness_book_of_daniel"). */
  readonly id: string;
  readonly kind: AchievementKind;
  /** Album the achievement belongs to (undefined for global
   *  Full Tapestry / Antiquarian's Codex tiers). */
  readonly albumSlug?: AlbumSlug;
  /** Cosmetic key granted on unlock. Matches an entry in
   *  apps/shared/cosmeticShop.ts with `earnedFromProphecy`. */
  readonly cosmeticKey: string;
  /** Bonus soulBoundDream payout on unlock (zero for the
   *  unique tiers — they grant a title, not currency). */
  readonly soulBoundDreamBonus: number;
  /** Loredex entry unlocked alongside the cosmetic. */
  readonly loredexEntry?: string;
  /** Narrative flag set on unlock (typically only for the
   *  global tiers). */
  readonly narrativeFlag?: string;
  /** Server-side hook ids — e.g. "fnord_unlocked" wires the
   *  Oracle Deck side effect. */
  readonly sideEffects?: readonly string[];
  /** Predicate: is this achievement currently earned? */
  readonly satisfiedBy: (progress: ProphecyProgress) => boolean;
}

/* ─── HELPERS ─── */

const ALBUMS_IN_PLAY: readonly AlbumSlug[] = [
  "dischordian-logic",
  "age-of-privacy",
  "book-of-daniel",
  "west-by-god",
  "silence-in-heaven",
];

function visionsOfIntensityForAlbum(
  album: AlbumSlug,
  intensity: ProphecyVision["intensity"],
): readonly ProphecyVision[] {
  return listVisionsForAlbum(album).filter((v) => v.intensity === intensity);
}

function allMarqueesCompletedForAlbum(
  album: AlbumSlug,
  completed: ReadonlySet<string>,
): boolean {
  const marquees = visionsOfIntensityForAlbum(album, "marquee");
  if (marquees.length === 0) return false;
  return marquees.every((v) => completed.has(v.id));
}

function allWhispersAndStaticsViewedForAlbum(
  album: AlbumSlug,
  viewed: ReadonlySet<string>,
): boolean {
  const longTail = listVisionsForAlbum(album).filter(
    (v) => v.intensity === "whisper" || v.intensity === "static",
  );
  if (longTail.length === 0) return true; // album with no long tail trivially passes
  return longTail.every((v) => viewed.has(v.id));
}

/* ─── REGISTRY ─── */

function buildAchievements(): readonly ProphecyAchievement[] {
  const out: ProphecyAchievement[] = [];

  for (const album of ALBUMS_IN_PLAY) {
    const albumKey = album.replace(/-/g, "_");

    out.push({
      id: `ach_album_witness_${albumKey}`,
      kind: "album_witness",
      albumSlug: album,
      cosmeticKey: `${albumKey}_witness`,
      soulBoundDreamBonus: 200,
      loredexEntry: `prophecy_${albumKey}_witness`,
      satisfiedBy: (p) => allMarqueesCompletedForAlbum(album, p.marqueesCompleted),
    });

    out.push({
      id: `ach_album_film_witness_${albumKey}`,
      kind: "album_film_witness",
      albumSlug: album,
      cosmeticKey: `${albumKey}_film_witness`,
      soulBoundDreamBonus: 100,
      satisfiedBy: (p) => p.albumFilmsCompleted.has(album),
    });

    out.push({
      id: `ach_album_archivist_${albumKey}`,
      kind: "album_archivist",
      albumSlug: album,
      cosmeticKey: `${albumKey}_archivist`,
      soulBoundDreamBonus: 350,
      satisfiedBy: (p) =>
        allMarqueesCompletedForAlbum(album, p.marqueesCompleted) &&
        allWhispersAndStaticsViewedForAlbum(album, p.indexViewed),
    });
  }

  out.push({
    id: "ach_full_tapestry",
    kind: "full_tapestry",
    cosmeticKey: "full_tapestry_title",
    soulBoundDreamBonus: 1000,
    loredexEntry: "the_full_truth",
    narrativeFlag: "antiquarian_journal_unlocked",
    sideEffects: ["fnord_unlocked"],
    satisfiedBy: (p) =>
      PROPHECY_VISIONS.filter((v) => v.intensity === "marquee").every((v) =>
        p.marqueesCompleted.has(v.id),
      ),
  });

  out.push({
    id: "ach_antiquarians_codex",
    kind: "antiquarians_codex",
    cosmeticKey: "antiquarians_codex_title",
    soulBoundDreamBonus: 2300,
    loredexEntry: "the_antiquarians_codex",
    narrativeFlag: "antiquarians_codex_unlocked",
    satisfiedBy: (p) => {
      if (!p.postAct7) return false;
      const allMarquees = PROPHECY_VISIONS.filter((v) => v.intensity === "marquee");
      if (!allMarquees.every((v) => p.marqueesCompleted.has(v.id))) return false;
      const allLongTail = PROPHECY_VISIONS.filter(
        (v) => v.intensity === "whisper" || v.intensity === "static",
      );
      if (!allLongTail.every((v) => p.indexViewed.has(v.id))) return false;
      return ALBUMS_IN_PLAY.every((a) => p.albumFilmsCompleted.has(a));
    },
  });

  return out;
}

export const PROPHECY_ACHIEVEMENTS: readonly ProphecyAchievement[] =
  buildAchievements();

const ACHIEVEMENTS_BY_ID: ReadonlyMap<string, ProphecyAchievement> = new Map(
  PROPHECY_ACHIEVEMENTS.map((a) => [a.id, a]),
);

export function getProphecyAchievementById(
  id: string,
): ProphecyAchievement | undefined {
  return ACHIEVEMENTS_BY_ID.get(id);
}

/** Evaluate which achievements the player should hold. Pure
 *  function over the progress shape; the server-side
 *  evaluator diffs this against the granted set and grants
 *  any new ones idempotently. */
export function evaluateAchievements(
  progress: ProphecyProgress,
): readonly ProphecyAchievement[] {
  return PROPHECY_ACHIEVEMENTS.filter((a) => a.satisfiedBy(progress));
}
