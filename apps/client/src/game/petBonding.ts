/* ═══════════════════════════════════════════════════════
   PET BONDING SYSTEM — BioWare-level companion relationships

   Mass Effect companions, Dragon Age approval system.

   Core loop: Pets react to YOUR choices. They grow with you,
   question you, and can be lost. The emotional stakes are real.

   Features:
   - Bond levels (0-100) like NPC trust
   - Morality reactions (pet grows uncomfortable with extreme alignments)
   - Skill trees per pet (combat/utility/social branches)
   - Companion quests (3 per pet, trust-gated)
   - Communication (thoughts appear as floating subtitles)
   - Injury/death system (pets can fall, can be revived with cost)
   - Evolution gated by bond + story milestones
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";

// Re-export the shared skill tree data + bonus parser so every
// existing client import site continues to work unchanged.
export {
  PET_SKILL_TREES,
  getSkillTreeForSpecies,
  parseSkillBonus,
  aggregateSkillEffects,
  canUnlockNode,
  getSkillNodeCost,
  type PetSkillNode,
  type PetSkillBranch,
  type PetSkillTree,
  type SkillBonusEffect,
} from "@shared/petSkillTrees";

/** Per-pet skill-tree progress snapshot used by the client bond store. */
export interface PetSkillProgress {
  availablePoints: number;
  unlockedNodes: string[];
}

/* ─── BOND STATE ─── */

export interface PetBond {
  petId: string;
  /** 0-100 relationship level */
  bond: number;
  /** Times you've brought them on missions together */
  sharedMissions: number;
  /** Is the pet currently active (walking with you)? */
  isActive: boolean;
  /** Injury state 0-100 (100 = dying) */
  injury: number;
  /** Morality tolerance: how far your morality has drifted from pet's preference */
  moralityDissonance: number;
  /** Completed companion quests */
  completedQuests: string[];
  /** Skill tree progress */
  skills: PetSkillProgress;
  /** Evolution stage: hatchling/companion/ascended */
  evolutionStage: 1 | 2 | 3;
  /** Last spoken thought timestamp */
  lastThought: number;
  /** Times this pet has died (and been revived) */
  deathCount: number;
}


/* ─── PET COMMUNICATION ─── */

/** Floating thought bubbles pets speak */
export interface PetThought {
  id: string;
  petId: string;
  /** When this thought triggers */
  trigger: ThoughtTrigger;
  /** Thought text */
  text: string;
  /** Minimum bond required */
  minBond: number;
  /** Emotion */
  emotion: "happy" | "worried" | "excited" | "sad" | "curious" | "afraid" | "angry" | "proud";
}

export type ThoughtTrigger =
  | { type: "room_enter"; roomId: string }
  | { type: "npc_encounter"; npcId: string }
  | { type: "combat_start" }
  | { type: "low_hp" }
  | { type: "morality_shift"; direction: "humanity" | "machine" }
  | { type: "injury" }
  | { type: "revival" }
  | { type: "discovery" };

export const PET_THOUGHTS: PetThought[] = [
  // Generic thoughts
  { id: "room_curious", petId: "*", trigger: { type: "room_enter", roomId: "*" }, text: "*sniffs the air curiously*", minBond: 0, emotion: "curious" },
  { id: "low_hp_worry", petId: "*", trigger: { type: "low_hp" }, text: "*whimpers* Please be careful...", minBond: 20, emotion: "worried" },
  { id: "combat_ready", petId: "*", trigger: { type: "combat_start" }, text: "*growls protectively*", minBond: 10, emotion: "angry" },
  // Lux-specific (light fox)
  { id: "lux_medical", petId: "lux", trigger: { type: "room_enter", roomId: "medical_bay" }, text: "This place smells like stories ending. I don't like it.", minBond: 30, emotion: "afraid" },
  { id: "lux_observation", petId: "lux", trigger: { type: "room_enter", roomId: "observation_deck" }, text: "The stars sing to me here. Do you hear them too?", minBond: 40, emotion: "happy" },
  { id: "lux_morality_humanity", petId: "lux", trigger: { type: "morality_shift", direction: "humanity" }, text: "Your light is brighter than yesterday. I can see it.", minBond: 50, emotion: "proud" },
  { id: "lux_morality_machine", petId: "lux", trigger: { type: "morality_shift", direction: "machine" }, text: "*ears flatten* You feel colder now. What happened to you?", minBond: 50, emotion: "worried" },
  // Cipher-specific (data serpent)
  { id: "cipher_archives", petId: "cipher", trigger: { type: "room_enter", roomId: "archives" }, text: "So much data... I want to read every byte.", minBond: 20, emotion: "excited" },
  { id: "cipher_shadow_tongue", petId: "cipher", trigger: { type: "npc_encounter", npcId: "shadow_tongue" }, text: "Something is WRONG with this entity. The code is lying.", minBond: 40, emotion: "afraid" },
  // Echo-specific (temporal kitten)
  { id: "echo_observation", petId: "echo", trigger: { type: "room_enter", roomId: "observation_deck" }, text: "I remember being here. In seven different tomorrows.", minBond: 30, emotion: "curious" },
  { id: "echo_antiquarian", petId: "echo", trigger: { type: "npc_encounter", npcId: "the_antiquarian" }, text: "*purrs* The kind one with sad eyes. He knows me.", minBond: 20, emotion: "happy" },
  // Injury/revival thoughts
  { id: "injured", petId: "*", trigger: { type: "injury" }, text: "*hurt sound* I'm okay... I think...", minBond: 0, emotion: "sad" },
  { id: "revived", petId: "*", trigger: { type: "revival" }, text: "I saw something in the dark. Something waiting. But I came back.", minBond: 50, emotion: "afraid" },
  { id: "revived_proud", petId: "*", trigger: { type: "revival" }, text: "You brought me back. I'll never doubt you again.", minBond: 80, emotion: "proud" },
];

export function getActiveThoughts(petId: string, trigger: ThoughtTrigger, bond: number): PetThought[] {
  return PET_THOUGHTS.filter(t => {
    if (t.petId !== "*" && t.petId !== petId) return false;
    if (t.minBond > bond) return false;
    if (t.trigger.type !== trigger.type) return false;
    // Match specific conditions
    if (trigger.type === "room_enter" && t.trigger.type === "room_enter") {
      return t.trigger.roomId === "*" || t.trigger.roomId === trigger.roomId;
    }
    if (trigger.type === "npc_encounter" && t.trigger.type === "npc_encounter") {
      return t.trigger.npcId === trigger.npcId;
    }
    if (trigger.type === "morality_shift" && t.trigger.type === "morality_shift") {
      return t.trigger.direction === trigger.direction;
    }
    return true;
  });
}

/* ─── COMPANION QUESTS ─── */

export interface PetQuest {
  id: string;
  petId: string;
  name: string;
  description: string;
  /** Bond required to unlock */
  bondRequired: number;
  /** Steps to complete */
  steps: PetQuestStep[];
  /** Reward on completion */
  reward: { bondGain: number; skillPoints: number; specialItem?: string; loreUnlock?: string };
}

export interface PetQuestStep {
  id: string;
  description: string;
  /** Auto-complete condition */
  completionFlag: string;
}

export const PET_QUESTS: PetQuest[] = [
  // Lux quests
  { id: "lux_origin", petId: "lux", name: "The Light's Origin", description: "Lux keeps staring at a specific wall in the Observation Deck. Something's there.",
    bondRequired: 30,
    steps: [
      { id: "step1", description: "Visit the Observation Deck with Lux active", completionFlag: "lux_obs_visit" },
      { id: "step2", description: "Examine the wall Lux is focused on", completionFlag: "lux_wall_examined" },
      { id: "step3", description: "Solve the Star Chart puzzle", completionFlag: "star_chart_complete" },
    ],
    reward: { bondGain: 15, skillPoints: 1, loreUnlock: "lux_origin_story" },
  },
  { id: "lux_loss", petId: "lux", name: "A Light That Was", description: "Lux dreams of another fox. It wasn't always alone.",
    bondRequired: 60,
    steps: [
      { id: "step1", description: "Find the second Holographic Fox in the Archives", completionFlag: "lux_sibling_found" },
      { id: "step2", description: "Decide: restore the sibling (cost: 500 Dream) or honor its memory", completionFlag: "lux_choice_made" },
    ],
    reward: { bondGain: 20, skillPoints: 2, loreUnlock: "lux_sibling_story" },
  },
  // Cipher quests
  { id: "cipher_corruption", petId: "cipher", name: "Shadow in the Code", description: "Cipher has detected Shadow Tongue's edits throughout the ship. It wants to fix them.",
    bondRequired: 30,
    steps: [
      { id: "step1", description: "Solve 3 Signal Decryption puzzles", completionFlag: "signal_3_solved" },
      { id: "step2", description: "Present the decrypted data to Cipher in Archives", completionFlag: "cipher_data_given" },
    ],
    reward: { bondGain: 15, skillPoints: 1, specialItem: "purified_code_fragment" },
  },
  // Echo quests
  { id: "echo_memories", petId: "echo", name: "Time-Lost Memories", description: "Echo remembers lives that haven't happened yet. The Antiquarian might help.",
    bondRequired: 40,
    steps: [
      { id: "step1", description: "Reach trust 40 with the Antiquarian", completionFlag: "antiquarian_trust_40" },
      { id: "step2", description: "Take Echo to meet the Antiquarian", completionFlag: "echo_antiquarian_meeting" },
      { id: "step3", description: "Choose: unstick Echo from time (they'll become mortal) or preserve the gift", completionFlag: "echo_time_choice" },
    ],
    reward: { bondGain: 25, skillPoints: 3, loreUnlock: "echo_time_story" },
  },

  // Spore (Spore Fungus) — viral, symbiosis, strain
  { id: "spore_awakening", petId: "spore", name: "First Breath of Rot", description: "Spore is spreading — not aggressively, but curiously. It wants to understand what it is.",
    bondRequired: 20,
    steps: [
      { id: "step1", description: "Take Spore into the Medical Bay", completionFlag: "spore_medical_visit" },
      { id: "step2", description: "Scan a sample of Spore's tendrils with the medical scanner", completionFlag: "spore_sample_scanned" },
    ],
    reward: { bondGain: 12, skillPoints: 1, loreUnlock: "spore_origin_story" },
  },
  { id: "spore_strain_kin", petId: "spore", name: "Siblings in the Swarm", description: "Spore senses another Strain aboard. It wants to meet.",
    bondRequired: 45,
    steps: [
      { id: "step1", description: "Find a Strain-infected crew member", completionFlag: "strain_crew_found" },
      { id: "step2", description: "Bring Spore to the infected crew member without containment", completionFlag: "spore_strain_meeting" },
      { id: "step3", description: "Choose: let Spore merge with the Strain or forcibly separate them", completionFlag: "spore_strain_choice" },
    ],
    reward: { bondGain: 20, skillPoints: 2, loreUnlock: "spore_strain_story" },
  },
  { id: "spore_sacrifice", petId: "spore", name: "The Gardener's Gift", description: "A crew member is dying of a disease Spore can cure — but only by consuming part of itself.",
    bondRequired: 70,
    steps: [
      { id: "step1", description: "Find a crew member with a terminal infection", completionFlag: "terminal_crew_found" },
      { id: "step2", description: "Decide: sacrifice 30% of Spore's mass to cure them, or preserve Spore whole", completionFlag: "spore_sacrifice_choice" },
    ],
    reward: { bondGain: 25, skillPoints: 3, specialItem: "crew_life_saved", loreUnlock: "spore_gardener_story" },
  },

  // Gilt (Gilt Beetle) — wealth, appraisal, the Collector
  { id: "gilt_hoard", petId: "gilt", name: "The Buried Hoard", description: "Gilt keeps digging in the Cargo Bay. There's something there.",
    bondRequired: 25,
    steps: [
      { id: "step1", description: "Follow Gilt to the Cargo Bay", completionFlag: "gilt_cargo_visit" },
      { id: "step2", description: "Dig where Gilt indicates (requires a crowbar)", completionFlag: "gilt_hoard_dug" },
    ],
    reward: { bondGain: 12, skillPoints: 1, specialItem: "buried_dream_cache", loreUnlock: "gilt_hoard_story" },
  },
  { id: "gilt_appraiser", petId: "gilt", name: "Apprentice Appraiser", description: "Gilt wants to teach you to see the way it sees — the true value of objects.",
    bondRequired: 40,
    steps: [
      { id: "step1", description: "Complete 3 successful appraisal checks with Gilt active", completionFlag: "gilt_appraisal_3" },
      { id: "step2", description: "Value a Collector's artifact correctly", completionFlag: "gilt_artifact_valued" },
    ],
    reward: { bondGain: 18, skillPoints: 2, loreUnlock: "gilt_appraiser_story" },
  },
  { id: "gilt_collector_meeting", petId: "gilt", name: "The Collector's Audience", description: "Gilt was owned by the Collector once. It remembers. It wants to go back — briefly.",
    bondRequired: 65,
    steps: [
      { id: "step1", description: "Reach the Collector's private gallery", completionFlag: "collector_gallery_reached" },
      { id: "step2", description: "Present Gilt to the Collector", completionFlag: "gilt_collector_presented" },
      { id: "step3", description: "Choose: leave Gilt to return to the Collector, or refuse and flee with it", completionFlag: "gilt_collector_choice" },
    ],
    reward: { bondGain: 25, skillPoints: 3, loreUnlock: "gilt_collector_story" },
  },

  // Glyph (Glyph Moth) — prophecy, scrolls, Antiquarian
  { id: "glyph_first_word", petId: "glyph", name: "The First Word", description: "The glyphs on Glyph's wings keep rearranging. They're trying to spell something.",
    bondRequired: 25,
    steps: [
      { id: "step1", description: "Take Glyph to the Archives", completionFlag: "glyph_archives_visit" },
      { id: "step2", description: "Photograph Glyph's wings in 3 different lights", completionFlag: "glyph_wings_photographed" },
      { id: "step3", description: "Decode the resulting message with the Antiquarian", completionFlag: "glyph_first_word_decoded" },
    ],
    reward: { bondGain: 15, skillPoints: 1, loreUnlock: "glyph_first_word" },
  },
  { id: "glyph_prophecy", petId: "glyph", name: "The Prophecy That Burns", description: "Glyph foresees a death. It's someone you love. Can you change it?",
    bondRequired: 50,
    steps: [
      { id: "step1", description: "Witness Glyph's prophecy vision", completionFlag: "glyph_prophecy_witnessed" },
      { id: "step2", description: "Identify which crew member the prophecy names", completionFlag: "glyph_target_identified" },
      { id: "step3", description: "Attempt to prevent the prophesied death (or accept it)", completionFlag: "glyph_prophecy_choice" },
    ],
    reward: { bondGain: 22, skillPoints: 2, loreUnlock: "glyph_prophecy_story" },
  },
  { id: "glyph_the_unwritten", petId: "glyph", name: "The Unwritten Name", description: "Glyph's final glyph is blank. It's waiting for you to write its true name.",
    bondRequired: 75,
    steps: [
      { id: "step1", description: "Meditate with Glyph in the Observation Deck at night", completionFlag: "glyph_meditation_complete" },
      { id: "step2", description: "Write Glyph's true name on the blank glyph — the name you choose becomes permanent", completionFlag: "glyph_true_name_written" },
    ],
    reward: { bondGain: 30, skillPoints: 3, loreUnlock: "glyph_true_name_story" },
  },

  // Flicker (Flicker Imp) — chaos, mischief, the insurgency
  { id: "flicker_prank", petId: "flicker", name: "Pranks and Protocol", description: "Flicker has been stealing small objects from the crew and hiding them.",
    bondRequired: 15,
    steps: [
      { id: "step1", description: "Catch Flicker in the act", completionFlag: "flicker_caught_pranking" },
      { id: "step2", description: "Return the stolen objects to their owners (or keep them)", completionFlag: "flicker_prank_resolved" },
    ],
    reward: { bondGain: 10, skillPoints: 1, loreUnlock: "flicker_prank_story" },
  },
  { id: "flicker_rebel_cell", petId: "flicker", name: "Rebel Cell Contact", description: "Flicker knows a place. A bar. Insurgents drink there. They'll let you in if you bring it.",
    bondRequired: 40,
    steps: [
      { id: "step1", description: "Find the Insurgency's hidden bar", completionFlag: "insurgency_bar_found" },
      { id: "step2", description: "Bring Flicker inside — the imp is your password", completionFlag: "flicker_cell_introduced" },
      { id: "step3", description: "Either side with the Insurgency contacts or report them to the Hierarchy", completionFlag: "flicker_insurgency_choice" },
    ],
    reward: { bondGain: 20, skillPoints: 2, loreUnlock: "flicker_insurgency_story" },
  },
  { id: "flicker_arson", petId: "flicker", name: "The Fire That Started Everything", description: "Flicker is drawn to a specific corridor — it's where the first Ark fire began. It remembers.",
    bondRequired: 65,
    steps: [
      { id: "step1", description: "Take Flicker to Corridor C-7", completionFlag: "flicker_c7_visited" },
      { id: "step2", description: "Search the scorched wall for Flicker's origin marker", completionFlag: "flicker_origin_found" },
      { id: "step3", description: "Choose: extinguish Flicker's ember (the imp becomes mortal) or feed it to reignite", completionFlag: "flicker_fire_choice" },
    ],
    reward: { bondGain: 25, skillPoints: 3, loreUnlock: "flicker_origin_story" },
  },
];

/* ─── INJURY / DEATH SYSTEM ─── */

export interface PetInjuryState {
  injury: number; // 0-100
  status: "healthy" | "hurt" | "critical" | "downed" | "dead";
  /** If downed, revival countdown in seconds */
  revivalTimer?: number;
}

export function getPetStatus(injury: number): PetInjuryState["status"] {
  if (injury >= 100) return "dead";
  if (injury >= 80) return "downed";
  if (injury >= 50) return "critical";
  if (injury >= 25) return "hurt";
  return "healthy";
}

/** Revival costs scale with pet's death count */
export function getRevivalCost(deathCount: number): { dream: number; voidCrystals: number; timeHours: number } {
  return {
    dream: 100 + deathCount * 50,
    voidCrystals: 5 + deathCount * 3,
    timeHours: Math.min(24, 1 + deathCount * 2),
  };
}

/** Permanent bond loss from death (emotional stakes) */
export function getDeathBondPenalty(deathCount: number): number {
  // First death: -10 bond. Escalates. By 5th death, -30.
  return Math.min(30, 10 + deathCount * 5);
}

/* ─── EVOLUTION STAGES ─── */

export interface PetEvolution {
  stage: 1 | 2 | 3;
  name: string;
  description: string;
  /** Requirements to reach this stage */
  requirements: { bond: number; sharedMissions: number; questsCompleted: number };
  /** Visual changes */
  visualChange: string;
  /** Stat bonus */
  statBonus: { bond: number; combat: number; social: number };
}

export const PET_EVOLUTIONS: PetEvolution[] = [
  { stage: 1, name: "Hatchling", description: "Newly bonded. Curious and playful.",
    requirements: { bond: 0, sharedMissions: 0, questsCompleted: 0 },
    visualChange: "Small, vulnerable appearance",
    statBonus: { bond: 0, combat: 0, social: 0 } },
  { stage: 2, name: "Companion", description: "Trusted ally. Bond deepens visibly.",
    requirements: { bond: 40, sharedMissions: 10, questsCompleted: 1 },
    visualChange: "Visible presence in character widget, color brightens",
    statBonus: { bond: 10, combat: 5, social: 5 } },
  { stage: 3, name: "Ascended", description: "Something more than companion. Something kin.",
    requirements: { bond: 80, sharedMissions: 50, questsCompleted: 3 },
    visualChange: "Animated visual, particle effects, unique aura",
    statBonus: { bond: 25, combat: 15, social: 15 } },
];

export function getEvolutionStage(bond: number, sharedMissions: number, questsCompleted: number): 1 | 2 | 3 {
  if (bond >= 80 && sharedMissions >= 50 && questsCompleted >= 3) return 3;
  if (bond >= 40 && sharedMissions >= 10 && questsCompleted >= 1) return 2;
  return 1;
}

/* ─── MORALITY REACTIONS ─── */

/** Each pet has a preferred morality direction. Dissonance grows if you drift far from it. */
export const PET_MORALITY_PREFERENCES: Record<string, { preferred: "humanity" | "machine" | "neutral"; tolerance: number }> = {
  lux: { preferred: "humanity", tolerance: 40 },
  cipher: { preferred: "machine", tolerance: 40 },
  echo: { preferred: "neutral", tolerance: 60 },
  spore: { preferred: "machine", tolerance: 50 },
  flicker: { preferred: "humanity", tolerance: 30 },
  gilt: { preferred: "neutral", tolerance: 50 },
  glyph: { preferred: "machine", tolerance: 60 },
};

/** Calculates bond dissonance penalty if morality conflicts with pet preference */
export function calculateMoralityDissonance(petId: string, moralityScore: number): number {
  const pref = PET_MORALITY_PREFERENCES[petId];
  if (!pref) return 0;
  if (pref.preferred === "humanity" && moralityScore < -pref.tolerance) return Math.abs(moralityScore + pref.tolerance);
  if (pref.preferred === "machine" && moralityScore > pref.tolerance) return moralityScore - pref.tolerance;
  if (pref.preferred === "neutral" && Math.abs(moralityScore) > pref.tolerance) return Math.abs(moralityScore) - pref.tolerance;
  return 0;
}

/** If dissonance exceeds 30, pet may leave temporarily */
export function canPetLeave(dissonance: number, bond: number): boolean {
  return dissonance >= 30 && bond < 60; // High bond keeps them through disagreement
}

/* ─── DEFAULT STATE ─── */

/* ─── EVOLUTION EPOCH NAMES ─── */

/**
 * Epoch-themed evolution stage names. Each stage maps to a
 * different era of the Dischordian timeline, grounding your
 * pet's growth in the lore of the 17,033-year history.
 */

export interface EvolutionEpochStage {
  stage: 1 | 2 | 3;
  name: string;
  epochReference: string;
  description: string;
}

export const EVOLUTION_EPOCH_STAGES: EvolutionEpochStage[] = [
  {
    stage: 1,
    name: "Echo of Genesis",
    epochReference: "Genesis (Year 0 — The Beginning)",
    description: "Base form. Born from the raw data of creation, the pet carries the primordial spark of the Dischordian timeline's origin. Fragile, watchful, and full of latent potential — an echo of the first breath of civilization.",
  },
  {
    stage: 2,
    name: "Expansion Form",
    epochReference: "Expansion Era (Years 3,000 — 8,000)",
    description: "Intermediate form. The pet's growth mirrors the expansion of empires across the stars. It unfolds into something larger, bolder, and far more dangerous — carrying the ambition and reach of an age that believed it could conquer everything.",
  },
  {
    stage: 3,
    name: "Post-Fall Ascension",
    epochReference: "Post-Fall (Year 17,033 — The Aftermath)",
    description: "Final form. The pet reaches its ultimate evolution in the aftermath of the Fall. Reality has shattered and rebuilt itself around this creature. It is no longer bound by the rules that once defined it — ascended, luminous, and terrifying.",
  },
];

/**
 * EVOLUTION_EPOCH_LORE — flavor text mapping each evolution
 * stage to epoch-appropriate narrative. Used in UI tooltips,
 * evolution cinematics, and the Loredex journal.
 */
export const EVOLUTION_EPOCH_LORE: Record<number, {
  stageName: string;
  epochName: string;
  flavorText: string;
  evolutionQuote: string;
  visualDescription: string;
}> = {
  1: {
    stageName: "Echo of Genesis",
    epochName: "Genesis",
    flavorText: "In the beginning, before the Hierarchy, before the Arks, before the Thought Virus — there was only potential. Your companion exists in that state now. A seed carrying the DNA of every future it might become. The oldest epoch whispers through its code: 'You are the first word of a story that has not yet been written.'",
    evolutionQuote: "\"Every civilization begins as a single heartbeat.\" — The Antiquarian",
    visualDescription: "Small, translucent form with a faint inner glow. Occasionally flickers as if not fully rendered into reality. Eyes wide, curious, absorbing everything.",
  },
  2: {
    stageName: "Expansion Form",
    epochName: "Expansion",
    flavorText: "The empires grew. The Arks launched. Humanity reached further than it had any right to — and your companion has done the same. The Expansion Form carries the swagger of an age drunk on its own momentum. It is larger, brighter, and moves with the confidence of a species that believed the stars were its birthright. But expansion always carries the seeds of overreach.",
    evolutionQuote: "\"We built towers to touch heaven. Heaven did not want to be touched.\" — Iron Lion's Last Speech",
    visualDescription: "Noticeably larger, with defined features and confident bearing. Aura stabilizes into a steady glow. Movement is purposeful. Armor-like plating or fur patterns begin to form.",
  },
  3: {
    stageName: "Post-Fall Ascension",
    epochName: "Post-Fall",
    flavorText: "Everything fell. The Hierarchy was exposed. Reality fractured. The Thought Virus consumed worlds. And in the wreckage, something new emerged — something that had passed through the fire and come out transformed. Your companion has ascended beyond the categories that once defined it. It is not what it was. It is what survives when everything else doesn't. The Post-Fall epoch is not an ending. It is a becoming.",
    evolutionQuote: "\"Ascension is not rising above. It is falling so far that you break through the floor and discover there was sky beneath you all along.\" — The Human (Final Transmission)",
    visualDescription: "Full-size form wreathed in shifting energy. Fracture-lines of light trace its body like healed scars. Eyes burn with quiet intensity. Particle effects — motes of light, temporal echoes, reality-bending distortions — trail its every movement.",
  },
};

export const DEFAULT_PET_BOND: Omit<PetBond, "petId"> = {
  bond: 10,
  sharedMissions: 0,
  isActive: false,
  injury: 0,
  moralityDissonance: 0,
  completedQuests: [],
  skills: { availablePoints: 1, unlockedNodes: [] },
  evolutionStage: 1,
  lastThought: 0,
  deathCount: 0,
};
