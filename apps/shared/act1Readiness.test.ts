/**
 * Act 1 ship-readiness structural test.
 *
 * Mirrors preludeReadiness.test.ts — asserts that every Act 1
 * data shell is internally consistent and that the P0 systems
 * (slideshows, Engineer Recordings, boss decks, witnessing
 * milestones) are wired.
 *
 * This is a data-only test (no DOM, no React). It validates
 * the authored content, not the runtime integration.
 */
import { describe, it, expect } from "vitest";
import { ALL_CHAPTER_ENCOUNTERS } from "./tcg-core/story/chapters";
import {
  ACT_1_BOSS_DECKS,
  isBossDeckCurated,
  type Act1BossId,
} from "./tcg-core/decks/act1BossDecks";
import { ENGINEER_RECORDINGS, TOTAL_RECORDINGS } from "./engineerRecordings";
import { WITNESSING_MILESTONES, listWitnessingMilestones } from "./witnessingEvents";
import { listBeatChronicleEntries } from "./witnessingYearOne";
import { getSlideshow } from "./songSlideshows";

describe("Act 1 readiness", () => {
  describe("story encounters", () => {
    const act1Encounters = ALL_CHAPTER_ENCOUNTERS.filter(
      (e) =>
        e.chapterId.startsWith("ch") ||
        e.id.includes("warlord") ||
        e.id.includes("authority"),
    );

    it("has at least 12 Act 1 encounters", () => {
      expect(act1Encounters.length).toBeGreaterThanOrEqual(12);
    });

    it("every encounter has a non-empty bossDeckCardDefIds array", () => {
      for (const enc of act1Encounters) {
        expect(
          enc.bossDeckCardDefIds.length,
          `${enc.id} has empty boss deck`,
        ).toBeGreaterThan(0);
      }
    });

    it("every encounter has dialog scene references", () => {
      for (const enc of act1Encounters) {
        expect(
          enc.preMatchDialog || enc.postMatchWinDialog,
          `${enc.id} has no dialog references`,
        ).toBeTruthy();
      }
    });
  });

  describe("boss decks", () => {
    const bossIds = Object.keys(ACT_1_BOSS_DECKS) as Act1BossId[];

    it("has 16 boss deck definitions", () => {
      expect(bossIds.length).toBe(16);
    });

    it("every boss deck has exactly 39 cards", () => {
      for (const bossId of bossIds) {
        expect(
          ACT_1_BOSS_DECKS[bossId].length,
          `${bossId} deck size`,
        ).toBe(39);
      }
    });

    it("reports curation status for each boss", () => {
      const curated = bossIds.filter(isBossDeckCurated);
      const placeholder = bossIds.filter((id) => !isBossDeckCurated(id));
      // This test documents the current state. As designers curate
      // decks, curated.length increases and placeholder.length decreases.
      expect(curated.length + placeholder.length).toBe(16);
      // eslint-disable-next-line no-console
      console.log(
        `Boss decks: ${curated.length}/16 curated, ${placeholder.length}/16 placeholder`,
      );
    });
  });

  describe("P0 slideshows", () => {
    const p0Ids = [
      "last-words",
      "welcome-to-celebration",
      "to-be-the-human",
      "i-am-the-eyes-that-watch",
      "ocularum",
    ];

    it("all P0 slideshows exist in the registry", () => {
      for (const id of p0Ids) {
        expect(getSlideshow(id), `slideshow ${id} missing`).toBeDefined();
      }
    });

    it("all P0 slideshows have frames", () => {
      for (const id of p0Ids) {
        const show = getSlideshow(id)!;
        expect(
          show.frames.length,
          `${id} has no frames`,
        ).toBeGreaterThan(0);
      }
    });
  });

  describe("Engineer Recordings", () => {
    it("has at least 7 recordings", () => {
      expect(TOTAL_RECORDINGS).toBeGreaterThanOrEqual(7);
    });

    it("every recording has a discovery flag", () => {
      for (const rec of ENGINEER_RECORDINGS) {
        expect(rec.discoveryFlag, `${rec.id} missing flag`).toBeTruthy();
      }
    });

    it("recordings are ordered by minCardWins", () => {
      for (let i = 1; i < ENGINEER_RECORDINGS.length; i++) {
        expect(
          ENGINEER_RECORDINGS[i].trigger.minCardWins,
          `recording ${i} out of order`,
        ).toBeGreaterThanOrEqual(ENGINEER_RECORDINGS[i - 1].trigger.minCardWins);
      }
    });
  });

  describe("witnessing milestones", () => {
    it("has at least 9 milestones", () => {
      expect(listWitnessingMilestones().length).toBeGreaterThanOrEqual(9);
    });

    it("every milestone has a raisesFlag", () => {
      for (const m of listWitnessingMilestones()) {
        expect(m.raisesFlag, `${m.id} missing flag`).toBeTruthy();
      }
    });
  });

  describe("beat chronicle entries", () => {
    it("has Prelude entries (order < 5)", () => {
      const preludeEntries = listBeatChronicleEntries().filter(
        (e) => e.order < 5,
      );
      expect(preludeEntries.length).toBeGreaterThanOrEqual(5);
    });

    it("has Act 1 cycle entries", () => {
      const cycleFlags = [
        "act_1_cycle_a_complete",
        "act_1_cycle_b_complete",
        "act_1_complete",
      ];
      for (const flag of cycleFlags) {
        const entry = listBeatChronicleEntries().find((e) => e.flag === flag);
        expect(entry, `missing chronicle entry for ${flag}`).toBeDefined();
      }
    });

    it("every entry has a positive order value", () => {
      for (const entry of listBeatChronicleEntries()) {
        expect(entry.order, `${entry.flag} has non-positive order`).toBeGreaterThan(0);
      }
    });
  });
});
