/**
 * Cross-platform SKU catalog — single source of truth for product
 * keys mapped to Stripe price ids, App Store product ids, and
 * Play Store product ids.
 *
 * audit/08.F3 — the `ProductSku` interface in
 * apps/client/src/lib/payments/index.ts declared all three platform
 * ids but no populated catalog existed; the server's
 * apps/server/products.ts had only `stripePriceEnv`. A SKU listed on
 * Stripe with no matching App Store Connect / Play Console entry
 * silently fails native checkout.
 *
 * The shape:
 *   - `productKey` — the canonical id used everywhere (server logs,
 *     fulfilment ledger, client buttons).
 *   - `stripePriceEnv` — env var name resolving to the live Stripe
 *     price id (e.g. `STRIPE_PRICE_DREAM_STARTER`). Indirection so
 *     dev/staging/prod can point at different price objects without
 *     code changes.
 *   - `iosProductId` / `androidProductId` — platform-specific SKU
 *     strings that must be created in App Store Connect / Play Console.
 *     Convention: reverse-DNS ink.dgrslabs.dischordian.<key>.
 *   - `webOnly: true` — explicit acknowledgement that a SKU is web-
 *     only; the parity check at boot ignores these for native
 *     verification.
 *
 * The parity test (apps/shared/store/skuCatalog.test.ts) asserts:
 *   - Every server product (apps/server/products.ts) has a
 *     skuCatalog entry.
 *   - Every non-`webOnly` entry has all three ids.
 *   - No duplicate productKeys across the catalog.
 */

export type SkuPlatform = "web" | "ios" | "android";

export interface SkuEntry {
  productKey: string;
  /** Env var name that resolves to the Stripe price id at runtime. */
  stripePriceEnv: string | null;
  /** App Store Connect product id, or null for web-only. */
  iosProductId: string | null;
  /** Google Play Console product id, or null for web-only. */
  androidProductId: string | null;
  /** True iff this SKU is intentionally not sold on native platforms
   *  (e.g. legal/compliance carve-outs, or platform-fee-sensitive
   *  bundles). The parity check skips these. */
  webOnly?: boolean;
}

const NATIVE_PREFIX = "ink.dgrslabs.dischordian";

/** The full catalog. Add a new SKU here AND in apps/server/products.ts.
 *  The parity test will fail loudly if either side drifts. */
export const STORE_SKUS: ReadonlyArray<SkuEntry> = [
  // ── Subscription ──
  {
    productKey: "vip_monthly",
    stripePriceEnv: "STRIPE_PRICE_VIP_MONTHLY",
    iosProductId: `${NATIVE_PREFIX}.vip.monthly`,
    androidProductId: `${NATIVE_PREFIX}.vip.monthly`,
  },

  // ── Dream Tokens ──
  {
    productKey: "dream_starter",
    stripePriceEnv: "STRIPE_PRICE_DREAM_STARTER",
    iosProductId: `${NATIVE_PREFIX}.dream.starter`,
    androidProductId: `${NATIVE_PREFIX}.dream.starter`,
  },
  {
    productKey: "dream_bundle",
    stripePriceEnv: "STRIPE_PRICE_DREAM_BUNDLE",
    iosProductId: `${NATIVE_PREFIX}.dream.bundle`,
    androidProductId: `${NATIVE_PREFIX}.dream.bundle`,
  },
  {
    productKey: "dream_vault",
    stripePriceEnv: "STRIPE_PRICE_DREAM_VAULT",
    iosProductId: `${NATIVE_PREFIX}.dream.vault`,
    androidProductId: `${NATIVE_PREFIX}.dream.vault`,
  },

  // ── Card Packs ──
  {
    productKey: "card_pack_standard",
    stripePriceEnv: "STRIPE_PRICE_CARD_PACK_STANDARD",
    iosProductId: `${NATIVE_PREFIX}.cards.standard`,
    androidProductId: `${NATIVE_PREFIX}.cards.standard`,
  },
  {
    productKey: "card_pack_premium",
    stripePriceEnv: "STRIPE_PRICE_CARD_PACK_PREMIUM",
    iosProductId: `${NATIVE_PREFIX}.cards.premium`,
    androidProductId: `${NATIVE_PREFIX}.cards.premium`,
  },
  {
    productKey: "card_pack_legendary",
    stripePriceEnv: "STRIPE_PRICE_CARD_PACK_LEGENDARY",
    iosProductId: `${NATIVE_PREFIX}.cards.legendary`,
    androidProductId: `${NATIVE_PREFIX}.cards.legendary`,
  },

  // ── Demon Packs ──
  {
    productKey: "demon_pack_standard",
    stripePriceEnv: "STRIPE_PRICE_DEMON_PACK_STANDARD",
    iosProductId: `${NATIVE_PREFIX}.demon.standard`,
    androidProductId: `${NATIVE_PREFIX}.demon.standard`,
  },
  {
    productKey: "demon_pack_premium",
    stripePriceEnv: "STRIPE_PRICE_DEMON_PACK_PREMIUM",
    iosProductId: `${NATIVE_PREFIX}.demon.premium`,
    androidProductId: `${NATIVE_PREFIX}.demon.premium`,
  },
  {
    productKey: "demon_pack_infernal",
    stripePriceEnv: "STRIPE_PRICE_DEMON_PACK_INFERNAL",
    iosProductId: `${NATIVE_PREFIX}.demon.infernal`,
    androidProductId: `${NATIVE_PREFIX}.demon.infernal`,
  },

  // ── Ship/Base upgrades — web-only (Trade Wars meta-game; native
  // surfaces don't currently expose Trade Wars purchase flow). ──
  { productKey: "ship_hull_mk2", stripePriceEnv: "STRIPE_PRICE_SHIP_HULL_MK2", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "ship_engine_mk2", stripePriceEnv: "STRIPE_PRICE_SHIP_ENGINE_MK2", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "ship_cargo_expansion", stripePriceEnv: "STRIPE_PRICE_SHIP_CARGO_EXPANSION", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "ship_weapons_mk2", stripePriceEnv: "STRIPE_PRICE_SHIP_WEAPONS_MK2", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "base_storage_upgrade", stripePriceEnv: "STRIPE_PRICE_BASE_STORAGE_UPGRADE", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "base_defense_upgrade", stripePriceEnv: "STRIPE_PRICE_BASE_DEFENSE_UPGRADE", iosProductId: null, androidProductId: null, webOnly: true },

  // ── Bundles + first-purchase ──
  {
    productKey: "first_purchase_starter",
    stripePriceEnv: "STRIPE_PRICE_FIRST_PURCHASE",
    iosProductId: `${NATIVE_PREFIX}.bundle.firststep`,
    androidProductId: `${NATIVE_PREFIX}.bundle.firststep`,
  },
  {
    productKey: "starter_bundle",
    stripePriceEnv: "STRIPE_PRICE_STARTER_BUNDLE",
    iosProductId: `${NATIVE_PREFIX}.bundle.starter`,
    androidProductId: `${NATIVE_PREFIX}.bundle.starter`,
  },
  {
    productKey: "commander_bundle",
    stripePriceEnv: "STRIPE_PRICE_COMMANDER_BUNDLE",
    iosProductId: `${NATIVE_PREFIX}.bundle.commander`,
    androidProductId: `${NATIVE_PREFIX}.bundle.commander`,
  },

  // ── Void Crystals (premium currency) ──
  {
    productKey: "vc_pack_small",
    stripePriceEnv: "STRIPE_PRICE_VC_SMALL",
    iosProductId: `${NATIVE_PREFIX}.vc.small`,
    androidProductId: `${NATIVE_PREFIX}.vc.small`,
  },
  {
    productKey: "vc_pack_medium",
    stripePriceEnv: "STRIPE_PRICE_VC_MEDIUM",
    iosProductId: `${NATIVE_PREFIX}.vc.medium`,
    androidProductId: `${NATIVE_PREFIX}.vc.medium`,
  },
  {
    productKey: "vc_pack_large",
    stripePriceEnv: "STRIPE_PRICE_VC_LARGE",
    iosProductId: `${NATIVE_PREFIX}.vc.large`,
    androidProductId: `${NATIVE_PREFIX}.vc.large`,
  },
  {
    productKey: "vc_pack_huge",
    stripePriceEnv: "STRIPE_PRICE_VC_HUGE",
    iosProductId: `${NATIVE_PREFIX}.vc.huge`,
    androidProductId: `${NATIVE_PREFIX}.vc.huge`,
  },
  {
    productKey: "vc_pack_titanic",
    stripePriceEnv: "STRIPE_PRICE_VC_TITANIC",
    iosProductId: `${NATIVE_PREFIX}.vc.titanic`,
    androidProductId: `${NATIVE_PREFIX}.vc.titanic`,
  },

  // ── Battle Pass + boosters ──
  {
    productKey: "battle_pass_premium",
    stripePriceEnv: "STRIPE_PRICE_BATTLE_PASS",
    iosProductId: `${NATIVE_PREFIX}.battlepass.premium`,
    androidProductId: `${NATIVE_PREFIX}.battlepass.premium`,
  },
  {
    productKey: "booster_xp_24h",
    stripePriceEnv: "STRIPE_PRICE_BOOSTER_XP_24H",
    iosProductId: `${NATIVE_PREFIX}.booster.xp24h`,
    androidProductId: `${NATIVE_PREFIX}.booster.xp24h`,
  },
  {
    productKey: "booster_xp_7d",
    stripePriceEnv: "STRIPE_PRICE_BOOSTER_XP_7D",
    iosProductId: `${NATIVE_PREFIX}.booster.xp7d`,
    androidProductId: `${NATIVE_PREFIX}.booster.xp7d`,
  },
  {
    productKey: "booster_dream_24h",
    stripePriceEnv: "STRIPE_PRICE_BOOSTER_DREAM_24H",
    iosProductId: `${NATIVE_PREFIX}.booster.dream24h`,
    androidProductId: `${NATIVE_PREFIX}.booster.dream24h`,
  },
  {
    productKey: "booster_pack_discount_7d",
    stripePriceEnv: "STRIPE_PRICE_BOOSTER_PACK_DISCOUNT_7D",
    iosProductId: `${NATIVE_PREFIX}.booster.packdiscount7d`,
    androidProductId: `${NATIVE_PREFIX}.booster.packdiscount7d`,
  },

  // ── Cosmetics ──
  {
    productKey: "cosmetic_aura_void_signature",
    stripePriceEnv: "STRIPE_PRICE_COSMETIC_AURA_VOID",
    iosProductId: `${NATIVE_PREFIX}.cosmetic.auravoidsignature`,
    androidProductId: `${NATIVE_PREFIX}.cosmetic.auravoidsignature`,
  },
  {
    productKey: "cosmetic_voice_pack_lyra",
    stripePriceEnv: "STRIPE_PRICE_COSMETIC_VOICE_LYRA",
    iosProductId: `${NATIVE_PREFIX}.cosmetic.voicepacklyra`,
    androidProductId: `${NATIVE_PREFIX}.cosmetic.voicepacklyra`,
  },
  {
    productKey: "cosmetic_card_animation_signature",
    stripePriceEnv: "STRIPE_PRICE_COSMETIC_CARD_ANIM",
    iosProductId: `${NATIVE_PREFIX}.cosmetic.cardanimsignature`,
    androidProductId: `${NATIVE_PREFIX}.cosmetic.cardanimsignature`,
  },

  // ── Entitlements (Founders / Author's Edition) — web-only,
  // store policies disallow large patron tiers as IAP. ──
  { productKey: "entitlement_founding_author", stripePriceEnv: "STRIPE_PRICE_FOUNDER", iosProductId: null, androidProductId: null, webOnly: true },
  { productKey: "entitlement_authors_edition_s2", stripePriceEnv: "STRIPE_PRICE_AUTHORS_EDITION_S2", iosProductId: null, androidProductId: null, webOnly: true },
] as const;

const skuByKey = new Map(STORE_SKUS.map((s) => [s.productKey, s] as const));

/** Look up a SKU by productKey. Returns null when no entry exists —
 *  callers must handle (server.ts logs and 404s; clients hide the
 *  button). */
export function getSku(productKey: string): SkuEntry | null {
  return skuByKey.get(productKey) ?? null;
}

/** Resolve the platform-specific id for a SKU, or null if web-only
 *  / not configured for that platform. */
export function resolveNativeId(
  sku: SkuEntry,
  platform: "ios" | "android",
): string | null {
  return platform === "ios" ? sku.iosProductId : sku.androidProductId;
}
