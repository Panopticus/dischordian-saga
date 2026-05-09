#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   LOREDEX VO GENERATOR — ElevenLabs TTS + S3 Upload

   NPC depth #9. Generates short voiced bio memos for each
   Loredex character entry. Spoken by a single "Loredex
   Narrator" voice (archive/historian register), played by
   the Loredex Encounter Card UI when an entry surfaces in
   a sector that matches its affiliation/era.

   Run locally (needs network access + budget):
     npx tsx apps/scripts/generate-loredex-vo.ts

   Requires env vars:
     ELEVENLABS_API_KEY=sk_...
     ELEVENLABS_LOREDEX_NARRATOR_VOICE_ID=<archive narrator voice>
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...
     AWS_REGION=us-east-2
     S3_BUCKET=dgrsvoices

   Idempotency: existing manifest entries are skipped on re-run,
   so this generator is safe to invoke as part of `vo:run-all`.
   To force a regeneration of an entry, delete its key from
   apps/shared/loredexVoManifest.json before running.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CONFIG ───
// The Loredex Narrator is canonically the Antiquarian (Daniel Cross,
// the Bibliographic curator of the Antiquarian's Refuge). He is the
// in-fiction narrator of the saga's archival material — every Loredex
// entry can be read as his voice reading from his own catalog. The
// voice id is the canonical Antiquarian voice from
// apps/scripts/generate-content-pass-vo.ts:134; ELEVENLABS_LOREDEX_NARRATOR_VOICE_ID
// can override it if a different narrator is ever wanted.
const ANTIQUARIAN_VOICE_ID = "8GibmYIeMaUJxz5IqEY7";
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const VOICE_ID =
  process.env.ELEVENLABS_LOREDEX_NARRATOR_VOICE_ID || ANTIQUARIAN_VOICE_ID;
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Loredex Narrator";

// Single-register voice settings — the Loredex Narrator is a
// historian-archivist tone; deliberately consistent across entries
// to avoid distraction. Per-line variation comes from the prose,
// not the voice.
const NARRATOR_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.78,
  style: 0.20,
  use_speaker_boost: true,
};

interface LoredexLine {
  /** Stable id — must match the entryId of the loredex-data.json entry. */
  id: string;
  /** The voiced bio memo text (~30-100 words; ~5-15s of audio). */
  text: string;
  /** Loredex entry type — character, faction, location, artifact, event. */
  entryType: "character" | "faction" | "location" | "artifact" | "concept" | "event" | "song" | "dream";
  /** Optional: the in-fiction speaker if not the default narrator. Some
   *  characters with their own voice profile in VOICE_OVER_BIBLE.md may
   *  be voiced by themselves rather than the narrator. */
  speakerOverride?: string;
}

// ─── LOAD LINES ───
const LINES_FILE = path.join(__dirname, "loredex-narrator-lines.json");
let LOREDEX_LINES: LoredexLine[] = [];
if (fs.existsSync(LINES_FILE)) {
  LOREDEX_LINES = JSON.parse(fs.readFileSync(LINES_FILE, "utf-8"));
  console.log(`Loaded ${LOREDEX_LINES.length} Loredex lines from ${LINES_FILE}`);
} else {
  console.error(`ERROR: ${LINES_FILE} not found.`);
  process.exit(1);
}

// ─── LOAD MANIFEST (for idempotency) ───
const MANIFEST_PATH = path.join(__dirname, "..", "shared", "loredexVoManifest.json");
let manifest: Record<string, string> = {};
if (fs.existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  console.log(`Loaded existing manifest with ${Object.keys(manifest).length} entries.`);
}

// ─── ELEVENLABS TTS ───
async function generateSpeech(text: string): Promise<Buffer> {
  if (!VOICE_ID) {
    // Defaults to the canonical Antiquarian voice; only fires if
    // ELEVENLABS_LOREDEX_NARRATOR_VOICE_ID was deliberately set to "".
    throw new Error(
      "Loredex narrator voice id is empty. Either unset " +
      "ELEVENLABS_LOREDEX_NARRATOR_VOICE_ID (so the default Antiquarian " +
      "voice applies) or set it to a real ElevenLabs voice id.",
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
        voice_settings: NARRATOR_SETTINGS,
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
  console.log("  LOREDEX VO GENERATOR");
  console.log(`  ${LOREDEX_LINES.length} lines authored`);
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

  for (const line of LOREDEX_LINES) {
    completed++;
    if (manifest[line.id]) {
      skipped++;
      continue;
    }
    const s3Key = `${line.entryType}/${line.id}.mp3`;
    try {
      process.stdout.write(
        `[${completed}/${LOREDEX_LINES.length}] ${line.id} (${line.entryType})...`,
      );
      const audio = await generateSpeech(line.text);
      const url = await uploadToS3(audio, s3Key);
      manifest[line.id] = url;
      generated++;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB`);
      // Rate limit: ElevenLabs allows ~10 req/s on paid plans.
      await new Promise(r => setTimeout(r, 150));
      // Periodically flush manifest so a crash mid-run doesn't lose work.
      if (generated % 25 === 0) {
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

  // Final manifest write.
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (already in manifest): ${skipped}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);

  if (errors.length > 0) {
    const errPath = path.join(__dirname, "loredex-vo-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2));
    console.log(`Error log: ${errPath}`);
  }
}

main().catch(console.error);
