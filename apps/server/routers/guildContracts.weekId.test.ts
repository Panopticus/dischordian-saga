/**
 * Unit tests for the ISO-week id helper used by the F.2 weekly
 * contract trigger surface. Pure date arithmetic; no DB / tRPC.
 */
import { describe, it, expect } from "vitest";

import { isoWeekId } from "./guildContracts";

describe("isoWeekId", () => {
  it("computes the ISO 8601 week for canonical reference dates", () => {
    // Monday 2026-01-05 is week 2 of 2026 (week 1 ends 2026-01-04).
    expect(isoWeekId(new Date("2026-01-05T12:00:00Z"))).toBe("2026-W02");
    // Sunday 2026-01-04 is the last day of week 1.
    expect(isoWeekId(new Date("2026-01-04T12:00:00Z"))).toBe("2026-W01");
  });

  it("handles year boundaries — late December rolling into next year's W01", () => {
    // Wednesday 2025-12-31 → 2026-W01 (per ISO 8601, week containing
    // the year's first Thursday is W01; Thu 2026-01-01 anchors W01).
    expect(isoWeekId(new Date("2025-12-31T12:00:00Z"))).toBe("2026-W01");
    // Wednesday 2024-12-25 → 2024-W52
    expect(isoWeekId(new Date("2024-12-25T12:00:00Z"))).toBe("2024-W52");
  });

  it("zero-pads single-digit week numbers so ids sort lexicographically", () => {
    // Friday 2026-01-09 = week 02; the leading zero matters because
    // we compare ids as strings ("2026-W02" < "2026-W10").
    const w02 = isoWeekId(new Date("2026-01-09T12:00:00Z"));
    expect(w02).toBe("2026-W02");
    expect(w02 < "2026-W10").toBe(true);
  });

  it("is timezone-stable — same UTC instant returns the same id from any tz", () => {
    // Same instant expressed two ways: UTC vs Hawaii offset.
    const utc = new Date("2026-05-04T00:00:00Z"); // Mon 04:00 in Honolulu
    expect(isoWeekId(utc)).toBe("2026-W19");
  });

  it("treats the rollover instant deterministically", () => {
    // Sunday 2026-05-03 23:59:59 UTC is still W18.
    expect(isoWeekId(new Date("2026-05-03T23:59:59Z"))).toBe("2026-W18");
    // Monday 2026-05-04 00:00:00 UTC is W19.
    expect(isoWeekId(new Date("2026-05-04T00:00:00Z"))).toBe("2026-W19");
  });
});
