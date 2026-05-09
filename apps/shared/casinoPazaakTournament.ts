/* ═══════════════════════════════════════════════════════
   PAZAAK TOURNAMENT — 4-player single-elimination bracket
   audit/16 PR 3 — engagement loop

   Skill-based daily competition layered on top of the
   existing pure playPazaak21() logic. One tournament per
   UTC day; entry fee 200D; prize pool 800D (1st) + 200D
   (2nd). Server-deterministic via seeded RNG so brackets
   are auditable.

   Tournament shape:
     Round 1 (semis): player vs AI_OPPONENTS[0]
                      AI_OPPONENTS[1] vs AI_OPPONENTS[2]
     Round 2 (final): round-1 winners face off

   Each round runs playPazaak21() once per side; winner
   is the highest non-bust total. Ties go to the dealer's
   choice (player on the player-vs-AI matchups; first AI
   in the AI-vs-AI matchup) — matches the real-world
   "house wins ties" precedent for the casino setting.
   ═══════════════════════════════════════════════════════ */

import { createRng, playPazaak21 } from "./casinoGames";

export const PAZAAK_TOURNAMENT_ENTRY_FEE = 200;
export const PAZAAK_TOURNAMENT_FIRST_PRIZE = 800;
export const PAZAAK_TOURNAMENT_SECOND_PRIZE = 200;

export interface PazaakAiOpponent {
  id: string;
  name: string;
  /** Stand value the AI draws to. Lower = more aggressive
   *  (busts more often, but wins higher when it lands). */
  stand: number;
  /** Lore flavour blurb shown in the tournament UI. */
  archetype: string;
}

/** Three named AI opponents with distinct strategy profiles.
 *  Stands chosen so the bracket is lossy on average — the
 *  player can't always win by always standing at 18; the
 *  Engineer's 17-stand and the Smuggler's 19-stand mean any
 *  player target gets hard-counterd by at least one AI. */
export const PAZAAK_AI_OPPONENTS: readonly PazaakAiOpponent[] = [
  {
    id: "ai_engineer",
    name: "The Engineer",
    stand: 17,
    archetype: "Plays the math. Stands early; wins on dealer busts.",
  },
  {
    id: "ai_grifter",
    name: "The Grifter",
    stand: 18,
    archetype: "Splits the difference. Mid-range stand; mid-range outcome.",
  },
  {
    id: "ai_smuggler",
    name: "The Smuggler",
    stand: 19,
    archetype: "Pushes hard. Higher bust rate, but crushes timid stands.",
  },
] as const;

/** Result of one Pazaak round in the tournament. */
export interface PazaakRoundResult {
  /** Side A's stand value + final score + bust state. */
  a: { name: string; stand: number; total: number; bust: boolean };
  /** Side B's analogous payload. */
  b: { name: string; stand: number; total: number; bust: boolean };
  /** Winner side ("a" or "b"); ties resolve to "a" (house edge). */
  winner: "a" | "b";
}

export interface PazaakTournamentResult {
  semi1: PazaakRoundResult;
  semi2: PazaakRoundResult;
  final: PazaakRoundResult;
  /** 1 = champion, 2 = runner-up, 3 = lost in semis. */
  playerPlace: 1 | 2 | 3;
  /** Dream awarded — entry fee NOT subtracted; the caller
   *  has already debited 200D when entering. */
  prize: number;
  /** Echo of the entry seed for replay determinism. */
  seed: string;
}

/** Run one round given two stand values + a deterministic seed.
 *  Side A is the "house side" for tie-resolution purposes (the
 *  caller is responsible for putting the player on side A in
 *  player-vs-AI matchups so ties go in the player's favour —
 *  the casino setting reverses the usual house-edge convention
 *  for the player's first appearance to keep entry-cost wins
 *  reachable). */
export function runPazaakTournamentRound(
  aName: string, aStand: number,
  bName: string, bStand: number,
  seed: string,
): PazaakRoundResult {
  const rng = createRng(seed);
  // Note: bet doesn't matter for the comparison — we discard
  // the payout. The tournament prize is fixed; we only care
  // about who beat whom.
  const aResult = playPazaak21(1, aStand, rng);
  const bResult = playPazaak21(1, bStand, rng);
  const aDetail = aResult.detail as { player: number; playerBust: boolean };
  const bDetail = bResult.detail as { player: number; playerBust: boolean };

  let winner: "a" | "b";
  if (aDetail.playerBust && bDetail.playerBust) {
    // Both bust — house wins (side a).
    winner = "a";
  } else if (aDetail.playerBust) {
    winner = "b";
  } else if (bDetail.playerBust) {
    winner = "a";
  } else if (aDetail.player > bDetail.player) {
    winner = "a";
  } else if (bDetail.player > aDetail.player) {
    winner = "b";
  } else {
    // Tie — house side wins.
    winner = "a";
  }

  return {
    a: { name: aName, stand: aStand, total: aDetail.player, bust: aDetail.playerBust },
    b: { name: bName, stand: bStand, total: bDetail.player, bust: bDetail.playerBust },
    winner,
  };
}

/** Run the full 4-player bracket. Player is always seeded into
 *  side A of semi 1 so ties favour the player against AI; the
 *  AI-vs-AI semi 2 has the lower-stand AI in side A (engineer at
 *  17 vs grifter at 18, grifter at 18 vs smuggler at 19). */
export function runPazaakTournament(
  playerName: string,
  playerStand: number,
  seed: string,
): PazaakTournamentResult {
  const [ai1, ai2, ai3] = PAZAAK_AI_OPPONENTS;
  if (!ai1 || !ai2 || !ai3) throw new Error("PAZAAK_AI_OPPONENTS underpopulated");

  // Semi 1: Player (side A — ties favour the player) vs Engineer
  const semi1 = runPazaakTournamentRound(
    playerName, playerStand, ai1.name, ai1.stand, `${seed}:semi1`,
  );
  // Semi 2: Grifter vs Smuggler (Grifter on side A — lower stand)
  const semi2 = runPazaakTournamentRound(
    ai2.name, ai2.stand, ai3.name, ai3.stand, `${seed}:semi2`,
  );

  // Determine semi-1 winner (player or Engineer).
  const semi1Winner = semi1.winner === "a"
    ? { name: playerName, stand: playerStand, isPlayer: true }
    : { name: ai1.name, stand: ai1.stand, isPlayer: false };
  const semi2Winner = semi2.winner === "a"
    ? { name: ai2.name, stand: ai2.stand, isPlayer: false }
    : { name: ai3.name, stand: ai3.stand, isPlayer: false };

  // Final — semi-1 winner on side A so ties continue to favour
  // the player when they're the side-A finalist.
  const final = runPazaakTournamentRound(
    semi1Winner.name, semi1Winner.stand,
    semi2Winner.name, semi2Winner.stand,
    `${seed}:final`,
  );

  let playerPlace: 1 | 2 | 3;
  let prize: number;
  if (!semi1Winner.isPlayer) {
    // Player lost in the semi.
    playerPlace = 3;
    prize = 0;
  } else if (final.winner === "a") {
    // Player won the final.
    playerPlace = 1;
    prize = PAZAAK_TOURNAMENT_FIRST_PRIZE;
  } else {
    // Player lost the final.
    playerPlace = 2;
    prize = PAZAAK_TOURNAMENT_SECOND_PRIZE;
  }

  return { semi1, semi2, final, playerPlace, prize, seed };
}
