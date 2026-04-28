import { describe, it, expect } from "vitest";

import {
  HIERARCHY_OF_DAMNED_ART,
  HIERARCHY_OF_DAMNED_TOTAL,
  hierarchyOfDamnedArtUrl,
  hierarchyOfDamnedByRarity,
  type HierarchyOfDamnedRarity,
} from "../hierarchyOfDamned";
import {
  DISCHORDIA_BASE_SET_ART,
  DISCHORDIA_BASE_SET_TIER_GRIDS,
  DISCHORDIA_BASE_SET_TOTAL,
  dischordiaBaseSetArtUrl,
  dischordiaBaseSetByCategory,
  type DischordiaBaseSetCategory,
} from "../dischordiaBaseSet";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

describe("S2 Hierarchy of the Damned art manifest", () => {
  it("ships exactly 124 entries (the producer's pack 1 expansion drop)", () => {
    expect(HIERARCHY_OF_DAMNED_TOTAL).toBe(124);
    expect(HIERARCHY_OF_DAMNED_ART).toHaveLength(124);
  });

  it("has unique assetIds", () => {
    const ids = HIERARCHY_OF_DAMNED_ART.map((e) => e.assetId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique relPaths", () => {
    const paths = HIERARCHY_OF_DAMNED_ART.map((e) => e.relPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("every relPath sits under the canonical hierarchy-of-damned tree", () => {
    for (const e of HIERARCHY_OF_DAMNED_ART) {
      expect(e.relPath).toMatch(
        /^art\/expansions\/hierarchy-of-damned\/(c-suite|vps|directors|managers|analysts|interns|act-exclusives|special-editions)\/[a-z0-9_]+\.webp$/,
      );
    }
  });

  it("rarity bucket counts match the producer manifest", () => {
    const counts: Record<HierarchyOfDamnedRarity, number> = {
      mythic: 7,
      legendary: 7,
      epic: 14,
      rare: 18,
      uncommon: 24,
      common: 16,
      "act-exclusive": 28,
      "special-edition": 10,
    };
    for (const [rarity, expected] of Object.entries(counts)) {
      expect(hierarchyOfDamnedByRarity(rarity as HierarchyOfDamnedRarity)).toHaveLength(
        expected,
      );
    }
  });

  it("URL helper resolves a known asset and returns undefined for unknown", () => {
    const url = hierarchyOfDamnedArtUrl("s2_hierarchy_ceo_mol_garath");
    expect(url).toBe(
      `${CDN_PREFIX}art/expansions/hierarchy-of-damned/c-suite/s2_hierarchy_ceo_mol_garath.webp`,
    );
    expect(hierarchyOfDamnedArtUrl("does_not_exist")).toBeUndefined();
    expect(hierarchyOfDamnedArtUrl(undefined)).toBeUndefined();
  });
});

describe("Dischordia base-set art manifest", () => {
  it("ships 620 per-card entries + 31 tier-grid composites", () => {
    expect(DISCHORDIA_BASE_SET_TOTAL).toBe(620);
    expect(DISCHORDIA_BASE_SET_ART).toHaveLength(620);
    expect(DISCHORDIA_BASE_SET_TIER_GRIDS).toHaveLength(31);
  });

  it("per-card and tier-grid namespaces don't overlap on assetId", () => {
    const cards = new Set(DISCHORDIA_BASE_SET_ART.map((e) => e.assetId));
    const grids = DISCHORDIA_BASE_SET_TIER_GRIDS.map((e) => e.assetId);
    for (const id of grids) expect(cards.has(id)).toBe(false);
  });

  it("has unique relPaths within the per-card set", () => {
    const paths = DISCHORDIA_BASE_SET_ART.map((e) => e.relPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("a small known set of assetIds appear in two categories (producer-side dupes)", () => {
    const counts = new Map<string, number>();
    for (const e of DISCHORDIA_BASE_SET_ART) {
      counts.set(e.assetId, (counts.get(e.assetId) ?? 0) + 1);
    }
    const dupes = [...counts].filter(([, n]) => n > 1).map(([id]) => id).sort();
    // These four characters have art in both their faction-category folder
    // AND in `neutral/` (they are cross-faction NPCs in the producer drop).
    // dischordiaBaseSetArtUrl() returns the first match found.
    expect(dupes).toEqual([
      "smugglers_cache",
      "the_game_master",
      "the_programmer",
      "the_seer",
    ]);
  });

  it("every relPath sits under art/cards/<canonical-category>/", () => {
    const allowed: ReadonlySet<DischordiaBaseSetCategory> = new Set([
      "allegiance",
      "antiquarian",
      "architect",
      "class",
      "dimension",
      "dreamer",
      "element",
      "imprint",
      "insurgency",
      "neutral",
      "new_babylon",
      "panopticon",
      "race",
      "thought_virus",
    ]);
    for (const e of DISCHORDIA_BASE_SET_ART) {
      expect(allowed.has(e.category)).toBe(true);
      expect(e.relPath).toMatch(/^art\/cards\/[a-z_]+\/[a-z0-9_]+\.webp$/);
      expect(e.relPath).toContain(`art/cards/${e.category}/`);
    }
  });

  it("tier-grid relPaths sit under <category>/_grids/", () => {
    for (const e of DISCHORDIA_BASE_SET_TIER_GRIDS) {
      expect(e.relPath).toMatch(/^art\/cards\/[a-z_]+\/_grids\/[a-z0-9_]+\.webp$/);
    }
  });

  it("URL helper resolves a known card and returns undefined for unknown", () => {
    const url = dischordiaBaseSetArtUrl("agent_zero_t1");
    expect(url).toBe(`${CDN_PREFIX}art/cards/imprint/agent_zero_t1.webp`);
    expect(dischordiaBaseSetArtUrl("does_not_exist")).toBeUndefined();
    expect(dischordiaBaseSetArtUrl(undefined)).toBeUndefined();
  });

  it("byCategory returns only entries from that category", () => {
    const imprint = dischordiaBaseSetByCategory("imprint");
    expect(imprint.length).toBe(90);
    for (const e of imprint) expect(e.category).toBe("imprint");
  });

  it("category-by-category counts match the producer drop", () => {
    const expected: Record<DischordiaBaseSetCategory, number> = {
      allegiance: 36,
      antiquarian: 39,
      architect: 62,            // 63 producer minus the surveillance_grid composite
      class: 30,                // 36 producer minus 6 class_grid composites
      dimension: 12,
      dreamer: 62,
      element: 20,
      imprint: 90,              // 108 producer minus 18 tier_grid composites
      insurgency: 51,
      neutral: 90,
      new_babylon: 52,
      panopticon: 8,
      race: 15,
      thought_virus: 53,
    };
    for (const [cat, count] of Object.entries(expected)) {
      expect(dischordiaBaseSetByCategory(cat as DischordiaBaseSetCategory)).toHaveLength(
        count,
      );
    }
  });
});
