/**
 * Vitest suite for the room-cutscene trigger registry.
 *
 * Hard parity: every entry in EXPANSION_CUTSCENES must have at least
 * one matching RoomCutsceneTrigger, and pickActiveRoomCutscene must
 * resolve the right cutscene given a representative game-state slice.
 */
import { describe, expect, it } from "vitest";

import { EXPANSION_CUTSCENES } from "../expansionArt/cinematicsManifest";
import {
  ROOM_CUTSCENE_TRIGGERS,
  ROOM_CUTSCENE_TRIGGER_TOTAL,
  TRIGGERS_BY_CUTSCENE,
  assertEveryCutsceneHasTrigger,
  pickActiveRoomCutscene,
  type CutsceneDispatchSlice,
} from "./roomCutsceneTriggers";

describe("roomCutsceneTriggers", () => {
  it("has at least one trigger per expansion cutscene (hard parity)", () => {
    const missing = assertEveryCutsceneHasTrigger(EXPANSION_CUTSCENES);
    expect(missing).toEqual([]);
  });

  it("ROOM_CUTSCENE_TRIGGER_TOTAL >= EXPANSION_CUTSCENES.length", () => {
    expect(ROOM_CUTSCENE_TRIGGER_TOTAL).toBeGreaterThanOrEqual(
      EXPANSION_CUTSCENES.length,
    );
  });

  it("every trigger refers to a real cutscene id", () => {
    const cutsceneIds = new Set(EXPANSION_CUTSCENES.map((c) => c.id));
    for (const t of ROOM_CUTSCENE_TRIGGERS) {
      expect(cutsceneIds.has(t.cutsceneId)).toBe(true);
    }
  });

  it("every trigger has the data shape its kind requires", () => {
    for (const t of ROOM_CUTSCENE_TRIGGERS) {
      switch (t.kind) {
        case "room_first_enter":
          expect(t.zipDir).toBeDefined();
          expect(typeof t.zipDir).toBe("string");
          break;
        case "flag_set":
          expect(t.flagId).toBeDefined();
          expect(typeof t.flagId).toBe("string");
          break;
        case "mission_phase":
          expect(t.missionPhase).toBeDefined();
          expect(typeof t.missionPhase).toBe("string");
          break;
      }
    }
  });

  describe("pickActiveRoomCutscene", () => {
    const baseGame: CutsceneDispatchSlice = {
      narrativeFlags: {},
      visitedRoomZipDirs: new Set<string>(),
    };

    it("fires room_first_enter trigger on first visit of house_of_anvil", () => {
      const hit = pickActiveRoomCutscene(baseGame, "house_of_anvil");
      expect(hit?.cutsceneId).toBe("cs_guild_anvil_first_arrival");
    });

    it("does NOT fire room_first_enter for an already-visited room", () => {
      const game: CutsceneDispatchSlice = {
        ...baseGame,
        visitedRoomZipDirs: new Set(["house_of_anvil"]),
      };
      const hit = pickActiveRoomCutscene(game, "house_of_anvil");
      expect(hit).toBeUndefined();
    });

    it("fires flag_set trigger when its flag is true", () => {
      const game: CutsceneDispatchSlice = {
        ...baseGame,
        narrativeFlags: { forge_first_card_minted: true },
      };
      // Current room doesn't matter for flag_set triggers
      const hit = pickActiveRoomCutscene(game, "the_forge");
      expect(hit?.cutsceneId).toBe("cs_forge_first_creation");
    });

    it("respects the _played one-shot companion flag", () => {
      const game: CutsceneDispatchSlice = {
        ...baseGame,
        narrativeFlags: {
          forge_first_card_minted: true,
          cs_forge_first_creation_played: true,
        },
      };
      const hit = pickActiveRoomCutscene(game, "the_forge");
      expect(hit).toBeUndefined();
    });

    it("fires mission_phase trigger when missionPhase matches", () => {
      const game: CutsceneDispatchSlice = {
        ...baseGame,
        missionPhase: "ambush",
      };
      const hit = pickActiveRoomCutscene(game, "mission_briefing_war_room");
      expect(hit?.cutsceneId).toBe("cs_mission_ambush");
    });
  });

  it("TRIGGERS_BY_CUTSCENE map is complete and consistent", () => {
    for (const c of EXPANSION_CUTSCENES) {
      const trigs = TRIGGERS_BY_CUTSCENE.get(c.id);
      expect(trigs).toBeDefined();
      expect(trigs!.length).toBeGreaterThan(0);
    }
  });
});
