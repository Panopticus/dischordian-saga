/* ═══════════════════════════════════════════════════════
   GUILD WONDERS — Guild Wonder Construction System

   Massive guild projects funded by the guild treasury.
   Each wonder takes 1-4 weeks to build and grants a
   server-wide bonus upon completion. Only one wonder
   may be under construction at a time.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type WonderId =
  | "panopticon_rebuilt"
  | "iron_lions_citadel"
  | "dreamers_observatory"
  | "kaels_memorial"
  | "antiquarians_archive";

export interface WonderBonus {
  stat: string;
  bonusPercent: number;
  description: string;
}

export interface GuildWonder {
  id: WonderId;
  name: string;
  description: string;
  bonus: WonderBonus;
  fundingGoal: number;    // total treasury cost
  buildTimeWeeks: 1 | 2 | 3 | 4;
  iconKey: string;
}

export interface WonderContribution {
  playerId: string;
  playerName: string;
  amount: number;
  contributedAt: number; // epoch ms
}

export interface WonderProgress {
  wonderId: WonderId;
  guildId: string;
  fundedAmount: number;
  fundingGoal: number;
  contributions: WonderContribution[];
  constructionStartedAt: number | null; // epoch ms, null if still funding
  estimatedCompletionAt: number | null;
  completed: boolean;
  completedAt: number | null;
}

export interface GuildWonderState {
  completedWonders: WonderId[];
  activeConstruction: WonderProgress | null;
  guildId: string;
}

/* ─── DATA ─── */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const GUILD_WONDERS: GuildWonder[] = [
  {
    id: "panopticon_rebuilt",
    name: "The Panopticon Rebuilt",
    description: "A towering observatory that enhances all training and study aboard the Ark.",
    bonus: { stat: "xp_gain", bonusPercent: 5, description: "+5% XP server-wide" },
    fundingGoal: 50000,
    buildTimeWeeks: 3,
    iconKey: "wonder_panopticon",
  },
  {
    id: "iron_lions_citadel",
    name: "Iron Lion's Citadel",
    description: "A fortified war room that amplifies coordinated guild offensives.",
    bonus: { stat: "war_points", bonusPercent: 10, description: "+10% war points" },
    fundingGoal: 75000,
    buildTimeWeeks: 4,
    iconKey: "wonder_citadel",
  },
  {
    id: "dreamers_observatory",
    name: "The Dreamer's Observatory",
    description: "A crystalline dome that channels ambient Dream energy for all guild members.",
    bonus: { stat: "dream_generation", bonusPercent: 5, description: "+5% Dream generation" },
    fundingGoal: 60000,
    buildTimeWeeks: 3,
    iconKey: "wonder_observatory",
  },
  {
    id: "kaels_memorial",
    name: "Kael's Memorial",
    description: "A monument honoring Kael's sacrifice, inspiring defenders against the Swarm.",
    bonus: { stat: "terminus_rewards", bonusPercent: 10, description: "+10% Terminus rewards" },
    fundingGoal: 80000,
    buildTimeWeeks: 4,
    iconKey: "wonder_memorial",
  },
  {
    id: "antiquarians_archive",
    name: "The Antiquarian's Archive",
    description: "A vast library of recovered pre-Collapse texts that accelerates lore research.",
    bonus: { stat: "lore_discovery", bonusPercent: 5, description: "+5% lore discovery rate" },
    fundingGoal: 40000,
    buildTimeWeeks: 2,
    iconKey: "wonder_archive",
  },
];

/* ─── FUNCTIONS ─── */

function findWonder(id: WonderId): GuildWonder {
  const w = GUILD_WONDERS.find((w) => w.id === id);
  if (!w) throw new Error(`Unknown wonder: ${id}`);
  return w;
}

export function canStartWonder(
  wonderId: WonderId,
  state: GuildWonderState,
): { allowed: boolean; reason: string } {
  if (state.activeConstruction !== null) {
    return { allowed: false, reason: "A wonder is already under construction." };
  }
  if (state.completedWonders.includes(wonderId)) {
    return { allowed: false, reason: "This wonder has already been completed." };
  }
  return { allowed: true, reason: "Ready to begin construction." };
}

export function contributeToWonder(
  playerId: string,
  playerName: string,
  amount: number,
  progress: WonderProgress,
): WonderProgress {
  const contribution: WonderContribution = {
    playerId,
    playerName,
    amount,
    contributedAt: Date.now(),
  };

  const newFunded = Math.min(progress.fundedAmount + amount, progress.fundingGoal);
  const fullyFunded = newFunded >= progress.fundingGoal;
  const wonder = findWonder(progress.wonderId);

  let constructionStartedAt = progress.constructionStartedAt;
  let estimatedCompletionAt = progress.estimatedCompletionAt;

  if (fullyFunded && constructionStartedAt === null) {
    constructionStartedAt = Date.now();
    estimatedCompletionAt = constructionStartedAt + wonder.buildTimeWeeks * WEEK_MS;
  }

  return {
    ...progress,
    fundedAmount: newFunded,
    contributions: [...progress.contributions, contribution],
    constructionStartedAt,
    estimatedCompletionAt,
  };
}

export function completeWonder(
  state: GuildWonderState,
): GuildWonderState | null {
  const active = state.activeConstruction;
  if (!active) return null;
  if (!active.constructionStartedAt || !active.estimatedCompletionAt) return null;
  if (Date.now() < active.estimatedCompletionAt) return null;

  return {
    ...state,
    completedWonders: [...state.completedWonders, active.wonderId],
    activeConstruction: null,
  };
}

export function getActiveWonderBonuses(state: GuildWonderState): WonderBonus[] {
  return state.completedWonders.map((id) => findWonder(id).bonus);
}

export function createWonderProgress(
  wonderId: WonderId,
  guildId: string,
): WonderProgress {
  const wonder = findWonder(wonderId);
  return {
    wonderId,
    guildId,
    fundedAmount: 0,
    fundingGoal: wonder.fundingGoal,
    contributions: [],
    constructionStartedAt: null,
    estimatedCompletionAt: null,
    completed: false,
    completedAt: null,
  };
}
