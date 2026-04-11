import { describe, it, expect } from "vitest";
import {
  derivePreludeIntroState,
  getNextPreludeCrewToJoin,
  getAvailablePreludeMissions,
  isPreludeComplete,
  getNextAct1Opponent,
  listDefeatedAct1Opponents,
  getActiveEngineersBenchLine,
  getActiveAct2GameMaster,
  deriveInfiltrationProgress,
  getActiveInfiltrationPath,
} from "./witnessingRuntime";

describe("witnessingRuntime — Item 8 Prelude crew intro", () => {
  it("derives empty intro state for a fresh save", () => {
    const state = derivePreludeIntroState({});
    expect(state.crewOnboard).toEqual([]);
    expect(state.missionsComplete).toEqual([]);
  });

  it("reports crew onboard once their flag is set", () => {
    const state = derivePreludeIntroState({
      prelude_patch_joined: true,
      prelude_little_one_joined: true,
    });
    expect(state.crewOnboard).toContain("patch");
    expect(state.crewOnboard).toContain("little_one");
    expect(state.crewOnboard).not.toContain("zephyr_9");
  });

  it("getNextPreludeCrewToJoin returns the first not-yet-joined member", () => {
    expect(getNextPreludeCrewToJoin({})?.id).toBe("patch");
    expect(
      getNextPreludeCrewToJoin({ prelude_patch_joined: true })?.id,
    ).toBe("zephyr_9");
    expect(
      getNextPreludeCrewToJoin({
        prelude_patch_joined: true,
        prelude_zephyr_9_joined: true,
      })?.id,
    ).toBe("little_one");
  });

  it("getNextPreludeCrewToJoin returns null when all three are joined", () => {
    expect(
      getNextPreludeCrewToJoin({
        prelude_patch_joined: true,
        prelude_zephyr_9_joined: true,
        prelude_little_one_joined: true,
      }),
    ).toBeNull();
  });

  it("getAvailablePreludeMissions gates on leader joined + not complete", () => {
    // Nothing joined → no missions
    expect(getAvailablePreludeMissions({}).length).toBe(0);

    // Patch joined → wreck_next_door available
    const withPatch = getAvailablePreludeMissions({
      prelude_patch_joined: true,
    });
    expect(withPatch.map((m) => m.id)).toContain("wreck_next_door");

    // Patch joined + mission complete → not offered anymore
    const afterMission = getAvailablePreludeMissions({
      prelude_patch_joined: true,
      prelude_mission_wreck_next_door_complete: true,
    });
    expect(afterMission.map((m) => m.id)).not.toContain("wreck_next_door");
  });

  it("isPreludeComplete requires all six flags", () => {
    expect(isPreludeComplete({})).toBe(false);
    expect(
      isPreludeComplete({
        prelude_patch_joined: true,
        prelude_zephyr_9_joined: true,
        prelude_little_one_joined: true,
      }),
    ).toBe(false);
    expect(
      isPreludeComplete({
        prelude_patch_joined: true,
        prelude_zephyr_9_joined: true,
        prelude_little_one_joined: true,
        prelude_mission_wreck_next_door_complete: true,
        prelude_mission_signal_from_nowhere_complete: true,
        prelude_mission_burnt_card_complete: true,
      }),
    ).toBe(true);
  });
});

describe("witnessingRuntime — Item 9 Act 1 card ladder", () => {
  it("returns step 1 at zero wins", () => {
    expect(getNextAct1Opponent(0)?.act1Step).toBe(1);
  });

  it("advances through the ladder", () => {
    expect(getNextAct1Opponent(1)?.act1Step).toBe(2);
    expect(getNextAct1Opponent(5)?.act1Step).toBe(6);
    expect(getNextAct1Opponent(11)?.act1Step).toBe(12);
  });

  it("returns null once the ladder is complete (12 wins)", () => {
    expect(getNextAct1Opponent(12)).toBeNull();
    expect(getNextAct1Opponent(100)).toBeNull();
  });

  it("listDefeatedAct1Opponents returns what the player has beaten", () => {
    expect(listDefeatedAct1Opponents(0).length).toBe(0);
    expect(listDefeatedAct1Opponents(3).length).toBe(3);
    expect(listDefeatedAct1Opponents(12).length).toBe(12);
  });
});

describe("witnessingRuntime — Item 10 Act 2 Engineers Bench", () => {
  it("returns firstPowerOn framing at depth 0", () => {
    const line = getActiveEngineersBenchLine(0);
    expect(line).toContain("bench powers on");
  });

  it("returns the depth-1 zephyrLine at depth 1", () => {
    const line = getActiveEngineersBenchLine(1);
    expect(line).toContain("I will not let you win");
  });

  it("returns the highest earned zephyrLine at higher depths", () => {
    const line = getActiveEngineersBenchLine(8);
    expect(line.toLowerCase()).toContain("engineer's opening");
  });

  it("getActiveAct2GameMaster returns null on neutral morality", () => {
    expect(getActiveAct2GameMaster(0)).toBeNull();
  });

  it("returns Left Game Master on positive morality", () => {
    const gm = getActiveAct2GameMaster(10);
    expect(gm?.lens).toBe("left");
  });

  it("returns Right Game Master on negative morality", () => {
    const gm = getActiveAct2GameMaster(-10);
    expect(gm?.lens).toBe("right");
  });
});

describe("witnessingRuntime — Item 11 infiltration paths", () => {
  it("derives zero progress for fresh flags", () => {
    const progress = deriveInfiltrationProgress({});
    expect(progress.length).toBe(3);
    for (const p of progress) {
      expect(p.committed).toBe(false);
      expect(p.milestoneReached).toBe(false);
      expect(p.endingReached).toBe(false);
    }
  });

  it("marks a path as committed when its commitFlag is set", () => {
    const progress = deriveInfiltrationProgress({
      act3_insurgency_committed: true,
    });
    const insurgency = progress.find((p) => p.pathId === "insurgency");
    expect(insurgency?.committed).toBe(true);
  });

  it("getActiveInfiltrationPath returns committed path with no ending", () => {
    const active = getActiveInfiltrationPath({
      act3_empire_committed: true,
    });
    expect(active?.id).toBe("empire");
  });

  it("getActiveInfiltrationPath returns null once ending reached", () => {
    const active = getActiveInfiltrationPath({
      act3_empire_committed: true,
      act3_empire_ending: true,
    });
    expect(active).toBeNull();
  });

  it("getActiveInfiltrationPath returns null with no commitment", () => {
    expect(getActiveInfiltrationPath({})).toBeNull();
  });
});
