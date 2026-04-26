import { describe, it, expect } from "vitest";
import {
  pickResignationLine,
  pickOpponentResignLine,
  pickPlayerDrawOfferDeclineLine,
  pickPlayerDrawOfferAcceptLine,
  pickGmDrawOfferLine,
  pickDrawOutcomeLine,
  pickStreakMilestoneLine,
  pickDailyWelcomeLine,
  bandForDaysSinceLastVisit,
  STREAK_MILESTONES,
} from "./chessSessionDialog";

describe("chessSessionDialog", () => {
  it("resignation graceful vs premature varies by eval", () => {
    const graceful = pickResignationLine(-900, 0);
    const premature = pickResignationLine(-100, 0);
    expect(graceful).not.toBe(premature);
  });

  it("resignation lines are deterministic for same seed", () => {
    expect(pickResignationLine(-900, 7)).toBe(pickResignationLine(-900, 7));
  });

  it("opponent resign / draw outcome / draw offer pickers return strings", () => {
    expect(typeof pickOpponentResignLine(0)).toBe("string");
    expect(typeof pickGmDrawOfferLine(0)).toBe("string");
    expect(typeof pickPlayerDrawOfferDeclineLine(0)).toBe("string");
    expect(typeof pickPlayerDrawOfferAcceptLine(0)).toBe("string");
    expect(typeof pickDrawOutcomeLine(0)).toBe("string");
  });

  it("streak milestone fires only on the milestone day", () => {
    for (const m of STREAK_MILESTONES) {
      expect(pickStreakMilestoneLine(m, 0)).toBeTruthy();
      expect(pickStreakMilestoneLine(m + 1, 0)).toBeUndefined();
    }
    expect(pickStreakMilestoneLine(0, 0)).toBeUndefined();
    expect(pickStreakMilestoneLine(1, 0)).toBeUndefined();
  });

  it("daily welcome bands cover every day count > 0", () => {
    expect(bandForDaysSinceLastVisit(0)).toBeNull();
    expect(bandForDaysSinceLastVisit(1)).toBe("fresh");
    expect(bandForDaysSinceLastVisit(3)).toBe("back");
    expect(bandForDaysSinceLastVisit(10)).toBe("returning");
    expect(bandForDaysSinceLastVisit(60)).toBe("long_gone");
  });

  it("daily welcome line is undefined on same-day, otherwise present", () => {
    expect(pickDailyWelcomeLine(0, 0)).toBeUndefined();
    expect(pickDailyWelcomeLine(1, 0)).toBeTruthy();
    expect(pickDailyWelcomeLine(45, 0)).toBeTruthy();
  });
});
