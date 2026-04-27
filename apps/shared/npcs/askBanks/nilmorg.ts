// apps/shared/npcs/askBanks/nilmorg.ts
//
// Nilmorg ask-topics bank — Phase 6a.1 (~12 topics covering the
// canonical Foundation / History / Identity-with-multi-act-arc /
// Cosmic-refusal / Relationships / Personal categories per the
// writers'-guide spec).
//
// Voice register: Lore/Ceremony (per nilmorg.md §1.1) — clipped,
// declarative, three-to-six words per sentence; no escalation;
// the flatness IS the threat. Race Commentary register stays in
// the line bank for race-commentary surfaces; the Q&A surface
// is canonically one-on-one + reflective.
//
// Canon protections per nilmorg.md §1.5:
//   - Nilmorg does NOT explain the Severance Prize. The Cosmic
//     refusal topic enforces this — the answer canonically deflects.
//   - Nilmorg does NOT describe his own off-season state. No topic
//     attempts it.
//   - Nilmorg does NOT apologize for the Hierarchy. He is the
//     demon lord, not a reluctant servant.

import type { AskTopic } from "../askTopics";

export const NILMORG_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation ─────────────────────────────────────────────

  {
    id: "ask_nilmorg_severance",
    npcKey: "nilmorg",
    label: "Severance",
    question: "What is the Severance Prize?",
    answer:
      "A fragment is taken. A body is grown. The fragment is placed in the body. The body is paid to the winner. That is the prize.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 2,
    followUp: "ask_nilmorg_dont_explain",
    voId: "vo/nilmorg/ask_severance.mp3",
  },
  {
    id: "ask_nilmorg_dont_explain",
    npcKey: "nilmorg",
    label: "Why won't you explain?",
    question:
      "You always pay. You never explain why that's worse than not paying.",
    // Canonical refusal per DEAD_MANS_CIRCUIT_PRODUCTION.md:124. The
    // answer canonically deflects without lying — Nilmorg does not
    // hide that he refuses; he names the refusal.
    answer:
      "I keep my agreements. The terms were public. The terms remain public. The reason the terms work is not on the menu.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 2,
    voId: "vo/nilmorg/ask_dont_explain.mp3",
    setsPublicFlags: ["nilmorg_refused_to_explain_severance"],
  },
  {
    id: "ask_nilmorg_trench",
    npcKey: "nilmorg",
    label: "The Trench",
    question: "What is The Trench?",
    answer:
      "A track. A bone lane. An installation. The architecture is mine. The infrastructure is the Hierarchy's. The signatures are the clones'.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 2,
    voId: "vo/nilmorg/ask_trench.mp3",
  },

  // ─── History ────────────────────────────────────────────────

  {
    id: "ask_nilmorg_dmc_funded",
    npcKey: "nilmorg",
    label: "Who funded the DMC?",
    question: "Who funded the Dead Man's Circuit?",
    answer:
      "The oldest corporation in existence. The line item is filed. The line item has always been filed. We do not sell. We restructure. Efficiently. At scale.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 3,
    voId: "vo/nilmorg/ask_dmc_funded.mp3",
  },
  {
    id: "ask_nilmorg_wired_clones",
    npcKey: "nilmorg",
    label: "The Wired Clones",
    question: "Where did the Wired Clones come from?",
    answer:
      "Vat-grown. Splice-engineered. Awake. They knew what they were when they signed. They knew. They raced anyway.",
    unlockFlag: "nilmorg_severance_witnessed",
    unlockedFromAct: 3,
    voId: "vo/nilmorg/ask_wired_clones.mp3",
  },
  {
    id: "ask_nilmorg_bone_tier",
    npcKey: "nilmorg",
    label: "What happened at Bone?",
    question: "Bone tier — what was that originally?",
    answer:
      "An earlier installation. Smaller. Cleaner. The track was not yet hungry. I learned. I built again.",
    unlockFlag: "nilmorg_bone_tier_reached",
    unlockedFromAct: 3,
    requiresTrustBand: "Witnessed",
    voId: "vo/nilmorg/ask_bone_tier.mp3",
  },

  // ─── Identity (canonical multi-act alternate-answer arc) ────

  {
    id: "ask_nilmorg_who",
    npcKey: "nilmorg",
    label: "Who are you?",
    question: "Who are you when you're not running races?",
    // Base answer (Acts 2-3): the institutional deflection.
    answer:
      "Senior Vice President. Kinetic Acquisition. The title is the answer.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 2,
    voId: "vo/nilmorg/ask_who_act2.mp3",
    alternateAnswers: [
      {
        // Act 4 — recognition tier; the title-answer thins.
        unlockedFromAct: 4,
        answer:
          "I am the one who collects. The Hierarchy is the structure. The collection is mine.",
        voId: "vo/nilmorg/ask_who_act4.mp3",
        requiredFlag: "nilmorg_severance_witnessed",
      },
      {
        // Act 7 — Dead Man's tier; the file-keeper register lands.
        // Per §2.5 the canonical specificity-progression: spectator →
        // file-keeper → forecaster → counterparty. Act 7 = counterparty.
        unlockedFromAct: 7,
        answer:
          "I am someone you have an arrangement with now. The arrangement was always going to be with someone. It was always going to be me.",
        voId: "vo/nilmorg/ask_who_act7.mp3",
        requiredFlag: "nilmorg_severance_paid_to_player",
      },
    ],
  },

  // ─── Cosmic refusal ─────────────────────────────────────────
  // Canonical: there is something worse than not paying. He never
  // names it. The answer here gestures without disclosing.

  {
    id: "ask_nilmorg_worse_than_not_paying",
    npcKey: "nilmorg",
    label: "Worse than not paying",
    question:
      "What's worse than not paying? You said the Severance Prize is worse than not paying.",
    answer:
      "I did not say it. The architecture says it. You will know what worse means when you stop asking what worse means.",
    unlockFlag: "nilmorg_severance_paid_to_player",
    unlockedFromAct: 4,
    requiresTrustBand: "Witnessed",
    voId: "vo/nilmorg/ask_worse.mp3",
    setsPublicFlags: ["nilmorg_refused_to_explain_severance"],
  },

  // ─── Relationships ──────────────────────────────────────────

  {
    id: "ask_nilmorg_about_degen",
    npcKey: "nilmorg",
    label: "About The Degen",
    question: "What's your relationship with The Degen?",
    answer:
      "A counterparty. He places. I collect. He approves rarely. The approval is the only currency between us.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 3,
    voId: "vo/nilmorg/ask_about_degen.mp3",
  },
  {
    id: "ask_nilmorg_about_hierophant",
    npcKey: "nilmorg",
    label: "About the Hierophant",
    question: "Have you met the Hierophant?",
    answer:
      "No recorded contact. He is on Thaloria. I am in The Trench. Our portfolios do not intersect. Yet.",
    unlockFlag: "nilmorg_first_contact",
    unlockedFromAct: 4,
    voId: "vo/nilmorg/ask_about_hierophant.mp3",
  },

  // ─── Personal ───────────────────────────────────────────────

  {
    id: "ask_nilmorg_first_season",
    npcKey: "nilmorg",
    label: "Your first season",
    question: "What was your first season at the DMC?",
    answer:
      "Smaller. Quieter. The track was new. The signatures were few. I have not lost a season since. I have not been asked.",
    unlockFlag: "nilmorg_severance_witnessed",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/nilmorg/ask_first_season.mp3",
  },
  {
    id: "ask_nilmorg_lost_severance",
    npcKey: "nilmorg",
    label: "A lost Severance",
    question: "Have you ever lost a Severance Prize?",
    // Canonical: he keeps his agreements. The answer is "no" but
    // delivered as the most concentrated form of the threat — the
    // unbroken record IS the menace.
    answer:
      "No. The agreement is the architecture. Losing the prize would mean losing the architecture. I am the architecture.",
    unlockFlag: "nilmorg_severance_paid_to_player",
    unlockedFromAct: 6,
    requiresTrustBand: "Witnessed",
    voId: "vo/nilmorg/ask_lost_severance.mp3",
  },
];
