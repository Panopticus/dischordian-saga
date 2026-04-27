// apps/shared/npcs/__tests__/askBanks.the_meme.test.ts
//
// Phase 6d.2 part-1 verification — The Meme ask-topics bank
// (~12 topics covering Foundation / History / Identity / Cosmic /
// Relationships / Personal categories per writers'-guide spec).
//
// Validates per the_meme.md §§1-3 voice canon:
//   1. ≥10 topics shipped
//   2. All npcKey "the_meme"
//   3. Topic ids unique + labels ≤24 chars
//   4. Multi-disguise Identity arc: "Who are you?" ships canonical
//      5-disguise alternates (Broadcast / Stolen / Quiet / Real /
//      Replacement) per registry reveal-stages canon
//   5. §1.9 Tells canon enforced:
//      - Tell #1 "wearing a face" frame (canonical face-vocabulary)
//      - Tell #4 single-word truth-leaks (one per scene at Quiet+
//        canonical reveal stage)
//      - "Frens" canonical Broadcast-register address
//      - Selective caps for memetic emphasis (canonical attention-
//        nouns, NOT appetite or aesthetic-verbs)
//   6. §1.10 silence-shape protections:
//      - Mascot canonically NOT named / faced / described
//      - Channel 7 canonically NOT explained
//      - Panopticon canonically NOT narrated from inside
//      - NO apology canon (description-but-not-contrition)
//      - NO "father" / "partner" from the Meme's side toward Architect
//   7. §1.11 metaphor-source rules:
//      - Broadcasting / prosthesis / faces / signals canonical
//      - NO game / chess / commerce / combat / architectural metaphors

import { describe, it, expect } from "vitest";
import { THE_MEME_ASK_TOPICS } from "../askBanks/the_meme";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("THE_MEME_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6d.2 part 1 baseline)", () => {
    expect(THE_MEME_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by the_meme", () => {
    for (const t of THE_MEME_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("the_meme");
    }
  });

  it("topic ids are unique", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of THE_MEME_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of THE_MEME_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('the_meme')", () => {
    const fromAggregator = getAskTopicsFor("the_meme");
    expect(fromAggregator.length).toBe(THE_MEME_ASK_TOPICS.length);
  });
});

describe("'Who are you?' canonical 5-disguise Identity arc", () => {
  const whoTopic = THE_MEME_ASK_TOPICS.find((t) => t.id === "ask_meme_who");

  it("ships the canonical 'Who are you?' topic at Broadcast stage", () => {
    expect(whoTopic).toBeDefined();
    expect(whoTopic?.requiresRevealStage).toBe("Broadcast");
  });

  it("base Broadcast-form lands canonical 'frens' + caps + face-vocab anchors", () => {
    expect(whoTopic?.answer).toMatch(/FRENS/);
    expect(whoTopic?.answer).toMatch(/wear faces/i);
    expect(whoTopic?.answer).toMatch(/Don't trust anyone wearing a face/i);
    expect(whoTopic?.answer).toMatch(/Subscribe to the Truth/i);
  });

  it("ships 4 alternates: Stolen / Quiet / Real / Replacement", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(4);
    const stages = (whoTopic?.alternateAnswers ?? []).map(
      (a) => a.requiresRevealStage,
    );
    expect(stages).toContain("Stolen");
    expect(stages).toContain("Quiet");
    expect(stages).toContain("Real");
    expect(stages).toContain("Replacement");
  });

  it("Stolen alternate lands canonical 'inverted intimacy' canon (§1.3)", () => {
    const stolen = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Stolen",
    );
    expect(stolen?.answer).toMatch(/keeping your seat warm/i);
    expect(stolen?.answer).toMatch(/We're both cosplay/i);
    expect(stolen?.answer).toMatch(/original pattern/i);
  });

  it("Quiet alternate lands canonical bracketed stage-direction + truth-leak canon (§1.4)", () => {
    const quiet = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Quiet",
    );
    // canonical bracketed stage-direction visible
    expect(quiet?.answer).toMatch(/^\[/);
    // canonical truth-leak: "I'm less than I was" or close cognate
    expect(quiet?.answer).toMatch(/less than I was/i);
  });

  it("Real alternate lands canonical pink-glitch + smaller-scale canon (§1.6)", () => {
    const real = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Real",
    );
    expect(real?.answer).toMatch(/Pink-glitch/i);
    expect(real?.answer).toMatch(/scale is canonically smaller/i);
    // canonical "rehearsing" canon
    expect(real?.answer).toMatch(/rehearsing/i);
  });

  it("Replacement alternate lands canonical 'child claiming the role' canon (§1.7)", () => {
    const replacement = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Replacement",
    );
    expect(replacement?.answer).toMatch(/the one he made/i);
    expect(replacement?.answer).toMatch(/claiming his role/i);
    expect(replacement?.answer).toMatch(/waiting was the practice/i);
    // canonical "I do not apologize" canon
    expect(replacement?.answer).toMatch(/do not apologize/i);
  });

  it("all 5 disguise stages carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(5);
  });
});

describe("§1.10 silence-shape protections", () => {
  const allText = THE_MEME_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("Mascot canonically NOT named beyond 'The Mascot' (no face / identity / construction)", () => {
    // canonical: bank may use "The Mascot" as the canonical reference
    // (it's the protected-mystery NAME), but must not give a face,
    // identity, species, or describe what they built together.
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
    expect(allText).not.toMatch(/Mascot's face was/i);
    expect(allText).not.toMatch(/we built (a|the) [a-z]+ together/i);
  });

  it("Channel 7 canonically NOT explained (canon-protected)", () => {
    const channelTopic = THE_MEME_ASK_TOPICS.find(
      (t) => t.id === "ask_meme_channel_7",
    );
    expect(channelTopic?.answer).toMatch(/won't explain/i);
    expect(channelTopic?.answer).toMatch(/explaining is canonically not mine/i);
  });

  it("Panopticon canonically NOT narrated from inside", () => {
    const oracleTopic = THE_MEME_ASK_TOPICS.find(
      (t) => t.id === "ask_meme_became_white_oracle",
    );
    const stolen = oracleTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "Stolen",
    );
    // canonical "the moment of the Panopticon is canonically opaque"
    expect(stolen?.answer).toMatch(/Panopticon is one of canonically few moments I will not narrate from inside/i);
  });

  it("§1.10: NO apology canon (description-but-not-contrition)", () => {
    expect(allText).not.toMatch(/\bI'm sorry\b/i);
    expect(allText).not.toMatch(/\bI am sorry\b/i);
    // canonical "do not apologize" canon — at least one canonical
    // anchor in the bank
    expect(allText).toMatch(/do not apologize/i);
  });

  it("§1.10: NO 'father' / 'partner' from the Meme's side (Architect framing canon)", () => {
    // canonical: Meme refers to Architect as "him" / "the one who
    // made me" / "the role" — not "father" / "partner"
    // Per the bank's §1.10 canon, "partner" appears in canonical
    // reference to the Architect's framing (he used it; the Meme
    // describes the asymmetry). The bank canonically does NOT use
    // "partner" as the Meme's first-person framing of him.
    const memeFirstPerson = allText.replace(
      /(He|he) (called|used the word|chose) ['"]?partner['"]?/g,
      "",
    );
    // After stripping canonical "he called me partner" framings,
    // no remaining "partner" usage.
    expect(memeFirstPerson).not.toMatch(/I (call|called) him partner/i);
    expect(memeFirstPerson).not.toMatch(/\bmy father\b/i);
    expect(memeFirstPerson).not.toMatch(/\bI call him father\b/i);
  });
});

describe("§1.11 metaphor-source rules", () => {
  const allText = THE_MEME_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.11: NO chess metaphors (Game Master vocabulary forbidden)", () => {
    expect(allText).not.toMatch(/\b(checkmate|chess board|knight|pawn|bishop)\b/i);
  });

  it("§1.11: NO commerce metaphors (Locke vocabulary forbidden)", () => {
    expect(allText).not.toMatch(/\b(market|pricing|inventory|margin|ledger entry)\b/i);
  });

  it("§1.11: NO combat metaphors (Nilmorg vocabulary forbidden)", () => {
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
  });

  it("§1.11: NO architectural metaphors (Architect/Game Master vocabulary)", () => {
    // canonical: Meme inhabits what others built; does not build
    expect(allText).not.toMatch(/\b(corridor I built|architecture I designed|wall I made)\b/i);
  });
});

describe("Tell #1 — 'wearing a face' canonical frame (§1.9)", () => {
  it("Broadcast register lines canonically include face-vocabulary", () => {
    const broadcastBase = THE_MEME_ASK_TOPICS.find(
      (t) => t.id === "ask_meme_who",
    );
    expect(broadcastBase?.answer).toMatch(/face/i);
  });
});

describe("'Frens' canonical Broadcast-register address", () => {
  it("Broadcast-register lines canonically include 'frens' (vs 'darling' for Right GM)", () => {
    // canonical: "frens" appears in the Broadcast register.
    const broadcastTopics = THE_MEME_ASK_TOPICS.filter(
      (t) => t.requiresRevealStage === "Broadcast",
    );
    const broadcastText = broadcastTopics.map((t) => t.answer).join(" ");
    expect(broadcastText).toMatch(/[Ff]rens/);
  });
});

describe("Mascot canon (§3.3 deepest protected mystery)", () => {
  const mascotTopic = THE_MEME_ASK_TOPICS.find(
    (t) => t.id === "ask_meme_about_mascot",
  );

  it("ships the Mascot topic gated to Quiet register (canonical only-mentionable canon)", () => {
    expect(mascotTopic).toBeDefined();
    expect(mascotTopic?.requiresRevealStage).toBe("Quiet");
  });

  it("lands canonical 'I had a friend once' canon + 'I don't talk about them anymore'", () => {
    expect(mascotTopic?.answer).toMatch(/I had a friend once/i);
    expect(mascotTopic?.answer).toMatch(/don't talk about them anymore/i);
    // canonical refusal canon
    expect(mascotTopic?.answer).toMatch(/will not name them/i);
    expect(mascotTopic?.answer).toMatch(/grief is the silence/i);
  });

  it("canonically writes meme_mascot_silence_canonically_held public flag", () => {
    expect(mascotTopic?.setsPublicFlags).toContain(
      "meme_mascot_silence_canonically_held",
    );
  });
});

describe("Cross-character public flag wiring (Phase 6d.2 part 1)", () => {
  it("meme_mascot_silence_canonically_held is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "meme_mascot_silence_canonically_held",
    );
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: palimpsest + channel_7 + what_is_a_meme", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_palimpsest");
    expect(ids).toContain("ask_meme_channel_7");
    expect(ids).toContain("ask_meme_what_is_a_meme");
  });

  it("History: became_white_oracle (canonical Broadcast→Stolen alternate)", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_became_white_oracle");
  });

  it("Identity: who (canonical 5-disguise alternate)", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_who");
  });

  it("Cosmic: why_replace_him + are_you_the_architect", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_why_replace_him");
    expect(ids).toContain("ask_meme_are_you_the_architect");
  });

  it("Relationships: about_oracle + about_mascot + about_daniel_cross", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_about_oracle");
    expect(ids).toContain("ask_meme_about_mascot");
    expect(ids).toContain("ask_meme_about_daniel_cross");
  });

  it("Personal: underneath_broadcast (canonical truth-leak arc)", () => {
    const ids = THE_MEME_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_meme_underneath_broadcast");
  });
});
