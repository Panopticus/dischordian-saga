/* ═══════════════════════════════════════════════════════
   Tests for CREW_HOLIDAY_DANGERS — weighted picker
   distribution and catalog invariants.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  CREW_HOLIDAY_DANGERS,
  pickDailyDanger,
  findDanger,
} from "./christmasCrewDangers";

describe("CREW_HOLIDAY_DANGERS catalog", () => {
  it("has at least 5 danger events", () => {
    expect(CREW_HOLIDAY_DANGERS.length).toBeGreaterThanOrEqual(5);
  });

  it("every event has unique id + positive weight + at least 2 choices", () => {
    const ids = new Set<string>();
    for (const event of CREW_HOLIDAY_DANGERS) {
      expect(event.id.length).toBeGreaterThan(0);
      expect(ids.has(event.id)).toBe(false);
      ids.add(event.id);
      expect(event.weight).toBeGreaterThan(0);
      expect(event.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every choice has valid successChance + positive reward or zero", () => {
    for (const event of CREW_HOLIDAY_DANGERS) {
      for (const choice of event.choices) {
        expect(choice.successChance).toBeGreaterThanOrEqual(0);
        expect(choice.successChance).toBeLessThanOrEqual(1);
        expect(choice.rewardTokens ?? 0).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("findDanger returns the right event by id", () => {
    for (const event of CREW_HOLIDAY_DANGERS) {
      expect(findDanger(event.id)?.id).toBe(event.id);
    }
    expect(findDanger("no_such_event")).toBeUndefined();
  });
});

describe("pickDailyDanger — deterministic weighted picker", () => {
  it("returns the same event for the same day seed", () => {
    const a = pickDailyDanger(20260707);
    const b = pickDailyDanger(20260707);
    expect(a.id).toBe(b.id);
  });

  it("always returns an event from the catalog", () => {
    const ids = new Set(CREW_HOLIDAY_DANGERS.map(d => d.id));
    for (let seed = 0; seed < 1000; seed++) {
      const picked = pickDailyDanger(seed);
      expect(ids.has(picked.id)).toBe(true);
    }
  });

  it("distribution converges to the declared weights within tolerance", () => {
    const counts: Record<string, number> = {};
    const N = 20_000;
    // Sweep a wide seed range so the Knuth-hashed LCG covers its period.
    for (let seed = 1; seed <= N; seed++) {
      const picked = pickDailyDanger(seed);
      counts[picked.id] = (counts[picked.id] ?? 0) + 1;
    }
    const total = CREW_HOLIDAY_DANGERS.reduce((s, d) => s + d.weight, 0);
    for (const event of CREW_HOLIDAY_DANGERS) {
      const expected = (event.weight / total) * N;
      const actual = counts[event.id] ?? 0;
      // 15% tolerance — we're not demanding a true RNG here, just
      // that the picker honors the weights in expectation.
      const tolerance = expected * 0.15 + 50;
      expect(actual).toBeGreaterThan(expected - tolerance);
      expect(actual).toBeLessThan(expected + tolerance);
    }
  });

  it("minor events are picked more often than critical events", () => {
    const counts: Record<string, number> = {};
    for (let seed = 1; seed <= 10_000; seed++) {
      const picked = pickDailyDanger(seed);
      counts[picked.severity] = (counts[picked.severity] ?? 0) + 1;
    }
    expect(counts.minor ?? 0).toBeGreaterThan(counts.serious ?? 0);
    expect(counts.serious ?? 0).toBeGreaterThan(counts.critical ?? 0);
  });
});
