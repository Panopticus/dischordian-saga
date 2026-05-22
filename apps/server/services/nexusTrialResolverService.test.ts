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
  decideRomanceTagEligibility,
  isRomanceTagEligibleForPlayer,
  recordCompanionSacrifice,
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

  it("isRomanceTagEligibleForPlayer returns shouldFireTag=false when no DB", async () => {
    const result = await isRomanceTagEligibleForPlayer(1, "elara");
    expect(result.shouldFireTag).toBe(false);
    expect(result.sacrificed).toBe(false);
  });

  it("recordCompanionSacrifice is a graceful no-op when no DB", async () => {
    await expect(
      recordCompanionSacrifice(stubTrial, "elara", "confession_elara_dies"),
    ).resolves.toBeUndefined();
  });
});

/* ─── ROMANCE TAG DECISION (pure logic, no DB) ─── */

describe("decideRomanceTagEligibility — decision rules", () => {
  const sacrificeTime = new Date("2027-03-05T12:00:00Z");

  it("not sacrificed → not eligible", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: null,
      relationshipUpdatedAt: new Date("2027-03-01T00:00:00Z"),
      relationshipLevel: 80,
      romanceActive: true,
    });
    expect(r.sacrificed).toBe(false);
    expect(r.romanced).toBe(false);
    expect(r.shouldFireTag).toBe(false);
  });

  it("sacrificed but no relationship row → not eligible", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: null,
      relationshipLevel: 0,
      romanceActive: false,
    });
    expect(r.sacrificed).toBe(true);
    expect(r.romanced).toBe(false);
    expect(r.shouldFireTag).toBe(false);
  });

  it("relationship updated BEFORE sacrifice, level ≥75 → eligible", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: new Date("2027-02-15T00:00:00Z"),
      relationshipLevel: 80,
      romanceActive: false,
    });
    expect(r.romanced).toBe(true);
    expect(r.shouldFireTag).toBe(true);
  });

  it("relationship updated BEFORE sacrifice, romanceActive=true → eligible", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: new Date("2027-02-15T00:00:00Z"),
      relationshipLevel: 30,
      romanceActive: true,
    });
    expect(r.romanced).toBe(true);
    expect(r.shouldFireTag).toBe(true);
  });

  it("relationship updated AT sacrifice exactly → eligible (inclusive)", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: sacrificeTime,
      relationshipLevel: 80,
      romanceActive: false,
    });
    expect(r.shouldFireTag).toBe(true);
  });

  it("relationship updated AFTER sacrifice → freeze rejects, not eligible", () => {
    // A player who romances Elara post-Trial doesn't retroactively
    // unlock her romance tag.
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: new Date("2027-03-06T00:00:00Z"),
      relationshipLevel: 80,
      romanceActive: true,
    });
    expect(r.sacrificed).toBe(true);
    expect(r.romanced).toBe(false);
    expect(r.shouldFireTag).toBe(false);
  });

  it("relationship below 75 + romanceActive=false → not romanced", () => {
    const r = decideRomanceTagEligibility({
      sacrificedAt: sacrificeTime,
      relationshipUpdatedAt: new Date("2027-02-15T00:00:00Z"),
      relationshipLevel: 74,
      romanceActive: false,
    });
    expect(r.romanced).toBe(false);
    expect(r.shouldFireTag).toBe(false);
  });
});
