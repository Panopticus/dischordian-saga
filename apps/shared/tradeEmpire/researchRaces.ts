// apps/shared/tradeEmpire/researchRaces.ts
//
// Research races — Phase D.5 of the Lore-Aligned Galactic-Empire
// Overhaul. Pure helpers that decide rival-NPC behaviour when the
// player starts a tech.
//
// Players who idle on research now feel competitive pressure: the
// world *might* finish first. Pure functions; the server router
// consumes these to decide pacing.

import type { SubHouseKey } from "./houses";

/** RNG-injectable rival picker. */
export function pickResearchRival(
  techKey: string,
  rng: () => number = Math.random,
): SubHouseKey {
  // Phase D.5 keeps the rival pool small and bible-faithful.
  // Each tech could in future declare a preferred rival; for now we
  // weight evenly across the four most-active research-y houses.
  const pool: SubHouseKey[] = [
    "antiquarian_shelfmates",
    "ae_architects_court",
    "hierarchy_research_and_development",
    "insurgency_zero_doctrine",
  ];
  void techKey; // unused for now; weight by techKey in a future pass
  return pool[Math.floor(rng() * pool.length)];
}

/** Compute a rival deadline given the player's expected completion. */
export function pickRivalDeadlineMs(args: {
  playerExpectedCompletionMs: number;
  rng?: () => number;
}): number {
  const rng = args.rng ?? Math.random;
  // Rival finishes at 70-110% of the player's expected time.
  // 30% chance the rival actually beats the player.
  const factor = 0.7 + rng() * 0.4;
  return Math.round(args.playerExpectedCompletionMs * factor);
}

/**
 * Resolve a race given the player's actual completion time and the
 * rival deadline. Returns the winner.
 */
export function resolveRace(args: {
  playerCompletionMs: number;
  rivalDeadlineMs: number;
}): "player_won" | "rival_won" {
  return args.playerCompletionMs <= args.rivalDeadlineMs ? "player_won" : "rival_won";
}

/** Reward multiplier for the player based on race outcome. */
export function rewardMultiplierForRaceOutcome(
  outcome: "player_won" | "rival_won",
): number {
  return outcome === "player_won" ? 1 : 0.8;
}
