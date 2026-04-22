import { describe, it, expect } from "vitest";
import {
  ENGINEERS_BENCH_FRAMING,
  GAME_MASTER_FIRST_LOSS_LINE,
  GAME_MASTERS,
  THE_LEFT_GAME_MASTER,
  THE_RIGHT_GAME_MASTER,
  ZEPHYR_9_CLASSROOM,
  getCullingRematchLine,
  listGameMasters,
} from "./act2Interlude";

describe("ENGINEERS_BENCH_FRAMING", () => {
  it("exports all six §6.2 framing beats as non-empty strings", () => {
    expect(ENGINEERS_BENCH_FRAMING.firstPowerOn).toMatch(/bench powers on/);
    expect(ENGINEERS_BENCH_FRAMING.elaraAmbient).toMatch(/his Deck/);
    expect(ENGINEERS_BENCH_FRAMING.humanAmbient).toMatch(/built it twice/);
    expect(ENGINEERS_BENCH_FRAMING.firstLightCraft).toMatch(/first card/);
    expect(ENGINEERS_BENCH_FRAMING.firstDarkCraft).toMatch(/dark card/);
    expect(ENGINEERS_BENCH_FRAMING.outOfMemoryEnergy).toMatch(/Memory Energy/);
  });
});

describe("ZEPHYR_9_CLASSROOM", () => {
  it("covers the canonical 4-tier unlock ladder", () => {
    const depths = ZEPHYR_9_CLASSROOM.map((t) => t.depth);
    expect(depths).toEqual([1, 3, 5, 8]);
  });

  it("every tier ships a reward id + zephyrLine", () => {
    for (const tier of ZEPHYR_9_CLASSROOM) {
      expect(tier.reward).toBeTruthy();
      expect(tier.zephyrLine.length).toBeGreaterThan(10);
    }
  });
});

describe("Game Masters", () => {
  it("exports both Left and Right profiles", () => {
    expect(THE_LEFT_GAME_MASTER.lens).toBe("left");
    expect(THE_RIGHT_GAME_MASTER.lens).toBe("right");
    expect(GAME_MASTERS.left_game_master).toBe(THE_LEFT_GAME_MASTER);
    expect(GAME_MASTERS.right_game_master).toBe(THE_RIGHT_GAME_MASTER);
  });

  it("listGameMasters returns both in canonical order", () => {
    const list = listGameMasters();
    expect(list).toHaveLength(2);
    expect(list[0].lens).toBe("left");
    expect(list[1].lens).toBe("right");
  });

  it("both GMs declare cullingActs [3, 4]", () => {
    expect(THE_LEFT_GAME_MASTER.cullingActs).toEqual([3, 4]);
    expect(THE_RIGHT_GAME_MASTER.cullingActs).toEqual([3, 4]);
  });

  it("GAME_MASTER_FIRST_LOSS_LINE cites the Matrix of Dreams canon rule", () => {
    expect(GAME_MASTER_FIRST_LOSS_LINE).toMatch(/Matrix of Dreams/);
    expect(GAME_MASTER_FIRST_LOSS_LINE).toMatch(/Arena/);
  });
});

describe("getCullingRematchLine", () => {
  it("returns empty string for acts outside cullingActs", () => {
    expect(getCullingRematchLine(THE_LEFT_GAME_MASTER, 2)).toBe("");
    expect(getCullingRematchLine(THE_RIGHT_GAME_MASTER, 5)).toBe("");
  });

  it("returns authored Act 3 line for Left GM", () => {
    const line = getCullingRematchLine(THE_LEFT_GAME_MASTER, 3);
    expect(line).toMatch(/hemisphere/);
    expect(line.length).toBeGreaterThan(40);
  });

  it("returns authored Act 3 line for Right GM", () => {
    const line = getCullingRematchLine(THE_RIGHT_GAME_MASTER, 3);
    expect(line).toMatch(/darling|HELLO/i);
    expect(line.length).toBeGreaterThan(40);
  });

  it("returns authored Act 4 line for Left GM (Kael memory context)", () => {
    const line = getCullingRematchLine(THE_LEFT_GAME_MASTER, 4);
    expect(line).toMatch(/memory|seventeen thousand/i);
    expect(line.length).toBeGreaterThan(40);
  });

  it("returns authored Act 4 line for Right GM (Kael memory context)", () => {
    const line = getCullingRematchLine(THE_RIGHT_GAME_MASTER, 4);
    expect(line).toMatch(/memory/i);
    expect(line.length).toBeGreaterThan(40);
  });

  it("is a pure function of (gm, act)", () => {
    // Same inputs always return the same string.
    const a = getCullingRematchLine(THE_LEFT_GAME_MASTER, 3);
    const b = getCullingRematchLine(THE_LEFT_GAME_MASTER, 3);
    expect(a).toBe(b);
  });
});
