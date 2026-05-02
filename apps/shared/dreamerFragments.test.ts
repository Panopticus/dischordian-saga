/**
 * Pure-function tests for the Dreamer Fragments catalog + visibility
 * helpers. Server-side integration test (the dreamerFragments router
 * surface) lives in apps/server/routers/dreamerFragments.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  DREAMER_FRAGMENTS,
  dreamerFragmentsSectionVisible,
  visibleDreamerFragments,
} from "./dreamerFragments";

describe("DREAMER_FRAGMENTS catalog", () => {
  it("ships exactly 4 fragments — one per planned vision", () => {
    expect(DREAMER_FRAGMENTS).toHaveLength(4);
  });

  it("each fragment is keyed to a real vision id", () => {
    const knownVisions = new Set([
      "vision_first_notice",
      "vision_coin_without_face",
      "vision_hidden_hand",
      "vision_dreamer_sees_you",
    ]);
    for (const f of DREAMER_FRAGMENTS) {
      expect(knownVisions.has(f.visionId)).toBe(true);
    }
  });

  it("fragment ids are unique", () => {
    const ids = DREAMER_FRAGMENTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never names the Dreamer in title (silence-shape)", () => {
    // The plan: Dreamer Fragments are the surface where the Dreamer
    // is ALLOWED to be named (the section is unlocked AT that
    // recognition). But the per-fragment titles still read as
    // catalog entries, not direct address.
    for (const f of DREAMER_FRAGMENTS) {
      expect(f.title).not.toMatch(/^the Dreamer/i);
    }
  });

  it("each fragment carries non-empty body prose", () => {
    for (const f of DREAMER_FRAGMENTS) {
      expect(f.body.length).toBeGreaterThan(50);
    }
  });

  it("closing line uses the (no signature) cutscene register where present", () => {
    // Soft check — closing lines should be in the same italic /
    // lowercase register as the vision cutscene reduced-motion
    // fallback. They're optional but at least one fragment should
    // ship with one.
    const withClosing = DREAMER_FRAGMENTS.filter((f) => f.closingLine);
    expect(withClosing.length).toBeGreaterThanOrEqual(2);
    for (const f of withClosing) {
      // Closing-register marker: lowercase first letter (caption
      // register), nothing aggressive.
      expect(f.closingLine![0]).toBe(f.closingLine![0].toLowerCase());
    }
  });
});

describe("dreamerFragmentsSectionVisible — gated on Vision 3", () => {
  it("hidden when no visions have been received", () => {
    expect(dreamerFragmentsSectionVisible([])).toBe(false);
  });

  it("hidden when only Vision 1 received (threshold 3)", () => {
    expect(dreamerFragmentsSectionVisible(["vision_first_notice"])).toBe(false);
  });

  it("hidden when Visions 1 + 2 received but not 3 (threshold 7)", () => {
    expect(
      dreamerFragmentsSectionVisible([
        "vision_first_notice",
        "vision_coin_without_face",
      ]),
    ).toBe(false);
  });

  it("visible the moment Vision 3 is received (threshold 13)", () => {
    expect(
      dreamerFragmentsSectionVisible([
        "vision_first_notice",
        "vision_coin_without_face",
        "vision_hidden_hand",
      ]),
    ).toBe(true);
  });

  it("visible if Vision 3 was received out of order (e.g. burnt-card vault)", () => {
    expect(dreamerFragmentsSectionVisible(["vision_hidden_hand"])).toBe(true);
  });
});

describe("visibleDreamerFragments — only fragments matching received visions", () => {
  it("returns empty when section is gated off", () => {
    expect(visibleDreamerFragments([])).toEqual([]);
    expect(visibleDreamerFragments(["vision_first_notice"])).toEqual([]);
  });

  it("on Vision 3 receipt, back-fills Fragments I + II + III retroactively", () => {
    const visible = visibleDreamerFragments([
      "vision_first_notice",
      "vision_coin_without_face",
      "vision_hidden_hand",
    ]);
    const ids = visible.map((f) => f.id);
    expect(ids).toContain("fragment_first_notice");
    expect(ids).toContain("fragment_coin_without_face");
    expect(ids).toContain("fragment_hidden_hand");
    expect(ids).not.toContain("fragment_dreamer_sees_you");
  });

  it("on Vision 4 receipt, all 4 fragments are visible", () => {
    const visible = visibleDreamerFragments([
      "vision_first_notice",
      "vision_coin_without_face",
      "vision_hidden_hand",
      "vision_dreamer_sees_you",
    ]);
    expect(visible).toHaveLength(4);
  });

  it("only emits the fragment for the specific vision received (no extra entries)", () => {
    // Edge case: player jumped to V3 + V4 without V1/V2 (impossible in
    // practice, but defensive): only V3 + V4 fragments visible.
    const visible = visibleDreamerFragments([
      "vision_hidden_hand",
      "vision_dreamer_sees_you",
    ]);
    expect(visible).toHaveLength(2);
    expect(visible.map((f) => f.id)).toEqual([
      "fragment_hidden_hand",
      "fragment_dreamer_sees_you",
    ]);
  });

  it("ignores unknown vision ids gracefully", () => {
    const visible = visibleDreamerFragments([
      "vision_hidden_hand",
      "not_a_vision",
    ]);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("fragment_hidden_hand");
  });
});
