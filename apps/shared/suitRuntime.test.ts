import { describe, expect, it } from "vitest";

import {
  getAllSetIds,
  getSetDef,
  getSetsByCategory,
  pieceId,
  derivePieceIds,
  isCraftableRarity,
  isSetCountingSlot,
} from "./suitSets";
import {
  RARITY_ORDER,
  SUIT_SLOT_ORDER,
  SUIT_SET_ROSTER,
} from "./suitArtPrompts";
import {
  BONUS_TIERS,
  buildEquipLoadoutChangedEvent,
  getActiveBonusEffects,
  getAllSuitBonusLadders,
  getSuitBonusLadder,
} from "./suitBonuses";
import {
  SUIT_RECIPES,
  getRecipesForSet,
  getRecipesRequiringSchematic,
} from "./suitRecipes";
import {
  SCHEMATICS,
  isSchematicEligibleForOperative,
  listEligibleSchematics,
} from "./schematics";

/* ─── suitSets ─── */

describe("suitSets", () => {
  it("enumerates all 18 set ids in roster order", () => {
    const ids = getAllSetIds();
    expect(ids.length).toBe(18);
    expect(ids).toEqual(SUIT_SET_ROSTER.map((s) => s.id));
  });

  it("getSetDef throws for unknown ids", () => {
    expect(() => getSetDef("does-not-exist")).toThrow();
  });

  it("categorizes 5 class / 3 species / 8 element / 2 foundation", () => {
    expect(getSetsByCategory("class").length).toBe(5);
    expect(getSetsByCategory("species").length).toBe(3);
    expect(getSetsByCategory("element").length).toBe(8);
    expect(getSetsByCategory("foundation").length).toBe(2);
  });

  it("derivePieceIds emits exactly 1,080 unique ids", () => {
    const ids = derivePieceIds();
    expect(ids.length).toBe(18 * RARITY_ORDER.length * SUIT_SLOT_ORDER.length);
    expect(ids.length).toBe(1080);
    expect(new Set(ids).size).toBe(1080);
    expect(ids[0]).toBe(pieceId(SUIT_SET_ROSTER[0].id, "common", "head"));
  });

  it("every roster slot is a set-counting slot", () => {
    for (const slot of SUIT_SLOT_ORDER) {
      expect(isSetCountingSlot(slot)).toBe(true);
    }
  });

  it("mythic is the only non-craftable rarity", () => {
    for (const r of RARITY_ORDER) {
      expect(isCraftableRarity(r)).toBe(r !== "mythic");
    }
  });
});

/* ─── suitBonuses ─── */

describe("suitBonuses", () => {
  it("every set has a ladder with exactly 4 tiers at 2/4/7/10", () => {
    const ladders = getAllSuitBonusLadders();
    expect(ladders.length).toBe(18);
    for (const l of ladders) {
      expect(l.tiers.length).toBe(BONUS_TIERS.length);
      expect(l.tiers.map((t) => t.pieces)).toEqual([...BONUS_TIERS]);
    }
  });

  it("getActiveBonusEffects stacks lower-tier effects into higher tiers", () => {
    const setId = "regalia-of-the-seeing-stylus";
    const at7 = getActiveBonusEffects(setId, 7);
    const at10 = getActiveBonusEffects(setId, 10);
    // 7-piece should include 2pc + 4pc + 7pc effects (three of them).
    expect(at7.length).toBe(3);
    // 10-piece is the superset.
    expect(at10.length).toBe(4);
    for (const e of at7) {
      expect(at10.some((x) => x.label === e.label)).toBe(true);
    }
  });

  it("buildEquipLoadoutChangedEvent drops zero-count sets", () => {
    const event = buildEquipLoadoutChangedEvent({
      "regalia-of-the-seeing-stylus": 4,
      "clockwork-exoframe": 0,
      "ember-bellows-array": 2,
    });
    // 4pc regalia = 2 effects; 2pc ember = 1 effect.
    expect(event.activeEffects.length).toBe(3);
    expect(event.countsBySetId).toEqual({
      "regalia-of-the-seeing-stylus": 4,
      "clockwork-exoframe": 0,
      "ember-bellows-array": 2,
    });
  });

  it("getSuitBonusLadder throws for unknown set ids", () => {
    expect(() => getSuitBonusLadder("does-not-exist")).toThrow();
  });
});

/* ─── suitRecipes ─── */

describe("suitRecipes", () => {
  it("emits a recipe per (set, craftable-rarity, slot) — 900 total", () => {
    // 18 sets × 5 craftable rarities × 10 slots = 900.
    expect(SUIT_RECIPES.length).toBe(18 * 5 * 10);
    expect(SUIT_RECIPES.length).toBe(900);
  });

  it("never emits a Mythic recipe", () => {
    for (const r of SUIT_RECIPES) {
      expect(r.rarity).not.toBe("mythic");
    }
  });

  it("recipe ids match `<setId>:<rarity>:<slot>` contract", () => {
    for (const r of SUIT_RECIPES) {
      expect(r.id).toBe(`${r.setId}:${r.rarity}:${r.slot}`);
    }
  });

  it("getRecipesForSet returns exactly 50 recipes per set (5 rarities × 10 slots)", () => {
    for (const set of SUIT_SET_ROSTER) {
      expect(getRecipesForSet(set.id).length).toBe(50);
    }
  });

  it("getRecipesRequiringSchematic groups correctly", () => {
    for (const set of SUIT_SET_ROSTER) {
      const rs = getRecipesRequiringSchematic(`schematic:${set.id}`);
      expect(rs.length).toBe(50);
      for (const r of rs) expect(r.setId).toBe(set.id);
    }
  });

  it("craft cost and success scale monotonically with rarity", () => {
    const byRarity = new Map<string, { brass: number; pct: number }>();
    for (const r of SUIT_RECIPES) {
      if (r.slot !== "chest") continue; // sample one slot
      if (r.setId !== "regalia-of-the-seeing-stylus") continue;
      const brass =
        r.inputs.find((i) => i.materialId === "brass-plate")?.count ?? 0;
      byRarity.set(r.rarity, { brass, pct: r.baseSuccessPct });
    }
    const order: Array<keyof typeof byRarity> = [];
    for (const r of RARITY_ORDER) if (r !== "mythic") order.push(r as any);
    for (let i = 1; i < order.length; i++) {
      const prev = byRarity.get(order[i - 1] as string)!;
      const cur = byRarity.get(order[i] as string)!;
      expect(cur.brass).toBeGreaterThan(prev.brass);
      expect(cur.pct).toBeLessThan(prev.pct);
    }
  });
});

/* ─── schematics ─── */

describe("schematics", () => {
  it("ships one schematic per set (18 total)", () => {
    expect(SCHEMATICS.length).toBe(18);
    expect(new Set(SCHEMATICS.map((s) => s.setId)).size).toBe(18);
  });

  it("foundation sets are NOT available via trade", () => {
    const mourner = SCHEMATICS.find((s) => s.setId === "the-mourners-coat")!;
    const chassis = SCHEMATICS.find((s) => s.setId === "the-first-chassis")!;
    expect(mourner.paths).not.toContain("trade");
    expect(chassis.paths).not.toContain("trade");
  });

  it("eligibility gates schematics to creation-choice axes", () => {
    const op = {
      species: "neyon" as const,
      characterClass: "oracle" as const,
      element: "probability" as const,
      foundation: "humanity" as const,
    };
    const eligible = listEligibleSchematics(op);
    const ids = eligible.map((s) => s.setId);
    // Must include matching axes.
    expect(ids).toContain("regalia-of-the-seeing-stylus"); // oracle class
    expect(ids).toContain("hybrid-vein-panoply"); // ne-yon species
    expect(ids).toContain("dicewrights-motley"); // probability element
    expect(ids).toContain("the-mourners-coat"); // humanity foundation
    // Must exclude non-matching axes of the same categories.
    expect(ids).not.toContain("black-crepe-weave"); // assassin class
    expect(ids).not.toContain("clockwork-exoframe"); // quarchon species
    expect(ids).not.toContain("ember-bellows-array"); // fire element
    expect(ids).not.toContain("the-first-chassis"); // machine foundation

    // Totals: one class + one species + one element + one foundation = 4.
    expect(eligible.length).toBe(4);
  });

  it("isSchematicEligibleForOperative rejects cross-class schematics", () => {
    const op = {
      species: "demagi" as const,
      characterClass: "assassin" as const,
      element: "fire" as const,
      foundation: "machine" as const,
    };
    const oracle = SCHEMATICS.find(
      (s) => s.setId === "regalia-of-the-seeing-stylus",
    )!;
    expect(isSchematicEligibleForOperative(oracle, op)).toBe(false);
  });
});
