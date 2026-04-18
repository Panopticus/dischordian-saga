/**
 * §5.7 → §5.8 handoff tests.
 *
 * Exercises the two pure helpers that bridge the §5.7 Game Master
 * match-end to the §5.8 Authority trial's `openingVerdictBalance`.
 */
import { describe, it, expect, vi } from "vitest";
import {
  computeAuthorityTrialOverride,
  rememberPublicWitnessBalance,
} from "./act1TrialHandoff";

describe("computeAuthorityTrialOverride", () => {
  it("returns undefined when the balance has never been captured", () => {
    expect(computeAuthorityTrialOverride(null)).toBeUndefined();
    expect(computeAuthorityTrialOverride(undefined)).toBeUndefined();
  });

  it("translates a warm balance (≥ +3) into a +3 opening offset", () => {
    // +3 / +5 / +10 all clamp to +3 per deriveAuthorityVerdictOffset.
    expect(computeAuthorityTrialOverride(3)).toEqual({ openingVerdictBalance: 3 });
    expect(computeAuthorityTrialOverride(5)).toEqual({ openingVerdictBalance: 3 });
    expect(computeAuthorityTrialOverride(10)).toEqual({ openingVerdictBalance: 3 });
  });

  it("translates a cool balance (≤ -3) into a -3 opening offset", () => {
    expect(computeAuthorityTrialOverride(-3)).toEqual({ openingVerdictBalance: -3 });
    expect(computeAuthorityTrialOverride(-7)).toEqual({ openingVerdictBalance: -3 });
    expect(computeAuthorityTrialOverride(-10)).toEqual({ openingVerdictBalance: -3 });
  });

  it("translates a neutral balance (-2..+2) into a 0 opening offset", () => {
    expect(computeAuthorityTrialOverride(-2)).toEqual({ openingVerdictBalance: 0 });
    expect(computeAuthorityTrialOverride(0)).toEqual({ openingVerdictBalance: 0 });
    expect(computeAuthorityTrialOverride(2)).toEqual({ openingVerdictBalance: 0 });
  });

  it("handles NaN / infinities defensively (engine clamps to 0)", () => {
    expect(computeAuthorityTrialOverride(Number.NaN)).toEqual({ openingVerdictBalance: 0 });
    expect(computeAuthorityTrialOverride(Number.POSITIVE_INFINITY)).toEqual({ openingVerdictBalance: 0 });
  });
});

describe("rememberPublicWitnessBalance", () => {
  it("persists a finite balance via the provided setter", () => {
    const setter = vi.fn();
    rememberPublicWitnessBalance(setter, 4);
    expect(setter).toHaveBeenCalledWith(4);
  });

  it("persists a negative balance", () => {
    const setter = vi.fn();
    rememberPublicWitnessBalance(setter, -6);
    expect(setter).toHaveBeenCalledWith(-6);
  });

  it("does not call the setter for NaN or infinities", () => {
    const setter = vi.fn();
    rememberPublicWitnessBalance(setter, Number.NaN);
    rememberPublicWitnessBalance(setter, Number.POSITIVE_INFINITY);
    rememberPublicWitnessBalance(setter, Number.NEGATIVE_INFINITY);
    expect(setter).not.toHaveBeenCalled();
  });

  it("persists 0 (a valid neutral balance) — not filtered as falsy", () => {
    const setter = vi.fn();
    rememberPublicWitnessBalance(setter, 0);
    expect(setter).toHaveBeenCalledWith(0);
  });
});
