/**
 * abuseDetection — pure threshold + result-shape tests.
 *
 * The DB queries are integration-tested against a real MySQL in the
 * db-smoke job; here we test the helpers and threshold contracts.
 */
import { describe, it, expect } from "vitest";
import { ABUSE_THRESHOLDS } from "./abuseDetection";

describe("ABUSE_THRESHOLDS", () => {
  it("sandbagging windowDays is at least a week", () => {
    expect(ABUSE_THRESHOLDS.sandbagging.windowDays).toBeGreaterThanOrEqual(7);
  });

  it("trade collusion requires multiple pair trades, not one-offs", () => {
    expect(ABUSE_THRESHOLDS.tradeCollusion.minPairTrades).toBeGreaterThanOrEqual(3);
  });

  it("coop leech threshold is well below an even split", () => {
    // 2-player coop = 50% even split. 5% threshold flags only
    // dramatic under-contribution.
    expect(ABUSE_THRESHOLDS.coopLeech.minDamageContributionPct).toBeLessThan(0.25);
  });
});
