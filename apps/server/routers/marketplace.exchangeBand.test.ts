import { describe, it, expect } from "vitest";
import {
  REFERENCE_DREAM_PER_CREDIT,
  EXCHANGE_BAND,
  dreamPerCreditRatio,
  isWithinExchangeBand,
} from "./marketplace";

describe("Dream↔Credits exchange band (Balance F4)", () => {
  it("is pegged to the faucet ratio (~1000 Credits per Dream), not 1:1", () => {
    expect(REFERENCE_DREAM_PER_CREDIT).toBeLessThanOrEqual(0.001);
    // Credits are 2–3 orders of magnitude more abundant than Dream.
    expect(1 / REFERENCE_DREAM_PER_CREDIT).toBeGreaterThanOrEqual(1000);
  });

  it("rejects the old laundering ratio (≈1 Credit → 1–2 Dream)", () => {
    // sell 1000 Credits, buy 1000 Dream → 1.0 Dream/Credit (old peg).
    const launder = dreamPerCreditRatio("credits", 1000, "dream", 1000);
    expect(isWithinExchangeBand(launder)).toBe(false);
    // The 2:1 band-edge abuse the audit called out, also rejected.
    const bandEdgeAbuse = dreamPerCreditRatio("credits", 1000, "dream", 2000);
    expect(isWithinExchangeBand(bandEdgeAbuse)).toBe(false);
  });

  it("accepts a fair faucet-priced order (~1000 Credits → 1 Dream)", () => {
    const fair = dreamPerCreditRatio("credits", 100_000, "dream", 100);
    expect(fair).toBeCloseTo(REFERENCE_DREAM_PER_CREDIT, 6);
    expect(isWithinExchangeBand(fair)).toBe(true);
    // direction-symmetric: selling Dream for Credits at the same peg
    const reverse = dreamPerCreditRatio("dream", 100, "credits", 100_000);
    expect(isWithinExchangeBand(reverse)).toBe(true);
  });

  it("band is a tight ±1.5×, not the old ±2×", () => {
    expect(EXCHANGE_BAND.min).toBeCloseTo(REFERENCE_DREAM_PER_CREDIT / 1.5, 9);
    expect(EXCHANGE_BAND.max).toBeCloseTo(REFERENCE_DREAM_PER_CREDIT * 1.5, 9);
    // just inside / just outside the upper edge
    expect(isWithinExchangeBand(REFERENCE_DREAM_PER_CREDIT * 1.49)).toBe(true);
    expect(isWithinExchangeBand(REFERENCE_DREAM_PER_CREDIT * 1.51)).toBe(false);
  });
});
