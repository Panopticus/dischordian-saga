import { describe, it, expect } from "vitest";
import {
  NEXUS_TRIAL_COSMETICS,
  COSMETIC_IDS,
  cosmeticById,
  cosmeticsByCategory,
  type CosmeticCategory,
} from "./cosmetics";
import { BALLOT_KEYS } from "./buckets";
import { TRIAL_PHASES } from "./phases";

describe("NEXUS_TRIAL_COSMETICS — catalog shape", () => {
  it("ships exactly 25 cosmetics", () => {
    expect(COSMETIC_IDS.length).toBe(25);
    expect(Object.keys(NEXUS_TRIAL_COSMETICS).length).toBe(25);
  });

  it("every cosmetic id is unique", () => {
    expect(new Set(COSMETIC_IDS).size).toBe(COSMETIC_IDS.length);
  });

  it("every cosmetic has a name + hoverText (no blank metadata)", () => {
    for (const c of Object.values(NEXUS_TRIAL_COSMETICS)) {
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.hoverText.length).toBeGreaterThan(0);
    }
  });

  it("artUrl is either a CDN URL or null (titles + CSS bundles)", () => {
    for (const c of Object.values(NEXUS_TRIAL_COSMETICS)) {
      if (c.artUrl !== null) {
        expect(c.artUrl).toContain("cdn/client-public/art/cosmetics/nexus_trial/");
      }
    }
  });
});

describe("category coverage", () => {
  it("3 universal commemoratives (quill + pendant + title)", () => {
    // The brief's 4-item universal block splits in this registry:
    // - cos_01 quill, cos_02 pendant, cos_03 title → universal_commemorative
    // - cos_04 theme background → profile_theme (joined by cos_25)
    expect(cosmeticsByCategory("universal_commemorative").length).toBe(3);
  });

  it("2 profile themes (background + token bundle)", () => {
    expect(cosmeticsByCategory("profile_theme").length).toBe(2);
  });

  it("6 phase pins — one per Trial phase", () => {
    const pins = cosmeticsByCategory("phase_pin");
    expect(pins.length).toBe(6);
    // Each pin's grant must reference exactly one of the 6 phases.
    const triggeredPhases = new Set<string>();
    for (const p of pins) {
      if (p.grant.kind === "phase_testimony") triggeredPhases.add(p.grant.phase);
    }
    expect(triggeredPhases.size).toBe(6);
    for (const phase of TRIAL_PHASES) {
      expect(triggeredPhases.has(phase)).toBe(true);
    }
  });

  it("5 preparation medals — one per mission", () => {
    const medals = cosmeticsByCategory("preparation_medal");
    expect(medals.length).toBe(5);
  });

  it("4 ballot mementos — one per ballot candidate", () => {
    const mementos = cosmeticsByCategory("ballot_memento");
    expect(mementos.length).toBe(4);
    const ballotKeys = new Set<string>();
    for (const m of mementos) {
      if (m.grant.kind === "ballot_outcome" && m.grant.ballotKey !== "any") {
        ballotKeys.add(m.grant.ballotKey);
      }
    }
    expect(ballotKeys.size).toBe(4);
    for (const key of BALLOT_KEYS) {
      expect(ballotKeys.has(key)).toBe(true);
    }
  });

  it("2 romance privates — both flagged privateToPlayer", () => {
    const romance = cosmeticsByCategory("companion_romance_private");
    expect(romance.length).toBe(2);
    for (const r of romance) {
      expect(r.privateToPlayer).toBe(true);
    }
  });

  it("3 politician fork banners — one per fork resolution", () => {
    const banners = cosmeticsByCategory("politician_fork_banner");
    expect(banners.length).toBe(3);
    const resolutions = new Set<string>();
    for (const b of banners) {
      if (b.grant.kind === "politician_fork") resolutions.add(b.grant.resolution);
    }
    expect(resolutions.size).toBe(3);
    expect(resolutions).toEqual(
      new Set(["seat_sealed", "constrained_return", "full_return"]),
    );
  });
});

describe("cosmeticById — lookup", () => {
  it("returns the matching cosmetic def", () => {
    const def = cosmeticById("cos_01_antiquarians_quill");
    expect(def).toBeDefined();
    expect(def!.name).toBe("The Antiquarian's Quill");
  });

  it("returns undefined for unknown id", () => {
    expect(cosmeticById("not_a_cosmetic")).toBeUndefined();
  });
});

describe("registry parity vs catalog count", () => {
  it("category counts sum to 25", () => {
    const categories: CosmeticCategory[] = [
      "universal_commemorative",
      "phase_pin",
      "preparation_medal",
      "ballot_memento",
      "companion_romance_private",
      "politician_fork_banner",
      "profile_theme",
    ];
    const sum = categories
      .map((c) => cosmeticsByCategory(c).length)
      .reduce((a, b) => a + b, 0);
    expect(sum).toBe(25);
  });
});
