// apps/shared/tradeEmpire/__tests__/researchRaces.test.ts

import { describe, it, expect } from "vitest";
import {
  pickResearchRival,
  pickRivalDeadlineMs,
  resolveRace,
  rewardMultiplierForRaceOutcome,
} from "../researchRaces";
import { isKnownSubHouseKey } from "../houses";

describe("researchRaces — Phase D.5", () => {
  it("pickResearchRival returns a real sub-house key", () => {
    const rival = pickResearchRival("tech.x", () => 0);
    expect(isKnownSubHouseKey(rival)).toBe(true);
  });

  it("pickResearchRival is RNG-deterministic for tests", () => {
    expect(pickResearchRival("tech.x", () => 0.1)).toBe(
      pickResearchRival("tech.x", () => 0.1),
    );
  });

  it("pickRivalDeadlineMs lands in the [0.7, 1.1] window", () => {
    const player = 1_000_000;
    expect(pickRivalDeadlineMs({ playerExpectedCompletionMs: player, rng: () => 0 })).toBe(
      Math.round(player * 0.7),
    );
    expect(pickRivalDeadlineMs({ playerExpectedCompletionMs: player, rng: () => 1 })).toBe(
      Math.round(player * 1.1),
    );
  });

  it("resolveRace picks the player when finishing in time", () => {
    expect(resolveRace({ playerCompletionMs: 5, rivalDeadlineMs: 10 })).toBe("player_won");
    expect(resolveRace({ playerCompletionMs: 11, rivalDeadlineMs: 10 })).toBe("rival_won");
  });

  it("rewardMultiplier penalises losing", () => {
    expect(rewardMultiplierForRaceOutcome("player_won")).toBe(1);
    expect(rewardMultiplierForRaceOutcome("rival_won")).toBe(0.8);
  });
});
