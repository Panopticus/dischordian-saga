#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ACT 1 OPPONENT VO GENERATOR — ElevenLabs TTS + (optional) S3

   Generates the 144 opponent-dialog voice lines for Act 1 from the
   CSV batches under docs/production/vo-batches/:
     - act1-opponent-dialog__antiquarian.csv  (72 lines — Antiquarian voice)
     - act1-opponent-dialog__elara.csv        (36 lines — Elara voice)
     - act1-opponent-dialog__human.csv        (36 lines — The Human voice)

   For each line:
     1. POST to ElevenLabs text-to-speech with the CSV's per-line
        voice settings. Text may contain <break time="Nms"/> tags.
     2. Write the mp3 to apps/client/public/audio/<speaker>/<id>.mp3.
     3. If AWS creds are present, upload to
        s3://$S3_BUCKET/Act 1 Voices/<speaker>/<id>.mp3 and record the
        resulting URL in the speaker's VoManifest.json.
     4. If AWS creds are NOT present, record a local-relative URL
        (apps/client/public/audio/<speaker>/<id>.mp3) in the manifest
        so the game can play the file during development, and leave a
        follow-up for someone with S3 access to swap the URL later.

   Idempotent — skips any line whose id is already a key in the
   speaker's manifest.

   Run locally (from repo root):
     export ELEVENLABS_API_KEY=sk_...
     export AWS_ACCESS_KEY_ID=AKIA...         # optional
     export AWS_SECRET_ACCESS_KEY=...         # optional
     export AWS_REGION=us-east-2              # default: us-east-2
     export S3_BUCKET=dgrsvoices              # default: dgrsvoices
     npx tsx apps/scripts/generate-act1-opponent-vo.ts

   Limit to a subset while testing:
     npx tsx apps/scripts/generate-act1-opponent-vo.ts --only antiquarian
     npx tsx apps/scripts/generate-act1-opponent-vo.ts --limit 3
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { assetUrl } from "../client/src/lib/assetUrl";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── CONFIG ─── */

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Act 1 Voices";

const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

/** ElevenLabs voice IDs keyed by CSV's voice_profile column. */
const VOICE_IDS: Record<string, string> = {
  elara: "xMyNDrPFEtQN8iZtT7l2",
  human: "oGbGJdgofRR8z0MxwI8L",
  antiquarian: "yAKlvHIsuj4SvnKQ6Mk4",
};

/** Per-speaker output directory (matches existing /audio/<dir>/ convention). */
const AUDIO_DIR_BY_PROFILE: Record<string, string> = {
  elara: "elara",
  human: "human",
  antiquarian: "antiquarian",
};

/** Per-speaker manifest path relative to repo root. */
const MANIFEST_BY_PROFILE: Record<string, string> = {
  elara: "apps/shared/elaraVoManifest.json",
  human: "apps/shared/humanVoManifest.json",
  antiquarian: "apps/shared/antiquarianVoManifest.json",
};

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CSV_DIR = path.resolve(REPO_ROOT, "docs/production/vo-batches");
const CSV_FILES = [
  "act1-opponent-dialog__antiquarian.csv",
  "act1-opponent-dialog__elara.csv",
  "act1-opponent-dialog__human.csv",
] as const;

/* ─── CSV PARSING ─── */

interface Act1VoLine {
  lineId: string;
  speakerName: string;
  voiceProfile: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  text: string;
  directorNotes: string;
  priority: string;
  sourceFile: string;
}

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

function loadAllLines(): Act1VoLine[] {
  const lines: Act1VoLine[] = [];
  for (const file of CSV_FILES) {
    const filePath = path.join(CSV_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[skip] missing CSV: ${filePath}`);
      continue;
    }
    const content = fs.readFileSync(filePath, "utf-8").trim();
    const rows = content.split(/\r?\n/);
    // First row is the header — skip it.
    for (let idx = 1; idx < rows.length; idx++) {
      const row = rows[idx];
      if (!row.trim()) continue;
      const fields = parseCsvRow(row);
      if (!fields || fields.length < 10) {
        console.warn(`[${file}:${idx + 1}] skipping malformed row (${fields?.length ?? 0} fields)`);
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

async function generateSpeech(line: Act1VoLine): Promise<Buffer> {
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

/* ─── S3 UPLOAD (optional) ─── */

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
  const encodedKey = fullKey
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodedKey}`;
}

/* ─── LOCAL FILE WRITE ─── */

function writeLocalFile(
  buffer: Buffer,
  profile: string,
  lineId: string,
): string {
  const folder = AUDIO_DIR_BY_PROFILE[profile] || profile;
  const dir = path.resolve(
    REPO_ROOT,
    "apps",
    "client",
    "public",
    "audio",
    folder,
  );
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${lineId}.mp3`);
  fs.writeFileSync(filePath, buffer);
  return path.relative(REPO_ROOT, filePath);
}

/* ─── MANIFEST UPDATE ─── */

function loadManifest(profile: string): Record<string, string> {
  const rel = MANIFEST_BY_PROFILE[profile];
  if (!rel) return {};
  const full = path.resolve(REPO_ROOT, rel);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

function saveManifest(profile: string, manifest: Record<string, string>) {
  const rel = MANIFEST_BY_PROFILE[profile];
  if (!rel) return;
  const full = path.resolve(REPO_ROOT, rel);
  const sorted: Record<string, string> = {};
  for (const key of Object.keys(manifest).sort()) sorted[key] = manifest[key];
  fs.writeFileSync(full, JSON.stringify(sorted, null, 2) + "\n");
}

async function headExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/* ─── CLI ARGS ─── */

function parseArgs(): { only: string | null; limit: number | null } {
  const args = process.argv.slice(2);
  let only: string | null = null;
  let limit: number | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--only" && i + 1 < args.length) {
      only = args[++i];
    } else if (args[i] === "--limit" && i + 1 < args.length) {
      limit = Number(args[++i]);
    }
  }
  return { only, limit };
}

/* ─── MAIN ─── */

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  ACT 1 OPPONENT VO GENERATOR");
  console.log(`  S3 upload: ${HAS_AWS_CREDS ? `enabled → ${BUCKET}/${S3_PREFIX}/` : "disabled (local-only)"}`);

  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }

  const { only, limit } = parseArgs();
  let lines = loadAllLines();
  if (only) lines = lines.filter((l) => l.voiceProfile === only);
  if (limit !== null && Number.isFinite(limit)) lines = lines.slice(0, limit);

  console.log(`  Loaded ${lines.length} lines from ${CSV_FILES.length} CSVs`);
  if (only) console.log(`  Filter: --only ${only}`);
  if (limit !== null) console.log(`  Filter: --limit ${limit}`);
  console.log("═══════════════════════════════════════\n");

  const manifestsByProfile: Record<string, Record<string, string>> = {};
  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];
  let generated = 0;

  for (const line of lines) {
    const manifest =
      manifestsByProfile[line.voiceProfile] ??
      (manifestsByProfile[line.voiceProfile] = loadManifest(line.voiceProfile));

    const s3Folder = AUDIO_DIR_BY_PROFILE[line.voiceProfile] || line.voiceProfile;
    const s3Key = `${s3Folder}/${line.lineId}.mp3`;
    const existing = manifest[line.lineId];
    const checkUrl = typeof existing === "string" && existing.startsWith("http")
      ? existing
      : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${S3_PREFIX.split(" ").join("+")}/${s3Folder}/${line.lineId}.mp3`;
    if (await headExists(checkUrl)) {
      skipped.push(line.lineId);
      continue;
    }

    try {
      process.stdout.write(
        `[${generated + errors.length + 1}/${lines.length}] ${line.voiceProfile}:${line.lineId}...`,
      );
      const audio = await generateSpeech(line);
      const localPath = writeLocalFile(audio, line.voiceProfile, line.lineId);

      let url: string;
      if (HAS_AWS_CREDS) {
        url = await uploadToS3(audio, s3Key);
      } else {
        // Local dev URL — works for `pnpm dev` but must be replaced by
        // a real CDN URL before shipping. The manifest entry's value
        // still resolves in the game's audio loader for local play.
        url = assetUrl(`audio/${s3Folder}/${line.lineId}.mp3`);
      }

      manifest[line.lineId] = url;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB → ${localPath}`);

      // Persist partial progress so Ctrl+C or a rate-limit blow-up doesn't
      // lose completed work.
      saveManifest(line.voiceProfile, manifest);
      generated++;

      // Gentle pacing to stay under ElevenLabs rate limits.
      await new Promise((r) => setTimeout(r, 200));
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

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (already in manifest): ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log(`  errors:`);
    for (const e of errors) console.log(`    - ${e.id}: ${e.error}`);
  }
  if (!HAS_AWS_CREDS && generated > 0) {
    console.log(
      `\nNOTE: AWS creds not set — manifest URLs point at /audio/... (local only).` +
        `\n      Re-run with AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY set to upload to S3` +
        `\n      and replace local URLs with permanent CDN URLs.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
