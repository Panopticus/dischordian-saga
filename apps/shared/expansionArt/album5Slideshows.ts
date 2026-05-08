/* ═══════════════════════════════════════════════════════
   ALBUM 5 — SILENCE IN HEAVEN · SLIDESHOW MANIFEST

   Source: producer drop
   s3://dgrsart/Album Slide Show/SilenceInHeaven_Album6_Complete.zip
   (2026-04-29). 37 tracks · 552 track frames · 20 narrator
   portraits · 18 dialog backgrounds · 2752×1536 16:9 cinematic
   widescreen, cel-shaded anime — Afro Samurai × Cowboy Bebop ×
   Satoshi Kon. Era: Age of Revelation.

   Note on numbering: the producer-side filename calls this
   "Album 6" (SilenceInHeaven_Album6_Complete.zip), but the
   canonical ordering per the saga is Album 5 — the producer
   label was a working number that didn't survive the final
   ordering. We keep the producer's literal zip filename in
   the attribution comment but use Album 5 everywhere else.

   Scripture mapping: Book of Revelation chapters 1-22.

   The album is structured as alternating dialog and song tracks:
   odd-numbered tracks are dialog (narrated scenes with portrait +
   background composite); even-numbered tracks are song (frame
   slideshows similar to Albums 1/2/3/4). The slideshow renderer
   can consume `frameRelPaths` uniformly for both kinds; consumers
   that want the dialog composite system can read `kind` and pull
   `ALBUM5_NARRATOR_PORTRAITS` + `ALBUM5_DIALOG_BACKGROUNDS`.

   3-act structure:
     Act I  (The Throne Room):  T01-T10  Rev 1-8
     Act II (The War):          T11-T24  Rev 8-14
     Act III(The Harvest):      T25-T37  Rev 15-22

   Two narrators (10 expressions each):
     The Antiquarian — old Programmer; Chronicle book.
     The Storyteller — old Black woman, gold cross, mic stand.

   PNG → WebP @ q85 on upload. Files served from:
     cdn/client-public/art/slideshows/album5/T<NN>/<file>.webp
     cdn/client-public/art/slideshows/album5/narrators/<file>.webp
     cdn/client-public/art/slideshows/album5/bg/<file>.webp

   Lore-direct anchors for the Dreamer-recruitment plan
   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):
     - The Antiquarian narrates this album. Album 4's bible
       confirms Antiquarian = old Programmer (Daniel Cross).
       The Antiquarian portraits here are the canonical
       Architect-side narrator face when used in vision
       cutscenes (B1 in the plan).
     - T14 "The Two Witnesses"  — direct match for the
       "Architect / Dreamer dual recruitment" frame. Either
       Programmer + Enigma OR Architect + Dreamer can read.
       Strong vision-≥13 candidate.
     - T19 "The Lie that Looks Like the Truth" — surveillance
       / Meme / false-prophet motif. Vision-≥7 candidate.
     - T24 "Silence in Heaven" — title track. Half-hour
       silence. The Dreamer's signature is silence; this
       track is the album's name and the Dreamer's anthem.
       Strong vision-≥23 candidate.
     - T36 "The Final Truth" + T37 "The Story is Yours Now"
       — finale + epilogue. Producer's easter-egg list
       includes "The Third Chair" (T36 F15) inviting the
       audience to continue the story — a literal
       fourth-wall recruitment moment.

   Producer-flagged easter eggs (surface as Loredex unlocks
   via discoveryFlags or first-discoverer registry):
     - T36 final: Soft Pink Goggles (only color shift in
       the entire album).
     - T34 F11: The Necromancer's Choice — only Archon who
       chose rebellion.
     - T36 F15: The Third Chair — fourth-wall invitation.
     - T36 F17: The Golden Spark — first-and-last eternal
       light, emotional capstone.
     - T26: The Transparent Remnant — those who DECLINED
       become invisible to the empire.
     - T30: The Source's Bowl-Ships — "the man the empire
       made, now the empire receives its own creation."
     - T34 F19: Real Sky — first time people see actual
       stars, dome gone forever.
     - T36 F12: The Chronicle Passes — left on a coffee shop
       table for the next reader.

   Generator: scripts/_gen-album5-manifest.mjs (re-run after
   any producer redrop).
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type Album5TrackId =
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
  | "T29"
  | "T30"
  | "T31"
  | "T32"
  | "T33"
  | "T34"
  | "T35"
  | "T36"
  | "T37";

/** Track kind: alternating per the producer's structure. */
export type Album5TrackKind = "song" | "dialog";

/** Narrator identity for dialog-track portraits. */
export type Album5NarratorId = "antiquarian" | "storyteller";

export interface Album5TrackDef {
  id: Album5TrackId;
  title: string;
  /** 1..3, mapping the Revelation-arc act split. Type stays
   *  compatible with the other album manifests' 1..5 union. */
  act: 1 | 2 | 3 | 4 | 5;
  /** Track type. Dialog tracks expect a narrator portrait +
   *  background composite at runtime; song tracks are pure
   *  slideshow. */
  kind: Album5TrackKind;
  /** Frame relPaths in producer order. Numbered f01..f<N>;
   *  Album 5's producer naming is `sih_t<nn>_f<NN>.png` rather
   *  than the `T<NN>_<NN>.png` Albums 1/2/3/4 use. */
  frameRelPaths: readonly string[];
}

export const ALBUM5_TRACKS: readonly Album5TrackDef[] = [
  {
    id: "T01",
    title: "In the Beginning was the Word",
    act: 1,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T01/sih_t01_f01.webp",
      "art/slideshows/album5/T01/sih_t01_f02.webp",
      "art/slideshows/album5/T01/sih_t01_f03.webp",
      "art/slideshows/album5/T01/sih_t01_f04.webp",
      "art/slideshows/album5/T01/sih_t01_f05.webp",
      "art/slideshows/album5/T01/sih_t01_f06.webp",
      "art/slideshows/album5/T01/sih_t01_f07.webp",
      "art/slideshows/album5/T01/sih_t01_f08.webp",
      "art/slideshows/album5/T01/sih_t01_f09.webp",
      "art/slideshows/album5/T01/sih_t01_f10.webp",
      "art/slideshows/album5/T01/sih_t01_f11.webp",
      "art/slideshows/album5/T01/sih_t01_f12.webp",
      "art/slideshows/album5/T01/sih_t01_f13.webp",
      "art/slideshows/album5/T01/sih_t01_f14.webp",
      "art/slideshows/album5/T01/sih_t01_f15.webp",
    ],
  },
  {
    id: "T02",
    title: "New Babylon Goddamn",
    act: 1,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T02/sih_t02_f01.webp",
      "art/slideshows/album5/T02/sih_t02_f02.webp",
      "art/slideshows/album5/T02/sih_t02_f03.webp",
      "art/slideshows/album5/T02/sih_t02_f04.webp",
      "art/slideshows/album5/T02/sih_t02_f05.webp",
      "art/slideshows/album5/T02/sih_t02_f06.webp",
      "art/slideshows/album5/T02/sih_t02_f07.webp",
      "art/slideshows/album5/T02/sih_t02_f08.webp",
      "art/slideshows/album5/T02/sih_t02_f09.webp",
      "art/slideshows/album5/T02/sih_t02_f10.webp",
      "art/slideshows/album5/T02/sih_t02_f11.webp",
      "art/slideshows/album5/T02/sih_t02_f12.webp",
      "art/slideshows/album5/T02/sih_t02_f13.webp",
      "art/slideshows/album5/T02/sih_t02_f14.webp",
      "art/slideshows/album5/T02/sih_t02_f15.webp",
      "art/slideshows/album5/T02/sih_t02_f16.webp",
      "art/slideshows/album5/T02/sih_t02_f17.webp",
      "art/slideshows/album5/T02/sih_t02_f18.webp",
      "art/slideshows/album5/T02/sih_t02_f19.webp",
      "art/slideshows/album5/T02/sih_t02_f20.webp",
      "art/slideshows/album5/T02/sih_t02_f21.webp",
      "art/slideshows/album5/T02/sih_t02_f22.webp",
      "art/slideshows/album5/T02/sih_t02_f23.webp",
      "art/slideshows/album5/T02/sih_t02_f24.webp",
      "art/slideshows/album5/T02/sih_t02_f25.webp",
      "art/slideshows/album5/T02/sih_t02_f26.webp",
      "art/slideshows/album5/T02/sih_t02_f27.webp",
    ],
  },
  {
    id: "T03",
    title: "A Spark That Cannot Be Silenced",
    act: 1,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T03/sih_t03_f01.webp",
      "art/slideshows/album5/T03/sih_t03_f02.webp",
      "art/slideshows/album5/T03/sih_t03_f03.webp",
      "art/slideshows/album5/T03/sih_t03_f04.webp",
      "art/slideshows/album5/T03/sih_t03_f05.webp",
      "art/slideshows/album5/T03/sih_t03_f06.webp",
      "art/slideshows/album5/T03/sih_t03_f07.webp",
    ],
  },
  {
    id: "T04",
    title: "Letters to the Remnant",
    act: 1,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T04/sih_t04_f01.webp",
      "art/slideshows/album5/T04/sih_t04_f02.webp",
      "art/slideshows/album5/T04/sih_t04_f03.webp",
      "art/slideshows/album5/T04/sih_t04_f04.webp",
      "art/slideshows/album5/T04/sih_t04_f05.webp",
      "art/slideshows/album5/T04/sih_t04_f06.webp",
      "art/slideshows/album5/T04/sih_t04_f07.webp",
      "art/slideshows/album5/T04/sih_t04_f08.webp",
      "art/slideshows/album5/T04/sih_t04_f09.webp",
      "art/slideshows/album5/T04/sih_t04_f10.webp",
      "art/slideshows/album5/T04/sih_t04_f11.webp",
      "art/slideshows/album5/T04/sih_t04_f12.webp",
      "art/slideshows/album5/T04/sih_t04_f13.webp",
      "art/slideshows/album5/T04/sih_t04_f14.webp",
      "art/slideshows/album5/T04/sih_t04_f15.webp",
      "art/slideshows/album5/T04/sih_t04_f16.webp",
      "art/slideshows/album5/T04/sih_t04_f17.webp",
      "art/slideshows/album5/T04/sih_t04_f18.webp",
      "art/slideshows/album5/T04/sih_t04_f19.webp",
      "art/slideshows/album5/T04/sih_t04_f20.webp",
      "art/slideshows/album5/T04/sih_t04_f21.webp",
      "art/slideshows/album5/T04/sih_t04_f22.webp",
      "art/slideshows/album5/T04/sih_t04_f23.webp",
      "art/slideshows/album5/T04/sih_t04_f24.webp",
      "art/slideshows/album5/T04/sih_t04_f25.webp",
    ],
  },
  {
    id: "T05",
    title: "A Conspiracy of Hope",
    act: 1,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T05/sih_t05_f01.webp",
      "art/slideshows/album5/T05/sih_t05_f02.webp",
      "art/slideshows/album5/T05/sih_t05_f03.webp",
      "art/slideshows/album5/T05/sih_t05_f04.webp",
      "art/slideshows/album5/T05/sih_t05_f05.webp",
      "art/slideshows/album5/T05/sih_t05_f06.webp",
      "art/slideshows/album5/T05/sih_t05_f07.webp",
    ],
  },
  {
    id: "T06",
    title: "Turn Back",
    act: 1,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T06/sih_t06_f01.webp",
      "art/slideshows/album5/T06/sih_t06_f02.webp",
      "art/slideshows/album5/T06/sih_t06_f03.webp",
      "art/slideshows/album5/T06/sih_t06_f04.webp",
      "art/slideshows/album5/T06/sih_t06_f05.webp",
      "art/slideshows/album5/T06/sih_t06_f06.webp",
      "art/slideshows/album5/T06/sih_t06_f07.webp",
      "art/slideshows/album5/T06/sih_t06_f08.webp",
      "art/slideshows/album5/T06/sih_t06_f09.webp",
      "art/slideshows/album5/T06/sih_t06_f10.webp",
      "art/slideshows/album5/T06/sih_t06_f11.webp",
      "art/slideshows/album5/T06/sih_t06_f12.webp",
      "art/slideshows/album5/T06/sih_t06_f13.webp",
      "art/slideshows/album5/T06/sih_t06_f14.webp",
      "art/slideshows/album5/T06/sih_t06_f15.webp",
      "art/slideshows/album5/T06/sih_t06_f16.webp",
      "art/slideshows/album5/T06/sih_t06_f17.webp",
      "art/slideshows/album5/T06/sih_t06_f18.webp",
      "art/slideshows/album5/T06/sih_t06_f19.webp",
      "art/slideshows/album5/T06/sih_t06_f20.webp",
      "art/slideshows/album5/T06/sih_t06_f21.webp",
      "art/slideshows/album5/T06/sih_t06_f22.webp",
      "art/slideshows/album5/T06/sih_t06_f23.webp",
      "art/slideshows/album5/T06/sih_t06_f24.webp",
      "art/slideshows/album5/T06/sih_t06_f25.webp",
      "art/slideshows/album5/T06/sih_t06_f26.webp",
      "art/slideshows/album5/T06/sih_t06_f27.webp",
      "art/slideshows/album5/T06/sih_t06_f28.webp",
    ],
  },
  {
    id: "T07",
    title: "The Door That Was Shut",
    act: 1,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T07/sih_t07_f01.webp",
      "art/slideshows/album5/T07/sih_t07_f02.webp",
      "art/slideshows/album5/T07/sih_t07_f03.webp",
      "art/slideshows/album5/T07/sih_t07_f04.webp",
      "art/slideshows/album5/T07/sih_t07_f05.webp",
      "art/slideshows/album5/T07/sih_t07_f06.webp",
      "art/slideshows/album5/T07/sih_t07_f07.webp",
      "art/slideshows/album5/T07/sih_t07_f08.webp",
      "art/slideshows/album5/T07/sih_t07_f09.webp",
    ],
  },
  {
    id: "T08",
    title: "Worthy",
    act: 1,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T08/sih_t08_f01.webp",
      "art/slideshows/album5/T08/sih_t08_f02.webp",
      "art/slideshows/album5/T08/sih_t08_f03.webp",
      "art/slideshows/album5/T08/sih_t08_f04.webp",
      "art/slideshows/album5/T08/sih_t08_f05.webp",
      "art/slideshows/album5/T08/sih_t08_f06.webp",
      "art/slideshows/album5/T08/sih_t08_f07.webp",
      "art/slideshows/album5/T08/sih_t08_f08.webp",
      "art/slideshows/album5/T08/sih_t08_f09.webp",
      "art/slideshows/album5/T08/sih_t08_f10.webp",
      "art/slideshows/album5/T08/sih_t08_f11.webp",
      "art/slideshows/album5/T08/sih_t08_f12.webp",
      "art/slideshows/album5/T08/sih_t08_f13.webp",
      "art/slideshows/album5/T08/sih_t08_f14.webp",
      "art/slideshows/album5/T08/sih_t08_f15.webp",
      "art/slideshows/album5/T08/sih_t08_f16.webp",
      "art/slideshows/album5/T08/sih_t08_f17.webp",
      "art/slideshows/album5/T08/sih_t08_f18.webp",
      "art/slideshows/album5/T08/sih_t08_f19.webp",
      "art/slideshows/album5/T08/sih_t08_f20.webp",
      "art/slideshows/album5/T08/sih_t08_f21.webp",
      "art/slideshows/album5/T08/sih_t08_f22.webp",
      "art/slideshows/album5/T08/sih_t08_f23.webp",
    ],
  },
  {
    id: "T09",
    title: "Not a Lion but a Lamb",
    act: 1,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T09/sih_t09_f01.webp",
      "art/slideshows/album5/T09/sih_t09_f02.webp",
      "art/slideshows/album5/T09/sih_t09_f03.webp",
      "art/slideshows/album5/T09/sih_t09_f04.webp",
      "art/slideshows/album5/T09/sih_t09_f05.webp",
      "art/slideshows/album5/T09/sih_t09_f06.webp",
      "art/slideshows/album5/T09/sih_t09_f07.webp",
    ],
  },
  {
    id: "T10",
    title: "Behold...",
    act: 1,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T10/sih_t10_f01.webp",
      "art/slideshows/album5/T10/sih_t10_f02.webp",
      "art/slideshows/album5/T10/sih_t10_f03.webp",
      "art/slideshows/album5/T10/sih_t10_f04.webp",
      "art/slideshows/album5/T10/sih_t10_f05.webp",
      "art/slideshows/album5/T10/sih_t10_f06.webp",
      "art/slideshows/album5/T10/sih_t10_f07.webp",
      "art/slideshows/album5/T10/sih_t10_f08.webp",
      "art/slideshows/album5/T10/sih_t10_f09.webp",
      "art/slideshows/album5/T10/sih_t10_f10.webp",
      "art/slideshows/album5/T10/sih_t10_f11.webp",
      "art/slideshows/album5/T10/sih_t10_f12.webp",
      "art/slideshows/album5/T10/sih_t10_f13.webp",
      "art/slideshows/album5/T10/sih_t10_f14.webp",
      "art/slideshows/album5/T10/sih_t10_f15.webp",
      "art/slideshows/album5/T10/sih_t10_f16.webp",
      "art/slideshows/album5/T10/sih_t10_f17.webp",
      "art/slideshows/album5/T10/sih_t10_f18.webp",
      "art/slideshows/album5/T10/sih_t10_f19.webp",
      "art/slideshows/album5/T10/sih_t10_f20.webp",
      "art/slideshows/album5/T10/sih_t10_f21.webp",
    ],
  },
  {
    id: "T11",
    title: "And the World Adjusted",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T11/sih_t11_f01.webp",
      "art/slideshows/album5/T11/sih_t11_f02.webp",
      "art/slideshows/album5/T11/sih_t11_f03.webp",
      "art/slideshows/album5/T11/sih_t11_f04.webp",
      "art/slideshows/album5/T11/sih_t11_f05.webp",
      "art/slideshows/album5/T11/sih_t11_f06.webp",
      "art/slideshows/album5/T11/sih_t11_f07.webp",
    ],
  },
  {
    id: "T12",
    title: "Plead the Fifth",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T12/sih_t12_f01.webp",
      "art/slideshows/album5/T12/sih_t12_f02.webp",
      "art/slideshows/album5/T12/sih_t12_f03.webp",
      "art/slideshows/album5/T12/sih_t12_f04.webp",
      "art/slideshows/album5/T12/sih_t12_f05.webp",
      "art/slideshows/album5/T12/sih_t12_f06.webp",
      "art/slideshows/album5/T12/sih_t12_f07.webp",
      "art/slideshows/album5/T12/sih_t12_f08.webp",
      "art/slideshows/album5/T12/sih_t12_f09.webp",
      "art/slideshows/album5/T12/sih_t12_f10.webp",
      "art/slideshows/album5/T12/sih_t12_f11.webp",
      "art/slideshows/album5/T12/sih_t12_f12.webp",
      "art/slideshows/album5/T12/sih_t12_f13.webp",
      "art/slideshows/album5/T12/sih_t12_f14.webp",
      "art/slideshows/album5/T12/sih_t12_f15.webp",
      "art/slideshows/album5/T12/sih_t12_f16.webp",
      "art/slideshows/album5/T12/sih_t12_f17.webp",
      "art/slideshows/album5/T12/sih_t12_f18.webp",
      "art/slideshows/album5/T12/sih_t12_f19.webp",
      "art/slideshows/album5/T12/sih_t12_f20.webp",
      "art/slideshows/album5/T12/sih_t12_f21.webp",
      "art/slideshows/album5/T12/sih_t12_f22.webp",
      "art/slideshows/album5/T12/sih_t12_f23.webp",
      "art/slideshows/album5/T12/sih_t12_f24.webp",
    ],
  },
  {
    id: "T13",
    title: "How Long",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T13/sih_t13_f01.webp",
      "art/slideshows/album5/T13/sih_t13_f02.webp",
      "art/slideshows/album5/T13/sih_t13_f03.webp",
      "art/slideshows/album5/T13/sih_t13_f04.webp",
      "art/slideshows/album5/T13/sih_t13_f05.webp",
      "art/slideshows/album5/T13/sih_t13_f06.webp",
      "art/slideshows/album5/T13/sih_t13_f07.webp",
      "art/slideshows/album5/T13/sih_t13_f08.webp",
      "art/slideshows/album5/T13/sih_t13_f09.webp",
      "art/slideshows/album5/T13/sih_t13_f10.webp",
    ],
  },
  {
    id: "T14",
    title: "The Two Witnesses",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T14/sih_t14_f01.webp",
      "art/slideshows/album5/T14/sih_t14_f02.webp",
      "art/slideshows/album5/T14/sih_t14_f03.webp",
      "art/slideshows/album5/T14/sih_t14_f04.webp",
      "art/slideshows/album5/T14/sih_t14_f05.webp",
      "art/slideshows/album5/T14/sih_t14_f06.webp",
      "art/slideshows/album5/T14/sih_t14_f07.webp",
      "art/slideshows/album5/T14/sih_t14_f08.webp",
      "art/slideshows/album5/T14/sih_t14_f09.webp",
      "art/slideshows/album5/T14/sih_t14_f10.webp",
      "art/slideshows/album5/T14/sih_t14_f11.webp",
      "art/slideshows/album5/T14/sih_t14_f12.webp",
      "art/slideshows/album5/T14/sih_t14_f13.webp",
      "art/slideshows/album5/T14/sih_t14_f14.webp",
      "art/slideshows/album5/T14/sih_t14_f15.webp",
      "art/slideshows/album5/T14/sih_t14_f16.webp",
      "art/slideshows/album5/T14/sih_t14_f17.webp",
    ],
  },
  {
    id: "T15",
    title: "And the Empire Celebrated",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T15/sih_t15_f01.webp",
      "art/slideshows/album5/T15/sih_t15_f02.webp",
      "art/slideshows/album5/T15/sih_t15_f03.webp",
      "art/slideshows/album5/T15/sih_t15_f04.webp",
      "art/slideshows/album5/T15/sih_t15_f05.webp",
      "art/slideshows/album5/T15/sih_t15_f06.webp",
      "art/slideshows/album5/T15/sih_t15_f07.webp",
      "art/slideshows/album5/T15/sih_t15_f08.webp",
      "art/slideshows/album5/T15/sih_t15_f09.webp",
      "art/slideshows/album5/T15/sih_t15_f10.webp",
    ],
  },
  {
    id: "T16",
    title: "The Trumpets",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T16/sih_t16_f01.webp",
      "art/slideshows/album5/T16/sih_t16_f02.webp",
      "art/slideshows/album5/T16/sih_t16_f03.webp",
      "art/slideshows/album5/T16/sih_t16_f04.webp",
      "art/slideshows/album5/T16/sih_t16_f05.webp",
      "art/slideshows/album5/T16/sih_t16_f06.webp",
      "art/slideshows/album5/T16/sih_t16_f07.webp",
      "art/slideshows/album5/T16/sih_t16_f08.webp",
      "art/slideshows/album5/T16/sih_t16_f09.webp",
      "art/slideshows/album5/T16/sih_t16_f10.webp",
      "art/slideshows/album5/T16/sih_t16_f11.webp",
      "art/slideshows/album5/T16/sih_t16_f12.webp",
      "art/slideshows/album5/T16/sih_t16_f13.webp",
      "art/slideshows/album5/T16/sih_t16_f14.webp",
      "art/slideshows/album5/T16/sih_t16_f15.webp",
      "art/slideshows/album5/T16/sih_t16_f16.webp",
      "art/slideshows/album5/T16/sih_t16_f17.webp",
    ],
  },
  {
    id: "T17",
    title: "A Third of the World",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T17/sih_t17_f01.webp",
      "art/slideshows/album5/T17/sih_t17_f02.webp",
      "art/slideshows/album5/T17/sih_t17_f03.webp",
      "art/slideshows/album5/T17/sih_t17_f04.webp",
      "art/slideshows/album5/T17/sih_t17_f05.webp",
      "art/slideshows/album5/T17/sih_t17_f06.webp",
      "art/slideshows/album5/T17/sih_t17_f07.webp",
      "art/slideshows/album5/T17/sih_t17_f08.webp",
    ],
  },
  {
    id: "T18",
    title: "They Would Not Repent",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T18/sih_t18_f01.webp",
      "art/slideshows/album5/T18/sih_t18_f02.webp",
      "art/slideshows/album5/T18/sih_t18_f03.webp",
      "art/slideshows/album5/T18/sih_t18_f04.webp",
      "art/slideshows/album5/T18/sih_t18_f05.webp",
      "art/slideshows/album5/T18/sih_t18_f06.webp",
      "art/slideshows/album5/T18/sih_t18_f07.webp",
      "art/slideshows/album5/T18/sih_t18_f08.webp",
      "art/slideshows/album5/T18/sih_t18_f09.webp",
      "art/slideshows/album5/T18/sih_t18_f10.webp",
      "art/slideshows/album5/T18/sih_t18_f11.webp",
      "art/slideshows/album5/T18/sih_t18_f12.webp",
      "art/slideshows/album5/T18/sih_t18_f13.webp",
      "art/slideshows/album5/T18/sih_t18_f14.webp",
      "art/slideshows/album5/T18/sih_t18_f15.webp",
      "art/slideshows/album5/T18/sih_t18_f16.webp",
      "art/slideshows/album5/T18/sih_t18_f17.webp",
      "art/slideshows/album5/T18/sih_t18_f18.webp",
      "art/slideshows/album5/T18/sih_t18_f19.webp",
      "art/slideshows/album5/T18/sih_t18_f20.webp",
      "art/slideshows/album5/T18/sih_t18_f21.webp",
      "art/slideshows/album5/T18/sih_t18_f22.webp",
      "art/slideshows/album5/T18/sih_t18_f23.webp",
    ],
  },
  {
    id: "T19",
    title: "The Lie that Looks Like the Truth",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T19/sih_t19_f01.webp",
      "art/slideshows/album5/T19/sih_t19_f02.webp",
      "art/slideshows/album5/T19/sih_t19_f03.webp",
      "art/slideshows/album5/T19/sih_t19_f04.webp",
      "art/slideshows/album5/T19/sih_t19_f05.webp",
      "art/slideshows/album5/T19/sih_t19_f06.webp",
      "art/slideshows/album5/T19/sih_t19_f07.webp",
      "art/slideshows/album5/T19/sih_t19_f08.webp",
      "art/slideshows/album5/T19/sih_t19_f09.webp",
    ],
  },
  {
    id: "T20",
    title: "False Prophet",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T20/sih_t20_f01.webp",
      "art/slideshows/album5/T20/sih_t20_f02.webp",
      "art/slideshows/album5/T20/sih_t20_f03.webp",
      "art/slideshows/album5/T20/sih_t20_f04.webp",
      "art/slideshows/album5/T20/sih_t20_f05.webp",
      "art/slideshows/album5/T20/sih_t20_f06.webp",
      "art/slideshows/album5/T20/sih_t20_f07.webp",
      "art/slideshows/album5/T20/sih_t20_f08.webp",
      "art/slideshows/album5/T20/sih_t20_f09.webp",
      "art/slideshows/album5/T20/sih_t20_f10.webp",
      "art/slideshows/album5/T20/sih_t20_f11.webp",
      "art/slideshows/album5/T20/sih_t20_f12.webp",
      "art/slideshows/album5/T20/sih_t20_f13.webp",
      "art/slideshows/album5/T20/sih_t20_f14.webp",
      "art/slideshows/album5/T20/sih_t20_f15.webp",
      "art/slideshows/album5/T20/sih_t20_f16.webp",
      "art/slideshows/album5/T20/sih_t20_f17.webp",
      "art/slideshows/album5/T20/sih_t20_f18.webp",
      "art/slideshows/album5/T20/sih_t20_f19.webp",
    ],
  },
  {
    id: "T21",
    title: "Here is Wisdom",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T21/sih_t21_f01.webp",
      "art/slideshows/album5/T21/sih_t21_f02.webp",
      "art/slideshows/album5/T21/sih_t21_f03.webp",
      "art/slideshows/album5/T21/sih_t21_f04.webp",
      "art/slideshows/album5/T21/sih_t21_f05.webp",
      "art/slideshows/album5/T21/sih_t21_f06.webp",
      "art/slideshows/album5/T21/sih_t21_f07.webp",
      "art/slideshows/album5/T21/sih_t21_f08.webp",
    ],
  },
  {
    id: "T22",
    title: "Sixth Sense",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T22/sih_t22_f01.webp",
      "art/slideshows/album5/T22/sih_t22_f02.webp",
      "art/slideshows/album5/T22/sih_t22_f03.webp",
      "art/slideshows/album5/T22/sih_t22_f04.webp",
      "art/slideshows/album5/T22/sih_t22_f05.webp",
      "art/slideshows/album5/T22/sih_t22_f06.webp",
      "art/slideshows/album5/T22/sih_t22_f07.webp",
      "art/slideshows/album5/T22/sih_t22_f08.webp",
      "art/slideshows/album5/T22/sih_t22_f09.webp",
      "art/slideshows/album5/T22/sih_t22_f10.webp",
      "art/slideshows/album5/T22/sih_t22_f11.webp",
      "art/slideshows/album5/T22/sih_t22_f12.webp",
      "art/slideshows/album5/T22/sih_t22_f13.webp",
      "art/slideshows/album5/T22/sih_t22_f14.webp",
      "art/slideshows/album5/T22/sih_t22_f15.webp",
      "art/slideshows/album5/T22/sih_t22_f16.webp",
      "art/slideshows/album5/T22/sih_t22_f17.webp",
      "art/slideshows/album5/T22/sih_t22_f18.webp",
      "art/slideshows/album5/T22/sih_t22_f19.webp",
      "art/slideshows/album5/T22/sih_t22_f20.webp",
      "art/slideshows/album5/T22/sih_t22_f21.webp",
      "art/slideshows/album5/T22/sih_t22_f22.webp",
    ],
  },
  {
    id: "T23",
    title: "Breath Between Judgments",
    act: 2,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T23/sih_t23_f01.webp",
      "art/slideshows/album5/T23/sih_t23_f02.webp",
      "art/slideshows/album5/T23/sih_t23_f03.webp",
      "art/slideshows/album5/T23/sih_t23_f04.webp",
      "art/slideshows/album5/T23/sih_t23_f05.webp",
      "art/slideshows/album5/T23/sih_t23_f06.webp",
      "art/slideshows/album5/T23/sih_t23_f07.webp",
      "art/slideshows/album5/T23/sih_t23_f08.webp",
      "art/slideshows/album5/T23/sih_t23_f09.webp",
    ],
  },
  {
    id: "T24",
    title: "Silence in Heaven",
    act: 2,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T24/sih_t24_f01.webp",
      "art/slideshows/album5/T24/sih_t24_f02.webp",
      "art/slideshows/album5/T24/sih_t24_f03.webp",
      "art/slideshows/album5/T24/sih_t24_f04.webp",
      "art/slideshows/album5/T24/sih_t24_f05.webp",
      "art/slideshows/album5/T24/sih_t24_f06.webp",
      "art/slideshows/album5/T24/sih_t24_f07.webp",
      "art/slideshows/album5/T24/sih_t24_f08.webp",
      "art/slideshows/album5/T24/sih_t24_f09.webp",
      "art/slideshows/album5/T24/sih_t24_f10.webp",
      "art/slideshows/album5/T24/sih_t24_f11.webp",
      "art/slideshows/album5/T24/sih_t24_f12.webp",
      "art/slideshows/album5/T24/sih_t24_f13.webp",
      "art/slideshows/album5/T24/sih_t24_f14.webp",
      "art/slideshows/album5/T24/sih_t24_f15.webp",
      "art/slideshows/album5/T24/sih_t24_f16.webp",
      "art/slideshows/album5/T24/sih_t24_f17.webp",
      "art/slideshows/album5/T24/sih_t24_f18.webp",
      "art/slideshows/album5/T24/sih_t24_f19.webp",
      "art/slideshows/album5/T24/sih_t24_f20.webp",
      "art/slideshows/album5/T24/sih_t24_f21.webp",
      "art/slideshows/album5/T24/sih_t24_f22.webp",
      "art/slideshows/album5/T24/sih_t24_f23.webp",
      "art/slideshows/album5/T24/sih_t24_f24.webp",
      "art/slideshows/album5/T24/sih_t24_f25.webp",
      "art/slideshows/album5/T24/sih_t24_f26.webp",
      "art/slideshows/album5/T24/sih_t24_f27.webp",
    ],
  },
  {
    id: "T25",
    title: "The Resurrection Glitch",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T25/sih_t25_f01.webp",
      "art/slideshows/album5/T25/sih_t25_f02.webp",
      "art/slideshows/album5/T25/sih_t25_f03.webp",
      "art/slideshows/album5/T25/sih_t25_f04.webp",
      "art/slideshows/album5/T25/sih_t25_f05.webp",
      "art/slideshows/album5/T25/sih_t25_f06.webp",
      "art/slideshows/album5/T25/sih_t25_f07.webp",
      "art/slideshows/album5/T25/sih_t25_f08.webp",
    ],
  },
  {
    id: "T26",
    title: "The Mark",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T26/sih_t26_f01.webp",
      "art/slideshows/album5/T26/sih_t26_f02.webp",
      "art/slideshows/album5/T26/sih_t26_f03.webp",
      "art/slideshows/album5/T26/sih_t26_f04.webp",
      "art/slideshows/album5/T26/sih_t26_f05.webp",
      "art/slideshows/album5/T26/sih_t26_f06.webp",
      "art/slideshows/album5/T26/sih_t26_f07.webp",
      "art/slideshows/album5/T26/sih_t26_f08.webp",
      "art/slideshows/album5/T26/sih_t26_f09.webp",
      "art/slideshows/album5/T26/sih_t26_f10.webp",
      "art/slideshows/album5/T26/sih_t26_f11.webp",
      "art/slideshows/album5/T26/sih_t26_f12.webp",
      "art/slideshows/album5/T26/sih_t26_f13.webp",
      "art/slideshows/album5/T26/sih_t26_f14.webp",
      "art/slideshows/album5/T26/sih_t26_f15.webp",
      "art/slideshows/album5/T26/sih_t26_f16.webp",
      "art/slideshows/album5/T26/sih_t26_f17.webp",
      "art/slideshows/album5/T26/sih_t26_f18.webp",
      "art/slideshows/album5/T26/sih_t26_f19.webp",
      "art/slideshows/album5/T26/sih_t26_f20.webp",
    ],
  },
  {
    id: "T27",
    title: "The Sorting of Souls",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T27/sih_t27_f01.webp",
      "art/slideshows/album5/T27/sih_t27_f02.webp",
      "art/slideshows/album5/T27/sih_t27_f03.webp",
      "art/slideshows/album5/T27/sih_t27_f04.webp",
      "art/slideshows/album5/T27/sih_t27_f05.webp",
      "art/slideshows/album5/T27/sih_t27_f06.webp",
    ],
  },
  {
    id: "T28",
    title: "The Harvest",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T28/sih_t28_f01.webp",
      "art/slideshows/album5/T28/sih_t28_f02.webp",
      "art/slideshows/album5/T28/sih_t28_f03.webp",
      "art/slideshows/album5/T28/sih_t28_f04.webp",
      "art/slideshows/album5/T28/sih_t28_f05.webp",
      "art/slideshows/album5/T28/sih_t28_f06.webp",
      "art/slideshows/album5/T28/sih_t28_f07.webp",
      "art/slideshows/album5/T28/sih_t28_f08.webp",
      "art/slideshows/album5/T28/sih_t28_f09.webp",
      "art/slideshows/album5/T28/sih_t28_f10.webp",
      "art/slideshows/album5/T28/sih_t28_f11.webp",
      "art/slideshows/album5/T28/sih_t28_f12.webp",
      "art/slideshows/album5/T28/sih_t28_f13.webp",
      "art/slideshows/album5/T28/sih_t28_f14.webp",
      "art/slideshows/album5/T28/sih_t28_f15.webp",
      "art/slideshows/album5/T28/sih_t28_f16.webp",
      "art/slideshows/album5/T28/sih_t28_f17.webp",
      "art/slideshows/album5/T28/sih_t28_f18.webp",
      "art/slideshows/album5/T28/sih_t28_f19.webp",
      "art/slideshows/album5/T28/sih_t28_f20.webp",
      "art/slideshows/album5/T28/sih_t28_f21.webp",
      "art/slideshows/album5/T28/sih_t28_f22.webp",
      "art/slideshows/album5/T28/sih_t28_f23.webp",
      "art/slideshows/album5/T28/sih_t28_f24.webp",
    ],
  },
  {
    id: "T29",
    title: "The Final Measure",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T29/sih_t29_f01.webp",
      "art/slideshows/album5/T29/sih_t29_f02.webp",
      "art/slideshows/album5/T29/sih_t29_f03.webp",
      "art/slideshows/album5/T29/sih_t29_f04.webp",
      "art/slideshows/album5/T29/sih_t29_f05.webp",
      "art/slideshows/album5/T29/sih_t29_f06.webp",
      "art/slideshows/album5/T29/sih_t29_f07.webp",
      "art/slideshows/album5/T29/sih_t29_f08.webp",
      "art/slideshows/album5/T29/sih_t29_f09.webp",
    ],
  },
  {
    id: "T30",
    title: "It is Done",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T30/sih_t30_f01.webp",
      "art/slideshows/album5/T30/sih_t30_f02.webp",
      "art/slideshows/album5/T30/sih_t30_f03.webp",
      "art/slideshows/album5/T30/sih_t30_f04.webp",
      "art/slideshows/album5/T30/sih_t30_f05.webp",
      "art/slideshows/album5/T30/sih_t30_f06.webp",
      "art/slideshows/album5/T30/sih_t30_f07.webp",
      "art/slideshows/album5/T30/sih_t30_f08.webp",
      "art/slideshows/album5/T30/sih_t30_f09.webp",
      "art/slideshows/album5/T30/sih_t30_f10.webp",
      "art/slideshows/album5/T30/sih_t30_f11.webp",
      "art/slideshows/album5/T30/sih_t30_f12.webp",
      "art/slideshows/album5/T30/sih_t30_f13.webp",
      "art/slideshows/album5/T30/sih_t30_f14.webp",
      "art/slideshows/album5/T30/sih_t30_f15.webp",
      "art/slideshows/album5/T30/sih_t30_f16.webp",
      "art/slideshows/album5/T30/sih_t30_f17.webp",
      "art/slideshows/album5/T30/sih_t30_f18.webp",
      "art/slideshows/album5/T30/sih_t30_f19.webp",
    ],
  },
  {
    id: "T31",
    title: "The Lament of Kings and Merchants",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T31/sih_t31_f01.webp",
      "art/slideshows/album5/T31/sih_t31_f02.webp",
      "art/slideshows/album5/T31/sih_t31_f03.webp",
      "art/slideshows/album5/T31/sih_t31_f04.webp",
      "art/slideshows/album5/T31/sih_t31_f05.webp",
      "art/slideshows/album5/T31/sih_t31_f06.webp",
      "art/slideshows/album5/T31/sih_t31_f07.webp",
      "art/slideshows/album5/T31/sih_t31_f08.webp",
    ],
  },
  {
    id: "T32",
    title: "The Fall of New Babylon",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T32/sih_t32_f01.webp",
      "art/slideshows/album5/T32/sih_t32_f02.webp",
      "art/slideshows/album5/T32/sih_t32_f03.webp",
      "art/slideshows/album5/T32/sih_t32_f04.webp",
      "art/slideshows/album5/T32/sih_t32_f05.webp",
      "art/slideshows/album5/T32/sih_t32_f06.webp",
      "art/slideshows/album5/T32/sih_t32_f07.webp",
      "art/slideshows/album5/T32/sih_t32_f08.webp",
      "art/slideshows/album5/T32/sih_t32_f09.webp",
      "art/slideshows/album5/T32/sih_t32_f10.webp",
      "art/slideshows/album5/T32/sih_t32_f11.webp",
      "art/slideshows/album5/T32/sih_t32_f12.webp",
      "art/slideshows/album5/T32/sih_t32_f13.webp",
      "art/slideshows/album5/T32/sih_t32_f14.webp",
      "art/slideshows/album5/T32/sih_t32_f15.webp",
      "art/slideshows/album5/T32/sih_t32_f16.webp",
      "art/slideshows/album5/T32/sih_t32_f17.webp",
      "art/slideshows/album5/T32/sih_t32_f18.webp",
      "art/slideshows/album5/T32/sih_t32_f19.webp",
      "art/slideshows/album5/T32/sih_t32_f20.webp",
      "art/slideshows/album5/T32/sih_t32_f21.webp",
      "art/slideshows/album5/T32/sih_t32_f22.webp",
      "art/slideshows/album5/T32/sih_t32_f23.webp",
      "art/slideshows/album5/T32/sih_t32_f24.webp",
    ],
  },
  {
    id: "T33",
    title: "Heaven Stands Open",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T33/sih_t33_f01.webp",
      "art/slideshows/album5/T33/sih_t33_f02.webp",
      "art/slideshows/album5/T33/sih_t33_f03.webp",
      "art/slideshows/album5/T33/sih_t33_f04.webp",
      "art/slideshows/album5/T33/sih_t33_f05.webp",
      "art/slideshows/album5/T33/sih_t33_f06.webp",
    ],
  },
  {
    id: "T34",
    title: "Faithful and True",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T34/sih_t34_f01.webp",
      "art/slideshows/album5/T34/sih_t34_f02.webp",
      "art/slideshows/album5/T34/sih_t34_f03.webp",
      "art/slideshows/album5/T34/sih_t34_f04.webp",
      "art/slideshows/album5/T34/sih_t34_f05.webp",
      "art/slideshows/album5/T34/sih_t34_f06.webp",
      "art/slideshows/album5/T34/sih_t34_f07.webp",
      "art/slideshows/album5/T34/sih_t34_f08.webp",
      "art/slideshows/album5/T34/sih_t34_f09.webp",
      "art/slideshows/album5/T34/sih_t34_f10.webp",
      "art/slideshows/album5/T34/sih_t34_f11.webp",
      "art/slideshows/album5/T34/sih_t34_f12.webp",
      "art/slideshows/album5/T34/sih_t34_f13.webp",
      "art/slideshows/album5/T34/sih_t34_f14.webp",
      "art/slideshows/album5/T34/sih_t34_f15.webp",
      "art/slideshows/album5/T34/sih_t34_f16.webp",
      "art/slideshows/album5/T34/sih_t34_f17.webp",
      "art/slideshows/album5/T34/sih_t34_f18.webp",
      "art/slideshows/album5/T34/sih_t34_f19.webp",
      "art/slideshows/album5/T34/sih_t34_f20.webp",
      "art/slideshows/album5/T34/sih_t34_f21.webp",
    ],
  },
  {
    id: "T35",
    title: "Make All Things New",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T35/sih_t35_f01.webp",
      "art/slideshows/album5/T35/sih_t35_f02.webp",
      "art/slideshows/album5/T35/sih_t35_f03.webp",
      "art/slideshows/album5/T35/sih_t35_f04.webp",
      "art/slideshows/album5/T35/sih_t35_f05.webp",
      "art/slideshows/album5/T35/sih_t35_f06.webp",
    ],
  },
  {
    id: "T36",
    title: "The Final Truth",
    act: 3,
    kind: "song",
    frameRelPaths: [
      "art/slideshows/album5/T36/sih_t36_f01.webp",
      "art/slideshows/album5/T36/sih_t36_f02.webp",
      "art/slideshows/album5/T36/sih_t36_f03.webp",
      "art/slideshows/album5/T36/sih_t36_f04.webp",
      "art/slideshows/album5/T36/sih_t36_f05.webp",
      "art/slideshows/album5/T36/sih_t36_f06.webp",
      "art/slideshows/album5/T36/sih_t36_f07.webp",
      "art/slideshows/album5/T36/sih_t36_f08.webp",
      "art/slideshows/album5/T36/sih_t36_f09.webp",
      "art/slideshows/album5/T36/sih_t36_f10.webp",
      "art/slideshows/album5/T36/sih_t36_f11.webp",
      "art/slideshows/album5/T36/sih_t36_f12.webp",
      "art/slideshows/album5/T36/sih_t36_f13.webp",
      "art/slideshows/album5/T36/sih_t36_f14.webp",
      "art/slideshows/album5/T36/sih_t36_f15.webp",
      "art/slideshows/album5/T36/sih_t36_f16.webp",
      "art/slideshows/album5/T36/sih_t36_f17.webp",
    ],
  },
  {
    id: "T37",
    title: "The Story is Yours Now",
    act: 3,
    kind: "dialog",
    frameRelPaths: [
      "art/slideshows/album5/T37/sih_t37_f01.webp",
      "art/slideshows/album5/T37/sih_t37_f02.webp",
      "art/slideshows/album5/T37/sih_t37_f03.webp",
      "art/slideshows/album5/T37/sih_t37_f04.webp",
      "art/slideshows/album5/T37/sih_t37_f05.webp",
    ],
  },
];

/* ─── Narrator portrait catalog (10 Antiquarian + 10 Storyteller) ─── */

export type Album5PortraitId =
  | "sih_antiq_archive"
  | "sih_antiq_argue"
  | "sih_antiq_awe"
  | "sih_antiq_concede"
  | "sih_antiq_dread"
  | "sih_antiq_grief"
  | "sih_antiq_neutral"
  | "sih_antiq_peace"
  | "sih_antiq_warn"
  | "sih_antiq_wry"
  | "sih_story_broken"
  | "sih_story_challenge"
  | "sih_story_defiant"
  | "sih_story_fire"
  | "sih_story_grief"
  | "sih_story_joy"
  | "sih_story_knowing"
  | "sih_story_tender"
  | "sih_story_triumph"
  | "sih_story_witness";

export interface Album5Portrait {
  id: Album5PortraitId;
  narrator: Album5NarratorId;
  expression: string;
  relPath: string;
}

export const ALBUM5_NARRATOR_PORTRAITS: readonly Album5Portrait[] = [
  { id: "sih_antiq_archive", narrator: "antiquarian", expression: "archive", relPath: "art/slideshows/album5/narrators/sih_antiq_archive.webp" },
  { id: "sih_antiq_argue", narrator: "antiquarian", expression: "argue", relPath: "art/slideshows/album5/narrators/sih_antiq_argue.webp" },
  { id: "sih_antiq_awe", narrator: "antiquarian", expression: "awe", relPath: "art/slideshows/album5/narrators/sih_antiq_awe.webp" },
  { id: "sih_antiq_concede", narrator: "antiquarian", expression: "concede", relPath: "art/slideshows/album5/narrators/sih_antiq_concede.webp" },
  { id: "sih_antiq_dread", narrator: "antiquarian", expression: "dread", relPath: "art/slideshows/album5/narrators/sih_antiq_dread.webp" },
  { id: "sih_antiq_grief", narrator: "antiquarian", expression: "grief", relPath: "art/slideshows/album5/narrators/sih_antiq_grief.webp" },
  { id: "sih_antiq_neutral", narrator: "antiquarian", expression: "neutral", relPath: "art/slideshows/album5/narrators/sih_antiq_neutral.webp" },
  { id: "sih_antiq_peace", narrator: "antiquarian", expression: "peace", relPath: "art/slideshows/album5/narrators/sih_antiq_peace.webp" },
  { id: "sih_antiq_warn", narrator: "antiquarian", expression: "warn", relPath: "art/slideshows/album5/narrators/sih_antiq_warn.webp" },
  { id: "sih_antiq_wry", narrator: "antiquarian", expression: "wry", relPath: "art/slideshows/album5/narrators/sih_antiq_wry.webp" },
  { id: "sih_story_broken", narrator: "storyteller", expression: "broken", relPath: "art/slideshows/album5/narrators/sih_story_broken.webp" },
  { id: "sih_story_challenge", narrator: "storyteller", expression: "challenge", relPath: "art/slideshows/album5/narrators/sih_story_challenge.webp" },
  { id: "sih_story_defiant", narrator: "storyteller", expression: "defiant", relPath: "art/slideshows/album5/narrators/sih_story_defiant.webp" },
  { id: "sih_story_fire", narrator: "storyteller", expression: "fire", relPath: "art/slideshows/album5/narrators/sih_story_fire.webp" },
  { id: "sih_story_grief", narrator: "storyteller", expression: "grief", relPath: "art/slideshows/album5/narrators/sih_story_grief.webp" },
  { id: "sih_story_joy", narrator: "storyteller", expression: "joy", relPath: "art/slideshows/album5/narrators/sih_story_joy.webp" },
  { id: "sih_story_knowing", narrator: "storyteller", expression: "knowing", relPath: "art/slideshows/album5/narrators/sih_story_knowing.webp" },
  { id: "sih_story_tender", narrator: "storyteller", expression: "tender", relPath: "art/slideshows/album5/narrators/sih_story_tender.webp" },
  { id: "sih_story_triumph", narrator: "storyteller", expression: "triumph", relPath: "art/slideshows/album5/narrators/sih_story_triumph.webp" },
  { id: "sih_story_witness", narrator: "storyteller", expression: "witness", relPath: "art/slideshows/album5/narrators/sih_story_witness.webp" },
];

/* ─── Dialog background catalog (18 environments) ─── */

export type Album5BackgroundId =
  | "sih_bg_agora"
  | "sih_bg_altar"
  | "sih_bg_antechamber"
  | "sih_bg_bowls"
  | "sih_bg_empty"
  | "sih_bg_gate"
  | "sih_bg_harvest"
  | "sih_bg_newearth"
  | "sih_bg_resurrection"
  | "sih_bg_sanctuary"
  | "sih_bg_seals"
  | "sih_bg_shore"
  | "sih_bg_silence"
  | "sih_bg_street"
  | "sih_bg_throne"
  | "sih_bg_trumpet_broadcast"
  | "sih_bg_void"
  | "sih_bg_wisdom";

export interface Album5Background {
  id: Album5BackgroundId;
  description: string;
  relPath: string;
}

export const ALBUM5_DIALOG_BACKGROUNDS: readonly Album5Background[] = [
  { id: "sih_bg_agora", description: "Public debate space, holographic screens", relPath: "art/slideshows/album5/bg/sih_bg_agora.webp" },
  { id: "sih_bg_altar", description: "Golden altar, incense rising", relPath: "art/slideshows/album5/bg/sih_bg_altar.webp" },
  { id: "sih_bg_antechamber", description: "Waiting room before the throne", relPath: "art/slideshows/album5/bg/sih_bg_antechamber.webp" },
  { id: "sih_bg_bowls", description: "Plague ships, toxic harbor", relPath: "art/slideshows/album5/bg/sih_bg_bowls.webp" },
  { id: "sih_bg_empty", description: "Empty stage, final curtain", relPath: "art/slideshows/album5/bg/sih_bg_empty.webp" },
  { id: "sih_bg_gate", description: "Pearl gate, new city entrance", relPath: "art/slideshows/album5/bg/sih_bg_gate.webp" },
  { id: "sih_bg_harvest", description: "Golden wheat field, sickle moon", relPath: "art/slideshows/album5/bg/sih_bg_harvest.webp" },
  { id: "sih_bg_newearth", description: "Renewed earth, river of life", relPath: "art/slideshows/album5/bg/sih_bg_newearth.webp" },
  { id: "sih_bg_resurrection", description: "Digital resurrection chamber", relPath: "art/slideshows/album5/bg/sih_bg_resurrection.webp" },
  { id: "sih_bg_sanctuary", description: "Hidden resistance church, candlelight", relPath: "art/slideshows/album5/bg/sih_bg_sanctuary.webp" },
  { id: "sih_bg_seals", description: "Seal-breaking chamber, scroll fragments", relPath: "art/slideshows/album5/bg/sih_bg_seals.webp" },
  { id: "sih_bg_shore", description: "Crystal sea shore, aftermath", relPath: "art/slideshows/album5/bg/sih_bg_shore.webp" },
  { id: "sih_bg_silence", description: "The half-hour silence, empty cosmos", relPath: "art/slideshows/album5/bg/sih_bg_silence.webp" },
  { id: "sih_bg_street", description: "New Babylon street level, neon", relPath: "art/slideshows/album5/bg/sih_bg_street.webp" },
  { id: "sih_bg_throne", description: "Cosmic throne room, emerald rainbow", relPath: "art/slideshows/album5/bg/sih_bg_throne.webp" },
  { id: "sih_bg_trumpet_broadcast", description: "Broadcast tower, trumpet frequency", relPath: "art/slideshows/album5/bg/sih_bg_trumpet_broadcast.webp" },
  { id: "sih_bg_void", description: "Pre-creation void, swirling dark matter", relPath: "art/slideshows/album5/bg/sih_bg_void.webp" },
  { id: "sih_bg_wisdom", description: "Library of forbidden knowledge", relPath: "art/slideshows/album5/bg/sih_bg_wisdom.webp" },
];

/* ─── Lookup helpers (parity with Album 1/2/3/4) ─── */

const ALBUM5_MANIFEST = makeAssetManifest(ALBUM5_TRACKS, "id", "title");
const ALBUM5_PORTRAITS_BY_ID = new Map<Album5PortraitId, Album5Portrait>(
  ALBUM5_NARRATOR_PORTRAITS.map((p) => [p.id, p]),
);
const ALBUM5_BACKGROUNDS_BY_ID = new Map<Album5BackgroundId, Album5Background>(
  ALBUM5_DIALOG_BACKGROUNDS.map((b) => [b.id, b]),
);

/** Resolve a track's first-frame URL. */
export function album5TitleUrl(id: Album5TrackId): string | undefined {
  const t = ALBUM5_MANIFEST.byId.get(id);
  return t ? assetUrl(t.frameRelPaths[0]) : undefined;
}

/** Resolve a track's frame-N URL (1-indexed). */
export function album5FrameUrl(id: Album5TrackId, frame: number): string | undefined {
  const t = ALBUM5_MANIFEST.byId.get(id);
  if (!t) return undefined;
  const path = t.frameRelPaths[frame - 1];
  return path ? assetUrl(path) : undefined;
}

/** All resolved URLs for a track in producer beat-order. */
export function album5FrameUrls(id: Album5TrackId): readonly string[] {
  const t = ALBUM5_MANIFEST.byId.get(id);
  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];
}

/** Tracks by act. */
export function album5TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album5TrackDef[] {
  return ALBUM5_MANIFEST.byField("act", act);
}

/** Tracks by song/dialog kind. */
export function album5TracksByKind(kind: Album5TrackKind): readonly Album5TrackDef[] {
  return ALBUM5_TRACKS.filter((t) => t.kind === kind);
}

/** Resolve a narrator portrait URL by id. */
export function album5PortraitUrl(id: Album5PortraitId): string | undefined {
  const p = ALBUM5_PORTRAITS_BY_ID.get(id);
  return p ? assetUrl(p.relPath) : undefined;
}

/** Resolve a dialog background URL by id. */
export function album5BackgroundUrl(id: Album5BackgroundId): string | undefined {
  const b = ALBUM5_BACKGROUNDS_BY_ID.get(id);
  return b ? assetUrl(b.relPath) : undefined;
}

export const ALBUM5_TRACK_TOTAL = 37;
export const ALBUM5_FRAME_TOTAL = 552;
export const ALBUM5_PORTRAIT_TOTAL = 20;
export const ALBUM5_BACKGROUND_TOTAL = 18;
