// apps/shared/npcs/__tests__/banks.seer.acts_2_3.test.ts
//
// Phase 6b.1 sub-chunk B verification — Seer Acts 2-3 register banks.
// Adds 4 lines covering the canonical Acts 2-3 trust-arc gaps:
//   - Act 2 silence ×2 (canonical no-content-here placeholder per §2.4)
//   - Act 3 cold variant (canonical "neither warm nor cold" rest-position
//     per §1.3 + `moralityTrustActVariants.ts:1027-1028`)
//   - Act 3 warm bridge (canonical prophecy-overhead-drops precursor to
//     the Act 5 first-laughter scene per §1.1 + §2.4)
//
// Validates per the_seer.md §§1.5 + 2.4:
//   1. 2 Act-2 silence lines shipped + 2 Act-3 deepening lines shipped
//   2. All on transmission surface (canonical Seer Stage-2+ register)
//   3. Act-2 silence lines gate on canonical seer_act2_silence_
//      acknowledged flag (the silence is opt-in narrative, not default)
//   4. Act-2 silence has minAct + maxAct = 2 (the silence is canonically
//      Act-2-only)
//   5. Act-3 cold variant lands the canonical "neither warm nor cold —
//      that is the Seer" anchor per :1027-1028 voice canon
//   6. Act-3 warm bridge lands the canonical "prophecy-overhead reduced"
//      precursor per §1.1 (warm register starts before first-laughter)
//   7. §1.5 voice rule satisfied: every line is prediction-bearing OR
//      revision-bearing (no purely descriptive lines)

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";

const ACT_2_LINES = THE_SEER_BANK.filter(
  (l) => l.minAct === 2 && l.maxAct === 2,
);
const ACT_3_DEEPENING = THE_SEER_BANK.filter((l) =>
  ["seer.transmission.act3.cold.neither_warm_nor_cold",
   "seer.transmission.act3.warm.prophecy_overhead_drops"].includes(l.lineId),
);

describe("Seer Act 2 silence — canonical no-content-here placeholder", () => {
  it("ships ≥2 Act-2 silence lines (Phase 6b.1 sub-chunk B baseline)", () => {
    expect(ACT_2_LINES.length).toBeGreaterThanOrEqual(2);
  });

  it("every Act-2 line has minAct === 2 AND maxAct === 2 (canonical Act-2-only)", () => {
    for (const l of ACT_2_LINES) {
      expect(l.minAct, l.lineId).toBe(2);
      expect(l.maxAct, l.lineId).toBe(2);
    }
  });

  it("every Act-2 line uses transmission surface", () => {
    for (const l of ACT_2_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["transmission"]);
    }
  });

  it("Act-2 silence lines gate on seer_act2_silence_acknowledged flag", () => {
    // §2.4 canon: "any Seer line authored for Act 2 in Stage 2+ would
    // canonically need to be framed as a recording that the engine
    // fires only if a specific flag is set." The flag-gate is the
    // canonical opt-in mechanism so default Act-2 stays canonical
    // silence.
    for (const l of ACT_2_LINES) {
      expect(l.unlockFlags, l.lineId).toContain(
        "seer_act2_silence_acknowledged",
      );
    }
  });

  it("placeholder_named line lands the canonical 'named the silence before sealing' canon", () => {
    const placeholder = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act2.silence.placeholder_named",
    );
    expect(placeholder).toBeDefined();
    expect(placeholder?.text).toMatch(/named the silence before sealing/i);
    expect(placeholder?.text).toMatch(/clean line/i);
    expect(placeholder?.text).toMatch(/zero entries for Act 2/i);
  });

  it("foreseen_solo line lands the canonical 'allocation is the prophecy' canon", () => {
    // §2.4 canon: "the canonical Act-2 silence is the recording's
    // waiting in concrete schedule form — she allocated zero
    // foretellings to that act."
    const solo = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.act2.silence.foreseen_solo",
    );
    expect(solo).toBeDefined();
    expect(solo?.text).toMatch(/allocated zero foretellings/i);
    expect(solo?.text).toMatch(/allocation is the prophecy/i);
    expect(solo?.text).toMatch(/Walk it without me/i);
  });
});

describe("Seer Act 3 deepening — canonical-anchor landings", () => {
  it("ships 2 Act-3 deepening lines (cold variant + warm bridge)", () => {
    expect(ACT_3_DEEPENING.length).toBe(2);
  });

  it("Act-3 cold variant lands the canonical 'neither warm nor cold — that is the Seer' anchor (§1.3)", () => {
    // Per `moralityTrustActVariants.ts:1027-1028` voice canon: the
    // canonical rest-position register. The line names the register
    // as the recording's content — meta-canonical per §2.3.
    const coldVariant = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.transmission.act3.cold.neither_warm_nor_cold",
    );
    expect(coldVariant).toBeDefined();
    expect(coldVariant?.text).toMatch(/neither warm nor cold/i);
    expect(coldVariant?.text).toMatch(/that is the Seer/i);
    expect(coldVariant?.text).toMatch(/rest position/i);
    expect(coldVariant?.requiresTrustBand).toBe("Wary");
  });

  it("Act-3 warm bridge lands the canonical 'prophecy-overhead reduced' canon (§1.1)", () => {
    // Per §1.1: prophecy-overhead is an inverse trust signal — more
    // overhead = colder register; less overhead = warmer. The Act-3
    // warm bridge fires BEFORE first-laughter and names the
    // overhead-reduction as the canonical warmth-precursor.
    const warmBridge = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.transmission.act3.warm.prophecy_overhead_drops",
    );
    expect(warmBridge).toBeDefined();
    expect(warmBridge?.text).toMatch(/prophecy-overhead reduced/i);
    expect(warmBridge?.text).toMatch(/She has not laughed yet/i);
    expect(warmBridge?.text).toMatch(/reduction is the warmth/i);
    expect(warmBridge?.text).toMatch(/crossing into the band/i);
    expect(warmBridge?.requiresTrustBand).toBe("Witnessed");
  });
});

describe("Seer Acts 2-3 chunk — §1.5 voice rule + canon protections", () => {
  const ALL_NEW = [...ACT_2_LINES, ...ACT_3_DEEPENING];

  it("every new line is prediction-bearing OR revision-bearing OR domestic-implicit", () => {
    // §1.5 single load-bearing voice rule. Each new line names a
    // foreseen state, a recording's metacommentary, or a near-future
    // prediction.
    const indicators = [
      /\bwill\b/i,
      /\bforeseen\b/i,
      /\bforetelling/i,
      /\bsealed\b/i,
      /\bsealing\b/i,
      /\bbefore sealing\b/i,
      /\brecord(ed|ing)?\b/i,
      /\bcrossing into\b/i,
      /\bnamed\b/i,
      /\ballocat/i,
      /\bschedul/i,
      /\bversion/i,
      /\boverhead/i,
      /\bshape/i,
      /\bwait/i,
    ];
    for (const l of ALL_NEW) {
      const matched = indicators.some((re) => re.test(l.text));
      expect(matched, `${l.lineId}: ${l.text.slice(0, 80)}`).toBe(true);
    }
  });

  it("§1.3 most-load-bearing absence: NO 'destiny'/'fate'/'destined' anywhere", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bdestin(y|ed)\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bfate(d)?\b/i);
    }
  });

  it("§1.2 cadence rule #3: NO colon-introduced revelation pattern", () => {
    // The Seer does NOT speak in colon-introduced revelations. We
    // assert no "Prophecy:" / "What I see:" pattern.
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).not.toMatch(/\bProphecy:/i);
      expect(l.text, l.lineId).not.toMatch(/\bWhat I see:/i);
    }
  });

  it("Act-2 silence canon preserved: no live-conversation framing in placeholder lines", () => {
    // §2.4 canon: the Act-2 silence is canonically a recording's
    // placeholder, not a live message. The lines should reference
    // the recording / the schedule / the named silence — not "I am
    // sending this" present-tense live framing.
    for (const l of ACT_2_LINES) {
      // No live-conversation framing
      expect(l.text, l.lineId).not.toMatch(/\bI am sending\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bcontacting you now\b/i);
    }
  });

  it("§2.5 sealing canon preserved: no in-person Act-2 framing", () => {
    // The Seer is sealed; she cannot be physically present. Any
    // Act-2 framing must respect the canonical pre-recording.
    for (const l of ACT_2_LINES) {
      expect(l.text, l.lineId).not.toMatch(
        /\b(I will visit|I will arrive|I am with you)\b/i,
      );
    }
  });
});
