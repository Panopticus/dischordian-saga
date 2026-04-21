/* Christmas in July — Event-Exclusive Rewards & Art Prompts */

export interface FestiveReward {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type:
    | "pet_accessory"
    | "specimen"
    | "item"
    | "cosmetic"
    | "consumable"
    | "title"
    | "trophy";
  artPrompt: string;
  howToObtain: string;
  /** Only grantable during the live Christmas-in-July event window.
   *  Pre-existing Dreamer level does NOT retroactively unlock these. */
  eventWindowExclusive?: true;
  /** USD threshold for donor-tier trophies. */
  donorUsdThreshold?: number;
}

export const FESTIVE_REWARDS: FestiveReward[] = [
  // Pet Accessories
  { id: "santa_hat", name: "Santa Hat", description: "A tiny Santa hat. Fits any companion. Tilted at a jaunty angle.", rarity: "common", type: "pet_accessory",
    artPrompt: "A tiny Santa hat for a creature companion, bright red with white fluffy trim, slightly oversized and tilted, small golden bell at tip, warm glow. Transparent background. 128x128.",
    howToObtain: "Wheel / Daily Challenge / Craft (5 Festive Tokens)" },
  { id: "reindeer_antlers", name: "Reindeer Antlers", description: "Tiny antlers headband with holly. Your companion looks festive and confused.", rarity: "common", type: "pet_accessory",
    artPrompt: "Tiny reindeer antlers headband, warm brown with red berries and green holly, slightly sparkly, cute and festive. Transparent background. 128x128.",
    howToObtain: "Wheel / Gift Exchange" },
  { id: "candy_cane_collar", name: "Candy Cane Collar", description: "A collar of intertwined candy canes with a golden bell. Sweet.", rarity: "uncommon", type: "pet_accessory",
    artPrompt: "Small collar made of intertwined candy canes, red and white stripes, tiny golden bell charm. Transparent background. 128x128.",
    howToObtain: "Daily Challenge Day 4" },
  { id: "snowflake_aura", name: "Snowflake Aura", description: "A ring of crystalline snowflakes orbiting your companion. Elegant winter energy.", rarity: "rare", type: "pet_accessory",
    artPrompt: "Circular aura of delicate crystalline snowflakes orbiting in a ring, blue-white and gold, subtle elegant, magical winter energy. Transparent background. 256x256.",
    howToObtain: "5 Snowflake Soul Stones" },
  { id: "tinsel_trail", name: "Tinsel Trail", description: "Your companion leaves a sparkling trail of holographic tinsel wherever it goes.", rarity: "rare", type: "pet_accessory",
    artPrompt: "Horizontal trail of holographic tinsel in red, green, gold, sparkling and flowing, festive particle effect. Transparent background. 256x64.",
    howToObtain: "14-day consecutive daily challenge bonus" },
  { id: "degens_party_hat", name: "The Degen's Party Hat", description: "Gold and purple with dice patterns. One gold eye, one purple eye — ancient and knowing, like the host himself. Over-the-top casino luxury miniaturized. Pets who wear it occasionally stare into the middle distance as if glimpsing something cosmic.", rarity: "legendary", type: "pet_accessory",
    artPrompt: "Tiny extravagant party hat, gold and purple with dice pattern, one gold eye one purple eye watermark, confetti bursting from top, casino luxury miniaturized. Transparent background. 128x128.",
    howToObtain: "Casino Jackpot (0.5% wheel)" },

  // Specimen
  { id: "jingle_wisp", name: "Jingle Wisp", description: "A tiny orb of concentrated holiday spirit — the crystallized joy of every banned Christmas celebration in New Babylon's history. +3% bond gains during event, +1% permanently.", rarity: "epic", type: "specimen",
    artPrompt: "Small warm orb of red and green light with miniature ornaments orbiting like electrons, golden musical notes trailing behind, warm joyful slightly mischievous, Christmas warmth meets casino neon. Transparent background. 256x256.",
    howToObtain: "Festive Specimen Egg (4% from Wheel, craft from 3 Snowflake Stones)" },

  // Legendary Item
  { id: "last_ornament", name: "The Last Ornament", description: "The last Christmas ornament from the last tree in New Babylon. Cracked but held together by golden light. Inside: a holographic scene of people gathered around a tree. The physical embodiment of the last act of public joy before joy was criminalized.", rarity: "legendary", type: "item",
    artPrompt: "Last Christmas ornament — single cracked glass sphere held together by golden kintsugi light, inside a tiny holographic scene of people around a tree, flickers between joy and loss, warm golden glow radiates outward. Transparent background. 256x256.",
    howToObtain: "0.5% from Wheel OR complete ALL 14 daily challenges with full consecutive bonuses" },

  // Titles
  { id: "spirit_of_degenmas", name: "Spirit of Degenmas", description: "You gave the most valuable item in your inventory to another player. This title is permanent and visible. You chose generosity over hoarding.", rarity: "legendary", type: "title",
    artPrompt: "",
    howToObtain: "Day 14 challenge: give your most valuable item to another player" },
  { id: "charity_champion", name: "Charity Champion", description: "Premium supporter. 25% of your purchase went to LCIF.", rarity: "epic", type: "title",
    artPrompt: "",
    howToObtain: "Charity Champion Pack purchase ($14.99)" },
  { id: "the_ones_who_gave", name: "The Ones Who Gave", description: "Community-wide title. The community reached 250,000 gifts. You were part of it.", rarity: "legendary", type: "title",
    artPrompt: "",
    howToObtain: "Community Milestone 5: 250,000 gifts sent" },

  // Iron Clad Lions Donor Trophies — event-window-exclusive. Only
  // obtainable by donating during Christmas in July. A pre-existing
  // Dreamer level does NOT retroactively unlock these. Donation
  // dollars still credit the Order of the Dreamer ladder in parallel
  // (see cijDreamerBridge.ts).
  { id: "iron_clad_lions_trophy_bronze", name: "Bronze Lion Plaque", description: "A small bronze plaque struck with the Iron Clad Lions sigil, dated to this year's Christmas in July. Permanent display trophy on your profile and character sheet.", rarity: "rare", type: "trophy",
    eventWindowExclusive: true, donorUsdThreshold: 25,
    artPrompt: "Small cast-bronze plaque with the Iron Clad Lions gold-lion-mask sigil at center, year inscription beneath, oak-leaf border, warm patina, soft side light. Transparent background. 256x256.",
    howToObtain: "Donate $25 to LCIF during Christmas in July" },
  { id: "iron_clad_lions_trophy_silver", name: "Silver Lion Chalice", description: "A polished silver chalice engraved with the Iron Clad Lions mane rosary. Carries an inscription slot for the mane etching you unlock at next Lions Club renewal.", rarity: "epic", type: "trophy",
    eventWindowExclusive: true, donorUsdThreshold: 50,
    artPrompt: "Ornate silver chalice, Iron Clad Lions mane rosary engraved around the bowl, year stamped at the foot, inscription band blank for personalization, warm gallery lighting. Transparent background. 256x256.",
    howToObtain: "Donate $50 to LCIF during Christmas in July" },
  { id: "iron_clad_lions_trophy_gold", name: "Gold Lion Reliquary", description: "A gold reliquary in the shape of a miniature lion-mask. The flagship donor trophy for this year's Christmas in July. Companion purchase of DGRS Lions Club membership recommended for the full Iron Clad Lions armor rental.", rarity: "legendary", type: "trophy",
    eventWindowExclusive: true, donorUsdThreshold: 100,
    artPrompt: "Ornate gold reliquary shaped as a miniature Iron Clad Lions mask, deep-red velvet interior visible through a crystal window, engraved mane with ten names around the base, iridescent gleam. Transparent background. 256x256.",
    howToObtain: "Donate $100 to LCIF during Christmas in July" },
];

/** Snowflake Stone crafting recipes */
export const SNOWFLAKE_RECIPES = [
  { id: "snowflake_to_egg", name: "Festive Specimen Egg", cost: 3, description: "3 Snowflake Stones → 1 Festive Specimen Egg (chance at Jingle Wisp)" },
  { id: "snowflake_to_accessory", name: "Pet Accessory of Choice", cost: 5, description: "5 Snowflake Stones → choose any Festive Pet Accessory" },
  { id: "snowflake_to_miracle", name: "Degenmas Miracle", cost: 10, description: "10 Snowflake Stones → 1 guaranteed purification with 0% failure rate" },
] as const;
