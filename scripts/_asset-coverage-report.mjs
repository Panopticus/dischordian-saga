#!/usr/bin/env node
/**
 * Asset coverage report (local-only).
 *
 * Walks the typed art / cinematics / VFX / album manifests and tells you,
 * per asset URL, whether the local bytes the upload script needs are
 * actually present:
 *
 *   STAGED_READY       — file exists at apps/client/public/<rel>;
 *                        `pnpm assets:upload` will pick it up next run.
 *   NEEDS_CONVERT      — a same-basename source exists in
 *                        assets/intermediate/ or docs/art-originals/ but
 *                        not in the canonical CDN-staging path. Needs
 *                        format conversion + move.
 *   MISSING            — no source bytes anywhere in the working tree.
 *                        Either the producer hasn't delivered or the
 *                        prompt was authored but never rendered.
 *
 * The existing `scripts/_check-art-coverage.mjs` answers a different
 * question — "is this URL live on S3 right now?" That requires AWS
 * credentials and tells you nothing about *why* a URL is dead. This
 * script is the prerequisite: it explains which of the dead URLs are
 * cheap fixes (convert + upload) vs expensive ones (produce from
 * scratch). No credentials needed.
 *
 * Run: pnpm assets:coverage
 *
 * The manifest set mirrors `_check-art-coverage.mjs` so the two scripts
 * agree on the universe of URLs in scope.
 */
import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

import { TRADE_EMPIRE_ART_PROMPTS } from "../apps/shared/tradeEmpireArtPrompts.ts";
import { HIERARCHY_OF_DAMNED_ART } from "../apps/shared/expansionArt/hierarchyOfDamned.ts";
import {
  DISCHORDIA_BASE_SET_ART,
  DISCHORDIA_BASE_SET_TIER_GRIDS,
} from "../apps/shared/expansionArt/dischordiaBaseSet.ts";
import {
  CINEMATICS,
  VFX_CLIPS,
} from "../apps/shared/expansionArt/cinematicsManifest.ts";
import { ALBUM1_TRACKS } from "../apps/shared/expansionArt/album1Slideshows.ts";

const REPO_ROOT = process.cwd();
const PUBLIC_ROOT = join(REPO_ROOT, "apps", "client", "public");
const SOURCE_DIRS = [
  join(REPO_ROOT, "assets", "intermediate"),
  join(REPO_ROOT, "docs", "art-originals"),
];

const TE_CATEGORY_DIR = {
  wonder: "wonders",
  era_banner: "eras",
  encounter_key_art: "encounters",
  doctrine_banner: "doctrines",
  fleet_silhouette: "fleet",
  pirate_portrait: "fleet",
  civic_icon: "civics",
  sector_painting: "sectors",
};

/** @typedef {{ source: string, id: string, relPath: string }} Job */
/** @type {Job[]} */
const jobs = [];

for (const p of TRADE_EMPIRE_ART_PROMPTS) {
  jobs.push({
    source: "trade-empire",
    id: p.assetId,
    relPath: `art/trade-empire/${TE_CATEGORY_DIR[p.category]}/${p.assetId}.webp`,
  });
}
for (const e of HIERARCHY_OF_DAMNED_ART) {
  jobs.push({ source: "hierarchy-of-damned", id: e.assetId, relPath: e.relPath });
}
for (const e of DISCHORDIA_BASE_SET_ART) {
  jobs.push({ source: "base-set", id: e.assetId, relPath: e.relPath });
}
for (const e of DISCHORDIA_BASE_SET_TIER_GRIDS) {
  jobs.push({ source: "base-set-grids", id: e.assetId, relPath: e.relPath });
}
for (const c of CINEMATICS) {
  jobs.push({ source: "cinematics-mp4", id: c.id, relPath: c.videoRelPath });
  for (const kf of c.keyframeRelPaths) {
    jobs.push({ source: "cinematics-keyframes", id: kf, relPath: kf });
  }
}
for (const v of VFX_CLIPS) {
  jobs.push({ source: "vfx-mp4", id: v.id, relPath: v.videoRelPath });
  jobs.push({ source: "vfx-keyframes", id: v.id, relPath: v.keyframeRelPath });
}
for (const t of ALBUM1_TRACKS) {
  for (const rel of t.frameRelPaths) {
    jobs.push({
      source: "album1-slideshows",
      id: `${t.id}/${basename(rel)}`,
      relPath: rel,
    });
  }
}

// ─── Index source-side basenames for fast NEEDS_CONVERT lookup ───
//
// Producers emit files with names like room-archives_original.png; the
// canonical CDN slug is room-archives.webp. We strip extension AND a
// trailing _original suffix so a same-basename match works for both.

/** @type {Map<string, string>} */
const sourceBasenameIndex = new Map();

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

function stemOf(filename) {
  const noExt = basename(filename, extname(filename));
  return noExt.endsWith("_original") ? noExt.slice(0, -"_original".length) : noExt;
}

for (const root of SOURCE_DIRS) {
  if (!existsSync(root)) continue;
  for await (const f of walk(root)) {
    const stem = stemOf(f);
    if (!sourceBasenameIndex.has(stem)) sourceBasenameIndex.set(stem, f);
  }
}

// ─── Classify each job ───

/** @typedef {"STAGED_READY" | "NEEDS_CONVERT" | "MISSING"} Status */
/** @type {Array<Job & { status: Status, sourcePath?: string }>} */
const results = [];

for (const job of jobs) {
  const localPath = join(PUBLIC_ROOT, job.relPath);
  if (existsSync(localPath)) {
    results.push({ ...job, status: "STAGED_READY" });
    continue;
  }
  const stem = stemOf(job.relPath);
  const sourcePath = sourceBasenameIndex.get(stem);
  if (sourcePath) {
    results.push({ ...job, status: "NEEDS_CONVERT", sourcePath });
    continue;
  }
  results.push({ ...job, status: "MISSING" });
}

// ─── Report ───

const total = results.length;
const counts = { STAGED_READY: 0, NEEDS_CONVERT: 0, MISSING: 0 };
for (const r of results) counts[r.status]++;

const pct = (n) => ((n / total) * 100).toFixed(1) + "%";

console.log("");
console.log("═══════════════════════════════════════════════════════════════");
console.log(" ASSET COVERAGE REPORT (local-only)");
console.log("═══════════════════════════════════════════════════════════════");
console.log(` Total URLs in manifests:        ${total}`);
console.log(` Indexed source files (basename): ${sourceBasenameIndex.size}`);
console.log("");
console.log(` STAGED_READY    ${String(counts.STAGED_READY).padStart(5)}  (${pct(counts.STAGED_READY)})  → run pnpm assets:upload`);
console.log(` NEEDS_CONVERT   ${String(counts.NEEDS_CONVERT).padStart(5)}  (${pct(counts.NEEDS_CONVERT)})  → format-convert + move into apps/client/public/`);
console.log(` MISSING         ${String(counts.MISSING).padStart(5)}  (${pct(counts.MISSING)})  → render from prompt / awaiting producer`);
console.log("");

// Per-source breakdown
console.log("─── By manifest source ─────────────────────────────────────────");
const bySource = new Map();
for (const r of results) {
  if (!bySource.has(r.source)) {
    bySource.set(r.source, { STAGED_READY: 0, NEEDS_CONVERT: 0, MISSING: 0, total: 0 });
  }
  const row = bySource.get(r.source);
  row[r.status]++;
  row.total++;
}
const sourceRows = [...bySource.entries()].sort((a, b) => b[1].total - a[1].total);
console.log(
  " " +
    "source".padEnd(26) +
    "total".padStart(7) +
    "staged".padStart(8) +
    "convert".padStart(9) +
    "missing".padStart(9),
);
for (const [src, row] of sourceRows) {
  console.log(
    " " +
      src.padEnd(26) +
      String(row.total).padStart(7) +
      String(row.STAGED_READY).padStart(8) +
      String(row.NEEDS_CONVERT).padStart(9) +
      String(row.MISSING).padStart(9),
  );
}
console.log("");

// NEEDS_CONVERT sample — these are the cheap wins
const needsConvert = results.filter((r) => r.status === "NEEDS_CONVERT");
if (needsConvert.length > 0) {
  console.log("─── NEEDS_CONVERT sample (up to 20) ────────────────────────────");
  console.log(" Each line: <expected staging path>  ←  <local source>");
  for (const r of needsConvert.slice(0, 20)) {
    const rel = r.sourcePath ? r.sourcePath.replace(REPO_ROOT + "/", "") : "?";
    console.log(`  ${r.relPath}\n    ← ${rel}`);
  }
  if (needsConvert.length > 20) {
    console.log(`  … and ${needsConvert.length - 20} more.`);
  }
  console.log("");
}

// MISSING by source (heads-up on what needs production)
const missingBySource = new Map();
for (const r of results) {
  if (r.status !== "MISSING") continue;
  missingBySource.set(r.source, (missingBySource.get(r.source) ?? 0) + 1);
}
if (missingBySource.size > 0) {
  console.log("─── MISSING by manifest source ─────────────────────────────────");
  const sorted = [...missingBySource.entries()].sort((a, b) => b[1] - a[1]);
  for (const [src, count] of sorted) {
    console.log(`  ${src.padEnd(26)} ${String(count).padStart(5)}`);
  }
  console.log("");
}

// Write a machine-readable JSON for follow-up scripts.
const reportPath = join(REPO_ROOT, "asset-coverage-report.json");
const fs = await import("node:fs/promises");
await fs.writeFile(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      total,
      counts,
      bySource: Object.fromEntries(bySource),
      results,
    },
    null,
    2,
  ),
);
console.log(`Wrote ${reportPath}`);

void stat; // keep stat in scope for future filtering by size; lint quietener.
