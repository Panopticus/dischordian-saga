/**
 * Upload apps/client/public/{art,audio,videos,music,games}/** to
 * s3://dgrsart/cdn/client-public/**. Must run before the asset-url
 * codemod; otherwise the deployed app will 404 on every media URL.
 *
 * Usage:
 *   pnpm tsx apps/scripts/upload-public-to-s3.ts            # real upload
 *   pnpm tsx apps/scripts/upload-public-to-s3.ts --dry-run  # print only
 *   pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art # one dir
 *
 * Requires AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in env (or any
 * other credential source resolvable by @aws-sdk/credential-provider-node)
 * with s3:PutObject + s3:HeadObject on the dgrsart bucket.
 */

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public";
const PUBLIC_ROOT = join(process.cwd(), "apps", "client", "public");
const TRACKED_DIRS = ["art", "audio", "videos", "music", "games"] as const;
const CONCURRENCY = 16;

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".wasm": "application/wasm",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

interface Args {
  dryRun: boolean;
  only: string | null;
}

function parseArgs(argv: string[]): Args {
  const dryRun = argv.includes("--dry-run");
  const onlyArg = argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice("--only=".length) : null;
  if (only && !TRACKED_DIRS.includes(only as (typeof TRACKED_DIRS)[number])) {
    throw new Error(`--only must be one of: ${TRACKED_DIRS.join(", ")}`);
  }
  return { dryRun, only };
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
  } catch (err: unknown) {
    if ((err as { name?: string }).name === "NotFound") return false;
    if ((err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404)
      return false;
    throw err;
  }
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
    }),
  );
  return "uploaded";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const client = new S3Client({ region: REGION });

  const dirs = args.only ? [args.only] : [...TRACKED_DIRS];
  const files: string[] = [];
  for (const d of dirs) {
    const root = join(PUBLIC_ROOT, d);
    try {
      await stat(root);
    } catch {
      console.warn(`skip: ${root} does not exist`);
      continue;
    }
    for await (const f of walk(root)) files.push(f);
  }

  console.log(
    `${args.dryRun ? "[dry-run] " : ""}found ${files.length} files under ${dirs
      .map((d) => `public/${d}`)
      .join(", ")}`,
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
          const local = queue.shift();
          if (!local) return;
          const rel = relative(PUBLIC_ROOT, local).split("\\").join("/");
          const key = `${PREFIX}/${rel}`;
          try {
            const result = await uploadOne(client, local, key, args.dryRun);
            if (result === "skipped") skipped++;
            else uploaded++;
            done++;
            if (done % 100 === 0 || done === files.length) {
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
            console.error(`FAIL ${rel}: ${parts.join(" ")}`);
            if (process.env.AWS_UPLOAD_DEBUG) {
              console.error(err);
            }
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
