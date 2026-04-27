/**
 * In-game store products catalog.
 * Defines all purchasable items with Stripe price IDs and in-game effects.
 */
import type { SetCode } from "../shared/tcg-core/sets/setCode";

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
    /**
     * Legacy per-card grant from the `cards` MySQL table (random pull,
     * keyed by string id of the MySQL row). Used by pre-Memoir SKUs.
     * For new TCG-set-aware SKUs use `tcgPack` below.
     */
    cardPacks?: number;
    cardPackRarity?: string;
    shipUpgrade?: { type: string; level: number };
    baseUpgrade?: { type: string; level: number };
    cargoExpansion?: number;
    fuelCapacity?: number;
    cosmetic?: string;
    /**
     * Set-aware booster reward. Each booster runs the canonical
     * `openPack` algorithm (apps/shared/tcg-core/economy/packs.ts)
     * against the in-memory `serverCardRegistry` filtered to the
     * given set code. Granted card ids are the registry's string
     * ids (e.g. "s1_char_001"), not MySQL row ids.
     *
     * Multiplied by checkout `quantity` at fulfillment.
     */
    tcgPack?: {
      setCode: SetCode;
      /** Number of booster packs (each is `cardsPerBooster` cards). */
      boosters: number;
      /** Cards per booster. Default 5 to match STANDARD_PACK. */
      cardsPerBooster?: number;
      /**
       * Min rarity for the guaranteed slot 0 of each booster. When
       * absent, no minimum (full RARITY_THRESHOLDS table applies).
       */
      minRarityFloor?: "rare" | "epic" | "legendary";
    };
    /**
     * Founder-tier perks. Recorded as data here; consumers (cosmetic
     * UI, title bar, pity-buff lookup, set-completion serial gallery)
     * read from this catalog + the storePurchases history. Wired
     * into UI surfaces in Sprint 2 alongside the StorePage.
     */
    titleId?: string;
    pityBuff?: { percent: number; durationDays: number };
    foundersEdition?: true;
  };
  /** Is this a featured/promoted item */
  featured: boolean;
  /** Sort order in store */
  sortOrder: number;
  /** Image/icon identifier */
  icon: string;
  /**
   * Optional ISO-8601 timestamp the SKU becomes purchasable.
   * Absent ⇒ available immediately.
   */
  availableFrom?: string;
  /**
   * Optional ISO-8601 timestamp after which the SKU is no longer
   * purchasable. Used for the week-1 Founder's Bundle window.
   */
  availableUntil?: string;
  /**
   * When set, each user can buy this SKU at most this many times
   * (across all payment methods). Founder's Bundle is 1; everything
   * else is unlimited (absent = no cap).
   */
  maxPerUser?: number;
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

  // ═══ DEMON CARD PACKS — HIERARCHY OF THE DAMNED ═══
  {
    key: "demon_pack_standard",
    name: "Demon Pack: Blood Weave",
    description: "5 demon cards from the Hierarchy of the Damned (guaranteed 1 rare+)",
    category: "cards",
    priceUsd: 299, // $2.99
    priceCredits: 0,
    priceDream: 30,
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
    description: "Double your cargo capacity for Trade Empire",
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

  // ═══ FIRST PURCHASE BUNDLE ═══
  {
    key: "first_purchase_starter",
    name: "Operative's Welcome Bundle",
    description: "200 Dream + 3 Card Packs + Exclusive Avatar Frame — available first 7 days only!",
    category: "bundle",
    priceUsd: 99, // $0.99
    priceCredits: 0,
    priceDream: 0,
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

  // ═══ S1 MEMOIR — Commercial Launch SKUs ═══
  // Priced per the Founding Week table in
  // /root/.claude/plans/do-a-full-an-stateful-quill.md (Commercial
  // Release & Collector Roadmap §1).
  {
    key: "memoir_booster",
    name: "Memoir Booster",
    description: "5 cards from Season One: The Memoir. Guaranteed 1 rare or better.",
    category: "cards",
    priceUsd: 199, // $1.99
    priceCredits: 0,
    priceDream: 50,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 1, cardsPerBooster: 5, minRarityFloor: "rare" },
    },
    featured: true,
    sortOrder: 100,
    icon: "package",
  },
  {
    key: "memoir_display",
    name: "Memoir Display",
    description: "15 Memoir Boosters (75 cards). Best value per booster.",
    category: "bundle",
    priceUsd: 2499, // $24.99
    priceCredits: 0,
    priceDream: 700,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 15, cardsPerBooster: 5, minRarityFloor: "rare" },
    },
    featured: true,
    sortOrder: 101,
    icon: "boxes",
  },
  {
    key: "starter_architect_memoir",
    name: "Architect Starter — Memoir",
    description: "Architect-faction starter deck + 3 Memoir Boosters + Architect profile frame.",
    category: "bundle",
    priceUsd: 999, // $9.99
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_architect",
    },
    featured: false,
    sortOrder: 110,
    icon: "shield",
  },
  {
    key: "starter_insurgency_memoir",
    name: "Insurgency Starter — Memoir",
    description: "Insurgency starter deck + 3 Memoir Boosters + Insurgency profile frame.",
    category: "bundle",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_insurgency",
    },
    featured: false,
    sortOrder: 111,
    icon: "swords",
  },
  {
    key: "starter_dreamer_memoir",
    name: "Dreamer Starter — Memoir",
    description: "Dreamer starter deck + 3 Memoir Boosters + Dreamer profile frame.",
    category: "bundle",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_dreamer",
    },
    featured: false,
    sortOrder: 112,
    icon: "moon",
  },
  {
    key: "starter_new_babylon_memoir",
    name: "New Babylon Starter — Memoir",
    description: "New Babylon starter deck + 3 Memoir Boosters + Babylon profile frame.",
    category: "bundle",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_new_babylon",
    },
    featured: false,
    sortOrder: 113,
    icon: "tower",
  },
  {
    key: "starter_antiquarian_memoir",
    name: "Antiquarian Starter — Memoir",
    description: "Antiquarian starter deck + 3 Memoir Boosters + Antiquarian profile frame.",
    category: "bundle",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_antiquarian",
    },
    featured: false,
    sortOrder: 114,
    icon: "scroll",
  },
  {
    key: "starter_thought_virus_memoir",
    name: "Thought Virus Starter — Memoir",
    description: "Thought Virus starter deck + 3 Memoir Boosters + Thought Virus profile frame.",
    category: "bundle",
    priceUsd: 999,
    priceCredits: 0,
    priceDream: 250,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 3, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "frame_starter_thought_virus",
    },
    featured: false,
    sortOrder: 115,
    icon: "biohazard",
  },
  {
    key: "memoir_collector_bundle",
    name: "Memoir Collector Bundle",
    description: "All 6 starter decks + 30 Memoir Boosters + animated board skin.",
    category: "bundle",
    priceUsd: 6999, // $69.99
    priceCredits: 0,
    priceDream: 2200,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 30, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "board_skin_memoir_animated",
    },
    featured: true,
    sortOrder: 120,
    icon: "crown",
  },
  // Founder's Bundle — week-1 only, 1-per-user. Includes everything
  // in the Collector Bundle plus the irreproducible perks: badge,
  // animated title, +20% pity buff for 30 days, serialized "Founding
  // Author" alt-art mythic card. The launch script must set
  // availableUntil to (launch_ts + 7 days).
  {
    key: "memoir_founders_bundle",
    name: "Memoir Founder's Bundle",
    description:
      "Collector Bundle + Founder badge + animated 'Founding Author' title + +20% pity buff (30 days) + serialized 1-of-N alt-art mythic. Week one only.",
    category: "bundle",
    priceUsd: 11999, // $119.99
    priceCredits: 0,
    priceDream: 4000,
    rewards: {
      tcgPack: { setCode: "S1_MEMOIR", boosters: 30, cardsPerBooster: 5, minRarityFloor: "rare" },
      cosmetic: "badge_founder_2026",
      titleId: "founding_author_animated",
      pityBuff: { percent: 20, durationDays: 30 },
      foundersEdition: true,
    },
    featured: true,
    sortOrder: 99, // Just under sortOrder 100 — right above Memoir Booster
    icon: "star",
    // availableUntil set at deploy time to launch_ts + 7d. Stub left
    // here so the gating code path is exercised by tests; production
    // overrides via env-driven config in Sprint 2's StorePage prep.
    availableUntil: "2099-12-31T23:59:59Z",
    maxPerUser: 1,
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
