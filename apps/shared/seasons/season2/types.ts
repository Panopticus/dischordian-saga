/* ═══════════════════════════════════════════════════════
   SEASON 2 — world-state delta + patch composition
   docs/design/NEXUS_TRIAL_PLAN.md → Post-Verdict Season 2
   Patch Composition

   At Verdict close, the tick service composes a canonical
   `WorldStateDelta` from the resolver outputs + permadeath
   store + Trial metadata. The Season 2 patch service reads
   this delta and activates exactly one variant per
   dimension:

     - companion_sacrifice : 2 variants (elara / human)
     - second_death        : 4 variants (4 ballot keys)
     - politician_fork     : 3 variants (sealed / constrained / full)

   24 combinations total; the architecture is 2+4+3+1
   shared = 10 content directories that compose into the
   24 starting states.

   Sprint 13 ships the architecture + composer + scaffold
   modules. Sprint 14 layers cross-arc ripples on top.
   ═══════════════════════════════════════════════════════ */

import type { BallotKey, CompanionKey } from "../../nexusTrial/buckets";

/** Politician fork resolution. Reflects the post-Verdict state of
 *  the Archon-7 seat per the plan's Politician Fork rules. */
export type PoliticianForkResolution =
  | "seat_sealed" // high engagement + Light dominant
  | "constrained_return" // high engagement + Dark dominant
  | "full_return"; // low engagement

/** Canonical record of a Trial's outcome. Composed at Verdict close
 *  and committed to apps/shared/seasons/season2/world_state_delta.json
 *  by the operator. The patch composer reads this to activate the
 *  right variant modules. */
export interface WorldStateDelta {
  trialKey: string;
  closedAt: string; // ISO timestamp

  companionSacrifice: {
    sacrificed: CompanionKey;
    tally: Record<CompanionKey, number>;
    cinematicFired: string;
  };

  secondDeathBallot: {
    winner: BallotKey;
    tally: Record<BallotKey, number>;
    tieBreakUsed: boolean;
    cinematicFired: string;
  };

  locke: {
    status: "permadead";
    cinematicFired: string;
    necromancerCooldownMonths: number;
  };

  politicianFork: {
    engagementScore: number; // 0..1
    alignmentScore: number; // -1..+1
    resolution: PoliticianForkResolution;
    archonAspirantNemesisId: string | null;
  };

  vortexPostTrial: {
    proximityAtClose: number;
    sectorsReclaimedInTrial: number;
    sectorsRemainingConsumed: number;
  };
}

/** Content patch from one variant module. Each Season 2 variant
 *  exports one of these. The composer merges the matching dimension's
 *  patch into the Season 2 starting state. */
export interface PatchModule {
  /** Stable identifier for the variant — surfaces in CI logs and
   *  cancelled_authoring.md. */
  id: string;
  /** Dialog overrides keyed by NPC + scene id. Sparse — only the
   *  beats this variant changes. */
  dialogOverrides: Record<string, string>;
  /** Loredex entry patches keyed by entry id. */
  loredexPatches: Record<string, LoredexPatch>;
  /** Cosmetic / card unlocks gated on this variant firing. */
  cardUnlocks: readonly string[];
  /** Cross-arc ripple identifiers (Sprint 14 expands these). */
  crossArcRipples: readonly string[];
}

export interface LoredexPatch {
  /** New status for the entry. */
  status?: "alive" | "deceased" | "dark" | "in_memoriam";
  /** Memorial flavor text appended to the entry. */
  inMemoriamLine?: string;
  /** Past-tense rewrite flag — Day 30 regeneration honors this. */
  rewritePastTense?: boolean;
}

/** Days from Verdict close before each wave fires. The plan's three-
 *  wave rollout: Day 1 (shared + variants + Daily Brief), Day 7
 *  (unlock cards + Memorial Wall), Day 30 (dead-variant cleanup +
 *  lore drift test). */
export const WAVE_DAYS = {
  wave1: 0,
  wave2: 7,
  wave3: 30,
} as const;
