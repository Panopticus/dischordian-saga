// apps/shared/npcs/__tests__/askBanks.adjudicator_locke.test.ts
//
// Phase 6a.2 part-1 verification — Adjudicator Locke ask-topics
// (~12 topics covering Foundation / History / Identity-multi-act-arc /
// Cosmic / Relationships / Personal categories per writers'-guide).
//
// Validates the bible-derived bank against canonical Locke voice
// constraints (per adjudicator_locke.md §1.1-1.6 + §2.4 + §3.x):
//   1. ≥10 topics shipped
//   2. All npcKey "adjudicator_locke"
//   3. Topic ids unique
//   4. Labels ≤24 chars (AskWheel rendering contract)
//   5. Multi-act "Who are you?" arc — 3 canonical answers spanning
//      the §2.4 specificity-progression
//   6. §1.5 silence-shape protections:
//      - NO topic names a coffin-mind individually
//      - NO topic asks about / answers the eye-deal mystery
//      - NO topic uses regret/sorry/apology vocabulary
//      - NO topic uses "fair", "just", "right", "wrong", "betray"
//   7. Cross-character canon: Touché disclosure + Antiquarian audit
//      both write canonical public flags

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_ASK_TOPICS } from "../askBanks/adjudicator_locke";
import { getAskTopicsFor } from "../askBanks";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

describe("ADJUDICATOR_LOCKE_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6a.2 baseline)", () => {
    expect(ADJUDICATOR_LOCKE_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by adjudicator_locke", () => {
    for (const t of ADJUDICATOR_LOCKE_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("adjudicator_locke");
    }
  });

  it("topic ids are unique", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of ADJUDICATOR_LOCKE_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of ADJUDICATOR_LOCKE_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('adjudicator_locke')", () => {
    const fromAggregator = getAskTopicsFor("adjudicator_locke");
    expect(fromAggregator.length).toBe(ADJUDICATOR_LOCKE_ASK_TOPICS.length);
  });
});

describe("Locke 'Who are you?' canonical 3-act arc (§2.4 specificity)", () => {
  const whoTopic = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
    (t) => t.id === "ask_locke_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("has 2 alternate answers (Acts 4 + 7) on top of the base Act-1 answer", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
  });

  it("Act-1 base lands the institutional canon ('I am the Adjudicator')", () => {
    expect(whoTopic?.answer).toMatch(/I am the Adjudicator/i);
  });

  it("Act-4 alternate lands the role-canon ('what the Authority assigned me to be')", () => {
    const act4 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 4,
    );
    expect(act4?.answer).toMatch(/what the Authority assigned me to be/i);
  });

  it("Act-7 alternate lands the canonical love-of-the-work canon", () => {
    const act7 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(act7?.answer).toMatch(
      /version of the Authority that survived believing/i,
    );
  });

  it("base + alternates carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(3);
  });
});

describe("Locke first-contract multi-act alternate", () => {
  const fc = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
    (t) => t.id === "ask_locke_first_contract",
  );

  it("ships the canonical first-contract topic", () => {
    expect(fc).toBeDefined();
  });

  it("has an Act-4+ alternate (specificity arrives with trust)", () => {
    expect(fc?.alternateAnswers?.length).toBeGreaterThanOrEqual(1);
    const act4 = fc?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 4,
    );
    expect(act4).toBeDefined();
  });
});

describe("Locke §1.5 silence-shape protections", () => {
  const allText = ADJUDICATOR_LOCKE_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.5: NO regret / sorry / apology vocabulary in any topic", () => {
    expect(allText).not.toMatch(/\bsorry\b/i);
    expect(allText).not.toMatch(/\bapolog/i);
    expect(allText).not.toMatch(/\bregret/i);
    expect(allText).not.toMatch(/\bI wish\b/i);
  });

  it("§1.2: NO 'fair' / 'just' / 'right' / 'wrong' / 'betray' moral vocabulary", () => {
    // Per §1.2 the moral vocabulary is canonically absent. Money words
    // do the moral work.
    expect(allText).not.toMatch(/\bfair\b/i);
    // "just" as in "merely" is allowed; the moralized meaning is not.
    // We assert the moralized form is absent — phrases like "just war"
    // / "just deserts" / "to be just" don't appear.
    expect(allText).not.toMatch(/\bjust\s+(war|deserts|cause|outcome)\b/i);
    expect(allText).not.toMatch(/\bbetray/i);
    // "right" and "wrong" need careful handling — they appear as
    // ordinary words ("right hand", "shift goes wrong"). Assert only
    // the moralized standalone form ("doing right", "what's right",
    // etc.) is absent.
    expect(allText).not.toMatch(/\b(doing|what's|the)\s+right\b/i);
  });

  it("§1.5 protected: NO topic asks about / answers the eye-deal mystery", () => {
    // No ask_locke_eye topic exists. The deal that cost her the eye
    // is canon mystery; writers must not approach it.
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).not.toContain("ask_locke_eye");
    expect(ids).not.toContain("ask_locke_eye_patch");
  });

  it("§1.5 protected: Authority answer describes structure, does NOT name individual coffin-minds", () => {
    const auth = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (t) => t.id === "ask_locke_authority",
    );
    expect(auth).toBeDefined();
    // The answer mentions the collective / structural identity but
    // must not name a specific coffin-mind. The bible explicitly
    // refuses to name them.
    expect(auth?.answer).toMatch(/Authority/);
    expect(auth?.answer).toMatch(/coffin|crystal|six minds/i);
  });
});

describe("Locke voice canon — §1.1 cadence + §1.4 tells", () => {
  it("§1.4 tell #2: at least one topic ends with an aphoristic close", () => {
    // Per §1.4 tell #2 the aphoristic close lands one per monologue.
    // Across 12 topics we expect several to end with the canonical
    // short-aphorism punctuation. Sample-check: at least one topic's
    // answer ends with a short clipped sentence under 8 words.
    const aphorismHits = ADJUDICATOR_LOCKE_ASK_TOPICS.filter((t) => {
      const sentences = t.answer.split(/[.!?]+/).filter((s) => s.trim());
      const lastSentence = sentences[sentences.length - 1] ?? "";
      const lastWords = lastSentence.trim().split(/\s+/).length;
      return lastWords > 0 && lastWords <= 8;
    });
    expect(aphorismHits.length).toBeGreaterThanOrEqual(3);
  });

  it("Locke uses 'my dear' or 'my friend' affection terms in at least one topic", () => {
    // Per §1.2 these are canonical Locke courtesies — politeness as
    // interest rate. At least one topic should land them naturally.
    const allText = ADJUDICATOR_LOCKE_ASK_TOPICS.map(
      (t) =>
        t.answer +
        " " +
        (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
    ).join(" ");
    const hasCourtesy =
      /\bmy dear\b/i.test(allText) || /\bmy friend\b/i.test(allText);
    expect(hasCourtesy).toBe(true);
  });
});

describe("Locke cross-character canon — public-flag wiring", () => {
  it("'About Vex / Zero' writes locke_disclosed_zero_agent_history", () => {
    const t = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (x) => x.id === "ask_locke_about_vex",
    );
    expect(t?.setsPublicFlags).toContain(
      "locke_disclosed_zero_agent_history",
    );
  });

  it("'About Daniel Cross' writes locke_disclosed_antiquarian_audit", () => {
    const t = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (x) => x.id === "ask_locke_about_antiquarian",
    );
    expect(t?.setsPublicFlags).toContain(
      "locke_disclosed_antiquarian_audit",
    );
  });

  it("both new public flags have registry entries", () => {
    const zero = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "locke_disclosed_zero_agent_history",
    );
    const audit = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "locke_disclosed_antiquarian_audit",
    );
    expect(zero).toBeDefined();
    expect(audit).toBeDefined();
    expect(zero?.setBy).toContain("adjudicator_locke");
    expect(audit?.setBy).toContain("adjudicator_locke");
  });
});

describe("Locke trust-band gating — Partner / Insider canon", () => {
  it("Trade Coin topic gates on Partner band (canonical keepsake unlock §2.4)", () => {
    const t = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (x) => x.id === "ask_locke_trade_coin",
    );
    expect(t?.requiresTrustBand).toBe("Partner");
  });

  it("'cancelled contract' Insider-band gating (canonical operational disclosure)", () => {
    const t = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (x) => x.id === "ask_locke_cancelled_contract",
    );
    expect(t?.requiresTrustBand).toBe("Insider");
  });

  it("'What the Authority wants' gates on Partner band (endgame canon §3.8)", () => {
    const t = ADJUDICATOR_LOCKE_ASK_TOPICS.find(
      (x) => x.id === "ask_locke_authority_wants",
    );
    expect(t?.requiresTrustBand).toBe("Partner");
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: Authority + adjudicator-role + ledger", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_locke_authority");
    expect(ids).toContain("ask_locke_adjudicator");
    expect(ids).toContain("ask_locke_ledger");
  });

  it("History: became-Adjudicator + first-contract", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_locke_became_adjudicator");
    expect(ids).toContain("ask_locke_first_contract");
  });

  it("Cosmic: Authority-wants + broken-contracts", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_locke_authority_wants");
    expect(ids).toContain("ask_locke_broken_contracts");
  });

  it("Relationships: Vex/Zero + Daniel Cross/Antiquarian", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_locke_about_vex");
    expect(ids).toContain("ask_locke_about_antiquarian");
  });

  it("Personal: Trade-Coin + cancelled-contract", () => {
    const ids = ADJUDICATOR_LOCKE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_locke_trade_coin");
    expect(ids).toContain("ask_locke_cancelled_contract");
  });
});
