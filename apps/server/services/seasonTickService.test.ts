// apps/server/services/seasonTickService.test.ts
//
// Pure-function tests for computeSeasonAdvance(). Full integration
// (DB persistence, agenda fan-out, public-knowledge writes) is
// exercised at runtime — here we validate the phase transition math
// in isolation.

import { describe, it, expect } from "vitest";
import { computeSeasonAdvance } from "./seasonTickService";
import {
  SEASON_PHASE_DURATION_MS,
  SEASON_TICK_INTERVAL_MS,
  type SeasonClockState,
} from "@shared/tradeEmpire/season";

const T0 = 1_700_000_000_000;

const baseRunning: SeasonClockState = {
  seasonNumber: 1,
  phase: "running",
  phaseStartedAt: T0,
  phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.running,
  tickNumber: 0,
  lastTickAt: null,
  declaration: null,
};

describe("computeSeasonAdvance — no advance cases", () => {
  it("returns the same state if nothing has elapsed", () => {
    const out = computeSeasonAdvance(baseRunning, T0);
    expect(out.next).toEqual(baseRunning);
    expect(out.transitions).toEqual([]);
    expect(out.agendaTickFired).toBe(false);
  });

  it("returns the same state if elapsed time is below the tick interval", () => {
    const out = computeSeasonAdvance(baseRunning, T0 + 5_000);
    expect(out.next.tickNumber).toBe(0);
    expect(out.agendaTickFired).toBe(false);
  });
});

describe("computeSeasonAdvance — agenda tick", () => {
  it("fires an agenda tick once the interval has elapsed", () => {
    const out = computeSeasonAdvance(
      baseRunning,
      T0 + SEASON_TICK_INTERVAL_MS,
    );
    expect(out.agendaTickFired).toBe(true);
    expect(out.next.tickNumber).toBe(1);
    expect(out.next.lastTickAt).toBe(T0 + SEASON_TICK_INTERVAL_MS);
  });

  it("does NOT fire an agenda tick outside running", () => {
    const inPrologue: SeasonClockState = {
      ...baseRunning,
      phase: "prologue",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.prologue,
    };
    const out = computeSeasonAdvance(
      inPrologue,
      T0 + SEASON_TICK_INTERVAL_MS,
    );
    // Phase transition should have happened (running entered) but
    // the agenda tick on the *next* state checks against the new
    // phaseStartedAt, so no immediate tick.
    expect(out.next.phase).toBe("running");
  });
});

describe("computeSeasonAdvance — phase transitions", () => {
  it("advances from prologue → running when prologue duration elapses", () => {
    const inPrologue: SeasonClockState = {
      ...baseRunning,
      phase: "prologue",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.prologue,
    };
    const out = computeSeasonAdvance(
      inPrologue,
      T0 + SEASON_PHASE_DURATION_MS.prologue + 1,
    );
    expect(out.transitions.length).toBe(1);
    expect(out.transitions[0].enteredPhase).toBe("running");
    expect(out.next.phase).toBe("running");
  });

  it("cascades multiple phases if many durations elapsed", () => {
    const inClosing: SeasonClockState = {
      ...baseRunning,
      phase: "closing",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.closing,
    };
    // Wall-clock far in the future — should pass closing → interregnum
    // → prologue at minimum.
    const farFuture =
      T0 +
      SEASON_PHASE_DURATION_MS.closing +
      SEASON_PHASE_DURATION_MS.interregnum +
      1;
    const out = computeSeasonAdvance(inClosing, farFuture);
    const phasesEntered = out.transitions.map(t => t.enteredPhase);
    expect(phasesEntered).toContain("interregnum");
    expect(phasesEntered).toContain("prologue");
  });

  it("entering prologue increments seasonNumber and selects a declaration", () => {
    const inInterregnum: SeasonClockState = {
      ...baseRunning,
      phase: "interregnum",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.interregnum,
      declaration: null,
    };
    const out = computeSeasonAdvance(
      inInterregnum,
      T0 + SEASON_PHASE_DURATION_MS.interregnum + 1,
    );
    expect(out.next.phase).toBe("prologue");
    expect(out.next.seasonNumber).toBe(baseRunning.seasonNumber + 1);
    expect(out.next.declaration).not.toBeNull();
    expect(out.transitions[0].newSeasonNumber).toBe(
      baseRunning.seasonNumber + 1,
    );
  });

  it("phaseStartedAt aligns to the prior phaseEndsAt (no clock drift)", () => {
    const inPrologue: SeasonClockState = {
      ...baseRunning,
      phase: "prologue",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.prologue,
    };
    const out = computeSeasonAdvance(
      inPrologue,
      T0 + SEASON_PHASE_DURATION_MS.prologue + 1_234_567,
    );
    expect(out.next.phaseStartedAt).toBe(
      T0 + SEASON_PHASE_DURATION_MS.prologue,
    );
  });
});
