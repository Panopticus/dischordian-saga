/**
 * Source-scan: every MP4/WebM URL the title page references at boot
 * is present in the coverage probe's hardcoded title-video list.
 *
 * Why source-scan and not import — TitlePage.tsx pulls React, Vite
 * env, framer-motion, etc.; vitest is configured for `node` env.
 * Reading the source string and matching `assetUrl("videos/title/...")`
 * patterns is the cleanest way to verify the probe stays in sync
 * with the actual title-page rendering.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const repoRoot = path.resolve(__dirname, "..", "..", "..");

const titlePageSrc = fs.readFileSync(
  path.join(repoRoot, "apps/client/src/pages/TitlePage.tsx"),
  "utf-8",
);

const openingCinematicSrc = fs.readFileSync(
  path.join(repoRoot, "apps/client/src/components/DischordiaOpeningCinematic.tsx"),
  "utf-8",
);

const probeSrc = fs.readFileSync(
  path.join(repoRoot, "scripts/_check-art-coverage.mjs"),
  "utf-8",
);

/** Extract every `videos/title/...` path the title page declares.
 *  Captures both:
 *    - assetUrl("videos/title/...") in TitlePage / DischordiaOpening
 *    - filename: "...mp4" inside FEATURED_TRANSMISSIONS spec rows
 *      (hoisted to videos/title/music/<filename>) */
function extractTitleVideoPaths(...sources: string[]): Set<string> {
  const paths = new Set<string>();
  for (const src of sources) {
    // Direct assetUrl("videos/title/...") references. Skip template-
    // string forms like `videos/title/music/${spec.filename}` — those
    // are picked up below via the FeatureSpec filename regex.
    for (const m of src.matchAll(/assetUrl\(\s*["`'](videos\/title\/[^"`']+)["`']\s*,?\s*\)/g)) {
      if (m[1].includes("$")) continue;
      paths.add(m[1]);
    }
    // FEATURED_TRANSMISSIONS uses `filename: "x.mp4"` entries that get
    // hoisted to `videos/title/music/<filename>` by the `assetUrl(\`videos/title/music/${spec.filename}\`)`
    // line in TitlePage.tsx. Capture the filenames directly from
    // those FeatureSpec entries.
    for (const m of src.matchAll(/filename:\s*["`'](\S+\.(?:mp4|webm))["`']/g)) {
      paths.add(`videos/title/music/${m[1]}`);
    }
  }
  return paths;
}

const declared = extractTitleVideoPaths(titlePageSrc, openingCinematicSrc);

describe("coverage probe — title-page videos", () => {
  it("title page declares at least 6 music videos + ark-drift loop + opening cinematic", () => {
    // 6 music videos (FEATURED_TRANSMISSIONS) + ark-drift webm/mp4
    // + opening cinematic = 9 paths minimum.
    expect(declared.size).toBeGreaterThanOrEqual(9);
  });

  it("every declared title video path is in the coverage probe's hardcoded list", () => {
    const missingFromProbe: string[] = [];
    for (const path of declared) {
      if (!probeSrc.includes(`"${path}"`)) {
        missingFromProbe.push(path);
      }
    }
    expect(missingFromProbe).toEqual([]);
  });

  it("the probe declares a `title-videos` job label so the per-pack tally surfaces them", () => {
    expect(probeSrc).toMatch(/label:\s*"title-videos"/);
  });

  it("the probe references the FEATURED_TRANSMISSIONS source path in its comment block (drift guard)", () => {
    expect(probeSrc).toMatch(/TitlePage\.tsx/);
  });
});
