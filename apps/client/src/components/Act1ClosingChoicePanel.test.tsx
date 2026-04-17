/**
 * Structural tests for Act1ClosingChoicePanel (§6.3).
 *
 * Matches the minimal ForgivenessChoicePanel test pattern:
 * export shape + type-shape. Visual + click flow reviewed in
 * the PR. The flag-write contract is source-scanned so future
 * edits that rename or drop the §6.6 flags fail loudly.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  Act1ClosingChoicePanel,
  type Act1ClosingChoice,
} from "./Act1ClosingChoicePanel";

describe("Act1ClosingChoicePanel", () => {
  it("exports the component as a named export", () => {
    expect(Act1ClosingChoicePanel).toBeDefined();
    expect(typeof Act1ClosingChoicePanel).toBe("function");
  });

  it("exports the Act1ClosingChoice union (compile-time smoke)", () => {
    const accept: Act1ClosingChoice = "accept";
    const decline: Act1ClosingChoice = "decline";
    const deflect: Act1ClosingChoice = "deflect";
    expect([accept, decline, deflect]).toEqual(["accept", "decline", "deflect"]);
  });
});

describe("Act1ClosingChoicePanel — flag-write contract (§6.6)", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "Act1ClosingChoicePanel.tsx"),
    "utf-8",
  );

  it("gates on slideshow_two_witnesses_part_2_complete", () => {
    expect(src).toContain("slideshow_two_witnesses_part_2_complete");
  });

  it("guards re-showing via act1_closing_choice_made", () => {
    expect(src).toContain("act1_closing_choice_made");
  });

  it("writes each of the three §6.3 choice flags", () => {
    expect(src).toContain("act1_closing_choice_accept");
    expect(src).toContain("act1_closing_choice_decline");
    expect(src).toContain("act1_closing_choice_deflect");
  });

  it("calls setNarrativeFlag on pick (uses the GameContext action path)", () => {
    expect(src).toContain("setNarrativeFlag");
    expect(src).toContain("useGame()");
  });
});
