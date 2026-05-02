/**
 * Pure-function tests for the Liminal Touches helpers. The DOM-side
 * behaviour (visibility-change wiring, console.warn one-shot guard)
 * is exercised via window mocks; the deterministic helpers
 * (`bootBannerForMorality`, `calibrationLogsFor`,
 * `alignmentBucketFor`, `epochDayUtc`) are tested as pure inputs.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  bootBannerForMorality,
  alignmentBucketFor,
  calibrationLogsFor,
  epochDayUtc,
  logBootBanner,
  _resetBootBannerForTest,
  _CALIBRATION_LOG_POOL_FOR_TEST,
  _IDLE_TITLE_PHRASES_FOR_TEST,
} from "./liminalTouches";

describe("alignmentBucketFor", () => {
  it("buckets machine-aligned scores at -25 or below to -1", () => {
    expect(alignmentBucketFor(-100)).toBe(-1);
    expect(alignmentBucketFor(-25)).toBe(-1);
  });

  it("buckets neutral scores between -24 and 24 to 0", () => {
    expect(alignmentBucketFor(-24)).toBe(0);
    expect(alignmentBucketFor(0)).toBe(0);
    expect(alignmentBucketFor(24)).toBe(0);
  });

  it("buckets humanity-aligned scores at 25 or above to +1", () => {
    expect(alignmentBucketFor(25)).toBe(1);
    expect(alignmentBucketFor(100)).toBe(1);
  });
});

describe("bootBannerForMorality", () => {
  it("returns the calibration-register banner for machine alignment", () => {
    const banner = bootBannerForMorality(-50);
    expect(banner).toMatch(/CALIBRATION/);
    expect(banner).toMatch(/Architect attends/);
  });

  it("returns the cryptic-vision banner for humanity alignment", () => {
    const banner = bootBannerForMorality(50);
    expect(banner).toMatch(/listening/);
    expect(banner).toMatch(/the gate was not where you thought/);
  });

  it("returns the inert ready banner for neutrals", () => {
    const banner = bootBannerForMorality(0);
    expect(banner).toMatch(/Boot OK/);
    expect(banner).not.toMatch(/CALIBRATION/);
    expect(banner).not.toMatch(/listening/);
  });

  it("never names the Dreamer or the Architect's recruitment relay (silence-shape)", () => {
    for (const score of [-100, -50, -25, 0, 25, 50, 100]) {
      const banner = bootBannerForMorality(score);
      expect(banner).not.toMatch(/Dreamer/);
      expect(banner).not.toMatch(/Oracle/);
      expect(banner).not.toMatch(/Elara/);
    }
  });
});

describe("logBootBanner — one-shot guard", () => {
  // Vitest runs in `node` here, so `window` is undefined by default.
  // Stub a minimal window for the duration of these cases — the helper
  // only needs the indexed-access flag pattern.
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("window", {} as unknown as Window);
    _resetBootBannerForTest();
  });

  it("logs exactly once across multiple calls within a session", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logBootBanner(0);
    logBootBanner(0);
    logBootBanner(50);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("re-fires after _resetBootBannerForTest", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logBootBanner(0);
    _resetBootBannerForTest();
    logBootBanner(0);
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it("uses console.warn (not console.log) so the void-energy ratchet allows it", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logBootBanner(0);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe("epochDayUtc", () => {
  it("computes UTC epoch day for a known timestamp", () => {
    // 2025-01-01 00:00:00 UTC = 20089 days since epoch.
    expect(epochDayUtc(new Date("2025-01-01T00:00:00Z").getTime())).toBe(20089);
  });

  it("does not advance during the same UTC day", () => {
    const dayStart = new Date("2025-01-01T00:00:00Z").getTime();
    const dayEnd = new Date("2025-01-01T23:59:59Z").getTime();
    expect(epochDayUtc(dayStart)).toBe(epochDayUtc(dayEnd));
  });

  it("advances exactly once across a UTC day boundary", () => {
    const day1 = epochDayUtc(new Date("2025-01-01T23:59:59Z").getTime());
    const day2 = epochDayUtc(new Date("2025-01-02T00:00:00Z").getTime());
    expect(day2 - day1).toBe(1);
  });
});

describe("calibrationLogsFor — deterministic per-day picks", () => {
  it("returns exactly 4 lines from the pool", () => {
    const logs = calibrationLogsFor(20089, 0);
    expect(logs).toHaveLength(4);
    for (const line of logs) {
      expect(_CALIBRATION_LOG_POOL_FOR_TEST).toContain(line);
    }
  });

  it("returns the same lines for the same (day, alignment) tuple", () => {
    const a = calibrationLogsFor(20089, 0);
    const b = calibrationLogsFor(20089, 0);
    expect(a).toEqual(b);
  });

  it("returns different lines on a different day", () => {
    const a = calibrationLogsFor(20089, 0);
    const b = calibrationLogsFor(20090, 0);
    expect(a).not.toEqual(b);
  });

  it("returns different lines for different morality alignments on the same day", () => {
    const machine = calibrationLogsFor(20089, -1);
    const neutral = calibrationLogsFor(20089, 0);
    const humanity = calibrationLogsFor(20089, 1);
    // At least one of the three must differ from each other.
    expect(machine).not.toEqual(neutral);
    expect(neutral).not.toEqual(humanity);
  });

  it("never repeats a line within a single day's pick (4-of-15 sample)", () => {
    const logs = calibrationLogsFor(20089, 0);
    const unique = new Set(logs);
    expect(unique.size).toBe(logs.length);
  });
});

describe("idle title-cycle phrase pool", () => {
  it("includes a hidden 'fnord' as fan service per the recruitment plan", () => {
    expect(
      _IDLE_TITLE_PHRASES_FOR_TEST.some((p) => /fnord/i.test(p)),
    ).toBe(true);
  });

  it("every phrase carries the Loredex OS branding", () => {
    for (const phrase of _IDLE_TITLE_PHRASES_FOR_TEST) {
      expect(phrase).toMatch(/Loredex OS/);
    }
  });
});
