/**
 * Shared runtime for the extended VO generators (banks / romance /
 * encounters / awakening-overlay). Each surface-specific entry point
 * builds an array of `LineJob` and calls `runJobs()`. The runner
 * handles env-sanitisation, ElevenLabs synthesis, S3 upload, and
 * idempotent manifest merging.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildTtsBody } from "./tts-body";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..", "..", "..");
const SHARED = join(REPO_ROOT, "apps", "shared");

export interface VoiceConfig {
  voiceId: string;
  manifest: string;
  s3Prefix: string;
  direction: string;
}

export interface ExtendedVoConfig {
  _per_npc_voices: Record<string, VoiceConfig>;
  _encounter_speakers: Record<string, VoiceConfig>;
  _awakening_speakers: Record<string, VoiceConfig>;
}

export function loadConfig(): ExtendedVoConfig {
  return JSON.parse(
    readFileSync(join(__dirname, "..", "extended-vo-config.json"), "utf8"),
  ) as ExtendedVoConfig;
}

export interface LineJob {
  /** Voice config (looked up by speaker key in the surface generator). */
  voice: VoiceConfig;
  /** Stable line id used as the manifest key + S3 object name. */
  lineId: string;
  /** Authored line text (stage directions are stripped before TTS). */
  text: string;
  /** Optional human label printed in logs. Defaults to lineId. */
  label?: string;
}

function sanitize(name: string, raw: string | undefined): string {
  if (!raw) return "";
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").trim();
  if (cleaned !== raw) {
    console.warn(
      `[sanitize] ${name}: stripped ${raw.length - cleaned.length} hidden char(s)`,
    );
  }
  return cleaned;
}

function loadManifest(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveManifest(path: string, data: Record<string, string>): void {
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(data).sort()) sorted[k] = data[k];
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

async function headExists(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.ok;
  } catch {
    return false;
  }
}

async function ttsRequest(
  text: string,
  voice: VoiceConfig,
  apiKey: string,
): Promise<Buffer> {
  const body = buildTtsBody({ text });
  const resp = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: body,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    },
  );
  if (!resp.ok) {
    throw new Error(`ElevenLabs ${resp.status}: ${await resp.text()}`);
  }
  return Buffer.from(await resp.arrayBuffer());
}

async function uploadToS3(
  buf: Buffer,
  key: string,
  bucket: string,
  region: string,
  awsKey: string,
  awsSecret: string,
): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region,
    credentials: { accessKeyId: awsKey, secretAccessKey: awsSecret },
  });
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buf,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
}

export interface RunJobsOptions {
  /** Surface label printed in the banner. */
  surface: string;
  jobs: LineJob[];
  dryRun?: boolean;
}

export async function runJobs(opts: RunJobsOptions): Promise<void> {
  const { surface, jobs, dryRun } = opts;

  const ELEVENLABS_KEY = sanitize("ELEVENLABS_API_KEY", process.env.ELEVENLABS_API_KEY);
  const AWS_ACCESS_KEY_ID = sanitize("AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID);
  const AWS_SECRET_ACCESS_KEY = sanitize("AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY);
  const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
  const REGION = process.env.AWS_REGION || "us-east-2";

  if (!dryRun) {
    if (!ELEVENLABS_KEY) {
      console.error("ERROR: ELEVENLABS_API_KEY required (use --dry-run to plan).");
      process.exit(1);
    }
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.error("ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY required.");
      process.exit(1);
    }
  }

  // Group jobs by manifest path for atomic per-manifest writes.
  const byManifest = new Map<string, { cfg: VoiceConfig; jobs: LineJob[] }>();
  for (const j of jobs) {
    const path = join(SHARED, j.voice.manifest);
    if (!byManifest.has(path)) byManifest.set(path, { cfg: j.voice, jobs: [] });
    byManifest.get(path)!.jobs.push(j);
  }

  console.log("═══════════════════════════════════════");
  console.log(`  EXTENDED VO — ${surface}`);
  console.log(`  ${byManifest.size} manifest(s), ${jobs.length} line(s)`);
  console.log(`  Dry run: ${dryRun ? "YES" : "no"}`);
  console.log("═══════════════════════════════════════");

  let total = 0, generated = 0, skipped = 0, errored = 0;

  for (const [manifestPath, group] of byManifest) {
    const manifest = loadManifest(manifestPath);
    console.log(`\n--- ${group.cfg.manifest} | voice=${group.cfg.voiceId} | ${group.jobs.length} lines`);
    for (let i = 0; i < group.jobs.length; i++) {
      const job = group.jobs[i];
      total++;
      const s3Key = `${job.voice.s3Prefix}/${job.lineId}.mp3`;
      const fullUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(s3Key).replace(/%2F/g, "/")}`;
      const existing = manifest[job.lineId];
      const checkUrl = existing && existing.startsWith("http") ? existing : fullUrl;
      if (await headExists(checkUrl)) {
        if (existing !== checkUrl) {
          manifest[job.lineId] = checkUrl;
          saveManifest(manifestPath, manifest);
        }
        skipped++;
        continue;
      }
      if (dryRun) {
        console.log(`  [${i + 1}/${group.jobs.length}] (dry) ${job.lineId}`);
        continue;
      }
      process.stdout.write(`  [${i + 1}/${group.jobs.length}] ${job.label ?? job.lineId}…`);
      try {
        const audio = await ttsRequest(job.text, job.voice, ELEVENLABS_KEY);
        const url = await uploadToS3(
          audio, s3Key, BUCKET, REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
        );
        manifest[job.lineId] = url;
        saveManifest(manifestPath, manifest);
        generated++;
        process.stdout.write(` ok (${(audio.byteLength / 1024).toFixed(0)} KB)\n`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        process.stdout.write(` FAIL ${msg}\n`);
        errored++;
        if (msg.includes("429")) {
          console.log("  rate limited — sleeping 30s");
          await new Promise((r) => setTimeout(r, 30000));
        }
      }
    }
  }

  console.log(
    `\n═══ ${surface} DONE: total=${total} generated=${generated} skipped=${skipped} errored=${errored} ═══`,
  );
  if (errored > 0) process.exit(1);
}
