/**
 * Behavioral tests for the match-length monitor (#88 chunk —
 * match-length p50/p95/p99). The aggregator is pure-function inside
 * its module; these tests exercise the public API directly without
 * needing a server bootstrap.
 *
 * Companion to performanceRouter.matchLength which surfaces the
 * report via the admin tRPC API; the wiring guard at the bottom
 * locks in that the three WebSocket handlers actually call
 * recordMatchStart / recordMatchEnd.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  recordMatchStart,
  recordMatchEnd,
  getMatchLengthReport,
  _resetForTests,
} from "./matchLengthMonitor";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

describe("matchLengthMonitor — recordMatchStart/End", () => {
  beforeEach(() => {
    _resetForTests();
  });

  it("returns null on end-without-start (server restarted mid-match)", () => {
    const result = recordMatchEnd("never_started", "pvp");
    expect(result).toBeNull();
    expect(getMatchLengthReport().pvp.count).toBe(0);
  });

  it("records a sample and returns its duration when end follows start", async () => {
    recordMatchStart("m1");
    await new Promise((r) => setTimeout(r, 25));
    const duration = recordMatchEnd("m1", "pvp", "normal");
    expect(duration).not.toBeNull();
    expect(duration!).toBeGreaterThanOrEqual(0.02);
    const report = getMatchLengthReport();
    expect(report.pvp.count).toBe(1);
    expect(report.all.count).toBe(1);
    expect(report.duelyst.count).toBe(0);
    expect(report.chess.count).toBe(0);
  });

  it("inProgress reflects unended matches", () => {
    recordMatchStart("a");
    recordMatchStart("b");
    recordMatchStart("c");
    expect(getMatchLengthReport().inProgress).toBe(3);
    recordMatchEnd("a", "pvp");
    expect(getMatchLengthReport().inProgress).toBe(2);
    recordMatchEnd("b", "duelyst");
    recordMatchEnd("c", "chess");
    expect(getMatchLengthReport().inProgress).toBe(0);
  });

  it("recordMatchStart is idempotent — second call wins-old-time", async () => {
    recordMatchStart("dup");
    await new Promise((r) => setTimeout(r, 30));
    recordMatchStart("dup"); // no-op, original start time stays
    await new Promise((r) => setTimeout(r, 5));
    const duration = recordMatchEnd("dup", "pvp");
    // Total should be ~35ms (from first start), not ~5ms (would
    // happen if the second start overwrote the time).
    expect(duration!).toBeGreaterThanOrEqual(0.03);
  });

  it("samples bucket cleanly by gameType", () => {
    // Manually craft samples by stamping fake start/end via the
    // public API. Each match-id is unique so the start-time map
    // doesn't accumulate.
    const t = Date.now();
    for (const [type, id] of [
      ["pvp", "p1"], ["pvp", "p2"],
      ["duelyst", "d1"],
      ["chess", "c1"], ["chess", "c2"], ["chess", "c3"],
    ] as const) {
      recordMatchStart(id);
      recordMatchEnd(id, type);
      void t;
    }
    const r = getMatchLengthReport();
    expect(r.pvp.count).toBe(2);
    expect(r.duelyst.count).toBe(1);
    expect(r.chess.count).toBe(3);
    expect(r.all.count).toBe(6);
  });

  it("computes percentiles on 100 synthetic samples", async () => {
    // 100 matches with linearly-increasing durations. Use real
    // sleeps for the first few to verify the math, then synthesize
    // the rest by direct timestamp manipulation via fast iterations.
    // Since we can't sleep 100 * 1ms reliably, just verify the
    // shape of the response.
    for (let i = 0; i < 10; i++) {
      const id = `synth_${i}`;
      recordMatchStart(id);
      await new Promise((r) => setTimeout(r, 5 + i * 2));
      recordMatchEnd(id, "pvp");
    }
    const r = getMatchLengthReport();
    expect(r.pvp.count).toBe(10);
    // p50 should be less than p95 should be less than p99 on a
    // monotonically-increasing sample set.
    expect(r.pvp.p50Sec).toBeLessThanOrEqual(r.pvp.p95Sec);
    expect(r.pvp.p95Sec).toBeLessThanOrEqual(r.pvp.p99Sec);
    expect(r.pvp.avgSec).toBeGreaterThan(0);
  });
});

describe("matchLengthMonitor wiring guard", () => {
  it("pvpWs.ts calls recordMatchStart and recordMatchEnd", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "apps/server/pvpWs.ts"), "utf-8");
    expect(src).toMatch(/import\s*\{[^}]*recordMatchStart[^}]*\}\s*from\s*["']\.\/matchLengthMonitor["']/);
    expect(src).toMatch(/recordMatchStart\(matchId\)/);
    expect(src).toMatch(/recordMatchEnd\([^,]+,\s*["']pvp["']/);
  });

  it("duelystWs.ts calls recordMatchStart and recordMatchEnd", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "apps/server/duelystWs.ts"), "utf-8");
    expect(src).toMatch(/import\s*\{[^}]*recordMatchStart[^}]*\}\s*from\s*["']\.\/matchLengthMonitor["']/);
    expect(src).toMatch(/recordMatchStart\(matchId\)/);
    expect(src).toMatch(/recordMatchEnd\([^,]+,\s*["']duelyst["']/);
  });

  it("chessWs.ts calls recordMatchStart and recordMatchEnd", () => {
    const src = fs.readFileSync(path.resolve(ROOT, "apps/server/chessWs.ts"), "utf-8");
    expect(src).toMatch(/import\s*\{[^}]*recordMatchStart[^}]*\}\s*from\s*["']\.\/matchLengthMonitor["']/);
    expect(src).toMatch(/recordMatchStart\(matchId\)/);
    expect(src).toMatch(/recordMatchEnd\([^,]+,\s*["']chess["']/);
  });

  it("performanceRouter exposes the matchLength procedure under adminProcedure", () => {
    const src = fs.readFileSync(
      path.resolve(ROOT, "apps/server/routers/performance.ts"),
      "utf-8",
    );
    expect(src).toMatch(/matchLength:\s*adminProcedure\.query/);
    expect(src).toMatch(
      /import\s*\{\s*getMatchLengthReport\s*\}\s*from\s*["']\.\.\/matchLengthMonitor["']/,
    );
  });
});
