/**
 * Structural tests for useHumanWhispers.
 *
 * Source-scan style (mirrors SingleVideoCutsceneOverlay.test.tsx):
 * we verify the hook reads the correct GameContext fields, applies
 * the kebab→snake translation, gates on the Detective-seen flag,
 * and respects the `suppressed` arg — without mocking the entire
 * React context tree.
 */
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "useHumanWhispers.ts"),
  "utf-8",
);

describe("useHumanWhispers — wiring", () => {
  it("imports the pure selector from apps/shared/humanWhispers", () => {
    expect(SRC).toMatch(/import\b[^;]*pendingWhisper[^;]*from\s+["']@shared\/humanWhispers["']/);
  });

  it("imports useGame from the GameContext module", () => {
    expect(SRC).toMatch(/import\s*\{\s*useGame\s*\}\s*from\s+["']@\/contexts\/GameContext["']/);
  });

  it("exports useHumanWhispers as a named function", () => {
    expect(SRC).toMatch(/export function useHumanWhispers\(/);
  });

  it("takes a `suppressed: boolean` argument", () => {
    expect(SRC).toMatch(/useHumanWhispers\(suppressed:\s*boolean\)/);
  });
});

describe("useHumanWhispers — translation + state", () => {
  it("translates kebab-case room ids to snake_case for the selector", () => {
    // The hook must perform the GameContext (kebab) → humanWhispers
    // (snake) translation at the boundary. The simplest signal of
    // that translation is the replace call.
    expect(SRC).toContain('replace(/-/g, "_")');
  });

  it("reads currentRoomId from GameContext state", () => {
    expect(SRC).toMatch(/state\.currentRoomId/);
  });

  it("derives examinedHotspots from hotspotClickCount", () => {
    expect(SRC).toMatch(/state\.hotspotClickCount/);
  });

  it("reads narrativeFlags for the Detective-seen gate", () => {
    expect(SRC).toMatch(/narrativeFlags/);
    expect(SRC).toContain("human_life_detective_seen");
  });
});

describe("useHumanWhispers — suppression + dedupe", () => {
  it("returns null when the `suppressed` arg is true", () => {
    // The effect body must clear the slot and bail when suppressed.
    expect(SRC).toMatch(/if\s*\(suppressed\)\s*\{[\s\S]*?setWhisper\(null\)/);
  });

  it("dedupes seen whispers via a hook-local Set in a ref", () => {
    expect(SRC).toMatch(/seenRef\s*=\s*useRef<Set<string>>/);
    // dismiss adds the current whisper id to the seen set.
    expect(SRC).toMatch(/seenRef\.current\.add/);
  });

  it("does not mark the candidate seen when suppressed (only dismiss does)", () => {
    // The suppression branch must NOT call seenRef.current.add — it
    // simply refuses to surface. The seen-set mutation lives in
    // `dismiss` alone.
    const suppressedBranch = SRC.match(
      /if\s*\(suppressed\)\s*\{[\s\S]*?return;\s*\}/,
    );
    expect(suppressedBranch).not.toBeNull();
    expect(suppressedBranch![0]).not.toContain("seenRef.current.add");
  });
});

describe("useHumanWhispers — return shape", () => {
  it("returns an object with `whisper` and `dismiss`", () => {
    expect(SRC).toMatch(/return\s*\{\s*whisper,\s*dismiss\s*\}/);
  });

  it("dismiss is a stable useCallback", () => {
    expect(SRC).toMatch(/const dismiss\s*=\s*useCallback\(/);
  });
});
