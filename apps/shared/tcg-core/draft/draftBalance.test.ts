import { describe, expect, it } from "vitest";
import {
  REMOVAL_OP_NAMES,
  isRemovalCard,
  countRemovals,
  rarityBreakdown,
  capLegendaryWeight,
  LEGENDARY_WEIGHT_CAP,
  greedyDeckPenalty,
  GREEDY_LEGENDARY_THRESHOLD,
  GREEDY_REMOVAL_THRESHOLD,
  GREEDY_PENALTY,
  type DraftBalanceCard,
} from "./draftBalance";

describe("REMOVAL_OP_NAMES", () => {
  it("includes the canonical removal ops", () => {
    expect(REMOVAL_OP_NAMES.has("deal_damage")).toBe(true);
    expect(REMOVAL_OP_NAMES.has("destroy")).toBe(true);
    expect(REMOVAL_OP_NAMES.has("banish")).toBe(true);
    expect(REMOVAL_OP_NAMES.has("silence")).toBe(true);
  });
});

describe("isRemovalCard", () => {
  it("returns false for cards with no opNames", () => {
    expect(isRemovalCard({ id: "c1" })).toBe(false);
  });

  it("returns true for removal-op cards", () => {
    expect(isRemovalCard({ id: "c1", opNames: ["deal_damage"] })).toBe(true);
    expect(isRemovalCard({ id: "c1", opNames: new Set(["destroy"]) })).toBe(true);
  });

  it("returns false for non-removal cards", () => {
    expect(isRemovalCard({ id: "c1", opNames: ["buff", "heal"] })).toBe(false);
  });

  it("returns true if ANY op is removal", () => {
    expect(isRemovalCard({ id: "c1", opNames: ["buff", "deal_damage"] })).toBe(true);
  });
});

describe("countRemovals", () => {
  it("counts removal cards in a pool", () => {
    const pool: DraftBalanceCard[] = [
      { id: "a", opNames: ["deal_damage"] },
      { id: "b", opNames: ["buff"] },
      { id: "c", opNames: ["destroy"] },
      { id: "d", opNames: ["heal"] },
    ];
    expect(countRemovals(pool)).toBe(2);
  });

  it("returns 0 for an empty pool", () => {
    expect(countRemovals([])).toBe(0);
  });
});

describe("rarityBreakdown", () => {
  it("counts per-rarity correctly", () => {
    const pool: DraftBalanceCard[] = [
      { id: "a", rarity: "common" },
      { id: "b", rarity: "common" },
      { id: "c", rarity: "rare" },
      { id: "d", rarity: "legendary" },
    ];
    const counts = rarityBreakdown(pool);
    expect(counts.common).toBe(2);
    expect(counts.rare).toBe(1);
    expect(counts.legendary).toBe(1);
  });

  it("buckets missing rarities under 'unknown'", () => {
    const pool: DraftBalanceCard[] = [{ id: "a" }];
    expect(rarityBreakdown(pool).unknown).toBe(1);
  });
});

describe("capLegendaryWeight", () => {
  it("caps a value above the threshold", () => {
    const w = { legendary: 12, common: 10 };
    capLegendaryWeight(w);
    expect(w.legendary).toBe(LEGENDARY_WEIGHT_CAP);
    expect(w.common).toBe(10);
  });

  it("leaves a value below the threshold unchanged", () => {
    const w = { legendary: 5 };
    capLegendaryWeight(w);
    expect(w.legendary).toBe(5);
  });

  it("is a no-op when legendary key is missing", () => {
    const w = { common: 10 };
    expect(() => capLegendaryWeight(w)).not.toThrow();
    expect("legendary" in w).toBe(false);
  });

  it("LEGENDARY_WEIGHT_CAP is 8 (audit'd value)", () => {
    expect(LEGENDARY_WEIGHT_CAP).toBe(8);
  });
});

describe("greedyDeckPenalty", () => {
  it("returns 0 for a fresh deck", () => {
    expect(greedyDeckPenalty({ id: "x", rarity: "rare" }, [])).toBe(0);
  });

  it("penalises legendaries when count >= threshold", () => {
    const deck: DraftBalanceCard[] = Array.from({ length: GREEDY_LEGENDARY_THRESHOLD }, (_, i) => ({
      id: `l${i}`,
      rarity: "legendary",
    }));
    expect(greedyDeckPenalty({ id: "new", rarity: "legendary" }, deck)).toBe(GREEDY_PENALTY);
  });

  it("does NOT penalise legendaries below the threshold", () => {
    const deck: DraftBalanceCard[] = [{ id: "l1", rarity: "legendary" }];
    expect(greedyDeckPenalty({ id: "new", rarity: "legendary" }, deck)).toBe(0);
  });

  it("penalises removals when count >= threshold", () => {
    const deck: DraftBalanceCard[] = Array.from({ length: GREEDY_REMOVAL_THRESHOLD }, (_, i) => ({
      id: `r${i}`,
      opNames: ["deal_damage"],
    }));
    expect(greedyDeckPenalty({ id: "new", opNames: ["destroy"] }, deck)).toBe(GREEDY_PENALTY);
  });

  it("stacks penalties for legendary-AND-removal cards", () => {
    const deck: DraftBalanceCard[] = [
      ...Array.from({ length: GREEDY_LEGENDARY_THRESHOLD }, (_, i) => ({
        id: `l${i}`,
        rarity: "legendary",
      })),
      ...Array.from({ length: GREEDY_REMOVAL_THRESHOLD }, (_, i) => ({
        id: `r${i}`,
        opNames: ["deal_damage"] as readonly string[],
      })),
    ];
    expect(
      greedyDeckPenalty(
        { id: "new", rarity: "legendary", opNames: ["destroy"] },
        deck,
      ),
    ).toBe(GREEDY_PENALTY * 2);
  });
});
