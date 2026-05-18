/**
 * Narrative-spine model invariants.
 *
 * The spine is the connective layer: every canon game mode must be
 * revealed by exactly one beat, every beat must resolve to real canon
 * (premise + saga phase), and the generated coherence doc must match.
 */
import { describe, it, expect } from "vitest";
import { GAME_MODE_PREMISES } from "./gameModeNarrativePremises";
import { SAGA_PHASES } from "./sagaPhases";
import {
  NARRATIVE_SPINE,
  actForBeat,
  getNarrativeSpineCoverage,
  getNarrativeSpineDefects,
} from "./narrativeSpine";
import { checkNarrativeSpineCoverage } from "./_completeness/checks/narrativeSpineCoverage";

describe("narrative spine — structural integrity", () => {
  it("has no structural defects", () => {
    expect(getNarrativeSpineDefects()).toEqual([]);
  });

  it("reveals every canon game mode exactly once (no system orphaned)", () => {
    for (const m of GAME_MODE_PREMISES) {
      const beats = NARRATIVE_SPINE.filter((b) => b.revealsPremiseId === m.id);
      expect(
        beats.length,
        `system '${m.id}' must be revealed by exactly one spine beat`,
      ).toBe(1);
    }
  });

  it("declared === bound === GAME_MODE_PREMISES count", () => {
    const { declared, bound } = getNarrativeSpineCoverage();
    expect(declared).toBe(GAME_MODE_PREMISES.length);
    expect(bound).toBe(GAME_MODE_PREMISES.length);
  });

  it("every beat binds to a registered saga phase", () => {
    for (const b of NARRATIVE_SPINE) {
      expect(
        SAGA_PHASES.some((p) => p.phase === b.sagaPhase),
        `beat '${b.id}' phase ${b.sagaPhase} must be registered`,
      ).toBe(true);
      expect(actForBeat(b)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("narrative spine — ship:check parity", () => {
  it("is hard-parity PASS (declared === implemented, no missing)", () => {
    const r = checkNarrativeSpineCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
    expect(r.declared).toBe(GAME_MODE_PREMISES.length);
  });
});
