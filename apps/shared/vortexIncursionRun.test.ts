import { describe, it, expect } from "vitest";
import {
  clearVortexRoom,
  countVortexRoomsCleared,
  getVortexLightReward,
  isVortexRunComplete,
  spawnVortexRun,
  VORTEX_CORE_BONUS_LIGHT,
  VORTEX_LIGHT_PER_ROOM,
} from "./vortexIncursionRun";
import { DUNGEON_LENGTH } from "./incursions";

const FIXED_NOW = 1_735_689_600_000; // 2025-01-01 UTC

function makeRun(overrides: Partial<Parameters<typeof spawnVortexRun>[0]> = {}) {
  return spawnVortexRun({
    runId: "test_run",
    playerA: "alice",
    playerB: "bob",
    nowMs: FIXED_NOW,
    weekId: "2026-W01",
    ...overrides,
  });
}

describe("vortexIncursionRun", () => {
  describe("spawnVortexRun", () => {
    it("produces a run with exactly 10 rooms", () => {
      const run = makeRun();
      expect(run.rooms.length).toBe(DUNGEON_LENGTH);
    });

    it("rooms are in canonical Vortex order (not shuffled)", () => {
      const run = makeRun();
      expect(run.rooms[0].def.key).toBe("vortex_approach_1");
      expect(run.rooms[4].def.key).toBe("vortex_mini_boss");
      expect(run.rooms[5].def.key).toBe("vortex_echo");
      expect(run.rooms[9].def.key).toBe("vortex_core");
    });

    it("starts at room 0 with no rooms cleared", () => {
      const run = makeRun();
      expect(run.currentRoomIndex).toBe(0);
      expect(run.rooms.every((r) => r.cleared === false)).toBe(true);
      expect(run.completedAt).toBeNull();
    });

    it("preserves the supplied weekId", () => {
      const run = makeRun({ weekId: "2026-W22" });
      expect(run.weekId).toBe("2026-W22");
    });
  });

  describe("clearVortexRoom", () => {
    it("marks the current room as cleared and advances the cursor", () => {
      const run = makeRun();
      const next = clearVortexRoom(run, 0, 12_000);
      expect(next.rooms[0].cleared).toBe(true);
      expect(next.rooms[0].elapsedMs).toBe(12_000);
      expect(next.currentRoomIndex).toBe(1);
      expect(next.completedAt).toBeNull();
    });

    it("is a no-op if roomIndex is not the current one", () => {
      const run = makeRun();
      const next = clearVortexRoom(run, 5, 10_000);
      expect(next).toEqual(run);
    });

    it("sets completedAt when the final room is cleared", () => {
      let run = makeRun();
      for (let i = 0; i < DUNGEON_LENGTH; i++) {
        run = clearVortexRoom(run, i, 5_000);
      }
      expect(run.completedAt).not.toBeNull();
      expect(isVortexRunComplete(run)).toBe(true);
    });
  });

  describe("countVortexRoomsCleared", () => {
    it("returns 0 for a fresh run", () => {
      const run = makeRun();
      expect(countVortexRoomsCleared(run)).toBe(0);
    });

    it("climbs as rooms are cleared", () => {
      let run = makeRun();
      run = clearVortexRoom(run, 0, 1000);
      run = clearVortexRoom(run, 1, 1000);
      run = clearVortexRoom(run, 2, 1000);
      expect(countVortexRoomsCleared(run)).toBe(3);
    });
  });

  describe("getVortexLightReward", () => {
    it("is zero on a fresh run", () => {
      const run = makeRun();
      expect(getVortexLightReward(run)).toBe(0);
    });

    it("adds VORTEX_LIGHT_PER_ROOM for each non-core cleared room", () => {
      let run = makeRun();
      run = clearVortexRoom(run, 0, 1000);
      run = clearVortexRoom(run, 1, 1000);
      run = clearVortexRoom(run, 2, 1000);
      expect(getVortexLightReward(run)).toBe(VORTEX_LIGHT_PER_ROOM * 3);
    });

    it("adds VORTEX_CORE_BONUS_LIGHT when the Core is cleared", () => {
      let run = makeRun();
      for (let i = 0; i < DUNGEON_LENGTH; i++) {
        run = clearVortexRoom(run, i, 1000);
      }
      const expected =
        VORTEX_LIGHT_PER_ROOM * DUNGEON_LENGTH + VORTEX_CORE_BONUS_LIGHT;
      expect(getVortexLightReward(run)).toBe(expected);
    });
  });

  describe("isVortexRunComplete", () => {
    it("false while rooms remain", () => {
      const run = makeRun();
      expect(isVortexRunComplete(run)).toBe(false);
    });

    it("true once the final room is cleared", () => {
      let run = makeRun();
      for (let i = 0; i < DUNGEON_LENGTH; i++) {
        run = clearVortexRoom(run, i, 500);
      }
      expect(isVortexRunComplete(run)).toBe(true);
    });
  });
});
