import { describe, it, expect } from "vitest";
import {
  YEAR_ONE_MONTH_MIN,
  YEAR_ONE_MONTH_MAX,
  advanceYearOneMonth,
  clampYearOneMonth,
  deriveYearOneMonth,
  yearOneMonthFlag,
} from "./yearOneMonth";

describe("yearOneMonth — clampYearOneMonth", () => {
  it("passes through valid months", () => {
    expect(clampYearOneMonth(1)).toBe(1);
    expect(clampYearOneMonth(6)).toBe(6);
    expect(clampYearOneMonth(12)).toBe(12);
  });

  it("floors fractional months", () => {
    expect(clampYearOneMonth(3.9)).toBe(3);
    expect(clampYearOneMonth(11.1)).toBe(11);
  });

  it("clamps below 1 to 1", () => {
    expect(clampYearOneMonth(0)).toBe(1);
    expect(clampYearOneMonth(-5)).toBe(1);
  });

  it("clamps above 12 to 12", () => {
    expect(clampYearOneMonth(13)).toBe(12);
    expect(clampYearOneMonth(9999)).toBe(12);
  });

  it("treats NaN and Infinity as 1", () => {
    expect(clampYearOneMonth(Number.NaN)).toBe(1);
    expect(clampYearOneMonth(Number.POSITIVE_INFINITY)).toBe(1);
  });
});

describe("yearOneMonth — advanceYearOneMonth", () => {
  it("steps forward by one", () => {
    expect(advanceYearOneMonth(1)).toBe(2);
    expect(advanceYearOneMonth(6)).toBe(7);
  });

  it("clamps at 12 (no wrap — prestige loop lives elsewhere)", () => {
    expect(advanceYearOneMonth(12)).toBe(12);
  });

  it("recovers from out-of-range currents to month 1", () => {
    // Semantic: add-one-then-clamp. advance(0) = clamp(1) = 1,
    // advance(NaN+1) = NaN → clamp → 1. Invalid input heals to
    // the calendar start rather than skipping it.
    expect(advanceYearOneMonth(0)).toBe(1);
    expect(advanceYearOneMonth(-5)).toBe(1);
    expect(advanceYearOneMonth(Number.NaN)).toBe(1);
  });

  it("still clamps at 12 for over-range inputs", () => {
    expect(advanceYearOneMonth(20)).toBe(12);
    expect(advanceYearOneMonth(9999)).toBe(12);
  });
});

describe("yearOneMonth — yearOneMonthFlag", () => {
  it("formats the canonical flag name", () => {
    expect(yearOneMonthFlag(1)).toBe("year_one_month_1_opened");
    expect(yearOneMonthFlag(7)).toBe("year_one_month_7_opened");
    expect(yearOneMonthFlag(12)).toBe("year_one_month_12_opened");
  });

  it("clamps the month before formatting so flag names are always valid", () => {
    expect(yearOneMonthFlag(0)).toBe("year_one_month_1_opened");
    expect(yearOneMonthFlag(99)).toBe("year_one_month_12_opened");
  });
});

describe("yearOneMonth — deriveYearOneMonth", () => {
  it("prefers explicit field when finite", () => {
    expect(deriveYearOneMonth({ yearOneMonth: 7 })).toBe(7);
    expect(
      deriveYearOneMonth({
        yearOneMonth: 7,
        flags: { year_one_month_3_opened: true },
      }),
    ).toBe(7);
  });

  it("clamps explicit field outside [1, 12]", () => {
    expect(deriveYearOneMonth({ yearOneMonth: -5 })).toBe(1);
    expect(deriveYearOneMonth({ yearOneMonth: 99 })).toBe(12);
  });

  it("falls back to highest opened flag when field is absent", () => {
    expect(
      deriveYearOneMonth({
        flags: {
          year_one_month_1_opened: true,
          year_one_month_2_opened: true,
          year_one_month_3_opened: true,
        },
      }),
    ).toBe(3);
  });

  it("picks the MAX set flag (gaps are tolerated)", () => {
    // The server sets month flags in order, but if flags 1 + 5
    // are set and 2-4 are missing, the player is on month 5.
    expect(
      deriveYearOneMonth({
        flags: {
          year_one_month_1_opened: true,
          year_one_month_5_opened: true,
        },
      }),
    ).toBe(5);
  });

  it("falls back when yearOneMonth is null or NaN", () => {
    expect(
      deriveYearOneMonth({
        yearOneMonth: null,
        flags: { year_one_month_4_opened: true },
      }),
    ).toBe(4);
    expect(
      deriveYearOneMonth({
        yearOneMonth: Number.NaN,
        flags: { year_one_month_4_opened: true },
      }),
    ).toBe(4);
  });

  it("defaults to month 1 when both field and flags are missing", () => {
    expect(deriveYearOneMonth({})).toBe(1);
    expect(deriveYearOneMonth({ flags: {} })).toBe(1);
  });

  it("treats field value 1 as explicit (not a fallback trigger)", () => {
    // Important: month 1 is a valid explicit value. A save that
    // sets yearOneMonth=1 but has no flags yet should stay at 1.
    expect(
      deriveYearOneMonth({ yearOneMonth: 1, flags: {} }),
    ).toBe(1);
  });

  it("treats falsy flag values as unset", () => {
    expect(
      deriveYearOneMonth({
        flags: {
          year_one_month_1_opened: true,
          year_one_month_2_opened: false,
          year_one_month_3_opened: 0,
          year_one_month_4_opened: undefined,
        },
      }),
    ).toBe(1);
  });
});

describe("yearOneMonth — constants", () => {
  it("month range is 1..12", () => {
    expect(YEAR_ONE_MONTH_MIN).toBe(1);
    expect(YEAR_ONE_MONTH_MAX).toBe(12);
  });
});
