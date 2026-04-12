/**
 * Structural smoke test for CrewPortrait.
 *
 * Per repo convention (see ForgivenessChoicePanel.test.tsx) we don't
 * render the component here — that would require jsdom and
 * @testing-library/react. Instead we import and assert the module
 * exports a React component function. Deeper rendering coverage
 * belongs in a future e2e/RTL suite.
 */
import { describe, it, expect } from "vitest";
import CrewPortrait from "./CrewPortrait";

describe("CrewPortrait", () => {
  it("exports a component function as default", () => {
    expect(CrewPortrait).toBeDefined();
    expect(typeof CrewPortrait).toBe("function");
  });
});
