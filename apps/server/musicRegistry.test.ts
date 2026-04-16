import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  MUSIC_TRACKS,
  getMusicTrack,
  getMusicVariantUrl,
  getAllMusicVariantUrls,
  getRandomMusicVariant,
  getRandomMusicVariantExcluding,
  collectMusicFilePaths,
  countMusicTracks,
  countMusicFiles,
  type MusicTrackId,
} from "../shared/musicRegistry";

/* ═══════════════════════════════════════════════════════
   MUSIC REGISTRY TESTS

   Structural invariants + disk-presence checks for the
   Dischordia Songs delivery. All tests must pass.
   ═══════════════════════════════════════════════════════ */

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function resolveFromRepoRoot(p: string): string {
  return path.resolve(REPO_ROOT, p);
}

/* ─── STRUCTURAL ─── */

describe("Music registry — structural invariants", () => {
  it("has at least 10 tracks", () => {
    expect(MUSIC_TRACKS.length).toBeGreaterThanOrEqual(10);
  });

  it("track ids are all unique", () => {
    const ids = MUSIC_TRACKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("track slugs are all unique", () => {
    const slugs = MUSIC_TRACKS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every track has variantCount >= 1", () => {
    for (const track of MUSIC_TRACKS) {
      expect(track.variantCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("every non-sting track has bpm > 0", () => {
    for (const track of MUSIC_TRACKS) {
      if (!track.isSting) {
        expect(track.bpm).toBeGreaterThan(0);
      }
    }
  });

  it("slug is kebab-case", () => {
    for (const track of MUSIC_TRACKS) {
      expect(track.slug).toMatch(/^[a-z][a-z0-9-]*$/u);
    }
  });

  it("id is snake_case", () => {
    for (const track of MUSIC_TRACKS) {
      expect(track.id).toMatch(/^[a-z][a-z0-9_]*$/u);
    }
  });
});

/* ─── URL BUILDING ─── */

describe("Music registry — URL building", () => {
  it("getMusicVariantUrl returns a valid public path", () => {
    const url = getMusicVariantUrl("main_menu", 1);
    expect(url).toBe("/audio/music/main-menu/v1.mp3");
  });

  it("clamps variant index into valid range", () => {
    expect(getMusicVariantUrl("main_menu", 0)).toBe("/audio/music/main-menu/v1.mp3");
    expect(getMusicVariantUrl("main_menu", 99)).toBe(
      `/audio/music/main-menu/v${getMusicTrack("main_menu").variantCount}.mp3`,
    );
  });

  it("getAllMusicVariantUrls returns one url per variant", () => {
    const urls = getAllMusicVariantUrls("trade_combat");
    expect(urls.length).toBe(getMusicTrack("trade_combat").variantCount);
    expect(urls[0]).toBe("/audio/music/trade-combat/v1.mp3");
    expect(urls[urls.length - 1]).toBe(
      `/audio/music/trade-combat/v${urls.length}.mp3`,
    );
  });

  it("getMusicTrack throws for unknown ids", () => {
    expect(() => getMusicTrack("bogus_track" as unknown as MusicTrackId)).toThrow();
  });
});

/* ─── RANDOMIZATION ─── */

describe("Music registry — random variant selection", () => {
  it("getRandomMusicVariant returns a valid variant url", () => {
    const url = getRandomMusicVariant("arena_battle", () => 0.5);
    const allUrls = getAllMusicVariantUrls("arena_battle");
    expect(allUrls).toContain(url);
  });

  it("single-variant tracks always return the same url", () => {
    const url1 = getRandomMusicVariant("lore_quiz", () => 0.0);
    const url2 = getRandomMusicVariant("lore_quiz", () => 0.99);
    expect(url1).toBe(url2);
  });

  it("seeded RNG produces deterministic output", () => {
    // rng returns exactly 0.5 → floor(0.5 * variantCount) + 1 = 2 for a 3-variant track
    const url = getRandomMusicVariant("main_menu", () => 0.5);
    expect(url).toBe("/audio/music/main-menu/v2.mp3");
  });

  it("getRandomMusicVariantExcluding never returns the excluded url", () => {
    const trackId: MusicTrackId = "trade_combat"; // 4 variants
    const last = "/audio/music/trade-combat/v2.mp3";
    // Try multiple rng values to confirm exclusion
    for (let i = 0; i < 10; i++) {
      const rngVal = i / 10;
      const url = getRandomMusicVariantExcluding(trackId, last, () => rngVal);
      expect(url).not.toBe(last);
    }
  });

  it("excluding-last behaves the same as regular when variantCount is 1", () => {
    const url = getRandomMusicVariantExcluding("lore_quiz", "/anything", () => 0.5);
    expect(url).toBe("/audio/music/lore-quiz/v1.mp3");
  });

  it("all variants are reachable across many rng draws", () => {
    const trackId: MusicTrackId = "character_select"; // 3 variants
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(getRandomMusicVariant(trackId, () => Math.random()));
    }
    expect(seen.size).toBe(getMusicTrack(trackId).variantCount);
  });
});

/* ─── DISK PRESENCE ─── */

describe("Music registry — disk presence", () => {
  it("every registered variant exists on disk", () => {
    const missing: string[] = [];
    for (const p of collectMusicFilePaths()) {
      if (!fs.existsSync(resolveFromRepoRoot(p))) {
        missing.push(p);
      }
    }
    if (missing.length > 0) {
      expect.fail(
        `Missing music files (${missing.length}):\n  ${missing.join("\n  ")}`,
      );
    }
  });

  it("reports music dashboard counts", () => {
    const trackCount = countMusicTracks();
    const fileCount = countMusicFiles();
    // eslint-disable-next-line no-console
    console.log(
      `[music registry] ${trackCount} tracks / ${fileCount} files (variants) on disk`,
    );
    expect(trackCount).toBeGreaterThan(0);
    expect(fileCount).toBeGreaterThanOrEqual(trackCount);
  });
});
