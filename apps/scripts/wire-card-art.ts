#!/usr/bin/env tsx
/* ═══════════════════════════════════════════════════════
   CARD ART WIRING SCRIPT

   One-off operational script that takes the 406-card art
   bundle (downloaded from dgrsart S3), extracts the primary
   render for each card, compresses it to a reasonable-size
   WebP, drops it in apps/client/public/art/cards/{id}.webp,
   and rewrites every card definition's `art` field to point
   at that relative URL.

   Usage:
     pnpm tsx apps/scripts/wire-card-art.ts                  # full run
     pnpm tsx apps/scripts/wire-card-art.ts --dry-run        # mapping only
     pnpm tsx apps/scripts/wire-card-art.ts --skip-rewrite   # generate images but leave TS files alone
     pnpm tsx apps/scripts/wire-card-art.ts --skip-images    # rewrite TS files only

   The script expects the bundle at /tmp/dsaga-card-art/bundle.zip.
   If it's missing, set BUNDLE_URL and the script downloads it.

   Why not S3?
   The approved plan was to upload the 406 images to
   dgrsart.s3.us-east-2.amazonaws.com/card-art/v1/{id}.png,
   but no AWS credentials exist in this environment and no
   aws CLI / @aws-sdk is installed. Serving from the repo's
   public dir via Railway is the working fallback: we compress
   aggressively (max 1024px, WebP q82) so the repo overhead
   stays in the double-digit MB range.

   If you later get credentials, sweep the rewritten `art`
   field with sed to point at dgrsart and upload the extracted
   PNGs with the same key pattern. See README for details.
   ═══════════════════════════════════════════════════════ */

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "..");

const BUNDLE_PATH = "/tmp/dsaga-card-art/bundle.zip";
const BUNDLE_INNER_PREFIX = "dischordian_card_renders/";
const DEFINITIONS_DIR = join(ROOT, "apps/shared/tcg-core/cards/definitions");
const TOKENS_DIR = join(ROOT, "apps/shared/tcg-core/cards/tokens");
const ART_OUT_DIR = join(ROOT, "apps/client/public/art/cards");
const MAPPING_OUT = join(
  ROOT,
  "apps/scripts/wire-card-art-mapping.json",
);
const PUBLIC_URL_PREFIX = "/art/cards";

const MAX_DIMENSION = 1024;
const WEBP_QUALITY = 82;

interface Args {
  dryRun: boolean;
  skipImages: boolean;
  skipRewrite: boolean;
  limit: number;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const args: Args = {
    dryRun: argv.includes("--dry-run"),
    skipImages: argv.includes("--skip-images"),
    skipRewrite: argv.includes("--skip-rewrite"),
    limit: 0,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--limit" && argv[i + 1]) {
      args.limit = parseInt(argv[++i]!, 10);
    }
  }
  return args;
}

/* ─── CARD REGISTRY ─── */

interface CardRow {
  id: string;
  filePath: string;
}

/**
 * Walk definitions + tokens directories and extract the `id: "..."` field
 * from each card file. Fast, regex-only, avoids spinning up the full TS loader.
 */
function loadCardRegistry(): CardRow[] {
  const rows: CardRow[] = [];

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        const src = readFileSync(full, "utf8");
        const m = src.match(/\bid:\s*"([^"]+)"/);
        if (m) {
          rows.push({ id: m[1]!, filePath: full });
        }
      }
    }
  };

  walk(DEFINITIONS_DIR);
  walk(TOKENS_DIR);
  return rows;
}

/* ─── BUNDLE INDEX ─── */

interface BundleEntry {
  /** path inside the zip, e.g. "dischordian_card_renders/art_s1_char_001.png" */
  path: string;
  /** canonical card id derived from the filename, e.g. "s1_char_001" */
  cardId: string;
  /** variant tag: "primary" | "original" | "repair" | "repair_v2" */
  variant: string;
  /** mtime from the zip listing, for tie-breaking */
  mtime: string;
  /** uncompressed byte size */
  size: number;
}

/**
 * Run `unzip -l bundle.zip`, parse the listing, and classify every PNG entry
 * by card id + variant. unzip -l format:
 *   Length    Date    Time    Name
 *   -------  -------- -----   ----
 *   7051380  2026-04-12 21:45 dischordian_card_renders/art_s1_char_007.png
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
    // Lines look like: "  7051380  2026-04-12 21:45   dischordian_card_renders/art_s1_char_007.png"
    const m = line.match(
      /^\s*(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.+)$/,
    );
    if (!m) continue;
    const [, sizeStr, date, time, path] = m;
    if (!path || !path.endsWith(".png")) continue;
    const base = path.replace(BUNDLE_INNER_PREFIX, "").replace(/\.png$/, "");
    // base is like: "art_s1_char_001" or "art_s1_char_001_original"
    if (!base.startsWith("art_")) continue;
    const stem = base.slice(4); // strip "art_"
    let cardId: string;
    let variant: string;
    if (stem.endsWith("_repair_v2")) {
      cardId = stem.slice(0, -"_repair_v2".length);
      variant = "repair_v2";
    } else if (stem.endsWith("_repair")) {
      cardId = stem.slice(0, -"_repair".length);
      variant = "repair";
    } else if (stem.endsWith("_original")) {
      cardId = stem.slice(0, -"_original".length);
      variant = "original";
    } else {
      cardId = stem;
      variant = "primary";
    }
    entries.push({
      path: path!,
      cardId,
      variant,
      mtime: `${date} ${time}`,
      size: parseInt(sizeStr!, 10),
    });
  }
  return entries;
}

/**
 * For each card id, pick the "best" variant.
 *
 * Preference: primary > repair_v2 > repair > original. The bundle's workflow
 * notes make the primary `art_{id}.png` the production asset — repairs and
 * originals are archival variants. If the primary is missing we fall back to
 * the next-best in the preference chain.
 */
function pickBestVariant(
  entries: BundleEntry[],
): Map<string, BundleEntry> {
  const order = ["primary", "repair_v2", "repair", "original"] as const;
  const byCard = new Map<string, BundleEntry[]>();
  for (const e of entries) {
    const list = byCard.get(e.cardId) ?? [];
    list.push(e);
    byCard.set(e.cardId, list);
  }
  const picked = new Map<string, BundleEntry>();
  for (const [cardId, list] of byCard) {
    for (const variant of order) {
      const hit = list.find((e) => e.variant === variant);
      if (hit) {
        picked.set(cardId, hit);
        break;
      }
    }
  }
  return picked;
}

/* ─── IMAGE EXTRACTION + COMPRESSION ─── */

/**
 * Extract a single file from the bundle via `unzip -p` (streams to stdout),
 * pipe it into sharp, resize to fit within MAX_DIMENSION on the long edge,
 * encode as WebP at WEBP_QUALITY, and write to `destPath`. Returns the
 * resulting file size.
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

/* ─── TS REWRITE ─── */

/**
 * Regex that matches the `art: "..."` field in card definitions, tolerating
 * both single-line (`  art: "https://...",`) and Prettier-wrapped
 * (`  art:\n    "https://...",`) forms. Captures the indent so we can
 * preserve it in the replacement.
 */
const ART_FIELD_RE = /^([ \t]+)art:\s*\n?\s*"[^"]*",?\s*$/m;

function rewriteArtField(filePath: string, newUrl: string): boolean {
  const src = readFileSync(filePath, "utf8");
  if (!ART_FIELD_RE.test(src)) {
    return false;
  }
  const rewritten = src.replace(ART_FIELD_RE, (_match, indent: string) => {
    return `${indent}art: "${newUrl}",`;
  });
  if (rewritten === src) return false;
  writeFileSync(filePath, rewritten, "utf8");
  return true;
}

/* ─── MAIN ─── */

interface MappingRow {
  cardId: string;
  sourceFile: string;
  definitionPath: string;
  variant: string;
  outputPath: string;
  publicUrl: string;
  sourceBytes: number;
  outputBytes: number | null;
  availableVariants: string[];
  rewritten: boolean;
}

async function main() {
  const args = parseArgs();

  console.log("=== wire-card-art ===");
  console.log(`Bundle:      ${BUNDLE_PATH}`);
  console.log(`Definitions: ${DEFINITIONS_DIR}`);
  console.log(`Tokens:      ${TOKENS_DIR}`);
  console.log(`Art out:     ${ART_OUT_DIR}`);
  console.log(
    `Mode:        ${args.dryRun ? "dry-run" : "execute"}${
      args.skipImages ? " (skip-images)" : ""
    }${args.skipRewrite ? " (skip-rewrite)" : ""}`,
  );
  console.log("");

  if (!existsSync(BUNDLE_PATH)) {
    console.error(`ERROR: bundle zip not found at ${BUNDLE_PATH}`);
    process.exit(1);
  }

  /* --- registry --- */

  const registry = loadCardRegistry();
  console.log(`Registry: ${registry.length} card definitions loaded`);
  const byId = new Map(registry.map((r) => [r.id, r]));
  if (byId.size !== registry.length) {
    console.warn(
      `WARN: duplicate ids in registry: ${registry.length - byId.size}`,
    );
  }

  /* --- bundle --- */

  const bundle = listBundle(BUNDLE_PATH);
  console.log(`Bundle:   ${bundle.length} PNG entries in zip`);
  const byCard = new Map<string, BundleEntry[]>();
  for (const e of bundle) {
    const arr = byCard.get(e.cardId) ?? [];
    arr.push(e);
    byCard.set(e.cardId, arr);
  }

  /* --- mapping --- */

  const picks = pickBestVariant(bundle);
  const mapping: MappingRow[] = [];
  const missingCards: string[] = [];
  const unusedBundleCards: string[] = [];

  for (const row of registry) {
    const pick = picks.get(row.id);
    if (!pick) {
      missingCards.push(row.id);
      continue;
    }
    const variants = (byCard.get(row.id) ?? [])
      .map((e) => e.variant)
      .sort();
    mapping.push({
      cardId: row.id,
      sourceFile: pick.path,
      definitionPath: row.filePath.replace(ROOT + "/", ""),
      variant: pick.variant,
      outputPath: `apps/client/public/art/cards/${row.id}.webp`,
      publicUrl: `${PUBLIC_URL_PREFIX}/${row.id}.webp`,
      sourceBytes: pick.size,
      outputBytes: null,
      availableVariants: variants,
      rewritten: false,
    });
  }

  for (const [cardId] of byCard) {
    if (!byId.has(cardId)) {
      unusedBundleCards.push(cardId);
    }
  }

  console.log(`Mapped:   ${mapping.length}/${registry.length} cards`);
  console.log(`Missing:  ${missingCards.length} (cards with no bundle file)`);
  console.log(
    `Unused:   ${unusedBundleCards.length} bundle cards with no matching definition`,
  );
  console.log("");

  if (missingCards.length > 0) {
    console.log("Missing cards (first 20):");
    for (const id of missingCards.slice(0, 20)) console.log(`  ${id}`);
    console.log("");
  }
  if (unusedBundleCards.length > 0) {
    console.log(`Unused bundle entries (first 20):`);
    for (const id of unusedBundleCards.slice(0, 20)) console.log(`  ${id}`);
    console.log("");
  }

  /* --- dry-run: just emit mapping + bail --- */

  if (args.dryRun) {
    writeFileSync(MAPPING_OUT, JSON.stringify(mapping, null, 2));
    console.log(`Dry run — wrote ${MAPPING_OUT}`);
    console.log("No images extracted, no TS files rewritten.");
    return;
  }

  /* --- extract + compress --- */

  if (!args.skipImages) {
    mkdirSync(ART_OUT_DIR, { recursive: true });
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
          row.sourceFile,
          destPath,
        );
        row.outputBytes = outBytes;
        totalBytesIn += row.sourceBytes;
        totalBytesOut += outBytes;
        count++;
        if (count % 25 === 0 || count === todo.length) {
          const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
          console.log(
            `  [${count}/${todo.length}] ${elapsed}s elapsed, ${formatBytes(
              totalBytesOut,
            )} output`,
          );
        }
      } catch (err) {
        console.error(`  FAIL ${row.cardId}: ${(err as Error).message}`);
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
  }

  /* --- rewrite TS --- */

  if (!args.skipRewrite) {
    let rewritten = 0;
    let failed = 0;
    for (const row of mapping) {
      const absPath = join(ROOT, row.definitionPath);
      const ok = rewriteArtField(absPath, row.publicUrl);
      row.rewritten = ok;
      if (ok) rewritten++;
      else {
        failed++;
        console.warn(
          `  WARN rewrite failed for ${row.cardId} (${row.definitionPath})`,
        );
      }
    }
    console.log(`Rewrote:  ${rewritten}/${mapping.length} definition files`);
    if (failed > 0) console.log(`Failed:   ${failed}`);
    console.log("");
  }

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
