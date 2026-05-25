#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   HOTSPOT-TIER VO GENERATOR — Elara, hotspot-ladder lines

   Renders one ElevenLabs MP3 per entry in
   ELARA_HOTSPOT_RESPONSES (apps/shared/elaraHotspotResponses.ts)
   and uploads to S3 (optional). Each entry's *key* IS the
   voId — getElaraHotspotResponse auto-fills voId from the key,
   so a successfully-rendered batch picks up at runtime with no
   client code change.

   Idempotent — entries already present in elaraVoManifest.json
   are skipped.

   Run from repo root:
     export ELEVENLABS_API_KEY=sk_...
     export AWS_ACCESS_KEY_ID=AKIA...    # optional but recommended
     export AWS_SECRET_ACCESS_KEY=...    # optional but recommended
     npx tsx apps/scripts/generate-hotspot-tier-vo.ts

   Options:
     --dry-run        Print plan + counts, no API.
     --limit N        Cap at N lines (smoke tests).
     --list           Print every voId/text pair, no API.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ELARA_HOTSPOT_RESPONSES,
  type ElaraHotspotResponse,
} from "../shared/elaraHotspotResponses";
import { assetUrl } from "../client/src/lib/assetUrl";
import { optionalCredential } from "./credentialUtils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/* ─── CONFIG ─── */

const ELEVENLABS_KEY = optionalCredential("ELEVENLABS_API_KEY");
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Elara Voices/hotspot-tiers";
const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

// Elara's ElevenLabs voice. Matches the rest of the Elara pipeline
// (generate_elara_vo.py, generate-room-mystery-vo.ts).
const ELARA_VOICE_ID = "xMyNDrPFEtQN8iZtT7l2";

// Voice-settings tuned per emotion tag on the response. The tier-
// ladder system's stutter and wry beats want slightly different
// stability vs style balance than the room-mystery banded narration.
type Emotion = NonNullable<ElaraHotspotResponse["emotion"]>;
const VOICE_SETTINGS: Record<Emotion, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}> = {
  neutral:    { stability: 0.50, similarity_boost: 0.85, style: 0.30, use_speaker_boost: true },
  speaking:   { stability: 0.50, similarity_boost: 0.85, style: 0.30, use_speaker_boost: true },
  concerned:  { stability: 0.45, similarity_boost: 0.85, style: 0.40, use_speaker_boost: true },
  wry:        { stability: 0.40, similarity_boost: 0.82, style: 0.55, use_speaker_boost: true },
  warm:       { stability: 0.50, similarity_boost: 0.85, style: 0.40, use_speaker_boost: true },
  // Stutter beats want LOW stability so ElevenLabs preserves the
  // self-interrupting cadence. The em-dashes in the source text are
  // what cue the stumble; stability that's too high smooths them out.
  stuttering: { stability: 0.20, similarity_boost: 0.80, style: 0.70, use_speaker_boost: true },
};
const DEFAULT_EMOTION: Emotion = "neutral";

const MANIFEST_PATH = path.resolve(REPO_ROOT, "apps/shared/elaraVoManifest.json");
const LOCAL_AUDIO_DIR = path.resolve(REPO_ROOT, "apps/client/public/audio/elara/hotspot-tiers");

/* ─── ARGS ─── */

interface Args {
  dryRun: boolean;
  list: boolean;
  limit: number | null;
}
function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let dryRun = false;
  let list = false;
  let limit: number | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--list") list = true;
    else if (argv[i] === "--limit" && i + 1 < argv.length) {
      limit = Number(argv[++i]);
    }
  }
  return { dryRun, list, limit };
}

/* ─── ELEVENLABS ─── */

async function generateSpeech(text: string, emotion: Emotion): Promise<Buffer> {
  const settings = VOICE_SETTINGS[emotion];
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELARA_VOICE_ID}`,
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
        voice_settings: settings,
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/* ─── S3 + LOCAL I/O ─── */

async function uploadToS3(buffer: Buffer, voId: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  const fullKey = `${S3_PREFIX}/${voId}.mp3`;
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

function writeLocalFile(buffer: Buffer, voId: string): string {
  fs.mkdirSync(LOCAL_AUDIO_DIR, { recursive: true });
  const filePath = path.join(LOCAL_AUDIO_DIR, `${voId}.mp3`);
  fs.writeFileSync(filePath, buffer);
  return path.relative(REPO_ROOT, filePath);
}

function loadManifest(): Record<string, string> {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
}

function saveManifest(manifest: Record<string, string>) {
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n");
}

/* ─── MAIN ─── */

interface Plan {
  voId: string;
  text: string;
  emotion: Emotion;
}

function buildPlan(): Plan[] {
  const out: Plan[] = [];
  for (const [voId, response] of Object.entries(ELARA_HOTSPOT_RESPONSES)) {
    out.push({
      voId,
      text: response.text,
      emotion: response.emotion ?? DEFAULT_EMOTION,
    });
  }
  return out;
}

async function main() {
  const { dryRun, list, limit } = parseArgs();
  let plan = buildPlan();

  if (list) {
    for (const p of plan) console.log(`${p.voId}\t[${p.emotion}]\t${p.text.slice(0, 80)}…`);
    return;
  }

  if (limit !== null && Number.isFinite(limit)) plan = plan.slice(0, limit);

  if (!dryRun && !ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }

  const totalChars = plan.reduce((s, p) => s + p.text.length, 0);

  console.log("═══════════════════════════════════════");
  console.log("  HOTSPOT-TIER VO GENERATOR");
  console.log(`  S3 upload: ${HAS_AWS_CREDS ? `enabled → ${BUCKET}/${S3_PREFIX}/` : "disabled (local-only)"}`);
  console.log(`  Authored:  ${plan.length} entries`);
  console.log(`  Total characters: ${totalChars.toLocaleString()}`);
  if (limit !== null) console.log(`  --limit:   ${limit}`);
  if (dryRun) console.log(`  --dry-run  (no API calls, no file writes)`);
  console.log("═══════════════════════════════════════\n");

  const manifest = loadManifest();
  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];
  let generated = 0;

  for (const p of plan) {
    if (manifest[p.voId]) {
      skipped.push(p.voId);
      continue;
    }
    const label = `[${generated + errors.length + 1}/${plan.length}] ${p.voId} (${p.emotion})`;

    if (dryRun) {
      console.log(`  [plan] ${label}  ${p.text.length} chars`);
      generated++;
      continue;
    }

    try {
      process.stdout.write(`${label}...`);
      const audio = await generateSpeech(p.text, p.emotion);
      const localPath = writeLocalFile(audio, p.voId);
      const url = HAS_AWS_CREDS
        ? await uploadToS3(audio, p.voId)
        : assetUrl(`audio/elara/hotspot-tiers/${p.voId}.mp3`);
      manifest[p.voId] = url;
      saveManifest(manifest);
      generated++;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB → ${localPath}`);
      // Soft rate-limit between calls. ElevenLabs' subscription tiers
      // vary; 150ms between requests stays under the conservative
      // 5/sec cap on the lower tiers.
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` ✗ ${msg}`);
      errors.push({ id: p.voId, error: msg });
      if (msg.includes("429")) {
        console.log("  Rate limited — waiting 30s...");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`${dryRun ? "Would generate" : "Generated"}: ${generated}`);
  console.log(`Skipped (already in manifest): ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);
  for (const e of errors) console.log(`  - ${e.id}: ${e.error}`);
  if (!HAS_AWS_CREDS && generated > 0 && !dryRun) {
    console.log(`\nLocal-only run. To upload existing files to S3:`);
    console.log(`  export AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=…`);
    console.log(`  pnpm vo:s3-backfill   # if available, or re-run this script`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
