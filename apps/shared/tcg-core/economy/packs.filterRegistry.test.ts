/**
 * Tests for filterRegistryBySet — the set-aware view of the
 * CardRegistry used by Memoir SKU rewards.
 */
import { describe, it, expect } from "vitest";
import { buildCardRegistry } from "../cards/loader";
import { filterRegistryBySet, openPack } from "./packs";
import type { CardDefinition } from "../types/Card";

function defStub(over: Partial<CardDefinition> & { id: string }): CardDefinition {
  const base = {
    name: over.name ?? "Test Card",
    faction: over.faction ?? "neutral",
    cardType: over.cardType ?? "spell",
    rarity: over.rarity ?? "common",
    cost: over.cost ?? 1,
    keywords: over.keywords ?? [],
    abilities: over.abilities ?? [],
    art: over.art ?? "test://art",
    flavorText: over.flavorText ?? "",
    rulesVersion: over.rulesVersion ?? "1.0.0",
    ...(over.cardType === "unit" && !over.baseStats
      ? { baseStats: { power: 1, health: 1 } }
      : {}),
    ...over,
  };
  return base as unknown as CardDefinition;
}

const sample: CardDefinition[] = [
  defStub({ id: "s1_a" as any, cardType: "unit", baseStats: { power: 1, health: 1 } }),
  defStub({ id: "s1_b" as any, cardType: "unit", baseStats: { power: 1, health: 1 } }),
  defStub({ id: "s1_c" as any, rarity: "rare" }),
  defStub({ id: "s2_x" as any, cardType: "unit", baseStats: { power: 2, health: 2 } }),
  defStub({ id: "s2_y" as any, rarity: "epic" }),
  defStub({ id: "act3_z" as any, rarity: "legendary" }),
];

describe("filterRegistryBySet", () => {
  it("limits listAll() to the requested set", () => {
    const full = buildCardRegistry(sample);
    const memoir = filterRegistryBySet(full, "S1_MEMOIR");
    const ids = memoir.listAll().map((c) => c.id);
    expect(ids.sort()).toEqual(["s1_a", "s1_b", "s1_c"]);
  });

  it("get/has reject cards that exist but are in another set", () => {
    const full = buildCardRegistry(sample);
    const memoir = filterRegistryBySet(full, "S1_MEMOIR");
    expect(memoir.get("s2_x")).toBeUndefined();
    expect(memoir.has("s2_x")).toBe(false);
    expect(memoir.get("s1_a")?.id).toBe("s1_a");
    expect(memoir.has("s1_a")).toBe(true);
    expect(memoir.get("nope")).toBeUndefined();
  });

  it("S2_HIERARCHY view sees only s2_*", () => {
    const full = buildCardRegistry(sample);
    const view = filterRegistryBySet(full, "S2_HIERARCHY");
    const ids = view.listAll().map((c) => c.id);
    expect(ids.sort()).toEqual(["s2_x", "s2_y"]);
  });

  it("ACT_EXCLUSIVES view sees only act{1..7}_*", () => {
    const full = buildCardRegistry(sample);
    const view = filterRegistryBySet(full, "ACT_EXCLUSIVES");
    expect(view.listAll().map((c) => c.id)).toEqual(["act3_z"]);
  });

  it("returns frozen objects (defensive — no caller mutation)", () => {
    const full = buildCardRegistry(sample);
    const view = filterRegistryBySet(full, "S1_MEMOIR");
    expect(Object.isFrozen(view)).toBe(true);
    expect(Object.isFrozen(view.listAll())).toBe(true);
  });

  it("openPack against a set-filtered view never pulls cross-set cards", () => {
    const full = buildCardRegistry(sample);
    const memoirOnly = filterRegistryBySet(full, "S1_MEMOIR");
    // Run several seeds and assert every pulled id has the s1_ prefix.
    for (let i = 0; i < 20; i++) {
      const pulled = openPack(`seed_${i}`, memoirOnly).cardDefIds;
      for (const id of pulled) {
        expect(id.startsWith("s1_"), `pulled non-memoir card '${id}'`).toBe(true);
      }
    }
  });
});
