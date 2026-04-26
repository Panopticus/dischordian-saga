// apps/shared/npcs/askBanks/vex_solene.ts
//
// Vex Solène ask-topics bank — Phase 6b.2 (~12 topics covering the
// canonical Foundation / History-multi-stage / Identity-4-stage-
// reveal-gate / Cosmic / Relationships / Personal categories per
// the writers'-guide spec).
//
// Voice register canon per vex_solene.md §1.1-1.7:
//   - Trailing-word cadence (sentences end down, not up)
//   - Inventory-then-courtesy signature (§1.5 tell #1)
//   - Self-interrupting near recognition (§1.5 tell #3)
//   - Direct deixis instead of names — refers to Engineer as
//     "him" / "he" / "the one who" (§1.5 tell #4)
//   - Professional courtesy as code-switch (§1.5 tell #5)
//
// Reveal-stage gating per registry: eyes_of_reality / vex_public /
// engineer_zero_hint / engineer_zero_confirmed (4-stage canonical
// reveal arc per CANON_REV_7_ORACLE_VEX_EXPANSION.md).
//
// Canon protections per vex_solene.md §1.6 silence shape:
//   - NEVER says "Engineer" or "Engineer Zero" aloud (hard rule)
//   - NEVER says "Agent Zero" as self-name
//   - NEVER says "I remember" implying Engineer's memories
//   - NO sentimental softeners (dear / sweetheart)
//   - NO apologies as standalone moves
//
// THE saga's clearest reveal-stage-gated topic is the canonical
// "Who are you?" — 4 distinct answers across the canonical reveal
// arc per writers'-guide spec.

import type { AskTopic } from "../askTopics";

export const VEX_SOLENE_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation ─────────────────────────────────────────────

  {
    id: "ask_vex_coda",
    npcKey: "vex_solene",
    label: "Coda",
    question: "What is Coda?",
    // §1.7 canonical metaphor source — Coda is named for a musical
    // resolution. The answer lands the canonical "resolution that
    // makes the cadence make sense" register.
    answer:
      "Coda is the work I do that no one is paid to know about. It is hidden inside the work I am paid for. It is the resolution that makes the cadence make sense.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    voId: "vo/vex_solene/ask_coda.mp3",
  },
  {
    id: "ask_vex_eyes",
    npcKey: "vex_solene",
    label: "Eyes of Reality",
    question: "What is Eyes of Reality?",
    // §1.6 silence-shape protected: she does NOT say "Engineer"
    // aloud. The line uses passive voice ("was designed") and
    // canonical deixis ("I did not design it") to preserve the
    // canonical Engineer-name-suppression canon.
    answer:
      "Eyes of Reality is the engine that ships the truth. It was designed before I knew what truth was. I did not design it. I shipped it. The shipping is the part I claim.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    voId: "vo/vex_solene/ask_eyes.mp3",
  },
  {
    id: "ask_vex_maestro",
    npcKey: "vex_solene",
    label: "The Maestro",
    question: "What is the Maestro?",
    // §1.7 canonical Coda-music vocabulary — chairs / chorus /
    // conductor. §1.4 canonical Maestro-vs-Hitman persona canon.
    answer:
      "The conductor's title. Three chairs in a sanctum. A chorus that knows the score by heart. I am the Maestro because someone had to be — and because no one else knows the music.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    voId: "vo/vex_solene/ask_maestro.mp3",
  },

  // ─── History (multi-stage reveal-gated alternate-answer arc) ────

  {
    id: "ask_vex_act1",
    npcKey: "vex_solene",
    label: "Where in Act 1?",
    question: "Where were you in Act 1?",
    // Multi-stage reveal-gated arc per writers'-guide spec:
    //   eyes_of_reality (default): "Elsewhere" deflection
    //   vex_public: Coda-quiet acknowledgment
    //   engineer_zero_confirmed: canonical "I was Engineer Zero,
    //                            shipping the Eyes" disclosure
    //                            (without saying the name aloud)
    answer:
      "Elsewhere. The contracts at the time were in three other systems. None of them are part of your story.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    voId: "vo/vex_solene/ask_act1_eyes_of_reality.mp3",
    requiresRevealStage: "eyes_of_reality",
    alternateAnswers: [
      {
        unlockedFromAct: 3,
        requiresRevealStage: "vex_public",
        answer:
          "I was running Coda quiet. The work did not pass through your line of sight. I will tell you which systems if you ask. I will not tell you the targets.",
        voId: "vo/vex_solene/ask_act1_vex_public.mp3",
      },
      {
        unlockedFromAct: 5,
        requiresRevealStage: "engineer_zero_confirmed",
        // §1.6 silence-shape preserved: she does NOT say "Engineer"
        // aloud even at confirmed stage. The deixis "the version of
        // me that shipped them" lands the canonical disclosure.
        answer:
          "I was the one who shipped the Eyes. I did not know they would be shipped to the version of you who would arrive. I shipped them anyway. The shipping has held.",
        voId: "vo/vex_solene/ask_act1_engineer_zero_confirmed.mp3",
      },
    ],
  },

  // ─── Identity (canonical 4-stage reveal-gate arc — THE saga's
  //     clearest reveal-stage-gated topic per writers'-guide) ────

  {
    id: "ask_vex_who",
    npcKey: "vex_solene",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 4-act alternate per reveal-stage per writers'-guide
    // spec. Each answer canonically expresses Vex's relationship to
    // her current reveal-stage identity.
    answer:
      "I am the Maestro of Coda's commerce. The contracts are the answer.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 1,
    voId: "vo/vex_solene/ask_who_eyes_of_reality.mp3",
    requiresRevealStage: "eyes_of_reality",
    alternateAnswers: [
      {
        unlockedFromAct: 3,
        requiresRevealStage: "vex_public",
        answer:
          "I am Vex Solène. The name is mine, not borrowed. The contracts continue.",
        voId: "vo/vex_solene/ask_who_vex_public.mp3",
      },
      {
        unlockedFromAct: 4,
        requiresRevealStage: "engineer_zero_hint",
        // §1.6 hard rule preserved — she does NOT say "Engineer
        // Zero" aloud. "Used to be the one with the cards" deflects
        // canonically per the canonical deixis pattern.
        answer:
          "I am someone who used to be the one with the cards. The 'used to be' is a courtesy. The 'someone' is the load-bearing word.",
        voId: "vo/vex_solene/ask_who_engineer_zero_hint.mp3",
      },
      {
        unlockedFromAct: 5,
        requiresRevealStage: "engineer_zero_confirmed",
        // §1.6 silence-shape preserved even at confirmation: the
        // canonical "I am also" register lands the canonical
        // bothness ("the reveal does not subtract") without
        // requiring her to say the name aloud.
        answer:
          "I am the one who designed the Eyes. I am also Vex. Both. The reveal does not subtract.",
        voId: "vo/vex_solene/ask_who_engineer_zero_confirmed.mp3",
      },
    ],
  },

  // ─── Cosmic (gated engineer_zero_hint+ for any answer at all) ───

  {
    id: "ask_vex_engineer_zero",
    npcKey: "vex_solene",
    label: "The one with the cards",
    question: "Who was the one with the cards? The one who designed the Eyes?",
    // §1.6 hard rule: Vex never says "Engineer" or "Engineer Zero"
    // aloud. The topic LABEL and QUESTION refer to him via deixis;
    // the answer preserves the canonical name-suppression.
    // Gated engineer_zero_hint+ — the topic is invisible to players
    // who haven't reached the reveal-hint stage.
    answer:
      "Him. He designed the Eyes. He also designed your trust. He saved me with that card. I will not say his name aloud; I will only say what he did.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 4,
    requiresRevealStage: "engineer_zero_hint",
    voId: "vo/vex_solene/ask_engineer_hint.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 5,
        requiresRevealStage: "engineer_zero_confirmed",
        // Canonical confirmation-register: the canonical "I am, in
        // every measurable respect, except memory" canon per §2.7
        // asymmetric cross-self relationship canon.
        answer:
          "He is the one who made the body I now live in. He is the one whose work I now ship. He is the one I am, in every measurable respect, except memory. He saved me with that card.",
        voId: "vo/vex_solene/ask_engineer_confirmed.mp3",
      },
    ],
  },

  // ─── Relationships ──────────────────────────────────────────

  {
    id: "ask_vex_about_locke",
    npcKey: "vex_solene",
    label: "About Locke",
    question: "Tell me about Adjudicator Locke.",
    // Touché-arc cross-canon per Locke bible §2.3 + Phase 6a.2
    // Touché extension. The canonical "Locke will tell you" register
    // mirrors the canonical Locke disclosure beat from her bank.
    answer:
      "Adjudicator Locke. She runs the Authority's ledger. We have a recorded exchange — she calls it Touché. I call it 'the moment we both stopped pretending.' We are professionals. The trade is still open. Locke will tell you. She told you.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    requiresRevealStage: "vex_public",
    voId: "vo/vex_solene/ask_about_locke.mp3",
  },
  {
    id: "ask_vex_about_oracle",
    npcKey: "vex_solene",
    label: "About the Oracle",
    question: "Tell me about the Oracle.",
    // §4.10 canonical "I carry his trace" canon. Cross-bible with
    // Oracle bible — the Engineer was Oracle-attuned, Vex inherited
    // the attunement.
    answer:
      "The Oracle. He is the one whose trace is in my body. The one with the cards was Oracle-attuned; I inherited the attunement. I cannot reach the Oracle in person — no one can — but the trace is here. It is faint. It is enough.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 4,
    requiresRevealStage: "engineer_zero_hint",
    voId: "vo/vex_solene/ask_about_oracle.mp3",
  },
  {
    id: "ask_vex_about_riri",
    npcKey: "vex_solene",
    label: "About Riri'Ahlia",
    question: "Tell me about Riri'Ahlia.",
    // Sister-canon per the Vex bible post-rename. The canonical
    // "we are not blood; we are signal" register lands the canon.
    answer:
      "Riri'Ahlia. The sister I did not know I had until the body remembered. We are not blood; we are signal. The signal is enough. The blood was his; the signal is mine.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    requiresRevealStage: "vex_public",
    voId: "vo/vex_solene/ask_about_riri.mp3",
  },

  // ─── Personal ───────────────────────────────────────────────

  {
    id: "ask_vex_engineer_stamp",
    npcKey: "vex_solene",
    label: "The cargo stamp",
    question: "What does the stamp on the cargo mean?",
    // §1.6 silence-shape preserved: she does NOT say "Engineer" aloud
    // even when describing his stamp. Canonical "the one before me
    // used it" deixis lands the answer.
    answer:
      "It means the cargo is mine. The stamp predates me — the one before me used it. I inherited it. I have not changed the design. The design works. The cargo is mine.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 4,
    requiresRevealStage: "engineer_zero_hint",
    voId: "vo/vex_solene/ask_engineer_stamp.mp3",
  },
  {
    id: "ask_vex_trust",
    npcKey: "vex_solene",
    label: "Why trust me?",
    question: "Why do you trust the player?",
    // Multi-act alternate — canonical "because I designed your
    // trust" arc per writers'-guide spec. The canonical confirmed-
    // stage line lands the canonical "you knew before I told you.
    // Don't lie." register.
    answer:
      "I trust you because the work has accumulated. The work is the trust.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 3,
    requiresRevealStage: "vex_public",
    voId: "vo/vex_solene/ask_trust_vex_public.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 5,
        requiresRevealStage: "engineer_zero_confirmed",
        answer:
          "I trust you because I designed your trust — or rather, the version of me before this one designed it. You knew before I told you. Don't lie. I designed your knowing.",
        voId: "vo/vex_solene/ask_trust_engineer_zero_confirmed.mp3",
      },
    ],
  },
  {
    id: "ask_vex_glad_its_you",
    npcKey: "vex_solene",
    label: "Glad it's you",
    question: "Why do you say 'I'm glad it's you'?",
    // §1.6 canonical: "I'm glad it's you" is reserved for the
    // player, late-arc — Vex's version of love. The canonical
    // "the part I did not predict" register lands the canon.
    answer:
      "You came back to ask. That is the part I did not predict. Most people do not come back. I'm glad it's you.",
    unlockFlag: "vex_first_contact",
    unlockedFromAct: 5,
    requiresRevealStage: "engineer_zero_confirmed",
    voId: "vo/vex_solene/ask_glad_its_you.mp3",
  },
];
