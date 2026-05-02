/**
 * Client-side wrapper around `pickGateFlags` from
 * apps/shared/epochWitnessVotes.ts. Returns just the slice of the
 * player's narrativeFlags that any Epoch Witness vote's `lockedUntil`
 * references — typically <= 30 keys vs. the few hundred a long-lived
 * GameContext can accumulate.
 *
 * Every call to `trpc.epochWitness.castVote` and
 * `trpc.epochWitness.getUnlockedVotesForEpoch` should pass the result
 * of this helper (not the raw narrativeFlags map) so we don't ship a
 * huge JSON payload over the wire on every vote.
 */
import {
  AGE_OF_PRIVACY_VOTES,
  AGE_OF_PROPHECY_VOTES,
  pickGateFlags,
  type NexusPointVote,
} from "@shared/epochWitnessVotes";
import {
  AGE_OF_INSURGENCY_VOTES,
  AGE_OF_REVELATION_VOTES,
  FALL_OF_REALITY_VOTES,
} from "@shared/epochWitnessVotesLate";

const ALL_VOTES: ReadonlyArray<NexusPointVote> = [
  ...AGE_OF_PRIVACY_VOTES,
  ...AGE_OF_PROPHECY_VOTES,
  ...AGE_OF_INSURGENCY_VOTES,
  ...AGE_OF_REVELATION_VOTES,
  ...FALL_OF_REALITY_VOTES,
];

export function pickEpochWitnessGateFlags(
  narrativeFlags: Record<string, boolean> | undefined,
): Record<string, boolean> {
  return pickGateFlags(narrativeFlags, ALL_VOTES);
}
