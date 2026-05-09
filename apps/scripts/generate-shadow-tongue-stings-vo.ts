#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   SHADOW TONGUE STINGS VO GENERATOR

   NPC depth #13 follow-up. Generates short voiced beats —
   3-5 seconds — spoken by the Shadow Tongue itself when a
   redaction event fires (revealed, contradicted, edited-back,
   escalated). The client plays the matched sting before
   surfacing the redaction state change.

   Voice direction: distorted, processed, low-stability —
   the voice is canonically *editorial* not narrative.
   Treats the entry's text as the underlying phrase; the
   ElevenLabs voice settings (very low stability, low
   similarity) plus client-side audio post (reverse +
   noise overlay) deliver the in-fiction sound.

   Run:
     npx tsx apps/scripts/generate-shadow-tongue-stings-vo.ts

   Requires:
     ELEVENLABS_API_KEY=sk_...
     ELEVENLABS_SHADOW_TONGUE_VOICE_ID=<low-stability voice>
     AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
     S3_BUCKET=dgrsvoices

   Idempotent: existing manifest entries are skipped.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const VOICE_ID = process.env.ELEVENLABS_SHADOW_TONGUE_VOICE_ID || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Shadow Tongue Stings";

// Single canonical voice profile — deliberately destabilised so the
// editorial-without-narrative quality reads as in-fiction Shadow
// Tongue rather than a normal narrator.
const STING_SETTINGS = {
  stability: 0.20,
  similarity_boost: 0.60,
  style: 0.65,
  use_speaker_boost: false,
};

interface StingLine {
  id: string;
  kind: "revealed" | "contradicted" | "edited_back" | "escalated";
  text: string;
  emotion: string;
  file: string;
}

const LINES_FILE = path.join(__dirname, "shadow-tongue-stings.json");
let LINES: StingLine[] = [];
if (fs.existsSync(LINES_FILE)) {
  LINES = JSON.parse(fs.readFileSync(LINES_FILE, "utf-8"));
  console.log(`Loaded ${LINES.length} sting lines.`);
} else {
  console.error(`ERROR: ${LINES_FILE} not found.`);
  process.exit(1);
}

const MANIFEST_PATH = path.join(
  __dirname,
  "..",
  "shared",
  "shadowTongueStingManifest.json",
);
let manifest: Record<string, string> = {};
if (fs.existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  console.log(`Loaded existing manifest with ${Object.keys(manifest).length} entries.`);
}

async function generateSpeech(text: string): Promise<Buffer> {
  if (!VOICE_ID) {
    throw new Error(
      "ELEVENLABS_SHADOW_TONGUE_VOICE_ID not set. Pick or onboard a low-stability voice and export the env var.",
    );
  }
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: STING_SETTINGS,
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  const fullKey = `${S3_PREFIX}/${key}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: fullKey,
      Body: buffer,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  SHADOW TONGUE STINGS VO GENERATOR");
  console.log(`  ${LINES.length} lines authored`);
  console.log(`  ${Object.keys(manifest).length} already in manifest`);
  console.log(`  Voice: ${VOICE_ID || "(not configured)"}`);
  console.log(`  Bucket: ${BUCKET}/${S3_PREFIX}`);
  console.log("═══════════════════════════════════════\n");

  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_SECRET_ACCESS_KEY not set.");
    process.exit(1);
  }

  const errors: { id: string; error: string }[] = [];
  let generated = 0;
  let skipped = 0;
  let completed = 0;

  for (const line of LINES) {
    completed++;
    if (manifest[line.id]) {
      skipped++;
      continue;
    }
    const s3Key = `${line.kind}/${line.id}.mp3`;
    try {
      process.stdout.write(`[${completed}/${LINES.length}] ${line.id} (${line.kind})...`);
      const audio = await generateSpeech(line.text);
      const url = await uploadToS3(audio, s3Key);
      manifest[line.id] = url;
      generated++;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB`);
      await new Promise(r => setTimeout(r, 150));
      if (generated % 10 === 0) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
      }
    } catch (err: any) {
      console.log(` ✗ ${err.message}`);
      errors.push({ id: line.id, error: err.message });
      if (err.message.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise(r => setTimeout(r, 30000));
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
  if (errors.length > 0) {
    const errPath = path.join(__dirname, "shadow-tongue-stings-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2));
    console.log(`Error log: ${errPath}`);
  }
}

main().catch(console.error);
