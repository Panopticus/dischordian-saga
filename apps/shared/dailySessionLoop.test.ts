import { describe, it, expect } from "vitest";
import {
  DAILY_SESSION_LOOP,
  getDailySessionMinutes,
} from "./dailySessionLoop";
import { checkDailySessionLoopCoverage } from "./_completeness/checks/dailySessionLoopCoverage";

describe("daily session loop", () => {
  it("has unique step ids and diegetic framing", () => {
    const ids = DAILY_SESSION_LOOP.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of DAILY_SESSION_LOOP) {
      expect(s.diegeticFraming.trim().length).toBeGreaterThan(15);
      expect(s.minutes).toBeGreaterThan(0);
    }
  });

  it("is a ~8 minute session (within the designed 5–12m band)", () => {
    const m = getDailySessionMinutes();
    expect(m).toBeGreaterThanOrEqual(5);
    expect(m).toBeLessThanOrEqual(12);
  });

  it("ends by handing back to the narrative spine", () => {
    const last = DAILY_SESSION_LOOP[DAILY_SESSION_LOOP.length - 1];
    expect(last.id).toBe("spine_handoff");
    expect(last.anchorModule).toBe("apps/shared/spineObjectives.ts");
  });
});

describe("daily session loop coverage gate", () => {
  it("is hard-parity PASS — every anchor exists, budget in band", () => {
    const r = checkDailySessionLoopCoverage();
    expect(r.missing ?? []).toEqual([]);
    expect(r.implemented).toBe(r.declared);
    expect(r.declared).toBe(DAILY_SESSION_LOOP.length);
  });
});
