#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   AAA ART ASSETS WIRING SCRIPT

   One-off operational script that extracts the AAA art
   bundle (downloaded from dgrsart S3), compresses every
   PNG/JPG to a reasonable-size WebP, and drops them in
   apps/client/public/art/<category>/<name>.webp preserving
   the bundle's directory layout.

   Bundle structure (69 files across 9 categories):
     generated_assets/art/ui/hud/         → ui/hud/
     generated_assets/art/rooms/          → rooms/
     generated_assets/art/logos/          → logos/
     generated_assets/art/trade/icons/    → trade/icons/
     generated_assets/art/trade/emblems/  → trade/emblems/
     generated_assets/art/pvp/ranks/      → pvp/ranks/
     generated_assets/art/minigames/panels/ → minigames/panels/
     generated_assets/art/gears/          → gears/
     generated_assets/art/roadmap/        → roadmap/

   Usage:
     pnpm tsx apps/scripts/wire-art-assets.ts             # full run
     pnpm tsx apps/scripts/wire-art-assets.ts --dry-run   # mapping only
     pnpm tsx apps/scripts/wire-art-assets.ts --limit 5   # process only 5

   The script expects the bundle at /tmp/dischordian-assets/assets.zip.

   Why not S3?
   The approved plan was to upload these to dgrsart at
   cdn/art/<category>/<name>.png, but no AWS credentials
   exist in this environment and no aws CLI / @aws-sdk is
   installed. Serving from the repo's public dir via Railway
   is the working fallback (same approach as wire-card-art.ts):
   we compress aggressively (max 1536px, WebP q85) so the
   repo overhead stays in the low double-digit MB range.
   ═══════════════════════════════════════════════════════ */

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "..");

const BUNDLE_PATH = "/tmp/dischordian-assets/assets.zip";
const BUNDLE_INNER_PREFIX = "generated_assets/art/";
const ART_OUT_ROOT = join(ROOT, "apps/client/public/art");
const MAPPING_OUT = join(
  ROOT,
  "apps/scripts/wire-art-assets-mapping.json",
);

const MAX_DIMENSION = 1536;
const WEBP_QUALITY = 85;

interface Args {
  dryRun: boolean;
  limit: number;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = {
    dryRun: argv.includes("--dry-run"),
    limit: 0,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--limit" && argv[i + 1]) {
      args.limit = parseInt(argv[++i]!, 10);
    }
  }
  return args;
}

/* ─── BUNDLE INDEX ─── */

interface BundleEntry {
  /** path inside the zip, e.g. "generated_assets/art/ui/hud/panel_main.png" */
  innerPath: string;
  /** path under apps/client/public/art, e.g. "ui/hud/panel_main" */
  relPath: string;
  /** uncompressed byte size */
  size: number;
}

/**
 * Run `unzip -l bundle.zip`, parse the listing, and collect every PNG/JPG
 * entry under generated_assets/art/. Directory entries (size 0, name ends
 * with /) are ignored. unzip -l format:
 *   Length    Date    Time    Name
 *   -------  -------- -----   ----
 *   6104822  2026-04-13 20:00 generated_assets/art/ui/hud/panel_accent.png
 */
function listBundle(bundlePath: string): BundleEntry[] {
  const res = spawnSync("unzip", ["-l", bundlePath], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.status !== 0) {
    throw new Error(`unzip -l failed: ${res.stderr}`);
  }
  const entries: BundleEntry[] = [];
  for (const line of res.stdout.split("\n")) {
    const m = line.match(
      /^\s*(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.+)$/,
    );
    if (!m) continue;
    const [, sizeStr, , , path] = m;
    if (!path) continue;
    if (path.endsWith("/")) continue; // directory entry
    if (!path.startsWith(BUNDLE_INNER_PREFIX)) continue;
    if (!/\.(png|jpe?g)$/i.test(path)) continue;
    const rel = path.slice(BUNDLE_INNER_PREFIX.length).replace(/\.(png|jpe?g)$/i, "");
    entries.push({
      innerPath: path,
      relPath: rel,
      size: parseInt(sizeStr!, 10),
    });
  }
  return entries;
}

/* ─── IMAGE EXTRACTION + COMPRESSION ─── */

/**
 * Extract a single file from the bundle via `unzip -p` (streams to stdout),
 * pipe it into sharp, resize to fit within MAX_DIMENSION on the long edge
 * (no upscaling), encode as WebP at WEBP_QUALITY, and write to `destPath`.
 * Returns the resulting file size.
 */
async function extractAndCompress(
  bundlePath: string,
  innerPath: string,
  destPath: string,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn("unzip", ["-p", bundlePath, innerPath], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    const chunks: Buffer[] = [];
    child.stdout.on("data", (c: Buffer) => chunks.push(c));

    let stderrBuf = "";
    child.stderr.on("data", (c: Buffer) => {
      stderrBuf += c.toString();
    });

    child.on("error", reject);
    child.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(`unzip -p exited ${code}: ${stderrBuf}`));
        return;
      }
      try {
        const buf = Buffer.concat(chunks);
        mkdirSync(dirname(destPath), { recursive: true });
        await sharp(buf, { limitInputPixels: false })
          .resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY, effort: 4 })
          .toFile(destPath);
        resolve(statSync(destPath).size);
      } catch (err) {
        reject(err as Error);
      }
    });
  });
}

/* ─── MAIN ─── */

interface MappingRow {
  innerPath: string;
  relPath: string;
  outputPath: string;
  publicUrl: string;
  sourceBytes: number;
  outputBytes: number | null;
}

async function main() {
  const args = parseArgs();

  console.log("=== wire-art-assets ===");
  console.log(`Bundle:   ${BUNDLE_PATH}`);
  console.log(`Output:   ${ART_OUT_ROOT}`);
  console.log(`Mode:     ${args.dryRun ? "dry-run" : "execute"}`);
  if (args.limit > 0) console.log(`Limit:    ${args.limit}`);
  console.log("");

  if (!existsSync(BUNDLE_PATH)) {
    console.error(`ERROR: bundle zip not found at ${BUNDLE_PATH}`);
    process.exit(1);
  }

  /* --- bundle --- */

  const bundle = listBundle(BUNDLE_PATH);
  console.log(`Bundle:   ${bundle.length} image entries`);

  // Group by top-level category for the summary
  const byCategory = new Map<string, number>();
  for (const e of bundle) {
    const cat = e.relPath.split("/")[0]!;
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
  }
  for (const [cat, n] of [...byCategory.entries()].sort()) {
    console.log(`  ${cat.padEnd(12)} ${n}`);
  }
  console.log("");

  /* --- mapping --- */

  const mapping: MappingRow[] = bundle.map((e) => ({
    innerPath: e.innerPath,
    relPath: e.relPath,
    outputPath: `apps/client/public/art/${e.relPath}.webp`,
    publicUrl: `/art/${e.relPath}.webp`,
    sourceBytes: e.size,
    outputBytes: null,
  }));

  /* --- dry-run: just emit mapping + bail --- */

  if (args.dryRun) {
    writeFileSync(MAPPING_OUT, JSON.stringify(mapping, null, 2));
    console.log(`Dry run — wrote ${MAPPING_OUT}`);
    console.log("Mapping preview (first 10):");
    for (const row of mapping.slice(0, 10)) {
      console.log(`  ${row.publicUrl}  (${formatBytes(row.sourceBytes)})`);
    }
    return;
  }

  /* --- extract + compress --- */

  let totalBytesIn = 0;
  let totalBytesOut = 0;
  let count = 0;
  const startedAt = Date.now();

  const todo = args.limit > 0 ? mapping.slice(0, args.limit) : mapping;
  for (const row of todo) {
    const destPath = join(ROOT, row.outputPath);
    try {
      const outBytes = await extractAndCompress(
        BUNDLE_PATH,
        row.innerPath,
        destPath,
      );
      row.outputBytes = outBytes;
      totalBytesIn += row.sourceBytes;
      totalBytesOut += outBytes;
      count++;
      if (count % 10 === 0 || count === todo.length) {
        const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
        console.log(
          `  [${count}/${todo.length}] ${elapsed}s elapsed, ${formatBytes(
            totalBytesOut,
          )} output`,
        );
      }
    } catch (err) {
      console.error(`  FAIL ${row.relPath}: ${(err as Error).message}`);
    }
  }
  console.log("");
  console.log(`Extracted + compressed ${count} files`);
  console.log(`  input:  ${formatBytes(totalBytesIn)}`);
  console.log(`  output: ${formatBytes(totalBytesOut)}`);
  console.log(
    `  ratio:  ${((totalBytesOut / totalBytesIn) * 100).toFixed(1)}% of input`,
  );
  console.log("");

  /* --- mapping audit trail --- */

  writeFileSync(MAPPING_OUT, JSON.stringify(mapping, null, 2));
  console.log(`Wrote mapping: ${MAPPING_OUT}`);
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
