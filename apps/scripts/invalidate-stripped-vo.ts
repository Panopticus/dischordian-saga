#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   INVALIDATE STRIPPED VO MANIFEST ENTRIES

   `strip-vo-stage-directions.ts` rewrote `text` on N lines across
   the *-lines.json banks but the MP3s those entries point at on S3
   still hold the OLD audio with the producer cue card spoken aloud.
   `generate_vo_gaps.py` skips any `id` already in the manifest, so
   a plain `pnpm vo:gaps` run won't regenerate them.

   This script reads every *-lines.json file in apps/scripts/, picks
   out entries that now carry a `directionNotes` sidecar (the marker
   the strip leaves behind on rewritten records), then walks every
   *VoManifest.json under apps/shared/ and removes any matching key.

   We deliberately don't carry the bank→manifest map — multi-
   character banks (act7 epilogue, story chapters, encounters) route
   per-speaker into different manifests, so any static table here
   would drift from the Python registry. Scanning every manifest is
   slower but correct.

   Usage:
     pnpm vo:invalidate-stripped              # apply
     pnpm vo:invalidate-stripped:dry          # report only
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS_DIR = __dirname;
const SHARED_DIR = path.resolve(__dirname, "..", "shared");
const DRY = process.argv.includes("--dry");

interface LineEntry {
  id?: string;
  text?: string;
  directionNotes?: string;
  [k: string]: unknown;
}

/** Collect every line id whose authored `text` was rewritten by the
 *  strip-vo-stage-directions pass (those entries have a
 *  `directionNotes` sidecar preserving the original). */
function collectStrippedIds(): { ids: Set<string>; perFile: Map<string, number> } {
  const ids = new Set<string>();
  const perFile = new Map<string, number>();
  const files = fs.readdirSync(SCRIPTS_DIR).filter(n => n.endsWith("-lines.json"));
  for (const file of files) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(fs.readFileSync(path.join(SCRIPTS_DIR, file), "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    let count = 0;
    for (const entryUnknown of parsed) {
      const entry = entryUnknown as LineEntry;
      if (typeof entry?.id !== "string") continue;
      if (typeof entry?.directionNotes !== "string") continue;
      ids.add(entry.id);
      count++;
    }
    if (count > 0) perFile.set(file, count);
  }
  return { ids, perFile };
}

function main() {
  const { ids: strippedIds, perFile } = collectStrippedIds();
  console.log(`Collected ${strippedIds.size} stripped line id(s) across ${perFile.size} bank(s).`);
  if (strippedIds.size === 0) {
    console.log("Nothing to invalidate.");
    return;
  }

  const manifestFiles = fs.readdirSync(SHARED_DIR)
    .filter(n => n.endsWith("VoManifest.json"));

  let touched = 0;
  let removed = 0;
  let stillStaleInManifests = new Set(strippedIds);

  console.log(`\nScanning ${manifestFiles.length} manifest(s)${DRY ? " (dry run)" : ""}…`);

  for (const mf of manifestFiles) {
    const mPath = path.join(SHARED_DIR, mf);
    let manifest: Record<string, string>;
    try {
      manifest = JSON.parse(fs.readFileSync(mPath, "utf8")) as Record<string, string>;
    } catch {
      continue;
    }
    if (manifest === null || typeof manifest !== "object" || Array.isArray(manifest)) continue;

    let localRemoved = 0;
    for (const id of strippedIds) {
      if (id in manifest) {
        delete manifest[id];
        localRemoved++;
        stillStaleInManifests.delete(id);
      }
    }
    if (localRemoved > 0) {
      touched++;
      removed += localRemoved;
      console.log(`  ${mf.padEnd(45)} removed ${localRemoved}`);
      if (!DRY) {
        fs.writeFileSync(mPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
      }
    }
  }

  console.log(
    `\nDone. ${DRY ? "Would remove" : "Removed"} ${removed} stale manifest key${removed === 1 ? "" : "s"} across ${touched} manifest${touched === 1 ? "" : "s"}.`,
  );
  if (stillStaleInManifests.size > 0) {
    console.log(
      `${stillStaleInManifests.size} stripped id(s) had no manifest entry — they'll be generated fresh on the next pnpm vo:* run.`,
    );
  }

  if (!DRY && removed > 0) {
    console.log("\nNext: run the appropriate generator(s):");
    console.log("  pnpm vo:everything       # full pipeline (extract → gap-fill)");
    console.log("  pnpm vo:gaps             # gap-fill only (faster if banks unchanged)");
    console.log("Requires ELEVENLABS_API_KEY + AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY.");
  }
}

main();
