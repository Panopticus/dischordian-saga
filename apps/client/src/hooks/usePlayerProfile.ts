/**
 * Read the player's psychological profile reactively.
 *
 * Thin wrapper around `trpc.playerProfile.getProfile` that returns
 * a neutral profile while loading (so consumers never need to
 * branch on undefined). The neutral profile is the same shape the
 * server returns for first-time users — see
 * `apps/shared/playerProfile.ts.emptyProfile`.
 *
 * Usage:
 *   const profile = usePlayerProfile();
 *   const blurb = getProfileBlurb("aggression", profile);
 */
import { trpc } from "../lib/trpc";
import { emptyProfile, type PlayerProfile } from "@shared/playerProfile";

export function usePlayerProfile(): PlayerProfile {
  const q = trpc.playerProfile.getProfile.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  return q.data ?? emptyProfile();
}

/** Same as usePlayerProfile() but also exposes the loading and
 *  error states for callers that want to gate UI on them (e.g.
 *  the Self-Portrait page itself). */
export function usePlayerProfileQuery() {
  return trpc.playerProfile.getProfile.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
