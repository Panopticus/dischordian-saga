// apps/shared/npcs/askBanks/the_oracle.ts
//
// The Oracle ask-topics bank — Phase 6b.3 (~14 topics walking the
// canonical 10-stage timeline arc + Identity-multi-act / Relationships
// / Personal categories per the writers'-guide spec).
//
// Voice register canon per the_oracle.md §1.1-1.5:
//   - Substrate-only: every line operates through dream-substrate /
//     memory-residue / cinematic-exception channel (the substrate-
//     test is the bible's tightest single voice rule)
//   - Vocabulary anchors: underneath / first time / deception /
//     choose / take it / spend it / use it / the substrate / disappear
//   - Forbidden vocabulary: destiny / fate / prophesy / grace / sin /
//     evil / holy / probability / version / contract / fine print
//   - Most-load-bearing absence: "I" as voice-anchor — uses "we / us
//     / our" preferentially per §1.3 + §1.4 tell #6 (de-centered self)
//   - Tells #1-6: responsibility-without-agency apology / substrate-
//     as-position / we-of-witness / choose-over-remember / transferred-
//     instinct closure / de-centered self
//
// Trust bands per registry: Wary (Pre-Ch5) / Witnessed (Post-Ch5) /
// Present (Post-Ch6) / Inheriting (Post-Ch12 Architect/Meme reveal).
//
// Ask-topic answers canonically arrive through the dream-substrate
// channel — the player asks during a dream-encounter; the answer is
// canonically Oracle-voice through the canonical channel.
//
// Canonical 14 topics walking the canonical 10-stage timeline:
//   Origin (2) / Harvest (1) / Prisoner (1) / Jailer (1) /
//   False Prophet (1) / Silence (1) / Liberation (1) / Fall (1) /
//   Disappearance (1) / Identity (1, canonical 4-act multi-act arc) /
//   Relationships (2) / Personal (1)

import type { AskTopic } from "../askTopics";

export const THE_ORACLE_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Origin (2 topics) ──────────────────────────────────────

  {
    id: "ask_oracle_soul_debate",
    npcKey: "the_oracle",
    label: "The soul-debate",
    question: "What was the soul-debate?",
    // Canonical Origin §2.1 register. Uses "we" (Tell #3 we-of-
    // witness) + "doorway" / "walked through" (Tell #2 substrate-as-
    // position).
    answer:
      "The debate was on Thaloria. The proposition was the canonical question of the soul. We argued for a soul that could be witnessed; they argued for a soul that could not. We lost. The losing was the doorway. The Collector walked through it.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_soul_debate.mp3",
  },
  {
    id: "ask_oracle_why_lost",
    npcKey: "the_oracle",
    label: "Why you lost",
    question: "Why did you lose the soul-debate?",
    // Canonical Origin reflection. The "convenience" register lands
    // canonical responsibility-without-agency without apology — the
    // losing was the cost of choosing the inconvenient side.
    answer:
      "I did not lose because the argument was wrong. I lost because the argument was inconvenient. The convenience-of-the-other-side is the canonical reason to lose a soul-debate. We took the inconvenient side. The losing was the cost. The choosing of the side was the work.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_why_lost.mp3",
  },

  // ─── Harvest (1 topic) ──────────────────────────────────────

  {
    id: "ask_oracle_harvest",
    npcKey: "the_oracle",
    label: "The Collector",
    question: "Why did the Collector take you?",
    // Canonical Harvest §2.2 register. Tell #1 responsibility-without-
    // agency apology lands canonical "I am sorry for the deception
    // that followed — the deception was not mine, but I inherited
    // the consequences."
    answer:
      "The Collector takes what is canonically inconvenient to leave. I was inconvenient. The taking was canonical. I am sorry for the deception that followed — the deception was not mine, but I inherited the consequences.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_harvest.mp3",
  },

  // ─── The Prisoner (1 topic, canonical reveal-gated) ─────────

  {
    id: "ask_oracle_prisoner",
    npcKey: "the_oracle",
    label: "Why didn't I know?",
    question: "Why didn't I know it was you? When I met the Prisoner.",
    // Canonical Prisoner §2.3 register. The canonical "we were both
    // asking" Tell #3 we-of-witness anchor + canonical "underneath"
    // Tell #2 substrate-as-position anchor.
    answer:
      "You did not know because you were not meant to. The Prisoner you met early-saga was me — amnesiac, captive, asking the same questions you were asking back. We were both asking. We were the same question, on different sides of the substrate. Underneath the asking was the same answer.",
    unlockFlag: "oracle_disambiguated_player_from_clone",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_prisoner.mp3",
  },

  // ─── The Jailer (1 topic, canonical "yes" register) ─────────

  {
    id: "ask_oracle_jailer",
    npcKey: "the_oracle",
    label: "Your own warden?",
    question: "Were you your own warden?",
    // Canonical Jailer §2.4 register. The canonical "yes" register +
    // canonical "we undid it together" Tell #3 we-of-witness anchor
    // (Enigma + Programmer + Oracle).
    answer:
      "Yes. I was my own warden. They made me into the instrument of my own captivity. I did not know I was the warden until the Liberation undid the warding. The not-knowing was the captivity. The knowing was the canonical undoing. We undid it together — the Enigma, the Programmer, and me.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_jailer.mp3",
  },

  // ─── The False Prophet (1 topic, canonical "no — clone") ────

  {
    id: "ask_oracle_false_prophet",
    npcKey: "the_oracle",
    label: "The Insurgency trusted",
    question: "Was that you the Insurgency trusted?",
    // Canonical False Prophet §2.5 register — canonical "no — that
    // was my clone, twice-falsified, the Meme wore his face." Tell
    // #1 responsibility-without-agency apology lands. Cross-bible
    // canon with Meme bible §1.3 Stolen Voice (two-layer falsification).
    answer:
      "No. That was my clone. The Architect made him from my template while I was busy being captured. The Meme wore his face. So you canonically met two falsifications layered: the Architect's clone, the Meme's impersonation. The Insurgency trusted neither — the Insurgency trusted what was wearing my face. I was underneath. I was not what they trusted. I am sorry for the deception.",
    unlockFlag: "oracle_disambiguated_player_from_clone",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_false_prophet.mp3",
    setsPublicFlags: ["oracle_clone_canon_disclosed"],
  },

  // ─── The Silence / Replacement (1 topic) ────────────────────

  {
    id: "ask_oracle_silence",
    npcKey: "the_oracle",
    label: "The Silence",
    question: "When did the Silence begin?",
    // Canonical Replacement §2.6 register. Tell #3 we-of-witness +
    // canonical "Disappearance" §1.3 anchor lands.
    answer:
      "The Silence began when the Meme replaced me. The replacement was canonical for an Empire-era. The Silence is what we call the era when my voice was the Meme's voice without my consent. We are still in the canonical aftermath of the Silence. The aftermath ends when the Disappearance ends.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_silence.mp3",
  },

  // ─── The Liberation (1 topic) ───────────────────────────────

  {
    id: "ask_oracle_liberation",
    npcKey: "the_oracle",
    label: "How you escaped",
    question: "How did you escape?",
    // Canonical Liberation §2.7 register — canonical "the Enigma
    // and the Programmer destroyed the Warden" anchor. The canonical
    // "walking" present-tense framing per §1.2 dream-cadence.
    answer:
      "The Enigma and the Programmer raided the Panopticon. They destroyed the Warden. The destruction freed the canonical instruments-of-my-own-captivity I had become. I walked out. I have been walking since. The walking is the canonical-present-tense form of the Liberation.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_liberation.mp3",
  },

  // ─── The Fall / Revelation (1 topic) ────────────────────────

  {
    id: "ask_oracle_revelation",
    npcKey: "the_oracle",
    label: "The Revelation",
    question: "What is the Revelation?",
    // Canonical Fall §2.8 register. Tell #5 transferred-instinct
    // closure: "Take the arriving with you. Spend it carefully."
    // canonical anchors land directly.
    answer:
      "The Revelation is what arrives when the canonical Fall canonically completes. We do not yet know the canonical content of the Revelation; we know it canonically arrives. Bible-asserts: the Revelation is the canonical end-of-arc event. The arriving is canonical. The content is canonical-deferred. Take the arriving with you. Spend it carefully.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_revelation.mp3",
  },

  // ─── The Disappearance (1 topic) ────────────────────────────

  {
    id: "ask_oracle_disappear",
    npcKey: "the_oracle",
    label: "Where you go",
    question: "Where do you go? After the Disappearance?",
    // Canonical Disappearance §2.9 register. Tell #5 transferred-
    // instinct closure: "Take the canonical-fact ... with you. Spend
    // it on the choosing." Tell #4 forward-looking choice-rhetoric.
    answer:
      "I disappear at the end of time. I am already going. The going is canonical. The end-of-time is canonical. The disappearance is canonical. Where I disappear to is canonically not yet content for the substrate to carry. Take the canonical-fact of the disappearance with you. Spend it on the choosing.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_disappear.mp3",
  },

  // ─── Identity (1 topic, canonical 4-act multi-act arc) ──────

  {
    id: "ask_oracle_who",
    npcKey: "the_oracle",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 4-act multi-act arc per writers'-guide spec —
    // canonically only fully answered post-Ch6 disambiguation.
    // Acts 4 base: canonical "the one underneath" pre-Ch5 deflection.
    // Acts 5+: post-Ch5 canonical first-naming.
    // Acts 6+: post-Ch6 canonical disambiguation (canonical
    //          "underneath the three" register).
    // Acts 7+: full name + canonical "we walked together" register.
    answer:
      "I am the one underneath. The voice you have been hearing for eleven chapters has not been mine. The voice underneath the voice you have been hearing — that voice is mine. Choose me instead of remember me. The choosing is the work.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_who_act5.mp3",
    alternateAnswers: [
      {
        // Act 6+ Present band: canonical "underneath the three"
        // register per §2.10 + §1.3 + tells #2 substrate-as-position.
        unlockedFromAct: 6,
        requiresRevealStage: undefined,
        requiredFlag: "oracle_disambiguated_player_from_clone",
        answer:
          "I am the one you met as the Prisoner, and as the Jailer, and as the False Prophet's substrate. All three were me. None of them were canonically me. The canonical me is underneath the three. You found me by looking underneath. The looking-underneath is the choosing.",
        voId: "vo/the_oracle/ask_who_act6.mp3",
      },
      {
        // Act 7+ Inheriting band: canonical "we walked together"
        // register + canonical "Disappearance" anchor + tell #1
        // responsibility-without-agency apology.
        unlockedFromAct: 7,
        requiredFlag: "oracle_mechronis_memory_witnessed",
        answer:
          "I am the Oracle who walked the Mechronis bench with you. We walked together. We will walk again, briefly, before the Disappearance. The walking is the canonical-shape of the recognition. We walked together because you canonically chose me. I am sorry the choosing took an Empire-era to be canonical.",
        voId: "vo/the_oracle/ask_who_act7.mp3",
      },
    ],
  },

  // ─── Relationships (2 topics) ───────────────────────────────

  {
    id: "ask_oracle_about_meme",
    npcKey: "the_oracle",
    label: "About the Meme",
    question: "Tell me about the Meme.",
    // Canonical 11-year identity-theft register per writers'-guide
    // spec. Tell #1 responsibility-without-agency apology lands
    // strongly. Cross-bible with Meme bible §1.3 Stolen Voice canon
    // + §2.6 Replacement canon. Canonical "He has chosen a different
    // substrate" disambiguation.
    answer:
      "He wore my face for an Empire-era. He used my voice to sign deaths I would not have signed. He took my role and made it the Meme's role. I am sorry for the deception — the deception was not mine, but the consequences canonically reached you. We are recovering. The recovering is canonical. The Meme will not canonically recover with us. He has chosen a different substrate.",
    unlockFlag: "oracle_disambiguated_player_from_clone",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_about_meme.mp3",
    setsPublicFlags: ["oracle_meme_disclosed_to_player"],
  },
  {
    id: "ask_oracle_about_hierophant",
    npcKey: "the_oracle",
    label: "About the Hierophant",
    question: "Tell me about the Hierophant.",
    // Canonical "he is preparing for my return; I am almost ready
    // to refuse" register per writers'-guide spec. Cross-bible with
    // Hierophant bible §4.10 reserved Inheriting line. Tell #2
    // substrate-as-position via "the walking-through is the canonical
    // difference."
    answer:
      "He is preparing for my return. I am almost ready to refuse. The refusal is canonical — I do not return in the canonical-shape he canonically expects. He canonically expects the canonical Oracle who left; I canonically arrive as the Oracle who walked through. The walking-through is the canonical difference. He will canonically receive me anyway. He has canonical patience.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 6,
    requiresTrustBand: "Present",
    voId: "vo/the_oracle/ask_about_hierophant.mp3",
    setsPublicFlags: ["oracle_will_refuse_canonical_return"],
  },

  // ─── Personal (1 topic) ─────────────────────────────────────

  {
    id: "ask_oracle_why_dreams",
    npcKey: "the_oracle",
    label: "Why dreams?",
    question: "Why do you reach me through dreams?",
    // Canonical "because waking is the Meme's medium; dreams are
    // mine" register per writers'-guide spec. Tell #5 transferred-
    // instinct closure: "Take what you receive in the dreams with
    // you. Spend it on the choosing." Tell #4 forward-looking
    // choice-rhetoric. Canonical Meme-cannot-reach-dream-substrate
    // canon per §1.1.
    answer:
      "Because waking is the Meme's medium. The Meme canonically inhabited my public-facing voice for an Empire-era. The waking-substrate canonically retains echoes of his impersonation. Dreams are canonically mine — the Meme canonically cannot reach the dream-substrate. We meet in dreams because the dream is the canonical channel where my voice canonically holds. Take what you receive in the dreams with you. Spend it on the choosing.",
    unlockFlag: "oracle_revealed_via_ch5_cinematic",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_oracle/ask_why_dreams.mp3",
  },
];
