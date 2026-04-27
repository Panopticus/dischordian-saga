// apps/shared/npcs/__tests__/askTopics.test.ts
//
// Phase 6 Infrastructure Deliverable 1 verification.
// Validates the generalized AskTopic shape + resolveAskAnswer specificity
// scoring + getAvailableAskTopics gate filter, using bible-faithful
// fixtures that mirror the canonical multi-act alternate-answer pattern
// (Elara/Human "Who are you?" arc) plus the Phase 6 generalizations
// (trust-band gating, reveal-stage gating).

import { describe, it, expect } from "vitest";
import {
  resolveAskAnswer,
  getAvailableAskTopics,
  getAskTopic,
  type AskTopic,
} from "../askTopics";
import { ALL_NPC_ASK_TOPICS, getAskTopicsFor } from "../askBanks";

const FIXTURE_LOCKE_WHO: AskTopic = {
  id: "ask_locke_who",
  npcKey: "adjudicator_locke",
  label: "Who are you?",
  question: "Who are you, when you're not adjudicating?",
  answer: "I am the Adjudicator.",
  unlockFlag: "act1_locke_first_contact",
  unlockedFromAct: 1,
  alternateAnswers: [
    {
      unlockedFromAct: 4,
      answer: "I am what the Authority assigned me to be.",
    },
    {
      unlockedFromAct: 7,
      answer:
        "I am the version of the Authority that survived believing in it.",
    },
  ],
};

const FIXTURE_VEX_WHO: AskTopic = {
  id: "ask_vex_who",
  npcKey: "vex_solene",
  label: "Who are you?",
  question: "Who are you, really?",
  answer: "I am the Maestro of Coda's commerce.",
  unlockFlag: "vex_first_contact",
  unlockedFromAct: 3,
  requiresRevealStage: "eyes_of_reality",
  alternateAnswers: [
    {
      unlockedFromAct: 4,
      answer: "I am someone who used to be Engineer Zero.",
      requiresRevealStage: "engineer_zero_hint",
    },
    {
      unlockedFromAct: 5,
      answer:
        "I am Engineer Zero. I am also Vex. Both. The reveal does not subtract.",
      requiresRevealStage: "engineer_zero_confirmed",
    },
  ],
};

const FIXTURE_NILMORG_FOUNDATION: AskTopic = {
  id: "ask_nilmorg_severance",
  npcKey: "nilmorg",
  label: "Severance",
  question: "What is Severance?",
  answer: "The Trench keeps what the Trench is owed.",
  unlockFlag: "nilmorg_first_contact",
  unlockedFromAct: 2,
  requiresTrustBand: "Witnessed",
};

describe("AskTopic — resolveAskAnswer multi-act alternates", () => {
  it("returns base answer at the unlock act", () => {
    expect(
      resolveAskAnswer(FIXTURE_LOCKE_WHO, {
        currentAct: 1,
        flags: new Set(["act1_locke_first_contact"]),
      }),
    ).toBe("I am the Adjudicator.");
  });

  it("upgrades to Act-4 alternate at Act 4", () => {
    expect(
      resolveAskAnswer(FIXTURE_LOCKE_WHO, {
        currentAct: 4,
        flags: new Set(["act1_locke_first_contact"]),
      }),
    ).toBe("I am what the Authority assigned me to be.");
  });

  it("upgrades to Act-7 alternate at Act 7 (highest-act wins)", () => {
    expect(
      resolveAskAnswer(FIXTURE_LOCKE_WHO, {
        currentAct: 7,
        flags: new Set(["act1_locke_first_contact"]),
      }),
    ).toBe(
      "I am the version of the Authority that survived believing in it.",
    );
  });

  it("respects reveal-stage gating on alternates (no upgrade if stage missing)", () => {
    expect(
      resolveAskAnswer(FIXTURE_VEX_WHO, {
        currentAct: 5,
        flags: new Set(["vex_first_contact"]),
        revealStage: "eyes_of_reality",
      }),
    ).toBe("I am the Maestro of Coda's commerce.");
  });

  it("upgrades to engineer_zero_confirmed alternate when reveal-stage matches", () => {
    expect(
      resolveAskAnswer(FIXTURE_VEX_WHO, {
        currentAct: 5,
        flags: new Set(["vex_first_contact"]),
        revealStage: "engineer_zero_confirmed",
      }),
    ).toBe(
      "I am Engineer Zero. I am also Vex. Both. The reveal does not subtract.",
    );
  });
});

describe("getAvailableAskTopics — gate filter", () => {
  const topics: ReadonlyArray<AskTopic> = [
    FIXTURE_LOCKE_WHO,
    FIXTURE_VEX_WHO,
    FIXTURE_NILMORG_FOUNDATION,
  ];

  it("hides topic when unlock flag missing", () => {
    const visible = getAvailableAskTopics(topics, "adjudicator_locke", {
      currentAct: 1,
      flags: new Set(),
    });
    expect(visible.length).toBe(0);
  });

  it("hides topic when current act < unlockedFromAct", () => {
    const visible = getAvailableAskTopics(topics, "adjudicator_locke", {
      currentAct: 0,
      flags: new Set(["act1_locke_first_contact"]),
    });
    expect(visible.length).toBe(0);
  });

  it("shows topic when act + flag both satisfied", () => {
    const visible = getAvailableAskTopics(topics, "adjudicator_locke", {
      currentAct: 4,
      flags: new Set(["act1_locke_first_contact"]),
    });
    expect(visible.map((t) => t.id)).toEqual(["ask_locke_who"]);
  });

  it("filters by npcKey (Locke topics don't surface for Vex)", () => {
    const visible = getAvailableAskTopics(topics, "vex_solene", {
      currentAct: 4,
      flags: new Set([
        "act1_locke_first_contact",
        "vex_first_contact",
      ]),
      revealStage: "eyes_of_reality",
    });
    expect(visible.map((t) => t.id)).toEqual(["ask_vex_who"]);
  });

  it("hides topic when trust-band gate fails", () => {
    const visible = getAvailableAskTopics(topics, "nilmorg", {
      currentAct: 2,
      flags: new Set(["nilmorg_first_contact"]),
      trustBand: "Wary",
    });
    expect(visible.length).toBe(0);
  });

  it("shows topic when trust-band gate satisfied", () => {
    const visible = getAvailableAskTopics(topics, "nilmorg", {
      currentAct: 2,
      flags: new Set(["nilmorg_first_contact"]),
      trustBand: "Witnessed",
    });
    expect(visible.length).toBe(1);
  });

  it("hides topic when reveal-stage gate fails", () => {
    const visible = getAvailableAskTopics(topics, "vex_solene", {
      currentAct: 3,
      flags: new Set(["vex_first_contact"]),
      revealStage: "engineer_zero_confirmed",
    });
    expect(visible.length).toBe(0);
  });
});

describe("getAskTopic — id lookup", () => {
  const topics = [FIXTURE_LOCKE_WHO, FIXTURE_VEX_WHO];

  it("returns the topic by id", () => {
    expect(getAskTopic(topics, "ask_locke_who")?.label).toBe(
      "Who are you?",
    );
  });

  it("returns undefined for unknown id", () => {
    expect(getAskTopic(topics, "ask_nonexistent")).toBeUndefined();
  });
});

describe("ALL_NPC_ASK_TOPICS aggregator", () => {
  it("is a valid array (silent-fail contract — never crashes the wheel)", () => {
    expect(Array.isArray(ALL_NPC_ASK_TOPICS)).toBe(true);
  });

  it("getAskTopicsFor returns empty array for unauthored NPCs (silent-fail)", () => {
    // Phase 6a.1 shipped Nilmorg; Phase 6a.2 shipped Locke; Phase
    // 6b.1 shipped Seer; Phase 6b.2 shipped Vex; Phase 6b.3 shipped
    // Oracle; Phase 6c.1 shipped Degen; Phase 6c.2 shipped Companion;
    // the rest stay empty until their sub-phase ships per the
    // Phase 6 sequencing. Updated as banks land.
    expect(getAskTopicsFor("your_eidolon").length).toBe(0);
  });

  it("Nilmorg (Phase 6a.1) ships ≥10 topics via the aggregator", () => {
    expect(getAskTopicsFor("nilmorg").length).toBeGreaterThanOrEqual(10);
  });

  it("Locke (Phase 6a.2) ships ≥10 topics via the aggregator", () => {
    expect(
      getAskTopicsFor("adjudicator_locke").length,
    ).toBeGreaterThanOrEqual(10);
  });

  it("Seer (Phase 6b.1) ships ≥10 topics via the aggregator", () => {
    expect(getAskTopicsFor("the_seer").length).toBeGreaterThanOrEqual(10);
  });

  it("Vex Solène (Phase 6b.2) ships ≥10 topics via the aggregator", () => {
    expect(getAskTopicsFor("vex_solene").length).toBeGreaterThanOrEqual(10);
  });

  it("The Oracle (Phase 6b.3) ships ≥14 topics via the aggregator", () => {
    expect(getAskTopicsFor("the_oracle").length).toBeGreaterThanOrEqual(14);
  });

  it("The Degen (Phase 6c.1) ships ≥12 topics via the aggregator", () => {
    expect(getAskTopicsFor("the_degen").length).toBeGreaterThanOrEqual(12);
  });

  it("DMC Clone Companion (Phase 6c.2) ships ≥10 topics via the aggregator", () => {
    expect(
      getAskTopicsFor("dmc_clone_companion").length,
    ).toBeGreaterThanOrEqual(10);
  });

  it("The Game Master (Phase 6d.1) ships ≥10 topics via the aggregator", () => {
    expect(
      getAskTopicsFor("the_game_master").length,
    ).toBeGreaterThanOrEqual(10);
  });

  it("The Meme (Phase 6d.2 part 1) ships ≥10 topics via the aggregator", () => {
    expect(getAskTopicsFor("the_meme").length).toBeGreaterThanOrEqual(10);
  });

  it("Wraith Calder → Hierophant (Phase 6d.3 part 1) ships ≥10 topics via the aggregator", () => {
    expect(
      getAskTopicsFor("wraith_calder").length,
    ).toBeGreaterThanOrEqual(10);
  });
});
