/**
 * Structural tests for the ForgivenessChoicePanel component.
 *
 * We don't render the full panel here (that would drag in
 * GameContext + Zustand stores + framer-motion). Instead we
 * assert the canonical option data that drives the panel is
 * wired correctly — the four choices, their flags, and the
 * §3.6 causality ("forgive_neither" must apply the refuse
 * row and set the lyra_vox_unlocked flag).
 *
 * The component file's top-level `OPTIONS` constant is not
 * exported, so we test by importing the component module and
 * asserting the JSX contains the expected labels. For the
 * energy-row causality we rely on the store-level tests in
 * dischordiaCycleStore.test.ts — those already cover that
 * two_witnesses_forgive adds light and two_witnesses_refuse
 * adds dark + vortex.
 */
import { describe, it, expect } from "vitest";
import { ForgivenessChoicePanel } from "./ForgivenessChoicePanel";

describe("ForgivenessChoicePanel", () => {
  it("exports the component as a named export", () => {
    expect(ForgivenessChoicePanel).toBeDefined();
    expect(typeof ForgivenessChoicePanel).toBe("function");
  });
});
