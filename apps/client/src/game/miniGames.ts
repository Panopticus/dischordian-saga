// ============================================================================
// MINIGAME DEFINITIONS
// Data structures and specifications for three standalone minigames.
// These can be built out into full interactive components later.
// ============================================================================

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type DifficultyTier = "standard" | "advanced" | "expert";

export interface RewardEntry {
  item: string;
  quantity: number;
  dropChance: number; // 0-1 probability
}

export interface RewardStructure {
  baseXP: number;
  timedBonus: boolean;       // extra reward for finishing quickly
  perfectBonus: boolean;     // extra reward for no mistakes
  rewards: RewardEntry[];
}

export interface DifficultyConfig {
  tier: DifficultyTier;
  description: string;
  parameters: Record<string, number | string | boolean>;
}

export interface MiniGameDefinition {
  id: string;
  name: string;
  room: string;              // room where the minigame terminal lives
  description: string;
  loreContext: string;        // in-universe justification for the minigame
  rewardStructure: RewardStructure;
  difficulties: DifficultyConfig[];
}

// ---------------------------------------------------------------------------
// 1. Hacking Minigame — Pipe-connect puzzle (Engineering)
// ---------------------------------------------------------------------------

export const HACKING_MINIGAME: MiniGameDefinition = {
  id: "minigame-hacking",
  name: "Power Grid Hack",
  room: "engineering",
  description:
    "Connect power nodes by rotating pipe segments on a grid. " +
    "Energy must flow unbroken from the source node to every target node " +
    "before the timer runs out. Misaligned segments leak plasma and reduce " +
    "remaining time.",
  loreContext:
    "The Ark's power distribution network was designed with manual overrides " +
    "in case the AI routing layer failed. Engineering crew drilled on these " +
    "pipe-connect boards daily. Now, with half the ship dark, the overrides " +
    "are the only way to reroute power to critical subsystems.",
  rewardStructure: {
    baseXP: 120,
    timedBonus: true,
    perfectBonus: true,
    rewards: [
      { item: "plasma-conduit",     quantity: 2, dropChance: 1.0 },
      { item: "alloy-fragment",     quantity: 1, dropChance: 0.6 },
      { item: "nano-solder",        quantity: 1, dropChance: 0.3 },
      { item: "rare-power-cell",    quantity: 1, dropChance: 0.08 },
    ],
  },
  difficulties: [
    {
      tier: "standard",
      description: "4x4 grid, single target node, 60-second timer.",
      parameters: {
        gridSize: 4,
        targetNodes: 1,
        timeLimitSeconds: 60,
        plasmaLeakPenalty: 3,   // seconds lost per leak
        rotateAnimationMs: 150,
      },
    },
    {
      tier: "advanced",
      description: "6x6 grid, two target nodes, 50-second timer. Locked segments.",
      parameters: {
        gridSize: 6,
        targetNodes: 2,
        timeLimitSeconds: 50,
        plasmaLeakPenalty: 4,
        lockedSegments: 3,       // immovable pipes
        rotateAnimationMs: 120,
      },
    },
    {
      tier: "expert",
      description: "8x8 grid, three targets, 45-second timer. Locked segments + power surges.",
      parameters: {
        gridSize: 8,
        targetNodes: 3,
        timeLimitSeconds: 45,
        plasmaLeakPenalty: 5,
        lockedSegments: 6,
        powerSurgeInterval: 10,  // every N seconds a surge randomizes one segment
        rotateAnimationMs: 100,
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. Signal Decryption — Wordle-style lore word game (Comms Array)
// ---------------------------------------------------------------------------

export const SIGNAL_DECRYPTION_MINIGAME: MiniGameDefinition = {
  id: "minigame-signal-decryption",
  name: "Signal Decryption",
  room: "comms-array",
  description:
    "A Wordle-style word puzzle using five-letter words drawn from the Saga's " +
    "lore and vocabulary. You have 6 guesses to identify the daily signal word. " +
    "Each guess reveals which letters are correct, misplaced, or absent.",
  loreContext:
    "Fragmented transmissions reach the Ark every cycle. The comms AI strips " +
    "each signal down to a single key word that must be reconstructed before " +
    "the message can be decoded. Crew members compete to crack the daily signal " +
    "first — it has become something between a ritual and a sport.",
  rewardStructure: {
    baseXP: 80,
    timedBonus: false,
    perfectBonus: true,        // solving in 1-2 guesses
    rewards: [
      { item: "signal-fragment",    quantity: 1, dropChance: 1.0 },
      { item: "cipher-key",         quantity: 1, dropChance: 0.25 },
      { item: "encrypted-log",      quantity: 1, dropChance: 0.10 },
    ],
  },
  difficulties: [
    {
      tier: "standard",
      description: "Common lore words, 6 guesses, letter-state hints shown.",
      parameters: {
        wordLength: 5,
        maxGuesses: 6,
        wordPool: "common",     // ~200 high-frequency lore words
        showLetterStates: true,
        dailyRotation: true,
      },
    },
    {
      tier: "advanced",
      description: "Uncommon lore words, 5 guesses, partial hints only.",
      parameters: {
        wordLength: 5,
        maxGuesses: 5,
        wordPool: "uncommon",   // ~400 deeper-lore words
        showLetterStates: true,
        hideAbsentLetters: true, // keyboard won't grey-out absent letters
        dailyRotation: true,
      },
    },
    {
      tier: "expert",
      description: "Rare lore words, 4 guesses, no keyboard hints.",
      parameters: {
        wordLength: 5,
        maxGuesses: 4,
        wordPool: "rare",       // ~150 obscure terms
        showLetterStates: false,
        dailyRotation: true,
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. Star Chart — Constellation pattern-matching (Observation Deck)
// ---------------------------------------------------------------------------

export const STAR_CHART_MINIGAME: MiniGameDefinition = {
  id: "minigame-star-chart",
  name: "Star Chart",
  room: "observation-deck",
  description:
    "A pattern-matching constellation puzzle. A field of stars is displayed and " +
    "you must connect them in the correct order to reveal a constellation from " +
    "the Saga. Incorrect connections dim the star field, making subsequent " +
    "attempts harder.",
  loreContext:
    "Before the Ark had navigational AI, pilots memorized star patterns to " +
    "orient themselves in deep space. The observation deck still has the old " +
    "manual chart station. Tracing constellations correctly calibrates the " +
    "long-range sensors and occasionally reveals hidden signal sources.",
  rewardStructure: {
    baseXP: 100,
    timedBonus: true,
    perfectBonus: true,        // no incorrect connections
    rewards: [
      { item: "dream-token",        quantity: 1, dropChance: 1.0 },
      { item: "star-map-fragment",  quantity: 1, dropChance: 0.5 },
      { item: "celestial-shard",    quantity: 1, dropChance: 0.12 },
    ],
  },
  difficulties: [
    {
      tier: "standard",
      description: "5 stars, simple pattern, guide dots shown.",
      parameters: {
        starCount: 5,
        distractorStars: 3,     // extra stars not part of the pattern
        showGuideDots: true,
        maxErrors: 3,
        dimPerError: 0.15,      // opacity reduction per mistake
        constellationPool: "common",
      },
    },
    {
      tier: "advanced",
      description: "8 stars, moderate pattern, no guide dots, more distractors.",
      parameters: {
        starCount: 8,
        distractorStars: 8,
        showGuideDots: false,
        maxErrors: 2,
        dimPerError: 0.20,
        constellationPool: "mythic",
      },
    },
    {
      tier: "expert",
      description: "12 stars, complex pattern, heavy distractors, star drift.",
      parameters: {
        starCount: 12,
        distractorStars: 15,
        showGuideDots: false,
        maxErrors: 1,
        dimPerError: 0.30,
        starDrift: true,         // stars slowly move, requiring timing
        driftSpeed: 0.4,         // pixels per frame
        constellationPool: "ancient",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Master registry
// ---------------------------------------------------------------------------

export const ALL_MINIGAMES: MiniGameDefinition[] = [
  HACKING_MINIGAME,
  SIGNAL_DECRYPTION_MINIGAME,
  STAR_CHART_MINIGAME,
];

/** Look up a minigame by its room. */
export function getMinigameForRoom(roomId: string): MiniGameDefinition | undefined {
  return ALL_MINIGAMES.find((g) => g.room === roomId);
}

/** Look up a minigame by id. */
export function getMinigameById(id: string): MiniGameDefinition | undefined {
  return ALL_MINIGAMES.find((g) => g.id === id);
}

/** Get the difficulty config for a specific tier. */
export function getDifficulty(
  game: MiniGameDefinition,
  tier: DifficultyTier,
): DifficultyConfig | undefined {
  return game.difficulties.find((d) => d.tier === tier);
}

// ---------------------------------------------------------------------------
// DAILY EPOCH ROTATION
// Each day of the week themes ALL minigames to a historical epoch from the
// Dischordian timeline (17,033 years, 10 epochs). The epoch affects:
//   - Signal Decryption: word lists drawn from that epoch's vocabulary
//   - Hacking Puzzle: pipe configurations themed to that era's technology
//   - Star Chart: constellation patterns from that epoch's sky maps
// ---------------------------------------------------------------------------

export interface DailyEpochEntry {
  /** 0 = Monday, 6 = Sunday */
  dayIndex: number;
  dayName: string;
  epochId: number;
  epochName: string;
  themeDescription: string;
  /** Signal Decryption word pool for this epoch */
  sampleWordList: string[];
  /** Hacking puzzle visual theme */
  hackingTheme: string;
  /** Star Chart constellation set */
  constellationSet: string;
}

export const DAILY_EPOCH_ROTATION: DailyEpochEntry[] = [
  {
    dayIndex: 0,
    dayName: "Monday",
    epochId: 1,
    epochName: "Genesis",
    themeDescription: "The origin of all things. Before the Arks, before the empires, before the Hierarchy — there was only the first breath of civilization. Monday's challenges draw from the vocabulary of creation: foundational terms, elemental forces, and the raw language of beginnings.",
    sampleWordList: ["SPARK", "FORGE", "BIRTH", "PRIME", "CODED", "NEXUS", "STEEL", "NERVE", "PULSE", "LIGHT", "HELIX", "MERGE", "CRAFT", "VITAL", "ARISE"],
    hackingTheme: "primitive_circuits",
    constellationSet: "genesis_sky",
  },
  {
    dayIndex: 1,
    dayName: "Tuesday",
    epochId: 2,
    epochName: "Early Empire",
    themeDescription: "The first great governments rise. Bureaucracy takes form, surveillance infrastructure spreads, and the seeds of the Panopticon are planted. Tuesday's challenges use the language of statecraft, control, and the cold architecture of power.",
    sampleWordList: ["WATCH", "ORDER", "CROWN", "EDICT", "TOWER", "GUARD", "LOYAL", "BOUND", "CHAIN", "RANKS", "JUDGE", "REIGN", "TITHE", "WALLS", "VAULT"],
    hackingTheme: "imperial_conduits",
    constellationSet: "empire_sky",
  },
  {
    dayIndex: 2,
    dayName: "Wednesday",
    epochId: 3,
    epochName: "Golden Age",
    themeDescription: "The pinnacle of civilization. Art, science, and philosophy flourish. The Academies train the brightest minds. Wednesday's challenges shimmer with the vocabulary of enlightenment, discovery, and the hubris of a culture that believed it had conquered darkness.",
    sampleWordList: ["DREAM", "GLORY", "LEARN", "THINK", "SHINE", "NOBLE", "QUEST", "TRUTH", "GRACE", "HONOR", "SAGE", "MIRTH", "BLOOM", "IVORY", "LYRIC"],
    hackingTheme: "golden_filigree_pipes",
    constellationSet: "golden_age_sky",
  },
  {
    dayIndex: 3,
    dayName: "Thursday",
    epochId: 4,
    epochName: "Expansion",
    themeDescription: "The Inception Arks launch. Humanity scatters across the stars. Warlords carve out territories and the galaxy becomes a frontier. Thursday's challenges carry the weight of ambition, distance, and the language of conquest.",
    sampleWordList: ["FLEET", "ORBIT", "CLAIM", "SCOUT", "DRIFT", "REACH", "CARGO", "ROUTE", "STARK", "FRONT", "SIEGE", "TROOP", "YIELD", "MARCH", "EXPAT"],
    hackingTheme: "ark_engineering",
    constellationSet: "expansion_sky",
  },
  {
    dayIndex: 4,
    dayName: "Friday",
    epochId: 5,
    epochName: "Insurgency Rising",
    themeDescription: "The rebellion ignites. Iron Lion raises the banner. Agent Zero broadcasts from hidden frequencies. The Hierarchy's grip tightens but cracks appear. Friday's challenges burn with the vocabulary of resistance, sabotage, and desperate hope.",
    sampleWordList: ["REBEL", "FIGHT", "SMOKE", "CRACK", "FREED", "RALLY", "COVERT", "BLAZE", "SNEAK", "RISEN", "DEFY", "TORCH", "BROKE", "AGENT", "GHOST"],
    hackingTheme: "insurgent_jury_rigs",
    constellationSet: "insurgency_sky",
  },
  {
    dayIndex: 5,
    dayName: "Saturday",
    epochId: 6,
    epochName: "Fall Era",
    themeDescription: "Reality fractures. The Thought Virus spreads. Terminus emerges. Everything the civilization built begins to unravel. Saturday's challenges are steeped in the vocabulary of entropy, collapse, and the terrible beauty of endings.",
    sampleWordList: ["VIRUS", "CRACK", "DECAY", "RUINS", "SHADE", "DRIFT", "HAUNT", "WRECK", "TOXIC", "VOID", "SHARD", "GRIEF", "DREAD", "ABYSS", "BREAK"],
    hackingTheme: "corrupted_systems",
    constellationSet: "fall_era_sky",
  },
  {
    dayIndex: 6,
    dayName: "Sunday",
    epochId: 7,
    epochName: "Age of Potentials",
    themeDescription: "The current age. You are the Potentials — the last generation trained to survive what's coming. Sunday's challenges use the vocabulary of possibility, transformation, and the weight of being the ones who decide what comes next.",
    sampleWordList: ["AWAKE", "SHIFT", "MORPH", "TRIAL", "SWORN", "PHASE", "BRIDGE", "TRUST", "MERGE", "ADAPT", "SCION", "NEXUS", "FORGE", "RISEN", "BONDS"],
    hackingTheme: "potential_hybrid_tech",
    constellationSet: "potentials_sky",
  },
];

/**
 * Returns today's epoch rotation entry.
 * Uses ISO day-of-week (Monday = 1 ... Sunday = 7), mapped to dayIndex 0-6.
 */
export function getDailyEpochRotation(now: Date = new Date()): DailyEpochEntry {
  // getDay() returns 0 (Sunday) through 6 (Saturday)
  // Convert to Monday=0 ... Sunday=6
  const jsDay = now.getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
  return DAILY_EPOCH_ROTATION[dayIndex];
}

/**
 * Returns the epoch-themed word list for Signal Decryption today.
 */
export function getDailyWordList(now: Date = new Date()): string[] {
  return getDailyEpochRotation(now).sampleWordList;
}

/**
 * Returns the epoch-themed hacking visual for today.
 */
export function getDailyHackingTheme(now: Date = new Date()): string {
  return getDailyEpochRotation(now).hackingTheme;
}

/**
 * Returns the epoch-themed constellation set for today.
 */
export function getDailyConstellationSet(now: Date = new Date()): string {
  return getDailyEpochRotation(now).constellationSet;
}
