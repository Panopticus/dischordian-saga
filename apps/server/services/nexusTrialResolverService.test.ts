/**
 * nexusTrialResolverService — DB-unavailable behavior + pure-logic tests.
 *
 * The aggregation + resolver paths are exercised end-to-end in
 * staging (per the plan's Verification section's compressed 72m
 * dry-run). Unit tests here pin the contract that matters:
 *
 *   - Public functions return null/empty when no DB is configured.
 *   - The companion-sacrifice "lower weight = sacrificed" rule
 *     and ballot "higher weight = sacrificed" rule are documented
 *     in their respective service comments.
 */
import { describe, it, expect } from "vitest";
import {
  aggregateTallies,
  resolveCompanionSacrifice,
  resolveResurrectedBallot,
  getLeaderboard,
} from "./nexusTrialResolverService";

const stubTrial = {
  id: 1,
  trialKey: "nexus_trial_test",
  currentPhase: "confession" as const,
  startedAt: new Date("2027-03-01T00:00:00Z"),
  phaseStartedAt: new Date("2027-03-03T00:00:00Z"),
  phaseEndsAt: new Date("2027-03-03T12:00:00Z"),
  phaseDurationMs: 12 * 60 * 60 * 1000,
  rulesVersionAtStart: "1.1.0",
  status: "live" as const,
};

describe("nexusTrialResolverService — DB-unavailable fallback", () => {
  it("aggregateTallies returns zeros when no DB is configured", async () => {
    const result = await aggregateTallies(stubTrial);
    expect(result.testimonyConsidered).toBe(0);
    expect(result.bucketsUpdated).toBe(0);
  });

  it("resolveCompanionSacrifice returns null when no DB is configured", async () => {
    expect(await resolveCompanionSacrifice(stubTrial)).toBeNull();
  });

  it("resolveResurrectedBallot returns null when no DB is configured", async () => {
    expect(await resolveResurrectedBallot(stubTrial)).toBeNull();
  });

  it("getLeaderboard returns an empty array when no DB is configured", async () => {
    expect(await getLeaderboard(stubTrial)).toEqual([]);
  });
});
