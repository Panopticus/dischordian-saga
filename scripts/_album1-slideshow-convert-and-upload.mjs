#!/usr/bin/env node
/* Convert Album 1 slideshow PNGs to WebP @ q85, then upload to
   s3://dgrsart/cdn/client-public/art/slideshows/album1/T<NN>/<file>.webp.

   Source: /tmp/album1/extracted/01_age_of_dischordian_logic/T<NN>/*.png
           (29 tracks · 490 frames · 3168×1344 cinematic widescreen)

   Idempotent (S3 ETag compare). Cache-Control immutable.
   Concurrency 8 across both convert and upload phases.

   Flags:  --dry-run    plan only, no PUTs
*/
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const SRC = "/tmp/album1/extracted/01_age_of_dischordian_logic";
const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public/art/slideshows/album1";
const CACHE = "public, max-age=31536000, immutable";
const CONCURRENCY = 8;

const DRY = process.argv.includes("--dry-run");

if (!DRY) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("AWS creds required (or pass --dry-run)");
    process.exit(2);
  }
}

const client = new S3Client({ region: REGION });

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name.endsWith(".md")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.endsWith(".png")) yield full;
  }
}

const pngs = [];
for await (const f of walk(SRC)) pngs.push(f);
console.log(`Converting ${pngs.length} PNGs → WebP @ q85 ...`);
let converted = 0;
const startConv = Date.now();
const queue = pngs.slice();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift();
      if (!p) return;
      const out = p.replace(/\.png$/, ".webp");
      try {
        const dst = await stat(out).catch(() => null);
        const src = await stat(p);
        if (dst && dst.mtimeMs >= src.mtimeMs) { converted++; continue; }
        await sharp(p).webp({ quality: 85, effort: 4 }).toFile(out);
        converted++;
        if (converted % 50 === 0) {
          const e = ((Date.now() - startConv) / 1000).toFixed(1);
          console.log(`  ${converted}/${pngs.length} converted — ${e}s`);
        }
      } catch (e) { console.error(`FAIL convert ${p}: ${e.message}`); }
    }
  }),
);
console.log(`  converted=${converted} elapsed=${((Date.now() - startConv) / 1000).toFixed(1)}s`);

const jobs = [];
for await (const png of walk(SRC)) {
  const webp = png.replace(/\.png$/, ".webp");
  const rel = webp.slice(SRC.length + 1);
  const key = `${PREFIX}/${rel}`;
  const s = await stat(webp);
  jobs.push({ abs: webp, key, size: s.size });
}
console.log(`\nPlanned ${jobs.length} S3 uploads. dryRun=${DRY}`);

async function shouldSkip(key, body) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    const localEtag = `"${createHash("md5").update(body).digest("hex")}"`;
    return head.ETag === localEtag;
  } catch { return false; }
}

let cursor = 0, ok = 0, skipped = 0, dry = 0, fail = 0;
const startUp = Date.now();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < jobs.length) {
      const idx = cursor++;
      const j = jobs[idx];
      try {
        const body = await readFile(j.abs);
        if (await shouldSkip(j.key, body)) { skipped++; continue; }
        if (DRY) { dry++; continue; }
        await client.send(new PutObjectCommand({
          Bucket: BUCKET, Key: j.key, Body: body,
          ContentType: "image/webp", CacheControl: CACHE,
        }));
        ok++;
        if ((ok + skipped + dry) % 50 === 0) {
          const e = ((Date.now() - startUp) / 1000).toFixed(1);
          console.log(`  ${ok + skipped + dry}/${jobs.length} (up=${ok} skip=${skipped} dry=${dry}) — ${e}s`);
        }
      } catch (e) { fail++; console.error(`FAIL ${j.key}: ${e.message}`); }
    }
  }),
);
console.log(`\nDone. uploaded=${ok} skipped=${skipped} dry=${dry} failed=${fail}`);

const inv = jobs.map((j) => ({
  rel: j.abs.slice(SRC.length + 1),
  cdnKey: j.key,
  bytes: j.size,
}));
await writeFile("/tmp/album1/upload-inventory.json", JSON.stringify(inv, null, 2));
console.log(`Wrote /tmp/album1/upload-inventory.json (${inv.length} entries).`);

if (fail > 0) process.exit(1);
