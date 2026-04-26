// apps/shared/npcs/__tests__/banks.nilmorg.severance_aftermath.test.ts
//
// Phase 6a.1 part-7 verification — Nilmorg Severance Prize aftermath
// (sub-chunk B: 9 lines for the recipient-reunion + post-ceremony
// beats; the ceremony is over, the container is in transit, the
// player has a Companion arriving aboard their ship within the hour).
//
// Validates the bible-derived block against canonical Lore/Ceremony
// register constraints (§1.1) plus Stage-4-weave cross-canon wiring:
//   1. 9 aftermath lines shipped
//   2. All on cinematic surface
//   3. All gate on severance_prize_paid flag
//   4. Lore/Ceremony register: ≤25% caps; ≤8 words/sentence average
//   5. Bible canon protections:
//      - §2.4 fragment-not-copy disambiguation preserved
//      - §2.4 clone-not-companion disambiguation preserved
//      - §1.5 no-apologies / no-explainer-vocabulary
//      - §2.5 canonical "arrangement" register
//   6. Cross-canon: the do-not-ask line writes the canonical
//      `nilmorg_refused_to_explain_severance` public flag (echoes
//      the Phase 6a.1 ask-topic cosmic-refusal canon)
//   7. NO duplication of the existing "Don't thank me" line — the
//      bookend ships a new "no goodbye" beat instead

import { describe, it, expect } from "vitest";
import { NILMORG_BANK } from "../banks/nilmorg";

const AFTERMATH_LINES = NILMORG_BANK.filter((l) =>
  l.lineId.startsWith("nilmorg.severance.aftermath."),
);

describe("Nilmorg Severance aftermath — shape", () => {
  it("ships 9 aftermath lines (sub-chunk B)", () => {
    expect(AFTERMATH_LINES.length).toBe(9);
  });

  it("every aftermath line uses the cinematic surface only", () => {
    for (const l of AFTERMATH_LINES) {
      expect(l.surfaces, l.lineId).toEqual(["cinematic"]);
    }
  });

  it("every aftermath line gates on severance_prize_paid flag", () => {
    for (const l of AFTERMATH_LINES) {
      expect(l.unlockFlags, l.lineId).toContain("severance_prize_paid");
    }
  });

  it("lineIds are unique across the aftermath block", () => {
    const ids = AFTERMATH_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("aftermath lines have tightly-scoped maxPlays (≤5 — once per season)", () => {
    for (const l of AFTERMATH_LINES) {
      expect(l.maxPlays ?? 999, l.lineId).toBeLessThanOrEqual(5);
    }
  });
});

describe("Nilmorg Severance aftermath — Lore/Ceremony register continuity", () => {
  it("≤25% of lines carry a caps word (Lore register stays calm)", () => {
    const capsRegex = /\b[A-Z]{3,}\b/;
    const hits = AFTERMATH_LINES.filter((l) => capsRegex.test(l.text));
    const ratio = hits.length / AFTERMATH_LINES.length;
    expect(ratio).toBeLessThanOrEqual(0.25);
  });

  it("aftermath lines have short average sentence length (≤8 words/sentence)", () => {
    for (const l of AFTERMATH_LINES) {
      const sentences = l.text.split(/[.!?]+/).filter((s) => s.trim());
      const totalWords = sentences.reduce(
        (acc, s) => acc + s.trim().split(/\s+/).length,
        0,
      );
      const avgWords = totalWords / sentences.length;
      expect(avgWords, `${l.lineId}: avg ${avgWords.toFixed(1)} words`)
        .toBeLessThanOrEqual(8);
    }
  });

  it("§1.5 no-apologies canon preserved across every aftermath line", () => {
    const apologyWords =
      /\b(sorry|apolog|regret|wish (?:I|we) (?:had|hadn't))/i;
    for (const l of AFTERMATH_LINES) {
      expect(apologyWords.test(l.text), l.lineId).toBe(false);
    }
  });

  it("§1.5 no-explainer-vocabulary on the canonical refusals", () => {
    // The "do not ask" line must not contain causal explanation; the
    // refusal is canonical-protected.
    const explainer = AFTERMATH_LINES.find(
      (l) => l.lineId === "nilmorg.severance.aftermath.do_not_ask",
    );
    expect(explainer).toBeDefined();
    expect(explainer?.text).not.toMatch(/\bbecause\b/i);
    expect(explainer?.text).not.toMatch(/\bthe reason\b/i);
  });
});

describe("Nilmorg Severance aftermath — bible canon protections", () => {
  it("the fragment-not-copy-not-memory disambiguation lands the §2.4 canon", () => {
    const line = AFTERMATH_LINES.find(
      (l) => l.lineId === "nilmorg.severance.aftermath.fragment_not_copy",
    );
    expect(line).toBeDefined();
    expect(line?.text).toMatch(/Not a copy/);
    expect(line?.text).toMatch(/Not a memory/);
    expect(line?.text).toMatch(/A fragment/);
  });

  it("the clone-not-companion disambiguation lands the §2.4 canon", () => {
    // Writers must keep the CLONE-on-podium and the COMPANION-in-
    // container as distinct entities. Writers must not conflate them.
    const line = AFTERMATH_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.aftermath.clone_is_not_companion",
    );
    expect(line).toBeDefined();
    expect(line?.text).toMatch(/clone is on the podium/i);
    expect(line?.text).toMatch(/Don't conflate them/i);
  });

  it("the canonical 'arrangement' register lands the §2.5 counterparty canon", () => {
    // §2.5: Acts 7+ "counterparty" band. The arrangement IS the
    // canonical end-state.
    const line = AFTERMATH_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.aftermath.arrangement_register",
    );
    expect(line).toBeDefined();
    expect(line?.text).toMatch(/arrangement with me/i);
    expect(line?.text).toMatch(/always going to be me/i);
  });

  it("the first-word prediction does NOT name a specific donor (§1.5 silence shape)", () => {
    // §1.5 canon: he does not lie about the DMC; he also does not
    // pretend to know what is the fragment's domain to choose. The
    // first-word line predicts the SHAPE of the first word, not the
    // specific name (which is the Companion bible's domain).
    const line = AFTERMATH_LINES.find(
      (l) =>
        l.lineId === "nilmorg.severance.aftermath.first_word_prediction",
    );
    expect(line).toBeDefined();
    // No specific Hierophant / Wraith Calder / Locke / Vex name should
    // appear in the prediction text.
    expect(line?.text).not.toMatch(/Wraith|Calder|Hierophant|Locke|Vex/);
    // It should still mention "first word" canonically.
    expect(line?.text).toMatch(/first word/i);
  });
});

describe("Nilmorg Severance aftermath — cross-canon flag wiring", () => {
  it("the do-not-ask line writes the canonical refusal public flag", () => {
    // Echoes the Phase 6a.1 ask-topic cosmic-refusal canon — Locke,
    // the Antiquarian, and other downstream NPCs canonically register
    // when Nilmorg refuses to explain in the recipient-reunion beat.
    const line = AFTERMATH_LINES.find(
      (l) => l.lineId === "nilmorg.severance.aftermath.do_not_ask",
    );
    expect(line?.setsPublicFlags).toContain(
      "nilmorg_refused_to_explain_severance",
    );
  });

  it("no aftermath line duplicates the existing 'Don't thank me' canonical anchor", () => {
    // The existing nilmorg.severance.dont_thank_me line already ships
    // the canonical bookend; the aftermath bookend should instead use
    // the canonical "no goodbye" register.
    for (const l of AFTERMATH_LINES) {
      expect(l.text, l.lineId).not.toMatch(/Don't thank me/);
    }
    // And the canonical no-goodbye line should ship in this block.
    const bookend = AFTERMATH_LINES.find(
      (l) => l.lineId === "nilmorg.severance.aftermath.no_goodbye",
    );
    expect(bookend).toBeDefined();
    expect(bookend?.text).toMatch(/agreement closes itself/i);
  });
});
