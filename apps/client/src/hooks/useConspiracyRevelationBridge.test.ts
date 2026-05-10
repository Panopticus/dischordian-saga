import { describe, expect, it } from "vitest";
import { _CONSPIRACY_BRIDGE_ENTRIES_FOR_TEST as BRIDGE_ENTRIES } from "./useConspiracyRevelationBridge";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

describe("useConspiracyRevelationBridge — bridge table", () => {
  it("wires all five memory-locked cutscenes to their boards", () => {
    expect(BRIDGE_ENTRIES).toHaveLength(5);
    const ids = BRIDGE_ENTRIES.map((e) => e.revelation.unlocksCutscene);
    expect(ids).toEqual([
      "cutscene_awakening",
      "cutscene_first_human_contact",
      "cutscene_elara_memory_recovery",
      "cutscene_breaking_point",
      "cutscene_thought_virus_manifests",
    ]);
  });

  it("each entry's sourceFlag matches the canonical secret_act_N_revealed naming", () => {
    const expected = [
      "secret_act_1_revealed",
      "secret_act_2_revealed",
      "secret_act_3_revealed",
      "secret_act_4_revealed",
      "secret_act_5_revealed",
    ];
    expect(BRIDGE_ENTRIES.map((e) => e.sourceFlag)).toEqual(expected);
  });

  it("each entry's cutsceneTriggerFlag matches the cutscene's registered trigger", () => {
    for (const entry of BRIDGE_ENTRIES) {
      const cutscene = CUTSCENE_REGISTRY[entry.revelation.unlocksCutscene!];
      expect(entry.cutsceneTriggerFlag).toBe(cutscene.triggerFlag);
    }
  });

  it("each entry's seenFlag matches CutsceneRouter's seen-flag convention", () => {
    for (const entry of BRIDGE_ENTRIES) {
      const expected = `cutscene_${entry.revelation.unlocksCutscene!.replace(
        /^cutscene_/,
        "",
      )}_seen`;
      expect(entry.cutsceneSeenFlag).toBe(expected);
    }
  });

  it("seen flags appear in the cutscene's `setsFlags` declaration so the trigger ratchets correctly", () => {
    for (const entry of BRIDGE_ENTRIES) {
      const cutscene = CUTSCENE_REGISTRY[entry.revelation.unlocksCutscene!];
      expect(cutscene.setsFlags).toContain(entry.cutsceneSeenFlag);
    }
  });
});
