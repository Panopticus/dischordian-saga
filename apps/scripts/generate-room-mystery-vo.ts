#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ROOM-MYSTERY VO GENERATOR — ElevenLabs TTS + (optional) S3

   Walks ROOM_MYSTERY_REGISTRY (apps/shared/roomMysteries/index.ts)
   plus the legacy cryo bay table and emits one ElevenLabs recording
   per (voId, speaker) pair. Banded narrations expand to three
   recordings — one per band — with voIds suffixed by `.${band}`,
   matching what the runtime synthesizes via resolveBandedVoId.

   Source-of-truth shape:
     - VerbResponse.voId + VerbResponse.narration (Elara, banded by
       fragmented/lucid/luminous when narration is an object)
     - VerbResponse.humanReaction.voId + .narration (Detective,
       banded by shadow/balanced/warm when narration is an object)
     - Recurses into VerbResponse.tiers[].

   Outputs:
     - apps/client/public/audio/<speaker>/<voId>.mp3
     - elaraVoManifest.json key for elara.* ids
     - humanVoManifest.json key for detective.* ids (the Detective
       shares the human manifest by namespace prefix)
     - S3 PutObject if AWS creds are set; otherwise dev /audio/ paths
       go in the manifest and `pnpm vo:s3-backfill` upgrades later

   Idempotent — skips any voId already in its target manifest.

   Run from repo root:
     export ELEVENLABS_API_KEY=sk_...
     export AWS_ACCESS_KEY_ID=AKIA...    # optional
     export AWS_SECRET_ACCESS_KEY=...    # optional
     npx tsx apps/scripts/generate-room-mystery-vo.ts

   Options:
     --only elara | --only detective   Limit to one speaker.
     --limit N                         Cap at N lines (smoke tests).
     --dry-run                         Print plan + counts, no API.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ROOM_MYSTERY_REGISTRY } from "../shared/roomMysteries";
import type { VerbResponse, Verb } from "../shared/roomMysteries";
import { CRYO_MYSTERY_RESPONSES } from "../shared/cryoBayMystery";
import { assetUrl } from "../client/src/lib/assetUrl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── CONFIG ─── */

import { optionalCredential } from "./credentialUtils";
const ELEVENLABS_KEY = optionalCredential("ELEVENLABS_API_KEY");
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Room Mystery Voices";

const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

/** The Detective shares the human ElevenLabs voice but emits to the
 *  human manifest under a `detective.` namespace prefix. Treat him
 *  here as a separate "speaker" for routing/logging purposes; the
 *  actual API call uses the human voice settings. */
type Speaker = "elara" | "detective";

/** ElevenLabs voice ids — match the existing companion generator. */
const VOICE_ID: Record<Speaker, string> = {
  elara: "xMyNDrPFEtQN8iZtT7l2",
  detective: "oGbGJdgofRR8z0MxwI8L", // same voice as the Human
};

const VOICE_SETTINGS: Record<Speaker, {
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
  detective: {
    stability: 0.55,
    similarity_boost: 0.85,
    style: 0.30,
    use_speaker_boost: true,
  },
};

/** Speaker → on-disk audio dir + manifest file. Detective files
 *  land in apps/client/public/audio/human (same dir as opponents
 *  since the runtime resolves them through useHumanVO) and the
 *  detective.* keys go in humanVoManifest.json. */
const TARGETS: Record<Speaker, {
  audioDir: string;
  manifestPath: string;
}> = {
  elara: {
    audioDir: "apps/client/public/audio/elara",
    manifestPath: "apps/shared/elaraVoManifest.json",
  },
  detective: {
    audioDir: "apps/client/public/audio/human",
    manifestPath: "apps/shared/humanVoManifest.json",
  },
};

const REPO_ROOT = path.resolve(__dirname, "..", "..");

/* ─── LINE COLLECTION ─── */

interface GenLine {
  voId: string;
  speaker: Speaker;
  text: string;
  source: string; // "<roomId>:<hotspotId>:<verb>:t<n>:<band>" etc.
}

const ELARA_BANDS = ["fragmented", "lucid", "luminous"] as const;
const HUMAN_BANDS = ["shadow", "balanced", "warm"] as const;
type ElaraBand = (typeof ELARA_BANDS)[number];
type HumanBand = (typeof HUMAN_BANDS)[number];

function isBandedElara(
  n: VerbResponse["narration"],
): n is { fragmented: string; lucid: string; luminous: string } {
  return typeof n !== "string";
}

function emitElara(
  rows: GenLine[],
  seen: Set<string>,
  baseVoId: string | undefined,
  narration: VerbResponse["narration"],
  source: string,
) {
  if (!baseVoId) return;
  if (typeof narration === "string") {
    if (seen.has(baseVoId)) return;
    seen.add(baseVoId);
    rows.push({
      voId: baseVoId,
      speaker: "elara",
      text: narration,
      source,
    });
    return;
  }
  for (const band of ELARA_BANDS) {
    const id = `${baseVoId}.${band}`;
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      voId: id,
      speaker: "elara",
      text: narration[band],
      source: `${source}.${band}`,
    });
  }
}

function emitDetective(
  rows: GenLine[],
  seen: Set<string>,
  reaction: VerbResponse["humanReaction"],
  source: string,
) {
  if (!reaction || !reaction.voId) return;
  const baseVoId = reaction.voId;
  const narration = reaction.narration;
  if (typeof narration === "string") {
    if (seen.has(baseVoId)) return;
    seen.add(baseVoId);
    rows.push({
      voId: baseVoId,
      speaker: "detective",
      text: narration,
      source,
    });
    return;
  }
  for (const band of HUMAN_BANDS) {
    const id = `${baseVoId}.${band}`;
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      voId: id,
      speaker: "detective",
      text: narration[band],
      source: `${source}.${band}`,
    });
  }
}

function visitVerbResponse(
  rows: GenLine[],
  seen: Set<string>,
  resp: VerbResponse,
  source: string,
) {
  emitElara(rows, seen, resp.voId, resp.narration, source);
  emitDetective(rows, seen, resp.humanReaction, `${source}:human`);
  if (resp.tiers) {
    resp.tiers.forEach((tier, i) =>
      visitVerbResponse(rows, seen, tier, `${source}:t${i + 2}`),
    );
  }
}

function collectAllLines(): GenLine[] {
  const rows: GenLine[] = [];
  const seen = new Set<string>();

  // Cryo bay (legacy table — generic registry adapter wraps this).
  for (const [hotspotId, byVerb] of Object.entries(CRYO_MYSTERY_RESPONSES)) {
    for (const verb of Object.keys(byVerb) as Verb[]) {
      const resp = byVerb[verb];
      if (!resp) continue;
      visitVerbResponse(
        rows,
        seen,
        resp as unknown as VerbResponse,
        `cryo-bay:${hotspotId}:${verb}`,
      );
    }
  }

  // Every registered room module.
  for (const [roomId, mod] of Object.entries(ROOM_MYSTERY_REGISTRY)) {
    if (roomId === "cryo-bay") continue; // already handled above
    for (const [hotspotId, byVerb] of Object.entries(mod.responses)) {
      for (const verb of Object.keys(byVerb ?? {}) as Verb[]) {
        const resp = (byVerb as Partial<Record<Verb, VerbResponse>>)[verb];
        if (!resp) continue;
        visitVerbResponse(rows, seen, resp, `${roomId}:${hotspotId}:${verb}`);
      }
    }
  }

  return rows;
}

/* ─── ARGS ─── */

function parseArgs(): {
  dryRun: boolean;
  only: Set<Speaker>;
  limit: number | null;
} {
  const argv = process.argv.slice(2);
  let dryRun = false;
  const only = new Set<Speaker>();
  let limit: number | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--only" && i + 1 < argv.length) {
      const v = argv[++i];
      if (v === "elara" || v === "detective") only.add(v);
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
  speaker: Speaker,
  voId: string,
): string {
  const dir = path.resolve(REPO_ROOT, TARGETS[speaker].audioDir);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${voId}.mp3`);
  fs.writeFileSync(filePath, buffer);
  return path.relative(REPO_ROOT, filePath);
}

function loadManifest(speaker: Speaker): Record<string, string> {
  const full = path.resolve(REPO_ROOT, TARGETS[speaker].manifestPath);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

function saveManifest(
  speaker: Speaker,
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
  const totalChars = lines.reduce((s, l) => s + l.text.length, 0);
  if (only.size > 0) lines = lines.filter((l) => only.has(l.speaker));
  if (limit !== null && Number.isFinite(limit)) lines = lines.slice(0, limit);

  const elaraCount = lines.filter((l) => l.speaker === "elara").length;
  const detectiveCount = lines.filter((l) => l.speaker === "detective").length;

  console.log("═══════════════════════════════════════");
  console.log("  ROOM-MYSTERY VO GENERATOR");
  console.log(`  S3 upload: ${HAS_AWS_CREDS ? `enabled → ${BUCKET}/${S3_PREFIX}/` : "disabled (local-only)"}`);
  console.log(`  Authored: ${totalAuthored} (${elaraCount} elara, ${detectiveCount} detective)`);
  console.log(`  Total characters across all lines: ${totalChars.toLocaleString()}`);
  console.log(`  After filters: ${lines.length}`);
  if (only.size) console.log(`  --only: ${Array.from(only).join(", ")}`);
  if (limit !== null) console.log(`  --limit: ${limit}`);
  if (dryRun) console.log(`  --dry-run (no API calls, no file writes)`);
  console.log("═══════════════════════════════════════\n");

  const manifests: Record<Speaker, Record<string, string>> = {
    elara: loadManifest("elara"),
    detective: loadManifest("detective"),
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
  console.log(`${dryRun ? "Would generate" : "Generated"}: ${generated}`);
  console.log(`Skipped (already in manifest): ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) console.log(`  - ${e.id}: ${e.error}`);
  }
  if (!HAS_AWS_CREDS && generated > 0 && !dryRun) {
    console.log(
      "\nNOTE: AWS credentials not set; manifest entries point at dev",
    );
    console.log(
      "/audio/ paths. Run `pnpm vo:s3-backfill` later to upgrade them.",
    );
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
