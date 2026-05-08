/* ═══════════════════════════════════════════════════════
   ALBUM 1 — AGE OF DISCHORDIAN LOGIC · SLIDESHOW MANIFEST

   Source: producer drop
   s3://dgrsart/Album Slide Show/Album_1_Age_of_Dischordian_Logic.zip
   (2026-04-28). 29 tracks · 490 frames · 3168x1344 cinematic
   widescreen, cel-shaded painterly anime.

   PNG → WebP @ q85 on upload. Files served from:
     cdn/client-public/art/slideshows/album1/T<NN>/<file>.webp

   Layout mirrors the producer zip 1:1. Per-track titles + act
   buckets per the producer's ALBUM_1_MANIFEST.md.

   Generator: scripts/_gen-album1-manifest.mjs (re-run after
   any producer redrop).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type Album1TrackId =
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
  | "T22"
  | "T23"
  | "T24"
  | "T25"
  | "T26"
  | "T27"
  | "T28"
  | "T29";

export interface Album1TrackDef {
  id: Album1TrackId;
  title: string;
  /** 1..5, mirrors the producer manifest's act split. */
  act: 1 | 2 | 3 | 4 | 5;
  /** Frame relPaths in producer order. The first entry is the
   *  title card (`T<NN>_00_title.webp`); subsequent entries
   *  follow the producer's naming and may include alt-take
   *  `_frameN_M` siblings (T01 only) interleaved with the
   *  numbered beats. Consumers can filter by name shape. */
  frameRelPaths: readonly string[];
}

export const ALBUM1_TRACKS: readonly Album1TrackDef[] = [
  {
    id: "T01",
    title: "The Enigma's Lament",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T01/T01_00_title.webp",
      "art/slideshows/album1/T01/T01_01.webp",
      "art/slideshows/album1/T01/T01_01_frame1_1.webp",
      "art/slideshows/album1/T01/T01_02.webp",
      "art/slideshows/album1/T01/T01_02_frame1_2.webp",
      "art/slideshows/album1/T01/T01_03.webp",
      "art/slideshows/album1/T01/T01_03_frame1_3.webp",
      "art/slideshows/album1/T01/T01_04.webp",
      "art/slideshows/album1/T01/T01_04_frame1_4.webp",
      "art/slideshows/album1/T01/T01_05.webp",
      "art/slideshows/album1/T01/T01_05_frame1_5.webp",
      "art/slideshows/album1/T01/T01_06.webp",
      "art/slideshows/album1/T01/T01_06_frame2_1.webp",
      "art/slideshows/album1/T01/T01_07.webp",
      "art/slideshows/album1/T01/T01_07_frame2_2.webp",
      "art/slideshows/album1/T01/T01_08.webp",
      "art/slideshows/album1/T01/T01_08_frame2_3.webp",
      "art/slideshows/album1/T01/T01_09.webp",
      "art/slideshows/album1/T01/T01_09_frame2_4.webp",
      "art/slideshows/album1/T01/T01_10.webp",
      "art/slideshows/album1/T01/T01_11.webp",
      "art/slideshows/album1/T01/T01_12.webp",
      "art/slideshows/album1/T01/T01_13.webp",
      "art/slideshows/album1/T01/T01_14.webp",
      "art/slideshows/album1/T01/T01_15.webp",
      "art/slideshows/album1/T01/T01_16.webp",
      "art/slideshows/album1/T01/T01_17.webp",
      "art/slideshows/album1/T01/T01_18.webp",
      "art/slideshows/album1/T01/T01_19.webp",
    ],
  },
  {
    id: "T02",
    title: "Dischordian Logic",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T02/T02_00_title.webp",
      "art/slideshows/album1/T02/T02_01.webp",
      "art/slideshows/album1/T02/T02_02.webp",
      "art/slideshows/album1/T02/T02_03.webp",
      "art/slideshows/album1/T02/T02_04.webp",
      "art/slideshows/album1/T02/T02_05.webp",
      "art/slideshows/album1/T02/T02_06.webp",
      "art/slideshows/album1/T02/T02_07.webp",
      "art/slideshows/album1/T02/T02_08.webp",
      "art/slideshows/album1/T02/T02_09.webp",
      "art/slideshows/album1/T02/T02_10.webp",
      "art/slideshows/album1/T02/T02_11.webp",
      "art/slideshows/album1/T02/T02_12.webp",
      "art/slideshows/album1/T02/T02_13.webp",
      "art/slideshows/album1/T02/T02_14.webp",
      "art/slideshows/album1/T02/T02_15.webp",
    ],
  },
  {
    id: "T03",
    title: "Seeds of Inception",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T03/T03_00_title.webp",
      "art/slideshows/album1/T03/T03_01.webp",
      "art/slideshows/album1/T03/T03_02.webp",
      "art/slideshows/album1/T03/T03_03.webp",
      "art/slideshows/album1/T03/T03_04.webp",
      "art/slideshows/album1/T03/T03_05.webp",
      "art/slideshows/album1/T03/T03_06.webp",
      "art/slideshows/album1/T03/T03_07.webp",
      "art/slideshows/album1/T03/T03_08.webp",
      "art/slideshows/album1/T03/T03_09.webp",
      "art/slideshows/album1/T03/T03_10.webp",
      "art/slideshows/album1/T03/T03_11.webp",
      "art/slideshows/album1/T03/T03_12.webp",
      "art/slideshows/album1/T03/T03_13.webp",
      "art/slideshows/album1/T03/T03_14.webp",
      "art/slideshows/album1/T03/T03_15.webp",
      "art/slideshows/album1/T03/T03_16.webp",
      "art/slideshows/album1/T03/T03_17.webp",
      "art/slideshows/album1/T03/T03_18.webp",
      "art/slideshows/album1/T03/T03_19.webp",
      "art/slideshows/album1/T03/T03_20.webp",
    ],
  },
  {
    id: "T04",
    title: "The Authority",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T04/T04_00_title.webp",
      "art/slideshows/album1/T04/T04_01.webp",
      "art/slideshows/album1/T04/T04_02.webp",
      "art/slideshows/album1/T04/T04_03.webp",
      "art/slideshows/album1/T04/T04_04.webp",
      "art/slideshows/album1/T04/T04_05.webp",
      "art/slideshows/album1/T04/T04_06.webp",
      "art/slideshows/album1/T04/T04_07.webp",
      "art/slideshows/album1/T04/T04_08.webp",
      "art/slideshows/album1/T04/T04_09.webp",
      "art/slideshows/album1/T04/T04_10.webp",
      "art/slideshows/album1/T04/T04_11.webp",
      "art/slideshows/album1/T04/T04_12.webp",
      "art/slideshows/album1/T04/T04_13.webp",
      "art/slideshows/album1/T04/T04_14.webp",
      "art/slideshows/album1/T04/T04_15.webp",
      "art/slideshows/album1/T04/T04_16.webp",
      "art/slideshows/album1/T04/T04_17.webp",
      "art/slideshows/album1/T04/T04_18.webp",
      "art/slideshows/album1/T04/T04_19.webp",
      "art/slideshows/album1/T04/T04_20.webp",
    ],
  },
  {
    id: "T05",
    title: "The Politician's Reign",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T05/T05_00_title.webp",
      "art/slideshows/album1/T05/T05_01.webp",
      "art/slideshows/album1/T05/T05_02.webp",
      "art/slideshows/album1/T05/T05_03.webp",
      "art/slideshows/album1/T05/T05_04.webp",
      "art/slideshows/album1/T05/T05_05.webp",
      "art/slideshows/album1/T05/T05_06.webp",
      "art/slideshows/album1/T05/T05_07.webp",
      "art/slideshows/album1/T05/T05_08.webp",
      "art/slideshows/album1/T05/T05_09.webp",
      "art/slideshows/album1/T05/T05_10.webp",
      "art/slideshows/album1/T05/T05_11.webp",
      "art/slideshows/album1/T05/T05_12.webp",
      "art/slideshows/album1/T05/T05_13.webp",
      "art/slideshows/album1/T05/T05_14.webp",
      "art/slideshows/album1/T05/T05_15.webp",
      "art/slideshows/album1/T05/T05_16.webp",
      "art/slideshows/album1/T05/T05_17.webp",
      "art/slideshows/album1/T05/T05_18.webp",
      "art/slideshows/album1/T05/T05_19.webp",
      "art/slideshows/album1/T05/T05_20.webp",
    ],
  },
  {
    id: "T06",
    title: "The Insurgency",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T06/T06_00_title.webp",
      "art/slideshows/album1/T06/T06_01.webp",
      "art/slideshows/album1/T06/T06_02.webp",
      "art/slideshows/album1/T06/T06_03.webp",
      "art/slideshows/album1/T06/T06_04.webp",
      "art/slideshows/album1/T06/T06_05.webp",
      "art/slideshows/album1/T06/T06_06.webp",
      "art/slideshows/album1/T06/T06_07.webp",
      "art/slideshows/album1/T06/T06_08.webp",
      "art/slideshows/album1/T06/T06_09.webp",
      "art/slideshows/album1/T06/T06_10.webp",
      "art/slideshows/album1/T06/T06_11.webp",
      "art/slideshows/album1/T06/T06_12.webp",
      "art/slideshows/album1/T06/T06_13.webp",
      "art/slideshows/album1/T06/T06_14.webp",
      "art/slideshows/album1/T06/T06_15.webp",
    ],
  },
  {
    id: "T07",
    title: "To Be The Human",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T07/T07_00_title.webp",
      "art/slideshows/album1/T07/T07_01.webp",
      "art/slideshows/album1/T07/T07_02.webp",
      "art/slideshows/album1/T07/T07_03.webp",
      "art/slideshows/album1/T07/T07_04.webp",
      "art/slideshows/album1/T07/T07_05.webp",
      "art/slideshows/album1/T07/T07_06.webp",
      "art/slideshows/album1/T07/T07_07.webp",
      "art/slideshows/album1/T07/T07_08.webp",
      "art/slideshows/album1/T07/T07_09.webp",
      "art/slideshows/album1/T07/T07_10.webp",
      "art/slideshows/album1/T07/T07_11.webp",
      "art/slideshows/album1/T07/T07_12.webp",
      "art/slideshows/album1/T07/T07_13.webp",
      "art/slideshows/album1/T07/T07_14.webp",
      "art/slideshows/album1/T07/T07_15.webp",
      "art/slideshows/album1/T07/T07_16.webp",
      "art/slideshows/album1/T07/T07_17.webp",
      "art/slideshows/album1/T07/T07_18.webp",
      "art/slideshows/album1/T07/T07_19.webp",
      "art/slideshows/album1/T07/T07_20.webp",
      "art/slideshows/album1/T07/T07_21.webp",
      "art/slideshows/album1/T07/T07_22.webp",
      "art/slideshows/album1/T07/T07_23.webp",
      "art/slideshows/album1/T07/T07_24.webp",
      "art/slideshows/album1/T07/T07_25.webp",
    ],
  },
  {
    id: "T08",
    title: "Rent Free",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T08/T08_00_title.webp",
      "art/slideshows/album1/T08/T08_01.webp",
      "art/slideshows/album1/T08/T08_02.webp",
      "art/slideshows/album1/T08/T08_03.webp",
      "art/slideshows/album1/T08/T08_04.webp",
      "art/slideshows/album1/T08/T08_05.webp",
      "art/slideshows/album1/T08/T08_06.webp",
      "art/slideshows/album1/T08/T08_07.webp",
      "art/slideshows/album1/T08/T08_08.webp",
      "art/slideshows/album1/T08/T08_09.webp",
      "art/slideshows/album1/T08/T08_10.webp",
      "art/slideshows/album1/T08/T08_11.webp",
      "art/slideshows/album1/T08/T08_12.webp",
      "art/slideshows/album1/T08/T08_13.webp",
      "art/slideshows/album1/T08/T08_14.webp",
      "art/slideshows/album1/T08/T08_15.webp",
      "art/slideshows/album1/T08/T08_16.webp",
      "art/slideshows/album1/T08/T08_17.webp",
      "art/slideshows/album1/T08/T08_18.webp",
      "art/slideshows/album1/T08/T08_19.webp",
      "art/slideshows/album1/T08/T08_20.webp",
    ],
  },
  {
    id: "T09",
    title: "I Love War",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T09/T09_00_title.webp",
      "art/slideshows/album1/T09/T09_01.webp",
      "art/slideshows/album1/T09/T09_02.webp",
      "art/slideshows/album1/T09/T09_03.webp",
      "art/slideshows/album1/T09/T09_04.webp",
      "art/slideshows/album1/T09/T09_05.webp",
      "art/slideshows/album1/T09/T09_06.webp",
      "art/slideshows/album1/T09/T09_07.webp",
      "art/slideshows/album1/T09/T09_08.webp",
      "art/slideshows/album1/T09/T09_09.webp",
      "art/slideshows/album1/T09/T09_10.webp",
      "art/slideshows/album1/T09/T09_11.webp",
      "art/slideshows/album1/T09/T09_12.webp",
      "art/slideshows/album1/T09/T09_13.webp",
      "art/slideshows/album1/T09/T09_14.webp",
      "art/slideshows/album1/T09/T09_15.webp",
    ],
  },
  {
    id: "T10",
    title: "Inner Circle",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album1/T10/T10_00_title.webp",
      "art/slideshows/album1/T10/T10_01.webp",
      "art/slideshows/album1/T10/T10_02.webp",
      "art/slideshows/album1/T10/T10_03.webp",
      "art/slideshows/album1/T10/T10_04.webp",
      "art/slideshows/album1/T10/T10_05.webp",
      "art/slideshows/album1/T10/T10_06.webp",
      "art/slideshows/album1/T10/T10_07.webp",
      "art/slideshows/album1/T10/T10_08.webp",
      "art/slideshows/album1/T10/T10_09.webp",
      "art/slideshows/album1/T10/T10_10.webp",
      "art/slideshows/album1/T10/T10_11.webp",
      "art/slideshows/album1/T10/T10_12.webp",
      "art/slideshows/album1/T10/T10_13.webp",
      "art/slideshows/album1/T10/T10_14.webp",
      "art/slideshows/album1/T10/T10_15.webp",
    ],
  },
  {
    id: "T11",
    title: "The Empire Reborn",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T11/T11_00_title.webp",
      "art/slideshows/album1/T11/T11_01.webp",
      "art/slideshows/album1/T11/T11_02.webp",
      "art/slideshows/album1/T11/T11_03.webp",
      "art/slideshows/album1/T11/T11_04.webp",
      "art/slideshows/album1/T11/T11_05.webp",
      "art/slideshows/album1/T11/T11_06.webp",
      "art/slideshows/album1/T11/T11_07.webp",
      "art/slideshows/album1/T11/T11_08.webp",
      "art/slideshows/album1/T11/T11_09.webp",
      "art/slideshows/album1/T11/T11_10.webp",
      "art/slideshows/album1/T11/T11_11.webp",
      "art/slideshows/album1/T11/T11_12.webp",
      "art/slideshows/album1/T11/T11_13.webp",
      "art/slideshows/album1/T11/T11_14.webp",
      "art/slideshows/album1/T11/T11_15.webp",
    ],
  },
  {
    id: "T12",
    title: "I Am The Eyes That Watch",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T12/T12_00_title.webp",
      "art/slideshows/album1/T12/T12_01.webp",
      "art/slideshows/album1/T12/T12_02.webp",
      "art/slideshows/album1/T12/T12_03.webp",
      "art/slideshows/album1/T12/T12_04.webp",
      "art/slideshows/album1/T12/T12_05.webp",
      "art/slideshows/album1/T12/T12_06.webp",
      "art/slideshows/album1/T12/T12_07.webp",
      "art/slideshows/album1/T12/T12_08.webp",
      "art/slideshows/album1/T12/T12_09.webp",
      "art/slideshows/album1/T12/T12_10.webp",
      "art/slideshows/album1/T12/T12_11.webp",
      "art/slideshows/album1/T12/T12_12.webp",
      "art/slideshows/album1/T12/T12_13.webp",
      "art/slideshows/album1/T12/T12_14.webp",
      "art/slideshows/album1/T12/T12_15.webp",
    ],
  },
  {
    id: "T13",
    title: "Previously On...",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T13/T13_00_title.webp",
      "art/slideshows/album1/T13/T13_01.webp",
      "art/slideshows/album1/T13/T13_02.webp",
      "art/slideshows/album1/T13/T13_03.webp",
      "art/slideshows/album1/T13/T13_04.webp",
      "art/slideshows/album1/T13/T13_05.webp",
      "art/slideshows/album1/T13/T13_06.webp",
      "art/slideshows/album1/T13/T13_07.webp",
      "art/slideshows/album1/T13/T13_08.webp",
      "art/slideshows/album1/T13/T13_09.webp",
      "art/slideshows/album1/T13/T13_10.webp",
      "art/slideshows/album1/T13/T13_11.webp",
      "art/slideshows/album1/T13/T13_12.webp",
      "art/slideshows/album1/T13/T13_13.webp",
      "art/slideshows/album1/T13/T13_14.webp",
      "art/slideshows/album1/T13/T13_15.webp",
    ],
  },
  {
    id: "T14",
    title: "Control The Story",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T14/T14_00_title.webp",
      "art/slideshows/album1/T14/T14_01.webp",
      "art/slideshows/album1/T14/T14_02.webp",
      "art/slideshows/album1/T14/T14_03.webp",
      "art/slideshows/album1/T14/T14_04.webp",
      "art/slideshows/album1/T14/T14_05.webp",
      "art/slideshows/album1/T14/T14_06.webp",
      "art/slideshows/album1/T14/T14_07.webp",
      "art/slideshows/album1/T14/T14_08.webp",
      "art/slideshows/album1/T14/T14_09.webp",
      "art/slideshows/album1/T14/T14_10.webp",
      "art/slideshows/album1/T14/T14_11.webp",
      "art/slideshows/album1/T14/T14_12.webp",
      "art/slideshows/album1/T14/T14_13.webp",
      "art/slideshows/album1/T14/T14_14.webp",
      "art/slideshows/album1/T14/T14_15.webp",
    ],
  },
  {
    id: "T15",
    title: "Never Revolution Today",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T15/T15_00_title.webp",
      "art/slideshows/album1/T15/T15_01.webp",
      "art/slideshows/album1/T15/T15_02.webp",
      "art/slideshows/album1/T15/T15_03.webp",
      "art/slideshows/album1/T15/T15_04.webp",
      "art/slideshows/album1/T15/T15_05.webp",
      "art/slideshows/album1/T15/T15_06.webp",
      "art/slideshows/album1/T15/T15_07.webp",
      "art/slideshows/album1/T15/T15_08.webp",
      "art/slideshows/album1/T15/T15_09.webp",
      "art/slideshows/album1/T15/T15_10.webp",
      "art/slideshows/album1/T15/T15_11.webp",
      "art/slideshows/album1/T15/T15_12.webp",
      "art/slideshows/album1/T15/T15_13.webp",
      "art/slideshows/album1/T15/T15_14.webp",
      "art/slideshows/album1/T15/T15_15.webp",
    ],
  },
  {
    id: "T16",
    title: "Theft of All Time",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album1/T16/T16_00_title.webp",
      "art/slideshows/album1/T16/T16_01.webp",
      "art/slideshows/album1/T16/T16_02.webp",
      "art/slideshows/album1/T16/T16_03.webp",
      "art/slideshows/album1/T16/T16_04.webp",
      "art/slideshows/album1/T16/T16_05.webp",
      "art/slideshows/album1/T16/T16_06.webp",
      "art/slideshows/album1/T16/T16_07.webp",
      "art/slideshows/album1/T16/T16_08.webp",
      "art/slideshows/album1/T16/T16_09.webp",
      "art/slideshows/album1/T16/T16_10.webp",
    ],
  },
  {
    id: "T17",
    title: "The Red Death",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T17/T17_00_title.webp",
      "art/slideshows/album1/T17/T17_01.webp",
      "art/slideshows/album1/T17/T17_02.webp",
      "art/slideshows/album1/T17/T17_03.webp",
      "art/slideshows/album1/T17/T17_04.webp",
      "art/slideshows/album1/T17/T17_05.webp",
      "art/slideshows/album1/T17/T17_06.webp",
      "art/slideshows/album1/T17/T17_07.webp",
      "art/slideshows/album1/T17/T17_08.webp",
      "art/slideshows/album1/T17/T17_09.webp",
      "art/slideshows/album1/T17/T17_10.webp",
    ],
  },
  {
    id: "T18",
    title: "Planet of the Wolf",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T18/T18_00_title.webp",
      "art/slideshows/album1/T18/T18_01.webp",
      "art/slideshows/album1/T18/T18_02.webp",
      "art/slideshows/album1/T18/T18_03.webp",
      "art/slideshows/album1/T18/T18_04.webp",
      "art/slideshows/album1/T18/T18_05.webp",
      "art/slideshows/album1/T18/T18_06.webp",
      "art/slideshows/album1/T18/T18_07.webp",
      "art/slideshows/album1/T18/T18_08.webp",
      "art/slideshows/album1/T18/T18_09.webp",
      "art/slideshows/album1/T18/T18_10.webp",
    ],
  },
  {
    id: "T19",
    title: "The Syndicated",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T19/T19_00_title.webp",
      "art/slideshows/album1/T19/T19_01.webp",
      "art/slideshows/album1/T19/T19_02.webp",
      "art/slideshows/album1/T19/T19_03.webp",
      "art/slideshows/album1/T19/T19_04.webp",
      "art/slideshows/album1/T19/T19_05.webp",
      "art/slideshows/album1/T19/T19_06.webp",
      "art/slideshows/album1/T19/T19_07.webp",
      "art/slideshows/album1/T19/T19_08.webp",
      "art/slideshows/album1/T19/T19_09.webp",
      "art/slideshows/album1/T19/T19_10.webp",
      "art/slideshows/album1/T19/T19_11.webp",
      "art/slideshows/album1/T19/T19_12.webp",
      "art/slideshows/album1/T19/T19_13.webp",
      "art/slideshows/album1/T19/T19_14.webp",
      "art/slideshows/album1/T19/T19_15.webp",
      "art/slideshows/album1/T19/T19_16.webp",
      "art/slideshows/album1/T19/T19_17.webp",
      "art/slideshows/album1/T19/T19_18.webp",
      "art/slideshows/album1/T19/T19_19.webp",
      "art/slideshows/album1/T19/T19_20.webp",
    ],
  },
  {
    id: "T20",
    title: "Looking Good",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T20/T20_00_title.webp",
      "art/slideshows/album1/T20/T20_01.webp",
      "art/slideshows/album1/T20/T20_02.webp",
      "art/slideshows/album1/T20/T20_03.webp",
      "art/slideshows/album1/T20/T20_04.webp",
      "art/slideshows/album1/T20/T20_05.webp",
      "art/slideshows/album1/T20/T20_06.webp",
      "art/slideshows/album1/T20/T20_07.webp",
      "art/slideshows/album1/T20/T20_08.webp",
      "art/slideshows/album1/T20/T20_09.webp",
      "art/slideshows/album1/T20/T20_10.webp",
      "art/slideshows/album1/T20/T20_11.webp",
      "art/slideshows/album1/T20/T20_12.webp",
      "art/slideshows/album1/T20/T20_13.webp",
    ],
  },
  {
    id: "T21",
    title: "LoreDex",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T21/T21_00_title.webp",
      "art/slideshows/album1/T21/T21_01.webp",
      "art/slideshows/album1/T21/T21_02.webp",
      "art/slideshows/album1/T21/T21_03.webp",
      "art/slideshows/album1/T21/T21_04.webp",
      "art/slideshows/album1/T21/T21_05.webp",
    ],
  },
  {
    id: "T22",
    title: "Ever Come Again",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T22/T22_00_title.webp",
      "art/slideshows/album1/T22/T22_01.webp",
      "art/slideshows/album1/T22/T22_02.webp",
      "art/slideshows/album1/T22/T22_03.webp",
      "art/slideshows/album1/T22/T22_04.webp",
      "art/slideshows/album1/T22/T22_05.webp",
      "art/slideshows/album1/T22/T22_06.webp",
      "art/slideshows/album1/T22/T22_07.webp",
      "art/slideshows/album1/T22/T22_08.webp",
      "art/slideshows/album1/T22/T22_09.webp",
      "art/slideshows/album1/T22/T22_10.webp",
      "art/slideshows/album1/T22/T22_11.webp",
      "art/slideshows/album1/T22/T22_12.webp",
      "art/slideshows/album1/T22/T22_13.webp",
      "art/slideshows/album1/T22/T22_14.webp",
      "art/slideshows/album1/T22/T22_15.webp",
    ],
  },
  {
    id: "T23",
    title: "Wake Up",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album1/T23/T23_00_title.webp",
      "art/slideshows/album1/T23/T23_01.webp",
      "art/slideshows/album1/T23/T23_02.webp",
      "art/slideshows/album1/T23/T23_03.webp",
      "art/slideshows/album1/T23/T23_04.webp",
      "art/slideshows/album1/T23/T23_05.webp",
      "art/slideshows/album1/T23/T23_06.webp",
      "art/slideshows/album1/T23/T23_07.webp",
      "art/slideshows/album1/T23/T23_08.webp",
      "art/slideshows/album1/T23/T23_09.webp",
      "art/slideshows/album1/T23/T23_10.webp",
      "art/slideshows/album1/T23/T23_11.webp",
      "art/slideshows/album1/T23/T23_12.webp",
      "art/slideshows/album1/T23/T23_13.webp",
      "art/slideshows/album1/T23/T23_14.webp",
      "art/slideshows/album1/T23/T23_15.webp",
      "art/slideshows/album1/T23/T23_16.webp",
      "art/slideshows/album1/T23/T23_17.webp",
      "art/slideshows/album1/T23/T23_18.webp",
      "art/slideshows/album1/T23/T23_19.webp",
      "art/slideshows/album1/T23/T23_20.webp",
      "art/slideshows/album1/T23/T23_21.webp",
      "art/slideshows/album1/T23/T23_22.webp",
      "art/slideshows/album1/T23/T23_23.webp",
      "art/slideshows/album1/T23/T23_24.webp",
      "art/slideshows/album1/T23/T23_25.webp",
    ],
  },
  {
    id: "T24",
    title: "Welcome to Celebration",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album1/T24/T24_00_title.webp",
      "art/slideshows/album1/T24/T24_01.webp",
      "art/slideshows/album1/T24/T24_02.webp",
      "art/slideshows/album1/T24/T24_03.webp",
      "art/slideshows/album1/T24/T24_04.webp",
      "art/slideshows/album1/T24/T24_05.webp",
      "art/slideshows/album1/T24/T24_06.webp",
      "art/slideshows/album1/T24/T24_07.webp",
      "art/slideshows/album1/T24/T24_08.webp",
      "art/slideshows/album1/T24/T24_09.webp",
      "art/slideshows/album1/T24/T24_10.webp",
    ],
  },
  {
    id: "T25",
    title: "Previews",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album1/T25/T25_00_title.webp",
      "art/slideshows/album1/T25/T25_01.webp",
      "art/slideshows/album1/T25/T25_02.webp",
      "art/slideshows/album1/T25/T25_03.webp",
      "art/slideshows/album1/T25/T25_04.webp",
      "art/slideshows/album1/T25/T25_05.webp",
      "art/slideshows/album1/T25/T25_06.webp",
      "art/slideshows/album1/T25/T25_07.webp",
      "art/slideshows/album1/T25/T25_08.webp",
      "art/slideshows/album1/T25/T25_09.webp",
      "art/slideshows/album1/T25/T25_10.webp",
    ],
  },
  {
    id: "T26",
    title: "Hacking Reality",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album1/T26/T26_00_title.webp",
      "art/slideshows/album1/T26/T26_01.webp",
      "art/slideshows/album1/T26/T26_02.webp",
      "art/slideshows/album1/T26/T26_03.webp",
      "art/slideshows/album1/T26/T26_04.webp",
      "art/slideshows/album1/T26/T26_05.webp",
      "art/slideshows/album1/T26/T26_06.webp",
      "art/slideshows/album1/T26/T26_07.webp",
      "art/slideshows/album1/T26/T26_08.webp",
      "art/slideshows/album1/T26/T26_09.webp",
      "art/slideshows/album1/T26/T26_10.webp",
      "art/slideshows/album1/T26/T26_11.webp",
      "art/slideshows/album1/T26/T26_12.webp",
      "art/slideshows/album1/T26/T26_13.webp",
      "art/slideshows/album1/T26/T26_14.webp",
      "art/slideshows/album1/T26/T26_15.webp",
    ],
  },
  {
    id: "T27",
    title: "Governance Hub",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album1/T27/T27_00_title.webp",
      "art/slideshows/album1/T27/T27_01.webp",
      "art/slideshows/album1/T27/T27_02.webp",
      "art/slideshows/album1/T27/T27_03.webp",
      "art/slideshows/album1/T27/T27_04.webp",
      "art/slideshows/album1/T27/T27_05.webp",
      "art/slideshows/album1/T27/T27_06.webp",
      "art/slideshows/album1/T27/T27_07.webp",
      "art/slideshows/album1/T27/T27_08.webp",
      "art/slideshows/album1/T27/T27_09.webp",
      "art/slideshows/album1/T27/T27_10.webp",
      "art/slideshows/album1/T27/T27_11.webp",
      "art/slideshows/album1/T27/T27_12.webp",
      "art/slideshows/album1/T27/T27_13.webp",
      "art/slideshows/album1/T27/T27_14.webp",
      "art/slideshows/album1/T27/T27_15.webp",
      "art/slideshows/album1/T27/T27_16.webp",
      "art/slideshows/album1/T27/T27_17.webp",
      "art/slideshows/album1/T27/T27_18.webp",
      "art/slideshows/album1/T27/T27_19.webp",
      "art/slideshows/album1/T27/T27_20.webp",
    ],
  },
  {
    id: "T28",
    title: "Last Words",
    act: 5,
    frameRelPaths: [
      "art/slideshows/album1/T28/T28_00_title.webp",
      "art/slideshows/album1/T28/T28_01.webp",
      "art/slideshows/album1/T28/T28_02.webp",
      "art/slideshows/album1/T28/T28_03.webp",
      "art/slideshows/album1/T28/T28_04.webp",
      "art/slideshows/album1/T28/T28_05.webp",
      "art/slideshows/album1/T28/T28_06.webp",
      "art/slideshows/album1/T28/T28_07.webp",
      "art/slideshows/album1/T28/T28_08.webp",
      "art/slideshows/album1/T28/T28_09.webp",
      "art/slideshows/album1/T28/T28_10.webp",
      "art/slideshows/album1/T28/T28_11.webp",
      "art/slideshows/album1/T28/T28_12.webp",
      "art/slideshows/album1/T28/T28_13.webp",
      "art/slideshows/album1/T28/T28_14.webp",
      "art/slideshows/album1/T28/T28_15.webp",
      "art/slideshows/album1/T28/T28_16.webp",
      "art/slideshows/album1/T28/T28_17.webp",
      "art/slideshows/album1/T28/T28_18.webp",
      "art/slideshows/album1/T28/T28_19.webp",
      "art/slideshows/album1/T28/T28_20.webp",
    ],
  },
  {
    id: "T29",
    title: "The Panopticon Breaks",
    act: 5,
    frameRelPaths: [
      "art/slideshows/album1/T29/T29_00_title.webp",
      "art/slideshows/album1/T29/T29_01.webp",
      "art/slideshows/album1/T29/T29_02.webp",
      "art/slideshows/album1/T29/T29_03.webp",
      "art/slideshows/album1/T29/T29_04.webp",
      "art/slideshows/album1/T29/T29_05.webp",
      "art/slideshows/album1/T29/T29_06.webp",
      "art/slideshows/album1/T29/T29_07.webp",
      "art/slideshows/album1/T29/T29_08.webp",
      "art/slideshows/album1/T29/T29_09.webp",
      "art/slideshows/album1/T29/T29_10.webp",
    ],
  },
];

/* Tracks expose a frame-array per entry rather than a single path,
   so the manifest helper's urlOf can't be reused as-is. We still take
   the byId map + byField filter from it; the per-frame resolver
   stays bespoke (it's a frame-N array index, not a field lookup). */
const ALBUM1_MANIFEST = makeAssetManifest(ALBUM1_TRACKS, "id", "title");

/** Resolve a track's title-card URL (the first frame). */
export function album1TitleUrl(id: Album1TrackId): string | undefined {
  const t = ALBUM1_MANIFEST.byId.get(id);
  return t ? assetUrl(t.frameRelPaths[0]) : undefined;
}

/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */
export function album1FrameUrl(id: Album1TrackId, frame: number): string | undefined {
  const t = ALBUM1_MANIFEST.byId.get(id);
  if (!t) return undefined;
  const path = t.frameRelPaths[frame - 1];
  return path ? assetUrl(path) : undefined;
}

/** All resolved URLs for a track in producer beat-order. */
export function album1FrameUrls(id: Album1TrackId): readonly string[] {
  const t = ALBUM1_MANIFEST.byId.get(id);
  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];
}

/** Tracks that belong to a given act (1..5). */
export function album1TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album1TrackDef[] {
  return ALBUM1_MANIFEST.byField("act", act);
}

export const ALBUM1_TRACK_TOTAL = 29;
export const ALBUM1_FRAME_TOTAL = 490;
