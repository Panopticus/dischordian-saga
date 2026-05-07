import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  RECRUITMENT_THRESHOLDS,
  addCompletedRecruitmentMission,
  hasReachedAct6Threshold,
  hasReachedAct7Threshold,
} from "../shared/armyRecruitment";

/* ═══════════════════════════════════════════════════════
   WAVE 1 — army recruitment counter wiring

   Addresses Roadmap Implication §5: the counter existed on
   GameState but nothing wrote to it, so Acts 6 and 7 were
   unreachable. This verifies:

     1. GameContext exposes completeRecruitmentMission()
     2. ArmyManagementPage calls it on mission launch
     3. narrativeActs ACT_TRIGGERS use the shared thresholds
        (no magic 5/15 numbers)
     4. gameStateRouter schema accepts the field
   ═══════════════════════════════════════════════════════ */

const ctxSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
  "utf-8",
);
const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/pages/ArmyManagementPage.tsx"),
  "utf-8",
);
const actsSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/data/narrativeActs.ts"),
  "utf-8",
);
const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/gameState.ts"),
  "utf-8",
);

describe("Wave 1 — GameContext exposes completeRecruitmentMission", () => {
  it("declares the method in GameContextValue", () => {
    expect(ctxSrc).toMatch(
      /completeRecruitmentMission:\s*\(missionId:\s*string\)\s*=>\s*void/,
    );
  });

  it("imports the shared helper", () => {
    expect(ctxSrc).toContain(
      'import { addCompletedRecruitmentMission } from "@shared/armyRecruitment"',
    );
  });

  it("guards against duplicate ids and empty missionId (idempotent)", () => {
    // The callback must early-return when the id is already in the
    // array OR when the id is falsy, so React strict-mode double
    // fires + save/load cycles don't double-count.
    expect(ctxSrc).toMatch(
      /if\s*\(\s*!missionId\s*\|\|\s*current\.includes\(missionId\)\s*\)\s*return\s*prev;/,
    );
  });

  it("provider value surfaces completeRecruitmentMission to consumers", () => {
    // useMemo'd value (audit/C-04).
    const valueBlockMatch = ctxSrc.match(/const value = useMemo\(\(\) => \(\{[\s\S]*?\}\),\s*\[/);
    expect(valueBlockMatch).not.toBeNull();
    expect(valueBlockMatch![0]).toContain("completeRecruitmentMission");
  });
});

describe("Wave 1 — ArmyManagementPage calls completeRecruitmentMission on launch", () => {
  it("destructures completeRecruitmentMission from useGame()", () => {
    expect(pageSrc).toMatch(
      /completeRecruitmentMission[\s\S]{0,100}=\s*useGame\(\)/,
    );
  });

  it("handleLaunchMission calls the completion action with the mission id", () => {
    expect(pageSrc).toMatch(/completeRecruitmentMission\(mission\.id\)/);
  });

  it("adds completeRecruitmentMission to the useCallback deps", () => {
    expect(pageSrc).toMatch(
      /\[recruitUnit,\s*completeRecruitmentMission\]/,
    );
  });
});

describe("Wave 1 — narrativeActs ACT_TRIGGERS use shared thresholds", () => {
  it("imports the shared threshold helpers", () => {
    expect(actsSrc).toContain(
      'from "@shared/armyRecruitment"',
    );
  });

  it("Act 6 gate uses hasReachedAct6Threshold", () => {
    expect(actsSrc).toContain("hasReachedAct6Threshold");
  });

  it("Act 7 gate uses hasReachedAct7Threshold", () => {
    expect(actsSrc).toContain("hasReachedAct7Threshold");
  });

  it("retired the inline magic 5/15 numbers (no drift)", () => {
    // The old inline check used `>= 5` and `>= 15` directly on the
    // array length. Those specific magic numbers must be gone from
    // the ACT_TRIGGERS block.
    expect(actsSrc).not.toMatch(
      /armyRecruitmentMissionsCompleted\.length\s*>=\s*5/,
    );
    expect(actsSrc).not.toMatch(
      /armyRecruitmentMissionsCompleted\.length\s*>=\s*15/,
    );
  });
});

describe("Wave 1 — gameStateRouter schema accepts armyRecruitmentMissionsCompleted", () => {
  it("schema declares armyRecruitmentMissionsCompleted as optional string array", () => {
    expect(routerSrc).toMatch(
      /armyRecruitmentMissionsCompleted:\s*z\.array\(z\.string\(\)\)\.optional\(\)/,
    );
  });
});

describe("Wave 1 — recruitment counter drives Act 6/7 gates end-to-end", () => {
  /** Simulate what happens when the player launches a sequence of
   *  missions and the counter crosses the canonical thresholds. */
  function simulateCompletions(count: number): string[] {
    let list: string[] = [];
    for (let i = 0; i < count; i++) {
      list = addCompletedRecruitmentMission(list, `mission-${i}`);
    }
    return list;
  }

  it("five completions cross the Act 6 threshold", () => {
    const list = simulateCompletions(RECRUITMENT_THRESHOLDS.act6);
    expect(hasReachedAct6Threshold(list.length)).toBe(true);
    expect(hasReachedAct7Threshold(list.length)).toBe(false);
  });

  it("fifteen completions cross the Act 7 threshold", () => {
    const list = simulateCompletions(RECRUITMENT_THRESHOLDS.act7);
    expect(hasReachedAct7Threshold(list.length)).toBe(true);
  });

  it("duplicate launches don't double-count (important for strict-mode safety)", () => {
    let list: string[] = [];
    list = addCompletedRecruitmentMission(list, "mission-a");
    list = addCompletedRecruitmentMission(list, "mission-a");
    list = addCompletedRecruitmentMission(list, "mission-a");
    expect(list.length).toBe(1);
  });
});
