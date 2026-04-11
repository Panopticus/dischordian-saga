/* ═══════════════════════════════════════════════════════
   WITNESSING ASSET MANIFEST — §12 cutscene production list.

   Derives the full list of image asset paths the
   SongSlideshow component expects from the current
   `songSlideshows` registry. Everything referenced here is
   a PLACEHOLDER path — the artist drops actual .webp files
   at these locations and the component renders them without
   any code change.

   Two functions:

     listSlideshowImageAssets() — every frame + hero image
       across every registered slideshow. Grouped by slideshow
       id so the artist can tick off entries one cinematic
       at a time.

     countAssetsByType() — tallies for the production
       dashboard: total frames, hero images, lyric counts,
       overlay counts.

   Derived entirely from shared/songSlideshows.ts — if the
   registry changes, this manifest updates automatically with
   no hand-editing.
   ═══════════════════════════════════════════════════════ */

import { SONG_SLIDESHOWS } from "./songSlideshows";
import type { SongSlideshowDef } from "./songSlideshow";

export interface SlideshowAssetEntry {
  slideshowId: string;
  title: string;
  priority: "P0" | "P1" | "P2";
  durationMs: number;
  /** Every frame's imageUrl, in playback order. */
  frameImageUrls: string[];
  /** The reduced-motion fallback hero image path. */
  heroImageUrl: string;
  /** Number of lyric lines the cinematic declares. */
  lyricCount: number;
  /** Number of overlay effects the cinematic declares. */
  overlayCount: number;
  /** Total number of image assets the artist needs to produce. */
  totalImageCount: number;
}

/**
 * Walks the slideshow registry and returns one entry per
 * registered slideshow with every image path the artist
 * should produce. Order follows §5.5 priority first, then
 * slideshow id alphabetically.
 */
export function listSlideshowImageAssets(): SlideshowAssetEntry[] {
  const priorityOrder: Record<"P0" | "P1" | "P2", number> = {
    P0: 0,
    P1: 1,
    P2: 2,
  };
  const defs = Object.values(SONG_SLIDESHOWS).sort((a, b) => {
    const p = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (p !== 0) return p;
    return a.id.localeCompare(b.id);
  });
  return defs.map(defToAssetEntry);
}

function defToAssetEntry(def: SongSlideshowDef): SlideshowAssetEntry {
  const frameImageUrls = def.frames.map((f) => f.imageUrl);
  const heroImageUrl = def.reducedMotionFallback.heroImageUrl;
  return {
    slideshowId: def.id,
    title: def.title,
    priority: def.priority,
    durationMs: def.durationMs,
    frameImageUrls,
    heroImageUrl,
    lyricCount: def.lyrics?.length ?? 0,
    overlayCount: def.overlays?.length ?? 0,
    totalImageCount: frameImageUrls.length + 1, // +1 for the hero
  };
}

/**
 * Tally across the entire registry — useful for the
 * production dashboard's "X of Y slideshows ready" progress
 * indicator.
 */
export interface AssetManifestTotals {
  slideshowCount: number;
  frameImageCount: number;
  heroImageCount: number;
  totalImageCount: number;
  totalLyricCount: number;
  totalOverlayCount: number;
  byPriority: Record<"P0" | "P1" | "P2", number>;
}

export function countAssetsByType(): AssetManifestTotals {
  const entries = listSlideshowImageAssets();
  const byPriority: Record<"P0" | "P1" | "P2", number> = {
    P0: 0,
    P1: 0,
    P2: 0,
  };
  let frameImageCount = 0;
  let totalLyricCount = 0;
  let totalOverlayCount = 0;
  for (const entry of entries) {
    byPriority[entry.priority] += 1;
    frameImageCount += entry.frameImageUrls.length;
    totalLyricCount += entry.lyricCount;
    totalOverlayCount += entry.overlayCount;
  }
  return {
    slideshowCount: entries.length,
    frameImageCount,
    heroImageCount: entries.length,
    totalImageCount: frameImageCount + entries.length,
    totalLyricCount,
    totalOverlayCount,
    byPriority,
  };
}

/**
 * Return every image path in the registry as a flat list.
 * Handy for generating a shell script that creates empty
 * placeholder files, or for a static-check that verifies
 * every path exists on disk.
 */
export function listAllAssetPaths(): string[] {
  const out: string[] = [];
  for (const entry of listSlideshowImageAssets()) {
    out.push(...entry.frameImageUrls);
    out.push(entry.heroImageUrl);
  }
  return out;
}
