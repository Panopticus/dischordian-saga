/**
 * Matrix-of-Dreams Episode VO generator — ElevenLabs TTS + S3 delivery.
 *
 * Reads the 24 authored episode dialog scenes from
 *   apps/shared/celebrationSchoolDialog.ts (+ part2)
 *   apps/shared/mechronisAcademyDialog.ts  (+ part2)
 * and generates one MP3 per cue via ElevenLabs, then uploads each
 * to S3 (default bucket: dgrsvoices) and writes/updates the canonical
 * manifest at apps/shared/episodeVoManifest.json.
 *
 * Idempotent: existing manifest entries are skipped on subsequent
 * runs, so partial completions are safe to resume.
 *
 * ───────────────────────────────────────────────────────────────────
 * USAGE
 *   1. Set up the environment:
 *        export ELEVENLABS_API_KEY=sk_...
 *        export AWS_ACCESS_KEY_ID=AKIA...
 *        export AWS_SECRET_ACCESS_KEY=...
 *        # optional:
 *        export AWS_REGION=us-east-2          (default us-east-2)
 *        export S3_BUCKET=dgrsvoices          (default dgrsvoices)
 *
 *   2. Edit apps/scripts/episode-voice-config.ts and replace each
 *      TODO_<SPEAKER>_VOICE_ID with the ElevenLabs voice id you've
 *      assigned to that speaker. Speakers with TODO_ ids are skipped
 *      unless --include-todo is passed.
 *
 *   3. Plan first (no API calls):
 *        pnpm vo:episodes -- --dry-run
 *
 *   4. Generate one episode:
 *        pnpm vo:episodes -- --episode celebration_c1_the_watch
 *
 *   5. Generate one whole school:
 *        pnpm vo:episodes -- --school celebration
 *        pnpm vo:episodes -- --school mechronis
 *
 *   6. Generate everything:
 *        pnpm vo:episodes -- --all
 *
 *   7. Local-only (no S3 upload):
 *        pnpm vo:episodes -- --episode celebration_c1_the_watch --no-s3
 *
 * ───────────────────────────────────────────────────────────────────
 * OUTPUTS
 *   • S3:        s3://<bucket>/episodes/<episodeId>/<sceneId>/<cueIndex>.mp3
 *   • Local:     apps/client/public/audio/episodes/<episodeId>/<sceneId>/<cueIndex>.mp3
 *   • Manifest:  apps/shared/episodeVoManifest.json — { "<key>": "<url>" }
 *                where <key> = "<episodeId>:<sceneId>:<cueIndex>"
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CELEBRATION_SCHOOL_SCENES,
  CELEBRATION_EPISODE_SCENE_MAP,
} from "../shared/celebrationSchoolDialog";
import {
  MECHRONIS_ACADEMY_SCENES,
  MECHRONIS_EPISODE_SCENE_MAP,
} from "../shared/mechronisAcademyDialog";
import type { DialogScene, DialogCue } from "../shared/tcg-core/story/dialogBank";
import {
  EPISODE_SPEAKER_VOICES,
  DEFAULT_EPISODE_VOICE,
  type EpisodeSpeakerVoice,
} from "./episode-voice-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..", "..");
const PUBLIC_ROOT = join(REPO_ROOT, "apps", "client", "public");
const MANIFEST_PATH = join(REPO_ROOT, "apps", "shared", "episodeVoManifest.json");

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const BUCKET = process.env.S3_BUCKET ?? "dgrsvoices";
const REGION = process.env.AWS_REGION ?? "us-east-2";
const HAS_AWS =
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

interface CueJob {
  episodeId: string;
  sceneId: string;
  cueIndex: number;
  speaker: string;
  text: string;
  manifestKey: string;
  localPath: string;
  s3Key: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const getOpt = (flag: string) => {
    const eq = args.find((a) => a.startsWith(flag + "="));
    if (eq) return eq.split("=")[1];
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };
  return {
    episode: getOpt("--episode"),
    school: getOpt("--school"),
    all: args.includes("--all"),
    dryRun: args.includes("--dry-run"),
    includeTodo: args.includes("--include-todo"),
    noS3: args.includes("--no-s3"),
  };
}

function loadAllEpisodes(): Array<{ episodeId: string; scenes: readonly DialogScene[] }> {
  const out: Array<{ episodeId: string; scenes: readonly DialogScene[] }> = [];
  for (const [episodeId, sceneIds] of Object.entries(CELEBRATION_EPISODE_SCENE_MAP)) {
    const scenes = sceneIds
      .map((id) => CELEBRATION_SCHOOL_SCENES.find((s) => s.id === id))
      .filter((s): s is DialogScene => s !== undefined);
    out.push({ episodeId, scenes });
  }
  for (const [episodeId, sceneIds] of Object.entries(MECHRONIS_EPISODE_SCENE_MAP)) {
    const scenes = sceneIds
      .map((id) => MECHRONIS_ACADEMY_SCENES.find((s) => s.id === id))
      .filter((s): s is DialogScene => s !== undefined);
    out.push({ episodeId, scenes });
  }
  return out;
}

function isCelebration(episodeId: string): boolean {
  return episodeId.startsWith("celebration_");
}

function buildCueJobs(
  episodes: Array<{ episodeId: string; scenes: readonly DialogScene[] }>,
): CueJob[] {
  const jobs: CueJob[] = [];
  for (const { episodeId, scenes } of episodes) {
    for (const scene of scenes) {
      scene.cues.forEach((cue: DialogCue, cueIndex: number) => {
        const manifestKey = `${episodeId}:${scene.id}:${cueIndex}`;
        const localPath = join(
          PUBLIC_ROOT,
          "audio",
          "episodes",
          episodeId,
          scene.id,
          `${cueIndex}.mp3`,
        );
        const s3Key = `episodes/${episodeId}/${scene.id}/${cueIndex}.mp3`;
        jobs.push({
          episodeId,
          sceneId: scene.id,
          cueIndex,
          speaker: String(cue.speaker),
          text: cue.text,
          manifestKey,
          localPath,
          s3Key,
        });
      });
    }
  }
  return jobs;
}

function resolveVoice(speaker: string): EpisodeSpeakerVoice {
  return EPISODE_SPEAKER_VOICES[speaker] ?? DEFAULT_EPISODE_VOICE;
}

async function tts(line: { text: string; voice: EpisodeSpeakerVoice }): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${line.voice.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: line.voice.text_prefix + line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: line.voice.stability,
          similarity_boost: line.voice.similarity_boost,
          style: line.voice.style,
          use_speaker_boost: line.voice.use_speaker_boost,
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
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key)}`;
}

function writeLocalMp3(body: Buffer, localPath: string): string {
  mkdirSync(dirname(localPath), { recursive: true });
  writeFileSync(localPath, body);
  // Local URL relative to /public — strip the public root.
  return localPath
    .replace(PUBLIC_ROOT, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "/");
}

function loadManifest(): Record<string, string> {
  if (!existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Record<string, string>;
}

function saveManifest(manifest: Record<string, string>): void {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

async function main() {
  const opts = parseArgs();

  const allEpisodes = loadAllEpisodes();

  // Filter episode scope per CLI args.
  let scope = allEpisodes;
  if (opts.episode) {
    scope = allEpisodes.filter((e) => e.episodeId === opts.episode);
    if (scope.length === 0) {
      console.error(`ERROR: --episode "${opts.episode}" did not match any registered episode.`);
      console.error(`Known ids:\n  ${allEpisodes.map((e) => e.episodeId).join("\n  ")}`);
      process.exit(1);
    }
  } else if (opts.school) {
    if (opts.school !== "celebration" && opts.school !== "mechronis") {
      console.error(`ERROR: --school must be "celebration" or "mechronis".`);
      process.exit(1);
    }
    scope = allEpisodes.filter((e) =>
      opts.school === "celebration"
        ? isCelebration(e.episodeId)
        : !isCelebration(e.episodeId),
    );
  } else if (!opts.all) {
    console.error("ERROR: pass --episode <id>, --school <celebration|mechronis>, or --all.");
    process.exit(1);
  }

  if (!ELEVENLABS_KEY && !opts.dryRun) {
    console.error("ERROR: ELEVENLABS_API_KEY not set (use --dry-run to plan only).");
    process.exit(1);
  }

  const useS3 = !opts.noS3 && HAS_AWS;
  if (!opts.noS3 && !HAS_AWS && !opts.dryRun) {
    console.warn(
      "WARN: AWS credentials not set; S3 upload will be skipped. Local MP3s will still land.",
    );
  }

  const allJobs = buildCueJobs(scope);
  const manifest = loadManifest();

  const skippedAlreadyDone = allJobs.filter((j) => manifest[j.manifestKey]);
  const skippedTodo = allJobs.filter((j) => {
    if (manifest[j.manifestKey]) return false;
    const v = resolveVoice(j.speaker);
    return v.voiceId.startsWith("TODO_") && !opts.includeTodo;
  });
  const todoVoiceSpeakers = new Set(
    skippedTodo.map((j) => j.speaker),
  );
  const candidates = allJobs.filter((j) => {
    if (manifest[j.manifestKey]) return false;
    const v = resolveVoice(j.speaker);
    if (v.voiceId.startsWith("TODO_") && !opts.includeTodo) return false;
    return true;
  });

  console.log("═══════════════════════════════════════");
  console.log("  EPISODE VO GENERATOR");
  console.log(`  scope:           ${scope.length} episode(s)`);
  console.log(`  total cues:      ${allJobs.length}`);
  console.log(`  already done:    ${skippedAlreadyDone.length}`);
  console.log(`  skipped (TODO):  ${skippedTodo.length} (across ${todoVoiceSpeakers.size} unmapped speaker(s))`);
  console.log(`  to generate:     ${candidates.length}`);
  console.log(`  ElevenLabs key:  ${ELEVENLABS_KEY ? "set" : "MISSING"}`);
  console.log(`  AWS credentials: ${HAS_AWS ? "set" : "missing"}`);
  console.log(`  S3 bucket:       ${useS3 ? `${BUCKET} (${REGION})` : "DISABLED"}`);
  console.log("═══════════════════════════════════════");

  if (todoVoiceSpeakers.size > 0 && !opts.includeTodo) {
    console.log("");
    console.log("Speakers without an ElevenLabs voice id (set in episode-voice-config.ts):");
    for (const s of [...todoVoiceSpeakers].sort()) {
      console.log(`  • ${s}`);
    }
    console.log("");
    console.log("Pass --include-todo to attempt them anyway (they will fail at the API).");
  }

  if (opts.dryRun) {
    console.log("");
    console.log("DRY RUN — no API calls. First 10 candidates:");
    candidates.slice(0, 10).forEach((j) => {
      console.log(`  ${j.manifestKey} · speaker=${j.speaker} · text="${j.text.slice(0, 60).replace(/\s+/g, " ")}…"`);
    });
    return;
  }

  let generated = 0;
  let failed = 0;
  for (const job of candidates) {
    const voice = resolveVoice(job.speaker);
    const display = `[${generated + failed + 1}/${candidates.length}] ${job.manifestKey}`;
    try {
      console.log(`${display} · speaker=${job.speaker} · voice=${voice.voiceId}`);
      const audio = await tts({ text: job.text, voice });
      const localUrl = writeLocalMp3(audio, job.localPath);
      let url = localUrl;
      if (useS3) {
        url = await uploadToS3(audio, job.s3Key);
      }
      manifest[job.manifestKey] = url;
      saveManifest(manifest); // persist after every success — partial-fail safe
      generated++;
    } catch (err) {
      failed++;
      console.error(`  FAIL ${job.manifestKey}: ${(err as Error).message}`);
    }
  }

  console.log("");
  console.log("═══════════════════════════════════════");
  console.log(`  generated: ${generated}`);
  console.log(`  failed:    ${failed}`);
  console.log(`  manifest:  ${MANIFEST_PATH}`);
  console.log("═══════════════════════════════════════");

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
