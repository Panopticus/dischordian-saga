/**
 * Vitest suite for the expansion cutscenes manifest (NEW_CUTSCENES_67.zip).
 *
 * Verifies:
 * - Manifest entry count matches producer drop (67 mp4 clips)
 * - All entries fall under the 10 declared categories
 * - Every videoRelPath starts with `art/cutscenes/`
 * - Every entry has a unique id
 * - Producer-supplied poster paths (a subset of entries) end in
 *   `_start.png`
 * - URL resolvers compose canonical CDN paths
 * - Category-bucket lookups are exhaustive
 */
import { describe, expect, it } from "vitest";

import {
  EXPANSION_CUTSCENES,
  EXPANSION_CUTSCENE_TOTAL,
  expansionCutscenePosterUrl,
  expansionCutscenesByCategory,
  expansionCutsceneVideoUrl,
  type ExpansionCutsceneCategory,
} from "../cinematicsManifest";

describe("expansionCutscenes (NEW_CUTSCENES_67.zip)", () => {
  it("loads 67 mp4 entries", () => {
    expect(EXPANSION_CUTSCENE_TOTAL).toBe(67);
    expect(EXPANSION_CUTSCENES.length).toBe(67);
  });

  it("every entry has a unique id", () => {
    const ids = new Set<string>();
    for (const c of EXPANSION_CUTSCENES) {
      expect(ids.has(c.id)).toBe(false);
      ids.add(c.id);
    }
    expect(ids.size).toBe(67);
  });

  it("every videoRelPath is under art/cutscenes/<category>/", () => {
    for (const c of EXPANSION_CUTSCENES) {
      expect(c.videoRelPath.startsWith(`art/cutscenes/${c.category}/`)).toBe(
        true,
      );
      expect(c.videoRelPath.endsWith(".mp4")).toBe(true);
    }
  });

  it("every posterRelPath (when set) ends in _start.png", () => {
    let posterCount = 0;
    for (const c of EXPANSION_CUTSCENES) {
      if (c.posterRelPath) {
        posterCount += 1;
        expect(c.posterRelPath.endsWith("_start.png")).toBe(true);
        expect(c.posterRelPath.startsWith(`art/cutscenes/${c.category}/`)).toBe(
          true,
        );
      }
    }
    // 12 producer-supplied posters in the zip; 9 pair to mp4s via the
    // generator's stem/prefix matching. The remaining 3 are orphans
    // (cs_guild_iron_first_arrival, cs_audit_day21_warden,
    // cs_mission_return_success) for which no mp4 was shipped.
    expect(posterCount).toBe(9);
  });

  it("covers the 10 declared categories with the expected counts", () => {
    const expected: Record<ExpansionCutsceneCategory, number> = {
      berth: 4,
      cohort_park: 4,
      comm_screen: 5,
      doctrine_binding: 7,
      forge: 5,
      guild_room: 21,
      mechronis_audit: 6,
      memory_card: 4,
      mission: 7,
      wardens_dock: 4,
    };
    for (const [cat, count] of Object.entries(expected) as [
      ExpansionCutsceneCategory,
      number,
    ][]) {
      expect(expansionCutscenesByCategory(cat).length).toBe(count);
    }
    const totalByCat = Object.values(expected).reduce((a, b) => a + b, 0);
    expect(totalByCat).toBe(67);
  });

  it("expansionCutsceneVideoUrl returns canonical CDN URL for a known clip", () => {
    const url = expansionCutsceneVideoUrl("cs_forge_first_creation");
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/forge/cs_forge_first_creation.mp4",
    );
  });

  it("expansionCutscenePosterUrl returns the producer-supplied poster", () => {
    const url = expansionCutscenePosterUrl("cs_forge_first_creation");
    // Producer stem mismatch: cs_forge_first_start.png is the poster
    // for cs_forge_first_creation.mp4 (prefix match in the generator).
    expect(url).toBe(
      "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/forge/cs_forge_first_start.png",
    );
  });

  it("expansionCutscenePosterUrl returns undefined for clips without a poster", () => {
    expect(expansionCutscenePosterUrl("cs_forge_failure")).toBeUndefined();
    expect(expansionCutscenePosterUrl("cs_berth_sleep")).toBeUndefined();
  });
});
