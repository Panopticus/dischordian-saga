#!/usr/bin/env node
/* Upload converted .webp assets from /tmp/aaa_assets/extracted to
   s3://dgrsart/cdn/client-public/.

   Layout:
     trade_empire/<producer-subdir>/*.webp  →  art/trade-empire/<canonical>/<file>
     expansion_cards/<rarity>/*.webp        →  art/expansions/hierarchy-of-damned/<canonical>/<file>

   Idempotent: skips uploads where the S3 ETag already matches the
   local md5. Cache-Control: public, max-age=31536000, immutable.
   Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env.

   Flags:
     --dry-run   plan only, no PUTs
     --only=trade_empire | expansion_cards   restrict scope
*/
import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const SRC = "/tmp/aaa_assets/extracted";
const BUCKET = "dgrsart";
const REGION = "us-east-2";
const PREFIX = "cdn/client-public";
const CACHE = "public, max-age=31536000, immutable";
const CONCURRENCY = 12;

/* Producer subdir → canonical CDN segment for Trade Empire art. */
const TE_MAP = {
  wonders: "wonders",
  era_banners: "eras",
  encounters: "encounters",
  doctrine_banners: "doctrines",
  doctrines: "doctrines",
  fleet_silhouettes: "fleet",
  pirate_portrait: "fleet",
  civic_icons: "civics",
  sector_paintings: "sectors",
};

/* Producer rarity dir → canonical CDN segment for Hierarchy of the Damned. */
const HOD_MAP = {
  c_suite_mythic: "c-suite",
  vp_legendary: "vps",
  director_epic: "directors",
  manager_rare: "managers",
  analyst_uncommon: "analysts",
  intern_common: "interns",
  act_exclusives: "act-exclusives",
  act_exclusive: "act-exclusives",
  special_editions: "special-editions",
  special_edition: "special-editions",
};

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice("--only=".length) : null;

async function planFor(rootName, subdirMap, cdnRoot) {
  const root = join(SRC, rootName);
  const out = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const target = subdirMap[e.name];
    if (!target) {
      console.warn(`[skip] unmapped producer subdir: ${rootName}/${e.name}`);
      continue;
    }
    const subPath = join(root, e.name);
    for (const f of await readdir(subPath)) {
      if (!f.endsWith(".webp")) continue;
      const abs = join(subPath, f);
      const s = await stat(abs);
      out.push({
        abs,
        key: `${PREFIX}/${cdnRoot}/${target}/${f}`,
        size: s.size,
      });
    }
  }
  return out;
}

async function shouldSkip(client, key, body) {
  try {
    const head = await client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
    );
    const localEtag = `"${createHash("md5").update(body).digest("hex")}"`;
    return head.ETag === localEtag;
  } catch {
    return false;
  }
}

async function uploadOne(client, job) {
  const body = await readFile(job.abs);
  if (await shouldSkip(client, job.key, body)) return "skipped";
  if (DRY_RUN) {
    console.log(`[dry] ${job.key} (${(job.size / 1024).toFixed(1)} KB)`);
    return "dryrun";
  }
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: job.key,
      Body: body,
      ContentType: "image/webp",
      CacheControl: CACHE,
    }),
  );
  console.log(`✓ ${job.key} (${(job.size / 1024).toFixed(1)} KB)`);
  return "uploaded";
}

async function main() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY required in env");
  }
  const client = new S3Client({ region: REGION });

  const jobs = [];
  if (!ONLY || ONLY === "trade_empire") {
    jobs.push(...(await planFor("trade_empire", TE_MAP, "art/trade-empire")));
  }
  if (!ONLY || ONLY === "expansion_cards") {
    jobs.push(
      ...(await planFor(
        "expansion_cards",
        HOD_MAP,
        "art/expansions/hierarchy-of-damned",
      )),
    );
  }
  console.log(`Planned ${jobs.length} uploads. dryRun=${DRY_RUN}`);

  let cursor = 0, uploaded = 0, skipped = 0, dry = 0, failed = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < jobs.length) {
        const idx = cursor++;
        try {
          const r = await uploadOne(client, jobs[idx]);
          if (r === "uploaded") uploaded++;
          else if (r === "skipped") skipped++;
          else dry++;
        } catch (err) {
          failed++;
          console.error(`FAIL ${jobs[idx].key}: ${err.message}`);
        }
      }
    }),
  );
  console.log(
    `Done. uploaded=${uploaded} skipped=${skipped} dry=${dry} failed=${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
