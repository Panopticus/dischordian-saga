#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   SUIT ART IMPORT — one-off

   Extracts a suit-catalog archive (tarball or zip) and
   resizes every piece to the §G.8 authoring spec
   (1024x1536) to match the compositor canvas. Then the
   sibling `optimize-images.ts` emits .webp variants.

   Usage:
     pnpm tsx apps/scripts/import-suit-art.ts <path-to-archive>

   Supported archive layouts:
     - Tarball with deep wrapper prefix
         saga_new_suit_sets/.../apps/client/public/art/suits/<set>/<rarity>/<slot>.png
       (the Mourner's Coat + First Chassis drop).
     - Zip with the flat
         <set>/<rarity>/<slot>.png
       layout (the full 18-set drop).
   Either way, files land at
     apps/client/public/art/suits/<set>/<rarity>/<slot>.png.
   ═══════════════════════════════════════════════════════ */

import { execFileSync } from "node:child_process";
import { readdirSync, statSync, mkdirSync, existsSync, renameSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = join(dirname(__filename), "..", "..");
const PUBLIC_ART = join(REPO_ROOT, "apps", "client", "public", "art");
const TARGET_ROOT = join(PUBLIC_ART, "suits");

/** §G.8 canvas; must match CANVAS_W/H in PaperDollBG3.tsx. */
const CANVAS_W = 1024;
const CANVAS_H = 1536;

function walkPngs(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walkPngs(abs, out);
    else if (entry.isFile() && entry.name.endsWith(".png")) out.push(abs);
  }
  return out;
}

/** Strip any leading `suits/` or `art/suits/` layer off the staged
 *  tree so the walk always starts at the per-set directories. */
function resolveStagedSetsRoot(stageDir: string): string {
  let cur = stageDir;
  for (let i = 0; i < 3; i++) {
    const entries = readdirSync(cur, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory());
    // Heuristic: if there's exactly one subdir and it's named
    // "suits" or "art", descend. Otherwise we're at the set roster.
    if (dirs.length === 1 && (dirs[0].name === "suits" || dirs[0].name === "art")) {
      cur = join(cur, dirs[0].name);
      continue;
    }
    break;
  }
  return cur;
}

async function main() {
  const archive = process.argv[2];
  if (!archive) {
    console.error("usage: import-suit-art.ts <path-to-archive(.tar.gz|.zip)>");
    process.exit(1);
  }
  if (!existsSync(archive)) {
    console.error(`archive not found: ${archive}`);
    process.exit(1);
  }

  const stageDir = join(REPO_ROOT, ".suit-art-stage");
  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(stageDir, { recursive: true });

  console.log(`[import-suit-art] extracting ${archive} → ${stageDir}`);
  const lower = archive.toLowerCase();
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
    // Tarball form — deep wrapper prefix of 9 segments leading up
    // to `<set>/<rarity>/<slot>.png`.
    execFileSync(
      "tar",
      [
        "-xzf", archive,
        "-C", stageDir,
        "--strip-components=9",
        "--wildcards",
        "*/apps/client/public/art/suits/*/*/*.png",
      ],
      { stdio: "inherit" },
    );
  } else if (lower.endsWith(".zip")) {
    // Zip form — entries are already `<set>/<rarity>/<slot>.png`
    // (or occasionally nested under `suits/` or `art/suits/`).
    execFileSync("unzip", ["-q", "-o", archive, "-d", stageDir], {
      stdio: "inherit",
    });
  } else {
    console.error(`unsupported archive extension: ${archive}`);
    process.exit(1);
  }

  const stagedSuits = resolveStagedSetsRoot(stageDir);
  const extractedSets = readdirSync(stagedSuits, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  if (extractedSets.length === 0) {
    console.error(`[import-suit-art] no set folders after extraction`);
    process.exit(1);
  }
  console.log(
    `[import-suit-art] extracted ${extractedSets.length} sets: ${extractedSets.join(", ")}`,
  );

  mkdirSync(TARGET_ROOT, { recursive: true });
  const pngs = walkPngs(stagedSuits);
  console.log(`[import-suit-art] found ${pngs.length} PNGs`);

  let resized = 0;
  for (const src of pngs) {
    const rel = relative(stagedSuits, src); // e.g. the-mourners-coat/common/chest.png
    const dest = join(TARGET_ROOT, rel);
    mkdirSync(dirname(dest), { recursive: true });

    const meta = await sharp(src).metadata();
    if (meta.width === CANVAS_W && meta.height === CANVAS_H) {
      renameSync(src, dest);
    } else {
      await sharp(src)
        .resize(CANVAS_W, CANVAS_H, { fit: "fill", kernel: "lanczos3" })
        .png({ compressionLevel: 9 })
        .toFile(dest);
    }
    resized++;
    if (resized % 25 === 0) {
      console.log(`[import-suit-art] ${resized}/${pngs.length}`);
    }
  }

  rmSync(stageDir, { recursive: true, force: true });

  const finalPngs = walkPngs(TARGET_ROOT);
  const totalBytes = finalPngs.reduce((n, p) => n + statSync(p).size, 0);
  console.log(
    `[import-suit-art] done: ${finalPngs.length} files, ` +
      `${(totalBytes / 1024 / 1024).toFixed(1)} MB under ${relative(REPO_ROOT, TARGET_ROOT)}`,
  );
  console.log(
    `[import-suit-art] next: pnpm tsx apps/scripts/optimize-images.ts --dir client/public/art/suits`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
