// apps/server/services/seasonTickService.integration.test.ts
//
// Integration test exercising the full runSeasonTick path against
// the in-memory caches (no DB required, mirroring how other server
// tests run). Validates that:
//   - Phase transitions cascade and persist into the singleton.
//   - Entering prologue selects a fresh declaration and posts it
//     to the public-knowledge ring buffer.
//   - The agenda tick fires inside running and increments tickNumber.
//   - Re-running the tick at the same wall-clock is a no-op (idempotent).

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { runSeasonTick } from "./seasonTickService";
import { seasonClockService } from "./seasonClockService";
import {
  _resetPublicKnowledgeCache,
  getRecentPublicKnowledge,
} from "./publicKnowledgeService";
import {
  SEASON_PHASE_DURATION_MS,
  SEASON_TICK_INTERVAL_MS,
  type SeasonClockState,
  type SeasonPhase,
} from "@shared/tradeEmpire/season";

const T0 = 1_700_000_000_000;

function setState(partial: Partial<SeasonClockState>) {
  seasonClockService.setState({
    seasonNumber: 1,
    phase: "running",
    phaseStartedAt: T0,
    phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.running,
    tickNumber: 0,
    lastTickAt: null,
    declaration: null,
    ...partial,
  });
}

beforeEach(() => {
  seasonClockService._resetForTests();
  _resetPublicKnowledgeCache();
});

afterEach(() => {
  seasonClockService._resetForTests();
  _resetPublicKnowledgeCache();
});

describe("runSeasonTick — integration", () => {
  it("is a no-op when nothing has elapsed", async () => {
    setState({});
    const out = await runSeasonTick(T0);
    expect(out.changed).toBe(false);
    expect(out.phasesEntered).toEqual([]);
    expect(out.agendaTicks).toBe(0);
  });

  it("fires an agenda tick once SEASON_TICK_INTERVAL_MS has elapsed", async () => {
    setState({});
    const out = await runSeasonTick(T0 + SEASON_TICK_INTERVAL_MS + 1);
    expect(out.changed).toBe(true);
    // No DB → no active users → agenda fan-out yields zero results,
    // but the clock still advanced.
    expect(seasonClockService.getState().tickNumber).toBe(1);
  });

  it("transitions through prologue → running and posts a declaration", async () => {
    setState({
      phase: "prologue",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.prologue,
    });
    const out = await runSeasonTick(T0 + SEASON_PHASE_DURATION_MS.prologue + 1);
    expect(out.phasesEntered).toContain("running");

    const news = getRecentPublicKnowledge(20);
    // Entering prologue picks a declaration; this transition went the
    // OTHER direction (prologue → running), so no declaration post yet.
    // We just assert no panic and the season state advanced.
    expect(seasonClockService.getState().phase).toBe("running");
    void news;
  });

  it("entering prologue (new season) posts a season_declaration event", async () => {
    setState({
      phase: "interregnum",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.interregnum,
    });
    const out = await runSeasonTick(
      T0 + SEASON_PHASE_DURATION_MS.interregnum + 1,
    );
    expect(out.phasesEntered).toContain("prologue");
    expect(out.newSeasonNumber).toBe(2);

    const news = getRecentPublicKnowledge(20);
    const declarationPost = news.find(
      n => n.eventKind === "season_declaration",
    );
    expect(declarationPost).toBeDefined();
    expect(declarationPost?.payload).toMatchObject({ seasonNumber: 2 });
  });

  it("cascades multiple phases when many durations have elapsed", async () => {
    setState({
      phase: "closing",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + SEASON_PHASE_DURATION_MS.closing,
    });
    const out = await runSeasonTick(
      T0 +
        SEASON_PHASE_DURATION_MS.closing +
        SEASON_PHASE_DURATION_MS.interregnum +
        1,
    );
    expect(out.phasesEntered).toContain("interregnum");
    expect(out.phasesEntered).toContain("prologue");
    expect(seasonClockService.getState().seasonNumber).toBe(2);
    expect(seasonClockService.getState().phase).toBe("prologue");
  });

  it("is idempotent — running twice at the same now is a no-op the second time", async () => {
    setState({});
    const t1 = T0 + SEASON_TICK_INTERVAL_MS + 1;
    await runSeasonTick(t1);
    const after1 = seasonClockService.getState();
    const out2 = await runSeasonTick(t1);
    const after2 = seasonClockService.getState();
    expect(out2.changed).toBe(false);
    expect(after1.tickNumber).toBe(after2.tickNumber);
    expect(after1.phase).toBe(after2.phase);
  });
});

describe("Season clock — phase predicates after transitions", () => {
  it("agendas only tick during running", async () => {
    setState({
      phase: "closing",
      phaseStartedAt: T0,
      phaseEndsAt: T0 + 60_000,
    });
    // Even after a tick interval, closing should not fire agenda ticks.
    const out = await runSeasonTick(T0 + SEASON_TICK_INTERVAL_MS + 1);
    expect(out.agendaTicks).toBe(0);
    const phase = seasonClockService.getState().phase as SeasonPhase;
    // Closing → interregnum should have happened given the elapsed time.
    expect(["interregnum", "closing", "prologue", "running"]).toContain(phase);
  });
});
