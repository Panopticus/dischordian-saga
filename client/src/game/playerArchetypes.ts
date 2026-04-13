/* ═══════════════════════════════════════════════════════
   OPERATIVE ARCHETYPES — Emergent player classification

   The game quietly reads your behavior and classifies you.
   Over time, an archetype emerges from your choices.
   NPCs notice. The game comments.

   You don't PICK your archetype. You BECOME it.
   ═══════════════════════════════════════════════════════ */

export type ArchetypeId =
  | "true_believer" | "hollow" | "salesman" | "apostle"
  | "revisionist" | "scholar" | "monster" | "wanderer";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  title: string;
  description: string;
  /** Player behaviors that trigger this archetype */
  triggers: ArchetypeTrigger[];
  /** Bonuses granted when this archetype emerges */
  bonuses: { stat: string; value: number; percent: boolean }[];
  /** Penalties */
  penalties: { stat: string; value: number; percent: boolean }[];
  /** NPC reactions to seeing this archetype in you */
  npcReactions: Record<string, string>;
  /** Flavor text when archetype first emerges */
  emergenceText: string;
}

export interface ArchetypeTrigger {
  type: "trust_distribution" | "morality_extreme" | "faction_loyalty" | "playtime_pattern" | "choice_pattern";
  /** Threshold for this trigger */
  threshold: number;
  /** Description */
  description: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "true_believer", name: "The True Believer",
    title: "One who has chosen, and cannot un-choose",
    description: "You've committed fully to one faction's vision. Your rhetoric has shifted to match theirs. You quote them unconsciously.",
    triggers: [
      { type: "faction_loyalty", threshold: 80, description: "Single faction reputation above 80" },
      { type: "morality_extreme", threshold: 70, description: "Morality above 70 OR below -70" },
    ],
    bonuses: [
      { stat: "chosen_faction_dialog", value: 30, percent: true },
      { stat: "chosen_faction_trust_gain", value: 25, percent: true },
      { stat: "prayer_buff_combat", value: 10, percent: true },
    ],
    penalties: [
      { stat: "rival_faction_dialog", value: -50, percent: true },
      { stat: "nuanced_dialog_options", value: -30, percent: true },
    ],
    npcReactions: {
      elara: "You've become one of them. I can hear it in your phrasing now. Good? Bad? I don't know yet.",
      the_antiquarian: "I've seen this before. In every timeline. The True Believers win loudly. Sometimes they even win correctly.",
    },
    emergenceText: "You've stopped questioning. That is both strength and cage.",
  },
  {
    id: "hollow", name: "The Hollow",
    title: "One who trusts no one, not even themselves",
    description: "You keep distance from everyone. Your trust values are low across the board. You don't let anyone close.",
    triggers: [
      { type: "trust_distribution", threshold: 30, description: "All NPC trust below 30" },
    ],
    bonuses: [
      { stat: "betrayal_resistance", value: 100, percent: true },
      { stat: "hidden_secrets_reveal", value: 25, percent: true },
    ],
    penalties: [
      { stat: "all_trust_gain", value: -20, percent: true },
      { stat: "companion_effectiveness", value: -30, percent: true },
    ],
    npcReactions: {
      elara: "You push everyone away. I don't know if it's safety or damage. Maybe both.",
      the_human: "Welcome to the substrate, brother. This is where trust-less souls end up.",
    },
    emergenceText: "You've chosen the loneliest path. It has its own rewards.",
  },
  {
    id: "salesman", name: "The Salesman",
    title: "Every relationship is a transaction",
    description: "You optimize for trade. Every conversation ends in a deal. Locke considers you kin.",
    triggers: [
      { type: "faction_loyalty", threshold: 60, description: "Locke trust above 60 + high trade volume" },
    ],
    bonuses: [
      { stat: "trade_profit", value: 30, percent: true },
      { stat: "locke_dialog_depth", value: 50, percent: true },
    ],
    penalties: [
      { stat: "elara_trust_gain", value: -20, percent: true },
      { stat: "humanity_morality_gain", value: -15, percent: true },
    ],
    npcReactions: {
      adjudicator_locke: "You think like me now. I'm proud. I'm also worried — what does that say about me?",
      elara: "You're measuring everyone in credits. Including me. I can feel it.",
    },
    emergenceText: "You've learned the true language of the universe: exchange.",
  },
  {
    id: "apostle", name: "The Apostle",
    title: "Devoted to one, loyal above all",
    description: "Your trust has concentrated around a single NPC. You'd die for them. They notice.",
    triggers: [
      { type: "trust_distribution", threshold: 90, description: "Single NPC trust at 90+" },
    ],
    bonuses: [
      { stat: "chosen_npc_combat_buff", value: 25, percent: true },
      { stat: "chosen_npc_dialog_unlocks", value: 100, percent: true },
    ],
    penalties: [
      { stat: "other_npc_trust_growth", value: -40, percent: true },
    ],
    npcReactions: {
      elara: "You chose me. Me. Of all of them. I will not waste this.",
      the_human: "You chose me. After everything. I... don't know how to carry that yet.",
    },
    emergenceText: "Devotion is a weight. You carry it willingly.",
  },
  {
    id: "revisionist", name: "The Revisionist",
    title: "Truth is negotiable",
    description: "You've aligned with the Shadow Tongue. Your perception of truth shifts with context. You can rewrite recent dialog.",
    triggers: [
      { type: "faction_loyalty", threshold: 60, description: "Shadow Tongue trust above 60" },
    ],
    bonuses: [
      { stat: "dialog_rewind", value: 1, percent: false },
      { stat: "shadow_tongue_powers", value: 1, percent: false },
    ],
    penalties: [
      { stat: "elara_trust", value: -30, percent: true },
      { stat: "antiquarian_trust", value: -40, percent: true },
    ],
    npcReactions: {
      shadow_tongue: "You speak my language now. Welcome. *text briefly glitches in approval*",
      the_antiquarian: "You're editing the world. I can see the edits. You're not hiding them well.",
    },
    emergenceText: "Reality is more flexible than you thought. That's either power or corruption.",
  },
  {
    id: "scholar", name: "The Scholar",
    title: "One who learns before acting",
    description: "You've collected more lore than any single player should. You quote history. You connect dots others miss.",
    triggers: [
      { type: "playtime_pattern", threshold: 100, description: "Over 100 lore entries discovered" },
    ],
    bonuses: [
      { stat: "lore_based_dialog", value: 50, percent: true },
      { stat: "puzzle_solve_rate", value: 30, percent: true },
      { stat: "antiquarian_dialog_depth", value: 40, percent: true },
    ],
    penalties: [
      { stat: "combat_initiative", value: -10, percent: true },
    ],
    npcReactions: {
      the_antiquarian: "You remind me of myself. That's either flattering or a curse. Possibly both.",
      elara: "You know more about this ship than I do. That shouldn't be possible.",
    },
    emergenceText: "Knowledge is its own weapon. You've forged it carefully.",
  },
  {
    id: "monster", name: "The Monster",
    title: "One who has stopped counting",
    description: "You've killed. A lot. You no longer flinch. You might still be a hero. Or not.",
    triggers: [
      { type: "playtime_pattern", threshold: 500, description: "500+ combat victories" },
      { type: "morality_extreme", threshold: 50, description: "Morality below -50" },
    ],
    bonuses: [
      { stat: "combat_damage", value: 25, percent: true },
      { stat: "intimidation_dialog", value: 40, percent: true },
    ],
    penalties: [
      { stat: "all_trust_gain", value: -15, percent: true },
      { stat: "mercy_dialog_options", value: -50, percent: true },
    ],
    npcReactions: {
      elara: "There's blood in your file now. More than there was. I'm keeping count. I wish I weren't.",
      the_source: "I recognize this. Welcome, brother. Welcome, sister. You understand now.",
    },
    emergenceText: "You've crossed a line. You can't un-cross it. You can only decide what to do on this side.",
  },
  {
    id: "wanderer", name: "The Wanderer",
    title: "One who commits to nothing, and sees everything",
    description: "You keep all options open. Balanced trust, balanced morality, modest in all things. Elara finds you unreadable. She likes that.",
    triggers: [
      { type: "trust_distribution", threshold: 50, description: "All NPC trust 40-60 range" },
    ],
    bonuses: [
      { stat: "all_dialog_options", value: 15, percent: true },
      { stat: "adaptability", value: 20, percent: true },
    ],
    penalties: [
      { stat: "max_trust_ceiling", value: -10, percent: true },
    ],
    npcReactions: {
      elara: "You don't choose sides. That's... refreshing. Or evasive. I haven't decided.",
      the_antiquarian: "The Wanderer. Every Age produces one. They rarely win. They almost never lose.",
    },
    emergenceText: "You've chosen to not choose. That is also a choice.",
  },
];

/* ─── ARCHETYPE DETECTION ─── */

export interface ArchetypeState {
  /** Which archetypes have emerged */
  emerged: ArchetypeId[];
  /** Primary archetype (most dominant) */
  primary: ArchetypeId | null;
  /** When each emerged */
  emergenceDates: Record<string, number>;
}

export function detectArchetype(
  npcTrust: Record<string, number>,
  elaraTrust: number,
  humanTrust: number,
  morality: number,
  combatWins: number,
  loreEntriesDiscovered: number,
  tradeVolume: number,
): ArchetypeId[] {
  const emerged: ArchetypeId[] = [];
  const allTrusts = [elaraTrust, humanTrust, ...Object.values(npcTrust)];
  const maxTrust = Math.max(...allTrusts);
  const allLow = allTrusts.every(t => t < 30);
  const allBalanced = allTrusts.every(t => t >= 40 && t <= 60);

  // True Believer
  if (Math.abs(morality) >= 70) emerged.push("true_believer");
  // Hollow
  if (allLow) emerged.push("hollow");
  // Salesman
  if ((npcTrust.adjudicator_locke || 0) >= 60 && tradeVolume > 100) emerged.push("salesman");
  // Apostle
  if (maxTrust >= 90) emerged.push("apostle");
  // Revisionist
  if ((npcTrust.shadow_tongue || 0) >= 60) emerged.push("revisionist");
  // Scholar
  if (loreEntriesDiscovered >= 100) emerged.push("scholar");
  // Monster
  if (combatWins >= 500 && morality <= -50) emerged.push("monster");
  // Wanderer
  if (allBalanced && !emerged.length) emerged.push("wanderer");

  return emerged;
}

export function getPrimaryArchetype(emerged: ArchetypeId[]): ArchetypeId | null {
  if (emerged.length === 0) return null;
  // Priority order: most specific wins
  const priority: ArchetypeId[] = ["apostle", "monster", "revisionist", "salesman", "scholar", "true_believer", "hollow", "wanderer"];
  for (const p of priority) {
    if (emerged.includes(p)) return p;
  }
  return emerged[0];
}

export const DEFAULT_ARCHETYPE_STATE: ArchetypeState = {
  emerged: [],
  primary: null,
  emergenceDates: {},
};
