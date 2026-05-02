/**
 * Source-scan tests for the liminal-touch route components. Anchors
 * the contract so a future refactor can't silently regress the
 * delays / 404 styling / vision-fragment text.
 */
import { describe, it, expect } from "vitest";
import {
  _REVEAL_DELAY_MS_FOR_TEST,
  _TRANSCRIPT_LINES_FOR_TEST,
} from "./ArchitectCryptic";
import { _VISION_FRAGMENT_FOR_TEST } from "./DreamerFragment";

describe("ArchitectCryptic — 23-second-delayed transcript", () => {
  it("reveals at exactly 23 seconds (Discordian prime per the plan)", () => {
    expect(_REVEAL_DELAY_MS_FOR_TEST).toBe(23_000);
  });

  it("transcript opens and closes with explicit BEGIN/END markers", () => {
    expect(_TRANSCRIPT_LINES_FOR_TEST[0]).toMatch(/BEGIN TRANSCRIPT/);
    expect(_TRANSCRIPT_LINES_FOR_TEST[_TRANSCRIPT_LINES_FOR_TEST.length - 1]).toMatch(/END TRANSCRIPT/);
  });

  it("transcript is in calibration-register (Architect-side)", () => {
    const all = _TRANSCRIPT_LINES_FOR_TEST.join(" ");
    expect(all).toMatch(/calibrat/i);
    // Architect-side transcripts NEVER name the Dreamer side.
    expect(all).not.toMatch(/\bDreamer\b/);
    expect(all).not.toMatch(/\bElara\b/);
  });
});

describe("DreamerFragment — 404 with vision fragment", () => {
  it("vision fragment contains lines from Vision 4 caption register", () => {
    const all = _VISION_FRAGMENT_FOR_TEST.join(" ");
    // Plan §Part 1.5 Vision 4 anchors include "the Dreamer is many"
    // / "and the Dreamer is one" — these survive as the fragment.
    expect(all).toMatch(/Dreamer is many/);
    expect(all).toMatch(/Dreamer is one/);
  });

  it("vision fragment never names the Architect side (Dreamer-only register)", () => {
    const all = _VISION_FRAGMENT_FOR_TEST.join(" ");
    expect(all).not.toMatch(/\bArchitect\b/);
    expect(all).not.toMatch(/calibrat/i);
  });

  it("ships at least 3 vision-fragment lines for visual weight", () => {
    expect(_VISION_FRAGMENT_FOR_TEST.length).toBeGreaterThanOrEqual(3);
  });
});
