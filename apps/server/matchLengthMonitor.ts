/* ═══════════════════════════════════════════════════════
   MATCH LENGTH MONITOR — Per-game-type p50/p95/p99 tracking

   Three match types run on this server: pvp (TCG / Dischordia),
   duelyst (TCG board variant), and chess. Each has its own
   `startMatch` / `endMatch` lifecycle handler in the WebSocket
   files (apps/server/pvpWs.ts, duelystWs.ts, chessWs.ts).

   This module is a thin in-process aggregator that records the
   wall-clock duration of each match keyed by its game type. The
   aggregator follows the same pattern as performanceMonitor.ts
   (rolling samples, MAX_SAMPLES cap, percentile compute on demand)
   so it has no external dependencies and zero cost when the
   server isn't actively serving matches.

   The data is surfaced to admin dashboards via
   `performanceRouter.matchLength` (see routers/performance.ts).
   Match-length samples reset on every server restart — long-term
   retention will need a separate metrics store.
   ═══════════════════════════════════════════════════════ */

export type MatchGameType = "pvp" | "duelyst" | "chess";

/** A single completed match's wall-clock duration. */
interface MatchLengthSample {
  durationSec: number;
  /** Wall-clock end time. Older samples roll out via MAX_SAMPLES. */
  endedAt: number;
  /** Optional reason flag — surrender, timeout, normal — so the
   *  admin can spot patterns where matches end early. */
  reason?: string;
}

/** Percentile rollup returned by `getMatchLengthReport`. */
export interface MatchLengthStats {
  p50Sec: number;
  p95Sec: number;
  p99Sec: number;
  avgSec: number;
  count: number;
}

const MAX_SAMPLES = 1000;

const startTimes = new Map<string, number>();
const samplesByType: Record<MatchGameType, MatchLengthSample[]> = {
  pvp: [],
  duelyst: [],
  chess: [],
};

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function computeStats(samples: MatchLengthSample[]): MatchLengthStats {
  if (samples.length === 0) {
    return { p50Sec: 0, p95Sec: 0, p99Sec: 0, avgSec: 0, count: 0 };
  }
  const sorted = [...samples].map((s) => s.durationSec).sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  return {
    p50Sec: Math.round(percentile(sorted, 50) * 100) / 100,
    p95Sec: Math.round(percentile(sorted, 95) * 100) / 100,
    p99Sec: Math.round(percentile(sorted, 99) * 100) / 100,
    avgSec: Math.round((sum / sorted.length) * 100) / 100,
    count: sorted.length,
  };
}

function trim<T>(arr: T[], max: number): void {
  if (arr.length > max) arr.splice(0, arr.length - max);
}

/**
 * Record the start of a match. Idempotent — calling twice with the
 * same id is a no-op (the existing start-time wins). Match ids are
 * keyed across all game types so the same id can't be reused.
 */
export function recordMatchStart(matchId: string): void {
  if (startTimes.has(matchId)) return;
  startTimes.set(matchId, Date.now());
}

/**
 * Record the end of a match. Computes wall-clock duration from the
 * paired `recordMatchStart`. Returns the duration in seconds for the
 * caller's logging convenience; returns null if no start was recorded
 * (which usually means the server restarted mid-match — we drop the
 * sample to avoid skewing the rollup).
 */
export function recordMatchEnd(
  matchId: string,
  gameType: MatchGameType,
  reason?: string,
): number | null {
  const start = startTimes.get(matchId);
  if (start === undefined) return null;
  startTimes.delete(matchId);

  const durationSec = (Date.now() - start) / 1000;
  // Defensive — clock drift or test stubs could produce negatives.
  if (durationSec < 0 || !Number.isFinite(durationSec)) return null;

  samplesByType[gameType].push({
    durationSec,
    endedAt: Date.now(),
    reason,
  });
  trim(samplesByType[gameType], MAX_SAMPLES);
  return durationSec;
}

/**
 * Aggregated report. Returns one stats block per game type plus a
 * combined "all" rollup. Admin dashboards can read either scope.
 */
export function getMatchLengthReport(): {
  pvp: MatchLengthStats;
  duelyst: MatchLengthStats;
  chess: MatchLengthStats;
  all: MatchLengthStats;
  inProgress: number;
} {
  const all = [
    ...samplesByType.pvp,
    ...samplesByType.duelyst,
    ...samplesByType.chess,
  ];
  return {
    pvp: computeStats(samplesByType.pvp),
    duelyst: computeStats(samplesByType.duelyst),
    chess: computeStats(samplesByType.chess),
    all: computeStats(all),
    inProgress: startTimes.size,
  };
}

/** Test-only helper. Resets the in-process state so tests can run
 *  in any order without polluting each other. Not exported in the
 *  public API barrel; tests import directly. */
export function _resetForTests(): void {
  startTimes.clear();
  samplesByType.pvp = [];
  samplesByType.duelyst = [];
  samplesByType.chess = [];
}
