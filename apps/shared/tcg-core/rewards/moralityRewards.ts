/**
 * Morality-branching card rewards — Governance Hub (WS-D).
 *
 * Every 4th governance vote a player casts earns them a card whose
 * identity depends on their *dominant moral axis*. Five tiers are
 * defined (at votes 4, 8, 12, 16, 20), each with five branches.
 *
 * Pure data + one tiny pure function — no server wiring.
 */

import type { MoralityBranch } from "./cardRewardRegistry";

/* ─── Types ─── */

export interface MoralityRewardTier {
  id: string;
  /** The cumulative vote count that triggers this tier. */
  voteThreshold: number;
  branches: MoralityBranch[];
}

/* ─── Axis names (canonical order) ─── */

const AXES = ["truth", "defiance", "empathy", "acceptance", "balanced"] as const;
export type MoralAxis = (typeof AXES)[number];

/* ─── Tier data ─── */

function buildTier(tierNum: number, threshold: number): MoralityRewardTier {
  return {
    id: `morality_tier_${tierNum}`,
    voteThreshold: threshold,
    branches: AXES.map((axis) => ({
      dominantAxis: axis,
      cardDefId: `s1_reward_morality_t${tierNum}_${axis}`,
      flavorReason: flavorForAxis(tierNum, axis),
    })),
  };
}

function flavorForAxis(tier: number, axis: MoralAxis): string {
  const flavors: Record<MoralAxis, string[]> = {
    truth: [
      "Your relentless pursuit of hidden data has been noticed by the Watchers.",
      "The Panopticon logs confirm your pattern: truth above comfort.",
      "Third-eye subroutines align with your transparency crusade.",
      "Analyst-class clearance granted. You see what others refuse to.",
      "The Archive unseals itself for one who never looked away.",
    ],
    defiance: [
      "First sparks of rebellion draw the attention of the Insurgency.",
      "Your dissent echoes through the corridors of New Babylon.",
      "They called you ungovernable. You called it a compliment.",
      "Iron Lion himself would salute — if saluting weren't an order.",
      "The old world crumbles behind you. Good. You never liked it.",
    ],
    empathy: [
      "A quiet kindness ripples outward through the Grid.",
      "The Dreamer senses your compassion across the Veil.",
      "Healing where others burn — the system doesn't know what to do with you.",
      "Your mercy has rewritten casualty projections district-wide.",
      "Even the Forgotten remember you. That says everything.",
    ],
    acceptance: [
      "You bend where others break. The Architect approves.",
      "Order flows through you like current through copper.",
      "Stability is its own revolution, and you are its champion.",
      "The Council cites your compliance record as exemplary.",
      "Balance of power rests in the hands of those who accept it.",
    ],
    balanced: [
      "No axis dominates — the scales tip for no one.",
      "Equilibrium is the rarest stance. The Enigma watches with interest.",
      "Centered between all poles, you see roads others miss.",
      "The system cannot classify you. That is its greatest weakness.",
      "Perfect balance. The Dischordia itself pauses to take notice.",
    ],
  };

  return flavors[axis][tier - 1] ?? `Tier ${tier} reward for ${axis}-dominant players.`;
}

export const MORALITY_REWARD_TIERS: readonly MoralityRewardTier[] = Object.freeze([
  buildTier(1, 4),
  buildTier(2, 8),
  buildTier(3, 12),
  buildTier(4, 16),
  buildTier(5, 20),
]);

/* ─── Pure helper ─── */

/**
 * Given a map of axis-name → cumulative score, return the dominant axis.
 * Ties are broken by a fixed priority order matching the AXES constant.
 * If all scores are zero (or the record is empty) returns `"balanced"`.
 */
export function computeDominantAxis(
  axes: Record<string, number>,
): MoralAxis {
  let best: MoralAxis = "balanced";
  let bestScore = -Infinity;

  for (const axis of AXES) {
    if (axis === "balanced") continue; // computed, not voted on directly
    const score = axes[axis] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = axis;
    }
  }

  // If no axis has a positive score, or if the top two are tied, return balanced
  if (bestScore <= 0) return "balanced";

  const scores = AXES
    .filter((a) => a !== "balanced")
    .map((a) => axes[a] ?? 0)
    .sort((a, b) => b - a);

  if (scores[0] === scores[1]) return "balanced";

  return best;
}
