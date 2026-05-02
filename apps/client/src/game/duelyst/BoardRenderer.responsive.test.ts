/**
 * M1 (responsive Pixi board) — pure-function tests for the aspect-fit
 * helpers + a source-scan check that the resize hook is wired in
 * `DuelystGameUI.tsx`.
 *
 * The full Pixi instance + ResizeObserver flow needs a browser DOM and
 * a real WebGL context, neither of which vitest provides; integration
 * coverage lives in the e2e suite. The pure helpers below carry the
 * aspect-fit math and are the only place that math lives — a
 * regression here would mean every viewport gets the wrong canvas
 * dimensions.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  fitAspect,
  computePhysicalSize,
  BOARD_LOGICAL_WIDTH,
  BOARD_LOGICAL_HEIGHT,
} from "./BoardRenderer";

const ASPECT = BOARD_LOGICAL_WIDTH / BOARD_LOGICAL_HEIGHT;

describe("fitAspect — M1 aspect-fit math", () => {
  it("returns the LOGICAL board size for a perfectly-aspected viewport", () => {
    const r = fitAspect(BOARD_LOGICAL_WIDTH, BOARD_LOGICAL_HEIGHT);
    expect(r.width).toBe(BOARD_LOGICAL_WIDTH);
    expect(r.height).toBe(BOARD_LOGICAL_HEIGHT);
  });

  it("portrait mobile: width-bound — fills the parent width, letterboxes vertically", () => {
    // iPhone 14 portrait viewport: 390 × 844 CSS pixels (ish).
    const r = fitAspect(390, 600);
    // Width-bound (parent is taller than the 9:5 ratio needs).
    expect(r.width).toBe(390);
    // Height = width / aspect, floored.
    expect(r.height).toBe(Math.floor(390 / ASPECT));
    // Maintains aspect within rounding tolerance.
    expect(r.width / r.height).toBeCloseTo(ASPECT, 1);
  });

  it("landscape desktop: height-bound — letterboxes horizontally", () => {
    // Wide-but-short viewport (e.g. desktop 1920 × 400 docked).
    const r = fitAspect(1920, 400);
    // Height-bound.
    expect(r.height).toBe(400);
    expect(r.width).toBe(Math.floor(400 * ASPECT));
    expect(r.width / r.height).toBeCloseTo(ASPECT, 1);
  });

  it("ipad landscape: comfortably-sized aspect-correct box", () => {
    // iPad Pro landscape — 1366 × 1024 minus chrome.
    const r = fitAspect(1366, 800);
    expect(r.width).toBeLessThanOrEqual(1366);
    expect(r.height).toBeLessThanOrEqual(800);
    expect(r.width / r.height).toBeCloseTo(ASPECT, 1);
  });

  it("returns 0 × 0 for non-positive bounds (test envs / hidden mounts)", () => {
    expect(fitAspect(0, 800)).toEqual({ width: 0, height: 0 });
    expect(fitAspect(400, 0)).toEqual({ width: 0, height: 0 });
    expect(fitAspect(-1, 100)).toEqual({ width: 0, height: 0 });
  });

  it("never exceeds the bounding box on either axis", () => {
    for (const [bw, bh] of [
      [100, 100],
      [200, 1000],
      [1000, 200],
      [777, 451],
      [779, 449],
    ] as const) {
      const r = fitAspect(bw, bh);
      expect(r.width).toBeLessThanOrEqual(bw);
      expect(r.height).toBeLessThanOrEqual(bh);
    }
  });

  it("output is integer-valued so the canvas backbuffer never lands on a sub-pixel size", () => {
    const r = fitAspect(391, 233);
    expect(Number.isInteger(r.width)).toBe(true);
    expect(Number.isInteger(r.height)).toBe(true);
  });
});

describe("computePhysicalSize — M1 init-time fallback", () => {
  it("falls back to LOGICAL dimensions when the parent is null", () => {
    const r = computePhysicalSize(null);
    expect(r.width).toBe(BOARD_LOGICAL_WIDTH);
    expect(r.height).toBe(BOARD_LOGICAL_HEIGHT);
  });

  it("falls back to LOGICAL dimensions when the parent has zero-size bounds", () => {
    const fakeParent = {
      getBoundingClientRect: () => ({ width: 0, height: 0 }),
    } as unknown as HTMLElement;
    const r = computePhysicalSize(fakeParent);
    expect(r.width).toBe(BOARD_LOGICAL_WIDTH);
    expect(r.height).toBe(BOARD_LOGICAL_HEIGHT);
  });

  it("returns aspect-correct fit for a real-looking parent rect", () => {
    const fakeParent = {
      getBoundingClientRect: () => ({ width: 800, height: 600 }),
    } as unknown as HTMLElement;
    const r = computePhysicalSize(fakeParent);
    expect(r.width / r.height).toBeCloseTo(ASPECT, 1);
    expect(r.width).toBeLessThanOrEqual(800);
    expect(r.height).toBeLessThanOrEqual(600);
  });
});

describe("DuelystGameUI source — M1 ResizeObserver wiring", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "DuelystGameUI.tsx"),
    "utf-8",
  );

  it("observes the canvas's parent wrapper", () => {
    expect(uiSrc).toContain("new ResizeObserver");
    expect(uiSrc).toContain("canvas?.parentElement");
  });

  it("calls renderer.resize on each observed bbox change", () => {
    expect(uiSrc).toMatch(/renderer\.resize\(\s*width,\s*height\s*\)/);
  });

  it("disconnects the observer on unmount", () => {
    expect(uiSrc).toContain("obs.disconnect()");
  });
});

describe("BoardRenderer source — M1 stage-scale invariant", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "BoardRenderer.ts"),
    "utf-8",
  );

  it("scales the stage by the canvas-to-LOGICAL ratio", () => {
    expect(src).toContain("applyStageScale");
    expect(src).toMatch(/canvasWidth\s*\/\s*LOGICAL_W/);
    expect(src).toMatch(/canvasHeight\s*\/\s*LOGICAL_H/);
  });

  it("retains the resolution cap at 2× for retina GPU thrashing protection", () => {
    expect(src).toMatch(
      /Math\.min\(window\.devicePixelRatio\s*\|\|\s*1,\s*2\)/,
    );
  });

  it("exposes the resize() public method", () => {
    expect(src).toMatch(/resize\(boundingWidth:\s*number,\s*boundingHeight:\s*number\)/);
  });
});
