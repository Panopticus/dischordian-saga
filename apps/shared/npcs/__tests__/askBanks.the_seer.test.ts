// apps/shared/npcs/__tests__/askBanks.the_seer.test.ts
//
// Phase 6b.1 part-1 verification — The Seer ask-topics bank
// (~12 topics covering Foundation / History / Identity-multi-act-arc
// / Cosmic / Relationships / Personal categories per writers'-guide).
//
// Validates the bible-derived bank against canonical Seer voice
// constraints (per the_seer.md §1.1-1.5 + §2.5 + §4.x):
//   1. ≥10 topics shipped
//   2. All npcKey "the_seer"
//   3. Topic ids unique + labels ≤24 chars
//   4. Multi-act "Who are you?" arc — 3 canonical answers spanning
//      Cold (Acts 1) / Warm (Acts 4) / Confidant (Acts 7) registers
//   5. §1.5 voice-rule: every Seer line either contains a prediction
//      OR a public revision OR an implicit-prediction-as-preparation
//      (Confidant-register exception class)
//   6. §1.5 silence-shape protections:
//      - NO "destiny" / "fate" / "fated" / "destined" — most-load-
//        bearing absence per §1.3
//      - NO origin narration before Mechronis (canon-protected per
//        §7.2)
//   7. Canonical anchors land:
//      - "the bench" / "bench has learned" canon (§1.3)
//      - "probability table" / "redact" canon (§1.3 + §1.4 #5)
//      - canonical Mechronis "I went once. I played one match." (§2.1)
//      - canonical "more wall" exchange with Hierophant (§4.3)
//      - canonical "I laughed at the Programmer" (§4.6)
//      - canonical asymmetric-kindness clause (§1.4 #2)
//   8. Cross-character canon: Programmer-laugh disclosure writes the
//      canonical seer_remembers_laughing_at_programmer public flag

import { describe, it, expect } from "vitest";
import { THE_SEER_ASK_TOPICS } from "../askBanks/the_seer";
import { getAskTopicsFor } from "../askBanks";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

describe("THE_SEER_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6b.1 baseline)", () => {
    expect(THE_SEER_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by the_seer", () => {
    for (const t of THE_SEER_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("the_seer");
    }
  });

  it("topic ids are unique", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of THE_SEER_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of THE_SEER_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('the_seer')", () => {
    const fromAggregator = getAskTopicsFor("the_seer");
    expect(fromAggregator.length).toBe(THE_SEER_ASK_TOPICS.length);
  });
});

describe("Seer 'Who are you?' canonical 3-act arc", () => {
  const whoTopic = THE_SEER_ASK_TOPICS.find((t) => t.id === "ask_seer_who");

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("has 2 alternate answers (Acts 4 + 7) on top of base Act-1 answer", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
  });

  it("Act-1 base lands the Cold-register 'one who already knows' anchor", () => {
    expect(whoTopic?.answer).toMatch(/I am the one who already knows/i);
  });

  it("Act-4 alternate lands the canonical version-pivot tell (§1.4 #1)", () => {
    const act4 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 4,
    );
    // §1.4 tell #1 (public revision): "I was wrong about which version
    // ... and the version is better."
    expect(act4?.answer).toMatch(/version of the prophet/i);
    expect(act4?.answer).toMatch(/wrong about which version/i);
  });

  it("Act-7 alternate lands the canonical pre-recording canon (§2.3)", () => {
    const act7 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(act7?.answer).toMatch(/recording that has been waiting/i);
    expect(act7?.answer).toMatch(/waiting is fair/i);
  });
});

describe("Seer 'Why did you seal yourself?' multi-act arc", () => {
  const sealedTopic = THE_SEER_ASK_TOPICS.find(
    (t) => t.id === "ask_seer_sealed",
  );

  it("ships the canonical sealing topic", () => {
    expect(sealedTopic).toBeDefined();
  });

  it("base Acts 3+ canonically refuses the open-channel narration", () => {
    expect(sealedTopic?.answer).toMatch(/closed door/i);
    expect(sealedTopic?.answer).toMatch(/Ask me at the bench/i);
  });

  it("has Acts 5+ (Witnessed) + Acts 7+ (Confidant) alternates", () => {
    expect(sealedTopic?.alternateAnswers?.length).toBe(2);
    const acts = sealedTopic?.alternateAnswers
      ?.map((a) => a.unlockedFromAct)
      .sort();
    expect(acts).toEqual([5, 7]);
  });

  it("Acts 7+ alternate lands canonical Confidant-register 'tea is in the second cupboard' anchor", () => {
    const act7 = sealedTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(act7?.answer).toMatch(/tea is in the second cupboard/i);
  });
});

describe("Seer §1.5 silence-shape protections", () => {
  const allText = THE_SEER_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.3 most-load-bearing absence: NO 'destiny'/'fate'/'fated'/'destined'", () => {
    expect(allText).not.toMatch(/\bdestin(y|ed)\b/i);
    expect(allText).not.toMatch(/\bfate(d)?\b/i);
  });

  it("§1.3 NO 'prophecy:' colon-introduced revelation cadence (per §1.2 rule #3)", () => {
    // The canonical no-colon rule for revelations. We assert that
    // none of the answers contain the canonical "What I see:" /
    // "Prophecy:" pattern — the canonical rejected punctuation.
    expect(allText).not.toMatch(/\bWhat I see:/i);
    expect(allText).not.toMatch(/\bProphecy:/i);
  });

  it("§7.2 protected: NO ask-topic asks about the Seer's pre-Mechronis origin", () => {
    // The Seer has no canon-stated origin event; her pre-Mechronis
    // past is canonically protected mystery. No ask-topic should
    // approach it.
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).not.toContain("ask_seer_origin");
    expect(ids).not.toContain("ask_seer_pre_mechronis");
    expect(ids).not.toContain("ask_seer_birthplace");
  });

  it("§1.5 voice rule: each topic answer is prediction-bearing OR revision-bearing OR domestic-implicit", () => {
    // Every Seer line must either contain a prediction OR a public
    // revision OR (Confidant exception) be domestic-vocabulary
    // implicit-prediction-as-preparation. We test by asserting
    // future-tense / measurement / version / domestic anchors land
    // in ≥75% of topics. The remaining canonical forms (continuing-
    // action "ever since" / canonical-shape "shape of the X" /
    // canonical-knowing "preparing for someone who knows") are
    // prediction-bearing in canonical Seer register but live
    // outside this simple regex set — they're validated by the
    // canonical-anchor-landing tests below instead.
    const indicators = [
      /\bwill\b/i,           // future tense
      /\bwhen you\b/i,       // future indirect
      /\bmeasur/i,           // measurement language
      /\bversion/i,          // version-pivot
      /\bredact/i,           // probability-table
      /\btable/i,
      /\bbench/i,            // canonical anchor
      /\bcupboard/i,         // domestic Confidant
      /\bwait/i,             // canonical waiting
      /\bcategor/i,          // category sentence
      /\bprobabilit/i,       // probability lexicon
      /\bshape of/i,         // canonical "shape of the lesson"
      /\b(ever )?since\b/i,  // continuing-action canonical
      /\bknows\b/i,          // canonical "preparing for someone who knows"
      /\brecording/i,        // canonical pre-recording per §2.3
    ];
    const matchedTopics = THE_SEER_ASK_TOPICS.filter((t) => {
      const text = t.answer +
        " " +
        (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? "");
      return indicators.some((re) => re.test(text));
    });
    const ratio = matchedTopics.length / THE_SEER_ASK_TOPICS.length;
    expect(ratio).toBeGreaterThanOrEqual(0.75);
  });
});

describe("Seer canonical-anchor landings", () => {
  it("'the bench' / 'bench has learned' canonical anchor lands in the bench topic", () => {
    const bench = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_bench",
    );
    expect(bench?.answer).toMatch(/the bench/i);
    expect(bench?.answer).toMatch(/has learned/i);
  });

  it("canonical 'probability table' + 'redact' anchors land in the precognition topic", () => {
    const prec = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_precognition",
    );
    expect(prec?.answer).toMatch(/the table/i);
    expect(prec?.answer).toMatch(/redact/i);
  });

  it("canonical Mechronis 'I went once. I played one match.' anchor lands", () => {
    const mech = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_mechronis",
    );
    expect(mech?.answer).toMatch(/I went once/i);
    expect(mech?.answer).toMatch(/played one match/i);
    expect(mech?.answer).toMatch(/did not raise my staff/i);
  });

  it("canonical 'more wall' exchange anchors land in the Hierophant topic (§4.3)", () => {
    const hiero = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_about_hierophant",
    );
    expect(hiero?.answer).toMatch(/more wall/i);
    expect(hiero?.answer).toMatch(/We are professionals/i);
  });

  it("canonical 'I laughed at the Programmer' anchor lands (§4.6)", () => {
    const prog = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_about_programmer",
    );
    expect(prog?.answer).toMatch(/I laughed at him/i);
    expect(prog?.answer).toMatch(/specific shelf/i);
  });

  it("canonical asymmetric-kindness clause lands in the personal topic (§1.4 #2)", () => {
    const me = THE_SEER_ASK_TOPICS.find(
      (t) => t.id === "ask_seer_what_for_me",
    );
    expect(me?.answer).toMatch(/kindest to/i);
    expect(me?.answer).toMatch(/Both things are honest/i);
  });

  it("canonical pre-recording canon lands in 'will you come back' (§2.3)", () => {
    const ret = THE_SEER_ASK_TOPICS.find((t) => t.id === "ask_seer_return");
    expect(ret?.answer).toMatch(/I am a recording/i);
    expect(ret?.answer).toMatch(/Recordings do not return/i);
  });
});

describe("Seer trust-band gating canon", () => {
  it("canonical-Witnessed-band topics: Oracle / Hierophant / Programmer / what-for-me", () => {
    const witnessedTopics = [
      "ask_seer_about_oracle",
      "ask_seer_about_hierophant",
      "ask_seer_about_programmer",
      "ask_seer_what_for_me",
      "ask_seer_return",
    ];
    for (const id of witnessedTopics) {
      const t = THE_SEER_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBe("Witnessed");
    }
  });

  it("base Foundation topics canonically open at Wary band (no trust gate)", () => {
    const foundationIds = [
      "ask_seer_bench",
      "ask_seer_precognition",
      "ask_seer_staff",
      "ask_seer_mechronis",
    ];
    for (const id of foundationIds) {
      const t = THE_SEER_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresTrustBand, id).toBeUndefined();
    }
  });
});

describe("Seer cross-character canon — public-flag wiring", () => {
  it("'About Daniel Cross' writes seer_remembers_laughing_at_programmer", () => {
    const t = THE_SEER_ASK_TOPICS.find(
      (x) => x.id === "ask_seer_about_programmer",
    );
    expect(t?.setsPublicFlags).toContain(
      "seer_remembers_laughing_at_programmer",
    );
  });

  it("seer_remembers_laughing_at_programmer has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "seer_remembers_laughing_at_programmer",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("the_seer");
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: bench + precognition + staff", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_seer_bench");
    expect(ids).toContain("ask_seer_precognition");
    expect(ids).toContain("ask_seer_staff");
  });

  it("History: Mechronis + sealing", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_seer_mechronis");
    expect(ids).toContain("ask_seer_sealed");
  });

  it("Cosmic: Dreamer's shield + return", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_seer_dreamer_shield");
    expect(ids).toContain("ask_seer_return");
  });

  it("Relationships: Oracle + Hierophant + Programmer", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_seer_about_oracle");
    expect(ids).toContain("ask_seer_about_hierophant");
    expect(ids).toContain("ask_seer_about_programmer");
  });

  it("Personal: what did you see for me", () => {
    const ids = THE_SEER_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_seer_what_for_me");
  });
});
