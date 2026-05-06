import { describe, it, expect } from "vitest";
import {
  LIVING_UNIVERSE_RULES,
  evaluateRules,
  ruleFires,
  type RuleDefinition,
} from "./livingUniverseRules";

describe("LIVING_UNIVERSE_RULES — invariants", () => {
  it("ships at least four rules covering the polarity spectrum", () => {
    expect(LIVING_UNIVERSE_RULES.length).toBeGreaterThanOrEqual(4);
  });

  it("every rule id is unique", () => {
    const ids = LIVING_UNIVERSE_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rule emits a non-empty eventId", () => {
    for (const r of LIVING_UNIVERSE_RULES) {
      expect(r.eventId.length).toBeGreaterThan(0);
    }
  });
});

describe("evaluateRules", () => {
  it("returns nothing for an empty pressure snapshot", () => {
    expect(evaluateRules({ pressure: {} })).toEqual([]);
  });

  it("fires the despair-cascade rule when 2 dark dimensions are over 50", () => {
    const out = evaluateRules({ pressure: { deaths: 60, viralExposures: 60 } });
    expect(out.map((r) => r.id)).toContain("two_dark_over_50");
  });

  it("does NOT fire despair-cascade with only one dark dimension", () => {
    const out = evaluateRules({ pressure: { deaths: 100 } });
    expect(out.map((r) => r.id)).not.toContain("two_dark_over_50");
  });

  it("fires hope-surge with 2 light dimensions over 50", () => {
    const out = evaluateRules({
      pressure: { truthRevealed: 60, healingDone: 60 },
    });
    expect(out.map((r) => r.id)).toContain("two_light_over_50");
  });

  it("untreated-outbreak requires high viral AND low healing", () => {
    const onWith = evaluateRules({
      pressure: { viralExposures: 60, healingDone: 5 },
    });
    expect(onWith.map((r) => r.id)).toContain("viral_without_healing");

    const onWithout = evaluateRules({
      pressure: { viralExposures: 60, healingDone: 60 },
    });
    expect(onWithout.map((r) => r.id)).not.toContain("viral_without_healing");
  });
});

describe("ruleFires — cooldown", () => {
  const cooldownRule: RuleDefinition = {
    id: "test_cd",
    name: "Cooldown test",
    description: "fires once per N days",
    eventId: "test_event",
    conditions: [
      { all: { dims: ["truthRevealed"], threshold: 10 } },
      { cooldownDays: { ruleId: "test_cd", days: 7 } },
    ],
  };

  it("fires when never fired before", () => {
    expect(
      ruleFires(cooldownRule, { pressure: { truthRevealed: 50 } }),
    ).toBe(true);
  });

  it("does NOT fire when within cooldown window", () => {
    const dayMs = 1000 * 60 * 60 * 24;
    expect(
      ruleFires(cooldownRule, {
        pressure: { truthRevealed: 50 },
        lastFiredAt: { test_cd: 0 },
        now: 3 * dayMs, // 3 days < 7
      }),
    ).toBe(false);
  });

  it("fires again once the cooldown has elapsed", () => {
    const dayMs = 1000 * 60 * 60 * 24;
    expect(
      ruleFires(cooldownRule, {
        pressure: { truthRevealed: 50 },
        lastFiredAt: { test_cd: 0 },
        now: 8 * dayMs, // 8 > 7
      }),
    ).toBe(true);
  });
});
