#!/usr/bin/env node
/* Convert producer WAV master tracks (Album 1 — Dischordian Logic 1-9) to
   192kbps MP3, then upload to s3://dgrsart/cdn/client-public/audio/album1/T<NN>.mp3.

   Source: /tmp/album1-songs/extracted/*.wav  (producer naming:
           "1. The Enigma's Lament (Remastered) (HD).wav", etc.)

   Idempotent — both phases are mtime/ETag aware:
     1. WAV → MP3 conversion: skips if T<NN>.mp3 is newer than the WAV
     2. MP3 → S3 upload:      skips if dgrsart already holds the bytes (ETag)

   Flags:  --dry-run    plan only, no PUTs
*/
import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { makeS3Client, uploadJobsConcurrent, S3_DEFAULTS } from "./_lib/s3.mjs";

const SRC_WAV = "/tmp/album1-songs/extracted";
const OUT_MP3 = "/tmp/album1-songs/mp3";
const PREFIX = "cdn/client-public/audio/album1";
const CONCURRENCY = 4;

const DRY = process.argv.includes("--dry-run");
if (!DRY && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error("AWS creds required (or pass --dry-run)");
  process.exit(2);
}

/* ─── 1. Convert WAVs → MP3s next to /tmp/album1-songs/mp3/ ─── */

import { mkdir } from "node:fs/promises";
await mkdir(OUT_MP3, { recursive: true });

const wavs = (await readdir(SRC_WAV)).filter((f) => f.endsWith(".wav"));
console.log(`Found ${wavs.length} WAVs to consider.`);

function trackIdFromName(name) {
  const m = name.match(/^(\d+)\./);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return `T${String(n).padStart(2, "0")}`;
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.trim().split("\n").pop()))));
  });
}

let conv = 0, skipConv = 0, failConv = 0;
const startConv = Date.now();
for (const wav of wavs) {
  const trackId = trackIdFromName(wav);
  if (!trackId) { console.warn(`  [skip] unparseable: ${wav}`); continue; }
  const dstName = `${trackId}.mp3`;
  const wavPath = join(SRC_WAV, wav);
  const dstPath = join(OUT_MP3, dstName);
  const src = await stat(wavPath);
  const dst = await stat(dstPath).catch(() => null);
  if (dst && dst.mtimeMs >= src.mtimeMs) { skipConv++; continue; }
  try {
    await ffmpeg(["-y", "-loglevel", "error", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "192k", dstPath]);
    conv++;
  } catch (e) {
    failConv++;
    console.error(`  FAIL convert ${wav}: ${e.message}`);
  }
}
console.log(
  `  WAV→MP3: converted=${conv} skipped=${skipConv} failed=${failConv} ` +
  `elapsed=${((Date.now() - startConv) / 1000).toFixed(1)}s`,
);

/* ─── 2. Upload MP3s to S3 ─── */

const jobs = [];
for (const f of await readdir(OUT_MP3)) {
  if (!f.endsWith(".mp3")) continue;
  const abs = join(OUT_MP3, f);
  const s = await stat(abs);
  jobs.push({ abs, key: `${PREFIX}/${f}`, contentType: "audio/mpeg", size: s.size });
}
console.log(`\nPlanned ${jobs.length} S3 uploads. dryRun=${DRY}`);

const startUp = Date.now();
const result = await uploadJobsConcurrent({
  client: makeS3Client(),
  bucket: S3_DEFAULTS.bucket,
  jobs: jobs.map(({ abs, key, contentType }) => ({ abs, key, contentType })),
  concurrency: CONCURRENCY,
  dryRun: DRY,
  onProgress: (n, total) => {
    const e = ((Date.now() - startUp) / 1000).toFixed(1);
    console.log(`  ${n}/${total} — ${e}s`);
  },
});
console.log(
  `\nDone. uploaded=${result.ok} skipped=${result.skipped} ` +
  `dry=${result.dry} failed=${result.fail}`,
);

if (result.fail > 0 || failConv > 0) process.exit(1);
