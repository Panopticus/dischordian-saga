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

/* ─── SKILL TREES ─── */

export interface PetSkillTree {
  combat: PetSkillBranch;
  utility: PetSkillBranch;
  social: PetSkillBranch;
}

export interface PetSkillBranch {
  name: string;
  nodes: PetSkillNode[];
}

export interface PetSkillNode {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  cost: number; // Skill points required
  bonus: string;
  /** Prerequisite node */
  requires?: string;
}

export interface PetSkillProgress {
  availablePoints: number;
  unlockedNodes: string[];
}

export const PET_SKILL_TREES: Record<string, PetSkillTree> = {
  default: {
    combat: {
      name: "COMBAT",
      nodes: [
        { id: "bite", name: "Sharpened Bite", description: "+10% pet battle damage", tier: 1, cost: 1, bonus: "damage_10" },
        { id: "dodge", name: "Quick Dodge", description: "+5% dodge chance in pet battles", tier: 1, cost: 1, bonus: "dodge_5" },
        { id: "rally", name: "Rally Cry", description: "Buffs your combat stats by +5% when pet is active", tier: 2, cost: 2, bonus: "owner_buff_5", requires: "bite" },
        { id: "crit", name: "Critical Strike", description: "10% chance to crit in pet battles (2x damage)", tier: 2, cost: 2, bonus: "crit_10", requires: "dodge" },
        { id: "fury", name: "Protective Fury", description: "When owner HP below 25%, pet enrages: +25% damage, +25% speed", tier: 3, cost: 3, bonus: "rage_mode", requires: "rally" },
      ],
    },
    utility: {
      name: "UTILITY",
      nodes: [
        { id: "scout", name: "Scouting", description: "Reveals adjacent room hotspots", tier: 1, cost: 1, bonus: "hotspot_reveal" },
        { id: "fetch", name: "Fetch Items", description: "5% chance to find bonus items in rooms", tier: 1, cost: 1, bonus: "item_bonus_5" },
        { id: "sniff", name: "Treasure Sense", description: "Can detect hidden items in rooms", tier: 2, cost: 2, bonus: "hidden_reveal", requires: "fetch" },
        { id: "guide", name: "Path Guide", description: "Shows shortest path between rooms on map", tier: 2, cost: 2, bonus: "pathfinding", requires: "scout" },
        { id: "oracle", name: "Oracle's Instinct", description: "Predicts NPC trust changes from choices before you commit", tier: 3, cost: 3, bonus: "choice_preview", requires: "guide" },
      ],
    },
    social: {
      name: "SOCIAL",
      nodes: [
        { id: "calm", name: "Calming Presence", description: "+5% trust gain with all NPCs", tier: 1, cost: 1, bonus: "trust_gain_5" },
        { id: "empathy", name: "Empathic Link", description: "Pet warns you when NPC dialog is deceptive", tier: 1, cost: 1, bonus: "deception_detect" },
        { id: "charm", name: "Charm", description: "+10% gift effectiveness with NPCs", tier: 2, cost: 2, bonus: "gift_boost_10", requires: "calm" },
        { id: "insight", name: "Deep Insight", description: "See NPC mood (hidden) before dialogue", tier: 2, cost: 2, bonus: "mood_reveal", requires: "empathy" },
        { id: "harmonize", name: "Harmonic Bond", description: "Your active pet's bond affects ALL NPC trust gains (+0.5% per bond point)", tier: 3, cost: 3, bonus: "universal_trust", requires: "charm" },
      ],
    },
  },
};

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
