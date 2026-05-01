/**
 * Pure-function tests for the Dreamer-Awareness tag catalog and the
 * threshold-crossing helper. The service-layer integration tests
 * (no-DB safety + idempotency) live in
 * apps/server/services/dreamerAwareness.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  DREAMER_AWARENESS_TAGS,
  DREAMER_VISION_THRESHOLDS,
  getDreamerAwarenessTag,
  thresholdCrossed,
  BURNT_CARD_WITNESSED,
  DECLINE_WINNING_DRAW,
  SPARE_LETHAL_OPPONENT,
} from "./dreamerAwarenessTags";

describe("DREAMER_AWARENESS_TAGS catalog", () => {
  it("contains the 8 tags from the recruitment plan", () => {
    expect(DREAMER_AWARENESS_TAGS).toHaveLength(8);
  });

  it("every tag has a unique id", () => {
    const ids = DREAMER_AWARENESS_TAGS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every tag has a positive weight and non-empty description", () => {
    for (const t of DREAMER_AWARENESS_TAGS) {
      expect(t.weight).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
    }
  });

  it("the Burnt Card tag carries the rare-discovery weight (5)", () => {
    expect(BURNT_CARD_WITNESSED.weight).toBe(5);
  });

  it("standard tags weigh 1 — they accumulate one-at-a-time", () => {
    expect(DECLINE_WINNING_DRAW.weight).toBe(1);
    expect(SPARE_LETHAL_OPPONENT.weight).toBe(1);
  });

  it("getDreamerAwarenessTag returns the same object as the catalog entry", () => {
    expect(getDreamerAwarenessTag(BURNT_CARD_WITNESSED.id)).toBe(BURNT_CARD_WITNESSED);
  });

  it("getDreamerAwarenessTag returns undefined for unknown ids", () => {
    expect(getDreamerAwarenessTag("not_a_real_tag")).toBeUndefined();
  });
});

describe("DREAMER_VISION_THRESHOLDS", () => {
  it("are the four Discordian primes from the recruitment plan", () => {
    expect(DREAMER_VISION_THRESHOLDS).toEqual([3, 7, 13, 23]);
  });
});

describe("thresholdCrossed", () => {
  it("returns the threshold value when prev < t <= new", () => {
    expect(thresholdCrossed(0, 3)).toBe(3);
    expect(thresholdCrossed(2, 3)).toBe(3);
    expect(thresholdCrossed(6, 7)).toBe(7);
    expect(thresholdCrossed(12, 13)).toBe(13);
    expect(thresholdCrossed(22, 23)).toBe(23);
  });

  it("returns undefined when no threshold is crossed", () => {
    expect(thresholdCrossed(0, 0)).toBeUndefined();
    expect(thresholdCrossed(0, 2)).toBeUndefined();
    expect(thresholdCrossed(3, 5)).toBeUndefined();
    expect(thresholdCrossed(7, 10)).toBeUndefined();
    expect(thresholdCrossed(23, 100)).toBeUndefined();
  });

  it("returns the lowest crossed threshold when a single tag fires across multiple", () => {
    // The Burnt Card (+5) fired from count 6 → 11 crosses only 7.
    expect(thresholdCrossed(6, 11)).toBe(7);
    // From 0 → 5 crosses only 3.
    expect(thresholdCrossed(0, 5)).toBe(3);
    // From 0 → 23 crosses 3 first; the vision system delivers in
    // order so the next vision (7) fires on a subsequent tag.
    expect(thresholdCrossed(0, 23)).toBe(3);
  });

  it("returns undefined when the count moves backward (not a normal flow)", () => {
    expect(thresholdCrossed(10, 5)).toBeUndefined();
  });

  it("returns undefined for an exact-on-threshold no-op (no tag fired)", () => {
    expect(thresholdCrossed(7, 7)).toBeUndefined();
    expect(thresholdCrossed(13, 13)).toBeUndefined();
  });
});
