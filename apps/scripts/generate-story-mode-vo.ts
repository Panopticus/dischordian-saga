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
import { fileURLToPath } from "node:url";

// ESM polyfill for CommonJS-style __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CONFIG ───
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Story Mode Voices";

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
  // Direction is conveyed via voice_settings (stability/style/etc.); the
  // ElevenLabs Multilingual v2 model does not interpret asterisk-bracketed
  // prose as direction — it speaks it literally — so the prefix is ignored.
  const fullText = text;

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

// ─── S3 UPLOAD ───
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
