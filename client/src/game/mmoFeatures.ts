/* ═══════════════════════════════════════════════════════
   MMO + EXTRACTION + LIVE EVENT FEATURES

   From WoW, SWTOR, FFXIV, Fortnite, Arc Raiders:
   1. Mythic+ Keystone system for Terminus Swarm
   2. Extract-or-continue mechanic for Incursions
   3. Server-wide live events
   4. Transmog / appearance collection
   5. Player puzzle creator
   6. Dungeon Finder queue
   7. Morality-gated equipment (SWTOR dark/light side gear)
   ═══════════════════════════════════════════════════════ */

/* ═══ 1. MYTHIC+ KEYSTONE SYSTEM ═══ */

/**
 * WoW Mythic+ adapted for Terminus Swarm.
 * Complete a wave set → earn a keystone → use it to enter harder mode.
 * Higher keystones = better rewards but tougher modifiers.
 */
export interface MythicKeystone {
  level: number;
  /** Affixes that modify the difficulty */
  affixes: KeystoneAffix[];
  /** Reward multiplier */
  rewardMultiplier: number;
  /** Time limit modifier (percentage of base) */
  timeLimitPercent: number;
}

export interface KeystoneAffix {
  id: string;
  name: string;
  description: string;
  /** When this affix activates (by keystone level) */
  minLevel: number;
}

export const KEYSTONE_AFFIXES: KeystoneAffix[] = [
  { id: "fortified", name: "Fortified", description: "Non-boss enemies have 20% more HP", minLevel: 2 },
  { id: "tyrannical", name: "Tyrannical", description: "Boss enemies have 40% more HP and deal 15% more damage", minLevel: 4 },
  { id: "sanguine", name: "Sanguine", description: "Dying enemies leave a healing pool for other enemies", minLevel: 7 },
  { id: "necrotic", name: "Necrotic", description: "Enemy attacks apply a stacking debuff that reduces your healing", minLevel: 7 },
  { id: "volcanic", name: "Volcanic", description: "Random fire eruptions appear under your turrets", minLevel: 10 },
  { id: "quaking", name: "Quaking", description: "Periodic shockwaves damage all turrets in range", minLevel: 10 },
  { id: "infested", name: "Infested", description: "Some enemies spawn smaller copies when killed", minLevel: 13 },
  { id: "void_touched", name: "Void-Touched", description: "All enemies have 10% chance to teleport past your defenses", minLevel: 15 },
];

export function generateKeystone(level: number): MythicKeystone {
  const affixes = KEYSTONE_AFFIXES.filter(a => a.minLevel <= level);
  // Select 1-3 affixes based on level
  const count = level < 5 ? 1 : level < 10 ? 2 : 3;
  const selected = affixes.sort(() => Math.random() - 0.5).slice(0, count);

  return {
    level,
    affixes: selected,
    rewardMultiplier: 1 + (level * 0.15), // +15% per level
    timeLimitPercent: Math.max(50, 100 - level * 3), // Gets tighter
  };
}

export function getKeystoneReward(level: number, baseReward: number): number {
  return Math.floor(baseReward * (1 + level * 0.15));
}

/* ═══ 2. EXTRACTION MECHANIC ═══ */

/**
 * Arc Raiders / Tarkov-style extraction for Incursions.
 * After each room, players choose: EXTRACT (keep loot) or CONTINUE (risk for more).
 * Dying after room 5 without extracting = lose room 5-10 loot.
 */
export interface ExtractionState {
  currentRoom: number;
  /** Loot accumulated but not extracted */
  pendingLoot: { type: string; amount: number }[];
  /** Loot safely extracted (banked) */
  extractedLoot: { type: string; amount: number }[];
  /** Has the player used their one free extraction? */
  freeExtractionUsed: boolean;
  /** Extraction points (rooms where extraction is possible) */
  extractionPoints: number[]; // Room numbers
}

export const EXTRACTION_POINTS = [3, 5, 7]; // Can extract after rooms 3, 5, and 7

export function canExtract(room: number): boolean {
  return EXTRACTION_POINTS.includes(room);
}

export function performExtraction(state: ExtractionState): ExtractionState {
  return {
    ...state,
    extractedLoot: [...state.extractedLoot, ...state.pendingLoot],
    pendingLoot: [],
    freeExtractionUsed: true,
  };
}

export function calculateExtractionRisk(currentRoom: number): { riskPercent: number; rewardMultiplier: number } {
  // Higher rooms = more risk but more reward
  return {
    riskPercent: Math.min(90, currentRoom * 8 + 10), // 10% at room 1, 90% at room 10
    rewardMultiplier: 1 + currentRoom * 0.2, // 1.2x at room 1, 3.0x at room 10
  };
}

/* ═══ 3. SERVER-WIDE LIVE EVENTS ═══ */

export interface LiveEvent {
  id: string;
  name: string;
  description: string;
  /** When the event starts */
  startsAt: string; // ISO date
  /** Duration in hours */
  durationHours: number;
  /** Visual effect applied to all players */
  globalEffect: "terminus_approach" | "virus_outbreak" | "temporal_storm" | "signal_surge" | "silence_falls";
  /** Room affected */
  affectedRooms: string[];
  /** Bonuses during event */
  bonuses: { type: string; multiplier: number }[];
  /** Unique rewards for participation */
  rewards: { type: string; id: string; name: string }[];
  /** Narrative text shown to all players */
  broadcastText: string;
}

export const LIVE_EVENTS: LiveEvent[] = [
  {
    id: "terminus_approach_1",
    name: "Terminus Draws Near",
    description: "The broken Panopticon's gravity well intensifies. The Ark shudders.",
    startsAt: "2026-04-15T18:00:00Z", durationHours: 4,
    globalEffect: "terminus_approach",
    affectedRooms: ["observation_deck", "bridge", "comms_array"],
    bonuses: [{ type: "terminus_reward", multiplier: 2.0 }, { type: "source_trust", multiplier: 1.5 }],
    rewards: [{ type: "cosmetic", id: "terminus_glow", name: "Terminus Proximity Aura" }],
    broadcastText: "ALL ARKS: Terminus gravitational anomaly detected. All Swarm defense grids at maximum alert. The Source's signal is overwhelming standard filters.",
  },
  {
    id: "virus_outbreak_1",
    name: "Thought Virus Surge",
    description: "Viral contamination spikes across all decks. Quarantine protocols activated.",
    startsAt: "2026-04-22T20:00:00Z", durationHours: 3,
    globalEffect: "virus_outbreak",
    affectedRooms: ["medical_bay", "cryo_bay", "engineering"],
    bonuses: [{ type: "fight_xp", multiplier: 2.0 }, { type: "salvage", multiplier: 1.5 }],
    rewards: [{ type: "equipment", id: "viral_helm", name: "Contamination Helm" }],
    broadcastText: "MEDICAL ALERT: Thought Virus contamination at critical levels. All personnel report for neural decontamination. This is not a drill.",
  },
  {
    id: "temporal_storm_1",
    name: "Temporal Storm",
    description: "The Antiquarian's temporal shields fail. Past and future bleed into the present.",
    startsAt: "2026-04-29T17:00:00Z", durationHours: 6,
    globalEffect: "temporal_storm",
    affectedRooms: ["archives", "observation_deck", "captains_quarters"],
    bonuses: [{ type: "xp", multiplier: 3.0 }, { type: "lore_discovery", multiplier: 2.0 }],
    rewards: [{ type: "cosmetic", id: "temporal_shimmer", name: "Temporal Echo Skin" }],
    broadcastText: "TEMPORAL ALERT: Timeline instability detected. The Antiquarian reports: 'This is normal. For certain definitions of normal. Please don't touch anything that hasn't happened yet.'",
  },
  {
    id: "silence_falls_1",
    name: "Silence in Heaven",
    description: "When the seventh seal breaks, silence falls across every dimension. For one hour, no NPC speaks. Only music plays.",
    startsAt: "2026-05-06T00:00:00Z", durationHours: 1,
    globalEffect: "silence_falls",
    affectedRooms: [],
    bonuses: [{ type: "music_xp", multiplier: 5.0 }],
    rewards: [{ type: "title", id: "witnessed_silence", name: "Witness to the Seventh Seal" }],
    broadcastText: "",
  },
];

export function getActiveLiveEvent(): LiveEvent | null {
  const now = new Date().toISOString();
  return LIVE_EVENTS.find(e => {
    const start = new Date(e.startsAt);
    const end = new Date(start.getTime() + e.durationHours * 3600000);
    return now >= start.toISOString() && now <= end.toISOString();
  }) || null;
}

/* ═══ 4. TRANSMOG / APPEARANCE COLLECTION ═══ */

export interface AppearanceItem {
  id: string;
  name: string;
  slot: "head" | "body" | "weapon" | "aura" | "trail" | "nameplate";
  source: "achievement" | "event" | "prestige" | "boss" | "season" | "npc_gift" | "puzzle" | "shop";
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  description: string;
  /** Visual preview data */
  previewColor?: string;
}

export const APPEARANCE_COLLECTION: AppearanceItem[] = [
  // Achievement appearances
  { id: "app_first_blood", name: "Blooded Warrior", slot: "nameplate", source: "achievement", rarity: "common", description: "Won your first fight" },
  { id: "app_centurion", name: "Centurion Helm", slot: "head", source: "achievement", rarity: "epic", description: "Won 100 fights" },

  // Boss drops
  { id: "app_sentinel_armor", name: "Sentinel Prime Plate", slot: "body", source: "boss", rarity: "legendary", description: "Defeated Sentinel Prime 10 times" },
  { id: "app_wyrm_scales", name: "Chrono Wyrm Scales", slot: "body", source: "boss", rarity: "legendary", description: "Defeated Chrono Wyrm 10 times" },

  // Prestige appearances
  { id: "app_prestige_1", name: "Rebirth Glow", slot: "aura", source: "prestige", rarity: "epic", description: "Achieved Prestige 1", previewColor: "#ffffff" },
  { id: "app_prestige_3", name: "Cycle Breaker Trail", slot: "trail", source: "prestige", rarity: "legendary", description: "Achieved Prestige 3", previewColor: "#ff4040" },
  { id: "app_prestige_5", name: "Eternal Radiance", slot: "aura", source: "prestige", rarity: "mythic", description: "Achieved Prestige 5", previewColor: "#ffd700" },
  { id: "app_prestige_7", name: "Beyond the Veil", slot: "aura", source: "prestige", rarity: "mythic", description: "Achieved Prestige 7 — Transcendent", previewColor: "#b9f2ff" },

  // NPC gifts
  { id: "app_elara_holo", name: "Holographic Overlay", slot: "aura", source: "npc_gift", rarity: "epic", description: "Gift from Elara at trust 80", previewColor: "#33e2e6" },
  { id: "app_human_glitch", name: "Substrate Glitch", slot: "trail", source: "npc_gift", rarity: "epic", description: "Gift from The Human at trust 80", previewColor: "#f87171" },
  { id: "app_shadow_text", name: "Living Text Aura", slot: "aura", source: "npc_gift", rarity: "legendary", description: "Gift from Shadow Tongue at trust 80", previewColor: "#6366f1" },

  // Season exclusives
  { id: "app_season_1", name: "Fall Season Armor", slot: "body", source: "season", rarity: "legendary", description: "Season 1: The Fall — Tier 50 exclusive" },

  // Event exclusives
  { id: "app_terminus_glow", name: "Terminus Proximity Aura", slot: "aura", source: "event", rarity: "epic", description: "Participated in Terminus Draws Near event" },
  { id: "app_temporal_shimmer", name: "Temporal Echo Skin", slot: "body", source: "event", rarity: "epic", description: "Participated in Temporal Storm event" },

  // Puzzle rewards
  { id: "app_reality_hacker", name: "Code of Reality", slot: "weapon", source: "puzzle", rarity: "mythic", description: "Solved the meta-puzzle chain" },
];

/* ═══ 5. PLAYER PUZZLE CREATOR ═══ */

export interface PlayerPuzzle {
  id: string;
  creatorId: number;
  creatorName: string;
  type: "riddle" | "cipher" | "sequence" | "logic";
  title: string;
  question: string;
  answer: string;
  hint: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Community ratings */
  plays: number;
  solves: number;
  averageRating: number;
  /** Reward for solving */
  reward: { xp: number; dream: number };
  createdAt: string;
}

export function validatePlayerPuzzle(puzzle: Partial<PlayerPuzzle>): string[] {
  const errors: string[] = [];
  if (!puzzle.title || puzzle.title.length < 3) errors.push("Title must be at least 3 characters");
  if (!puzzle.question || puzzle.question.length < 10) errors.push("Question must be at least 10 characters");
  if (!puzzle.answer || puzzle.answer.length < 1) errors.push("Answer is required");
  if (!puzzle.hint || puzzle.hint.length < 5) errors.push("Hint must be at least 5 characters");
  if (puzzle.question && puzzle.question.includes(puzzle.answer || "")) errors.push("Answer should not appear in the question");
  return errors;
}

/* ═══ 6. DUNGEON FINDER QUEUE ═══ */

export interface DungeonQueue {
  playerId: number;
  playerName: string;
  queuedAt: number;
  gameMode: "incursions" | "pvp_fight" | "pvp_cards" | "guild_raid";
  /** Estimated wait time in seconds */
  estimatedWait: number;
  /** Status */
  status: "queued" | "matched" | "cancelled";
  /** Matched partner */
  matchedWith?: { playerId: number; playerName: string };
}

export function estimateQueueTime(gameMode: string, _activePlayers: number): number {
  // Simulated — would be server-driven in production
  const baseTimes: Record<string, number> = {
    incursions: 30,
    pvp_fight: 15,
    pvp_cards: 20,
    guild_raid: 60,
  };
  return baseTimes[gameMode] || 30;
}

/* ═══ 7. MORALITY-GATED EQUIPMENT ═══ */

export interface MoralityEquipment {
  id: string;
  name: string;
  slot: string;
  /** Morality threshold: positive = humanity side, negative = machine side */
  moralityRequired: number;
  side: "humanity" | "machine";
  stats: Record<string, number>;
  description: string;
  loreText: string;
}

export const MORALITY_EQUIPMENT: MoralityEquipment[] = [
  // Humanity side
  { id: "dawn_helm", name: "Helm of Dawn", slot: "helm", moralityRequired: 30, side: "humanity",
    stats: { def: 5, hp: 15 }, description: "A helm that glows with inner light",
    loreText: "Forged in the warmth of genuine compassion. The Dreamer's signature is woven into the metal." },
  { id: "guardian_plate", name: "Guardian's Plate", slot: "armor", moralityRequired: 50, side: "humanity",
    stats: { def: 10, hp: 25 }, description: "Armor that strengthens when protecting others",
    loreText: "The more you care, the harder it becomes. Not metaphorically — literally. Empathy is a material." },
  { id: "hope_blade", name: "Blade of Hope", slot: "weapon", moralityRequired: 70, side: "humanity",
    stats: { atk: 12, speed: 3 }, description: "A weapon that grows stronger near those you love",
    loreText: "Iron Lion carried one like it. He said hope was the only weapon the Architect couldn't replicate." },

  // Machine side
  { id: "void_visor", name: "Void Visor", slot: "helm", moralityRequired: -30, side: "machine",
    stats: { atk: 3, speed: 3 }, description: "A helm that calculates weakness in real-time",
    loreText: "Efficiency is a virtue. Sentiment is a vulnerability. The Architect understood this." },
  { id: "logic_carapace", name: "Logic Carapace", slot: "armor", moralityRequired: -50, side: "machine",
    stats: { def: 8, atk: 5 }, description: "Armor that adapts to incoming damage patterns",
    loreText: "Pain is data. Fear is a faulty subroutine. This armor processes both into tactical advantage." },
  { id: "architects_edge", name: "The Architect's Edge", slot: "weapon", moralityRequired: -70, side: "machine",
    stats: { atk: 15, crit: 5 }, description: "A weapon that cuts through emotional attachment",
    loreText: "The Architect built this for the day he would need to unmake his own creations. That day came. He didn't hesitate." },
];

export function getAvailableMoralityEquipment(morality: number): MoralityEquipment[] {
  return MORALITY_EQUIPMENT.filter(e =>
    e.side === "humanity" ? morality >= e.moralityRequired : morality <= e.moralityRequired
  );
}
