/* ═══════════════════════════════════════════════════════
   HOUSE COMPETITION — Guild Standings + AI Bots

   12 Mechronis Guilds compete for weekly House Cup standings.
   AI bots fill every Guild so none ever look empty regardless
   of real player count.

   Key behaviors:
     • Bots contribute points throughout the week (tick-based)
     • Rubber-banding: trailing Guilds get catch-up bonuses
     • Leader fatigue: longer a Guild leads, harder to stay
     • Weekly reset → crowns a Guild, logs winner history

   This turns Guild membership into a living social fabric
   even for solo players.
   ═══════════════════════════════════════════════════════ */

export const WEEKLY_RESET_DAYS = 7;

export interface GuildStanding {
  guildName: string;
  score: number;
  /** How long (weeks) this Guild has been in top 3 */
  leadStreak: number;
  /** AI bot population (simulated members) */
  botCount: number;
  /** Real player members (computed) */
  playerCount: number;
  /** Last tick when bots contributed */
  lastBotTick: number;
}

export interface HouseCompetitionState {
  /** Current week's standings, keyed by guild name */
  standings: Record<string, GuildStanding>;
  /** Week number since the system began */
  currentWeek: number;
  /** Timestamp of next reset */
  nextResetAt: number;
  /** History of winners per week */
  winnerHistory: { week: number; guildName: string; finalScore: number }[];
}

/* ─── GUILD NAME CONSTANT ─── */

const GUILD_NAMES = [
  "The Chorus", "The Eyes", "The Archive", "The Between",
  "The Influencers", "The Yellow Coats", "The Congress", "The Locks",
  "The Grey Gamers", "The Living", "The Forge", "The Architect's Study",
] as const;

/* ─── INITIAL STATE ─── */

export function initHouseCompetitionState(): HouseCompetitionState {
  const standings: Record<string, GuildStanding> = {};
  for (const name of GUILD_NAMES) {
    standings[name] = {
      guildName: name,
      score: Math.floor(Math.random() * 50), // random starter offset so week 1 isn't all zeros
      leadStreak: 0,
      botCount: 8 + Math.floor(Math.random() * 12), // 8-19 bots per guild
      playerCount: 0,
      lastBotTick: Date.now(),
    };
  }
  return {
    standings,
    currentWeek: 1,
    nextResetAt: Date.now() + WEEKLY_RESET_DAYS * 24 * 60 * 60 * 1000,
    winnerHistory: [],
  };
}

/* ─── BOT TICK — rubber-banded point contribution ─── */

/**
 * Advance the bot tick. Each guild's bots contribute points based on
 * their count AND a rubber-band bonus if they're trailing. Leader
 * fatigue slows down the top guild's gains.
 *
 * Call this periodically (every ~5-15 min real time).
 */
export function tickBots(state: HouseCompetitionState): HouseCompetitionState {
  const now = Date.now();
  const sorted = Object.values(state.standings).sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score ?? 0;
  const avgScore = sorted.reduce((s, g) => s + g.score, 0) / sorted.length || 1;

  const newStandings: Record<string, GuildStanding> = {};
  for (const g of sorted) {
    // Base bot contribution: ~1 point per bot per hour
    const elapsedHours = (now - g.lastBotTick) / (1000 * 60 * 60);
    const baseGain = Math.floor(g.botCount * elapsedHours * (0.5 + Math.random()));

    // Rubber-band: trailing Guilds get up to 2× gain
    const gap = maxScore - g.score;
    const rubberBand = 1 + Math.min(1, gap / (maxScore || 1)) * 1.0;

    // Leader fatigue: current leader gets 40-60% contributions
    const isLeader = g.score === maxScore && g.score > 0;
    const fatigueMultiplier = isLeader
      ? Math.max(0.4, 0.6 - g.leadStreak * 0.05)
      : 1.0;

    const finalGain = Math.floor(baseGain * rubberBand * fatigueMultiplier);
    newStandings[g.guildName] = {
      ...g,
      score: g.score + finalGain,
      lastBotTick: now,
    };
  }

  return { ...state, standings: newStandings };
}

/* ─── PLAYER CONTRIBUTION ─── */

/**
 * Player contributes points to their Guild.
 * Called when player completes quests, wins fights, unlocks lore, etc.
 */
export function playerContributes(
  state: HouseCompetitionState,
  guildName: string,
  points: number,
): HouseCompetitionState {
  const current = state.standings[guildName];
  if (!current) return state;
  return {
    ...state,
    standings: {
      ...state.standings,
      [guildName]: { ...current, score: current.score + points },
    },
  };
}

/* ─── WEEKLY RESET ─── */

/**
 * Check if reset is due. If so, crown winner and reset scores.
 */
export function maybeWeeklyReset(state: HouseCompetitionState): HouseCompetitionState {
  if (Date.now() < state.nextResetAt) return state;

  // Crown winner
  const sorted = Object.values(state.standings).sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const history = [
    ...state.winnerHistory,
    { week: state.currentWeek, guildName: winner.guildName, finalScore: winner.score },
  ];

  // Reset scores with leader-streak carry
  const newStandings: Record<string, GuildStanding> = {};
  for (const g of sorted) {
    const wasInTop3 = sorted.indexOf(g) < 3;
    newStandings[g.guildName] = {
      ...g,
      score: Math.floor(Math.random() * 30),
      leadStreak: wasInTop3 ? g.leadStreak + 1 : 0,
      lastBotTick: Date.now(),
    };
  }

  return {
    standings: newStandings,
    currentWeek: state.currentWeek + 1,
    nextResetAt: Date.now() + WEEKLY_RESET_DAYS * 24 * 60 * 60 * 1000,
    winnerHistory: history,
  };
}

/* ─── RANKINGS ─── */

export function getRankings(state: HouseCompetitionState): Array<GuildStanding & { rank: number }> {
  const sorted = Object.values(state.standings).sort((a, b) => b.score - a.score);
  return sorted.map((s, i) => ({ ...s, rank: i + 1 }));
}

export function getPlayerRank(state: HouseCompetitionState, guildName: string): number {
  const rankings = getRankings(state);
  return rankings.find(r => r.guildName === guildName)?.rank ?? -1;
}

/* ═══════════════════════════════════════════════════════
   WEEKLY EPOCH CHALLENGES

   Each week rotates through the five epochs, offering a
   themed challenge that rewards all guilds — but gives a
   bonus multiplier to the guild most tied to that epoch.
   ═══════════════════════════════════════════════════════ */

export interface WeeklyEpochChallenge {
  id: string;
  epochId: number;
  epochName: string;
  challengeTitle: string;
  description: string;
  /** The guild that receives a point bonus for this challenge */
  bonusGuild: string;
  /** Multiplier applied to the bonus guild's points earned during this challenge */
  bonusMultiplier: number;
  flavorText: string;
}

export const WEEKLY_EPOCH_CHALLENGES: WeeklyEpochChallenge[] = [
  {
    id: "epoch-privacy-watchers-trial",
    epochId: 0,
    epochName: "Age of Privacy",
    challengeTitle: "The Watcher's Trial",
    description:
      "Gather intelligence like The Eyes did during the Age of Privacy. Complete 10 investigation quests this week.",
    bonusGuild: "The Eyes",
    bonusMultiplier: 1.5,
    flavorText: "Know everything. Be seen by no one.",
  },
  {
    id: "epoch-prophecy-seers-challenge",
    epochId: 1,
    epochName: "Age of Prophecy",
    challengeTitle: "The Seer's Challenge",
    description:
      "Predict outcomes like the Oracle. Win 5 coin-flip style gambles this week.",
    bonusGuild: "The Between",
    bonusMultiplier: 1.5,
    flavorText: "Reality has more doors than walls.",
  },
  {
    id: "epoch-insurgency-recruiters-mission",
    epochId: 2,
    epochName: "Age of Insurgency",
    challengeTitle: "The Recruiter's Mission",
    description:
      "Build alliances like Kael the Recruiter. Invite 3 players to your guild this week.",
    bonusGuild: "The Yellow Coats",
    bonusMultiplier: 1.5,
    flavorText: "Forged in endless war.",
  },
  {
    id: "epoch-revelation-forges-legacy",
    epochId: 3,
    epochName: "Age of Revelation",
    challengeTitle: "The Forge's Legacy",
    description:
      "Engineer as many solutions as The Forge did during the Golden Age. Craft 15 items this week.",
    bonusGuild: "The Forge",
    bonusMultiplier: 1.5,
    flavorText: "Nothing is finished. Nothing is broken. Only in-between.",
  },
  {
    id: "epoch-fall-endurance-of-the-living",
    epochId: 4,
    epochName: "Fall of Reality",
    challengeTitle: "Endurance of The Living",
    description:
      "Survive like the Necromancer's students. Complete 5 Terminus Swarm waves without losing a turret.",
    bonusGuild: "The Living",
    bonusMultiplier: 1.5,
    flavorText: "Endurance is negotiation with death.",
  },
] as const;

/* ─── ACTIVE CHALLENGE ROTATION ─── */

/**
 * Returns the active weekly challenge based on the current week number.
 * Cycles through the five epochs using week % 5.
 */
export function getActiveWeeklyChallenge(currentWeek: number): WeeklyEpochChallenge {
  const index = currentWeek % WEEKLY_EPOCH_CHALLENGES.length;
  return WEEKLY_EPOCH_CHALLENGES[index];
}

/* ─── CHALLENGE BONUS APPLICATION ─── */

/**
 * Apply challenge bonus points for a guild. If the guild matches the
 * challenge's bonusGuild, the base points are multiplied by the
 * bonusMultiplier. Otherwise the base points are returned unchanged.
 */
export function applyChallengeBonusPoints(
  _state: HouseCompetitionState,
  challenge: WeeklyEpochChallenge,
  guildName: string,
  basePoints: number,
): number {
  if (guildName === challenge.bonusGuild) {
    return Math.floor(basePoints * challenge.bonusMultiplier);
  }
  return basePoints;
}
