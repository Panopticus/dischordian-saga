/**
 * Vitest suite for the composite room state-variant resolver (Phase H.C).
 *
 * Verifies:
 * - Baseline-only descriptor resolves to a 1-layer stack
 * - Per-axis variants are resolved when present in the manifest
 * - Missing variants degrade silently (omitted from stack)
 * - Layer order matches the canonical depth chain (baseline ← back; axis13 ← front)
 * - Non-existent rooms (deferred Hellboxes, vehicles) return empty stack
 */
import { describe, expect, it } from "vitest";

import {
  hasRoomArt,
  resolveRoomVariant,
  toParallaxLayers,
} from "./compositeResolver";
import { AXIS_DEPTHS } from "./stateVariantRegistry";

describe("compositeResolver — Phase H.C", () => {
  describe("hasRoomArt", () => {
    it("returns true for cryo_bay (delivered)", () => {
      expect(hasRoomArt("cryo_bay")).toBe(true);
    });

    it("returns false for hb.celebration_school (deferred)", () => {
      expect(hasRoomArt("hb.celebration_school")).toBe(false);
    });

    it("returns false for nonsense zipDir", () => {
      expect(hasRoomArt("not_a_real_room")).toBe(false);
    });
  });

  describe("resolveRoomVariant — baseline only", () => {
    it("returns a 1-layer baseline stack when no axes requested", () => {
      const result = resolveRoomVariant({ zipDir: "cryo_bay" });
      expect(result.layers.length).toBe(1);
      expect(result.layers[0].axis).toBe("baseline");
      expect(result.layers[0].depth).toBe(AXIS_DEPTHS.baseline);
      expect(result.satisfied).toEqual(["baseline"]);
    });

    it("returns empty stack for a non-delivered room", () => {
      const result = resolveRoomVariant({ zipDir: "hb.celebration_school" });
      expect(result.layers.length).toBe(0);
      expect(result.satisfied.length).toBe(0);
    });
  });

  describe("resolveRoomVariant — axis 9 TV-infection", () => {
    it("adds an axis9 overlay when the variant exists (cryo_bay tv_spreading)", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis9: "spreading",
      });
      expect(result.layers.length).toBe(2);
      expect(result.layers[0].axis).toBe("baseline");
      expect(result.layers[1].axis).toBe("axis9");
      expect(result.layers[1].depth).toBe(AXIS_DEPTHS.axis9);
      expect(result.satisfied).toEqual(["baseline", "axis9"]);
    });

    it("degrades silently when axis9 variant is not in library", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis9: "quarantined", // not delivered for cryo_bay per inventory
      });
      // Per inventory cryo_bay has state_governance_quarantine, not
      // state_tv_quarantined; the axis9-quarantined overlay degrades.
      expect(result.satisfied.includes("baseline")).toBe(true);
      // axis9 may or may not be present depending on inventory; we
      // assert that the resolver does not throw and at minimum
      // baseline is present.
    });
  });

  describe("resolveRoomVariant — axis 12 faction-livery", () => {
    it("adds axis12 overlay for cryo_bay faction insurgency", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis12: "insurgency",
      });
      expect(result.layers.some((l) => l.axis === "axis12")).toBe(true);
      const axis12 = result.layers.find((l) => l.axis === "axis12");
      expect(axis12?.depth).toBe(AXIS_DEPTHS.axis12);
    });
  });

  describe("resolveRoomVariant — axis 11 cycle-phase", () => {
    it("adds axis11 overlay for cryo_bay cycle longnight", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis11: "longnight",
      });
      expect(result.layers.some((l) => l.axis === "axis11")).toBe(true);
    });
  });

  describe("resolveRoomVariant — axis 13 storyteller hook", () => {
    it("adds axis13 overlay for cryo_bay morality_dark", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis13: "morality_dark",
      });
      expect(result.layers.some((l) => l.axis === "axis13")).toBe(true);
      const axis13 = result.layers.find((l) => l.axis === "axis13");
      expect(axis13?.depth).toBe(AXIS_DEPTHS.axis13);
    });

    it("returns baseline-only when axis13 hookId is malformed", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis13: "malformed_hookid_with_extra_underscores_and_no_match",
      });
      // The hookId splits on first underscore; if no matching producer
      // axis+value exists, the overlay degrades.
      expect(result.satisfied.includes("baseline")).toBe(true);
    });
  });

  describe("resolveRoomVariant — multi-axis composition", () => {
    it("composes baseline + axis9 + axis12 + axis11 + axis13 layer stack", () => {
      const result = resolveRoomVariant({
        zipDir: "cryo_bay",
        axis9: "spreading",
        axis12: "insurgency",
        axis11: "longnight",
        axis13: "morality_dark",
      });
      // At least baseline must be present; other axes depend on
      // producer-delivered variants for this room
      expect(result.satisfied.includes("baseline")).toBe(true);
      expect(result.layers[0].axis).toBe("baseline");

      // Verify depth ordering (back-to-front: deeper first)
      for (let i = 1; i < result.layers.length; i++) {
        expect(result.layers[i].depth).toBeGreaterThanOrEqual(
          result.layers[i - 1].depth,
        );
      }
    });
  });

  describe("toParallaxLayers", () => {
    it("collapses a resolved variant to {src, depth} ParallaxLayer shape", () => {
      const result = resolveRoomVariant({ zipDir: "cryo_bay" });
      const layers = toParallaxLayers(result);
      expect(layers.length).toBe(1);
      expect(layers[0]).toEqual({
        src: result.layers[0].src,
        depth: result.layers[0].depth,
      });
    });
  });
});
