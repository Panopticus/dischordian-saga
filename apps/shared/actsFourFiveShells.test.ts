import { describe, it, expect } from "vitest";
import {
  ACT_4_PRISONER_CHAPTERS,
  BRIDGE_OF_KAEL_POST_CREDITS,
  CADES_FPS_MISSIONS,
  DEAD_MANS_CIRCUIT_TRACKS,
  act4PrisonerFlagsForCompletedStoryChapters,
  getAct4Chapter,
  getAct4ChapterByFighterId,
  getAct4ChapterByStoryTag,
  getCadesMission,
  listAct4Chapters,
  listCadesMissions,
  listDmcTracks,
  listPrestigeCarryoverRules,
  PRESTIGE_CARRYOVER_RULES,
} from "./actsFourFiveShells";

describe("Act 4 — The Prisoner (§9)", () => {
  it("has exactly 4 chapters", () => {
    expect(ACT_4_PRISONER_CHAPTERS.length).toBe(4);
  });

  it("chapters are ordered 1-4 contiguously", () => {
    const orders = [...ACT_4_PRISONER_CHAPTERS].map((c) => c.order).sort();
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it("chapter 4 is the White Oracle meets, which does NOT extract", () => {
    const ch = getAct4Chapter("the_white_oracle_meets");
    expect(ch).toBeDefined();
    expect(ch!.order).toBe(4);
    expect(ch!.memoryExtracted.toLowerCase()).toContain("nothing");
  });

  it("every chapter has a unique completedFlag", () => {
    const flags = ACT_4_PRISONER_CHAPTERS.map((c) => c.completedFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("listAct4Chapters returns the 4 chapters", () => {
    expect(listAct4Chapters().length).toBe(4);
  });

  it("every chapter has a unique fighterId matching gameData", () => {
    const fighterIds = ACT_4_PRISONER_CHAPTERS.map((c) => c.fighterId);
    expect(new Set(fighterIds).size).toBe(fighterIds.length);
    // These must match FighterData.id in apps/client/src/game/gameData.ts
    expect(fighterIds).toEqual(["jailer", "human", "warlord", "white-oracle"]);
  });

  it("every chapter has a unique storyModeChapterTag", () => {
    const tags = ACT_4_PRISONER_CHAPTERS.map((c) => c.storyModeChapterTag);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags).toEqual(["ch2", "ch8", "ch7", "ch6"]);
  });

  it("getAct4ChapterByFighterId('jailer') returns the_cell", () => {
    const ch = getAct4ChapterByFighterId("jailer");
    expect(ch?.id).toBe("the_cell");
  });

  it("getAct4ChapterByFighterId('white-oracle') returns the_white_oracle_meets", () => {
    const ch = getAct4ChapterByFighterId("white-oracle");
    expect(ch?.id).toBe("the_white_oracle_meets");
  });

  it("getAct4ChapterByFighterId returns undefined for unrelated fighters", () => {
    expect(getAct4ChapterByFighterId("collector")).toBeUndefined();
    expect(getAct4ChapterByFighterId("architect")).toBeUndefined();
  });

  it("getAct4ChapterByStoryTag('ch7') returns the_warlord_rematch", () => {
    expect(getAct4ChapterByStoryTag("ch7")?.id).toBe("the_warlord_rematch");
  });

  it("act4PrisonerFlagsForCompletedStoryChapters maps completions to flags", () => {
    const flags = act4PrisonerFlagsForCompletedStoryChapters([
      "ch1",
      "ch2",
      "ch7",
    ]);
    expect(flags).toContain("act4_prisoner_cell_complete");
    expect(flags).toContain("act4_prisoner_warlord_complete");
    expect(flags).not.toContain("act4_prisoner_oracle_complete");
    expect(flags).not.toContain("act4_prisoner_extraction_complete");
  });

  it("act4PrisonerFlagsForCompletedStoryChapters returns empty for unrelated chapters", () => {
    expect(
      act4PrisonerFlagsForCompletedStoryChapters(["ch1", "ch4", "ch5"]),
    ).toEqual([]);
  });
});

describe("Act 4.5 — Dead Man's Circuit + Casino (§10)", () => {
  it("has both the Circuit and Casino tracks", () => {
    expect(DEAD_MANS_CIRCUIT_TRACKS.length).toBe(2);
    const ids = DEAD_MANS_CIRCUIT_TRACKS.map((t) => t.id).sort();
    expect(ids).toEqual(["the_casino", "the_circuit"]);
  });

  it("both tracks describe identity betting", () => {
    for (const track of DEAD_MANS_CIRCUIT_TRACKS) {
      expect(track.identityBet.length).toBeGreaterThan(0);
    }
  });

  it("listDmcTracks returns both tracks", () => {
    expect(listDmcTracks().length).toBe(2);
  });
});

describe("Cades FPS missions (§11.3)", () => {
  it("has exactly 7 missions (M1-M7)", () => {
    expect(CADES_FPS_MISSIONS.length).toBe(7);
  });

  it("missions are ordered 1-7 contiguously", () => {
    const orders = [...CADES_FPS_MISSIONS].map((m) => m.order).sort();
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("M5 is flagged as a forced partial loss", () => {
    const m5 = getCadesMission("m5");
    expect(m5?.mandatoryBeat).toBe("forced_partial_loss");
  });

  it("M7 is flagged as a mandatory death sequence", () => {
    const m7 = getCadesMission("m7");
    expect(m7?.mandatoryBeat).toBe("mandatory_death");
    expect(m7?.title).toContain("Last Stand");
  });

  it("M6 is the Agent Zero reveal", () => {
    const m6 = getCadesMission("m6");
    expect(m6?.title).toContain("Alliance of Adversaries");
    expect(m6?.canonBeat).toContain("real one");
  });

  it("listCadesMissions returns all 7 in order", () => {
    const list = listCadesMissions();
    expect(list.length).toBe(7);
    expect(list[0].order).toBe(1);
    expect(list[list.length - 1].order).toBe(7);
  });
});

describe("Bridge of Kael post-credits (§11.4)", () => {
  it("has a non-empty title + closing line", () => {
    expect(BRIDGE_OF_KAEL_POST_CREDITS.title.length).toBeGreaterThan(0);
    expect(BRIDGE_OF_KAEL_POST_CREDITS.closingLine.length).toBeGreaterThan(0);
  });

  it("describes the Agent Zero console card", () => {
    expect(BRIDGE_OF_KAEL_POST_CREDITS.consoleObject).toContain("Dischordia card");
  });

  it("has at least four changes to the Bridge state", () => {
    expect(BRIDGE_OF_KAEL_POST_CREDITS.changes.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Prestige Cycle carryover (§15 P3)", () => {
  it("has at least six carryover rules", () => {
    expect(PRESTIGE_CARRYOVER_RULES.length).toBeGreaterThanOrEqual(6);
  });

  it("Loredex entries carry over at 100%", () => {
    const rule = PRESTIGE_CARRYOVER_RULES.find((r) => r.id === "loredex_entries");
    expect(rule?.carryoverPortion).toBe(1.0);
  });

  it("Narrator dominance RESETS every cycle (§1.5 invariant)", () => {
    const rule = PRESTIGE_CARRYOVER_RULES.find(
      (r) => r.id === "narrator_dominance",
    );
    expect(rule?.carryoverPortion).toBe(0.0);
  });

  it("Memorable moments buffer keeps 10% (the Antiquarian's choice)", () => {
    const rule = PRESTIGE_CARRYOVER_RULES.find(
      (r) => r.id === "memorable_moments",
    );
    expect(rule?.carryoverPortion).toBe(0.1);
  });

  it("every rule has a non-empty rationale", () => {
    for (const rule of listPrestigeCarryoverRules()) {
      expect(rule.rationale.length).toBeGreaterThan(0);
    }
  });
});
