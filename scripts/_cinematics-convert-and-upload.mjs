#!/usr/bin/env node
/* Convert cinematic + VFX keyframe PNGs to WebP @ q85, then upload
   the full pack to s3://dgrsart/cdn/client-public/.

   Layout on CDN (mirrors the producer zip):
     cdn/client-public/videos/cinematics/<NN_name>/cinematic_NN_<...>.mp4
     cdn/client-public/art/cinematics/<NN_name>/keyframes/*.webp
     cdn/client-public/videos/vfx/<category>/*.mp4
     cdn/client-public/art/vfx/<category>/*.webp

   Uses scripts/_lib/{walk, webp, s3}.mjs for the shared pipeline
   plumbing. Idempotent (S3 ETag compare).

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, writeFile } from "node:fs/promises";
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/cinematics/extracted";
const PREFIX = "cdn/client-public";
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
const convResult = await convertPngsConcurrent(convJobs, { concurrency: CONCURRENCY });
console.log(
  `  converted=${convResult.converted} skipped=${convResult.skipped} ` +
  `failed=${convResult.failed} elapsed=${((Date.now() - startConv) / 1000).toFixed(1)}s`,
);

/* ─── 2. Build upload jobs ─── */

const CONTENT_TYPE = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".json": "application/json",
};

function destKey(rel) {
  // rel: e.g. "cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4"
  // or  "cinematics/01_pack_opening/keyframes/beat1_preroll_start.webp"
  // or  "vfx/act_spells/vfx_memoir_glyph.mp4"
  // or  "vfx/act_spells/kf_memoir_glyph.webp"
  const ext = rel.slice(rel.lastIndexOf(".")).toLowerCase();
  const isVideo = ext === ".mp4" || ext === ".webm";
  const isImage = ext === ".webp"; // raw PNGs filtered out below
  if (isVideo) return `${PREFIX}/videos/${rel}`;
  if (isImage) return `${PREFIX}/art/${rel}`;
  return null;
}

const jobs = [];
for await (const abs of walk(SRC)) {
  const rel = abs.slice(SRC.length + 1);
  if (rel.endsWith(".png")) continue; // skip raw PNGs (we uploaded their .webp siblings)
  const key = destKey(rel);
  if (!key) continue;
  const s = await stat(abs);
  const ext = rel.slice(rel.lastIndexOf(".")).toLowerCase();
  jobs.push({ abs, key, size: s.size, contentType: CONTENT_TYPE[ext] });
}
console.log(`\nPlanned ${jobs.length} S3 uploads. dryRun=${DRY}`);

/* ─── 3. Upload (idempotent via ETag compare) ─── */

const startUp = Date.now();
const upResult = await uploadJobsConcurrent({
  client: makeS3Client(),
  bucket: S3_DEFAULTS.bucket,
  jobs: jobs.map(({ abs, key, contentType }) => ({ abs, key, contentType })),
  concurrency: CONCURRENCY,
  dryRun: DRY,
  onProgress: (n, total) => {
    if (n % 10 === 0) {
      const e = ((Date.now() - startUp) / 1000).toFixed(1);
      console.log(`  ${n}/${total} — ${e}s`);
    }
  },
});
console.log(
  `\nDone. uploaded=${upResult.ok} skipped=${upResult.skipped} ` +
  `dry=${upResult.dry} failed=${upResult.fail}`,
);

/* ─── 4. Emit a JSON inventory of every key, for the manifest gen step ─── */

const inv = jobs.map((j) => ({
  rel: j.abs.slice(SRC.length + 1),
  cdnKey: j.key,
  contentType: j.contentType,
  bytes: j.size,
}));
await writeFile("/tmp/cinematics/upload-inventory.json", JSON.stringify(inv, null, 2));
console.log(`Wrote /tmp/cinematics/upload-inventory.json (${inv.length} entries).`);

if (upResult.fail > 0) process.exit(1);
