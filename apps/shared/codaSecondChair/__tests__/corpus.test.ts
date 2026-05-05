import { describe, expect, it } from "vitest";
import { SECOND_CHAIR_CORPUS } from "../corpus";
import type { SecondChairTone } from "../types";

const VALID_TONES: readonly SecondChairTone[] = [
  "warning",
  "encouragement",
  "technical",
  "philosophical",
  "doubt",
  "memory",
  "self_correction",
];

describe("SECOND_CHAIR_CORPUS", () => {
  it("ships at least 40 fragments", () => {
    expect(SECOND_CHAIR_CORPUS.length).toBeGreaterThanOrEqual(40);
  });

  it("has unique fragment ids", () => {
    const ids = SECOND_CHAIR_CORPUS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only valid tones", () => {
    for (const f of SECOND_CHAIR_CORPUS) {
      expect(VALID_TONES).toContain(f.tone);
    }
  });

  it("declares at least one archetype on every fragment", () => {
    for (const f of SECOND_CHAIR_CORPUS) {
      expect(f.archetypes.length).toBeGreaterThan(0);
    }
  });

  it("includes a sufficient general pool", () => {
    const general = SECOND_CHAIR_CORPUS.filter((f) =>
      f.archetypes.includes("general"),
    );
    expect(general.length).toBeGreaterThanOrEqual(8);
  });

  it("includes coverage for every mission archetype", () => {
    const archetypes = ["infiltration", "outreach", "logistics", "skirmish", "diplomacy"] as const;
    for (const a of archetypes) {
      const count = SECOND_CHAIR_CORPUS.filter((f) =>
        f.archetypes.includes(a),
      ).length;
      expect(count).toBeGreaterThanOrEqual(6);
    }
  });

  it("ships at least 4 vexAware fragments", () => {
    const vexAware = SECOND_CHAIR_CORPUS.filter((f) => f.vexAware === true);
    expect(vexAware.length).toBeGreaterThanOrEqual(4);
  });

  it("uses every tone at least three times", () => {
    for (const tone of VALID_TONES) {
      const count = SECOND_CHAIR_CORPUS.filter((f) => f.tone === tone).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });
});
