#!/usr/bin/env node
/* Convert Album 3 ("The Book of Daniel 24:7") slideshow PNGs to WebP
   @ q85, then upload to
   s3://dgrsart/cdn/client-public/art/slideshows/album3/T<NN>/<file>.webp.

   Source: /tmp/bod/extracted/03_book_of_daniel/T<NN>/*.png
           (22 tracks · 567 frames · 3168×1344 cinematic widescreen —
           ~111 minutes of visual narrative; the longest album drop).

   Mirrors scripts/_album1-slideshow-convert-and-upload.mjs — same
   shared helpers, same idempotent ETag-aware upload. The inventory
   JSON output sits at the canonical /tmp/bod/upload-inventory.json
   so re-running scripts/_gen-album3-manifest.mjs after a redrop
   keeps working without path edits.

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, writeFile } from "node:fs/promises";
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/bod/extracted/03_book_of_daniel";
const PREFIX = "cdn/client-public/art/slideshows/album3";
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
  "/tmp/bod/upload-inventory.json",
  JSON.stringify(inv, null, 2),
);
console.log(`\nWrote /tmp/bod/upload-inventory.json (${inv.length} entries).`);
