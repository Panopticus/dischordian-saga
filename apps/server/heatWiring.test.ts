/**
 * Heat Phase 2 — duelystWs producer wiring (#1).
 *
 * Engine-side plumbing tests live in
 * apps/shared/tcg-core/heat/engineIntegration.test.ts; this file
 * covers the server side: the queue-pair lock-in merger,
 * JOIN_QUEUE payload acceptance, and the queue-failure path that
 * keeps a misconfigured heat stack from stranding both players in
 * a half-built match.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { mergeHeatModifiers } from "./duelystWs";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("mergeHeatModifiers — queue lock-in union", () => {
  it("returns [] for two empty lock-ins (Heat-0 vs Heat-0)", () => {
    expect(mergeHeatModifiers([], [])).toEqual([]);
  });

  it("returns the lone player's set when their opponent is Heat-0", () => {
    const p1 = ["a", "b"];
    expect(mergeHeatModifiers(p1, [])).toEqual(["a", "b"]);
    expect(mergeHeatModifiers([], p1)).toEqual(["a", "b"]);
  });

  it("unions two non-overlapping sets with duplicates dropped", () => {
    expect(mergeHeatModifiers(["a", "b"], ["c", "d"])).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("drops duplicates when both players picked the same modifier", () => {
    expect(mergeHeatModifiers(["a", "b"], ["b", "c"])).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("preserves p1 declaration order ahead of p2 (deterministic merge)", () => {
    expect(mergeHeatModifiers(["c", "a"], ["b", "a"])).toEqual([
      "c",
      "a",
      "b",
    ]);
  });
});

describe("duelystWs — heatModifiers wiring (static-analysis)", () => {
  const SRC = read("apps/server/duelystWs.ts");

  it("DuelystPlayer carries the heatModifiers field", () => {
    expect(SRC).toMatch(/heatModifiers:\s*readonly string\[\]/);
  });

  it("JOIN_QUEUE accepts an optional heatModifiers payload from the client", () => {
    expect(SRC).toMatch(
      /type:\s*["']JOIN_QUEUE["'][\s\S]*?heatModifiers\?:\s*string\[\]/,
    );
  });

  it("the queue-pair create call passes the merged heat to the engine", () => {
    expect(SRC).toMatch(/mergeHeatModifiers\(\s*p1\.heatModifiers/);
    // The engine call site uses the merged value as the heatModifiers opt.
    expect(SRC).toMatch(/heatModifiers,?\s*\}\)/);
  });

  it("a misconfigured heat stack returns both players to queue with an error", () => {
    // The init throw needs to be caught textually in the queue-pair
    // path so a typo'd modifier doesn't strand the pair in a half-
    // built match. Locked in here.
    expect(SRC).toMatch(/heat config invalid/);
    expect(SRC).toMatch(/p1\.matchId\s*=\s*null/);
    expect(SRC).toMatch(/p2\.matchId\s*=\s*null/);
  });

  it("matchCore.createServerMatchState forwards the heat option to createMatchState", () => {
    const src = read("apps/server/tcg/matchCore.ts");
    expect(src).toMatch(/heatModifiers\?:\s*readonly string\[\]/);
    expect(src).toMatch(/heatModifiers:\s*args\.heatModifiers/);
  });
});
