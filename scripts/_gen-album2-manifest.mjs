#!/usr/bin/env node
/* Emit the apps/shared/expansionArt/album2Slideshows.ts manifest from
   /tmp/album2/upload-inventory.json. Re-runnable on producer redrop.

   Mirrors scripts/_gen-album1-manifest.mjs — same shape, different
   per-track titles and act buckets per the producer's
   ALBUM_2_MANIFEST.md (April 2026 drop). */
import { readFile, writeFile } from "node:fs/promises";

const TRACK_TITLES = {
  T01: "NØNOS",
  T02: "Building the Architect",
  T03: "Rain",
  T04: "What Connects Us?",
  T05: "The Experiment",
  T06: "Top Floor Door",
  T07: "Choose Your Mask",
  T08: "The Collector",
  T09: "The Prisoner",
  T10: "Zero Trust",
  T11: "The Warden",
  T12: "The Politician",
  T13: "The Change Conspiracy",
  T14: "This Ain't A Song",
  T15: "The Meme Civilization",
  T16: "The Watcher",
  T17: "The Deployment",
  T18: "Hard NØX Life",
  T19: "Ocularum",
  T20: "Silence Is Consent",
};

// Act split per the producer manifest:
//   Act I  (Architecture of Control): T01-T05
//   Act II (Systems of Power):        T06-T10
//   Act III(Resistance Rising):       T11-T14
//   Act IV (The Network):             T15-T19
//   Act V  (The Finale):              T20
const TRACK_ACT = {
  T01: 1, T02: 1, T03: 1, T04: 1, T05: 1,
  T06: 2, T07: 2, T08: 2, T09: 2, T10: 2,
  T11: 3, T12: 3, T13: 3, T14: 3,
  T15: 4, T16: 4, T17: 4, T18: 4, T19: 4,
  T20: 5,
};

const inv = JSON.parse(await readFile("/tmp/album2/upload-inventory.json", "utf8"));

const byTrack = new Map();
for (const e of inv) {
  const m = /^T(\d{2})\//.exec(e.rel);
  if (!m) continue;
  const trackId = `T${m[1]}`;
  if (!byTrack.has(trackId)) byTrack.set(trackId, []);
  byTrack.get(trackId).push(e.rel.split("/")[1]); // bare filename
}

// Sort frames by their numeric index so the title card lands first
// and beat ordering is stable. Album 2 has no alt-take siblings —
// the simple natural sort is sufficient.
function frameSortKey(name) {
  // T01_00_title.png  → [0, 0]
  // T01_07.png        → [0, 7]
  // Title cards always sort before the numbered beats.
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
lines.push("   ALBUM 2 — THE AGE OF PRIVACY · SLIDESHOW MANIFEST");
lines.push("");
lines.push("   Source: producer drop");
lines.push("   s3://dgrsart/Album Slide Show/Album_2_Age_of_Privacy.zip");
lines.push("   (2026-04-29). 20 tracks · 334 frames · 3168x1344 cinematic");
lines.push("   widescreen, cel-shaded anime — Afro Samurai × Cowboy Bebop ×");
lines.push("   Cyberpunk Edgerunners.");
lines.push("");
lines.push("   PNG → WebP @ q85 on upload. Files served from:");
lines.push("     cdn/client-public/art/slideshows/album2/T<NN>/<file>.webp");
lines.push("");
lines.push("   Layout mirrors the producer zip 1:1. Per-track titles + act");
lines.push("   buckets per the producer's ALBUM_2_MANIFEST.md.");
lines.push("");
lines.push("   Producer-flagged easter eggs (planted in the artwork — surface");
lines.push("   them as Loredex unlocks via discoveryFlags or first-discoverer");
lines.push("   registry):");
lines.push("     - Number 47 on NØX terminals + building addresses");
lines.push("     - Frog God mask graffiti throughout New Babylon");
lines.push("     - UHURU / UKWELI / NGUVU Swahili encryption (decode-able)");
lines.push("     - T20 Frame 4: Niemöller's Corridor");
lines.push("     - T20 Frame 6: Four Archons naming + function reveal");
lines.push("     - T20 Frame 7: Iron Lion sunrise apparition");
lines.push("     - T20 Frame 9: Track-name fragments in golden sound waves");
lines.push("");
lines.push("   Generator: scripts/_gen-album2-manifest.mjs (re-run after");
lines.push("   any producer redrop).");
lines.push("   ═══════════════════════════════════════════════════════ */");
lines.push("");
lines.push('import { assetUrl } from "../../client/src/lib/assetUrl";');
lines.push('import { makeAssetManifest } from "./_assetManifest";');
lines.push("");
lines.push("export type Album2TrackId =");
lines.push(tracks.map((t) => `  | "${t}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album2TrackDef {");
lines.push("  id: Album2TrackId;");
lines.push("  title: string;");
lines.push("  /** 1..5, mirrors the producer manifest's act split. */");
lines.push("  act: 1 | 2 | 3 | 4 | 5;");
lines.push("  /** Frame relPaths in producer order — title card first,");
lines.push("   *  then numbered beats. Album 2 has no alt-take siblings. */");
lines.push("  frameRelPaths: readonly string[];");
lines.push("}");
lines.push("");
lines.push("export const ALBUM2_TRACKS: readonly Album2TrackDef[] = [");
for (const t of tracks) {
  const frames = byTrack.get(t);
  lines.push("  {");
  lines.push(`    id: "${t}",`);
  lines.push(`    title: ${JSON.stringify(TRACK_TITLES[t] ?? t)},`);
  lines.push(`    act: ${TRACK_ACT[t]},`);
  lines.push("    frameRelPaths: [");
  for (const f of frames) {
    const webp = f.replace(/\.png$/u, ".webp");
    lines.push(`      "art/slideshows/album2/${t}/${webp}",`);
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
lines.push("const ALBUM2_MANIFEST = makeAssetManifest(ALBUM2_TRACKS, \"id\", \"title\");");
lines.push("");
lines.push("/** Resolve a track's title-card URL (the first frame). */");
lines.push("export function album2TitleUrl(id: Album2TrackId): string | undefined {");
lines.push("  const t = ALBUM2_MANIFEST.byId.get(id);");
lines.push("  return t ? assetUrl(t.frameRelPaths[0]) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */");
lines.push("export function album2FrameUrl(id: Album2TrackId, frame: number): string | undefined {");
lines.push("  const t = ALBUM2_MANIFEST.byId.get(id);");
lines.push("  if (!t) return undefined;");
lines.push("  const path = t.frameRelPaths[frame - 1];");
lines.push("  return path ? assetUrl(path) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** All resolved URLs for a track in producer beat-order. */");
lines.push("export function album2FrameUrls(id: Album2TrackId): readonly string[] {");
lines.push("  const t = ALBUM2_MANIFEST.byId.get(id);");
lines.push("  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];");
lines.push("}");
lines.push("");
lines.push("/** Tracks that belong to a given act (1..5). */");
lines.push("export function album2TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album2TrackDef[] {");
lines.push("  return ALBUM2_MANIFEST.byField(\"act\", act);");
lines.push("}");
lines.push("");
lines.push(`export const ALBUM2_TRACK_TOTAL = ${tracks.length};`);
lines.push(`export const ALBUM2_FRAME_TOTAL = ${inv.length};`);
lines.push("");

await writeFile(
  "/home/user/dischordian-saga/apps/shared/expansionArt/album2Slideshows.ts",
  lines.join("\n"),
);
console.log(`Wrote apps/shared/expansionArt/album2Slideshows.ts: ${tracks.length} tracks, ${inv.length} frames.`);
