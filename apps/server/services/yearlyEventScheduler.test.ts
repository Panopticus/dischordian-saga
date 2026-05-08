import { describe, it, expect } from "vitest";
import {
  isWithinAnchorWindow,
  isOnOrAfterAnchor,
} from "./yearlyEventScheduler";
import { nextAnchor } from "../routers/yearlyEvents";

describe("isWithinAnchorWindow", () => {
  it("Foundation Day (Jan 1, 7d) — Jan 4 is in window", () => {
    expect(isWithinAnchorWindow(new Date("2026-01-04T12:00:00Z"), 1, 1, 7)).toBe(true);
  });

  it("Foundation Day — Jan 8 is past close", () => {
    expect(isWithinAnchorWindow(new Date("2026-01-08T12:00:00Z"), 1, 1, 7)).toBe(false);
  });

  it("Foundation Day — Dec 31 is before open", () => {
    expect(isWithinAnchorWindow(new Date("2025-12-31T23:00:00Z"), 1, 1, 7)).toBe(false);
  });

  it("Memorial Day (Nov 11, 2d) — Nov 12 is in window", () => {
    expect(isWithinAnchorWindow(new Date("2026-11-12T00:00:00Z"), 11, 11, 2)).toBe(true);
  });

  it("Memorial Day — Nov 13 is past close", () => {
    expect(isWithinAnchorWindow(new Date("2026-11-13T01:00:00Z"), 11, 11, 2)).toBe(false);
  });
});

describe("isOnOrAfterAnchor", () => {
  it("matches the anchor day exactly", () => {
    expect(isOnOrAfterAnchor(new Date("2026-04-01T00:00:00Z"), 4, 1)).toBe(true);
  });
  it("returns false the day before", () => {
    expect(isOnOrAfterAnchor(new Date("2026-03-31T23:00:00Z"), 4, 1)).toBe(false);
  });
});

describe("nextAnchor", () => {
  it("returns this year's anchor when today is before it", () => {
    const ref = new Date("2026-08-15T00:00:00Z");
    const next = nextAnchor(9, 21, ref);
    expect(next.getUTCFullYear()).toBe(2026);
    expect(next.getUTCMonth()).toBe(8);
    expect(next.getUTCDate()).toBe(21);
  });

  it("rolls to next year when today is past the anchor", () => {
    const ref = new Date("2026-11-30T00:00:00Z");
    const next = nextAnchor(11, 11, ref);
    expect(next.getUTCFullYear()).toBe(2027);
  });

  it("rolls forward exactly the day after the anchor", () => {
    const ref = new Date("2026-04-02T00:00:00Z");
    const next = nextAnchor(4, 1, ref);
    expect(next.getUTCFullYear()).toBe(2027);
  });

  it("anchor day exact match → returns this year (>= comparison)", () => {
    const ref = new Date("2026-01-01T00:00:00Z");
    const next = nextAnchor(1, 1, ref);
    expect(next.getUTCFullYear()).toBe(2026);
  });
});
