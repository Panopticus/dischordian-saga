#!/usr/bin/env node
/* Emit the apps/shared/expansionArt/album6Slideshows.ts manifest from
   /tmp/album6/upload-inventory.json. Re-runnable on producer redrop.

   Album 6 — "Silence in Heaven" — has a richer schema than the other
   albums:
     - 37 tracks (alternating dialog/song; odd = dialog, even = song)
     - 552 track frames + 20 narrator portraits + 18 dialog backgrounds
     - Maps directly onto Book of Revelation chapters 1-22
     - Two narrators: The Antiquarian (10 expressions) + The Storyteller
       (10 expressions)
     - Lowercase frame naming convention (sih_t01_f01.png; no
       _00_title.png suffix like Albums 1/2/3/5 use)

   The manifest models the song/dialog discriminator + the narrator and
   background catalogs as auxiliary exports. Track-level frameRelPaths
   stays compatible with the slideshow renderer that consumes the other
   albums. */
import { readFile, writeFile } from "node:fs/promises";

const TRACK_TITLES = {
  T01: "In the Beginning was the Word",
  T02: "New Babylon Goddamn",
  T03: "A Spark That Cannot Be Silenced",
  T04: "Letters to the Remnant",
  T05: "A Conspiracy of Hope",
  T06: "Turn Back",
  T07: "The Door That Was Shut",
  T08: "Worthy",
  T09: "Not a Lion but a Lamb",
  T10: "Behold...",
  T11: "And the World Adjusted",
  T12: "Plead the Fifth",
  T13: "How Long",
  T14: "The Two Witnesses",
  T15: "And the Empire Celebrated",
  T16: "The Trumpets",
  T17: "A Third of the World",
  T18: "They Would Not Repent",
  T19: "The Lie that Looks Like the Truth",
  T20: "False Prophet",
  T21: "Here is Wisdom",
  T22: "Sixth Sense",
  T23: "Breath Between Judgments",
  T24: "Silence in Heaven",
  T25: "The Resurrection Glitch",
  T26: "The Mark",
  T27: "The Sorting of Souls",
  T28: "The Harvest",
  T29: "The Final Measure",
  T30: "It is Done",
  T31: "The Lament of Kings and Merchants",
  T32: "The Fall of New Babylon",
  T33: "Heaven Stands Open",
  T34: "Faithful and True",
  T35: "Make All Things New",
  T36: "The Final Truth",
  T37: "The Story is Yours Now",
};

// 3-act structure mapped onto Revelation:
//   ACT I  (The Throne Room): T01-T10  (Rev 1-8)
//   ACT II (The War):         T11-T24  (Rev 8-14)
//   ACT III(The Harvest):     T25-T37  (Rev 15-22)
const TRACK_ACT = {};
for (let n = 1; n <= 37; n++) {
  const id = `T${String(n).padStart(2, "0")}`;
  TRACK_ACT[id] = n <= 10 ? 1 : n <= 24 ? 2 : 3;
}

// Odd tracks are dialog, even are song — confirmed by the producer
// manifest's per-track type column. Hand-overrides in case the rule
// breaks for any future drop:
const TRACK_KIND = {};
for (let n = 1; n <= 37; n++) {
  const id = `T${String(n).padStart(2, "0")}`;
  TRACK_KIND[id] = n % 2 === 1 ? "dialog" : "song";
}

const NARRATOR_PORTRAITS = {
  // The Antiquarian — old Programmer; Chronicle book; gold embroidery.
  sih_antiq_archive: { narrator: "antiquarian", expression: "archive" },
  sih_antiq_argue:   { narrator: "antiquarian", expression: "argue" },
  sih_antiq_awe:     { narrator: "antiquarian", expression: "awe" },
  sih_antiq_concede: { narrator: "antiquarian", expression: "concede" },
  sih_antiq_dread:   { narrator: "antiquarian", expression: "dread" },
  sih_antiq_grief:   { narrator: "antiquarian", expression: "grief" },
  sih_antiq_neutral: { narrator: "antiquarian", expression: "neutral" },
  sih_antiq_peace:   { narrator: "antiquarian", expression: "peace" },
  sih_antiq_warn:    { narrator: "antiquarian", expression: "warn" },
  sih_antiq_wry:     { narrator: "antiquarian", expression: "wry" },
  // The Storyteller — old Black woman, multicolor duster, gold cross.
  sih_story_broken:    { narrator: "storyteller", expression: "broken" },
  sih_story_challenge: { narrator: "storyteller", expression: "challenge" },
  sih_story_defiant:   { narrator: "storyteller", expression: "defiant" },
  sih_story_fire:      { narrator: "storyteller", expression: "fire" },
  sih_story_grief:     { narrator: "storyteller", expression: "grief" },
  sih_story_joy:       { narrator: "storyteller", expression: "joy" },
  sih_story_knowing:   { narrator: "storyteller", expression: "knowing" },
  sih_story_tender:    { narrator: "storyteller", expression: "tender" },
  sih_story_triumph:   { narrator: "storyteller", expression: "triumph" },
  sih_story_witness:   { narrator: "storyteller", expression: "witness" },
};

const DIALOG_BACKGROUNDS = {
  sih_bg_agora:             "Public debate space, holographic screens",
  sih_bg_altar:             "Golden altar, incense rising",
  sih_bg_antechamber:       "Waiting room before the throne",
  sih_bg_bowls:             "Plague ships, toxic harbor",
  sih_bg_empty:             "Empty stage, final curtain",
  sih_bg_gate:              "Pearl gate, new city entrance",
  sih_bg_harvest:           "Golden wheat field, sickle moon",
  sih_bg_newearth:          "Renewed earth, river of life",
  sih_bg_resurrection:      "Digital resurrection chamber",
  sih_bg_sanctuary:         "Hidden resistance church, candlelight",
  sih_bg_seals:             "Seal-breaking chamber, scroll fragments",
  sih_bg_shore:             "Crystal sea shore, aftermath",
  sih_bg_silence:           "The half-hour silence, empty cosmos",
  sih_bg_street:            "New Babylon street level, neon",
  sih_bg_throne:            "Cosmic throne room, emerald rainbow",
  sih_bg_trumpet_broadcast: "Broadcast tower, trumpet frequency",
  sih_bg_void:              "Pre-creation void, swirling dark matter",
  sih_bg_wisdom:            "Library of forbidden knowledge",
};

const inv = JSON.parse(await readFile("/tmp/album6/upload-inventory.json", "utf8"));

const byTrack = new Map();
for (const e of inv) {
  const m = /^T(\d{2})\//.exec(e.rel);
  if (!m) continue;
  const trackId = `T${m[1]}`;
  if (!byTrack.has(trackId)) byTrack.set(trackId, []);
  byTrack.get(trackId).push(e.rel.split("/")[1]);
}

// Frame sort: producer files are `sih_t<nn>_f<NN>.png`. Numeric sort
// on the f<NN> part yields beat-correct ordering.
function frameSortKey(name) {
  const m = /_f(\d+)\.png$/.exec(name);
  return m ? parseInt(m[1], 10) : 9999;
}
for (const list of byTrack.values()) {
  list.sort((a, b) => frameSortKey(a) - frameSortKey(b));
}

const tracks = [...byTrack.keys()].sort();

const lines = [];
lines.push("/* ═══════════════════════════════════════════════════════");
lines.push("   ALBUM 6 — SILENCE IN HEAVEN · SLIDESHOW MANIFEST");
lines.push("");
lines.push("   Source: producer drop");
lines.push("   s3://dgrsart/Album Slide Show/SilenceInHeaven_Album6_Complete.zip");
lines.push("   (2026-04-29). 37 tracks · 552 track frames · 20 narrator");
lines.push("   portraits · 18 dialog backgrounds · 2752×1536 16:9 cinematic");
lines.push("   widescreen, cel-shaded anime — Afro Samurai × Cowboy Bebop ×");
lines.push("   Satoshi Kon. Era: Age of Revelation.");
lines.push("");
lines.push("   Scripture mapping: Book of Revelation chapters 1-22.");
lines.push("");
lines.push("   The album is structured as alternating dialog and song tracks:");
lines.push("   odd-numbered tracks are dialog (narrated scenes with portrait +");
lines.push("   background composite); even-numbered tracks are song (frame");
lines.push("   slideshows similar to Albums 1/2/3/5). The slideshow renderer");
lines.push("   can consume `frameRelPaths` uniformly for both kinds; consumers");
lines.push("   that want the dialog composite system can read `kind` and pull");
lines.push("   `ALBUM6_NARRATOR_PORTRAITS` + `ALBUM6_DIALOG_BACKGROUNDS`.");
lines.push("");
lines.push("   3-act structure:");
lines.push("     Act I  (The Throne Room):  T01-T10  Rev 1-8");
lines.push("     Act II (The War):          T11-T24  Rev 8-14");
lines.push("     Act III(The Harvest):      T25-T37  Rev 15-22");
lines.push("");
lines.push("   Two narrators (10 expressions each):");
lines.push("     The Antiquarian — old Programmer; Chronicle book.");
lines.push("     The Storyteller — old Black woman, gold cross, mic stand.");
lines.push("");
lines.push("   PNG → WebP @ q85 on upload. Files served from:");
lines.push("     cdn/client-public/art/slideshows/album6/T<NN>/<file>.webp");
lines.push("     cdn/client-public/art/slideshows/album6/narrators/<file>.webp");
lines.push("     cdn/client-public/art/slideshows/album6/bg/<file>.webp");
lines.push("");
lines.push("   Lore-direct anchors for the Dreamer-recruitment plan");
lines.push("   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):");
lines.push("     - The Antiquarian narrates this album. Album 5's bible");
lines.push("       confirms Antiquarian = old Programmer (Daniel Cross).");
lines.push("       The Antiquarian portraits here are the canonical");
lines.push("       Architect-side narrator face when used in vision");
lines.push("       cutscenes (B1 in the plan).");
lines.push("     - T14 \"The Two Witnesses\"  — direct match for the");
lines.push("       \"Architect / Dreamer dual recruitment\" frame. Either");
lines.push("       Programmer + Enigma OR Architect + Dreamer can read.");
lines.push("       Strong vision-≥13 candidate.");
lines.push("     - T19 \"The Lie that Looks Like the Truth\" — surveillance");
lines.push("       / Meme / false-prophet motif. Vision-≥7 candidate.");
lines.push("     - T24 \"Silence in Heaven\" — title track. Half-hour");
lines.push("       silence. The Dreamer's signature is silence; this");
lines.push("       track is the album's name and the Dreamer's anthem.");
lines.push("       Strong vision-≥23 candidate.");
lines.push("     - T36 \"The Final Truth\" + T37 \"The Story is Yours Now\"");
lines.push("       — finale + epilogue. Producer's easter-egg list");
lines.push("       includes \"The Third Chair\" (T36 F15) inviting the");
lines.push("       audience to continue the story — a literal");
lines.push("       fourth-wall recruitment moment.");
lines.push("");
lines.push("   Producer-flagged easter eggs (surface as Loredex unlocks");
lines.push("   via discoveryFlags or first-discoverer registry):");
lines.push("     - T36 final: Soft Pink Goggles (only color shift in");
lines.push("       the entire album).");
lines.push("     - T34 F11: The Necromancer's Choice — only Archon who");
lines.push("       chose rebellion.");
lines.push("     - T36 F15: The Third Chair — fourth-wall invitation.");
lines.push("     - T36 F17: The Golden Spark — first-and-last eternal");
lines.push("       light, emotional capstone.");
lines.push("     - T26: The Transparent Remnant — those who DECLINED");
lines.push("       become invisible to the empire.");
lines.push("     - T30: The Source's Bowl-Ships — \"the man the empire");
lines.push("       made, now the empire receives its own creation.\"");
lines.push("     - T34 F19: Real Sky — first time people see actual");
lines.push("       stars, dome gone forever.");
lines.push("     - T36 F12: The Chronicle Passes — left on a coffee shop");
lines.push("       table for the next reader.");
lines.push("");
lines.push("   Generator: scripts/_gen-album6-manifest.mjs (re-run after");
lines.push("   any producer redrop).");
lines.push("   ═══════════════════════════════════════════════════════ */");
lines.push("");
lines.push('import { assetUrl } from "../../client/src/lib/assetUrl";');
lines.push('import { makeAssetManifest } from "./_assetManifest";');
lines.push("");
lines.push("export type Album6TrackId =");
lines.push(tracks.map((t) => `  | "${t}"`).join("\n") + ";");
lines.push("");
lines.push("/** Track kind: alternating per the producer's structure. */");
lines.push("export type Album6TrackKind = \"song\" | \"dialog\";");
lines.push("");
lines.push("/** Narrator identity for dialog-track portraits. */");
lines.push("export type Album6NarratorId = \"antiquarian\" | \"storyteller\";");
lines.push("");
lines.push("export interface Album6TrackDef {");
lines.push("  id: Album6TrackId;");
lines.push("  title: string;");
lines.push("  /** 1..3, mapping the Revelation-arc act split. Type stays");
lines.push("   *  compatible with the other album manifests' 1..5 union. */");
lines.push("  act: 1 | 2 | 3 | 4 | 5;");
lines.push("  /** Track type. Dialog tracks expect a narrator portrait +");
lines.push("   *  background composite at runtime; song tracks are pure");
lines.push("   *  slideshow. */");
lines.push("  kind: Album6TrackKind;");
lines.push("  /** Frame relPaths in producer order. Numbered f01..f<N>;");
lines.push("   *  Album 6's producer naming is `sih_t<nn>_f<NN>.png` rather");
lines.push("   *  than the `T<NN>_<NN>.png` Albums 1/2/3/5 use. */");
lines.push("  frameRelPaths: readonly string[];");
lines.push("}");
lines.push("");
lines.push("export const ALBUM6_TRACKS: readonly Album6TrackDef[] = [");
for (const t of tracks) {
  const frames = byTrack.get(t);
  lines.push("  {");
  lines.push(`    id: "${t}",`);
  lines.push(`    title: ${JSON.stringify(TRACK_TITLES[t] ?? t)},`);
  lines.push(`    act: ${TRACK_ACT[t]},`);
  lines.push(`    kind: ${JSON.stringify(TRACK_KIND[t])},`);
  lines.push("    frameRelPaths: [");
  for (const f of frames) {
    const webp = f.replace(/\.png$/u, ".webp");
    lines.push(`      "art/slideshows/album6/${t}/${webp}",`);
  }
  lines.push("    ],");
  lines.push("  },");
}
lines.push("];");
lines.push("");
lines.push("/* ─── Narrator portrait catalog (10 Antiquarian + 10 Storyteller) ─── */");
lines.push("");
lines.push("export type Album6PortraitId =");
const portraitIds = Object.keys(NARRATOR_PORTRAITS).sort();
lines.push(portraitIds.map((p) => `  | "${p}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album6Portrait {");
lines.push("  id: Album6PortraitId;");
lines.push("  narrator: Album6NarratorId;");
lines.push("  expression: string;");
lines.push("  relPath: string;");
lines.push("}");
lines.push("");
lines.push("export const ALBUM6_NARRATOR_PORTRAITS: readonly Album6Portrait[] = [");
for (const p of portraitIds) {
  const meta = NARRATOR_PORTRAITS[p];
  lines.push(`  { id: "${p}", narrator: "${meta.narrator}", expression: ${JSON.stringify(meta.expression)}, relPath: "art/slideshows/album6/narrators/${p}.webp" },`);
}
lines.push("];");
lines.push("");
lines.push("/* ─── Dialog background catalog (18 environments) ─── */");
lines.push("");
lines.push("export type Album6BackgroundId =");
const bgIds = Object.keys(DIALOG_BACKGROUNDS).sort();
lines.push(bgIds.map((b) => `  | "${b}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album6Background {");
lines.push("  id: Album6BackgroundId;");
lines.push("  description: string;");
lines.push("  relPath: string;");
lines.push("}");
lines.push("");
lines.push("export const ALBUM6_DIALOG_BACKGROUNDS: readonly Album6Background[] = [");
for (const b of bgIds) {
  lines.push(`  { id: "${b}", description: ${JSON.stringify(DIALOG_BACKGROUNDS[b])}, relPath: "art/slideshows/album6/bg/${b}.webp" },`);
}
lines.push("];");
lines.push("");
lines.push("/* ─── Lookup helpers (parity with Album 1/2/3/5) ─── */");
lines.push("");
lines.push("const ALBUM6_MANIFEST = makeAssetManifest(ALBUM6_TRACKS, \"id\", \"title\");");
lines.push("const ALBUM6_PORTRAITS_BY_ID = new Map<Album6PortraitId, Album6Portrait>(");
lines.push("  ALBUM6_NARRATOR_PORTRAITS.map((p) => [p.id, p]),");
lines.push(");");
lines.push("const ALBUM6_BACKGROUNDS_BY_ID = new Map<Album6BackgroundId, Album6Background>(");
lines.push("  ALBUM6_DIALOG_BACKGROUNDS.map((b) => [b.id, b]),");
lines.push(");");
lines.push("");
lines.push("/** Resolve a track's first-frame URL. */");
lines.push("export function album6TitleUrl(id: Album6TrackId): string | undefined {");
lines.push("  const t = ALBUM6_MANIFEST.byId.get(id);");
lines.push("  return t ? assetUrl(t.frameRelPaths[0]) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a track's frame-N URL (1-indexed). */");
lines.push("export function album6FrameUrl(id: Album6TrackId, frame: number): string | undefined {");
lines.push("  const t = ALBUM6_MANIFEST.byId.get(id);");
lines.push("  if (!t) return undefined;");
lines.push("  const path = t.frameRelPaths[frame - 1];");
lines.push("  return path ? assetUrl(path) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** All resolved URLs for a track in producer beat-order. */");
lines.push("export function album6FrameUrls(id: Album6TrackId): readonly string[] {");
lines.push("  const t = ALBUM6_MANIFEST.byId.get(id);");
lines.push("  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];");
lines.push("}");
lines.push("");
lines.push("/** Tracks by act. */");
lines.push("export function album6TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album6TrackDef[] {");
lines.push("  return ALBUM6_MANIFEST.byField(\"act\", act);");
lines.push("}");
lines.push("");
lines.push("/** Tracks by song/dialog kind. */");
lines.push("export function album6TracksByKind(kind: Album6TrackKind): readonly Album6TrackDef[] {");
lines.push("  return ALBUM6_TRACKS.filter((t) => t.kind === kind);");
lines.push("}");
lines.push("");
lines.push("/** Resolve a narrator portrait URL by id. */");
lines.push("export function album6PortraitUrl(id: Album6PortraitId): string | undefined {");
lines.push("  const p = ALBUM6_PORTRAITS_BY_ID.get(id);");
lines.push("  return p ? assetUrl(p.relPath) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a dialog background URL by id. */");
lines.push("export function album6BackgroundUrl(id: Album6BackgroundId): string | undefined {");
lines.push("  const b = ALBUM6_BACKGROUNDS_BY_ID.get(id);");
lines.push("  return b ? assetUrl(b.relPath) : undefined;");
lines.push("}");
lines.push("");
lines.push(`export const ALBUM6_TRACK_TOTAL = ${tracks.length};`);
lines.push(`export const ALBUM6_FRAME_TOTAL = ${inv.length};`);
lines.push(`export const ALBUM6_PORTRAIT_TOTAL = ${portraitIds.length};`);
lines.push(`export const ALBUM6_BACKGROUND_TOTAL = ${bgIds.length};`);
lines.push("");

await writeFile(
  "/home/user/dischordian-saga/apps/shared/expansionArt/album6Slideshows.ts",
  lines.join("\n"),
);
console.log(`Wrote apps/shared/expansionArt/album6Slideshows.ts: ${tracks.length} tracks, ${inv.length} frames, ${portraitIds.length} portraits, ${bgIds.length} backgrounds.`);
