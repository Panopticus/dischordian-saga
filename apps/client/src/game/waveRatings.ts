/* ═══════════════════════════════════════════════════════
   WAVE RATINGS — 3-Star Terminus Swarm Rating System

   Each Terminus Swarm wave is graded on 3 objectives:
   survive, take no core damage, and finish under the
   time limit. Stars unlock multiplied rewards and
   milestone bonuses every 10 stars.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type StarCount = 0 | 1 | 2 | 3;

export interface StarObjective {
  id: string;
  label: string;
  description: string;
  starValue: StarCount;
  check: "survive" | "no_core_damage" | "under_time_limit";
  met: boolean;
}

export interface WaveRating {
  waveId: string;
  waveNumber: number;
  starsEarned: StarCount;
  objectives: StarObjective[];
  timeLimitSeconds: number;
  actualTimeSeconds: number;
  coreDamageTaken: number;
  survived: boolean;
  completedAt: number; // epoch ms
}

export interface WaveReward {
  baseCredits: number;
  baseMaterials: number;
  multiplier: number;
  bonusMaterial: string | null;
  totalCredits: number;
  totalMaterials: number;
}

export interface MilestoneReward {
  starThreshold: number;
  rewardType: "credits" | "material" | "card_pack" | "cosmetic" | "title";
  rewardId: string;
  rewardName: string;
  claimed: boolean;
}

export interface WaveStarState {
  waveRatings: Map<string, WaveRating>;
  totalStars: number;
  milestones: MilestoneReward[];
}

/* ─── CONSTANTS ─── */

const STAR_MULTIPLIERS: Record<StarCount, number> = {
  0: 0,
  1: 1.0,
  2: 1.5,
  3: 2.0,
};

const MILESTONE_INTERVAL = 10;

const BONUS_MATERIALS = [
  "Terminus Alloy",
  "Swarm Essence",
  "Void Fragment",
  "Core Shard",
];

/* ─── FUNCTIONS ─── */

export function calculateStars(
  survived: boolean,
  coreDamageTaken: number,
  actualTimeSeconds: number,
  timeLimitSeconds: number,
): { stars: StarCount; objectives: StarObjective[] } {
  const objectives: StarObjective[] = [
    {
      id: "survive",
      label: "Survive the Wave",
      description: "All defenders survive until wave end",
      starValue: 1,
      check: "survive",
      met: survived,
    },
    {
      id: "no_core_damage",
      label: "Protect the Core",
      description: "Core takes zero damage during the wave",
      starValue: 2,
      check: "no_core_damage",
      met: survived && coreDamageTaken === 0,
    },
    {
      id: "under_time",
      label: "Speed Clear",
      description: `Complete within ${timeLimitSeconds}s`,
      starValue: 3,
      check: "under_time_limit",
      met: survived && coreDamageTaken === 0 && actualTimeSeconds <= timeLimitSeconds,
    },
  ];

  let stars: StarCount = 0;
  if (objectives[2].met) stars = 3;
  else if (objectives[1].met) stars = 2;
  else if (objectives[0].met) stars = 1;

  return { stars, objectives };
}

export function getWaveReward(
  stars: StarCount,
  baseCredits: number,
  baseMaterials: number,
): WaveReward {
  const multiplier = STAR_MULTIPLIERS[stars];
  const bonusMaterial =
    stars === 3
      ? BONUS_MATERIALS[Math.floor(Math.random() * BONUS_MATERIALS.length)]
      : null;

  return {
    baseCredits,
    baseMaterials,
    multiplier,
    bonusMaterial,
    totalCredits: Math.floor(baseCredits * multiplier),
    totalMaterials: Math.floor(baseMaterials * multiplier),
  };
}

export function getTotalStars(state: WaveStarState): number {
  let total = 0;
  state.waveRatings.forEach((rating) => {
    total += rating.starsEarned;
  });
  return total;
}

export function getClaimableMilestones(state: WaveStarState): MilestoneReward[] {
  const total = getTotalStars(state);
  return state.milestones.filter(
    (m) => !m.claimed && m.starThreshold <= total,
  );
}

export function createInitialStarState(): WaveStarState {
  const milestones: MilestoneReward[] = [];
  const thresholds = [10, 20, 30, 50, 75, 100, 150, 200];
  const rewardTypes: MilestoneReward["rewardType"][] = [
    "credits", "material", "card_pack", "cosmetic",
    "credits", "card_pack", "title", "cosmetic",
  ];

  for (let i = 0; i < thresholds.length; i++) {
    milestones.push({
      starThreshold: thresholds[i],
      rewardType: rewardTypes[i],
      rewardId: `milestone_${thresholds[i]}`,
      rewardName: `${thresholds[i]}-Star Milestone`,
      claimed: false,
    });
  }

  return { waveRatings: new Map(), totalStars: 0, milestones };
}
