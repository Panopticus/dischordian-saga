/**
 * nexusTrialTickService — behavioral tests that don't require a DB.
 *
 * The transactional phase-transition path is integration-tested in
 * staging (per the plan's Verification section: compressed 72m
 * dry-run at 10× synthetic load). This file pins the contract that
 * matters at the unit level:
 *
 *   - All public functions are graceful when no DB is configured
 *     (return null/empty rather than throwing).
 *   - tick() is a no-op when there's no active trial.
 *   - getTrialStatus() returns the unavailable readout cleanly.
 */
import { describe, it, expect } from "vitest";
import {
  loadActiveTrial,
  startTrial,
  tick,
  getTrialStatus,
} from "./nexusTrialTickService";

describe("nexusTrialTickService — DB-unavailable graceful fallback", () => {
  it("loadActiveTrial returns null when no DB is configured", async () => {
    expect(await loadActiveTrial()).toBeNull();
  });

  it("startTrial returns null when no DB is configured", async () => {
    const result = await startTrial({ trialKey: "test_trial_2027" });
    expect(result).toBeNull();
  });

  it("getTrialStatus returns the 'unavailable' readout when no DB", async () => {
    const status = await getTrialStatus();
    expect(status).toEqual({
      available: false,
      trialKey: null,
      currentPhase: null,
      status: null,
      phaseEndsAt: null,
      rulesVersionAtStart: null,
    });
  });

  it("tick is a no-op when there is no active trial", async () => {
    const result = await tick();
    expect(result.transitioned).toBe(false);
    expect(result.closedTrial).toBe(false);
    expect(result.enteredPhase).toBeUndefined();
  });
});
