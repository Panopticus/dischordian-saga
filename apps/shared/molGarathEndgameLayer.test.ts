import { describe, it, expect } from "vitest";
import {
  LABYRINTH_ANNOTATIONS,
  TRAPS_IN_DESIGN,
  HAMLET_FINAL_CONNECTION,
  getAnnotationForRecording,
  getTrapById,
  getTrapsByDesigner,
  isHamletConnectionUnlocked,
} from "./molGarathEndgameLayer";
import { ENGINEER_RECORDINGS } from "./engineerRecordings";

describe("molGarathEndgameLayer", () => {
  describe("Labyrinth annotations", () => {
    it("every Engineer recording has a labyrinth annotation", () => {
      for (const recording of ENGINEER_RECORDINGS) {
        const annotation = getAnnotationForRecording(recording.id);
        expect(annotation).toBeDefined();
        expect(annotation!.trapName.length).toBeGreaterThan(0);
        expect(annotation!.annotation.length).toBeGreaterThan(0);
      }
    });

    it("annotations carry Mol'Garath's almost-cheerful register", () => {
      for (const a of LABYRINTH_ANNOTATIONS) {
        // Mol'Garath capitalizes load-bearing nouns occasionally — at least
        // some annotations should have caps tells.
        expect(a.annotation.length).toBeGreaterThan(50);
      }
      // At least one annotation contains a Mol'Garath signature phrase
      const hasSignature = LABYRINTH_ANNOTATIONS.some(
        (a) =>
          a.annotation.toLowerCase().includes("notice with discipline") ||
          a.annotation.includes("LABYRINTH") ||
          a.annotation.includes("RECORD") ||
          a.annotation.includes("CURRICULUM"),
      );
      expect(hasSignature).toBe(true);
    });
  });

  describe("Traps-in-design feed", () => {
    it("every trap has a Living Universe event id and a counter system", () => {
      for (const t of TRAPS_IN_DESIGN) {
        expect(t.livingUniverseEventId.length).toBeGreaterThan(0);
        expect(t.counterSystem.length).toBeGreaterThan(0);
      }
    });

    it("the unattributed Warlord-substrate trap exists", () => {
      const t = getTrapById("warlord_substrate_unnamed");
      expect(t).toBeDefined();
      expect(t!.designer).toBe("unattributed");
      expect(t!.counterSystem).toBe("hamlet_conspiracy_board_completion");
    });

    it("getTrapsByDesigner partitions correctly", () => {
      const necroTraps = getTrapsByDesigner("the_necromancer");
      expect(necroTraps.length).toBeGreaterThan(0);
      for (const t of necroTraps) expect(t.designer).toBe("the_necromancer");
    });
  });

  describe("Hamlet final connection", () => {
    it("requires all 7 canonical clues to unlock", () => {
      expect(HAMLET_FINAL_CONNECTION.requiredClues.length).toBe(7);
    });

    it("the correct candidate id is in the candidates list", () => {
      const ids = HAMLET_FINAL_CONNECTION.candidates.map((c) => c.id);
      expect(ids).toContain(HAMLET_FINAL_CONNECTION.correctCandidateId);
    });

    it("the correct answer is the_loop_itself (the substrate, not an instance)", () => {
      expect(HAMLET_FINAL_CONNECTION.correctCandidateId).toBe("the_loop_itself");
    });

    it("isHamletConnectionUnlocked requires Mol'Garath's audience", () => {
      const allClues = new Set(HAMLET_FINAL_CONNECTION.requiredClues);
      expect(isHamletConnectionUnlocked(allClues, false)).toBe(false);
      expect(isHamletConnectionUnlocked(allClues, true)).toBe(true);
    });

    it("isHamletConnectionUnlocked requires every clue", () => {
      const subset = new Set(HAMLET_FINAL_CONNECTION.requiredClues.slice(0, 3));
      expect(isHamletConnectionUnlocked(subset, true)).toBe(false);
    });

    it("the correct-reaction line names the loop substrate (canon-gated phrasing)", () => {
      const reaction = HAMLET_FINAL_CONNECTION.correctReaction.toLowerCase();
      expect(reaction).toContain("loop");
      expect(reaction).toContain("substrate");
    });

    it("the incorrect-reaction line is in Mol'Garath's voice (centuries available)", () => {
      const reaction = HAMLET_FINAL_CONNECTION.incorrectReaction.toLowerCase();
      expect(reaction.includes("centuries") || reaction.includes("not going")).toBe(true);
    });
  });
});
