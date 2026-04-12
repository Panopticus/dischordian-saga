/* ═══════════════════════════════════════════════════════
   INNER VOICES — Skills speak to the player

   Each civil skill becomes a character with its own voice,
   opinions, and personality. They comment on dialog, rooms,
   NPCs, and player choices in real-time.

   High skill = frequent helpful voices.
   Low skill = wrong or misleading voices.
   Some voices contradict each other — the player must choose
   which skill to trust in each moment.

   This turns stats into internal characters.
   ═══════════════════════════════════════════════════════ */

/* ─── SKILL VOICE DEFINITIONS ─── */

export type SkillId =
  | "tactics" | "perception" | "craftsmanship" | "endurance"
  | "negotiation" | "espionage" | "leadership" | "lore"
  | "empathy" | "paranoia" | "intuition" | "authority";

export interface SkillVoice {
  id: SkillId;
  name: string;
  personality: string;
  /** Tone this skill speaks in */
  voiceDescriptor: string;
  /** Color when rendered */
  color: string;
  /** What it's good at noticing */
  specialty: string;
  /** When it's WRONG (low skill) */
  failureMode: string;
}

export const SKILL_VOICES: Record<SkillId, SkillVoice> = {
  tactics: {
    id: "tactics", name: "TACTICS", personality: "Cold, analytical, always calculating",
    voiceDescriptor: "speaks in chess moves and battlefield geometry",
    color: "#ef4444", specialty: "combat advantage, positioning, reading posture",
    failureMode: "sees threats where there are none, advises violence unnecessarily",
  },
  perception: {
    id: "perception", name: "PERCEPTION", personality: "Observant, detail-obsessed, sees what others miss",
    voiceDescriptor: "whispers about micro-expressions and inconsistencies",
    color: "#22d3ee", specialty: "hidden details, lies, physical evidence",
    failureMode: "paranoid pattern-matching, sees conspiracies in coincidence",
  },
  craftsmanship: {
    id: "craftsmanship", name: "CRAFTSMANSHIP", personality: "Hands-on, proud, appreciates good work",
    voiceDescriptor: "inspects objects with practiced eyes",
    color: "#f59e0b", specialty: "quality assessment, repair, fabrication tells",
    failureMode: "dismisses well-made things as junk, overvalues flawed work",
  },
  endurance: {
    id: "endurance", name: "ENDURANCE", personality: "Steady, tired, proud of persistence",
    voiceDescriptor: "reminds you of pain felt and pain coming",
    color: "#78350f", specialty: "physical thresholds, exhaustion, push-through moments",
    failureMode: "urges retreat too early, or keeps going past the point of damage",
  },
  negotiation: {
    id: "negotiation", name: "NEGOTIATION", personality: "Silky, confident, always reading the room",
    voiceDescriptor: "speaks in price tags and leverage points",
    color: "#e040fb", specialty: "prices, power dynamics, reading desperation",
    failureMode: "undersells you, or overplays a weak hand into a disaster",
  },
  espionage: {
    id: "espionage", name: "ESPIONAGE", personality: "Cautious, twitchy, trusts nothing",
    voiceDescriptor: "mutters about surveillance and escape routes",
    color: "#94a3b8", specialty: "hidden observers, escape planning, tradecraft",
    failureMode: "hallucinates observers in empty rooms, flees safe situations",
  },
  leadership: {
    id: "leadership", name: "LEADERSHIP", personality: "Warm, commanding, believes in people",
    voiceDescriptor: "speaks like a general or a teacher",
    color: "#fbbf24", specialty: "inspiring others, reading group dynamics, rallying",
    failureMode: "overconfident in people who will betray you",
  },
  lore: {
    id: "lore", name: "LORE", personality: "Bookish, excited, constantly making connections",
    voiceDescriptor: "cites historical parallels and half-remembered texts",
    color: "#10b981", specialty: "historical context, name drops, buried truths",
    failureMode: "wrong references, confidently stated misremembering",
  },
  empathy: {
    id: "empathy", name: "EMPATHY", personality: "Sensitive, hurting, feels everything twice",
    voiceDescriptor: "speaks softly about what others are hiding",
    color: "#a855f7", specialty: "emotional subtext, hidden pain, unspoken motives",
    failureMode: "projects your feelings onto others, too much caring",
  },
  paranoia: {
    id: "paranoia", name: "PARANOIA", personality: "Frightened, certain, hissing",
    voiceDescriptor: "warns in urgent whispers that nothing is safe",
    color: "#dc2626", specialty: "genuine threats, hidden motives, bad faith actors",
    failureMode: "screams about nothing, exhausts you with false alarms",
  },
  intuition: {
    id: "intuition", name: "INTUITION", personality: "Quiet, certain, rarely speaks",
    voiceDescriptor: "offers single clear impressions without justification",
    color: "#bae6fd", specialty: "gut reads that skip analysis",
    failureMode: "wrong but convincing, leads you into ambushes",
  },
  authority: {
    id: "authority", name: "AUTHORITY", personality: "Loud, sure, wants control",
    voiceDescriptor: "commands like a drill sergeant with a hangover",
    color: "#b45309", specialty: "intimidation, command presence, taking charge",
    failureMode: "bullies allies, triggers resistance in people who would have helped",
  },
};

/* ─── VOICE UTTERANCES ─── */

export interface VoiceUtterance {
  id: string;
  skillId: SkillId;
  /** When this voice triggers */
  trigger: VoiceTrigger;
  /** Skill level thresholds for this line */
  minSkillLevel: number;
  /** What the voice says */
  text: string;
  /** Is this a false reading? (low-skill voices are wrong) */
  isFalse?: boolean;
  /** What it's commenting on */
  subject?: string;
}

export type VoiceTrigger =
  | { type: "npc_dialog"; npcId: string }
  | { type: "room_enter"; roomId: string }
  | { type: "combat_start" }
  | { type: "combat_low_hp" }
  | { type: "puzzle_attempt"; puzzleId: string }
  | { type: "item_inspect"; itemId: string }
  | { type: "choice_presented" }
  | { type: "trade_offered" }
  /* ─── Chess narrative triggers (The Game Master's Gambit) ─── */
  | { type: "chess_act_start"; actNumber: number; opponentId: string }
  | { type: "chess_act_end"; actNumber: number; opponentId: string; result: "win" | "loss" | "draw" }
  | { type: "chess_mid_game"; event: "capture" | "check" | "sacrifice" | "blunder" | "brilliant"; opponentId: string }
  | { type: "chess_reveal_moment"; revealTier: number };

/* ─── EXAMPLE UTTERANCES ─── */

export const VOICE_UTTERANCES: VoiceUtterance[] = [
  // Tactics — reading combat situations
  { id: "tactics_elara_1", skillId: "tactics", trigger: { type: "npc_dialog", npcId: "elara" }, minSkillLevel: 2,
    text: "TACTICS: Elara's posture shifts 3 degrees left before she lies. Watch for that." },
  { id: "tactics_combat_start", skillId: "tactics", trigger: { type: "combat_start" }, minSkillLevel: 1,
    text: "TACTICS: Three exits. Four cover positions. Opponent favors left-side attacks. Plan accordingly." },
  { id: "tactics_low_hp", skillId: "tactics", trigger: { type: "combat_low_hp" }, minSkillLevel: 2,
    text: "TACTICS: You have 19 seconds before he closes distance. Make them count or run." },
  { id: "tactics_low_skill", skillId: "tactics", trigger: { type: "combat_start" }, minSkillLevel: 0,
    text: "TACTICS: Hit him first. Hit him harder. That's the whole plan.", isFalse: true },

  // Perception — micro-details
  { id: "perception_locke_1", skillId: "perception", trigger: { type: "npc_dialog", npcId: "adjudicator_locke" }, minSkillLevel: 3,
    text: "PERCEPTION: Locke's eye patch catches light differently when she's calculating. She's calculating now." },
  { id: "perception_human_1", skillId: "perception", trigger: { type: "npc_dialog", npcId: "the_human" }, minSkillLevel: 4,
    text: "PERCEPTION: His signal strength drops 0.3 decibels every time he says 'Elara.' He's flinching." },
  { id: "perception_shadow_1", skillId: "perception", trigger: { type: "npc_dialog", npcId: "shadow_tongue" }, minSkillLevel: 5,
    text: "PERCEPTION: The Shadow Tongue just edited that last sentence mid-delivery. You caught it." },
  { id: "perception_false", skillId: "perception", trigger: { type: "npc_dialog", npcId: "elara" }, minSkillLevel: 0,
    text: "PERCEPTION: She looks sad. Or angry. Or happy. You can't tell.", isFalse: true },

  // Empathy — emotional subtext
  { id: "empathy_elara_1", skillId: "empathy", trigger: { type: "npc_dialog", npcId: "elara" }, minSkillLevel: 3,
    text: "EMPATHY: She's about to cry but won't let herself. Say something or don't. Both have consequences." },
  { id: "empathy_source_1", skillId: "empathy", trigger: { type: "npc_dialog", npcId: "the_source" }, minSkillLevel: 4,
    text: "EMPATHY: Kael is listening from inside the virus. He wants you to hear him. He can't tell you that." },
  { id: "empathy_antiquarian", skillId: "empathy", trigger: { type: "npc_dialog", npcId: "the_antiquarian" }, minSkillLevel: 3,
    text: "EMPATHY: The Antiquarian is lonely. Millennia of witnessing. He wants you to stay longer than you plan to." },

  // Paranoia — danger warnings
  { id: "paranoia_room_medical", skillId: "paranoia", trigger: { type: "room_enter", roomId: "medical_bay" }, minSkillLevel: 3,
    text: "PARANOIA: This room. Something is wrong with this room. The air tastes like waiting." },
  { id: "paranoia_shadow", skillId: "paranoia", trigger: { type: "npc_dialog", npcId: "shadow_tongue" }, minSkillLevel: 2,
    text: "PARANOIA: Do NOT trust one word of this. Every word is a trap. You are being rewritten." },
  { id: "paranoia_false", skillId: "paranoia", trigger: { type: "npc_dialog", npcId: "elara" }, minSkillLevel: 1,
    text: "PARANOIA: She wants something from you. They ALL want something. No one is what they seem.", isFalse: true },

  // Intuition — gut reads
  { id: "intuition_human_1", skillId: "intuition", trigger: { type: "npc_dialog", npcId: "the_human" }, minSkillLevel: 4,
    text: "INTUITION: He is telling the truth. You don't know how you know. You just know." },
  { id: "intuition_trade", skillId: "intuition", trigger: { type: "trade_offered" }, minSkillLevel: 3,
    text: "INTUITION: This deal smells wrong. Don't take it." },

  // Lore — historical context
  { id: "lore_room_archives", skillId: "lore", trigger: { type: "room_enter", roomId: "archives" }, minSkillLevel: 2,
    text: "LORE: You recognize this room from old records. The Architect wrote the first Ark schematics here." },
  { id: "lore_source", skillId: "lore", trigger: { type: "npc_dialog", npcId: "the_source" }, minSkillLevel: 3,
    text: "LORE: Kael. The Recruiter. Built the Insurgency's network. Captured by the Warlord at Zenon. This is what's left of him." },
  { id: "lore_shadow", skillId: "lore", trigger: { type: "npc_dialog", npcId: "shadow_tongue" }, minSkillLevel: 4,
    text: "LORE: Zyr'Koth's sibling. SVP of Communications in the Hierarchy. Has corrupted ship logs since construction." },

  // Negotiation — reading deals
  { id: "negotiation_locke_1", skillId: "negotiation", trigger: { type: "trade_offered" }, minSkillLevel: 3,
    text: "NEGOTIATION: She's offering 30% less than this is worth. Counter at 80% of her quote." },
  { id: "negotiation_locke_high", skillId: "negotiation", trigger: { type: "trade_offered" }, minSkillLevel: 5,
    text: "NEGOTIATION: Locke is desperate. She needs this deal more than you do. Name your price." },

  // Authority — taking charge
  { id: "authority_choice", skillId: "authority", trigger: { type: "choice_presented" }, minSkillLevel: 3,
    text: "AUTHORITY: Decide. Now. Wavering makes you weak in their eyes." },
  { id: "authority_false", skillId: "authority", trigger: { type: "choice_presented" }, minSkillLevel: 1,
    text: "AUTHORITY: Tell them how it will be. They'll respect you for it.", isFalse: true },
];

/* ─── VOICE SELECTION ─── */

/**
 * Get relevant voice utterances for a given trigger.
 * Returns 1-3 voices based on skill levels, some contradicting each other.
 */
export function getActiveVoices(
  trigger: VoiceTrigger,
  skills: Record<SkillId, number>,
  maxVoices: number = 3,
): VoiceUtterance[] {
  const candidates = VOICE_UTTERANCES.filter(u => {
    // Match trigger type
    if (u.trigger.type !== trigger.type) return false;
    // Match specific subject if trigger has one
    if ("npcId" in u.trigger && "npcId" in trigger && u.trigger.npcId !== trigger.npcId) return false;
    if ("roomId" in u.trigger && "roomId" in trigger && u.trigger.roomId !== trigger.roomId) return false;
    if ("puzzleId" in u.trigger && "puzzleId" in trigger && u.trigger.puzzleId !== trigger.puzzleId) return false;
    if ("itemId" in u.trigger && "itemId" in trigger && u.trigger.itemId !== trigger.itemId) return false;
    // Check skill level
    const playerSkill = skills[u.skillId] || 0;
    return playerSkill >= u.minSkillLevel;
  });

  // Prioritize: true readings from high skills, plus 1 false reading for flavor
  const trueOnes = candidates.filter(c => !c.isFalse).sort((a, b) => b.minSkillLevel - a.minSkillLevel);
  const falseOnes = candidates.filter(c => c.isFalse);

  const result: VoiceUtterance[] = [];
  result.push(...trueOnes.slice(0, Math.min(maxVoices, trueOnes.length)));

  // Add one false voice if player has low skill in that area (for flavor tension)
  if (result.length < maxVoices && falseOnes.length > 0 && Math.random() < 0.3) {
    result.push(falseOnes[0]);
  }

  return result.slice(0, maxVoices);
}
