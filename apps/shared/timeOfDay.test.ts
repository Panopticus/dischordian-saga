import { describe, it, expect } from "vitest";
import {
  phaseFromHour,
  currentPhase,
  phaseLabel,
  phaseTint,
  phaseBrightness,
  allPhases,
} from "./timeOfDay";

describe("timeOfDay", () => {
  describe("phaseFromHour", () => {
    it("maps every hour to a known phase", () => {
      for (let h = 0; h < 24; h++) {
        const p = phaseFromHour(h);
        expect(allPhases()).toContain(p);
      }
    });

    it("dawn: 5..9", () => {
      expect(phaseFromHour(5)).toBe("dawn");
      expect(phaseFromHour(9)).toBe("dawn");
    });

    it("midday: 10..16", () => {
      expect(phaseFromHour(10)).toBe("midday");
      expect(phaseFromHour(16)).toBe("midday");
    });

    it("dusk: 17..21", () => {
      expect(phaseFromHour(17)).toBe("dusk");
      expect(phaseFromHour(21)).toBe("dusk");
    });

    it("nightwatch: 22..4", () => {
      expect(phaseFromHour(22)).toBe("nightwatch");
      expect(phaseFromHour(0)).toBe("nightwatch");
      expect(phaseFromHour(4)).toBe("nightwatch");
    });

    it("normalizes negatives + wraparound", () => {
      // -1 mod 24 → 23 → nightwatch
      expect(phaseFromHour(-1)).toBe("nightwatch");
      // 25 mod 24 → 1 → nightwatch
      expect(phaseFromHour(25)).toBe("nightwatch");
      // 30 mod 24 → 6 → dawn
      expect(phaseFromHour(30)).toBe("dawn");
    });
  });

  describe("phaseLabel/Tint/Brightness", () => {
    it("every phase has a label, tint, and brightness", () => {
      for (const p of allPhases()) {
        expect(phaseLabel(p).length).toBeGreaterThan(2);
        expect(phaseTint(p)).toMatch(/^[A-F0-9]{6}$/);
        const b = phaseBrightness(p);
        expect(b).toBeGreaterThan(0);
        expect(b).toBeLessThanOrEqual(1);
      }
    });

    it("midday is brightest, nightwatch is dimmest", () => {
      expect(phaseBrightness("midday")).toBeGreaterThan(phaseBrightness("dawn"));
      expect(phaseBrightness("midday")).toBeGreaterThan(phaseBrightness("dusk"));
      expect(phaseBrightness("nightwatch")).toBeLessThan(phaseBrightness("dusk"));
    });
  });

  describe("currentPhase", () => {
    it("uses the provided Date", () => {
      const d = new Date(2026, 4, 10, 14, 0, 0); // 14:00 → midday
      expect(currentPhase(d)).toBe("midday");
    });

    it("returns a known phase from system time", () => {
      const p = currentPhase();
      expect(allPhases()).toContain(p);
    });
  });
});
