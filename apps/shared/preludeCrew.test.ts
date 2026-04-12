import { describe, it, expect } from "vitest";
import {
  getPreludeCrewMember,
  listPreludeCrew,
  PRELUDE_CREW,
} from "./preludeCrew";
import {
  getPreludeMission,
  listPreludeMissions,
  PRELUDE_CREW_MISSIONS,
} from "./preludeCrewMissions";
import {
  ACT_1_OPPONENTS,
  CYCLE_A_OPPONENTS,
  CYCLE_B_OPPONENTS,
  CYCLE_C_OPPONENTS,
  getAct1Opponent,
  getCycleOpponents,
} from "./act1Opponents";
import {
  ENGINEERS_BENCH_FRAMING,
  GAME_MASTERS,
  THE_LEFT_GAME_MASTER,
  THE_RIGHT_GAME_MASTER,
  ZEPHYR_9_CLASSROOM,
  listGameMasters,
} from "./act2Interlude";

describe("preludeCrew (§2.4 data shell)", () => {
  it("has the three canonical crew members", () => {
    expect(PRELUDE_CREW).toHaveProperty("patch");
    expect(PRELUDE_CREW).toHaveProperty("zephyr_9");
    expect(PRELUDE_CREW).toHaveProperty("little_one");
  });

  it("listPreludeCrew orders them in §2.4 rescue order", () => {
    const order = listPreludeCrew().map((c) => c.id);
    expect(order).toEqual(["patch", "zephyr_9", "little_one"]);
  });

  it("every crew member has 4 bond tiers (20/40/60/80)", () => {
    for (const member of listPreludeCrew()) {
      expect(member.bondTiers.length).toBe(4);
      expect(member.bondTiers.map((t) => t.threshold)).toEqual([20, 40, 60, 80]);
    }
  });

  it("Patch unlocks the crafting bench", () => {
    expect(getPreludeCrewMember("patch").unlocks).toContain("crafting_bench");
  });

  it("Zephyr-9 unlocks chess AND the navigation layer", () => {
    const z = getPreludeCrewMember("zephyr_9");
    expect(z.unlocks).toContain("chess_minigame");
    expect(z.unlocks).toContain("trade_empire_navigation_layer");
  });

  it("Little One unlocks the Pet Garden room", () => {
    expect(getPreludeCrewMember("little_one").unlocks).toContain("pet_garden_room");
  });
});

describe("preludeCrewMissions (§2.6 data shell)", () => {
  it("has exactly the three §2.6 missions", () => {
    expect(Object.keys(PRELUDE_CREW_MISSIONS).sort()).toEqual(
      ["burnt_card", "signal_from_nowhere", "wreck_next_door"].sort(),
    );
  });

  it("listPreludeMissions orders them wreck → signal → burnt card", () => {
    const order = listPreludeMissions().map((m) => m.id);
    expect(order).toEqual([
      "wreck_next_door",
      "signal_from_nowhere",
      "burnt_card",
    ]);
  });

  it("burnt_card mission raises the prelude_burnt_card_found flag", () => {
    const m = getPreludeMission("burnt_card");
    expect(m.flagsOnSuccess).toContain("prelude_burnt_card_found");
    expect(m.flagsOnSuccess).toContain("prelude_complete");
  });

  it("every mission leader is a canonical crew member id", () => {
    for (const mission of listPreludeMissions()) {
      expect(["patch", "zephyr_9", "little_one"]).toContain(mission.leader);
    }
  });
});

describe("act1Opponents (§4 data shell)", () => {
  it("has exactly 12 opponents across 3 cycles", () => {
    expect(ACT_1_OPPONENTS.length).toBe(12);
    expect(CYCLE_A_OPPONENTS.length).toBe(3);
    expect(CYCLE_B_OPPONENTS.length).toBe(5);
    expect(CYCLE_C_OPPONENTS.length).toBe(4);
  });

  it("act1Step is 1..12 contiguously", () => {
    const steps = ACT_1_OPPONENTS.map((o) => o.act1Step).sort((a, b) => a - b);
    expect(steps).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("Little Watcher fires welcome-to-celebration after Cycle A", () => {
    const lw = getAct1Opponent("little_watcher");
    expect(lw?.postBattleSlideshow).toBe("welcome-to-celebration");
  });

  it("The Seer fires to-be-the-human after Cycle B", () => {
    const seer = getAct1Opponent("the_seer_visit");
    expect(seer?.postBattleSlideshow).toBe("to-be-the-human");
  });

  it("The Authority fires last-words at the Act 1 finale", () => {
    const auth = getAct1Opponent("the_authority");
    expect(auth?.postBattleSlideshow).toBe("last-words");
  });

  it("getCycleOpponents returns only opponents in the requested cycle", () => {
    const a = getCycleOpponents("kindergarten_of_gods");
    expect(a.every((o) => o.cycle === "kindergarten_of_gods")).toBe(true);
    expect(a.length).toBe(3);
  });
});

describe("act2Interlude (§6 data shell)", () => {
  it("ENGINEERS_BENCH_FRAMING has all six framing lines", () => {
    expect(ENGINEERS_BENCH_FRAMING.firstPowerOn.length).toBeGreaterThan(0);
    expect(ENGINEERS_BENCH_FRAMING.elaraAmbient.length).toBeGreaterThan(0);
    expect(ENGINEERS_BENCH_FRAMING.humanAmbient.length).toBeGreaterThan(0);
    expect(ENGINEERS_BENCH_FRAMING.firstLightCraft.length).toBeGreaterThan(0);
    expect(ENGINEERS_BENCH_FRAMING.firstDarkCraft.length).toBeGreaterThan(0);
    expect(ENGINEERS_BENCH_FRAMING.outOfMemoryEnergy.length).toBeGreaterThan(0);
  });

  it("ZEPHYR_9_CLASSROOM has the four §6.3 depth unlocks", () => {
    const depths = ZEPHYR_9_CLASSROOM.map((u) => u.depth);
    expect(depths).toEqual([1, 3, 5, 8]);
  });

  it("Engineer's Opening unlocks at chess_depth 8", () => {
    const engOpening = ZEPHYR_9_CLASSROOM.find((u) => u.depth === 8);
    expect(engOpening?.reward).toBe("engineers_opening");
  });

  it("has both Game Masters with distinct lenses", () => {
    expect(THE_LEFT_GAME_MASTER.lens).toBe("left");
    expect(THE_RIGHT_GAME_MASTER.lens).toBe("right");
    expect(GAME_MASTERS.left_game_master.id).toBe("left_game_master");
    expect(GAME_MASTERS.right_game_master.id).toBe("right_game_master");
  });

  it("both Game Masters are staged for Acts 3 and 4", () => {
    for (const gm of listGameMasters()) {
      expect(gm.cullingActs).toContain(3);
      expect(gm.cullingActs).toContain(4);
    }
  });
});
