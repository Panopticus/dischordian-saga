import { describe, it, expect } from "vitest";
import {
  STORE_SKU_CATALOG,
  resolveInternalKeyFromSku,
} from "./storeSkuCatalog";
import { checkStoreSkuParity } from "../shared/_completeness/checks/storeSkuParity";

describe("store SKU catalog (Balance F7)", () => {
  it("covers every real-money product — parity check gap is zero", () => {
    const r = checkStoreSkuParity();
    expect(r.declared).toBeGreaterThan(0);
    expect(
      r.declared - r.implemented,
      `uncovered real-money SKUs:\n${(r.missing ?? []).join("\n")}`,
    ).toBe(0);
  });

  it("every entry declares non-empty web/ios/android identifiers", () => {
    for (const [key, m] of Object.entries(STORE_SKU_CATALOG)) {
      expect(m.web, `${key}.web`).toBeTruthy();
      expect(m.ios, `${key}.ios`).toBeTruthy();
      expect(m.android, `${key}.android`).toBeTruthy();
    }
  });

  it("resolves a platform SKU (and the internal key) back to the key", () => {
    expect(resolveInternalKeyFromSku("ios", "com.dischordiansaga.dream_vault")).toBe(
      "dream_vault",
    );
    expect(resolveInternalKeyFromSku("android", "dream_vault")).toBe(
      "dream_vault",
    );
    // legacy/web callers may pass the internal key directly
    expect(resolveInternalKeyFromSku("web", "dream_vault")).toBe(
      "dream_vault",
    );
    expect(resolveInternalKeyFromSku("ios", "totally_unknown_sku")).toBeNull();
  });
});
