import { describe, it, expect } from "vitest";
import { computeAperture, apertureBand } from "./aperture";

describe("aperture.computeAperture", () => {
  it("returns 0 for empty inputs", () => {
    expect(computeAperture({})).toBe(0);
  });

  it("clamps to [-100, 100]", () => {
    const open = computeAperture({
      profile: { conformity: -100 },
      narrativeFlags: { vote_zero_eye_response_looked_away: true, vote_zero_recanted: true },
      voteHistory: Array(50).fill({ framing: "look_away" as const, castAt: Date.now() }),
      globalTally: { confirm: 1, lookAway: 1000 },
    });
    const closed = computeAperture({
      profile: { conformity: 100 },
      narrativeFlags: { vote_zero_eye_response_confirmed: true, vote_zero_reaffirmed: true },
      voteHistory: Array(50).fill({ framing: "confirm" as const, castAt: Date.now() }),
      globalTally: { confirm: 1000, lookAway: 1 },
    });
    expect(open).toBeGreaterThanOrEqual(-100);
    expect(closed).toBeLessThanOrEqual(100);
    expect(open).toBeLessThan(0);
    expect(closed).toBeGreaterThan(0);
  });

  it("conformity moves the score in the same sign", () => {
    expect(computeAperture({ profile: { conformity: 50 } })).toBeGreaterThan(0);
    expect(computeAperture({ profile: { conformity: -50 } })).toBeLessThan(0);
  });

  it("recent votes outweigh ancient votes via half-life decay", () => {
    const now = Date.now();
    const ancient = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const recentScore = computeAperture({
      voteHistory: [
        { framing: "confirm", castAt: now },
        { framing: "look_away", castAt: ancient },
      ],
      now,
    });
    expect(recentScore).toBeGreaterThan(0);
  });

  it("ignores neutral framings in the vote history", () => {
    const score = computeAperture({
      voteHistory: [
        { framing: "neutral" },
        { framing: "neutral" },
      ],
    });
    expect(score).toBe(0);
  });

  it("global tally with low participation contributes less than with high participation", () => {
    const lowN = computeAperture({
      globalTally: { confirm: 8, lookAway: 2 },
    });
    const highN = computeAperture({
      globalTally: { confirm: 800, lookAway: 200 },
    });
    expect(highN).toBeGreaterThan(lowN);
  });
});

describe("aperture.apertureBand", () => {
  it("buckets every value into one of six bands", () => {
    const samples = [-100, -75, -50, -25, 0, 25, 50, 75, 100];
    for (const s of samples) {
      const band = apertureBand(s);
      expect([
        "open_overwhelming",
        "open_strong",
        "open_narrow",
        "closed_narrow",
        "closed_strong",
        "closed_overwhelming",
      ]).toContain(band);
    }
  });

  it("0 lands in closed_narrow (the chamber's default Confirm-leaning rest)", () => {
    expect(apertureBand(0)).toBe("closed_narrow");
  });

  it("strong negatives land in open_strong / open_overwhelming", () => {
    expect(apertureBand(-45)).toBe("open_strong");
    expect(apertureBand(-80)).toBe("open_overwhelming");
  });

  it("strong positives land in closed_strong / closed_overwhelming", () => {
    expect(apertureBand(45)).toBe("closed_strong");
    expect(apertureBand(80)).toBe("closed_overwhelming");
  });
});
