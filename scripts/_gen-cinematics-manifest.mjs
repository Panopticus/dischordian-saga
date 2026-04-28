#!/usr/bin/env node
/* Regenerate the CINEMATICS + VFX_CLIPS arrays in
   apps/shared/expansionArt/cinematicsManifest.ts from the actual
   files on disk (/tmp/cinematics/extracted). Avoids hand-editing
   beat filenames.

   Idempotent — re-run after any cinematics drop refresh.
*/
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { writeFileSync } from "node:fs";

const SRC = "/tmp/cinematics/extracted";

async function listFiles(dir, ext) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(ext))
      .map((e) => e.name)
      .sort();
  } catch { return []; }
}

const CINEMATIC_NAMES = {
  "01_pack_opening": "Card Pack Opening",
  "02_hierarchy_reveal": "Hierarchy of the Damned — Reveal",
  "03_act1_memoir": "Act 1 — Memoir Opens",
  "04_act2_whisper": "Act 2 — Whisper Begins",
  "05_act3_offer": "Act 3 — Offer Presented",
  "06_act4_revelation": "Act 4 — Revelation Meets",
  "07_act5_map": "Act 5 — Map / Year One Close",
  "08_act6_confession": "Act 6 — Confession Spoken",
  "09_act7_convergence": "Act 7 — Convergence Resolves",
};
const ACT_GATES = {
  "03_act1_memoir": 1,
  "04_act2_whisper": 2,
  "05_act3_offer": 3,
  "06_act4_revelation": 4,
  "07_act5_map": 5,
  "08_act6_confession": 6,
  "09_act7_convergence": 7,
};

const cinemaDirs = await readdir(`${SRC}/cinematics`, { withFileTypes: true });
const cinematics = [];
for (const d of cinemaDirs) {
  if (!d.isDirectory()) continue;
  const id = d.name;
  const dir = `${SRC}/cinematics/${id}`;
  const mp4s = await listFiles(dir, ".mp4");
  const keyframes = await listFiles(`${dir}/keyframes`, ".webp");
  cinematics.push({
    id,
    name: CINEMATIC_NAMES[id] ?? id,
    gateAct: ACT_GATES[id],
    videoRelPath: `videos/cinematics/${id}/${mp4s[0]}`,
    keyframeRelPaths: keyframes.map((kf) => `art/cinematics/${id}/keyframes/${kf}`),
  });
}

const vfxCategories = await readdir(`${SRC}/vfx`, { withFileTypes: true });
const vfxClips = [];
for (const d of vfxCategories) {
  if (!d.isDirectory()) continue;
  const cat = d.name;
  const mp4s = await listFiles(`${SRC}/vfx/${cat}`, ".mp4");
  for (const mp4 of mp4s) {
    const slug = mp4.replace(/\.mp4$/, "");
    // keyframe pairing: prefer matching slug (vfx_X → kf_X), fall back
    // to first .webp in the dir
    const allKf = await listFiles(`${SRC}/vfx/${cat}`, ".webp");
    const expectedKf = slug.replace(/^vfx_/, "kf_") + ".webp";
    const altEnd = slug.replace(/^vfx_pack_flip_/, "kf_") + "_end.webp";
    const kf = allKf.includes(expectedKf)
      ? expectedKf
      : allKf.includes(altEnd)
      ? altEnd
      : allKf[0];
    vfxClips.push({
      id: slug,
      category: cat,
      videoRelPath: `videos/vfx/${cat}/${mp4}`,
      keyframeRelPath: `art/vfx/${cat}/${kf}`,
    });
  }
}

console.log(`Cinematics: ${cinematics.length}, VFX clips: ${vfxClips.length}`);
console.log(JSON.stringify({ cinematics, vfxClips }, null, 2).slice(0, 600) + "...");

writeFileSync(
  "/tmp/cinematics/manifest-data.json",
  JSON.stringify({ cinematics, vfxClips }, null, 2),
);
console.log("Wrote /tmp/cinematics/manifest-data.json");
