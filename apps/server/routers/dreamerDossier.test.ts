/**
 * Wiring + pure-helper tests for the dreamerDossier router. The
 * cryptic-register helpers (dreamerSummary, dreamerReading,
 * AXIS_LABEL_DREAMER) are exposed via _internals for unit-testing
 * the readback voice without a DB.
 */
import { describe, it, expect } from "vitest";
import { dreamerDossierRouter, _internals } from "./dreamerDossier";
import { emptyProfile } from "../../shared/playerProfile";

describe("dreamerDossierRouter — wiring", () => {
  it("module imports cleanly", () => {
    expect(dreamerDossierRouter).toBeDefined();
  });

  it("exposes the documented getMyDossier query", () => {
    const keys = Object.keys(
      (dreamerDossierRouter as unknown as {
        _def: { procedures: Record<string, unknown> };
      })._def.procedures,
    );
    expect(keys).toContain("getMyDossier");
  });
});

describe("dreamerReading — 5-tier signed-bucket readback", () => {
  it("DEEP_NEGATIVE bucket → 'absent'", () => {
    expect(_internals.dreamerReading(-100)).toBe("absent");
    expect(_internals.dreamerReading(-50)).toBe("absent");
  });

  it("BELOW_BASELINE bucket → 'quiet'", () => {
    expect(_internals.dreamerReading(-49)).toBe("quiet");
    expect(_internals.dreamerReading(-10)).toBe("quiet");
  });

  it("BASELINE bucket (between -10 and 10 exclusive) → 'uncertain'", () => {
    expect(_internals.dreamerReading(-9)).toBe("uncertain");
    expect(_internals.dreamerReading(0)).toBe("uncertain");
    expect(_internals.dreamerReading(9)).toBe("uncertain");
  });

  it("ABOVE_BASELINE bucket → 'open'", () => {
    expect(_internals.dreamerReading(10)).toBe("open");
    expect(_internals.dreamerReading(49)).toBe("open");
  });

  it("DEEP_POSITIVE bucket → 'unmistakable'", () => {
    expect(_internals.dreamerReading(50)).toBe("unmistakable");
    expect(_internals.dreamerReading(100)).toBe("unmistakable");
  });
});

describe("AXIS_LABEL_DREAMER — cryptic-register vocabulary", () => {
  it("each label is a short noun-phrase, not a calibration code", () => {
    for (const label of Object.values(_internals.AXIS_LABEL_DREAMER)) {
      // Architect labels look like ALL_CAPS_WITH_UNDERSCORES; Dreamer
      // labels are lowercase noun phrases.
      expect(label).not.toMatch(/^[A-Z_]+$/);
      expect(label.length).toBeGreaterThan(3);
      expect(label.length).toBeLessThan(40);
    }
  });

  it("never names the Dreamer or the Architect side", () => {
    for (const label of Object.values(_internals.AXIS_LABEL_DREAMER)) {
      expect(label).not.toMatch(/Dreamer/i);
      expect(label).not.toMatch(/Architect/i);
    }
  });

  it("every PROFILE_AXES axis has a dreamer label", () => {
    expect(Object.keys(_internals.AXIS_LABEL_DREAMER).sort()).toEqual([
      "aggression",
      "conformity",
      "curiosity",
      "mercy",
      "vigilance",
      "vulnerability",
      "wit",
    ]);
  });
});

describe("dreamerSummary — cover-page reading", () => {
  it("returns 'the page is empty' for zero observed events", () => {
    expect(_internals.dreamerSummary(emptyProfile())).toBe(
      "the page is empty.",
    );
  });

  it("returns 'half-written' for under-5-event small footprint", () => {
    const profile = { ...emptyProfile(), eventCount: 3 };
    expect(_internals.dreamerSummary(profile)).toBe(
      "the page is half-written.",
    );
  });

  it("returns 'reading is faint' when no axis crosses |30|", () => {
    const profile = {
      ...emptyProfile(),
      eventCount: 50,
      curiosity: 25,
      wit: -20,
    };
    expect(_internals.dreamerSummary(profile)).toBe("the reading is faint.");
  });

  it("composes the top axis when only one axis is loud", () => {
    const profile = {
      ...emptyProfile(),
      eventCount: 100,
      curiosity: 80,
      wit: 5,
    };
    const summary = _internals.dreamerSummary(profile);
    expect(summary).toContain("the open eye");
    expect(summary).toContain("unmistakable");
  });

  it("composes top + second axis when both are loud", () => {
    const profile = {
      ...emptyProfile(),
      eventCount: 100,
      curiosity: 80,
      mercy: 60,
    };
    const summary = _internals.dreamerSummary(profile);
    expect(summary).toContain("the open eye");
    expect(summary).toContain("the held hand");
  });

  it("never names the Dreamer or the Architect (silence-shape)", () => {
    const profile = {
      ...emptyProfile(),
      eventCount: 50,
      aggression: 80,
      mercy: 80,
      curiosity: 80,
      conformity: 80,
      vigilance: 80,
      vulnerability: 80,
      wit: 80,
    };
    const summary = _internals.dreamerSummary(profile);
    expect(summary).not.toMatch(/Dreamer/i);
    expect(summary).not.toMatch(/Architect/i);
  });
});
