import { describe, it, expect } from "vitest";
import {
  daysSinceLastVisit,
  hasUnreadContent,
  listUnreadCompanions,
  markVisited,
  type CompanionVisitMap,
} from "./useCompanionVisits";

describe("hasUnreadContent", () => {
  it("returns true when no record exists and version > 0", () => {
    expect(hasUnreadContent("elara", 1, {})).toBe(true);
  });

  it("returns false when no record exists and version is 0", () => {
    expect(hasUnreadContent("elara", 0, {})).toBe(false);
  });

  it("returns true when current version is newer than seen version", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 2, lastVisitedAt: 0 },
    };
    expect(hasUnreadContent("elara", 3, visits)).toBe(true);
  });

  it("returns false when current version is the same as seen version", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 3, lastVisitedAt: 0 },
    };
    expect(hasUnreadContent("elara", 3, visits)).toBe(false);
  });

  it("returns false when seen version is somehow ahead", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 5, lastVisitedAt: 0 },
    };
    expect(hasUnreadContent("elara", 3, visits)).toBe(false);
  });
});

describe("markVisited", () => {
  it("creates a new entry when none exists", () => {
    const next = markVisited("elara", 4, {}, 1000);
    expect(next.elara).toEqual({ lastSeenVersion: 4, lastVisitedAt: 1000 });
  });

  it("preserves entries for other companions", () => {
    const visits: CompanionVisitMap = {
      the_human: { lastSeenVersion: 7, lastVisitedAt: 50 },
    };
    const next = markVisited("elara", 3, visits, 200);
    expect(next.the_human).toEqual({ lastSeenVersion: 7, lastVisitedAt: 50 });
    expect(next.elara).toEqual({ lastSeenVersion: 3, lastVisitedAt: 200 });
  });

  it("overwrites the previous entry when revisiting", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 1, lastVisitedAt: 100 },
    };
    const next = markVisited("elara", 5, visits, 500);
    expect(next.elara).toEqual({ lastSeenVersion: 5, lastVisitedAt: 500 });
  });
});

describe("daysSinceLastVisit", () => {
  it("returns null when never visited", () => {
    expect(daysSinceLastVisit("elara", {})).toBeNull();
  });

  it("returns 0 when visited just now", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 1, lastVisitedAt: 1000 },
    };
    expect(daysSinceLastVisit("elara", visits, 1000)).toBe(0);
  });

  it("returns floor of full days elapsed", () => {
    const ms2_5days = 1000 * 60 * 60 * 24 * 2.5;
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 1, lastVisitedAt: 0 },
    };
    expect(daysSinceLastVisit("elara", visits, ms2_5days)).toBe(2);
  });

  it("clamps negative time to 0 (clock-skew defence)", () => {
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 1, lastVisitedAt: 1000 },
    };
    expect(daysSinceLastVisit("elara", visits, 500)).toBe(0);
  });
});

describe("listUnreadCompanions", () => {
  it("returns every companion whose authored version exceeds last seen", () => {
    const versions = { elara: 5, the_human: 2, the_antiquarian: 1 } as const;
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 4, lastVisitedAt: 0 },
      the_human: { lastSeenVersion: 2, lastVisitedAt: 0 },
      // antiquarian: never visited
    };
    const unread = listUnreadCompanions(versions, visits);
    expect(unread.sort()).toEqual(["elara", "the_antiquarian"]);
  });

  it("returns an empty list when nothing is unread", () => {
    const versions = { elara: 4 } as const;
    const visits: CompanionVisitMap = {
      elara: { lastSeenVersion: 4, lastVisitedAt: 0 },
    };
    expect(listUnreadCompanions(versions, visits)).toEqual([]);
  });
});
