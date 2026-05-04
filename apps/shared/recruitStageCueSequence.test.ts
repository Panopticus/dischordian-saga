import { describe, it, expect } from "vitest";
import {
  buildRecruitStageSequence,
  expectedSanctionedCueCount,
  expectedDreamerAlignedCueCount,
  summarizeRecruitStageAlignment,
  type RecruitStageActionsLog,
} from "./recruitStageCueSequence";

const SANCTIONED: RecruitStageActionsLog = {
  refusedRole: false,
  askedForbiddenQuestion: false,
  touchedWrongPanel: false,
  recording0Heard: true,
};
const DREAMER_FULL: RecruitStageActionsLog = {
  refusedRole: true,
  askedForbiddenQuestion: true,
  touchedWrongPanel: true,
  recording0Heard: true,
};

describe("recruitStageCueSequence", () => {
  describe("buildRecruitStageSequence", () => {
    it("emits cues in non-decreasing step order", () => {
      const seq = buildRecruitStageSequence(SANCTIONED);
      for (let i = 1; i < seq.length; i++) {
        expect(seq[i].step).toBeGreaterThanOrEqual(seq[i - 1].step);
      }
    });

    it("includes the role-confirmed Architect cue when player accepts the role", () => {
      const seq = buildRecruitStageSequence(SANCTIONED);
      expect(seq.some((c) => c.id === "arch_plinth_role_confirmed")).toBe(true);
      expect(seq.some((c) => c.id === "arch_plinth_role_refused")).toBe(false);
    });

    it("includes the role-refused Architect cue when player refuses", () => {
      const seq = buildRecruitStageSequence({
        ...SANCTIONED,
        refusedRole: true,
      });
      expect(seq.some((c) => c.id === "arch_plinth_role_refused")).toBe(true);
      expect(seq.some((c) => c.id === "arch_plinth_role_confirmed")).toBe(false);
    });

    it("surfaces 'wake gently' Dreamer cue ONLY when player refuses", () => {
      const sanctSeq = buildRecruitStageSequence(SANCTIONED);
      expect(sanctSeq.some((c) => c.id === "dream_wake_gently")).toBe(false);

      const refusedSeq = buildRecruitStageSequence({ ...SANCTIONED, refusedRole: true });
      expect(refusedSeq.some((c) => c.id === "dream_wake_gently")).toBe(true);
    });

    it("surfaces 'forbidden question' Dreamer cue ONLY when player asks one", () => {
      const noAskSeq = buildRecruitStageSequence(SANCTIONED);
      expect(noAskSeq.some((c) => c.id === "dream_plinth_question")).toBe(false);

      const askSeq = buildRecruitStageSequence({
        ...SANCTIONED,
        askedForbiddenQuestion: true,
      });
      expect(askSeq.some((c) => c.id === "dream_plinth_question")).toBe(true);
    });

    it("post-Recording-0 unmistakable cue requires recording0Heard", () => {
      const noRecSeq = buildRecruitStageSequence({ ...SANCTIONED, recording0Heard: false });
      expect(noRecSeq.some((c) => c.id === "dream_post_recording_zero")).toBe(false);

      const recSeq = buildRecruitStageSequence(SANCTIONED);
      const cue = recSeq.find((c) => c.id === "dream_post_recording_zero");
      expect(cue).toBeDefined();
      expect(cue!.band).toBe("unmistakable");
    });

    it("the Dreamer-aligned run produces strictly more cues than the sanctioned run", () => {
      expect(expectedDreamerAlignedCueCount()).toBeGreaterThan(expectedSanctionedCueCount());
    });

    it("Dreamer cues at step N appear BEFORE Architect cues at step N (layered underneath)", () => {
      const seq = buildRecruitStageSequence(DREAMER_FULL);
      // For each step that has both, dreamer should appear at or before architect
      const stepGroups = new Map<number, { dreamer?: number; architect?: number }>();
      seq.forEach((cue, idx) => {
        const g = stepGroups.get(cue.step) ?? {};
        if (cue.source === "dreamer" && g.dreamer === undefined) g.dreamer = idx;
        if (cue.source === "architect" && g.architect === undefined) g.architect = idx;
        stepGroups.set(cue.step, g);
      });
      for (const g of stepGroups.values()) {
        if (g.dreamer !== undefined && g.architect !== undefined) {
          expect(g.dreamer).toBeLessThan(g.architect);
        }
      }
    });
  });

  describe("summarizeRecruitStageAlignment", () => {
    it("sanctioned run leans Architect (3-0)", () => {
      const a = summarizeRecruitStageAlignment(SANCTIONED);
      expect(a.architectScore).toBe(3);
      expect(a.dreamerScore).toBe(0);
      expect(a.leansToward).toBe("architect");
    });

    it("Dreamer-full run leans Dreamer (0-3)", () => {
      const a = summarizeRecruitStageAlignment(DREAMER_FULL);
      expect(a.architectScore).toBe(0);
      expect(a.dreamerScore).toBe(3);
      expect(a.leansToward).toBe("dreamer");
    });

    it("mixed run can be neutral", () => {
      // 1.5/1.5 — but scores are integers, so we test partial
      // Refused role only → Dreamer 1, Architect 2 — leans Architect
      const partial = summarizeRecruitStageAlignment({
        ...SANCTIONED,
        refusedRole: true,
      });
      expect(partial.leansToward).toBe("architect");
    });
  });
});
