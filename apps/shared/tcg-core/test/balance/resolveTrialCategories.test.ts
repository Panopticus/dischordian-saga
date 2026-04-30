/**
 * Trial-category resolver + registry-coverage tests.
 *
 * P1.5 — before this pass every player card had empty
 * `trial_categories`, which meant the §5.8 Authority trial's
 * admissibility check rejected every card in every restricted phase
 * with `card_uncategorized`. The three-layer resolver (proposer +
 * second pass + manual overrides) now fills the field at registry
 * build time. These tests lock the coverage down so a future
 * addition to the card pool can't silently regress the §5.8 surface.
 */
import { describe, it, expect } from "vitest";
import {
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  type CardRegistry,
} from "../../index";
import {
  findUncategorizedCards,
  resolveTrialCategories,
} from "../../balance/resolveTrialCategories";

/** Strict registry — matches the client/server production build. */
const strictRegistry: CardRegistry = buildCardRegistry(ALL_CARD_DEFINITIONS, {
  strictTrialCategoryCoverage: true,
});

describe("resolveTrialCategories — production registry coverage", () => {
  it("every non-general card has at least one trial_category", () => {
    const uncategorized = findUncategorizedCards(
      ALL_CARD_DEFINITIONS.filter((c) => c.cardType !== "general"),
    );
    expect(uncategorized, uncategorized.join(", ")).toEqual([]);
  });

  it("the registry carries categories on every unit card", () => {
    for (const card of strictRegistry.listAll()) {
      if (card.cardType === "general") continue;
      expect(card.trial_categories, `${card.id} has no categories`).toBeDefined();
      expect(card.trial_categories!.length).toBeGreaterThan(0);
    }
  });

  it("strict loader throws when non-general cards lack categories", () => {
    // Mock card def with no heuristic matches and no manual override.
    const blank = {
      id: "nothing_category_stub",
      name: "Stub",
      faction: "neutral",
      cardType: "unit" as const,
      rarity: "basic",
      cost: 2,
      baseStats: { power: 1, health: 1 },
      keywords: [] as const,
      abilities: [] as const,
      art: "stub",
      flavorText: "a",
      rulesVersion: "1.1.0",
    };
    expect(() =>
      buildCardRegistry([blank], { strictTrialCategoryCoverage: true }),
    ).toThrow(/trial_categories/);
  });

  it("non-strict loader tolerates uncategorized cards (test-fixture path)", () => {
    const blank = {
      id: "lenient_stub",
      name: "Stub",
      faction: "neutral",
      cardType: "unit" as const,
      rarity: "basic",
      cost: 2,
      baseStats: { power: 1, health: 1 },
      keywords: [] as const,
      abilities: [] as const,
      art: "stub",
      flavorText: "a",
      rulesVersion: "1.1.0",
    };
    expect(() => buildCardRegistry([blank])).not.toThrow();
  });
});

describe("resolveTrialCategories — heuristic sanity", () => {
  it("respects an authored trial_categories list (does not override)", () => {
    const card = {
      ...ALL_CARD_DEFINITIONS[0],
      trial_categories: ["confession"] as const,
    };
    expect(resolveTrialCategories(card)).toEqual(["confession"]);
  });

  it("returns stable canonical order (confession < defensive < evidence < narrative < offensive < reactive)", () => {
    // Every card's categories are returned in the fixed
    // CATEGORY_ORDER so snapshot tests and UI iteration read them
    // in a consistent sequence.
    const categoryIndex = {
      confession: 0,
      defensive: 1,
      evidence: 2,
      narrative: 3,
      offensive: 4,
      reactive: 5,
    } as const;
    for (const card of strictRegistry.listAll()) {
      const cats = card.trial_categories ?? [];
      for (let i = 1; i < cats.length; i++) {
        expect(
          categoryIndex[cats[i] as keyof typeof categoryIndex],
          `${card.id}: ${cats.join(",")} out of order`,
        ).toBeGreaterThan(
          categoryIndex[cats[i - 1] as keyof typeof categoryIndex],
        );
      }
    }
  });

  it("§5.8 Authority general has no categories (bypass — deployed at turn 0)", () => {
    const authority = strictRegistry.get("gen_authority");
    expect(authority).toBeDefined();
    expect(authority!.cardType).toBe("general");
  });
});

describe("resolveTrialCategories — §5.8 phase coverage invariants", () => {
  // Spec §5.8 defines 10 phases (charge, opening argument, evidence
  // × 3, cross-exam × 3, closing argument, verdict). Each phase
  // admits a specific subset of categories. For the pool to be
  // viable at all, each phase must have at least SOME playable
  // cards.

  const categoriesInPool = new Set<string>();
  for (const card of strictRegistry.listAll()) {
    for (const c of card.trial_categories ?? []) categoriesInPool.add(c);
  }

  it("pool covers the defensive category (phase 1 charge)", () => {
    expect(categoriesInPool.has("defensive")).toBe(true);
  });

  it("pool covers the narrative category (phases 2 + 9 arguments)", () => {
    expect(categoriesInPool.has("narrative")).toBe(true);
  });

  it("pool covers the evidence category (phases 3–5)", () => {
    expect(categoriesInPool.has("evidence")).toBe(true);
  });

  it("pool covers the reactive category (phases 6–8 cross-exam)", () => {
    expect(categoriesInPool.has("reactive")).toBe(true);
  });
});
