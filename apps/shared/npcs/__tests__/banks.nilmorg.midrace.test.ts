// apps/shared/npcs/__tests__/banks.nilmorg.midrace.test.ts
//
// Phase 6a.1 part-3 verification — Nilmorg mid-race triggers
// (first 3 events: lap-1, mid-pack, leader-shift; 6 lines each = 18).
//
// Validates the bible-derived block against canonical Race
// Commentary register constraints (per nilmorg.md §1.1 cadence +
// §1.4 tells):
//   1. 18 mid-race lines shipped (3 events × 6 variants each)
//   2. All on dmc surface
//   3. Each event gates on its dmc_event_<event> flag
//   4. Voice register: caps signature in ≥80% of lines
//   5. The aphorism canonical-scarcity rule preserved — exactly ONE
//      calm-aphorism intrusion across the 18 lines per §1.4 tell #4
//   6. The ironic-condolence "JUST KIDDING" tell appears at least once
//   7. The third-person self-narration tell appears in ≥40% of lines

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const MIDRACE_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.midrace."),
);

function linesForEvent(event: string) {
  return MIDRACE_LINES.filter((l) =>
    l.lineId.startsWith(`nilmorg.midrace.${event}.`),
  );
}

describe("Nilmorg mid-race triggers — shape", () => {
  it("ships 18 mid-race lines (3 events × 6 variants)", () => {
    expect(MIDRACE_LINES.length).toBe(18);
  });

  it("ships exactly 6 lines per event", () => {
    expect(linesForEvent("lap1").length).toBe(6);
    expect(linesForEvent("midpack").length).toBe(6);
    expect(linesForEvent("leadershift").length).toBe(6);
  });

  it("every mid-race line uses the dmc surface only", () => {
    for (const l of MIDRACE_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["dmc"]);
    }
  });

  it("lineIds are unique across the mid-race block", () => {
    const ids = MIDRACE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Nilmorg mid-race triggers — event gating", () => {
  it.each([
    ["lap1", "dmc_event_lap1"],
    ["midpack", "dmc_event_midpack"],
    ["leadershift", "dmc_event_leader_shift"],
  ])(
    "%s lines all gate on %s",
    (event, requiredFlag) => {
      const lines = linesForEvent(event);
      for (const l of lines) {
        expect(l.unlockFlags, l.lineId).toContain(requiredFlag);
      }
    },
  );
});

describe("Nilmorg mid-race — Race Commentary voice anchors", () => {
  it("≥80% of lines carry a caps-on-appetite-noun signature", () => {
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = MIDRACE_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / MIDRACE_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("the canonical 'JUST KIDDING' ironic-condolence tell appears at least once", () => {
    const matches = MIDRACE_LINES.filter((l) =>
      /JUST KIDDING/.test(l.text),
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("the third-person self-narration tell appears in ≥40% of lines", () => {
    // §1.4 tell #2: he names himself in the third person. Mid-race
    // density is high because the broadcast is performative.
    const matches = MIDRACE_LINES.filter((l) =>
      /\bNilmorg\b/.test(l.text),
    );
    const ratio = matches.length / MIDRACE_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.4);
  });
});

describe("Nilmorg mid-race — aphorism canonical-scarcity rule (§1.4 tell #4)", () => {
  it("exactly ONE aphorism-intrusion line ships across the 18-line block", () => {
    // The bible: "Writers should write exactly one [aphorism] per beat
    // — two in sequence flatten the effect." For an 18-line chunk
    // spanning three event-categories, ONE aphorism preserves the rule.
    const aphorisms = MIDRACE_LINES.filter((l) =>
      l.lineId.endsWith(".aphorism_intrusion"),
    );
    expect(aphorisms.length).toBe(1);
  });

  it("the aphorism line has tightly-scoped maxPlays (≤2)", () => {
    const aphorism = MIDRACE_LINES.find((l) =>
      l.lineId.endsWith(".aphorism_intrusion"),
    );
    expect(aphorism?.maxPlays ?? 999).toBeLessThanOrEqual(2);
  });

  it("the aphorism line is canonically clipped (≤8 words)", () => {
    // §1.1 Lore/Ceremony register: three-to-six words per sentence;
    // we allow up to 8 to accommodate the canonical "Speed in all
    // things. Even the file." (8 words across two sentences).
    const aphorism = MIDRACE_LINES.find((l) =>
      l.lineId.endsWith(".aphorism_intrusion"),
    );
    const wordCount = (aphorism?.text ?? "").trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(8);
  });
});
