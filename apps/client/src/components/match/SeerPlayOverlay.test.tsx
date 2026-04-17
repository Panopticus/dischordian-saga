/**
 * Structural tests for SeerPlayOverlay (§4.9).
 * Export shape + duration constant, matching the existing client-
 * side component-test pattern.
 */
import { describe, it, expect } from "vitest";
import {
  SeerPlayOverlay,
  SEER_PLAY_OVERLAY_MS,
} from "./SeerPlayOverlay";

describe("SeerPlayOverlay", () => {
  it("exports the component as a named export", () => {
    expect(SeerPlayOverlay).toBeDefined();
    expect(typeof SeerPlayOverlay).toBe("function");
  });

  it("advertises the spec §2.1 800ms lifetime", () => {
    expect(SEER_PLAY_OVERLAY_MS).toBe(800);
  });
});
