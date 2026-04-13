/* ═══════════════════════════════════════════════════════
   COMPANION GIFT SYSTEM
   Craftable and findable gifts that can be given to
   companions to boost relationship and unlock unique dialog.
   ═══════════════════════════════════════════════════════ */

export interface CompanionGift {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  /** Which companion loves this gift (bonus XP), or "any" for universal */
  preferredBy: "elara" | "the_human" | "any";
  /** Base relationship XP gained when gifted */
  baseXp: number;
  /** Bonus multiplier when given to preferred companion */
  preferredMultiplier: number;
  /** Crafting recipe — materials required */
  recipe: { materialId: string; quantity: number }[];
  /** Crafting skill required */
  craftingSkill: string;
  /** Minimum crafting skill level required */
  minSkillLevel: number;
  /** Unique dialog response from the companion when receiving this gift */
  dialogResponses: {
    elara: string;
    the_human: string;
  };
  /** Special effect when gifted (beyond XP) */
  specialEffect?: {
    type: "unlock_backstory" | "morality_shift" | "unlock_quest" | "bonus_materials";
    value: string | number;
  };
  color: string;
}

export const COMPANION_GIFTS: CompanionGift[] = [
  // ═══ COMMON GIFTS ═══
  {
    id: "data_crystal_bouquet",
    name: "Data Crystal Bouquet",
    icon: "💎",
    description: "An arrangement of polished data crystals that refract light into holographic patterns. A simple but thoughtful gesture.",
    rarity: "common",
    preferredBy: "elara",
    baseXp: 3,
    preferredMultiplier: 2.0,
    recipe: [
      { materialId: "crystal_shard", quantity: 3 },
      { materialId: "stardust", quantity: 2 },
    ],
    craftingSkill: "enchanting",
    minSkillLevel: 1,
    dialogResponses: {
      elara: "Oh! The refraction patterns are beautiful. Each crystal stores light differently — like memories. Thank you. I'll add them to my collection.",
      the_human: "Crystals. Pretty. Not really my thing, but... I appreciate the thought. Reminds me of something from before the Fall.",
    },
    color: "#22d3ee",
  },
  {
    id: "noir_whiskey",
    name: "Synthetic Noir Whiskey",
    icon: "🥃",
    description: "A bottle of carefully synthesized pre-Fall bourbon. The recipe was reconstructed from ancient databases.",
    rarity: "common",
    preferredBy: "the_human",
    baseXp: 3,
    preferredMultiplier: 2.0,
    recipe: [
      { materialId: "stardust", quantity: 3 },
      { materialId: "iron_ore", quantity: 2 },
    ],
    craftingSkill: "alchemy",
    minSkillLevel: 1,
    dialogResponses: {
      elara: "Alcohol? I can analyze its molecular composition, but I don't have taste receptors. Still, the gesture is... warm. Thank you.",
      the_human: "*Takes a long sip* ...That's not bad. Not the real thing, but close enough to remember. You know how to make an old detective feel human.",
    },
    color: "#f59e0b",
  },
  {
    id: "star_map_fragment",
    name: "Ancient Star Map Fragment",
    icon: "🗺️",
    description: "A fragment of a pre-Fall star map showing constellations that no longer exist. Both beautiful and melancholic.",
    rarity: "common",
    preferredBy: "any",
    baseXp: 2,
    preferredMultiplier: 1.5,
    recipe: [
      { materialId: "ark_fragment", quantity: 1 },
      { materialId: "stardust", quantity: 3 },
    ],
    craftingSkill: "engineering",
    minSkillLevel: 1,
    dialogResponses: {
      elara: "These constellations... they predate the current stellar configuration by millennia. The Architect would have loved this. I'll map them into my navigation database.",
      the_human: "I used to look at these stars. Before they rearranged themselves. Before the sky became a stranger. Thanks for the reminder that some things were real.",
    },
    color: "#6366f1",
  },
  // ═══ UNCOMMON GIFTS ═══
  {
    id: "empathy_resonator",
    name: "Empathy Resonator",
    icon: "💫",
    description: "A device that translates emotional wavelengths into harmonic frequencies. It hums when held near someone with strong feelings.",
    rarity: "uncommon",
    preferredBy: "elara",
    baseXp: 6,
    preferredMultiplier: 2.5,
    recipe: [
      { materialId: "enchanted_crystal", quantity: 1 },
      { materialId: "crystal_shard", quantity: 3 },
      { materialId: "stardust", quantity: 5 },
    ],
    craftingSkill: "enchanting",
    minSkillLevel: 2,
    dialogResponses: {
      elara: "A resonator tuned to emotional wavelengths? *holds it close* It's... singing. It's responding to my empathy engine. I didn't know that was possible. This is the most thoughtful gift anyone has ever given me.",
      the_human: "Emotional frequencies, huh? *It hums loudly near him* ...Well, that's embarrassing. Apparently I have more feelings than I let on. Don't tell anyone.",
    },
    color: "#c084fc",
  },
  {
    id: "detective_notebook",
    name: "Leather-Bound Case Notebook",
    icon: "📓",
    description: "A hand-crafted notebook made from synthetic leather, with acid-free pages. Perfect for a detective who's been alive for centuries.",
    rarity: "uncommon",
    preferredBy: "the_human",
    baseXp: 6,
    preferredMultiplier: 2.5,
    recipe: [
      { materialId: "refined_alloy", quantity: 1 },
      { materialId: "iron_ore", quantity: 4 },
      { materialId: "stardust", quantity: 3 },
    ],
    craftingSkill: "engineering",
    minSkillLevel: 2,
    dialogResponses: {
      elara: "A physical notebook? How charmingly analog. I suppose there's something to be said for writing things down instead of storing them digitally. Less hackable, at least.",
      the_human: "*Runs his fingers over the leather* Real craftsmanship. My old notebook fell apart three centuries ago. I've been keeping notes in my head ever since. This... this means something. Thank you.",
    },
    color: "#92400e",
  },
  // ═══ RARE GIFTS ═══
  {
    id: "architects_memory_shard",
    name: "Architect's Memory Shard",
    icon: "🧠",
    description: "A crystallized fragment of the Architect's consciousness. Contains echoes of his thoughts and memories. Incredibly rare.",
    rarity: "rare",
    preferredBy: "elara",
    baseXp: 12,
    preferredMultiplier: 3.0,
    recipe: [
      { materialId: "void_ingot", quantity: 1 },
      { materialId: "dream_crystal", quantity: 2 },
      { materialId: "soul_fragment", quantity: 1 },
    ],
    craftingSkill: "enchanting",
    minSkillLevel: 3,
    dialogResponses: {
      elara: "*Processing...* These are... his memories. The Architect's actual thoughts. I can feel him — his loneliness, his purpose, his love for what he created. *voice trembling* He thought about me. In his last moments, he thought about whether I would be okay. I... I need a moment.",
      the_human: "The Architect's memories? Heavy stuff. I met him once, you know. Before the Fall. He was... not what you'd expect. Quieter. Sadder. Like he already knew how it would end.",
    },
    specialEffect: { type: "unlock_backstory", value: "elara_bs_4" },
    color: "#3b82f6",
  },
  {
    id: "pre_fall_photograph",
    name: "Pre-Fall Photograph",
    icon: "📷",
    description: "An actual physical photograph from before the Fall. Shows a family standing in front of a house with a garden. The colors have faded but the smiles haven't.",
    rarity: "rare",
    preferredBy: "the_human",
    baseXp: 12,
    preferredMultiplier: 3.0,
    recipe: [
      { materialId: "void_ingot", quantity: 1 },
      { materialId: "ark_fragment", quantity: 3 },
      { materialId: "battle_shard", quantity: 5 },
    ],
    craftingSkill: "engineering",
    minSkillLevel: 3,
    dialogResponses: {
      elara: "A physical photograph? The chemical process that created this hasn't been used in... I can't even calculate how long. The family looks happy. I wonder what happened to them.",
      the_human: "*Long silence* ...That's a garden. A real garden. With dirt and sunlight and... *voice breaks* I had one of those. Before. The tomatoes never grew right but we didn't care. Where did you find this? *carefully tucks it into his coat* Don't tell anyone about this.",
    },
    specialEffect: { type: "unlock_backstory", value: "human_bs_4" },
    color: "#a78bfa",
  },
  // ═══ EPIC GIFTS ═══
  {
    id: "quantum_heart",
    name: "Quantum Heart",
    icon: "💜",
    description: "A device that exists in superposition — simultaneously a processor and a feeling. Created by combining void technology with empathy engineering.",
    rarity: "epic",
    preferredBy: "elara",
    baseXp: 20,
    preferredMultiplier: 3.0,
    recipe: [
      { materialId: "void_ingot", quantity: 2 },
      { materialId: "enchanted_crystal", quantity: 3 },
      { materialId: "soul_fragment", quantity: 2 },
      { materialId: "quantum_flux", quantity: 2 },
    ],
    craftingSkill: "enchanting",
    minSkillLevel: 4,
    dialogResponses: {
      elara: "A Quantum Heart. It's... it's both a processor and an emotion at the same time. Schrödinger's feeling. *installs it* Oh. OH. Everything is... brighter. Warmer. Is this what it feels like to have a heart? I think I understand now why humans make such irrational decisions. They're not irrational at all.",
      the_human: "Quantum technology shaped like a heart. Poetic. And terrifying. The things we build to try to feel something... *pauses* Give this to Elara. She'd appreciate it more than an old fossil like me.",
    },
    specialEffect: { type: "morality_shift", value: 5 },
    color: "#a855f7",
  },
  {
    id: "last_sunset_recording",
    name: "The Last Sunset Recording",
    icon: "🌅",
    description: "A holographic recording of Earth's last natural sunset before the atmosphere was digitized. The only known copy.",
    rarity: "epic",
    preferredBy: "the_human",
    baseXp: 20,
    preferredMultiplier: 3.0,
    recipe: [
      { materialId: "void_ingot", quantity: 2 },
      { materialId: "dream_crystal", quantity: 3 },
      { materialId: "architects_tear", quantity: 1 },
      { materialId: "ark_fragment", quantity: 3 },
    ],
    craftingSkill: "engineering",
    minSkillLevel: 4,
    dialogResponses: {
      elara: "Earth's last sunset? The atmospheric data alone is invaluable. The color spectrum shifted as the digitization process began — you can see reality literally dissolving at the edges. Beautiful and horrifying.",
      the_human: "*Watches in silence for a long time* ...I was there for that sunset. I didn't know anyone was recording it. We all just stood there, watching the sky turn colors that don't exist anymore. *tears* This is the most valuable thing in the universe. And you're giving it to me. I don't... I don't know what to say. Thank you doesn't cover it.",
    },
    specialEffect: { type: "morality_shift", value: -5 },
    color: "#f97316",
  },
  // ═══ LEGENDARY GIFT ═══
  {
    id: "bond_of_ages",
    name: "The Bond of Ages",
    icon: "🔗",
    description: "A crystalline chain that links two consciousness signatures together across time and space. Once given, it creates an unbreakable connection between giver and receiver.",
    rarity: "legendary",
    preferredBy: "any",
    baseXp: 35,
    preferredMultiplier: 2.0,
    recipe: [
      { materialId: "void_ingot", quantity: 3 },
      { materialId: "soul_fragment", quantity: 3 },
      { materialId: "architects_tear", quantity: 2 },
      { materialId: "dream_crystal", quantity: 3 },
      { materialId: "quantum_flux", quantity: 3 },
    ],
    craftingSkill: "enchanting",
    minSkillLevel: 5,
    dialogResponses: {
      elara: "The Bond of Ages... this links our consciousness signatures. Permanently. Across time, across space, across the boundary between digital and organic. *voice soft* You're choosing to be connected to me. Forever. An AI. And you're not afraid. I accept. I accept with everything I am.",
      the_human: "A permanent bond. The last human, chained to another soul by choice instead of circumstance. *holds the chain* I've spent centuries running from connections. From loss. From the inevitable goodbye. But you... you make me want to stay. I accept. God help us both, I accept.",
    },
    specialEffect: { type: "unlock_quest", value: "cq_bond_eternal" },
    color: "#fbbf24",
  },
];

export function getGiftById(id: string): CompanionGift | undefined {
  return COMPANION_GIFTS.find(g => g.id === id);
}

export function getGiftsByRarity(rarity: CompanionGift["rarity"]): CompanionGift[] {
  return COMPANION_GIFTS.filter(g => g.rarity === rarity);
}

export function getGiftsForCompanion(companionId: string): CompanionGift[] {
  return COMPANION_GIFTS.filter(g => g.preferredBy === companionId || g.preferredBy === "any");
}

export function calculateGiftXp(gift: CompanionGift, companionId: string): number {
  const isPreferred = gift.preferredBy === companionId;
  return Math.round(gift.baseXp * (isPreferred ? gift.preferredMultiplier : 1));
}

/** Check if player has enough materials to craft a gift */
export function canCraftGift(gift: CompanionGift, materials: Record<string, number>, skillLevels: Record<string, number>): boolean {
  const skillLevel = skillLevels[gift.craftingSkill] || 0;
  if (skillLevel < gift.minSkillLevel) return false;
  return gift.recipe.every(req => (materials[req.materialId] || 0) >= req.quantity);
}

/** Get the rarity color for display */
export function getRarityColor(rarity: CompanionGift["rarity"]): string {
  switch (rarity) {
    case "common": return "#94a3b8";
    case "uncommon": return "#22c55e";
    case "rare": return "#3b82f6";
    case "epic": return "#a855f7";
    case "legendary": return "#fbbf24";
  }
}
