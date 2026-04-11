/* ═══════════════════════════════════════════════════════
   CASINO ACHIEVEMENT EVALUATOR — pure function tests

   Exercises evaluateCasinoAchievements in isolation from
   the tRPC router and the database. Every achievement in
   CASINO_ACHIEVEMENTS that has a deterministic trigger
   condition gets a happy-path test here.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import { evaluateCasinoAchievements } from "./routers/casino";

function baseState(overrides: Partial<Parameters<typeof evaluateCasinoAchievements>[0]["state"]> = {}) {
  return {
    totalWagered: 0,
    totalWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalBetsPlaced: 0,
    gamesPlayed: {},
    ...overrides,
  };
}

function baseArgs(
  overrides: Partial<Parameters<typeof evaluateCasinoAchievements>[0]> = {},
): Parameters<typeof evaluateCasinoAchievements>[0] {
  return {
    game: "void_slots",
    bet: 10,
    result: { won: false, payout: 0, jackpot: false, detail: {} },
    state: baseState(),
    previousBestStreak: 0,
    previousTotalWon: 0,
    previousTotalWagered: 0,
    previousVipLevel: 0,
    vipLevel: 0,
    ...overrides,
  };
}

describe("evaluateCasinoAchievements — crossing thresholds", () => {
  it("grants first_bet on the user's first winning spin", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 50, jackpot: false, detail: {} },
      state: baseState({ totalWon: 50, totalWagered: 10, totalBetsPlaced: 1 }),
      previousTotalWon: 0,
    }));
    expect(earned).toContain("first_bet");
  });

  it("does NOT re-grant first_bet after subsequent wins", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 20, jackpot: false, detail: {} },
      state: baseState({ totalWon: 70, totalWagered: 40, totalBetsPlaced: 3 }),
      previousTotalWon: 50, // already had a prior win
    }));
    expect(earned).not.toContain("first_bet");
  });

  it("grants high_roller only on the turn that crosses 1000 wagered", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      bet: 100,
      state: baseState({ totalWagered: 1050 }),
      previousTotalWagered: 950,
    }));
    expect(earned).toContain("high_roller");
  });

  it("does not grant high_roller a second time", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      bet: 10,
      state: baseState({ totalWagered: 2000 }),
      previousTotalWagered: 1990,
    }));
    expect(earned).not.toContain("high_roller");
  });

  it("grants streak_5 when the streak crosses 5", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 10, jackpot: false, detail: {} },
      state: baseState({ currentStreak: 5, bestStreak: 5 }),
      previousBestStreak: 4,
    }));
    expect(earned).toContain("streak_5");
  });

  it("grants degens_chosen when the streak crosses 10", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 10, jackpot: false, detail: {} },
      state: baseState({ currentStreak: 10, bestStreak: 10 }),
      previousBestStreak: 9,
    }));
    expect(earned).toContain("degens_chosen");
  });

  it("grants jackpot on any jackpot hit", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 5000, jackpot: true, detail: {} },
    }));
    expect(earned).toContain("jackpot");
  });

  it("grants vip_3 on the turn VIP level first reaches 3", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      previousVipLevel: 2,
      vipLevel: 3,
    }));
    expect(earned).toContain("vip_3");
  });

  it("grants whale on the turn VIP level first reaches 5", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      previousVipLevel: 4,
      vipLevel: 5,
    }));
    expect(earned).toContain("whale");
  });

  it("grants house_loses when lifetime won crosses 10,000", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      result: { won: true, payout: 100, jackpot: false, detail: {} },
      state: baseState({ totalWon: 10_050 }),
      previousTotalWon: 9_950,
    }));
    expect(earned).toContain("house_loses");
  });

  it("grants all_in when betting the game's maximum", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "void_slots",
      bet: 100, // void_slots max
    }));
    expect(earned).toContain("all_in");
  });

  it("grants all_games after playing all 15 distinct games", () => {
    const played: Record<string, number> = {};
    for (const g of [
      "void_slots", "entropy_dice", "nebula_poker", "quantum_roulette",
      "pazaak_21", "high_low", "scratch_cards", "void_blackjack_tournament",
      "liars_dice", "faction_war_betting", "dream_roulette",
      "card_battlers_gauntlet", "void_bingo", "void_cases", "dischordian_mahjong",
    ]) played[g] = 1;
    const earned = evaluateCasinoAchievements(baseArgs({
      state: baseState({ gamesPlayed: played }),
    }));
    expect(earned).toContain("all_games");
  });
});

describe("evaluateCasinoAchievements — game-specific detail triggers", () => {
  it("grants poker_flush on a flush hand", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "nebula_poker",
      result: { won: true, payout: 80, jackpot: false, detail: { handType: "flush" } },
    }));
    expect(earned).toContain("poker_flush");
  });

  it("grants royal_flush on a royal flush hand", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "nebula_poker",
      result: { won: true, payout: 10_000, jackpot: true, detail: { handType: "royal_flush" } },
    }));
    expect(earned).toContain("royal_flush");
    expect(earned).toContain("jackpot");
  });

  it("grants perfect_21 when player reaches exactly 21 in pazaak", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "pazaak_21",
      result: { won: true, payout: 50, jackpot: false, detail: { player: 21 } },
    }));
    expect(earned).toContain("perfect_21");
  });

  it("grants chain_10 after a 10-chain in high_low", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "high_low",
      result: { won: true, payout: 500, jackpot: true, detail: { chain: 10 } },
    }));
    expect(earned).toContain("chain_10");
  });

  it("grants tournament_winner after a Void Blackjack Tournament win", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "void_blackjack_tournament",
      bet: 100,
      result: { won: true, payout: 540, jackpot: true, detail: {} },
    }));
    expect(earned).toContain("tournament_winner");
  });

  it("grants bingo_caller on any Void Bingo session win", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "void_bingo",
      bet: 0,
      result: { won: true, payout: 50, jackpot: false, detail: {} },
    }));
    expect(earned).toContain("bingo_caller");
  });

  it("grants dream_survivor after surviving Dream Roulette", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "dream_roulette",
      bet: 50,
      result: { won: true, payout: 250, jackpot: true, detail: {} },
    }));
    expect(earned).toContain("dream_survivor");
  });

  it("grants scratched_cursed when the curse is revealed", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "scratch_cards",
      bet: 10,
      result: { won: false, payout: 0, jackpot: false, detail: { curseRevealed: true } },
    }));
    expect(earned).toContain("scratched_cursed");
  });

  it("grants lucky_7 on an exact-7 Entropy Dice prediction", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      game: "entropy_dice",
      result: { won: true, payout: 100, jackpot: true, detail: { total: 7, prediction: "exact" } },
    }));
    expect(earned).toContain("lucky_7");
  });
});

describe("evaluateCasinoAchievements — equilibrium", () => {
  it("grants breaking_even when net is exactly zero across 1000+ bets", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      state: baseState({ totalBetsPlaced: 1000, totalWagered: 50_000, totalWon: 50_000 }),
    }));
    expect(earned).toContain("breaking_even");
  });

  it("does not grant breaking_even when net is non-zero", () => {
    const earned = evaluateCasinoAchievements(baseArgs({
      state: baseState({ totalBetsPlaced: 1000, totalWagered: 50_000, totalWon: 49_950 }),
    }));
    expect(earned).not.toContain("breaking_even");
  });
});
