/**
 * Prestige dialog VO generator.
 *
 * Reads `apps/scripts/prestige-lines.json`, calls ElevenLabs per-line
 * with NPC-specific voice ids + emotion presets, uploads to
 * s3://dgrsvoices/<S3 prefix>/prestige/<flagId>.mp3, and writes the
 * resolved URL map to `apps/shared/prestigeVoManifest.json`.
 *
 * Mirrors the Python generators (apps/scripts/generate_locke_vo.py et
 * al.) — idempotent, resume-safe, skips lines already in the manifest.
 *
 * Usage:
 *   export ELEVENLABS_API_KEY=sk_...
 *   export AWS_ACCESS_KEY_ID=AKIA... AWS_SECRET_ACCESS_KEY=...
 *   pnpm tsx apps/scripts/generate-prestige-vo.ts            # full run
 *   pnpm tsx apps/scripts/generate-prestige-vo.ts --dry-run  # diff only
 */

import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LINES_PATH = resolve(__dirname, "prestige-lines.json");
const MANIFEST_PATH = resolve(
  __dirname,
  "../shared/prestigeVoManifest.json",
);

const BUCKET = "dgrsvoices";
const REGION = "us-east-2";

/* ═══════════════════════════════════════════════════════
   PER-NPC S3 PREFIXES + EMOTION PRESETS
   Voice IDs live alongside the lines.json metadata block.
   ═══════════════════════════════════════════════════════ */

const S3_PREFIX_BY_NPC: Record<string, string> = {
  elara: "Elara Voices",
  the_human: "Human Voices",
  adjudicator_locke: "Locke Voices",
  shadow_tongue: "ShadowTongue Voices",
  the_source: "Source Voices",
  the_antiquarian: "Antiquarian Voices",
  the_meme: "Meme Voices",
  the_necromancer: "Necromancer Voices",
  the_degen: "Degen Voices",
};

interface EmotionPreset {
  stability: number;
  similarity_boost: number;
  style: number;
}

/** Per-NPC emotion → ElevenLabs voice_settings preset. */
const EMOTIONS_BY_NPC: Record<string, Record<string, EmotionPreset>> = {
  elara: {
    warm: { stability: 0.55, similarity_boost: 0.75, style: 0.40 },
    warm_confused: { stability: 0.45, similarity_boost: 0.72, style: 0.55 },
    warm_resigned: { stability: 0.60, similarity_boost: 0.75, style: 0.45 },
    warm_recognition: { stability: 0.55, similarity_boost: 0.78, style: 0.50 },
    warm_knowing: { stability: 0.58, similarity_boost: 0.76, style: 0.48 },
  },
  adjudicator_locke: {
    appraising: { stability: 0.50, similarity_boost: 0.70, style: 0.55 },
    sardonic: { stability: 0.45, similarity_boost: 0.68, style: 0.65 },
  },
  the_source: {
    fractured_clear: { stability: 0.30, similarity_boost: 0.65, style: 0.70 },
  },
  the_necromancer: {
    sepulchral: { stability: 0.40, similarity_boost: 0.70, style: 0.60 },
    commanding: { stability: 0.55, similarity_boost: 0.72, style: 0.50 },
  },
  the_meme: {
    broadcast: { stability: 0.35, similarity_boost: 0.68, style: 0.70 },
  },
};

/* ═══════════════════════════════════════════════════════
   LINES.JSON + MANIFEST I/O
   ═══════════════════════════════════════════════════════ */

interface LineEntry {
  npcId: string;
  text: string;
  emotion: string;
}

interface LinesFile {
  _meta?: { voiceCasting: Record<string, string>; description?: string };
  [flagId: string]: LineEntry | LinesFile["_meta"];
}

interface ManifestEntry {
  flagId: string;
  npcId: string;
  url: string;
  generatedAt: string;
}

function loadLines(): {
  voiceCasting: Record<string, string>;
  lines: Record<string, LineEntry>;
} {
  const raw = JSON.parse(readFileSync(LINES_PATH, "utf-8")) as LinesFile;
  const meta = raw._meta as {
    voiceCasting: Record<string, string>;
    description?: string;
  };
  const lines: Record<string, LineEntry> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k === "_meta") continue;
    lines[k] = v as LineEntry;
  }
  return { voiceCasting: meta.voiceCasting, lines };
}

function loadManifest(): { generatedAt: string; entries: ManifestEntry[] } {
  try {
    const raw = readFileSync(MANIFEST_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { generatedAt: new Date().toISOString(), entries: [] };
  }
}

function s3UrlFor(npcId: string, flagId: string): string {
  const prefix = S3_PREFIX_BY_NPC[npcId];
  if (!prefix) throw new Error(`no S3 prefix for npcId=${npcId}`);
  const encodedPrefix = encodeURIComponent(prefix).replace(/%20/g, "+");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodedPrefix}/prestige/${flagId}.mp3`;
}

function stripStageDirections(text: string): string {
  return text.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
}

/* ═══════════════════════════════════════════════════════
   ELEVENLABS + S3 (live; requires credentials)
   ═══════════════════════════════════════════════════════ */

async function ttsAndUpload(opts: {
  flagId: string;
  npcId: string;
  voiceId: string;
  text: string;
  emotion: string;
  s3: S3Client;
}): Promise<string> {
  const { flagId, npcId, voiceId, text, emotion, s3 } = opts;
  const preset =
    (EMOTIONS_BY_NPC[npcId] ?? {})[emotion] ??
    { stability: 0.50, similarity_boost: 0.70, style: 0.45 };
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not set");
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: stripStageDirections(text),
        model_id: "eleven_multilingual_v2",
        voice_settings: preset,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const mp3 = Buffer.from(await res.arrayBuffer());
  const prefix = S3_PREFIX_BY_NPC[npcId];
  if (!prefix) throw new Error(`no S3 prefix for npcId=${npcId}`);
  const key = `${prefix}/prestige/${flagId}.mp3`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: mp3,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return s3UrlFor(npcId, flagId);
}

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const { voiceCasting, lines } = loadLines();
  const manifest = loadManifest();
  const existing = new Set(manifest.entries.map((e) => e.flagId));

  const missing: { flagId: string; entry: LineEntry }[] = [];
  for (const [flagId, entry] of Object.entries(lines)) {
    if (existing.has(flagId)) continue;
    missing.push({ flagId, entry });
  }

  console.log(
    `Total lines: ${Object.keys(lines).length}; already in manifest: ${existing.size}; missing: ${missing.length}`,
  );

  if (missing.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  for (const { flagId, entry } of missing) {
    const voiceId = voiceCasting[entry.npcId];
    if (!voiceId) {
      console.warn(`SKIP ${flagId}: no voice id for npcId=${entry.npcId}`);
      continue;
    }
    if (dryRun) {
      console.log(
        `[dry] would generate ${flagId} (npc=${entry.npcId}, emotion=${entry.emotion}) → ${s3UrlFor(entry.npcId, flagId)}`,
      );
      continue;
    }
    const s3 = new S3Client({ region: REGION });
    try {
      const url = await ttsAndUpload({
        flagId,
        npcId: entry.npcId,
        voiceId,
        text: entry.text,
        emotion: entry.emotion,
        s3,
      });
      manifest.entries.push({
        flagId,
        npcId: entry.npcId,
        url,
        generatedAt: new Date().toISOString(),
      });
      writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
      console.log(`OK   ${flagId} → ${url}`);
    } catch (err) {
      console.warn(`FAIL ${flagId}: ${(err as Error).message}`);
    }
  }
  // Last-resort manifest write (covers dry-run path keeping the file
  // in sync if it didn't exist).
  if (dryRun) {
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  }
  console.log("Done.");
}

void main();
