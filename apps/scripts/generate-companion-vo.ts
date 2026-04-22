#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   COMPANION VO GENERATOR — ElevenLabs TTS + (optional) S3

   Generates the Elara + Human companion-substrate lines from the three
   TS registries introduced in #127:
     - apps/shared/elaraLines.ts        ELARA_LINES        (210 lines)
     - apps/shared/humanLines.ts        HUMAN_LINES        ( 49 lines)
     - apps/shared/lockedDoorLines.ts   LOCKED_DOOR_LINES  ( 24 lines)

   Total unique lineIds: 283 (228 Elara + 55 Human). No per-line voice
   settings in the CompanionLine schema, so per-speaker defaults are
   applied here — match the Act 1 / Prelude generators' ranges.

   For each line (keyed by `voId ?? lineId`):
     1. POST ElevenLabs TTS with the speaker's default voice settings.
        Text is sent as-is — these lines have no SSML breaks.
     2. Write the mp3 to apps/client/public/audio/<speaker>/<id>.mp3.
     3. If AWS creds present → PutObject to
        s3://$S3_BUCKET/Prelude Voices/<speaker>/<id>.mp3 and write
        that URL into <speaker>VoManifest.json.
        If AWS creds absent → write the dev-relative
        /audio/<speaker>/<id>.mp3 path into the manifest instead. The
        separate `pnpm vo:s3-backfill` upgrades those to CDN URLs
        later.

   Idempotent — skips any line id already a key in the speaker's
   manifest.

   Run locally (from repo root):
     export ELEVENLABS_API_KEY=sk_...
     export AWS_ACCESS_KEY_ID=AKIA...           # optional
     export AWS_SECRET_ACCESS_KEY=...           # optional
     export AWS_REGION=us-east-2                # default: us-east-2
     export S3_BUCKET=dgrsvoices                # default: dgrsvoices
     npx tsx apps/scripts/generate-companion-vo.ts

   Options:
     --only elara | --only human   Limit to one speaker.
     --limit N                     Cap at N lines (smoke tests).
     --dry-run                     Print plan + counts, no API calls.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ELARA_LINES } from "../shared/elaraLines";
import { HUMAN_LINES } from "../shared/humanLines";
import { LOCKED_DOOR_LINES } from "../shared/lockedDoorLines";
import type { CompanionLine, CompanionSpeaker } from "../shared/companion";

import { assetUrl } from "../client/src/lib/assetUrl";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── CONFIG ─── */

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Prelude Voices";

const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

/** ElevenLabs voice IDs by speaker. Same ids the prelude/act1 generators use. */
const VOICE_ID: Record<CompanionSpeaker, string> = {
  elara: "xMyNDrPFEtQN8iZtT7l2",
  human: "oGbGJdgofRR8z0MxwI8L",
};

/**
 * Per-speaker default voice settings. CompanionLine carries no per-line
 * knobs, so we pick the middle of the existing tuned ranges and let
 * band-specific emotional register come through the text itself
 * (fragmented/lucid/luminous Elara, shadow/balanced/warm Human).
 */
const VOICE_SETTINGS: Record<CompanionSpeaker, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}> = {
  elara: {
    stability: 0.50,
    similarity_boost: 0.85,
    style: 0.30,
    use_speaker_boost: true,
  },
  human: {
    stability: 0.55,
    similarity_boost: 0.85,
    style: 0.30,
    use_speaker_boost: true,
  },
};

/** Speaker → per-speaker on-disk audio dir + manifest file. */
const TARGETS: Record<CompanionSpeaker, {
  audioDir: string;
  manifestPath: string;
}> = {
  elara: {
    audioDir: "apps/client/public/audio/elara",
    manifestPath: "apps/shared/elaraVoManifest.json",
  },
  human: {
    audioDir: "apps/client/public/audio/human",
    manifestPath: "apps/shared/humanVoManifest.json",
  },
};

const REPO_ROOT = path.resolve(__dirname, "..", "..");

/* ─── LINE COLLECTION ─── */

interface GenLine {
  voId: string;         // what's written to disk + manifest key
  speaker: CompanionSpeaker;
  text: string;
  source: string;       // which registry it came from (for logs)
}

function collectAllLines(): GenLine[] {
  const rows: GenLine[] = [];
  const seen = new Set<string>();
  const push = (line: CompanionLine, source: string) => {
    const voId = line.voId ?? line.lineId;
    if (seen.has(voId)) {
      console.warn(`[dupe] ${voId} appears in multiple registries — keeping first`);
      return;
    }
    seen.add(voId);
    rows.push({
      voId,
      speaker: line.speaker,
      text: line.text,
      source,
    });
  };
  for (const line of ELARA_LINES) push(line, "elaraLines.ts");
  for (const line of HUMAN_LINES) push(line, "humanLines.ts");
  for (const line of LOCKED_DOOR_LINES) push(line, "lockedDoorLines.ts");
  return rows;
}

/* ─── ARGS ─── */

function parseArgs(): {
  dryRun: boolean;
  only: Set<CompanionSpeaker>;
  limit: number | null;
} {
  const argv = process.argv.slice(2);
  let dryRun = false;
  const only = new Set<CompanionSpeaker>();
  let limit: number | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--only" && i + 1 < argv.length) {
      const v = argv[++i];
      if (v === "elara" || v === "human") only.add(v);
      else {
        console.error(`Unknown --only value: ${v}`);
        process.exit(1);
      }
    } else if (argv[i] === "--limit" && i + 1 < argv.length) {
      limit = Number(argv[++i]);
    }
  }
  return { dryRun, only, limit };
}

/* ─── ELEVENLABS TTS ─── */

async function generateSpeech(line: GenLine): Promise<Buffer> {
  const voiceId = VOICE_ID[line.speaker];
  const settings = VOICE_SETTINGS[line.speaker];
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
        voice_settings: settings,
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
  const encoded = fullKey.split("/").map(encodeURIComponent).join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encoded}`;
}

/* ─── LOCAL FILE + MANIFEST I/O ─── */

function writeLocalFile(
  buffer: Buffer,
  speaker: CompanionSpeaker,
  voId: string,
): string {
  const dir = path.resolve(REPO_ROOT, TARGETS[speaker].audioDir);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${voId}.mp3`);
  fs.writeFileSync(filePath, buffer);
  return path.relative(REPO_ROOT, filePath);
}

function loadManifest(speaker: CompanionSpeaker): Record<string, string> {
  const full = path.resolve(REPO_ROOT, TARGETS[speaker].manifestPath);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

function saveManifest(
  speaker: CompanionSpeaker,
  manifest: Record<string, string>,
) {
  const full = path.resolve(REPO_ROOT, TARGETS[speaker].manifestPath);
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.writeFileSync(full, JSON.stringify(sorted, null, 2) + "\n");
}

/* ─── MAIN ─── */

async function main() {
  const { dryRun, only, limit } = parseArgs();

  if (!dryRun && !ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }

  let lines = collectAllLines();
  const totalAuthored = lines.length;
  if (only.size > 0) lines = lines.filter((l) => only.has(l.speaker));
  if (limit !== null && Number.isFinite(limit)) lines = lines.slice(0, limit);

  console.log("═══════════════════════════════════════");
  console.log("  COMPANION VO GENERATOR");
  console.log(`  S3 upload: ${HAS_AWS_CREDS ? `enabled → ${BUCKET}/${S3_PREFIX}/` : "disabled (local-only)"}`);
  console.log(`  Authored:  ${totalAuthored} (${ELARA_LINES.length + LOCKED_DOOR_LINES.filter(l => l.speaker === "elara").length} elara, ${HUMAN_LINES.length + LOCKED_DOOR_LINES.filter(l => l.speaker === "human").length} human)`);
  console.log(`  After filters: ${lines.length}`);
  if (only.size) console.log(`  --only: ${Array.from(only).join(", ")}`);
  if (limit !== null) console.log(`  --limit: ${limit}`);
  if (dryRun) console.log(`  --dry-run (no API calls, no file writes)`);
  console.log("═══════════════════════════════════════\n");

  const manifests: Record<CompanionSpeaker, Record<string, string>> = {
    elara: loadManifest("elara"),
    human: loadManifest("human"),
  };

  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];
  let generated = 0;

  for (const line of lines) {
    const manifest = manifests[line.speaker];
    if (manifest[line.voId]) {
      skipped.push(line.voId);
      continue;
    }

    const s3Key = `${line.speaker}/${line.voId}.mp3`;
    const labelPrefix = `[${generated + errors.length + 1}/${lines.length}] ${line.speaker}:${line.voId}`;

    if (dryRun) {
      console.log(`  [plan] ${labelPrefix}  (${line.text.length} chars) ← ${line.source}`);
      generated++;
      continue;
    }

    try {
      process.stdout.write(`${labelPrefix}...`);
      const audio = await generateSpeech(line);
      const localPath = writeLocalFile(audio, line.speaker, line.voId);
      const url = HAS_AWS_CREDS
        ? await uploadToS3(audio, s3Key)
        : assetUrl(`audio/${line.speaker}/${line.voId}.mp3`);
      manifest[line.voId] = url;
      saveManifest(line.speaker, manifest);
      generated++;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB → ${localPath}`);
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` ✗ ${msg}`);
      errors.push({ id: `${line.speaker}:${line.voId}`, error: msg });
      if (msg.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`${dryRun ? "Would generate" : "Generated"}:       ${generated}`);
  console.log(`Skipped (already in manifest): ${skipped.length}`);
  console.log(`Errors:                         ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) console.log(`  - ${e.id}: ${e.error}`);
  }
  if (!HAS_AWS_CREDS && generated > 0 && !dryRun) {
    console.log(
      `\nNOTE: AWS creds not set — manifest URLs point at /audio/... (local only).` +
        `\n      Run \`pnpm vo:s3-backfill\` with AWS creds to upload and rewrite.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
