/* ═══════════════════════════════════════════════════════
   NARRATIVE SYSTEMS — Telltale + SWTOR + Hades-inspired features

   1. "X will remember this" visible notifications
   2. NPC trust → combat bonuses (SWTOR companion influence)
   3. Episode structure with "Previously On..." recaps
   4. Community choice statistics
   5. Antiquarian combat narration (Hades-style)
   6. NPC keepsake trinkets (Hades nectar/ambrosia)
   7. Neural Assist accessibility mode
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";

/* ═══ 1. "X WILL REMEMBER THIS" ═══ */

export interface RememberNotification {
  npcId: FactionNPCId;
  npcName: string;
  text: string;
  isPositive: boolean;
  /** Dispatched as custom event for the toast component to catch */
}

/**
 * Dispatch a "will remember this" notification.
 * The toast component listens for this event.
 */
export function dispatchRememberThis(npcId: FactionNPCId, npcName: string, isPositive: boolean) {
  const text = isPositive
    ? `${npcName} will remember this.`
    : `${npcName} will remember this...`;
  window.dispatchEvent(new CustomEvent("npc-remember", {
    detail: { npcId, npcName, text, isPositive },
  }));
}

/* ═══ 2. NPC TRUST → COMBAT BONUSES ═══ */

/**
 * across ALL game modes. Higher trust = stronger bonuses.
 */
export interface TrustCombatBonus {
  npcId: FactionNPCId;
  /** Trust threshold for this bonus tier */
  trustRequired: number;
  /** Bonuses granted */
  bonuses: { stat: string; value: number; percent: boolean; description: string }[];
}

export const TRUST_COMBAT_BONUSES: TrustCombatBonus[] = [
  // ELARA — Defense + Healing
  { npcId: "elara", trustRequired: 20, bonuses: [{ stat: "defense", value: 3, percent: true, description: "Elara's shield protocols" }] },
  { npcId: "elara", trustRequired: 40, bonuses: [{ stat: "hp_regen", value: 1, percent: false, description: "Elara's diagnostic healing" }] },
  { npcId: "elara", trustRequired: 60, bonuses: [{ stat: "defense", value: 5, percent: true, description: "Elara's advanced shielding" }] },
  { npcId: "elara", trustRequired: 80, bonuses: [{ stat: "revive_chance", value: 10, percent: true, description: "Elara's emergency revival" }] },

  // THE HUMAN — Attack + Strategy
  { npcId: "the_human", trustRequired: 20, bonuses: [{ stat: "attack", value: 3, percent: true, description: "The Human's tactical insight" }] },
  { npcId: "the_human", trustRequired: 40, bonuses: [{ stat: "crit_chance", value: 2, percent: true, description: "Detective's precision" }] },
  { npcId: "the_human", trustRequired: 60, bonuses: [{ stat: "attack", value: 5, percent: true, description: "Archon battle knowledge" }] },
  { npcId: "the_human", trustRequired: 80, bonuses: [{ stat: "chess_depth", value: 1, percent: false, description: "Archon-level strategy" }] },

  // AGENT ZERO — Speed + Combat
  { npcId: "agent_zero", trustRequired: 20, bonuses: [{ stat: "speed", value: 3, percent: true, description: "Insurgency combat training" }] },
  { npcId: "agent_zero", trustRequired: 40, bonuses: [{ stat: "dodge_chance", value: 2, percent: true, description: "Agent Zero's evasion" }] },
  { npcId: "agent_zero", trustRequired: 60, bonuses: [{ stat: "attack", value: 4, percent: true, description: "Weapons cache expertise" }] },
  { npcId: "agent_zero", trustRequired: 80, bonuses: [{ stat: "first_strike", value: 10, percent: true, description: "Zero's initiative" }] },

  // LOCKE — Resources + Trade
  { npcId: "adjudicator_locke", trustRequired: 20, bonuses: [{ stat: "dream_bonus", value: 5, percent: true, description: "Locke's trade connections" }] },
  { npcId: "adjudicator_locke", trustRequired: 40, bonuses: [{ stat: "salvage_bonus", value: 5, percent: true, description: "New Babylon supply lines" }] },
  { npcId: "adjudicator_locke", trustRequired: 60, bonuses: [{ stat: "trade_profit", value: 10, percent: true, description: "Insider trading network" }] },
  { npcId: "adjudicator_locke", trustRequired: 80, bonuses: [{ stat: "rare_drop", value: 5, percent: true, description: "Black market access" }] },

  // THE SOURCE — Virus resistance + Dark power
  { npcId: "the_source", trustRequired: 20, bonuses: [{ stat: "virus_resist", value: 10, percent: true, description: "Partial viral immunity" }] },
  { npcId: "the_source", trustRequired: 40, bonuses: [{ stat: "td_damage", value: 5, percent: true, description: "Understanding swarm patterns" }] },
  { npcId: "the_source", trustRequired: 60, bonuses: [{ stat: "hp", value: 10, percent: true, description: "Viral reinforcement" }] },
  { npcId: "the_source", trustRequired: 80, bonuses: [{ stat: "terminus_reward", value: 15, percent: true, description: "Sovereign's gift" }] },

  // THE ANTIQUARIAN — XP + Knowledge
  { npcId: "the_antiquarian", trustRequired: 20, bonuses: [{ stat: "xp_bonus", value: 5, percent: true, description: "Temporal perspective" }] },
  { npcId: "the_antiquarian", trustRequired: 40, bonuses: [{ stat: "lore_discovery", value: 10, percent: true, description: "Cross-timeline knowledge" }] },
  { npcId: "the_antiquarian", trustRequired: 60, bonuses: [{ stat: "xp_bonus", value: 10, percent: true, description: "Five Ages of wisdom" }] },
  { npcId: "the_antiquarian", trustRequired: 80, bonuses: [{ stat: "timeline_sight", value: 1, percent: false, description: "See alternate outcomes" }] },

  // SHADOW TONGUE — Corruption power (risky)
  { npcId: "shadow_tongue", trustRequired: 20, bonuses: [{ stat: "crit_damage", value: 5, percent: true, description: "Words that wound" }] },
  { npcId: "shadow_tongue", trustRequired: 40, bonuses: [{ stat: "debuff_power", value: 10, percent: true, description: "Linguistic corruption" }] },
  { npcId: "shadow_tongue", trustRequired: 60, bonuses: [{ stat: "attack", value: 8, percent: true, description: "The editor's pen" }] },
  { npcId: "shadow_tongue", trustRequired: 80, bonuses: [{ stat: "reality_warp", value: 5, percent: true, description: "Rewrite the outcome" }] },
];

export function getTrustBonuses(npcId: string, trust: number): TrustCombatBonus[] {
  return TRUST_COMBAT_BONUSES.filter(b => b.npcId === npcId && trust >= b.trustRequired);
}

export function getAllActiveBonuses(npcTrust: Record<string, number>, elaraTrust: number, humanTrust: number): TrustCombatBonus[] {
  const all: TrustCombatBonus[] = [];
  all.push(...getTrustBonuses("elara", elaraTrust));
  all.push(...getTrustBonuses("the_human", humanTrust));
  for (const [npcId, trust] of Object.entries(npcTrust)) {
    all.push(...getTrustBonuses(npcId, trust));
  }
  return all;
}

/* ═══ 3. EPISODE STRUCTURE ═══ */

export interface NarrativeEpisode {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  /** "Previously on..." recap text */
  previouslyOn: string;
  /** Key decisions made this episode */
  keyDecisions: string[];
  /** Acts/scenes within this episode */
  actRange: [number, number];
}

export const NARRATIVE_EPISODES: NarrativeEpisode[] = [
  {
    id: "ep1_awakening", number: 1, title: "AWAKENING", subtitle: "You open your eyes.",
    previouslyOn: "",
    keyDecisions: ["Species selection", "Class selection", "Alignment choice", "First room explored"],
    actRange: [0, 1],
  },
  {
    id: "ep2_signals", number: 2, title: "SIGNALS IN THE DARK", subtitle: "Someone is listening.",
    previouslyOn: "You awoke from cryogenic suspension aboard Ark 1047. Elara, the ship's AI, guided you through your first steps. But something feels wrong — the ship is damaged, the crew is missing, and a signal pulses from deep within the substrate layer...",
    keyDecisions: ["Human contact decision", "First NPC trust choices", "Puzzle solutions"],
    actRange: [1, 2],
  },
  {
    id: "ep3_truth", number: 3, title: "THE PRICE OF TRUTH", subtitle: "Every answer costs something.",
    previouslyOn: "You discovered The Human — the last organic Archon, imprisoned in the substrate. Agent Zero's signal reached you from the dead. Adjudicator Locke offered deals from New Babylon. And in the Archives, text began rewriting itself...",
    keyDecisions: ["Elara secret revelation", "Shadow Tongue discovery", "Source contact"],
    actRange: [2, 3],
  },
  {
    id: "ep4_terminus", number: 4, title: "TERMINUS", subtitle: "The destination was always the same.",
    previouslyOn: "The truth emerged: Elara was Senator Voss, betrayer of humanity. The Source was Kael, hero turned plague. The Shadow Tongue had been rewriting reality since construction. And Terminus — the Panopticon itself, broken free — drew closer with every passing hour...",
    keyDecisions: ["Faction alignment", "Permanent choices", "Alliance formation"],
    actRange: [3, 5],
  },
  {
    id: "ep5_fall", number: 5, title: "THE FALL OF REALITY", subtitle: "When the seventh seal breaks, silence falls.",
    previouslyOn: "Every NPC's loyalty was tested. Every faction made its move. The Ark reached Terminus, and the final question remained: consciousness or dissolution, truth or comfort, survival or transcendence?",
    keyDecisions: ["Suicide mission preparation", "Final NPC loyalties", "The ending you chose"],
    actRange: [5, 7],
  },
];

export function getCurrentEpisode(narrativeAct: number): NarrativeEpisode {
  return NARRATIVE_EPISODES.find(e => narrativeAct >= e.actRange[0] && narrativeAct < e.actRange[1]) || NARRATIVE_EPISODES[0];
}

/* ═══ 4. COMMUNITY CHOICE STATISTICS ═══ */

export interface CommunityChoice {
  choiceId: string;
  description: string;
  options: { id: string; label: string; percentage: number }[];
}

/** Simulated community stats (would be server-driven in production) */
export const SIMULATED_COMMUNITY_STATS: CommunityChoice[] = [
  { choiceId: "told_elara_truth", description: "Told Elara about The Human", options: [
    { id: "told", label: "Told the truth", percentage: 43 },
    { id: "hid", label: "Kept it secret", percentage: 57 },
  ]},
  { choiceId: "source_infection", description: "Accepted The Source's offer", options: [
    { id: "accepted", label: "Accepted infection", percentage: 22 },
    { id: "refused", label: "Refused", percentage: 78 },
  ]},
  { choiceId: "shadow_tongue_deal", description: "Made a deal with the Shadow Tongue", options: [
    { id: "deal", label: "Made the deal", percentage: 31 },
    { id: "refused", label: "Refused the demon", percentage: 69 },
  ]},
  { choiceId: "alignment_final", description: "Final morality alignment", options: [
    { id: "humanity", label: "Chose Humanity", percentage: 62 },
    { id: "machine", label: "Chose Machine", percentage: 38 },
  ]},
];

/* ═══ 5. ANTIQUARIAN COMBAT NARRATION ═══ */

export interface CombatNarration {
  trigger: "round_start" | "combo_5" | "low_health" | "perfect_round" | "ko" | "loss" | "parry" | "special_move";
  lines: string[];
}

export const ANTIQUARIAN_COMBAT_NARRATION: CombatNarration[] = [
  { trigger: "round_start", lines: [
    "Another fight begins. I've seen this one end seventeen different ways.",
    "The combatants take their positions. History holds its breath.",
    "Fascinating. In three other timelines, this fight never happens.",
  ]},
  { trigger: "combo_5", lines: [
    "Five hits! The Warlord would be impressed. Or jealous.",
    "A beautiful sequence. Mechronis Academy teaches well.",
    "Five consecutive strikes. In the Foundation era, that was called 'poetry.'",
  ]},
  { trigger: "low_health", lines: [
    "Careful now. I've collected too many endings already today.",
    "The margin between victory and defeat narrows. Choose wisely.",
    "Iron Lion once fought with half his body destroyed. He won. Will you?",
  ]},
  { trigger: "perfect_round", lines: [
    "Flawless! Not a single blow landed. The Architect himself couldn't have calculated better.",
    "A perfect round. I'll add this to my collection of beautiful moments.",
    "Untouched. In 93,847 sunrises, Elara has never seen anyone fight like that.",
  ]},
  { trigger: "ko", lines: [
    "And it's over. Another ending for my collection.",
    "The victor stands. The fallen learns. Both advance.",
    "KO. In the Age of Privacy, they called that 'a permanent logout.'",
  ]},
  { trigger: "loss", lines: [
    "Defeat is a teacher with terrible manners but excellent curriculum.",
    "You fell. But I've seen you rise in 12 other timelines. Get up.",
    "The Source would say consciousness is suffering. I say suffering is education.",
  ]},
  { trigger: "parry", lines: [
    "Parried! The Detective used that technique in New Babylon for 800 years.",
    "A perfect deflection. The Insurgency trained their agents to do exactly that.",
  ]},
  { trigger: "special_move", lines: [
    "A devastating technique! The Archons themselves would take note.",
    "Power unleashed. The Matrix of Dreams trembles.",
  ]},
];

export function getCombatNarration(trigger: string): string {
  const entry = ANTIQUARIAN_COMBAT_NARRATION.find(n => n.trigger === trigger);
  if (!entry) return "";
  return entry.lines[Math.floor(Math.random() * entry.lines.length)];
}

/* ═══ 6. NPC KEEPSAKE TRINKETS ═══ */

export interface KeepsakeTrinket {
  id: string;
  npcId: FactionNPCId;
  name: string;
  description: string;
  /** Trust required to receive this keepsake */
  trustRequired: number;
  /** Passive bonus while equipped */
  bonus: { stat: string; value: number; percent: boolean };
  /** Lore flavor */
  loreText: string;
}

export const KEEPSAKE_TRINKETS: KeepsakeTrinket[] = [
  { id: "elara_data_crystal", npcId: "elara", name: "Elara's Data Crystal", description: "A fragment of Elara's core memory banks. It pulses with cyan light.",
    trustRequired: 50, bonus: { stat: "defense", value: 8, percent: true },
    loreText: "She gave you a piece of herself. Literally. The crystal contains a backup of her earliest memories — before the amnesia." },
  { id: "human_chess_piece", npcId: "the_human", name: "The Human's Chess Piece", description: "A king from an ancient chess set. It's warm to the touch.",
    trustRequired: 50, bonus: { stat: "attack", value: 8, percent: true },
    loreText: "He carved this during his 1,351 years as Archon. 'A king that can't move freely isn't a king,' he said. 'It's a prisoner.'" },
  { id: "zero_dog_tag", npcId: "agent_zero", name: "Agent Zero's Dog Tag", description: "Military identification. The biometrics don't match Agent Zero's profile.",
    trustRequired: 50, bonus: { stat: "speed", value: 8, percent: true },
    loreText: "The tag says Agent Zero. The data says The Engineer. The truth says: does it matter whose name is on the tag if the mission continues?" },
  { id: "locke_trade_coin", npcId: "adjudicator_locke", name: "Locke's Trade Coin", description: "A New Babylon credit chip. Both sides show the same face.",
    trustRequired: 50, bonus: { stat: "dream_bonus", value: 10, percent: true },
    loreText: "'Heads I win, tails you lose,' Locke said as she pressed it into your palm with her gloved hand, her steampunk eye patch catching the light. 'That's not a joke. That's monetary policy.'" },
  { id: "source_memory_shard", npcId: "the_source", name: "Kael's Last Memory", description: "A crystallized fragment of consciousness. Inside: a melody.",
    trustRequired: 50, bonus: { stat: "hp", value: 10, percent: true },
    loreText: "One memory survived the virus. A woman singing. Kael can't remember her name. But the melody is the most beautiful thing left in his trillion-mind swarm." },
  { id: "antiquarian_lens", npcId: "the_antiquarian", name: "The Antiquarian's Spare Goggles", description: "Red-tinted lenses that filter time. Objects appear to have afterimages.",
    trustRequired: 50, bonus: { stat: "xp_bonus", value: 10, percent: true },
    loreText: "'Wear these and you'll see what I see,' he warned. 'Every version of every moment, layered. Most people go mad. You might be different.'" },
  { id: "shadow_tongue_quill", npcId: "shadow_tongue", name: "The Shadow Tongue's Quill", description: "A pen that writes in languages that don't exist. Yet.",
    trustRequired: 50, bonus: { stat: "crit_damage", value: 10, percent: true },
    loreText: "'Every word is a weapon,' the Shadow Tongue purred. 'This quill has written constitutions, love letters, and death warrants. Sometimes all three in the same sentence.'" },
];

export function getAvailableKeepsakes(npcTrust: Record<string, number>, elaraTrust: number, humanTrust: number): KeepsakeTrinket[] {
  return KEEPSAKE_TRINKETS.filter(k => {
    const trust = k.npcId === "elara" ? elaraTrust : k.npcId === "the_human" ? humanTrust : (npcTrust[k.npcId] || 0);
    return trust >= k.trustRequired;
  });
}

/* ═══ 7. NEURAL ASSIST (Accessibility) ═══ */

export interface NeuralAssistConfig {
  enabled: boolean;
  /** Reduce enemy damage by 50% */
  damageReduction: boolean;
  /** Extend puzzle timers by 2x */
  extendedTimers: boolean;
  /** Show hint button on all puzzles */
  alwaysShowHints: boolean;
  /** Auto-block in fight game */
  autoBlock: boolean;
  /** Skip button for combat encounters */
  skipCombat: boolean;
  /** Mark completion as "assisted" (no shame, different icon) */
  markedAsAssisted: boolean;
}

export const DEFAULT_NEURAL_ASSIST: NeuralAssistConfig = {
  enabled: false,
  damageReduction: true,
  extendedTimers: true,
  alwaysShowHints: true,
  autoBlock: false,
  skipCombat: false,
  markedAsAssisted: true,
};

export const NEURAL_ASSIST_DESCRIPTION =
  "Neural Assist reduces combat difficulty, extends puzzle timers, and shows hints. " +
  "Your achievements are still earned. Your story still matters. " +
  "The Ark doesn't judge how you survive — only that you do.";
