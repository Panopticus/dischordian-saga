import { describe, expect, it } from "vitest";
import {
  ACT_3_WHEEL_OUTCOMES,
  ACT_4_OUTCOME_FLAGS,
  ACT_4_WHEEL_OUTCOMES,
  WHEEL_REACTION_CUTSCENES,
  WHEEL_REACTION_CUTSCENE_TOTAL,
  act4DialogPathToOutcome,
  resolveWheelReactionByFlag,
} from "@shared/wheelReactionCutscenes";

describe("wheelReactionCutscenes — parity", () => {
  it("registers exactly 3 act3 + 3 act4 = 6 entries", () => {
    expect(WHEEL_REACTION_CUTSCENE_TOTAL).toBe(6);
    expect(WHEEL_REACTION_CUTSCENES.filter((d) => d.act === 3)).toHaveLength(3);
    expect(WHEEL_REACTION_CUTSCENES.filter((d) => d.act === 4)).toHaveLength(3);
  });

  it("ids match the producer-delivered MP4 basename pattern", () => {
    for (const def of WHEEL_REACTION_CUTSCENES) {
      expect(def.id).toBe(`wheel_act${def.act}_${def.outcome}`);
      expect(def.videoRelPath).toBe(`videos/wheel_reactions/${def.id}.mp4`);
    }
  });

  it("act3 outcomes match canonical Act 3 path flags", () => {
    const act3 = WHEEL_REACTION_CUTSCENES.filter((d) => d.act === 3);
    expect(act3.map((d) => d.outcome).sort()).toEqual(
      [...ACT_3_WHEEL_OUTCOMES].sort(),
    );
    for (const def of act3) {
      expect(def.triggerFlag).toBe(`act3_path_${def.outcome}_chosen`);
    }
  });

  it("act4 outcomes match canonical Act 4 outcome flags", () => {
    const act4 = WHEEL_REACTION_CUTSCENES.filter((d) => d.act === 4);
    expect(act4.map((d) => d.outcome).sort()).toEqual(
      [...ACT_4_WHEEL_OUTCOMES].sort(),
    );
    for (const def of act4) {
      expect(ACT_4_OUTCOME_FLAGS).toContain(def.triggerFlag);
      expect(def.triggerFlag).toBe(`act4_outcome_${def.outcome}`);
    }
  });

  it("resolveWheelReactionByFlag finds every registered trigger and rejects unknown ones", () => {
    for (const def of WHEEL_REACTION_CUTSCENES) {
      const found = resolveWheelReactionByFlag(def.triggerFlag);
      expect(found).toBeDefined();
      expect(found?.id).toBe(def.id);
    }
    expect(resolveWheelReactionByFlag("not_a_real_flag")).toBeUndefined();
  });

  it("act4DialogPathToOutcome maps every canonical dialog path to an outcome", () => {
    expect(act4DialogPathToOutcome("the_bridge")).toBe("reconciled");
    expect(act4DialogPathToOutcome("the_discovery")).toBe("fragile_trust");
    expect(act4DialogPathToOutcome("the_betrayal")).toBe("broken_trust");
    expect(act4DialogPathToOutcome("nonsense")).toBeNull();
  });
});
