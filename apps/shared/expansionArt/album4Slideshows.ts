/* ═══════════════════════════════════════════════════════
   ALBUM 4 — WEST BY GOD · SLIDESHOW MANIFEST

   Source: producer drop
   s3://dgrsart/Album Slide Show/WestByGod_Album5_Complete.zip
   (2026-04-29). 10 tracks · 200 frames · 2752×1536 16:9
   cinematic widescreen — Cowboy Bebop × Cyberpunk Edgerunners
   × Afro Samurai. Era bridge: Age of Privacy → Age of
   Revelation (~17,020-17,030 A.A.). Album-movie format —
   a single continuous narrative across 10 chapters rather
   than the 5-act split Albums 1 and 2 use.

   Note on numbering: the producer-side filename calls this
   "Album 5" (WestByGod_Album5_Complete.zip), but the
   canonical ordering per the saga is Album 4 — the producer
   label was a working number that didn't survive the final
   ordering. We keep the producer's literal zip filename in
   the attribution comment but use Album 4 everywhere else.

   PNG → WebP @ q85 on upload. Files served from:
     cdn/client-public/art/slideshows/album4/T<NN>/<file>.webp

   Layout mirrors the producer zip 1:1. Per-track titles +
   3-act movie buckets per the producer's MANIFEST.md and
   MASTER_BIBLE_NOTES.md.

   Hidden-lore reveals visualised in the frames (per the
   producer's MASTER_BIBLE_NOTES.md — surface as Loredex
   unlock-condition gates, NOT as overt UI text):
     - The Programmer (Daniel Cross) IS the Antiquarian
       across time.
     - Malkia Ukweli IS The Enigma — the artist-as-character.
     - The Ark is a plague ship — Thought Virus in life
       support and water.
     - The number 47 is the Warlord's signature, planted
       throughout the album.
     - The Meme is hiding as the White Oracle after the Fall.
     - The Engineer was mind-swapped into Agent Zero's body.
     - The player lives in the ship Kael stole — Inception
       Ark 1047.
     - Player designation is Prisoner 74 (not Subject Zero).

   Lore-direct anchors for the Dreamer-recruitment plan
   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):
     - T03 Hypnotized — first contact between The Programmer
       and The Enigma; canonical Dreamer-side relay imagery.
     - T07 Born Under a Bad Sign — the Programmer's
       Appalachian backstory + confession; resonance with the
       "who the Architect chose vs who the Dreamer chose"
       fork.
     - T09 The Death of Music — BABEL tower assault,
       broadcast override; perfect frame source for vision
       threshold ≥13 (Hidden Hand) given the substrate motif.
     - T10 Yes I Do (Dream) — epilogue foreshadowing the
       Antiquarian; the natural climactic vision (≥23).

   Generator: scripts/_gen-album4-manifest.mjs (re-run after
   any producer redrop).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type Album4TrackId =
  | "T01"
  | "T02"
  | "T03"
  | "T04"
  | "T05"
  | "T06"
  | "T07"
  | "T08"
  | "T09"
  | "T10";

export interface Album4TrackDef {
  id: Album4TrackId;
  title: string;
  /** 1..3, mapping the producer manifest's three-act movie
   *  structure. Type stays compatible with Album 1 / 2's
   *  1..5 act union so consumers can merge across albums. */
  act: 1 | 2 | 3 | 4 | 5;
  /** Frame relPaths in producer order — title card first,
   *  then numbered beats. Album 4 has no alt-take siblings. */
  frameRelPaths: readonly string[];
}

export const ALBUM4_TRACKS: readonly Album4TrackDef[] = [
  {
    id: "T01",
    title: "We Are Not Okay",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album4/T01/T01_00_title.webp",
      "art/slideshows/album4/T01/T01_01.webp",
      "art/slideshows/album4/T01/T01_02.webp",
      "art/slideshows/album4/T01/T01_03.webp",
      "art/slideshows/album4/T01/T01_04.webp",
      "art/slideshows/album4/T01/T01_05.webp",
      "art/slideshows/album4/T01/T01_06.webp",
      "art/slideshows/album4/T01/T01_07.webp",
      "art/slideshows/album4/T01/T01_08.webp",
      "art/slideshows/album4/T01/T01_09.webp",
      "art/slideshows/album4/T01/T01_10.webp",
      "art/slideshows/album4/T01/T01_11.webp",
      "art/slideshows/album4/T01/T01_12.webp",
      "art/slideshows/album4/T01/T01_13.webp",
      "art/slideshows/album4/T01/T01_14.webp",
      "art/slideshows/album4/T01/T01_15.webp",
      "art/slideshows/album4/T01/T01_16.webp",
      "art/slideshows/album4/T01/T01_17.webp",
      "art/slideshows/album4/T01/T01_18.webp",
      "art/slideshows/album4/T01/T01_19.webp",
    ],
  },
  {
    id: "T02",
    title: "Medicated",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album4/T02/T02_00_title.webp",
      "art/slideshows/album4/T02/T02_01.webp",
      "art/slideshows/album4/T02/T02_02.webp",
      "art/slideshows/album4/T02/T02_03.webp",
      "art/slideshows/album4/T02/T02_04.webp",
      "art/slideshows/album4/T02/T02_05.webp",
      "art/slideshows/album4/T02/T02_06.webp",
      "art/slideshows/album4/T02/T02_07.webp",
      "art/slideshows/album4/T02/T02_08.webp",
      "art/slideshows/album4/T02/T02_09.webp",
      "art/slideshows/album4/T02/T02_10.webp",
      "art/slideshows/album4/T02/T02_11.webp",
      "art/slideshows/album4/T02/T02_12.webp",
      "art/slideshows/album4/T02/T02_13.webp",
      "art/slideshows/album4/T02/T02_14.webp",
      "art/slideshows/album4/T02/T02_15.webp",
      "art/slideshows/album4/T02/T02_16.webp",
      "art/slideshows/album4/T02/T02_17.webp",
      "art/slideshows/album4/T02/T02_18.webp",
      "art/slideshows/album4/T02/T02_19.webp",
    ],
  },
  {
    id: "T03",
    title: "Hypnotized",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album4/T03/T03_00_title.webp",
      "art/slideshows/album4/T03/T03_01.webp",
      "art/slideshows/album4/T03/T03_02.webp",
      "art/slideshows/album4/T03/T03_03.webp",
      "art/slideshows/album4/T03/T03_04.webp",
      "art/slideshows/album4/T03/T03_05.webp",
      "art/slideshows/album4/T03/T03_06.webp",
      "art/slideshows/album4/T03/T03_07.webp",
      "art/slideshows/album4/T03/T03_08.webp",
      "art/slideshows/album4/T03/T03_09.webp",
      "art/slideshows/album4/T03/T03_10.webp",
      "art/slideshows/album4/T03/T03_11.webp",
      "art/slideshows/album4/T03/T03_12.webp",
      "art/slideshows/album4/T03/T03_13.webp",
      "art/slideshows/album4/T03/T03_14.webp",
      "art/slideshows/album4/T03/T03_15.webp",
      "art/slideshows/album4/T03/T03_16.webp",
      "art/slideshows/album4/T03/T03_17.webp",
      "art/slideshows/album4/T03/T03_18.webp",
      "art/slideshows/album4/T03/T03_19.webp",
    ],
  },
  {
    id: "T04",
    title: "It Ain't Illegal (...Yet)",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album4/T04/T04_00_title.webp",
      "art/slideshows/album4/T04/T04_01.webp",
      "art/slideshows/album4/T04/T04_02.webp",
      "art/slideshows/album4/T04/T04_03.webp",
      "art/slideshows/album4/T04/T04_04.webp",
      "art/slideshows/album4/T04/T04_05.webp",
      "art/slideshows/album4/T04/T04_06.webp",
      "art/slideshows/album4/T04/T04_07.webp",
      "art/slideshows/album4/T04/T04_08.webp",
      "art/slideshows/album4/T04/T04_09.webp",
      "art/slideshows/album4/T04/T04_10.webp",
      "art/slideshows/album4/T04/T04_11.webp",
      "art/slideshows/album4/T04/T04_12.webp",
      "art/slideshows/album4/T04/T04_13.webp",
      "art/slideshows/album4/T04/T04_14.webp",
      "art/slideshows/album4/T04/T04_15.webp",
      "art/slideshows/album4/T04/T04_16.webp",
      "art/slideshows/album4/T04/T04_17.webp",
      "art/slideshows/album4/T04/T04_18.webp",
      "art/slideshows/album4/T04/T04_19.webp",
    ],
  },
  {
    id: "T05",
    title: "Monuments",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album4/T05/T05_00_title.webp",
      "art/slideshows/album4/T05/T05_01.webp",
      "art/slideshows/album4/T05/T05_02.webp",
      "art/slideshows/album4/T05/T05_03.webp",
      "art/slideshows/album4/T05/T05_04.webp",
      "art/slideshows/album4/T05/T05_05.webp",
      "art/slideshows/album4/T05/T05_06.webp",
      "art/slideshows/album4/T05/T05_07.webp",
      "art/slideshows/album4/T05/T05_08.webp",
      "art/slideshows/album4/T05/T05_09.webp",
      "art/slideshows/album4/T05/T05_10.webp",
      "art/slideshows/album4/T05/T05_11.webp",
      "art/slideshows/album4/T05/T05_12.webp",
      "art/slideshows/album4/T05/T05_13.webp",
      "art/slideshows/album4/T05/T05_14.webp",
      "art/slideshows/album4/T05/T05_15.webp",
      "art/slideshows/album4/T05/T05_16.webp",
      "art/slideshows/album4/T05/T05_17.webp",
      "art/slideshows/album4/T05/T05_18.webp",
      "art/slideshows/album4/T05/T05_19.webp",
    ],
  },
  {
    id: "T06",
    title: "Damned for Sure",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album4/T06/T06_00_title.webp",
      "art/slideshows/album4/T06/T06_01.webp",
      "art/slideshows/album4/T06/T06_02.webp",
      "art/slideshows/album4/T06/T06_03.webp",
      "art/slideshows/album4/T06/T06_04.webp",
      "art/slideshows/album4/T06/T06_05.webp",
      "art/slideshows/album4/T06/T06_06.webp",
      "art/slideshows/album4/T06/T06_07.webp",
      "art/slideshows/album4/T06/T06_08.webp",
      "art/slideshows/album4/T06/T06_09.webp",
      "art/slideshows/album4/T06/T06_10.webp",
      "art/slideshows/album4/T06/T06_11.webp",
      "art/slideshows/album4/T06/T06_12.webp",
      "art/slideshows/album4/T06/T06_13.webp",
      "art/slideshows/album4/T06/T06_14.webp",
      "art/slideshows/album4/T06/T06_15.webp",
      "art/slideshows/album4/T06/T06_16.webp",
      "art/slideshows/album4/T06/T06_17.webp",
      "art/slideshows/album4/T06/T06_18.webp",
      "art/slideshows/album4/T06/T06_19.webp",
    ],
  },
  {
    id: "T07",
    title: "It Ain't Been the Same (Born Under a Bad Sign)",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album4/T07/T07_00_title.webp",
      "art/slideshows/album4/T07/T07_01.webp",
      "art/slideshows/album4/T07/T07_02.webp",
      "art/slideshows/album4/T07/T07_03.webp",
      "art/slideshows/album4/T07/T07_04.webp",
      "art/slideshows/album4/T07/T07_05.webp",
      "art/slideshows/album4/T07/T07_06.webp",
      "art/slideshows/album4/T07/T07_07.webp",
      "art/slideshows/album4/T07/T07_08.webp",
      "art/slideshows/album4/T07/T07_09.webp",
      "art/slideshows/album4/T07/T07_10.webp",
      "art/slideshows/album4/T07/T07_11.webp",
      "art/slideshows/album4/T07/T07_12.webp",
      "art/slideshows/album4/T07/T07_13.webp",
      "art/slideshows/album4/T07/T07_14.webp",
      "art/slideshows/album4/T07/T07_15.webp",
      "art/slideshows/album4/T07/T07_16.webp",
      "art/slideshows/album4/T07/T07_17.webp",
      "art/slideshows/album4/T07/T07_18.webp",
      "art/slideshows/album4/T07/T07_19.webp",
    ],
  },
  {
    id: "T08",
    title: "On the Road",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album4/T08/T08_00_title.webp",
      "art/slideshows/album4/T08/T08_01.webp",
      "art/slideshows/album4/T08/T08_02.webp",
      "art/slideshows/album4/T08/T08_03.webp",
      "art/slideshows/album4/T08/T08_04.webp",
      "art/slideshows/album4/T08/T08_05.webp",
      "art/slideshows/album4/T08/T08_06.webp",
      "art/slideshows/album4/T08/T08_07.webp",
      "art/slideshows/album4/T08/T08_08.webp",
      "art/slideshows/album4/T08/T08_09.webp",
      "art/slideshows/album4/T08/T08_10.webp",
      "art/slideshows/album4/T08/T08_11.webp",
      "art/slideshows/album4/T08/T08_12.webp",
      "art/slideshows/album4/T08/T08_13.webp",
      "art/slideshows/album4/T08/T08_14.webp",
      "art/slideshows/album4/T08/T08_15.webp",
      "art/slideshows/album4/T08/T08_16.webp",
      "art/slideshows/album4/T08/T08_17.webp",
      "art/slideshows/album4/T08/T08_18.webp",
      "art/slideshows/album4/T08/T08_19.webp",
    ],
  },
  {
    id: "T09",
    title: "The Death of Music",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album4/T09/T09_00_title.webp",
      "art/slideshows/album4/T09/T09_01.webp",
      "art/slideshows/album4/T09/T09_02.webp",
      "art/slideshows/album4/T09/T09_03.webp",
      "art/slideshows/album4/T09/T09_04.webp",
      "art/slideshows/album4/T09/T09_05.webp",
      "art/slideshows/album4/T09/T09_06.webp",
      "art/slideshows/album4/T09/T09_07.webp",
      "art/slideshows/album4/T09/T09_08.webp",
      "art/slideshows/album4/T09/T09_09.webp",
      "art/slideshows/album4/T09/T09_10.webp",
      "art/slideshows/album4/T09/T09_11.webp",
      "art/slideshows/album4/T09/T09_12.webp",
      "art/slideshows/album4/T09/T09_13.webp",
      "art/slideshows/album4/T09/T09_14.webp",
      "art/slideshows/album4/T09/T09_15.webp",
      "art/slideshows/album4/T09/T09_16.webp",
      "art/slideshows/album4/T09/T09_17.webp",
      "art/slideshows/album4/T09/T09_18.webp",
      "art/slideshows/album4/T09/T09_19.webp",
    ],
  },
  {
    id: "T10",
    title: "Yes I Do (Dream)",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album4/T10/T10_00_title.webp",
      "art/slideshows/album4/T10/T10_01.webp",
      "art/slideshows/album4/T10/T10_02.webp",
      "art/slideshows/album4/T10/T10_03.webp",
      "art/slideshows/album4/T10/T10_04.webp",
      "art/slideshows/album4/T10/T10_05.webp",
      "art/slideshows/album4/T10/T10_06.webp",
      "art/slideshows/album4/T10/T10_07.webp",
      "art/slideshows/album4/T10/T10_08.webp",
      "art/slideshows/album4/T10/T10_09.webp",
      "art/slideshows/album4/T10/T10_10.webp",
      "art/slideshows/album4/T10/T10_11.webp",
      "art/slideshows/album4/T10/T10_12.webp",
      "art/slideshows/album4/T10/T10_13.webp",
      "art/slideshows/album4/T10/T10_14.webp",
      "art/slideshows/album4/T10/T10_15.webp",
      "art/slideshows/album4/T10/T10_16.webp",
      "art/slideshows/album4/T10/T10_17.webp",
      "art/slideshows/album4/T10/T10_18.webp",
      "art/slideshows/album4/T10/T10_19.webp",
    ],
  },
];

/* Tracks expose a frame-array per entry rather than a single path,
   so the manifest helper's urlOf can't be reused as-is. We still take
   the byId map + byField filter from it; the per-frame resolver
   stays bespoke (it's a frame-N array index, not a field lookup). */
const ALBUM4_MANIFEST = makeAssetManifest(ALBUM4_TRACKS, "id", "title");

/** Resolve a track's title-card URL (the first frame). */
export function album4TitleUrl(id: Album4TrackId): string | undefined {
  const t = ALBUM4_MANIFEST.byId.get(id);
  return t ? assetUrl(t.frameRelPaths[0]) : undefined;
}

/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */
export function album4FrameUrl(id: Album4TrackId, frame: number): string | undefined {
  const t = ALBUM4_MANIFEST.byId.get(id);
  if (!t) return undefined;
  const path = t.frameRelPaths[frame - 1];
  return path ? assetUrl(path) : undefined;
}

/** All resolved URLs for a track in producer beat-order. */
export function album4FrameUrls(id: Album4TrackId): readonly string[] {
  const t = ALBUM4_MANIFEST.byId.get(id);
  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];
}

/** Tracks that belong to a given movie-act (1..3 for Album 4;
    the type accepts 1..5 to stay compatible with Album 1/2). */
export function album4TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album4TrackDef[] {
  return ALBUM4_MANIFEST.byField("act", act);
}

export const ALBUM4_TRACK_TOTAL = 10;
export const ALBUM4_FRAME_TOTAL = 200;
