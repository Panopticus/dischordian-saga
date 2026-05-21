/* ═══════════════════════════════════════════════════════
   PATH B RESOLUTION SERVICE — phase gate test

   The full sweep is I/O-bound (resurrection store + crew
   feed + userProgress narrative flags) so it lives in the
   integration test alongside seasonTickService. This file
   covers the pure-function gate: which dischordia phases
   trigger Path B, and which do not.

   Failure here means the gate's policy regressed. Adjust
   PATH_B_TRIGGER_PHASES in pathBResolutionService.ts, then
   update this test in the same change.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { shouldFirePathBForDischordiaPhase } from "../pathBResolutionService";
import type { DischordiaPhase } from "../../../shared/dischordiaCycle";

describe("pathBResolutionService — shouldFirePathBForDischordiaPhase", () => {
  it("fires Path B during long_night", () => {
    expect(shouldFirePathBForDischordiaPhase("long_night")).toBe(true);
  });

  it("fires Path B during vortex_advance", () => {
    expect(shouldFirePathBForDischordiaPhase("vortex_advance")).toBe(true);
  });

  it("does NOT fire Path B during dawn", () => {
    expect(shouldFirePathBForDischordiaPhase("dawn")).toBe(false);
  });

  it("does NOT fire Path B during dimming", () => {
    // dimming is the warning state; the universe has not yet
    // committed to needing the dead back. Hold the petition.
    expect(shouldFirePathBForDischordiaPhase("dimming")).toBe(false);
  });

  it("does NOT fire Path B during reclamation", () => {
    // Community reclamation is a light-ascending event; the
    // Samsara machine doesn't need to override petitions when
    // the living are answering the dark on their own.
    expect(shouldFirePathBForDischordiaPhase("reclamation")).toBe(false);
  });

  it("does NOT fire Path B during light_holds", () => {
    expect(shouldFirePathBForDischordiaPhase("light_holds")).toBe(false);
  });

  it("covers every DischordiaPhase variant deterministically", () => {
    const allPhases: DischordiaPhase[] = [
      "dawn",
      "dimming",
      "long_night",
      "vortex_advance",
      "reclamation",
      "light_holds",
    ];
    // Each phase resolves to a stable boolean — the function is
    // total over the union, no undefined leaks.
    for (const phase of allPhases) {
      const result = shouldFirePathBForDischordiaPhase(phase);
      expect(typeof result).toBe("boolean");
    }
  });
});
