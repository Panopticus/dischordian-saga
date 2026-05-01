/* ═══════════════════════════════════════════════════════
   ALBUM 3 — THE BOOK OF DANIEL 24:7 · SLIDESHOW MANIFEST

   Source: producer drop
   s3://dgrsart/Album Slide Show/BOOK_OF_DANIEL_247_COMPLETE.zip
   (2026-04-29). 22 tracks · 567 frames · ~111 minutes of
   visual narrative at 3168×1344 21:9 cinematic widescreen,
   cel-shaded anime — Afro Samurai × Cowboy Bebop × Cyberpunk
   Edgerunners.

   In-universe framing: this is the journal The Programmer
   (Dr. Daniel Cross) writes during the Insurgency — the
   same character who later becomes The Antiquarian per
   Album 5's MASTER_BIBLE_NOTES. The album title's 24:7 isn't
   a Bible chapter (Daniel only has 12) — it's the watch
   epigraph: Daniel watches 24/7.

   PNG → WebP @ q85 on upload. Files served from:
     cdn/client-public/art/slideshows/album3/T<NN>/<file>.webp

   Layout mirrors the producer zip 1:1. Per-track titles +
   3-act thematic buckets per the producer's ALBUM_MANIFEST.md:

     Act I  (The Awakening):  T01-T07 (Dischordian Logic →
                              Sticks in Harmony → Numb → Last
                              Stand → Kismet → Shades of Grey
                              → Virtual Reality)
     Act II (The Struggle):   T08-T14 (Consider Life → Liber AL
                              → Remembering How to Move On →
                              Polarity → Mental Slavery →
                              Identity → The Lion in Black)
     Act III(The Resolution): T15-T22 (Nondenominational →
                              Paradise Lost → Usikue MSHY →
                              Noxicans → Secret of Words →
                              Faustian Life → Deep Thoughts →
                              Family Tree)

   Lore-direct anchors for the Dreamer-recruitment plan
   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):
     - T09 "Liber AL"      — Crowley's Book of the Law as direct
                             reference. Gnostic / occult overlay.
                             Strong vision-≥7 candidate.
     - T11 "Polarity"      — Hermetic principle (one of the
                             seven). Substrate-of-reality motif.
     - T17 "Usikue MSHY"  — Swahili "Keep a Girl in School".
                             Pairs with Album 2's UHURU /
                             UKWELI / NGUVU encryption — same
                             cipher universe.
     - T20 "Interactive Faustian Life" — the recruitment
                             allegory itself. Either-side hook.
     - T22 "Family Tree"  — homecoming. Producer manifest
                             closes with "Karibu kwenye
                             familia" (Welcome to the family,
                             Swahili). Strong vision-≥23
                             candidate (the Dreamer welcomes).

   Generator: scripts/_gen-album3-manifest.mjs (re-run after
   any producer redrop).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type Album3TrackId =
  | "T01"
  | "T02"
  | "T03"
  | "T04"
  | "T05"
  | "T06"
  | "T07"
  | "T08"
  | "T09"
  | "T10"
  | "T11"
  | "T12"
  | "T13"
  | "T14"
  | "T15"
  | "T16"
  | "T17"
  | "T18"
  | "T19"
  | "T20"
  | "T21"
  | "T22";

export interface Album3TrackDef {
  id: Album3TrackId;
  title: string;
  /** 1..3, mapping the producer manifest's three-act thematic
   *  arc. Type stays compatible with the other album manifests'
   *  1..5 union so consumers can merge across albums. */
  act: 1 | 2 | 3 | 4 | 5;
  /** Frame relPaths in producer order — title card first,
   *  then numbered beats. Album 3 has no alt-take siblings. */
  frameRelPaths: readonly string[];
}

export const ALBUM3_TRACKS: readonly Album3TrackDef[] = [
  {
    id: "T01",
    title: "Dischordian Logic",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T01/T01_00_title.webp",
      "art/slideshows/album3/T01/T01_01.webp",
      "art/slideshows/album3/T01/T01_02.webp",
      "art/slideshows/album3/T01/T01_03.webp",
      "art/slideshows/album3/T01/T01_04.webp",
      "art/slideshows/album3/T01/T01_05.webp",
      "art/slideshows/album3/T01/T01_06.webp",
      "art/slideshows/album3/T01/T01_07.webp",
      "art/slideshows/album3/T01/T01_08.webp",
      "art/slideshows/album3/T01/T01_09.webp",
      "art/slideshows/album3/T01/T01_10.webp",
      "art/slideshows/album3/T01/T01_11.webp",
      "art/slideshows/album3/T01/T01_12.webp",
      "art/slideshows/album3/T01/T01_13.webp",
      "art/slideshows/album3/T01/T01_14.webp",
      "art/slideshows/album3/T01/T01_15.webp",
      "art/slideshows/album3/T01/T01_16.webp",
      "art/slideshows/album3/T01/T01_17.webp",
      "art/slideshows/album3/T01/T01_18.webp",
      "art/slideshows/album3/T01/T01_19.webp",
      "art/slideshows/album3/T01/T01_20.webp",
      "art/slideshows/album3/T01/T01_21.webp",
      "art/slideshows/album3/T01/T01_22.webp",
      "art/slideshows/album3/T01/T01_23.webp",
      "art/slideshows/album3/T01/T01_24.webp",
      "art/slideshows/album3/T01/T01_25.webp",
      "art/slideshows/album3/T01/T01_26.webp",
      "art/slideshows/album3/T01/T01_27.webp",
      "art/slideshows/album3/T01/T01_28.webp",
      "art/slideshows/album3/T01/T01_29.webp",
      "art/slideshows/album3/T01/T01_30.webp",
      "art/slideshows/album3/T01/T01_31.webp",
      "art/slideshows/album3/T01/T01_32.webp",
      "art/slideshows/album3/T01/T01_33.webp",
      "art/slideshows/album3/T01/T01_34.webp",
      "art/slideshows/album3/T01/T01_35.webp",
      "art/slideshows/album3/T01/T01_36.webp",
      "art/slideshows/album3/T01/T01_37.webp",
      "art/slideshows/album3/T01/T01_38.webp",
      "art/slideshows/album3/T01/T01_39.webp",
      "art/slideshows/album3/T01/T01_40.webp",
    ],
  },
  {
    id: "T02",
    title: "Sticks in Harmony",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T02/T02_00_title.webp",
      "art/slideshows/album3/T02/T02_01.webp",
      "art/slideshows/album3/T02/T02_02.webp",
      "art/slideshows/album3/T02/T02_03.webp",
      "art/slideshows/album3/T02/T02_04.webp",
      "art/slideshows/album3/T02/T02_05.webp",
      "art/slideshows/album3/T02/T02_06.webp",
      "art/slideshows/album3/T02/T02_07.webp",
      "art/slideshows/album3/T02/T02_08.webp",
      "art/slideshows/album3/T02/T02_09.webp",
      "art/slideshows/album3/T02/T02_10.webp",
      "art/slideshows/album3/T02/T02_11.webp",
      "art/slideshows/album3/T02/T02_12.webp",
      "art/slideshows/album3/T02/T02_13.webp",
      "art/slideshows/album3/T02/T02_14.webp",
      "art/slideshows/album3/T02/T02_15.webp",
      "art/slideshows/album3/T02/T02_16.webp",
      "art/slideshows/album3/T02/T02_17.webp",
      "art/slideshows/album3/T02/T02_18.webp",
      "art/slideshows/album3/T02/T02_19.webp",
      "art/slideshows/album3/T02/T02_20.webp",
      "art/slideshows/album3/T02/T02_21.webp",
      "art/slideshows/album3/T02/T02_22.webp",
      "art/slideshows/album3/T02/T02_23.webp",
      "art/slideshows/album3/T02/T02_24.webp",
      "art/slideshows/album3/T02/T02_25.webp",
      "art/slideshows/album3/T02/T02_26.webp",
      "art/slideshows/album3/T02/T02_27.webp",
      "art/slideshows/album3/T02/T02_28.webp",
      "art/slideshows/album3/T02/T02_29.webp",
      "art/slideshows/album3/T02/T02_30.webp",
      "art/slideshows/album3/T02/T02_31.webp",
      "art/slideshows/album3/T02/T02_32.webp",
      "art/slideshows/album3/T02/T02_33.webp",
      "art/slideshows/album3/T02/T02_34.webp",
      "art/slideshows/album3/T02/T02_35.webp",
    ],
  },
  {
    id: "T03",
    title: "Numb",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T03/T03_00_title.webp",
      "art/slideshows/album3/T03/T03_01.webp",
      "art/slideshows/album3/T03/T03_02.webp",
      "art/slideshows/album3/T03/T03_03.webp",
      "art/slideshows/album3/T03/T03_04.webp",
      "art/slideshows/album3/T03/T03_05.webp",
      "art/slideshows/album3/T03/T03_06.webp",
      "art/slideshows/album3/T03/T03_07.webp",
      "art/slideshows/album3/T03/T03_08.webp",
      "art/slideshows/album3/T03/T03_09.webp",
      "art/slideshows/album3/T03/T03_10.webp",
      "art/slideshows/album3/T03/T03_11.webp",
      "art/slideshows/album3/T03/T03_12.webp",
      "art/slideshows/album3/T03/T03_13.webp",
      "art/slideshows/album3/T03/T03_14.webp",
      "art/slideshows/album3/T03/T03_15.webp",
      "art/slideshows/album3/T03/T03_16.webp",
      "art/slideshows/album3/T03/T03_17.webp",
      "art/slideshows/album3/T03/T03_18.webp",
      "art/slideshows/album3/T03/T03_19.webp",
      "art/slideshows/album3/T03/T03_20.webp",
      "art/slideshows/album3/T03/T03_21.webp",
      "art/slideshows/album3/T03/T03_22.webp",
      "art/slideshows/album3/T03/T03_23.webp",
      "art/slideshows/album3/T03/T03_24.webp",
    ],
  },
  {
    id: "T04",
    title: "The Last Stand",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T04/T04_00_title.webp",
      "art/slideshows/album3/T04/T04_01.webp",
      "art/slideshows/album3/T04/T04_02.webp",
      "art/slideshows/album3/T04/T04_03.webp",
      "art/slideshows/album3/T04/T04_04.webp",
      "art/slideshows/album3/T04/T04_05.webp",
      "art/slideshows/album3/T04/T04_06.webp",
      "art/slideshows/album3/T04/T04_07.webp",
      "art/slideshows/album3/T04/T04_08.webp",
      "art/slideshows/album3/T04/T04_09.webp",
      "art/slideshows/album3/T04/T04_10.webp",
      "art/slideshows/album3/T04/T04_11.webp",
      "art/slideshows/album3/T04/T04_12.webp",
      "art/slideshows/album3/T04/T04_13.webp",
      "art/slideshows/album3/T04/T04_14.webp",
    ],
  },
  {
    id: "T05",
    title: "Kismet",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T05/T05_00_title.webp",
      "art/slideshows/album3/T05/T05_01.webp",
      "art/slideshows/album3/T05/T05_02.webp",
      "art/slideshows/album3/T05/T05_03.webp",
      "art/slideshows/album3/T05/T05_04.webp",
      "art/slideshows/album3/T05/T05_05.webp",
      "art/slideshows/album3/T05/T05_06.webp",
      "art/slideshows/album3/T05/T05_07.webp",
      "art/slideshows/album3/T05/T05_08.webp",
      "art/slideshows/album3/T05/T05_09.webp",
      "art/slideshows/album3/T05/T05_10.webp",
      "art/slideshows/album3/T05/T05_11.webp",
      "art/slideshows/album3/T05/T05_12.webp",
      "art/slideshows/album3/T05/T05_13.webp",
      "art/slideshows/album3/T05/T05_14.webp",
      "art/slideshows/album3/T05/T05_15.webp",
      "art/slideshows/album3/T05/T05_16.webp",
      "art/slideshows/album3/T05/T05_17.webp",
      "art/slideshows/album3/T05/T05_18.webp",
      "art/slideshows/album3/T05/T05_19.webp",
      "art/slideshows/album3/T05/T05_20.webp",
      "art/slideshows/album3/T05/T05_21.webp",
      "art/slideshows/album3/T05/T05_22.webp",
      "art/slideshows/album3/T05/T05_23.webp",
      "art/slideshows/album3/T05/T05_24.webp",
    ],
  },
  {
    id: "T06",
    title: "Shades of Grey",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T06/T06_00_title.webp",
      "art/slideshows/album3/T06/T06_01.webp",
      "art/slideshows/album3/T06/T06_02.webp",
      "art/slideshows/album3/T06/T06_03.webp",
      "art/slideshows/album3/T06/T06_04.webp",
      "art/slideshows/album3/T06/T06_05.webp",
      "art/slideshows/album3/T06/T06_06.webp",
      "art/slideshows/album3/T06/T06_07.webp",
      "art/slideshows/album3/T06/T06_08.webp",
      "art/slideshows/album3/T06/T06_09.webp",
      "art/slideshows/album3/T06/T06_10.webp",
      "art/slideshows/album3/T06/T06_11.webp",
      "art/slideshows/album3/T06/T06_12.webp",
      "art/slideshows/album3/T06/T06_13.webp",
      "art/slideshows/album3/T06/T06_14.webp",
      "art/slideshows/album3/T06/T06_15.webp",
      "art/slideshows/album3/T06/T06_16.webp",
      "art/slideshows/album3/T06/T06_17.webp",
      "art/slideshows/album3/T06/T06_18.webp",
      "art/slideshows/album3/T06/T06_19.webp",
      "art/slideshows/album3/T06/T06_20.webp",
      "art/slideshows/album3/T06/T06_21.webp",
      "art/slideshows/album3/T06/T06_22.webp",
      "art/slideshows/album3/T06/T06_23.webp",
      "art/slideshows/album3/T06/T06_24.webp",
      "art/slideshows/album3/T06/T06_25.webp",
      "art/slideshows/album3/T06/T06_26.webp",
      "art/slideshows/album3/T06/T06_27.webp",
      "art/slideshows/album3/T06/T06_28.webp",
      "art/slideshows/album3/T06/T06_29.webp",
      "art/slideshows/album3/T06/T06_30.webp",
      "art/slideshows/album3/T06/T06_31.webp",
      "art/slideshows/album3/T06/T06_32.webp",
      "art/slideshows/album3/T06/T06_33.webp",
      "art/slideshows/album3/T06/T06_34.webp",
    ],
  },
  {
    id: "T07",
    title: "Virtual Reality",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album3/T07/T07_00_title.webp",
      "art/slideshows/album3/T07/T07_01.webp",
      "art/slideshows/album3/T07/T07_02.webp",
      "art/slideshows/album3/T07/T07_03.webp",
      "art/slideshows/album3/T07/T07_04.webp",
      "art/slideshows/album3/T07/T07_05.webp",
      "art/slideshows/album3/T07/T07_06.webp",
      "art/slideshows/album3/T07/T07_07.webp",
      "art/slideshows/album3/T07/T07_08.webp",
      "art/slideshows/album3/T07/T07_09.webp",
      "art/slideshows/album3/T07/T07_10.webp",
      "art/slideshows/album3/T07/T07_11.webp",
      "art/slideshows/album3/T07/T07_12.webp",
      "art/slideshows/album3/T07/T07_13.webp",
      "art/slideshows/album3/T07/T07_14.webp",
      "art/slideshows/album3/T07/T07_15.webp",
      "art/slideshows/album3/T07/T07_16.webp",
      "art/slideshows/album3/T07/T07_17.webp",
      "art/slideshows/album3/T07/T07_18.webp",
      "art/slideshows/album3/T07/T07_19.webp",
      "art/slideshows/album3/T07/T07_20.webp",
      "art/slideshows/album3/T07/T07_21.webp",
      "art/slideshows/album3/T07/T07_22.webp",
      "art/slideshows/album3/T07/T07_23.webp",
      "art/slideshows/album3/T07/T07_24.webp",
    ],
  },
  {
    id: "T08",
    title: "Consider Life",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T08/T08_00_title.webp",
      "art/slideshows/album3/T08/T08_01.webp",
      "art/slideshows/album3/T08/T08_02.webp",
      "art/slideshows/album3/T08/T08_03.webp",
      "art/slideshows/album3/T08/T08_04.webp",
      "art/slideshows/album3/T08/T08_05.webp",
      "art/slideshows/album3/T08/T08_06.webp",
      "art/slideshows/album3/T08/T08_07.webp",
      "art/slideshows/album3/T08/T08_08.webp",
      "art/slideshows/album3/T08/T08_09.webp",
      "art/slideshows/album3/T08/T08_10.webp",
      "art/slideshows/album3/T08/T08_11.webp",
      "art/slideshows/album3/T08/T08_12.webp",
      "art/slideshows/album3/T08/T08_13.webp",
      "art/slideshows/album3/T08/T08_14.webp",
      "art/slideshows/album3/T08/T08_15.webp",
      "art/slideshows/album3/T08/T08_16.webp",
      "art/slideshows/album3/T08/T08_17.webp",
      "art/slideshows/album3/T08/T08_18.webp",
      "art/slideshows/album3/T08/T08_19.webp",
    ],
  },
  {
    id: "T09",
    title: "Liber AL",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T09/T09_00_title.webp",
      "art/slideshows/album3/T09/T09_01.webp",
      "art/slideshows/album3/T09/T09_02.webp",
      "art/slideshows/album3/T09/T09_03.webp",
      "art/slideshows/album3/T09/T09_04.webp",
      "art/slideshows/album3/T09/T09_05.webp",
      "art/slideshows/album3/T09/T09_06.webp",
      "art/slideshows/album3/T09/T09_07.webp",
      "art/slideshows/album3/T09/T09_08.webp",
      "art/slideshows/album3/T09/T09_09.webp",
      "art/slideshows/album3/T09/T09_10.webp",
      "art/slideshows/album3/T09/T09_11.webp",
      "art/slideshows/album3/T09/T09_12.webp",
      "art/slideshows/album3/T09/T09_13.webp",
      "art/slideshows/album3/T09/T09_14.webp",
      "art/slideshows/album3/T09/T09_15.webp",
      "art/slideshows/album3/T09/T09_16.webp",
      "art/slideshows/album3/T09/T09_17.webp",
      "art/slideshows/album3/T09/T09_18.webp",
      "art/slideshows/album3/T09/T09_19.webp",
      "art/slideshows/album3/T09/T09_20.webp",
      "art/slideshows/album3/T09/T09_21.webp",
      "art/slideshows/album3/T09/T09_22.webp",
      "art/slideshows/album3/T09/T09_23.webp",
      "art/slideshows/album3/T09/T09_24.webp",
      "art/slideshows/album3/T09/T09_25.webp",
      "art/slideshows/album3/T09/T09_26.webp",
      "art/slideshows/album3/T09/T09_27.webp",
      "art/slideshows/album3/T09/T09_28.webp",
      "art/slideshows/album3/T09/T09_29.webp",
    ],
  },
  {
    id: "T10",
    title: "Remembering How to Move On",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T10/T10_00_title.webp",
      "art/slideshows/album3/T10/T10_01.webp",
      "art/slideshows/album3/T10/T10_02.webp",
      "art/slideshows/album3/T10/T10_03.webp",
      "art/slideshows/album3/T10/T10_04.webp",
      "art/slideshows/album3/T10/T10_05.webp",
      "art/slideshows/album3/T10/T10_06.webp",
      "art/slideshows/album3/T10/T10_07.webp",
      "art/slideshows/album3/T10/T10_08.webp",
      "art/slideshows/album3/T10/T10_09.webp",
      "art/slideshows/album3/T10/T10_10.webp",
      "art/slideshows/album3/T10/T10_11.webp",
      "art/slideshows/album3/T10/T10_12.webp",
      "art/slideshows/album3/T10/T10_13.webp",
      "art/slideshows/album3/T10/T10_14.webp",
      "art/slideshows/album3/T10/T10_15.webp",
      "art/slideshows/album3/T10/T10_16.webp",
      "art/slideshows/album3/T10/T10_17.webp",
      "art/slideshows/album3/T10/T10_18.webp",
      "art/slideshows/album3/T10/T10_19.webp",
      "art/slideshows/album3/T10/T10_20.webp",
      "art/slideshows/album3/T10/T10_21.webp",
      "art/slideshows/album3/T10/T10_22.webp",
      "art/slideshows/album3/T10/T10_23.webp",
      "art/slideshows/album3/T10/T10_24.webp",
    ],
  },
  {
    id: "T11",
    title: "Polarity",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T11/T11_00_title.webp",
      "art/slideshows/album3/T11/T11_01.webp",
      "art/slideshows/album3/T11/T11_02.webp",
      "art/slideshows/album3/T11/T11_03.webp",
      "art/slideshows/album3/T11/T11_04.webp",
      "art/slideshows/album3/T11/T11_05.webp",
      "art/slideshows/album3/T11/T11_06.webp",
      "art/slideshows/album3/T11/T11_07.webp",
      "art/slideshows/album3/T11/T11_08.webp",
      "art/slideshows/album3/T11/T11_09.webp",
      "art/slideshows/album3/T11/T11_10.webp",
      "art/slideshows/album3/T11/T11_11.webp",
      "art/slideshows/album3/T11/T11_12.webp",
      "art/slideshows/album3/T11/T11_13.webp",
      "art/slideshows/album3/T11/T11_14.webp",
      "art/slideshows/album3/T11/T11_15.webp",
      "art/slideshows/album3/T11/T11_16.webp",
      "art/slideshows/album3/T11/T11_17.webp",
      "art/slideshows/album3/T11/T11_18.webp",
      "art/slideshows/album3/T11/T11_19.webp",
    ],
  },
  {
    id: "T12",
    title: "Mental Slavery",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T12/T12_00_title.webp",
      "art/slideshows/album3/T12/T12_01.webp",
      "art/slideshows/album3/T12/T12_02.webp",
      "art/slideshows/album3/T12/T12_03.webp",
      "art/slideshows/album3/T12/T12_04.webp",
      "art/slideshows/album3/T12/T12_05.webp",
      "art/slideshows/album3/T12/T12_06.webp",
      "art/slideshows/album3/T12/T12_07.webp",
      "art/slideshows/album3/T12/T12_08.webp",
      "art/slideshows/album3/T12/T12_09.webp",
      "art/slideshows/album3/T12/T12_10.webp",
      "art/slideshows/album3/T12/T12_11.webp",
      "art/slideshows/album3/T12/T12_12.webp",
      "art/slideshows/album3/T12/T12_13.webp",
      "art/slideshows/album3/T12/T12_14.webp",
      "art/slideshows/album3/T12/T12_15.webp",
      "art/slideshows/album3/T12/T12_16.webp",
      "art/slideshows/album3/T12/T12_17.webp",
      "art/slideshows/album3/T12/T12_18.webp",
      "art/slideshows/album3/T12/T12_19.webp",
    ],
  },
  {
    id: "T13",
    title: "Identity",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T13/T13_00_title.webp",
      "art/slideshows/album3/T13/T13_01.webp",
      "art/slideshows/album3/T13/T13_02.webp",
      "art/slideshows/album3/T13/T13_03.webp",
      "art/slideshows/album3/T13/T13_04.webp",
      "art/slideshows/album3/T13/T13_05.webp",
      "art/slideshows/album3/T13/T13_06.webp",
      "art/slideshows/album3/T13/T13_07.webp",
      "art/slideshows/album3/T13/T13_08.webp",
      "art/slideshows/album3/T13/T13_09.webp",
      "art/slideshows/album3/T13/T13_10.webp",
      "art/slideshows/album3/T13/T13_11.webp",
      "art/slideshows/album3/T13/T13_12.webp",
      "art/slideshows/album3/T13/T13_13.webp",
      "art/slideshows/album3/T13/T13_14.webp",
      "art/slideshows/album3/T13/T13_15.webp",
      "art/slideshows/album3/T13/T13_16.webp",
      "art/slideshows/album3/T13/T13_17.webp",
      "art/slideshows/album3/T13/T13_18.webp",
      "art/slideshows/album3/T13/T13_19.webp",
      "art/slideshows/album3/T13/T13_20.webp",
      "art/slideshows/album3/T13/T13_21.webp",
      "art/slideshows/album3/T13/T13_22.webp",
      "art/slideshows/album3/T13/T13_23.webp",
      "art/slideshows/album3/T13/T13_24.webp",
      "art/slideshows/album3/T13/T13_25.webp",
      "art/slideshows/album3/T13/T13_26.webp",
      "art/slideshows/album3/T13/T13_27.webp",
      "art/slideshows/album3/T13/T13_28.webp",
      "art/slideshows/album3/T13/T13_29.webp",
    ],
  },
  {
    id: "T14",
    title: "The Lion in Black",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album3/T14/T14_00_title.webp",
      "art/slideshows/album3/T14/T14_01.webp",
      "art/slideshows/album3/T14/T14_02.webp",
      "art/slideshows/album3/T14/T14_03.webp",
      "art/slideshows/album3/T14/T14_04.webp",
      "art/slideshows/album3/T14/T14_05.webp",
      "art/slideshows/album3/T14/T14_06.webp",
      "art/slideshows/album3/T14/T14_07.webp",
      "art/slideshows/album3/T14/T14_08.webp",
      "art/slideshows/album3/T14/T14_09.webp",
      "art/slideshows/album3/T14/T14_10.webp",
      "art/slideshows/album3/T14/T14_11.webp",
      "art/slideshows/album3/T14/T14_12.webp",
      "art/slideshows/album3/T14/T14_13.webp",
      "art/slideshows/album3/T14/T14_14.webp",
      "art/slideshows/album3/T14/T14_15.webp",
      "art/slideshows/album3/T14/T14_16.webp",
      "art/slideshows/album3/T14/T14_17.webp",
      "art/slideshows/album3/T14/T14_18.webp",
      "art/slideshows/album3/T14/T14_19.webp",
      "art/slideshows/album3/T14/T14_20.webp",
      "art/slideshows/album3/T14/T14_21.webp",
      "art/slideshows/album3/T14/T14_22.webp",
      "art/slideshows/album3/T14/T14_23.webp",
      "art/slideshows/album3/T14/T14_24.webp",
    ],
  },
  {
    id: "T15",
    title: "Nondenominational",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T15/T15_00_title.webp",
      "art/slideshows/album3/T15/T15_01.webp",
      "art/slideshows/album3/T15/T15_02.webp",
      "art/slideshows/album3/T15/T15_03.webp",
      "art/slideshows/album3/T15/T15_04.webp",
      "art/slideshows/album3/T15/T15_05.webp",
      "art/slideshows/album3/T15/T15_06.webp",
      "art/slideshows/album3/T15/T15_07.webp",
      "art/slideshows/album3/T15/T15_08.webp",
      "art/slideshows/album3/T15/T15_09.webp",
      "art/slideshows/album3/T15/T15_10.webp",
      "art/slideshows/album3/T15/T15_11.webp",
      "art/slideshows/album3/T15/T15_12.webp",
      "art/slideshows/album3/T15/T15_13.webp",
      "art/slideshows/album3/T15/T15_14.webp",
      "art/slideshows/album3/T15/T15_15.webp",
      "art/slideshows/album3/T15/T15_16.webp",
      "art/slideshows/album3/T15/T15_17.webp",
      "art/slideshows/album3/T15/T15_18.webp",
      "art/slideshows/album3/T15/T15_19.webp",
    ],
  },
  {
    id: "T16",
    title: "Paradise Lost",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T16/T16_00_title.webp",
      "art/slideshows/album3/T16/T16_01.webp",
      "art/slideshows/album3/T16/T16_02.webp",
      "art/slideshows/album3/T16/T16_03.webp",
      "art/slideshows/album3/T16/T16_04.webp",
      "art/slideshows/album3/T16/T16_05.webp",
      "art/slideshows/album3/T16/T16_06.webp",
      "art/slideshows/album3/T16/T16_07.webp",
      "art/slideshows/album3/T16/T16_08.webp",
      "art/slideshows/album3/T16/T16_09.webp",
      "art/slideshows/album3/T16/T16_10.webp",
      "art/slideshows/album3/T16/T16_11.webp",
      "art/slideshows/album3/T16/T16_12.webp",
      "art/slideshows/album3/T16/T16_13.webp",
      "art/slideshows/album3/T16/T16_14.webp",
      "art/slideshows/album3/T16/T16_15.webp",
      "art/slideshows/album3/T16/T16_16.webp",
      "art/slideshows/album3/T16/T16_17.webp",
      "art/slideshows/album3/T16/T16_18.webp",
      "art/slideshows/album3/T16/T16_19.webp",
      "art/slideshows/album3/T16/T16_20.webp",
      "art/slideshows/album3/T16/T16_21.webp",
      "art/slideshows/album3/T16/T16_22.webp",
      "art/slideshows/album3/T16/T16_23.webp",
      "art/slideshows/album3/T16/T16_24.webp",
      "art/slideshows/album3/T16/T16_25.webp",
      "art/slideshows/album3/T16/T16_26.webp",
      "art/slideshows/album3/T16/T16_27.webp",
      "art/slideshows/album3/T16/T16_28.webp",
      "art/slideshows/album3/T16/T16_29.webp",
    ],
  },
  {
    id: "T17",
    title: "Usikue MSHY (Keep a Girl in School)",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T17/T17_00_title.webp",
      "art/slideshows/album3/T17/T17_01.webp",
      "art/slideshows/album3/T17/T17_02.webp",
      "art/slideshows/album3/T17/T17_03.webp",
      "art/slideshows/album3/T17/T17_04.webp",
      "art/slideshows/album3/T17/T17_05.webp",
      "art/slideshows/album3/T17/T17_06.webp",
      "art/slideshows/album3/T17/T17_07.webp",
      "art/slideshows/album3/T17/T17_08.webp",
      "art/slideshows/album3/T17/T17_09.webp",
      "art/slideshows/album3/T17/T17_10.webp",
      "art/slideshows/album3/T17/T17_11.webp",
      "art/slideshows/album3/T17/T17_12.webp",
      "art/slideshows/album3/T17/T17_13.webp",
      "art/slideshows/album3/T17/T17_14.webp",
      "art/slideshows/album3/T17/T17_15.webp",
      "art/slideshows/album3/T17/T17_16.webp",
      "art/slideshows/album3/T17/T17_17.webp",
      "art/slideshows/album3/T17/T17_18.webp",
      "art/slideshows/album3/T17/T17_19.webp",
    ],
  },
  {
    id: "T18",
    title: "Noxicans",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T18/T18_00_title.webp",
      "art/slideshows/album3/T18/T18_01.webp",
      "art/slideshows/album3/T18/T18_02.webp",
      "art/slideshows/album3/T18/T18_03.webp",
      "art/slideshows/album3/T18/T18_04.webp",
      "art/slideshows/album3/T18/T18_05.webp",
      "art/slideshows/album3/T18/T18_06.webp",
      "art/slideshows/album3/T18/T18_07.webp",
      "art/slideshows/album3/T18/T18_08.webp",
      "art/slideshows/album3/T18/T18_09.webp",
      "art/slideshows/album3/T18/T18_10.webp",
      "art/slideshows/album3/T18/T18_11.webp",
      "art/slideshows/album3/T18/T18_12.webp",
      "art/slideshows/album3/T18/T18_13.webp",
      "art/slideshows/album3/T18/T18_14.webp",
      "art/slideshows/album3/T18/T18_15.webp",
      "art/slideshows/album3/T18/T18_16.webp",
      "art/slideshows/album3/T18/T18_17.webp",
      "art/slideshows/album3/T18/T18_18.webp",
      "art/slideshows/album3/T18/T18_19.webp",
    ],
  },
  {
    id: "T19",
    title: "The Secret of Words",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T19/T19_00_title.webp",
      "art/slideshows/album3/T19/T19_01.webp",
      "art/slideshows/album3/T19/T19_02.webp",
      "art/slideshows/album3/T19/T19_03.webp",
      "art/slideshows/album3/T19/T19_04.webp",
      "art/slideshows/album3/T19/T19_05.webp",
      "art/slideshows/album3/T19/T19_06.webp",
      "art/slideshows/album3/T19/T19_07.webp",
      "art/slideshows/album3/T19/T19_08.webp",
      "art/slideshows/album3/T19/T19_09.webp",
      "art/slideshows/album3/T19/T19_10.webp",
      "art/slideshows/album3/T19/T19_11.webp",
      "art/slideshows/album3/T19/T19_12.webp",
      "art/slideshows/album3/T19/T19_13.webp",
      "art/slideshows/album3/T19/T19_14.webp",
      "art/slideshows/album3/T19/T19_15.webp",
      "art/slideshows/album3/T19/T19_16.webp",
      "art/slideshows/album3/T19/T19_17.webp",
      "art/slideshows/album3/T19/T19_18.webp",
      "art/slideshows/album3/T19/T19_19.webp",
    ],
  },
  {
    id: "T20",
    title: "Interactive Faustian Life",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T20/T20_00_title.webp",
      "art/slideshows/album3/T20/T20_01.webp",
      "art/slideshows/album3/T20/T20_02.webp",
      "art/slideshows/album3/T20/T20_03.webp",
      "art/slideshows/album3/T20/T20_04.webp",
      "art/slideshows/album3/T20/T20_05.webp",
      "art/slideshows/album3/T20/T20_06.webp",
      "art/slideshows/album3/T20/T20_07.webp",
      "art/slideshows/album3/T20/T20_08.webp",
      "art/slideshows/album3/T20/T20_09.webp",
      "art/slideshows/album3/T20/T20_10.webp",
      "art/slideshows/album3/T20/T20_11.webp",
      "art/slideshows/album3/T20/T20_12.webp",
      "art/slideshows/album3/T20/T20_13.webp",
      "art/slideshows/album3/T20/T20_14.webp",
      "art/slideshows/album3/T20/T20_15.webp",
      "art/slideshows/album3/T20/T20_16.webp",
      "art/slideshows/album3/T20/T20_17.webp",
      "art/slideshows/album3/T20/T20_18.webp",
      "art/slideshows/album3/T20/T20_19.webp",
      "art/slideshows/album3/T20/T20_20.webp",
      "art/slideshows/album3/T20/T20_21.webp",
      "art/slideshows/album3/T20/T20_22.webp",
      "art/slideshows/album3/T20/T20_23.webp",
      "art/slideshows/album3/T20/T20_24.webp",
    ],
  },
  {
    id: "T21",
    title: "Deep Thoughts",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T21/T21_00_title.webp",
      "art/slideshows/album3/T21/T21_01.webp",
      "art/slideshows/album3/T21/T21_02.webp",
      "art/slideshows/album3/T21/T21_03.webp",
      "art/slideshows/album3/T21/T21_04.webp",
      "art/slideshows/album3/T21/T21_05.webp",
      "art/slideshows/album3/T21/T21_06.webp",
      "art/slideshows/album3/T21/T21_07.webp",
      "art/slideshows/album3/T21/T21_08.webp",
      "art/slideshows/album3/T21/T21_09.webp",
      "art/slideshows/album3/T21/T21_10.webp",
      "art/slideshows/album3/T21/T21_11.webp",
      "art/slideshows/album3/T21/T21_12.webp",
      "art/slideshows/album3/T21/T21_13.webp",
      "art/slideshows/album3/T21/T21_14.webp",
      "art/slideshows/album3/T21/T21_15.webp",
      "art/slideshows/album3/T21/T21_16.webp",
      "art/slideshows/album3/T21/T21_17.webp",
      "art/slideshows/album3/T21/T21_18.webp",
      "art/slideshows/album3/T21/T21_19.webp",
      "art/slideshows/album3/T21/T21_20.webp",
      "art/slideshows/album3/T21/T21_21.webp",
      "art/slideshows/album3/T21/T21_22.webp",
      "art/slideshows/album3/T21/T21_23.webp",
      "art/slideshows/album3/T21/T21_24.webp",
      "art/slideshows/album3/T21/T21_25.webp",
      "art/slideshows/album3/T21/T21_26.webp",
      "art/slideshows/album3/T21/T21_27.webp",
      "art/slideshows/album3/T21/T21_28.webp",
      "art/slideshows/album3/T21/T21_29.webp",
      "art/slideshows/album3/T21/T21_30.webp",
      "art/slideshows/album3/T21/T21_31.webp",
      "art/slideshows/album3/T21/T21_32.webp",
      "art/slideshows/album3/T21/T21_33.webp",
      "art/slideshows/album3/T21/T21_34.webp",
      "art/slideshows/album3/T21/T21_35.webp",
      "art/slideshows/album3/T21/T21_36.webp",
      "art/slideshows/album3/T21/T21_37.webp",
      "art/slideshows/album3/T21/T21_38.webp",
      "art/slideshows/album3/T21/T21_39.webp",
    ],
  },
  {
    id: "T22",
    title: "Family Tree",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album3/T22/T22_00_title.webp",
      "art/slideshows/album3/T22/T22_01.webp",
      "art/slideshows/album3/T22/T22_02.webp",
      "art/slideshows/album3/T22/T22_03.webp",
      "art/slideshows/album3/T22/T22_04.webp",
      "art/slideshows/album3/T22/T22_05.webp",
      "art/slideshows/album3/T22/T22_06.webp",
      "art/slideshows/album3/T22/T22_07.webp",
      "art/slideshows/album3/T22/T22_08.webp",
      "art/slideshows/album3/T22/T22_09.webp",
      "art/slideshows/album3/T22/T22_10.webp",
      "art/slideshows/album3/T22/T22_11.webp",
      "art/slideshows/album3/T22/T22_12.webp",
      "art/slideshows/album3/T22/T22_13.webp",
      "art/slideshows/album3/T22/T22_14.webp",
      "art/slideshows/album3/T22/T22_15.webp",
      "art/slideshows/album3/T22/T22_16.webp",
      "art/slideshows/album3/T22/T22_17.webp",
      "art/slideshows/album3/T22/T22_18.webp",
      "art/slideshows/album3/T22/T22_19.webp",
    ],
  },
];

/* Tracks expose a frame-array per entry rather than a single path,
   so the manifest helper's urlOf can't be reused as-is. We still take
   the byId map + byField filter from it; the per-frame resolver
   stays bespoke (it's a frame-N array index, not a field lookup). */
const ALBUM3_MANIFEST = makeAssetManifest(ALBUM3_TRACKS, "id", "title");

/** Resolve a track's title-card URL (the first frame). */
export function album3TitleUrl(id: Album3TrackId): string | undefined {
  const t = ALBUM3_MANIFEST.byId.get(id);
  return t ? assetUrl(t.frameRelPaths[0]) : undefined;
}

/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */
export function album3FrameUrl(id: Album3TrackId, frame: number): string | undefined {
  const t = ALBUM3_MANIFEST.byId.get(id);
  if (!t) return undefined;
  const path = t.frameRelPaths[frame - 1];
  return path ? assetUrl(path) : undefined;
}

/** All resolved URLs for a track in producer beat-order. */
export function album3FrameUrls(id: Album3TrackId): readonly string[] {
  const t = ALBUM3_MANIFEST.byId.get(id);
  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];
}

/** Tracks that belong to a given thematic act (1..3 for Album 3;
    type accepts 1..5 to stay compatible with the other albums). */
export function album3TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album3TrackDef[] {
  return ALBUM3_MANIFEST.byField("act", act);
}

export const ALBUM3_TRACK_TOTAL = 22;
export const ALBUM3_FRAME_TOTAL = 567;
