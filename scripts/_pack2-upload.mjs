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
   AWS_SECRET_ACCESS_KEY in env. Uses scripts/_lib/s3.mjs.

   Flags: --dry-run     plan only, no PUTs
*/
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/aaa_assets/pack2";
const PREFIX = "cdn/client-public/art/cards";
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

if (!DRY_RUN && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY required");
  process.exit(2);
}

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
    jobs.push({ abs, key, contentType: "image/webp", size: s.size });
  }
}
console.log(`Planned ${jobs.length} uploads. dryRun=${DRY_RUN}`);

const started = Date.now();
const result = await uploadJobsConcurrent({
  client: makeS3Client(),
  bucket: S3_DEFAULTS.bucket,
  jobs: jobs.map(({ abs, key, contentType }) => ({ abs, key, contentType })),
  concurrency: CONCURRENCY,
  dryRun: DRY_RUN,
  onProgress: (n, total, counts) => {
    if (n % 50 === 0 || n === total) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      console.log(
        `  ${n}/${total} (up=${counts.ok} skip=${counts.skipped} dry=${counts.dry} fail=${counts.fail}) — ${elapsed}s`,
      );
    }
  },
});
console.log(
  `Done. uploaded=${result.ok} skipped=${result.skipped} ` +
  `dry=${result.dry} failed=${result.fail}`,
);
process.exit(result.fail > 0 ? 1 : 0);
