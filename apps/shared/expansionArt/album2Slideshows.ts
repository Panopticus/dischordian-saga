/* ═══════════════════════════════════════════════════════
   ALBUM 2 — THE AGE OF PRIVACY · SLIDESHOW MANIFEST

   Source: producer drop
   s3://dgrsart/Album Slide Show/Album_2_Age_of_Privacy.zip
   (2026-04-29). 20 tracks · 334 frames · 3168x1344 cinematic
   widescreen, cel-shaded anime — Afro Samurai × Cowboy Bebop ×
   Cyberpunk Edgerunners.

   PNG → WebP @ q85 on upload. Files served from:
     cdn/client-public/art/slideshows/album2/T<NN>/<file>.webp

   Layout mirrors the producer zip 1:1. Per-track titles + act
   buckets per the producer's ALBUM_2_MANIFEST.md.

   Producer-flagged easter eggs (planted in the artwork — surface
   them as Loredex unlocks via discoveryFlags or first-discoverer
   registry):
     - Number 47 on NØX terminals + building addresses
     - Frog God mask graffiti throughout New Babylon
     - UHURU / UKWELI / NGUVU Swahili encryption (decode-able)
     - T20 Frame 4: Niemöller's Corridor
     - T20 Frame 6: Four Archons naming + function reveal
     - T20 Frame 7: Iron Lion sunrise apparition
     - T20 Frame 9: Track-name fragments in golden sound waves

   Generator: scripts/_gen-album2-manifest.mjs (re-run after
   any producer redrop).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type Album2TrackId =
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
  | "T20";

export interface Album2TrackDef {
  id: Album2TrackId;
  title: string;
  /** 1..5, mirrors the producer manifest's act split. */
  act: 1 | 2 | 3 | 4 | 5;
  /** Frame relPaths in producer order — title card first,
   *  then numbered beats. Album 2 has no alt-take siblings. */
  frameRelPaths: readonly string[];
}

export const ALBUM2_TRACKS: readonly Album2TrackDef[] = [
  {
    id: "T01",
    title: "NØNOS",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album2/T01/T01_00_title.webp",
      "art/slideshows/album2/T01/T01_01.webp",
      "art/slideshows/album2/T01/T01_02.webp",
      "art/slideshows/album2/T01/T01_03.webp",
      "art/slideshows/album2/T01/T01_04.webp",
      "art/slideshows/album2/T01/T01_05.webp",
      "art/slideshows/album2/T01/T01_06.webp",
      "art/slideshows/album2/T01/T01_07.webp",
      "art/slideshows/album2/T01/T01_08.webp",
      "art/slideshows/album2/T01/T01_09.webp",
      "art/slideshows/album2/T01/T01_10.webp",
      "art/slideshows/album2/T01/T01_11.webp",
      "art/slideshows/album2/T01/T01_12.webp",
      "art/slideshows/album2/T01/T01_13.webp",
      "art/slideshows/album2/T01/T01_14.webp",
      "art/slideshows/album2/T01/T01_15.webp",
      "art/slideshows/album2/T01/T01_16.webp",
      "art/slideshows/album2/T01/T01_17.webp",
      "art/slideshows/album2/T01/T01_18.webp",
      "art/slideshows/album2/T01/T01_19.webp",
      "art/slideshows/album2/T01/T01_20.webp",
      "art/slideshows/album2/T01/T01_21.webp",
      "art/slideshows/album2/T01/T01_22.webp",
      "art/slideshows/album2/T01/T01_23.webp",
      "art/slideshows/album2/T01/T01_24.webp",
      "art/slideshows/album2/T01/T01_25.webp",
    ],
  },
  {
    id: "T02",
    title: "Building the Architect",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album2/T02/T02_00_title.webp",
      "art/slideshows/album2/T02/T02_01.webp",
      "art/slideshows/album2/T02/T02_02.webp",
      "art/slideshows/album2/T02/T02_03.webp",
      "art/slideshows/album2/T02/T02_04.webp",
      "art/slideshows/album2/T02/T02_05.webp",
      "art/slideshows/album2/T02/T02_06.webp",
      "art/slideshows/album2/T02/T02_07.webp",
      "art/slideshows/album2/T02/T02_08.webp",
      "art/slideshows/album2/T02/T02_09.webp",
      "art/slideshows/album2/T02/T02_10.webp",
      "art/slideshows/album2/T02/T02_11.webp",
      "art/slideshows/album2/T02/T02_12.webp",
      "art/slideshows/album2/T02/T02_13.webp",
      "art/slideshows/album2/T02/T02_14.webp",
      "art/slideshows/album2/T02/T02_15.webp",
      "art/slideshows/album2/T02/T02_16.webp",
      "art/slideshows/album2/T02/T02_17.webp",
      "art/slideshows/album2/T02/T02_18.webp",
      "art/slideshows/album2/T02/T02_19.webp",
      "art/slideshows/album2/T02/T02_20.webp",
      "art/slideshows/album2/T02/T02_21.webp",
      "art/slideshows/album2/T02/T02_22.webp",
      "art/slideshows/album2/T02/T02_23.webp",
      "art/slideshows/album2/T02/T02_24.webp",
      "art/slideshows/album2/T02/T02_25.webp",
    ],
  },
  {
    id: "T03",
    title: "Rain",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album2/T03/T03_00_title.webp",
      "art/slideshows/album2/T03/T03_01.webp",
      "art/slideshows/album2/T03/T03_02.webp",
      "art/slideshows/album2/T03/T03_03.webp",
      "art/slideshows/album2/T03/T03_04.webp",
      "art/slideshows/album2/T03/T03_05.webp",
      "art/slideshows/album2/T03/T03_06.webp",
      "art/slideshows/album2/T03/T03_07.webp",
      "art/slideshows/album2/T03/T03_08.webp",
      "art/slideshows/album2/T03/T03_09.webp",
      "art/slideshows/album2/T03/T03_10.webp",
      "art/slideshows/album2/T03/T03_11.webp",
      "art/slideshows/album2/T03/T03_12.webp",
      "art/slideshows/album2/T03/T03_13.webp",
      "art/slideshows/album2/T03/T03_14.webp",
      "art/slideshows/album2/T03/T03_15.webp",
      "art/slideshows/album2/T03/T03_16.webp",
      "art/slideshows/album2/T03/T03_17.webp",
      "art/slideshows/album2/T03/T03_18.webp",
      "art/slideshows/album2/T03/T03_19.webp",
      "art/slideshows/album2/T03/T03_20.webp",
    ],
  },
  {
    id: "T04",
    title: "What Connects Us?",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album2/T04/T04_00_title.webp",
      "art/slideshows/album2/T04/T04_01.webp",
      "art/slideshows/album2/T04/T04_02.webp",
      "art/slideshows/album2/T04/T04_03.webp",
      "art/slideshows/album2/T04/T04_04.webp",
      "art/slideshows/album2/T04/T04_05.webp",
      "art/slideshows/album2/T04/T04_06.webp",
      "art/slideshows/album2/T04/T04_07.webp",
      "art/slideshows/album2/T04/T04_08.webp",
      "art/slideshows/album2/T04/T04_09.webp",
      "art/slideshows/album2/T04/T04_10.webp",
      "art/slideshows/album2/T04/T04_11.webp",
      "art/slideshows/album2/T04/T04_12.webp",
      "art/slideshows/album2/T04/T04_13.webp",
      "art/slideshows/album2/T04/T04_14.webp",
      "art/slideshows/album2/T04/T04_15.webp",
    ],
  },
  {
    id: "T05",
    title: "The Experiment",
    act: 1,
    frameRelPaths: [
      "art/slideshows/album2/T05/T05_00_title.webp",
      "art/slideshows/album2/T05/T05_01.webp",
      "art/slideshows/album2/T05/T05_02.webp",
      "art/slideshows/album2/T05/T05_03.webp",
      "art/slideshows/album2/T05/T05_04.webp",
      "art/slideshows/album2/T05/T05_05.webp",
      "art/slideshows/album2/T05/T05_06.webp",
      "art/slideshows/album2/T05/T05_07.webp",
      "art/slideshows/album2/T05/T05_08.webp",
      "art/slideshows/album2/T05/T05_09.webp",
      "art/slideshows/album2/T05/T05_10.webp",
      "art/slideshows/album2/T05/T05_11.webp",
      "art/slideshows/album2/T05/T05_12.webp",
      "art/slideshows/album2/T05/T05_13.webp",
      "art/slideshows/album2/T05/T05_14.webp",
      "art/slideshows/album2/T05/T05_15.webp",
      "art/slideshows/album2/T05/T05_16.webp",
      "art/slideshows/album2/T05/T05_17.webp",
      "art/slideshows/album2/T05/T05_18.webp",
      "art/slideshows/album2/T05/T05_19.webp",
      "art/slideshows/album2/T05/T05_20.webp",
      "art/slideshows/album2/T05/T05_21.webp",
      "art/slideshows/album2/T05/T05_22.webp",
      "art/slideshows/album2/T05/T05_23.webp",
      "art/slideshows/album2/T05/T05_24.webp",
      "art/slideshows/album2/T05/T05_25.webp",
    ],
  },
  {
    id: "T06",
    title: "Top Floor Door",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album2/T06/T06_00_title.webp",
      "art/slideshows/album2/T06/T06_01.webp",
      "art/slideshows/album2/T06/T06_02.webp",
      "art/slideshows/album2/T06/T06_03.webp",
      "art/slideshows/album2/T06/T06_04.webp",
      "art/slideshows/album2/T06/T06_05.webp",
      "art/slideshows/album2/T06/T06_06.webp",
      "art/slideshows/album2/T06/T06_07.webp",
      "art/slideshows/album2/T06/T06_08.webp",
      "art/slideshows/album2/T06/T06_09.webp",
      "art/slideshows/album2/T06/T06_10.webp",
      "art/slideshows/album2/T06/T06_11.webp",
      "art/slideshows/album2/T06/T06_12.webp",
      "art/slideshows/album2/T06/T06_13.webp",
      "art/slideshows/album2/T06/T06_14.webp",
      "art/slideshows/album2/T06/T06_15.webp",
      "art/slideshows/album2/T06/T06_16.webp",
      "art/slideshows/album2/T06/T06_17.webp",
      "art/slideshows/album2/T06/T06_18.webp",
      "art/slideshows/album2/T06/T06_19.webp",
      "art/slideshows/album2/T06/T06_20.webp",
    ],
  },
  {
    id: "T07",
    title: "Choose Your Mask",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album2/T07/T07_00_title.webp",
      "art/slideshows/album2/T07/T07_01.webp",
      "art/slideshows/album2/T07/T07_02.webp",
      "art/slideshows/album2/T07/T07_03.webp",
      "art/slideshows/album2/T07/T07_04.webp",
      "art/slideshows/album2/T07/T07_05.webp",
      "art/slideshows/album2/T07/T07_06.webp",
      "art/slideshows/album2/T07/T07_07.webp",
      "art/slideshows/album2/T07/T07_08.webp",
      "art/slideshows/album2/T07/T07_09.webp",
      "art/slideshows/album2/T07/T07_10.webp",
      "art/slideshows/album2/T07/T07_11.webp",
      "art/slideshows/album2/T07/T07_12.webp",
      "art/slideshows/album2/T07/T07_13.webp",
      "art/slideshows/album2/T07/T07_14.webp",
      "art/slideshows/album2/T07/T07_15.webp",
      "art/slideshows/album2/T07/T07_16.webp",
      "art/slideshows/album2/T07/T07_17.webp",
      "art/slideshows/album2/T07/T07_18.webp",
      "art/slideshows/album2/T07/T07_19.webp",
    ],
  },
  {
    id: "T08",
    title: "The Collector",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album2/T08/T08_00_title.webp",
      "art/slideshows/album2/T08/T08_01.webp",
      "art/slideshows/album2/T08/T08_02.webp",
      "art/slideshows/album2/T08/T08_03.webp",
      "art/slideshows/album2/T08/T08_04.webp",
      "art/slideshows/album2/T08/T08_05.webp",
      "art/slideshows/album2/T08/T08_06.webp",
      "art/slideshows/album2/T08/T08_07.webp",
      "art/slideshows/album2/T08/T08_08.webp",
      "art/slideshows/album2/T08/T08_09.webp",
      "art/slideshows/album2/T08/T08_10.webp",
      "art/slideshows/album2/T08/T08_11.webp",
      "art/slideshows/album2/T08/T08_12.webp",
      "art/slideshows/album2/T08/T08_13.webp",
      "art/slideshows/album2/T08/T08_14.webp",
      "art/slideshows/album2/T08/T08_15.webp",
    ],
  },
  {
    id: "T09",
    title: "The Prisoner",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album2/T09/T09_00_title.webp",
      "art/slideshows/album2/T09/T09_01.webp",
      "art/slideshows/album2/T09/T09_02.webp",
      "art/slideshows/album2/T09/T09_03.webp",
      "art/slideshows/album2/T09/T09_04.webp",
      "art/slideshows/album2/T09/T09_05.webp",
      "art/slideshows/album2/T09/T09_06.webp",
      "art/slideshows/album2/T09/T09_07.webp",
      "art/slideshows/album2/T09/T09_08.webp",
      "art/slideshows/album2/T09/T09_09.webp",
      "art/slideshows/album2/T09/T09_10.webp",
      "art/slideshows/album2/T09/T09_11.webp",
      "art/slideshows/album2/T09/T09_12.webp",
      "art/slideshows/album2/T09/T09_13.webp",
      "art/slideshows/album2/T09/T09_14.webp",
      "art/slideshows/album2/T09/T09_15.webp",
      "art/slideshows/album2/T09/T09_16.webp",
      "art/slideshows/album2/T09/T09_17.webp",
      "art/slideshows/album2/T09/T09_18.webp",
      "art/slideshows/album2/T09/T09_19.webp",
      "art/slideshows/album2/T09/T09_20.webp",
    ],
  },
  {
    id: "T10",
    title: "Zero Trust",
    act: 2,
    frameRelPaths: [
      "art/slideshows/album2/T10/T10_00_title.webp",
      "art/slideshows/album2/T10/T10_01.webp",
      "art/slideshows/album2/T10/T10_02.webp",
      "art/slideshows/album2/T10/T10_03.webp",
      "art/slideshows/album2/T10/T10_04.webp",
      "art/slideshows/album2/T10/T10_05.webp",
      "art/slideshows/album2/T10/T10_06.webp",
      "art/slideshows/album2/T10/T10_07.webp",
      "art/slideshows/album2/T10/T10_08.webp",
      "art/slideshows/album2/T10/T10_09.webp",
      "art/slideshows/album2/T10/T10_10.webp",
      "art/slideshows/album2/T10/T10_11.webp",
      "art/slideshows/album2/T10/T10_12.webp",
      "art/slideshows/album2/T10/T10_13.webp",
      "art/slideshows/album2/T10/T10_14.webp",
    ],
  },
  {
    id: "T11",
    title: "The Warden",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album2/T11/T11_00_title.webp",
      "art/slideshows/album2/T11/T11_01.webp",
      "art/slideshows/album2/T11/T11_02.webp",
      "art/slideshows/album2/T11/T11_03.webp",
      "art/slideshows/album2/T11/T11_04.webp",
      "art/slideshows/album2/T11/T11_05.webp",
      "art/slideshows/album2/T11/T11_06.webp",
      "art/slideshows/album2/T11/T11_07.webp",
      "art/slideshows/album2/T11/T11_08.webp",
      "art/slideshows/album2/T11/T11_09.webp",
      "art/slideshows/album2/T11/T11_10.webp",
      "art/slideshows/album2/T11/T11_11.webp",
      "art/slideshows/album2/T11/T11_12.webp",
      "art/slideshows/album2/T11/T11_13.webp",
      "art/slideshows/album2/T11/T11_14.webp",
    ],
  },
  {
    id: "T12",
    title: "The Politician",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album2/T12/T12_00_title.webp",
      "art/slideshows/album2/T12/T12_01.webp",
      "art/slideshows/album2/T12/T12_02.webp",
      "art/slideshows/album2/T12/T12_03.webp",
      "art/slideshows/album2/T12/T12_04.webp",
      "art/slideshows/album2/T12/T12_05.webp",
      "art/slideshows/album2/T12/T12_06.webp",
      "art/slideshows/album2/T12/T12_07.webp",
      "art/slideshows/album2/T12/T12_08.webp",
      "art/slideshows/album2/T12/T12_09.webp",
      "art/slideshows/album2/T12/T12_10.webp",
      "art/slideshows/album2/T12/T12_11.webp",
      "art/slideshows/album2/T12/T12_12.webp",
      "art/slideshows/album2/T12/T12_13.webp",
      "art/slideshows/album2/T12/T12_14.webp",
    ],
  },
  {
    id: "T13",
    title: "The Change Conspiracy",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album2/T13/T13_00_title.webp",
      "art/slideshows/album2/T13/T13_01.webp",
      "art/slideshows/album2/T13/T13_02.webp",
      "art/slideshows/album2/T13/T13_03.webp",
      "art/slideshows/album2/T13/T13_04.webp",
      "art/slideshows/album2/T13/T13_05.webp",
      "art/slideshows/album2/T13/T13_06.webp",
      "art/slideshows/album2/T13/T13_07.webp",
      "art/slideshows/album2/T13/T13_08.webp",
      "art/slideshows/album2/T13/T13_09.webp",
      "art/slideshows/album2/T13/T13_10.webp",
      "art/slideshows/album2/T13/T13_11.webp",
      "art/slideshows/album2/T13/T13_12.webp",
      "art/slideshows/album2/T13/T13_13.webp",
      "art/slideshows/album2/T13/T13_14.webp",
      "art/slideshows/album2/T13/T13_15.webp",
      "art/slideshows/album2/T13/T13_16.webp",
      "art/slideshows/album2/T13/T13_17.webp",
      "art/slideshows/album2/T13/T13_18.webp",
      "art/slideshows/album2/T13/T13_19.webp",
    ],
  },
  {
    id: "T14",
    title: "This Ain't A Song",
    act: 3,
    frameRelPaths: [
      "art/slideshows/album2/T14/T14_00_title.webp",
      "art/slideshows/album2/T14/T14_01.webp",
      "art/slideshows/album2/T14/T14_02.webp",
      "art/slideshows/album2/T14/T14_03.webp",
      "art/slideshows/album2/T14/T14_04.webp",
      "art/slideshows/album2/T14/T14_05.webp",
      "art/slideshows/album2/T14/T14_06.webp",
      "art/slideshows/album2/T14/T14_07.webp",
      "art/slideshows/album2/T14/T14_08.webp",
      "art/slideshows/album2/T14/T14_09.webp",
      "art/slideshows/album2/T14/T14_10.webp",
      "art/slideshows/album2/T14/T14_11.webp",
      "art/slideshows/album2/T14/T14_12.webp",
      "art/slideshows/album2/T14/T14_13.webp",
      "art/slideshows/album2/T14/T14_14.webp",
    ],
  },
  {
    id: "T15",
    title: "The Meme Civilization",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album2/T15/T15_00_title.webp",
      "art/slideshows/album2/T15/T15_01.webp",
      "art/slideshows/album2/T15/T15_02.webp",
      "art/slideshows/album2/T15/T15_03.webp",
      "art/slideshows/album2/T15/T15_04.webp",
      "art/slideshows/album2/T15/T15_05.webp",
      "art/slideshows/album2/T15/T15_06.webp",
      "art/slideshows/album2/T15/T15_07.webp",
      "art/slideshows/album2/T15/T15_08.webp",
      "art/slideshows/album2/T15/T15_09.webp",
    ],
  },
  {
    id: "T16",
    title: "The Watcher",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album2/T16/T16_00_title.webp",
      "art/slideshows/album2/T16/T16_01.webp",
      "art/slideshows/album2/T16/T16_02.webp",
      "art/slideshows/album2/T16/T16_03.webp",
      "art/slideshows/album2/T16/T16_04.webp",
      "art/slideshows/album2/T16/T16_05.webp",
      "art/slideshows/album2/T16/T16_06.webp",
      "art/slideshows/album2/T16/T16_07.webp",
      "art/slideshows/album2/T16/T16_08.webp",
      "art/slideshows/album2/T16/T16_09.webp",
      "art/slideshows/album2/T16/T16_10.webp",
    ],
  },
  {
    id: "T17",
    title: "The Deployment",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album2/T17/T17_00_title.webp",
      "art/slideshows/album2/T17/T17_01.webp",
      "art/slideshows/album2/T17/T17_02.webp",
      "art/slideshows/album2/T17/T17_03.webp",
      "art/slideshows/album2/T17/T17_04.webp",
      "art/slideshows/album2/T17/T17_05.webp",
      "art/slideshows/album2/T17/T17_06.webp",
      "art/slideshows/album2/T17/T17_07.webp",
      "art/slideshows/album2/T17/T17_08.webp",
      "art/slideshows/album2/T17/T17_09.webp",
    ],
  },
  {
    id: "T18",
    title: "Hard NØX Life",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album2/T18/T18_00_title.webp",
      "art/slideshows/album2/T18/T18_01.webp",
      "art/slideshows/album2/T18/T18_02.webp",
      "art/slideshows/album2/T18/T18_03.webp",
      "art/slideshows/album2/T18/T18_04.webp",
      "art/slideshows/album2/T18/T18_05.webp",
      "art/slideshows/album2/T18/T18_06.webp",
      "art/slideshows/album2/T18/T18_07.webp",
      "art/slideshows/album2/T18/T18_08.webp",
      "art/slideshows/album2/T18/T18_09.webp",
    ],
  },
  {
    id: "T19",
    title: "Ocularum",
    act: 4,
    frameRelPaths: [
      "art/slideshows/album2/T19/T19_00_title.webp",
      "art/slideshows/album2/T19/T19_01.webp",
      "art/slideshows/album2/T19/T19_02.webp",
      "art/slideshows/album2/T19/T19_03.webp",
      "art/slideshows/album2/T19/T19_04.webp",
      "art/slideshows/album2/T19/T19_05.webp",
      "art/slideshows/album2/T19/T19_06.webp",
      "art/slideshows/album2/T19/T19_07.webp",
      "art/slideshows/album2/T19/T19_08.webp",
      "art/slideshows/album2/T19/T19_09.webp",
    ],
  },
  {
    id: "T20",
    title: "Silence Is Consent",
    act: 5,
    frameRelPaths: [
      "art/slideshows/album2/T20/T20_00_title.webp",
      "art/slideshows/album2/T20/T20_01.webp",
      "art/slideshows/album2/T20/T20_02.webp",
      "art/slideshows/album2/T20/T20_03.webp",
      "art/slideshows/album2/T20/T20_04.webp",
      "art/slideshows/album2/T20/T20_05.webp",
      "art/slideshows/album2/T20/T20_06.webp",
      "art/slideshows/album2/T20/T20_07.webp",
      "art/slideshows/album2/T20/T20_08.webp",
      "art/slideshows/album2/T20/T20_09.webp",
    ],
  },
];

/* Tracks expose a frame-array per entry rather than a single path,
   so the manifest helper's urlOf can't be reused as-is. We still take
   the byId map + byField filter from it; the per-frame resolver
   stays bespoke (it's a frame-N array index, not a field lookup). */
const ALBUM2_MANIFEST = makeAssetManifest(ALBUM2_TRACKS, "id", "title");

/** Resolve a track's title-card URL (the first frame). */
export function album2TitleUrl(id: Album2TrackId): string | undefined {
  const t = ALBUM2_MANIFEST.byId.get(id);
  return t ? assetUrl(t.frameRelPaths[0]) : undefined;
}

/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */
export function album2FrameUrl(id: Album2TrackId, frame: number): string | undefined {
  const t = ALBUM2_MANIFEST.byId.get(id);
  if (!t) return undefined;
  const path = t.frameRelPaths[frame - 1];
  return path ? assetUrl(path) : undefined;
}

/** All resolved URLs for a track in producer beat-order. */
export function album2FrameUrls(id: Album2TrackId): readonly string[] {
  const t = ALBUM2_MANIFEST.byId.get(id);
  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];
}

/** Tracks that belong to a given act (1..5). */
export function album2TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album2TrackDef[] {
  return ALBUM2_MANIFEST.byField("act", act);
}

export const ALBUM2_TRACK_TOTAL = 20;
export const ALBUM2_FRAME_TOTAL = 334;
