// apps/shared/npcs/__tests__/banks.seer.acts_6_7.test.ts
//
// Phase 6b.1 sub-chunk D verification — Seer Acts 6-7 register banks.
// Adds 5 lines covering the canonical Act 6 bridge (3 lines) and Act
// 7 deepening (2 lines).
//
// Per the_seer.md §2.4 + writers'-guide spec:
//   Act 6: bridge between Act 5 confidant-precursor and Act 7
//          confidant-invitation = 4 lines (3 shipped here; the
//          existing Act 5 confidant_precursor + the new bridges
//          land the canonical pre-Inheriting cadence)
//   Act 7: confidant invitation + Thaloria coordinates (existing
//          thaloria_invitation + 2 new deepenings — staff_on_the_bench
//          inheritance close + who_opens_the_door Stage-4-weave-anchor)
//
// Validates per §2.3 cross-time canon + §2.5 sealing canon:
//   1. 3 Act-6 bridge lines + 2 Act-7 deepening lines shipped
//   2. Act 6 bridges: Witnessed band, transmission surface
//   3. Act 7 deepenings: Inheriting band, cinematic surface
//   4. Canonical anchor preservations:
//      - Act 6 "tea is being prepared" / "door will be open"
//      - Act 6 "Thaloria has decided when to open" / "two decisions
//              are independent. They will rhyme."
//      - Act 6 "last recording before the invitation" / canonical
//              "next transmission will not be a transmission. It
//              will be coordinates."
//      - Act 7 "staff is on the bench" / canonical "staff is the
//              note" inheritance close
//      - Act 7 canonical Stage-4-weave-anchor: "door does not
//              announce who opened it" / "Hierophant is on Thaloria.
//              He is not at the door." / "choosing of who walks in
//              is yours."
//   5. §2.5 sealing canon protected: Act 7 lines name canonical
//      "she did not prepare to be there when it opened" framing

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";

const ACT_6_BRIDGE_IDS = [
  "seer.transmission.act6.bridge.tea_is_being_prepared",
  "seer.transmission.act6.bridge.thaloria_will_open",
  "seer.transmission.act6.bridge.last_recording_before_invitation",
];

const ACT_7_DEEPENING_IDS = [
  "seer.cinematic.act7.confidant.staff_on_the_bench",
  "seer.cinematic.act7.confidant.who_opens_the_door",
];

const ACT_6_BRIDGE = THE_SEER_BANK.filter((l) =>
  ACT_6_BRIDGE_IDS.includes(l.lineId),
);
const ACT_7_DEEPENING = THE_SEER_BANK.filter((l) =>
  ACT_7_DEEPENING_IDS.includes(l.lineId),
);

describe("Seer Act 6 bridge — shape", () => {
  it("ships 3 Act 6 bridge lines (Phase 6b.1 sub-chunk D)", () => {
    expect(ACT_6_BRIDGE.length).toBe(3);
  });

  it("every Act 6 line has minAct === 6", () => {
    for (const l of ACT_6_BRIDGE) {
      expect(l.minAct, l.lineId).toBe(6);
    }
  });

  it("every Act 6 line uses transmission surface", () => {
    for (const l of ACT_6_BRIDGE) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("every Act 6 line gates on Witnessed trust band", () => {
    for (const l of ACT_6_BRIDGE) {
      expect(l.requiresTrustBand, l.lineId).toBe("Witnessed");
    }
  });

  it("every Act 6 line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of ACT_6_BRIDGE) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("Act 6 bridge — canonical anchor landings", () => {
  it("tea_is_being_prepared lands the canonical 'tea/cupboard/door' preparation triad", () => {
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act6.bridge.tea_is_being_prepared",
    );
    expect(line?.text).toMatch(/tea is being prepared/i);
    expect(line?.text).toMatch(/cupboard is being stocked/i);
    expect(line?.text).toMatch(/door is not yet open/i);
    expect(line?.text).toMatch(/door will be open/i);
  });

  it("thaloria_will_open lands the canonical 'two decisions are independent / will rhyme' anchor", () => {
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act6.bridge.thaloria_will_open",
    );
    expect(line?.text).toMatch(/Thaloria has decided when to open/i);
    expect(line?.text).toMatch(/two decisions are independent/i);
    expect(line?.text).toMatch(/They will rhyme/i);
  });

  it("last_recording_before_invitation names the canonical 'invitation will be coordinates' shift", () => {
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.transmission.act6.bridge.last_recording_before_invitation",
    );
    expect(line?.text).toMatch(/last recording before the invitation/i);
    expect(line?.text).toMatch(/will not be a transmission/i);
    expect(line?.text).toMatch(/It will be coordinates/i);
    expect(line?.setsFlags).toContain("seer_invitation_imminent");
  });
});

describe("Seer Act 7 deepening — shape", () => {
  it("ships 2 Act 7 deepening lines (Phase 6b.1 sub-chunk D)", () => {
    expect(ACT_7_DEEPENING.length).toBe(2);
  });

  it("every Act 7 deepening line has minAct === 7", () => {
    for (const l of ACT_7_DEEPENING) {
      expect(l.minAct, l.lineId).toBe(7);
    }
  });

  it("every Act 7 deepening line uses cinematic surface", () => {
    for (const l of ACT_7_DEEPENING) {
      expect(l.surfaces, l.lineId).toEqual(["cinematic"]);
    }
  });

  it("every Act 7 deepening line gates on Inheriting band + seer_thaloria_visited", () => {
    // §2.5 canon: the canonical Thaloria visit IS the canonical
    // Inheriting-band scene. The deepening lines fire only after
    // the player has reached the visit.
    for (const l of ACT_7_DEEPENING) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.unlockFlags, l.lineId).toContain("seer_thaloria_visited");
    }
  });
});

describe("Act 7 deepening — canonical anchor landings", () => {
  it("staff_on_the_bench lands the canonical 'staff is the note' inheritance close", () => {
    // Per §2.2 + §2.5: the staff is the canonical artifact-of-her-
    // last-in-person-act (Mechronis). The Act 7 cinematic completes
    // the inheritance cycle by placing the staff at the Thaloria
    // coordinates with no note — the canonical "the staff is the note."
    const line = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.cinematic.act7.confidant.staff_on_the_bench",
    );
    expect(line?.text).toMatch(/staff is on the bench/i);
    expect(line?.text).toMatch(/Mechronis-shape/i);
    expect(line?.text).toMatch(/Yours to return/i);
    expect(line?.text).toMatch(/staff is the note/i);
    expect(line?.setsFlags).toContain("seer_staff_inheritance_completed");
  });

  it("who_opens_the_door names the canonical Stage-4-weave question without answering it", () => {
    // §2.4 canonical: "the door-opening is a Stage 4 weave question —
    // who opens the door? ... bible-asserts: the Seer's pre-recordings
    // cover the player's arrival; the door-opening mechanism is
    // canonically deferred." The line names the question, the
    // Hierophant cross-canon, and refuses to specify the opener.
    const line = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.cinematic.act7.confidant.who_opens_the_door",
    );
    expect(line?.text).toMatch(/door does not announce who opened it/i);
    expect(line?.text).toMatch(/Hierophant is on Thaloria/i);
    expect(line?.text).toMatch(/He is not at the door/i);
    expect(line?.text).toMatch(/recording said it would/i);
    expect(line?.text).toMatch(/choosing of who walks in is yours/i);
  });

  it("§2.5 sealing canon: Act 7 deepenings preserve 'she did not prepare to be there' framing", () => {
    // Per §2.5: the Mechronis visit is canonically her last in-
    // person presence. Any Act 7 framing must respect "she is not
    // physically present" canon.
    const whoOpens = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.cinematic.act7.confidant.who_opens_the_door",
    );
    expect(whoOpens?.text).toMatch(/did not prepare to be there/i);
  });
});

describe("Acts 6-7 chunk — §1.5 voice rule + canon protections", () => {
  const ALL_NEW = [...ACT_6_BRIDGE, ...ACT_7_DEEPENING];

  it("every new line is prediction-bearing OR revision-bearing OR domestic-implicit", () => {
    const indicators = [
      /\bwill\b/i,
      /\bbeing prepared\b/i,
      /\bbeing stocked\b/i,
      /\bcoordinates\b/i,
      /\brecord(ed|ing)?\b/i,
      /\bprepar(ed|ing)?\b/i,
      /\barrive\b/i,
      /\bopen/i,
      /\bcupboard/i,
      /\bbench/i,
      /\bstaff/i,
      /\binvitation/i,
      /\brhyme/i,
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

  it("§2.5 sealing canon: NO live-presence framing in Act 6 or Act 7 deepenings", () => {
    // The Seer is canonically sealed; she cannot live-arrive or
    // live-be-present. The canonical framings ("she prepared", "the
    // recording said it would") respect the seal.
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bI will visit\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI will arrive\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI am with you\b/i);
      // Allow "I am" only in self-descriptive contexts; specifically
      // forbid the canonical sealing-violation phrase "I am there"
      expect(l.text, l.lineId).not.toMatch(/\bI am at the door\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bI am in the room\b/i);
    }
  });
});
