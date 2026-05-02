/* ═══════════════════════════════════════════════════════
   APERTURE — derived "Order ↔ Dream" balance score.

   Pure function. No persistence, no schema. Aggregates the
   player's profile, narrative flags, and recent governance vote
   history into a single −100..+100 axis the governance hub renders
   as a horizontal iris.

   Scale:
     -100  fully OPEN — Look-Away dominant. Reality drifts.
        0  balanced — chamber undecided.
     +100  fully CLOSED — Confirm dominant. Reality stiffens.

   Re-computed on every read; intentionally cheap. Slice 3 wires
   it under the Reality Front Meter; future epochs may promote it
   to a persisted axis if playtesting shows the derived signal is
   too noisy.
   ═══════════════════════════════════════════════════════ */

import type { PlayerProfile } from "./playerProfile";

/** Vote outcomes the player has cast, in the form the dispatcher
 *  records them. Only `confirm` / `look_away` framings move the
 *  meter; `neutral` is silent. */
export interface ApertureVoteHistoryEntry {
  framing: "confirm" | "look_away" | "neutral";
  /** When the vote was cast. Used for time-decay weighting —
   *  recent votes count more than old ones. */
  castAt?: number | null;
}

export interface ApertureInputs {
  profile?: Pick<PlayerProfile, "conformity"> | null;
  /** Subset of narrativeFlags that influence the aperture. The
   *  caller passes only the keys it knows about; unknown flags
   *  contribute nothing. */
  narrativeFlags?: Readonly<Record<string, boolean>>;
  /** Player's own governance casts. Aggregate count + decay
   *  contributes a max of ±30 to the score. */
  voteHistory?: ReadonlyArray<ApertureVoteHistoryEntry>;
  /** Optional global tally — if provided, contributes a max of
   *  ±25 weighted by participation. The community drift, not the
   *  player's, but the player's chamber feels tighter when the
   *  community has stiffened. */
  globalTally?: { confirm: number; lookAway: number } | null;
  /** "Now" timestamp for time-decay. Defaults to Date.now(). */
  now?: number;
}

const HALF_LIFE_MS = 7 * 24 * 60 * 60 * 1000; // one week

function decayWeight(castAt: number | null | undefined, now: number): number {
  if (!castAt) return 1;
  const age = Math.max(0, now - castAt);
  return Math.pow(0.5, age / HALF_LIFE_MS);
}

/** Compute the aperture score in −100..+100 range. Pure. */
export function computeAperture(inputs: ApertureInputs = {}): number {
  const now = inputs.now ?? Date.now();

  // Baseline from conformity (-100..+100 → max ±40 contribution).
  const conformity = inputs.profile?.conformity ?? 0;
  let score = (conformity / 100) * 40;

  // Vote-history contribution (max ±30, weighted by decay).
  const history = inputs.voteHistory ?? [];
  if (history.length > 0) {
    let weighted = 0;
    let totalWeight = 0;
    for (const entry of history) {
      if (entry.framing === "neutral") continue;
      const w = decayWeight(entry.castAt ?? null, now);
      const sign = entry.framing === "confirm" ? 1 : -1;
      weighted += sign * w;
      totalWeight += w;
    }
    if (totalWeight > 0) {
      score += (weighted / totalWeight) * 30;
    }
  }

  // Narrative-flag contribution (small, additive).
  const flags = inputs.narrativeFlags ?? {};
  if (flags["vote_zero_eye_response_confirmed"]) score += 5;
  if (flags["vote_zero_eye_response_looked_away"]) score -= 5;
  if (flags["vote_zero_recanted"]) score -= 3;
  if (flags["vote_zero_reaffirmed"]) score += 3;

  // Global-tally contribution (max ±25). Only fires when the
  // community has spoken in non-trivial numbers.
  const tally = inputs.globalTally;
  if (tally) {
    const total = tally.confirm + tally.lookAway;
    if (total >= 5) {
      const ratio = (tally.confirm - tally.lookAway) / total; // -1..+1
      // Scale by participation factor — bigger N moves the dial more.
      const participation = Math.min(1, total / 1000);
      score += ratio * 25 * (0.4 + 0.6 * participation);
    }
  }

  return Math.max(-100, Math.min(100, score));
}

/** Six bands matching the Architect's commentary tally bands.
 *  Used to render tick-mark labels under the meter. */
export type ApertureBand =
  | "open_overwhelming"
  | "open_strong"
  | "open_narrow"
  | "closed_narrow"
  | "closed_strong"
  | "closed_overwhelming";

export function apertureBand(score: number): ApertureBand {
  if (score >= 60) return "closed_overwhelming";
  if (score >= 30) return "closed_strong";
  if (score >= 0) return "closed_narrow";
  if (score >= -30) return "open_narrow";
  if (score >= -60) return "open_strong";
  return "open_overwhelming";
}
