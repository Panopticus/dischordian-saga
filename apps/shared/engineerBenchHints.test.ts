import { describe, it, expect } from "vitest";
import {
  ENGINEER_BENCH_HINTS,
  TOTAL_BENCH_HINTS,
  getEligibleHints,
} from "./engineerBenchHints";

describe("engineerBenchHints", () => {
  it("has hints for every recording", () => {
    const recordings = new Set(ENGINEER_BENCH_HINTS.map((h) => h.requiredRecording));
    expect(recordings.size).toBe(7);
  });

  it("every hint has a unique id", () => {
    const ids = ENGINEER_BENCH_HINTS.map((h) => h.id);
    expect(new Set(ids).size).toBe(TOTAL_BENCH_HINTS);
  });

  it("every hint has a non-empty line", () => {
    for (const hint of ENGINEER_BENCH_HINTS) {
      expect(hint.line.length).toBeGreaterThan(0);
    }
  });

  it("TOTAL_BENCH_HINTS matches array length", () => {
    expect(TOTAL_BENCH_HINTS).toBe(ENGINEER_BENCH_HINTS.length);
  });

  describe("getEligibleHints", () => {
    it("returns no hints when no recordings discovered", () => {
      expect(getEligibleHints({}, "craft_light")).toHaveLength(0);
    });

    it("returns light hints when recording 1 is discovered", () => {
      const flags = { engineer_recording_1_discovered: true };
      const hints = getEligibleHints(flags, "craft_light");
      expect(hints.length).toBeGreaterThan(0);
      expect(hints.every((h) => h.triggerAction === "craft_light")).toBe(true);
    });

    it("returns dark hints when recording 4 is discovered", () => {
      const flags = { engineer_recording_4_discovered: true };
      const hints = getEligibleHints(flags, "craft_dark");
      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0].requiredRecording).toBe("holo_line_they_crossed");
    });

    it("accumulates hints as more recordings are discovered", () => {
      const flags1 = { engineer_recording_1_discovered: true };
      const flags3 = {
        ...flags1,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
      };
      const hints1 = getEligibleHints(flags1, "craft_light");
      const hints3 = getEligibleHints(flags3, "craft_light");
      expect(hints3.length).toBeGreaterThanOrEqual(hints1.length);
    });

    it("filters by action type correctly", () => {
      const allFlags = {
        engineer_recording_1_discovered: true,
        engineer_recording_2_discovered: true,
        engineer_recording_3_discovered: true,
        engineer_recording_4_discovered: true,
        engineer_recording_5_discovered: true,
        engineer_recording_6_discovered: true,
        engineer_recording_7_discovered: true,
      };
      const fusion = getEligibleHints(allFlags, "fusion");
      expect(fusion.every((h) => h.triggerAction === "fusion")).toBe(true);
      const blueprint = getEligibleHints(allFlags, "blueprint_unlock");
      expect(blueprint.every((h) => h.triggerAction === "blueprint_unlock")).toBe(true);
    });
  });
});
