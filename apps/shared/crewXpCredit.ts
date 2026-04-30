/* ═══════════════════════════════════════════════════════
   CREW XP CREDIT

   When an external system grants the player a flat amount of
   crew XP — most notably, an Adjudicator Locke ledger contract
   that pays out in `crew_xp` — this module distributes it
   across the player's active crew as small bumps to their
   genetic stats.

   Distribution algorithm:

     1. Total credit is divided evenly across the active crew
        (status === "active"). If no active crew, returns
        applied: 0 (caller decides what to do).
     2. Each member's per-member share is distributed round-robin
        across their six genetic stats (resilience → intellect →
        reflexes → empathy → immunity → adaptability → repeat).
     3. Each stat is capped at the engine's MAX_STAT (100).
     4. Any leftover that can't fit (everyone capped) is
        discarded; the function does not roll over to other
        members.

   The resulting per-member bump for a 75-credit contract on a
   four-crew roster is ≈ 18 / 6 = +3 per stat per member,
   rounded into a deterministic round-robin so a 76-credit
   contract gives one extra point to one stat. Small enough to
   stay balanced; large enough that signing a Locke contract
   feels like Locke actually trained your crew.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

import type { CrewState, GeneticStat, SerializedCrewMember } from "./crewPersistence";

/** Cap each genetic stat at this value. The engine's runtime types
 *  use 0..100 throughout. */
export const MAX_STAT = 100;

/** Canonical stat order for round-robin distribution. */
export const STAT_ORDER: ReadonlyArray<GeneticStat> = [
  "resilience",
  "intellect",
  "reflexes",
  "empathy",
  "immunity",
  "adaptability",
] as const;

export interface CrewXpCreditPerMember {
  memberId: string;
  /** Per-stat bumps applied (0 when capped). */
  bumps: Record<GeneticStat, number>;
  /** Total points actually applied (sum of bumps). */
  applied: number;
}

export interface CrewXpCreditResult {
  /** Updated crew state. Same reference if `applied === 0`. */
  state: CrewState;
  /** Total points actually applied across all members. */
  applied: number;
  /** Per-member breakdown — useful for surfacing a UI receipt. */
  perMember: CrewXpCreditPerMember[];
}

/**
 * Distribute `amount` XP across the active crew. Returns the new
 * state, the actual amount applied (after stat caps), and a
 * per-member breakdown.
 */
export function distributeCrewXp(
  state: CrewState,
  amount: number,
): CrewXpCreditResult {
  if (amount <= 0) {
    return { state, applied: 0, perMember: [] };
  }

  const activeIndices: number[] = [];
  state.roster.members.forEach((m, i) => {
    if (m.status === "active") activeIndices.push(i);
  });

  if (activeIndices.length === 0) {
    return { state, applied: 0, perMember: [] };
  }

  // Even split, with the remainder going to the first N members so
  // the distribution is deterministic and total-conserving.
  const base = Math.floor(amount / activeIndices.length);
  const remainder = amount - base * activeIndices.length;

  const nextMembers = state.roster.members.slice();
  const perMember: CrewXpCreditPerMember[] = [];
  let totalApplied = 0;

  activeIndices.forEach((memberIdx, i) => {
    const member = nextMembers[memberIdx];
    const share = base + (i < remainder ? 1 : 0);
    const { newStats, bumps, applied } = applyShareToMember(member, share);
    if (applied > 0) {
      nextMembers[memberIdx] = { ...member, stats: newStats };
      totalApplied += applied;
    }
    perMember.push({ memberId: member.id, bumps, applied });
  });

  if (totalApplied === 0) {
    return { state, applied: 0, perMember };
  }

  const nextState: CrewState = {
    ...state,
    roster: {
      ...state.roster,
      members: nextMembers,
    },
  };
  return { state: nextState, applied: totalApplied, perMember };
}

/**
 * Apply `share` XP to one member. Round-robin over STAT_ORDER, each
 * stat capped at MAX_STAT. Returns the new stats record, per-stat
 * bumps, and total applied (≤ share).
 */
function applyShareToMember(
  member: SerializedCrewMember,
  share: number,
): {
  newStats: Record<GeneticStat, number>;
  bumps: Record<GeneticStat, number>;
  applied: number;
} {
  const newStats: Record<GeneticStat, number> = { ...member.stats };
  const bumps: Record<GeneticStat, number> = {
    resilience: 0, intellect: 0, reflexes: 0,
    empathy: 0, immunity: 0, adaptability: 0,
  };
  let remaining = share;
  let applied = 0;

  // Cap-aware round-robin. Walk STAT_ORDER until either the share is
  // exhausted or every stat is at MAX_STAT.
  while (remaining > 0) {
    let progressed = false;
    for (const stat of STAT_ORDER) {
      if (newStats[stat] >= MAX_STAT) continue;
      newStats[stat] += 1;
      bumps[stat] += 1;
      remaining -= 1;
      applied += 1;
      progressed = true;
      if (remaining <= 0) break;
    }
    // Everyone capped — break out so we don't infinite loop.
    if (!progressed) break;
  }

  return { newStats, bumps, applied };
}
