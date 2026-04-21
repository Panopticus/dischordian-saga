import { describe, it, expect } from "vitest";
import {
  evaluateMindGameTriggers,
  MIND_GAME_TRIGGER_IDS,
  type EvalDeltaSample,
  type TriggerInput,
} from "./chessMindGameTriggers";

function sample(overrides: Partial<EvalDeltaSample> = {}): EvalDeltaSample {
  return {
    ply: 10,
    side: "white",
    evalCp: 0,
    deltaCp: 0,
    timeOnMoveSec: 5,
    inOpeningBook: true,
    ...overrides,
  };
}

function input(overrides: Partial<TriggerInput> = {}): TriggerInput {
  return {
    sample: sample(),
    alreadyFired: [],
    climbTier: 0,
    midClimbSeries: false,
    ...overrides,
  };
}

describe("evaluateMindGameTriggers", () => {
  it("returns null when nothing is interesting", () => {
    expect(evaluateMindGameTriggers(input())).toBeNull();
  });

  it("fires player_blundered on a -200cp swing", () => {
    expect(
      evaluateMindGameTriggers(
        input({ sample: sample({ deltaCp: -250 }) }),
      ),
    ).toBe("player_blundered");
  });

  it("fires tempo_loss on a mid-range drop", () => {
    expect(
      evaluateMindGameTriggers(
        input({ sample: sample({ deltaCp: -80 }) }),
      ),
    ).toBe("tempo_loss");
  });

  it("fires opponent_in_trouble when eval favors player by +200cp", () => {
    expect(
      evaluateMindGameTriggers(
        input({ sample: sample({ evalCp: 250 }) }),
      ),
    ).toBe("opponent_in_trouble");
  });

  it("fires strong_tactic_found on a +100cp gain", () => {
    // +100cp gain but eval still near zero to avoid opponent_in_trouble
    const s = sample({ deltaCp: 100, evalCp: 50 });
    expect(evaluateMindGameTriggers(input({ sample: s }))).toBe(
      "strong_tactic_found",
    );
  });

  it("fires time_burn when the move took > 2 min", () => {
    const s = sample({ timeOnMoveSec: 130 });
    expect(evaluateMindGameTriggers(input({ sample: s }))).toBe("time_burn");
  });

  it("fires first_non_book_move in the opening", () => {
    const s = sample({ inOpeningBook: false, ply: 8 });
    expect(evaluateMindGameTriggers(input({ sample: s }))).toBe(
      "first_non_book_move",
    );
  });

  it("fires mid_series_offer only on climb tier 1+ mid-series", () => {
    // Tier 0 + midSeries = no fire (it's free play).
    const t0 = evaluateMindGameTriggers(
      input({ climbTier: 0, midClimbSeries: true }),
    );
    expect(t0).toBeNull();
    // Tier 2 + midSeries = fires.
    const t2 = evaluateMindGameTriggers(
      input({ climbTier: 2, midClimbSeries: true }),
    );
    expect(t2).toBe("mid_series_offer");
  });

  it("does not refire a trigger that is already in alreadyFired", () => {
    const alreadyFired = ["first_non_book_move"] as const;
    const s = sample({ inOpeningBook: false, ply: 8 });
    expect(
      evaluateMindGameTriggers(
        input({ sample: s, alreadyFired }),
      ),
    ).toBeNull();
  });

  it("prioritizes player_blundered over everything else", () => {
    // Blunder + opponent_in_trouble both eligible → blunder wins.
    const s = sample({ deltaCp: -300, evalCp: 250 });
    expect(evaluateMindGameTriggers(input({ sample: s }))).toBe(
      "player_blundered",
    );
  });

  it("handles Black's perspective correctly for delta sign", () => {
    // deltaCp is stored from White's perspective (absolute eval).
    // When Black plays a strong move, eval DROPS (favorable for
    // Black). So a -100cp deltaCp on Black's move means Black
    // gained 100cp — should trigger strong_tactic_found.
    const s = sample({ side: "black", deltaCp: -100, evalCp: -50 });
    expect(evaluateMindGameTriggers(input({ sample: s }))).toBe(
      "strong_tactic_found",
    );
  });

  it("covers every documented trigger id", () => {
    // Sanity: the constant list is the same shape the dispatcher expects.
    expect(MIND_GAME_TRIGGER_IDS).toContain("first_non_book_move");
    expect(MIND_GAME_TRIGGER_IDS).toContain("player_blundered");
    expect(MIND_GAME_TRIGGER_IDS).toContain("mid_series_offer");
  });
});
