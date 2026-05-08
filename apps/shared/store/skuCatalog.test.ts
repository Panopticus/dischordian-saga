/**
 * SKU catalog parity test (audit/08.F3).
 *
 * Asserts:
 *   1. Every productKey in apps/server/products.ts has a matching
 *      entry in STORE_SKUS.
 *   2. Every non-`webOnly` SKU has all three (stripePriceEnv,
 *      iosProductId, androidProductId).
 *   3. No duplicate productKeys.
 *   4. Native ids follow the canonical reverse-DNS prefix.
 */
import { describe, it, expect } from "vitest";
import { STORE_PRODUCTS } from "../../server/products";
import { STORE_SKUS, getSku } from "./skuCatalog";

describe("STORE_SKUS catalog", () => {
  it("has no duplicate productKeys", () => {
    const seen = new Set<string>();
    for (const sku of STORE_SKUS) {
      expect(seen.has(sku.productKey), `dup: ${sku.productKey}`).toBe(false);
      seen.add(sku.productKey);
    }
  });

  it("every server product has a matching SKU entry", () => {
    const missing = STORE_PRODUCTS.map((p) => p.key).filter((k) => !getSku(k));
    expect(missing, `server products with no SKU entry: ${missing.join(", ")}`).toEqual([]);
  });

  it("non-webOnly SKUs have all three platform ids", () => {
    const incomplete = STORE_SKUS.filter((s) => !s.webOnly).filter(
      (s) => !s.stripePriceEnv || !s.iosProductId || !s.androidProductId,
    );
    expect(
      incomplete.map((s) => s.productKey),
      "SKUs missing one or more platform ids",
    ).toEqual([]);
  });

  it("native ids follow the reverse-DNS prefix", () => {
    const PREFIX = "ink.dgrslabs.dischordian";
    for (const sku of STORE_SKUS) {
      if (sku.iosProductId) {
        expect(sku.iosProductId.startsWith(PREFIX)).toBe(true);
      }
      if (sku.androidProductId) {
        expect(sku.androidProductId.startsWith(PREFIX)).toBe(true);
      }
    }
  });
});
