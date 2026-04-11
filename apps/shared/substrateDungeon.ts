/* ===================================================================
   THE SUBSTRATE — Solo Roguelike Dungeon

   A solo roguelike descent through the layers of The Human's prison.
   10 floors. Each floor is a random game mode challenge. Each floor
   is themed to a historical epoch — the deeper you go, the older
   the memories.

   "The deeper you descend, the older the memories.
    Floor 1 is the Age of Potentials. Floor 10 is Genesis itself."

   Death ends the run. You keep a percentage of loot based on depth.
   The Substrate is where The Human was imprisoned for 17,033 years.
   Every layer is a memory, a test, and a warning.

   Dark Souls meets Hades meets Slay the Spire.
   =================================================================== */

/* ─── CHALLENGE TYPES ─── */

export type SubstrateChallengeType =
  | "fight"
  | "chess_puzzle"
  | "card_battle"
  | "hacking_puzzle"
  | "signal_decryption"
  | "story_puzzle"
  | "terminus_wave"
  | "quiz";

/* ─── FLOOR DEFINITION ─── */

export interface SubstrateFloor {
  /** Floor depth (1 = shallowest / most recent epoch, 10 = deepest / oldest) */
  depth: number;
  /** The type of challenge on this floor */
  challengeType: SubstrateChallengeType;
  /** Difficulty scaling: multiplier applied to challenge parameters (1.0 = base) */
  difficultyScale: number;
  /** Reward tier: determines loot quality (1 = common, 5 = legendary) */
  rewardTier: number;
  /** Epoch theme — deeper floors draw from older epochs */
  epochId: number;
  epochName: string;
  /** Epoch-specific lore shown when entering the floor */
  floorLore: string;
  /** Visual theme / environment description */
  environment: string;
  /** Special floor modifier (optional hazard or boon) */
  modifier?: SubstrateFloorModifier;
}

export interface SubstrateFloorModifier {
  name: string;
  description: string;
  effect: "buff" | "debuff" | "neutral";
  /** Stat changes applied to the player while on this floor */
  statChange?: Partial<Record<"attack" | "defense" | "speed" | "hp" | "xp_mult" | "loot_mult", number>>;
}

/* ─── RUN STATE ─── */

export interface SubstrateRun {
  runId: string;
  /** Current floor (0 = not started, 1-10 = active) */
  currentFloor: number;
  /** All 10 floors generated for this run */
  floors: SubstrateFloor[];
  /** Is the run still active? */
  alive: boolean;
  /** Loot accumulated so far */
  lootCollected: SubstrateLoot[];
  /** Total XP earned this run */
  xpEarned: number;
  /** Timestamp run started */
  startedAt: number;
  /** Timestamp run ended (death or completion) */
  endedAt: number | null;
  /** Floor where the player died (null if completed or still active) */
  deathFloor: number | null;
}

export interface SubstrateLoot {
  itemId: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  /** Which floor this dropped on */
  floorDepth: number;
  type: "equipment" | "material" | "currency" | "card" | "cosmetic" | "lore_fragment";
  quantity: number;
}

/* ─── EPOCH FLOOR MAPPING ─── */

/**
 * The 10 epochs of the Dischordian timeline, mapped from shallowest
 * (most recent) to deepest (most ancient). The Substrate is a memory
 * prison — descending is traveling backward through 17,033 years.
 */
const SUBSTRATE_EPOCH_MAP: { epochId: number; epochName: string; lore: string; environment: string }[] = [
  {
    epochId: 10,
    epochName: "Age of Potentials",
    lore: "The present day. You recognize these walls — they look like the Ark. Familiar technology, familiar threats. The Substrate starts with what you know... before stripping it away.",
    environment: "Sleek Ark corridors, holographic displays, humming power conduits. Everything feels almost normal.",
  },
  {
    epochId: 9,
    epochName: "Fall of Reality",
    lore: "Reality fractures around you. The walls phase in and out of existence. Time stutters. This is the memory of the moment everything broke — the Thought Virus's first contact, the day Terminus went rogue.",
    environment: "Shattered geometry, flickering reality overlays, void-light bleeding through cracks in space.",
  },
  {
    epochId: 8,
    epochName: "Age of Revelation",
    lore: "The Hierarchy's secrets are carved into these walls. Shadow Tongue's edits are visible everywhere — crossed-out truths, rewritten histories. The deeper truth is always uglier than the surface lie.",
    environment: "Obsidian halls lined with redacted documents. Floating glyphs of censored data. Inky darkness that moves.",
  },
  {
    epochId: 7,
    epochName: "Insurgency Rising",
    lore: "Rebel graffiti covers every surface. Iron Lion's speeches echo down the corridors. The scent of smoke and defiance hangs in the recycled air. Every step deeper is a step closer to the heart of the rebellion.",
    environment: "War-scarred bunkers, makeshift barricades, rebel banners and propaganda posters. Flickering emergency lighting.",
  },
  {
    epochId: 6,
    epochName: "The Expansion",
    lore: "The corridors expand into vast shipyards and launch bays. Scale models of Inception Arks drift in zero-gravity displays. This was the age of ambition — humanity reaching for the stars with open hands and clenched fists.",
    environment: "Cavernous construction docks, half-built Arks, star maps covering every wall. The hum of engines being born.",
  },
  {
    epochId: 5,
    epochName: "The Warlord's Reign",
    lore: "Military precision replaces hope. Every surface is armor-plated. Command screens show troop movements across a hundred worlds. The Warlord's shadow falls across this entire floor — the age of might over right.",
    environment: "Fortress-like command center, war tables, weapons racks, iron and blood-red lighting.",
  },
  {
    epochId: 4,
    epochName: "Golden Age",
    lore: "Beauty and knowledge fill these halls. Library archives stretch endlessly. Academy students' thesis projects line the walls — brilliant solutions to problems that no longer exist. The Golden Age didn't know it was golden until it was over.",
    environment: "Marble-like surfaces, warm golden lighting, endless bookshelves, holographic art galleries.",
  },
  {
    epochId: 3,
    epochName: "Age of Prophecy",
    lore: "Oracle flames burn in alcoves. Prophetic writings cover every wall in languages that haven't been spoken in millennia. The seers saw everything that would come — and no one listened.",
    environment: "Temple-like chambers, incense smoke, glowing runes, the sound of whispered futures.",
  },
  {
    epochId: 2,
    epochName: "Early Empire",
    lore: "The architecture is primitive but monumental. Surveillance systems built from analog technology line the corridors — the Panopticon in its infancy, already watching, already recording.",
    environment: "Massive stone-and-metal construction, analog monitoring stations, the oppressive weight of early governance.",
  },
  {
    epochId: 1,
    epochName: "Genesis",
    lore: "The deepest layer. The memory of the first moment. Raw code scrolls across surfaces that are barely physical. The Human's prison begins here — at the root of all things. This is where civilization first drew breath, and where The Human was first chained. To reach this floor is to touch the foundation of 17,033 years of history.",
    environment: "Abstract space — raw data streams, proto-reality, the hum of creation itself. Walls are equations. The floor is a theorem. Light is information.",
  },
];

/* ─── FLOOR TEMPLATE ─── */

/**
 * Template for generating Substrate floors. Each entry defines the
 * base parameters for a floor at a given depth. The actual challenge
 * type is randomized per run.
 */
export const SUBSTRATE_FLOORS: Omit<SubstrateFloor, "challengeType" | "modifier">[] =
  SUBSTRATE_EPOCH_MAP.map((epoch, index) => ({
    depth: index + 1,
    difficultyScale: 1.0 + index * 0.15,
    rewardTier: Math.min(5, 1 + Math.floor(index / 2)),
    epochId: epoch.epochId,
    epochName: epoch.epochName,
    floorLore: epoch.lore,
    environment: epoch.environment,
  }));

/* ─── FLOOR MODIFIERS ─── */

const FLOOR_MODIFIERS: SubstrateFloorModifier[] = [
  {
    name: "Memory Surge",
    description: "The Human's memories flood this floor. +25% XP gained.",
    effect: "buff",
    statChange: { xp_mult: 1.25 },
  },
  {
    name: "Temporal Erosion",
    description: "Time is unstable here. -15% speed, but +20% loot quality.",
    effect: "neutral",
    statChange: { speed: -0.15, loot_mult: 1.2 },
  },
  {
    name: "Viral Echo",
    description: "The Thought Virus has seeped into this memory. -10% max HP.",
    effect: "debuff",
    statChange: { hp: -0.1 },
  },
  {
    name: "Ancestral Strength",
    description: "The courage of past civilizations empowers you. +15% attack.",
    effect: "buff",
    statChange: { attack: 0.15 },
  },
  {
    name: "Hierarchy's Weight",
    description: "The oppressive legacy of control bears down. -10% attack, +15% defense.",
    effect: "neutral",
    statChange: { attack: -0.1, defense: 0.15 },
  },
  {
    name: "Prophet's Foresight",
    description: "You can see one move ahead. Challenge difficulty reduced by 10%.",
    effect: "buff",
    statChange: { defense: 0.1 },
  },
  {
    name: "Rebel's Fire",
    description: "The spirit of the Insurgency burns in you. +20% attack, -10% defense.",
    effect: "neutral",
    statChange: { attack: 0.2, defense: -0.1 },
  },
  {
    name: "Reality Bleed",
    description: "Reality is thin here. All stats fluctuate randomly by +/-10%.",
    effect: "debuff",
    statChange: {},
  },
  {
    name: "Genesis Spark",
    description: "The first light of creation illuminates everything. +30% XP, +20% loot.",
    effect: "buff",
    statChange: { xp_mult: 1.3, loot_mult: 1.2 },
  },
  {
    name: "The Human's Gaze",
    description: "The Human watches from beyond the walls. Something about their attention makes you stronger. +10% to all stats.",
    effect: "buff",
    statChange: { attack: 0.1, defense: 0.1, speed: 0.1, hp: 0.1 },
  },
];

/* ─── CHALLENGE TYPE POOLS ─── */

const ALL_CHALLENGE_TYPES: SubstrateChallengeType[] = [
  "fight",
  "chess_puzzle",
  "card_battle",
  "hacking_puzzle",
  "signal_decryption",
  "story_puzzle",
  "terminus_wave",
  "quiz",
];

/* ─── RUN GENERATION ─── */

/**
 * Generates a fresh Substrate run. Each of the 10 floors gets a
 * randomized challenge type and an optional floor modifier.
 * The challenge type distribution ensures variety — no two adjacent
 * floors share the same challenge, and all types appear at least once.
 */
export function generateSubstrateRun(seed?: number): SubstrateRun {
  const rng = createSeededRng(seed ?? Date.now());
  const floors: SubstrateFloor[] = [];

  // Ensure all challenge types appear at least once
  const guaranteed = shuffleArray([...ALL_CHALLENGE_TYPES], rng);
  const remaining: SubstrateChallengeType[] = [];
  for (let i = guaranteed.length; i < 10; i++) {
    remaining.push(ALL_CHALLENGE_TYPES[Math.floor(rng() * ALL_CHALLENGE_TYPES.length)]);
  }
  const challengePool = [...guaranteed, ...remaining];

  // Ensure no adjacent floors share the same challenge type
  const assigned = resolveAdjacency(challengePool, ALL_CHALLENGE_TYPES, rng);

  for (let i = 0; i < 10; i++) {
    const template = SUBSTRATE_FLOORS[i];
    const hasModifier = rng() < 0.6; // 60% chance of a floor modifier
    const modifier = hasModifier
      ? FLOOR_MODIFIERS[Math.floor(rng() * FLOOR_MODIFIERS.length)]
      : undefined;

    floors.push({
      ...template,
      challengeType: assigned[i],
      modifier,
    });
  }

  return {
    runId: `substrate-${Date.now()}-${Math.floor(rng() * 10000)}`,
    currentFloor: 0,
    floors,
    alive: true,
    lootCollected: [],
    xpEarned: 0,
    startedAt: Date.now(),
    endedAt: null,
    deathFloor: null,
  };
}

/* ─── DEATH & LOOT RETENTION ─── */

/**
 * Calculates the percentage of loot kept on death.
 * Deeper deaths = more loot retained (you earned it by getting that far).
 *
 *   Floor 1:  10%
 *   Floor 2:  20%
 *   Floor 3:  30%
 *   ...
 *   Floor 9:  90%
 *   Floor 10: 100% (completed the run)
 */
export function getLootRetentionPercent(deathFloor: number): number {
  return Math.min(100, deathFloor * 10);
}

/**
 * Calculates retained loot after death.
 */
export function calculateRetainedLoot(run: SubstrateRun): SubstrateLoot[] {
  if (!run.deathFloor && run.alive) return run.lootCollected; // still alive
  const retentionPercent = getLootRetentionPercent(run.deathFloor ?? 0);
  const retentionRatio = retentionPercent / 100;

  return run.lootCollected.map(loot => ({
    ...loot,
    quantity: Math.max(1, Math.floor(loot.quantity * retentionRatio)),
  }));
}

/* ─── COMPLETION REWARDS ─── */

export interface SubstrateCompletionReward {
  dreamTokens: number;
  xpBonus: number;
  title: string | null;
  cosmeticId: string | null;
  loreUnlock: string;
}

/**
 * Rewards for completing (or partially completing) a Substrate run.
 */
export function getCompletionRewards(finalFloor: number, completed: boolean): SubstrateCompletionReward {
  const baseReward = finalFloor * 50;
  return {
    dreamTokens: completed ? baseReward * 3 : baseReward,
    xpBonus: completed ? 2000 : finalFloor * 100,
    title: completed ? "Substrate Delver" : null,
    cosmeticId: completed ? "substrate_aura" : null,
    loreUnlock: completed
      ? "the_human_prison_complete"
      : `substrate_memory_floor_${finalFloor}`,
  };
}

/* ─── FLOOR NARRATIVE ─── */

/**
 * Returns the narrative text for entering a floor.
 */
export function getFloorNarrative(floor: SubstrateFloor): string {
  const depthDescription = floor.depth <= 3
    ? "The walls still feel familiar."
    : floor.depth <= 6
    ? "The architecture grows alien. These memories are ancient."
    : floor.depth <= 9
    ? "You are deeper than anyone has gone in living memory. The weight of millennia presses down."
    : "Floor 10. Genesis. The root of everything. The Human's prison begins and ends here.";

  const modifierNote = floor.modifier
    ? `\n\n[${floor.modifier.name}] — ${floor.modifier.description}`
    : "";

  return `FLOOR ${floor.depth} — ${floor.epochName.toUpperCase()}\n\n${floor.floorLore}\n\n${depthDescription}${modifierNote}`;
}

/* ─── UTILITY ─── */

/** Simple seeded RNG (mulberry32) for deterministic run generation. */
function createSeededRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shuffle an array in-place using the provided RNG. */
function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Resolves adjacency conflicts: ensures no two consecutive entries
 * in the array share the same value.
 */
function resolveAdjacency<T>(arr: T[], pool: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
    if (result[i] === result[i - 1]) {
      const alternatives = pool.filter(t => t !== result[i - 1] && t !== result[i + 1]);
      if (alternatives.length > 0) {
        result[i] = alternatives[Math.floor(rng() * alternatives.length)];
      }
    }
  }
  return result;
}
