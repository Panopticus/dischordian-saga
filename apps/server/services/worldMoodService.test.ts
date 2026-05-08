import { describe, it, expect, beforeEach } from "vitest";
import {
  worldMoodService,
  pressureContribution,
  sealBaselineContribution,
} from "./worldMoodService";
import type { SealNumber } from "@shared/sevenSeals";

beforeEach(() => {
  worldMoodService._clearCache();
});

const ZERO_PRESSURE = {
  deaths: 0,
  trustGains: 0,
  viralExposures: 0,
  betrayals: 0,
  exploration: 0,
  loreDiscoveries: 0,
  moralityHumanity: 0,
  healingDone: 0,
};

describe("pressureContribution", () => {
  it("zero pressure → zero across all axes", () => {
    const c = pressureContribution(ZERO_PRESSURE);
    expect(c.conquest ?? 0).toBe(0);
    expect(c.war ?? 0).toBe(0);
    expect(c.death ?? 0).toBe(0);
  });

  it("exploration tilts conquest", () => {
    const c = pressureContribution({ ...ZERO_PRESSURE, exploration: 100 });
    expect(c.conquest ?? 0).toBeGreaterThan(0);
  });

  it("deaths tilt death; trustGains offset death", () => {
    const high = pressureContribution({ ...ZERO_PRESSURE, deaths: 60 });
    const offset = pressureContribution({
      ...ZERO_PRESSURE,
      deaths: 60,
      trustGains: 200,
    });
    expect(offset.death ?? 0).toBeLessThan(high.death ?? 0);
  });

  it("viralExposures + betrayals stack into war", () => {
    const c = pressureContribution({
      ...ZERO_PRESSURE,
      viralExposures: 80,
      betrayals: 40,
    });
    expect(c.war ?? 0).toBeGreaterThan(0.4);
  });

  it("healing + humanity push famine negative", () => {
    const c = pressureContribution({
      ...ZERO_PRESSURE,
      healingDone: 100,
      moralityHumanity: 100,
    });
    expect(c.famine ?? 0).toBeLessThan(0);
  });
});

describe("sealBaselineContribution", () => {
  it("empty seal set → empty contribution", () => {
    expect(sealBaselineContribution([])).toEqual({});
  });

  it("seal IV broken → death tilt", () => {
    expect(
      sealBaselineContribution([4 as SealNumber]).death ?? 0,
    ).toBeGreaterThan(0);
  });

  it("seals I+II+III stack across three axes", () => {
    const c = sealBaselineContribution([1, 2, 3] as SealNumber[]);
    expect(c.conquest ?? 0).toBeGreaterThan(0);
    expect(c.war ?? 0).toBeGreaterThan(0);
    expect(c.famine ?? 0).toBeGreaterThan(0);
    expect(c.death ?? 0).toBe(0);
  });
});

describe("worldMoodService._compose", () => {
  it("dominant horseman shifts as seals break", () => {
    const noSeals = worldMoodService._compose(ZERO_PRESSURE, [], 0);
    expect(noSeals.dominantAxis).toBe("conquest"); // tie → first

    const sealIII = worldMoodService._compose(
      ZERO_PRESSURE,
      [3 as SealNumber],
      0,
    );
    expect(sealIII.dominantAxis).toBe("famine");

    const sealIV = worldMoodService._compose(
      ZERO_PRESSURE,
      [4 as SealNumber],
      0,
    );
    expect(sealIV.dominantAxis).toBe("death");
  });

  it("Mercy offset reduces famine + death", () => {
    const before = worldMoodService._compose(
      { ...ZERO_PRESSURE, deaths: 50 },
      [4 as SealNumber],
      0,
    );
    const after = worldMoodService._compose(
      { ...ZERO_PRESSURE, deaths: 50 },
      [4 as SealNumber],
      0.1,
    );
    expect(after.death).toBeLessThan(before.death);
    expect(after.mercyOffset).toBe(0.1);
  });

  it("contributingSeals echoes the input", () => {
    const m = worldMoodService._compose(
      ZERO_PRESSURE,
      [1, 2] as SealNumber[],
      0,
    );
    expect(m.contributingSeals).toEqual([1, 2]);
  });
});
