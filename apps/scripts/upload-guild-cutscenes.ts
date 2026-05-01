/**
 * Upload the producer-delivered guild-cutscene bundle directly to
 * s3://dgrsart/cdn/client-public/{art,videos}/guild-cutscenes/<category>/
 *
 * Skips the apps/client/public/ staging step that
 * upload-public-to-s3.ts uses; the 774 MB bundle is intended to live
 * on the CDN, not in the working tree. Path layout is locked to the
 * registry in apps/shared/expansionArt/guildCutscenesManifest.ts —
 * this script and that file must agree on the
 * art/guild-cutscenes/<cat>/...png and videos/guild-cutscenes/<cat>/...mp4
 * key shape, otherwise the runtime will 404.
 *
 * Usage:
 *   pnpm tsx apps/scripts/upload-guild-cutscenes.ts --bundle=/tmp/guild_cs_extract
 *   pnpm tsx apps/scripts/upload-guild-cutscenes.ts --bundle=/tmp/guild_cs_extract --dry-run
 *   pnpm tsx apps/scripts/upload-guild-cutscenes.ts --bundle=/tmp/guild_cs_extract --only=f4_abilities
 *
 * The bundle directory must contain:
 *   <bundle>/stills/<category>/*.png
 *   <bundle>/videos/<category>/*.mp4
 * matching the producer zip layout (DischordianSaga_GuildCutscenes_Complete.zip).
 *
 * Requires AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in env with
 * s3:PutObject + s3:HeadObject on the dgrsart bucket. Same idempotent
 * ETag-compare pattern as upload-public-to-s3.ts.
 */

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public";
const CONCURRENCY = 16;

const CATEGORIES = [
  "f1_onboarding",
  "f2_daily",
  "f2_emotes",
  "f3_combat",
  "f4_abilities",
  "f5_guild_hall",
] as const;
type Category = (typeof CATEGORIES)[number];

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".mp4": "video/mp4",
};

interface Args {
  bundle: string;
  dryRun: boolean;
  only: Category | null;
}

function parseArgs(argv: string[]): Args {
  const dryRun = argv.includes("--dry-run");
  const bundleArg = argv.find((a) => a.startsWith("--bundle="));
  if (!bundleArg) {
    throw new Error(
      "missing --bundle=<path>; pass the directory the producer zip was extracted to",
    );
  }
  const bundle = bundleArg.slice("--bundle=".length);
  const onlyArg = argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? (onlyArg.slice("--only=".length) as Category) : null;
  if (only && !CATEGORIES.includes(only)) {
    throw new Error(`--only must be one of: ${CATEGORIES.join(", ")}`);
  }
  return { bundle, dryRun, only };
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

async function md5(path: string): Promise<string> {
  const buf = await readFile(path);
  return createHash("md5").update(buf).digest("hex");
}

async function objectMatches(
  client: S3Client,
  key: string,
  localMd5: string,
  localSize: number,
): Promise<boolean> {
  try {
    const head = (await client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
    )) as { ETag?: string; ContentLength?: number };
    const remoteEtag = head.ETag?.replace(/"/g, "") ?? "";
    const remoteSize = head.ContentLength ?? -1;
    return remoteEtag === localMd5 && remoteSize === localSize;
  } catch {
    return false;
  }
}

/**
 * Map a local path inside the producer bundle to its CDN S3 key.
 *   <bundle>/stills/f4_abilities/cs_sig_1_light_start.png
 *     → cdn/client-public/art/guild-cutscenes/f4_abilities/cs_sig_1_light_start.png
 *   <bundle>/videos/f4_abilities/cs_sig_1_light.mp4
 *     → cdn/client-public/videos/guild-cutscenes/f4_abilities/cs_sig_1_light.mp4
 */
function bundlePathToKey(bundleRoot: string, localPath: string): string | null {
  const rel = relative(bundleRoot, localPath).split("\\").join("/");
  const [bucketName, category, ...rest] = rel.split("/");
  if (rest.length === 0) return null;
  if (bucketName !== "stills" && bucketName !== "videos") return null;
  if (!CATEGORIES.includes(category as Category)) return null;
  const cdnDir = bucketName === "stills" ? "art" : "videos";
  return `${PREFIX}/${cdnDir}/guild-cutscenes/${category}/${rest.join("/")}`;
}

async function uploadOne(
  client: S3Client,
  localPath: string,
  key: string,
  dryRun: boolean,
): Promise<"uploaded" | "skipped" | "dry-run"> {
  const { size } = await stat(localPath);
  const hash = await md5(localPath);
  if (await objectMatches(client, key, hash, size)) return "skipped";
  if (dryRun) return "dry-run";

  const ext = extname(localPath).toLowerCase();
  const body = await readFile(localPath);
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
      ServerSideEncryption: "AES256",
    }),
  );
  return "uploaded";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    console.error(
      "ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in env.",
    );
    process.exit(1);
  }

  // Verify the bundle exists.
  try {
    await stat(args.bundle);
  } catch {
    console.error(`ERROR: bundle directory not found: ${args.bundle}`);
    process.exit(1);
  }

  const client = new S3Client({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
    ...(process.env.AWS_UPLOAD_DEBUG ? { logger: console } : {}),
  });

  // Collect candidate files. If --only=<category>, restrict to that
  // category's stills + videos subdirs.
  const roots: string[] = args.only
    ? [join(args.bundle, "stills", args.only), join(args.bundle, "videos", args.only)]
    : [join(args.bundle, "stills"), join(args.bundle, "videos")];

  const files: { local: string; key: string }[] = [];
  for (const root of roots) {
    try {
      await stat(root);
    } catch {
      continue;
    }
    for await (const f of walk(root)) {
      const key = bundlePathToKey(args.bundle, f);
      if (key) files.push({ local: f, key });
    }
  }

  console.log(
    `${args.dryRun ? "[dry-run] " : ""}found ${files.length} files under ${args.bundle}` +
      (args.only ? ` (only=${args.only})` : ""),
  );

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let done = 0;

  const queue = [...files];
  const workers: Promise<void>[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(
      (async () => {
        while (queue.length) {
          const next = queue.shift();
          if (!next) return;
          try {
            const result = await uploadOne(client, next.local, next.key, args.dryRun);
            if (result === "skipped") skipped++;
            else uploaded++;
            done++;
            if (done % 25 === 0 || done === files.length) {
              console.log(
                `  ${done}/${files.length}  uploaded=${uploaded}  skipped=${skipped}  failed=${failed}`,
              );
            }
          } catch (err) {
            failed++;
            const e = err as Error & {
              name?: string;
              code?: string;
              $metadata?: { httpStatusCode?: number; requestId?: string };
              Code?: string;
            };
            const parts = [
              e.name ? `name=${e.name}` : null,
              e.code ? `code=${e.code}` : null,
              e.Code ? `Code=${e.Code}` : null,
              e.$metadata?.httpStatusCode ? `http=${e.$metadata.httpStatusCode}` : null,
              e.$metadata?.requestId ? `req=${e.$metadata.requestId}` : null,
              e.message ? `msg=${e.message}` : null,
            ].filter(Boolean);
            console.error(`FAIL ${next.key}: ${parts.join(" ")}`);
            if (process.env.AWS_UPLOAD_DEBUG) console.error(err);
          }
        }
      })(),
    );
  }
  await Promise.all(workers);

  console.log(
    `\n${args.dryRun ? "[dry-run] " : ""}done — uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
