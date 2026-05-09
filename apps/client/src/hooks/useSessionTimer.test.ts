import { describe, it, expect } from "vitest";
import { shouldFireSessionInterrupt } from "./useSessionTimer";

const HOUR = 60 * 60 * 1000;

describe("shouldFireSessionInterrupt (audit/16 GA5)", () => {
  it("returns null for fresh sessions", () => {
    expect(shouldFireSessionInterrupt(0, 0, 0)).toBeNull();
    expect(shouldFireSessionInterrupt(30 * 60_000, 1000, 0)).toBeNull();
  });

  it("does NOT fire 2h interrupt under the wagered threshold", () => {
    // Player has been here 2h but only wagered 100D — give them
    // window-shopping leeway.
    expect(shouldFireSessionInterrupt(2 * HOUR, 100, 0)).toBeNull();
    expect(shouldFireSessionInterrupt(2.5 * HOUR, 499, 0)).toBeNull();
  });

  it("fires 2h interrupt when elapsed + wagered cross thresholds", () => {
    expect(shouldFireSessionInterrupt(2 * HOUR, 500, 0)).toBe(2);
    expect(shouldFireSessionInterrupt(2 * HOUR + 1, 500, 0)).toBe(2);
    expect(shouldFireSessionInterrupt(3 * HOUR, 1000, 0)).toBe(2);
  });

  it("fires 4h interrupt regardless of wagered amount", () => {
    expect(shouldFireSessionInterrupt(4 * HOUR, 100, 2)).toBe(4);
    expect(shouldFireSessionInterrupt(4 * HOUR, 0, 2)).toBe(4);
  });

  it("fires 6h interrupt regardless of wagered amount", () => {
    expect(shouldFireSessionInterrupt(6 * HOUR, 0, 4)).toBe(6);
    expect(shouldFireSessionInterrupt(6 * HOUR + 999, 999, 4)).toBe(6);
  });

  it("does NOT re-fire the same threshold once acknowledged", () => {
    // Player crossed 2h, dismissed the modal (lastFired = 2);
    // subsequent ticks should not return 2 again.
    expect(shouldFireSessionInterrupt(3 * HOUR, 1000, 2)).toBeNull();
    expect(shouldFireSessionInterrupt(3.5 * HOUR, 2000, 2)).toBeNull();
  });

  it("supersedes lower thresholds when crossing multiple at once", () => {
    // Tab was backgrounded; resumes after 5h with no prior fires.
    // Should return 4 (highest unfired threshold below current).
    expect(shouldFireSessionInterrupt(5 * HOUR, 1000, 0)).toBe(4);
    expect(shouldFireSessionInterrupt(7 * HOUR, 1000, 0)).toBe(6);
  });

  it("only one threshold fires per call (no double-firing)", () => {
    // At 5h with lastFired=2, returns 4 next; 6 still pending.
    expect(shouldFireSessionInterrupt(5 * HOUR, 1000, 2)).toBe(4);
    expect(shouldFireSessionInterrupt(7 * HOUR, 1000, 4)).toBe(6);
  });
});
