import { describe, expect, it } from "vitest";
import {
  CONSPIRACY_BOARD_REVELATIONS,
  CUTSCENES_UNLOCKED_BY_BOARDS,
  SOUL_STONES_FROM_BOARDS,
  getRevelationForBoard,
} from "./conspiracyBoardRevelations";
import { CONSPIRACY_BOARDS } from "./conspiracyBoards/definitions";
import { CUTSCENE_REGISTRY } from "./cutsceneRegistry";

describe("conspiracyBoardRevelations", () => {
  it("ships exactly seven revelations (one per Conspiracy Board)", () => {
    expect(CONSPIRACY_BOARD_REVELATIONS).toHaveLength(7);
    expect(CONSPIRACY_BOARDS).toHaveLength(7);
  });

  it("every revelation references a real Conspiracy Board key", () => {
    const validKeys = new Set(CONSPIRACY_BOARDS.map((b) => b.boardKey));
    for (const rev of CONSPIRACY_BOARD_REVELATIONS) {
      expect(
        validKeys.has(rev.boardKey),
        `unknown boardKey ${rev.boardKey}`,
      ).toBe(true);
    }
  });

  it("every revelation that unlocks a cutscene references a real CutsceneId", () => {
    for (const rev of CONSPIRACY_BOARD_REVELATIONS) {
      if (!rev.unlocksCutscene) continue;
      expect(
        CUTSCENE_REGISTRY[rev.unlocksCutscene],
        `unknown cutscene ${rev.unlocksCutscene} on ${rev.boardKey}`,
      ).toBeDefined();
    }
  });

  it("the five memory-locked cutscenes are all wired (Awakening, FirstHumanContact, MemoryRecovery, BreakingPoint, ThoughtVirusManifests)", () => {
    const wiredCutscenes = new Set(
      CUTSCENES_UNLOCKED_BY_BOARDS.map((u) => u.cutsceneId),
    );
    expect(wiredCutscenes.has("cutscene_awakening")).toBe(true);
    expect(wiredCutscenes.has("cutscene_first_human_contact")).toBe(true);
    expect(wiredCutscenes.has("cutscene_elara_memory_recovery")).toBe(true);
    expect(wiredCutscenes.has("cutscene_breaking_point")).toBe(true);
    expect(wiredCutscenes.has("cutscene_thought_virus_manifests")).toBe(true);
  });

  it("all seven boards manifest a Soul Stone", () => {
    expect(SOUL_STONES_FROM_BOARDS).toBe(7);
  });

  it("revelation seen-flags are unique", () => {
    const flags = CONSPIRACY_BOARD_REVELATIONS.map((r) => r.revelationSeenFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("editor edit descriptions are substantial in-fiction copy", () => {
    for (const rev of CONSPIRACY_BOARD_REVELATIONS) {
      expect(rev.editorEditDescription.trim().length).toBeGreaterThan(80);
    }
  });

  it("getRevelationForBoard returns each entry by boardKey", () => {
    expect(getRevelationForBoard("first_memory")?.unlocksCutscene).toBe(
      "cutscene_awakening",
    );
    expect(getRevelationForBoard("recruiter_defection")?.manifestsSoulStone).toBe(
      true,
    );
    expect(getRevelationForBoard("nonexistent")).toBeUndefined();
  });
});
