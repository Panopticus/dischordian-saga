#!/usr/bin/env node
/* Emit the apps/shared/expansionArt/album3Slideshows.ts manifest from
   /tmp/bod/upload-inventory.json. Re-runnable on producer redrop.

   Album 3 — "The Book of Daniel 24:7" — is the longest of the slideshow
   drops to date: 22 tracks, 567 frames, ~111 minutes of visual narrative
   at 3168×1344 (matching Album 1 and 2's resolution; Album 5's was
   different).

   Per-track titles + 3-act thematic split per the producer's
   ALBUM_MANIFEST.md inside the zip. */
import { readFile, writeFile } from "node:fs/promises";

const TRACK_TITLES = {
  T01: "Dischordian Logic",
  T02: "Sticks in Harmony",
  T03: "Numb",
  T04: "The Last Stand",
  T05: "Kismet",
  T06: "Shades of Grey",
  T07: "Virtual Reality",
  T08: "Consider Life",
  T09: "Liber AL",
  T10: "Remembering How to Move On",
  T11: "Polarity",
  T12: "Mental Slavery",
  T13: "Identity",
  T14: "The Lion in Black",
  T15: "Nondenominational",
  T16: "Paradise Lost",
  T17: "Usikue MSHY (Keep a Girl in School)",
  T18: "Noxicans",
  T19: "The Secret of Words",
  T20: "Interactive Faustian Life",
  T21: "Deep Thoughts",
  T22: "Family Tree",
};

// Three-act thematic arc per ALBUM_MANIFEST.md:
//   Act I  (The Awakening):    T01-T07  (7 tracks)
//   Act II (The Struggle):     T08-T14  (7 tracks)
//   Act III(The Resolution):   T15-T22  (8 tracks)
// Encoded as 1 | 2 | 3; the Album3TrackDef.act type stays the
// same 1..5 union as Albums 1 / 2 / 5 so consumers can union-merge.
const TRACK_ACT = {
  T01: 1, T02: 1, T03: 1, T04: 1, T05: 1, T06: 1, T07: 1,
  T08: 2, T09: 2, T10: 2, T11: 2, T12: 2, T13: 2, T14: 2,
  T15: 3, T16: 3, T17: 3, T18: 3, T19: 3, T20: 3, T21: 3, T22: 3,
};

const inv = JSON.parse(await readFile("/tmp/bod/upload-inventory.json", "utf8"));

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
lines.push("   ALBUM 3 — THE BOOK OF DANIEL 24:7 · SLIDESHOW MANIFEST");
lines.push("");
lines.push("   Source: producer drop");
lines.push("   s3://dgrsart/Album Slide Show/BOOK_OF_DANIEL_247_COMPLETE.zip");
lines.push("   (2026-04-29). 22 tracks · 567 frames · ~111 minutes of");
lines.push("   visual narrative at 3168×1344 21:9 cinematic widescreen,");
lines.push("   cel-shaded anime — Afro Samurai × Cowboy Bebop × Cyberpunk");
lines.push("   Edgerunners.");
lines.push("");
lines.push("   In-universe framing: this is the journal The Programmer");
lines.push("   (Dr. Daniel Cross) writes during the Insurgency — the");
lines.push("   same character who later becomes The Antiquarian per");
lines.push("   Album 5's MASTER_BIBLE_NOTES. The album title's 24:7 isn't");
lines.push("   a Bible chapter (Daniel only has 12) — it's the watch");
lines.push("   epigraph: Daniel watches 24/7.");
lines.push("");
lines.push("   PNG → WebP @ q85 on upload. Files served from:");
lines.push("     cdn/client-public/art/slideshows/album3/T<NN>/<file>.webp");
lines.push("");
lines.push("   Layout mirrors the producer zip 1:1. Per-track titles +");
lines.push("   3-act thematic buckets per the producer's ALBUM_MANIFEST.md:");
lines.push("");
lines.push("     Act I  (The Awakening):  T01-T07 (Dischordian Logic →");
lines.push("                              Sticks in Harmony → Numb → Last");
lines.push("                              Stand → Kismet → Shades of Grey");
lines.push("                              → Virtual Reality)");
lines.push("     Act II (The Struggle):   T08-T14 (Consider Life → Liber AL");
lines.push("                              → Remembering How to Move On →");
lines.push("                              Polarity → Mental Slavery →");
lines.push("                              Identity → The Lion in Black)");
lines.push("     Act III(The Resolution): T15-T22 (Nondenominational →");
lines.push("                              Paradise Lost → Usikue MSHY →");
lines.push("                              Noxicans → Secret of Words →");
lines.push("                              Faustian Life → Deep Thoughts →");
lines.push("                              Family Tree)");
lines.push("");
lines.push("   Lore-direct anchors for the Dreamer-recruitment plan");
lines.push("   (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):");
lines.push("     - T09 \"Liber AL\"      — Crowley's Book of the Law as direct");
lines.push("                             reference. Gnostic / occult overlay.");
lines.push("                             Strong vision-≥7 candidate.");
lines.push("     - T11 \"Polarity\"      — Hermetic principle (one of the");
lines.push("                             seven). Substrate-of-reality motif.");
lines.push("     - T17 \"Usikue MSHY\"  — Swahili \"Keep a Girl in School\".");
lines.push("                             Pairs with Album 2's UHURU /");
lines.push("                             UKWELI / NGUVU encryption — same");
lines.push("                             cipher universe.");
lines.push("     - T20 \"Interactive Faustian Life\" — the recruitment");
lines.push("                             allegory itself. Either-side hook.");
lines.push("     - T22 \"Family Tree\"  — homecoming. Producer manifest");
lines.push("                             closes with \"Karibu kwenye");
lines.push("                             familia\" (Welcome to the family,");
lines.push("                             Swahili). Strong vision-≥23");
lines.push("                             candidate (the Dreamer welcomes).");
lines.push("");
lines.push("   Generator: scripts/_gen-album3-manifest.mjs (re-run after");
lines.push("   any producer redrop).");
lines.push("   ═══════════════════════════════════════════════════════ */");
lines.push("");
lines.push('import { assetUrl } from "../../client/src/lib/assetUrl";');
lines.push('import { makeAssetManifest } from "./_assetManifest";');
lines.push("");
lines.push("export type Album3TrackId =");
lines.push(tracks.map((t) => `  | "${t}"`).join("\n") + ";");
lines.push("");
lines.push("export interface Album3TrackDef {");
lines.push("  id: Album3TrackId;");
lines.push("  title: string;");
lines.push("  /** 1..3, mapping the producer manifest's three-act thematic");
lines.push("   *  arc. Type stays compatible with the other album manifests'");
lines.push("   *  1..5 union so consumers can merge across albums. */");
lines.push("  act: 1 | 2 | 3 | 4 | 5;");
lines.push("  /** Frame relPaths in producer order — title card first,");
lines.push("   *  then numbered beats. Album 3 has no alt-take siblings. */");
lines.push("  frameRelPaths: readonly string[];");
lines.push("}");
lines.push("");
lines.push("export const ALBUM3_TRACKS: readonly Album3TrackDef[] = [");
for (const t of tracks) {
  const frames = byTrack.get(t);
  lines.push("  {");
  lines.push(`    id: "${t}",`);
  lines.push(`    title: ${JSON.stringify(TRACK_TITLES[t] ?? t)},`);
  lines.push(`    act: ${TRACK_ACT[t]},`);
  lines.push("    frameRelPaths: [");
  for (const f of frames) {
    const webp = f.replace(/\.png$/u, ".webp");
    lines.push(`      "art/slideshows/album3/${t}/${webp}",`);
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
lines.push("const ALBUM3_MANIFEST = makeAssetManifest(ALBUM3_TRACKS, \"id\", \"title\");");
lines.push("");
lines.push("/** Resolve a track's title-card URL (the first frame). */");
lines.push("export function album3TitleUrl(id: Album3TrackId): string | undefined {");
lines.push("  const t = ALBUM3_MANIFEST.byId.get(id);");
lines.push("  return t ? assetUrl(t.frameRelPaths[0]) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** Resolve a track's frame-N URL (1-indexed; 1 = title card). */");
lines.push("export function album3FrameUrl(id: Album3TrackId, frame: number): string | undefined {");
lines.push("  const t = ALBUM3_MANIFEST.byId.get(id);");
lines.push("  if (!t) return undefined;");
lines.push("  const path = t.frameRelPaths[frame - 1];");
lines.push("  return path ? assetUrl(path) : undefined;");
lines.push("}");
lines.push("");
lines.push("/** All resolved URLs for a track in producer beat-order. */");
lines.push("export function album3FrameUrls(id: Album3TrackId): readonly string[] {");
lines.push("  const t = ALBUM3_MANIFEST.byId.get(id);");
lines.push("  return t ? t.frameRelPaths.map((p) => assetUrl(p)) : [];");
lines.push("}");
lines.push("");
lines.push("/** Tracks that belong to a given thematic act (1..3 for Album 3;");
lines.push("    type accepts 1..5 to stay compatible with the other albums). */");
lines.push("export function album3TracksByAct(act: 1 | 2 | 3 | 4 | 5): readonly Album3TrackDef[] {");
lines.push("  return ALBUM3_MANIFEST.byField(\"act\", act);");
lines.push("}");
lines.push("");
lines.push(`export const ALBUM3_TRACK_TOTAL = ${tracks.length};`);
lines.push(`export const ALBUM3_FRAME_TOTAL = ${inv.length};`);
lines.push("");

await writeFile(
  "/home/user/dischordian-saga/apps/shared/expansionArt/album3Slideshows.ts",
  lines.join("\n"),
);
console.log(`Wrote apps/shared/expansionArt/album3Slideshows.ts: ${tracks.length} tracks, ${inv.length} frames.`);
