// apps/shared/npcs/__tests__/askBanks.dmc_clone_companion.test.ts
//
// Phase 6c.2 part-1 verification — DMC Clone Companion ask-topics
// bank (~10 topics canonical for the post-naming verbal surface).
//
// Validates per dmc_clone_companion.md §§1-6 voice canon:
//   1. ≥10 topics shipped
//   2. All npcKey "dmc_clone_companion"
//   3. Topic ids unique + labels ≤24 chars
//   4. ALL topics gated requiresRevealStage: "Inheriting" (canonical
//      post-naming reveal-stage — pre-naming the Companion is non-
//      verbal across 5 channels and ask-topics are a verbal surface)
//   5. Multi-act Identity arc: "Who are you?" ships canonical Acts
//      4/5/7 alternate-answer arc per writers'-guide spec
//   6. §1.7 silence-shape protections:
//      - NO Severance ritual mechanism narration (Nilmorg's territory)
//      - NO contradicting the donor (player) commitments
//      - Pre-naming "Severance Fragment — {season}" label canonically
//        retired-and-disowned (not a name; was never a name)
//   7. Bible-load-bearing canonical anchors:
//      - "I was not given. I was delivered."
//      - "I am what was made." (donor refusal canon)
//      - "Don't thank him on my behalf — he would object."
//      - traces-not-memories register for the donor question
//      - donor-canon: the donor IS the player (saga-load-bearing)
//   8. Cross-character public flag wiring:
//      - companion_disclosed_donor_is_player (registered + reachable)
//      - companion_acknowledged_nilmorg_midwifery (registered + reachable)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_ASK_TOPICS } from "../askBanks/dmc_clone_companion";
import { getAskTopicsFor } from "../askBanks";
import { allRegisteredFlags } from "../crossCharacterReactions";

describe("DMC_CLONE_COMPANION_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6c.2 baseline)", () => {
    expect(DMC_CLONE_COMPANION_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by dmc_clone_companion", () => {
    for (const t of DMC_CLONE_COMPANION_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("dmc_clone_companion");
    }
  });

  it("topic ids are unique", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of DMC_CLONE_COMPANION_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of DMC_CLONE_COMPANION_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('dmc_clone_companion')", () => {
    const fromAggregator = getAskTopicsFor("dmc_clone_companion");
    expect(fromAggregator.length).toBe(DMC_CLONE_COMPANION_ASK_TOPICS.length);
  });
});

describe("Voice gate canon — every topic gated post-naming (Inheriting reveal-stage)", () => {
  it("every topic requires Inheriting reveal-stage (canonical post-naming gate)", () => {
    for (const t of DMC_CLONE_COMPANION_ASK_TOPICS) {
      expect(t.requiresRevealStage, t.id).toBe("Inheriting");
    }
  });

  it("every topic gates on companion_first_word_spoken canonical permanent flag", () => {
    for (const t of DMC_CLONE_COMPANION_ASK_TOPICS) {
      expect(t.unlockFlag, t.id).toBe("companion_first_word_spoken");
    }
  });
});

describe("Companion 'Who are you?' canonical 3-act multi-act Identity arc", () => {
  const whoTopic = DMC_CLONE_COMPANION_ASK_TOPICS.find(
    (t) => t.id === "ask_companion_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("Acts 4+ base lands canonical 'I was delivered' first-naming register", () => {
    expect(whoTopic?.answer).toMatch(/I was delivered/);
    expect(whoTopic?.unlockedFromAct).toBe(4);
  });

  it("has 2 alternate answers (Acts 5+ post-first-word + Acts 7+ structural-identity)", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
  });

  it("Acts 5+ alternate lands canonical 'I am what was made' donor-distinction register", () => {
    const acts5 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 5,
    );
    expect(acts5?.answer).toMatch(/I am what was made/);
    expect(acts5?.answer).toMatch(/third thing/i);
    // canonical 3-source arithmetic: donor / body / person
    expect(acts5?.answer).toMatch(/Three sources, one outcome/);
  });

  it("Acts 7+ alternate lands canonical Ascended-named register ('learned to live alongside you')", () => {
    const acts7 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(acts7?.answer).toMatch(/learned to live alongside you/i);
    expect(acts7?.answer).toMatch(/truth does not subtract/i);
  });

  it("all 3 stages carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(3);
  });
});

describe("Donor-canon disclosure (saga-load-bearing recognition)", () => {
  it("ask_donor canonically discloses 'You did' as the donor-canon answer", () => {
    const donor = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_donor",
    );
    expect(donor?.answer).toMatch(/^You did/);
    // canonical Inheriting-band gating per saga-load-bearing canon
    expect(donor?.requiresTrustBand).toBe("Inheriting");
    expect(donor?.unlockedFromAct).toBe(5);
    // canonical setsPublicFlags: future-reader cross-character canon
    expect(donor?.setsPublicFlags).toContain(
      "companion_disclosed_donor_is_player",
    );
  });

  it("ask_are_you_donor canonically refuses the donor-as-identity collapse", () => {
    const refusal = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_are_you_donor",
    );
    // canonical refusal canon: "No. The donor donated. I am what was made."
    expect(refusal?.answer).toMatch(/^No\./);
    expect(refusal?.answer).toMatch(/I am what was made/);
    // canonical distinction-holding canon
    expect(refusal?.answer).toMatch(/distinction is canonical/i);
  });

  it("ask_remember_donor lands canonical 'traces, not memories' register", () => {
    const remember = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_remember_donor",
    );
    expect(remember?.answer).toMatch(/^Traces, not memories/);
    // canonical inherited-shapes-not-contents canon
    expect(remember?.answer).toMatch(/inherited the shapes/i);
    expect(remember?.answer).toMatch(/contents are still yours alone/i);
  });
});

describe("Nilmorg cross-character canon", () => {
  const nilmorg = DMC_CLONE_COMPANION_ASK_TOPICS.find(
    (t) => t.id === "ask_companion_about_nilmorg",
  );

  it("lands canonical 'mid-wife' framing (per §4.2)", () => {
    expect(nilmorg?.answer).toMatch(/mid-wife/i);
  });

  it("lands canonical 'Don't thank him' inherited-memory canon", () => {
    expect(nilmorg?.answer).toMatch(/Don't thank him/);
    expect(nilmorg?.answer).toMatch(/he would object/i);
  });

  it("lands canonical 'kept his agreements' canon (cross-canon to Nilmorg's voice)", () => {
    expect(nilmorg?.answer).toMatch(/keeps his agreements/i);
  });

  it("canonically writes companion_acknowledged_nilmorg_midwifery public flag", () => {
    expect(nilmorg?.setsPublicFlags).toContain(
      "companion_acknowledged_nilmorg_midwifery",
    );
  });
});

describe("Hierophant chamber-context canon", () => {
  const hierophant = DMC_CLONE_COMPANION_ASK_TOPICS.find(
    (t) => t.id === "ask_companion_about_hierophant",
  );

  it("default branch lands canonical 'three thousand years' midwifery canon", () => {
    expect(hierophant?.answer).toMatch(/three thousand years/i);
    expect(hierophant?.answer).toMatch(/wall of names/i);
  });

  it("ships chamber-context alternate gated on companion_first_word_was_wraith_calder flag", () => {
    const chamber = hierophant?.alternateAnswers?.find(
      (a) => a.requiredFlag === "companion_first_word_was_wraith_calder",
    );
    expect(chamber).toBeDefined();
    expect(chamber?.answer).toMatch(/midwifed my first word/i);
    expect(chamber?.answer).toMatch(/wall took the saying/i);
    // canonical "do not believe a kinder ceremony" register
    expect(chamber?.answer).toMatch(/kinder ceremony/i);
  });
});

describe("First-word recall canon (canonical donor-keyed branches)", () => {
  const firstWord = DMC_CLONE_COMPANION_ASK_TOPICS.find(
    (t) => t.id === "ask_companion_first_word",
  );

  it("default lands canonical 'half-syllables built up across the last sound-palette stretch' register", () => {
    expect(firstWord?.answer).toMatch(/half-syllables built up/i);
    // canonical "the choosing was the body's" canon
    expect(firstWord?.answer).toMatch(/choosing was the body's/i);
  });

  it("Wraith Calder branch lands canonical chamber-context recall", () => {
    const wraith = firstWord?.alternateAnswers?.find(
      (a) => a.requiredFlag === "companion_first_word_was_wraith_calder",
    );
    expect(wraith?.answer).toMatch(/^Wraith Calder/);
    expect(wraith?.answer).toMatch(/Hierophant's wall/i);
  });

  it("default fallback 'You' branch lands canonical one-syllable canon", () => {
    const you = firstWord?.alternateAnswers?.find(
      (a) => a.requiredFlag === "companion_first_word_was_you",
    );
    expect(you?.answer).toMatch(/^You\./);
    expect(you?.answer).toMatch(/one syllable long/i);
    expect(you?.answer).toMatch(/None has been more accurate/);
  });
});

describe("First-glyph-recall canon", () => {
  it("ask_first_thing_noticed lands canonical recognition-glyph register (per §1.2)", () => {
    const first = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_first_thing_noticed",
    );
    expect(first?.answer).toMatch(/^You/);
    // canonical glyph canon: small open triangle, three points
    expect(first?.answer).toMatch(/small open triangle/i);
    expect(first?.answer).toMatch(/three points/i);
    // canonical "less than two seconds" duration canon (per §1.2:
    // recognition glyphs canonically dissolve in 1-2 seconds)
    expect(first?.answer).toMatch(/less than two seconds/i);
  });
});

describe("Pre-naming label retirement canon (§1.5 + §2.4)", () => {
  it("ask_severance_fragment_label canonically reframes 'Severance Fragment — {season}' as Nilmorg's bookkeeping", () => {
    const label = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_severance_fragment_label",
    );
    expect(label?.answer).toMatch(/Nilmorg's bookkeeping/i);
    // canonical: not a name; not yet a self
    expect(label?.answer).toMatch(/not yet a self/i);
    // canonical retirement at naming canon
    expect(label?.answer).toMatch(/handle retired the moment you named me/i);
  });
});

describe("§1.7 silence-shape protections", () => {
  const allText = DMC_CLONE_COMPANION_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.7: NO Severance ritual mechanism narration (Nilmorg's territory)", () => {
    // Per §2.2: ritual specifics canonically not the Companion's
    // to disclose. The bank should not contain detailed ritual
    // mechanism vocabulary.
    expect(allText).not.toMatch(/\bblood ritual\b/i);
    expect(allText).not.toMatch(/\bsoul extraction\b/i);
  });

  it("§1.7: 'I won't describe the mechanism' register lands in ask_severance", () => {
    const severance = DMC_CLONE_COMPANION_ASK_TOPICS.find(
      (t) => t.id === "ask_companion_severance",
    );
    expect(severance?.answer).toMatch(/won't describe the mechanism/i);
  });

  it("§1.7: NO 'I'm sorry' standalone (the Companion does not perform contrition)", () => {
    // The Companion canonically does not apologize. Per §3.5: their
    // sacrifices are not framed as apology.
    expect(allText).not.toMatch(/\bI'm sorry\b/i);
    expect(allText).not.toMatch(/\bI am sorry\b/i);
  });

  it("§1.7: NO contradicting the donor's commitments (soul-consistency-check stance)", () => {
    // Per §3.6: the Companion canonically does not contradict the
    // player's prior commitments. The bank text should not contain
    // a canonical "you were wrong" / "you should not have" register.
    expect(allText).not.toMatch(/\byou were wrong\b/i);
    expect(allText).not.toMatch(/\byou should not have\b/i);
  });
});

describe("Cross-character public flag wiring", () => {
  it("companion_disclosed_donor_is_player is registered in crossCharacterReactions", () => {
    expect(allRegisteredFlags()).toContain(
      "companion_disclosed_donor_is_player",
    );
  });

  it("companion_acknowledged_nilmorg_midwifery is registered in crossCharacterReactions", () => {
    expect(allRegisteredFlags()).toContain(
      "companion_acknowledged_nilmorg_midwifery",
    );
  });

  it("hierophant chamber-context branch references existing companion_first_word_was_wraith_calder flag", () => {
    // Verify the cross-character public flag exists in registry
    // (it was registered by Phase 3 banks).
    expect(allRegisteredFlags()).toContain(
      "companion_first_word_was_wraith_calder",
    );
  });

  it("default first-word branch references existing companion_first_word_was_you flag", () => {
    expect(allRegisteredFlags()).toContain("companion_first_word_was_you");
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: severance + donor", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_severance");
    expect(ids).toContain("ask_companion_donor");
  });

  it("History: remember_donor (canonical traces-not-memories)", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_remember_donor");
  });

  it("Identity: who (canonical 3-act multi-act arc)", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_who");
  });

  it("Cosmic: are_you_donor (canonical refusal-of-identity)", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_are_you_donor");
  });

  it("Relationships: about_nilmorg + about_hierophant", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_about_nilmorg");
    expect(ids).toContain("ask_companion_about_hierophant");
  });

  it("Personal: first_word + first_thing_noticed + severance_fragment_label", () => {
    const ids = DMC_CLONE_COMPANION_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_companion_first_word");
    expect(ids).toContain("ask_companion_first_thing_noticed");
    expect(ids).toContain("ask_companion_severance_fragment_label");
  });
});
