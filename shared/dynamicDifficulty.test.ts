import { describe, it, expect } from "vitest";
import {
  calculateDifficultyAdjustment,
  mapDifficultyToFightAI,
  mapDifficultyToChessElo,
  mapDifficultyToTerminusWaves,
  updatePerformance,
  createDefaultPerformance,
  type PlayerPerformance,
} from "./dynamicDifficulty";

/* ─── Helpers ─── */

function makePerf(overrides: Partial<PlayerPerformance> = {}): PlayerPerformance {
  return { ...createDefaultPerformance(), ...overrides };
}

/** Simulate N consecutive wins with a given margin, starting from a base perf. */
function simulateWins(count: number, margin: number, start?: PlayerPerformance): PlayerPerformance {
  let perf = start ?? createDefaultPerformance();
  for (let i = 0; i < count; i++) {
    perf = updatePerformance(perf, true, margin);
  }
  return perf;
}

/** Simulate N consecutive losses. */
function simulateLosses(count: number, margin: number, start?: PlayerPerformance): PlayerPerformance {
  let perf = start ?? createDefaultPerformance();
  for (let i = 0; i < count; i++) {
    perf = updatePerformance(perf, false, margin);
  }
  return perf;
}

/* ═══════════════════════════════════════════════════════
   TEST SUITE
   ═══════════════════════════════════════════════════════ */

describe("dynamicDifficulty", () => {
  /* ─── New player defaults ─── */

  it("new player starts at 0.3 difficulty", () => {
    const perf = createDefaultPerformance();
    expect(perf.currentDifficulty).toBe(0.3);
    expect(perf.totalGamesPlayed).toBe(0);
    expect(perf.winStreak).toBe(0);
    expect(perf.loseStreak).toBe(0);
  });

  /* ─── Win streak increases difficulty ─── */

  it("3 dominant wins increase difficulty", () => {
    const perf = simulateWins(3, 0.8);
    expect(perf.currentDifficulty).toBeGreaterThan(0.3);
    expect(perf.winStreak).toBe(3);
  });

  it("5 dominant wins increase difficulty further than 3", () => {
    const after3 = simulateWins(3, 0.8);
    const after5 = simulateWins(5, 0.8);
    expect(after5.currentDifficulty).toBeGreaterThan(after3.currentDifficulty);
  });

  /* ─── Lose streak decreases difficulty ─── */

  it("2 consecutive losses decrease difficulty", () => {
    const start = makePerf({ currentDifficulty: 0.5, totalGamesPlayed: 10 });
    const perf = simulateLosses(2, 0.1, start);
    expect(perf.currentDifficulty).toBeLessThan(0.5);
    expect(perf.loseStreak).toBe(2);
  });

  it("4 consecutive losses decrease difficulty more than 2", () => {
    const start = makePerf({ currentDifficulty: 0.6, totalGamesPlayed: 10 });
    const after2 = simulateLosses(2, 0.1, start);
    const after4 = simulateLosses(4, 0.1, start);
    expect(after4.currentDifficulty).toBeLessThan(after2.currentDifficulty);
  });

  /* ─── Difficulty bounds ─── */

  it("difficulty never exceeds 1.0 even after many dominant wins", () => {
    const perf = simulateWins(50, 0.95);
    expect(perf.currentDifficulty).toBeLessThanOrEqual(1.0);
  });

  it("difficulty never goes below 0.0 even after many losses", () => {
    const perf = simulateLosses(50, 0.05);
    expect(perf.currentDifficulty).toBeGreaterThanOrEqual(0.0);
  });

  /* ─── Close matches maintain difficulty ─── */

  it("close matches do not change difficulty", () => {
    const start = makePerf({ currentDifficulty: 0.5, totalGamesPlayed: 10 });
    // Alternating wins/losses with small margins — no streaks, close margins
    let perf = updatePerformance(start, true, 0.1);
    perf = updatePerformance(perf, false, 0.1);
    perf = updatePerformance(perf, true, 0.15);
    expect(perf.currentDifficulty).toBe(0.5);
  });

  /* ─── Adjustment magnitude ─── */

  it("single adjustment never exceeds 0.1", () => {
    const perf = makePerf({
      currentDifficulty: 0.5,
      winStreak: 10,
      averageMargin: 0.95,
      totalGamesPlayed: 20,
    });
    const adj = calculateDifficultyAdjustment(perf);
    expect(Math.abs(adj)).toBeLessThanOrEqual(0.1);
  });

  /* ─── Win resets lose streak ─── */

  it("winning resets lose streak to 0", () => {
    const start = makePerf({ loseStreak: 5, totalGamesPlayed: 10 });
    const perf = updatePerformance(start, true, 0.5);
    expect(perf.loseStreak).toBe(0);
    expect(perf.winStreak).toBe(1);
  });

  /* ─── mapDifficultyToFightAI ─── */

  it("maps difficulty to correct fight AI tiers", () => {
    expect(mapDifficultyToFightAI(0.0)).toBe("recruit");
    expect(mapDifficultyToFightAI(0.1)).toBe("recruit");
    expect(mapDifficultyToFightAI(0.24)).toBe("recruit");
    expect(mapDifficultyToFightAI(0.25)).toBe("soldier");
    expect(mapDifficultyToFightAI(0.49)).toBe("soldier");
    expect(mapDifficultyToFightAI(0.5)).toBe("veteran");
    expect(mapDifficultyToFightAI(0.74)).toBe("veteran");
    expect(mapDifficultyToFightAI(0.75)).toBe("archon");
    expect(mapDifficultyToFightAI(1.0)).toBe("archon");
  });

  it("clamps out-of-range values for fight AI mapping", () => {
    expect(mapDifficultyToFightAI(-0.5)).toBe("recruit");
    expect(mapDifficultyToFightAI(1.5)).toBe("archon");
  });

  /* ─── mapDifficultyToChessElo ─── */

  it("maps difficulty to ELO in 400-2200 range", () => {
    expect(mapDifficultyToChessElo(0.0)).toBe(400);
    expect(mapDifficultyToChessElo(1.0)).toBe(2200);
    expect(mapDifficultyToChessElo(0.5)).toBe(1300);
  });

  it("clamps out-of-range values for chess ELO mapping", () => {
    expect(mapDifficultyToChessElo(-1)).toBe(400);
    expect(mapDifficultyToChessElo(2)).toBe(2200);
  });

  /* ─── mapDifficultyToTerminusWaves ─── */

  it("produces valid terminus wave params at difficulty extremes", () => {
    const easy = mapDifficultyToTerminusWaves(0.0);
    expect(easy.spawnRate).toBe(1.5);
    expect(easy.enemyHpMultiplier).toBe(0.6);
    expect(easy.bossFrequency).toBe(10);

    const hard = mapDifficultyToTerminusWaves(1.0);
    expect(hard.spawnRate).toBe(0.5);
    expect(hard.enemyHpMultiplier).toBe(2.0);
    expect(hard.bossFrequency).toBe(3);
  });

  it("mid-difficulty produces intermediate terminus wave params", () => {
    const mid = mapDifficultyToTerminusWaves(0.5);
    expect(mid.spawnRate).toBeGreaterThan(0.5);
    expect(mid.spawnRate).toBeLessThan(1.5);
    expect(mid.enemyHpMultiplier).toBeGreaterThan(0.6);
    expect(mid.enemyHpMultiplier).toBeLessThan(2.0);
    expect(mid.bossFrequency).toBeGreaterThanOrEqual(3);
    expect(mid.bossFrequency).toBeLessThanOrEqual(10);
  });

  /* ─── Integration: full gameplay sequence ─── */

  it("handles a realistic sequence of mixed results", () => {
    let perf = createDefaultPerformance();

    // Player wins 3 dominant matches — difficulty should rise
    perf = simulateWins(3, 0.7, perf);
    const afterWins = perf.currentDifficulty;
    expect(afterWins).toBeGreaterThan(0.3);

    // Player then loses 2 — difficulty should drop
    perf = simulateLosses(2, 0.05, perf);
    expect(perf.currentDifficulty).toBeLessThan(afterWins);

    // Difficulty should still be reasonable (not wild swings)
    expect(perf.currentDifficulty).toBeGreaterThanOrEqual(0.0);
    expect(perf.currentDifficulty).toBeLessThanOrEqual(1.0);
  });
});
