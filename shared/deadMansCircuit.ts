/**
 * DEAD MAN'S CIRCUIT — Shared Data Definitions
 * ══════════════════════════════════════════════════════════
 * A seasonal kart racing game set on bone-tracks built from
 * the remains of dead clones. Narrated by Nilmorg, the
 * bone-obsessed announcer. Runs bi-monthly in 28-day seasons,
 * with escalating phases that make the track deadlier.
 *
 * Players race as disposable clones — losing a clone is expected.
 * CP (Circuit Points) accumulate toward seasonal rewards.
 */

/* ═══════════════════════════════════════════════════════
   PALETTE — Visual identity for the circuit
   ═══════════════════════════════════════════════════════ */

export const CIRCUIT_PALETTE = {
  TRENCH_DARK:     "#1c1917",
  NILMORG_ORANGE:  "#f97316",
  HIER_CRIMSON:    "#7f1d1d",
  DEMAGI_BLUE:     "#3b82f6",
  VICTORY_GOLD:    "#fbbf24",
  QUARCHON_VIOLET: "#8b5cf6",
  DANGER_RED:      "#ef4444",
  BONE_WHITE:      "#f5f0e8",
  VOID_BLACK:      "#0f172a",
} as const;

/* ═══════════════════════════════════════════════════════
   SEASON — 28-day bi-monthly racing season
   ═══════════════════════════════════════════════════════ */

export type SeasonPhase = 1 | 2 | 3;

export interface CircuitSeason {
  id: number;
  seasonNumber: number;
  name: string;
  phase: SeasonPhase;
  startsAt: Date;
  endsAt: Date;
  status: "upcoming" | "active" | "ended";
  trackPreset: string;
  /** Bone obstacles accumulated from player deaths */
  boneObstacles: { x: number; z: number }[];
  totalRaces: number;
  totalDeaths: number;
}

/** Phase schedule within a 28-day season */
export const PHASE_SCHEDULE = {
  1: { startDay: 1,  endDay: 10, label: "Phase 1 — The Warm-Up" },
  2: { startDay: 11, endDay: 20, label: "Phase 2 — The Escalation" },
  3: { startDay: 21, endDay: 28, label: "Phase 3 — The Dead Run" },
} as const;

/** Bi-monthly schedule: seasons start on the 1st of Jan, Mar, May, Jul, Sep, Nov */
export const SEASON_MONTHS = [0, 2, 4, 6, 8, 10] as const; // 0-indexed months

/* ═══════════════════════════════════════════════════════
   CLONE — Disposable racer unit
   ═══════════════════════════════════════════════════════ */

/** Greek suffix options for clone designations */
const GREEK_SUFFIXES = [
  "ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON",
  "ZETA", "ETA", "THETA", "IOTA", "KAPPA",
  "LAMBDA", "MU", "NU", "XI", "OMICRON",
  "PI", "RHO", "SIGMA", "TAU", "UPSILON",
  "PHI", "CHI", "PSI", "OMEGA",
] as const;

export interface CloneStats {
  /** Format: WIRED-XXXX-GREEK */
  designation: string;
  /** Neural synchronization quality (60-100) — affects handling */
  neural_sync: number;
  /** Physical shell integrity (always starts at 100) */
  physical_integrity: number;
  /** Top speed modifier as percentage (80-120) */
  velocity_ceiling_pct: number;
  /** Surface grip as percentage (40-80) — how well clone grips track */
  surface_grip_pct: number;
  /** Self-preservation instinct (10-40) — lower = more reckless AI */
  survival_instinct: number;
  /** Chassis color derived from player species */
  chassisColor: string;
}

/**
 * Generate a random clone designation in format WIRED-XXXX-GREEK
 * e.g. WIRED-7392-SIGMA
 */
export function generateCloneDesignation(): string {
  const num = String(Math.floor(1000 + Math.random() * 9000));
  const greek = GREEK_SUFFIXES[Math.floor(Math.random() * GREEK_SUFFIXES.length)];
  return `WIRED-${num}-${greek}`;
}

/* ═══════════════════════════════════════════════════════
   ABILITIES — 6 circuit-specific combat abilities
   ═══════════════════════════════════════════════════════ */

export interface CircuitAbility {
  key: string;
  name: string;
  description: string;
  lore: string;
  cooldownMs: number;
  rangeMeters: number;
  /** Which class benefits most from this ability */
  classAffinity: string;
}

export const CIRCUIT_ABILITIES: CircuitAbility[] = [
  {
    key: "emp_pulse",
    name: "EMP Pulse",
    description: "Disables all nearby rival clones for 1.5 seconds, cutting their neural sync.",
    lore: "Derived from Panopticon suppression tech. The pulse fries cheap clone wiring — which is all clone wiring.",
    cooldownMs: 12000,
    rangeMeters: 15,
    classAffinity: "engineer",
  },
  {
    key: "thought_spike",
    name: "Thought Spike",
    description: "Injects a hallucination into the nearest rival's neural feed, causing erratic steering for 2 seconds.",
    lore: "Oracle-class wetware excels at projecting false realities. On the circuit, a false corner is as deadly as a real wall.",
    cooldownMs: 10000,
    rangeMeters: 25,
    classAffinity: "oracle",
  },
  {
    key: "neural_flood",
    name: "Neural Flood",
    description: "Overloads the clone's own neural sync to boost grip by 30% for 3 seconds. Risk of integrity loss.",
    lore: "The clone screams during activation. Nilmorg loves it.",
    cooldownMs: 15000,
    rangeMeters: 0,
    classAffinity: "soldier",
  },
  {
    key: "overclock",
    name: "Overclock",
    description: "Pushes velocity ceiling to 140% for 2.5 seconds. Clone integrity drops 10 points.",
    lore: "Every engineer knows: removing the safety limiters is a feature, not a bug. The clone disagrees. Briefly.",
    cooldownMs: 18000,
    rangeMeters: 0,
    classAffinity: "engineer",
  },
  {
    key: "phase_step",
    name: "Phase Step",
    description: "Clone phases through the next obstacle or wall. 0.8 second window. If mistimed, instant death.",
    lore: "Quarchon dimensional theory applied to disposable bodies. The clone briefly exists in two places. Then one. Hopefully the right one.",
    cooldownMs: 20000,
    rangeMeters: 0,
    classAffinity: "spy",
  },
  {
    key: "dead_weight",
    name: "Dead Weight",
    description: "Drops the clone's previous corpse as a bone obstacle on the track. Persists for 10 seconds.",
    lore: "Nilmorg's favorite ability. 'Waste not, want not,' he says, as another clone trips over its predecessor.",
    cooldownMs: 25000,
    rangeMeters: 0,
    classAffinity: "assassin",
  },
];

/* ═══════════════════════════════════════════════════════
   TRACK TILES — Building blocks for circuit layouts
   ═══════════════════════════════════════════════════════ */

export const TRACK_TILE_TYPES = [
  "STRAIGHT",
  "CURVE_LIGHT",
  "CURVE_HARD",
  "BONE_LANE",
  "DEAD_STRAIGHT",
  "PHASE_WALL",
  "GRAVITY_INV",
  "SPEED_CONDUIT",
  "SPLICE_JAM",
] as const;

export type TrackTileType = typeof TRACK_TILE_TYPES[number];

export interface TrackTile {
  type: TrackTileType;
  x: number;
  z: number;
  rotation: number;
  /** Phase at which this tile becomes active */
  activePhase: SeasonPhase;
}

/* ═══════════════════════════════════════════════════════
   TRACK PRESETS — Named circuit configurations
   ═══════════════════════════════════════════════════════ */

export interface TrackPreset {
  key: string;
  name: string;
  description: string;
  laps: number;
  tileSequence: TrackTileType[];
  /** Minimum phase required to race this track */
  minPhase: SeasonPhase;
  difficulty: "standard" | "hard" | "extreme";
}

export const TRACK_PRESETS: TrackPreset[] = [
  {
    key: "the_first_circuit",
    name: "The First Circuit",
    description: "The default track. Three laps around Nilmorg's original bone-ring. Deceptively simple — the bones accumulate.",
    laps: 3,
    tileSequence: [
      "STRAIGHT", "CURVE_LIGHT", "STRAIGHT", "SPEED_CONDUIT",
      "CURVE_LIGHT", "STRAIGHT", "BONE_LANE", "CURVE_HARD",
      "STRAIGHT", "CURVE_LIGHT", "DEAD_STRAIGHT", "CURVE_LIGHT",
    ],
    minPhase: 1,
    difficulty: "standard",
  },
  {
    key: "bone_corridor",
    name: "Bone Corridor",
    description: "A narrow gauntlet of bone-lanes and phase walls. Grip matters more than speed. Many clones die here.",
    laps: 3,
    tileSequence: [
      "BONE_LANE", "BONE_LANE", "CURVE_HARD", "PHASE_WALL",
      "DEAD_STRAIGHT", "SPLICE_JAM", "BONE_LANE", "CURVE_HARD",
      "GRAVITY_INV", "BONE_LANE", "PHASE_WALL", "SPEED_CONDUIT",
      "BONE_LANE", "CURVE_HARD", "DEAD_STRAIGHT", "BONE_LANE",
    ],
    minPhase: 1,
    difficulty: "hard",
  },
  {
    key: "the_dead_run",
    name: "The Dead Run",
    description: "Phase 3 only. Every tile is lethal. Gravity inverts mid-corner. The bone-lane never ends. Nilmorg's masterpiece.",
    laps: 5,
    tileSequence: [
      "DEAD_STRAIGHT", "GRAVITY_INV", "BONE_LANE", "PHASE_WALL",
      "SPLICE_JAM", "CURVE_HARD", "GRAVITY_INV", "BONE_LANE",
      "DEAD_STRAIGHT", "PHASE_WALL", "SPEED_CONDUIT", "SPLICE_JAM",
      "GRAVITY_INV", "CURVE_HARD", "BONE_LANE", "DEAD_STRAIGHT",
      "PHASE_WALL", "BONE_LANE", "SPLICE_JAM", "GRAVITY_INV",
    ],
    minPhase: 3,
    difficulty: "extreme",
  },
];

/* ═══════════════════════════════════════════════════════
   CP (Circuit Points) — Scoring system
   ═══════════════════════════════════════════════════════ */

/** Base CP by finishing position */
export const BASE_CP_BY_POSITION: Record<number, number> = {
  1: 100,
  2: 70,
  3: 50,
  4: 35,
  5: 25,
  6: 18,
  7: 12,
  8: 8,
};

/** Phase multipliers — later phases are worth dramatically more */
export const PHASE_MULTIPLIERS: Record<SeasonPhase, number> = {
  1: 1,
  2: 2.5,
  3: 10,
};

/** Bonus CP amounts */
export const CP_BONUSES = {
  SURVIVAL: 20,       // Clone survived the race
  PERSONAL_BEST: 15,  // New personal best lap time
  KILL: 10,           // Per rival clone eliminated
} as const;

export interface CPBreakdown {
  base: number;
  phaseMultiplier: number;
  survivalBonus: number;
  personalBestBonus: number;
  killBonus: number;
  total: number;
}

/**
 * Calculate CP earned for a race result.
 * @param position - Finish position (1-8)
 * @param phase - Current season phase (1, 2, or 3)
 * @param survived - Whether the clone survived
 * @param personalBest - Whether the player set a personal best lap
 * @param kills - Number of rival clones eliminated
 */
export function calculateCP(
  position: number,
  phase: SeasonPhase,
  survived: boolean,
  personalBest: boolean,
  kills: number,
): CPBreakdown {
  const base = BASE_CP_BY_POSITION[position] ?? 5;
  const phaseMultiplier = PHASE_MULTIPLIERS[phase] ?? 1;

  const survivalBonus = survived ? CP_BONUSES.SURVIVAL : 0;
  const personalBestBonus = personalBest ? CP_BONUSES.PERSONAL_BEST : 0;
  const killBonus = kills * CP_BONUSES.KILL;

  const subtotal = base + survivalBonus + personalBestBonus + killBonus;
  const total = Math.floor(subtotal * phaseMultiplier);

  return {
    base,
    phaseMultiplier,
    survivalBonus,
    personalBestBonus,
    killBonus,
    total,
  };
}

/* ═══════════════════════════════════════════════════════
   SEASON SCHEDULE UTILITIES
   ═══════════════════════════════════════════════════════ */

export interface SeasonSchedule {
  seasonStart: Date;
  seasonEnd: Date;
  phase1Start: Date;
  phase1End: Date;
  phase2Start: Date;
  phase2End: Date;
  phase3Start: Date;
  phase3End: Date;
}

/**
 * Get the full phase schedule for a season starting on the given date.
 */
export function getSeasonSchedule(startDate: Date): SeasonSchedule {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const addDays = (d: Date, days: number): Date => {
    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
  };

  const endOfDay = (d: Date): Date => {
    const result = new Date(d);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  return {
    seasonStart: start,
    seasonEnd: endOfDay(addDays(start, 27)),
    phase1Start: start,
    phase1End: endOfDay(addDays(start, 9)),    // days 1-10
    phase2Start: addDays(start, 10),
    phase2End: endOfDay(addDays(start, 19)),   // days 11-20
    phase3Start: addDays(start, 20),
    phase3End: endOfDay(addDays(start, 27)),   // days 21-28
  };
}

/**
 * Check if the current date falls within a bi-monthly season window.
 * Seasons run on odd months (Jan, Mar, May, Jul, Sep, Nov) starting the 1st.
 */
export function isCircuitOpen(now?: Date): boolean {
  const date = now ?? new Date();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Check if we're in a season month
  if (!SEASON_MONTHS.includes(month as typeof SEASON_MONTHS[number])) {
    return false;
  }

  // Season runs days 1-28 of the month
  return day >= 1 && day <= 28;
}

/**
 * Get the current phase based on the day within the season.
 */
export function getCurrentPhase(seasonStart: Date, now?: Date): SeasonPhase {
  const date = now ?? new Date();
  const diffMs = date.getTime() - seasonStart.getTime();
  const dayInSeason = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;

  if (dayInSeason <= 10) return 1;
  if (dayInSeason <= 20) return 2;
  return 3;
}

/* ═══════════════════════════════════════════════════════
   NILMORG COMMENTARY — The bone-obsessed announcer
   ═══════════════════════════════════════════════════════ */

export type NilmorgCategory =
  | "circuit_begins"
  | "player_leading"
  | "player_losing"
  | "clone_died"
  | "survived_danger"
  | "player_died"
  | "player_wins"
  | "final_lap"
  | "bone_lane_grows";

export const NILMORG_COMMENTARY: Record<NilmorgCategory, string[]> = {
  circuit_begins: [
    "Welcome, welcome, WELCOME to the Dead Man's Circuit! I am Nilmorg, your host, your judge, your undertaker!",
    "The bones are fresh, the clones are twitching, and the track is HUNGRY. Let us begin!",
    "Another season, another harvest. The Circuit opens its jaw. Drive well — or don't. I get paid either way.",
  ],
  player_leading: [
    "Look at you! First place! Enjoy it while your clone still has legs!",
    "The leader surges ahead! But the bone-lane remembers those who get cocky...",
    "Top of the pack! Nilmorg tips his hat. Don't let it go to your clone's expendable head.",
  ],
  player_losing: [
    "Last place? Oh, delicious. The bone-lane always needs fresh material.",
    "Falling behind! Your clone weeps synthetic tears. Nilmorg weeps with laughter.",
    "The back of the pack is where legends die. And by legends, I mean your clone.",
  ],
  clone_died: [
    "SPLENDID! Another clone returns to the bone-lane! The track grows HUNGRIER!",
    "Oh, that crunch! That beautiful crunch! Rest in pieces, little clone!",
    "Dead! DEAD! The clone is DEAD! But don't worry — you have more where that came from. You DO have more, right?",
    "Nilmorg sheds a single tear of pure joy. Another one for the bone pile.",
  ],
  survived_danger: [
    "They SURVIVED? Impossible! The bone-lane demands a recount!",
    "Still alive?! Nilmorg is... impressed. And slightly disappointed.",
    "Through the phase wall and BREATHING! Someone check if that clone is defective — it's not dying!",
  ],
  player_died: [
    "The player's clone has expired! All that training, all that hope — reduced to track decoration!",
    "And THEY'RE OUT! Nilmorg offers his sincere condolences. Just kidding. NEXT!",
    "Race over! For YOU, at least. The bones welcome another addition.",
  ],
  player_wins: [
    "VICTORY! Against all odds, against all bones, against Nilmorg's personal betting pool — YOU WIN!",
    "The champion crosses the line! Nilmorg grudgingly applauds! Your clone earned its retirement. Until next race.",
    "WINNER! The Dead Man's Circuit has a survivor! Write that on your clone's tombstone — oh wait, it LIVED!",
  ],
  final_lap: [
    "FINAL LAP! The bone-lane WRITHES! The track knows this is where heroes are made — and unmade!",
    "Last lap, racers! Nilmorg can TASTE the desperation! Push those clones to their limits!",
    "The final stretch! Every bone on this track is VIBRATING! Give me a finish worth dying for!",
  ],
  bone_lane_grows: [
    "The bone-lane EXPANDS! More dead clones, more obstacles! The track feeds on failure!",
    "ANOTHER bone added to the circuit! The track grows! The track HUNGERS! The track is PLEASED!",
    "The bones accumulate! Every death makes the next race harder! Nilmorg calls this 'organic difficulty scaling.'",
  ],
};

/**
 * Get a random Nilmorg commentary line for the given category.
 */
export function getNilmorgLine(category: NilmorgCategory): string {
  const lines = NILMORG_COMMENTARY[category];
  return lines[Math.floor(Math.random() * lines.length)];
}

/* ═══════════════════════════════════════════════════════
   SPECIES CHASSIS MAPPING
   ═══════════════════════════════════════════════════════ */

export const SPECIES_CHASSIS_COLOR: Record<string, string> = {
  demagi:    CIRCUIT_PALETTE.DEMAGI_BLUE,
  quarchon:  CIRCUIT_PALETTE.QUARCHON_VIOLET,
  neyon:     CIRCUIT_PALETTE.NILMORG_ORANGE,
};

/** Class → suggested ability mapping */
export const CLASS_ABILITY_SUGGESTIONS: Record<string, string[]> = {
  engineer:  ["emp_pulse", "overclock"],
  oracle:    ["thought_spike", "neural_flood"],
  assassin:  ["dead_weight", "phase_step"],
  soldier:   ["neural_flood", "overclock"],
  spy:       ["phase_step", "thought_spike"],
};

/* ═══════════════════════════════════════════════════════
   LEADERBOARD
   ═══════════════════════════════════════════════════════ */

export interface CircuitLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalCp: number;
  racesCompleted: number;
  bestPosition: number;
  bestLapMs: number | null;
  totalKills: number;
  clonesSurvived: number;
  clonesLost: number;
}

/* ═══════════════════════════════════════════════════════
   SEASON REWARD TIERS
   ═══════════════════════════════════════════════════════ */

export interface SeasonRewardTier {
  tier: string;
  name: string;
  minCp: number;
  rewards: { type: string; key: string; label: string; amount?: number }[];
  color: string;
}

export const SEASON_REWARD_TIERS: SeasonRewardTier[] = [
  {
    tier: "bone",
    name: "Bone Rank",
    minCp: 0,
    rewards: [
      { type: "cosmetic", key: "circuit_badge_bone", label: "Bone Circuit Badge" },
      { type: "xp", key: "circuit_xp_bone", label: "250 XP", amount: 250 },
    ],
    color: CIRCUIT_PALETTE.BONE_WHITE,
  },
  {
    tier: "wire",
    name: "Wire Rank",
    minCp: 500,
    rewards: [
      { type: "cosmetic", key: "circuit_badge_wire", label: "Wire Circuit Badge" },
      { type: "xp", key: "circuit_xp_wire", label: "1000 XP", amount: 1000 },
      { type: "material", key: "neural_salvage", label: "Neural Salvage x5", amount: 5 },
    ],
    color: CIRCUIT_PALETTE.NILMORG_ORANGE,
  },
  {
    tier: "chrome",
    name: "Chrome Rank",
    minCp: 2000,
    rewards: [
      { type: "cosmetic", key: "circuit_badge_chrome", label: "Chrome Circuit Badge" },
      { type: "cosmetic", key: "clone_skin_chrome", label: "Chrome Clone Skin" },
      { type: "xp", key: "circuit_xp_chrome", label: "3000 XP", amount: 3000 },
      { type: "material", key: "neural_salvage", label: "Neural Salvage x15", amount: 15 },
    ],
    color: CIRCUIT_PALETTE.VICTORY_GOLD,
  },
  {
    tier: "dead_mans",
    name: "Dead Man's Rank",
    minCp: 5000,
    rewards: [
      { type: "cosmetic", key: "circuit_badge_deadmans", label: "Dead Man's Circuit Badge" },
      { type: "cosmetic", key: "clone_skin_deadmans", label: "Dead Man's Clone Skin" },
      { type: "cosmetic", key: "nilmorg_announcer_pack", label: "Nilmorg Announcer Pack" },
      { type: "xp", key: "circuit_xp_deadmans", label: "10000 XP", amount: 10000 },
      { type: "decoration", key: "nilmorg_trophy", label: "Nilmorg's Golden Bone Trophy" },
    ],
    color: CIRCUIT_PALETTE.DANGER_RED,
  },
];

/**
 * Get the highest reward tier the player qualifies for.
 */
export function getRewardTier(totalCp: number): SeasonRewardTier {
  let best = SEASON_REWARD_TIERS[0];
  for (const tier of SEASON_REWARD_TIERS) {
    if (totalCp >= tier.minCp) best = tier;
  }
  return best;
}
