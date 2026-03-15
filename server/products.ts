/**
 * In-game store products catalog.
 * Defines all purchasable items with Stripe price IDs and in-game effects.
 */

export interface StoreProduct {
  key: string;
  name: string;
  description: string;
  category: "dream" | "ship" | "cards" | "cosmetic" | "bundle";
  /** Price in cents (USD) */
  priceUsd: number;
  /** Alternative price in in-game credits (0 = real money only) */
  priceCredits: number;
  /** Alternative price in Dream tokens (0 = not purchasable with Dream) */
  priceDream: number;
  /** What the player receives */
  rewards: {
    dreamTokens?: number;
    soulBoundDream?: number;
    credits?: number;
    cardPacks?: number;
    cardPackRarity?: string;
    shipUpgrade?: { type: string; level: number };
    baseUpgrade?: { type: string; level: number };
    cargoExpansion?: number;
    fuelCapacity?: number;
    cosmetic?: string;
  };
  /** Is this a featured/promoted item */
  featured: boolean;
  /** Sort order in store */
  sortOrder: number;
  /** Image/icon identifier */
  icon: string;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  // ═══ DREAM PACKS ═══
  {
    key: "dream_starter",
    name: "Dream Starter Pack",
    description: "50 Dream tokens to begin your crafting journey",
    category: "dream",
    priceUsd: 99, // $0.99
    priceCredits: 0,
    priceDream: 0,
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
    rewards: { cardPacks: 5, cardPackRarity: "legendary" },
    featured: false,
    sortOrder: 12,
    icon: "crown",
  },

  // ═══ SHIP UPGRADES ═══
  {
    key: "ship_hull_mk2",
    name: "Hull Plating Mk2",
    description: "Reinforced hull — +50 max HP for your Trade Wars ship",
    category: "ship",
    priceUsd: 199, // $1.99
    priceCredits: 800,
    priceDream: 40,
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
    rewards: { fuelCapacity: 20 },
    featured: false,
    sortOrder: 21,
    icon: "zap",
  },
  {
    key: "ship_cargo_expansion",
    name: "Cargo Bay Expansion",
    description: "Double your cargo capacity for Trade Wars",
    category: "ship",
    priceUsd: 299, // $2.99
    priceCredits: 1000,
    priceDream: 50,
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
    rewards: { baseUpgrade: { type: "defense", level: 2 } },
    featured: false,
    sortOrder: 31,
    icon: "shield",
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
    priceCredits: 0,
    priceDream: 0,
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
