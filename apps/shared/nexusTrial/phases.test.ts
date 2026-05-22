import { describe, it, expect } from "vitest";
import {
  TRIAL_PHASES,
  PHASE_DURATION_PRODUCTION_MS,
  PHASE_DURATION_STAGING_MS,
  PHASE_RESOLUTION_HOOKS,
  nextPhase,
  phaseAtOffset,
  trialDurationMs,
} from "./phases";

describe("TRIAL_PHASES", () => {
  it("declares exactly six phases in canonical order", () => {
    expect(TRIAL_PHASES).toEqual([
      "charge",
      "opening",
      "evidence",
      "cross_examination",
      "confession",
      "verdict",
    ]);
  });
});

describe("nextPhase", () => {
  it("walks the canonical sequence", () => {
    expect(nextPhase("charge")).toBe("opening");
    expect(nextPhase("opening")).toBe("evidence");
    expect(nextPhase("evidence")).toBe("cross_examination");
    expect(nextPhase("cross_examination")).toBe("confession");
    expect(nextPhase("confession")).toBe("verdict");
  });

  it("returns null at the end of the sequence (verdict has no successor)", () => {
    expect(nextPhase("verdict")).toBeNull();
  });

  it("throws on unknown phase", () => {
    expect(() => nextPhase("garbage" as never)).toThrow();
  });
});

describe("phaseAtOffset", () => {
  const D = PHASE_DURATION_PRODUCTION_MS;

  it("maps each 12-hour window to the correct phase", () => {
    expect(phaseAtOffset(0, D)).toBe("charge");
    expect(phaseAtOffset(D - 1, D)).toBe("charge");
    expect(phaseAtOffset(D, D)).toBe("opening");
    expect(phaseAtOffset(2 * D, D)).toBe("evidence");
    expect(phaseAtOffset(3 * D, D)).toBe("cross_examination");
    expect(phaseAtOffset(4 * D, D)).toBe("confession");
    expect(phaseAtOffset(5 * D, D)).toBe("verdict");
  });

  it("returns null for past-the-end offsets", () => {
    expect(phaseAtOffset(6 * D, D)).toBeNull();
    expect(phaseAtOffset(100 * D, D)).toBeNull();
  });

  it("returns null for negative offsets", () => {
    expect(phaseAtOffset(-1, D)).toBeNull();
  });

  it("works with the staging duration too", () => {
    const S = PHASE_DURATION_STAGING_MS;
    expect(phaseAtOffset(0, S)).toBe("charge");
    expect(phaseAtOffset(3 * S, S)).toBe("cross_examination");
    expect(phaseAtOffset(6 * S, S)).toBeNull();
  });
});

describe("trialDurationMs", () => {
  it("production trial runs 72 hours", () => {
    expect(trialDurationMs(PHASE_DURATION_PRODUCTION_MS)).toBe(72 * 60 * 60 * 1000);
  });

  it("staging dry-run compresses to 72 minutes", () => {
    expect(trialDurationMs(PHASE_DURATION_STAGING_MS)).toBe(72 * 60 * 1000);
  });
});

describe("PHASE_RESOLUTION_HOOKS", () => {
  it("ballot resolves at cross_examination close (hour 48 in production)", () => {
    expect(PHASE_RESOLUTION_HOOKS.resolveBallotAt).toBe("cross_examination");
  });

  it("companion sacrifice resolves at confession close (hour 60 in production)", () => {
    expect(PHASE_RESOLUTION_HOOKS.resolveCompanionSacrificeAt).toBe("confession");
  });

  it("trial closes at verdict (hour 72 in production)", () => {
    expect(PHASE_RESOLUTION_HOOKS.trialClosesAt).toBe("verdict");
  });
});
