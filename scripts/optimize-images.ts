#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   IMAGE OPTIMIZATION SCRIPT — Task 3.2

   One-off operational script that walks client/public/art,
   finds every PNG/JPG/JPEG, and emits WebP variants next to
   them. The React <ResponsiveImage> component prefers the
   .webp when it exists.

   Usage:
     pnpm tsx scripts/optimize-images.ts            # convert everything
     pnpm tsx scripts/optimize-images.ts --dry-run  # just report sizes
     pnpm tsx scripts/optimize-images.ts --min 500  # only files >=500 KB
     pnpm tsx scripts/optimize-images.ts --quality 82

   The script is idempotent — existing .webp files with a
   newer mtime than the source are skipped. Run it whenever
   new art drops.

   Why this exists:
   - Pre-optimization: 368 files >=500 KB, top offender 26 MB,
     first paint on 4G measured >3s.
   - WebP at quality 85 typically cuts 60-75% of PNG/JPG bytes
     with no visible quality loss.
   - The script reports a summary so you can track progress
     across runs.

   Requirements:
   - `sharp` (install with: pnpm add -D sharp)
   - Node 18+ (for structured cloning and native file APIs)
   ═══════════════════════════════════════════════════════ */

import { readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const ART_DIR = join(ROOT, "client", "public", "art");

/* ─── CLI PARSING ─── */

interface Args {
  dryRun: boolean;
  minSizeKb: number;
  quality: number;
  targetDirs: string[];
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = {
    dryRun: argv.includes("--dry-run"),
    minSizeKb: 0,
    quality: 85,
    targetDirs: [],
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--min" && argv[i + 1]) { args.minSizeKb = parseInt(argv[++i], 10); }
    else if (argv[i] === "--quality" && argv[i + 1]) { args.quality = parseInt(argv[++i], 10); }
    else if (argv[i] === "--dir" && argv[i + 1]) { args.targetDirs.push(argv[++i]); }
  }
  return args;
}

/* ─── WALK ─── */

interface ImageFile {
  absolutePath: string;
  relativePath: string;
  sizeBytes: number;
  extension: string;
}

function walkImages(dir: string, out: ImageFile[] = []): ImageFile[] {
  if (!existsSync(dir)) return out;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(absolutePath, out);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        const stat = statSync(absolutePath);
        out.push({
          absolutePath,
          relativePath: relative(ROOT, absolutePath),
          sizeBytes: stat.size,
          extension: ext,
        });
      }
    }
  }
  return out;
}

/* ─── FORMATTING ─── */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function percent(before: number, after: number): string {
  if (before === 0) return "0%";
  const reduction = ((before - after) / before) * 100;
  return `${reduction.toFixed(1)}%`;
}

/* ─── MAIN ─── */

async function main() {
  const args = parseArgs();
  const dirs = args.targetDirs.length > 0
    ? args.targetDirs.map(d => join(ROOT, d))
    : [ART_DIR];

  const allImages: ImageFile[] = [];
  for (const d of dirs) allImages.push(...walkImages(d));

  // Filter by min size
  const filtered = allImages.filter(img => img.sizeBytes / 1024 >= args.minSizeKb);

  const totalBytes = filtered.reduce((n, img) => n + img.sizeBytes, 0);
  console.log(`\n=== Image Optimization Report ===`);
  console.log(`Scanned dirs: ${dirs.map(d => relative(ROOT, d)).join(", ")}`);
  console.log(`Total images: ${allImages.length}`);
  console.log(`After --min ${args.minSizeKb} KB filter: ${filtered.length}`);
  console.log(`Total size to process: ${formatBytes(totalBytes)}`);
  console.log(`Quality: ${args.quality}`);
  console.log(`Dry run: ${args.dryRun}`);
  console.log("");

  if (args.dryRun) {
    const top10 = [...filtered].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 10);
    console.log("Top 10 by size:");
    for (const img of top10) {
      console.log(`  ${formatBytes(img.sizeBytes).padStart(10)}  ${img.relativePath}`);
    }
    console.log("\n(Dry run — no files written. Remove --dry-run to convert.)");
    return;
  }

  // Attempt to load sharp. We defer the import so the script can still
  // run in --dry-run mode without sharp installed.
  let sharp: typeof import("sharp");
  try {
    // @ts-expect-error — optional dependency
    sharp = (await import("sharp")).default;
  } catch {
    console.error(
      "\nERROR: `sharp` is not installed.\n" +
      "Install with: pnpm add -D sharp\n" +
      "Then re-run this script."
    );
    process.exit(1);
  }

  let converted = 0;
  let skipped = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;
  const failures: string[] = [];

  for (const img of filtered) {
    const webpPath = img.absolutePath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    // Skip if an up-to-date .webp already exists
    if (existsSync(webpPath)) {
      const srcStat = statSync(img.absolutePath);
      const destStat = statSync(webpPath);
      if (destStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    try {
      await sharp(img.absolutePath)
        .webp({ quality: args.quality, effort: 4 })
        .toFile(webpPath);
      const newStat = statSync(webpPath);
      bytesBefore += img.sizeBytes;
      bytesAfter += newStat.size;
      converted++;
      if (converted % 25 === 0) {
        console.log(`  …${converted}/${filtered.length} converted`);
      }
    } catch (e) {
      failures.push(`${img.relativePath}: ${(e as Error).message}`);
    }
  }

  console.log("\n=== Done ===");
  console.log(`Converted: ${converted}`);
  console.log(`Skipped (already up to date): ${skipped}`);
  console.log(`Failed: ${failures.length}`);
  if (converted > 0) {
    console.log(`Size before: ${formatBytes(bytesBefore)}`);
    console.log(`Size after:  ${formatBytes(bytesAfter)}`);
    console.log(`Reduction:   ${percent(bytesBefore, bytesAfter)} (${formatBytes(bytesBefore - bytesAfter)} saved)`);
  }
  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  ${f}`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
