/**
 * Cross-platform store-SKU catalog (Balance F7).
 *
 * Single source of truth mapping each internal product `key`
 * (apps/server/products.ts) to its per-platform store identifiers.
 * Closes the audit gap where `priceUsd` was defined per product with
 * **no** per-platform SKU mapping and `iapReceipt.ts` trusted a raw
 * client `productId` with nothing cross-checking the catalogs —
 * price/SKU drift between web/iOS/Android was a silent revenue +
 * store-policy risk.
 *
 * Entries are explicit (not generated) on purpose: the
 * `economy.store_sku_parity` ship-check statically reads these
 * literals, and App Store / Play SKUs frequently need per-product
 * overrides — a generated convention would hide exactly the drift
 * this catalog exists to prevent. `iapReceipt.verify` resolves the
 * client SKU through `resolveInternalKeyFromSku` and rejects anything
 * not in this map.
 *
 * Conventions (override per row as the real store listings require):
 *  - `web`     — the internal key (store.ts already keys on this).
 *  - `ios`     — App Store product id (reverse-DNS namespace).
 *  - `android` — Google Play SKU.
 */

export interface StoreSkuMapping {
  web: string;
  ios: string;
  android: string;
}

/** internal product key → per-platform store identifiers. */
export const STORE_SKU_CATALOG: Record<string, StoreSkuMapping> = {
  "vip_monthly": { web: "vip_monthly", ios: "com.dischordiansaga.vip_monthly", android: "vip_monthly" },
  "dream_starter": { web: "dream_starter", ios: "com.dischordiansaga.dream_starter", android: "dream_starter" },
  "dream_bundle": { web: "dream_bundle", ios: "com.dischordiansaga.dream_bundle", android: "dream_bundle" },
  "dream_vault": { web: "dream_vault", ios: "com.dischordiansaga.dream_vault", android: "dream_vault" },
  "card_pack_standard": { web: "card_pack_standard", ios: "com.dischordiansaga.card_pack_standard", android: "card_pack_standard" },
  "card_pack_premium": { web: "card_pack_premium", ios: "com.dischordiansaga.card_pack_premium", android: "card_pack_premium" },
  "card_pack_legendary": { web: "card_pack_legendary", ios: "com.dischordiansaga.card_pack_legendary", android: "card_pack_legendary" },
  "demon_pack_standard": { web: "demon_pack_standard", ios: "com.dischordiansaga.demon_pack_standard", android: "demon_pack_standard" },
  "demon_pack_premium": { web: "demon_pack_premium", ios: "com.dischordiansaga.demon_pack_premium", android: "demon_pack_premium" },
  "demon_pack_infernal": { web: "demon_pack_infernal", ios: "com.dischordiansaga.demon_pack_infernal", android: "demon_pack_infernal" },
  "ship_hull_mk2": { web: "ship_hull_mk2", ios: "com.dischordiansaga.ship_hull_mk2", android: "ship_hull_mk2" },
  "ship_engine_mk2": { web: "ship_engine_mk2", ios: "com.dischordiansaga.ship_engine_mk2", android: "ship_engine_mk2" },
  "ship_cargo_expansion": { web: "ship_cargo_expansion", ios: "com.dischordiansaga.ship_cargo_expansion", android: "ship_cargo_expansion" },
  "ship_weapons_mk2": { web: "ship_weapons_mk2", ios: "com.dischordiansaga.ship_weapons_mk2", android: "ship_weapons_mk2" },
  "base_storage_upgrade": { web: "base_storage_upgrade", ios: "com.dischordiansaga.base_storage_upgrade", android: "base_storage_upgrade" },
  "base_defense_upgrade": { web: "base_defense_upgrade", ios: "com.dischordiansaga.base_defense_upgrade", android: "base_defense_upgrade" },
  "first_purchase_starter": { web: "first_purchase_starter", ios: "com.dischordiansaga.first_purchase_starter", android: "first_purchase_starter" },
  "starter_bundle": { web: "starter_bundle", ios: "com.dischordiansaga.starter_bundle", android: "starter_bundle" },
  "commander_bundle": { web: "commander_bundle", ios: "com.dischordiansaga.commander_bundle", android: "commander_bundle" },
  "vc_pack_small": { web: "vc_pack_small", ios: "com.dischordiansaga.vc_pack_small", android: "vc_pack_small" },
  "vc_pack_medium": { web: "vc_pack_medium", ios: "com.dischordiansaga.vc_pack_medium", android: "vc_pack_medium" },
  "vc_pack_large": { web: "vc_pack_large", ios: "com.dischordiansaga.vc_pack_large", android: "vc_pack_large" },
  "vc_pack_huge": { web: "vc_pack_huge", ios: "com.dischordiansaga.vc_pack_huge", android: "vc_pack_huge" },
  "vc_pack_titanic": { web: "vc_pack_titanic", ios: "com.dischordiansaga.vc_pack_titanic", android: "vc_pack_titanic" },
  "battle_pass_premium": { web: "battle_pass_premium", ios: "com.dischordiansaga.battle_pass_premium", android: "battle_pass_premium" },
  "booster_xp_24h": { web: "booster_xp_24h", ios: "com.dischordiansaga.booster_xp_24h", android: "booster_xp_24h" },
  "booster_xp_7d": { web: "booster_xp_7d", ios: "com.dischordiansaga.booster_xp_7d", android: "booster_xp_7d" },
  "booster_dream_24h": { web: "booster_dream_24h", ios: "com.dischordiansaga.booster_dream_24h", android: "booster_dream_24h" },
  "booster_pack_discount_7d": { web: "booster_pack_discount_7d", ios: "com.dischordiansaga.booster_pack_discount_7d", android: "booster_pack_discount_7d" },
  "cosmetic_aura_void_signature": { web: "cosmetic_aura_void_signature", ios: "com.dischordiansaga.cosmetic_aura_void_signature", android: "cosmetic_aura_void_signature" },
  "cosmetic_voice_pack_lyra": { web: "cosmetic_voice_pack_lyra", ios: "com.dischordiansaga.cosmetic_voice_pack_lyra", android: "cosmetic_voice_pack_lyra" },
  "cosmetic_card_animation_signature": { web: "cosmetic_card_animation_signature", ios: "com.dischordiansaga.cosmetic_card_animation_signature", android: "cosmetic_card_animation_signature" },
  "entitlement_founding_author": { web: "entitlement_founding_author", ios: "com.dischordiansaga.entitlement_founding_author", android: "entitlement_founding_author" },
  "entitlement_authors_edition_s2": { web: "entitlement_authors_edition_s2", ios: "com.dischordiansaga.entitlement_authors_edition_s2", android: "entitlement_authors_edition_s2" },
};

export type StorePlatform = "web" | "ios" | "android";

/**
 * Resolve a platform-specific store SKU back to its internal product
 * key. Accepts the internal key itself too (web flows / legacy
 * callers that already pass the key). Returns null for an unknown
 * SKU — callers MUST reject rather than trust it.
 */
export function resolveInternalKeyFromSku(
  platform: StorePlatform,
  sku: string,
): string | null {
  for (const [key, m] of Object.entries(STORE_SKU_CATALOG)) {
    if (m[platform] === sku || key === sku) return key;
  }
  return null;
}
