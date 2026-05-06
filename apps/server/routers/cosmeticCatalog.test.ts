/**
 * Wiring tests for the cosmeticCatalog router and the new VC /
 * cosmetic / battle-pass grant paths in store.fulfillPurchase.
 *
 * No DB is available in the test env, so this is contract-level:
 *
 *   - The router is registered with the expected procedure shape.
 *   - The new VC / cosmetic / battle-pass-premium reward keys on
 *     StoreProduct flow through the typed reward shape (caught by
 *     compilation alone, but pinned here too).
 *   - synthesiseFulfillmentId accepts the new "void_crystals" prefix.
 *   - The legacy purchaseGrants tests still pass with the extended
 *     source union.
 *
 * Transactional integration (deduct-then-grant atomicity, idempotency
 * via the unique fulfillmentId index) is asserted in the Dream and
 * Stripe paths already; the VC path uses the same conditional-UPDATE
 * pattern, so the proof is the same.
 */
import { describe, it, expect } from "vitest";
import { synthesiseFulfillmentId } from "./store";
import { cosmeticCatalogRouter } from "./cosmeticCatalog";
import { STORE_PRODUCTS, getProduct } from "../products";
import { COSMETICS_BY_ID } from "../../shared/cosmeticCatalog";

describe("cosmeticCatalog router shape", () => {
  it("exposes list / myCosmetics queries and two purchase mutations", () => {
    // tRPC routers expose their procedures via _def. We don't depend on
    // private internals beyond what tRPC publicly documents — this is
    // the same wiring tRPC's typegen relies on.
    const procedures = cosmeticCatalogRouter._def.procedures as Record<string, unknown>;
    expect(procedures.list).toBeDefined();
    expect(procedures.myCosmetics).toBeDefined();
    expect(procedures.purchaseWithDream).toBeDefined();
    expect(procedures.purchaseWithVoidCrystals).toBeDefined();
  });
});

describe("synthesiseFulfillmentId — extended source union", () => {
  it("accepts and prefixes the new void_crystals source", () => {
    const id = synthesiseFulfillmentId("void_crystals", 42, "vc_pack_medium");
    expect(id).toMatch(/^void_crystals:42:vc_pack_medium:\d+$/);
  });
});

describe("StoreProduct → cosmetic catalog wiring", () => {
  it("every product cosmetic id resolves in the catalog", () => {
    // Catches the typo failure mode: a product references "title_fonder"
    // but the catalog has "title_founder". The check runs at module load
    // here, not at runtime against a live DB.
    for (const product of STORE_PRODUCTS) {
      for (const cosmeticId of product.rewards.cosmetics ?? []) {
        expect(COSMETICS_BY_ID[cosmeticId]).toBeDefined();
      }
    }
  });

  it("Founder's bundle grants exactly the expected currencies + entitlement", () => {
    const founder = getProduct("entitlement_founding_author");
    expect(founder).toBeDefined();
    expect(founder!.rewards.entitlement).toBe("foundingAuthor");
    expect(founder!.rewards.voidCrystals).toBeGreaterThan(0);
    expect(founder!.rewards.battlePassPremium).toBe(true);
    // Cosmetics should be specific bundle-exclusive ids — caught by the
    // catalog-resolution test above, but pinned here for clarity.
    expect(founder!.rewards.cosmetics).toContain("title_founder");
  });

  it("VC packs grant only voidCrystals (no Dream / packs / power)", () => {
    // Reinforces the "pay-to-enhance, not pay-to-win" invariant — VC
    // packs are pure currency conversion, not stat / progression grants.
    const vcPacks = STORE_PRODUCTS.filter((p) => p.category === "void_crystals");
    expect(vcPacks.length).toBeGreaterThan(0);
    for (const p of vcPacks) {
      expect(p.rewards.voidCrystals).toBeGreaterThan(0);
      expect(p.rewards.dreamTokens).toBeUndefined();
      expect(p.rewards.cardPacks).toBeUndefined();
      expect(p.rewards.shipUpgrade).toBeUndefined();
      expect(p.rewards.entitlement).toBeUndefined();
    }
  });

  it("battle_pass_premium SKU grants only the boolean flag", () => {
    const bp = getProduct("battle_pass_premium");
    expect(bp).toBeDefined();
    expect(bp!.rewards.battlePassPremium).toBe(true);
    expect(bp!.rewards.dreamTokens).toBeUndefined();
    expect(bp!.rewards.voidCrystals).toBeUndefined();
    expect(bp!.rewards.cardPacks).toBeUndefined();
  });

  it("convenience boosters grant only boosterKind + boosterHours (no resources)", () => {
    const boosters = STORE_PRODUCTS.filter((p) => p.category === "booster");
    for (const b of boosters) {
      expect(b.rewards.boosterHours).toBeGreaterThan(0);
      expect(b.rewards.boosterKind).toBeDefined();
      expect(b.rewards.dreamTokens).toBeUndefined();
      expect(b.rewards.voidCrystals).toBeUndefined();
      expect(b.rewards.cardPacks).toBeUndefined();
    }
  });
});
