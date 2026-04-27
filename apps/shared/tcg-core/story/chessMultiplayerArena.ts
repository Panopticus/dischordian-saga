/**
 * Chess Multiplayer Arena — Game Master commentary for online
 * matches.
 *
 * In online play the Game Master is not the opponent — the
 * opponent is another human. The GM still narrates from the
 * sidelines, the way he did when he ran the academy chess
 * tournament. He greets the players before the match, marks
 * one or two notable moments mid-game, and closes out at
 * resolution.
 *
 * All pickers are pure deterministic functions seeded by the
 * gameId so a given match shows the same line on re-load. The
 * server emits the lines alongside the existing `game:start`
 * and `game:end` socket events.
 */

/* ═══════════════════════════════════════════════════════
   PRE-MATCH — fired when both players have joined and the
   board is set. Two flavors keyed off whether the GM
   recognizes the matchup (rated games) or treats it as a
   casual exhibition.
   ═══════════════════════════════════════════════════════ */

const PRE_MATCH_RATED: readonly string[] = Object.freeze([
  "Two real opponents at the same table. Rare — most chess in this universe is played against me, and I am only ever interesting to the people who have not yet beaten me. Sit. Shake. Begin.",
  "Rated match between two of you. The Architect logs these in his ledger; the ledger is very long and the entries that matter are very short. I will narrate two or three moments. Otherwise I am just an audience.",
  "Two contestants. One clock. The handshake at the beginning of a game is a contract — neither of you knows what the contract says, but you both signed it. Play.",
]);

const PRE_MATCH_CASUAL: readonly string[] = Object.freeze([
  "Casual game, no stakes. The kind of game in which actual learning happens, because the fear is off the board. Begin whenever you are ready.",
  "Friendly match. The Architect does not record these. I do, but I have nowhere to file them. Play freely.",
  "A casual sit-down. Most of the chess that has ever mattered was played in casual rooms after the tournament hall closed. Be one of those rooms.",
]);

/** Pick a pre-match line for a multiplayer match. `rated` selects
 *  the register; `seed` is the deterministic stable hash. */
export function pickMultiplayerPreMatchLine(
  rated: boolean,
  seed: number,
): string {
  const lines = rated ? PRE_MATCH_RATED : PRE_MATCH_CASUAL;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

/* ═══════════════════════════════════════════════════════
   POST-MATCH — fired on `game:end`. One line per
   recognized result reason. The server passes through the
   reason it already computed (checkmate / resignation /
   agreement / repetition / insufficient_material / timeout /
   stalemate). Any unknown reason falls through to a generic
   close.
   ═══════════════════════════════════════════════════════ */

export type MultiplayerEndReason =
  | "checkmate"
  | "resignation"
  | "agreement"
  | "repetition"
  | "insufficient_material"
  | "timeout"
  | "stalemate";

const POST_BY_REASON: Readonly<Record<MultiplayerEndReason, readonly string[]>> =
  Object.freeze({
    checkmate: [
      "Mate. The position ran out of squares for the losing king and the game stopped because the rules said it had to. Both of you played a complete game; only one of you played the LAST move of it. Stand for a moment before clicking through.",
      "Checkmate has landed. The winning move is in the database now; the losing player will replay this position on a quiet evening sometime in the next eleven days, and they will see the resource they did not see today, and the seeing will be the lesson. That is how chess pays itself back.",
      "Mate at the end of an honest game. I will mark it in my book the way I mark all of them — with the names, the time control, and a single word that I will not share with either of you because the word is between me and the page.",
    ],
    resignation: [
      "Resignation. The losing player saw something the winner had not yet shown them. Saving the courtesy of the final move is itself a courtesy — both directions. Well played, both of you.",
      "A resignation handshake. Most amateurs play the position out three moves too long. You did not. The decision to stop is itself a position, and you read it correctly.",
      "Tipped king. Carry the resignation lightly — every player in the upper rating bands has resigned more games than they have won, by a significant margin. It is the shape of the discipline.",
    ],
    agreement: [
      "Drawn by agreement. Two players, neither blinking, both correctly reading the position as drawn — that is rarer than most beginners think. Half a point each. The next match is not against each other, it is against the temptation to push for a win in a drawn position.",
      "A drawn handshake. The position said draw, both of you agreed with the position, and neither of you tried to fool the other into a worse evaluation of it. That is the polite reading of integrity in chess.",
      "Half-point each. The Architect's ledger does not love draws — they don't move ratings much — but the draws are where my generation learned the position more deeply. Note this one.",
    ],
    repetition: [
      "Threefold repetition. The position decided to be a draw before either of you did, and you both honored its decision by not breaking the symmetry. The rule is older than any of us. It still wins arguments.",
      "Drawn by repetition. The same position appeared three times with the same player to move — the rules cleanly intervene. There is something almost relieving about a draw the rulebook itself imposes.",
    ],
    insufficient_material: [
      "Insufficient material. Neither side has the pieces to deliver mate against optimal defense, so the result is fixed before the moves are. Half a point each.",
      "The board has run out of weapons. A draw by the bare definition — neither king can be checkmated. The rule that ends the game here is one of the cleaner ones in chess.",
    ],
    timeout: [
      "Flag fall. The clock decided the result. Time is part of the game; it does not make the game smaller. Both of you played; one of you ran out of seconds.",
      "Timeout. The position on the board may have favored either of you — the clock did not care. Bring more time-management discipline to the next match.",
      "Flag. A loss on the clock is still a loss; a win on the clock is still a win. The Architect's ledger does not distinguish.",
    ],
    stalemate: [
      "Stalemate. The losing position reached out and made itself a draw. The stronger side will replay this and see what they should have done differently in the king-and-pawn endgame. The weaker side will count the half-point as a small win.",
      "Drawn by stalemate. A reminder: stalemate is a DRAW, not a win. Many beginners forget. Neither of you, evidently. Note the discipline.",
    ],
  });

const POST_GENERIC: readonly string[] = Object.freeze([
  "Game ends. The position has settled. I will note the result in my book and move on to the next table.",
]);

/** Pick a post-match commentary line for a multiplayer match end.
 *  Returns the generic fallback for any unrecognized reason. */
export function pickMultiplayerEndLine(
  reason: string,
  seed: number,
): string {
  const known = POST_BY_REASON[reason as MultiplayerEndReason];
  const lines = known ?? POST_GENERIC;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

/** Stable 32-bit hash for seeding multiplayer commentary lines.
 *  Mirrors `hashString` from chessReviewNarration so we don't have
 *  a server-side import dependency on a client-tagged module. */
export function hashMultiplayerSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
