import { describe, expect, it } from "vitest";
import { formatRunDuration } from "./RunTrackerOverlay";

describe("formatRunDuration (audit/16 PR 23 Strm3)", () => {
  it("formats zero as 00:00:00", () => {
    expect(formatRunDuration(0)).toBe("00:00:00");
  });

  it("clamps negative values to 00:00:00", () => {
    expect(formatRunDuration(-10000)).toBe("00:00:00");
  });

  it("formats sub-minute durations", () => {
    expect(formatRunDuration(45_000)).toBe("00:00:45");
  });

  it("formats sub-hour durations", () => {
    expect(formatRunDuration(125_000)).toBe("00:02:05");
  });

  it("formats multi-hour durations", () => {
    expect(formatRunDuration(3_600_000 + 2 * 60_000 + 5_000)).toBe("01:02:05");
  });

  it("formats >24-hour durations without overflowing into days", () => {
    expect(formatRunDuration(25 * 3_600_000)).toBe("25:00:00");
  });

  it("pads single-digit minutes / seconds with zeros", () => {
    expect(formatRunDuration(3_600_000 + 9_000)).toBe("01:00:09");
  });
});
