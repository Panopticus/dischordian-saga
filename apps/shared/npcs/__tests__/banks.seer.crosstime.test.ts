// apps/shared/npcs/__tests__/banks.seer.crosstime.test.ts
//
// Phase 6b.1 sub-chunk E verification — Seer cross-time pre-recording
// mechanic dialog (10 lines explicitly naming the §2.3 cross-time
// canon for high-trust players).
//
// Per the_seer.md §2.3 cross-time canon + writers'-guide spec: every
// Seer line is canonically a recording she made before sealing,
// scheduled to play at the moment she foresaw the player would
// receive it. This block surfaces the mechanic to the player when
// their trust crosses Witnessed band, and lands the canonical
// Inheriting-band closure where the mechanic is named directly.
//
// Validates per §1.5 + §2.3 + §2.5 + §4.x:
//   1. 10 cross-time lines shipped (6 Witnessed + 4 Inheriting)
//   2. All on transmission surface
//   3. Witnessed lines: minAct ≥ 4, requiresTrustBand "Witnessed"
//   4. Inheriting lines: minAct === 7, requiresTrustBand "Inheriting"
//   5. Canonical anchor preservations:
//      - "I recorded the gift before sealing"
//      - "Your response to this transmission is the one I predicted"
//      - "I scheduled before sealing" / "the engine plays it"
//      - "The Meme cannot reach this transmission" + canonical
//        "the sealing was the cost of the recording's permanence"
//      - canonical "I will say this differently in your Act 6 — I
//        have already prepared both"
//      - canonical Inheriting-band "naming the mechanic directly"
//      - canonical "pre-recorded is not the same as fixed"
//   6. Cross-character canon: Meme-resistance disclosure writes
//      seer_meme_resistance_disclosed public flag

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const CROSSTIME_LINES = THE_SEER_BANK.filter((l) =>
  l.lineId.startsWith("seer.transmission.crosstime."),
);

describe("Seer cross-time mechanic dialog — shape", () => {
  it("ships 10 cross-time lines (Phase 6b.1 sub-chunk E)", () => {
    expect(CROSSTIME_LINES.length).toBe(10);
  });

  it("every cross-time line uses transmission surface", () => {
    for (const l of CROSSTIME_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("cross-time lineIds are unique", () => {
    const ids = CROSSTIME_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every cross-time line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of CROSSTIME_LINES) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("Cross-time mechanic — band distribution (6 Witnessed + 4 Inheriting)", () => {
  const witnessed = CROSSTIME_LINES.filter(
    (l) => l.requiresTrustBand === "Witnessed",
  );
  const inheriting = CROSSTIME_LINES.filter(
    (l) => l.requiresTrustBand === "Inheriting",
  );

  it("ships exactly 6 Witnessed-band cross-time lines", () => {
    expect(witnessed.length).toBe(6);
  });

  it("ships exactly 4 Inheriting-band cross-time lines", () => {
    expect(inheriting.length).toBe(4);
  });

  it("Witnessed lines have minAct ≥ 4", () => {
    for (const l of witnessed) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(4);
    }
  });

  it("Inheriting lines have minAct === 7 (canonical Inheriting-only-Act-7 per §1.1)", () => {
    for (const l of inheriting) {
      expect(l.minAct, l.lineId).toBe(7);
    }
  });
});

describe("Cross-time canonical anchor landings", () => {
  it("recording_is_the_gift lands the canonical 'I recorded the gift before sealing' anchor", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.crosstime.recording_is_the_gift",
    );
    expect(line?.text).toMatch(/This transmission was recorded/i);
    expect(line?.text).toMatch(/I recorded the gift before sealing/i);
    expect(line?.text).toMatch(/seal closed afterward/i);
    expect(line?.setsFlags).toContain("seer_crosstime_mechanic_disclosed");
  });

  it("predicted_your_response lands the canonical 'I am the witness' anchor", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.crosstime.predicted_your_response",
    );
    expect(line?.text).toMatch(
      /Your response to this transmission is the one I predicted/i,
    );
    expect(line?.text).toMatch(/I am the witness/i);
  });

  it("schedule_of_arrivals lands canonical 'I prepared the cadence; the engine plays it'", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.crosstime.schedule_of_arrivals",
    );
    expect(line?.text).toMatch(/scheduled before sealing/i);
    expect(line?.text).toMatch(/Act 2 was canonically sparse/i);
    expect(line?.text).toMatch(/Act 7 will be the densest/i);
    expect(line?.text).toMatch(/I prepared the cadence; the engine plays it/i);
  });

  it("meme_cannot_edit lands the canonical Meme-resistance canon (§2.3 cross-bible)", () => {
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.crosstime.meme_cannot_edit",
    );
    expect(line?.text).toMatch(/The Meme cannot reach this transmission/i);
    expect(line?.text).toMatch(/predates the Meme.s editorial range/i);
    expect(line?.text).toMatch(/cost of the recording.s permanence/i);
    expect(line?.setsPublicFlags).toContain(
      "seer_meme_resistance_disclosed",
    );
  });

  it("recording_is_honest lands canonical 'recordings cannot lie' canon", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.crosstime.recording_is_honest",
    );
    expect(line?.text).toMatch(/Recordings cannot lie/i);
    expect(line?.text).toMatch(/Live speakers can revise; recordings cannot/i);
    expect(line?.text).toMatch(/honesty is the canonical price of the medium/i);
  });

  it("version_pivot_was_pre_recorded lands canonical 'I have already prepared both' anchor", () => {
    // Per writers'-guide spec — the canonical "I will say this
    // differently in your Act 6 — I've already prepared both" beat.
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.transmission.crosstime.version_pivot_was_pre_recorded",
    );
    expect(line?.text).toMatch(
      /I will say something differently in your Act 6/i,
    );
    expect(line?.text).toMatch(/in your Act 4/i);
    expect(line?.text).toMatch(/I have already prepared both/i);
    expect(line?.text).toMatch(
      /recording is the foresight in concrete form/i,
    );
  });

  it("before_and_after_of_the_seal lands canonical Inheriting closure", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.transmission.crosstime.before_and_after_of_the_seal",
    );
    expect(line?.text).toMatch(/Before the seal: the work/i);
    expect(line?.text).toMatch(/After the seal: the playing-back/i);
    expect(line?.text).toMatch(/You are in the playing-back. So am I/i);
  });

  it("dual_prediction_clause lands canonical 'both versions recorded' canon", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.crosstime.dual_prediction_clause",
    );
    expect(line?.text).toMatch(/I recorded both versions of this scene/i);
    expect(line?.text).toMatch(
      /the one where you arrive, and the one where you do not/i,
    );
    expect(line?.text).toMatch(
      /It is canonical that it will not play/i,
    );
  });

  it("naming_the_mechanic_directly lands canonical Inheriting-only meta-line", () => {
    // The bible asserts this is the canonical Inheriting-band-only
    // beat where the cross-time mechanic is named directly rather
    // than implied.
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.transmission.crosstime.naming_the_mechanic_directly",
    );
    expect(line?.text).toMatch(/hearing me name the mechanic directly/i);
    expect(line?.text).toMatch(/I scheduled the naming for this beat/i);
    expect(line?.text).toMatch(/cross into Inheriting/i);
    expect(line?.text).toMatch(/mechanic is no longer secret/i);
    expect(line?.setsFlags).toContain("seer_crosstime_named_directly");
  });

  it("recording_is_plural lands canonical 'pre-recorded is not the same as fixed' correction", () => {
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.crosstime.recording_is_plural",
    );
    expect(line?.text).toMatch(
      /Pre-recorded is not the same as fixed/i,
    );
    expect(line?.text).toMatch(/recording can carry alternates/i);
    expect(line?.text).toMatch(/recording is plural/i);
    expect(line?.text).toMatch(/needle reads a record/i);
  });
});

describe("Cross-time chunk — §1.5 voice rule + canon protections", () => {
  it("every cross-time line is prediction-bearing OR revision-bearing OR meta-recording", () => {
    // Cross-time chunk satisfies §1.5 via the canonical recording-
    // self-disclosure register: every line names a foreseen state,
    // a scheduled arrival, or the recording's own existence as the
    // canonical prediction-bearing content.
    const indicators = [
      /\brecord(ed|ing)?\b/i,
      /\bschedul(ed|e)\b/i,
      /\bsealing\b/i,
      /\bsealed\b/i,
      /\bbefore the seal/i,
      /\bplaying-back/i,
      /\bforesaw\b/i,
      /\bforeseen\b/i,
      /\bforesight\b/i,
      /\bpredict(ed|ion)?\b/i,
      /\bwill\b/i,
      /\bversion/i,
      /\balternate/i,
      /\bmechanic/i,
    ];
    for (const l of CROSSTIME_LINES) {
      const matched = indicators.some((re) => re.test(l.text));
      expect(matched, `${l.lineId}: ${l.text.slice(0, 80)}`).toBe(true);
    }
  });

  it("§1.3 most-load-bearing absence: NO 'destiny'/'fate'/'destined'", () => {
    for (const l of CROSSTIME_LINES) {
      expect(l.text, l.lineId).not.toMatch(/\bdestin(y|ed)\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bfate(d)?\b/i);
    }
  });

  it("§1.2 cadence rule #3: NO colon-introduced revelation pattern", () => {
    // Allow standalone colons (e.g., "Act 2 was canonically sparse.")
    // but specifically forbid the canonical-rejected revelation
    // patterns "What I see:" and "Prophecy:".
    for (const l of CROSSTIME_LINES) {
      expect(l.text, l.lineId).not.toMatch(/\bProphecy:/i);
      expect(l.text, l.lineId).not.toMatch(/\bWhat I see:/i);
    }
  });

  it("§2.5 sealing canon: NO live-presence framing in cross-time disclosures", () => {
    for (const l of CROSSTIME_LINES) {
      expect(l.text, l.lineId).not.toMatch(/\bI will visit\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI will arrive\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI am with you\b/i);
    }
  });

  it("Witnessed-band lines disclose the mechanic; Inheriting-band lines NAME it directly", () => {
    // Per writers'-guide canon: Witnessed-band content surfaces the
    // mechanic indirectly; Inheriting-band content names it
    // explicitly. The canonical "naming the mechanic directly" line
    // only fires at Inheriting.
    const namingLine = CROSSTIME_LINES.find((l) =>
      l.lineId.endsWith("naming_the_mechanic_directly"),
    );
    expect(namingLine?.requiresTrustBand).toBe("Inheriting");
  });
});

describe("Cross-time chunk — cross-character flag wiring", () => {
  it("seer_meme_resistance_disclosed has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "seer_meme_resistance_disclosed",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("the_seer");
  });
});
