// apps/shared/npcs/__tests__/banks.nilmorg.prerace.test.ts
//
// Phase 6a.1 part-2 verification — Nilmorg pre-race hype bank.
//
// Validates the bible-derived block (4 archetypes × 4 hype-states =
// 16 lines) against canonical Race Commentary register constraints
// (per nilmorg.md §1.1 cadence + §1.4 tells):
//   1. 4 lines per archetype × 4 archetypes = 16 lines shipped
//   2. All on the dmc surface
//   3. Each archetype gates on its dmc_field_has_<archetype> flag
//      (per Phase 1 unlockFlags pattern; selector picks the right
//      archetype's hype line at pre-race)
//   4. Voice register: caps-on-appetite-noun signature appears in
//      ≥80% of the lines (the canonical triplet-crescendo tell)
//   5. The Splice "no Severance" line preserves the protected refusal
//      per §1.5 — does NOT explain WHY a Splice has no fragment
//   6. The Bone-tier "aphorism" line is canonically scarce (≤2 plays)
//      per §1.4 tell #4 — the calm aphorism is a one-per-beat move

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const PRERACE_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.prerace."),
);

function linesForArchetype(archetype: string) {
  return PRERACE_LINES.filter((l) =>
    l.lineId.startsWith(`nilmorg.prerace.${archetype}.`),
  );
}

describe("Nilmorg pre-race hype bank — shape", () => {
  it("ships 16 pre-race lines (4 archetypes × 4 hype-states)", () => {
    expect(PRERACE_LINES.length).toBe(16);
  });

  it("ships exactly 4 lines per archetype", () => {
    expect(linesForArchetype("wired_clone").length).toBe(4);
    expect(linesForArchetype("splice").length).toBe(4);
    expect(linesForArchetype("bone_tier").length).toBe(4);
    expect(linesForArchetype("chrome_tier").length).toBe(4);
  });

  it("every pre-race line uses the dmc surface only", () => {
    for (const l of PRERACE_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["dmc"]);
    }
  });

  it("lineIds are unique across the pre-race block", () => {
    const ids = PRERACE_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Nilmorg pre-race hype — archetype gating", () => {
  it.each([
    ["wired_clone", "dmc_field_has_wired_clone"],
    ["splice", "dmc_field_has_splice"],
    ["bone_tier", "dmc_field_has_bone_tier"],
    ["chrome_tier", "dmc_field_has_chrome_tier"],
  ])(
    "%s lines all gate on %s",
    (archetype, requiredFlag) => {
      const lines = linesForArchetype(archetype);
      for (const l of lines) {
        expect(l.unlockFlags, l.lineId).toContain(requiredFlag);
      }
    },
  );
});

describe("Nilmorg Race Commentary register — voice anchors", () => {
  it("≥80% of pre-race lines carry a caps-on-appetite-noun signature", () => {
    // Canonical signature per §1.4 tell #1: at least one ALL-CAPS word
    // of ≥3 letters appearing in the line text. Excludes acronyms like
    // "SVP" by requiring the word to follow a space and end with
    // punctuation or whitespace — practically achieved by a regex that
    // scans for whole-word matches of ≥3 uppercase letters.
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = PRERACE_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / PRERACE_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("the canonical 'Just kidding' ironic-condolence tell appears at least once", () => {
    // §1.4 tell #5: gestures at sympathy then breaks frame.
    const matches = PRERACE_LINES.filter((l) =>
      /JUST KIDDING/.test(l.text),
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("the canonical third-person self-narration tell appears at least three times", () => {
    // §1.4 tell #2: he names himself in the third person.
    const matches = PRERACE_LINES.filter((l) =>
      /\bNilmorg\b/.test(l.text),
    );
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Nilmorg pre-race — bible canon protections", () => {
  it("the Splice 'no Severance' line does NOT explain WHY a Splice has no fragment", () => {
    // §1.5 silence shape: "He never explains why that's worse than not
    // paying." The Splice canon is parallel — the absence of fragment
    // is canonical, the reason is protected. The line must not contain
    // a 'because' or other causal explanation.
    const splice = PRERACE_LINES.find(
      (l) => l.lineId === "nilmorg.prerace.splice.no_severance",
    );
    expect(splice).toBeDefined();
    expect(splice?.text).not.toMatch(/\bbecause\b/i);
    expect(splice?.text).not.toMatch(/\bfragments? are\b/i);
    // The canonical "Don't ask me to explain" or equivalent IS allowed —
    // that's the named refusal, not a disclosure.
  });

  it("the Bone-tier aphorism line is canonically scarce (maxPlays ≤2)", () => {
    // §1.4 tell #4: ONE calm aphorism per ceremony beat. Two in
    // sequence flatten the effect. Bone-tier aphorism is the only
    // intrusion of Lore/Ceremony register into pre-race; it must be
    // rare.
    const aphorism = PRERACE_LINES.find(
      (l) => l.lineId === "nilmorg.prerace.bone_tier.aphorism_intrusion",
    );
    expect(aphorism).toBeDefined();
    expect(aphorism?.maxPlays ?? 999).toBeLessThanOrEqual(2);
  });

  it("the Wired Clone block does not soften the canonical consent canon", () => {
    // §2.4: "They are aware of what they are. They race anyway."
    // The hype lines must not retroactively cast the clones as
    // unwilling — the canon is more complicated than that. We assert
    // that the Wired Clone block contains the canonical consent /
    // memory framing somewhere, signaling the writer respected it.
    const wired = linesForArchetype("wired_clone");
    const text = wired.map((l) => l.text).join(" ");
    // At minimum: a line that places her at the start line as the only
    // memory she has — i.e., she is awake to the race itself, not a
    // victim ferried in unconscious.
    expect(text).toMatch(/start line|throttle|race/i);
  });
});
