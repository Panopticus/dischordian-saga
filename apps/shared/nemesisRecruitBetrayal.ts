/* ═══════════════════════════════════════════════════════
   NEMESIS RECRUIT BETRAYAL CYCLE — Phase K8.4

   Per dreamer-canon (2026-05-13, dialog branch):
     "Yes, definitely do this. They might even pretend to
      be friendly to set up a betrayal."

   When a Nemesis is recruited via the K8 peace/recruit
   path, they are NOT canonically loyal forever. Two
   doctrines apply:

     1. THE CYCLE — over time, the recruit accumulates
        latent grudge. By default, the chance of betrayal
        ticks up linearly from 0% (week 0) to 60% (week 12+).
        High player-mercy choices and high-compatibility
        archetype pairings dampen the climb; low-mercy
        choices and faction-misalignment accelerate it.

     2. THE PRETEND-FRIENDLY GAMBIT — at recruitment, a
        secondary roll determines whether the recruit's
        loyalty is REAL or PERFORMATIVE. A performative
        recruit is operating long-con: they appear loyal
        for an extended cycle, then betray at maximum
        opportunity (high-stakes encounter, named-cohort
        moment, or when the player's apprentice is
        vulnerable). Performative recruits ALWAYS betray;
        the question is when.

   Pure functions. The runtime persists the resulting
   `RecruitLoyaltyState` per recruited Nemesis and
   evaluates it on every Nemesis-related read.
   ═══════════════════════════════════════════════════════ */

import type { NemesisDef } from "./nemesisSystem";
import type { ApprenticeArchetype } from "./apprentices";
import { NEMESIS_ARCHETYPE_BEHAVIORS } from "./nemesisArchetypes";

export type RecruitLoyaltyMode =
  | "real"            // genuinely converted; betrayal is grudge-driven only
  | "performative";   // long-con; will betray at the right opportunity

export interface RecruitLoyaltyState {
  nemesisId: string;
  recruitedAtIso: string;
  mode: RecruitLoyaltyMode;
  /** Player-archetype at recruitment time (pinned). */
  playerArchetype: ApprenticeArchetype;
  /** Initial latent grudge accumulated against the player.
   *  Performative recruits start at 50; real recruits at 0. */
  latentGrudge: number;
  /** For performative recruits: the calendar-day offset
   *  from recruitedAt at which the betrayal becomes
   *  scheduled. Real recruits: undefined. */
  betrayalEtaDays?: number;
}

export interface PerformativeRollInput {
  /** Player's currently-trained apprentice archetype. */
  playerArchetype: ApprenticeArchetype;
  /** The recruited Nemesis's archetype. */
  nemesisArchetype: ApprenticeArchetype;
  /** Was the recruit at high grudge (4-5) when they
   *  accepted? Performative recruits more likely to
   *  cloak themselves at high grudge. */
  grudgeTierAtRecruit: number;
  /** RNG draw 0..1 (deterministic source). */
  rng01: number;
}

/**
 * Roll: is this recruit performative?
 *
 *   - Base 25% (every recruit has a chance)
 *   - + 20% if grudgeTier was 4-5 at recruit
 *   - + 15% if archetype-pair compatibility was LOW
 *     (the chronicle distrusts low-compat conversions)
 *   - capped at 70%
 */
export function rollIsPerformative(input: PerformativeRollInput): boolean {
  let chance = 0.25;
  if (input.grudgeTierAtRecruit >= 4) chance += 0.20;
  const compat =
    NEMESIS_ARCHETYPE_BEHAVIORS[input.nemesisArchetype]?.recruitAffinityVector[
      input.playerArchetype
    ] ?? 3;
  if (compat <= 4) chance += 0.15;
  chance = Math.min(0.70, chance);
  return input.rng01 < chance;
}

/**
 * Build the initial loyalty state for a freshly-recruited
 * Nemesis.
 *
 * Performative recruits are pre-loaded with latent grudge
 * (50) and a betrayal ETA between 21 and 84 days (3-12
 * weeks; pseudo-random by RNG draw).
 */
export function buildInitialLoyaltyState(args: {
  nemesisId: string;
  recruitedAtIso: string;
  playerArchetype: ApprenticeArchetype;
  nemesisArchetype: ApprenticeArchetype;
  grudgeTierAtRecruit: number;
  performativeRng01: number;
  etaRng01: number;
}): RecruitLoyaltyState {
  const performative = rollIsPerformative({
    playerArchetype: args.playerArchetype,
    nemesisArchetype: args.nemesisArchetype,
    grudgeTierAtRecruit: args.grudgeTierAtRecruit,
    rng01: args.performativeRng01,
  });
  if (performative) {
    const etaDays = Math.floor(21 + args.etaRng01 * (84 - 21));
    return {
      nemesisId: args.nemesisId,
      recruitedAtIso: args.recruitedAtIso,
      mode: "performative",
      playerArchetype: args.playerArchetype,
      latentGrudge: 50,
      betrayalEtaDays: etaDays,
    };
  }
  return {
    nemesisId: args.nemesisId,
    recruitedAtIso: args.recruitedAtIso,
    mode: "real",
    playerArchetype: args.playerArchetype,
    latentGrudge: 0,
  };
}

export interface BetrayalEvalInput {
  state: RecruitLoyaltyState;
  /** Current ISO timestamp. */
  nowIso: string;
  /** Recent player choices that affect loyalty drift.
   *  -1 = recent betrayal-adjacent choice (insult, neglect),
   *  0 = neutral, +1 = mercy / acknowledgment. Caller
   *  computes the rolling average over the last N days. */
  recentMercyAverage: number;
  /** RNG draw for the betrayal-fired check. */
  rng01: number;
}

export interface BetrayalEvalResult {
  /** Did the recruit betray on this evaluation? */
  betrayed: boolean;
  /** Why? Either explicit ETA (performative) or
   *  cumulative grudge crossing the threshold (real). */
  reason: "performative_eta" | "cumulative_grudge" | null;
  /** Updated state to persist (latentGrudge may have
   *  drifted upward or downward). */
  nextState: RecruitLoyaltyState;
}

const REAL_GRUDGE_BETRAYAL_THRESHOLD = 90;

/** Daily evaluation function. Caller invokes once per
 *  Nemesis-read or once per day (whichever is sparser);
 *  pure function returns whether the recruit betrayed
 *  on this tick + the next state to persist. */
export function evaluateBetrayalTick(
  input: BetrayalEvalInput,
): BetrayalEvalResult {
  const recruitedAt = new Date(input.state.recruitedAtIso).getTime();
  const now = new Date(input.nowIso).getTime();
  const daysSince = Math.max(
    0,
    Math.floor((now - recruitedAt) / (24 * 60 * 60 * 1000)),
  );

  // Performative branch: explicit ETA. Always fires
  // when daysSince >= eta (the reformed-Nemesis was
  // counting down).
  if (input.state.mode === "performative") {
    const eta = input.state.betrayalEtaDays ?? 30;
    if (daysSince >= eta) {
      return {
        betrayed: true,
        reason: "performative_eta",
        nextState: input.state,
      };
    }
    return {
      betrayed: false,
      reason: null,
      nextState: input.state,
    };
  }

  // Real branch: drift latentGrudge by mercy average.
  // Negative mercy → +2/day; zero → +0.5/day baseline;
  // positive mercy → -1/day toward zero.
  const drift =
    input.recentMercyAverage < 0
      ? 2.0 - input.recentMercyAverage * 1.0 // -1 mercy → 3.0/day
      : input.recentMercyAverage > 0
        ? -1.0 - input.recentMercyAverage * 0.5
        : 0.5;
  const newLatent = Math.max(0, Math.min(100, input.state.latentGrudge + drift));
  const next = { ...input.state, latentGrudge: newLatent };

  if (newLatent >= REAL_GRUDGE_BETRAYAL_THRESHOLD) {
    // At the threshold, gate on a 30% RNG roll per check.
    if (input.rng01 < 0.30) {
      return {
        betrayed: true,
        reason: "cumulative_grudge",
        nextState: next,
      };
    }
  }
  return { betrayed: false, reason: null, nextState: next };
}

/** Display helper: how the chronicle frames a loyalty
 *  state for the player (HUD / Antiquarian's Journal). */
export function loyaltyChronicleNote(state: RecruitLoyaltyState): string {
  if (state.mode === "performative") {
    return (
      "This recruit's loyalty has the cadence of a long sentence — measured, " +
      "consistent, and ending somewhere the speaker has been pointing at all along. " +
      "The chronicle does not yet know where."
    );
  }
  if (state.latentGrudge < 20) {
    return "Loyal. The chronicle records nothing else.";
  }
  if (state.latentGrudge < 60) {
    return "Loyal. There is a beat between question and answer that did not used to be there.";
  }
  return (
    "The recruit is still here. The chronicle notes their punctuality and the way " +
    "they pause longer than necessary at certain words."
  );
}
