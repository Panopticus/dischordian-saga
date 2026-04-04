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
