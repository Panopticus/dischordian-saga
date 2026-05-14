/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — coverage parity test

   The May 2026 producer drop ships 819 binaries under
   apps/client/public/{art,audio}. The typed manifest under
   apps/shared/aaaArtArchive/ must reach every one of them —
   if it doesn't, an asset is dark on the CDN. If it reaches
   one that isn't on disk, the upload script will 404.

   This test compares on-disk paths to the manifest's URL
   set (translated back to repo-relative paths) and fails on
   any drift. It also smoke-checks the per-category counts
   so a producer adding a single new asset doesn't silently
   regress the wiring.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

import { PUBLIC_ASSET_BASE } from "@shared/lib/assetUrl";
import {
  allArchiveUrls,
  archiveCountByCategory,
} from "./index";

const PUBLIC_ROOT = join(process.cwd(), "apps", "client", "public");
// Sub-directories the AAA producer drop claims as its scope. Other
// subdirectories under apps/client/public/{art,audio} (Prelude room
// art, VFX, ambient music, etc.) belong to separate manifests and
// must NOT be flagged as AAA orphans.
const TRACKED_ROOTS = [
  "art/card_game",
  "art/character_sheets",
  "art/cinematics",
  "art/fight",
  "art/trade_empire",
  "audio/sfx",
  "audio/stage_music",
  "audio/voice_barks",
] as const;

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

async function listOnDiskRelativePaths(): Promise<Set<string>> {
  const paths = new Set<string>();
  for (const r of TRACKED_ROOTS) {
    const root = join(PUBLIC_ROOT, r);
    try {
      await stat(root);
    } catch {
      continue;
    }
    for await (const f of walk(root)) {
      paths.add(relative(PUBLIC_ROOT, f).split("\\").join("/"));
    }
  }
  return paths;
}

function manifestRelativePaths(): Set<string> {
  const out = new Set<string>();
  for (const url of allArchiveUrls()) {
    if (!url.startsWith(PUBLIC_ASSET_BASE)) {
      throw new Error(
        `manifest URL does not use PUBLIC_ASSET_BASE: ${url}`,
      );
    }
    const rel = url.slice(PUBLIC_ASSET_BASE.length).replace(/^\/+/, "");
    out.add(rel);
  }
  return out;
}

describe("aaaArtArchive manifest", () => {
  it("category counts match the May 2026 producer drop", () => {
    expect(archiveCountByCategory()).toEqual({
      // 25 fighters × 21 poses + 1 Locke crouch_attack
      fightSprites: 25 * 21 + 1,
      // 15 stages × {bg, mg, fg}
      fightStages: 15 * 3,
      // 17 HUD ids × {final, _original}
      fightHud: 17 * 2,
      // 17 VFX ids × {final, _original}
      fightVfx: 17 * 2,
      // 8 card vfx × 2 + 7 soul stones × 2
      cardGame: 8 * 2 + 7 * 2,
      // 2 frames + 5 species + 5 classes + 6 attrs (×2) + 7 backgrounds (final-only)
      characterSheets: (2 + 5 + 5 + 6) * 2 + 7,
      // 3 videos + 5 stills + 5 epigraphs + 3 loops + 7 witnessing × 2
      cinematics: 3 + 5 + 5 + 3 + 7 * 2,
      // 7 buildings + 7 goods + 3 ships + 3 ui buttons + 2 currencies (×2)
      // + 1 dashboard bg + 1 map + 1 sea-lane (final-only)
      tradeEmpire: (7 + 7 + 3 + 3 + 2) * 2 + 3,
      // 15 stage music + 3 voice barks + 2 fight sfx + 10 card sfx
      fightAudio: 15 + 3 + 2 + 10,
    });
  });

  it("every on-disk archive file is reachable through the manifest", async () => {
    const onDisk = await listOnDiskRelativePaths();
    if (onDisk.size === 0) {
      // CI / minimal-checkout environments may not have the binaries
      // staged. The producer drop is gitignored, so this is expected
      // off the dev box; treat the assertion as vacuous in that case.
      return;
    }
    const manifest = manifestRelativePaths();
    const missing: string[] = [];
    for (const p of onDisk) {
      if (!manifest.has(p)) missing.push(p);
    }
    expect(missing).toEqual([]);
  });

  it("every manifest URL points at an on-disk archive file (when staged)", async () => {
    const onDisk = await listOnDiskRelativePaths();
    if (onDisk.size === 0) return;
    const manifest = manifestRelativePaths();
    const orphaned: string[] = [];
    for (const p of manifest) {
      if (!onDisk.has(p)) orphaned.push(p);
    }
    expect(orphaned).toEqual([]);
  });
});
