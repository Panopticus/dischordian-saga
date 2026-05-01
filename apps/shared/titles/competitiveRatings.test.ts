/**
 * Validates that the title evaluator handles the gameType-keyed
 * `competitiveRatings`-shaped data correctly. The actual mirror service
 * runs server-side and is exercised by the e2e suite; these tests
 * focus on the snapshot evaluator semantics that ratings unification
 * unlocks (e.g. cross_game_dual_rank).
 */
import { describe, it, expect } from "vitest";
import {
  evaluateTitleUnlock,
  makeTitleProgressSnapshot,
} from "./titleUnlockService";

describe("competitiveRatings semantics — snapshot evaluator", () => {
  it("cross_game_dual_rank fires when 2 of N gameTypes meet minTier", () => {
    const state = makeTitleProgressSnapshot({
      rankTiers: [["card_1v1", 4], ["chess", 4], ["td_raid", 0]],
    });
    expect(evaluateTitleUnlock({
      kind: "cross_game_dual_rank",
      minTier: 4,
      gameTypes: ["card_1v1", "chess", "td_raid"],
    }, state)).toBe(true);
  });

  it("cross_game_dual_rank does NOT fire when only 1 of 3 qualifies", () => {
    const state = makeTitleProgressSnapshot({
      rankTiers: [["card_1v1", 6], ["chess", 1], ["td_raid", 0]],
    });
    expect(evaluateTitleUnlock({
      kind: "cross_game_dual_rank",
      minTier: 4,
      gameTypes: ["card_1v1", "chess", "td_raid"],
    }, state)).toBe(false);
  });

  it("cross_game_dual_rank fires across non-card gameTypes (chess + td_raid)", () => {
    const state = makeTitleProgressSnapshot({
      rankTiers: [["chess", 5], ["td_raid", 5]],
    });
    expect(evaluateTitleUnlock({
      kind: "cross_game_dual_rank",
      minTier: 5,
      gameTypes: ["card_1v1", "chess", "td_raid"],
    }, state)).toBe(true);
  });

  it("pvp_wins_total without gameType sums every gameType's wins", () => {
    const state = makeTitleProgressSnapshot({
      winsByGameType: [
        ["card_1v1", 30],
        ["chess", 20],
        ["td_raid", 50],
      ],
      totalWins: 100,
    });
    expect(evaluateTitleUnlock(
      { kind: "pvp_wins_total", count: 100 },
      state,
    )).toBe(true);
    expect(evaluateTitleUnlock(
      { kind: "pvp_wins_total", count: 101 },
      state,
    )).toBe(false);
  });

  it("pvp_wins_total with gameType only counts that gameType", () => {
    const state = makeTitleProgressSnapshot({
      winsByGameType: [["card_1v1", 30], ["chess", 100]],
    });
    expect(evaluateTitleUnlock(
      { kind: "pvp_wins_total", gameType: "chess", count: 100 },
      state,
    )).toBe(true);
    expect(evaluateTitleUnlock(
      { kind: "pvp_wins_total", gameType: "card_1v1", count: 100 },
      state,
    )).toBe(false);
  });
});
