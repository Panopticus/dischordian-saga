/**
 * Vitest suite for the NEW_ART_{1,2,3} drop manifest.
 *
 * Asserts shape + counts. Drop totals: 1,838 files across 16 top-
 * level categories.
 */
import { describe, expect, it } from "vitest";

import {
  NEW_ART_ASSETS,
  NEW_ART_TOTAL,
  NEW_ART_VEHICLE_ZIPDIRS,
  NEW_ART_DOCTRINE_ARCHETYPES,
  NEW_ART_DOCTRINE_BRANCHES,
  newArtAssetsByCategory,
  newArtChapterCardUrl,
  newArtCountByCategory,
  newArtCoverageReport,
  newArtDestinations,
  newArtSignatureCardUrl,
  newArtUrl,
  newArtVehicleBaselineUrl,
} from "../newArtManifest";

describe("newArtManifest — NEW_ART_{1,2,3} drop", () => {
  it("loads 1,838 entries", () => {
    expect(NEW_ART_TOTAL).toBe(1838);
    expect(NEW_ART_ASSETS.length).toBe(1838);
  });

  it("every entry has a unique relPath", () => {
    const seen = new Set<string>();
    for (const a of NEW_ART_ASSETS) {
      expect(seen.has(a.relPath)).toBe(false);
      seen.add(a.relPath);
    }
    expect(seen.size).toBe(1838);
  });

  it("every relPath starts with art/", () => {
    for (const a of NEW_ART_ASSETS) {
      expect(a.relPath.startsWith("art/")).toBe(true);
    }
  });

  it("covers 16 top-level art/<category>/ buckets", () => {
    const expectedCounts: Record<string, number> = {
      fight: 605,
      portraits: 522,
      overlays: 180,
      characters: 104,
      ui: 90,
      destinations: 68,
      sprites: 68,
      signature_cards: 60,
      chapter_cards: 28,
      character_sheets: 25,
      trade_empire: 25,
      cinematics: 20,
      vehicles: 17,
      card_game: 15,
      room_overlays: 7,
      manuscript_vault: 4,
    };
    let total = 0;
    for (const [cat, count] of Object.entries(expectedCounts)) {
      expect(newArtCountByCategory(cat as never)).toBe(count);
      total += count;
    }
    expect(total).toBe(1838);
  });

  it("delivers all 7 vehicle baselines (closes _MISSING_ART_PROMPTS §C)", () => {
    expect(NEW_ART_VEHICLE_ZIPDIRS.length).toBe(7);
    for (const zip of NEW_ART_VEHICLE_ZIPDIRS) {
      const url = newArtVehicleBaselineUrl(zip);
      expect(url, `${zip} should resolve`).toBeDefined();
      expect(url!).toMatch(/^https:\/\/dgrsart\.s3/);
    }
  });

  it("delivers 60 canonical destinations (closes _MISSING_ART_PROMPTS §D)", () => {
    const d = newArtDestinations();
    expect(d.tradeEmpire.length).toBe(10);
    expect(d.crucible.length).toBe(15);
    expect(d.towerDefense.length).toBe(10);
    expect(d.castleOfDeath.length).toBe(20);
    expect(d.quizShow.length).toBe(5);
    expect(
      d.tradeEmpire.length +
        d.crucible.length +
        d.towerDefense.length +
        d.castleOfDeath.length +
        d.quizShow.length,
    ).toBe(60);
    expect(d.panoramas.length).toBe(8);
  });

  it("delivers 60 archetype × doctrine signature cards (12 × 5)", () => {
    expect(NEW_ART_DOCTRINE_ARCHETYPES.length).toBe(12);
    expect(NEW_ART_DOCTRINE_BRANCHES.length).toBe(5);
    let resolved = 0;
    for (const a of NEW_ART_DOCTRINE_ARCHETYPES) {
      for (const b of NEW_ART_DOCTRINE_BRANCHES) {
        if (newArtSignatureCardUrl(a, b)) resolved += 1;
      }
    }
    expect(resolved).toBe(60);
  });

  it("delivers 28 chapter cards", () => {
    expect(newArtCountByCategory("chapter_cards")).toBe(28);
  });

  it("composes canonical CDN URLs via newArtUrl", () => {
    const url = newArtUrl("art/portraits/master_faces/elara.png");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/portraits/master_faces/elara.png",
    );
  });

  it("coverage report reports the full delivered surface", () => {
    const r = newArtCoverageReport();
    expect(r.total).toBe(1838);
    expect(r.vehiclesCovered.length).toBe(7);
    expect(r.destinationsCovered).toBe(60);
    expect(r.byCategory.size).toBe(16);
  });

  it("category accessor returns the exact entry count", () => {
    expect(newArtAssetsByCategory("fight").length).toBe(605);
    expect(newArtAssetsByCategory("portraits").length).toBe(522);
  });
});
