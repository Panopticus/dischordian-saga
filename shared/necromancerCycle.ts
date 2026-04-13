/* ═══════════════════════════════════════════════════════
   THE NECROMANCER CYCLE — Cyclical Community Event

   This is NOT a one-time event. The Necromancer returns,
   the community banishes him, he waits, he returns again.

   THE CYCLE:
   1. Dormant → Resurrection Energy builds (community deaths)
   2. Manifesting → Players can declare allegiance (Resurrectionist or Banishment Coalition)
   3. Returned → Universe-wide event phase begins
   4. Banishment Arc → Community must complete quest chain to banish him
   5. Banished → Necromancer gone, energy resets, resets to dormant
   6. Cycle repeats

   TIMING: Meters are INTENTIONALLY hidden. This allows the event
   to trigger roughly once per other epoch/season based on
   community activity. Active servers trigger sooner. Quiet ones later.

   FACTION ALLEGIANCE:
   - Banishment Coalition: Light side, standard faction bonuses
   - Resurrectionist Path: Dark magic, death world access, undead powers
   Both are valid paths. Both have unique rewards.
   ═══════════════════════════════════════════════════════ */

/* ─── CYCLE STATE ─── */

export type CyclePhase =
  | "dormant"              // Between events
  | "stirring"             // Energy accumulating, subtle hints
  | "awakening"            // Elara's discovery arc
  | "manifesting"          // Allegiance declarations open
  | "returned"             // Necromancer active, raid phase
  | "banishment_active"    // Community completing banishment arc
  | "banished";            // Cooldown, cycle resets

export interface CycleState {
  /** Current phase */
  phase: CyclePhase;
  /** When phase started */
  phaseStartedAt: string;
  /** Current cycle number (1st return, 2nd return, etc.) */
  cycleNumber: number;
  /** Resurrection Energy (hidden from players — "The Necromancer's strength grows...") */
  resurrectionEnergy: number;
  /** Community Life Energy (hidden — "Light gathers in the galaxy...") */
  communityLifeEnergy: number;
  /** Balance: when life energy overcomes resurrection, banishment triggers */
  energyBalance: "resurrection_ascending" | "balanced" | "life_ascending";
  /** History of past cycles */
  history: CycleRecord[];
}

export interface CycleRecord {
  cycleNumber: number;
  returnedAt: string;
  banishedAt: string | null;
  durationDays: number;
  resurrectionistCount: number;
  banishmentCoalitionCount: number;
  /** Who won the cycle */
  outcome: "banished" | "eternal_dominion" | "ongoing";
  /** Highest death world count */
  peakDeathWorlds: number;
}

/* ─── HIDDEN METER DISPLAY ─── */

/** Players don't see numbers. They see poetic descriptors. */
export function getResurrectionDescription(energy: number): string {
  if (energy < 50_000) return "A whisper in the void.";
  if (energy < 150_000) return "Something is stirring.";
  if (energy < 300_000) return "The Matrix of Dreams grows restless.";
  if (energy < 500_000) return "Bones remember. Memories stir.";
  if (energy < 700_000) return "The Necromancer's laugh echoes across sectors.";
  if (energy < 900_000) return "Reality thins. Castles rise where they should not.";
  if (energy < 1_000_000) return "He is almost here. The galaxy trembles.";
  return "HE HAS RETURNED.";
}

export function getLifeEnergyDescription(energy: number): string {
  if (energy < 50_000) return "The galaxy sleeps.";
  if (energy < 200_000) return "Scattered lights in the dark.";
  if (energy < 400_000) return "A chorus gathers.";
  if (energy < 600_000) return "The living remember their purpose.";
  if (energy < 800_000) return "Life answers death's call.";
  if (energy < 1_000_000) return "The light grows bright. The dead feel it.";
  return "BANISHMENT ENERGY ACHIEVED.";
}

export function getBalanceDescription(balance: CycleState["energyBalance"], phase: CyclePhase): string {
  if (phase === "dormant") return "The universe is at rest.";
  if (balance === "resurrection_ascending") return "Death grows stronger than life. The Necromancer gains power.";
  if (balance === "life_ascending") return "Life gathers against death. The coalition rises.";
  return "The energies are balanced. For now.";
}

/* ─── FACTION ALLEGIANCE ─── */

export type EventFaction = "banishment_coalition" | "resurrectionist" | "undeclared";

export interface FactionAllegiance {
  playerId: number;
  faction: EventFaction;
  declaredAt: string;
  contributionPoints: number;
  /** Rank within the faction */
  rank: number;
  /** Unique currency for this faction */
  factionCurrency: number;
  /** Unlocked abilities */
  unlockedAbilities: string[];
}

/* ─── BANISHMENT COALITION (Light Path) ─── */

export interface CoalitionRank {
  rank: number;
  name: string;
  pointsRequired: number;
  bonuses: { stat: string; value: number }[];
  abilities: string[];
}

export const COALITION_RANKS: CoalitionRank[] = [
  { rank: 1, name: "Light Bearer", pointsRequired: 0,
    bonuses: [{ stat: "life_energy_contribution", value: 10 }],
    abilities: ["Craft Blessed Wards (defensive consumables)"] },
  { rank: 2, name: "Banishment Scout", pointsRequired: 100,
    bonuses: [{ stat: "xp_gain", value: 5 }, { stat: "life_energy_contribution", value: 15 }],
    abilities: ["Reveal cultist locations in your sector"] },
  { rank: 3, name: "Coalition Knight", pointsRequired: 500,
    bonuses: [{ stat: "fight_damage_vs_undead", value: 25 }, { stat: "life_energy_contribution", value: 20 }],
    abilities: ["Purify Death Worlds (with guild)", "Blessed Weapon craft"] },
  { rank: 4, name: "Light Paladin", pointsRequired: 1500,
    bonuses: [{ stat: "defense", value: 10 }, { stat: "heal_power", value: 20 }],
    abilities: ["Resurrect fallen party members once per raid", "Summon angelic familiar"] },
  { rank: 5, name: "Banishment Champion", pointsRequired: 5000,
    bonuses: [{ stat: "all_combat_stats", value: 15 }],
    abilities: ["Lead banishment raids", "Holy Nova (AoE damage vs undead)"] },
  { rank: 6, name: "Coalition Archon", pointsRequired: 15000,
    bonuses: [{ stat: "all_stats", value: 20 }],
    abilities: ["Command full banishment army", "Reality-anchor aura (resist Necromancer powers)"] },
];

/* ─── RESURRECTIONIST CULT (Dark Path) ─── */

export interface ResurrectionistRank {
  rank: number;
  name: string;
  pointsRequired: number;
  bonuses: { stat: string; value: number }[];
  darkMagic: string[];
}

export const RESURRECTIONIST_RANKS: ResurrectionistRank[] = [
  { rank: 1, name: "Death Initiate", pointsRequired: 0,
    bonuses: [{ stat: "death_reward_bonus", value: 10 }],
    darkMagic: ["Harvest Soul Fragments from kills"] },
  { rank: 2, name: "Bone Acolyte", pointsRequired: 100,
    bonuses: [{ stat: "death_reward_bonus", value: 20 }, { stat: "necromancer_favor", value: 5 }],
    darkMagic: ["Commune with undead (extra intel)", "Death world teleport"] },
  { rank: 3, name: "Shadow Magus", pointsRequired: 500,
    bonuses: [{ stat: "dark_magic_power", value: 25 }, { stat: "hp_regen", value: 10 }],
    darkMagic: ["Drain life from enemies", "Summon skeleton minion"] },
  { rank: 4, name: "Death Priest", pointsRequired: 1500,
    bonuses: [{ stat: "all_combat_stats", value: 10 }, { stat: "immortality_charges", value: 1 }],
    darkMagic: ["Revive yourself once per day (free)", "Mark enemies for the Necromancer"] },
  { rank: 5, name: "Undead Sorcerer", pointsRequired: 5000,
    bonuses: [{ stat: "all_stats", value: 15 }, { stat: "immortality_charges", value: 3 }],
    darkMagic: ["Permanent undead companion", "Raise dead allies as minions"] },
  { rank: 6, name: "Thazulok's Chosen", pointsRequired: 15000,
    bonuses: [{ stat: "all_stats", value: 25 }, { stat: "immortality_charges", value: 5 }],
    darkMagic: ["Eternal life (cannot truly die)", "Wield the Necromancer's personal magic"] },
];

/* ─── COMMUNITY QUEST CHAIN (Banishment) ─── */

export interface CommunityQuest {
  id: string;
  chainStage: number;
  name: string;
  description: string;
  /** Which game mode contributes */
  gameMode: string;
  /** What community action fulfills it */
  objective: CommunityObjective;
  /** Life Energy contributed when goal met */
  lifeEnergyReward: number;
}

export interface CommunityObjective {
  type: "craft" | "defeat_boss" | "guild_raid" | "reclaim_world" | "sacrifice_resource" | "complete_runs";
  target: number;
  item?: string;
}

export const BANISHMENT_QUEST_CHAIN: CommunityQuest[] = [
  {
    id: "craft_wards",
    chainStage: 1,
    name: "Forge the Wards",
    description: "The community must craft Blessed Wards to push back the Necromancer's influence.",
    gameMode: "engineering",
    objective: { type: "craft", target: 10000, item: "blessed_ward" },
    lifeEnergyReward: 50_000,
  },
  {
    id: "defeat_risen",
    chainStage: 2,
    name: "Cull the Risen",
    description: "Defeat the Necromancer's risen armies across the galaxy.",
    gameMode: "terminus_swarm",
    objective: { type: "defeat_boss", target: 50000 },
    lifeEnergyReward: 75_000,
  },
  {
    id: "reclaim_first_world",
    chainStage: 3,
    name: "Reclaim Mortis Prime",
    description: "Guilds must coordinate to retake the first Death World.",
    gameMode: "guild_raid",
    objective: { type: "reclaim_world", target: 1, item: "mortis_prime" },
    lifeEnergyReward: 100_000,
  },
  {
    id: "sacrifice_dream",
    chainStage: 4,
    name: "Dream Offering",
    description: "The galaxy sacrifices Dream tokens to empower the banishment ritual.",
    gameMode: "all",
    objective: { type: "sacrifice_resource", target: 10_000_000, item: "dream" },
    lifeEnergyReward: 100_000,
  },
  {
    id: "necromancer_boss_raid",
    chainStage: 5,
    name: "The Necromancer Falls",
    description: "Community must defeat the Necromancer in boss fights a collective number of times.",
    gameMode: "coalition_raid",
    objective: { type: "defeat_boss", target: 100, item: "necromancer" },
    lifeEnergyReward: 150_000,
  },
  {
    id: "reclaim_all_worlds",
    chainStage: 6,
    name: "Purge the Necropolises",
    description: "Reclaim all Death Worlds from Resurrectionist control.",
    gameMode: "trade_empire",
    objective: { type: "reclaim_world", target: 3 },
    lifeEnergyReward: 200_000,
  },
  {
    id: "final_ritual",
    chainStage: 7,
    name: "The Banishment Ritual",
    description: "Complete the final community event: all factions must participate.",
    gameMode: "all",
    objective: { type: "complete_runs", target: 1_000_000 },
    lifeEnergyReward: 325_000,
  },
];

/* ─── RESURRECTIONIST QUEST CHAIN (Dark Path) ─── */

export const RESURRECTIONIST_QUEST_CHAIN: CommunityQuest[] = [
  {
    id: "harvest_souls",
    chainStage: 1,
    name: "Harvest the Living",
    description: "Cultists harvest souls from combat victories.",
    gameMode: "fight",
    objective: { type: "defeat_boss", target: 50000 },
    lifeEnergyReward: -50_000, // Negative = feeds Resurrection Energy instead
  },
  {
    id: "corrupt_worlds",
    chainStage: 2,
    name: "Corrupt the Sectors",
    description: "Spread Necromancer influence across more worlds.",
    gameMode: "trade_empire",
    objective: { type: "reclaim_world", target: 5 },
    lifeEnergyReward: -75_000,
  },
  {
    id: "death_crafting",
    chainStage: 3,
    name: "Forge Necromantic Weapons",
    description: "Craft dark artifacts that strengthen the Necromancer.",
    gameMode: "engineering",
    objective: { type: "craft", target: 5000, item: "necrotic_idol" },
    lifeEnergyReward: -100_000,
  },
  {
    id: "defend_necromancer",
    chainStage: 4,
    name: "Defend the Dark Lord",
    description: "Resurrectionists defend the Necromancer from coalition raids.",
    gameMode: "coalition_raid",
    objective: { type: "defeat_boss", target: 25 },
    lifeEnergyReward: -150_000,
  },
  {
    id: "eternal_dominion",
    chainStage: 5,
    name: "Eternal Dominion",
    description: "Cement the Necromancer's permanent rule. (Would delay banishment indefinitely if completed first)",
    gameMode: "all",
    objective: { type: "complete_runs", target: 500_000 },
    lifeEnergyReward: -500_000,
  },
];

/* ─── REWARDS BY FACTION + OUTCOME ─── */

export interface CycleReward {
  faction: EventFaction;
  outcome: "banished" | "eternal_dominion";
  participationTier: "minimal" | "contributor" | "champion" | "legend";
  rewards: string[];
}

export const CYCLE_REWARDS: CycleReward[] = [
  // Coalition wins (banishment successful)
  { faction: "banishment_coalition", outcome: "banished", participationTier: "minimal",
    rewards: ["Banishment Veteran title", "500 Dream", "Blessed Ward cosmetic"] },
  { faction: "banishment_coalition", outcome: "banished", participationTier: "contributor",
    rewards: ["Coalition Defender title", "2000 Dream", "Blessed Weapon skin", "Angelic Familiar pet"] },
  { faction: "banishment_coalition", outcome: "banished", participationTier: "champion",
    rewards: ["Coalition Champion title (animated)", "10000 Dream", "Full Banishment Paladin armor set", "Light Dragon pet"] },
  { faction: "banishment_coalition", outcome: "banished", participationTier: "legend",
    rewards: ["Slayer of Thazulok (legendary title)", "50000 Dream", "Necromancer's Crown (unique cosmetic)", "Exclusive Legendary card", "Server-wide announcement"] },

  // Resurrectionists lose (but still rewarded for participation)
  { faction: "resurrectionist", outcome: "banished", participationTier: "minimal",
    rewards: ["Survived the Purge title", "200 Dream", "Dark Whispers emote"] },
  { faction: "resurrectionist", outcome: "banished", participationTier: "contributor",
    rewards: ["Cult Survivor title", "1000 Dream", "Skeletal weapon skin", "Access to dark market (exclusive)"] },
  { faction: "resurrectionist", outcome: "banished", participationTier: "champion",
    rewards: ["Death Priest title", "5000 Dream", "Full Cultist armor set (dark variant)", "Exclusive necromancy spell card"] },
  { faction: "resurrectionist", outcome: "banished", participationTier: "legend",
    rewards: ["Thazulok's Chosen (legendary title)", "25000 Dream", "Undead Sorcerer cosmetic (full animation)", "3 Legendary Necromancy cards", "Permanent dark magic buff for next cycle"] },

  // Resurrectionists win (eternal dominion achieved — rare outcome)
  { faction: "resurrectionist", outcome: "eternal_dominion", participationTier: "legend",
    rewards: ["Eternal Lord title", "100000 Dream", "Permanent Necromancer's Lieutenant status", "Server-wide announcement", "Next cycle is Delayed by 2x duration"] },

  { faction: "banishment_coalition", outcome: "eternal_dominion", participationTier: "minimal",
    rewards: ["Fallen Coalition title (defeat flavor)", "100 Dream", "Resurgence buff for next cycle"] },
];

/* ─── HOW THE CYCLE RESETS ─── */

export interface CycleReset {
  /** How long the banished state lasts before energy starts rebuilding */
  dormantDurationDays: number;
  /** Does energy reset to zero or partial? */
  energyResetPercent: number;
  /** Life energy carried over to next cycle */
  lifeEnergyCarryover: number;
}

export const CYCLE_RESET_CONFIG: CycleReset = {
  dormantDurationDays: 30, // 1 month of peace
  energyResetPercent: 20, // Starts at 20% full (Necromancer's wounds never fully heal)
  lifeEnergyCarryover: 10, // 10% of community's final life energy carries over as head start
};

/* ─── TIMING CALIBRATION (Hidden from players) ─── */

/**
 * The meters are calibrated based on server activity.
 * Active servers trigger cycle faster. Quiet ones slower.
 * Target: cycle completes roughly every other epoch/season (~2-3 months).
 */
export const TIMING_TARGETS = {
  /** Target average days for full cycle */
  targetCycleDays: 90,
  /** Minimum days between cycles */
  minCycleDays: 45,
  /** Maximum before admin intervention */
  maxCycleDays: 180,
  /** Soft calibration: adjust rates if cycle is running too fast/slow */
  autoCalibrate: true,
};

/* ─── DEFAULT STATE ─── */

export const DEFAULT_CYCLE_STATE: CycleState = {
  phase: "dormant",
  phaseStartedAt: new Date().toISOString(),
  cycleNumber: 1,
  resurrectionEnergy: 0,
  communityLifeEnergy: 0,
  energyBalance: "balanced",
  history: [],
};

/* ─── HELPER FUNCTIONS ─── */

export function calculateBalance(resurrection: number, life: number): CycleState["energyBalance"] {
  const diff = resurrection - life;
  if (diff > 100_000) return "resurrection_ascending";
  if (diff < -100_000) return "life_ascending";
  return "balanced";
}

export function shouldTriggerBanishment(state: CycleState): boolean {
  return state.phase === "returned" && state.communityLifeEnergy >= 1_000_000;
}

export function shouldTriggerReturn(state: CycleState): boolean {
  return state.phase === "dormant" && state.resurrectionEnergy >= 1_000_000;
}

export function getCoalitionRank(points: number): CoalitionRank {
  let current = COALITION_RANKS[0];
  for (const rank of COALITION_RANKS) {
    if (points >= rank.pointsRequired) current = rank;
  }
  return current;
}

export function getResurrectionistRank(points: number): ResurrectionistRank {
  let current = RESURRECTIONIST_RANKS[0];
  for (const rank of RESURRECTIONIST_RANKS) {
    if (points >= rank.pointsRequired) current = rank;
  }
  return current;
}
