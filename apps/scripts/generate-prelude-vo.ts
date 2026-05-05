#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   PRELUDE VO GENERATOR — ElevenLabs TTS + S3 Upload

   Reads the 9 Prelude voice CSV blocks from
     docs/production/prelude-asset-build/prompts/voice/
   and generates each line via ElevenLabs, uploads to S3,
   and writes the URL into the matching speaker's
   apps/shared/{speaker}VoManifest.json.

   Run locally (needs network access):
     npx tsx scripts/generate-prelude-vo.ts

   Requires env vars:
     ELEVENLABS_API_KEY=sk_...
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...
     AWS_REGION=us-east-2       (default: us-east-2)
     S3_BUCKET=dgrsvoices       (default: dgrsvoices)

   All voice IDs are hard-coded below from the existing per-speaker
   generators (generate_elara_vo.py etc.) plus the new Prince voice
   id provided for Beat E.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { assetUrl } from "../client/src/lib/assetUrl";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── CONFIG ─── */

import { optionalCredential } from "./credentialUtils";
const ELEVENLABS_KEY = optionalCredential("ELEVENLABS_API_KEY");
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Prelude Voices";

/**
 * S3 upload is optional. When AWS creds aren't present, the generator
 * writes local .mp3 files and records a /audio/... URL in the manifest
 * so the game can play the file in dev. Replace with a CDN URL when
 * someone with S3 access re-runs with creds set.
 */
const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

/** ElevenLabs voice IDs, keyed by the CSV's third column (voice_profile). */
const VOICE_IDS: Record<string, string> = {
  elara: "xMyNDrPFEtQN8iZtT7l2",           // existing — from generate_elara_vo.py
  the_human: "oGbGJdgofRR8z0MxwI8L",       // existing — from generate_human_vo.py
  the_prince: "FLW8imgp50K85LICuLQs",      // NEW — "the Engineer" voice
  locke: "8XiBWqS5ffaH5naIFHPI",           // existing — from generate_locke_vo.py
  the_antiquarian: "yAKlvHIsuj4SvnKQ6Mk4", // existing — from generate_antiquarian_vo.py
};

/** Directory → manifest filename mapping per speaker. */
const MANIFEST_BY_SPEAKER: Record<string, string> = {
  elara: "apps/shared/elaraVoManifest.json",
  the_human: "apps/shared/humanVoManifest.json",
  the_prince: "apps/shared/princeVoManifest.json",
  locke: "apps/shared/lockeVoManifest.json",
  the_antiquarian: "apps/shared/antiquarianVoManifest.json",
};

/** S3 folder name per speaker (matches existing key conventions). */
const S3_FOLDER_BY_SPEAKER: Record<string, string> = {
  elara: "elara",
  the_human: "human",
  the_prince: "prince",
  locke: "locke",
  the_antiquarian: "antiquarian",
};

/* ─── CSV PARSING ─── */

const CSV_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "docs",
  "production",
  "prelude-asset-build",
  "prompts",
  "voice",
);

interface PreludeVoLine {
  lineId: string;
  speakerName: string;       // "Elara", "The Human", "Adjudicator Locke", etc.
  voiceProfile: string;      // "elara", "the_human", etc.
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  text: string;              // may contain <break time="..."/> tags
  directorNotes: string;
  priority: string;
  sourceFile: string;
}

/**
 * Parse one CSV line with quoted-field support. The Prelude voice CSVs
 * use the following 10-column schema:
 *   line_id, speaker_name, voice_profile, stability, similarity_boost,
 *   style, use_speaker_boost, text, director_notes, priority
 */
function parseCsvRow(row: string): string[] | null {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  let i = 0;
  while (i < row.length) {
    const ch = row[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < row.length && row[i + 1] === '"') {
          // Escaped quote ""
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      fields.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  fields.push(cur);
  if (fields.length === 0 || fields.every((f) => f.trim() === "")) return null;
  return fields;
}

function loadAllLines(): PreludeVoLine[] {
  const lines: PreludeVoLine[] = [];
  const files = fs
    .readdirSync(CSV_DIR)
    .filter((f) => f.startsWith("section_") && f.endsWith(".csv"))
    .sort();

  for (const file of files) {
    const content = fs.readFileSync(path.join(CSV_DIR, file), "utf-8").trim();
    if (!content) continue;
    for (const row of content.split(/\r?\n/)) {
      if (!row.trim()) continue;
      const fields = parseCsvRow(row);
      if (!fields || fields.length < 10) {
        console.warn(`[${file}] skipping malformed row (${fields?.length ?? 0} fields)`);
        continue;
      }
      const [
        lineId,
        speakerName,
        voiceProfile,
        stability,
        similarityBoost,
        style,
        useSpeakerBoost,
        text,
        directorNotes,
        priority,
      ] = fields;
      lines.push({
        lineId: lineId.trim(),
        speakerName: speakerName.trim(),
        voiceProfile: voiceProfile.trim(),
        stability: Number(stability),
        similarityBoost: Number(similarityBoost),
        style: Number(style),
        useSpeakerBoost: useSpeakerBoost.trim().toLowerCase() === "true",
        text: text.trim(),
        directorNotes: directorNotes.trim(),
        priority: priority.trim(),
        sourceFile: file,
      });
    }
  }
  return lines;
}

/* ─── ELEVENLABS TTS ─── */

async function generateSpeech(line: PreludeVoLine): Promise<Buffer> {
  const voiceId = VOICE_IDS[line.voiceProfile];
  if (!voiceId) {
    throw new Error(`No voice id configured for profile "${line.voiceProfile}"`);
  }

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
        text: line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: line.stability,
          similarity_boost: line.similarityBoost,
          style: line.style,
          use_speaker_boost: line.useSpeakerBoost,
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

/* ─── S3 UPLOAD ─── */

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

  // URL-encode path segments but preserve the slashes
  const encodedKey = fullKey
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodedKey}`;
}

/* ─── LOCAL MP3 COPY ─── */

function writeLocalFile(buffer: Buffer, speaker: string, lineId: string): string {
  const folder = S3_FOLDER_BY_SPEAKER[speaker] || speaker;
  const dir = path.resolve(__dirname, "..", "client", "public", "audio", folder);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${lineId}.mp3`);
  fs.writeFileSync(filePath, buffer);
  return path.relative(path.resolve(__dirname, "..", ".."), filePath);
}

/* ─── MANIFEST UPDATE ─── */

function loadManifest(speaker: string): Record<string, string> {
  const rel = MANIFEST_BY_SPEAKER[speaker];
  if (!rel) return {};
  const full = path.resolve(__dirname, "..", "..", rel);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

function saveManifest(speaker: string, manifest: Record<string, string>) {
  const rel = MANIFEST_BY_SPEAKER[speaker];
  if (!rel) return;
  const full = path.resolve(__dirname, "..", "..", rel);
  // Keep keys sorted for stable diffs
  const sorted: Record<string, string> = {};
  for (const key of Object.keys(manifest).sort()) sorted[key] = manifest[key];
  fs.writeFileSync(full, JSON.stringify(sorted, null, 2) + "\n");
}

/* ─── MAIN ─── */

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  PRELUDE VO GENERATOR");

  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }

  const lines = loadAllLines();
  console.log(`  ${lines.length} lines loaded from ${CSV_DIR}`);
  console.log(
    `  S3 upload: ${HAS_AWS_CREDS ? `enabled → ${BUCKET}/${S3_PREFIX}/` : "disabled (local-only)"}`,
  );
  console.log("═══════════════════════════════════════\n");

  // Group by speaker for manifest batching
  const manifestsBySpeaker: Record<string, Record<string, string>> = {};
  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];
  let completed = 0;

  for (const line of lines) {
    const manifest = manifestsBySpeaker[line.voiceProfile]
      ?? (manifestsBySpeaker[line.voiceProfile] = loadManifest(line.voiceProfile));

    if (manifest[line.lineId]) {
      skipped.push(line.lineId);
      continue;
    }

    const s3Folder = S3_FOLDER_BY_SPEAKER[line.voiceProfile] || line.voiceProfile;
    const s3Key = `${s3Folder}/${line.lineId}.mp3`;

    try {
      process.stdout.write(
        `[${++completed}/${lines.length}] ${line.voiceProfile}:${line.lineId}...`,
      );

      const audio = await generateSpeech(line);
      const localPath = writeLocalFile(audio, line.voiceProfile, line.lineId);
      const url = HAS_AWS_CREDS
        ? await uploadToS3(audio, s3Key)
        : assetUrl(`audio/${s3Folder}/${line.lineId}.mp3`);

      manifest[line.lineId] = url;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB → ${localPath}`);

      // Periodic save after each successful generation so partial progress
      // survives a Ctrl+C or later rate-limit failure.
      saveManifest(line.voiceProfile, manifest);

      // Rate limit
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` ✗ ${msg}`);
      errors.push({ id: line.lineId, error: msg });
      if (msg.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  // Final saves — only if at least one line was successfully generated for
  // that speaker. Avoids rewriting manifests when every line errored
  // (e.g. an auth/allowlist failure that aborted before any upload).
  const addedBySpeaker = new Set<string>();
  for (const [speaker, manifest] of Object.entries(manifestsBySpeaker)) {
    const baseline = loadManifest(speaker);
    const hasNew = Object.keys(manifest).some((k) => !(k in baseline));
    if (hasNew) {
      saveManifest(speaker, manifest);
      addedBySpeaker.add(speaker);
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${completed - errors.length}`);
  console.log(`Skipped (already in manifest): ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);
  if (skipped.length > 0) {
    console.log(`  skipped: ${skipped.join(", ")}`);
  }
  if (errors.length > 0) {
    console.log(`  errors:`);
    for (const e of errors) console.log(`    - ${e.id}: ${e.error}`);
  }

  console.log("\nManifests updated:");
  if (addedBySpeaker.size === 0) {
    console.log("  (none — no new lines were generated)");
  } else {
    for (const speaker of Array.from(addedBySpeaker).sort()) {
      console.log(`  ${MANIFEST_BY_SPEAKER[speaker]}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
