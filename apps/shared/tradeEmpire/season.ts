// apps/shared/tradeEmpire/season.ts
//
// Season clock — phase 1 of the items-matter / Game-of-Thrones arc.
//
// A "season" is the time window over which proactive NPC agendas
// advance, sub-house rep settles, and one declaration sets the
// political tone. The clock is a singleton on the server (one row,
// one canonical state) so every player sees the same season state
// at any given moment. This mirrors the dischordia_cycle_state
// pattern.
//
// Phase 1 ships only the data model + invariants. The tick job and
// declaration resolution land in phase 4 alongside agendas.

import type { SubHouseKey } from "./houses";

// --- Phase enum -----------------------------------------------------------

/**
 * A season cycles through four phases. Most player time is spent in
 * `running`; the others are short transitions where rep settles and
 * the next declaration is computed.
 */
export type SeasonPhase =
  /** Setup: declaration is being resolved; player can still play but
   *  no agenda steps fire and no taxes are levied. */
  | "prologue"
  /** Bulk of the season: agendas tick, contracts can be signed,
   *  demands and taxes apply. */
  | "running"
  /** Last 72h before turn: declarations crystallise, last-call
   *  contract signings lock, court widget shows preview of next
   *  season. */
  | "closing"
  /** Turn-over: tribute taxes collected, sectors flip, declaration
   *  selected, rep deltas applied. Read-only for players. */
  | "interregnum";

export const SEASON_PHASES: ReadonlyArray<SeasonPhase> = [
  "prologue",
  "running",
  "closing",
  "interregnum",
];

// --- Declaration shape ----------------------------------------------------

/**
 * A season-long political stance issued at season start. Drives a
 * modifier that anti-correlates two sub-houses for the whole season.
 * Only one declaration is active at a time (the highest-impact one
 * per season tick).
 */
export interface SeasonDeclaration {
  declarationKey: string;
  /** Short headline rendered in newsfeeds + dialog. */
  headline: string;
  /** Long-form text shown in the court widget. */
  text: string;
  /** The sub-house issuing the declaration. */
  issuingHouse: SubHouseKey;
  /** The sub-house targeted (rival, neutral, or out-of-faction). */
  targetHouse: SubHouseKey;
  /** Reputation modifier applied to issuing house when player
   *  takes a contract aligned with target during this season. */
  rivalryModifier: number;
  /** Optional flag the engine sets so dialog renderers can react. */
  publicFlag?: string;
}

// --- Singleton state shape ------------------------------------------------

/**
 * Server-authoritative season state. The DB row mirrors this exactly
 * (see schema.ts seasonClockState). Clients receive it via tRPC.
 */
export interface SeasonClockState {
  /** Season number, monotonic. Starts at 1. */
  seasonNumber: number;
  phase: SeasonPhase;
  /** When the current phase started. */
  phaseStartedAt: number; // ms epoch
  /** When the next phase transition is scheduled. Null inside
   *  interregnum (server triggers the transition manually after
   *  tribute settlement). */
  phaseEndsAt: number | null;
  /** Active declaration for this season; null inside prologue
   *  before resolution. */
  declaration: SeasonDeclaration | null;
  /** Tick counter inside the current season. Agenda steps consume
   *  ticks. Resets to 0 each new season. */
  tickNumber: number;
  /** When the most recent agenda tick fired. */
  lastTickAt: number | null;
}

// --- Tunables -------------------------------------------------------------

/** How long each phase lasts in ms — wall-clock by default. */
export const SEASON_PHASE_DURATION_MS: Readonly<Record<SeasonPhase, number>> = {
  // 24h prologue — declaration is being resolved.
  prologue: 24 * 60 * 60 * 1000,
  // 8 weeks of "running". User-facing locked decision: aggressive
  // sinks make this feel longer than 8 weeks; we can tune down later.
  running: 56 * 24 * 60 * 60 * 1000,
  // 72h closing.
  closing: 3 * 24 * 60 * 60 * 1000,
  // Interregnum is server-driven; this is a fallback timeout.
  interregnum: 6 * 60 * 60 * 1000,
};

/**
 * How often agendas tick during the running phase. Aligned to one
 * real day so a regular player sees the world advance once per
 * session and an absent player has a visible "while you were
 * gone" feed at next login.
 */
export const SEASON_TICK_INTERVAL_MS = 24 * 60 * 60 * 1000;

// --- Helpers --------------------------------------------------------------

/**
 * Determine the phase that should follow the given one. Used by the
 * tick job; pure function so it's trivially testable.
 */
export function nextPhase(phase: SeasonPhase): SeasonPhase {
  switch (phase) {
    case "prologue":
      return "running";
    case "running":
      return "closing";
    case "closing":
      return "interregnum";
    case "interregnum":
      return "prologue";
  }
}

/**
 * Whether the season is in a state that accepts new contract
 * signings. Closing accepts last-call signings; interregnum is
 * read-only.
 */
export function acceptsContractSignings(phase: SeasonPhase): boolean {
  return phase === "running" || phase === "closing";
}

/**
 * Whether the season is in a state where agendas tick. Only
 * `running` advances agendas; other phases freeze them so the
 * world doesn't move during transitions.
 */
export function tickAdvancesAgendas(phase: SeasonPhase): boolean {
  return phase === "running";
}

/** Validate a SeasonClockState shape. Returns error strings or []. */
export function validateSeasonClockState(s: SeasonClockState): ReadonlyArray<string> {
  const errors: string[] = [];
  if (!Number.isInteger(s.seasonNumber) || s.seasonNumber < 1) {
    errors.push(`seasonNumber must be integer ≥ 1 (got ${s.seasonNumber})`);
  }
  if (!SEASON_PHASES.includes(s.phase)) {
    errors.push(`phase must be one of SEASON_PHASES (got ${s.phase})`);
  }
  if (s.phaseStartedAt <= 0) {
    errors.push(`phaseStartedAt must be a positive epoch ms`);
  }
  if (s.phaseEndsAt !== null && s.phaseEndsAt <= s.phaseStartedAt) {
    errors.push(`phaseEndsAt must be after phaseStartedAt`);
  }
  if (!Number.isInteger(s.tickNumber) || s.tickNumber < 0) {
    errors.push(`tickNumber must be a non-negative integer`);
  }
  if (s.declaration) {
    if (s.declaration.issuingHouse === s.declaration.targetHouse) {
      errors.push(`declaration cannot target its own issuing house`);
    }
    if (s.declaration.rivalryModifier < 0) {
      errors.push(`declaration.rivalryModifier must be non-negative`);
    }
  }
  return errors;
}
