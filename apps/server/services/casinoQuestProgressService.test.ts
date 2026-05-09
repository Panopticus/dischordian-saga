import { describe, it, expect } from "vitest";
import {
  evaluateCasinoQuestSignal,
  type CasinoQuestSignal,
} from "./casinoQuestProgressService";

const baseSignal: CasinoQuestSignal = {
  game: "void_slots",
  bet: 25,
  won: false,
  jackpot: false,
  prevStreak: 0,
  newStreak: 0,
  talesCollectedSeason: 0,
};

function withSignal(over: Partial<CasinoQuestSignal>): CasinoQuestSignal {
  return { ...baseSignal, ...over };
}

describe("evaluateCasinoQuestSignal — daily predicates", () => {
  it("d_casino_play_5 increments on every game (won or lost)", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ won: false })).get("d_casino_play_5")).toBe(1);
    expect(evaluateCasinoQuestSignal(withSignal({ won: true })).get("d_casino_play_5")).toBe(1);
  });

  it("d_casino_win_3 only increments on a win", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ won: false })).get("d_casino_win_3")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ won: true })).get("d_casino_win_3")).toBe(1);
  });

  it("d_casino_pazaak_win requires both pazaak_21 AND won", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ game: "pazaak_21", won: false })).get("d_casino_pazaak_win")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ game: "void_slots", won: true })).get("d_casino_pazaak_win")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ game: "pazaak_21", won: true })).get("d_casino_pazaak_win")).toBe(1);
  });

  it("d_casino_streak_3 fires only on the threshold-cross", () => {
    // Climbing 0→1→2→3
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 0, newStreak: 1 })).get("d_casino_streak_3")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 1, newStreak: 2 })).get("d_casino_streak_3")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 2, newStreak: 3 })).get("d_casino_streak_3")).toBe(1);
    // Beyond 3, no further increments — even if streak grows.
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 3, newStreak: 4 })).get("d_casino_streak_3")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 4, newStreak: 5 })).get("d_casino_streak_3")).toBeUndefined();
  });

  it("d_casino_streak_3 also fires on a multi-jump cross (e.g. 0 → 5 from a single jackpot bonus)", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 0, newStreak: 5 })).get("d_casino_streak_3")).toBe(1);
  });

  it("d_casino_high_bet only counts bets ≥100D", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ bet: 99 })).get("d_casino_high_bet")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ bet: 100 })).get("d_casino_high_bet")).toBe(1);
    expect(evaluateCasinoQuestSignal(withSignal({ bet: 500 })).get("d_casino_high_bet")).toBe(1);
  });

  it("d_casino_jackpot fires only on jackpot true", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ jackpot: false })).get("d_casino_jackpot")).toBeUndefined();
    expect(evaluateCasinoQuestSignal(withSignal({ jackpot: true })).get("d_casino_jackpot")).toBe(1);
  });
});

describe("evaluateCasinoQuestSignal — weekly predicates", () => {
  it("w_casino_50_plays mirrors d_casino_play_5 (any play)", () => {
    expect(evaluateCasinoQuestSignal(withSignal({})).get("w_casino_50_plays")).toBe(1);
  });

  it("w_casino_pazaak_5 mirrors d_casino_pazaak_win", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ game: "pazaak_21", won: true })).get("w_casino_pazaak_5")).toBe(1);
    expect(evaluateCasinoQuestSignal(withSignal({ game: "pazaak_21", won: false })).get("w_casino_pazaak_5")).toBeUndefined();
  });

  it("w_casino_streak_5 fires only on the 5-cross", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 4, newStreak: 5 })).get("w_casino_streak_5")).toBe(1);
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 5, newStreak: 6 })).get("w_casino_streak_5")).toBeUndefined();
    // Sub-5 streak doesn't fire.
    expect(evaluateCasinoQuestSignal(withSignal({ prevStreak: 2, newStreak: 3 })).get("w_casino_streak_5")).toBeUndefined();
  });
});

describe("evaluateCasinoQuestSignal — epoch predicates", () => {
  it("e_casino_centurion only counts wins", () => {
    expect(evaluateCasinoQuestSignal(withSignal({ won: true })).get("e_casino_centurion")).toBe(1);
    expect(evaluateCasinoQuestSignal(withSignal({ won: false })).get("e_casino_centurion")).toBeUndefined();
  });

  it("e_casino_tale_collector returns no per-game increment (snap-to-truth)", () => {
    // The tale_collector predicate intentionally returns 0 from the
    // pure evaluator; the service-level code reads talesCollectedSeason
    // off the signal and snaps the row's currentCount to that value.
    expect(evaluateCasinoQuestSignal(withSignal({ talesCollectedSeason: 5 })).get("e_casino_tale_collector")).toBeUndefined();
  });
});
