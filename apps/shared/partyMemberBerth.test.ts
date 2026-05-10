import { describe, it, expect } from "vitest";
import {
  expressionFor,
  activityFor,
  doorframeFor,
  ambientDetailFor,
  presenceDriftFor,
  apprenticeActivityCoverage,
  recruitActivityCoverage,
  APPRENTICE_ARCHETYPES_LIST,
} from "./partyMemberBerth";
import type {
  ApprenticePartyMember,
  ElaraPartyMember,
  HumanPartyMember,
  RecruitPartyMember,
} from "./partyMember";

const apprenticeFixture = (overrides: Partial<ApprenticePartyMember> = {}): ApprenticePartyMember => ({
  kind: "apprentice",
  id: "apprentice_active",
  apprenticeId: "test_apprentice",
  displayName: "T",
  archetype: "scholar",
  gender: "non-binary",
  rarity: "common",
  bond: 50,
  corruption: 10,
  trialDay: 7,
  ...overrides,
});

const elaraFixture = (overrides: Partial<ElaraPartyMember> = {}): ElaraPartyMember => ({
  kind: "elara",
  id: "elara",
  displayName: "Elara",
  stability: 0,
  stabilityBand: "lucid",
  ...overrides,
});

const humanFixture = (overrides: Partial<HumanPartyMember> = {}): HumanPartyMember => ({
  kind: "human",
  id: "the_human",
  displayName: "The Human",
  trust: 30,
  light: 0,
  lightBand: "balanced",
  revealStage: 2,
  ...overrides,
});

const recruitFixture = (overrides: Partial<RecruitPartyMember> = {}): RecruitPartyMember => ({
  kind: "recruit",
  id: "vex_solene",
  displayName: "Vex Solene",
  bond: 50,
  recruited: true,
  ...overrides,
});

describe("partyMemberBerth", () => {
  describe("expressionFor", () => {
    it("apprentice: high bond, low corruption → warm", () => {
      const m = apprenticeFixture({ bond: 80, corruption: 10 });
      expect(expressionFor(m)).toBe("warm");
    });

    it("apprentice: high corruption → wary", () => {
      const m = apprenticeFixture({ bond: 60, corruption: 80 });
      expect(expressionFor(m)).toBe("wary");
    });

    it("apprentice: low bond → wary", () => {
      const m = apprenticeFixture({ bond: 10 });
      expect(expressionFor(m)).toBe("wary");
    });

    it("apprentice: questStage 3 always vulnerable, regardless of bond/corruption", () => {
      const m = apprenticeFixture({ bond: 100, corruption: 0 });
      expect(expressionFor(m, { questStage: 3 })).toBe("vulnerable");
    });

    it("apprentice: purgeNoticeImminent forces vulnerable", () => {
      const m = apprenticeFixture({ bond: 80 });
      expect(expressionFor(m, { purgeNoticeImminent: true })).toBe("vulnerable");
    });

    it("Elara: stability ≤ -50 → vulnerable", () => {
      const m = elaraFixture({ stability: -60 });
      expect(expressionFor(m)).toBe("vulnerable");
    });

    it("Elara: stability ≥ 50 → warm", () => {
      const m = elaraFixture({ stability: 70 });
      expect(expressionFor(m)).toBe("warm");
    });

    it("Human: light band drives expression", () => {
      const wary = humanFixture({ light: -30 });
      expect(expressionFor(wary)).toBe("wary");
      const warm = humanFixture({ light: 60 });
      expect(expressionFor(warm)).toBe("warm");
    });

    it("Recruit: bond drives expression", () => {
      expect(expressionFor(recruitFixture({ bond: 10 }))).toBe("wary");
      expect(expressionFor(recruitFixture({ bond: 80 }))).toBe("warm");
    });
  });

  describe("activityFor", () => {
    it("returns an Activity for every (archetype × phase)", () => {
      for (const arch of APPRENTICE_ARCHETYPES_LIST) {
        for (const phase of ["dawn", "midday", "dusk", "nightwatch"] as const) {
          const a = activityFor(apprenticeFixture({ archetype: arch }), phase);
          expect(a.id).toBeTruthy();
          expect(a.label).toBeTruthy();
          expect(a.spritePath).toMatch(/^art\/berth\/activities\//);
        }
      }
    });

    it("Elara activity changes by phase", () => {
      const dawn = activityFor(elaraFixture(), "dawn");
      const dusk = activityFor(elaraFixture(), "dusk");
      expect(dawn.id).not.toBe(dusk.id);
    });

    it("Human activity tracks revealStage", () => {
      const stage0 = activityFor(humanFixture({ revealStage: 0 }), "midday");
      const stage4 = activityFor(humanFixture({ revealStage: 4 }), "midday");
      expect(stage0.id).toBe("signal_static");
      expect(stage4.id).toBe("watching_through_window");
    });
  });

  describe("doorframeFor", () => {
    it("Elara is centered on the bridge pedestal", () => {
      const d = doorframeFor(elaraFixture());
      expect(d.figureAnchor).toBe("center");
      expect(d.backdropPath).toContain("bridge");
    });

    it("apprentice gets archetype-keyed bunk art", () => {
      const d = doorframeFor(apprenticeFixture({ archetype: "ghost" }));
      expect(d.backdropPath).toContain("ghost_bunk");
    });
  });

  describe("ambientDetailFor", () => {
    it("returns null when no recent events", () => {
      expect(ambientDetailFor(apprenticeFixture(), [])).toBeNull();
    });

    it("doctrine_bound surfaces a doctrine slip detail (apprentice only)", () => {
      const d = ambientDetailFor(apprenticeFixture(), [{ kind: "doctrine_bound" }]);
      expect(d?.description.toLowerCase()).toContain("doctrine slip");
    });

    it("doctrine_bound returns null for Elara (not applicable)", () => {
      const d = ambientDetailFor(elaraFixture(), [{ kind: "doctrine_bound" }]);
      expect(d).toBeNull();
    });

    it("graduation_forge surfaces a forge detail", () => {
      const d = ambientDetailFor(apprenticeFixture(), [{ kind: "graduation_forge" }]);
      expect(d?.description.toLowerCase()).toContain("signature card");
    });
  });

  describe("presenceDriftFor", () => {
    it("0 drift below 30 seconds", () => {
      expect(presenceDriftFor(0)).toBe(0);
      expect(presenceDriftFor(29)).toBe(0);
    });

    it("0.5 drift between 30 and 90 seconds", () => {
      expect(presenceDriftFor(60)).toBe(0.5);
    });

    it("capped at 1 above 90 seconds", () => {
      expect(presenceDriftFor(120)).toBe(1);
      expect(presenceDriftFor(10000)).toBe(1);
    });
  });

  describe("coverage helpers", () => {
    it("apprenticeActivityCoverage produces 48 cells (12 × 4)", () => {
      const cells = apprenticeActivityCoverage();
      expect(cells.length).toBe(48);
      expect(cells.every(c => c.authored)).toBe(true);
    });

    it("recruitActivityCoverage covers all 5 recruits", () => {
      const cells = recruitActivityCoverage();
      const ids = new Set(cells.map(c => c.id));
      expect(ids.size).toBe(5);
      expect(cells.every(c => c.authored)).toBe(true);
    });
  });
});
