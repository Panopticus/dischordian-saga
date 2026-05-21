/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Antiquarian briefer

   Pure deterministic composition. These tests pin:
   - Same input → same output (no randomness).
   - Briefing is composable for every (lord, tier) pair
     represented in the registry.
   - League state preamble selector picks the right beat
     across thresholds.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  ALL_HERO_TARGETS,
  briefMission,
  type LeagueState,
} from "..";

const NEUTRAL_STATE: LeagueState = {
  leagueStrength: 0.7,
  releasePressure: 0.2,
  hierarchyInfluence: 0.3,
};

describe("wolfHunt — antiquarianBriefer", () => {
  it("composes a briefing for every dossier in the registry", () => {
    for (const target of ALL_HERO_TARGETS) {
      const briefing = briefMission(target, NEUTRAL_STATE);
      expect(briefing.targetId).toBe(target.id);
      expect(briefing.preamble.length).toBeGreaterThan(20);
      expect(briefing.body.length).toBeGreaterThan(30);
      expect(briefing.closing.length).toBeGreaterThan(20);
    }
  });

  it("is deterministic — same input → same output", () => {
    const target = ALL_HERO_TARGETS[0];
    const a = briefMission(target, NEUTRAL_STATE);
    const b = briefMission(target, NEUTRAL_STATE);
    expect(a).toEqual(b);
  });

  it("opens with the high-pressure beat when releasePressure >= 0.8", () => {
    const target = ALL_HERO_TARGETS[0];
    const briefing = briefMission(target, {
      ...NEUTRAL_STATE,
      releasePressure: 0.85,
    });
    expect(briefing.preamble).toMatch(/past my comfortable margin/i);
  });

  it("opens with the mid-pressure beat when 0.5 <= releasePressure < 0.8", () => {
    const target = ALL_HERO_TARGETS[0];
    const briefing = briefMission(target, {
      ...NEUTRAL_STATE,
      releasePressure: 0.6,
    });
    expect(briefing.preamble).toMatch(/pressure is rising/i);
  });

  it("opens with the league-thinning beat when leagueStrength <= 0.25 and pressure is low", () => {
    const target = ALL_HERO_TARGETS[0];
    const briefing = briefMission(target, {
      leagueStrength: 0.2,
      releasePressure: 0.1,
      hierarchyInfluence: 0.8,
    });
    expect(briefing.preamble).toMatch(/grip on this stratum is thinning/i);
  });

  it("opens with the default ledger beat at neutral state", () => {
    const target = ALL_HERO_TARGETS[0];
    const briefing = briefMission(target, NEUTRAL_STATE);
    expect(briefing.preamble).toMatch(/ledger is open/i);
  });

  it("threads the class counter-tactic into the closing for each class represented", () => {
    const seenClasses = new Set<string>();
    for (const target of ALL_HERO_TARGETS) {
      seenClasses.add(target.classKey);
      const briefing = briefMission(target, NEUTRAL_STATE);
      // counter prose lives in CLASS_COUNTERS — every counter begins with
      // "<class>-class corruption". Assert the briefing contains that pattern.
      expect(briefing.closing).toMatch(
        new RegExp(`${target.classKey}-class corruption`, "i"),
      );
    }
    // The 10 lieutenants span at least 3 distinct classes (the matrix
    // distribution uses 5 classes × 2 lieutenants each; this PR seeds 10).
    expect(seenClasses.size).toBeGreaterThanOrEqual(3);
  });

  it("flags boss lieutenants in the body", () => {
    const lieutenants = ALL_HERO_TARGETS.filter((h) => h.isBossLieutenant);
    expect(lieutenants.length).toBeGreaterThan(0);
    for (const lt of lieutenants) {
      const briefing = briefMission(lt, NEUTRAL_STATE);
      expect(briefing.body).toMatch(/lieutenant/i);
    }
  });

  it("does NOT call a non-lieutenant a lieutenant", () => {
    const nonLieutenants = ALL_HERO_TARGETS.filter((h) => !h.isBossLieutenant);
    for (const h of nonLieutenants) {
      const briefing = briefMission(h, NEUTRAL_STATE);
      expect(briefing.body).not.toMatch(/this one is the lieutenant/i);
    }
  });
});
