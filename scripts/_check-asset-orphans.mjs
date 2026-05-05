#!/usr/bin/env node
/**
 * Asset orphan GC — find S3 keys under cdn/client-public/ that no
 * longer have a matching reference in the codebase.
 *
 * Workflow:
 *   1. List every key under the CDN prefix.
 *   2. Grep the codebase for `assetUrl(...)` calls + literal CDN
 *      URLs + manifest exports.
 *   3. Subtract referenced keys from listed keys → orphans.
 *
 * Output:
 *   - Stdout: count + sample of orphans (first 50).
 *   - --apply: actually delete them. Off by default.
 *   - --json: emit full orphan list as JSON.
 *
 * Run from repo root:
 *   AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
 *     node scripts/_check-asset-orphans.mjs
 *
 * Mirrors `_vo-purge-zombies.mjs` but for art / video / static-game
 * assets. Designed to be run quarterly — frequent enough that
 * orphans don't accumulate, infrequent enough that deletes don't
 * race a fresh upload.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION ?? "us-east-2";
const BUCKET = process.env.S3_BUCKET ?? "dgrsart";
const PREFIX = "cdn/client-public/";

const APPLY = process.argv.includes("--apply");
const JSON_OUT = process.argv.includes("--json");

const client = new S3Client({ region: REGION });

async function listAllKeys() {
  const keys = [];
  let token;
  do {
    const out = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
      ContinuationToken: token,
    }));
    for (const o of out.Contents ?? []) {
      if (o.Key) keys.push(o.Key);
    }
    token = out.IsTruncated ? out.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

function findReferencedKeys() {
  // Grep for either:
  //   - assetUrl("art/foo.webp")  → "art/foo.webp"
  //   - https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/foo.webp
  //   - bare "art/...", "audio/...", "videos/...", "music/..." string literals
  // We're permissive: a single grep produces a superset of "live"
  // references; the orphan set is `listed - referenced`.
  const cmd = [
    "git grep -h -oE",
    `'(art|audio|videos|music|games)/[A-Za-z0-9_./-]+\\.(webp|avif|png|jpe?g|mp3|mp4|webm|json|glb|gltf)'`,
    "-- 'apps/' 'docs/' 'scripts/'",
  ].join(" ");
  let output = "";
  try {
    output = execSync(cmd, { encoding: "utf8" });
  } catch (err) {
    // git grep returns 1 if no match — that's fine.
    output = (err.stdout ?? "").toString();
  }
  return new Set(output.split("\n").filter(Boolean));
}

(async () => {
  console.error(`[orphans] listing ${BUCKET}/${PREFIX} ...`);
  const keys = await listAllKeys();
  console.error(`[orphans] ${keys.length} keys found`);

  const referenced = findReferencedKeys();
  console.error(`[orphans] ${referenced.size} unique paths referenced in code`);

  const orphans = [];
  for (const key of keys) {
    // Strip the bucket prefix to compare against codebase refs.
    const relative = key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key;
    if (!referenced.has(relative)) orphans.push(key);
  }

  if (JSON_OUT) {
    process.stdout.write(JSON.stringify({ count: orphans.length, orphans }, null, 2));
    return;
  }

  console.log(`\n${orphans.length} orphan(s) on S3 not referenced anywhere:`);
  for (const k of orphans.slice(0, 50)) console.log("  " + k);
  if (orphans.length > 50) console.log(`  … ${orphans.length - 50} more`);

  if (!APPLY) {
    console.log("\nDry run. Pass --apply to delete.");
    return;
  }

  console.log("\nDeleting orphans...");
  for (const k of orphans) {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: k }));
    console.log("  deleted " + k);
  }
})().catch((err) => {
  console.error("[orphans] failed:", err);
  process.exit(1);
});
