/**
 * In-game store products catalog.
 * Defines all purchasable items with Stripe price IDs and in-game effects.
 */
import { VIP_DAILY_REWARD_MULTIPLIER } from "./services/entitlementService";

export interface StoreProduct {
  key: string;
  name: string;
  description: string;
  category:
    | "dream"
    | "void_crystals"
    | "ship"
    | "cards"
    | "cosmetic"
    | "bundle"
    | "battle_pass"
    | "booster"
    | "subscription";
  /**
   * Marks a recurring product. When set, store.ts opens the Stripe
   * Checkout in `mode: "subscription"` against the recurring price
   * resolved from `stripePriceEnv` (which MUST be a recurring Price
   * id). VIP state is then driven entirely by invoice webhooks; there
   * is no cron. `periodDays` is the entitlement window granted per
   * paid invoice.
   */
  subscription?: { periodDays: number };
  /** Price in cents (USD) */
  priceUsd: number;
  /**
   * Optional Stripe price-id env-var name. When set + the env var
   * is present, store.ts's purchase flow passes the resolved
   * price-id to Stripe instead of building inline price_data.
   * Audit Phase L (B4). Setting `process.env.STRIPE_PRICE_*`
   * lets ops swap real Stripe SKUs without a code change.
   */
  stripePriceEnv?: string;
  /** Alternative price in in-game credits (0 = real money only) */
  priceCredits: number;
  /** Alternative price in Dream tokens (0 = not purchasable with Dream) */
  priceDream: number;
  /** Alternative price in Void Crystals (0 = not purchasable with VC) */
  priceVoidCrystals: number;
  /** What the player receives */
  rewards: {
    dreamTokens?: number;
    soulBoundDream?: number;
    voidCrystals?: number;
    credits?: number;
    cardPacks?: number;
    cardPackRarity?: string;
    shipUpgrade?: { type: string; level: number };
    baseUpgrade?: { type: string; level: number };
    cargoExpansion?: number;
    fuelCapacity?: number;
    /** Single cosmetic id (legacy). For multi-cosmetic bundles, use `cosmetics`. */
    cosmetic?: string;
    /** List of cosmetic ids granted by this product. References cosmeticCatalog. */
    cosmetics?: string[];
    /** Battle Pass premium track grant for the current season. */
    battlePassPremium?: boolean;
    /** Convenience-booster duration in real-time hours (XP boost, etc.). */
    boosterHours?: number;
    /** Convenience-booster category (xp, dream_income, pack_discount). */
    boosterKind?: "xp" | "dream_income" | "pack_discount";
    /** Boolean entitlement flag set on userProgress.gameData.entitlements.
     *  Currently gates the `se_founding_author` and
     *  `se_authors_edition_s2` cards (apps/shared/tcg-core/cards/
     *  definitions/s2_hierarchy/special_editions.ts). */
    entitlement?: "foundingAuthor" | "authorsEditionS2";
  };
  /** Is this a featured/promoted item */
  featured: boolean;
  /** Sort order in store */
  sortOrder: number;
  /** Image/icon identifier */
  icon: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  // ═══ SUBSCRIPTION ═══
  {
    key: "vip_monthly",
    name: "Operative's Patronage",
    description: `Monthly VIP — every daily-reward Dream payout boosted ${Math.round(
      (VIP_DAILY_REWARD_MULTIPLIER - 1) * 100,
    )}% while active. Cancel anytime; access runs to the end of the paid period.`,
    category: "subscription",
    priceUsd: 499, // $4.99 / month
    stripePriceEnv: "STRIPE_PRICE_VIP_MONTHLY",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {},
    subscription: { periodDays: 30 },
    featured: true,
    sortOrder: 1,
    icon: "crown",
  },

  // ═══ DREAM PACKS ═══
  {
    key: "dream_starter",
    name: "Dream Starter Pack",
    description: "50 Dream tokens to begin your crafting journey",
    category: "dream",
    priceUsd: 99, // $0.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { dreamTokens: 50 },
    featured: false,
    sortOrder: 1,
    icon: "sparkles",
  },
  {
    key: "dream_bundle",
    name: "Dream Bundle",
    description: "200 Dream tokens — best value for crafters",
    category: "dream",
    priceUsd: 299, // $2.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { dreamTokens: 200 },
    featured: true,
    sortOrder: 2,
    icon: "sparkles",
  },
  {
    key: "dream_vault",
    name: "Dream Vault",
    description: "500 Dream tokens + 50 Soul Bound Dream",
    category: "dream",
    priceUsd: 599, // $5.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { dreamTokens: 500, soulBoundDream: 50 },
    featured: false,
    sortOrder: 3,
    icon: "crown",
  },

  // ═══ CARD PACKS ═══
  {
    key: "card_pack_standard",
    name: "Standard Card Pack",
    description: "5 random cards (guaranteed 1 rare or better)",
    category: "cards",
    priceUsd: 199, // $1.99
    priceCredits: 500,
    priceDream: 25,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 5, cardPackRarity: "rare" },
    featured: false,
    sortOrder: 10,
    icon: "layers",
  },
  {
    key: "card_pack_premium",
    name: "Premium Card Pack",
    description: "10 cards (guaranteed 2 epic or better)",
    category: "cards",
    priceUsd: 499, // $4.99
    priceCredits: 1200,
    priceDream: 60,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 10, cardPackRarity: "epic" },
    featured: true,
    sortOrder: 11,
    icon: "gem",
  },
  {
    key: "card_pack_legendary",
    name: "Legendary Card Pack",
    description: "5 cards (guaranteed 1 legendary)",
    category: "cards",
    priceUsd: 999, // $9.99
    priceCredits: 0,
    priceDream: 150,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 5, cardPackRarity: "legendary" },
    featured: false,
    sortOrder: 12,
    icon: "crown",
  },

  // ═══ DEMON CARD PACKS — HIERARCHY OF THE DAMNED ═══
  {
    key: "demon_pack_standard",
    name: "Demon Pack: Blood Weave",
    description: "5 demon cards from the Hierarchy of the Damned (guaranteed 1 rare+)",
    category: "cards",
    priceUsd: 299, // $2.99
    priceCredits: 0,
    priceDream: 30,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 5, cardPackRarity: "rare" },
    featured: false,
    sortOrder: 13,
    icon: "skull",
  },
  {
    key: "demon_pack_premium",
    name: "Demon Pack: Infernal Gate",
    description: "7 demon cards (guaranteed 1 epic+ and 1 rare+)",
    category: "cards",
    priceUsd: 699, // $6.99
    priceCredits: 0,
    priceDream: 75,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 7, cardPackRarity: "epic" },
    featured: true,
    sortOrder: 14,
    icon: "flame",
  },
  {
    key: "demon_pack_infernal",
    name: "Demon Pack: Mol'Garath's Vault",
    description: "5 elite demon cards (guaranteed 1 legendary+ and 2 epic+)",
    category: "cards",
    priceUsd: 1499, // $14.99
    priceCredits: 0,
    priceDream: 200,
    priceVoidCrystals: 0,
    rewards: { cardPacks: 5, cardPackRarity: "legendary" },
    featured: false,
    sortOrder: 15,
    icon: "crown",
  },

  // ═══ SHIP UPGRADES ═══
  {
    key: "ship_hull_mk2",
    name: "Hull Plating Mk2",
    description: "Reinforced hull — +50 max HP for your Trade Empire ship",
    category: "ship",
    priceUsd: 199, // $1.99
    priceCredits: 800,
    priceDream: 40,
    priceVoidCrystals: 0,
    rewards: { shipUpgrade: { type: "hull", level: 2 } },
    featured: false,
    sortOrder: 20,
    icon: "shield",
  },
  {
    key: "ship_engine_mk2",
    name: "Warp Drive Mk2",
    description: "Enhanced engines — +20 max fuel capacity",
    category: "ship",
    priceUsd: 199, // $1.99
    priceCredits: 800,
    priceDream: 40,
    priceVoidCrystals: 0,
    rewards: { fuelCapacity: 20 },
    featured: false,
    sortOrder: 21,
    icon: "zap",
  },
  {
    key: "ship_cargo_expansion",
    name: "Cargo Bay Expansion",
    description: "Double your cargo capacity for Trade Empire",
    category: "ship",
    priceUsd: 299, // $2.99
    priceCredits: 1000,
    priceDream: 50,
    priceVoidCrystals: 0,
    rewards: { cargoExpansion: 100 },
    featured: false,
    sortOrder: 22,
    icon: "package",
  },
  {
    key: "ship_weapons_mk2",
    name: "Weapons Array Mk2",
    description: "Upgraded weapons — +10 attack power",
    category: "ship",
    priceUsd: 299, // $2.99
    priceCredits: 1000,
    priceDream: 50,
    priceVoidCrystals: 0,
    rewards: { shipUpgrade: { type: "weapons", level: 2 } },
    featured: false,
    sortOrder: 23,
    icon: "swords",
  },

  // ═══ BASE UPGRADES ═══
  {
    key: "base_storage_upgrade",
    name: "Storage Facility Upgrade",
    description: "Increase base storage capacity by 200",
    category: "ship",
    priceUsd: 199, // $1.99
    priceCredits: 600,
    priceDream: 30,
    priceVoidCrystals: 0,
    rewards: { baseUpgrade: { type: "storage", level: 2 } },
    featured: false,
    sortOrder: 30,
    icon: "warehouse",
  },
  {
    key: "base_defense_upgrade",
    name: "Defense Turret Array",
    description: "Boost base defense rating by 25",
    category: "ship",
    priceUsd: 299, // $2.99
    priceCredits: 800,
    priceDream: 40,
    priceVoidCrystals: 0,
    rewards: { baseUpgrade: { type: "defense", level: 2 } },
    featured: false,
    sortOrder: 31,
    icon: "shield",
  },

  // ═══ FIRST PURCHASE BUNDLE ═══
  {
    key: "first_purchase_starter",
    name: "Operative's Welcome Bundle",
    description: "200 Dream + 3 Card Packs + Exclusive Avatar Frame — available first 7 days only!",
    category: "bundle",
    priceUsd: 99, // $0.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {
      dreamTokens: 200,
      cardPacks: 3,
      cardPackRarity: "rare",
      cosmetic: "welcome_operative_frame",
    },
    featured: true,
    sortOrder: 0, // Always show first
    icon: "gift",
  },

  // ═══ BUNDLES ═══
  {
    key: "starter_bundle",
    name: "Operative Starter Bundle",
    description: "100 Dream + 10 Card Pack + Hull Mk2 — everything to get started",
    category: "bundle",
    priceUsd: 499, // $4.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {
      dreamTokens: 100,
      cardPacks: 10,
      cardPackRarity: "rare",
      shipUpgrade: { type: "hull", level: 2 },
    },
    featured: true,
    sortOrder: 40,
    icon: "package",
  },
  {
    key: "commander_bundle",
    name: "Commander's Arsenal",
    description: "500 Dream + 50 Soul Bound + 20 Premium Cards + All Mk2 Upgrades",
    category: "bundle",
    priceUsd: 1999, // $19.99
    stripePriceEnv: "STRIPE_PRICE_COMMANDER_BUNDLE",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {
      dreamTokens: 500,
      soulBoundDream: 50,
      cardPacks: 20,
      cardPackRarity: "epic",
      shipUpgrade: { type: "hull", level: 2 },
      fuelCapacity: 20,
      cargoExpansion: 100,
    },
    featured: true,
    sortOrder: 41,
    icon: "crown",
  },

  // ═══ VOID CRYSTAL PACKS ═══
  // Premium currency. Standard f2p-mobile pyramid: per-VC value
  // improves at higher tiers so whales feel rewarded for going big.
  {
    key: "vc_pack_small",
    name: "Void Crystals: Pouch",
    description: "100 Void Crystals. Premium currency for cosmetics, boosters, and the Battle Pass.",
    category: "void_crystals",
    priceUsd: 199, // $1.99 → 100 VC = ~50 VC/$
    stripePriceEnv: "STRIPE_PRICE_VC_SMALL",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { voidCrystals: 100 },
    featured: false,
    sortOrder: 5,
    icon: "gem",
  },
  {
    key: "vc_pack_medium",
    name: "Void Crystals: Cache",
    description: "300 Void Crystals + 25 bonus.",
    category: "void_crystals",
    priceUsd: 499, // $4.99 → 325 VC = ~65 VC/$
    stripePriceEnv: "STRIPE_PRICE_VC_MEDIUM",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { voidCrystals: 325 },
    featured: true,
    sortOrder: 6,
    icon: "gem",
  },
  {
    key: "vc_pack_large",
    name: "Void Crystals: Vault",
    description: "700 Void Crystals + 100 bonus.",
    category: "void_crystals",
    priceUsd: 999, // $9.99 → 800 VC = ~80 VC/$
    stripePriceEnv: "STRIPE_PRICE_VC_LARGE",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { voidCrystals: 800 },
    featured: false,
    sortOrder: 7,
    icon: "gem",
  },
  {
    key: "vc_pack_huge",
    name: "Void Crystals: Hoard",
    description: "1500 Void Crystals + 300 bonus.",
    category: "void_crystals",
    priceUsd: 1999, // $19.99 → 1800 VC = 90 VC/$
    stripePriceEnv: "STRIPE_PRICE_VC_HUGE",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { voidCrystals: 1800 },
    featured: false,
    sortOrder: 8,
    icon: "gem",
  },
  {
    key: "vc_pack_titanic",
    name: "Void Crystals: Treasury",
    description: "4000 Void Crystals + 1000 bonus.",
    category: "void_crystals",
    priceUsd: 4999, // $49.99 → 5000 VC = 100 VC/$
    stripePriceEnv: "STRIPE_PRICE_VC_TITANIC",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: { voidCrystals: 5000 },
    featured: false,
    sortOrder: 9,
    icon: "crown",
  },

  // ═══ BATTLE PASS ═══
  // Premium track activation. F2P track always free; this just adds
  // the cosmetic-heavy second track and the +20% XP multiplier from
  // ECONOMY.battlePass.premiumXpMultiplier.
  {
    key: "battle_pass_premium",
    name: "Battle Pass: Premium Track",
    description:
      "Unlock the premium Battle Pass track for the current season. " +
      "Adds the cosmetic reward track + a +20% XP multiplier on " +
      "all sources. F2P track stays free.",
    category: "battle_pass",
    priceUsd: 999, // $9.99 — Stripe path
    stripePriceEnv: "STRIPE_PRICE_BATTLE_PASS",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 1000, // matches ECONOMY.battlePass.premiumCostVoidCrystals
    rewards: { battlePassPremium: true },
    featured: true,
    sortOrder: 60,
    icon: "scroll",
  },

  // ═══ CONVENIENCE BOOSTERS ═══
  // Time-savers, never power-savers. The "enhance, not win" layer.
  {
    key: "booster_xp_24h",
    name: "XP Booster — 24h",
    description: "+50% XP from all sources for 24 real-time hours.",
    category: "booster",
    priceUsd: 199, // $1.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 150,
    rewards: { boosterHours: 24, boosterKind: "xp" },
    featured: false,
    sortOrder: 70,
    icon: "zap",
  },
  {
    key: "booster_xp_7d",
    name: "XP Booster — 7 days",
    description: "+50% XP for a full week. Stackable with other boosters.",
    category: "booster",
    priceUsd: 999, // $9.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 700,
    rewards: { boosterHours: 168, boosterKind: "xp" },
    featured: false,
    sortOrder: 71,
    icon: "zap",
  },
  {
    key: "booster_dream_24h",
    name: "Dream Income Booster — 24h",
    description: "+25% Dream from match wins, quests, and login for 24h.",
    category: "booster",
    priceUsd: 199,
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 200,
    rewards: { boosterHours: 24, boosterKind: "dream_income" },
    featured: false,
    sortOrder: 72,
    icon: "sparkles",
  },
  {
    key: "booster_pack_discount_7d",
    name: "Pack Discount Token — 7 days",
    description:
      "10% discount on all pack purchases (Dream and VC) for a week. " +
      "Cannot be combined with bundle discounts.",
    category: "booster",
    priceUsd: 499,
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 400,
    rewards: { boosterHours: 168, boosterKind: "pack_discount" },
    featured: false,
    sortOrder: 73,
    icon: "package",
  },

  // ═══ PREMIUM COSMETIC SKUs (T3) ═══
  // Direct one-shot purchases for the premium cosmetic tier. Mirrors
  // (without overlapping) entries in apps/shared/cosmeticCatalog.ts.
  {
    key: "cosmetic_aura_void_signature",
    name: "Premium Cosmetic: Void Signature Aura",
    description:
      "A signature void-rift aura visible to every player you encounter. " +
      "One of the game's premier social-flex cosmetics.",
    category: "cosmetic",
    priceUsd: 999, // $9.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 800,
    rewards: { cosmetics: ["aura_void_signature"] },
    featured: true,
    sortOrder: 80,
    icon: "sparkles",
  },
  {
    key: "cosmetic_voice_pack_lyra",
    name: "Voice Pack: Lyra Vox",
    description: "Replaces match callouts with studio-recorded Lyra Vox lines.",
    category: "cosmetic",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 1000,
    rewards: { cosmetics: ["voice_pack_companion_lyra"] },
    featured: false,
    sortOrder: 81,
    icon: "mic",
  },
  {
    key: "cosmetic_card_animation_signature",
    name: "Premium Cosmetic: Signature Card Animation",
    description: "Visible card-pull animation during matches.",
    category: "cosmetic",
    priceUsd: 1499, // $14.99
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 1200,
    rewards: { cosmetics: ["card_animation_signature"] },
    featured: false,
    sortOrder: 82,
    icon: "layers",
  },

  // ═══ FOUNDER'S & AUTHOR'S EDITIONS ═══
  // Real "back the game" SKUs — entitlement + bundled VC + Battle Pass +
  // cosmetic suite + early-access content. Sold one-time, real money only.
  // Replaces the placeholder entitlement SKUs that previously granted
  // only the special-edition card.
  {
    key: "entitlement_founding_author",
    name: "Founder's Edition",
    description:
      "The patron tier. Permanent Founding Author entitlement (unlocks the " +
      "Founding Author special-edition card), plus 4500 Void Crystals, three " +
      "months of Battle Pass Premium, exclusive Founder title and aura, and " +
      "25 Premium Card Packs to seed your collection.",
    category: "bundle",
    priceUsd: 4900, // $49.00 — fallback; STRIPE_PRICE_FOUNDING_AUTHOR overrides
    stripePriceEnv: "STRIPE_PRICE_FOUNDING_AUTHOR",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {
      entitlement: "foundingAuthor",
      voidCrystals: 4500,
      battlePassPremium: true,
      cardPacks: 25,
      cardPackRarity: "epic",
      cosmetics: ["title_founder", "aura_archon_flame_premium"],
    },
    featured: true,
    sortOrder: 90,
    icon: "feather",
  },
  {
    key: "entitlement_authors_edition_s2",
    name: "Author's Edition — Season 2",
    description:
      "Season 2 patron tier. Author's Edition S2 entitlement (unlocks the S2 " +
      "special-edition card and exclusive lore entries), 1500 Void Crystals, " +
      "current-season Battle Pass Premium, the S2 signature aura, and " +
      "5 Demon Pack: Infernal Gate packs.",
    category: "bundle",
    priceUsd: 1999, // $19.99 — fallback; STRIPE_PRICE_AUTHORS_EDITION_S2 overrides
    stripePriceEnv: "STRIPE_PRICE_AUTHORS_EDITION_S2",
    priceCredits: 0,
    priceDream: 0,
    priceVoidCrystals: 0,
    rewards: {
      entitlement: "authorsEditionS2",
      voidCrystals: 1500,
      battlePassPremium: true,
      cardPacks: 5,
      cardPackRarity: "epic",
      cosmetics: ["aura_authors_edition_s2"],
    },
    featured: true,
    sortOrder: 91,
    icon: "scroll",
  },
];

export function getProduct(key: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find(p => p.key === key);
}

export function getProductsByCategory(category: StoreProduct["category"]): StoreProduct[] {
  return STORE_PRODUCTS.filter(p => p.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProducts(): StoreProduct[] {
  return STORE_PRODUCTS.filter(p => p.featured).sort((a, b) => a.sortOrder - b.sortOrder);
}
