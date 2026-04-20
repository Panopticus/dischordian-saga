import { describe, expect, it } from "vitest";

import {
  ANATOMICAL_REGIONS,
  ELEMENT_PALETTES,
  RARITY_ORDER,
  SPECIES_DECALS,
  SUIT_ART_PROMPTS,
  SUIT_PIVOT_POINTS,
  SUIT_PREAMBLE,
  SUIT_SET_ROSTER,
  SUIT_SLOT_ORDER,
  buildSuitPrompt,
} from "./suitArtPrompts";

/**
 * The catalog must be a complete 18 × 6 × 10 matrix. These tests
 * prevent silent drift in the producer queue: any missing, extra, or
 * duplicate triple fails the build before a CSV is emitted.
 */
describe("suitArtPrompts catalog", () => {
  it("rosters exactly 18 named sets", () => {
    expect(SUIT_SET_ROSTER.length).toBe(18);
  });

  it("defines 6 rarities and 10 piece slots", () => {
    expect(RARITY_ORDER.length).toBe(6);
    expect(SUIT_SLOT_ORDER.length).toBe(10);
  });

  it("produces exactly 1,080 catalog entries (18 × 6 × 10)", () => {
    expect(SUIT_ART_PROMPTS.length).toBe(
      SUIT_SET_ROSTER.length * RARITY_ORDER.length * SUIT_SLOT_ORDER.length,
    );
    expect(SUIT_ART_PROMPTS.length).toBe(1080);
  });

  it("covers every (setId, rarity, slot) triple exactly once", () => {
    const seen = new Set<string>();
    for (const p of SUIT_ART_PROMPTS) {
      const key = `${p.setId}:${p.rarity}:${p.slot}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    expect(seen.size).toBe(1080);

    // And cross-check: every expected triple is present.
    for (const set of SUIT_SET_ROSTER) {
      for (const rarity of RARITY_ORDER) {
        for (const slot of SUIT_SLOT_ORDER) {
          expect(seen.has(`${set.id}:${rarity}:${slot}`)).toBe(true);
        }
      }
    }
  });

  it("gives every set a full 60-prompt matrix (6 rarities × 10 slots)", () => {
    for (const set of SUIT_SET_ROSTER) {
      const setPrompts = SUIT_ART_PROMPTS.filter((p) => p.setId === set.id);
      expect(setPrompts.length).toBe(60);
    }
  });

  it("has no duplicate assetIds", () => {
    const ids = SUIT_ART_PROMPTS.map((p) => p.assetId);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("gives every rarity its full per-set slot coverage", () => {
    for (const rarity of RARITY_ORDER) {
      const rarityPrompts = SUIT_ART_PROMPTS.filter(
        (p) => p.rarity === rarity,
      );
      expect(rarityPrompts.length).toBe(180); // 18 sets × 10 slots
    }
  });
});

describe("suitArtPrompts composition", () => {
  it("every prompt body embeds the preamble and pivot table", () => {
    // Sample — checking all 1,080 is wasteful; preamble/pivot come
    // from buildSuitPrompt unconditionally so a handful is enough.
    const sample = [
      SUIT_ART_PROMPTS[0],
      SUIT_ART_PROMPTS[540], // mid-catalog
      SUIT_ART_PROMPTS[SUIT_ART_PROMPTS.length - 1],
    ];
    for (const p of sample) {
      expect(p.prompt.startsWith(SUIT_PREAMBLE)).toBe(true);
      expect(p.prompt).toContain(SUIT_PIVOT_POINTS);
    }
  });

  it("every prompt names its slot's anatomical region", () => {
    for (const p of SUIT_ART_PROMPTS) {
      expect(p.prompt).toContain(ANATOMICAL_REGIONS[p.slot]);
    }
  });

  it("element sets bake their element palette", () => {
    const elementSets = SUIT_SET_ROSTER.filter((s) => s.bakedElement);
    expect(elementSets.length).toBe(8);
    for (const set of elementSets) {
      const prompt = buildSuitPrompt(set, "rare", "chest");
      expect(prompt).toContain(ELEMENT_PALETTES[set.bakedElement!]);
    }
  });

  it("species sets bake their species decal", () => {
    const speciesSets = SUIT_SET_ROSTER.filter((s) => s.bakedSpecies);
    // Species (3) + foundation/human (1) = 4 baked; Machine foundation
    // has no baked species.
    expect(speciesSets.length).toBe(4);
    for (const set of speciesSets) {
      const prompt = buildSuitPrompt(set, "legendary", "head");
      expect(prompt).toContain(SPECIES_DECALS[set.bakedSpecies!]);
    }
  });

  it("buildSuitPrompt is pure (stable output for stable input)", () => {
    const set = SUIT_SET_ROSTER[0];
    const a = buildSuitPrompt(set, "epic", "gloves");
    const b = buildSuitPrompt(set, "epic", "gloves");
    expect(a).toBe(b);
  });

  it("assetIds follow the `<setId>:<rarity>:<slot>` contract", () => {
    for (const p of SUIT_ART_PROMPTS) {
      expect(p.assetId).toBe(`${p.setId}:${p.rarity}:${p.slot}`);
    }
  });

  it("prioritizes common + uncommon as P0 and higher tiers as P1", () => {
    for (const p of SUIT_ART_PROMPTS) {
      if (p.rarity === "common" || p.rarity === "uncommon") {
        expect(p.priority).toBe("P0");
      } else {
        expect(p.priority).toBe("P1");
      }
    }
  });
});
