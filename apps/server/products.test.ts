/**
 * Smoke tests for the STORE_PRODUCTS catalog. Locks the prices,
 * SKU keys, and reward shapes that ship for Founding Week so an
 * accidental edit fails CI loudly rather than silently shipping
 * wrong DT/USD pricing.
 */
import { describe, it, expect } from "vitest";
import { STORE_PRODUCTS, getProduct, type StoreProduct } from "./products";

describe("STORE_PRODUCTS — Memoir SKUs", () => {
  it("has exactly the 10 Memoir SKUs from the commercial roadmap", () => {
    const memoirKeys = STORE_PRODUCTS.filter((p) =>
      p.key.startsWith("memoir_") || p.key.startsWith("starter_") && p.key.endsWith("_memoir"),
    ).map((p) => p.key).sort();

    expect(memoirKeys).toEqual([
      "memoir_booster",
      "memoir_collector_bundle",
      "memoir_display",
      "memoir_founders_bundle",
      "starter_antiquarian_memoir",
      "starter_architect_memoir",
      "starter_dreamer_memoir",
      "starter_insurgency_memoir",
      "starter_new_babylon_memoir",
      "starter_thought_virus_memoir",
    ]);
  });

  it("memoir_booster — 50 DT / $1.99 / 1 booster of 5 cards from S1_MEMOIR", () => {
    const p = getProduct("memoir_booster")!;
    expect(p.priceDream).toBe(50);
    expect(p.priceUsd).toBe(199);
    expect(p.rewards.tcgPack).toEqual({
      setCode: "S1_MEMOIR",
      boosters: 1,
      cardsPerBooster: 5,
      minRarityFloor: "rare",
    });
  });

  it("memoir_display — 700 DT / $24.99 / 15 boosters", () => {
    const p = getProduct("memoir_display")!;
    expect(p.priceDream).toBe(700);
    expect(p.priceUsd).toBe(2499);
    expect(p.rewards.tcgPack?.boosters).toBe(15);
  });

  it("each faction starter — 250 DT / $9.99 / 3 boosters + faction frame", () => {
    const factions = [
      "architect", "insurgency", "dreamer",
      "new_babylon", "antiquarian", "thought_virus",
    ];
    for (const f of factions) {
      const p = getProduct(`starter_${f}_memoir`);
      expect(p, `missing starter for ${f}`).toBeDefined();
      expect(p!.priceDream).toBe(250);
      expect(p!.priceUsd).toBe(999);
      expect(p!.rewards.tcgPack?.boosters).toBe(3);
      expect(p!.rewards.cosmetic).toBe(`frame_starter_${f}`);
    }
  });

  it("memoir_collector_bundle — 2200 DT / $69.99 / 30 boosters + animated board skin", () => {
    const p = getProduct("memoir_collector_bundle")!;
    expect(p.priceDream).toBe(2200);
    expect(p.priceUsd).toBe(6999);
    expect(p.rewards.tcgPack?.boosters).toBe(30);
    expect(p.rewards.cosmetic).toBe("board_skin_memoir_animated");
  });

  it("memoir_founders_bundle — 4000 DT / $119.99 / week-1 gated / 1-per-user / full perk set", () => {
    const p = getProduct("memoir_founders_bundle")!;
    expect(p.priceDream).toBe(4000);
    expect(p.priceUsd).toBe(11999);
    expect(p.maxPerUser).toBe(1);
    expect(p.availableUntil).toBeDefined();
    expect(p.rewards.tcgPack?.boosters).toBe(30);
    expect(p.rewards.cosmetic).toBe("badge_founder_2026");
    expect(p.rewards.titleId).toBe("founding_author_animated");
    expect(p.rewards.pityBuff).toEqual({ percent: 20, durationDays: 30 });
    expect(p.rewards.foundersEdition).toBe(true);
  });

  it("Memoir SKUs all target S1_MEMOIR (no accidental cross-set pulls)", () => {
    const memoir = STORE_PRODUCTS.filter((p) =>
      p.rewards.tcgPack !== undefined &&
      (p.key.startsWith("memoir_") || p.key.endsWith("_memoir")),
    );
    expect(memoir.length).toBe(10);
    for (const p of memoir) {
      expect(p.rewards.tcgPack?.setCode, `${p.key} not S1_MEMOIR`).toBe("S1_MEMOIR");
    }
  });
});

describe("STORE_PRODUCTS — invariants across the whole catalog", () => {
  it("every SKU key is unique", () => {
    const keys = STORE_PRODUCTS.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every SKU has at least one priced path (USD, credits, or DT)", () => {
    const free = STORE_PRODUCTS.filter(
      (p) => p.priceUsd <= 0 && p.priceCredits <= 0 && p.priceDream <= 0,
    );
    expect(free.map((p) => p.key)).toEqual([]);
  });

  it("availableUntil > availableFrom when both are set", () => {
    for (const p of STORE_PRODUCTS) {
      if (p.availableFrom && p.availableUntil) {
        expect(new Date(p.availableUntil).getTime()).toBeGreaterThan(
          new Date(p.availableFrom).getTime(),
        );
      }
    }
  });

  it("maxPerUser is a positive integer when set", () => {
    for (const p of STORE_PRODUCTS) {
      if (p.maxPerUser !== undefined) {
        expect(Number.isInteger(p.maxPerUser)).toBe(true);
        expect(p.maxPerUser).toBeGreaterThan(0);
      }
    }
  });
});
