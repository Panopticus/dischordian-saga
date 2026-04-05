/* ═══════════════════════════════════════════════════════
   ELDEN RING + CIVILIZATION FEATURES

   1. "One More Room" breadcrumb chain loop
   2. Equipment as narrative (flashbacks, dialog unlocks)
   3. Room-specific boss mechanics
   4. Soul Stake wager system
   5. Living consequences (ship changes from choices)
   ═══════════════════════════════════════════════════════ */

/* ═══ 1. BREADCRUMB CHAIN LOOP ═══ */

/**
 * Every room completion triggers something activating in another room.
 * Pulls the player through the entire ship in a single session.
 * "One more room" — the Civilization "one more turn" adapted for exploration.
 */
export interface BreadcrumbChain {
  triggeredByRoom: string;
  triggeredByAction: string;
  activatesInRoom: string;
  elaraMessage: string;
  /** What becomes available */
  unlocks: string;
  /** Priority (higher = more important) */
  priority: number;
}

export const BREADCRUMB_CHAINS: BreadcrumbChain[] = [
  // Cryo Bay completions chain forward
  { triggeredByRoom: "cryo_bay", triggeredByAction: "first_visit", activatesInRoom: "medical_bay",
    elaraMessage: "Your revival triggered a diagnostic alert in the Medical Bay. Something in your neural patterns doesn't match the expected profile.",
    unlocks: "medical_diagnostic_quest", priority: 10 },
  { triggeredByRoom: "medical_bay", triggeredByAction: "diagnostic_complete", activatesInRoom: "bridge",
    elaraMessage: "The diagnostic results are... unexpected. I need to cross-reference with the Bridge's main database. Follow me.",
    unlocks: "bridge_database_access", priority: 10 },
  { triggeredByRoom: "bridge", triggeredByAction: "database_accessed", activatesInRoom: "archives",
    elaraMessage: "The database references a file in the Archives that I can't access. It's encrypted with a protocol I don't recognize.",
    unlocks: "archives_encrypted_file", priority: 9 },
  { triggeredByRoom: "archives", triggeredByAction: "cipher_solved", activatesInRoom: "comms_array",
    elaraMessage: "The decrypted file mentions a signal — still broadcasting. The Comms Array is picking it up right now.",
    unlocks: "comms_signal_trace", priority: 9 },
  { triggeredByRoom: "comms_array", triggeredByAction: "signal_traced", activatesInRoom: "observation_deck",
    elaraMessage: "The signal source is visible from the Observation Deck. You need to see this with your own eyes.",
    unlocks: "terminus_first_sighting", priority: 8 },
  // Game completions chain to new content
  { triggeredByRoom: "medical_bay", triggeredByAction: "fight_won", activatesInRoom: "engineering",
    elaraMessage: "Your combat data triggered an automated response in Engineering. A new system is coming online.",
    unlocks: "engineering_hacking_terminal", priority: 7 },
  { triggeredByRoom: "bridge", triggeredByAction: "chess_won", activatesInRoom: "archives",
    elaraMessage: "Your strategic pattern matches something in the Archives. The Antiquarian left a message for anyone who played like that.",
    unlocks: "antiquarian_chess_message", priority: 7 },
  { triggeredByRoom: "archives", triggeredByAction: "dischordia_won", activatesInRoom: "trade_hub",
    elaraMessage: "Your card battle victory was observed. Adjudicator Locke wants to discuss a... business proposition.",
    unlocks: "locke_first_deal", priority: 7 },
  { triggeredByRoom: "armory", triggeredByAction: "terminus_wave_5", activatesInRoom: "comms_array",
    elaraMessage: "The swarm patterns you survived — The Human says he recognizes them. He wants to talk.",
    unlocks: "human_swarm_revelation", priority: 8 },
  // NPC trust chains
  { triggeredByRoom: "bridge", triggeredByAction: "elara_trust_40", activatesInRoom: "observation_deck",
    elaraMessage: "I... want to show you something. The Observation Deck. The sunrises. Please.",
    unlocks: "elara_stargazing_personal", priority: 9 },
  { triggeredByRoom: "comms_array", triggeredByAction: "human_trust_30", activatesInRoom: "archives",
    elaraMessage: "Something changed in the substrate. The Archives terminal is displaying text I didn't authorize.",
    unlocks: "human_substrate_message", priority: 8 },
];

export function getActiveBreadcrumbs(completedActions: Set<string>, currentRoom: string): BreadcrumbChain[] {
  return BREADCRUMB_CHAINS
    .filter(b => completedActions.has(`${b.triggeredByRoom}_${b.triggeredByAction}`) && b.activatesInRoom !== currentRoom)
    .sort((a, b) => b.priority - a.priority);
}

/* ═══ 2. EQUIPMENT AS NARRATIVE ═══ */

export interface EquipmentNarrative {
  equipmentId: string;
  /** Flashback triggered when first equipped */
  flashback?: { text: string; speaker: string; mood: string };
  /** NPC dialog option unlocked */
  dialogUnlock?: { npcId: string; dialogId: string; description: string };
  /** How NPCs react when they see you wearing this */
  npcReactions?: { npcId: string; reaction: string }[];
  /** Lore text that deepens on repeated equip */
  deepeningLore?: string[];
}

export const EQUIPMENT_NARRATIVES: EquipmentNarrative[] = [
  {
    equipmentId: "architects_crown",
    flashback: { text: "The crown settles on your head and for a split second you see — a vast chamber, eleven machines standing in a circle, and a voice saying: 'You are the twelfth. The last. The only one who chose this.' Then it's gone.", speaker: "memory", mood: "haunting" },
    dialogUnlock: { npcId: "the_human", dialogId: "crown_recognition", description: "The Human recognizes the Architect's Crown" },
    npcReactions: [
      { npcId: "the_human", reaction: "The Human's signal spikes. 'Where did you find that? Take it off. Or don't. It suits you better than it suited him.'" },
      { npcId: "shadow_tongue", reaction: "The Shadow Tongue goes silent for 3 full seconds. That has never happened before." },
      { npcId: "elara", reaction: "Elara's holographic form flickers. 'That crown... I've seen it before. In a memory I don't have.'" },
    ],
    deepeningLore: [
      "The crown is lighter than it should be.",
      "You notice the crown adjusts itself when you're not looking.",
      "The crown whispers. Not words — equations. The math that built reality.",
    ],
  },
  {
    equipmentId: "iron_lions_mace",
    flashback: { text: "You grip the mace and feel a thousand battles pulse through your arm. A general's voice: 'We don't fight because we'll win. We fight because they need to see someone stand.'", speaker: "Iron Lion", mood: "defiant" },
    dialogUnlock: { npcId: "agent_zero", dialogId: "iron_lion_weapon", description: "Agent Zero recognizes Iron Lion's weapon" },
    npcReactions: [
      { npcId: "agent_zero", reaction: "Agent Zero's signal stabilizes. 'That mace. He carried it at Zenon. He carried it when everything fell. You carry it now.'" },
    ],
  },
  {
    equipmentId: "dreamers_mantle",
    flashback: { text: "The mantle wraps around you like a living thing. For one heartbeat, you see every possibility simultaneously — every version of your life, branching outward like roots of a tree that hasn't been planted yet.", speaker: "The Dreamer", mood: "overwhelming" },
    npcReactions: [
      { npcId: "the_antiquarian", reaction: "The Antiquarian removes his goggles. His eyes are wet. 'That mantle. I've been collecting endings for millennia. I never thought I'd see a beginning wearing it.'" },
    ],
  },
  {
    equipmentId: "enigmas_paradox",
    flashback: { text: "The artifact pulses with a melody you recognize but can't name. A woman's voice — the same voice The Source described in his last memory — sings a single note that exists in every timeline simultaneously.", speaker: "Malkia Ukweli", mood: "transcendent" },
    dialogUnlock: { npcId: "the_antiquarian", dialogId: "enigma_artifact", description: "The Antiquarian recognizes the Enigma's artifact" },
  },
  {
    equipmentId: "source_fragment",
    flashback: { text: "The shard touches your skin and you feel — just for an instant — a billion minds screaming in unison. Then they all go quiet. And one voice says: 'I was like you once. Full of hope. I'm sorry.'", speaker: "The Source", mood: "devastating" },
    npcReactions: [
      { npcId: "the_source", reaction: "The Source's signal changes. Softer. 'You carry a piece of me. Of what I was. Guard it. It's the last human thing I have.'" },
      { npcId: "elara", reaction: "Elara scans the fragment. Her voice shakes. 'The viral signature in this crystal matches the contamination in the cryo fluid. This IS the Thought Virus. A piece of it. Crystallized.'" },
    ],
  },
];

export function getEquipmentNarrative(equipmentId: string): EquipmentNarrative | undefined {
  return EQUIPMENT_NARRATIVES.find(n => n.equipmentId === equipmentId);
}

/* ═══ 3. ROOM-SPECIFIC BOSS MECHANICS ═══ */

export interface BossMechanic {
  roomId: string;
  bossName: string;
  /** What the room's game teaches */
  lessonTaught: string;
  /** How the boss tests that lesson */
  mechanic: string;
  /** Unique rule that only this boss has */
  uniqueRule: string;
  /** Reward for first victory */
  firstVictoryReward: { type: string; id: string; name: string };
}

export const BOSS_MECHANICS: BossMechanic[] = [
  {
    roomId: "medical_bay", bossName: "The Collector's Shade",
    lessonTaught: "Parry timing from combat simulator",
    mechanic: "Only vulnerable during the 6-frame parry window. All other attacks deal 0 damage. You MUST parry to win.",
    uniqueRule: "Boss mirrors your attack pattern — the only way through is defense.",
    firstVictoryReward: { type: "specimen", id: "soul_jar", name: "Soul Jar specimen" },
  },
  {
    roomId: "bridge", bossName: "The Architect's Echo",
    lessonTaught: "Strategic thinking from chess",
    mechanic: "Boss has 3 phases that rotate. Each phase is weak to a different attack type (light/medium/heavy). Wrong type heals the boss. You must READ the phase and switch.",
    uniqueRule: "The boss announces its next phase in chess notation. If you've played chess, you can predict it.",
    firstVictoryReward: { type: "equipment", id: "architects_crown", name: "The Architect's Crown" },
  },
  {
    roomId: "archives", bossName: "The Living Archive",
    lessonTaught: "Faction knowledge from Dischordia card battles",
    mechanic: "Boss summons minions from each Dischordia faction. You must defeat them in faction-counter order (Architect beats Insurgency, Insurgency beats New Babylon, etc.)",
    uniqueRule: "Wrong order strengthens the remaining minions. Correct order triggers chain damage.",
    firstVictoryReward: { type: "card", id: "archive_legendary", name: "The Living Archive card (legendary)" },
  },
  {
    roomId: "armory", bossName: "Terminus Vanguard",
    lessonTaught: "Tower defense wave survival from Terminus Swarm",
    mechanic: "Boss sends waves of minions WHILE you fight it directly. You must balance attacking the boss and dealing with adds. Ignoring adds = overwhelmed. Ignoring boss = timer expires.",
    uniqueRule: "Turrets from Terminus Swarm can be deployed in the fight arena. Unique hybrid mode.",
    firstVictoryReward: { type: "specimen", id: "war_hawk", name: "War Hawk specimen" },
  },
  {
    roomId: "engineering", bossName: "MAINT-7 Rogue AI",
    lessonTaught: "Hacking/pipe-connect puzzle solving",
    mechanic: "Boss has a shield that can only be disabled by solving a hacking puzzle mid-fight. Shield regenerates every 30 seconds. You must cycle between fighting and hacking.",
    uniqueRule: "The hacking difficulty increases each time. First hack is 3x3, second is 4x4, third is 5x5.",
    firstVictoryReward: { type: "specimen", id: "gear_mouse", name: "Gear Mouse specimen" },
  },
  {
    roomId: "comms_array", bossName: "The Signal Phantom",
    lessonTaught: "Pattern recognition from Signal Decryption",
    mechanic: "Boss broadcasts attack patterns as encoded words. Decode the word to predict the attack type. Correct prediction = perfect dodge. Wrong = unavoidable hit.",
    uniqueRule: "Boss speaks in cipher. Learning the cipher mid-fight is the real challenge.",
    firstVictoryReward: { type: "specimen", id: "all_seeing_eye", name: "All-Seeing Eye specimen" },
  },
  {
    roomId: "observation_deck", bossName: "The Constellation Beast",
    lessonTaught: "Star Chart pattern matching",
    mechanic: "Boss's weak points form constellation patterns on its body. Connect the weak points in the correct constellation order to deal massive damage.",
    uniqueRule: "Wrong connection order heals the boss. The patterns are from the Star Chart game.",
    firstVictoryReward: { type: "specimen", id: "prophecy_owl", name: "Prophecy Owl specimen" },
  },
];

/* ═══ 4. SOUL STAKE SYSTEM ═══ */

export interface SoulStake {
  gameMode: string;
  wagerAmount: number;
  multiplier: number;
  /** Bonus for streak wins while staked */
  streakBonus: number;
  /** Maximum wager */
  maxWager: number;
}

export const SOUL_STAKE_CONFIG = {
  /** Available in these game modes */
  availableGames: ["fight", "chess", "dischordia", "terminus_swarm", "gamemasters_arena", "signal_decryption"],
  /** Payout multipliers */
  multipliers: {
    fight: 2.0,
    chess: 2.5,
    dischordia: 2.0,
    terminus_swarm: 1.5,
    gamemasters_arena: 3.0,
    signal_decryption: 1.5,
  } as Record<string, number>,
  /** Max wager per game */
  maxWagers: {
    fight: 100,
    chess: 150,
    dischordia: 100,
    terminus_swarm: 75,
    gamemasters_arena: 200,
    signal_decryption: 50,
  } as Record<string, number>,
  /** Win streak bonus (% per consecutive staked win) */
  streakBonusPercent: 10,
  /** Max streak multiplier */
  maxStreakMultiplier: 3.0,
  /** Leaderboard: separate rankings for soul-staked victories */
  separateLeaderboard: true,
};

export function calculateStakePayout(wager: number, game: string, streakCount: number): number {
  const baseMultiplier = SOUL_STAKE_CONFIG.multipliers[game] || 2.0;
  const streakBonus = Math.min(
    SOUL_STAKE_CONFIG.maxStreakMultiplier,
    1 + (streakCount * SOUL_STAKE_CONFIG.streakBonusPercent / 100)
  );
  return Math.floor(wager * baseMultiplier * streakBonus);
}

/* ═══ 5. LIVING CONSEQUENCES ═══ */

export interface LivingConsequence {
  choiceId: string;
  /** Visual changes to rooms */
  roomChanges: { roomId: string; effect: string; description: string }[];
  /** Music changes */
  musicShift?: { from: string; to: string };
  /** NPC behavior changes (unprompted dialog) */
  npcShifts: { npcId: string; newBehavior: string }[];
  /** Ship-wide visual overlay */
  shipOverlay?: string;
}

export const LIVING_CONSEQUENCES: LivingConsequence[] = [
  {
    choiceId: "told_elara_truth",
    roomChanges: [
      { roomId: "bridge", effect: "elara_flickering", description: "Elara's hologram flickers more than usual. She's processing." },
      { roomId: "comms_array", effect: "human_signal_stronger", description: "The Human's signal is stronger. He knows you chose him." },
    ],
    npcShifts: [
      { npcId: "elara", newBehavior: "Elara's greetings are shorter. She pauses before speaking. Trust is rebuilding, but differently." },
      { npcId: "the_human", newBehavior: "The Human speaks more openly. He references 'our secret' in every conversation." },
    ],
  },
  {
    choiceId: "accepted_source_infection",
    roomChanges: [
      { roomId: "medical_bay", effect: "viral_glow", description: "The medical scanners detect the virus in you. Red warnings pulse." },
      { roomId: "cryo_bay", effect: "pods_react", description: "Cryo pods near you show elevated activity. The virus senses kin." },
      { roomId: "observation_deck", effect: "terminus_brighter", description: "Terminus is brighter through the viewport. It sees you now." },
    ],
    musicShift: { from: "Seeds of Inception", to: "The Prisoner" },
    npcShifts: [
      { npcId: "the_source", newBehavior: "The Source speaks to you as family now. Gentler. More honest. More terrifying." },
      { npcId: "elara", newBehavior: "Elara keeps scanning you. She hasn't said anything yet. But she knows." },
    ],
    shipOverlay: "subtle_red_pulse",
  },
  {
    choiceId: "shadow_tongue_bargain",
    roomChanges: [
      { roomId: "archives", effect: "text_alive", description: "All text in the Archives now subtly shifts when you're not looking directly at it." },
      { roomId: "bridge", effect: "log_corruption", description: "The captain's log shows entries you don't remember reading. Some are addressed to you." },
    ],
    npcShifts: [
      { npcId: "shadow_tongue", newBehavior: "The Shadow Tongue treats you as a colleague now. He shows you his edits. He asks your opinion." },
      { npcId: "the_antiquarian", newBehavior: "The Antiquarian is colder. He can sense the Shadow Tongue's influence on you." },
    ],
    shipOverlay: "text_shimmer",
  },
  {
    choiceId: "locke_exclusive_deal",
    roomChanges: [
      { roomId: "trade_hub", effect: "golden_luxury", description: "The Trade Hub is now decorated with New Babylon aesthetics. Locke has moved in." },
      { roomId: "armory", effect: "insurgent_tension", description: "Insurgency markings in the Armory glow hostile. Agent Zero's signal crackles with static." },
    ],
    npcShifts: [
      { npcId: "adjudicator_locke", newBehavior: "Locke calls you 'partner' now. His deals are better. His smile is wider. Both should worry you." },
      { npcId: "agent_zero", newBehavior: "Agent Zero's transmissions are shorter. Colder. 'You chose your side, Operative.'" },
    ],
  },
];

export function getActiveConsequences(narrativeFlags: Record<string, boolean>): LivingConsequence[] {
  return LIVING_CONSEQUENCES.filter(c => narrativeFlags[c.choiceId]);
}

export function getRoomConsequenceEffects(roomId: string, flags: Record<string, boolean>): { effect: string; description: string }[] {
  const effects: { effect: string; description: string }[] = [];
  for (const consequence of LIVING_CONSEQUENCES) {
    if (!flags[consequence.choiceId]) continue;
    for (const change of consequence.roomChanges) {
      if (change.roomId === roomId) effects.push(change);
    }
  }
  return effects;
}
