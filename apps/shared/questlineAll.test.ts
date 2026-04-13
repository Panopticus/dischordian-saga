import { describe, it, expect } from "vitest";
import { DEMAGI_QUESTLINE } from "./questlineDemagiGardensChildren";
import { QUARCHON_QUESTLINE } from "./questlineQuarchonFirstPattern";
import { ENGINEER_QUESTLINE } from "./questlineClassEngineer";
import { ORACLE_QUESTLINE } from "./questlineClassOracle";
import { ASSASSIN_QUESTLINE } from "./questlineClassAssassin";
import { SOLDIER_QUESTLINE } from "./questlineClassSoldier";
import { SPY_QUESTLINE } from "./questlineClassSpy";
import { FIRE_QUESTLINE, EARTH_QUESTLINE, TIME_QUESTLINE, REALITY_QUESTLINE } from "./questlineElements";
import { DEMAGI_CH4_ELEMENT_RESOLUTIONS } from "./questlineElementResolutions";
import { getAllChapterIds, getAllCompletionFlags } from "./potentialQuestlineTypes";
import type { PotentialQuestline } from "./potentialQuestlineTypes";

const ALL_QUESTLINES: PotentialQuestline[] = [
  DEMAGI_QUESTLINE, QUARCHON_QUESTLINE,
  ENGINEER_QUESTLINE, ORACLE_QUESTLINE, ASSASSIN_QUESTLINE,
  SOLDIER_QUESTLINE, SPY_QUESTLINE,
  FIRE_QUESTLINE, EARTH_QUESTLINE, TIME_QUESTLINE, REALITY_QUESTLINE,
];

describe("questline completeness", () => {
  it("all 11 questlines have at least one chapter", () => {
    for (const q of ALL_QUESTLINES) {
      expect(q.chapters.length).toBeGreaterThan(0);
    }
  });

  it("chapter ids are globally unique", () => {
    const ids = getAllChapterIds(ALL_QUESTLINES);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("completion flags are globally unique", () => {
    const flags = getAllCompletionFlags(ALL_QUESTLINES);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("every chapter has a wheel with at least 2 options", () => {
    for (const q of ALL_QUESTLINES) {
      for (const ch of q.chapters) {
        expect(ch.wheel.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("every wheel option id has a matching followup", () => {
    for (const q of ALL_QUESTLINES) {
      for (const ch of q.chapters) {
        for (const opt of ch.wheel) {
          expect(ch.followups[opt.id]).toBeDefined();
          expect(ch.followups[opt.id].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("DeMagi Ch4 has unity contributions for key options", () => {
    const ch4 = DEMAGI_QUESTLINE.chapters[3];
    expect(ch4.unityContributions).toBeDefined();
    expect(ch4.unityContributions!["dem_ch4_third_path"]).toBe("questline_third_path");
  });

  it("element resolutions cover fire/earth/water/air", () => {
    expect(Object.keys(DEMAGI_CH4_ELEMENT_RESOLUTIONS).sort()).toEqual(["air", "earth", "fire", "water"]);
    for (const beats of Object.values(DEMAGI_CH4_ELEMENT_RESOLUTIONS)) {
      expect(beats.length).toBeGreaterThan(0);
    }
  });

  it("race questlines have correct act gates", () => {
    expect(DEMAGI_QUESTLINE.actGate).toBe(2);
    expect(QUARCHON_QUESTLINE.actGate).toBe(1);
  });

  it("element questlines gate at Act 3", () => {
    for (const q of [FIRE_QUESTLINE, EARTH_QUESTLINE, TIME_QUESTLINE, REALITY_QUESTLINE]) {
      expect(q.actGate).toBe(3);
    }
  });

  it("Spy Ch2 requires spy_preempt_origin flag", () => {
    const ch2 = SPY_QUESTLINE.chapters[1];
    expect(ch2.unlockFlag).toBe("spy_preempt_origin");
  });

  it("every questline declares its flags", () => {
    for (const q of ALL_QUESTLINES) {
      expect(q.flags.length).toBeGreaterThan(0);
    }
  });
});
