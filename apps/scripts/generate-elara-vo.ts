#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ELARA VO GENERATOR — ElevenLabs TTS + S3 Upload
   
   Run locally (needs network access):
     npx tsx scripts/generate-elara-vo.ts
   
   Requires env vars:
     ELEVENLABS_API_KEY=sk_...
     ELEVENLABS_VOICE_ID=xMyNDrPFEtQN8iZtT7l2
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
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Elara Voices";

// ─── EMOTION → ELEVENLABS VOICE SETTINGS ───
// stability: lower = more expressive/emotional, higher = more consistent
// similarity_boost: higher = closer to original voice
// style: 0-1, emotional range
// use_speaker_boost: enhance clarity
const EMOTION_SETTINGS: Record<string, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix?: string; // Stage direction prepended to text
}> = {
  warm: {
    stability: 0.45, similarity_boost: 0.78, style: 0.35, use_speaker_boost: true,
    text_prefix: "*speaking warmly and reassuringly* ",
  },
  urgent: {
    stability: 0.25, similarity_boost: 0.72, style: 0.65, use_speaker_boost: true,
    text_prefix: "*with urgency and alarm* ",
  },
  curious: {
    stability: 0.40, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true,
    text_prefix: "*with genuine curiosity* ",
  },
  fearful: {
    stability: 0.20, similarity_boost: 0.70, style: 0.70, use_speaker_boost: true,
    text_prefix: "*trembling slightly, afraid* ",
  },
  analytical: {
    stability: 0.55, similarity_boost: 0.80, style: 0.20, use_speaker_boost: true,
    text_prefix: "*matter-of-fact, analytical* ",
  },
  sad: {
    stability: 0.30, similarity_boost: 0.75, style: 0.55, use_speaker_boost: true,
    text_prefix: "*with sadness and loss* ",
  },
  hopeful: {
    stability: 0.40, similarity_boost: 0.78, style: 0.50, use_speaker_boost: true,
    text_prefix: "*with rising hope* ",
  },
  betrayed: {
    stability: 0.20, similarity_boost: 0.72, style: 0.75, use_speaker_boost: true,
    text_prefix: "*hurt and betrayed* ",
  },
  reassuring: {
    stability: 0.50, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true,
    text_prefix: "*calm and reassuring* ",
  },
  excited: {
    stability: 0.30, similarity_boost: 0.75, style: 0.60, use_speaker_boost: true,
    text_prefix: "*with excitement and wonder* ",
  },
  serious: {
    stability: 0.50, similarity_boost: 0.80, style: 0.25, use_speaker_boost: true,
    text_prefix: "*seriously, with gravity* ",
  },
  whispered: {
    stability: 0.35, similarity_boost: 0.72, style: 0.40, use_speaker_boost: false,
    text_prefix: "*whispering* ",
  },
  commanding: {
    stability: 0.45, similarity_boost: 0.78, style: 0.55, use_speaker_boost: true,
    text_prefix: "*with authority and command* ",
  },
};

// ─── ELARA LINES (populated by extraction) ───
interface ElaraLine {
  id: string;           // unique key: "feature_unlock_companion_selection"
  text: string;         // the actual dialog text
  context: string;      // where it plays: "feature_unlock", "battle_reaction", etc.
  emotion: string;      // key into EMOTION_SETTINGS
  file: string;         // source file
}

// This will be populated from the extracted lines JSON
let ELARA_LINES: ElaraLine[] = [];

// ─── LOAD LINES ───
const LINES_FILE = path.join(__dirname, "elara-lines.json");
if (fs.existsSync(LINES_FILE)) {
  ELARA_LINES = JSON.parse(fs.readFileSync(LINES_FILE, "utf-8"));
  console.log(`Loaded ${ELARA_LINES.length} Elara lines from ${LINES_FILE}`);
} else {
  console.error(`ERROR: ${LINES_FILE} not found. Run the line extraction first.`);
  console.error("Create scripts/elara-lines.json with the extracted lines array.");
  process.exit(1);
}

// ─── ELEVENLABS TTS ───
async function generateSpeech(text: string, emotion: string): Promise<Buffer> {
  const settings = EMOTION_SETTINGS[emotion] || EMOTION_SETTINGS.warm;
  // Direction is conveyed via voice_settings (stability/style/etc.); the
  // ElevenLabs Multilingual v2 model does not interpret asterisk-bracketed
  // prose as direction — it speaks it literally — so the prefix is ignored.
  const fullText = text;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
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
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ─── S3 UPLOAD ───
async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  // Use AWS SDK v3
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const fullKey = `${S3_PREFIX}/${key}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: fullKey,
    Body: buffer,
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000",
  }));

  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

// ─── MAIN ───
async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  ELARA VO GENERATOR");
  console.log(`  ${ELARA_LINES.length} lines to generate`);
  console.log(`  Voice: ${VOICE_ID}`);
  console.log(`  Bucket: ${BUCKET}/${S3_PREFIX}`);
  console.log("═══════════════════════════════════════\n");

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_SECRET_ACCESS_KEY not set.");
    console.error("Export it: export AWS_SECRET_ACCESS_KEY=your_secret_key");
    process.exit(1);
  }

  const manifest: Record<string, string> = {};
  const errors: { id: string; error: string }[] = [];
  let completed = 0;

  for (const line of ELARA_LINES) {
    const s3Key = `${line.context}/${line.id}.mp3`;
    
    try {
      process.stdout.write(`[${++completed}/${ELARA_LINES.length}] ${line.id} (${line.emotion})...`);
      
      const audio = await generateSpeech(line.text, line.emotion);
      const url = await uploadToS3(audio, s3Key);
      
      manifest[line.id] = url;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB`);
      
      // Rate limit: ElevenLabs allows ~10 req/s on paid plans
      await new Promise(r => setTimeout(r, 150));
    } catch (err: any) {
      console.log(` ✗ ${err.message}`);
      errors.push({ id: line.id, error: err.message });
      
      // Back off on rate limit
      if (err.message.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise(r => setTimeout(r, 30000));
      }
    }
  }

  // Save manifest
  const manifestPath = path.join(__dirname, "..", "shared", "elaraVoManifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${Object.keys(manifest).length}/${ELARA_LINES.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Manifest: ${manifestPath}`);

  if (errors.length > 0) {
    const errPath = path.join(__dirname, "elara-vo-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2));
    console.log(`Error log: ${errPath}`);
  }
}

main().catch(console.error);
