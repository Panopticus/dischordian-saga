#!/usr/bin/env node
/* Convert Album 2 ("The Age of Privacy") slideshow PNGs to WebP @ q85,
   then upload to s3://dgrsart/cdn/client-public/art/slideshows/album2/T<NN>/<file>.webp.

   Source: /tmp/album2/extracted/02_age_of_privacy/T<NN>/*.png
           (20 tracks · 334 frames · 3168×1344 cinematic widescreen)

   Mirrors scripts/_album1-slideshow-convert-and-upload.mjs — same
   shared helpers (_lib/{walk,webp,s3}.mjs), same PNG → WebP → S3
   pipeline, same idempotency (S3 ETag compare + WebP mtime compare).

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, writeFile } from "node:fs/promises";
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/album2/extracted/02_age_of_privacy";
const PREFIX = "cdn/client-public/art/slideshows/album2";
const CONCURRENCY = 8;

const DRY = process.argv.includes("--dry-run");
if (!DRY && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error("AWS creds required (or pass --dry-run)");
  process.exit(2);
}

/* ─── 1. Convert PNGs to WebP next to the source files ─── */

const pngs = [];
for await (const p of walk(SRC, { extensions: [".png"] })) pngs.push(p);
const convJobs = pngs.map((p) => ({ src: p, dst: p.replace(/\.png$/, ".webp") }));

console.log(`Converting ${convJobs.length} PNGs → WebP @ q85 ...`);
const startConv = Date.now();
const convResult = await convertPngsConcurrent(convJobs, {
  concurrency: CONCURRENCY,
  onProgress: (n, total) => {
    if (n % 50 === 0) {
      const e = ((Date.now() - startConv) / 1000).toFixed(1);
      console.log(`  ${n}/${total} converted — ${e}s`);
    }
  },
});
console.log(
  `  converted=${convResult.converted} skipped=${convResult.skipped} ` +
  `failed=${convResult.failed} elapsed=${((Date.now() - startConv) / 1000).toFixed(1)}s`,
);

/* ─── 2. Build upload jobs from the .webp files ─── */

const jobs = [];
for await (const png of walk(SRC, { extensions: [".png"] })) {
  const webp = png.replace(/\.png$/, ".webp");
  const rel = webp.slice(SRC.length + 1);
  const s = await stat(webp);
  jobs.push({
    abs: webp,
    key: `${PREFIX}/${rel}`,
    contentType: "image/webp",
    size: s.size,
  });
}
console.log(`\nPlanned ${jobs.length} S3 uploads. dryRun=${DRY}`);

/* ─── 3. Upload (idempotent via ETag compare) ─── */

const client = DRY ? null : makeS3Client();
const startUp = Date.now();
const upResult = await uploadJobsConcurrent({
  client: client ?? makeS3Client(),
  bucket: S3_DEFAULTS.bucket,
  jobs: jobs.map(({ abs, key, contentType }) => ({ abs, key, contentType })),
  concurrency: CONCURRENCY,
  dryRun: DRY,
  onProgress: (n, total) => {
    if (n % 50 === 0) {
      const e = ((Date.now() - startUp) / 1000).toFixed(1);
      console.log(`  ${n}/${total} — ${e}s`);
    }
  },
});
console.log(
  `\nDone. uploaded=${upResult.ok} skipped=${upResult.skipped} ` +
  `dry=${upResult.dry} failed=${upResult.fail}`,
);

/* ─── 4. Emit JSON inventory of every uploaded key ─── */

const inv = jobs.map((j) => ({
  rel: j.key.slice(PREFIX.length + 1),
  key: j.key,
  size: j.size,
}));
await writeFile(
  "/tmp/album2/upload-inventory.json",
  JSON.stringify(inv, null, 2),
);
console.log(`\nWrote /tmp/album2/upload-inventory.json (${inv.length} entries).`);
