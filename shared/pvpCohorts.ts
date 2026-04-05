/* ═══════════════════════════════════════════════════════
   PVP COHORTS — Celebration Trial Matchmaking

   When a player sends an Apprentice to Celebration, they
   enter a COHORT: a weekly class of 12-40 Apprentices
   competing to survive. Only one graduates (per user spec:
   "Only one graduate per class").

   Because a production backend isn't wired, this module
   simulates cohorts locally:
     • Synthetic opponents (8% evil, same RNG as player's)
     • Daily eliminations based on risk scoring
     • Rolling cohort start times (new cohort every 7 days)
     • Player slots into next available cohort on enrolment

   Ready to swap to server-side matchmaking without API changes.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice } from "./apprentices";
import { generateApprentice } from "./apprentices";

export const COHORT_SIZE_MIN = 12;
export const COHORT_SIZE_MAX = 40;
export const COHORT_LENGTH_DAYS = 28;

export interface CohortMember {
  apprenticeId: string;
  apprenticeName: string;
  archetype: string;
  rarity: string;
  isPlayer: boolean;
  /** Player ID (if real player) */
  playerId?: string;
  /** Computed risk score 0-100 (higher = more likely to die) */
  riskScore: number;
  alive: boolean;
  dayFallen?: number;
  causeOfDeath?: string;
}

export interface Cohort {
  id: string;
  /** Cohort # (incrementing each week) */
  number: number;
  /** Unix timestamp of cohort start */
  startedAt: number;
  /** Current day of trial (0-28) */
  currentDay: number;
  members: CohortMember[];
  /** If not null, the graduate who won */
  winner: CohortMember | null;
  status: "enrolling" | "active" | "concluded";
}

/* ─── COHORT GENERATION ─── */

/** Seed a cohort with synthetic opponents (NPCs). */
export function generateCohort(cohortNumber: number, playerApprentice?: Apprentice): Cohort {
  const totalSize = COHORT_SIZE_MIN + Math.floor(Math.random() * (COHORT_SIZE_MAX - COHORT_SIZE_MIN));
  const members: CohortMember[] = [];

  // Add player first if provided
  if (playerApprentice) {
    members.push(toCohortMember(playerApprentice, true));
  }

  // Fill with synthetic opponents
  const remaining = totalSize - members.length;
  for (let i = 0; i < remaining; i++) {
    const npc = generateApprentice();
    members.push(toCohortMember(npc, false));
  }

  return {
    id: `cohort-${cohortNumber}-${Date.now()}`,
    number: cohortNumber,
    startedAt: Date.now(),
    currentDay: 0,
    members,
    winner: null,
    status: "active",
  };
}

function toCohortMember(app: Apprentice, isPlayer: boolean): CohortMember {
  // Risk score based on rarity (lower rarity = higher risk) and stats
  const rarityRisk: Record<string, number> = {
    common: 70, uncommon: 55, rare: 40, epic: 25, mythic: 10,
  };
  const base = rarityRisk[app.rarity] ?? 60;
  const statAvg = (app.stats.strength + app.stats.intelligence + app.stats.agility + app.stats.charisma) / 4;
  const statBonus = Math.max(0, 30 - statAvg); // lower stats = higher risk
  const evilBonus = app.evilFromStart ? -5 : 0; // evil ones survive longer (plot armor)
  return {
    apprenticeId: app.id,
    apprenticeName: app.name,
    archetype: app.archetype,
    rarity: app.rarity,
    isPlayer,
    riskScore: Math.min(100, Math.max(5, base + statBonus + evilBonus + (Math.random() * 20 - 10))),
    alive: true,
  };
}

/* ─── DAILY ELIMINATION TICK ─── */

const ELIMINATION_CAUSES = [
  "fell during Gary's rule-rewrite puzzle",
  "traded too much to Little Corey",
  "broke the Chorus harmony",
  "was seen too clearly by Mr. Unblink",
  "lost Wanda Wee's team game",
  "opened the wrong of Vernon's doors",
  "failed the Seeker's One Question",
  "didn't return from Thazu's tea party",
  "was unbuilt by the Prince",
  "was quarantined by Wayne and forgotten",
  "believed Minnie's rumor about themselves",
  "signed Senator Sprout's promise they couldn't keep",
];

/**
 * Advance the cohort by one day. Roll eliminations based on risk scores,
 * scaled to ensure only one survives by day 28.
 */
export function advanceCohortDay(cohort: Cohort): Cohort {
  if (cohort.status !== "active") return cohort;

  const newDay = cohort.currentDay + 1;
  const aliveMembers = cohort.members.filter(m => m.alive);

  // Target: reduce population so that by day 28, only 1 remains
  // Exponential decay: aliveRatio = e^(-k * day) — calibrate k so day 28 leaves 1
  const initialCount = cohort.members.length;
  const targetAlive = Math.max(1, Math.round(initialCount * Math.exp(-Math.log(initialCount) * (newDay / COHORT_LENGTH_DAYS))));
  const mustEliminate = Math.max(0, aliveMembers.length - targetAlive);

  if (mustEliminate === 0) {
    return { ...cohort, currentDay: newDay };
  }

  // Weighted random eliminations based on riskScore
  const updatedMembers = [...cohort.members];
  const alivePool = [...aliveMembers].sort((a, b) => b.riskScore - a.riskScore);
  for (let i = 0; i < mustEliminate && i < alivePool.length; i++) {
    // Higher risk = more likely to be chosen (top of list)
    const idx = Math.floor(Math.random() * Math.min(i + 3, alivePool.length));
    const target = alivePool[idx];
    if (!target || !target.alive) continue;
    const memberIdx = updatedMembers.findIndex(m => m.apprenticeId === target.apprenticeId);
    if (memberIdx === -1) continue;
    updatedMembers[memberIdx] = {
      ...updatedMembers[memberIdx],
      alive: false,
      dayFallen: newDay,
      causeOfDeath: ELIMINATION_CAUSES[Math.floor(Math.random() * ELIMINATION_CAUSES.length)],
    };
    alivePool.splice(idx, 1);
  }

  // Check for winner
  const stillAlive = updatedMembers.filter(m => m.alive);
  if (stillAlive.length === 1 || newDay >= COHORT_LENGTH_DAYS) {
    return {
      ...cohort,
      currentDay: newDay,
      members: updatedMembers,
      winner: stillAlive[0] ?? null,
      status: "concluded",
    };
  }

  return { ...cohort, currentDay: newDay, members: updatedMembers };
}

/* ─── LEADERBOARD ─── */

export function getCohortLeaderboard(cohort: Cohort): CohortMember[] {
  // Alive ranked by risk score (lowest = most resilient), dead by day fallen
  const alive = cohort.members.filter(m => m.alive).sort((a, b) => a.riskScore - b.riskScore);
  const dead = cohort.members.filter(m => !m.alive).sort((a, b) => (b.dayFallen ?? 0) - (a.dayFallen ?? 0));
  return [...alive, ...dead];
}

export function getPlayerStanding(cohort: Cohort): { rank: number; alive: boolean } | null {
  const leaderboard = getCohortLeaderboard(cohort);
  const idx = leaderboard.findIndex(m => m.isPlayer);
  if (idx === -1) return null;
  return { rank: idx + 1, alive: leaderboard[idx].alive };
}
