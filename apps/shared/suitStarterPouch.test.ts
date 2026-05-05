/**
 * Starter-pouch tests for the suit-craft mutation.
 *
 * Sized so a fresh citizen can land at least one common craft of any
 * recipe AND one uncommon craft using their primary element, without
 * trivializing the legendary-tier grind. Verified against the canonical
 * RARITY_COST table baked into SUIT_RECIPES.
 */
import { describe, it, expect } from "vitest";
import {
  STARTER_SUIT_POUCH,
  STARTER_GRANTED_SENTINEL,
  SUIT_RECIPES,
} from "./suitRecipes";

const ELEMENT_ESSENCE_KEYS = [
  "earth-essence",
  "fire-essence",
  "water-essence",
  "air-essence",
  "space-essence",
  "time-essence",
  "probability-essence",
  "reality-essence",
] as const;

describe("STARTER_SUIT_POUCH shape", () => {
  it("includes brass-plate (every common+ recipe needs it)", () => {
    expect(STARTER_SUIT_POUCH["brass-plate"]).toBeGreaterThan(0);
  });

  it("includes a non-zero count of every element-essence", () => {
    for (const k of ELEMENT_ESSENCE_KEYS) {
      expect(STARTER_SUIT_POUCH[k] ?? 0).toBeGreaterThan(0);
    }
  });

  it("does NOT include thread-of-null (rare+ tier — preserve the grind)", () => {
    expect(STARTER_SUIT_POUCH["thread-of-null"] ?? 0).toBe(0);
  });

  it("does NOT include the sentinel itself (the seed-write adds it separately)", () => {
    expect(
      (STARTER_SUIT_POUCH as Record<string, number>)[STARTER_GRANTED_SENTINEL] ?? 0,
    ).toBe(0);
  });
});

describe("STARTER_SUIT_POUCH craft enablement", () => {
  it("enables at least one common-tier craft for every set", () => {
    const commons = SUIT_RECIPES.filter((r) => r.rarity === "common");
    expect(commons.length).toBeGreaterThan(0);
    for (const recipe of commons) {
      const blocker = recipe.inputs.find(
        (req) => (STARTER_SUIT_POUCH[req.materialId] ?? 0) < req.count,
      );
      expect(blocker, `common recipe ${recipe.id} blocked by ${blocker?.materialId}`).toBeUndefined();
    }
  });

  it("enables at least one uncommon-tier craft for every set", () => {
    const uncommons = SUIT_RECIPES.filter((r) => r.rarity === "uncommon");
    expect(uncommons.length).toBeGreaterThan(0);
    for (const recipe of uncommons) {
      const blocker = recipe.inputs.find(
        (req) => (STARTER_SUIT_POUCH[req.materialId] ?? 0) < req.count,
      );
      expect(blocker, `uncommon recipe ${recipe.id} blocked by ${blocker?.materialId}`).toBeUndefined();
    }
  });

  it("does NOT enable a rare-tier craft (rare needs more brass + essence than starter holds)", () => {
    const rares = SUIT_RECIPES.filter((r) => r.rarity === "rare");
    expect(rares.length).toBeGreaterThan(0);
    for (const recipe of rares) {
      const blocked = recipe.inputs.some(
        (req) => (STARTER_SUIT_POUCH[req.materialId] ?? 0) < req.count,
      );
      expect(blocked, `rare recipe ${recipe.id} should be blocked`).toBe(true);
    }
  });

  it("does NOT enable an epic-tier craft (epic needs thread-of-null which starter omits)", () => {
    const epics = SUIT_RECIPES.filter((r) => r.rarity === "epic");
    expect(epics.length).toBeGreaterThan(0);
    for (const recipe of epics) {
      const blocked = recipe.inputs.some(
        (req) => (STARTER_SUIT_POUCH[req.materialId] ?? 0) < req.count,
      );
      expect(blocked, `epic recipe ${recipe.id} should be blocked`).toBe(true);
    }
  });
});

describe("STARTER_GRANTED_SENTINEL discriminator", () => {
  it("uses a __-prefixed key that no MaterialId starts with", () => {
    expect(STARTER_GRANTED_SENTINEL.startsWith("__")).toBe(true);
    // Sanity: no recipe input ever references the sentinel by key.
    for (const recipe of SUIT_RECIPES) {
      for (const req of recipe.inputs) {
        expect(req.materialId).not.toBe(STARTER_GRANTED_SENTINEL);
      }
    }
  });
});
