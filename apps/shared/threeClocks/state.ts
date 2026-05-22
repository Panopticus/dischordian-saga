/* ═══════════════════════════════════════════════════════
   THREE CLOCKS — unified state composer for the Nexus
   Trial panel (docs/design/NEXUS_TRIAL_PLAN.md).

   Sprint 2 deliverable. Composes a single read-model from
   three independent state machines:

     - Vortex    → apps/shared/dischordiaCycle.ts
     - Necromancer → apps/shared/necromancerCycle.ts
     - Politician  → apps/shared/nemesisSystem.ts (computed
                     from the active Nemesis roster)

   Pure function. No I/O. The router (Sprint 3+) feeds it
   the current state and returns the composed snapshot to
   the client.

   The panel renders the same three clocks in three
   contexts (Daily Brief full panel, home page strip,
   pre-match warning) per the UI spec. All three contexts
   read from this single composed shape.
   ═══════════════════════════════════════════════════════ */

import type { CyclePhase, CycleState } from "../necromancerCycle";
import { getResurrectionDescription } from "../necromancerCycle";
import type {
  DischordiaCycleState,
  DischordiaPhase,
} from "../dischordiaCycle";
import { getDarkEnergyDescription } from "../dischordiaCycle";
import type { NemesisDef, NemesisRank } from "../nemesisSystem";

/* ─── COMPOSED STATE ─── */

export interface VortexClockState {
  /** Doomsday clock 0–100. Only ticks up across the year. */
  proximity: number;
  /** Current phase of the dischordia cycle. */
  phase: DischordiaPhase;
  /** Lifetime sectors consumed (sum across completed cycle history). */
  sectorsConsumed: number;
  /** Lifetime sectors reclaimed (sum across completed cycle history). */
  sectorsReclaimed: number;
  /** Antiquarian's poetic descriptor for the current dark-energy reading.
   *  Never a raw number — players see prose, not stats. */
  narration: string;
}

/**
 * Tiered Resurrection Energy descriptor. Mapped from the hidden numeric
 * meter in necromancerCycle.ts. We never expose the raw number to the
 * client; the Three Clocks panel reads this discrete tier instead.
 */
export type ResurrectionEnergyTier = "cold" | "warm" | "hot" | "critical";

export interface NecromancerClockState {
  /** Where the cycle currently sits. */
  phase: CyclePhase;
  /** Cycle number — increments each completed cycle. */
  cycleNumber: number;
  /** Tiered descriptor. Maps to the hidden meter; never raw. */
  resurrectionEnergy: ResurrectionEnergyTier;
  /** Antiquarian's poetic descriptor for the current resurrection-energy reading. */
  narration: string;
}

/**
 * Whether the Politician's vacant Archon-7 seat is sealed, contested,
 * or open. Pre-Trial: sealed (no aspirant) or contested (an aspirant
 * exists). Post-Trial: open means the antagonist claimed the seat
 * (the worst-case Season 2 fork).
 */
export type PoliticianSeatStatus = "sealed" | "contested" | "open";

export interface PoliticianClockState {
  /** Highest rank reached by any active Nemesis. Bounded 1..7. */
  topRank: NemesisRank;
  /** Id of the Nemesis at rank 7 (Archon-aspirant), if any. */
  aspirantNemesisId: string | null;
  /** Resolved status of the Politician's vacant Archon seat. */
  seatStatus: PoliticianSeatStatus;
  /** Count of active Nemeses (sized for the panel's "apprentices at the gate" line). */
  apprenticesActive: number;
}

export interface ThreeClocksState {
  vortex: VortexClockState;
  necromancer: NecromancerClockState;
  politician: PoliticianClockState;
  /** When the next aggregation tick is scheduled (ISO). */
  nextTickAt: string;
}

/* ─── INPUT ─── */

export interface ThreeClocksInput {
  /** Global necromancer cycle state. */
  necromancer: CycleState;
  /** Global dischordia cycle state. */
  dischordia: DischordiaCycleState;
  /** All active Nemeses to consider. Caller chooses scope:
   *  pass the full playerbase for the world view, or a single
   *  user's roster for the per-player view. */
  nemeses: readonly NemesisDef[];
  /** When the next aggregation tick is scheduled. */
  nextTickAt: Date;
  /** Whether the Politician seat has been resolved post-Verdict.
   *  False before the Nexus Trial fires; true after. When true, the
   *  composer reports seatStatus="open" iff a Nemesis reached rank 7;
   *  otherwise "sealed". Default: false (pre-Trial). */
  seatResolved?: boolean;
}

/* ─── ENERGY TIER MAPPING ─── */

/**
 * Quantize the hidden Resurrection Energy number to a discrete tier.
 * Thresholds align with narration boundaries in
 * `getResurrectionDescription`, so a tier shift always coincides with
 * a meaningful narration shift:
 *
 *   < 150k   →  cold      ("A whisper in the void." / "Something is stirring.")
 *   < 500k   →  warm      ("The Matrix grows restless." / "Bones remember.")
 *   < 900k   →  hot       ("The laugh echoes." / "Reality thins.")
 *   ≥ 900k   →  critical  ("He is almost here." / "HE HAS RETURNED.")
 */
export function resurrectionEnergyTier(energy: number): ResurrectionEnergyTier {
  if (energy < 150_000) return "cold";
  if (energy < 500_000) return "warm";
  if (energy < 900_000) return "hot";
  return "critical";
}

/* ─── COMPOSER ─── */

/**
 * Compose a single Three Clocks snapshot from the three source state
 * machines. Pure / deterministic. Safe to call on every tick.
 */
export function composeThreeClocksState(
  input: ThreeClocksInput,
): ThreeClocksState {
  return {
    vortex: composeVortexClock(input.dischordia),
    necromancer: composeNecromancerClock(input.necromancer),
    politician: composePoliticianClock(input.nemeses, input.seatResolved ?? false),
    nextTickAt: input.nextTickAt.toISOString(),
  };
}

/* ─── PER-CLOCK COMPOSERS (exported for granular testing) ─── */

export function composeVortexClock(state: DischordiaCycleState): VortexClockState {
  // Lifetime aggregates from completed cycle history. Players see
  // year-to-date counts on the panel; the open cycle is not yet in
  // history. (Open-cycle real-time sector tracking lands in Sprint 6
  // alongside the sector-state table.)
  let sectorsConsumed = 0;
  let sectorsReclaimed = 0;
  for (const record of state.history) {
    sectorsConsumed += record.sectorsConsumed;
    sectorsReclaimed += record.sectorsReclaimed;
  }

  return {
    proximity: state.vortexProximity,
    phase: state.phase,
    sectorsConsumed,
    sectorsReclaimed,
    narration: getDarkEnergyDescription(state.darkEnergy),
  };
}

export function composeNecromancerClock(state: CycleState): NecromancerClockState {
  return {
    phase: state.phase,
    cycleNumber: state.cycleNumber,
    resurrectionEnergy: resurrectionEnergyTier(state.resurrectionEnergy),
    narration: getResurrectionDescription(state.resurrectionEnergy),
  };
}

export function composePoliticianClock(
  nemeses: readonly NemesisDef[],
  seatResolved: boolean,
): PoliticianClockState {
  if (nemeses.length === 0) {
    return {
      topRank: 1,
      aspirantNemesisId: null,
      seatStatus: "sealed",
      apprenticesActive: 0,
    };
  }

  let topRank: NemesisRank = 1;
  let aspirantNemesisId: string | null = null;
  for (const n of nemeses) {
    if (n.rank > topRank) topRank = n.rank;
    if (n.rank === 7 && aspirantNemesisId === null) {
      aspirantNemesisId = n.id;
    }
  }

  const seatStatus: PoliticianSeatStatus = seatResolved
    ? // Post-Trial: seat is either taken by the aspirant ("open") or sealed.
      aspirantNemesisId !== null
      ? "open"
      : "sealed"
    : // Pre-Trial: contested iff someone reached the top rung.
      topRank === 7
      ? "contested"
      : "sealed";

  return {
    topRank,
    aspirantNemesisId,
    seatStatus,
    apprenticesActive: nemeses.length,
  };
}
