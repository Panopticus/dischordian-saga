#!/usr/bin/env node
/* Upload pack 2 (TCG base-set card art) .webp files to
   s3://dgrsart/cdn/client-public/art/cards/<category>/<file>.webp.

   Source: /tmp/aaa_assets/pack2/<producer-category>/<file>.webp.

   Producer-dir → CDN segment normalisation:
     dimensional → dimension      (matches existing card defs)
     elemental   → element        (matches existing card defs)
     all others pass straight through

   Tier-grid composites (filenames matching /(tier|allegiance)_grid\.webp$/)
   are uploaded under art/cards/<category>/_grids/ so they don't collide
   with the per-card slugs.

   Idempotent (S3 ETag compare). Cache-Control: public,
   max-age=31536000, immutable. Requires AWS_ACCESS_KEY_ID +
   AWS_SECRET_ACCESS_KEY in env.

   Flags: --dry-run     plan only, no PUTs
*/
import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const SRC = "/tmp/aaa_assets/pack2";
const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public/art/cards";
const CACHE = "public, max-age=31536000, immutable";
const CONCURRENCY = 16;

const CATEGORY_MAP = {
  allegiance: "allegiance",
  antiquarian: "antiquarian",
  architect: "architect",
  class: "class",
  dimensional: "dimension",
  dreamer: "dreamer",
  elemental: "element",
  imprint: "imprint",
  insurgency: "insurgency",
  neutral: "neutral",
  new_babylon: "new_babylon",
  panopticon: "panopticon",
  race: "race",
  thought_virus: "thought_virus",
};

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

function destKey(producerDir, filename) {
  const segment = CATEGORY_MAP[producerDir];
  if (!segment) return null;
  if (/_grid\.webp$/.test(filename)) {
    return `${PREFIX}/${segment}/_grids/${filename}`;
  }
  return `${PREFIX}/${segment}/${filename}`;
}

async function shouldSkip(client, key, body) {
  try {
    const head = await client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
    );
    const localEtag = `"${createHash("md5").update(body).digest("hex")}"`;
    return head.ETag === localEtag;
  } catch {
    return false;
  }
}

async function uploadOne(client, job) {
  const body = await readFile(job.abs);
  if (await shouldSkip(client, job.key, body)) return "skipped";
  if (DRY_RUN) {
    console.log(`[dry] ${job.key} (${(job.size / 1024).toFixed(1)} KB)`);
    return "dryrun";
  }
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: job.key,
      Body: body,
      ContentType: "image/webp",
      CacheControl: CACHE,
    }),
  );
  return "uploaded";
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY required");
  process.exit(2);
}
const client = new S3Client({ region: REGION });

const jobs = [];
for (const ent of await readdir(SRC, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  if (!CATEGORY_MAP[ent.name]) {
    console.warn(`[skip] unmapped producer dir: ${ent.name}`);
    continue;
  }
  const sub = join(SRC, ent.name);
  for (const f of await readdir(sub)) {
    if (!f.endsWith(".webp")) continue;
    const abs = join(sub, f);
    const s = await stat(abs);
    const key = destKey(ent.name, f);
    if (!key) continue;
    jobs.push({ abs, key, size: s.size });
  }
}
console.log(`Planned ${jobs.length} uploads. dryRun=${DRY_RUN}`);

let cursor = 0, uploaded = 0, skipped = 0, dry = 0, failed = 0;
const started = Date.now();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < jobs.length) {
      const idx = cursor++;
      try {
        const r = await uploadOne(client, jobs[idx]);
        if (r === "uploaded") uploaded++;
        else if (r === "skipped") skipped++;
        else dry++;
        const total = uploaded + skipped + dry + failed;
        if (total % 50 === 0 || total === jobs.length) {
          const elapsed = ((Date.now() - started) / 1000).toFixed(1);
          console.log(`  ${total}/${jobs.length} (up=${uploaded} skip=${skipped} dry=${dry} fail=${failed}) — ${elapsed}s`);
        }
      } catch (err) {
        failed++;
        console.error(`FAIL ${jobs[idx].key}: ${err.message}`);
      }
    }
  }),
);
console.log(`Done. uploaded=${uploaded} skipped=${skipped} dry=${dry} failed=${failed}`);
process.exit(failed > 0 ? 1 : 0);
