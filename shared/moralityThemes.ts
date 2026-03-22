/* ═══════════════════════════════════════════════════════
   MORALITY THEMES — Ship & Character Visual Themes
   Unlocked at morality tier milestones.
   Ship themes change the Ark's visual appearance.
   Character themes add aura effects to the avatar.
   ═══════════════════════════════════════════════════════ */

export type ThemeSide = "machine" | "humanity" | "balanced";

/* ─── SHIP THEMES ─── */
export interface ShipThemeDef {
  id: string;
  name: string;
  description: string;
  side: ThemeSide;
  requiredScore: number; // absolute threshold (negative for machine, positive for humanity)
  /** CSS class to apply to the AppShell */
  cssClass: string;
  /** Background pattern overlay */
  bgPattern: "circuit" | "hex" | "organic" | "crystal" | "void" | "flame" | "frost" | "nature" | "chrome" | "industrial";
  /** Accent glow color */
  glowColor: string;
  /** Sidebar border style */
  borderStyle: "solid" | "dashed" | "double" | "groove" | "ridge";
  /** Particle effect type */
  particleEffect: "sparks" | "leaves" | "data" | "embers" | "snowflakes" | "fireflies" | "static" | "none";
  /** Hull texture description */
  hullTexture: string;
}

export const SHIP_THEMES: ShipThemeDef[] = [
  // ═══ BALANCED ═══
  {
    id: "ship_twilight_equilibrium",
    name: "Twilight Equilibrium",
    description: "The default Ark appearance — void energy pulses through crystalline conduits.",
    side: "balanced",
    requiredScore: 0,
    cssClass: "ship-balanced",
    bgPattern: "void",
    glowColor: "#33E2E6",
    borderStyle: "solid",
    particleEffect: "data",
    hullTexture: "Crystalline void-glass with cyan energy veins",
  },

  // ═══ MACHINE SIDE ═══
  {
    id: "ship_industrial_accent",
    name: "Industrial Accent",
    description: "Riveted steel plating and exposed hydraulics adorn the hull.",
    side: "machine",
    requiredScore: -20,
    cssClass: "ship-machine-1",
    bgPattern: "industrial",
    glowColor: "#a3a3a3",
    borderStyle: "groove",
    particleEffect: "sparks",
    hullTexture: "Brushed steel with rivet lines and hydraulic pistons",
  },
  {
    id: "ship_chrome_sentinel",
    name: "Chrome Sentinel",
    description: "Polished chrome plating reflects the cold logic of the Machine.",
    side: "machine",
    requiredScore: -40,
    cssClass: "ship-machine-2",
    bgPattern: "chrome",
    glowColor: "#C0C0C0",
    borderStyle: "double",
    particleEffect: "static",
    hullTexture: "Mirror-polished chrome with geometric panel lines",
  },
  {
    id: "ship_circuit_nexus",
    name: "Circuit Nexus",
    description: "Glowing circuit traces cover every surface, pulsing with data streams.",
    side: "machine",
    requiredScore: -60,
    cssClass: "ship-machine-3",
    bgPattern: "circuit",
    glowColor: "#FF4444",
    borderStyle: "ridge",
    particleEffect: "data",
    hullTexture: "Black PCB with glowing red circuit traces",
  },
  {
    id: "ship_crimson_forge",
    name: "Crimson Forge",
    description: "Molten metal seams glow between armored plates — the Machine's war form.",
    side: "machine",
    requiredScore: -80,
    cssClass: "ship-machine-4",
    bgPattern: "flame",
    glowColor: "#FF1A1A",
    borderStyle: "double",
    particleEffect: "embers",
    hullTexture: "Volcanic obsidian with molten seams between plates",
  },
  {
    id: "ship_singularity_core",
    name: "Singularity Core",
    description: "The Ark transcends physical form — pure Machine consciousness made manifest.",
    side: "machine",
    requiredScore: -100,
    cssClass: "ship-machine-5",
    bgPattern: "hex",
    glowColor: "#8B0000",
    borderStyle: "ridge",
    particleEffect: "sparks",
    hullTexture: "Fractal geometry of pure computation, endlessly recursive",
  },

  // ═══ HUMANITY SIDE ═══
  {
    id: "ship_verdant_growth",
    name: "Verdant Growth",
    description: "Living vines and bioluminescent moss creep across the hull.",
    side: "humanity",
    requiredScore: 20,
    cssClass: "ship-humanity-1",
    bgPattern: "nature",
    glowColor: "#22c55e",
    borderStyle: "solid",
    particleEffect: "leaves",
    hullTexture: "Living wood with bioluminescent moss patches",
  },
  {
    id: "ship_golden_sanctuary",
    name: "Golden Sanctuary",
    description: "Warm golden light emanates from ornate windows set in carved stone.",
    side: "humanity",
    requiredScore: 40,
    cssClass: "ship-humanity-2",
    bgPattern: "crystal",
    glowColor: "#eab308",
    borderStyle: "double",
    particleEffect: "fireflies",
    hullTexture: "Carved sandstone with golden filigree and stained glass",
  },
  {
    id: "ship_aurora_bloom",
    name: "Aurora Bloom",
    description: "Crystalline petals unfurl from the hull, refracting light into aurora patterns.",
    side: "humanity",
    requiredScore: 60,
    cssClass: "ship-humanity-3",
    bgPattern: "organic",
    glowColor: "#a78bfa",
    borderStyle: "groove",
    particleEffect: "fireflies",
    hullTexture: "Crystalline flower petals with prismatic light refraction",
  },
  {
    id: "ship_celestial_garden",
    name: "Celestial Garden",
    description: "A living ecosystem wraps the Ark — trees, waterfalls, and floating islands.",
    side: "humanity",
    requiredScore: 80,
    cssClass: "ship-humanity-4",
    bgPattern: "nature",
    glowColor: "#34d399",
    borderStyle: "solid",
    particleEffect: "leaves",
    hullTexture: "Ancient forest canopy with waterfalls cascading down the hull",
  },
  {
    id: "ship_ascendant_light",
    name: "Ascendant Light",
    description: "The Ark becomes a beacon of pure humanity — radiant, warm, transcendent.",
    side: "humanity",
    requiredScore: 100,
    cssClass: "ship-humanity-5",
    bgPattern: "crystal",
    glowColor: "#fbbf24",
    borderStyle: "double",
    particleEffect: "fireflies",
    hullTexture: "Pure light crystallized into form, warm and inviting",
  },
];

/* ─── CHARACTER THEMES (AURAS) ─── */
export interface CharacterThemeDef {
  id: string;
  name: string;
  description: string;
  side: ThemeSide;
  requiredScore: number;
  /** CSS class for the avatar container */
  cssClass: string;
  /** Aura color (for glow/shadow) */
  auraColor: string;
  /** Aura type */
  auraType: "glow" | "particles" | "rings" | "flames" | "vines" | "lightning" | "frost" | "shadow" | "radiance" | "none";
  /** Effect on the character portrait */
  portraitEffect: "normal" | "grayscale" | "sepia" | "hue-shift" | "invert" | "saturate" | "contrast";
  /** Overlay pattern */
  overlayPattern: "none" | "circuit-lines" | "leaf-veins" | "energy-grid" | "rune-marks" | "hud-elements" | "nature-frame";
}

export const CHARACTER_THEMES: CharacterThemeDef[] = [
  // ═══ BALANCED ═══
  {
    id: "char_void_walker",
    name: "Void Walker",
    description: "A subtle cyan shimmer — the default state of an awakened operative.",
    side: "balanced",
    requiredScore: 0,
    cssClass: "char-balanced",
    auraColor: "#33E2E6",
    auraType: "glow",
    portraitEffect: "normal",
    overlayPattern: "none",
  },

  // ═══ MACHINE SIDE ═══
  {
    id: "char_logic_overlay",
    name: "Logic Overlay",
    description: "Faint HUD elements and data readouts appear around your avatar.",
    side: "machine",
    requiredScore: -20,
    cssClass: "char-machine-1",
    auraColor: "#a3a3a3",
    auraType: "glow",
    portraitEffect: "contrast",
    overlayPattern: "hud-elements",
  },
  {
    id: "char_chrome_shell",
    name: "Chrome Shell",
    description: "Metallic sheen covers your avatar — cybernetic implants visible.",
    side: "machine",
    requiredScore: -40,
    cssClass: "char-machine-2",
    auraColor: "#C0C0C0",
    auraType: "particles",
    portraitEffect: "grayscale",
    overlayPattern: "circuit-lines",
  },
  {
    id: "char_circuit_veins",
    name: "Circuit Veins",
    description: "Glowing circuit patterns trace across your skin like digital tattoos.",
    side: "machine",
    requiredScore: -60,
    cssClass: "char-machine-3",
    auraColor: "#FF4444",
    auraType: "lightning",
    portraitEffect: "hue-shift",
    overlayPattern: "energy-grid",
  },
  {
    id: "char_machine_avatar",
    name: "Machine Avatar",
    description: "Your form flickers between flesh and code — half-digital, half-real.",
    side: "machine",
    requiredScore: -80,
    cssClass: "char-machine-4",
    auraColor: "#FF1A1A",
    auraType: "flames",
    portraitEffect: "invert",
    overlayPattern: "circuit-lines",
  },
  {
    id: "char_singularity_form",
    name: "Singularity Form",
    description: "You ARE the Machine — pure digital consciousness, no flesh remains.",
    side: "machine",
    requiredScore: -100,
    cssClass: "char-machine-5",
    auraColor: "#8B0000",
    auraType: "shadow",
    portraitEffect: "invert",
    overlayPattern: "energy-grid",
  },

  // ═══ HUMANITY SIDE ═══
  {
    id: "char_nature_touch",
    name: "Nature's Touch",
    description: "Small leaves and flower petals drift around your avatar.",
    side: "humanity",
    requiredScore: 20,
    cssClass: "char-humanity-1",
    auraColor: "#22c55e",
    auraType: "particles",
    portraitEffect: "saturate",
    overlayPattern: "leaf-veins",
  },
  {
    id: "char_golden_warmth",
    name: "Golden Warmth",
    description: "A warm golden aura radiates from your form, inspiring those nearby.",
    side: "humanity",
    requiredScore: 40,
    cssClass: "char-humanity-2",
    auraColor: "#eab308",
    auraType: "radiance",
    portraitEffect: "sepia",
    overlayPattern: "nature-frame",
  },
  {
    id: "char_crystal_bloom",
    name: "Crystal Bloom",
    description: "Crystalline flowers orbit your avatar, each petal a prism of light.",
    side: "humanity",
    requiredScore: 60,
    cssClass: "char-humanity-3",
    auraColor: "#a78bfa",
    auraType: "rings",
    portraitEffect: "saturate",
    overlayPattern: "rune-marks",
  },
  {
    id: "char_spirit_guardian",
    name: "Spirit Guardian",
    description: "Ethereal vines and living energy wrap protectively around your form.",
    side: "humanity",
    requiredScore: 80,
    cssClass: "char-humanity-4",
    auraColor: "#34d399",
    auraType: "vines",
    portraitEffect: "normal",
    overlayPattern: "nature-frame",
  },
  {
    id: "char_ascendant_soul",
    name: "Ascendant Soul",
    description: "You radiate pure humanity — a beacon of warmth, empathy, and light.",
    side: "humanity",
    requiredScore: 100,
    cssClass: "char-humanity-5",
    auraColor: "#fbbf24",
    auraType: "radiance",
    portraitEffect: "normal",
    overlayPattern: "rune-marks",
  },
];

/* ─── MORALITY MILESTONE BONUS ITEMS ─── */
export interface MoralityMilestoneReward {
  scoreThreshold: number;
  side: ThemeSide;
  tierName: string;
  rewards: {
    type: "card" | "item" | "title" | "credits" | "xp" | "dream_tokens";
    id?: string;
    name: string;
    quantity: number;
    description: string;
  }[];
}

export const MORALITY_MILESTONE_REWARDS: MoralityMilestoneReward[] = [
  // ═══ MACHINE MILESTONES ═══
  {
    scoreThreshold: -20,
    side: "machine",
    tierName: "Machine Leaning",
    rewards: [
      { type: "card", id: "card_logic_bomb", name: "Logic Bomb", quantity: 1, description: "A rare action card that disables opponent's highest-cost card for 1 turn" },
      { type: "credits", name: "Machine Credits", quantity: 500, description: "Bonus credits from the Machine's efficiency protocols" },
      { type: "xp", name: "Research XP", quantity: 200, description: "XP boost from machine-optimized learning" },
    ],
  },
  {
    scoreThreshold: -40,
    side: "machine",
    tierName: "Machine Aligned",
    rewards: [
      { type: "card", id: "card_chrome_sentinel", name: "Chrome Sentinel", quantity: 1, description: "An epic character card with +2 power when you control a technology card" },
      { type: "item", id: "item_neural_implant", name: "Neural Implant", quantity: 1, description: "Equipment that grants +3 Intelligence" },
      { type: "dream_tokens", name: "Machine Dream Tokens", quantity: 50, description: "Dream Tokens infused with machine logic" },
    ],
  },
  {
    scoreThreshold: -60,
    side: "machine",
    tierName: "Machine Devoted",
    rewards: [
      { type: "card", id: "card_data_storm", name: "Data Storm", quantity: 1, description: "A legendary event card that draws 3 cards and deals 2 damage to all opponents" },
      { type: "title", id: "title_circuit_master", name: "Circuit Master", quantity: 1, description: "Exclusive title: Circuit Master" },
      { type: "credits", name: "Machine Credits", quantity: 2000, description: "Substantial credit injection from machine networks" },
    ],
  },
  {
    scoreThreshold: -80,
    side: "machine",
    tierName: "Machine Ascendant",
    rewards: [
      { type: "card", id: "card_singularity_engine", name: "Singularity Engine", quantity: 1, description: "A mythic master card that doubles all technology card effects" },
      { type: "item", id: "item_quantum_processor", name: "Quantum Processor", quantity: 1, description: "Equipment that grants +5 Intelligence and +3 Perception" },
      { type: "dream_tokens", name: "Singularity Tokens", quantity: 200, description: "Dream Tokens from the edge of singularity" },
    ],
  },
  {
    scoreThreshold: -100,
    side: "machine",
    tierName: "Machine Transcendent",
    rewards: [
      { type: "card", id: "card_the_machine_god", name: "The Machine God", quantity: 1, description: "A neyon-rarity character card — the ultimate Machine entity" },
      { type: "title", id: "title_machine_transcendent", name: "Machine Transcendent", quantity: 1, description: "The highest Machine title" },
      { type: "credits", name: "Transcendence Credits", quantity: 10000, description: "The Machine's ultimate reward" },
      { type: "xp", name: "Transcendence XP", quantity: 5000, description: "Massive XP from achieving Machine transcendence" },
    ],
  },

  // ═══ HUMANITY MILESTONES ═══
  {
    scoreThreshold: 20,
    side: "humanity",
    tierName: "Humanity Leaning",
    rewards: [
      { type: "card", id: "card_healing_light", name: "Healing Light", quantity: 1, description: "A rare action card that restores 3 health to any character" },
      { type: "credits", name: "Community Credits", quantity: 500, description: "Bonus credits from community support networks" },
      { type: "xp", name: "Empathy XP", quantity: 200, description: "XP boost from human connection" },
    ],
  },
  {
    scoreThreshold: 40,
    side: "humanity",
    tierName: "Humanity Aligned",
    rewards: [
      { type: "card", id: "card_spirit_guardian", name: "Spirit Guardian", quantity: 1, description: "An epic character card with +2 health when you control a nature card" },
      { type: "item", id: "item_empathy_crystal", name: "Empathy Crystal", quantity: 1, description: "Equipment that grants +3 Charisma" },
      { type: "dream_tokens", name: "Humanity Dream Tokens", quantity: 50, description: "Dream Tokens infused with human warmth" },
    ],
  },
  {
    scoreThreshold: 60,
    side: "humanity",
    tierName: "Humanity Devoted",
    rewards: [
      { type: "card", id: "card_natures_wrath", name: "Nature's Wrath", quantity: 1, description: "A legendary event card that heals all allies for 3 and buffs their power by 1" },
      { type: "title", id: "title_soul_keeper", name: "Soul Keeper", quantity: 1, description: "Exclusive title: Soul Keeper" },
      { type: "credits", name: "Community Credits", quantity: 2000, description: "Substantial credit injection from human networks" },
    ],
  },
  {
    scoreThreshold: 80,
    side: "humanity",
    tierName: "Humanity Ascendant",
    rewards: [
      { type: "card", id: "card_world_tree", name: "World Tree", quantity: 1, description: "A mythic master card that doubles all nature card effects" },
      { type: "item", id: "item_heart_of_gaia", name: "Heart of Gaia", quantity: 1, description: "Equipment that grants +5 Charisma and +3 Willpower" },
      { type: "dream_tokens", name: "Ascendant Tokens", quantity: 200, description: "Dream Tokens from the peak of humanity" },
    ],
  },
  {
    scoreThreshold: 100,
    side: "humanity",
    tierName: "Humanity Transcendent",
    rewards: [
      { type: "card", id: "card_the_human_spirit", name: "The Human Spirit", quantity: 1, description: "A neyon-rarity character card — the ultimate Humanity entity" },
      { type: "title", id: "title_humanity_transcendent", name: "Humanity Transcendent", quantity: 1, description: "The highest Humanity title" },
      { type: "credits", name: "Transcendence Credits", quantity: 10000, description: "Humanity's ultimate reward" },
      { type: "xp", name: "Transcendence XP", quantity: 5000, description: "Massive XP from achieving Humanity transcendence" },
    ],
  },
];

/* ─── HELPER FUNCTIONS ─── */

/** Get available ship themes for a given morality score */
export function getAvailableShipThemes(score: number): ShipThemeDef[] {
  return SHIP_THEMES.filter(t => {
    if (t.side === "balanced") return true;
    if (t.side === "machine") return score <= t.requiredScore;
    if (t.side === "humanity") return score >= t.requiredScore;
    return false;
  });
}

/** Get available character themes for a given morality score */
export function getAvailableCharacterThemes(score: number): CharacterThemeDef[] {
  return CHARACTER_THEMES.filter(t => {
    if (t.side === "balanced") return true;
    if (t.side === "machine") return score <= t.requiredScore;
    if (t.side === "humanity") return score >= t.requiredScore;
    return false;
  });
}

/** Get unclaimed milestone rewards for a given score */
export function getUnclaimedMilestones(score: number, claimedIds: string[]): MoralityMilestoneReward[] {
  return MORALITY_MILESTONE_REWARDS.filter(m => {
    const key = `${m.side}_${Math.abs(m.scoreThreshold)}`;
    if (claimedIds.includes(key)) return false;
    if (m.side === "machine") return score <= m.scoreThreshold;
    if (m.side === "humanity") return score >= m.scoreThreshold;
    return false;
  });
}

/** Get a specific ship theme by ID */
export function getShipTheme(id: string): ShipThemeDef | undefined {
  return SHIP_THEMES.find(t => t.id === id);
}

/** Get a specific character theme by ID */
export function getCharacterTheme(id: string): CharacterThemeDef | undefined {
  return CHARACTER_THEMES.find(t => t.id === id);
}
