/**
 * Unit tests for the donation-milestone boundary detector used by
 * the F.2.5 cs_donation_milestone cinematic trigger.
 *
 * The helper is pure — given a previous cumulative donation total
 * and a fresh donation delta, it returns the highest milestone
 * crossed (or null if none). Tests stay at this layer rather than
 * exercising the full tRPC mutation because the database-touching
 * code is one set/insert with no branches.
 */
import { describe, it, expect } from "vitest";

import {
  DONATION_MILESTONES_DREAM,
  crossedDonationMilestone,
} from "./guild";

describe("crossedDonationMilestone", () => {
  it("returns null when no threshold is crossed", () => {
    // 0 → 50: below the smallest milestone (100)
    expect(crossedDonationMilestone(0, 50)).toBeNull();
    // 100 → 250: between 100 and 500, no new threshold
    expect(crossedDonationMilestone(100, 150)).toBeNull();
    // a player who's already past every milestone donating more
    expect(crossedDonationMilestone(200_000, 50_000)).toBeNull();
  });

  it("fires the milestone when the donation lands exactly on it", () => {
    expect(crossedDonationMilestone(0, 100)).toBe(100);
    expect(crossedDonationMilestone(450, 50)).toBe(500);
    expect(crossedDonationMilestone(0, 100_000)).toBe(100_000);
  });

  it("fires when the donation pushes past a single threshold", () => {
    expect(crossedDonationMilestone(50, 100)).toBe(100); // 50→150 crosses 100
    expect(crossedDonationMilestone(2000, 5_000)).toBe(5_000); // 2000→7000 crosses 5000
  });

  it("returns the HIGHEST milestone crossed when one donation jumps multiple thresholds", () => {
    // 0 → 1500 crosses 100, 500, AND 1000 — return the highest (1000)
    expect(crossedDonationMilestone(0, 1500)).toBe(1000);
    // 0 → 60_000 crosses 100, 500, 1000, 5000, 10_000, 25_000, 50_000 —
    // return 50_000 (the largest in DONATION_MILESTONES_DREAM that's ≤ newTotal)
    expect(crossedDonationMilestone(0, 60_000)).toBe(50_000);
  });

  it("ignores thresholds the player was already past", () => {
    // 600 → 700 doesn't fire 500 again (already past)
    expect(crossedDonationMilestone(600, 100)).toBeNull();
  });

  it("treats DONATION_MILESTONES_DREAM as the canonical threshold table", () => {
    // Sanity-check the bible-canonical 8-threshold ladder.
    expect(DONATION_MILESTONES_DREAM).toEqual([
      100, 500, 1000, 5000, 10_000, 25_000, 50_000, 100_000,
    ]);
    // Every threshold is strictly increasing.
    for (let i = 1; i < DONATION_MILESTONES_DREAM.length; i++) {
      expect(DONATION_MILESTONES_DREAM[i]).toBeGreaterThan(DONATION_MILESTONES_DREAM[i - 1]);
    }
  });

  it("handles zero / non-positive deltas as no-ops", () => {
    expect(crossedDonationMilestone(0, 0)).toBeNull();
    expect(crossedDonationMilestone(50, 0)).toBeNull();
    // Negative delta (refund-shaped) — loop guard means no milestone fires.
    expect(crossedDonationMilestone(150, -100)).toBeNull();
  });
});
