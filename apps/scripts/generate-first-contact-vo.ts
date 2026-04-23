#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   FIRST-CONTACT VO GENERATOR — ElevenLabs TTS + S3 upload

   Generates one VO line per faction NPC from their
   FACTION_NPCS[id].firstContact text, uploads to S3, and MERGES
   the resulting URL into each NPC's existing VO manifest JSON
   (never overwrites prior entries).

   The lineId and voice_id per NPC are locked in FIRST_CONTACT_VO
   below. The lineId matches buildFirstContactScene in
   apps/client/src/components/NPCDialog.tsx — once this script
   runs successfully, opening first-contact dialogs with those NPCs
   will auto-play their audio and the portrait speaking-tells will
   follow audio events (per Phase 1 Patch 1).

   Run locally (needs network + credentials):
     export ELEVENLABS_API_KEY=sk_...
     export AWS_ACCESS_KEY_ID=AKIA...
     export AWS_SECRET_ACCESS_KEY=...
     export AWS_REGION=us-east-2
     export S3_BUCKET=dgrsvoices
     npx tsx apps/scripts/generate-first-contact-vo.ts

   Idempotent: if the manifest already has the target lineId, the
   script SKIPS that NPC unless you pass --force.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FACTION_NPCS, type FactionNPCId } from "../client/src/game/factionNPCs";

// ESM polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CONFIG ───
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const FORCE = process.argv.includes("--force");

// ─── PER-NPC CONFIG ───
// Matches FIRST_CONTACT_VO_LINE in NPCDialog.tsx for lineId, and the
// voice IDs from the existing per-NPC Python generators.
interface NpcVoSpec {
  npcId: FactionNPCId;
  lineId: string;
  voiceId: string;
  manifestFile: string; // relative to apps/shared
  s3Prefix: string;     // per-NPC S3 folder
  emotionPrefix?: string; // ElevenLabs stage direction prepended to text
}

const FIRST_CONTACT_VO: NpcVoSpec[] = [
  {
    npcId: "elara",
    lineId: "elara_first_contact",
    voiceId: "xMyNDrPFEtQN8iZtT7l2",
    manifestFile: "elaraVoManifest.json",
    s3Prefix: "Elara Voices/first_contact",
    emotionPrefix: "*speaking warmly, still disoriented from centuries of solitude* ",
  },
  {
    npcId: "the_human",
    lineId: "human_first_contact",
    voiceId: "oGbGJdgofRR8z0MxwI8L",
    manifestFile: "humanVoManifest.json",
    s3Prefix: "Human Voices/first_contact",
    emotionPrefix: "*urgent, hushed, centuries of waiting in every word* ",
  },
  {
    npcId: "agent_zero",
    lineId: "agent_zero_first_contact",
    voiceId: "F1waTCPWl7KpShIScYQs",
    manifestFile: "agent_zeroVoManifest.json",
    s3Prefix: "AgentZero Voices/first_contact",
    emotionPrefix: "*professional, clipped, encrypted-channel brevity* ",
  },
  {
    npcId: "adjudicator_locke",
    lineId: "locke_intro",          // existing entry — script re-generates unless --force skips
    voiceId: "8XiBWqS5ffaH5naIFHPI",
    manifestFile: "lockeVoManifest.json",
    s3Prefix: "Locke Voices/first_contact",
    emotionPrefix: "*measured, mercantile, hint of veiled threat* ",
  },
  {
    npcId: "the_source",
    lineId: "source_first_contact",
    voiceId: "hfq5qawrYj4gqFsfoE28",
    manifestFile: "sourceVoManifest.json",
    s3Prefix: "Source Voices/first_contact",
    emotionPrefix: "*sepulchral, weighty, each word fossilized* ",
  },
  {
    npcId: "the_antiquarian",
    lineId: "antiquarian_first_contact",
    voiceId: "yAKlvHIsuj4SvnKQ6Mk4",
    manifestFile: "antiquarianVoManifest.json",
    s3Prefix: "Antiquarian Voices/first_contact",
    emotionPrefix: "*scholarly, unhurried, ancient recognition in the voice* ",
  },
  {
    npcId: "shadow_tongue",
    lineId: "st_first_contact",     // existing entry — script re-generates unless --force skips
    voiceId: "14wGKUgRFDPSwtCQurbB",
    manifestFile: "shadow_tongueVoManifest.json",
    s3Prefix: "ShadowTongue Voices/first_contact",
    emotionPrefix: "*seductive, precise, each syllable edited for maximum damage* ",
  },
];

// ─── S3 CLIENT ───
const s3 = new S3Client({ region: REGION });

// ─── HELPERS ───
async function generateSpeech(text: string, voiceId: string): Promise<Buffer> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.78,
          style: 0.45,
          use_speaker_boost: true,
        },
      }),
    },
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${errText.slice(0, 200)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "audio/mpeg",
  }));
  // Public-readable bucket URL (matches format of existing manifest entries)
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURI(key)}`;
}

function mergeManifest(manifestPath: string, lineId: string, url: string): void {
  let existing: Record<string, string> = {};
  if (fs.existsSync(manifestPath)) {
    existing = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }
  existing[lineId] = url;
  // Sort keys for deterministic diffs
  const sorted = Object.fromEntries(
    Object.entries(existing).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
}

// ─── MAIN ───
async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  FIRST-CONTACT VO GENERATOR");
  console.log(`  ${FIRST_CONTACT_VO.length} NPCs`);
  console.log(`  Force regenerate: ${FORCE}`);
  console.log("═══════════════════════════════════════\n");

  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set");
    process.exit(1);
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_SECRET_ACCESS_KEY not set");
    process.exit(1);
  }

  const sharedDir = path.join(__dirname, "..", "shared");
  const errors: { npcId: string; error: string }[] = [];
  let generated = 0;
  let skipped = 0;

  for (const spec of FIRST_CONTACT_VO) {
    const npc = FACTION_NPCS[spec.npcId];
    const manifestPath = path.join(sharedDir, spec.manifestFile);
    const existing: Record<string, string> = fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
      : {};

    if (!FORCE && existing[spec.lineId]) {
      console.log(`[SKIP] ${spec.npcId} — ${spec.lineId} already in manifest (use --force to regenerate)`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`[${generated + 1}/${FIRST_CONTACT_VO.length}] ${spec.npcId} (${spec.lineId})... `);
      const text = (spec.emotionPrefix ?? "") + npc.firstContact;
      const audio = await generateSpeech(text, spec.voiceId);
      const s3Key = `${spec.s3Prefix}/${spec.lineId}.mp3`;
      const url = await uploadToS3(audio, s3Key);
      mergeManifest(manifestPath, spec.lineId, url);
      console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB`);
      generated++;
      // Rate-limit courtesy — ElevenLabs paid tier is ~10 req/s
      await new Promise(r => setTimeout(r, 200));
    } catch (err: any) {
      console.log(`✗ ${err.message}`);
      errors.push({ npcId: spec.npcId, error: err.message });
      if (err.message.includes("429")) {
        console.log("  Rate limited — backing off 30s");
        await new Promise(r => setTimeout(r, 30000));
      }
    }
  }

  console.log("\n═══ COMPLETE ═══");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Errors:    ${errors.length}`);
  if (errors.length > 0) {
    const errPath = path.join(__dirname, "first-contact-vo-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2));
    console.log(`Error log: ${errPath}`);
  }
}

main().catch(console.error);
