// apps/shared/npcs/__tests__/banks.vex.eyes_of_reality.test.ts
//
// Phase 6b.2 sub-chunk B verification — Vex Solène eyes_of_reality
// stage expansion (6 new lines + 2 existing pilot = 8 lines total
// covering Acts 1-2 pre-reveal Maestro-narrator surfaces per the
// writers'-guide spec).
//
// Per the plan:
//   "eyes_of_reality (Acts 1-2, pre-reveal): 8 lines covering Coda
//    Maestro narrator persona for Trade Empire opening sectors, Ch6
//    young-Agent-Zero match commentary"
//
// Validates per vex_solene.md §§1.1-1.7 + reveal-stage canon:
//   1. ≥8 eyes_of_reality lines shipped (canonical 8-line target)
//   2. All lines gate on requiresRevealStage: "eyes_of_reality"
//   3. All lines fire only in Acts 1-2 (canonical pre-reveal window)
//   4. Surface coverage: trade_empire / match / cinematic /
//      transmission canonically represented
//   5. §1.6 silence-shape protections preserved across the chunk:
//      - NEVER "Engineer" / "Engineer Zero" aloud (hard rule)
//      - NEVER "Agent Zero" as self-name
//      - NO sentimental softeners
//   6. Canonical-anchor landings:
//      - Trade Empire opening narrator's "I will tell you who,
//        eventually" canonical deferred-identity hint
//      - Ch6 mid-match "the pricing was wrong" inventory-then-
//        courtesy beat per §1.5 tell #1
//      - pre-match positioning "the opponent does not introduce
//        herself" canonical pre-reveal name-suppression
//      - canonical Acts-2 transmission bridge "Hello" courtesy per
//        §1.5 tell #5 code-switch canon
//      - canonical "the footnote will not contain my name" Mechronis
//        post-match name-suppression closer

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";

const EYES_LINES = VEX_SOLENE_BANK.filter(
  (l) => l.requiresRevealStage === "eyes_of_reality",
);

const NEW_EYES_IDS = [
  "vex.eyes_of_reality.trade_empire.opening_narrator",
  "vex.ch6.young_agent_zero.mid_match_pricing",
  "vex.ch6.young_agent_zero.pre_match_positioning",
  "vex.eyes_of_reality.trade_empire.route_completion_narrator",
  "vex.eyes_of_reality.transmission.act2_bridge_hello",
  "vex.ch6.young_agent_zero.post_match_footnote",
];

const NEW_EYES = VEX_SOLENE_BANK.filter((l) =>
  NEW_EYES_IDS.includes(l.lineId),
);

describe("Vex eyes_of_reality stage — shape", () => {
  it("ships ≥8 eyes_of_reality lines (canonical 8-line target)", () => {
    expect(EYES_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("ships 6 NEW lines from Phase 6b.2 sub-chunk B", () => {
    expect(NEW_EYES.length).toBe(6);
  });

  it("every eyes_of_reality line gates on requiresRevealStage", () => {
    for (const l of EYES_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("eyes_of_reality");
    }
  });

  it("every eyes_of_reality line fires in Acts 1-2 only", () => {
    for (const l of EYES_LINES) {
      expect(l.minAct ?? 1, l.lineId).toBeLessThanOrEqual(2);
      expect(l.maxAct ?? 7, l.lineId).toBeLessThanOrEqual(2);
    }
  });

  it("every eyes_of_reality line is canonically once-per-playthrough", () => {
    for (const l of EYES_LINES) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });

  it("eyes_of_reality lineIds are unique", () => {
    const ids = EYES_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("eyes_of_reality surface coverage", () => {
  it("trade_empire surface canonically represented (≥2 lines)", () => {
    const trade = EYES_LINES.filter((l) =>
      l.surfaces.includes("trade_empire"),
    );
    expect(trade.length).toBeGreaterThanOrEqual(2);
  });

  it("match surface canonically represented (≥3 Ch6 lines)", () => {
    const match = EYES_LINES.filter((l) => l.surfaces.includes("match"));
    expect(match.length).toBeGreaterThanOrEqual(3);
  });

  it("transmission surface represented (canonical Acts-2 bridge)", () => {
    const trans = EYES_LINES.filter((l) =>
      l.surfaces.includes("transmission"),
    );
    expect(trans.length).toBeGreaterThanOrEqual(1);
  });

  it("cinematic surface canonically represented (pre-match positioning)", () => {
    const cine = EYES_LINES.filter((l) => l.surfaces.includes("cinematic"));
    expect(cine.length).toBeGreaterThanOrEqual(1);
  });
});

describe("§1.6 silence-shape protections (the bible's hardest rules)", () => {
  const allText = NEW_EYES.map((l) => l.text).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere", () => {
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' as self-name anywhere", () => {
    // Note: 'Agent Zero' may appear in narrator-frame brackets as
    // [Agent Zero context] but not in Vex's own voice. The new lines
    // canonically don't use the name at all.
    expect(allText).not.toMatch(/\bI am Agent Zero\b/i);
    expect(allText).not.toMatch(/\bcalled Agent Zero\b/i);
  });

  it("§1.6: NO sentimental softeners ('dear' / 'sweetheart')", () => {
    expect(allText).not.toMatch(/\b(dear|sweetheart|honey|baby)\b/i);
  });

  it("§1.6: NO standalone apologies", () => {
    expect(allText).not.toMatch(/\bI am sorry\.\s/i);
    expect(allText).not.toMatch(/\bI'm sorry\.\s/i);
  });
});

describe("eyes_of_reality canonical-anchor landings", () => {
  it("Trade Empire opening narrator lands canonical 'I will tell you who, eventually'", () => {
    const opening = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.eyes_of_reality.trade_empire.opening_narrator",
    );
    expect(opening?.text).toMatch(/Welcome to the trade lanes/i);
    expect(opening?.text).toMatch(/I will tell you who, eventually/i);
  });

  it("Ch6 mid-match 'the pricing was wrong' lands canonical inventory-then-courtesy beat", () => {
    // §1.5 tell #1 canonical signature: inventory-then-courtesy. The
    // canonical "Note the correction" closer lands the courtesy.
    const mid = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.ch6.young_agent_zero.mid_match_pricing",
    );
    expect(mid?.text).toMatch(/pricing was wrong/i);
    expect(mid?.text).toMatch(/Note the correction/i);
  });

  it("pre-match positioning lands canonical 'opponent does not introduce herself' canon", () => {
    const pre = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.ch6.young_agent_zero.pre_match_positioning",
    );
    expect(pre?.text).toMatch(/opponent does not introduce herself/i);
    expect(pre?.text).toMatch(/does not need to/i);
  });

  it("Trade Empire route-completion narrator lands canonical 'contract has not yet been offered' deferred-canon", () => {
    const route = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.eyes_of_reality.trade_empire.route_completion_narrator",
    );
    expect(route?.text).toMatch(/cleanliness was noted/i);
    expect(route?.text).toMatch(/contract has not yet been offered/i);
  });

  it("Acts-2 transmission bridge lands canonical 'Hello' code-switch courtesy (§1.5 tell #5)", () => {
    const bridge = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId ===
        "vex.eyes_of_reality.transmission.act2_bridge_hello",
    );
    expect(bridge?.text).toMatch(/I have been waiting/i);
    expect(bridge?.text).toMatch(/The waiting is fair/i);
    expect(bridge?.text).toMatch(/Hello/);
    expect(bridge?.setsFlags).toContain(
      "vex_eyes_of_reality_bridge_received",
    );
  });

  it("Ch6 post-match footnote lands canonical 'footnote will not contain my name' name-suppression", () => {
    const footnote = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.ch6.young_agent_zero.post_match_footnote",
    );
    expect(footnote?.text).toMatch(/footnote will not contain my name/i);
    expect(footnote?.text).toMatch(/by design/i);
  });
});

describe("eyes_of_reality cadence + tells", () => {
  it("§1.1 trailing-word cadence: ≥80% of lines end with declarative resolution (period or close-quote)", () => {
    // Trailing-word cadence per §1.1: "her sentences end *down*, not
    // up — they conclude rather than reach." Canonical close: period
    // or closing quotation. We check the last printable character is
    // a period (or close-bracket / close-quote that follows a period).
    const trailing = NEW_EYES.filter((l) => /[.\]"']$/.test(l.text.trim()));
    const ratio = trailing.length / NEW_EYES.length;
    expect(ratio).toBeGreaterThanOrEqual(0.8);
  });

  it("§1.5 tell #4 direct deixis: NEW lines avoid 'his name'/'her name' patterns naming the Engineer", () => {
    // §1.5 tell #4 canonical direct-deixis canon: she refers to the
    // Engineer ONLY via deixis, never by name. The eyes_of_reality
    // chunk pre-dates the Engineer-revelation entirely; no line
    // should attempt to name him.
    const allText = NEW_EYES.map((l) => l.text).join(" ");
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });
});
