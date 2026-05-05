import { describe, it, expect } from "vitest";

import { ROMANCE_SCENE_BANKS } from "@shared/npcs/romanceScenes";

import {
  detectDmcChoice,
  selectStageBeats,
  splitOnParens,
  withDmcPick,
} from "./sceneLogic";

describe("selectStageBeats — path-aware variant filtering", () => {
  it("returns Locke stage 1 lines (no path-flag gates)", () => {
    const beats = selectStageBeats("locke", 1, new Set());
    expect(beats.length).toBeGreaterThan(0);
    for (const b of beats) {
      expect(b.lineId).toContain(".s1.");
    }
  });

  it("filters out Locke stage 3 disclosure variant when act1_path_A flag is missing", () => {
    const beats = selectStageBeats("locke", 3, new Set());
    const ids = beats.map((b) => b.lineId);
    expect(ids).not.toContain("locke.romance.s3.path_a_disclosure");
    expect(ids).not.toContain("locke.romance.s3.path_c_betrayal");
    // The unguarded scene beats (open / clauses / commit) still surface.
    expect(ids).toContain("locke.romance.s3.exit_open");
    expect(ids).toContain("locke.romance.s3.commit");
  });

  it("includes the disclosure variant when act1_path_A flag is set", () => {
    const beats = selectStageBeats("locke", 3, new Set(["act1_path_A"]));
    const ids = beats.map((b) => b.lineId);
    expect(ids).toContain("locke.romance.s3.path_a_disclosure");
    expect(ids).not.toContain("locke.romance.s3.path_c_betrayal");
  });

  it("includes the betrayal variant when act3_full_secret is set", () => {
    const beats = selectStageBeats("locke", 3, new Set(["act3_full_secret"]));
    const ids = beats.map((b) => b.lineId);
    expect(ids).toContain("locke.romance.s3.path_c_betrayal");
    expect(ids).not.toContain("locke.romance.s3.path_a_disclosure");
  });

  it("returns Vex stage-3 commit only when player is on the engineer_zero_hint reveal stage", () => {
    // selectStageBeats does not gate on requiresRevealStage —
    // that's the server's job. The client just fetches whatever
    // the server says is the current stage. Verify the beat
    // simply exists in the bank.
    const all = (ROMANCE_SCENE_BANKS.vex ?? []).map((l) => l.lineId);
    expect(all).toContain("vex.romance.s3.commit");
  });
});

describe("detectDmcChoice", () => {
  it("returns null for non-DMC NPCs", () => {
    const beats = selectStageBeats("locke", 3, new Set(["act1_path_A"]));
    expect(detectDmcChoice("locke", 3, beats)).toBeNull();
  });

  it("returns null at stages other than 3 for DMC", () => {
    const stage1 = selectStageBeats("dmc_companion", 1, new Set());
    expect(detectDmcChoice("dmc_companion", 1, stage1)).toBeNull();
  });

  it("detects the partner / kin / question triple at DMC stage 3", () => {
    const beats = selectStageBeats("dmc_companion", 3, new Set());
    const fork = detectDmcChoice("dmc_companion", 3, beats);
    expect(fork).not.toBeNull();
    expect(fork!.partner.lineId).toBe("dmc.romance.s3.partner_name_chosen");
    expect(fork!.kin.lineId).toBe("dmc.romance.s3.kin_name_chosen");
    expect(fork!.question.lineId).toBe("dmc.romance.s3.naming_question");
  });
});

describe("withDmcPick", () => {
  const dmcBeats = selectStageBeats("dmc_companion", 3, new Set());
  const fork = detectDmcChoice("dmc_companion", 3, dmcBeats);

  it("strips both branches when no pick is made", () => {
    const result = withDmcPick(dmcBeats, fork, null);
    const ids = result.map((l) => l.lineId);
    expect(ids).not.toContain("dmc.romance.s3.partner_name_chosen");
    expect(ids).not.toContain("dmc.romance.s3.kin_name_chosen");
    expect(ids).toContain("dmc.romance.s3.naming_question");
  });

  it("splices the partner branch in after the question when picked", () => {
    const result = withDmcPick(dmcBeats, fork, "partner");
    const ids = result.map((l) => l.lineId);
    expect(ids).toContain("dmc.romance.s3.partner_name_chosen");
    expect(ids).not.toContain("dmc.romance.s3.kin_name_chosen");
    const qIdx = ids.indexOf("dmc.romance.s3.naming_question");
    const partnerIdx = ids.indexOf("dmc.romance.s3.partner_name_chosen");
    expect(partnerIdx).toBe(qIdx + 1);
  });

  it("splices the kin branch in after the question when picked", () => {
    const result = withDmcPick(dmcBeats, fork, "kin");
    const ids = result.map((l) => l.lineId);
    expect(ids).toContain("dmc.romance.s3.kin_name_chosen");
    expect(ids).not.toContain("dmc.romance.s3.partner_name_chosen");
  });

  it("passes through unchanged when fork is null", () => {
    const lockeBeats = selectStageBeats("locke", 1, new Set());
    const result = withDmcPick(lockeBeats, null, null);
    expect(result).toEqual(lockeBeats);
  });
});

describe("splitOnParens", () => {
  it("returns plain dialog as a single part", () => {
    const parts = splitOnParens("Hello world.");
    expect(parts).toEqual([{ kind: "dialog", text: "Hello world." }]);
  });

  it("splits a stage direction at the head of a line", () => {
    const parts = splitOnParens("(She sits.) Welcome.");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toEqual({ kind: "stage", text: "(She sits.)" });
    expect(parts[1].kind).toBe("dialog");
    expect(parts[1].text.trim()).toBe("Welcome.");
  });

  it("splits a stage direction in the middle of dialog", () => {
    const parts = splitOnParens("Hello, (she pauses) operative.");
    expect(parts.map((p) => p.kind)).toEqual(["dialog", "stage", "dialog"]);
    expect(parts[1].text).toBe("(she pauses)");
  });

  it("handles trailing stage directions", () => {
    const parts = splitOnParens("Goodnight. (Lights down.)");
    expect(parts.map((p) => p.kind)).toEqual(["dialog", "stage"]);
    expect(parts[1].text).toBe("(Lights down.)");
  });

  it("treats nested parens as a single stage block", () => {
    const parts = splitOnParens("X (a (nested) note) Y");
    const stages = parts.filter((p) => p.kind === "stage");
    expect(stages).toHaveLength(1);
    expect(stages[0].text).toBe("(a (nested) note)");
  });
});
