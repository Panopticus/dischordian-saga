#!/usr/bin/env node
/* Convert cinematic + VFX keyframe PNGs to WebP @ q85, then upload
   the full pack to s3://dgrsart/cdn/client-public/.

   Layout on CDN (mirrors the producer zip):
     cdn/client-public/videos/cinematics/<NN_name>/cinematic_NN_<...>.mp4
     cdn/client-public/art/cinematics/<NN_name>/keyframes/*.webp
     cdn/client-public/videos/vfx/<category>/*.mp4
     cdn/client-public/art/vfx/<category>/*.webp

   Idempotent (S3 ETag compare). Cache-Control immutable. Requires
   AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env.

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

const SRC = "/tmp/cinematics/extracted";
const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public";
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

/* ─── 1. Convert PNGs to WebP next to the source files ─── */

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

const pngs = [];
for await (const f of walk(SRC)) if (f.endsWith(".png")) pngs.push(f);
console.log(`Converting ${pngs.length} PNGs → WebP @ q85 ...`);
let conv = 0;
const startConv = Date.now();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (pngs.length) {
      const p = pngs.shift();
      if (!p) return;
      const out = p.replace(/\.png$/, ".webp");
      try {
        const dst = await stat(out).catch(() => null);
        const src = await stat(p);
        if (dst && dst.mtimeMs >= src.mtimeMs) { conv++; continue; }
        await sharp(p).webp({ quality: 85, effort: 4 }).toFile(out);
        conv++;
      } catch (e) { console.error(`FAIL convert ${p}: ${e.message}`); }
    }
  }),
);
console.log(`  converted=${conv} elapsed=${((Date.now() - startConv) / 1000).toFixed(1)}s`);

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
  const isImage = ext === ".webp" || ext === ".png";
  if (!isVideo && !isImage) return null; // skip unrecognised
  // Top-level segment: cinematics or vfx. Everything maps:
  //   videos/<rel-path-with-mp4>
  //   art/<rel-path-with-webp>
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
  jobs.push({ abs, key, size: s.size, contentType: CONTENT_TYPE[rel.slice(rel.lastIndexOf(".")).toLowerCase()] });
}
console.log(`\nPlanned ${jobs.length} S3 uploads. dryRun=${DRY}`);

/* ─── 3. Upload (idempotent via ETag compare) ─── */

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
        if (DRY) {
          console.log(`[dry] ${j.key} (${(j.size / 1024).toFixed(0)} KB)`);
          dry++; continue;
        }
        await client.send(new PutObjectCommand({
          Bucket: BUCKET, Key: j.key, Body: body,
          ContentType: j.contentType, CacheControl: CACHE,
        }));
        ok++;
        if ((ok + skipped + dry) % 10 === 0) {
          const e = ((Date.now() - startUp) / 1000).toFixed(1);
          console.log(`  ${ok + skipped + dry}/${jobs.length} (up=${ok} skip=${skipped} dry=${dry}) — ${e}s`);
        }
      } catch (e) { fail++; console.error(`FAIL ${j.key}: ${e.message}`); }
    }
  }),
);
console.log(`\nDone. uploaded=${ok} skipped=${skipped} dry=${dry} failed=${fail}`);

/* ─── 4. Emit a JSON inventory of every key, for the manifest gen step ─── */

const inv = jobs.map((j) => ({
  rel: j.abs.slice(SRC.length + 1),
  cdnKey: j.key,
  contentType: j.contentType,
  bytes: j.size,
}));
await writeFile("/tmp/cinematics/upload-inventory.json", JSON.stringify(inv, null, 2));
console.log(`Wrote /tmp/cinematics/upload-inventory.json (${inv.length} entries).`);

if (fail > 0) process.exit(1);
