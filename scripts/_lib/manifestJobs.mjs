/**
 * Collect every CDN URL that one of the typed manifests references.
 *
 * Returns the union used by both the local-coverage report
 * (`_asset-coverage-report.mjs`) and the anonymous-liveness probe
 * (`_check-cdn-liveness.mjs`) so the two scripts agree on the universe
 * of URLs in scope.
 *
 * Each entry is `{ source, id, relPath }` where relPath is the path
 * under `cdn/client-public/` (i.e. drop the bucket + prefix to get the
 * path inside the public asset tree).
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { TRADE_EMPIRE_ART_PROMPTS } from "../../apps/shared/tradeEmpireArtPrompts.ts";
import { HIERARCHY_OF_DAMNED_ART } from "../../apps/shared/expansionArt/hierarchyOfDamned.ts";
import {
  DISCHORDIA_BASE_SET_ART,
  DISCHORDIA_BASE_SET_TIER_GRIDS,
} from "../../apps/shared/expansionArt/dischordiaBaseSet.ts";
import {
  CINEMATICS,
  VFX_CLIPS,
} from "../../apps/shared/expansionArt/cinematicsManifest.ts";
import { ALBUM1_TRACKS } from "../../apps/shared/expansionArt/album1Slideshows.ts";
import { ALBUM2_TRACKS } from "../../apps/shared/expansionArt/album2Slideshows.ts";
import { ALBUM3_TRACKS } from "../../apps/shared/expansionArt/album3Slideshows.ts";
import { ALBUM4_TRACKS } from "../../apps/shared/expansionArt/album4Slideshows.ts";
import {
  ALBUM5_TRACKS,
  ALBUM5_NARRATOR_PORTRAITS,
  ALBUM5_DIALOG_BACKGROUNDS,
} from "../../apps/shared/expansionArt/album5Slideshows.ts";

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

/** @typedef {{ source: string, id: string, relPath: string }} Job */

/**
 * @param {string} repoRoot
 * @returns {Job[]}
 */
export function collectAllJobs(repoRoot) {
  /** @type {Job[]} */
  const jobs = [];

  for (const p of TRADE_EMPIRE_ART_PROMPTS) {
    jobs.push({
      source: "trade-empire",
      id: p.assetId,
      relPath: `art/trade-empire/${TE_CATEGORY_DIR[p.category]}/${p.assetId}.webp`,
    });
  }
  for (const e of HIERARCHY_OF_DAMNED_ART) {
    jobs.push({ source: "hierarchy-of-damned", id: e.assetId, relPath: e.relPath });
  }
  for (const e of DISCHORDIA_BASE_SET_ART) {
    jobs.push({ source: "base-set", id: e.assetId, relPath: e.relPath });
  }
  for (const e of DISCHORDIA_BASE_SET_TIER_GRIDS) {
    jobs.push({ source: "base-set-grids", id: e.assetId, relPath: e.relPath });
  }
  for (const c of CINEMATICS) {
    jobs.push({ source: "cinematics-mp4", id: c.id, relPath: c.videoRelPath });
    for (const kf of c.keyframeRelPaths) {
      jobs.push({ source: "cinematics-keyframes", id: kf, relPath: kf });
    }
  }
  for (const v of VFX_CLIPS) {
    jobs.push({ source: "vfx-mp4", id: v.id, relPath: v.videoRelPath });
    jobs.push({ source: "vfx-keyframes", id: v.id, relPath: v.keyframeRelPath });
  }
  for (const t of ALBUM1_TRACKS) {
    for (const rel of t.frameRelPaths) {
      jobs.push({
        source: "album1-slideshows",
        id: `${t.id}/${basename(rel)}`,
        relPath: rel,
      });
    }
  }
  for (const t of ALBUM2_TRACKS) {
    for (const rel of t.frameRelPaths) {
      jobs.push({
        source: "album2-slideshows",
        id: `${t.id}/${basename(rel)}`,
        relPath: rel,
      });
    }
  }
  for (const t of ALBUM3_TRACKS) {
    for (const rel of t.frameRelPaths) {
      jobs.push({
        source: "album3-slideshows",
        id: `${t.id}/${basename(rel)}`,
        relPath: rel,
      });
    }
  }
  for (const t of ALBUM4_TRACKS) {
    for (const rel of t.frameRelPaths) {
      jobs.push({
        source: "album4-slideshows",
        id: `${t.id}/${basename(rel)}`,
        relPath: rel,
      });
    }
  }
  for (const t of ALBUM5_TRACKS) {
    for (const rel of t.frameRelPaths) {
      jobs.push({
        source: "album5-slideshows",
        id: `${t.id}/${basename(rel)}`,
        relPath: rel,
      });
    }
  }
  // Album 5's two auxiliary asset catalogs — narrator portraits and
  // dialog backgrounds — also need anonymous-HEAD coverage so the
  // dialog composite system can verify its full asset set is live.
  for (const p of ALBUM5_NARRATOR_PORTRAITS) {
    jobs.push({
      source: "album5-narrators",
      id: p.id,
      relPath: p.relPath,
    });
  }
  for (const b of ALBUM5_DIALOG_BACKGROUNDS) {
    jobs.push({
      source: "album5-backgrounds",
      id: b.id,
      relPath: b.relPath,
    });
  }

  // preludeAct1Deliverables.ts uses the @/lib/assetUrl vite-alias import,
  // which makes runtime importing painful. Grep-extract path literals
  // — the file is a hand-curated catalog of string constants, regex
  // extraction is stable. Whitespace tolerance picks up multi-line
  // prettier-formatted invocations.
  const deliverablesPath = join(
    repoRoot,
    "apps",
    "client",
    "src",
    "data",
    "preludeAct1Deliverables.ts",
  );
  if (existsSync(deliverablesPath)) {
    const src = readFileSync(deliverablesPath, "utf-8");
    const seen = new Set();
    for (const m of src.matchAll(/pair\(\s*"([^"]+\.png)"/g)) {
      const png = m[1];
      const webp = png.replace(/\.png$/u, ".webp");
      if (!seen.has(png)) {
        seen.add(png);
        jobs.push({ source: "prelude-act1-deliverables", id: png, relPath: png });
      }
      if (!seen.has(webp)) {
        seen.add(webp);
        jobs.push({ source: "prelude-act1-deliverables", id: webp, relPath: webp });
      }
    }
    for (const m of src.matchAll(/assetUrl\(\s*"([^"]+)"/g)) {
      const rel = m[1];
      if (!seen.has(rel)) {
        seen.add(rel);
        jobs.push({ source: "prelude-act1-deliverables", id: rel, relPath: rel });
      }
    }
  }

  return jobs;
}

export const PUBLIC_ASSET_BASE =
  "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public";
