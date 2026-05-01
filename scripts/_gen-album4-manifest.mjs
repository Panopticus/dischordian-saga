#!/usr/bin/env node
/* Emit the apps/shared/expansionArt/album4Slideshows.ts manifest from
   /tmp/album4/upload-inventory.json. Re-runnable on producer redrop.

   Mirrors scripts/_gen-album1-manifest.mjs and _gen-album2-manifest.mjs —
   same shape, but Album 4 ("West by God") is an album-movie at a
   different resolution (2752×1536) with a 3-act movie structure
   rather than the 5-act split that Albums 1 and 2 use. Per-track
   titles + act buckets per the producer's MANIFEST.md (April 2026
   drop).

   Note on numbering: the producer drop's filename is
   `WestByGod_Album5_Complete.zip`, but the canonical album order
   per the user is 4 — the producer label was a working number that
   didn't survive the final ordering. We keep the producer's literal
   zip filename in the source-attribution comment but use the
   canonical "Album 4" everywhere else. */
import { readFile, writeFile } from "node:fs/promises";

const TRACK_TITLES = {
  T01: "We Are Not Okay",
  T02: "Medicated",
  T03: "Hypnotized",
  T04: "It Ain't Illegal (...Yet)",
  T05: "Monuments",
  T06: "Damned for Sure",
  T07: "It Ain't Been the Same (Born Under a Bad Sign)",
  T08: "On the Road",
  T09: "The Death of Music",
  T10: "Yes I Do (Dream)",
};

// Three-act movie structure derived from the producer manifest's
// thematic groupings:
//   Act I (Setup):           T01-T03 — Awakening, medicated, first contact
//   Act II (Confrontation):  T04-T07 — Hacking → monuments → backstory
//   Act III (Resolution):    T08-T10 — Road → BABEL → epilogue
const TRACK_ACT = {
  T01: 1, T02: 1, T03: 1,
  T04: 2, T05: 2, T06: 2, T07: 2,
  T08: 3, T09: 3, T10: 3,
};

const inv = JSON.parse(await readFile("/tmp/album4/upload-inventory.json", "utf8"));

const byTrack = new Map();
for (const e of inv) {
  const m = /^T(\d{2})\//.exec(e.rel);
  if (!m) continue;
  const trackId = `T${m[1]}`;
  if (!byTrack.has(trackId)) byTrack.set(trackId, []);
  byTrack.get(trackId).push(e.rel.split("/")[1]);
}

function frameSortKey(name) {
  const titleMatch = /_(\d+)_title\.png$/.exec(name);
  if (titleMatch) return [0, parseInt(titleMatch[1], 10)];
  const numMatch = /_(\d+)\.png$/.exec(name);
  if (numMatch) return [1, parseInt(numMatch[1], 10)];
  return [2, 0];
}
for (const list of byTrack.values()) {
  list.sort((a, b) => {
    const ka = frameSortKey(a);
    const kb = frameSortKey(b);
    return ka[0] - kb[0] || ka[1] - kb[1];
  });
}

const tracks = [...byTrack.keys()].sort();

const lines = [];
lines.push("/* ═══════════════════════════════════════════════════════");
lines.push("   ALBUM 4 — WEST BY GOD · SLIDESHOW MANIFEST");
lines.push("");
lines.push("   Source: producer drop");
lines.push("   s3://dgrsart/Album Slide Show/WestByGod_Album5_Complete.zip");
lines.push("   (2026-04-29). 10 tracks · 200 frames · 2752×1536 16:9");
lines.push("   cinematic widescreen — Cowboy Bebop × Cyberpunk Edgerunners");
lines.push("   × Afro Samurai. Era bridge: Age of Privacy → Age of");
lines.push("   Revelation (~17,020-17,030 A.A.). Album-movie format —");
lines.push("   a single continuous narrative across 10 chapters rather");
lines.push("   than the 5-act split Albums 1 and 2 use.");
lines.push("");
lines.push("   Note on numbering: the producer-side filename calls this");
lines.push("   \"Album 5\" (WestByGod_Album5_Complete.zip), but the");
lines.push("   canonical ordering per the saga is Album 4 — the producer");
lines.push("   label was a working number that didn't survive the final");
lines.push("   ordering. We keep the producer's literal zip filename in");
lines.push("   the attribution comment but use Album 4 everywhere else.");
lines.push("");
lines.push("   PNG → WebP @ q85 on upload. Files served from:");
lines.push("     cdn/client-public/art/slideshows/album4/T<NN>/<file>.webp");
lines.push("");
lines.push("   Layout mirrors the producer zip 1:1. Per-track titles +");
lines.push("   3-act movie buckets per the producer's MANIFEST.md and");
lines.push("   MASTER_BIBLE_NOTES.md.");
lines.push("");
lines.push("   Hidden-lore reveals visualised in the frames (per the");
lines.push("   producer's MASTER_BIBLE_NOTES.md — surface as Loredex");
lines.push("   unlock-condition gates, NOT as overt UI text):");
lines.push("     - The Programmer (Daniel Cross) IS the Antiquarian");
lines.push("       across time.");
lines.push("     - Malkia Ukweli IS The Enigma — the artist-as-character.");
lines.push("     - The Ark is a plague ship — Thought Virus in life");
lines.push("       support and water.");
lines.push("     - The number 47 is the Warlord's signature, planted");
lines.push("       throughout the album.");
lines.push("     - The Meme is hiding as the White Oracle after the Fall.");
lines.push("     - The Engineer was mind-swapped into Agent Zero's body.");
lines.push("     - The player lives in the ship Kael stole — Inception");
lines.push("       Ark 1047.");
lines.push("     - Player designation is Prisoner 74 (not Subject Zero).");
lines.push("");
lines.push("   Lore-direct anchors for the Dreamer-recruitment plan");
lines.push("   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):");
lines.push("     - T03 Hypnotized — first contact between The Programmer");
lines.push("       and The Enigma; canonical Dreamer-side relay imagery.");
lines.push("     - T07 Born Under a Bad Sign — the Programmer's");
lines.push("       Appalachian backstory + confession; resonance with the");
lines.push("       \"who the Architect chose vs who the Dreamer chose\"");
lines.push("       fork.");
lines.push("     - T09 The Death of Music — BABEL tower assault,");
lines.push("       broadcast override; perfect frame source for vision");
lines.push("       threshold ≥13 (Hidden Hand) given the substrate motif.");
lines.push("     - T10 Yes I Do (Dream) — epilogue foreshadowing the");
lines.push("       Antiquarian; the natural climactic vision (≥23).");
lines.push("");
lines.push("   Generator: scripts/_gen-album4-manifest.mjs (re-run after");
lines.push("   any producer redrop).");
lines.push("   ═══════════════════════════════════════════════════════ */");
lines.push("");
lines.push('import { assetUrl } from "../../client/src/lib/assetUrl";');
lines.push('import { makeAssetManifest } from "./_assetManifest";');
lines.push("");
lines.push("export type Album4TrackId =");
lines.push(tracks.map((t) => `  | "${t}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album4TrackDef {");
lines.push("  id: Album4TrackId;");
lines.push("  title: string;");
lines.push("  /** 1..3, mapping the producer manifest's three-act movie");
lines.push("   *  structure. Type stays compatible with Album 1 / 2's");
lines.push("   *  1..5 act union so consumers can merge across albums. */");
lines.push("  act: 1 | 2 | 3 | 4 | 5;");
lines.push("  /** Frame relPaths in producer order — title card first,");
lines.push("   *  then numbered beats. Album 4 has no alt-take siblings. */");
lines.push("  frameRelPaths: readonly string[];");
lines.push("}");
lines.push("");
lines.push("export const ALBUM4_TRACKS: readonly Album4TrackDef[] = [");
for (const t of tracks) {
  const frames = byTrack.get(t);
  lines.push("  {");
  lines.push(`    id: "${t}",`);
  lines.push(`    title: ${JSON.stringify(TRACK_TITLES[t] ?? t)},`);
  lines.push(`    act: ${TRACK_ACT[t]},`);
  lines.push("    frameRelPaths: [");
  for (const f of frames) {
    const webp = f.replace(/\.png$/u, ".webp");
    lines.push(`      "art/slideshows/album4/${t}/${webp}",`);
  }
  lines.push("    ],");
  lines.push("  },");
}
lines.push("];");
lines.push("");
lines.push("/* Tracks expose a frame-array per entry rather than a single path,");
lines.push("   so the manifest helper's urlOf can't be reused as-is. We still take");
lines.push("   the byId map + byField filter from it; the per-frame resolver");
lines.push("   stays bespoke (it's a frame-N array index, not a field lookup). */");
lines.push("const ALBUM4_MANIFEST = makeAssetManifest(ALBUM4_TRACKS, \"id\", \"title\");");
lines.push("");
lines.push("/** Resolve a track's title-card URL (the first frame). */");
lines.push("export function album4TitleUrl(id: Album4TrackId): string | undefined {");
lines.push("  const t = ALBUM4_MANIFEST.byId.get(id);");
lines.push("  return t ? assetUrl(t.frameRelPaths[0]) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */");
lines.push("export function album4FrameUrl(id: Album4TrackId, frame: number): string | undefined {");
lines.push("  const t = ALBUM4_MANIFEST.byId.get(id);");
lines.push("  if (!t) return undefined;");
lines.push("  const path = t.frameRelPaths[frame - 1];");
lines.push("  return path ? assetUrl(path) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** All resolved URLs for a track in producer beat-order. */");
lines.push("export function album4FrameUrls(id: Album4TrackId): readonly string[] {");
lines.push("  const t = ALBUM4_MANIFEST.byId.get(id);");
lines.push("  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];");
lines.push("}");
lines.push("");
lines.push("/** Tracks that belong to a given movie-act (1..3 for Album 4;");
lines.push("    the type accepts 1..5 to stay compatible with Album 1/2). */");
lines.push("export function album4TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album4TrackDef[] {");
lines.push("  return ALBUM4_MANIFEST.byField(\"act\", act);");
lines.push("}");
lines.push("");
lines.push(`export const ALBUM4_TRACK_TOTAL = ${tracks.length};`);
lines.push(`export const ALBUM4_FRAME_TOTAL = ${inv.length};`);
lines.push("");

await writeFile(
  "/home/user/dischordian-saga/apps/shared/expansionArt/album4Slideshows.ts",
  lines.join("\n"),
);
console.log(`Wrote apps/shared/expansionArt/album4Slideshows.ts: ${tracks.length} tracks, ${inv.length} frames.`);
