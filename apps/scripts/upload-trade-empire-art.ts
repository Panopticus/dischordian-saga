#!/usr/bin/env npx tsx
/**
 * Upload Trade Empire art assets (.webp) to s3://dgrsart/cdn/client-public/art/trade-empire/
 *
 * Maps the producer-delivered ZIP layout (Trade_Empire_Art_Assets.zip)
 * to the canonical asset-id paths the game's tradeEmpireArtUrl()
 * helper expects. Two filename renames are applied automatically to
 * align with the prompt vault assetIds:
 *   wonder_dreamers_shield.webp → wonder_dreamers_answer.webp
 *   era_colony_seed.webp        → era_ark_awakening.webp
 *
 * Usage:
 *   1. Unzip Trade_Empire_Art_Assets.zip somewhere, e.g.
 *        unzip Trade_Empire_Art_Assets.zip -d /tmp/te-art
 *      The expected layout is /tmp/te-art/trade_empire/<category>/*.webp
 *   2. Set AWS creds:
 *        export AWS_ACCESS_KEY_ID=AKIA...
 *        export AWS_SECRET_ACCESS_KEY=...
 *   3. Run:
 *        pnpm tsx apps/scripts/upload-trade-empire-art.ts \
 *          --src /tmp/te-art/trade_empire
 *      Add --dry-run to preview without uploading.
 *
 * Idempotent — uploads with cache-immutable headers so subsequent
 * runs only re-upload changed bytes (skipped via S3 ETag check).
 *
 * Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env (or any
 * credential source resolvable by @aws-sdk/credential-provider-node)
 * with s3:PutObject + s3:HeadObject on the dgrsart bucket.
 */

import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public/art/trade-empire";
const CONCURRENCY = 8;
const CACHE_HEADER = "public, max-age=31536000, immutable";

/**
 * Producer-delivered subdir → canonical CDN subdir.
 * Producer used `civic_icons` etc.; we serve under `civics`, `wonders`, etc.
 */
const SUBDIR_MAP: Record<string, string> = {
  wonders: "wonders",
  era_banners: "eras",
  encounter_key_art: "encounters",
  doctrine_banners: "doctrines",
  fleet_silhouettes: "fleet",
  pirate_portrait: "fleet",
  civic_icons: "civics",
  sector_paintings: "sectors",
};

/**
 * Filename rewrites the prompt vault assetIds expect. Producer
 * delivered different names for these two; map them at upload time
 * so the game wiring resolves cleanly.
 */
const FILENAME_REWRITES: Record<string, string> = {
  "wonder_dreamers_shield.webp": "wonder_dreamers_answer.webp",
  "era_colony_seed.webp": "era_ark_awakening.webp",
};

interface Args {
  srcRoot: string;
  dryRun: boolean;
}

function parseArgs(argv: readonly string[]): Args {
  const args: Args = { srcRoot: "", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--src") {
      const v = argv[i + 1];
      if (!v) throw new Error("--src requires a value");
      args.srcRoot = v;
      i++;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    }
  }
  if (!args.srcRoot) {
    throw new Error(
      "--src=<dir> is required (path to unzipped trade_empire root)",
    );
  }
  return args;
}

async function* walkWebp(
  root: string,
): AsyncGenerator<{ subdir: string; filename: string; absPath: string }> {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const subdir = entry.name;
    if (!SUBDIR_MAP[subdir]) {
      console.warn(
        `Skipping unmapped producer subdir: ${subdir} (no destination known)`,
      );
      continue;
    }
    const subPath = join(root, subdir);
    for (const f of await readdir(subPath)) {
      if (!f.endsWith(".webp")) continue;
      yield { subdir, filename: f, absPath: join(subPath, f) };
    }
  }
}

/**
 * Resolve the effective src root given whatever layout the producer
 * ZIP unpacked into. Tries, in order:
 *   1. --src itself (layout is already correct — has mapped subdirs)
 *   2. --src/trade_empire       (original full-ZIP layout)
 *   3. --src/<any one child dir> that itself contains mapped subdirs
 * Throws with a useful message if none work.
 */
async function resolveSrcRoot(srcArg: string): Promise<string> {
  async function hasMappedChild(dir: string): Promise<boolean> {
    try {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.isDirectory() && SUBDIR_MAP[entry.name]) return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  if (await hasMappedChild(srcArg)) return srcArg;

  const tradeEmpire = join(srcArg, "trade_empire");
  if (await hasMappedChild(tradeEmpire)) return tradeEmpire;

  try {
    for (const entry of await readdir(srcArg, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const candidate = join(srcArg, entry.name);
      if (await hasMappedChild(candidate)) return candidate;
    }
  } catch {
    // fall through
  }

  throw new Error(
    `Could not find a producer-layout root under ${srcArg}. Expected ` +
      `one of [${Object.keys(SUBDIR_MAP).join(", ")}] as a direct child ` +
      `or nested one level under a single wrapper directory.`,
  );
}

interface UploadJob {
  absPath: string;
  destKey: string;
  size: number;
}

async function planUpload(srcRoot: string): Promise<UploadJob[]> {
  const jobs: UploadJob[] = [];
  for await (const f of walkWebp(srcRoot)) {
    const renamed = FILENAME_REWRITES[f.filename] ?? f.filename;
    const destSubdir = SUBDIR_MAP[f.subdir];
    const destKey = `${PREFIX}/${destSubdir}/${renamed}`;
    const s = await stat(f.absPath);
    jobs.push({ absPath: f.absPath, destKey, size: s.size });
  }
  return jobs;
}

async function shouldSkip(
  client: S3Client,
  key: string,
  localBytes: Buffer,
): Promise<boolean> {
  try {
    const head = (await client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
    )) as { ETag?: string };
    const localEtag = `"${createHash("md5").update(localBytes).digest("hex")}"`;
    return head.ETag === localEtag;
  } catch {
    return false;
  }
}

async function uploadOne(
  client: S3Client,
  job: UploadJob,
  dryRun: boolean,
): Promise<"uploaded" | "skipped" | "dryrun"> {
  const body = await readFile(job.absPath);
  if (await shouldSkip(client, job.destKey, body)) return "skipped";
  if (dryRun) {
    console.log(
      `[dry] ${job.destKey} (${(job.size / 1024).toFixed(1)} KB)`,
    );
    return "dryrun";
  }
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: job.destKey,
      Body: body,
      ContentType: "image/webp",
      CacheControl: CACHE_HEADER,
    }),
  );
  console.log(`✓ ${job.destKey} (${(job.size / 1024).toFixed(1)} KB)`);
  return "uploaded";
}

async function pool<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < items.length) {
        const idx = cursor++;
        results[idx] = await worker(items[idx]);
      }
    }),
  );
  return results;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  // Defer credential resolution to the SDK so the full provider chain
  // (env, shared profile, EC2 metadata, ECS task role, web identity, etc.)
  // gets a chance. Surface any auth failure as a runtime error instead.
  const client = new S3Client({ region: REGION });
  const effectiveSrc = await resolveSrcRoot(args.srcRoot);
  if (effectiveSrc !== args.srcRoot) {
    console.log(`Resolved producer root: ${effectiveSrc}`);
  }
  const jobs = await planUpload(effectiveSrc);
  console.log(`Planned ${jobs.length} uploads from ${effectiveSrc}`);

  const outcomes = await pool(jobs, (j) => uploadOne(client, j, args.dryRun), CONCURRENCY);

  const tally = outcomes.reduce<Record<string, number>>((acc, o) => {
    acc[o] = (acc[o] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`Done. ${JSON.stringify(tally)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
