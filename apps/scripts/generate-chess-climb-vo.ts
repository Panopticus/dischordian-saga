/**
 * Chess Climb GM VO generator — ElevenLabs TTS + S3 upload.
 *
 * Reads apps/scripts/chess-climb-lines.json, generates each line via
 * ElevenLabs with register-specific voice_settings (per
 * docs/production/chess-vo-direction.md "one actor, two registers"),
 * uploads to s3://dgrsvoices/GameMaster+Voices/climb/<id>.mp3, and
 * merges results into apps/shared/gamemasterVoManifest.json.
 *
 * Usage (run locally — sandbox can't reach api.elevenlabs.io):
 *   export ELEVENLABS_API_KEY=sk_...
 *   export AWS_ACCESS_KEY_ID=AKIA...
 *   export AWS_SECRET_ACCESS_KEY=...
 *   pnpm tsx apps/scripts/generate-chess-climb-vo.ts
 *
 * Idempotent: lines already in gamemasterVoManifest.json are skipped.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const BUCKET = process.env.S3_BUCKET ?? "dgrsvoices";
const REGION = process.env.AWS_REGION ?? "us-east-2";
const S3_PREFIX = "GameMaster Voices/climb";

interface Register {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix: string;
}

// Per chess-vo-direction.md. Same actor across both registers; voice_settings
// approximate the "vocal color identical, delivery different" instruction.
const REGISTERS: Record<string, Register> = {
  // Mr. Shaibel: unhurried, amused, warm-not-sentimental. Stability up so the
  // line keeps a steady pace; style restrained so it doesn't perform.
  celebration: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*spoken warmly, unhurried, like a patient teacher amused at his own jokes* ",
  },
  // The Corrupted GM is a game-theorist AI *performing* as a loud quiz-show
  // host — the persona is calibrated, not natural. Stability slightly higher
  // than a pure performative read (the AI keeps precise control of the
  // performance), style still elevated so the ALL-CAPS landings hit. The
  // prompt names the artifice so the model conveys the "knowing performer"
  // subtext underneath the surface bombast.
  corrupted: {
    stability: 0.4,
    similarity_boost: 0.78,
    style: 0.6,
    use_speaker_boost: true,
    text_prefix:
      "*delivered by a coldly intelligent AI game theorist who is performing the role of a loud 1980s quiz-show host — the loudness is a chosen costume, not a personality. Behind every ALL-CAPS landing is a calibrated act, slightly amused at its own theatre. Read the showman lines with full commitment, but let a single beat of clinical evaluation surface in the pauses.* ",
  },
};

interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  emotion: string;
  register: keyof typeof REGISTERS;
}

const LINES_FILE = join(__dirname, "chess-climb-lines.json");
const MANIFEST_PATH = join(__dirname, "..", "shared", "gamemasterVoManifest.json");

async function generateSpeech(line: VoLine): Promise<Buffer> {
  const reg = REGISTERS[line.register];
  if (!reg) throw new Error(`unknown register: ${line.register}`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${line.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: reg.text_prefix + line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: reg.stability,
          similarity_boost: reg.similarity_boost,
          style: reg.style,
          use_speaker_boost: reg.use_speaker_boost,
        },
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err.slice(0, 200)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToS3(body: Buffer, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const fullKey = `${S3_PREFIX}/${key}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: fullKey,
      Body: body,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

async function main() {
  if (!ELEVENLABS_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("ERROR: AWS_SECRET_ACCESS_KEY not set.");
    process.exit(1);
  }
  if (!existsSync(LINES_FILE)) {
    console.error(`ERROR: ${LINES_FILE} missing — run pnpm tsx apps/scripts/extract-chess-climb-lines.ts first.`);
    process.exit(1);
  }

  const lines: VoLine[] = JSON.parse(readFileSync(LINES_FILE, "utf8"));
  const manifest: Record<string, string> = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8"))
    : {};

  const todo = lines.filter((l) => !manifest[l.id]);
  console.log("═══════════════════════════════════════");
  console.log("  CHESS CLIMB GM VO GENERATOR");
  console.log(`  ${lines.length} lines total, ${todo.length} to generate (${lines.length - todo.length} already in manifest)`);
  console.log(`  Bucket: ${BUCKET}/${S3_PREFIX}`);
  console.log("═══════════════════════════════════════\n");

  let generated = 0;
  let errors = 0;

  for (const line of todo) {
    process.stdout.write(`[${++generated + errors}/${todo.length}] ${line.id} (${line.register})... `);
    try {
      const audio = await generateSpeech(line);
      const url = await uploadToS3(audio, `${line.id}.mp3`);
      manifest[line.id] = url;
      console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB`);
      // Persist after each successful line so a crash doesn't lose progress.
      writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
      // Throttle: ElevenLabs ~10 req/s on paid plans.
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      errors++;
      console.log(`✗ ${(err as Error).message}`);
      if ((err as Error).message.includes("429")) {
        console.log("  rate-limited — backing off 30s");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated:                       ${generated - errors}`);
  console.log(`Skipped (already in manifest):   ${lines.length - todo.length}`);
  console.log(`Errors:                          ${errors}`);
  console.log(`Manifest:                        ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
