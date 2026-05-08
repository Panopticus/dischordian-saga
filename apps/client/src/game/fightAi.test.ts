/**
 * fightAi unit tests — pure data + helper coverage.
 *
 * These tests would have been impossible while the AI data lived
 * inside FightEngine2D (the audit's "no client-side test imports
 * FightEngine2D" finding). Step 3a's extraction lets us pin the
 * profile-table invariants here without any DOM or canvas mocking.
 */
import { describe, it, expect } from "vitest";
import {
  AI_PROFILES,
  adaptAggression,
  idealDistanceFor,
  type AIDifficultyProfile,
  type Difficulty2D,
} from "./fightAi";

const TIERS: Difficulty2D[] = ["recruit", "soldier", "veteran", "archon"];

describe("AI_PROFILES table", () => {
  it("has an entry for every difficulty tier", () => {
    for (const tier of TIERS) {
      expect(AI_PROFILES[tier]).toBeDefined();
    }
  });

  it("rates are in [0, 1]", () => {
    for (const tier of TIERS) {
      const p = AI_PROFILES[tier];
      for (const key of [
        "comboAccuracy",
        "blockRate",
        "antiAirRate",
        "whiffPunishRate",
        "specialUseRate",
        "mistakeRate",
        "aggressionBase",
      ] as const) {
        expect(p[key], `${tier}.${key}`).toBeGreaterThanOrEqual(0);
        expect(p[key], `${tier}.${key}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("reactionFrames is monotonically decreasing as difficulty rises", () => {
    // Faster reactions = harder AI. Each tier should react strictly
    // sooner than the previous tier.
    for (let i = 1; i < TIERS.length; i++) {
      const prev = AI_PROFILES[TIERS[i - 1]].reactionFrames;
      const cur = AI_PROFILES[TIERS[i]].reactionFrames;
      expect(cur, `${TIERS[i]} reacts faster than ${TIERS[i - 1]}`).toBeLessThan(prev);
    }
  });

  it("blockRate, antiAirRate, whiffPunishRate increase with difficulty", () => {
    for (const key of ["blockRate", "antiAirRate", "whiffPunishRate"] as const) {
      for (let i = 1; i < TIERS.length; i++) {
        const prev = AI_PROFILES[TIERS[i - 1]][key];
        const cur = AI_PROFILES[TIERS[i]][key];
        expect(cur, `${TIERS[i]}.${key} > ${TIERS[i - 1]}.${key}`).toBeGreaterThan(prev);
      }
    }
  });

  it("mistakeRate decreases with difficulty", () => {
    for (let i = 1; i < TIERS.length; i++) {
      const prev = AI_PROFILES[TIERS[i - 1]].mistakeRate;
      const cur = AI_PROFILES[TIERS[i]].mistakeRate;
      expect(cur, `${TIERS[i]} makes fewer mistakes than ${TIERS[i - 1]}`).toBeLessThan(prev);
    }
  });
});

describe("adaptAggression", () => {
  const baseline: AIDifficultyProfile = AI_PROFILES.soldier;

  it("comeback boost when AI is losing badly", () => {
    // AI at 20% hp, player at 70% hp → comeback territory.
    const r = adaptAggression(baseline, 0.2, 0.7);
    expect(r.aggression).toBeGreaterThan(baseline.aggressionBase);
    expect(r.reactDelay).toBeLessThan(baseline.reactionFrames);
  });

  it("mercy reduction when AI is dominating", () => {
    // AI at 85% hp, player at 15% hp → mercy territory.
    const r = adaptAggression(baseline, 0.85, 0.15);
    expect(r.aggression).toBeLessThan(baseline.aggressionBase);
    expect(r.reactDelay).toBeGreaterThan(baseline.reactionFrames);
  });

  it("baseline when fight is balanced", () => {
    const r = adaptAggression(baseline, 0.5, 0.5);
    expect(r.aggression).toBe(baseline.aggressionBase);
    expect(r.reactDelay).toBe(baseline.reactionFrames);
  });

  it("comeback aggression caps at 0.9", () => {
    // Apply a profile already near the cap; comeback bump should
    // saturate rather than exceed 0.9.
    const r = adaptAggression(AI_PROFILES.archon, 0.1, 0.9);
    expect(r.aggression).toBeLessThanOrEqual(0.9);
  });

  it("mercy aggression floors at 0.2", () => {
    // Apply a profile already low; mercy reduction shouldn't go
    // below 0.2.
    const r = adaptAggression(AI_PROFILES.recruit, 0.85, 0.15);
    expect(r.aggression).toBeGreaterThanOrEqual(0.2);
  });

  it("comeback reactDelay floors at 4 frames", () => {
    // Veteran (12) - 8 = 4. Archon (5) - 8 = -3, clamped to 4.
    const r = adaptAggression(AI_PROFILES.archon, 0.1, 0.9);
    expect(r.reactDelay).toBeGreaterThanOrEqual(4);
  });
});

describe("idealDistanceFor", () => {
  it("zoners want max stand-off", () => {
    expect(idealDistanceFor("zoner")).toBe(400);
  });
  it("grapplers close the gap", () => {
    expect(idealDistanceFor("grappler")).toBe(80);
  });
  it("rushdown stays in poke range", () => {
    expect(idealDistanceFor("rushdown")).toBe(100);
  });
  it("unknown archetypes default to mid range", () => {
    expect(idealDistanceFor("balanced")).toBe(180);
    expect(idealDistanceFor("foo")).toBe(180);
  });
});
