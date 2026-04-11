import { describe, it, expect } from "vitest";
import {
  DEFAULT_PALIMPSEST_STATE,
  PALIMPSEST_DELTAS,
  applyPalimpsestDelta,
  applyRawDelta,
  applyPassiveDecay,
  recordEpisode,
  getPhase,
  getSignalDescription,
  getNoiseDescription,
  getBalanceDescription,
  shouldCorruptLoredex,
  shouldRepairLoredex,
  shouldHostMaskSlip,
  shouldMarkEntryCorrupted,
  getEntryCorruptionSeverity,
  NOISE_CORRUPTION_THRESHOLD,
  SIGNAL_REPAIR_THRESHOLD,
  MASK_SLIP_THRESHOLD,
  PASSIVE_SIGNAL_DECAY_PER_DAY,
  type PalimpsestState,
} from "./palimpsest";

const base = (): PalimpsestState => ({ ...DEFAULT_PALIMPSEST_STATE, history: [] });

describe("palimpsest meter", () => {
  describe("delta table", () => {
    it("defines both signal and noise side", () => {
      expect(PALIMPSEST_DELTAS.quizCorrect.signal).toBeGreaterThan(0);
      expect(PALIMPSEST_DELTAS.quizWrong.noise).toBeGreaterThan(0);
      expect(PALIMPSEST_DELTAS.episodeWon.signal).toBe(50);
      expect(PALIMPSEST_DELTAS.episodeLost.noise).toBe(25);
    });
  });

  describe("applyPalimpsestDelta", () => {
    it("increments signal on a truth event", () => {
      const s = applyPalimpsestDelta(base(), "quizCorrect");
      expect(s.signal).toBe(1);
      expect(s.noise).toBe(0);
    });

    it("increments noise on a corruption event", () => {
      const s = applyPalimpsestDelta(base(), "quizWrong");
      expect(s.noise).toBe(1);
      expect(s.signal).toBe(0);
    });

    it("supports a multiplier (e.g. bulk score)", () => {
      const s = applyPalimpsestDelta(base(), "quizCorrect", 10);
      expect(s.signal).toBe(10);
    });

    it("never drives signal or noise below zero", () => {
      const s = applyRawDelta(base(), -100, -100);
      expect(s.signal).toBe(0);
      expect(s.noise).toBe(0);
    });
  });

  describe("getPhase", () => {
    it("is truthful at small positive diff", () => {
      const s = applyRawDelta(base(), 20, 0);
      expect(getPhase(s)).toBe("truthful");
    });

    it("is radiant above SIGNAL_REPAIR_THRESHOLD", () => {
      const s = applyRawDelta(base(), SIGNAL_REPAIR_THRESHOLD + 10, 0);
      expect(getPhase(s)).toBe("radiant");
      expect(shouldRepairLoredex(s)).toBe(true);
    });

    it("is balanced around zero", () => {
      expect(getPhase(base())).toBe("balanced");
    });

    it("is corrupted when noise pulls ahead", () => {
      const s = applyRawDelta(base(), 0, NOISE_CORRUPTION_THRESHOLD + 10);
      expect(getPhase(s)).toBe("corrupted");
      expect(shouldCorruptLoredex(s)).toBe(true);
    });

    it("is overwritten when noise passes mask-slip threshold", () => {
      const s = applyRawDelta(base(), 0, MASK_SLIP_THRESHOLD + 10);
      expect(getPhase(s)).toBe("overwritten");
      expect(shouldHostMaskSlip(s)).toBe(true);
    });
  });

  describe("passive decay", () => {
    it("decays signal toward zero per day", () => {
      const start: PalimpsestState = { ...base(), signal: 100, lastDecayAt: new Date(0).toISOString() };
      const tenDays = 10 * 24 * 60 * 60 * 1000;
      const decayed = applyPassiveDecay(start, tenDays);
      expect(decayed.signal).toBe(100 - PASSIVE_SIGNAL_DECAY_PER_DAY * 10);
    });

    it("does not drive signal below zero", () => {
      const start: PalimpsestState = { ...base(), signal: 2, lastDecayAt: new Date(0).toISOString() };
      const manyDays = 1000 * 24 * 60 * 60 * 1000;
      const decayed = applyPassiveDecay(start, manyDays);
      expect(decayed.signal).toBe(0);
    });

    it("does NOT decay noise (noise is sticky)", () => {
      const start: PalimpsestState = { ...base(), noise: 100, lastDecayAt: new Date(0).toISOString() };
      const tenDays = 10 * 24 * 60 * 60 * 1000;
      const decayed = applyPassiveDecay(start, tenDays);
      expect(decayed.noise).toBe(100);
    });
  });

  describe("recordEpisode", () => {
    it("appends to history and advances episode counter", () => {
      const s = recordEpisode(base(), {
        episodeNumber: 1,
        winner: "signal",
        casualties: [],
        signalGained: 50,
        noiseGained: 0,
        inventorHackLanded: false,
      });
      expect(s.history).toHaveLength(1);
      expect(s.currentEpisode).toBe(2);
    });

    it("caps currentEpisode at 13", () => {
      let s: PalimpsestState = { ...base(), currentEpisode: 13 };
      s = recordEpisode(s, {
        episodeNumber: 13,
        winner: "signal",
        casualties: [],
        signalGained: 50,
        noiseGained: 0,
        inventorHackLanded: true,
      });
      expect(s.currentEpisode).toBe(13);
    });
  });

  describe("descriptors", () => {
    it("returns poetic text instead of numbers", () => {
      expect(getSignalDescription(0)).toMatch(/blank/);
      expect(getNoiseDescription(0)).toMatch(/smudges/);
      expect(getBalanceDescription(base())).toBeTruthy();
    });

    it("escalates as signal grows", () => {
      expect(getSignalDescription(900)).toMatch(/radiant|glow/i);
    });
  });

  describe("loredex corruption markers", () => {
    it("marks some entries when Noise dominates", () => {
      const corrupt: PalimpsestState = { ...base(), noise: 400, signal: 10 };
      // Test several deterministic IDs — at least one should be flagged.
      const ids = ["entry_1", "entry_2", "entry_3", "entry_4", "entry_5", "entry_6"];
      const flagged = ids.filter((id) => shouldMarkEntryCorrupted(id, corrupt));
      expect(flagged.length).toBeGreaterThan(0);
    });

    it("never marks entries when Signal dominates", () => {
      const truthful: PalimpsestState = { ...base(), signal: 500, noise: 0 };
      expect(shouldMarkEntryCorrupted("entry_xyz", truthful)).toBe(false);
      expect(getEntryCorruptionSeverity("entry_xyz", truthful)).toBe(0);
    });

    it("severity is between 0 and 1", () => {
      const worst: PalimpsestState = { ...base(), noise: 900, signal: 0 };
      for (const id of ["a", "bb", "ccc", "dddd"]) {
        const sev = getEntryCorruptionSeverity(id, worst);
        expect(sev).toBeGreaterThanOrEqual(0);
        expect(sev).toBeLessThanOrEqual(1);
      }
    });
  });
});
