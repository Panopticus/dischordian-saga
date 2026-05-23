#!/usr/bin/env node
/**
 * Bucket-B polish — build a consolidated VO captions manifest from
 * every `apps/scripts/*-lines.json` source file. Output:
 *
 *   apps/shared/voCaptionsManifest.json
 *
 * Shape (matches voCaptions.ts CaptionManifest):
 *   { "<lineKey>": { "text": "<spoken>", "lang": "en", "speaker"?: "<id>" } }
 *
 * Closes the WCAG 2.1 Level A gap noted in the audit ("infra is here;
 * populating it from existing per-character lines.json is a
 * mechanical pass" — voCaptions.ts header). Idempotent: re-running
 * with the same source files produces an identical manifest.
 *
 * Conflict policy: if two source files declare the same lineKey
 * (rare; only the duplicate-id case), the first one wins and the
 * second is logged. The lint here keeps writers honest.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const SOURCES_DIR = path.join(ROOT, "apps/scripts");
const OUT = path.join(ROOT, "apps/shared/voCaptionsManifest.json");

function listLineFiles() {
  return fs
    .readdirSync(SOURCES_DIR)
    .filter((f) => f.endsWith("-lines.json"))
    .map((f) => path.join(SOURCES_DIR, f))
    .sort();
}

function loadLineEntries(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (e) => e && typeof e.id === "string" && typeof e.text === "string",
  );
}

const manifest = {};
const conflicts = [];
let totalEntries = 0;
const filesScanned = listLineFiles();

for (const file of filesScanned) {
  const rel = path.relative(ROOT, file);
  const entries = loadLineEntries(file);
  for (const entry of entries) {
    if (manifest[entry.id]) {
      conflicts.push({
        id: entry.id,
        firstFrom: manifest[entry.id].__from,
        secondFrom: rel,
      });
      continue;
    }
    const captionEntry = {
      text: entry.text,
      lang: "en",
    };
    if (typeof entry.speaker === "string") captionEntry.speaker = entry.speaker;
    manifest[entry.id] = { ...captionEntry, __from: rel };
    totalEntries++;
  }
}

// Strip the provenance marker before writing — it's only used to
// surface conflicts to the build log.
const clean = {};
for (const [k, v] of Object.entries(manifest)) {
  const { __from: _from, ...rest } = v;
  clean[k] = rest;
}

const sortedKeys = Object.keys(clean).sort();
const sorted = {};
for (const k of sortedKeys) sorted[k] = clean[k];

fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n", "utf8");

console.log(`Scanned ${filesScanned.length} line files.`);
console.log(`Wrote ${totalEntries} captions → ${path.relative(ROOT, OUT)}`);
if (conflicts.length > 0) {
  console.log(`\nConflicts (${conflicts.length}; first wins):`);
  for (const c of conflicts.slice(0, 20)) {
    console.log(`  ${c.id}: kept ${c.firstFrom}, dropped ${c.secondFrom}`);
  }
  if (conflicts.length > 20) {
    console.log(`  … and ${conflicts.length - 20} more`);
  }
}
