import { describe, it, expect } from "vitest";

import {
  getStep,
  LYRA_VOX_INSCRIPTIONS,
  LYRA_VOX_STEPS,
  type LyraVoxStepId,
} from "./lyraVoxQuestline";

describe("Lyra Vox questline registry", () => {
  it("ships five steps in canonical order", () => {
    const expected: LyraVoxStepId[] = [
      "file",
      "lab",
      "testimony",
      "confrontation",
      "inscription",
    ];
    expect(LYRA_VOX_STEPS.map((s) => s.id)).toEqual(expected);
  });

  it("step 1 (file) presents three theories", () => {
    const file = getStep("file")!;
    expect(file.prompts).toHaveLength(3);
    const flags = file.prompts.map((p) => p.setsFlag);
    expect(flags).toContain("lyra_vox:theory:weapon");
    expect(flags).toContain("lyra_vox:theory:rescue");
    expect(flags).toContain("lyra_vox:theory:betrayal");
  });

  it("step 2 (lab) has three doors matching the theories", () => {
    const lab = getStep("lab")!;
    expect(lab.prompts).toHaveLength(3);
  });

  it("step 3 (testimony) has three witnesses + a disbelief option", () => {
    const t = getStep("testimony")!;
    expect(t.prompts).toHaveLength(4);
  });

  it("step 4 (confrontation) issues one of three verdicts", () => {
    const c = getStep("confrontation")!;
    const verdicts = c.prompts.map((p) => p.setsFlag);
    expect(verdicts).toContain("lyra_vox:verdict:vindicated");
    expect(verdicts).toContain("lyra_vox:verdict:complicit");
    expect(verdicts).toContain("lyra_vox:verdict:both");
  });

  it("each step's earliestAct is monotonically non-decreasing", () => {
    let prev = 0;
    for (const step of LYRA_VOX_STEPS) {
      expect(step.earliestAct).toBeGreaterThanOrEqual(prev);
      prev = step.earliestAct;
    }
  });

  it("inscriptions exist for all three verdicts and reference the reader", () => {
    expect(LYRA_VOX_INSCRIPTIONS.vindicated.toLowerCase()).toContain("reader");
    expect(LYRA_VOX_INSCRIPTIONS.complicit.toLowerCase()).toContain("reader");
    expect(LYRA_VOX_INSCRIPTIONS.both.toLowerCase()).toContain("reader");
  });
});
