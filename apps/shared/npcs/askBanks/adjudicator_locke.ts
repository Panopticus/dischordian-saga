// apps/shared/npcs/askBanks/adjudicator_locke.ts
//
// Adjudicator Locke ask-topics bank — Phase 6a.2 (~12 topics covering
// the canonical Foundation / History / Identity-with-multi-act-arc /
// Cosmic / Relationships / Personal categories per the writers'-guide
// spec).
//
// Voice register: complete declarative sentences, then qualifies; the
// canonical 3-beat (assertion / reframing / close) per
// adjudicator_locke.md §1.1; aphoristic close at end of paragraphs;
// finance-as-default-metaphor lexicon (§1.2). Trust bands per
// registry: Prospect / Client / Partner / Insider / Adjudicated.
//
// Canon protections per adjudicator_locke.md §1.5:
//   - She will NOT name her superiors. The "Authority" is collective.
//     The six coffin-minds are referenced as a structure, never as
//     individuals. The Authority topics describe the structure.
//   - She will NOT name the deal that cost her the eye. Canon mystery.
//     No topic attempts it.
//   - She will NOT express regret as regret. Memory-of-loss is filed
//     as accounting-of-debt.
//   - She will NOT plead. Even cornered, she negotiates.

import type { AskTopic } from "../askTopics";

export const ADJUDICATOR_LOCKE_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation ─────────────────────────────────────────────

  {
    id: "ask_locke_authority",
    npcKey: "adjudicator_locke",
    label: "The Authority",
    question: "What is the Authority?",
    // §1.5 protected: she will NOT name the six coffin-minds. The
    // answer describes the structure without naming individuals.
    answer:
      "Six minds in red crystal. Collective designation: the Authority. They do not appear in person. I do. The arrangement has worked for centuries. It will work for centuries more.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 1,
    voId: "vo/adjudicator_locke/ask_authority.mp3",
  },
  {
    id: "ask_locke_adjudicator",
    npcKey: "adjudicator_locke",
    label: "What you do",
    question: "What does an Adjudicator actually do?",
    answer:
      "I render verdicts on transactions other brokers refuse to touch. Cases too strange. Too expensive. Too dangerous. The standard ledger cannot categorize them. I categorize them anyway.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 1,
    voId: "vo/adjudicator_locke/ask_adjudicator.mp3",
  },
  {
    id: "ask_locke_ledger",
    npcKey: "adjudicator_locke",
    label: "The ledger",
    question: "What is the ledger?",
    // §1.4 tell #4 — the deferred threat. The answer logs without
    // moralizing; the structure does the work.
    answer:
      "Every transaction the Authority has executed. Every name in it remains in it. The ledger does not forget. Neither do I.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 1,
    voId: "vo/adjudicator_locke/ask_ledger.mp3",
  },

  // ─── History ────────────────────────────────────────────────

  {
    id: "ask_locke_became_adjudicator",
    npcKey: "adjudicator_locke",
    label: "How you became this",
    question: "How did you become Adjudicator?",
    answer:
      "I was not promoted. I was installed. The Authority required someone who could write the fine print on treaties they would never sign personally. I had been writing fine print for centuries. The job recognized me before I recognized it.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 2,
    voId: "vo/adjudicator_locke/ask_became.mp3",
  },
  {
    id: "ask_locke_first_contract",
    npcKey: "adjudicator_locke",
    label: "Your first contract",
    question: "What was your first contract?",
    // Multi-act alternate-answer arc: Acts 1-3 the deflection-aphorism
    // closes the paragraph; Acts 4+ the canonical specificity arrives.
    answer:
      "The first deal is a handshake. After that, it gets specific. Mine got specific quickly. I learned the lesson, my dear: the inaugural contract is what you read in the documents your successor inherits.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 1,
    voId: "vo/adjudicator_locke/ask_first_contract_act1.mp3",
    alternateAnswers: [
      {
        // §1.2 finance-vocabulary specificity rises with trust per §2.4.
        unlockedFromAct: 4,
        answer:
          "Centuries ago, in a polity that has since rebranded twice. I traded a man's reputation for a coffin-mind's silence. Both parties are still in business. So am I.",
        voId: "vo/adjudicator_locke/ask_first_contract_act4.mp3",
      },
    ],
  },

  // ─── Identity (canonical multi-act alternate-answer arc) ────

  {
    id: "ask_locke_who",
    npcKey: "adjudicator_locke",
    label: "Who are you?",
    question: "Who are you when you're not adjudicating?",
    // Per writers'-guide spec: canonical 3-act alternate arc:
    //   Acts 1+: "I am the Adjudicator" (institutional)
    //   Acts 4+: "I am what the Authority assigned me to be" (role)
    //   Acts 7+: "I am the version of the Authority that survived
    //            believing in it" (canonical love-of-the-work canon)
    answer:
      "I am the Adjudicator. The role is the answer. The role is also the workload. There is not much left over.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 1,
    voId: "vo/adjudicator_locke/ask_who_act1.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        answer:
          "I am what the Authority assigned me to be. There is no version of me that pre-existed the assignment that anyone aboard this ship would recognize. There may be no version that pre-existed the assignment at all.",
        voId: "vo/adjudicator_locke/ask_who_act4.mp3",
        requiresRevealStage: undefined,
      },
      {
        unlockedFromAct: 7,
        answer:
          "I am the version of the Authority that survived believing in it. The believing was a long time ago. The surviving is ongoing. My dear — that is the closest answer you will receive from anyone in my position.",
        voId: "vo/adjudicator_locke/ask_who_act7.mp3",
        requiredFlag: "locke_partner_band_reached",
      },
    ],
  },

  // ─── Cosmic ─────────────────────────────────────────────────

  {
    id: "ask_locke_authority_wants",
    npcKey: "adjudicator_locke",
    label: "What the Authority wants",
    question: "What does the Authority want?",
    // Canonical endgame canon per §3.8: peace is bankruptcy, victory
    // is obsolescence. The Authority's true interest is perpetual
    // managed conflict.
    answer:
      "The game to keep going. Peace is bankruptcy. Victory is obsolescence. The Authority cannot afford either. Neither can I.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 4,
    requiresTrustBand: "Partner",
    voId: "vo/adjudicator_locke/ask_authority_wants.mp3",
  },
  {
    id: "ask_locke_broken_contracts",
    npcKey: "adjudicator_locke",
    label: "Broken contracts",
    question: "What happens to broken contracts?",
    // §1.4 tell #4 — deferred threat. She does not retaliate; the
    // ledger does. The line itself is the threat structure.
    answer:
      "They are filed. They are remembered. They are referenced in the next negotiation. I do not retaliate. The ledger does.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 2,
    voId: "vo/adjudicator_locke/ask_broken.mp3",
  },

  // ─── Relationships ──────────────────────────────────────────

  {
    id: "ask_locke_about_vex",
    npcKey: "adjudicator_locke",
    label: "About Vex / Zero",
    question: "Tell me about Agent Zero. About Vex Solène.",
    // §2.3 canonical Touché disclosure. Locke confirms her one
    // recorded peer-respect relationship. Writes a public flag so
    // Vex's Phase 6b banks can react canonically.
    answer:
      "Agent Zero. I was supposed to assume she was dead. She was supposed to assume I was neutral. We had a moment of mutual professional surprise. Then we agreed to trade secrets later. Some later still has not arrived.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 3,
    requiresTrustBand: "Client",
    voId: "vo/adjudicator_locke/ask_about_vex.mp3",
    setsPublicFlags: ["locke_disclosed_zero_agent_history"],
  },
  {
    id: "ask_locke_about_antiquarian",
    npcKey: "adjudicator_locke",
    label: "About Daniel Cross",
    question: "Tell me about Daniel Cross. About the Antiquarian.",
    // §4.4 canonical complex relationship. Polite hostility between
    // two specialists who claim the same artifact. The audit canon
    // is canonical-mutual.
    answer:
      "The Antiquarian preserves what I would prefer to appraise. The Antiquarian is auditing me. He will discover I am auditing him in return. We are professionals. Both audits will be quiet.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 3,
    requiresTrustBand: "Client",
    voId: "vo/adjudicator_locke/ask_about_antiquarian.mp3",
    setsPublicFlags: ["locke_disclosed_antiquarian_audit"],
  },

  // ─── Personal ───────────────────────────────────────────────

  {
    id: "ask_locke_trade_coin",
    npcKey: "adjudicator_locke",
    label: "The Trade Coin",
    question: "What's the Trade Coin you sent me?",
    // Partner-band keepsake unlock per §2.4. The canonical "monetary
    // policy" line per §1.6 — flirtation as monetary doctrine.
    answer:
      "You wish to know about the coin. Heads I win. Tails you lose. That is not a joke. That is monetary policy. Keep the coin. It is the only object I have authorized to leave my custody. Do not ask why I authorized it. You will price the answer correctly when you stop wanting it.",
    unlockFlag: "locke_partner_band_reached",
    unlockedFromAct: 4,
    requiresTrustBand: "Partner",
    voId: "vo/adjudicator_locke/ask_trade_coin.mp3",
  },
  {
    id: "ask_locke_cancelled_contract",
    npcKey: "adjudicator_locke",
    label: "A cancelled contract",
    question: "Have you ever cancelled a contract?",
    // §1.5 silence shape: she will not express regret as regret.
    // The line documents the exception without naming the cost.
    // Insider band gates this — the player has earned operational
    // disclosure.
    answer:
      "Once. The terms shifted under me. The other party did not survive the shift. I cancelled the contract before the shift could land in the ledger. The ledger has no record. I do.",
    unlockFlag: "locke_first_contact",
    unlockedFromAct: 5,
    requiresTrustBand: "Insider",
    voId: "vo/adjudicator_locke/ask_cancelled.mp3",
  },
];
