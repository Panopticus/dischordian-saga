/**
 * Chroma-key the Silence in Heaven narrator portraits.
 *
 * Every `sih_antiq_*` and `sih_story_*` portrait on the CDN ships with
 * an un-keyed green-screen background. When CSS filters dim or
 * desaturate them at render time the green muddies and brighter
 * banding inside the chroma reads as washed-out white columns flanking
 * the figure. This script downloads each portrait, kills the green +
 * suppresses spill, re-encodes to webp, and uploads back to S3 over
 * the same key.
 *
 * Idempotent: re-running on already-keyed portraits has near-zero
 * effect (the alpha mask just stays where it is). Safe to retry.
 *
 * Usage:
 *   pnpm tsx apps/scripts/key-sih-narrator-portraits.ts            # download → key → upload
 *   pnpm tsx apps/scripts/key-sih-narrator-portraits.ts --dry-run  # process locally, do not upload
 *   pnpm tsx apps/scripts/key-sih-narrator-portraits.ts --write=/tmp/keyed   # also drop keyed webps on disk
 *   pnpm tsx apps/scripts/key-sih-narrator-portraits.ts --only=sih_story_witness   # one portrait
 *
 * Requires AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in env with
 * s3:PutObject (and ideally s3:HeadObject) on the dgrsart bucket —
 * same scope as upload-public-to-s3.ts.
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public";
const CDN_BASE = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${PREFIX}`;
const PORTRAIT_DIR = "art/slideshows/album5/narrators";

const PORTRAIT_IDS = [
  // Antiquarian — 10 expressions
  "sih_antiq_archive",
  "sih_antiq_argue",
  "sih_antiq_awe",
  "sih_antiq_concede",
  "sih_antiq_dread",
  "sih_antiq_grief",
  "sih_antiq_neutral",
  "sih_antiq_peace",
  "sih_antiq_warn",
  "sih_antiq_wry",
  // Storyteller — 10 expressions
  "sih_story_broken",
  "sih_story_challenge",
  "sih_story_defiant",
  "sih_story_fire",
  "sih_story_grief",
  "sih_story_joy",
  "sih_story_knowing",
  "sih_story_tender",
  "sih_story_triumph",
  "sih_story_witness",
] as const;

interface Args {
  dryRun: boolean;
  writeDir: string | null;
  only: string | null;
}

function parseArgs(argv: string[]): Args {
  const dryRun = argv.includes("--dry-run");
  const writeArg = argv.find((a) => a.startsWith("--write="));
  const onlyArg = argv.find((a) => a.startsWith("--only="));
  return {
    dryRun,
    writeDir: writeArg ? writeArg.slice("--write=".length) : null,
    only: onlyArg ? onlyArg.slice("--only=".length) : null,
  };
}

async function downloadPortrait(id: string): Promise<Buffer> {
  const url = `${CDN_BASE}/${PORTRAIT_DIR}/${id}.webp`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetch ${url} → HTTP ${res.status}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

/** Chroma-key a green-screened RGBA pixel.
 *
 * Returns the new pixel as [r, g, b, a]. Heuristic:
 *   - Strong green dominance + high luminance → fully transparent.
 *   - Soft edge (green still dominant but weaker) → partial alpha,
 *     with green spill clamped toward the avg of red+blue so any
 *     remaining halo doesn't read as green.
 *   - Otherwise pixel is foreground, returned untouched.
 *
 * The thresholds were tuned on `sih_story_witness.webp` and verified
 * to produce halo-free cutouts across both narrators' expression sets.
 */
function keyPixel(
  r: number,
  g: number,
  b: number,
  a: number,
): [number, number, number, number] {
  const gOverR = g - r;
  const gOverB = g - b;
  // Hard cut — saturated green pixel.
  if (gOverR > 60 && gOverB > 60 && g > 120) {
    return [0, 0, 0, 0];
  }
  // Soft edge — partial transparency + spill suppress.
  if (gOverR > 25 && gOverB > 25 && g > 90) {
    const strength = Math.min((Math.min(gOverR, gOverB) - 25) / 35, 1);
    const alpha = Math.round(a * (1 - strength));
    const targetG = Math.floor((r + b) / 2);
    const newG = Math.min(g, targetG + 8);
    return [r, newG, b, alpha];
  }
  return [r, g, b, a];
}

async function keyPortrait(input: Buffer): Promise<Buffer> {
  // Decode → raw RGBA so we can rewrite alpha per-pixel.
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data); // mutable copy
  for (let i = 0; i < pixels.length; i += 4) {
    const [nr, ng, nb, na] = keyPixel(
      pixels[i],
      pixels[i + 1],
      pixels[i + 2],
      pixels[i + 3],
    );
    pixels[i] = nr;
    pixels[i + 1] = ng;
    pixels[i + 2] = nb;
    pixels[i + 3] = na;
  }
  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 90, alphaQuality: 95 })
    .toBuffer();
}

async function uploadKeyed(
  client: S3Client,
  id: string,
  body: Buffer,
): Promise<void> {
  const key = `${PREFIX}/${PORTRAIT_DIR}/${id}.webp`;
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
      ServerSideEncryption: "AES256",
    }),
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const targets = args.only
    ? PORTRAIT_IDS.filter((id) => id === args.only)
    : [...PORTRAIT_IDS];
  if (targets.length === 0) {
    console.error(`No portraits matched --only=${args.only}`);
    process.exit(2);
  }

  let client: S3Client | null = null;
  if (!args.dryRun) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
      console.error(
        "ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in env (or pass --dry-run).",
      );
      process.exit(1);
    }
    client = new S3Client({
      region: REGION,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  if (args.writeDir) {
    await mkdir(args.writeDir, { recursive: true });
  }

  let uploaded = 0;
  let bytesIn = 0;
  let bytesOut = 0;
  for (const id of targets) {
    process.stdout.write(`${id} ... `);
    const inBuf = await downloadPortrait(id);
    const outBuf = await keyPortrait(inBuf);
    bytesIn += inBuf.length;
    bytesOut += outBuf.length;
    if (args.writeDir) {
      await writeFile(join(args.writeDir, `${id}.webp`), outBuf);
    }
    if (args.dryRun) {
      process.stdout.write(
        `keyed (${inBuf.length} → ${outBuf.length} B) [dry-run]\n`,
      );
      continue;
    }
    await uploadKeyed(client!, id, outBuf);
    uploaded += 1;
    process.stdout.write(`keyed + uploaded (${inBuf.length} → ${outBuf.length} B)\n`);
  }

  console.log(
    `\nDone. processed=${targets.length} uploaded=${uploaded} in=${bytesIn}B out=${bytesOut}B`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
