// apps/shared/npcs/__tests__/banks.seer.revisions.test.ts
//
// Phase 6b.1 sub-chunk F verification — Seer revision-line cadence
// (5 paired prediction+revision pairs = 10 lines per §1.4 tell #1
// + §1.2 cadence rule #2 version-pivot canon).
//
// Per the_seer.md §1.4 tell #1 (the public revision): "the Seer
// admits a prior prediction was wrong, names the axis on which it
// was wrong (almost always 'which version'), and reports the
// consequence."
//
// Per §1.2 cadence rule #2: "the version pivot — when she revises a
// prediction, the revision is delivered as a sentence about which
// version, not as a sentence about the prediction itself ... never
// more than one revision per breath."
//
// Validates:
//   1. 5 prediction lines + 5 revision lines shipped (10 total)
//   2. All on transmission surface
//   3. Each prediction sets a canonical seer_prediction_<n>_made flag
//   4. Each revision unlocks on its prediction's flag (canonical
//      cross-time pair sequencing)
//   5. Each revision contains the canonical "I was wrong about which
//      version" version-pivot register per §1.2 rule #2
//   6. Revisions canonically fire AT or AFTER their predictions
//      (revision minAct ≥ prediction minAct)
//   7. §1.2 rule #2 discipline: each revision contains exactly ONE
//      version-pivot phrase (no stacking two revisions per breath)

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";

const PREDICTION_LINES = THE_SEER_BANK.filter((l) =>
  l.lineId.startsWith("seer.transmission.prediction."),
);

const REVISION_LINES = THE_SEER_BANK.filter(
  (l) =>
    l.lineId.startsWith("seer.transmission.revision.") &&
    // Exclude the existing canonical version_pivot line (Phase 3
    // pilot); this chunk's tests cover only the new sub-chunk F pairs.
    l.lineId !== "seer.transmission.revision.version_pivot",
);

interface Pair {
  predictionId: string;
  revisionId: string;
  predictionFlag: string;
}

const PAIRS: ReadonlyArray<Pair> = [
  {
    predictionId: "seer.transmission.prediction.cost_to_you",
    revisionId: "seer.transmission.revision.cost_landed_on_bench",
    predictionFlag: "seer_prediction_cost_to_you_made",
  },
  {
    predictionId: "seer.transmission.prediction.engineer_seven_days",
    revisionId: "seer.transmission.revision.engineer_eleven_days",
    predictionFlag: "seer_prediction_engineer_seven_days_made",
  },
  {
    predictionId: "seer.transmission.prediction.three_factions",
    revisionId: "seer.transmission.revision.third_was_category",
    predictionFlag: "seer_prediction_three_factions_made",
  },
  {
    predictionId: "seer.transmission.prediction.kindest_costs_architect",
    revisionId: "seer.transmission.revision.architect_did_not_pay",
    predictionFlag: "seer_prediction_kindest_costs_architect_made",
  },
  {
    predictionId: "seer.transmission.prediction.you_will_ask_first",
    revisionId: "seer.transmission.revision.i_told_you_first",
    predictionFlag: "seer_prediction_you_will_ask_first_made",
  },
];

describe("Seer revision-line cadence — shape", () => {
  it("ships 5 prediction lines (Phase 6b.1 sub-chunk F)", () => {
    expect(PREDICTION_LINES.length).toBe(5);
  });

  it("ships 5 NEW revision lines (sub-chunk F; existing version_pivot stays)", () => {
    expect(REVISION_LINES.length).toBe(5);
  });

  it("every prediction + revision line uses transmission surface", () => {
    for (const l of [...PREDICTION_LINES, ...REVISION_LINES]) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("every prediction + revision line is canonically once-per-playthrough", () => {
    for (const l of [...PREDICTION_LINES, ...REVISION_LINES]) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });

  it("lineIds are unique across both halves of the chunk", () => {
    const ids = [...PREDICTION_LINES, ...REVISION_LINES].map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Revision-pair flag wiring (canonical cross-time sequencing)", () => {
  it.each(PAIRS)(
    "$predictionId sets canonical $predictionFlag",
    ({ predictionId, predictionFlag }) => {
      const pred = THE_SEER_BANK.find((l) => l.lineId === predictionId);
      expect(pred).toBeDefined();
      expect(pred?.setsFlags).toContain(predictionFlag);
    },
  );

  it.each(PAIRS)(
    "$revisionId unlocks on $predictionFlag (canonical pair sequencing)",
    ({ revisionId, predictionFlag }) => {
      const rev = THE_SEER_BANK.find((l) => l.lineId === revisionId);
      expect(rev).toBeDefined();
      expect(rev?.unlockFlags, revisionId).toContain(predictionFlag);
    },
  );

  it.each(PAIRS)(
    "$revisionId fires AT or AFTER $predictionId (canonical chronology)",
    ({ predictionId, revisionId }) => {
      const pred = THE_SEER_BANK.find((l) => l.lineId === predictionId);
      const rev = THE_SEER_BANK.find((l) => l.lineId === revisionId);
      expect(rev?.minAct ?? 0, revisionId).toBeGreaterThanOrEqual(
        pred?.minAct ?? 0,
      );
    },
  );
});

describe("§1.4 tell #1 version-pivot canonical register", () => {
  it("every revision line contains the canonical 'I was wrong about which version' anchor", () => {
    // §1.4 tell #1: "the Seer admits a prior prediction was wrong,
    // names the axis on which it was wrong (almost always 'which
    // version')." The new revision lines must surface this anchor.
    for (const rev of REVISION_LINES) {
      expect(rev.text, rev.lineId).toMatch(
        /I was wrong about which version/i,
      );
    }
  });

  it("≥80% of revision lines carry the canonical 'I told you' opener (§1.4 tell #1)", () => {
    // The canonical revision cadence per §1.4 tell #1 is "I told you
    // X. I was wrong about which version of X." The "I told you"
    // anchor is canonical for most revision lines — bible-acceptable
    // exception is when the revision opens with a data-of-the-
    // correction observation (e.g., timing-revision lines that start
    // with the corrected datum). We require ≥4 of 5 carry the anchor.
    const withTold = REVISION_LINES.filter((rev) =>
      /\bI told you\b/i.test(rev.text),
    );
    const ratio = withTold.length / REVISION_LINES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("§1.2 rule #2: each revision contains exactly ONE version-pivot phrase (no stacking)", () => {
    // Canonical discipline: "never more than one revision per breath."
    // We assert each revision text contains the "I was wrong about
    // which version" phrase exactly once — no doubled revisions.
    for (const rev of REVISION_LINES) {
      const matches = rev.text.match(
        /I was wrong about which version/gi,
      );
      expect(matches?.length, rev.lineId).toBe(1);
    }
  });
});

describe("Revision-pair canonical anchor landings", () => {
  it("Pair 1 (cost-bearer): canonical 'cost landed on the bench, not on you'", () => {
    const rev = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.revision.cost_landed_on_bench",
    );
    expect(rev?.text).toMatch(/cost landed on the bench/i);
    expect(rev?.text).toMatch(/bench has paid before/i);
  });

  it("Pair 2 (timing): canonical 'Seven was the approximation; eleven was the duration'", () => {
    const rev = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.revision.engineer_eleven_days",
    );
    expect(rev?.text).toMatch(
      /Seven was the approximation; eleven was the duration/i,
    );
    expect(rev?.text).toMatch(/Engineer said the staff/i);
  });

  it("Pair 3 (scope): canonical 'category, not a faction' / Programmer's shelf cross-canon", () => {
    // Cross-canon with §4.6 + ask_seer_about_programmer + §1.4 tell
    // #4 (category sentence). The Programmer's shelf anchor must
    // land here.
    const rev = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.revision.third_was_category",
    );
    expect(rev?.text).toMatch(/a category, not a faction/i);
    expect(rev?.text).toMatch(/Programmer's shelf/i);
  });

  it("Pair 4 (kindness-direction): canonical 'asymmetry inverted' anchor", () => {
    // §1.4 tell #2 (asymmetric-kindness clause) layered onto §1.4
    // tell #1 (revision). Both canonical patterns combine here.
    const rev = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.revision.architect_did_not_pay",
    );
    expect(rev?.text).toMatch(/Architect did not pay. You did/i);
    expect(rev?.text).toMatch(/asymmetry inverted/i);
    expect(rev?.text).toMatch(/noting the inversion/i);
  });

  it("Pair 5 (arrival-order): canonical 'order inverted. The disclosure stands either way'", () => {
    const rev = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.revision.i_told_you_first",
    );
    expect(rev?.text).toMatch(/I told you first; you did not ask/i);
    expect(rev?.text).toMatch(/order inverted/i);
    expect(rev?.text).toMatch(/disclosure stands either way/i);
  });
});

describe("Revision-line cadence — bible canon protections", () => {
  const ALL_NEW = [...PREDICTION_LINES, ...REVISION_LINES];

  it("§1.5 voice rule: every line is prediction-bearing OR revision-bearing", () => {
    // Predictions trivially satisfy. Revisions satisfy via the
    // canonical "I was wrong about which version" pivot.
    const indicators = [
      /\bwill\b/i,
      /\bI was wrong\b/i,
      /\bI told you\b/i,
      /\bnot(ing|ed)\b/i,
      /\brevise/i,
      /\brevision/i,
      /\bversion/i,
      /\bprediction/i,
      /\bforesee/i,
      /\binverted/i,
    ];
    for (const l of ALL_NEW) {
      const matched = indicators.some((re) => re.test(l.text));
      expect(matched, `${l.lineId}: ${l.text.slice(0, 80)}`).toBe(true);
    }
  });

  it("§1.3 most-load-bearing absence: NO 'destiny'/'fate'/'destined'", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bdestin(y|ed)\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bfate(d)?\b/i);
    }
  });

  it("§1.2 cadence rule #3: NO colon-introduced revelation pattern", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bProphecy:/i);
      expect(l.text, l.lineId).not.toMatch(/\bWhat I see:/i);
    }
  });

  it("§2.5 sealing canon: NO live-presence framing in any revision", () => {
    // The Seer is canonically sealed. Even when she revises a
    // prediction, the canonical framing remains recording-as-revision,
    // not live-update.
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bI will visit\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI will arrive\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI am at\b/i);
    }
  });
});
