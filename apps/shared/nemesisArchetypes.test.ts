import { describe, expect, it } from "vitest";
import { APPRENTICE_ARCHETYPES } from "./apprentices";
import {
  NEMESIS_ARCHETYPE_BEHAVIORS,
  getNemesisArchetypeBehavior,
  weightedPlanKindsFor,
  isGrudgeAcceleratorFor,
} from "./nemesisArchetypes";

describe("Nemesis archetype behaviors — coverage", () => {
  it("all 12 ApprenticeArchetypes have an entry (parity)", () => {
    const present = Object.keys(NEMESIS_ARCHETYPE_BEHAVIORS).sort();
    const expected = [...APPRENTICE_ARCHETYPES].sort();
    expect(present).toEqual(expected);
  });

  it("every entry has a non-empty signature fallback line", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const b = NEMESIS_ARCHETYPE_BEHAVIORS[a];
      expect(b.signatureFallbackLine.length).toBeGreaterThan(10);
    }
  });

  it("recruit-affinity vector covers all 12 archetypes for each entry", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const b = NEMESIS_ARCHETYPE_BEHAVIORS[a];
      const keys = Object.keys(b.recruitAffinityVector).sort();
      expect(keys).toEqual([...APPRENTICE_ARCHETYPES].sort());
    }
  });

  it("faction-affinity vector covers all 5 factions for each archetype", () => {
    const expectedFactions = [
      "architect_remnants",
      "new_babylon",
      "hierarchy",
      "insurgency",
      "dreamers_children",
    ].sort();
    for (const a of APPRENTICE_ARCHETYPES) {
      const b = NEMESIS_ARCHETYPE_BEHAVIORS[a];
      const keys = Object.keys(b.factionAffinityVector).sort();
      expect(keys).toEqual(expectedFactions);
    }
  });

  it("at least one faction has affinity ≥ 6 for every archetype (no purely neutral Nemeses)", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const b = NEMESIS_ARCHETYPE_BEHAVIORS[a];
      const max = Math.max(...Object.values(b.factionAffinityVector));
      expect(max).toBeGreaterThanOrEqual(6);
    }
  });

  it("self-recruit-affinity is at least 7 for every archetype (signals strong same-lineage bond)", () => {
    // Note: self is NOT always strictly highest — some archetype-pair
    // dynamics are dramatic (a Zealot-Nemesis is more recruitable by a
    // Heretic-player than another Zealot, because the Heretic's "truer
    // cause" framing fits the Zealot's lost faith). But every archetype
    // has at least a 7/10 self-affinity — same lineage always reads.
    for (const a of APPRENTICE_ARCHETYPES) {
      const b = NEMESIS_ARCHETYPE_BEHAVIORS[a];
      expect(b.recruitAffinityVector[a]).toBeGreaterThanOrEqual(7);
    }
  });

  it("tick-cadence multipliers are within sane band [0.5, 1.5]", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const m = NEMESIS_ARCHETYPE_BEHAVIORS[a].tickCadenceMultiplier;
      expect(m).toBeGreaterThanOrEqual(0.5);
      expect(m).toBeLessThanOrEqual(1.5);
    }
  });

  it("each entry has at least one grudge accelerator", () => {
    for (const a of APPRENTICE_ARCHETYPES) {
      const t = NEMESIS_ARCHETYPE_BEHAVIORS[a].grudgeAccelerationTriggers;
      expect(t.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("getNemesisArchetypeBehavior", () => {
  it("returns the behavior for a known archetype", () => {
    const b = getNemesisArchetypeBehavior("ghost");
    expect(b.archetype).toBe("ghost");
    expect(b.voiceRegister).toBe("minimal_present_tense");
  });

  it("throws on an unknown archetype (defensive)", () => {
    expect(() =>
      getNemesisArchetypeBehavior("not_an_archetype" as never),
    ).toThrow(/no behavior registered/);
  });
});

describe("weightedPlanKindsFor", () => {
  it("multiplies baseline weights by archetype preferences", () => {
    const out = weightedPlanKindsFor("ghost", { casino_tip_jar_lift: 1.0 });
    expect(out.casino_tip_jar_lift).toBeCloseTo(2.5);
  });

  it("baseline of 0 stays 0 even with a positive preference", () => {
    const out = weightedPlanKindsFor("heretic", {
      apprentice_breaking_point_whisper: 0,
    });
    expect(out.apprentice_breaking_point_whisper).toBe(0);
  });

  it("preferences not in baseline still appear in output (default 1.0 baseline)", () => {
    const out = weightedPlanKindsFor("ghost", {});
    expect(out.casino_tip_jar_lift).toBeCloseTo(2.5);
  });

  it("unknown archetype returns baseline unchanged (defensive)", () => {
    const out = weightedPlanKindsFor("witch" as never, { trade_route_sabotage: 1.0 });
    expect(out.trade_route_sabotage).toBeCloseTo(1.0);
  });
});

describe("isGrudgeAcceleratorFor", () => {
  it("returns true for an archetype's listed acceleration triggers", () => {
    expect(isGrudgeAcceleratorFor("zealot", "mocked_by_player")).toBe(true);
    expect(isGrudgeAcceleratorFor("ghost", "fled_player")).toBe(true);
  });

  it("returns false for unrelated encounter kinds", () => {
    expect(isGrudgeAcceleratorFor("zealot", "casino_odds_rigged")).toBe(false);
    expect(isGrudgeAcceleratorFor("ghost", "killed_by_player")).toBe(false);
  });
});
