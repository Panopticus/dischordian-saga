import { describe, it, expect } from "vitest";

import {
  ACT7_EPILOGUE_VO_SCRIPTS,
  MALKIA_REVOLUTION_QUESTLINE,
  MALKIA_REVOLUTION_STEPS,
  MASTER_OF_RLYEH_LINES,
  MASTER_OF_RLYEH_PHASES,
  PALE_EMISSARY_LINES,
  PALE_EMISSARY_PHASES,
  RECKONING_DAUGHTER_LINES,
  RECKONING_DAUGHTER_PHASES,
  SOURCE_KAEL_DIALOGUE_LINES,
  SOURCE_KAEL_DIALOGUE_TREE,
} from "./index";

describe("Hierarchy demon-lord encounters", () => {
  it("Master of R'lyeh has all four phases (entry / negotiation / resolution / aftermath)", () => {
    expect(MASTER_OF_RLYEH_PHASES.entry.length).toBeGreaterThan(0);
    expect(MASTER_OF_RLYEH_PHASES.negotiation.length).toBeGreaterThan(0);
    expect(MASTER_OF_RLYEH_PHASES.resolution.length).toBeGreaterThan(0);
    expect(MASTER_OF_RLYEH_PHASES.aftermath.length).toBeGreaterThan(0);
  });

  it("Master of R'lyeh resolution has both purchase and refuse and wake branches", () => {
    const setsFlags = MASTER_OF_RLYEH_LINES.flatMap((l) => l.setsFlags ?? []);
    expect(setsFlags).toContain("rlyeh_resolution_purchase");
    expect(setsFlags).toContain("rlyeh_resolution_refuse");
    expect(setsFlags).toContain("rlyeh_resolution_wake");
  });

  it("Pale Emissary has all four phases", () => {
    expect(PALE_EMISSARY_PHASES.entry.length).toBeGreaterThan(0);
    expect(PALE_EMISSARY_PHASES.negotiation.length).toBeGreaterThan(0);
    expect(PALE_EMISSARY_PHASES.resolution.length).toBeGreaterThan(0);
    expect(PALE_EMISSARY_PHASES.aftermath.length).toBeGreaterThan(0);
  });

  it("Pale Emissary has sign / refuse / counteroffer branches", () => {
    const setsFlags = PALE_EMISSARY_LINES.flatMap((l) => l.setsFlags ?? []);
    expect(setsFlags).toContain("emissary_signed");
    expect(setsFlags).toContain("emissary_refused");
    expect(setsFlags).toContain("emissary_counteroffer");
  });

  it("Reckoning Daughter resolves either to accept or refuse", () => {
    const setsFlags = RECKONING_DAUGHTER_LINES.flatMap((l) => l.setsFlags ?? []);
    expect(setsFlags).toContain("reckoning_accepted");
    expect(setsFlags).toContain("reckoning_refused");
  });

  it("each lord encounter sets the canonical resolved-flag", () => {
    expect(
      MASTER_OF_RLYEH_LINES.flatMap((l) => l.setsFlags ?? []),
    ).toContain("hierarchy:master_of_rlyeh_resolved");
    expect(
      PALE_EMISSARY_LINES.flatMap((l) => l.setsFlags ?? []),
    ).toContain("hierarchy:pale_emissary_resolved");
    expect(
      RECKONING_DAUGHTER_LINES.flatMap((l) => l.setsFlags ?? []),
    ).toContain("hierarchy:reckoning_daughter_resolved");
  });
});

describe("Malkia Ukweli revolution questline", () => {
  it("ships all six steps", () => {
    expect(MALKIA_REVOLUTION_STEPS.step1.length).toBeGreaterThan(0);
    expect(MALKIA_REVOLUTION_STEPS.step2.length).toBeGreaterThan(0);
    expect(MALKIA_REVOLUTION_STEPS.step3.length).toBeGreaterThan(0);
    expect(MALKIA_REVOLUTION_STEPS.step4.length).toBeGreaterThan(0);
    expect(MALKIA_REVOLUTION_STEPS.step5.length).toBeGreaterThan(0);
    expect(MALKIA_REVOLUTION_STEPS.step6.length).toBeGreaterThan(0);
  });

  it("step 6 sets malkia_revolution_questline_complete and act6_antiquarian_malkia_revealed", () => {
    const setsFlags = MALKIA_REVOLUTION_STEPS.step6.flatMap(
      (l) => l.setsFlags ?? [],
    );
    expect(setsFlags).toContain("malkia_revolution_questline_complete");
    expect(setsFlags).toContain("act6_antiquarian_malkia_revealed");
  });

  it("step 4 sets the phrase-echo flag the dual-nature resolver gates on", () => {
    const setsFlags = MALKIA_REVOLUTION_STEPS.step4.flatMap(
      (l) => l.setsFlags ?? [],
    );
    expect(setsFlags).toContain("act4_malkia_phrase_echo");
  });

  it("aggregate questline equals the sum of all steps", () => {
    const summed =
      MALKIA_REVOLUTION_STEPS.step1.length +
      MALKIA_REVOLUTION_STEPS.step2.length +
      MALKIA_REVOLUTION_STEPS.step3.length +
      MALKIA_REVOLUTION_STEPS.step4.length +
      MALKIA_REVOLUTION_STEPS.step5.length +
      MALKIA_REVOLUTION_STEPS.step6.length;
    expect(MALKIA_REVOLUTION_QUESTLINE.length).toBe(summed);
  });
});

describe("Source / Kael dialogue tree", () => {
  it("ships every node (A / B1 / B2 / B3 / C / D)", () => {
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeA.length).toBeGreaterThan(0);
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeB1.length).toBeGreaterThan(0);
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeB2.length).toBeGreaterThan(0);
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeB3.length).toBeGreaterThan(0);
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeC.length).toBeGreaterThan(0);
    expect(SOURCE_KAEL_DIALOGUE_TREE.nodeD.length).toBeGreaterThan(0);
  });

  it("node B1 has both a possessed (default) and consensual variant", () => {
    const lineIds = SOURCE_KAEL_DIALOGUE_TREE.nodeB1.map((l) => l.lineId);
    expect(lineIds).toContain("sk.B1.possessed");
    expect(lineIds).toContain("sk.B1.consensual");
  });

  it("node B1 consensual variant requires the kael_chose_dissolution flag", () => {
    const consensual = SOURCE_KAEL_DIALOGUE_TREE.nodeB1.find(
      (l) => l.lineId === "sk.B1.consensual",
    );
    expect(consensual?.requiresFlag).toBe("governance:kael_chose_dissolution");
  });

  it("node C has accept and decline branches", () => {
    const lineIds = SOURCE_KAEL_DIALOGUE_TREE.nodeC.map((l) => l.lineId);
    expect(lineIds).toContain("sk.C.accept");
    expect(lineIds).toContain("sk.C.decline");
  });

  it("aggregate dialogue lines equal the sum of all nodes", () => {
    const summed =
      SOURCE_KAEL_DIALOGUE_TREE.nodeA.length +
      SOURCE_KAEL_DIALOGUE_TREE.nodeB1.length +
      SOURCE_KAEL_DIALOGUE_TREE.nodeB2.length +
      SOURCE_KAEL_DIALOGUE_TREE.nodeB3.length +
      SOURCE_KAEL_DIALOGUE_TREE.nodeC.length +
      SOURCE_KAEL_DIALOGUE_TREE.nodeD.length;
    expect(SOURCE_KAEL_DIALOGUE_LINES.length).toBe(summed);
  });
});

describe("Act 7 epilogue VO scripts", () => {
  it("ships all five stance scripts", () => {
    expect(ACT7_EPILOGUE_VO_SCRIPTS.humanity.length).toBeGreaterThan(0);
    expect(ACT7_EPILOGUE_VO_SCRIPTS.machine.length).toBeGreaterThan(0);
    expect(ACT7_EPILOGUE_VO_SCRIPTS.balance.length).toBeGreaterThan(0);
    expect(ACT7_EPILOGUE_VO_SCRIPTS.soldier_command.length).toBeGreaterThan(0);
    expect(ACT7_EPILOGUE_VO_SCRIPTS.silence.length).toBeGreaterThan(0);
  });

  it("each non-silence script has all three path variants (pathA / B / C)", () => {
    const stances = ["humanity", "machine", "balance", "soldier_command"] as const;
    for (const stance of stances) {
      const lines = ACT7_EPILOGUE_VO_SCRIPTS[stance];
      const flags = lines.map((l) => l.requiresFlag);
      expect(flags).toContain("act1_path_A");
      expect(flags).toContain("act3_partial_share");
      expect(flags).toContain("act3_full_secret");
    }
  });

  it("each script opens with a system speaker and closes with a system speaker", () => {
    const stances = ["humanity", "machine", "balance", "soldier_command", "silence"] as const;
    for (const stance of stances) {
      const lines = ACT7_EPILOGUE_VO_SCRIPTS[stance];
      expect(lines[0].speaker).toBe("system");
      expect(lines[lines.length - 1].speaker).toBe("system");
    }
  });

  it("each script includes a dual-narrator beat (silence beat is also dual)", () => {
    const stances = ["humanity", "machine", "balance", "soldier_command", "silence"] as const;
    for (const stance of stances) {
      const lines = ACT7_EPILOGUE_VO_SCRIPTS[stance];
      const hasDual = lines.some((l) => l.speaker === "dual");
      expect(hasDual, `${stance} should include a dual-narrator beat`).toBe(true);
    }
  });

  it("each VO script line includes a [CUE] timestamp marker for the producer", () => {
    const stances = ["humanity", "machine", "balance", "soldier_command", "silence"] as const;
    for (const stance of stances) {
      const lines = ACT7_EPILOGUE_VO_SCRIPTS[stance];
      for (const line of lines) {
        expect(
          line.text.includes("[CUE"),
          `${line.lineId} missing [CUE] marker`,
        ).toBe(true);
      }
    }
  });

  it("each script sets a corresponding _started and _complete flag pair", () => {
    const stances = [
      ["humanity", "epilogue_humanity_started", "epilogue_humanity_complete"],
      ["machine", "epilogue_machine_started", "epilogue_machine_complete"],
      ["balance", "epilogue_balance_started", "epilogue_balance_complete"],
      ["soldier_command", "epilogue_bridge_started", "epilogue_bridge_complete"],
      ["silence", "epilogue_silence_started", "epilogue_silence_complete"],
    ] as const;
    for (const [stance, startedFlag, completeFlag] of stances) {
      const lines = ACT7_EPILOGUE_VO_SCRIPTS[stance];
      const allSetFlags = lines.flatMap((l) => l.setsFlags ?? []);
      expect(allSetFlags).toContain(startedFlag);
      expect(allSetFlags).toContain(completeFlag);
    }
  });
});
