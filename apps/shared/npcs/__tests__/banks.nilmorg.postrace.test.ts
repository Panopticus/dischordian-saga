// apps/shared/npcs/__tests__/banks.nilmorg.postrace.test.ts
//
// Phase 6a.1 part-5 verification — Nilmorg post-race outcomes
// (winner, runner-up, dnf, controversy; 4 lines each = 16 total).
//
// Validates the bible-derived block against canonical Race
// Commentary register constraints + the three canonical bible-quote
// anchors that MUST be preserved across this chunk:
//   1. §1.1 register-pivot tell (canonical "VICTORY/betting-pool")
//   2. §1.1 single-word-repetition tell (canonical "DEAD! DEAD!")
//   3. §1.4 tell #2 third-person reverence (canonical
//      "grudgingly applauds")

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const POSTRACE_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.postrace."),
);

function linesForOutcome(outcome: string) {
  return POSTRACE_LINES.filter((l) =>
    l.lineId.startsWith(`nilmorg.postrace.${outcome}.`),
  );
}

describe("Nilmorg post-race outcomes — shape", () => {
  it("ships 16 post-race lines (4 outcomes × 4 variants)", () => {
    expect(POSTRACE_LINES.length).toBe(16);
  });

  it("ships exactly 4 lines per outcome", () => {
    expect(linesForOutcome("winner").length).toBe(4);
    expect(linesForOutcome("runner_up").length).toBe(4);
    expect(linesForOutcome("dnf").length).toBe(4);
    expect(linesForOutcome("controversy").length).toBe(4);
  });

  it("every post-race line uses the dmc surface only", () => {
    for (const l of POSTRACE_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["dmc"]);
    }
  });

  it("lineIds are unique across the post-race block", () => {
    const ids = POSTRACE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Nilmorg post-race — outcome gating", () => {
  it.each([
    ["winner", "dmc_outcome_winner"],
    ["runner_up", "dmc_outcome_runner_up"],
    ["dnf", "dmc_outcome_dnf"],
    ["controversy", "dmc_outcome_controversy"],
  ])(
    "%s lines all gate on %s",
    (outcome, requiredFlag) => {
      const lines = linesForOutcome(outcome);
      for (const l of lines) {
        expect(l.unlockFlags, l.lineId).toContain(requiredFlag);
      }
    },
  );
});

describe("Nilmorg post-race — Race Commentary voice anchors", () => {
  it("≥80% of lines carry a caps-on-appetite-noun signature", () => {
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = POSTRACE_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / POSTRACE_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("the third-person self-narration tell appears in ≥40% of lines", () => {
    const matches = POSTRACE_LINES.filter((l) =>
      /\bNilmorg\b/.test(l.text),
    );
    const ratio = matches.length / POSTRACE_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.4);
  });

  it("zero new aphorism-intrusion lines (canonical scarcity preserved)", () => {
    // The canonical one-per-beat aphorism shipped with mid-race; the
    // post-race block must not add another per §1.4 tell #4.
    const aphorisms = POSTRACE_LINES.filter((l) =>
      l.lineId.endsWith(".aphorism_intrusion"),
    );
    expect(aphorisms.length).toBe(0);
  });
});

describe("Nilmorg post-race — canonical bible quotes preserved", () => {
  it("winner outcome ships the canonical 'VICTORY/betting-pool' register-pivot tell (§1.1)", () => {
    // Per nilmorg-lines.json:137 voice anchor — the canonical
    // rhythmic fingerprint that starts in Race Commentary, lands on
    // a corporate noun ("betting pool"), snaps back to barker. THE
    // single most identifying line for the character; writers
    // preserving it signals load-bearing-canon respect.
    const winner = linesForOutcome("winner");
    const text = winner.map((l) => l.text).join(" ");
    expect(text).toMatch(/VICTORY/);
    expect(text).toMatch(/betting pool/i);
  });

  it("winner outcome ships the canonical 'grudgingly applauds' 3p reverence (§1.4 tell #2)", () => {
    // Per nilmorg-lines.json:144 voice anchor — the §1.4 tell #2
    // third-person self-narration deployed for an emotion he would
    // otherwise hide (here, respect for the winner).
    const winner = linesForOutcome("winner");
    const text = winner.map((l) => l.text).join(" ");
    expect(text).toMatch(/grudgingly applauds/i);
  });

  it("DNF outcome ships the canonical 'DEAD! DEAD!' single-word-repetition tell (§1.1)", () => {
    // Per nilmorg-lines.json:81 voice anchor — peak-intensity
    // single-word repetition. THE canonical DNF line; preserving
    // it across the post-race block is non-negotiable per the
    // bible's writers' guide review checklist.
    const dnf = linesForOutcome("dnf");
    const text = dnf.map((l) => l.text).join(" ");
    expect(text).toMatch(/DEAD! DEAD/);
    expect(text).toMatch(/clone is DEAD/);
  });

  it("controversy outcome preserves the canonical 'NEVER WRONG' track-deciding canon (§1.5)", () => {
    // §1.5 silence-shape: he will not lie about the DMC. The track
    // adjudicates; the track is canonically never wrong. The
    // controversy block's canonical denial register surfaces this.
    const controversy = linesForOutcome("controversy");
    const text = controversy.map((l) => l.text).join(" ");
    expect(text).toMatch(/NEVER WRONG/i);
  });

  it("runner-up outcome preserves the canonical 'no Severance Prize' canon (§2.4)", () => {
    // §2.4: the Severance Prize is paid only to season winners.
    // Runner-up gets nothing; the runner-up block must not soften
    // this — Nilmorg keeps his agreements, which means the
    // agreement says winner-only.
    const runnerUp = linesForOutcome("runner_up");
    const text = runnerUp.map((l) => l.text).join(" ");
    expect(text).toMatch(/no severance/i);
  });
});
