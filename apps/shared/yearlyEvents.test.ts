import { describe, it, expect } from "vitest";
import {
  YEARLY_EVENTS,
  getYearlyEvent,
  closingMotionKeyForYear,
} from "./yearlyEvents";

describe("YEARLY_EVENTS", () => {
  it("has the four canonical anchors", () => {
    expect(YEARLY_EVENTS.map((e) => e.key)).toEqual([
      "foundation_day",
      "severance",
      "mechronis_festival",
      "memorial_day",
    ]);
  });

  it("anchors use valid (month, day) pairs", () => {
    for (const e of YEARLY_EVENTS) {
      expect(e.anchorMonth).toBeGreaterThanOrEqual(1);
      expect(e.anchorMonth).toBeLessThanOrEqual(12);
      expect(e.anchorDay).toBeGreaterThanOrEqual(1);
      expect(e.anchorDay).toBeLessThanOrEqual(31);
    }
  });

  it("durations are positive", () => {
    for (const e of YEARLY_EVENTS) {
      expect(e.durationDays).toBeGreaterThan(0);
    }
  });

  it("severance is gated by Seal IV; memorial_day by Seal V", () => {
    expect(getYearlyEvent("severance").triggeredBySeal).toBe(4);
    expect(getYearlyEvent("memorial_day").triggeredBySeal).toBe(5);
  });

  it("memorial day carries the highest donation multiplier (canonical loophole)", () => {
    const max = Math.max(...YEARLY_EVENTS.map((e) => e.donationMultiplier));
    expect(getYearlyEvent("memorial_day").donationMultiplier).toBe(max);
  });

  it("closingMotionKeyForYear suffixes the year", () => {
    expect(closingMotionKeyForYear("foundation_day", 2026)).toBe(
      "foundation_charter_renewal_year_2026",
    );
    expect(closingMotionKeyForYear("memorial_day", 2027)).toBe(
      "kael_memorial_inscription_year_2027",
    );
  });

  it("getYearlyEvent throws on unknown key", () => {
    expect(() => getYearlyEvent("nonsense" as never)).toThrow();
  });
});
