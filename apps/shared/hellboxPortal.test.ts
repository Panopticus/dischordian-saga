import { describe, it, expect } from "vitest";
import {
  HELLBOX_FIRST_TOUCH,
  resolveHellboxState,
  buildSelectorModel,
  getFirstTouchSceneCues,
} from "./hellboxPortal";
import { MATRIX_OF_DREAMS_LEVELS } from "./matrixOfDreamsLevels";

describe("hellboxPortal", () => {
  describe("state machine", () => {
    it("returns 'locked' before discovery", () => {
      expect(
        resolveHellboxState({
          hellboxDiscovered: false,
          firstTouchComplete: false,
          inMedbay: true,
        }),
      ).toBe("locked");
    });

    it("returns 'first_touch' after discovery, before the cinematic plays", () => {
      expect(
        resolveHellboxState({
          hellboxDiscovered: true,
          firstTouchComplete: false,
          inMedbay: true,
        }),
      ).toBe("first_touch");
    });

    it("returns 'unlocked' once the cinematic has played", () => {
      expect(
        resolveHellboxState({
          hellboxDiscovered: true,
          firstTouchComplete: true,
          inMedbay: true,
        }),
      ).toBe("unlocked");
    });
  });

  describe("compelled-transport cinematic", () => {
    it("includes the canonical Recording H.2 'kernel' fragment", () => {
      const cueText = HELLBOX_FIRST_TOUCH.cue.map((c) => c.text).join(" ");
      expect(cueText).toContain("hellbox is the kernel");
    });

    it("includes Elara's apology for not knowing", () => {
      const elaraCues = HELLBOX_FIRST_TOUCH.cue.filter((c) => c.speaker === "elara");
      const elaraText = elaraCues.map((c) => c.text).join(" ");
      expect(elaraText.toLowerCase()).toContain("sorry");
    });

    it("ends in Celebration (the reconstruction is gentler than the truth)", () => {
      const lastCue = HELLBOX_FIRST_TOUCH.cue[HELLBOX_FIRST_TOUCH.cue.length - 1];
      expect(lastCue.text.toLowerCase()).toContain("celebration");
    });

    it("getFirstTouchSceneCues is the same array as the canon constant", () => {
      expect(getFirstTouchSceneCues()).toBe(HELLBOX_FIRST_TOUCH.cue);
    });

    it("includes the Hellbox itself as a speaker (canon: 'the hellbox is not a character')", () => {
      const hellboxCues = HELLBOX_FIRST_TOUCH.cue.filter((c) => c.speaker === "the_hellbox");
      expect(hellboxCues.length).toBeGreaterThan(0);
    });
  });

  describe("selector model", () => {
    it("returns 'locked' state with no groups available when undiscovered", () => {
      const model = buildSelectorModel(
        { hellboxDiscovered: false, firstTouchComplete: false, inMedbay: true },
        new Set(),
      );
      expect(model.state).toBe("locked");
      expect(model.elaraFraming).toContain("medbay");
    });

    it("groups levels by school with correct partitions", () => {
      const completed = new Set(["celebration_c1_the_watch"]);
      const model = buildSelectorModel(
        { hellboxDiscovered: true, firstTouchComplete: true, inMedbay: true },
        completed,
      );
      expect(model.groups).toHaveLength(2);
      const [celebration, mechronis] = model.groups;
      expect(celebration.school).toBe("celebration");
      expect(celebration.displayName).toBe("Celebration School");
      expect(celebration.themeTag).toBe("celebration_warm");
      expect(celebration.completedLevels.map((l) => l.id)).toContain(
        "celebration_c1_the_watch",
      );
      expect(mechronis.school).toBe("mechronis");
      expect(mechronis.themeTag).toBe("mechronis_cold");
    });

    it("totalEpisodes equals the registry size", () => {
      const model = buildSelectorModel(
        { hellboxDiscovered: true, firstTouchComplete: true, inMedbay: true },
        new Set(),
      );
      expect(model.totalEpisodes).toBe(MATRIX_OF_DREAMS_LEVELS.length);
    });

    it("Elara's framing differs across completion brackets", () => {
      const states = [
        new Set<string>(),
        new Set<string>(["celebration_c1_the_watch", "celebration_c2_first_day"]),
        new Set<string>(MATRIX_OF_DREAMS_LEVELS.slice(0, 14).map((l) => l.id)),
        new Set<string>(MATRIX_OF_DREAMS_LEVELS.map((l) => l.id)),
      ];
      const framings = states.map(
        (set) =>
          buildSelectorModel(
            { hellboxDiscovered: true, firstTouchComplete: true, inMedbay: true },
            set,
          ).elaraFraming,
      );
      // All four framing lines should be distinct
      expect(new Set(framings).size).toBe(4);
    });

    it("locked + first_touch states surface different framings", () => {
      const lockedFraming = buildSelectorModel(
        { hellboxDiscovered: false, firstTouchComplete: false, inMedbay: true },
        new Set(),
      ).elaraFraming;
      const firstTouchFraming = buildSelectorModel(
        { hellboxDiscovered: true, firstTouchComplete: false, inMedbay: true },
        new Set(),
      ).elaraFraming;
      expect(lockedFraming).not.toBe(firstTouchFraming);
    });
  });
});
