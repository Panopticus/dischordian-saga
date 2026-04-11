import { describe, it, expect } from "vitest";
import {
  VORTEX_INCURSION_ROOMS,
  VORTEX_PROGRESS_RIPPLE_EVENT,
  listVortexIncursionRooms,
} from "./vortexIncursionTemplate";
import { DUNGEON_LENGTH } from "./incursions";

describe("vortexIncursionTemplate — §11.5 Vortex endgame", () => {
  it("has exactly DUNGEON_LENGTH rooms (10)", () => {
    expect(VORTEX_INCURSION_ROOMS.length).toBe(DUNGEON_LENGTH);
  });

  it("every room has a unique key", () => {
    const keys = VORTEX_INCURSION_ROOMS.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("room 4 (index 4) is the mini-boss Sentinel", () => {
    const miniBoss = VORTEX_INCURSION_ROOMS[4];
    expect(miniBoss.type).toBe("boss");
    expect(miniBoss.key).toContain("mini_boss");
  });

  it("room 5 (index 5) is the Mini-Vortex echo puzzle", () => {
    const echo = VORTEX_INCURSION_ROOMS[5];
    expect(echo.key).toBe("vortex_echo");
    expect(echo.type).toBe("puzzle");
  });

  it("room 9 (index 9) is the Vortex Core final boss", () => {
    const core = VORTEX_INCURSION_ROOMS[9];
    expect(core.type).toBe("boss");
    expect(core.key).toBe("vortex_core");
    expect(core.difficultyMod).toBe(5.0);
  });

  it("the Vortex Core server buff is the community light bonus", () => {
    const core = VORTEX_INCURSION_ROOMS[9];
    expect(core.buff.stat).toContain("server");
  });

  it("VORTEX_PROGRESS_RIPPLE_EVENT is the canonical event name", () => {
    expect(VORTEX_PROGRESS_RIPPLE_EVENT).toBe("vortex_room_cleared");
  });

  it("listVortexIncursionRooms returns the full template", () => {
    expect(listVortexIncursionRooms().length).toBe(DUNGEON_LENGTH);
  });
});
