import { describe, it, expect } from "vitest";
import {
  BEAT_CHRONICLE_ENTRIES,
  YEAR_ONE_CALENDAR_RIPPLES,
  MILESTONE_CHRONICLE_ENTRIES,
  getActiveBeatChronicleEntries,
  getYearOneCalendarRipple,
  getMilestoneChronicleEntry,
  listBeatChronicleEntries,
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

describe("witnessingYearOne — Beat Chronicle entries (non-milestone)", () => {
  it("has at least 7 beat entries covering the key act transitions", () => {
    expect(BEAT_CHRONICLE_ENTRIES.length).toBeGreaterThanOrEqual(7);
  });

  it("every beat entry has a unique flag and non-empty body", () => {
    const flags = BEAT_CHRONICLE_ENTRIES.map((e) => e.flag);
    expect(new Set(flags).size).toBe(flags.length);
    for (const e of BEAT_CHRONICLE_ENTRIES) {
      expect(e.body.length).toBeGreaterThan(40);
      expect(e.title.length).toBeGreaterThan(0);
    }
  });

  it("includes prelude_complete and act_1_complete entries", () => {
    const ids = BEAT_CHRONICLE_ENTRIES.map((e) => e.flag);
    expect(ids).toContain("prelude_complete");
    expect(ids).toContain("act_1_complete");
    expect(ids).toContain("act_1_cycle_a_complete");
    expect(ids).toContain("act_1_cycle_b_complete");
  });

  it("vortex_core_cleared beat entry mentions the pause", () => {
    const entry = BEAT_CHRONICLE_ENTRIES.find(
      (e) => e.flag === "vortex_core_cleared",
    );
    expect(entry?.body.toLowerCase()).toContain("pause");
  });

  it("getActiveBeatChronicleEntries returns empty on fresh flags", () => {
    expect(getActiveBeatChronicleEntries({}).length).toBe(0);
  });

  it("getActiveBeatChronicleEntries surfaces only entries whose flag is set", () => {
    const active = getActiveBeatChronicleEntries({
      prelude_complete: true,
      act_1_cycle_a_complete: true,
    });
    expect(active.length).toBe(2);
    expect(active.map((e) => e.flag).sort()).toEqual([
      "act_1_cycle_a_complete",
      "prelude_complete",
    ]);
  });

  it("listBeatChronicleEntries returns the full registry", () => {
    expect(listBeatChronicleEntries().length).toBe(
      BEAT_CHRONICLE_ENTRIES.length,
    );
  });
});
