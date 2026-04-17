/**
 * Structural tests for ChoicePillarProgrammerGift — §5.6.
 * Matches the ChoicePillarLightDark test pattern: export shape +
 * type smoke test. Visual reviewed in the PR.
 */
import { describe, it, expect } from "vitest";
import {
  ChoicePillarProgrammerGift,
  type ProgrammerGiftChoice,
} from "./ChoicePillarProgrammerGift";

describe("ChoicePillarProgrammerGift", () => {
  it("exports the component as a named export", () => {
    expect(ChoicePillarProgrammerGift).toBeDefined();
    expect(typeof ChoicePillarProgrammerGift).toBe("function");
  });

  it("exports the choice union (compile-time smoke)", () => {
    const accept: ProgrammerGiftChoice = "accept";
    const decline: ProgrammerGiftChoice = "decline";
    expect(accept).toBe("accept");
    expect(decline).toBe("decline");
  });
});
