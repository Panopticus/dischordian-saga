#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   NPC FIRST-MEETING VO GENERATOR

   Reads the 8 per-NPC first-meet script JSONs (54
   transcript entries total, authored from each NPC's
   first_meeting.ts dialog tree onscreenText fields) and
   renders them through ElevenLabs → S3 → per-character
   VO manifest.

   Each NPC has its own voice id via a dedicated env var.
   Set the ones you want to render and the script skips
   NPCs that don't have an env var set, so a producer can
   roll out cast-and-render NPC-by-NPC instead of needing
   all 8 voice ids at once.

   Run locally (needs network egress to ElevenLabs + S3):
     pnpm vo:npc-first-meet
   or
     pnpm tsx apps/scripts/generate-npc-first-meet-vo.ts

   Optional flag: --only=<npc_key>  render just that NPC.

   Required env (per-NPC, optional):
     ELEVENLABS_API_KEY
     ELEVENLABS_VOICE_ID_VEX         (vex_solene)
     ELEVENLABS_VOICE_ID_DEGEN       (the_degen)
     ELEVENLABS_VOICE_ID_GAMEMASTER  (the_game_master)
     ELEVENLABS_VOICE_ID_MEME        (the_meme)
     ELEVENLABS_VOICE_ID_ORACLE      (the_oracle)
     ELEVENLABS_VOICE_ID_SEER        (the_seer)
     ELEVENLABS_VOICE_ID_LOCKE       (adjudicator_locke)
     ELEVENLABS_VOICE_ID_WRAITH      (wraith_calder)

     AWS_ACCESS_KEY_ID
     AWS_SECRET_ACCESS_KEY

   Optional:
     AWS_REGION=us-east-2
     S3_BUCKET=dgrsvoices
     SKIP_EXISTING=1   skip ids already in the manifest

   Output (per NPC with a voice id set):
     - mp3s uploaded to s3://dgrsvoices/<NPC> Voices/first-meet/
     - apps/shared/<npc>VoManifest.json (id → public URL)
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const SKIP_EXISTING = process.env.SKIP_EXISTING === "1";

const ONLY_ARG = process.argv.find((a) => a.startsWith("--only="));
const ONLY_NPC = ONLY_ARG ? ONLY_ARG.slice("--only=".length) : null;

if (!ELEVENLABS_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY is required.");
  process.exit(1);
}
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required.");
  process.exit(1);
}

interface NpcVoiceConfig {
  /** Canonical NPC key (matches dialog-tree directory name). */
  npcKey: string;
  /** ENV var name carrying the ElevenLabs voice id for this NPC. */
  envVar: string;
  /** Script-JSON filename under apps/scripts/. */
  linesFile: string;
  /** Per-character VO manifest filename under apps/shared/. */
  manifestFile: string;
  /** S3 key prefix for the rendered MP3s. */
  s3Prefix: string;
  /** ElevenLabs voice settings — register-tuned per character.
   *  Values are seed defaults; producer tunes after first listen. */
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

const NPC_VO_CONFIG: NpcVoiceConfig[] = [
  {
    npcKey: "vex_solene",
    envVar: "ELEVENLABS_VOICE_ID_VEX",
    linesFile: "vex-solene-first-meet-lines.json",
    manifestFile: "vexVoManifest.json",
    s3Prefix: "Vex Voices/first-meet",
    // Aristocratic-riddle register; high stability, restrained style.
    voiceSettings: {
      stability: 0.65,
      similarity_boost: 0.80,
      style: 0.30,
      use_speaker_boost: true,
    },
  },
  {
    npcKey: "the_degen",
    envVar: "ELEVENLABS_VOICE_ID_DEGEN",
    linesFile: "degen-first-meet-lines.json",
    manifestFile: "degenVoManifest.json",
    s3Prefix: "Degen Voices/first-meet",
    // Nihilist-gnomic register; mid stability, mid style — the
    // Degen's casino-arithmetic voice has rhythm but not aggression.
    voiceSettings: {
      stability: 0.50,
      similarity_boost: 0.75,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  {
    npcKey: "the_game_master",
    envVar: "ELEVENLABS_VOICE_ID_GAMEMASTER",
    linesFile: "game-master-first-meet-lines.json",
    manifestFile: "gamemasterVoManifest.json",
    s3Prefix: "GameMaster Voices/first-meet",
    voiceSettings: {
      stability: 0.55,
      similarity_boost: 0.78,
      style: 0.40,
      use_speaker_boost: true,
    },
  },
  {
    npcKey: "the_meme",
    envVar: "ELEVENLABS_VOICE_ID_MEME",
    linesFile: "meme-first-meet-lines.json",
    manifestFile: "memeVoManifest.json",
    s3Prefix: "Meme Voices/first-meet",
    // The Meme is a hijacked broadcast register — slightly higher
    // style and lower stability for the fragmented quality.
    voiceSettings: {
      stability: 0.40,
      similarity_boost: 0.70,
      style: 0.55,
      use_speaker_boost: true,
    },
  },
  {
    npcKey: "the_oracle",
    envVar: "ELEVENLABS_VOICE_ID_ORACLE",
    linesFile: "oracle-first-meet-lines.json",
    manifestFile: "oracleVoManifest.json",
    s3Prefix: "Oracle Voices/first-meet",
    // Oracle is the silent relay node in the recruitment plan
    // (D4) — high stability, low style, never warm.
    voiceSettings: {
      stability: 0.75,
      similarity_boost: 0.65,
      style: 0.20,
      use_speaker_boost: false,
    },
  },
  {
    npcKey: "the_seer",
    envVar: "ELEVENLABS_VOICE_ID_SEER",
    linesFile: "seer-first-meet-lines.json",
    manifestFile: "seerVoManifest.json",
    s3Prefix: "Seer Voices/first-meet",
    voiceSettings: {
      stability: 0.55,
      similarity_boost: 0.78,
      style: 0.35,
      use_speaker_boost: true,
    },
  },
  {
    npcKey: "adjudicator_locke",
    envVar: "ELEVENLABS_VOICE_ID_LOCKE",
    linesFile: "adjudicator-locke-first-meet-lines.json",
    manifestFile: "lockeVoManifest.json",
    s3Prefix: "Locke Voices/first-meet",
    // Authority register — flat affect, high stability.
    voiceSettings: {
      stability: 0.70,
      similarity_boost: 0.75,
      style: 0.20,
      use_speaker_boost: false,
    },
  },
  {
    npcKey: "wraith_calder",
    envVar: "ELEVENLABS_VOICE_ID_WRAITH",
    linesFile: "wraith-calder-first-meet-lines.json",
    manifestFile: "wraithVoManifest.json",
    s3Prefix: "Wraith Voices/first-meet",
    // Hierophant register per §1.7 silence-shape — high stability,
    // mid style, never theatrical.
    voiceSettings: {
      stability: 0.65,
      similarity_boost: 0.72,
      style: 0.35,
      use_speaker_boost: true,
    },
  },
];

interface ScriptEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file: string;
  meta?: { npcKey?: string; treeId?: string; nodeId?: string; requiresRevealStage?: string | null };
}

async function generateSpeech(
  voiceId: string,
  text: string,
  voiceSettings: NpcVoiceConfig["voiceSettings"],
): Promise<Buffer> {
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
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: voiceSettings,
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToS3(buffer: Buffer, prefix: string, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });
  const fullKey = `${prefix}/${key}`;
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

async function processNpc(cfg: NpcVoiceConfig): Promise<{
  npcKey: string;
  rendered: number;
  skipped: number;
  errors: { id: string; error: string }[];
}> {
  const voiceId = sanitizeCredential(cfg.envVar, process.env[cfg.envVar]);
  if (!voiceId) {
    console.log(`  ${cfg.npcKey.padEnd(22)}  →  ${cfg.envVar} not set, SKIPPING`);
    return { npcKey: cfg.npcKey, rendered: 0, skipped: 0, errors: [] };
  }

  const linesPath = path.resolve(__dirname, cfg.linesFile);
  if (!fs.existsSync(linesPath)) {
    console.log(`  ${cfg.npcKey.padEnd(22)}  →  ${cfg.linesFile} missing, SKIPPING`);
    return { npcKey: cfg.npcKey, rendered: 0, skipped: 0, errors: [] };
  }
  const entries = JSON.parse(fs.readFileSync(linesPath, "utf-8")) as ScriptEntry[];

  const manifestPath = path.resolve(__dirname, "..", "shared", cfg.manifestFile);
  const existingManifest: Record<string, string> = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, string>)
    : {};
  const manifest: Record<string, string> = { ...existingManifest };

  console.log(
    `\n─── ${cfg.npcKey} (${entries.length} entries, voice ${voiceId}) ───`,
  );

  let rendered = 0;
  let skipped = 0;
  const errors: { id: string; error: string }[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const tag = `[${i + 1}/${entries.length}]`;
    if (SKIP_EXISTING && existingManifest[entry.id]) {
      process.stdout.write(`  ${tag} ${entry.id}  →  manifest hit, skip\n`);
      skipped++;
      continue;
    }
    process.stdout.write(`  ${tag} ${entry.id}…`);
    try {
      const audio = await generateSpeech(voiceId, entry.text, cfg.voiceSettings);
      const url = await uploadToS3(audio, cfg.s3Prefix, `${entry.id}.mp3`);
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
  fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n", "utf-8");

  return { npcKey: cfg.npcKey, rendered, skipped, errors };
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════");
  console.log("  NPC FIRST-MEETING VO GENERATOR");
  console.log(`  ${NPC_VO_CONFIG.length} NPCs in catalog`);
  console.log(`  Bucket: s3://${BUCKET}`);
  console.log(`  SKIP_EXISTING: ${SKIP_EXISTING}`);
  if (ONLY_NPC) console.log(`  --only=${ONLY_NPC}`);
  console.log("═══════════════════════════════════════\n");

  const targets = ONLY_NPC
    ? NPC_VO_CONFIG.filter((c) => c.npcKey === ONLY_NPC)
    : NPC_VO_CONFIG;
  if (targets.length === 0) {
    console.error(`No NPCs match the filter --only=${ONLY_NPC}.`);
    console.error(`Valid keys: ${NPC_VO_CONFIG.map((c) => c.npcKey).join(", ")}`);
    process.exit(1);
  }

  const results = [];
  for (const cfg of targets) {
    results.push(await processNpc(cfg));
  }

  console.log("\n═══════════════════════════════════════");
  console.log("  SUMMARY");
  console.log("═══════════════════════════════════════");
  let totalRendered = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  for (const r of results) {
    totalRendered += r.rendered;
    totalSkipped += r.skipped;
    totalErrors += r.errors.length;
    console.log(
      `  ${r.npcKey.padEnd(22)}  rendered=${r.rendered}  skipped=${r.skipped}  errors=${r.errors.length}`,
    );
  }
  console.log(
    `\n  TOTAL  rendered=${totalRendered}  skipped=${totalSkipped}  errors=${totalErrors}`,
  );

  if (totalErrors > 0) {
    console.error("\nErrors:");
    for (const r of results) {
      for (const e of r.errors) console.error(`  [${r.npcKey}] ${e.id}: ${e.error}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
