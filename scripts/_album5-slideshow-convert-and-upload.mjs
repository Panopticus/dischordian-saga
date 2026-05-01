#!/usr/bin/env node
/* Convert Album 5 ("Silence in Heaven") slideshow PNGs to WebP @ q85,
   then upload to s3://dgrsart/cdn/client-public/art/slideshows/album5/...

   Source: /tmp/album5/extracted/06_silence_in_heaven/{T<NN>,narrators,bg}/*.png
           (37 tracks · 552 track frames + 20 narrator portraits + 18
           dialog backgrounds · 2752×1536 16:9 cinematic).

   Note on numbering: producer-side filename is `SilenceInHeaven_Album6_*.zip`
   and the extracted prefix is `06_silence_in_heaven`. The canonical
   album number per the saga is 5 — see album5Slideshows.ts header for
   the renumbering rationale. Producer-side directory in SRC; canonical
   `album5` prefix on S3.

   Album 5 is structurally distinct from Albums 1-4 — alongside the
   per-track folders it ships:
     - narrators/ (20 portrait expressions, 10 Antiquarian + 10 Storyteller)
     - bg/        (18 named dialog backgrounds)

   These map to ALBUM5_NARRATOR_PORTRAITS + ALBUM5_DIALOG_BACKGROUNDS in
   the manifest and need to land at:
     cdn/client-public/art/slideshows/album5/narrators/<file>.webp
     cdn/client-public/art/slideshows/album5/bg/<file>.webp

   The shared `walk()` helper picks them up uniformly because they're
   .png files under the SRC root; the per-track / aux distinction is
   only meaningful for downstream consumers.

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, writeFile } from "node:fs/promises";
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC = "/tmp/album5/extracted/06_silence_in_heaven";
const PREFIX = "cdn/client-public/art/slideshows/album5";
const CONCURRENCY = 8;

const DRY = process.argv.includes("--dry-run");
if (!DRY && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error("AWS creds required (or pass --dry-run)");
  process.exit(2);
}

const pngs = [];
for await (const p of walk(SRC, { extensions: [".png"] })) pngs.push(p);
const convJobs = pngs.map((p) => ({ src: p, dst: p.replace(/\.png$/, ".webp") }));

// Quick sanity: report what we found across the three groups so a
// human can spot-check before the (potentially expensive) S3 phase.
const grouped = { tracks: 0, narrators: 0, bg: 0, other: 0 };
for (const p of pngs) {
  const rel = p.slice(SRC.length + 1);
  if (/^T\d{2}\//.test(rel)) grouped.tracks++;
  else if (rel.startsWith("narrators/")) grouped.narrators++;
  else if (rel.startsWith("bg/")) grouped.bg++;
  else grouped.other++;
}
console.log(
  `Inventory: tracks=${grouped.tracks} narrators=${grouped.narrators} ` +
  `bg=${grouped.bg} other=${grouped.other}`,
);

console.log(`\nConverting ${convJobs.length} PNGs → WebP @ q85 ...`);
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
  "/tmp/album5/upload-inventory.json",
  JSON.stringify(inv, null, 2),
);
console.log(`\nWrote /tmp/album5/upload-inventory.json (${inv.length} entries).`);
