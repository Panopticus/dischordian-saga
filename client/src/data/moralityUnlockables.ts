/* ═══════════════════════════════════════════════════════
   MORALITY UNLOCKABLES — Zero-sum tier-gated rewards
   Machine (-100) ←→ Humanity (+100)
   Each tier unlocks exclusive items; gaining one side
   means losing access to the other side's rewards.
   ═══════════════════════════════════════════════════════ */

export type UnlockableCategory = "ship_theme" | "character_aura" | "card_effect" | "title" | "item" | "ability_mod";

export interface MoralityUnlockable {
  id: string;
  name: string;
  description: string;
  category: UnlockableCategory;
  /** Which side: machine (negative score) or humanity (positive score) */
  side: "machine" | "humanity" | "balanced";
  /** Minimum morality tier level required (1-5) */
  requiredLevel: number;
  /** The exact score threshold: negative for machine, positive for humanity */
  scoreThreshold: number;
  /** Visual color for the unlock */
  color: string;
  /** Gameplay effect description */
  effect: string;
  /** Icon key for rendering */
  icon: "cpu" | "heart" | "shield" | "sparkles" | "bot" | "zap" | "flame" | "eye" | "crown" | "skull" | "star" | "gem";
}

export const MORALITY_UNLOCKABLES: MoralityUnlockable[] = [
  // ═══════════════════════════════════════
  // BALANCED (Level 1: -19 to +19)
  // ═══════════════════════════════════════
  {
    id: "bal_twilight_equilibrium",
    name: "Twilight Equilibrium",
    description: "A ship theme that shifts between warm and cold hues, reflecting your balanced nature.",
    category: "ship_theme",
    side: "balanced",
    requiredLevel: 1,
    scoreThreshold: 0,
    color: "#a855f7",
    effect: "+5% to all stats",
    icon: "shield",
  },
  {
    id: "bal_grey_walker_title",
    name: "Grey Walker",
    description: "A title earned by those who refuse to choose a side in the eternal conflict.",
    category: "title",
    side: "balanced",
    requiredLevel: 1,
    scoreThreshold: 0,
    color: "#a855f7",
    effect: "Unique title displayed on profile",
    icon: "shield",
  },

  // ═══════════════════════════════════════
  // MACHINE SIDE (Negative scores)
  // ═══════════════════════════════════════

  // Level 2: Machine Leaning (-20 to -39)
  {
    id: "mch_industrial_accent",
    name: "Industrial Ship Accent",
    description: "Riveted steel plating and exposed hydraulics adorn your Ark's hull.",
    category: "ship_theme",
    side: "machine",
    requiredLevel: 2,
    scoreThreshold: -20,
    color: "#a3a3a3",
    effect: "+10% XP from research activities",
    icon: "bot",
  },
  {
    id: "mch_logic_gate_title",
    name: "Logic Gate",
    description: "A title marking your growing affinity for the Machine's rational order.",
    category: "title",
    side: "machine",
    requiredLevel: 2,
    scoreThreshold: -20,
    color: "#a3a3a3",
    effect: "Unique title displayed on profile",
    icon: "bot",
  },

  // Level 3: Machine Aligned (-40 to -59)
  {
    id: "mch_steel_forge_theme",
    name: "Steel Forge Ship Theme",
    description: "Your Ark transforms into a gleaming forge of dark metal and pulsing amber conduits.",
    category: "ship_theme",
    side: "machine",
    requiredLevel: 3,
    scoreThreshold: -40,
    color: "#eab308",
    effect: "+15% Dream Token earnings",
    icon: "cpu",
  },
  {
    id: "mch_chrome_veins_aura",
    name: "Chrome Veins",
    description: "Metallic tendrils pulse beneath your character's skin, visible in combat and exploration.",
    category: "character_aura",
    side: "machine",
    requiredLevel: 3,
    scoreThreshold: -40,
    color: "#eab308",
    effect: "Visual character effect in all game modes",
    icon: "zap",
  },
  {
    id: "mch_overclock_mod",
    name: "Overclock Protocol",
    description: "Machine-enhanced reflexes grant faster card draw in combat encounters.",
    category: "ability_mod",
    side: "machine",
    requiredLevel: 3,
    scoreThreshold: -40,
    color: "#eab308",
    effect: "+1 card draw per turn in fights",
    icon: "zap",
  },

  // Level 4: Machine Devoted (-60 to -79)
  {
    id: "mch_neural_network_theme",
    name: "Neural Network Ship Theme",
    description: "Synaptic pathways of light course through your Ark, a living circuit board in the void.",
    category: "ship_theme",
    side: "machine",
    requiredLevel: 4,
    scoreThreshold: -60,
    color: "#f97316",
    effect: "+20% fight damage vs Humanity-aligned opponents",
    icon: "cpu",
  },
  {
    id: "mch_amber_circuitry_aura",
    name: "Amber Circuitry Aura",
    description: "Glowing circuit patterns trace across your character, marking you as Machine Devoted.",
    category: "character_aura",
    side: "machine",
    requiredLevel: 4,
    scoreThreshold: -60,
    color: "#f97316",
    effect: "Intimidation bonus in faction encounters",
    icon: "flame",
  },
  {
    id: "mch_data_prophet_title",
    name: "Data Prophet",
    description: "The Machine whispers its secrets to you. Others see only noise — you see patterns.",
    category: "title",
    side: "machine",
    requiredLevel: 4,
    scoreThreshold: -60,
    color: "#f97316",
    effect: "Unique title + bonus lore reveals",
    icon: "eye",
  },

  // Level 5: Machine Ascendant (-80 to -100)
  {
    id: "mch_overlord_theme",
    name: "Machine Overlord Ship Theme",
    description: "Your Ark becomes a dreadnought of pure Machine will — crimson energy and obsidian plating.",
    category: "ship_theme",
    side: "machine",
    requiredLevel: 5,
    scoreThreshold: -80,
    color: "#ef4444",
    effect: "+25% card draw efficiency",
    icon: "skull",
  },
  {
    id: "mch_crimson_circuit_aura",
    name: "Crimson Circuit Aura",
    description: "Blood-red circuitry blazes across your form. You are the Machine's avatar.",
    category: "character_aura",
    side: "machine",
    requiredLevel: 5,
    scoreThreshold: -80,
    color: "#ef4444",
    effect: "Max intimidation + visual dominance",
    icon: "skull",
  },
  {
    id: "mch_terminus_protocol",
    name: "Terminus Protocol Access",
    description: "The Machine's ultimate contingency. Grants access to Terminus Protocol items and storylines.",
    category: "item",
    side: "machine",
    requiredLevel: 5,
    scoreThreshold: -80,
    color: "#ef4444",
    effect: "Unlock exclusive Machine endgame content",
    icon: "crown",
  },
  {
    id: "mch_singularity_card",
    name: "Singularity Convergence",
    description: "A mythic card effect that converts all damage to Machine-type for one turn.",
    category: "card_effect",
    side: "machine",
    requiredLevel: 5,
    scoreThreshold: -80,
    color: "#ef4444",
    effect: "Mythic card ability unlock",
    icon: "gem",
  },

  // ═══════════════════════════════════════
  // HUMANITY SIDE (Positive scores)
  // ═══════════════════════════════════════

  // Level 2: Humanity Leaning (+20 to +39)
  {
    id: "hum_verdant_accent",
    name: "Verdant Ship Accent",
    description: "Living vines and bioluminescent moss creep across your Ark's surfaces.",
    category: "ship_theme",
    side: "humanity",
    requiredLevel: 2,
    scoreThreshold: 20,
    color: "#a3a3a3",
    effect: "+10% XP from exploration activities",
    icon: "heart",
  },
  {
    id: "hum_ember_keeper_title",
    name: "Ember Keeper",
    description: "A title for those who tend the fragile flame of organic life.",
    category: "title",
    side: "humanity",
    requiredLevel: 2,
    scoreThreshold: 20,
    color: "#a3a3a3",
    effect: "Unique title displayed on profile",
    icon: "heart",
  },

  // Level 3: Humanity Aligned (+40 to +59)
  {
    id: "hum_living_garden_theme",
    name: "Living Garden Ship Theme",
    description: "Your Ark blooms with impossible gardens — flowers of light and crystalline trees.",
    category: "ship_theme",
    side: "humanity",
    requiredLevel: 3,
    scoreThreshold: 40,
    color: "#22c55e",
    effect: "+15% Dream Token earnings",
    icon: "sparkles",
  },
  {
    id: "hum_emerald_pulse_aura",
    name: "Emerald Pulse",
    description: "A warm green glow radiates from your character, pulsing with organic vitality.",
    category: "character_aura",
    side: "humanity",
    requiredLevel: 3,
    scoreThreshold: 40,
    color: "#22c55e",
    effect: "Visual character effect in all game modes",
    icon: "sparkles",
  },
  {
    id: "hum_empathy_mod",
    name: "Empathic Resonance",
    description: "Your connection to organic life grants healing abilities in combat.",
    category: "ability_mod",
    side: "humanity",
    requiredLevel: 3,
    scoreThreshold: 40,
    color: "#22c55e",
    effect: "+1 HP regeneration per turn in fights",
    icon: "heart",
  },

  // Level 4: Humanity Devoted (+60 to +79)
  {
    id: "hum_celestial_dawn_theme",
    name: "Celestial Dawn Ship Theme",
    description: "Your Ark glows with the light of a thousand dawns — azure and gold intertwined.",
    category: "ship_theme",
    side: "humanity",
    requiredLevel: 4,
    scoreThreshold: 60,
    color: "#3b82f6",
    effect: "+20% fight damage vs Machine-aligned opponents",
    icon: "sparkles",
  },
  {
    id: "hum_azure_radiance_aura",
    name: "Azure Radiance Aura",
    description: "Brilliant blue light emanates from your form, a beacon of Humanity's devotion.",
    category: "character_aura",
    side: "humanity",
    requiredLevel: 4,
    scoreThreshold: 60,
    color: "#3b82f6",
    effect: "Inspiration bonus in faction encounters",
    icon: "star",
  },
  {
    id: "hum_soul_shepherd_title",
    name: "Soul Shepherd",
    description: "You guide the lost and protect the vulnerable. The organic world trusts you implicitly.",
    category: "title",
    side: "humanity",
    requiredLevel: 4,
    scoreThreshold: 60,
    color: "#3b82f6",
    effect: "Unique title + bonus lore reveals",
    icon: "eye",
  },

  // Level 5: Humanity Ascendant (+80 to +100)
  {
    id: "hum_beacon_theme",
    name: "Humanity's Beacon Ship Theme",
    description: "Your Ark radiates hope itself — a vessel of pure light cutting through the void.",
    category: "ship_theme",
    side: "humanity",
    requiredLevel: 5,
    scoreThreshold: 80,
    color: "#06b6d4",
    effect: "+25% card draw efficiency",
    icon: "crown",
  },
  {
    id: "hum_starlight_halo_aura",
    name: "Starlight Halo",
    description: "A crown of living starlight orbits your character. You are Humanity's champion.",
    category: "character_aura",
    side: "humanity",
    requiredLevel: 5,
    scoreThreshold: 80,
    color: "#06b6d4",
    effect: "Max inspiration + visual radiance",
    icon: "crown",
  },
  {
    id: "hum_genesis_protocol",
    name: "Genesis Protocol Access",
    description: "Humanity's ultimate hope. Grants access to Genesis Protocol items and storylines.",
    category: "item",
    side: "humanity",
    requiredLevel: 5,
    scoreThreshold: 80,
    color: "#06b6d4",
    effect: "Unlock exclusive Humanity endgame content",
    icon: "crown",
  },
  {
    id: "hum_lifebloom_card",
    name: "Lifebloom Cascade",
    description: "A mythic card effect that heals all allies and converts damage to Humanity-type for one turn.",
    category: "card_effect",
    side: "humanity",
    requiredLevel: 5,
    scoreThreshold: 80,
    color: "#06b6d4",
    effect: "Mythic card ability unlock",
    icon: "gem",
  },
];

/** Get unlockables available at a given morality score */
export function getUnlockedItems(score: number): MoralityUnlockable[] {
  return MORALITY_UNLOCKABLES.filter(u => {
    if (u.side === "balanced") return true; // Always available
    if (u.side === "machine") return score <= u.scoreThreshold;
    if (u.side === "humanity") return score >= u.scoreThreshold;
    return false;
  });
}

/** Get all unlockables for a given side, sorted by level */
export function getUnlockablesBySide(side: "machine" | "humanity" | "balanced"): MoralityUnlockable[] {
  return MORALITY_UNLOCKABLES
    .filter(u => u.side === side)
    .sort((a, b) => a.requiredLevel - b.requiredLevel);
}

/** Check if a specific unlockable is available at the given score */
export function isUnlocked(id: string, score: number): boolean {
  const item = MORALITY_UNLOCKABLES.find(u => u.id === id);
  if (!item) return false;
  if (item.side === "balanced") return true;
  if (item.side === "machine") return score <= item.scoreThreshold;
  if (item.side === "humanity") return score >= item.scoreThreshold;
  return false;
}

/** Get the next unlockable the player is closest to earning */
export function getNextUnlockable(score: number): MoralityUnlockable | null {
  const locked = MORALITY_UNLOCKABLES.filter(u => !isUnlocked(u.id, score));
  if (locked.length === 0) return null;

  // Find the closest locked item based on current trajectory
  const side = score <= 0 ? "machine" : "humanity";
  const sameSide = locked.filter(u => u.side === side);
  if (sameSide.length === 0) return locked[0];

  return sameSide.sort((a, b) => {
    const distA = Math.abs(score - a.scoreThreshold);
    const distB = Math.abs(score - b.scoreThreshold);
    return distA - distB;
  })[0];
}

export const CATEGORY_LABELS: Record<UnlockableCategory, string> = {
  ship_theme: "Ship Theme",
  character_aura: "Character Aura",
  card_effect: "Card Effect",
  title: "Title",
  item: "Item",
  ability_mod: "Ability Mod",
};
