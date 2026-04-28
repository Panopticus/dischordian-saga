/**
 * Heat (run-modifier) registry contract (#1).
 *
 * Phase-1 ships the registry as pure data. The Phase-2 reducer
 * integration will read from this module, so the invariants below
 * are the contract the engine work depends on:
 *
 *   - Stable kebab-case ids (persisted to game_replays.tags so a
 *     replay's heat configuration survives schema migrations).
 *   - Bounded cost (1..3) so the budget arithmetic in
 *     totalHeatCost / validateHeatConfig is deterministic.
 *   - Trigger ∈ ModifierTrigger so the engine handler dispatch
 *     table doesn't need a default case.
 *   - Category ∈ ModifierCategory for UI grouping.
 *   - At least one modifier per starter category at unlockTier 0
 *     so a brand-new player can build a Heat-1 selection from
 *     diversified picks.
 *   - Flavor strings ≤ 80 chars so the mutator card UI doesn't
 *     wrap awkwardly.
 *
 * If any of these break, the engine integration PR will fail in
 * subtle ways (silent no-op modifiers, UI wrapping, hash drift on
 * persisted replay tags). Lock them in here.
 */
import { describe, it, expect } from "vitest";
import {
  HEAT_MODIFIERS,
  MAX_HEAT_LEVEL,
  MAX_MODIFIER_COST,
  getModifier,
  totalHeatCost,
  validateHeatConfig,
  modifiersUnlockedAtTier,
  type Modifier,
  type ModifierTrigger,
  type ModifierCategory,
} from "./registry";

const VALID_TRIGGERS: readonly ModifierTrigger[] = [
  "match-start",
  "turn-start",
  "card-played",
  "damage-dealt",
  "minion-deployed",
  "match-end",
];

const VALID_CATEGORIES: readonly ModifierCategory[] = [
  "offensive",
  "defensive",
  "economy",
  "time-pressure",
  "chaos",
  "narrative",
];

describe("HEAT_MODIFIERS — registry shape", () => {
  it("ships at least 5 modifiers (so Heat-5 is achievable)", () => {
    expect(HEAT_MODIFIERS.length).toBeGreaterThanOrEqual(5);
  });

  it("has unique ids (no duplicates)", () => {
    const ids = HEAT_MODIFIERS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses kebab-case ids (lowercase a-z + digits + dashes)", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(m.id, `${m.id} should be kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every cost is in [1, MAX_MODIFIER_COST]", () => {
    expect(MAX_MODIFIER_COST).toBe(3);
    for (const m of HEAT_MODIFIERS) {
      expect(m.cost, `${m.id} cost`).toBeGreaterThanOrEqual(1);
      expect(m.cost, `${m.id} cost`).toBeLessThanOrEqual(MAX_MODIFIER_COST);
    }
  });

  it("every trigger is a valid ModifierTrigger", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(VALID_TRIGGERS, `${m.id} trigger`).toContain(m.trigger);
    }
  });

  it("every category is a valid ModifierCategory", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(VALID_CATEGORIES, `${m.id} category`).toContain(m.category);
    }
  });

  it("every unlockTier is non-negative and ≤ MAX_HEAT_LEVEL", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(m.unlockTier, `${m.id} unlockTier`).toBeGreaterThanOrEqual(0);
      expect(m.unlockTier, `${m.id} unlockTier`).toBeLessThanOrEqual(MAX_HEAT_LEVEL);
    }
  });

  it("flavor strings are non-empty and ≤ 80 chars (UI wrap budget)", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(m.flavor.length, `${m.id} flavor empty`).toBeGreaterThan(0);
      expect(m.flavor.length, `${m.id} flavor too long`).toBeLessThanOrEqual(80);
    }
  });

  it("name + description are non-empty", () => {
    for (const m of HEAT_MODIFIERS) {
      expect(m.name.length, `${m.id} name`).toBeGreaterThan(0);
      expect(m.description.length, `${m.id} description`).toBeGreaterThan(0);
    }
  });

  it("tier-0 modifiers cover at least 3 categories (so a new player has variety)", () => {
    const tier0Categories = new Set<ModifierCategory>();
    for (const m of HEAT_MODIFIERS) {
      if (m.unlockTier === 0) tier0Categories.add(m.category);
    }
    expect(
      tier0Categories.size,
      `tier-0 categories: ${Array.from(tier0Categories).join(",")}`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("MAX_HEAT_LEVEL is reachable from the full registry's total cost", () => {
    // If the cap is unreachable, it's misleading — the UI would
    // show a level the player physically can't fill. Allow some
    // headroom (≥ MAX_HEAT_LEVEL) because future additions only
    // grow the registry.
    const totalAvailableCost = HEAT_MODIFIERS.reduce(
      (sum, m) => sum + m.cost,
      0,
    );
    expect(totalAvailableCost).toBeGreaterThanOrEqual(MAX_HEAT_LEVEL);
  });
});

describe("getModifier — id lookup", () => {
  it("returns the modifier for a known id", () => {
    const first = HEAT_MODIFIERS[0];
    expect(getModifier(first.id)).toBe(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getModifier("nope-not-a-real-modifier")).toBeUndefined();
  });

  it("is case-sensitive (kebab-case discipline)", () => {
    const first = HEAT_MODIFIERS[0];
    expect(getModifier(first.id.toUpperCase())).toBeUndefined();
  });
});

describe("totalHeatCost — sum-or-null", () => {
  it("returns 0 for an empty list", () => {
    expect(totalHeatCost([])).toBe(0);
  });

  it("returns the cost sum for valid ids", () => {
    const m1 = HEAT_MODIFIERS[0];
    const m2 = HEAT_MODIFIERS[1];
    expect(totalHeatCost([m1.id, m2.id])).toBe(m1.cost + m2.cost);
  });

  it("returns null when any id is unknown (caller surfaces the bad row)", () => {
    expect(totalHeatCost(["nope"])).toBeNull();
    expect(totalHeatCost([HEAT_MODIFIERS[0].id, "also-nope"])).toBeNull();
  });
});

describe("validateHeatConfig — lock-in guard", () => {
  it("accepts the empty selection (Heat 0)", () => {
    const result = validateHeatConfig([]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.config.totalCost).toBe(0);
  });

  it("accepts a single modifier within the cap", () => {
    const m = HEAT_MODIFIERS[0];
    const result = validateHeatConfig([m.id]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.config.totalCost).toBe(m.cost);
  });

  it("rejects an unknown id", () => {
    const result = validateHeatConfig(["nope"]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("unknown-modifier");
  });

  it("rejects duplicates (same modifier twice)", () => {
    const m = HEAT_MODIFIERS[0];
    const result = validateHeatConfig([m.id, m.id]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("duplicate-modifier");
  });

  it("rejects selections that exceed the explicit cap", () => {
    const m = HEAT_MODIFIERS.find((x) => x.cost === 3);
    if (!m) return; // registry has no cost-3 modifier — skip
    const result = validateHeatConfig([m.id], 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("exceeds-cap");
  });

  it("rejects a cap above MAX_HEAT_LEVEL (caller misconfiguration)", () => {
    const result = validateHeatConfig([], MAX_HEAT_LEVEL + 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("exceeds-max-level");
  });

  it("validates a full-cap selection if such a stack exists", () => {
    // Greedy fill at MAX_HEAT_LEVEL — confirm the cap is reachable
    // without tripping any other reason code.
    const sorted = [...HEAT_MODIFIERS].sort((a, b) => b.cost - a.cost);
    const picked: Modifier[] = [];
    let total = 0;
    for (const m of sorted) {
      if (total + m.cost <= MAX_HEAT_LEVEL) {
        picked.push(m);
        total += m.cost;
      }
    }
    const result = validateHeatConfig(picked.map((m) => m.id));
    expect(result.ok, `greedy-fill validation should succeed`).toBe(true);
    if (result.ok) {
      expect(result.config.totalCost).toBe(total);
      expect(result.config.totalCost).toBeLessThanOrEqual(MAX_HEAT_LEVEL);
    }
  });
});

describe("modifiersUnlockedAtTier — selection-UI filter", () => {
  it("returns only tier-0 modifiers for a brand-new player", () => {
    const unlocked = modifiersUnlockedAtTier(0);
    for (const m of unlocked) expect(m.unlockTier).toBe(0);
  });

  it("returns the full registry once highestClearedTier ≥ MAX_HEAT_LEVEL", () => {
    const unlocked = modifiersUnlockedAtTier(MAX_HEAT_LEVEL);
    expect(unlocked.length).toBe(HEAT_MODIFIERS.length);
  });

  it("monotonic — clearing more tiers never hides a previously-visible modifier", () => {
    let prevCount = 0;
    for (let tier = 0; tier <= MAX_HEAT_LEVEL; tier++) {
      const count = modifiersUnlockedAtTier(tier).length;
      expect(count, `tier ${tier}`).toBeGreaterThanOrEqual(prevCount);
      prevCount = count;
    }
  });
});

describe("Heat barrel — top-level tcg-core re-export", () => {
  it("re-exports the Heat surface from the tcg-core index", async () => {
    // The client + server both import via the @shared/tcg-core
    // barrel, so the Heat module must be visible there or the
    // Phase-2 wiring will silently fail on `import { Modifier }
    // from "@shared/tcg-core"`.
    const tcgCore = await import("../index");
    expect(typeof tcgCore.HEAT_MODIFIERS).toBe("object");
    expect(typeof tcgCore.MAX_HEAT_LEVEL).toBe("number");
    expect(typeof tcgCore.validateHeatConfig).toBe("function");
    expect(typeof tcgCore.getModifier).toBe("function");
  });
});
