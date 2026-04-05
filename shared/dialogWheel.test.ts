import { describe, it, expect } from "vitest";
import {
  computeCorruptionLevel,
  getCorruptionVisuals,
  getAvailableOptions,
  CORRUPTION_LEVELS,
  SEGMENT_META,
  RARITY_COLORS,
  type WheelOption,
} from "./dialogWheel";

describe("dialogWheel", () => {
  describe("computeCorruptionLevel", () => {
    it("returns 0 when Elara dominant or balanced", () => {
      expect(computeCorruptionLevel(50, 50)).toBe(0);
      expect(computeCorruptionLevel(80, 50)).toBe(0);
      expect(computeCorruptionLevel(50, 55)).toBe(0);
    });

    it("returns 1 when Human leads by 10-29", () => {
      expect(computeCorruptionLevel(50, 60)).toBe(1);
      expect(computeCorruptionLevel(40, 60)).toBe(1);
    });

    it("returns 2 when Human leads by 30-59", () => {
      expect(computeCorruptionLevel(20, 60)).toBe(2);
      expect(computeCorruptionLevel(10, 50)).toBe(2);
    });

    it("returns 3 when Human leads by 60+", () => {
      expect(computeCorruptionLevel(10, 80)).toBe(3);
      expect(computeCorruptionLevel(0, 100)).toBe(3);
    });
  });

  describe("getCorruptionVisuals", () => {
    it("returns visuals for all 4 levels", () => {
      expect(CORRUPTION_LEVELS).toHaveLength(4);
      for (let i = 0; i <= 3; i++) {
        const v = getCorruptionVisuals(i as 0 | 1 | 2 | 3);
        expect(v.level).toBe(i);
        expect(v.name).toBeTruthy();
        expect(v.wheelClass).toBeTruthy();
      }
    });

    it("level 0 has no active effects", () => {
      const v = getCorruptionVisuals(0);
      expect(Object.values(v.effects).every(e => e === false)).toBe(true);
    });

    it("level 3 has all effects active", () => {
      const v = getCorruptionVisuals(3);
      expect(Object.values(v.effects).every(e => e === true)).toBe(true);
    });

    it("effects cumulate by level", () => {
      const counts = CORRUPTION_LEVELS.map(v => Object.values(v.effects).filter(Boolean).length);
      for (let i = 1; i < counts.length; i++) {
        expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1]);
      }
    });
  });

  describe("segment metadata", () => {
    it("has 6 segments", () => {
      expect(Object.keys(SEGMENT_META)).toHaveLength(6);
    });

    it("each segment has position + color + moralityBias", () => {
      for (const key of Object.keys(SEGMENT_META)) {
        const meta = SEGMENT_META[key as keyof typeof SEGMENT_META];
        expect(meta.label).toBeTruthy();
        expect(meta.position.x).toBeGreaterThanOrEqual(0);
        expect(meta.position.x).toBeLessThanOrEqual(100);
        expect(meta.color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it("investigate at top, skill_check at bottom", () => {
      expect(SEGMENT_META.investigate.position.y).toBe(0);
      expect(SEGMENT_META.skill_check.position.y).toBe(100);
    });

    it("machine has negative bias, humanity has positive", () => {
      expect(SEGMENT_META.machine.moralityBias).toBeLessThan(0);
      expect(SEGMENT_META.humanity.moralityBias).toBeGreaterThan(0);
    });
  });

  describe("rarity colors", () => {
    it("has 6 rarities", () => {
      expect(Object.keys(RARITY_COLORS)).toHaveLength(6);
    });

    it("mythic uses holographic gradient", () => {
      expect(RARITY_COLORS.mythic.text).toMatch(/rainbow|url/);
    });
  });

  describe("getAvailableOptions", () => {
    const options: WheelOption[] = [
      {
        id: "a", segment: "machine", rarity: "common", label: "A", fullText: "A", outcome: {},
      },
      {
        id: "b", segment: "humanity", rarity: "epic", label: "B (skill)", fullText: "B", outcome: {},
        gateCondition: { minSkillLevel: { skillId: "tactics", level: 12 } },
      },
      {
        id: "c", segment: "investigate", rarity: "rare", label: "C (trust)", fullText: "C", outcome: {},
        gateCondition: { minTrust: { npcId: "elara", level: 70 } },
      },
      {
        id: "d", segment: "skill_check", rarity: "legendary", label: "D (flag)", fullText: "D", outcome: {},
        gateCondition: { requireFlag: "plot_reveal_1" },
      },
    ];

    it("returns ungated options by default", () => {
      const available = getAvailableOptions(options, { skills: {}, npcTrust: {}, flags: {} });
      expect(available.map(o => o.id)).toContain("a");
      expect(available.map(o => o.id)).not.toContain("b");
      expect(available.map(o => o.id)).not.toContain("c");
      expect(available.map(o => o.id)).not.toContain("d");
    });

    it("unlocks skill-gated when skill sufficient", () => {
      const available = getAvailableOptions(options, { skills: { tactics: 12 }, npcTrust: {}, flags: {} });
      expect(available.map(o => o.id)).toContain("b");
    });

    it("unlocks trust-gated when trust sufficient", () => {
      const available = getAvailableOptions(options, { skills: {}, npcTrust: { elara: 70 }, flags: {} });
      expect(available.map(o => o.id)).toContain("c");
    });

    it("unlocks flag-gated when flag set", () => {
      const available = getAvailableOptions(options, { skills: {}, npcTrust: {}, flags: { plot_reveal_1: true } });
      expect(available.map(o => o.id)).toContain("d");
    });
  });
});
