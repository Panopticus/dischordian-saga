#!/usr/bin/env node
/* HEAD-check every URL exposed by the typed art manifests against
   the dgrsart S3 bucket. Reports any 404s — i.e. manifest entries
   whose underlying webp didn't actually upload.

   Covers:
     - Trade Empire art (apps/shared/tradeEmpireArtPrompts.ts)
     - S2 Hierarchy of the Damned (apps/shared/expansionArt/hierarchyOfDamned.ts)
     - Dischordia base-set + tier-grids (apps/shared/expansionArt/dischordiaBaseSet.ts)

   Requires AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (HEAD on a
   private bucket), default region us-east-2.

   Concurrency 16. Run from repo root:
     node scripts/_check-art-coverage.mjs
*/
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { TRADE_EMPIRE_ART_PROMPTS } from "../apps/shared/tradeEmpireArtPrompts.ts";
import { HIERARCHY_OF_DAMNED_ART } from "../apps/shared/expansionArt/hierarchyOfDamned.ts";
import {
  DISCHORDIA_BASE_SET_ART,
  DISCHORDIA_BASE_SET_TIER_GRIDS,
} from "../apps/shared/expansionArt/dischordiaBaseSet.ts";
import {
  CINEMATICS,
  VFX_CLIPS,
} from "../apps/shared/expansionArt/cinematicsManifest.ts";
import { ALBUM1_TRACKS } from "../apps/shared/expansionArt/album1Slideshows.ts";

const BUCKET = "dgrsart";
const REGION = "us-east-2";
const KEY_PREFIX = "cdn/client-public/";
const CONCURRENCY = 16;

const TE_CATEGORY_DIR = {
  wonder: "wonders",
  era_banner: "eras",
  encounter_key_art: "encounters",
  doctrine_banner: "doctrines",
  fleet_silhouette: "fleet",
  pirate_portrait: "fleet",
  civic_icon: "civics",
  sector_painting: "sectors",
};

const jobs = [];
for (const p of TRADE_EMPIRE_ART_PROMPTS) {
  jobs.push({
    label: "trade-empire",
    key: `${KEY_PREFIX}art/trade-empire/${TE_CATEGORY_DIR[p.category]}/${p.assetId}.webp`,
    id: p.assetId,
  });
}
for (const e of HIERARCHY_OF_DAMNED_ART) {
  jobs.push({ label: "hierarchy-of-damned", key: `${KEY_PREFIX}${e.relPath}`, id: e.assetId });
}
for (const e of DISCHORDIA_BASE_SET_ART) {
  jobs.push({ label: "base-set", key: `${KEY_PREFIX}${e.relPath}`, id: e.assetId });
}
for (const e of DISCHORDIA_BASE_SET_TIER_GRIDS) {
  jobs.push({ label: "base-set-grids", key: `${KEY_PREFIX}${e.relPath}`, id: e.assetId });
}
for (const c of CINEMATICS) {
  jobs.push({ label: "cinematics-mp4", key: `${KEY_PREFIX}${c.videoRelPath}`, id: c.id });
  for (const kf of c.keyframeRelPaths) {
    jobs.push({ label: "cinematics-keyframes", key: `${KEY_PREFIX}${kf}`, id: kf });
  }
}
for (const v of VFX_CLIPS) {
  jobs.push({ label: "vfx-mp4", key: `${KEY_PREFIX}${v.videoRelPath}`, id: v.id });
  jobs.push({ label: "vfx-keyframes", key: `${KEY_PREFIX}${v.keyframeRelPath}`, id: v.id });
}
for (const t of ALBUM1_TRACKS) {
  for (const rel of t.frameRelPaths) {
    jobs.push({ label: "album1-slideshows", key: `${KEY_PREFIX}${rel}`, id: `${t.id}/${rel.split("/").pop()}` });
  }
}

console.log(`Planned ${jobs.length} HEAD checks.`);

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY required");
  process.exit(2);
}

const client = new S3Client({ region: REGION });

let cursor = 0;
let ok = 0;
const missing = [];
const tally = {};
const started = Date.now();

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < jobs.length) {
      const idx = cursor++;
      const j = jobs[idx];
      try {
        await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: j.key }));
        ok++;
        tally[j.label] = (tally[j.label] ?? 0) + 1;
      } catch (e) {
        missing.push({ ...j, err: e.name });
      }
      const total = ok + missing.length;
      if (total % 100 === 0 || total === jobs.length) {
        const elapsed = ((Date.now() - started) / 1000).toFixed(1);
        console.log(
          `  ${total}/${jobs.length} (ok=${ok} miss=${missing.length}) — ${elapsed}s`,
        );
      }
    }
  }),
);

console.log("\nPer-pack tally:");
for (const [k, v] of Object.entries(tally)) console.log(`  ${k.padEnd(22)}  ${v}`);

if (missing.length === 0) {
  console.log(`\nALL GOOD — ${ok}/${jobs.length} resolved.`);
  process.exit(0);
}
console.log(`\nMISSING ${missing.length}:`);
for (const m of missing.slice(0, 50)) console.log(`  [${m.label}] ${m.id}  →  ${m.key}`);
if (missing.length > 50) console.log(`  ... (${missing.length - 50} more)`);
process.exit(1);
