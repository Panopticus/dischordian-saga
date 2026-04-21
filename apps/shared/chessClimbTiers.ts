/**
 * Chess Climb — escalating stakes ladder.
 *
 * Per the design plan, the chess Arena starts purely tonal (Tier 0:
 * dread without mechanical penalty). After the player beats the
 * Tier 0 Game Master in a best-of-3, they unlock Tier 1, where
 * losses cost ELO. Beat Tier 1 best-of-3 → Tier 2 (24h mode
 * lockout on loss; consumable mint on win). Beat Tier 2 best-of-3
 * → Tier 3 (the Labyrinth Wager — Mol'Garath at the audience).
 *
 * The ladder is voluntary and advertised. The corrupted Game
 * Master reads the next tier's offer from a clipboard like a
 * reality-show host. Player can decline at any tier without
 * penalty; Tier 0 stays free play forever.
 *
 * This module is pure data + predicates. The server router
 * (`apps/server/routers/chess.ts.startClimb` etc.) consumes it.
 */

export const CHESS_CLIMB_TIER_IDS = [
  "tier_0_exhibition",
  "tier_1_wagered",
  "tier_2_hierarchy_table",
  "tier_3_labyrinth_wager",
] as const;

export type ChessClimbTierId = (typeof CHESS_CLIMB_TIER_IDS)[number];

export type ClimbStakeKind =
  | "none"
  | "elo_demotion"
  | "mode_lockout_24h"
  | "streak_reset";

export type ClimbRewardKind =
  | "none"
  | "elo_promotion"
  | "annotated_knight_consumable"
  | "labyrinth_epilogue_unlock";

/** Static, frozen description of a climb tier. */
export interface ChessClimbTier {
  id: ChessClimbTierId;
  /** 0-indexed numeric rank for ordering and storage. */
  rank: number;
  title: string;
  /** Short, in-world tagline shown on the tier-selection card. */
  tagline: string;
  /** What happens when you LOSE the best-of-3 series at this tier. */
  lossStakes: readonly ClimbStakeKind[];
  /** What you receive when you WIN the best-of-3 series. */
  winRewards: readonly ClimbRewardKind[];
  /** AI difficulty in the existing chess router's tier scale.
   *  Tier 0 = standard game_master strength. Higher tiers crank
   *  the AI a notch each time. */
  aiDifficulty: number;
  /** Does winning this tier unlock the next? (Tier 3 is the top —
   *  no further tier to unlock, only the epilogue.) */
  unlocksNextTier: boolean;
}

export const CHESS_CLIMB_TIERS: Readonly<Record<ChessClimbTierId, ChessClimbTier>> =
  Object.freeze({
    tier_0_exhibition: {
      id: "tier_0_exhibition",
      rank: 0,
      title: "Exhibition",
      tagline:
        "The free show. Clone-termination is a joke. The keepsake leaks through anyway.",
      lossStakes: ["none"],
      winRewards: ["none"],
      aiDifficulty: 8,
      unlocksNextTier: true,
    },
    tier_1_wagered: {
      id: "tier_1_wagered",
      rank: 1,
      title: "Wagered",
      tagline:
        "Xeth'Raal drafted my contract. You are drafting yours. Lose and the ladder takes a tier from you.",
      lossStakes: ["elo_demotion"],
      winRewards: ["elo_promotion"],
      aiDifficulty: 9,
      unlocksNextTier: true,
    },
    tier_2_hierarchy_table: {
      id: "tier_2_hierarchy_table",
      rank: 2,
      title: "The Hierarchy's Table",
      tagline:
        "The board is older than the Empire. The demons watch. The Goggles are on the table.",
      lossStakes: ["mode_lockout_24h"],
      winRewards: ["annotated_knight_consumable"],
      aiDifficulty: 10,
      unlocksNextTier: true,
    },
    tier_3_labyrinth_wager: {
      id: "tier_3_labyrinth_wager",
      rank: 3,
      title: "The Labyrinth Wager",
      tagline:
        "Mol'Garath sits at the head of the audience. The Game Master is visibly cheerful. This is the game he wanted to build for you.",
      lossStakes: ["streak_reset"],
      winRewards: ["labyrinth_epilogue_unlock"],
      aiDifficulty: 10,
      unlocksNextTier: false,
    },
  });

/** The ordered tier list — useful for iteration and rank lookup. */
export const CHESS_CLIMB_TIER_LIST: readonly ChessClimbTier[] = Object.freeze(
  CHESS_CLIMB_TIER_IDS.map((id) => CHESS_CLIMB_TIERS[id]),
);

/** Which tiers a player has unlocked, given their highest-cleared
 *  tier rank and whether they have completed Gate 4.5 (required
 *  for Tier 3). Tier 0 is always available; subsequent tiers
 *  require beating the previous; Tier 3 also requires the
 *  Prince's Game gate. */
export function getUnlockedClimbTiers(input: {
  highestClearedRank: number; // -1 if the player has never won a climb
  princesGameCompleted: boolean;
}): readonly ChessClimbTier[] {
  const out: ChessClimbTier[] = [];
  for (const tier of CHESS_CLIMB_TIER_LIST) {
    if (tier.rank === 0) {
      out.push(tier);
      continue;
    }
    // Climbs unlock by clearing the previous rank.
    if (tier.rank > input.highestClearedRank + 1) break;
    // Tier 3 additionally gates on the Prince's Game.
    if (tier.id === "tier_3_labyrinth_wager" && !input.princesGameCompleted) {
      break;
    }
    out.push(tier);
  }
  return out;
}

/** Predicate: is this tier currently selectable for a player? */
export function isClimbTierUnlocked(
  tierId: ChessClimbTierId,
  input: {
    highestClearedRank: number;
    princesGameCompleted: boolean;
  },
): boolean {
  return getUnlockedClimbTiers(input).some((t) => t.id === tierId);
}

/** Best-of-3 series outcome derived from individual game results.
 *  A series ends as soon as one side has 2 wins; ongoing if
 *  neither side has reached 2. Draws count as half-points to
 *  preserve standard chess scoring; a player needs 2 full wins
 *  to win the series, so 1.5 means the series continues. */
export type ClimbSeriesOutcome = "ongoing" | "won" | "lost";

export function evaluateClimbSeries(
  gameResults: readonly ("win" | "loss" | "draw")[],
): ClimbSeriesOutcome {
  let playerScore = 0;
  let opponentScore = 0;
  for (const r of gameResults) {
    if (r === "win") playerScore += 1;
    else if (r === "loss") opponentScore += 1;
    else {
      playerScore += 0.5;
      opponentScore += 0.5;
    }
  }
  if (playerScore >= 2) return "won";
  if (opponentScore >= 2) return "lost";
  return "ongoing";
}
