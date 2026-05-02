#!/usr/bin/env node
/* HEAD-check every URL exposed by the typed art manifests against
   the dgrsart S3 bucket. Reports any 404s — i.e. manifest entries
   whose underlying webp didn't actually upload.

   Covers:
     - Trade Empire art (apps/shared/tradeEmpireArtPrompts.ts)
     - S2 Hierarchy of the Damned (apps/shared/expansionArt/hierarchyOfDamned.ts)
     - Dischordia base-set + tier-grids (apps/shared/expansionArt/dischordiaBaseSet.ts)
     - Cinematics + VFX (apps/shared/expansionArt/cinematicsManifest.ts)
       — incl. the dreamer_visions Veo flashes (substrate_pulse,
         iris_collapse, cryo_frost_retreat) added in PR #336
     - Album 1 slideshow frames (apps/shared/expansionArt/album1Slideshows.ts)
     - Title-page music videos + ark-drift loop + opening cinematic
       (apps/client/src/pages/TitlePage.tsx + DischordiaOpeningCinematic.tsx)

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

/* ─── Title-page videos ────────────────────────────────────────────
   Hardcoded mirror of the URLs that TitlePage.tsx + DischordiaOpening
   Cinematic.tsx render at boot. Production-bible §4 flagged these as
   not covered by the probe; adding them here surfaces the upload
   delta (currently 7-9 paths missing per the bible) on every CI run.
   When the producer drops a new title-page MP4, add the path here.
   The list is short enough that hardcoding beats an extra shared
   module + import boundary. */
const TITLE_PAGE_VIDEO_PATHS = [
  // FEATURED_TRANSMISSIONS — apps/client/src/pages/TitlePage.tsx
  "videos/title/music/the-book-of-daniel.mp4",
  "videos/title/music/building-the-architect.mp4",
  "videos/title/music/hypnotized.mp4",
  "videos/title/music/brushstroke-of-the-empire.mp4",
  "videos/title/music/baron-heart-of-time.mp4",
  "videos/title/music/the-last-christmas.mp4",
  // Ark drift loop background — also TitlePage.tsx; ships both
  // webm + mp4 sources so the <video> picks the smaller of the
  // two on supporting browsers.
  "videos/title/ark-drift-loop.webm",
  "videos/title/ark-drift-loop.mp4",
  // DischordiaOpeningCinematic.tsx — the one-shot opening cinematic
  // that plays before the title screen on first session.
  "videos/title/the-dischordia-opening.mp4",
];
for (const rel of TITLE_PAGE_VIDEO_PATHS) {
  jobs.push({
    label: "title-videos",
    key: `${KEY_PREFIX}${rel}`,
    id: rel.split("/").pop(),
  });
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
