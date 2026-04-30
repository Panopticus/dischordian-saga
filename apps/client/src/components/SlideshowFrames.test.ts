import { describe, expect, it } from "vitest";
import { findActiveFrameIndex } from "./SlideshowFrames";
import type { SlideshowFrame } from "@shared/songSlideshow";

const FRAMES: readonly SlideshowFrame[] = [
  { startMs: 0, endMs: 5_000, imageUrl: "f0.png", transition: "cut" },
  { startMs: 5_000, endMs: 12_000, imageUrl: "f1.png", transition: "cut" },
  { startMs: 12_000, endMs: 20_000, imageUrl: "f2.png", transition: "cut" },
];

describe("findActiveFrameIndex", () => {
  it("returns -1 for empty frame array", () => {
    expect(findActiveFrameIndex([], 0)).toBe(-1);
    expect(findActiveFrameIndex([], 10_000)).toBe(-1);
  });

  it("returns the first frame for time before any frame begins", () => {
    expect(findActiveFrameIndex(FRAMES, -100)).toBe(0);
  });

  it("returns the frame whose [startMs, endMs) interval contains time", () => {
    expect(findActiveFrameIndex(FRAMES, 0)).toBe(0);
    expect(findActiveFrameIndex(FRAMES, 2_500)).toBe(0);
    expect(findActiveFrameIndex(FRAMES, 4_999)).toBe(0);
    expect(findActiveFrameIndex(FRAMES, 5_000)).toBe(1);
    expect(findActiveFrameIndex(FRAMES, 11_999)).toBe(1);
    expect(findActiveFrameIndex(FRAMES, 12_000)).toBe(2);
    expect(findActiveFrameIndex(FRAMES, 19_999)).toBe(2);
  });

  it("clamps to the last frame for time at or beyond the last frame's endMs", () => {
    expect(findActiveFrameIndex(FRAMES, 20_000)).toBe(2);
    expect(findActiveFrameIndex(FRAMES, 60_000)).toBe(2);
  });

  it("treats endMs as exclusive (the boundary belongs to the next frame)", () => {
    // At exactly endMs of frame 0 (5000), we should be on frame 1.
    expect(findActiveFrameIndex(FRAMES, 5_000)).toBe(1);
    // At exactly endMs of frame 1 (12000), we should be on frame 2.
    expect(findActiveFrameIndex(FRAMES, 12_000)).toBe(2);
  });
});
