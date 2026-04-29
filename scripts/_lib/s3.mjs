/**
 * S3 upload helpers for the dgrsart bucket.
 *
 * Centralises the idempotent ETag-compare + concurrent-upload loop
 * that lived inline in every producer-drop ingest script. Three
 * concerns:
 *
 *   makeS3Client({region}?)        → S3Client (us-east-2 default)
 *   shouldSkipUpload(client, ...)  → true iff S3 already has a byte-
 *                                   identical object (ETag = MD5 of body)
 *   uploadJobsConcurrent(...)      → pull-model worker pool, idempotent,
 *                                    Cache-Control immutable.
 *
 * Each ingest script is now: `walk → build jobs → uploadJobsConcurrent`.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const DEFAULT_REGION = "us-east-2";
const DEFAULT_BUCKET = "dgrsart";
const DEFAULT_CACHE_CONTROL = "public, max-age=31536000, immutable";

/** @param {{region?: string}} [opts] */
export function makeS3Client(opts = {}) {
  return new S3Client({ region: opts.region ?? DEFAULT_REGION });
}

/**
 * True when S3 already holds the exact bytes at `key` (ETag = MD5).
 * Returns false on any failure (404, network, permission) so the
 * caller falls through to a PUT.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} key
 * @param {Buffer} body
 */
export async function shouldSkipUpload(client, bucket, key, body) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    const localEtag = `"${createHash("md5").update(body).digest("hex")}"`;
    return head.ETag === localEtag;
  } catch {
    return false;
  }
}

/**
 * Upload many local files to S3 in parallel via a pull-model worker
 * pool. Each job is `{ abs, key, contentType }`. Idempotent (HEAD
 * compares ETag before PUT). Returns counts.
 *
 * @param {{client?: S3Client, bucket?: string, jobs: Array<{abs: string, key: string, contentType: string}>,
 *           cacheControl?: string, concurrency?: number, dryRun?: boolean,
 *           onProgress?: (n: number, total: number, counts: {ok:number,skipped:number,dry:number,fail:number}) => void}} opts
 */
export async function uploadJobsConcurrent(opts) {
  const {
    client = makeS3Client(),
    bucket = DEFAULT_BUCKET,
    jobs,
    cacheControl = DEFAULT_CACHE_CONTROL,
    concurrency = 8,
    dryRun = false,
    onProgress,
  } = opts;
  let cursor = 0, ok = 0, skipped = 0, dry = 0, fail = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < jobs.length) {
        const idx = cursor++;
        const j = jobs[idx];
        try {
          const body = await readFile(j.abs);
          if (await shouldSkipUpload(client, bucket, j.key, body)) {
            skipped++;
          } else if (dryRun) {
            dry++;
          } else {
            await client.send(new PutObjectCommand({
              Bucket: bucket,
              Key: j.key,
              Body: body,
              ContentType: j.contentType,
              CacheControl: cacheControl,
            }));
            ok++;
          }
          if (onProgress) onProgress(ok + skipped + dry + fail, jobs.length, { ok, skipped, dry, fail });
        } catch (e) {
          fail++;
          console.error(`FAIL ${j.key}: ${e.message}`);
        }
      }
    }),
  );
  return { ok, skipped, dry, fail };
}

export const S3_DEFAULTS = Object.freeze({
  region: DEFAULT_REGION,
  bucket: DEFAULT_BUCKET,
  cacheControl: DEFAULT_CACHE_CONTROL,
});
