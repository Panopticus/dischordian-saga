// apps/shared/npcs/__tests__/banks.nilmorg.midrace.test.ts
//
// Phase 6a.1 parts 3 + 4 verification — Nilmorg mid-race triggers
// (all 6 events: lap-1, mid-pack, leader-shift, crash, photo-finish,
// dead-tied; 6 lines each = 36 total).
//
// Validates the bible-derived block against canonical Race
// Commentary register constraints (per nilmorg.md §1.1 cadence +
// §1.4 tells):
//   1. 36 mid-race lines shipped (6 events × 6 variants each)
//   2. All on dmc surface
//   3. Each event gates on its dmc_event_<event> flag
//   4. Voice register: caps signature in ≥80% of lines
//   5. The aphorism canonical-scarcity rule preserved — exactly ONE
//      calm-aphorism intrusion across the 36 lines per §1.4 tell #4
//      ("two in sequence flatten the effect" — one across the bank
//      keeps the rule intact)
//   6. The ironic-condolence "JUST KIDDING" tell appears at least
//      twice (once each in the lap-1 and crash event banks)
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
  it("ships 36 mid-race lines (6 events × 6 variants)", () => {
    expect(MIDRACE_LINES.length).toBe(36);
  });

  it("ships exactly 6 lines per event", () => {
    expect(linesForEvent("lap1").length).toBe(6);
    expect(linesForEvent("midpack").length).toBe(6);
    expect(linesForEvent("leadershift").length).toBe(6);
    expect(linesForEvent("crash").length).toBe(6);
    expect(linesForEvent("photofinish").length).toBe(6);
    expect(linesForEvent("deadtied").length).toBe(6);
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
    ["crash", "dmc_event_crash"],
    ["photofinish", "dmc_event_photo_finish"],
    ["deadtied", "dmc_event_dead_tied"],
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

  it("the canonical 'JUST KIDDING' ironic-condolence tell appears at least twice", () => {
    // §1.4 tell #5 — once in the lap-1 early-out beat, once in the
    // crash beat. The mid-race chunk is where Nilmorg's gesture-
    // then-break density is highest.
    const matches = MIDRACE_LINES.filter((l) =>
      /JUST KIDDING/.test(l.text),
    );
    expect(matches.length).toBeGreaterThanOrEqual(2);
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
  it("exactly ONE aphorism-intrusion line ships across the 36-line block", () => {
    // The bible: "Writers should write exactly one [aphorism] per beat
    // — two in sequence flatten the effect." Across the full 36-line
    // mid-race bank one aphorism keeps the rule intact: it lands on
    // leader-shift (the calmest event), and crash / photo-finish /
    // dead-tied stay in pure Race Commentary register.
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

describe("Nilmorg mid-race events 4-6 — canonical bible quotes preserved", () => {
  it("crash event ships the canonical 'beautiful crunch' aestheticization (§1.4 tell #3)", () => {
    // Per nilmorg-lines.json:74 voice anchor — the canonical
    // aestheticization-of-destruction line. Writers preserving this
    // anchor signals respect for the bible's load-bearing tells.
    const crash = linesForEvent("crash");
    const text = crash.map((l) => l.text).join(" ");
    expect(text).toMatch(/beautiful crunch/i);
  });

  it("crash event ships the canonical 'track is PLEASED' four-beat crescendo", () => {
    // Per nilmorg-lines.json:186 voice anchor — the canonical
    // four-beat track-as-subject crescendo: ANOTHER bone added to
    // the circuit! The track grows! The track HUNGERS! The track
    // is PLEASED!
    const crash = linesForEvent("crash");
    const text = crash.map((l) => l.text).join(" ");
    expect(text).toMatch(/track GROWS/i);
    expect(text).toMatch(/track HUNGERS/i);
    expect(text).toMatch(/track is PLEASED/i);
  });

  it("photo-finish event preserves the canonical 'NEVER WAITS' tension (§1.5)", () => {
    // Nilmorg's silence-shape canon: he never escalates, never pleads,
    // is patient eternally. A photo-finish is the rare instance
    // where his patience becomes audible — the canonical "NILMORG
    // NEVER WAITS — but tonight, he does!"
    const photofinish = linesForEvent("photofinish");
    const text = photofinish.map((l) => l.text).join(" ");
    expect(text).toMatch(/NEVER WAITS/i);
  });

  it("dead-tied event preserves the canonical refusal-to-clarify register (§1.5)", () => {
    // §1.5 silence shape: he refuses to explain. A tied race is the
    // only race-event canonically without a clear winner; Nilmorg's
    // canonical response is to refuse the audience's expected
    // clarity rather than fabricate one.
    const deadtied = linesForEvent("deadtied");
    const text = deadtied.map((l) => l.text).join(" ");
    expect(text).toMatch(/refuses to clarify/i);
  });
});
