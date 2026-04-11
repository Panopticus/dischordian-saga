import { describe, it, expect } from "vitest";
import {
  countAssetsByType,
  listAllAssetPaths,
  listSlideshowImageAssets,
} from "./witnessingAssetManifest";
import { SONG_SLIDESHOWS } from "./songSlideshows";

describe("witnessingAssetManifest", () => {
  describe("listSlideshowImageAssets", () => {
    it("produces one entry per registered slideshow", () => {
      const entries = listSlideshowImageAssets();
      expect(entries.length).toBe(Object.keys(SONG_SLIDESHOWS).length);
    });

    it("sorts P0 slideshows before P1 slideshows", () => {
      const entries = listSlideshowImageAssets();
      let seenP1 = false;
      for (const entry of entries) {
        if (entry.priority === "P1") seenP1 = true;
        if (entry.priority === "P0" && seenP1) {
          throw new Error(
            `Out of order: ${entry.slideshowId} is P0 but a P1 entry preceded it`,
          );
        }
      }
    });

    it("every entry's frameImageUrls matches the slideshow's frame count", () => {
      for (const entry of listSlideshowImageAssets()) {
        const def = SONG_SLIDESHOWS[entry.slideshowId];
        expect(entry.frameImageUrls.length).toBe(def.frames.length);
      }
    });

    it("every entry has a hero image path", () => {
      for (const entry of listSlideshowImageAssets()) {
        expect(entry.heroImageUrl.length).toBeGreaterThan(0);
      }
    });

    it("totalImageCount equals frames + 1 hero per slideshow", () => {
      for (const entry of listSlideshowImageAssets()) {
        expect(entry.totalImageCount).toBe(
          entry.frameImageUrls.length + 1,
        );
      }
    });
  });

  describe("countAssetsByType", () => {
    it("slideshowCount matches the registry size", () => {
      const totals = countAssetsByType();
      expect(totals.slideshowCount).toBe(Object.keys(SONG_SLIDESHOWS).length);
    });

    it("P0 count is at least 4 (the §5.5 P0 openers)", () => {
      const totals = countAssetsByType();
      expect(totals.byPriority.P0).toBeGreaterThanOrEqual(4);
    });

    it("heroImageCount equals slideshowCount", () => {
      const totals = countAssetsByType();
      expect(totals.heroImageCount).toBe(totals.slideshowCount);
    });

    it("totalImageCount equals frameImageCount + heroImageCount", () => {
      const totals = countAssetsByType();
      expect(totals.totalImageCount).toBe(
        totals.frameImageCount + totals.heroImageCount,
      );
    });
  });

  describe("listAllAssetPaths", () => {
    it("contains every frame path and every hero path", () => {
      const paths = listAllAssetPaths();
      const totals = countAssetsByType();
      expect(paths.length).toBe(totals.totalImageCount);
    });

    it("every path starts with /assets/slideshows/", () => {
      for (const path of listAllAssetPaths()) {
        expect(path.startsWith("/assets/slideshows/")).toBe(true);
      }
    });

    it("every path has a unique value (no duplicate frame URLs)", () => {
      const paths = listAllAssetPaths();
      expect(new Set(paths).size).toBe(paths.length);
    });
  });
});
