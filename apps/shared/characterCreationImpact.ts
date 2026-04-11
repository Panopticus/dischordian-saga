/* ═══════════════════════════════════════════════════════
   CHARACTER CREATION IMPACT

   Every choice made during Awakening permanently alters:
     • How NPCs speak to you
     • Which quests appear / branch
     • Which rooms you can enter (locked by species/element)
     • Combat resistances & ability modifiers
     • Dialog options exclusive to your alignment
     • Endgame epilogues

   Species (demagi / quarchon / neyon)  = WHO you are
   Element (earth/fire/water/air | space/time/probability/reality)  = HOW you act on the world
   Alignment (order / chaos)            = WHY you act
   Class (soldier / scholar / rogue / envoy)  = WHAT you can do

   These four axes combine into 3×4×2×4 = 96 distinct
   creation signatures, each producing its own narrative thread.
   ═══════════════════════════════════════════════════════ */

export type Species = "demagi" | "quarchon" | "neyon";
export type Element =
  | "earth" | "fire" | "water" | "air"
  | "space" | "time" | "probability" | "reality";
export type Alignment = "order" | "chaos";
export type CharClass = "soldier" | "scholar" | "rogue" | "envoy";

/* ─── PERSISTENT GAMEPLAY MODIFIERS ─── */

export interface CreationSignature {
  species: Species;
  element: Element;
  alignment: Alignment;
  characterClass: CharClass;
}

/** Permanent gameplay multipliers stamped at creation. */
export interface CreationModifiers {
  /** +% damage with matching element */
  elementDamageBonus: number;
  /** +% resistance to opposing element */
  elementResistance: number;
  /** Opposing element deals extra damage TO you */
  elementVulnerability: number;
  /** +% NPC trust gain with aligned factions */
  trustMultiplierAligned: number;
  /** -% NPC trust gain with opposed factions */
  trustMultiplierOpposed: number;
  /** Bonus to primary attribute */
  primaryAttributeBonus: number;
  /** Species-gated rooms unlocked */
  speciesRoomKeys: string[];
  /** Dialog gates unlocked */
  dialogTags: string[];
}

/* ─── ELEMENT OPPOSITION MATRIX ─── */
/* Each element has an opposing element. Opposing elements = creative tension.
   DeMagi elements form a classical wheel. Quarchon elements bend causality. */

export const ELEMENT_OPPOSITIONS: Record<Element, Element> = {
  earth: "air",
  air: "earth",
  fire: "water",
  water: "fire",
  space: "time",
  time: "space",
  probability: "reality",
  reality: "probability",
};

/* ─── ELEMENT × NPC RECEPTIVITY ─── */
/* Which NPCs lean toward or resist specific elements. */

export const NPC_ELEMENT_AFFINITY: Record<string, { loves: Element[]; dislikes: Element[] }> = {
  elara:            { loves: ["water", "reality"],      dislikes: ["fire", "probability"] },
  the_human:        { loves: ["earth", "time"],         dislikes: ["air", "space"] },
  the_antiquarian:  { loves: ["time", "probability"],   dislikes: ["reality"] },
  the_source:       { loves: ["fire", "probability"],   dislikes: ["water", "reality"] },
  agent_zero:       { loves: ["air", "space"],          dislikes: ["earth"] },
  adjudicator_locke:{ loves: ["earth", "reality"],      dislikes: ["air", "probability"] },
  shadow_tongue:    { loves: ["probability"],           dislikes: ["earth", "reality"] },
};

/* ─── SPECIES ROOM & REGION GATES ─── */
/* Certain areas only reveal themselves to specific species. */

export const SPECIES_GATED_CONTENT: Record<Species, {
  exclusiveRooms: { id: string; name: string; description: string }[];
  exclusiveQuests: { id: string; name: string; hook: string }[];
  exclusiveNPCLines: Record<string, string>;
}> = {
  demagi: {
    exclusiveRooms: [
      { id: "the_elemental_forge", name: "The Elemental Forge",
        description: "A DeMagi-only crafting chamber. Only arcane-modified blood can ignite the forge." },
      { id: "blood_archive", name: "Blood Archive",
        description: "Genetic records of every DeMagi lineage. Reveals YOUR ancestry tree." },
    ],
    exclusiveQuests: [
      { id: "find_the_modifier", name: "Find the Modifier",
        hook: "Someone modified your ancestors centuries ago. They left a signature. Find them." },
    ],
    exclusiveNPCLines: {
      the_source: "Your blood sings, DeMagi. It remembers the old modifications. The ones before the virus.",
      elara: "I can read your genetic patterns like music. Your line is ancient. Beautiful. Sad.",
    },
  },
  quarchon: {
    exclusiveRooms: [
      { id: "probability_chamber", name: "Probability Chamber",
        description: "A Quarchon-only room where timelines converge. You can glimpse alternate selves." },
      { id: "dimensional_observatory", name: "Dimensional Observatory",
        description: "Only those who perceive reality-adjacent frequencies can stabilize this room." },
    ],
    exclusiveQuests: [
      { id: "close_the_fork", name: "Close the Fork",
        hook: "A timeline split 12 years ago. Your other self is still alive. One of you shouldn't exist." },
    ],
    exclusiveNPCLines: {
      the_antiquarian: "Ah. You see what I see. Which timeline did you arrive from, I wonder?",
      agent_zero: "Quarchon perception = we can use you for recon across probability fields. Welcome in.",
    },
  },
  neyon: {
    exclusiveRooms: [
      { id: "hybrid_sanctum", name: "Hybrid Sanctum",
        description: "A room that exists in both DeMagi and Quarchon resonance bands. Only Ne-Yon hold the key." },
      { id: "the_between", name: "The Between",
        description: "A Ne-Yon-only liminal space. Neither here nor there. A Potentials nexus." },
    ],
    exclusiveQuests: [
      { id: "which_half_are_you", name: "Which Half Are You?",
        hook: "You are two species. Two peoples claim you. Choose which inheritance to honor — or forge a third path." },
    ],
    exclusiveNPCLines: {
      the_human: "Ne-Yon. Rare. Most Potentials I meet are one or the other. You are... bridged.",
      shadow_tongue: "Half-and-half. Half-and-half. I could rewrite EITHER of you. Or BOTH.",
    },
  },
};

/* ─── CLASS-SPECIFIC GAMEPLAY HOOKS ─── */

export const CLASS_HOOKS: Record<CharClass, {
  primaryAttribute: "strength" | "intelligence" | "agility" | "charisma";
  exclusiveSkills: string[];
  combatRole: string;
  dialogStyle: string;
  unlocks: string[];
}> = {
  soldier: {
    primaryAttribute: "strength",
    exclusiveSkills: ["Overwatch", "Shield Wall", "Execute"],
    combatRole: "Front-line tank. Takes hits so allies don't.",
    dialogStyle: "Direct. Blunt. Respects chain-of-command. NPCs give orders, not requests.",
    unlocks: ["Arsenal Bay access", "Training gym sparring partner", "War Council seat in late game"],
  },
  scholar: {
    primaryAttribute: "intelligence",
    exclusiveSkills: ["Analyze", "Decipher", "Memory Palace"],
    combatRole: "Support caster. Amplifies allies, debuffs enemies.",
    dialogStyle: "Academic. Asks WHY. NPCs share lore they'd withhold from others.",
    unlocks: ["Archive deep access", "Can translate ancient texts solo", "Research projects unlock"],
  },
  rogue: {
    primaryAttribute: "agility",
    exclusiveSkills: ["Shadow Step", "Pickpocket", "Backstab"],
    combatRole: "Burst damage. Strikes, vanishes, strikes again.",
    dialogStyle: "Cagey. Lies easily. NPCs distrust you but respect your usefulness.",
    unlocks: ["Smuggler's tunnels", "Black market prices 20% better", "Stealth puzzle solutions"],
  },
  envoy: {
    primaryAttribute: "charisma",
    exclusiveSkills: ["Persuade", "Rally", "De-escalate"],
    combatRole: "Diplomat-warrior. Converts enemies mid-combat.",
    dialogStyle: "Warm. Curious. NPCs open up faster. Trust gains +25%.",
    unlocks: ["Alliance War diplomacy paths", "Faction leader private audiences", "Peaceful quest endings"],
  },
};

/* ─── ALIGNMENT IMPACT ─── */

export const ALIGNMENT_IMPACT: Record<Alignment, {
  corePhilosophy: string;
  factionsAligned: string[];
  factionsOpposed: string[];
  questFlavor: string;
  endingBias: string;
}> = {
  order: {
    corePhilosophy: "Structure preserves the pattern. Rules create meaning.",
    factionsAligned: ["Architect Remnants", "New Babylon (partial)", "Hierarchy"],
    factionsOpposed: ["Insurgency", "Dreamer's Children"],
    questFlavor: "Quests reward patience, verification, chain-of-custody. Slow-burn investigation paths.",
    endingBias: "Your endings lean toward restoration: rebuild the Ark, re-establish law, seal the breach.",
  },
  chaos: {
    corePhilosophy: "Patterns must shatter before new ones can form. Rules are the Virus's oldest tool.",
    factionsAligned: ["Insurgency", "Dreamer's Children", "Voltari"],
    factionsOpposed: ["Hierarchy", "New Babylon bureaucracy"],
    questFlavor: "Quests reward improvisation, mercy, breaking protocol. Fast-branching paths.",
    endingBias: "Your endings lean toward transformation: abandon the Ark, birth the new, let the old fall.",
  },
};

/* ─── COMPUTE MODIFIERS FROM SIGNATURE ─── */

export function computeCreationModifiers(sig: CreationSignature): CreationModifiers {
  const classHook = CLASS_HOOKS[sig.characterClass];
  const speciesContent = SPECIES_GATED_CONTENT[sig.species];

  return {
    elementDamageBonus: 0.15,            // +15% with chosen element
    elementResistance: 0.20,             // -20% from aligned element
    elementVulnerability: 0.25,          // +25% from opposing element
    trustMultiplierAligned: 1.25,        // +25% trust gain with aligned NPCs
    trustMultiplierOpposed: 0.60,        // -40% trust gain with opposed NPCs
    primaryAttributeBonus: 3,            // +3 starting primary stat
    speciesRoomKeys: speciesContent.exclusiveRooms.map(r => r.id),
    dialogTags: [
      `species:${sig.species}`,
      `element:${sig.element}`,
      `alignment:${sig.alignment}`,
      `class:${sig.characterClass}`,
      `primary:${classHook.primaryAttribute}`,
    ],
  };
}

/* ─── DIALOG FILTER ─── */
/** Given an NPC & player signature, return the flavored greeting. */
export function getFlavoredGreeting(npcId: string, sig: CreationSignature): string | null {
  const species = SPECIES_GATED_CONTENT[sig.species];
  const line = species.exclusiveNPCLines[npcId];
  if (line) return line;
  const affinity = NPC_ELEMENT_AFFINITY[npcId];
  if (affinity?.loves.includes(sig.element)) {
    return `Your ${sig.element} resonance is... welcome here. Few walk in carrying that frequency.`;
  }
  if (affinity?.dislikes.includes(sig.element)) {
    return `You carry ${sig.element}. I will work with you. But know I am uncomfortable in your presence.`;
  }
  return null;
}

/* ─── DAMAGE MODIFIER (combat hook) ─── */
export function getElementDamageMultiplier(
  attackerElement: Element,
  defenderElement: Element,
  mods: CreationModifiers,
): number {
  if (ELEMENT_OPPOSITIONS[attackerElement] === defenderElement) {
    return 1 + mods.elementDamageBonus + mods.elementVulnerability;
  }
  if (attackerElement === defenderElement) {
    return 1 - mods.elementResistance;
  }
  return 1;
}

/* ─── TRUST MULTIPLIER (faction hook) ─── */
export function getTrustMultiplier(
  npcId: string,
  sig: CreationSignature,
  mods: CreationModifiers,
): number {
  const affinity = NPC_ELEMENT_AFFINITY[npcId];
  if (!affinity) return 1;
  if (affinity.loves.includes(sig.element)) return mods.trustMultiplierAligned;
  if (affinity.dislikes.includes(sig.element)) return mods.trustMultiplierOpposed;
  return 1;
}

/* ─── UNLOCK CHECK ─── */
export function canAccessRoom(roomId: string, sig: CreationSignature): boolean {
  const gates = SPECIES_GATED_CONTENT[sig.species];
  if (gates.exclusiveRooms.some(r => r.id === roomId)) return true;
  // Non-gated rooms are always accessible (return true unless found gated for other species)
  for (const otherSpecies of Object.keys(SPECIES_GATED_CONTENT) as Species[]) {
    if (otherSpecies === sig.species) continue;
    if (SPECIES_GATED_CONTENT[otherSpecies].exclusiveRooms.some(r => r.id === roomId)) return false;
  }
  return true;
}

/* ─── ENDING WEIGHT ─── */
/**
 * At the end of each Epoch, we score which ending the player earns.
 * Creation signature adds BIAS — small but meaningful nudge.
 */
export function getEndingBias(sig: CreationSignature): Record<string, number> {
  const biases: Record<string, number> = {
    restoration: 0,
    transformation: 0,
    escape: 0,
    sacrifice: 0,
    alliance: 0,
  };
  if (sig.alignment === "order") biases.restoration += 15;
  if (sig.alignment === "chaos") biases.transformation += 15;
  if (sig.characterClass === "envoy") biases.alliance += 10;
  if (sig.characterClass === "soldier") biases.sacrifice += 10;
  if (sig.characterClass === "rogue") biases.escape += 10;
  if (sig.characterClass === "scholar") biases.restoration += 5;
  if (sig.species === "neyon") biases.transformation += 5;
  if (sig.element === "time") biases.restoration += 5;
  if (sig.element === "probability") biases.transformation += 5;
  if (sig.element === "reality") biases.sacrifice += 5;
  return biases;
}
