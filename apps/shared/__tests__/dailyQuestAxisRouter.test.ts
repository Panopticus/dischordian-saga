import { describe, it, expect } from "vitest";

import {
  QUEST_TYPE_AXIS_DEFAULTS,
  magnitudeContribution,
  pickAxisWeightedTemplates,
  tagByQuestType,
  templateWeight,
  type AxisTaggedQuestTemplate,
} from "../dailyQuestAxisRouter";

const sampleTemplates: AxisTaggedQuestTemplate[] = [
  { id: "t_fight", questType: "fight" },
  { id: "t_card", questType: "card_battle" },
  { id: "t_trade", questType: "trade" },
  { id: "t_craft", questType: "craft" },
  { id: "t_explore", questType: "explore" },
  { id: "t_social", questType: "social" },
];

describe("magnitudeContribution", () => {
  it.each([
    ["strong_positive", 3],
    ["moderate_positive", 2],
    ["mild_positive", 1],
    ["neutral", 0],
    ["mild_negative", -1],
    ["moderate_negative", -2],
    ["strong_negative", -3],
  ] as const)("maps %s → %i", (mag, expected) => {
    expect(magnitudeContribution(mag)).toBe(expected);
  });
});

describe("tagByQuestType", () => {
  it("applies questType defaults to untagged templates", () => {
    const t = tagByQuestType({ id: "x", questType: "fight" });
    expect(t.axes).toEqual(QUEST_TYPE_AXIS_DEFAULTS.fight);
  });

  it("respects explicit axes overrides", () => {
    const explicit = ["wit"] as const;
    const t = tagByQuestType({
      id: "x",
      questType: "fight",
      axes: explicit,
    });
    expect(t.axes).toBe(explicit);
  });
});

describe("templateWeight", () => {
  it("untagged template returns baseline", () => {
    const t: AxisTaggedQuestTemplate = { id: "x", questType: "fight" };
    expect(templateWeight(t, {})).toBe(1);
  });

  it("axis match adds magnitude contribution", () => {
    // Fight = aggression + vigilance. Player strong_positive aggression.
    const t = tagByQuestType({ id: "f", questType: "fight" });
    const weight = templateWeight(t, { aggression: "strong_positive" });
    // baseline (1) + aggression strong_positive (3) = 4
    expect(weight).toBe(4);
  });

  it("multiple matching axes sum", () => {
    const t = tagByQuestType({ id: "f", questType: "fight" });
    const weight = templateWeight(t, {
      aggression: "strong_positive", // +3
      vigilance: "moderate_positive", // +2
    });
    // 1 + 3 + 2 = 6
    expect(weight).toBe(6);
  });

  it("opposing axis magnitudes can drive weight below baseline", () => {
    const t = tagByQuestType({ id: "f", questType: "fight" });
    const weight = templateWeight(t, {
      aggression: "strong_negative", // -3
      vigilance: "strong_negative", // -3
    });
    // 1 - 3 - 3 = -5 → clamped to 0.1 floor
    expect(weight).toBe(0.1);
  });

  it("axes the template doesn't tag are ignored", () => {
    const social = tagByQuestType({ id: "s", questType: "social" });
    // Social tagged with mercy + vulnerability. Aggression should not affect.
    const weight = templateWeight(social, { aggression: "strong_positive" });
    expect(weight).toBe(1);
  });
});

describe("pickAxisWeightedTemplates", () => {
  it("picks `count` distinct templates", () => {
    const picks = pickAxisWeightedTemplates(sampleTemplates, {
      count: 3,
      axes: {},
      random: () => 0.5,
    });
    expect(picks.length).toBe(3);
    expect(new Set(picks.map(p => p.id)).size).toBe(3);
  });

  it("respects suppressIds", () => {
    const picks = pickAxisWeightedTemplates(sampleTemplates, {
      count: 6,
      axes: {},
      suppressIds: new Set(["t_fight", "t_card"]),
      random: () => 0.5,
    });
    const pickedIds = new Set(picks.map(p => p.id));
    expect(pickedIds.has("t_fight")).toBe(false);
    expect(pickedIds.has("t_card")).toBe(false);
  });

  it("biases toward axis-matched templates with deterministic random", () => {
    // Player is strongly aggressive — fight templates should be over-
    // represented across many runs of the picker.
    const aggressive = { aggression: "strong_positive" } as const;
    const counts: Record<string, number> = {};
    let seed = 1;
    const seededRandom = () => {
      // Simple LCG for repeatable test seeding.
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 500; i++) {
      const picks = pickAxisWeightedTemplates(sampleTemplates, {
        count: 1,
        axes: aggressive,
        random: seededRandom,
      });
      counts[picks[0].id] = (counts[picks[0].id] ?? 0) + 1;
    }
    // Fight has axis match (aggression), others don't. Fight should
    // dominate the count (~ 4× baseline / sum).
    const fightCount = counts["t_fight"] ?? 0;
    const others = Object.values(counts).reduce((a, b) => a + b, 0) - fightCount;
    expect(fightCount).toBeGreaterThan(others / 4); // empirically very safe
  });

  it("returns fewer than `count` when pool is too small", () => {
    const small = sampleTemplates.slice(0, 2);
    const picks = pickAxisWeightedTemplates(small, {
      count: 5,
      axes: {},
      random: () => 0.5,
    });
    expect(picks.length).toBe(2);
  });

  it("opposite axis profiles bias toward different templates", () => {
    const seedFor = (start: number) => {
      let s = start;
      return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
    };
    const aggressivePicks: Record<string, number> = {};
    const mercifulPicks: Record<string, number> = {};
    for (let i = 0; i < 300; i++) {
      const a = pickAxisWeightedTemplates(sampleTemplates, {
        count: 1,
        axes: { aggression: "strong_positive" },
        random: seedFor(i + 1),
      });
      aggressivePicks[a[0].id] = (aggressivePicks[a[0].id] ?? 0) + 1;
      const m = pickAxisWeightedTemplates(sampleTemplates, {
        count: 1,
        axes: { mercy: "strong_positive", vulnerability: "moderate_positive" },
        random: seedFor(i + 1000),
      });
      mercifulPicks[m[0].id] = (mercifulPicks[m[0].id] ?? 0) + 1;
    }
    // Aggressive players should pick fight more than merciful do;
    // merciful should pick social more than aggressive do.
    expect((aggressivePicks["t_fight"] ?? 0)).toBeGreaterThan(
      mercifulPicks["t_fight"] ?? 0,
    );
    expect((mercifulPicks["t_social"] ?? 0)).toBeGreaterThan(
      aggressivePicks["t_social"] ?? 0,
    );
  });
});

describe("QUEST_TYPE_AXIS_DEFAULTS — coverage", () => {
  it("tags every quest type", () => {
    const types: AxisTaggedQuestTemplate["questType"][] = [
      "fight",
      "card_battle",
      "trade",
      "craft",
      "explore",
      "social",
    ];
    for (const t of types) {
      expect(QUEST_TYPE_AXIS_DEFAULTS[t]).toBeDefined();
      expect(QUEST_TYPE_AXIS_DEFAULTS[t].length).toBeGreaterThan(0);
    }
  });
});
