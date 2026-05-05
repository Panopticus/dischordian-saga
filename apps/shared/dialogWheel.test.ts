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

  describe("identity gating", () => {
    const identityOpts: WheelOption[] = [
      { id: "demagi_only", segment: "humanity", rarity: "rare", label: "DeMagi", fullText: "...", outcome: {},
        gateCondition: { requireSpecies: "demagi" } },
      { id: "quarchon_only", segment: "machine", rarity: "rare", label: "Quarchon", fullText: "...", outcome: {},
        gateCondition: { requireSpecies: "quarchon" } },
      { id: "engineer_only", segment: "investigate", rarity: "epic", label: "Eng", fullText: "...", outcome: {},
        gateCondition: { requireClass: "engineer" } },
      { id: "fire_only", segment: "aggressive", rarity: "rare", label: "Fire", fullText: "...", outcome: {},
        gateCondition: { requireElement: "fire" } },
      { id: "order_only", segment: "compassionate", rarity: "uncommon", label: "Order", fullText: "...", outcome: {},
        gateCondition: { requireAlignment: "order" } },
      { id: "forbid_seen", segment: "skill_check", rarity: "legendary", label: "Unseen", fullText: "...", outcome: {},
        gateCondition: { forbidFlag: "already_saw_reveal" } },
    ];

    it("hides species-gated options without species context", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {} });
      expect(avail.map(o => o.id)).not.toContain("demagi_only");
    });

    it("shows demagi option to DeMagi players", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, species: "demagi" });
      expect(avail.map(o => o.id)).toContain("demagi_only");
      expect(avail.map(o => o.id)).not.toContain("quarchon_only");
    });

    it("Ne-Yon passes every requireSpecies gate", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, species: "neyon" });
      expect(avail.map(o => o.id)).toContain("demagi_only");
      expect(avail.map(o => o.id)).toContain("quarchon_only");
    });

    it("shows class-gated options to the right class", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, characterClass: "engineer" });
      expect(avail.map(o => o.id)).toContain("engineer_only");
    });

    it("hides class-gated options from the wrong class", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, characterClass: "oracle" });
      expect(avail.map(o => o.id)).not.toContain("engineer_only");
    });

    it("shows element-gated options to the right element", () => {
      const avail = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, element: "fire" });
      expect(avail.map(o => o.id)).toContain("fire_only");
    });

    it("respects alignment gating", () => {
      const order = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, alignment: "order" });
      const chaos = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {}, alignment: "chaos" });
      expect(order.map(o => o.id)).toContain("order_only");
      expect(chaos.map(o => o.id)).not.toContain("order_only");
    });

    it("forbidFlag hides option when flag present", () => {
      const unset = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: {} });
      const set = getAvailableOptions(identityOpts, { skills: {}, npcTrust: {}, flags: { already_saw_reveal: true } });
      expect(unset.map(o => o.id)).toContain("forbid_seen");
      expect(set.map(o => o.id)).not.toContain("forbid_seen");
    });

    it("accepts arrays of species/class/element", () => {
      const arrayOpts: WheelOption[] = [
        { id: "both_species", segment: "investigate", rarity: "rare", label: "Both", fullText: "...", outcome: {},
          gateCondition: { requireSpecies: ["demagi", "quarchon"] } },
        { id: "any_damage_class", segment: "aggressive", rarity: "rare", label: "Damage", fullText: "...", outcome: {},
          gateCondition: { requireClass: ["assassin", "soldier"] } },
      ];
      const demagiAvail = getAvailableOptions(arrayOpts, { skills: {}, npcTrust: {}, flags: {}, species: "demagi", characterClass: "soldier" });
      expect(demagiAvail.map(o => o.id)).toContain("both_species");
      expect(demagiAvail.map(o => o.id)).toContain("any_damage_class");
    });
  });

  describe("stat fallback for skill checks (resolves audit collision)", () => {
    const statCheckOpts: WheelOption[] = [
      {
        id: "intel_check",
        segment: "skill_check",
        rarity: "rare",
        label: "Pattern-match the encoding",
        fullText: "...",
        outcome: {},
        gateCondition: { minSkillLevel: { skillId: "intelligence", level: 8 } },
      },
      {
        id: "charisma_check",
        segment: "compassionate",
        rarity: "rare",
        label: "Persuade the guard",
        fullText: "...",
        outcome: {},
        gateCondition: { minSkillLevel: { skillId: "charisma", level: 7 } },
      },
    ];

    it("falls back to RPG stat when no Civil Skill of that id exists", () => {
      const avail = getAvailableOptions(statCheckOpts, {
        skills: {},
        npcTrust: {},
        flags: {},
        stats: { intelligence: 9, charisma: 5 },
      });
      expect(avail.map((o) => o.id)).toContain("intel_check");
      expect(avail.map((o) => o.id)).not.toContain("charisma_check");
    });

    it("uses whichever is higher between skill and stat", () => {
      const avail = getAvailableOptions(statCheckOpts, {
        skills: { charisma: 8 },
        npcTrust: {},
        flags: {},
        stats: { charisma: 3 },
      });
      expect(avail.map((o) => o.id)).toContain("charisma_check");
    });

    it("ignores stats absent from the player sheet", () => {
      const avail = getAvailableOptions(statCheckOpts, {
        skills: {},
        npcTrust: {},
        flags: {},
        stats: {},
      });
      expect(avail).toHaveLength(0);
    });
  });
});
