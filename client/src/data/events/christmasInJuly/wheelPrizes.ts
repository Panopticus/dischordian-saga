/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — WHEEL OF FORTUNE PRIZES
   The Degen's Casino: 12-segment prize wheel

   Weights sum to 1.0. Each spin costs 5 Festive Tokens.
   The wheel is rigged in the players' favor — the Degen
   insists this is "good business, not charity."
   ═══════════════════════════════════════════════════════ */

export type PrizeType =
  | "tokens"
  | "cosmetic"
  | "consumable"
  | "gift_box"
  | "soul_stone"
  | "pet_accessory"
  | "free_spin"
  | "specimen_egg"
  | "charity_multiplier"
  | "jackpot";

export type PrizeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface WheelPrize {
  id: string;
  name: string;
  description: string;
  weight: number;
  prizeType: PrizeType;
  amount: number;
  rarity: PrizeRarity;
  artPrompt: string;
}

export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: "wheel_tokens_10",
    name: "10 Dream Tokens",
    description: "A modest handful of Dream Tokens, warm from the Degen's pocket. He swears they're not counterfeit.",
    weight: 0.20,
    prizeType: "tokens",
    amount: 10,
    rarity: "common",
    artPrompt: "A small pile of glowing cyan dream tokens scattered on green felt, warm casino lighting, faint holographic shimmer, sci-fi fantasy style, dark background. 256x256.",
  },
  {
    id: "wheel_cosmetic_fragment",
    name: "Festive Cosmetic Fragment (1/5)",
    description: "One-fifth of a holiday cosmetic set. Collect all five fragments to forge the complete 'Degen's Delight' outfit — a garish holiday sweater that glows in the dark and plays music nobody asked for.",
    weight: 0.15,
    prizeType: "cosmetic",
    amount: 1,
    rarity: "uncommon",
    artPrompt: "A glowing crystal shard shaped like a snowflake, one-fifth of a larger pattern visible in faint holographic outline, festive red and green energy swirling inside, sci-fi Christmas aesthetic, dark background with falling digital snow. 256x256.",
  },
  {
    id: "wheel_candy_cane_xp",
    name: "Candy Cane +5% XP (1hr)",
    description: "A candy cane infused with Ne-Yon temporal energy. Grants +5% XP for one hour. Tastes like peppermint and probability.",
    weight: 0.15,
    prizeType: "consumable",
    amount: 1,
    rarity: "common",
    artPrompt: "A sci-fi candy cane glowing with swirling XP energy, red and white stripes pulsing with cyan data streams, small +5% holographic text floating above it, festive sci-fi style, dark background. 256x256.",
  },
  {
    id: "wheel_gift_box",
    name: "Gift Box",
    description: "A mystery gift box wrapped in holographic paper. Can be opened for a random reward or — and the Degen strongly recommends this — gifted to another player for bonus Festive Tokens.",
    weight: 0.12,
    prizeType: "gift_box",
    amount: 1,
    rarity: "uncommon",
    artPrompt: "A holographic gift box wrapped in shimmering red and green paper with a golden bow, faint glowing runes on the surface, floating slightly above a casino table, festive sci-fi aesthetic, warm lighting. 256x256.",
  },
  {
    id: "wheel_tokens_25",
    name: "25 Dream Tokens",
    description: "A respectable stack of Dream Tokens. The Degen nods approvingly. 'Now THAT'S a pull.'",
    weight: 0.10,
    prizeType: "tokens",
    amount: 25,
    rarity: "uncommon",
    artPrompt: "A tall stack of glowing cyan dream tokens on green casino felt, golden light radiating from the pile, holographic '25' floating above, festive sci-fi style, dark background. 256x256.",
  },
  {
    id: "wheel_snowflake_soul_stone",
    name: "Snowflake Soul Stone",
    description: "A Soul Stone crystallized in the shape of a perfect snowflake. Pre-purified — it resonates with the Dreamer's light. The Necromancer raises an eyebrow: 'Interesting. The universe is feeling generous today.'",
    weight: 0.08,
    prizeType: "soul_stone",
    amount: 1,
    rarity: "rare",
    artPrompt: "A golden soul stone in the shape of an intricate snowflake, radiating warm divine light, faint harmonic waves visible around it, Dreamer's gold and white color palette, crystalline structure, dark background with falling golden particles. 256x256.",
  },
  {
    id: "wheel_holiday_pet_accessory",
    name: "Holiday Pet Accessory",
    description: "A random festive accessory for your Eidolon companion. Tiny Santa hat, reindeer antlers, or a scarf that smells like cinnamon and starship fuel. Your pet's dignity may not survive.",
    weight: 0.07,
    prizeType: "pet_accessory",
    amount: 1,
    rarity: "rare",
    artPrompt: "A collection of tiny festive pet accessories floating in a holographic display: miniature Santa hat, reindeer antlers, glowing scarf, all with sci-fi elements like circuit patterns and soft neon trim, warm holiday lighting, dark background. 256x256.",
  },
  {
    id: "wheel_degens_iou",
    name: "Degen's IOU (Free Spin)",
    description: "A crumpled napkin with the Degen's signature and the words 'GOOD FOR ONE (1) FREE SPIN — NO BACKSIES.' It smells like eggnog and bad decisions.",
    weight: 0.05,
    prizeType: "free_spin",
    amount: 1,
    rarity: "rare",
    artPrompt: "A crumpled cocktail napkin with hastily scrawled handwriting glowing with Ne-Yon energy, a wax seal in the shape of a dice, holographic 'FREE SPIN' text shimmering above, casino bar aesthetic, warm lighting. 256x256.",
  },
  {
    id: "wheel_festive_specimen_egg",
    name: "Festive Specimen Egg",
    description: "A specimen egg wrapped in holiday lights. Contains the Jingle Wisp — a limited-edition companion that hums carols and leaves a trail of snowflakes. It is extremely annoying and extremely beloved.",
    weight: 0.04,
    prizeType: "specimen_egg",
    amount: 1,
    rarity: "epic",
    artPrompt: "A luminous specimen egg wrapped in tiny glowing holiday lights, red and green bioluminescence pulsing inside, snowflake patterns forming on the shell surface, cradled in a nest of tinsel and circuitry, dark background with soft festive bokeh. 256x256.",
  },
  {
    id: "wheel_charity_multiplier",
    name: "Charity Donation Multiplier",
    description: "The next 100 Festive Tokens you spend have their LCIF donation percentage doubled from 10% to 20%. The Antiquarian inscribes: 'Generosity multiplied is generosity remembered.'",
    weight: 0.02,
    prizeType: "charity_multiplier",
    amount: 2,
    rarity: "epic",
    artPrompt: "A golden x2 multiplier symbol radiating warmth and light, surrounded by holographic hearts and the LCIF logo rendered in soft gold, charitable energy flowing outward in concentric rings, inspirational sci-fi aesthetic, dark background. 256x256.",
  },
  {
    id: "wheel_tokens_100",
    name: "100 Dream Tokens",
    description: "A FORTUNE in Dream Tokens. The Degen's jaw drops. 'I didn't even know I PUT that on the wheel. You're killing me here.' He is visibly proud of you.",
    weight: 0.015,
    prizeType: "tokens",
    amount: 100,
    rarity: "epic",
    artPrompt: "An overflowing treasure chest of glowing cyan dream tokens, golden light erupting upward, holographic '100' blazing above, casino confetti and sparkles, the Degen's silhouette in the background with arms raised, festive sci-fi style. 256x256.",
  },
  {
    id: "wheel_degens_jackpot",
    name: "THE DEGEN'S JACKPOT",
    description: "The legendary jackpot. 500 Dream Tokens, a unique 'High Roller' title, and the Degen personally appears to shake your hand and tell you his real name. Nobody has ever heard the Degen's real name. The Antiquarian inscribes it in the Chronicle with visible surprise.",
    weight: 0.005,
    prizeType: "jackpot",
    amount: 500,
    rarity: "legendary",
    artPrompt: "Explosive golden jackpot scene: cascading dream tokens, holographic fireworks in red and green, a massive glowing 'JACKPOT' sign with casino lights, the Degen's silhouette tipping his hat in the foreground, confetti and snowflakes mixing, legendary golden border, dark background with dramatic backlighting. 512x512.",
  },
];
