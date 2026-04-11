import { describe, it, expect } from "vitest";
import {
  YEAR_ONE_CALENDAR_RIPPLES,
  MILESTONE_CHRONICLE_ENTRIES,
  getYearOneCalendarRipple,
  getMilestoneChronicleEntry,
  listMilestoneChronicleEntries,
  listYearOneCalendarRipples,
} from "./witnessingYearOne";
import { WITNESSING_MILESTONES } from "./witnessingEvents";

describe("witnessingYearOne — Item 13 Year One calendar", () => {
  it("has exactly 12 month ripples", () => {
    expect(YEAR_ONE_CALENDAR_RIPPLES.length).toBe(12);
  });

  it("months are 1-12 contiguously", () => {
    const months = [...YEAR_ONE_CALENDAR_RIPPLES]
      .map((r) => r.month)
      .sort((a, b) => a - b);
    expect(months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("every month has a non-empty title and brief", () => {
    for (const r of YEAR_ONE_CALENDAR_RIPPLES) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.brief.length).toBeGreaterThan(0);
    }
  });

  it("every month opens a unique flag", () => {
    const flags = YEAR_ONE_CALENDAR_RIPPLES.map((r) => r.opensFlag).filter(
      Boolean,
    );
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("month 10 emphasizes the Palimpsest game show", () => {
    const m10 = getYearOneCalendarRipple(10);
    expect(m10?.emphasizes).toContain("palimpsest");
  });

  it("month 11 emphasizes the Kael Fragments", () => {
    const m11 = getYearOneCalendarRipple(11);
    expect(m11?.emphasizes).toContain("kael_fragments");
  });

  it("listYearOneCalendarRipples returns all 12", () => {
    expect(listYearOneCalendarRipples().length).toBe(12);
  });

  it("getYearOneCalendarRipple returns undefined for invalid months", () => {
    expect(getYearOneCalendarRipple(0)).toBeUndefined();
    expect(getYearOneCalendarRipple(13)).toBeUndefined();
  });
});

describe("witnessingYearOne — Item 14 Milestone Chronicle entries", () => {
  it("has one entry per §14.1 milestone", () => {
    const milestoneIds = Object.keys(WITNESSING_MILESTONES);
    const chronicleIds = Object.keys(MILESTONE_CHRONICLE_ENTRIES);
    expect(chronicleIds.sort()).toEqual(milestoneIds.sort());
  });

  it("every chronicle entry has a non-empty body", () => {
    for (const entry of Object.values(MILESTONE_CHRONICLE_ENTRIES)) {
      expect(entry.body.length).toBeGreaterThan(40);
    }
  });

  it("the Lion's Last Broadcast entry names the 43 soldiers", () => {
    const entry = getMilestoneChronicleEntry("lions_last_broadcast");
    expect(entry.body).toContain("forty-three");
  });

  it("the Thaloria Echo entry names the faith it mourns", () => {
    const entry = getMilestoneChronicleEntry("thaloria_echo");
    expect(entry.body.toLowerCase()).toContain("faith");
  });

  it("the Two Witnesses Remember entry opens with the Antiquarian's voice", () => {
    const entry = getMilestoneChronicleEntry("two_witnesses_remember");
    expect(entry.body.toLowerCase()).toContain("elara");
    expect(entry.body.toLowerCase()).toContain("antiquarian");
  });

  it("listMilestoneChronicleEntries returns 9 entries", () => {
    expect(listMilestoneChronicleEntries().length).toBe(9);
  });
});
