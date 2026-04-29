#!/usr/bin/env node
/* Emit the apps/shared/expansionArt/album1Slideshows.ts manifest from
   /tmp/album1/upload-inventory.json. Re-runnable on producer redrop. */
import { readFile, writeFile } from "node:fs/promises";

const TRACK_TITLES = {
  T01: "The Enigma's Lament",
  T02: "Dischordian Logic",
  T03: "Seeds of Inception",
  T04: "The Authority",
  T05: "The Politician's Reign",
  T06: "The Insurgency",
  T07: "To Be The Human",
  T08: "Rent Free",
  T09: "I Love War",
  T10: "Inner Circle",
  T11: "The Empire Reborn",
  T12: "I Am The Eyes That Watch",
  T13: "Previously On...",
  T14: "Control The Story",
  T15: "Never Revolution Today",
  T16: "Theft of All Time",
  T17: "The Red Death",
  T18: "Planet of the Wolf",
  T19: "The Syndicated",
  T20: "Looking Good",
  T21: "LoreDex",
  T22: "Ever Come Again",
  T23: "Wake Up",
  T24: "Welcome to Celebration",
  T25: "Previews",
  T26: "Hacking Reality",
  T27: "Governance Hub",
  T28: "Last Words",
  T29: "The Panopticon Breaks",
};

const TRACK_ACT = {
  T01: 1, T02: 1, T03: 1, T04: 1, T05: 1, T06: 1, T07: 1, T08: 1, T09: 1, T10: 1,
  T11: 2, T12: 2, T13: 2, T14: 2, T15: 2, T16: 2,
  T17: 3, T18: 3, T19: 3, T20: 3, T21: 3, T22: 3, T23: 3,
  T24: 4, T25: 4, T26: 4, T27: 4,
  T28: 5, T29: 5,
};

const inv = JSON.parse(await readFile("/tmp/album1/upload-inventory.json", "utf8"));

const byTrack = new Map();
for (const e of inv) {
  const m = /^T(\d{2})\//.exec(e.rel);
  if (!m) continue;
  const trackId = `T${m[1]}`;
  if (!byTrack.has(trackId)) byTrack.set(trackId, []);
  byTrack.get(trackId).push(e.rel.split("/")[1]); // bare filename
}
for (const list of byTrack.values()) list.sort();

const tracks = [...byTrack.keys()].sort();

const lines = [];
lines.push("/* ═══════════════════════════════════════════════════════");
lines.push("   ALBUM 1 — AGE OF DISCHORDIAN LOGIC · SLIDESHOW MANIFEST");
lines.push("");
lines.push("   Source: producer drop");
lines.push("   s3://dgrsart/Album Slide Show/Album_1_Age_of_Dischordian_Logic.zip");
lines.push("   (2026-04-28). 29 tracks · 490 frames · 3168x1344 cinematic");
lines.push("   widescreen, cel-shaded painterly anime.");
lines.push("");
lines.push("   PNG → WebP @ q85 on upload. Files served from:");
lines.push("     cdn/client-public/art/slideshows/album1/T<NN>/<file>.webp");
lines.push("");
lines.push("   Layout mirrors the producer zip 1:1. Per-track titles + act");
lines.push("   buckets per the producer's ALBUM_1_MANIFEST.md.");
lines.push("");
lines.push("   Generator: scripts/_gen-album1-manifest.mjs (re-run after");
lines.push("   any producer redrop).");
lines.push("   ═══════════════════════════════════════════════════════ */");
lines.push("");
lines.push('import { assetUrl } from "../../client/src/lib/assetUrl";');
lines.push('import { makeAssetManifest } from "./_assetManifest";');
lines.push("");
lines.push("export type Album1TrackId =");
lines.push(tracks.map((t) => `  | "${t}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album1TrackDef {");
lines.push("  id: Album1TrackId;");
lines.push("  title: string;");
lines.push("  /** 1..5, mirrors the producer manifest's act split. */");
lines.push("  act: 1 | 2 | 3 | 4 | 5;");
lines.push("  /** Frame relPaths in producer order. The first entry is the");
lines.push("   *  title card (`T<NN>_00_title.webp`); subsequent entries");
lines.push("   *  follow the producer's naming and may include alt-take");
lines.push("   *  `_frameN_M` siblings (T01 only) interleaved with the");
lines.push("   *  numbered beats. Consumers can filter by name shape. */");
lines.push("  frameRelPaths: readonly string[];");
lines.push("}");
lines.push("");
lines.push("export const ALBUM1_TRACKS: readonly Album1TrackDef[] = [");
for (const t of tracks) {
  const frames = byTrack.get(t);
  lines.push("  {");
  lines.push(`    id: "${t}",`);
  lines.push(`    title: ${JSON.stringify(TRACK_TITLES[t] ?? t)},`);
  lines.push(`    act: ${TRACK_ACT[t]},`);
  lines.push("    frameRelPaths: [");
  for (const f of frames) lines.push(`      "art/slideshows/album1/${t}/${f}",`);
  lines.push("    ],");
  lines.push("  },");
}
lines.push("];");
lines.push("");
lines.push("/* Tracks expose a frame-array per entry rather than a single path,");
lines.push("   so the manifest helper's urlOf can't be reused as-is. We still take");
lines.push("   the byId map + byField filter from it; the per-frame resolver");
lines.push("   stays bespoke (it's a frame-N array index, not a field lookup). */");
lines.push("const ALBUM1_MANIFEST = makeAssetManifest(ALBUM1_TRACKS, \"id\", \"title\");");
lines.push("");
lines.push("/** Resolve a track's title-card URL (the first frame). */");
lines.push("export function album1TitleUrl(id: Album1TrackId): string | undefined {");
lines.push("  const t = ALBUM1_MANIFEST.byId.get(id);");
lines.push("  return t ? assetUrl(t.frameRelPaths[0]) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */");
lines.push("export function album1FrameUrl(id: Album1TrackId, frame: number): string | undefined {");
lines.push("  const t = ALBUM1_MANIFEST.byId.get(id);");
lines.push("  if (!t) return undefined;");
lines.push("  const path = t.frameRelPaths[frame - 1];");
lines.push("  return path ? assetUrl(path) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** All resolved URLs for a track in producer beat-order. */");
lines.push("export function album1FrameUrls(id: Album1TrackId): readonly string[] {");
lines.push("  const t = ALBUM1_MANIFEST.byId.get(id);");
lines.push("  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];");
lines.push("}");
lines.push("");
lines.push("/** Tracks that belong to a given act (1..5). */");
lines.push("export function album1TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album1TrackDef[] {");
lines.push("  return ALBUM1_MANIFEST.byField(\"act\", act);");
lines.push("}");
lines.push("");
lines.push(`export const ALBUM1_TRACK_TOTAL = ${tracks.length};`);
lines.push(`export const ALBUM1_FRAME_TOTAL = ${inv.length};`);
lines.push("");

await writeFile(
  "/home/user/dischordian-saga/apps/shared/expansionArt/album1Slideshows.ts",
  lines.join("\n"),
);
console.log(`Wrote apps/shared/expansionArt/album1Slideshows.ts: ${tracks.length} tracks, ${inv.length} frames.`);
