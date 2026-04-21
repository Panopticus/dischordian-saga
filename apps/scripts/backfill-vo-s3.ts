#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VO S3 BACKFILL — upload local-only mp3s and rewrite manifest URLs

   Context: `pnpm vo:all` can run without AWS creds. In that mode, each
   generated line lands as a local mp3 under
   `apps/client/public/audio/<speaker>/<id>.mp3` and the matching
   VoManifest.json entry is written as the dev-relative path
   `/audio/<speaker>/<id>.mp3`. This script walks the four VO manifests
   that own locally-recorded lines, uploads any `/audio/...` entry to S3,
   and rewrites the manifest URL to the permanent CDN form.

   Idempotent — entries that already point at an `https://…` URL are
   skipped, so re-running after partial progress is safe.

   S3 layout (matches the existing generators' conventions):
     - IDs starting with `act1_` → `s3://$S3_BUCKET/Act 1 Voices/<speaker>/<id>.mp3`
     - Everything else (Prelude `*_beat_*`, `*_fc_*`) →
       `s3://$S3_BUCKET/Prelude Voices/<speaker>/<id>.mp3`

   Run locally (from repo root):
     export AWS_ACCESS_KEY_ID=AKIA...
     export AWS_SECRET_ACCESS_KEY=...
     export AWS_REGION=us-east-2        # default: us-east-2
     export S3_BUCKET=dgrsvoices        # default: dgrsvoices
     npx tsx apps/scripts/backfill-vo-s3.ts

   Options:
     --dry-run          List what would be uploaded without touching S3
                        or writing manifests. Exits 1 if anything still
                        needs uploading, 0 if everything is CDN-form.
     --only <profile>   Limit to one speaker (elara | human | antiquarian
                        | prince). Multiple --only flags may be passed.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── CONFIG ─── */

const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

/** Speaker → manifest path + on-disk audio directory. */
const SPEAKERS: ReadonlyArray<{
  profile: string;
  manifestPath: string;
  audioDir: string;
}> = [
  {
    profile: "elara",
    manifestPath: "apps/shared/elaraVoManifest.json",
    audioDir: "apps/client/public/audio/elara",
  },
  {
    profile: "human",
    manifestPath: "apps/shared/humanVoManifest.json",
    audioDir: "apps/client/public/audio/human",
  },
  {
    profile: "antiquarian",
    manifestPath: "apps/shared/antiquarianVoManifest.json",
    audioDir: "apps/client/public/audio/antiquarian",
  },
  {
    profile: "prince",
    manifestPath: "apps/shared/princeVoManifest.json",
    audioDir: "apps/client/public/audio/prince",
  },
];

/* ─── ARGS ─── */

function parseArgs(): { dryRun: boolean; only: ReadonlySet<string> } {
  const argv = process.argv.slice(2);
  let dryRun = false;
  const only = new Set<string>();
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--only" && i + 1 < argv.length) only.add(argv[++i]);
  }
  return { dryRun, only };
}

/* ─── S3 PREFIX CLASSIFIER ─── */

/**
 * Match the same conventions the two generators already use:
 *   `act1_*` → Act 1 Voices
 *   everything else → Prelude Voices
 * If new VO batches land (act2+, casino, prestige, …) extend this alongside
 * the generator that introduces them.
 */
function s3PrefixFor(lineId: string): string {
  if (lineId.startsWith("act1_")) return "Act 1 Voices";
  return "Prelude Voices";
}

/** S3 key → public HTTPS URL (URL-encoded, slashes preserved). */
function cdnUrlFor(key: string): string {
  const encoded = key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encoded}`;
}

/* ─── MANIFEST I/O ─── */

function loadManifest(relPath: string): Record<string, string> {
  const full = path.resolve(REPO_ROOT, relPath);
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

function saveManifest(relPath: string, manifest: Record<string, string>) {
  const full = path.resolve(REPO_ROOT, relPath);
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  fs.writeFileSync(full, JSON.stringify(sorted, null, 2) + "\n");
}

/* ─── MAIN ─── */

async function main() {
  const { dryRun, only } = parseArgs();

  if (!dryRun) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error(
        "ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set.\n" +
          "       (Or pass --dry-run to just list what would be uploaded.)",
      );
      process.exit(1);
    }
  }

  console.log("═══════════════════════════════════════");
  console.log("  VO S3 BACKFILL");
  console.log(`  Bucket: ${BUCKET}`);
  console.log(`  Region: ${REGION}`);
  console.log(`  Mode:   ${dryRun ? "dry-run" : "upload + rewrite manifests"}`);
  if (only.size) console.log(`  Only:   ${Array.from(only).join(", ")}`);
  console.log("═══════════════════════════════════════\n");

  // Lazy-load S3Client — dry-run shouldn't pull the SDK.
  let s3: unknown = null;
  let PutObjectCommand: unknown = null;
  if (!dryRun) {
    const mod = await import("@aws-sdk/client-s3");
    PutObjectCommand = mod.PutObjectCommand;
    s3 = new mod.S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  let uploaded = 0;
  let alreadyCdn = 0;
  let missingFile = 0;
  let skippedOther = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const speaker of SPEAKERS) {
    if (only.size > 0 && !only.has(speaker.profile)) continue;

    const manifest = loadManifest(speaker.manifestPath);
    let manifestDirty = false;

    for (const [lineId, url] of Object.entries(manifest)) {
      if (typeof url !== "string") {
        skippedOther++;
        continue;
      }
      if (url.startsWith("https://")) {
        alreadyCdn++;
        continue;
      }
      if (!url.startsWith("/audio/")) {
        // Not a CDN URL and not our dev path convention. Leave alone.
        console.warn(
          `  [skip] ${speaker.profile}:${lineId} — unexpected URL form: ${url}`,
        );
        skippedOther++;
        continue;
      }

      const mp3Path = path.resolve(REPO_ROOT, speaker.audioDir, `${lineId}.mp3`);
      if (!fs.existsSync(mp3Path)) {
        console.warn(
          `  [miss] ${speaker.profile}:${lineId} — manifest points at ${url} but local file is missing`,
        );
        missingFile++;
        continue;
      }

      const s3Key = `${s3PrefixFor(lineId)}/${speaker.profile}/${lineId}.mp3`;
      const cdnUrl = cdnUrlFor(s3Key);

      if (dryRun) {
        console.log(
          `  [plan] ${speaker.profile}:${lineId} → s3://${BUCKET}/${s3Key}`,
        );
        uploaded++;
        continue;
      }

      try {
        const body = fs.readFileSync(mp3Path);
        process.stdout.write(
          `  [up]   ${speaker.profile}:${lineId} → s3://${BUCKET}/${s3Key}...`,
        );
        // @ts-expect-error — dynamic import typing
        await s3.send(
          // @ts-expect-error — dynamic import typing
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
            Body: body,
            ContentType: "audio/mpeg",
            CacheControl: "public, max-age=31536000",
          }),
        );
        manifest[lineId] = cdnUrl;
        manifestDirty = true;
        // Flush after each successful upload so a crash/SIGINT doesn't
        // lose completed work.
        saveManifest(speaker.manifestPath, manifest);
        uploaded++;
        console.log(` ✓ ${(body.length / 1024).toFixed(0)}KB`);
        // Gentle pacing.
        await new Promise((r) => setTimeout(r, 50));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(` ✗ ${msg}`);
        errors.push({ id: `${speaker.profile}:${lineId}`, error: msg });
      }
    }

    if (manifestDirty && !dryRun) {
      saveManifest(speaker.manifestPath, manifest);
    }
  }

  console.log("\n═══ COMPLETE ═══");
  console.log(`${dryRun ? "Would upload" : "Uploaded"}:      ${uploaded}`);
  console.log(`Already CDN:        ${alreadyCdn}`);
  console.log(`Local file missing: ${missingFile}`);
  console.log(`Other skipped:      ${skippedOther}`);
  console.log(`Errors:             ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) console.log(`  - ${e.id}: ${e.error}`);
  }

  if (dryRun && uploaded > 0) {
    // Non-zero exit lets CI scripts wire this in as a readiness check.
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
