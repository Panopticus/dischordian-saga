/* ═══════════════════════════════════════════════════════
   SAGA PHASES — Phase tracker tests

   Validates the canonical 15-phase saga spine (0-14):
   - all 15 phases registered
   - resolveCurrentSagaPhase returns correct phase for each
     canonical state
   - getCompletedPhases / hasReachedPhase / getNextPhaseGuidance
     behave correctly across the saga
   - the post-Fall (Phase 14) special case fires correctly
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  CANONICAL_SAGA_PHASE_COUNT,
  SAGA_PHASES,
  type SagaPhase,
  type SagaPhaseInput,
  getCompletedPhases,
  getMinimumPhaseForAct,
  getNextPhaseGuidance,
  getSagaPhaseDefinition,
  hasReachedPhase,
  resolveCurrentSagaPhase,
} from "./sagaPhases";

/** Helper: build a SagaPhaseInput with no flags set. */
const state = (narrativeAct: number, flags: Record<string, boolean> = {}): SagaPhaseInput => ({
  narrativeAct,
  flags,
});

describe("Saga phase registry", () => {
  it("registers exactly 15 phases (0 through 14)", () => {
    expect(SAGA_PHASES).toHaveLength(CANONICAL_SAGA_PHASE_COUNT);
    expect(CANONICAL_SAGA_PHASE_COUNT).toBe(15);
  });

  it("phases are sequential 0..14 with no gaps", () => {
    for (let i = 0; i < SAGA_PHASES.length; i++) {
      expect(SAGA_PHASES[i].phase).toBe(i);
    }
  });

  it("every phase has a non-empty title + premise + loreSource", () => {
    for (const p of SAGA_PHASES) {
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.premise.length).toBeGreaterThan(50);
      expect(p.loreSource.length).toBeGreaterThan(10);
    }
  });

  it("every phase has a coherent actRange (min <= max)", () => {
    for (const p of SAGA_PHASES) {
      expect(p.actRange.min).toBeLessThanOrEqual(p.actRange.max);
    }
  });

  it("getSagaPhaseDefinition returns the correct entry for every phase", () => {
    for (let i = 0; i <= 14; i++) {
      expect(getSagaPhaseDefinition(i as SagaPhase).phase).toBe(i);
    }
  });
});

describe("resolveCurrentSagaPhase", () => {
  it("returns Phase 0 for narrativeAct 0 with no flags", () => {
    expect(resolveCurrentSagaPhase(state(0))).toBe(0);
  });

  it("returns Phase 1 (Awakening) for narrativeAct 1 + act_1_started", () => {
    expect(resolveCurrentSagaPhase(state(1, { act_1_started: true }))).toBe(1);
  });

  it("returns Phase 2 (Fall of the First Wave) when holo_line_they_crossed is set", () => {
    expect(
      resolveCurrentSagaPhase(
        state(1, { act_1_started: true, holo_line_they_crossed: true }),
      ),
    ).toBe(2);
  });

  it("returns Phase 3 (The Source descended) for narrativeAct 2 + act_2_started", () => {
    expect(resolveCurrentSagaPhase(state(2, { act_2_started: true }))).toBe(3);
  });

  it("returns Phase 4 (Templum Veritus) when oracle_vision_first_sight is set", () => {
    expect(
      resolveCurrentSagaPhase(
        state(2, { act_2_started: true, oracle_vision_first_sight: true }),
      ),
    ).toBe(4);
  });

  it("returns Phase 5 (Collector Freed) at narrativeAct 3 + act_3_started", () => {
    expect(resolveCurrentSagaPhase(state(3, { act_3_started: true }))).toBe(5);
  });

  it("returns Phase 6 (Wyrmwood) when wyrmwood_barrier_shattered is set", () => {
    expect(
      resolveCurrentSagaPhase(
        state(3, { act_3_started: true, wyrmwood_barrier_shattered: true }),
      ),
    ).toBe(6);
  });

  it("returns Phase 7 (Memento Dischordia) at narrativeAct 4", () => {
    expect(resolveCurrentSagaPhase(state(4, { act_4_started: true }))).toBe(7);
  });

  it("returns Phase 8 (Theft of All Time) at narrativeAct 5", () => {
    expect(resolveCurrentSagaPhase(state(5, { act_5_started: true }))).toBe(8);
  });

  it("returns Phase 9 (Authority Hack) when cades_m6_complete is set", () => {
    expect(
      resolveCurrentSagaPhase(
        state(5, { act_5_started: true, cades_m6_complete: true }),
      ),
    ).toBe(9);
  });

  it("returns Phase 10 (Civil War + CADES M7) at narrativeAct 6", () => {
    expect(resolveCurrentSagaPhase(state(6, { act_6_started: true }))).toBe(10);
  });

  it("returns Phase 11 (Agent Zero Death Reveal) when vex_solene_identity_revealed", () => {
    expect(
      resolveCurrentSagaPhase(
        state(6, {
          act_6_started: true,
          vex_solene_identity_revealed: true,
        }),
      ),
    ).toBe(11);
  });

  it("returns Phase 12 (Baron's Time Heist) at narrativeAct 7", () => {
    expect(resolveCurrentSagaPhase(state(7, { act_7_started: true }))).toBe(12);
  });

  it("returns Phase 13 (War-Choice) when war_choice_vote_cast is set", () => {
    expect(
      resolveCurrentSagaPhase(
        state(7, { act_7_started: true, war_choice_vote_cast: true }),
      ),
    ).toBe(13);
  });

  it("returns Phase 14 (Servant Hero Academy Era) at narrativeAct 8+", () => {
    expect(resolveCurrentSagaPhase(state(8))).toBe(14);
    expect(resolveCurrentSagaPhase(state(99))).toBe(14);
  });

  it("returns Phase 14 also when servant_hero_academy_onboarded is set " +
     "(regardless of narrativeAct)", () => {
    expect(
      resolveCurrentSagaPhase(
        state(0, { servant_hero_academy_onboarded: true }),
      ),
    ).toBe(14);
  });
});

describe("Saga progress helpers", () => {
  it("hasReachedPhase returns true for completed + current phases", () => {
    const s = state(3, { act_3_started: true });
    expect(hasReachedPhase(s, 0)).toBe(true);
    expect(hasReachedPhase(s, 3)).toBe(true);
    expect(hasReachedPhase(s, 5)).toBe(true);
    expect(hasReachedPhase(s, 6)).toBe(false);
    expect(hasReachedPhase(s, 14)).toBe(false);
  });

  it("getNextPhaseGuidance returns the next phase definition", () => {
    const guidance = getNextPhaseGuidance(state(1, { act_1_started: true }));
    expect(guidance?.phase).toBe(2);
    expect(guidance?.title).toMatch(/Fall of the First Wave/);
  });

  it("getNextPhaseGuidance returns null at Phase 14 (no next phase)", () => {
    expect(getNextPhaseGuidance(state(8))).toBeNull();
    expect(getNextPhaseGuidance(state(99))).toBeNull();
  });

  it("getCompletedPhases returns all phases before the current one", () => {
    const s = state(3, { act_3_started: true });
    const completed = getCompletedPhases(s);
    // Current phase is 5; completed are 0-4.
    expect(completed).toEqual([0, 1, 2, 3, 4]);
  });

  it("getCompletedPhases returns empty for phase 0", () => {
    expect(getCompletedPhases(state(0))).toEqual([]);
  });
});

describe("Act-to-phase mapping", () => {
  it("getMinimumPhaseForAct(1) returns Phase 1 (first phase in Act 1)", () => {
    expect(getMinimumPhaseForAct(1)).toBe(1);
  });

  it("getMinimumPhaseForAct(2) returns Phase 3 (first phase in Act 2)", () => {
    expect(getMinimumPhaseForAct(2)).toBe(3);
  });

  it("getMinimumPhaseForAct(3) returns Phase 5 (first phase in Act 3)", () => {
    expect(getMinimumPhaseForAct(3)).toBe(5);
  });

  it("getMinimumPhaseForAct(4) returns Phase 7 (first phase in Act 4)", () => {
    expect(getMinimumPhaseForAct(4)).toBe(7);
  });

  it("getMinimumPhaseForAct(5) returns Phase 8 (first phase in Act 5)", () => {
    expect(getMinimumPhaseForAct(5)).toBe(8);
  });

  it("getMinimumPhaseForAct(6) returns Phase 10 (first phase in Act 6)", () => {
    expect(getMinimumPhaseForAct(6)).toBe(10);
  });

  it("getMinimumPhaseForAct(7) returns Phase 12 (first phase in Act 7)", () => {
    expect(getMinimumPhaseForAct(7)).toBe(12);
  });

  it("getMinimumPhaseForAct(8) returns Phase 14 (Servant Hero Academy)", () => {
    expect(getMinimumPhaseForAct(8)).toBe(14);
  });
});
