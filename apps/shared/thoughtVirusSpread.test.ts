import { describe, it, expect } from "vitest";

import {
  bandFor,
  clampInfection,
  getAction,
  getSector,
  VIRUS_SECTORS,
} from "./thoughtVirusSpread";

describe("thought-virus registry", () => {
  it("ships five sectors", () => {
    expect(VIRUS_SECTORS).toHaveLength(5);
  });

  it("each sector has four containment actions", () => {
    for (const s of VIRUS_SECTORS) {
      expect(s.actions).toHaveLength(4);
    }
  });

  it("at least one action per sector reduces infection (cleanse) and at least one increases (drift)", () => {
    for (const s of VIRUS_SECTORS) {
      const reducers = s.actions.filter((a) => a.infectionDelta < 0);
      const drifts = s.actions.filter((a) => a.infectionDelta > 0);
      expect(reducers.length).toBeGreaterThan(0);
      expect(drifts.length).toBeGreaterThan(0);
    }
  });

  it("getSector / getAction look up by id", () => {
    const s = getSector("convergence_seat_proximity");
    expect(s?.name).toBe("Convergence Seat Proximity");
    expect(getAction("convergence_seat_proximity", "antiquarian_seal_seat")?.infectionDelta).toBe(-50);
    expect(getAction("convergence_seat_proximity", "nonexistent")).toBeUndefined();
  });
});

describe("clampInfection", () => {
  it("clamps to [0, 100]", () => {
    expect(clampInfection(-5)).toBe(0);
    expect(clampInfection(0)).toBe(0);
    expect(clampInfection(50)).toBe(50);
    expect(clampInfection(100)).toBe(100);
    expect(clampInfection(150)).toBe(100);
  });
});

describe("bandFor", () => {
  it("returns the documented bands at thresholds", () => {
    expect(bandFor(0)).toBe("clean");
    expect(bandFor(9)).toBe("clean");
    expect(bandFor(10)).toBe("subclinical");
    expect(bandFor(29)).toBe("subclinical");
    expect(bandFor(30)).toBe("active");
    expect(bandFor(60)).toBe("critical");
    expect(bandFor(89)).toBe("critical");
    expect(bandFor(90)).toBe("saturated");
    expect(bandFor(100)).toBe("saturated");
  });
});
