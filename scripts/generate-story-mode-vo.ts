#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   STORY MODE VO GENERATOR — ElevenLabs TTS + S3 Upload

   Run locally (needs network access):
     npx tsx scripts/generate-story-mode-vo.ts

   Requires env vars:
     ELEVENLABS_API_KEY=sk_...
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...
     AWS_REGION=us-east-2
     S3_BUCKET=dgrsvoices
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ─── ESM __dirname shim ───
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CONFIG ───
// Trim whitespace defensively. Copy-paste of credentials from a browser or
// text editor commonly introduces trailing \n or \r, which Node's HTTP layer
// rejects with ERR_INVALID_CHAR when the AWS SDK builds the Authorization
// header. This .trim() is the cheapest guard against that failure mode.
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").trim();
const AWS_KEY_ID = (process.env.AWS_ACCESS_KEY_ID || "").trim();
const AWS_SECRET = (process.env.AWS_SECRET_ACCESS_KEY || "").trim();
const BUCKET = (process.env.S3_BUCKET || "dgrsvoices").trim();
const REGION = (process.env.AWS_REGION || "us-east-2").trim();
const S3_PREFIX = "Story Mode Voices";

// Warn loudly if a credential is suspiciously sized. These are the canonical
// widths for standard AWS IAM user keys; if the user's values are shorter or
// longer, it's almost always a copy-paste error with extra whitespace or a
// truncated paste.
function warnIfOddSize(label: string, value: string, expected: number): void {
  if (value && value.length !== expected) {
    console.warn(
      `  WARN: ${label} is ${value.length} chars, expected ${expected}. ` +
      `Likely copy-paste error (extra whitespace or truncation).`,
    );
  }
}

// ─── EMOTION → ELEVENLABS VOICE SETTINGS ───
const EMOTION_SETTINGS: Record<string, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix?: string;
}> = {
  warm:       { stability: 0.45, similarity_boost: 0.78, style: 0.35, use_speaker_boost: true, text_prefix: "*speaking warmly* " },
  urgent:     { stability: 0.25, similarity_boost: 0.72, style: 0.65, use_speaker_boost: true, text_prefix: "*with urgency* " },
  analytical: { stability: 0.55, similarity_boost: 0.80, style: 0.20, use_speaker_boost: true, text_prefix: "*matter-of-fact* " },
  fearful:    { stability: 0.20, similarity_boost: 0.70, style: 0.70, use_speaker_boost: true, text_prefix: "*trembling, afraid* " },
  sad:        { stability: 0.30, similarity_boost: 0.75, style: 0.55, use_speaker_boost: true, text_prefix: "*with sadness* " },
  hopeful:    { stability: 0.40, similarity_boost: 0.78, style: 0.50, use_speaker_boost: true, text_prefix: "*with rising hope* " },
  serious:    { stability: 0.50, similarity_boost: 0.80, style: 0.25, use_speaker_boost: true, text_prefix: "*seriously, with gravity* " },
  whispered:  { stability: 0.35, similarity_boost: 0.72, style: 0.40, use_speaker_boost: false, text_prefix: "*whispering* " },
  commanding: { stability: 0.45, similarity_boost: 0.78, style: 0.55, use_speaker_boost: true, text_prefix: "*with authority* " },
  excited:    { stability: 0.30, similarity_boost: 0.75, style: 0.60, use_speaker_boost: true, text_prefix: "*with excitement* " },
};

// ─── LINE INTERFACE ───
interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  emotion: string;
  chapter: string;
}

// ─── LOAD LINES (supports single file or split parts) ───
function loadLines(): VoLine[] {
  const singleFile = path.join(__dirname, "story-mode-lines.json");
  if (fs.existsSync(singleFile)) {
    return JSON.parse(fs.readFileSync(singleFile, "utf-8"));
  }
  // Merge split parts
  const parts: VoLine[] = [];
  for (let i = 1; ; i++) {
    const partFile = path.join(__dirname, `story-mode-lines-part${i}.json`);
    if (!fs.existsSync(partFile)) break;
    parts.push(...JSON.parse(fs.readFileSync(partFile, "utf-8")));
  }
  if (parts.length === 0) {
    console.error("ERROR: No story-mode-lines*.json files found.");
    process.exit(1);
  }
  return parts;
}
const ALL_LINES = loadLines();
console.log(`Loaded ${ALL_LINES.length} story mode lines`);

// ─── ELEVENLABS TTS ───
async function generateSpeech(text: string, voiceId: string, emotion: string): Promise<Buffer> {
  const settings = EMOTION_SETTINGS[emotion] || EMOTION_SETTINGS.serious;
  const fullText = (settings.text_prefix || "") + text;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: fullText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: settings.use_speaker_boost,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ─── S3 CLIENT (instantiated once, reused per upload) ───
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET,
  },
});

async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
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

// ─── PREFLIGHT: verify AWS creds + PutObject access BEFORE any TTS call ───
// We test PutObject specifically (not HeadBucket) because HeadBucket requires
// s3:ListBucket permission, which a properly least-privileged IAM policy
// scoped only to uploads will NOT have. PutObject is the exact permission the
// real workload needs, so this is the correct preflight.
async function preflightS3(): Promise<void> {
  const heartbeatKey = `${S3_PREFIX}/.preflight-heartbeat.txt`;
  const heartbeatBody = Buffer.from(
    `story-mode-vo-generator preflight ${new Date().toISOString()}\n`,
  );
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: heartbeatKey,
        Body: heartbeatBody,
        ContentType: "text/plain",
      }),
    );
  } catch (err: any) {
    console.error(`\nERROR: S3 preflight failed for bucket "${BUCKET}" in region "${REGION}".`);
    console.error(`  name:         ${err.name || "(none)"}`);
    console.error(`  message:      ${err.message || "(none)"}`);
    console.error(`  Code:         ${err.Code || err.code || "(none)"}`);
    console.error(`  $metadata:    ${JSON.stringify(err.$metadata || {}, null, 2)}`);
    if (err.$response?.statusCode) {
      console.error(`  HTTP status:  ${err.$response.statusCode}`);
    }
    if (err.$response?.headers?.["x-amz-bucket-region"]) {
      console.error(`  Actual bucket region (from AWS): ${err.$response.headers["x-amz-bucket-region"]}`);
      console.error(`  ^ Your AWS_REGION env var says "${REGION}". Set AWS_REGION to the value above and retry.`);
    }
    console.error(`\nCommon fixes:`);
    console.error(`  • Wrong region?           Set AWS_REGION to the bucket's actual region.`);
    console.error(`  • Wrong credentials?      Double-check AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.`);
    console.error(`  • Bucket does not exist?  Verify the bucket "${BUCKET}" in the AWS S3 console.`);
    console.error(`  • IAM permission denied?  Ensure the user has s3:PutObject on "arn:aws:s3:::${BUCKET}/*".`);
    console.error(`\nAborting BEFORE any ElevenLabs TTS calls are made (protects your credit balance).`);
    process.exit(1);
  }
}

// ─── MAIN ───
async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  STORY MODE VO GENERATOR");
  console.log(`  ${ALL_LINES.length} lines to generate`);
  console.log(`  Bucket: ${BUCKET}/${S3_PREFIX}`);
  console.log("═══════════════════════════════════════\n");

  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }
  if (!AWS_KEY_ID || !AWS_SECRET) {
    console.error("ERROR: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY not set.");
    process.exit(1);
  }

  // Sanity-check credential sizes so copy-paste whitespace gets caught loudly.
  warnIfOddSize("AWS_ACCESS_KEY_ID", AWS_KEY_ID, 20);
  warnIfOddSize("AWS_SECRET_ACCESS_KEY", AWS_SECRET, 40);

  // Preflight: verify S3 bucket is reachable & writable BEFORE spending any TTS credit.
  console.log("Preflight: verifying S3 bucket access...");
  await preflightS3();
  console.log(`Preflight OK: s3://${BUCKET} reachable in ${REGION}.\n`);

  // Filter: skip lines already in manifest
  const manifestPath = path.join(__dirname, "..", "shared", "storyModeVoManifest.json");
  let existing: Record<string, string> = {};
  if (fs.existsSync(manifestPath)) {
    existing = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  }

  const toGenerate = ALL_LINES.filter((l) => !existing[l.id]);
  console.log(`Skipping ${ALL_LINES.length - toGenerate.length} already generated.`);
  console.log(`Generating ${toGenerate.length} new lines.\n`);

  const manifest: Record<string, string> = { ...existing };
  const errors: { id: string; error: string }[] = [];
  let completed = 0;

  for (const line of toGenerate) {
    const s3Key = `${line.chapter}/${line.speaker}/${line.id}.mp3`;

    try {
      process.stdout.write(
        `[${++completed}/${toGenerate.length}] ${line.speaker}:${line.id} (${line.emotion})...`,
      );

      const audio = await generateSpeech(line.text, line.voiceId, line.emotion);
      const url = await uploadToS3(audio, s3Key);

      manifest[line.id] = url;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB`);

      // Rate limit: ~10 req/s on paid plans
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: any) {
      console.log(` ✗ ${err.message}`);
      errors.push({ id: line.id, error: err.message });

      if (err.message.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }

    // Save manifest periodically (every 25 lines)
    if (completed % 25 === 0) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  }

  // Save final manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${Object.keys(manifest).length}/${ALL_LINES.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Manifest: ${manifestPath}`);

  if (errors.length > 0) {
    const errPath = path.join(__dirname, "story-mode-vo-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2));
    console.log(`Error log: ${errPath}`);
  }

  // Print summary by speaker
  const bySpeaker: Record<string, number> = {};
  for (const l of ALL_LINES) {
    bySpeaker[l.speaker] = (bySpeaker[l.speaker] || 0) + 1;
  }
  console.log("\n─── SPEAKER BREAKDOWN ───");
  for (const [speaker, count] of Object.entries(bySpeaker).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${speaker}: ${count} lines`);
  }
}

main().catch(console.error);
