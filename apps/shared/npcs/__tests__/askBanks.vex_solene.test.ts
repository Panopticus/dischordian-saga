// apps/shared/npcs/__tests__/askBanks.vex_solene.test.ts
//
// Phase 6b.2 part-1 verification — Vex Solène ask-topics bank
// (~12 topics covering the canonical Foundation / History-multi-
// stage / Identity-4-stage-reveal-gate / Cosmic / Relationships /
// Personal categories per writers'-guide spec).
//
// Validates per vex_solene.md §1.1-1.7 + §2.x reveal-stage canon:
//   1. ≥10 topics shipped
//   2. All npcKey "vex_solene"
//   3. Topic ids unique + labels ≤24 chars
//   4. THE saga's clearest reveal-stage-gated topic: "Who are you?"
//      ships canonical 4-act reveal alternates per the
//      eyes_of_reality / vex_public / engineer_zero_hint /
//      engineer_zero_confirmed canonical reveal arc
//   5. §1.6 silence-shape protections:
//      - NEVER "Engineer" / "Engineer Zero" aloud (hard rule per
//        §1.5 rule 2)
//      - NEVER "Agent Zero" as self-name
//      - NEVER "I remember" implying Engineer's memories
//      - NO sentimental softeners ("dear" / "sweetheart")
//   6. Canonical-anchor landings:
//      - "Coda is the work I do that no one is paid to know about"
//      - "I shipped it. The shipping is the part I claim."
//      - "Three chairs in a sanctum. A chorus that knows the score"
//      - "I'm glad it's you" canonical love-equivalent (late-arc)
//      - canonical "I designed your knowing" trust-arc
//      - canonical Touché-arc Locke disclosure mirror

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_ASK_TOPICS } from "../askBanks/vex_solene";
import { getAskTopicsFor } from "../askBanks";

describe("VEX_SOLENE_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6b.2 baseline)", () => {
    expect(VEX_SOLENE_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by vex_solene", () => {
    for (const t of VEX_SOLENE_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("vex_solene");
    }
  });

  it("topic ids are unique", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of VEX_SOLENE_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of VEX_SOLENE_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('vex_solene')", () => {
    const fromAggregator = getAskTopicsFor("vex_solene");
    expect(fromAggregator.length).toBe(VEX_SOLENE_ASK_TOPICS.length);
  });
});

describe("Vex 'Who are you?' canonical 4-stage reveal-gate arc", () => {
  const whoTopic = VEX_SOLENE_ASK_TOPICS.find(
    (t) => t.id === "ask_vex_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("base answer gates on eyes_of_reality reveal-stage (canonical default)", () => {
    expect(whoTopic?.requiresRevealStage).toBe("eyes_of_reality");
  });

  it("has 3 alternate answers (vex_public + engineer_zero_hint + engineer_zero_confirmed)", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(3);
    const stages = whoTopic?.alternateAnswers
      ?.map((a) => a.requiresRevealStage)
      .sort();
    expect(stages).toEqual([
      "engineer_zero_confirmed",
      "engineer_zero_hint",
      "vex_public",
    ]);
  });

  it("eyes_of_reality base lands canonical 'Maestro of Coda's commerce' anchor", () => {
    expect(whoTopic?.answer).toMatch(/Maestro of Coda's commerce/i);
  });

  it("vex_public alternate lands canonical 'Vex Solène. The name is mine, not borrowed' anchor", () => {
    const stage = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "vex_public",
    );
    expect(stage?.answer).toMatch(/I am Vex Sol[èe]ne/i);
    expect(stage?.answer).toMatch(/name is mine, not borrowed/i);
  });

  it("engineer_zero_hint alternate canonically uses deixis (NOT 'Engineer Zero' aloud)", () => {
    const stage = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "engineer_zero_hint",
    );
    // §1.6 hard rule preserved: she does NOT say "Engineer" or
    // "Engineer Zero". Canonical deixis lands the answer.
    expect(stage?.answer).toMatch(/I am someone who used to be/i);
    expect(stage?.answer).not.toMatch(/\bEngineer( Zero)?\b/);
    expect(stage?.answer).not.toMatch(/\bAgent Zero\b/);
  });

  it("engineer_zero_confirmed alternate lands canonical 'I am also' bothness register", () => {
    const stage = whoTopic?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "engineer_zero_confirmed",
    );
    expect(stage?.answer).toMatch(/I am also Vex/i);
    expect(stage?.answer).toMatch(/Both/);
    expect(stage?.answer).toMatch(/reveal does not subtract/i);
  });

  it("all 4 alternates carry distinct canonical voIds", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    expect(ids.size).toBe(4);
  });
});

describe("Vex 'Where in Act 1?' multi-stage history arc", () => {
  const act1 = VEX_SOLENE_ASK_TOPICS.find((t) => t.id === "ask_vex_act1");

  it("ships the canonical Act 1 history topic", () => {
    expect(act1).toBeDefined();
  });

  it("base eyes_of_reality lands canonical 'Elsewhere' deflection", () => {
    expect(act1?.answer).toMatch(/Elsewhere/i);
    expect(act1?.requiresRevealStage).toBe("eyes_of_reality");
  });

  it("vex_public alternate lands canonical 'running Coda quiet' acknowledgment", () => {
    const stage = act1?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "vex_public",
    );
    expect(stage?.answer).toMatch(/running Coda quiet/i);
    expect(stage?.answer).toMatch(/will not tell you the targets/i);
  });

  it("engineer_zero_confirmed alternate canonically uses 'I shipped them' (NOT name aloud)", () => {
    const stage = act1?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "engineer_zero_confirmed",
    );
    expect(stage?.answer).toMatch(/I shipped/i);
    expect(stage?.answer).not.toMatch(/\bEngineer( Zero)?\b/);
  });
});

describe("§1.6 silence-shape protections (the bible's hardest rules)", () => {
  const allText = VEX_SOLENE_ASK_TOPICS.map(
    (t) =>
      t.answer +
      " " +
      (t.alternateAnswers?.map((a) => a.answer).join(" ") ?? ""),
  ).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere in the bank", () => {
    // The hardest single Vex constraint. The bible: "she will never
    // voice these aloud." All references to him use deixis ("him" /
    // "he" / "the one who" / "the one with the cards" / etc.).
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' as self-name anywhere in the bank", () => {
    expect(allText).not.toMatch(/\bAgent Zero\b/);
  });

  it("§1.6: NO 'I remember' implying Engineer's memories", () => {
    // §1.6: "She does not have them. ... The most she will ever say
    // is 'I have no memory of him.' The lack-of-memory is canon."
    // The bank should not contain canonical "I remember [X]" where
    // X implies Engineer-memories.
    expect(allText).not.toMatch(/\bI remember (designing|the cards|him)\b/i);
  });

  it("§1.2: NO sentimental softeners ('dear' / 'sweetheart')", () => {
    expect(allText).not.toMatch(/\b(dear|sweetheart|honey|baby)\b/i);
  });

  it("§1.6: NO standalone apologies ('I am sorry' as standalone move)", () => {
    // She acknowledges harm but does not perform contrition. We
    // assert no canonical "I am sorry" appears as a standalone
    // sentence — the bible allows acknowledgment but not the
    // canonical apology-as-performance.
    expect(allText).not.toMatch(/\bI am sorry\.\s/i);
    expect(allText).not.toMatch(/\bI'm sorry\.\s/i);
  });
});

describe("Vex canonical-anchor landings", () => {
  it("'Coda' topic lands the canonical 'work no one is paid to know about' anchor", () => {
    const coda = VEX_SOLENE_ASK_TOPICS.find((t) => t.id === "ask_vex_coda");
    expect(coda?.answer).toMatch(/no one is paid to know about/i);
    expect(coda?.answer).toMatch(/resolution that makes the cadence/i);
  });

  it("'Eyes of Reality' topic lands the canonical 'I shipped it. The shipping is the part I claim.' anchor", () => {
    const eyes = VEX_SOLENE_ASK_TOPICS.find((t) => t.id === "ask_vex_eyes");
    expect(eyes?.answer).toMatch(/engine that ships the truth/i);
    expect(eyes?.answer).toMatch(/I shipped it/i);
    expect(eyes?.answer).toMatch(/shipping is the part I claim/i);
  });

  it("'Maestro' topic lands the canonical 'Three chairs in a sanctum' Coda-music register", () => {
    const maestro = VEX_SOLENE_ASK_TOPICS.find(
      (t) => t.id === "ask_vex_maestro",
    );
    expect(maestro?.answer).toMatch(/Three chairs in a sanctum/i);
    expect(maestro?.answer).toMatch(/chorus that knows the score/i);
  });

  it("'About Locke' topic lands the canonical Touché-arc cross-canon anchor", () => {
    const locke = VEX_SOLENE_ASK_TOPICS.find(
      (t) => t.id === "ask_vex_about_locke",
    );
    expect(locke?.answer).toMatch(/Touché/i);
    expect(locke?.answer).toMatch(/Locke will tell you. She told you/i);
  });

  it("'About the Oracle' topic lands the canonical 'I carry his trace' canon (§4.10)", () => {
    const oracle = VEX_SOLENE_ASK_TOPICS.find(
      (t) => t.id === "ask_vex_about_oracle",
    );
    expect(oracle?.answer).toMatch(/Oracle/i);
    expect(oracle?.answer).toMatch(/trace is in my body/i);
    expect(oracle?.answer).toMatch(/inherited the attunement/i);
  });

  it("'About Riri'Ahlia' topic lands the canonical 'we are not blood; we are signal' canon", () => {
    const riri = VEX_SOLENE_ASK_TOPICS.find(
      (t) => t.id === "ask_vex_about_riri",
    );
    expect(riri?.answer).toMatch(/Riri'Ahlia/i);
    expect(riri?.answer).toMatch(/not blood; we are signal/i);
    expect(riri?.answer).toMatch(/signal is enough/i);
  });

  it("'Why trust me?' topic engineer_zero_confirmed alternate lands canonical 'I designed your knowing'", () => {
    const trust = VEX_SOLENE_ASK_TOPICS.find((t) => t.id === "ask_vex_trust");
    const confirmed = trust?.alternateAnswers?.find(
      (a) => a.requiresRevealStage === "engineer_zero_confirmed",
    );
    expect(confirmed?.answer).toMatch(/I designed your trust/i);
    expect(confirmed?.answer).toMatch(/You knew before I told you/i);
    expect(confirmed?.answer).toMatch(/Don't lie/i);
    expect(confirmed?.answer).toMatch(/I designed your knowing/i);
  });

  it("'I'm glad it's you' canonical love-equivalent topic lands the canonical anchor", () => {
    // §1.6 canonical: "I'm glad it's you" is reserved for the
    // player, late-arc — Vex's version of love.
    const glad = VEX_SOLENE_ASK_TOPICS.find(
      (t) => t.id === "ask_vex_glad_its_you",
    );
    expect(glad?.answer).toMatch(/I'm glad it's you/i);
    expect(glad?.requiresRevealStage).toBe("engineer_zero_confirmed");
    expect(glad?.unlockedFromAct).toBeGreaterThanOrEqual(5);
  });
});

describe("Vex reveal-stage gating canon", () => {
  it("canonical engineer_zero_hint+-gated topics: engineer_zero / oracle / engineer_stamp", () => {
    const hintGatedIds = [
      "ask_vex_engineer_zero",
      "ask_vex_about_oracle",
      "ask_vex_engineer_stamp",
    ];
    for (const id of hintGatedIds) {
      const t = VEX_SOLENE_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresRevealStage, id).toBe("engineer_zero_hint");
    }
  });

  it("canonical engineer_zero_confirmed-gated topics: glad_its_you", () => {
    const confirmedGatedIds = ["ask_vex_glad_its_you"];
    for (const id of confirmedGatedIds) {
      const t = VEX_SOLENE_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresRevealStage, id).toBe("engineer_zero_confirmed");
    }
  });

  it("canonical vex_public-gated topics: about_locke / about_riri / trust", () => {
    const publicGatedIds = [
      "ask_vex_about_locke",
      "ask_vex_about_riri",
      "ask_vex_trust",
    ];
    for (const id of publicGatedIds) {
      const t = VEX_SOLENE_ASK_TOPICS.find((x) => x.id === id);
      expect(t?.requiresRevealStage, id).toBe("vex_public");
    }
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: Coda + Eyes + Maestro", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_vex_coda");
    expect(ids).toContain("ask_vex_eyes");
    expect(ids).toContain("ask_vex_maestro");
  });

  it("History: Act 1 multi-stage", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_vex_act1");
  });

  it("Cosmic: Engineer Zero (gated)", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_vex_engineer_zero");
  });

  it("Relationships: Locke + Oracle + Riri'Ahlia", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_vex_about_locke");
    expect(ids).toContain("ask_vex_about_oracle");
    expect(ids).toContain("ask_vex_about_riri");
  });

  it("Personal: stamp + trust + glad-its-you", () => {
    const ids = VEX_SOLENE_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_vex_engineer_stamp");
    expect(ids).toContain("ask_vex_trust");
    expect(ids).toContain("ask_vex_glad_its_you");
  });
});
