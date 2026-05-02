#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ENGINEER'S LOGS VO GENERATOR

   Reads apps/scripts/engineer-lines.json (42 transcript
   entries authored from the canonical ENGINEER_LOGS catalog)
   and renders each via ElevenLabs → uploads to S3 →
   updates apps/shared/engineerVoManifest.json.

   The Engineer's Logs are long-form prose with [SPOKEN] /
   [FREESTYLE] tagged sections. ElevenLabs renders them as
   straight prose (the tags survive in the audio as literal
   words IF the model decides to speak them — most won't).
   For the FREESTYLE sections this generator preserves the
   tags in the request text so the producer can audit
   placement; the producer team handles beat-syncing the
   freestyle delivery downstream.

   Run locally (needs network egress to ElevenLabs + S3):
     pnpm vo:engineer-logs
   or
     pnpm tsx apps/scripts/generate-engineer-logs-vo.ts

   Required env:
     ELEVENLABS_API_KEY=sk_...
     ELEVENLABS_VOICE_ID_ENGINEER=...   (engineer voice)
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...

   Optional:
     AWS_REGION=us-east-2          (default)
     S3_BUCKET=dgrsvoices          (default)
     SKIP_EXISTING=1               skip ids already in the manifest
                                   (default: regenerate everything;
                                    set when you want to incrementally
                                    add only new logs without re-
                                    rendering the existing ones)

   Output:
     - 42 mp3s uploaded to s3://dgrsvoices/Engineer Voices/logs/
     - apps/shared/engineerVoManifest.json (id → public URL)
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Strip paste-junk from credential env vars. fetch() rejects header
 *  values with non-Latin-1 bytes; this catches U+2028/U+2029 and CR/LF
 *  smuggled in via doc copy-paste. Same helper as generate-awakening-vo
 *  + the sibling per-character generators. */
function sanitizeCredential(name: string, raw: string | undefined): string {
  if (!raw) return "";
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").trim();
  if (cleaned !== raw) {
    console.warn(
      `[sanitize] ${name} contained ${raw.length - cleaned.length} hidden ` +
        `character(s) (control bytes or U+2028/U+2029); stripped before use.`,
    );
  }
  return cleaned;
}

const ELEVENLABS_KEY = sanitizeCredential(
  "ELEVENLABS_API_KEY",
  process.env.ELEVENLABS_API_KEY,
);
const VOICE_ID = sanitizeCredential(
  "ELEVENLABS_VOICE_ID_ENGINEER",
  process.env.ELEVENLABS_VOICE_ID_ENGINEER,
);
const AWS_ACCESS_KEY_ID = sanitizeCredential(
  "AWS_ACCESS_KEY_ID",
  process.env.AWS_ACCESS_KEY_ID,
);
const AWS_SECRET_ACCESS_KEY = sanitizeCredential(
  "AWS_SECRET_ACCESS_KEY",
  process.env.AWS_SECRET_ACCESS_KEY,
);
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Engineer Voices/logs";
const SKIP_EXISTING = process.env.SKIP_EXISTING === "1";

if (!ELEVENLABS_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY is required.");
  process.exit(1);
}
if (!VOICE_ID) {
  console.error(
    "ERROR: ELEVENLABS_VOICE_ID_ENGINEER is required (set the Engineer's voice id).",
  );
  process.exit(1);
}
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required.");
  process.exit(1);
}

// ─── Voice settings — Engineer's lab-journal register ───
// Slightly higher style than Elara (delivery has personality) but
// stable enough that the long-form prose doesn't drift across the
// 60-100s of a single log. Producer can tune these per-log later
// via the FREESTYLE tag handling — this is the spoken-register
// baseline.
const VOICE_SETTINGS = {
  stability: 0.45,
  similarity_boost: 0.78,
  style: 0.40,
  use_speaker_boost: true,
};

interface ScriptEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
  meta?: {
    logNumber?: number;
    title?: string;
  };
}

// ─── Read transcripts ───
const SCRIPT_PATH = path.resolve(__dirname, "engineer-lines.json");
if (!fs.existsSync(SCRIPT_PATH)) {
  console.error(
    `ERROR: ${SCRIPT_PATH} not found. Run \`node apps/scripts/_generate-engineer-lines.mjs\` first.`,
  );
  process.exit(1);
}
const ENTRIES = JSON.parse(fs.readFileSync(SCRIPT_PATH, "utf-8")) as ScriptEntry[];

// ─── Read existing manifest (idempotent / SKIP_EXISTING support) ───
const MANIFEST_PATH = path.resolve(
  __dirname,
  "..",
  "shared",
  "engineerVoManifest.json",
);
const existingManifest: Record<string, string> = fs.existsSync(MANIFEST_PATH)
  ? (JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Record<string, string>)
  : {};

// ─── ElevenLabs TTS ───
async function generateSpeech(text: string): Promise<Buffer> {
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
        voice_settings: VOICE_SETTINGS,
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// ─── S3 upload ───
async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey).replace(/%2F/g, "/")}`;
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════");
  console.log("  ENGINEER'S LOGS VO GENERATOR");
  console.log(`  ${ENTRIES.length} log transcripts`);
  console.log(`  Voice: ${VOICE_ID}`);
  console.log(`  Bucket: s3://${BUCKET}/${S3_PREFIX}`);
  console.log(`  SKIP_EXISTING: ${SKIP_EXISTING}`);
  console.log("═══════════════════════════════════════\n");

  const manifest: Record<string, string> = { ...existingManifest };
  const errors: { id: string; error: string }[] = [];
  let rendered = 0;
  let skipped = 0;

  for (let i = 0; i < ENTRIES.length; i++) {
    const entry = ENTRIES[i];
    const tag = `[${i + 1}/${ENTRIES.length}]`;
    if (SKIP_EXISTING && existingManifest[entry.id]) {
      process.stdout.write(`${tag} ${entry.id}  →  already in manifest, skipping\n`);
      skipped++;
      continue;
    }
    process.stdout.write(`${tag} ${entry.id}…`);
    try {
      const audio = await generateSpeech(entry.text);
      const url = await uploadToS3(audio, `${entry.id}.mp3`);
      manifest[entry.id] = url;
      rendered++;
      process.stdout.write(` ok (${(audio.byteLength / 1024).toFixed(0)} KB)\n`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      errors.push({ id: entry.id, error: message });
      process.stdout.write(` FAIL: ${message}\n`);
    }
  }

  // Write manifest atomically — sort by id for stable diffs.
  const sorted: Record<string, string> = {};
  for (const id of Object.keys(manifest).sort()) sorted[id] = manifest[id];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf-8");

  console.log(`\n─── Summary ───`);
  console.log(`  Rendered: ${rendered}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Failed:   ${errors.length}`);
  console.log(`  Manifest: ${MANIFEST_PATH} (${Object.keys(sorted).length} total entries)`);

  if (errors.length > 0) {
    console.error(`\nErrors:`);
    for (const e of errors) console.error(`  [${e.id}] ${e.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
