// apps/shared/npcs/__tests__/banks.seer.acts_4_5.test.ts
//
// Phase 6b.1 sub-chunk C verification — Seer Acts 4-5 register banks.
// Adds 5 lines covering the canonical Acts 4-5 trust-arc gaps from
// `moralityTrustActVariants.ts` per the_seer.md §2.4:
//
//   Act 4:
//     :1813-1820 → I-will-be-on-Thaloria coordinate-promise
//     :3158-3164 → redaction-table-shape companion to column_question
//
//   Act 5:
//     :1998-2005 → prophecy-overhead-drops narrator-frame
//     :2415-2422 → tactical-no-overhead first-numeric beat
//     :630-636   → confidant-precursor meta-line
//
// Validates per §2.3 cross-time canon + §2.5 sealing canon:
//   1. 5 new Acts 4-5 lines shipped (2 Act 4 + 3 Act 5)
//   2. All on transmission surface
//   3. Witnessed-band gating (Act 4-5 register canon)
//   4. Canonical anchor preservation:
//      - "I will be on Thaloria when you need me" coordinate-promise
//      - "showing you the table's shape so you can trust the output"
//      - "From the Seer, direct prose is the most flattering register"
//      - "first time, trusting you to run the math yourself"
//      - "She has already seen the conversation you are about to have"
//   5. §2.5 sealing canon protected: confidant-precursor reframed as
//      "present in recording, not in person" (no in-person framing)

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";

const ACT_4_NEW_IDS = [
  "seer.transmission.act4.thaloria_coordinate_promise",
  "seer.transmission.act4.redaction_table_shape",
];

const ACT_5_NEW_IDS = [
  "seer.transmission.act5.prophecy_overhead_drops_narrator",
  "seer.transmission.act5.tactical_no_overhead",
  "seer.transmission.act5.confidant_precursor",
];

const ALL_NEW_IDS = [...ACT_4_NEW_IDS, ...ACT_5_NEW_IDS];
const ALL_NEW = THE_SEER_BANK.filter((l) =>
  ALL_NEW_IDS.includes(l.lineId),
);

describe("Seer Acts 4-5 deepening — shape", () => {
  it("ships 5 new Acts 4-5 lines (2 Act 4 + 3 Act 5)", () => {
    expect(ALL_NEW.length).toBe(5);
  });

  it("Act 4 lines have minAct === 4", () => {
    for (const id of ACT_4_NEW_IDS) {
      const line = THE_SEER_BANK.find((l) => l.lineId === id);
      expect(line?.minAct, id).toBe(4);
    }
  });

  it("Act 5 lines have minAct === 5", () => {
    for (const id of ACT_5_NEW_IDS) {
      const line = THE_SEER_BANK.find((l) => l.lineId === id);
      expect(line?.minAct, id).toBe(5);
    }
  });

  it("every new line uses transmission surface", () => {
    for (const l of ALL_NEW) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("every new line gates on Witnessed trust band", () => {
    for (const l of ALL_NEW) {
      expect(l.requiresTrustBand, l.lineId).toBe("Witnessed");
    }
  });

  it("every new line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of ALL_NEW) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("Act 4 canonical anchor landings", () => {
  it("thaloria_coordinate_promise lands the canonical 'I will be on Thaloria when you need me'", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act4.thaloria_coordinate_promise",
    );
    expect(line?.text).toMatch(/I will be on Thaloria when you need me/i);
    expect(line?.text).toMatch(/coordinate/i);
    expect(line?.text).toMatch(/the door, the cupboard, the staff/i);
    expect(line?.setsFlags).toContain(
      "seer_thaloria_coordinate_promise_received",
    );
  });

  it("thaloria_coordinate_promise canonically frames as place-promise NOT person-promise (§2.5)", () => {
    // §2.5 sealing canon: she is canonically NOT physically present
    // when the player arrives at the coordinates. The line must
    // surface this — "promise is to the place, not to the presence."
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act4.thaloria_coordinate_promise",
    );
    expect(line?.text).toMatch(/promise is to the place, not to the presence/i);
  });

  it("redaction_table_shape lands the canonical 'showing you the table's shape' anchor", () => {
    // Per :3158-3164 + §1.4 tell #5 probability-table-as-question
    // canon. The canonical trust-gesture: she sends ALL columns
    // unredacted and names the sending as the gesture.
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act4.redaction_table_shape",
    );
    expect(line?.text).toMatch(/showing you the table.s shape/i);
    expect(line?.text).toMatch(/trust the output/i);
    expect(line?.text).toMatch(/shape is the trust/i);
  });

  it("redaction_table_shape canonically gates on column_question being answered", () => {
    // The redaction-table-shape is a follow-up to column_question;
    // the gate ensures it fires AFTER the question, not before.
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act4.redaction_table_shape",
    );
    expect(line?.unlockFlags).toContain("seer_column_question_answered");
  });
});

describe("Act 5 canonical anchor landings", () => {
  it("prophecy_overhead_drops_narrator lands the canonical 'direct prose' anchor (§1.1)", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act5.prophecy_overhead_drops_narrator",
    );
    expect(line?.text).toMatch(/no caveats, no oblique frame/i);
    expect(line?.text).toMatch(/Direct prose/);
    expect(line?.text).toMatch(/most flattering register she has/i);
    expect(line?.text).toMatch(/trusts you to read her plainly/i);
  });

  it("tactical_no_overhead lands the canonical 'first time, trusting you to run the math' anchor", () => {
    // Per :2415-2422 canon: the canonical "first time" clause is
    // bible-load-bearing — she pre-recorded the first numeric-no-
    // overhead transmission to fire at this beat.
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act5.tactical_no_overhead",
    );
    expect(line?.text).toMatch(/clean, numeric, no oblique frame/i);
    expect(line?.text).toMatch(
      /first time, trusting you to run the math yourself/i,
    );
    expect(line?.text).toMatch(/trust is the gift/i);
    expect(line?.text).toMatch(/numbers are merely the wrapping/i);
    expect(line?.setsFlags).toContain(
      "seer_first_numeric_no_overhead_received",
    );
  });

  it("confidant_precursor lands the canonical 'already seen the conversation' meta-line", () => {
    // Per :630-636 canon: the canonical meta-line where the
    // recording refers to its own existence — closest single shipped
    // line to the bible's cross-time canon being named on-page.
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act5.confidant_precursor",
    );
    expect(line?.text).toMatch(
      /already seen the conversation you are about to have/i,
    );
    expect(line?.text).toMatch(/choosing is the respect/i);
    expect(line?.text).toMatch(/She will let you lead/i);
  });

  it("confidant_precursor §2.5 sealing canon: 'present in recording, not in person'", () => {
    // §2.5 protected canon: the Mechronis visit was her last
    // in-person presence. Any post-Mechronis Seer scene that places
    // her body in a room contradicts canon. The Stage-2 reframe
    // names "present in recording, not in person" so the canonical
    // anchor preserves under the cross-time canon.
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act5.confidant_precursor",
    );
    expect(line?.text).toMatch(/present in recording, not in person/i);
  });
});

describe("Acts 4-5 deepening — §1.5 voice rule + canon protections", () => {
  it("every new line is prediction-bearing OR revision-bearing (§1.5)", () => {
    const indicators = [
      /\bwill\b/i,
      /\bforeseen\b/i,
      /\brecord(ed|ing)?\b/i,
      /\bversion/i,
      /\btrust/i,
      /\bcrossing into\b/i,
      /\bfirst time\b/i,
      /\barranged\b/i,
      /\bconversation you are about to have\b/i,
      /\bshape/i,
      /\boutput/i,
      /\bcoordinate/i,
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

  it("§2.5 sealing canon: NO 'I will visit' / 'I will arrive' / 'I am with you' framing", () => {
    // The Seer is canonically sealed; she cannot live-arrive or
    // live-be-with. The canonical "I will be on Thaloria when you
    // need me" is allowed only because it's a coordinate-promise
    // explicitly framed as place-not-presence.
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bI will visit\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI will arrive\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI am with you\b/i);
    }
  });
});
