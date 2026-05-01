#!/usr/bin/env node
/* Convert Album 4 ("West by God") slideshow PNGs to WebP @ q85, then
   upload to s3://dgrsart/cdn/client-public/art/slideshows/album4/T<NN>/<file>.webp.

   Source: /tmp/album4/extracted/05_west_by_god/T<NN>/*.png
           (10 tracks · 200 frames · 2752×1536 16:9 cinematic).

   Note on numbering: producer-side filename is `WestByGod_Album5_*.zip`
   and the extracted prefix is `05_west_by_god`. The canonical album
   number per the saga is 4 — see the apps/shared/expansionArt/album4Slideshows.ts
   header for the renumbering rationale. We keep the producer-side
   directory name in SRC because that's what the unzip yields, but
   target the canonical `album4` prefix on S3.

   Mirrors scripts/_album1-slideshow-convert-and-upload.mjs.

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, writeFile } from "node:fs/promises";
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/album4/extracted/05_west_by_god";
const PREFIX = "cdn/client-public/art/slideshows/album4";
const CONCURRENCY = 8;

const DRY = process.argv.includes("--dry-run");
if (!DRY && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error("AWS creds required (or pass --dry-run)");
  process.exit(2);
}

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

const inv = jobs.map((j) => ({
  rel: j.key.slice(PREFIX.length + 1),
  key: j.key,
  size: j.size,
}));
await writeFile(
  "/tmp/album4/upload-inventory.json",
  JSON.stringify(inv, null, 2),
);
console.log(`\nWrote /tmp/album4/upload-inventory.json (${inv.length} entries).`);
