/* ═══════════════════════════════════════════════════════
   PVP ELO MATH (#7)

   Pure helpers shared between the server (writes new ratings on
   match end) and the client (renders projected MMR shifts on the
   match-found screen). Lives in apps/shared so both surfaces
   compute identical numbers without round-tripping through tRPC.

   Standard ELO formula:
     expected = 1 / (1 + 10^((opp - me) / 400))
     delta    = round(K * (score - expected))
       where score = 1 (win) or 0 (loss); K is the K-factor.

   K-factor:
     - 32 for new accounts (< 30 matches): faster convergence.
     - 16 for established accounts: lower volatility.
   This is the chess.com convention; tuning lives in this file
   alone so a balance pass is a single-file PR.
   ═══════════════════════════════════════════════════════ */

export const STARTING_MMR = 1200;
export const NEW_PLAYER_MATCH_THRESHOLD = 30;
export const K_FACTOR_NEW = 32;
export const K_FACTOR_ESTABLISHED = 16;

/** Compute the K-factor for a player based on their lifetime
 *  match count (wins + losses). New accounts converge fast; old
 *  accounts move predictably. */
export function kFactorFor(matchesPlayed: number): number {
  return matchesPlayed < NEW_PLAYER_MATCH_THRESHOLD
    ? K_FACTOR_NEW
    : K_FACTOR_ESTABLISHED;
}

/** Expected score for a player at `myMmr` against an opponent at
 *  `oppMmr`. Returns a value in [0, 1]: 0.5 = even, > 0.5 = favored. */
export function expectedScore(myMmr: number, oppMmr: number): number {
  return 1 / (1 + Math.pow(10, (oppMmr - myMmr) / 400));
}

/** Compute the integer MMR delta to apply after a match. Positive
 *  on win, negative on loss. Caller is responsible for clamping
 *  against any floor / ceiling (e.g. preventing MMR < 0). */
export function computeMmrDelta(opts: {
  myMmr: number;
  oppMmr: number;
  didWin: boolean;
  k?: number;
}): number {
  const { myMmr, oppMmr, didWin, k = K_FACTOR_ESTABLISHED } = opts;
  const expected = expectedScore(myMmr, oppMmr);
  const score = didWin ? 1 : 0;
  return Math.round(k * (score - expected));
}

/** Visible seasonal rank tiers. Each tier corresponds to an MMR
 *  band; the boundaries are deliberately wide so a typical player
 *  moves through 2–3 tiers per season. Mirrors the gold-silver-
 *  bronze cadence Hearthstone trained players to expect.
 *
 *  Tier 0 = bronze starting; tier 6 = master (no ceiling). */
export const SEASON_RANK_TIERS = [
  { tier: 0, name: "Bronze", minMmr: 0 },
  { tier: 1, name: "Silver", minMmr: 1100 },
  { tier: 2, name: "Gold", minMmr: 1300 },
  { tier: 3, name: "Platinum", minMmr: 1500 },
  { tier: 4, name: "Diamond", minMmr: 1700 },
  { tier: 5, name: "Master", minMmr: 1900 },
  { tier: 6, name: "Grandmaster", minMmr: 2100 },
] as const;

export type SeasonRankTier = (typeof SEASON_RANK_TIERS)[number];

/** Map an MMR value to its current visible rank tier. Always
 *  returns a tier (Bronze for negative or zero MMR — the writer
 *  paths clamp at 0 so this shouldn't happen, but defensive). */
export function rankTierForMmr(mmr: number): SeasonRankTier {
  // Walk descending so the highest matching tier wins.
  for (let i = SEASON_RANK_TIERS.length - 1; i >= 0; i--) {
    if (mmr >= SEASON_RANK_TIERS[i].minMmr) {
      return SEASON_RANK_TIERS[i];
    }
  }
  return SEASON_RANK_TIERS[0];
}

/** Convenience: derive the post-match shape both players need.
 *  Returns the deltas + new MMR + new tier for both winner and
 *  loser in one pure call. The producer (duelystWs.endMatch) uses
 *  this to compute the writes; the matchmaking screen uses the
 *  same call to preview "you'll gain ~X / lose ~Y". */
export interface MatchOutcomeInput {
  winnerMmr: number;
  winnerMatchesPlayed: number;
  loserMmr: number;
  loserMatchesPlayed: number;
  /** Floor below which MMR can't drop. Defaults to 0 (no negatives). */
  floor?: number;
}

export interface MatchOutcomeResult {
  winnerDelta: number;
  loserDelta: number;
  winnerNewMmr: number;
  loserNewMmr: number;
  winnerNewTier: SeasonRankTier;
  loserNewTier: SeasonRankTier;
}

export function computeMatchOutcome(
  input: MatchOutcomeInput,
): MatchOutcomeResult {
  const floor = input.floor ?? 0;
  const winnerK = kFactorFor(input.winnerMatchesPlayed);
  const loserK = kFactorFor(input.loserMatchesPlayed);

  const winnerDelta = computeMmrDelta({
    myMmr: input.winnerMmr,
    oppMmr: input.loserMmr,
    didWin: true,
    k: winnerK,
  });
  const loserDelta = computeMmrDelta({
    myMmr: input.loserMmr,
    oppMmr: input.winnerMmr,
    didWin: false,
    k: loserK,
  });

  const winnerNewMmr = Math.max(floor, input.winnerMmr + winnerDelta);
  const loserNewMmr = Math.max(floor, input.loserMmr + loserDelta);

  return {
    winnerDelta,
    loserDelta: loserNewMmr - input.loserMmr, // post-floor delta
    winnerNewMmr,
    loserNewMmr,
    winnerNewTier: rankTierForMmr(winnerNewMmr),
    loserNewTier: rankTierForMmr(loserNewMmr),
  };
}
