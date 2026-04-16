/**
 * Structural tests for ChoicePillarLightDark.
 *
 * Matches the existing client-side component-test pattern (see
 * ForgivenessChoicePanel.test.tsx) — assert export shape + that
 * the component is a function, without rendering the DOM. The
 * behavior is covered at the unit level by apps/shared/campaignState
 * tests and the visual is reviewed in the PR.
 */
import { describe, it, expect } from "vitest";
import { ChoicePillarLightDark } from "./ChoicePillarLightDark";

describe("ChoicePillarLightDark", () => {
  it("exports the component as a named export", () => {
    expect(ChoicePillarLightDark).toBeDefined();
    expect(typeof ChoicePillarLightDark).toBe("function");
  });
});
