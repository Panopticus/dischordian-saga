#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   SUIT ART IMPORT — one-off

   Extracts the suit-catalog tarball (two foundation sets —
   The Mourner's Coat + The First Chassis, 120 PNGs total)
   and resizes every piece to the §G.8 authoring spec
   (1024x1536) to match the compositor canvas. The sibling
   `optimize-images.ts` then emits .webp variants.

   Usage:
     pnpm tsx apps/scripts/import-suit-art.ts <path-to-tarball>

   The tarball arranges files at
     saga_new_suit_sets/.../apps/client/public/art/suits/<set>/<rarity>/<slot>.png
   with a deep wrapper prefix. We extract the PNGs under
     apps/client/public/art/suits/<set>/<rarity>/<slot>.png
   stripping the 8-component prefix.
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

async function main() {
  const tarball = process.argv[2];
  if (!tarball) {
    console.error("usage: import-suit-art.ts <path-to-tarball>");
    process.exit(1);
  }
  if (!existsSync(tarball)) {
    console.error(`tarball not found: ${tarball}`);
    process.exit(1);
  }

  const stageDir = join(REPO_ROOT, ".suit-art-stage");
  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(stageDir, { recursive: true });

  // Extract only the deeply-nested PNGs. The wrapper prefix is
  //   saga_new_suit_sets/home/ubuntu/suit_catalog_build/apps/client/public/art/suits/
  // (9 segments including `suits/`) plus `<set>/<rarity>/<slot>.png`
  // — strip 9 so we land at `<set>/<rarity>/<slot>.png` under the
  // stage dir.
  console.log(`[import-suit-art] extracting ${tarball} → ${stageDir}`);
  execFileSync(
    "tar",
    [
      "-xzf", tarball,
      "-C", stageDir,
      "--strip-components=9",
      "--wildcards",
      "*/apps/client/public/art/suits/*/*/*.png",
    ],
    { stdio: "inherit" },
  );

  // After strip-components=8 the stage dir itself holds the
  // per-set folders directly.
  const stagedSuits = stageDir;
  const extractedSets = readdirSync(stagedSuits, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  if (extractedSets.length === 0) {
    console.error(`[import-suit-art] no set folders after extraction`);
    process.exit(1);
  }
  console.log(`[import-suit-art] extracted sets: ${extractedSets.join(", ")}`);

  // Move the staged tree into place. If the target suits/ already
  // exists, individual pieces are replaced; new ones are added.
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
      // Already at spec — just move.
      renameSync(src, dest);
    } else {
      // Resize with lanczos3, preserve alpha.
      await sharp(src)
        .resize(CANVAS_W, CANVAS_H, { fit: "fill", kernel: "lanczos3" })
        .png({ compressionLevel: 9 })
        .toFile(dest);
    }
    resized++;
    if (resized % 10 === 0) {
      console.log(`[import-suit-art] ${resized}/${pngs.length}`);
    }
  }

  rmSync(stageDir, { recursive: true, force: true });

  // Brief size report.
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
