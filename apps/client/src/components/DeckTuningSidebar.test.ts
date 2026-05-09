import { describe, it, expect } from "vitest";
import { buildStats, type DeckTuningEntry } from "./DeckTuningSidebar";

const unit = (cardId: string, cost: number, power: number, toughness: number, opts: { keywords?: readonly string[]; balanceException?: boolean } = {}): DeckTuningEntry => ({
  card: {
    cardId,
    cost,
    power,
    toughness,
    cardType: "unit",
    keywords: opts.keywords ?? [],
    balanceException: opts.balanceException
      ? { reason: "test", reviewer: "test" }
      : null,
  },
  quantity: 1,
});

describe("DeckTuningSidebar — buildStats (audit/16 PR 18 Cluster F)", () => {
  it("returns zero units for an empty deck", () => {
    const s = buildStats([]);
    expect(s.totalUnits).toBe(0);
    expect(s.avgKeywordCount).toBe(0);
    expect(s.offCurveCount).toBe(0);
    expect(s.skewedCost).toBeNull();
  });

  it("counts unit-type cards only (skips spells/items)", () => {
    const deck: DeckTuningEntry[] = [
      unit("u1", 3, 3, 4),
      {
        card: { cardId: "s1", cost: 2, cardType: "spell", keywords: [] },
        quantity: 2,
      },
    ];
    const s = buildStats(deck);
    expect(s.totalUnits).toBe(1);
  });

  it("respects quantity in totalUnits", () => {
    const deck: DeckTuningEntry[] = [
      { ...unit("u1", 3, 3, 4), quantity: 3 },
      { ...unit("u2", 5, 5, 6), quantity: 2 },
    ];
    const s = buildStats(deck);
    expect(s.totalUnits).toBe(5);
  });

  it("buckets units by cost", () => {
    const deck: DeckTuningEntry[] = [
      { ...unit("u1", 3, 3, 4), quantity: 4 },
      { ...unit("u2", 5, 5, 6), quantity: 1 },
    ];
    const s = buildStats(deck);
    const cost3 = s.buckets.find((b) => b.cost === 3);
    const cost5 = s.buckets.find((b) => b.cost === 5);
    expect(cost3?.count).toBe(4);
    expect(cost5?.count).toBe(1);
  });

  it("flags off-curve units that lack a balanceException", () => {
    // cost 3 expects 7 stat-total; 12 = above-curve.
    const deck: DeckTuningEntry[] = [unit("u_above", 3, 7, 5)];
    const s = buildStats(deck);
    expect(s.offCurveCount).toBe(1);
  });

  it("ignores off-curve units that DO have a balanceException", () => {
    const deck: DeckTuningEntry[] = [
      unit("u_above", 3, 7, 5, { balanceException: true }),
    ];
    const s = buildStats(deck);
    expect(s.offCurveCount).toBe(0);
  });

  it("emits a curve-skew warning when one bucket exceeds 30%", () => {
    // 4 cost-3 units + 1 cost-5 = 80% at cost 3.
    const deck: DeckTuningEntry[] = [
      { ...unit("u1", 3, 3, 4), quantity: 4 },
      { ...unit("u2", 5, 5, 6), quantity: 1 },
    ];
    const s = buildStats(deck);
    expect(s.skewedCost).toBe(3);
    expect(s.skewedPct).toBeCloseTo(0.8, 5);
  });

  it("does NOT emit skew warning for balanced curves", () => {
    // 5 buckets, 1 unit each = 20% per bucket, all under 30%.
    const deck: DeckTuningEntry[] = [
      unit("u1", 1, 1, 2),
      unit("u2", 2, 2, 3),
      unit("u3", 3, 3, 4),
      unit("u4", 4, 4, 5),
      unit("u5", 5, 5, 6),
    ];
    const s = buildStats(deck);
    expect(s.skewedCost).toBeNull();
  });

  it("computes avgKeywordCount across the full deck", () => {
    const deck: DeckTuningEntry[] = [
      unit("u1", 3, 3, 4, { keywords: ["rush"] }),
      unit("u2", 3, 3, 4, { keywords: ["rush", "shielded"] }),
      unit("u3", 3, 3, 4, { keywords: [] }),
    ];
    const s = buildStats(deck);
    // (1 + 2 + 0) / 3 = 1.0
    expect(s.avgKeywordCount).toBeCloseTo(1.0, 5);
  });

  it("bucket efficiency reflects member cards", () => {
    const deck: DeckTuningEntry[] = [unit("u_below", 3, 2, 1)]; // total 3 vs expected 7
    const s = buildStats(deck);
    const cost3 = s.buckets.find((b) => b.cost === 3);
    expect(cost3?.efficiency).toBe("below");
  });

  it("bucket efficiency = 'none' when no cards in that bucket", () => {
    const deck: DeckTuningEntry[] = [unit("u1", 3, 3, 4)];
    const s = buildStats(deck);
    const cost7 = s.buckets.find((b) => b.cost === 7);
    expect(cost7?.efficiency).toBe("none");
  });
});
