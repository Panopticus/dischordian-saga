import { describe, it, expect } from "vitest";

import {
  ACT7_EPILOGUES,
  epilogueBeatsFor,
  type Act7StanceFlag,
} from "./act7Epilogues";

describe("ACT7_EPILOGUES registry", () => {
  it("declares all five canonical stance epilogues (4 stances + silence)", () => {
    const required: Act7StanceFlag[] = [
      "act7_s1_humanity_path",
      "act7_s1_machine_path",
      "act7_s1_balance",
      "act7_s1_soldier_command",
      "act7_silence_stance",
    ];
    for (const stance of required) {
      expect(ACT7_EPILOGUES[stance]).toBeDefined();
      expect(ACT7_EPILOGUES[stance].beats.length).toBeGreaterThan(0);
    }
  });

  it("every epilogue has both an opening 'system' beat and a closing 'system' beat", () => {
    for (const stance of Object.keys(ACT7_EPILOGUES) as Act7StanceFlag[]) {
      const beats = ACT7_EPILOGUES[stance].beats;
      expect(beats[0].speaker).toBe("system");
      expect(beats[beats.length - 1].speaker).toBe("system");
    }
  });

  it("every non-silence epilogue includes a 'dual' speaker beat (the dual-narrator chord)", () => {
    const nonSilence: Act7StanceFlag[] = [
      "act7_s1_humanity_path",
      "act7_s1_machine_path",
      "act7_s1_balance",
      "act7_s1_soldier_command",
    ];
    for (const stance of nonSilence) {
      const hasDual = ACT7_EPILOGUES[stance].beats.some(
        (b) => b.speaker === "dual",
      );
      expect(hasDual).toBe(true);
    }
  });
});

describe("epilogueBeatsFor", () => {
  it("returns 'any'-variant beats for all paths", () => {
    const noPath = epilogueBeatsFor("act7_s1_humanity_path", null);
    const pathA = epilogueBeatsFor("act7_s1_humanity_path", "act1_path_A");
    expect(noPath.length).toBeGreaterThan(0);
    expect(pathA.length).toBeGreaterThan(noPath.length);
  });

  it("disclosure path includes only its variant + any-variants", () => {
    const beats = epilogueBeatsFor(
      "act7_s1_humanity_path",
      "act1_path_A",
    );
    const variantCounts = beats.reduce(
      (acc, b) => {
        if (b.pathVariant) acc[b.pathVariant] = (acc[b.pathVariant] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    expect(variantCounts.pathA ?? 0).toBeGreaterThan(0);
    expect(variantCounts.pathB ?? 0).toBe(0);
    expect(variantCounts.pathC ?? 0).toBe(0);
  });

  it("betrayal path's Humanity ending acknowledges the lie at the bridge", () => {
    const beats = epilogueBeatsFor(
      "act7_s1_humanity_path",
      "act3_full_secret",
    );
    const betrayalBeat = beats.find((b) => b.pathVariant === "pathC");
    expect(betrayalBeat).toBeDefined();
    expect(betrayalBeat!.text.toLowerCase()).toContain("lie");
  });

  it("silence ending is path-neutral (no path variants)", () => {
    const beats = epilogueBeatsFor("act7_silence_stance", "act1_path_A");
    for (const b of beats) {
      expect(b.pathVariant === undefined || b.pathVariant === "any").toBe(true);
    }
  });
});
