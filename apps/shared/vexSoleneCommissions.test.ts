import { describe, it, expect } from "vitest";
import {
  ARMY_UNIT_TYPES,
  COMMISSION_MILESTONES,
  allDirectives,
  buildCodaCommission,
  commissionMilestonesCoverActGates,
  commissionsForMissionCount,
  directiveSuccessBonus,
  getDirectiveForMilestone,
  milestonesCrossed,
} from "./vexSoleneCommissions";

describe("vexSoleneCommissions — milestones", () => {
  it("covers both Act 6 (5) and Act 7 (8) recruitment gates", () => {
    expect(commissionMilestonesCoverActGates()).toBe(true);
  });

  it("ships exactly five milestones, one per unit type", () => {
    expect(COMMISSION_MILESTONES.length).toBe(5);
    expect(ARMY_UNIT_TYPES.length).toBe(5);
  });

  it("each milestone unlocks a directive for a distinct unit type", () => {
    const unitTypes = COMMISSION_MILESTONES.map(m => getDirectiveForMilestone(m).unitType);
    expect(new Set(unitTypes).size).toBe(unitTypes.length);
  });
});

describe("vexSoleneCommissions — directives catalog", () => {
  it("every unit type has a directive", () => {
    const covered = new Set(allDirectives().map(d => d.unitType));
    for (const u of ARMY_UNIT_TYPES) expect(covered.has(u)).toBe(true);
  });

  it("every directive carries a non-trivial counsel line", () => {
    for (const d of allDirectives()) {
      expect(d.counsel.length).toBeGreaterThan(40);
    }
  });

  it("success bonuses are within a balanced range (8-15 pp)", () => {
    for (const d of allDirectives()) {
      expect(d.successBonusPct).toBeGreaterThanOrEqual(8);
      expect(d.successBonusPct).toBeLessThanOrEqual(15);
    }
  });
});

describe("vexSoleneCommissions — buildCodaCommission", () => {
  it("attaches a non-empty line at every milestone", () => {
    for (const m of COMMISSION_MILESTONES) {
      const c = buildCodaCommission(m);
      expect(c.line.length).toBeGreaterThan(40);
      expect(c.directive).toBeTruthy();
    }
  });

  it("late milestones include callbacks; the very first does not", () => {
    expect(buildCodaCommission(1).callbackLine).toBeUndefined();
    expect(buildCodaCommission(20).callbackLine).toBeDefined();
  });

  it("the capstone (20) carries Vex's reserved 'I'm glad it's you' line", () => {
    expect(buildCodaCommission(20).line.toLowerCase()).toContain("glad it's you");
  });

  it("voice discipline: no exclamation marks anywhere", () => {
    for (const m of COMMISSION_MILESTONES) {
      const c = buildCodaCommission(m);
      expect(c.line).not.toContain("!");
      if (c.callbackLine) expect(c.callbackLine).not.toContain("!");
    }
  });
});

describe("vexSoleneCommissions — milestonesCrossed", () => {
  it("returns nothing on a no-change increment", () => {
    expect(milestonesCrossed(5, 5)).toEqual([]);
  });

  it("returns nothing when the count regresses", () => {
    expect(milestonesCrossed(10, 5)).toEqual([]);
  });

  it("returns all milestones strictly between prev and next, inclusive of next", () => {
    expect(milestonesCrossed(0, 5)).toEqual([1, 5]);
    expect(milestonesCrossed(5, 15)).toEqual([8, 10]);
    expect(milestonesCrossed(10, 21)).toEqual([20]);
  });

  it("does not refire a milestone the player has already crossed", () => {
    expect(milestonesCrossed(5, 6)).toEqual([]);
  });
});

describe("vexSoleneCommissions — commissionsForMissionCount", () => {
  it("returns full commission objects with directives", () => {
    const cs = commissionsForMissionCount(0, 1);
    expect(cs.length).toBe(1);
    expect(cs[0].directive.unitType).toBe("operative");
  });

  it("returns multiple commissions when the player crosses several at once", () => {
    const cs = commissionsForMissionCount(0, 20);
    expect(cs.map(c => c.milestone)).toEqual([1, 5, 8, 10, 20]);
  });
});

describe("vexSoleneCommissions — directiveSuccessBonus", () => {
  it("returns 0 when the player has unlocked nothing", () => {
    expect(directiveSuccessBonus([], "operative", "infiltration")).toBe(0);
  });

  it("returns the bonus when unit type AND mission kind both match", () => {
    const d = getDirectiveForMilestone(1);
    expect(directiveSuccessBonus([d], "operative", "infiltration")).toBe(d.successBonusPct);
  });

  it("returns 0 when only one of unit type / mission kind matches", () => {
    const d = getDirectiveForMilestone(1);
    expect(directiveSuccessBonus([d], "operative", "diplomacy")).toBe(0);
    expect(directiveSuccessBonus([d], "diplomat", "infiltration")).toBe(0);
  });

  it("does not stack — only the first matching directive is applied", () => {
    const d = getDirectiveForMilestone(1);
    expect(directiveSuccessBonus([d, d], "operative", "infiltration")).toBe(d.successBonusPct);
  });
});
