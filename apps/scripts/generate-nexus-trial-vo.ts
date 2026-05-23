#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL VO GENERATOR — ElevenLabs TTS + dgrsart S3 upload

   Reads the 8 cinematics in apps/shared/nexusTrial/cinematics.ts
   and generates the 25 voice lines that ship inside them:

     - 8 antiquarianOpening lines  → Antiquarian voice
     - 7 characterLine lines       → respective NPC voice (abort skipped)
     - 8 antiquarianClosing lines  → Antiquarian voice
     - 2 romanceTag.characterLine  → Elara / Human voice

   Voice IDs are cast from the existing repo registry:
     apps/scripts/generate-prelude-vo.ts (Antiquarian, Locke, Elara, Human)
     apps/scripts/generate_vo_gaps.py    (Wraith Calder, Akai Shi, Lycos)
     apps/scripts/generate-content-pass-vo.ts (Vex Solène)

   Output layout (canonical CDN path; resolves via assetUrl()):
     cdn/client-public/audio/nexus_trial/<cinematic_id>/<beat>.mp3

     beat ∈ {
       antiquarian_opening,
       character_line,        // skipped for verdict_abort
       antiquarian_closing,
       romance_tag,           // confession variants only
     }

   Idempotent: skips lines whose local mp3 already exists.

   Run locally:
     export ELEVENLABS_API_KEY='sk_...'
     export AWS_ACCESS_KEY_ID='AKIA...'      (optional — local-only fallback)
     export AWS_SECRET_ACCESS_KEY='...'      (optional)
     export AWS_REGION='us-east-2'           (default: us-east-2)
     pnpm tsx apps/scripts/generate-nexus-trial-vo.ts

   Without AWS creds the script still generates mp3s locally
   (apps/client/public/audio/nexus_trial/...) so the dev server can
   serve them; upload happens later via apps/scripts/upload-public-
   to-s3.ts --only=audio.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { optionalCredential } from "./credentialUtils";
import {
  NEXUS_TRIAL_CINEMATICS,
  type CinematicScript,
} from "../shared/nexusTrial/cinematics";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/* ─── CONFIG ─── */

const ELEVENLABS_KEY = optionalCredential("ELEVENLABS_API_KEY");
const BUCKET = process.env.S3_BUCKET || "dgrsart";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "cdn/client-public/audio/nexus_trial";
const LOCAL_DIR = path.join(REPO_ROOT, "apps/client/public/audio/nexus_trial");

const HAS_AWS_CREDS = Boolean(
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
);

/* ─── VOICE CASTING ─── */

interface VoiceCfg {
  voiceId: string;
  /** ElevenLabs voice_settings. Tuned per bible voice direction. */
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

/** Hard-coded from the existing on-file generators (citations above).
 *  Per-character env-var override (e.g. ELEVENLABS_VOICE_ID_ANTIQUARIAN)
 *  takes precedence if set — matches the convention in
 *  generate-npc-first-meet-vo.ts. */
const VOICE_BY_SPEAKER: Record<string, VoiceCfg> = {
  /* Antiquarian — yAKlvHIsuj4SvnKQ6Mk4 (generate-prelude-vo.ts) */
  the_antiquarian: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_ANTIQUARIAN || "yAKlvHIsuj4SvnKQ6Mk4",
    stability: 0.72,         // warm + measured per bible §1
    similarity_boost: 0.75,
    style: 0.30,             // unusual pauses but never theatrical
    use_speaker_boost: true,
  },
  /* Locke — 8XiBWqS5ffaH5naIFHPI (generate-prelude-vo.ts) */
  locke: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_LOCKE || "8XiBWqS5ffaH5naIFHPI",
    stability: 0.70,         // smooth + diplomatic; never rushes
    similarity_boost: 0.75,
    style: 0.20,             // restrained register
    use_speaker_boost: false,
  },
  /* Wraith Calder — Vogq3iKs5PJ3cL39gFhW (generate_vo_gaps.py) */
  wraith_calder: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_WRAITH || "Vogq3iKs5PJ3cL39gFhW",
    stability: 0.65,         // pre-rite register: short declaratives, never theatrical
    similarity_boost: 0.72,
    style: 0.35,
    use_speaker_boost: true,
  },
  /* Lycos — rfHVfqlu6LXw4vLf7q4i (generate_vo_gaps.py) */
  lycos: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_LYCOS || "rfHVfqlu6LXw4vLf7q4i",
    stability: 0.78,         // sparse + exact; the last word does not resolve upward
    similarity_boost: 0.70,
    style: 0.15,             // quiet, never soft
    use_speaker_boost: false,
  },
  /* Akai Shi — AQYSOeM9rkJY878exSfM (generate_vo_gaps.py) */
  akai_shi: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_AKAI || "AQYSOeM9rkJY878exSfM",
    stability: 0.68,         // time-displaced; tenses drift mid-sentence
    similarity_boost: 0.72,
    style: 0.25,             // tender finality, not boast
    use_speaker_boost: true,
  },
  /* Vex Solène — F1waTCPWl7KpShIScYQs (generate-content-pass-vo.ts) */
  vex_solene: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_VEX || "F1waTCPWl7KpShIScYQs",
    stability: 0.65,         // inventory-then-courtesy; trailing-word cadence
    similarity_boost: 0.80,
    style: 0.30,
    use_speaker_boost: true,
  },
  /* Elara — xMyNDrPFEtQN8iZtT7l2 (generate-prelude-vo.ts) */
  elara: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_ELARA || "xMyNDrPFEtQN8iZtT7l2",
    stability: 0.70,         // senatorial, composed, no rushing
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
  },
  /* The Human — oGbGJdgofRR8z0MxwI8L (generate-prelude-vo.ts) */
  the_human: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_HUMAN || "oGbGJdgofRR8z0MxwI8L",
    stability: 0.68,         // noir-detective clipped; period after almost every clause
    similarity_boost: 0.75,
    style: 0.20,
    use_speaker_boost: false,
  },
};

/** Map a cinematic's npcKey to the speaker key in VOICE_BY_SPEAKER. */
function speakerForNpc(npcKey: CinematicScript["npcKey"]): string | null {
  if (!npcKey) return null;
  if (npcKey === "human") return "the_human";
  return npcKey;
}

/* ─── BEAT ENUMERATION ─── */

type Beat = "antiquarian_opening" | "character_line" | "antiquarian_closing" | "romance_tag";

interface VoJob {
  cinematicId: string;
  beat: Beat;
  speaker: string;       // key into VOICE_BY_SPEAKER
  text: string;
  /** Local + remote path stem (relative to nexus_trial root). */
  pathStem: string;
}

function jobsFor(script: CinematicScript): VoJob[] {
  const jobs: VoJob[] = [];
  jobs.push({
    cinematicId: script.id,
    beat: "antiquarian_opening",
    speaker: "the_antiquarian",
    text: script.antiquarianOpening,
    pathStem: `${script.id}/antiquarian_opening`,
  });
  if (script.characterLine.length > 0) {
    const sp = speakerForNpc(script.npcKey);
    if (sp) {
      jobs.push({
        cinematicId: script.id,
        beat: "character_line",
        speaker: sp,
        text: script.characterLine,
        pathStem: `${script.id}/character_line`,
      });
    }
  }
  jobs.push({
    cinematicId: script.id,
    beat: "antiquarian_closing",
    speaker: "the_antiquarian",
    text: script.antiquarianClosing,
    pathStem: `${script.id}/antiquarian_closing`,
  });
  if (script.romanceTag) {
    const sp = speakerForNpc(script.npcKey);
    if (sp) {
      jobs.push({
        cinematicId: script.id,
        beat: "romance_tag",
        speaker: sp,
        // Strip the {player_name} placeholder for the recording — the
        // client interpolates the actual name on-the-fly at playback
        // time. We record with "Captain" as a neutral placeholder; the
        // existing romance-tag rendering layer already substitutes
        // {player_name} → real name at render. For the audio file, we
        // chop the placeholder + period at the start so the speaker
        // doesn't read it.
        text: script.romanceTag.characterLine.replace(/^\{player_name\}\.\s*/, ""),
        pathStem: `${script.id}/romance_tag`,
      });
    }
  }
  return jobs;
}

/* ─── ELEVENLABS TTS ─── */

async function generateSpeech(job: VoJob): Promise<Buffer> {
  const cfg = VOICE_BY_SPEAKER[job.speaker];
  if (!cfg) {
    throw new Error(`No voice config for speaker "${job.speaker}"`);
  }
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${cfg.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY ?? "",
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: job.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarity_boost,
          style: cfg.style,
          use_speaker_boost: cfg.use_speaker_boost,
        },
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status} for ${job.pathStem}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/* ─── LOCAL + S3 OUTPUT ─── */

function writeLocal(job: VoJob, buffer: Buffer): string {
  const filePath = path.join(LOCAL_DIR, `${job.pathStem}.mp3`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return path.relative(REPO_ROOT, filePath);
}

async function uploadToS3(job: VoJob, buffer: Buffer): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  const key = `${S3_PREFIX}/${job.pathStem}.mp3`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/* ─── MAIN ─── */

async function main() {
  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    console.error("  export ELEVENLABS_API_KEY='sk_...'");
    process.exit(1);
  }

  const allJobs: VoJob[] = [];
  for (const script of Object.values(NEXUS_TRIAL_CINEMATICS)) {
    allJobs.push(...jobsFor(script));
  }

  console.log(`[nexus-trial-vo] ${allJobs.length} VO lines to generate across 8 cinematics.`);
  console.log(`[nexus-trial-vo] AWS creds: ${HAS_AWS_CREDS ? "present (S3 upload enabled)" : "absent (local-only)"}`);

  fs.mkdirSync(LOCAL_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  let uploaded = 0;
  let failed = 0;

  for (const job of allJobs) {
    const localPath = path.join(LOCAL_DIR, `${job.pathStem}.mp3`);
    if (fs.existsSync(localPath)) {
      skipped++;
      console.log(`  [skip]  ${job.pathStem} (already on disk)`);
      continue;
    }
    try {
      const audio = await generateSpeech(job);
      writeLocal(job, audio);
      generated++;
      if (HAS_AWS_CREDS) {
        await uploadToS3(job, audio);
        uploaded++;
      }
      const cfg = VOICE_BY_SPEAKER[job.speaker];
      console.log(`  [ok]    ${job.pathStem}  voice=${cfg.voiceId.slice(0, 8)}…  bytes=${audio.length}`);
    } catch (e) {
      failed++;
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  [fail]  ${job.pathStem} — ${msg}`);
    }
  }

  console.log("");
  console.log(
    `[nexus-trial-vo] done — generated=${generated} uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
  );
  if (!HAS_AWS_CREDS && generated > 0) {
    console.log("[nexus-trial-vo] AWS creds not set; mp3s are in apps/client/public/audio/nexus_trial/.");
    console.log("                 Upload later via:");
    console.log("                   pnpm tsx apps/scripts/upload-public-to-s3.ts --only=audio");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
