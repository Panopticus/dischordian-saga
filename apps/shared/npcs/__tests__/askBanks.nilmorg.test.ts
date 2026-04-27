// apps/shared/npcs/__tests__/askBanks.nilmorg.test.ts
//
// Phase 6a.1 Nilmorg ask-topics authoring-contract test.
//
// Validates the bible-derived bank against canonical Nilmorg
// constraints (per nilmorg.md §1.5 silence shape + §1.4 tells +
// §2.5 specificity-progression):
//   1. Every topic is npcKey "nilmorg"
//   2. Topic ids unique
//   3. Labels ≤24 chars (the AskWheel button rendering contract)
//   4. ≥10 topics shipped (Phase 6a.1 baseline)
//   5. Multi-act alternate-answer arc on "Who are you?" — 3
//      canonical answers spanning the canonical specificity
//      progression (institutional → collector → counterparty)
//   6. Cosmic-refusal canon: "What's worse than not paying?" +
//      "Why won't you explain?" both write the public flag
//      `nilmorg_refused_to_explain_severance` so other NPCs (e.g.,
//      Locke per Touché disclosure register) can react canonically
//   7. Bone-tier topic gates on Witnessed band (§2.5 mid-tier
//      recognition — file-keeper register)

import { describe, it, expect } from "vitest";
import { NILMORG_ASK_TOPICS } from "../askBanks/nilmorg";
import { getAskTopicsFor } from "../askBanks";

describe("NILMORG_ASK_TOPICS — bank shape", () => {
  it("ships at least 10 topics (Phase 6a.1 baseline)", () => {
    expect(NILMORG_ASK_TOPICS.length).toBeGreaterThanOrEqual(10);
  });

  it("every topic is owned by nilmorg", () => {
    for (const t of NILMORG_ASK_TOPICS) {
      expect(t.npcKey, t.id).toBe("nilmorg");
    }
  });

  it("topic ids are unique", () => {
    const ids = NILMORG_ASK_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("labels ≤24 chars (AskWheel rendering contract)", () => {
    for (const t of NILMORG_ASK_TOPICS) {
      expect(t.label.length, `${t.id}: "${t.label}"`).toBeLessThanOrEqual(
        24,
      );
    }
  });

  it("answers are non-empty", () => {
    for (const t of NILMORG_ASK_TOPICS) {
      expect(t.answer.length, t.id).toBeGreaterThan(0);
    }
  });

  it("aggregator surfaces them via getAskTopicsFor('nilmorg')", () => {
    const fromAggregator = getAskTopicsFor("nilmorg");
    expect(fromAggregator.length).toBe(NILMORG_ASK_TOPICS.length);
  });
});

describe("Multi-act 'Who are you?' arc — canonical specificity progression", () => {
  const whoTopic = NILMORG_ASK_TOPICS.find(
    (t) => t.id === "ask_nilmorg_who",
  );

  it("ships the canonical 'Who are you?' topic", () => {
    expect(whoTopic).toBeDefined();
  });

  it("has 2 alternate answers (Acts 4 + 7) on top of the base Act-2 answer", () => {
    expect(whoTopic?.alternateAnswers?.length).toBe(2);
  });

  it("Act-7 alternate gates on nilmorg_severance_paid_to_player flag", () => {
    const act7 = whoTopic?.alternateAnswers?.find(
      (a) => a.unlockedFromAct === 7,
    );
    expect(act7?.requiredFlag).toBe("nilmorg_severance_paid_to_player");
  });

  it("base + alternates carry distinct canonical voIds (Stage 2 VO pipeline)", () => {
    const ids = new Set<string>();
    if (whoTopic?.voId) ids.add(whoTopic.voId);
    for (const a of whoTopic?.alternateAnswers ?? []) {
      if (a.voId) ids.add(a.voId);
    }
    // 1 base + 2 alternates = 3 distinct VO clips.
    expect(ids.size).toBe(3);
  });
});

describe("Cosmic-refusal canon — public-flag wiring", () => {
  it("'Why won't you explain?' writes nilmorg_refused_to_explain_severance", () => {
    const t = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_dont_explain",
    );
    expect(t?.setsPublicFlags).toContain(
      "nilmorg_refused_to_explain_severance",
    );
  });

  it("'Worse than not paying?' also writes the canonical refusal flag", () => {
    const t = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_worse_than_not_paying",
    );
    expect(t?.setsPublicFlags).toContain(
      "nilmorg_refused_to_explain_severance",
    );
  });
});

describe("Bible-canon protections", () => {
  it("'Worse than not paying?' canonically gates on Witnessed trust band", () => {
    // Per nilmorg.md §1.5 the canonical refusal lives in the menace-tier
    // register; only Witnessed+ players reach it.
    const t = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_worse_than_not_paying",
    );
    expect(t?.requiresTrustBand).toBe("Witnessed");
  });

  it("Bone-tier history topic gates on Witnessed (file-keeper register)", () => {
    const t = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_bone_tier",
    );
    expect(t?.requiresTrustBand).toBe("Witnessed");
  });

  it("first-season + lost-Severance topics gate on Witnessed (counterparty register)", () => {
    const first = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_first_season",
    );
    const lost = NILMORG_ASK_TOPICS.find(
      (x) => x.id === "ask_nilmorg_lost_severance",
    );
    expect(first?.requiresTrustBand).toBe("Witnessed");
    expect(lost?.requiresTrustBand).toBe("Witnessed");
  });
});

describe("Canonical category coverage", () => {
  it("Foundation: Severance + Trench + refusal-pivot", () => {
    const ids = NILMORG_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_nilmorg_severance");
    expect(ids).toContain("ask_nilmorg_trench");
    expect(ids).toContain("ask_nilmorg_dont_explain");
  });

  it("History: DMC funder + Wired Clones + Bone-tier", () => {
    const ids = NILMORG_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_nilmorg_dmc_funded");
    expect(ids).toContain("ask_nilmorg_wired_clones");
    expect(ids).toContain("ask_nilmorg_bone_tier");
  });

  it("Relationships: Degen + Hierophant", () => {
    const ids = NILMORG_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_nilmorg_about_degen");
    expect(ids).toContain("ask_nilmorg_about_hierophant");
  });

  it("Personal: first-season + canonical no-loss memoir", () => {
    const ids = NILMORG_ASK_TOPICS.map((t) => t.id);
    expect(ids).toContain("ask_nilmorg_first_season");
    expect(ids).toContain("ask_nilmorg_lost_severance");
  });
});
