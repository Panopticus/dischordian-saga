/**
 * Tests for assertSkuAvailable — the time-window + per-user-cap
 * gate used by createCheckout, purchaseWithCredits, and
 * purchaseWithDream. The DB-dependent maxPerUser branch is
 * stubbed via a no-DB environment (getDb() returns null in
 * tests), so this suite covers the date-window logic and the
 * happy path; the integration test for maxPerUser counting
 * lives alongside the storeRouter integration suite.
 */
import { describe, it, expect } from "vitest";
import { assertSkuAvailable } from "./store";
import type { StoreProduct } from "../products";

function makeSku(over: Partial<StoreProduct>): StoreProduct {
  return {
    key: "test_sku",
    name: "Test SKU",
    description: "",
    category: "bundle",
    priceUsd: 199,
    priceCredits: 0,
    priceDream: 0,
    rewards: {},
    featured: false,
    sortOrder: 999,
    icon: "test",
    ...over,
  };
}

describe("assertSkuAvailable — time window", () => {
  const userId = 1;

  it("accepts when no window is set", async () => {
    const sku = makeSku({});
    await expect(assertSkuAvailable(sku, userId, 1, new Date("2026-04-27"))).resolves.toBeUndefined();
  });

  it("rejects before availableFrom", async () => {
    const sku = makeSku({ availableFrom: "2026-05-01T00:00:00Z" });
    await expect(
      assertSkuAvailable(sku, userId, 1, new Date("2026-04-27T00:00:00Z")),
    ).rejects.toThrow(/not yet available/);
  });

  it("accepts on or after availableFrom", async () => {
    const sku = makeSku({ availableFrom: "2026-05-01T00:00:00Z" });
    await expect(
      assertSkuAvailable(sku, userId, 1, new Date("2026-05-01T00:00:01Z")),
    ).resolves.toBeUndefined();
  });

  it("rejects after availableUntil", async () => {
    const sku = makeSku({ availableUntil: "2026-05-08T00:00:00Z" });
    await expect(
      assertSkuAvailable(sku, userId, 1, new Date("2026-05-09T00:00:00Z")),
    ).rejects.toThrow(/no longer available/);
  });

  it("accepts inside the window", async () => {
    const sku = makeSku({
      availableFrom: "2026-05-01T00:00:00Z",
      availableUntil: "2026-05-08T00:00:00Z",
    });
    await expect(
      assertSkuAvailable(sku, userId, 1, new Date("2026-05-04T12:00:00Z")),
    ).resolves.toBeUndefined();
  });
});

describe("assertSkuAvailable — Founder's Bundle window catalog reality check", () => {
  it("rejects 'now' against an availableUntil set in the past", async () => {
    // Sanity check the window-rejection path with the SKU shape
    // the catalog actually ships. Using a cleanly-past timestamp
    // here so the test doesn't rely on the placeholder 2099 value
    // baked into the catalog.
    const founder = makeSku({
      key: "memoir_founders_bundle",
      name: "Memoir Founder's Bundle",
      availableUntil: "2025-12-31T23:59:59Z",
      maxPerUser: 1,
    });
    await expect(
      assertSkuAvailable(founder, 1, 1, new Date("2026-04-27T00:00:00Z")),
    ).rejects.toThrow(/no longer available/);
  });
});
