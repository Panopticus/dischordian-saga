import { describe, it, expect } from "vitest";
import {
  ARCHITECT_AWAKENING_CUES,
  getArchitectCueById,
  getArchitectCuesAtStep,
} from "./architectAwakeningLines";

describe("architectAwakeningLines", () => {
  it("has at least one cue per awakening step 1–7", () => {
    for (let step = 1; step <= 7; step++) {
      expect(getArchitectCuesAtStep(step).length).toBeGreaterThan(0);
    }
  });

  it("every cue id is unique", () => {
    const ids = ARCHITECT_AWAKENING_CUES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getArchitectCueById returns the right cue", () => {
    expect(getArchitectCueById("arch_specs_open")?.step).toBe(1);
    expect(getArchitectCueById("arch_protocol_close")?.step).toBe(7);
  });

  it("the Architect never says 'welcome' (forbidden register)", () => {
    for (const cue of ARCHITECT_AWAKENING_CUES) {
      expect(cue.text.toLowerCase()).not.toContain("welcome");
    }
  });

  it("the Architect never says 'we' as first-person plural", () => {
    // Allow "wel-" prefixes (none present, but be safe). Match standalone "we".
    for (const cue of ARCHITECT_AWAKENING_CUES) {
      expect(cue.text).not.toMatch(/\bwe\b/i);
    }
  });

  it("the role-refusal cue is Dreamer-layered (recruit-stage spine)", () => {
    const refusal = getArchitectCueById("arch_plinth_role_refused");
    expect(refusal?.dreamerLayered).toBe(true);
    expect(refusal?.trigger).toBe("on_role_refuse");
  });

  it("all cue text is non-empty", () => {
    for (const cue of ARCHITECT_AWAKENING_CUES) {
      expect(cue.text.length).toBeGreaterThan(0);
    }
  });
});
