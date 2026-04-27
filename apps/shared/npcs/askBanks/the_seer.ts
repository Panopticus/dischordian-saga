// apps/shared/npcs/askBanks/the_seer.ts
//
// The Seer ask-topics bank — Phase 6b.1 (~12 topics covering the
// canonical Foundation / History / Identity-multi-act-arc / Cosmic /
// Relationships / Personal categories per the writers'-guide spec).
//
// Voice register canon per the_seer.md §1.1 — three registers gated
// by trust band:
//   - Cold (Wary): patient, prophecy-overhead full-payload
//   - Warm (Witnessed): direct prose, prophecy-overhead drops
//   - Confidant (Inheriting): domestic-vocabulary; canonical
//     "the door is open. The tea is in the second cupboard on the
//     left." register
//
// The single load-bearing voice rule (§1.5): every Seer line either
// contains a prediction or contains a public revision of a prior
// prediction. The Confidant-register exception class: domestic
// preparation-as-implicit-prediction (the player's arrival was
// foreseen, and the cupboard reflects it).
//
// Canon protections per the_seer.md §1.5 + §2.5:
//   - NO "destiny" / "fate" / "fated" / "destined" — most-load-bearing
//     absence per §1.3
//   - NO origin narration — her pre-Mechronis past is canon-protected
//     (§7.2). Topics ask about Mechronis onward, not before.
//   - NO live-conversation framing — every line is canonically a
//     pre-recording from before the Epoch-2 sealing per §2.3
//   - The canonical Mechronis match was singular per §1.5; the
//     "I will not raise my staff" anchor stays in the existing
//     bank line, not in any ask-topic answer.

import type { AskTopic } from "../askTopics";

export const THE_SEER_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation ─────────────────────────────────────────────

  {
    id: "ask_seer_bench",
    npcKey: "the_seer",
    label: "The bench",
    question: "What is the bench?",
    // Canonical Cold-register answer per §1.3 vocabulary canon —
    // "the bench" / "the bench has learned" anchor.
    answer:
      "The bench is the place where the next student will sit. The bench has learned. The bench will learn again. What you do at the bench becomes the lesson the next bench-sitter receives. I have been measuring you against benches since you walked in.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 1,
    voId: "vo/the_seer/ask_bench.mp3",
  },
  {
    id: "ask_seer_precognition",
    npcKey: "the_seer",
    label: "Precognition",
    question: "What is precognition, the way you do it?",
    // §1.3 canonical "probability table" / "redact" register.
    // Probability-table-as-question canonical tell (§1.4 #5).
    answer:
      "Precognition is a measurement. I read the table; I report what is on it. The table is large. The reading is honest. Some columns I redact when reading aloud — which columns is your question, not mine.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 1,
    voId: "vo/the_seer/ask_precognition.mp3",
  },
  {
    id: "ask_seer_staff",
    npcKey: "the_seer",
    label: "The staff",
    question: "What does the staff do?",
    // §1.3 + §2.2 canonical: the staff is left at Mechronis on the
    // bench. The line is prediction-bearing per §1.5 voice rule —
    // "It has not been raised since" is a canonical-claim about
    // what the bench will keep doing.
    answer:
      "The staff is a measuring instrument. I do not raise it when the match has been settled before the match. I left mine at Mechronis. The bench keeps it. It has not been raised since.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 1,
    voId: "vo/the_seer/ask_staff.mp3",
  },

  // ─── History ────────────────────────────────────────────────

  {
    id: "ask_seer_mechronis",
    npcKey: "the_seer",
    label: "Why Mechronis?",
    question: "Why did you go to Mechronis Academy?",
    // §2.1 canonical: she visited once, played one match, did not
    // raise her staff. The lesson was the shape of the next twelve
    // seasons. Prediction-bearing per §1.5.
    answer:
      "I went once. I played one match. I did not raise my staff. The Academy talked about it for a year. They were right to. The match was the shape of the lesson; the lesson was the shape of the next twelve seasons.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 1,
    voId: "vo/the_seer/ask_mechronis.mp3",
  },
  {
    id: "ask_seer_sealed",
    npcKey: "the_seer",
    label: "The sealing",
    question: "Why did you seal yourself?",
    // §2.5 canonical: only fully answerable at Inheriting band.
    // The base Acts 1+ register canonically refuses to narrate the
    // shape of the answer ("we do not have a closed door"); Acts
    // 5+ Witnessed reveals the canonical end-of-Epoch-2 + Dreamer's
    // shield disclosure; Acts 7+ Inheriting confidant-register lands
    // canonical "tea is in the second cupboard" anchor per §1.3.
    answer:
      "I do not answer this on an open channel. The shape of the answer requires a closed door. We do not have a closed door. Ask me at the bench.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 3,
    voId: "vo/the_seer/ask_sealed_act3.mp3",
    alternateAnswers: [
      {
        // Acts 5+ Witnessed-band reveal
        unlockedFromAct: 5,
        answer:
          "I sealed myself at the end of Epoch 2. The Dreamer's shield is what closes around me. The shield exists for a reason that is canon. The reason is not on this channel.",
        voId: "vo/the_seer/ask_sealed_act5.mp3",
        requiredFlag: "seer_first_laughter_received",
      },
      {
        // Acts 7+ Inheriting Confidant-register
        unlockedFromAct: 7,
        answer:
          "I sealed because I had finished recording. The recordings continue. They are reaching you now. The sealing was the end of the work; the playing-back is what you call the work, but the work was already done. Tea is in the second cupboard on the left.",
        voId: "vo/the_seer/ask_sealed_act7.mp3",
        requiresRevealStage: undefined,
      },
    ],
  },

  // ─── Identity (canonical 3-act alternate-answer arc) ────────

  {
    id: "ask_seer_who",
    npcKey: "the_seer",
    label: "Who are you?",
    question: "Who are you?",
    // Per writers'-guide canonical 3-act alternate arc:
    //   Acts 1+: "I am the one who already knows" (Cold register)
    //   Acts 4+: "I am the version of the prophet I chose to leave
    //            behind" (Warm — version-pivot tell per §1.4 #1)
    //   Acts 7+: "I am a recording that has been waiting for you"
    //            (Confidant — pre-recorded canon per §2.3)
    answer:
      "I am the one who already knows.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 1,
    voId: "vo/the_seer/ask_who_act1.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        answer:
          "I am the version of the prophet I chose to leave behind. The version was kindest to the next bench-sitter; that was the deciding metric. The leaving was a version pivot. I was wrong about which version of myself to keep — and the version is better.",
        voId: "vo/the_seer/ask_who_act4.mp3",
      },
      {
        unlockedFromAct: 7,
        answer:
          "I am a recording that has been waiting for you. The waiting is fair. The recording predicted you would ask.",
        voId: "vo/the_seer/ask_who_act7.mp3",
      },
    ],
  },

  // ─── Cosmic ─────────────────────────────────────────────────

  {
    id: "ask_seer_dreamer_shield",
    npcKey: "the_seer",
    label: "The Dreamer's shield",
    question: "What is the Dreamer's shield?",
    // Canonical-deferred per SCB-3 (writers'-guide ticket): the
    // shield does not permit narration of itself from inside it.
    // The line redirects to the Hierophant — canonical cross-bible
    // bridge per §4.3.
    answer:
      "The Dreamer's shield is canonically deferred. I do not narrate it; the shield does not permit narration of itself from inside it. Ask the Hierophant. He is preparing for someone who knows.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 3,
    voId: "vo/the_seer/ask_dreamer_shield.mp3",
  },
  {
    id: "ask_seer_return",
    npcKey: "the_seer",
    label: "Will you come back?",
    question: "Will you come back when the seal lifts?",
    // Canonical refusal — "no". Recordings do not return; they play.
    // Prediction-bearing per §1.5: "When you stop hearing me, the
    // recording is finished" predicts the canonical end-state.
    answer:
      "No. I will not come back. I am a recording. Recordings do not return. They play. You are hearing me play. When you stop hearing me, the recording is finished, not gone — finished.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 4,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_seer/ask_return.mp3",
  },

  // ─── Relationships ──────────────────────────────────────────

  {
    id: "ask_seer_about_oracle",
    npcKey: "the_seer",
    label: "About the Oracle",
    question: "Tell me about the Oracle.",
    // §4.5 canonical "I am waiting for him too" register. The
    // canonical shared-waiting canon between Seer-in-seal and
    // Oracle-in-hiding.
    answer:
      "He is in hiding. I am in seal. We have not met since before either of us decided which of us was waiting for the other. I am waiting for him too. The waiting is fair. Both of our waitings are fair.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 3,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_seer/ask_about_oracle.mp3",
  },
  {
    id: "ask_seer_about_hierophant",
    npcKey: "the_seer",
    label: "About the Hierophant",
    question: "Tell me about the Hierophant.",
    // §4.3 canonical "more wall" exchange canon. The canonical
    // one-sentence-each professional-respect canon between Seer and
    // Hierophant.
    answer:
      "He once asked me what I see for the wall. I told him: more wall. He thanked me. He has been adding names to the wall ever since. We exchanged one sentence each. That was enough. We are professionals.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 3,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_seer/ask_about_hierophant.mp3",
  },
  {
    id: "ask_seer_about_programmer",
    npcKey: "the_seer",
    label: "About Daniel Cross",
    question: "Tell me about Daniel Cross. About the Programmer.",
    // §4.6 canonical "I laughed at the Programmer" register. The
    // Programmer / Antiquarian is canonical specific-shelf material
    // per §1.4 tell #4 (category sentence — "specific shelf").
    answer:
      "Daniel Cross. The Programmer. He has a category of his own — a specific shelf. I laughed at him once. It was the loudest I have laughed in this register. He is the only one who got that laugh. Tell him I remember it.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 4,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_seer/ask_about_programmer.mp3",
    setsPublicFlags: ["seer_remembers_laughing_at_programmer"],
  },

  // ─── Personal ───────────────────────────────────────────────

  {
    id: "ask_seer_what_for_me",
    npcKey: "the_seer",
    label: "What did you see?",
    question: "What did you see for me?",
    // §1.4 tell #2 canonical asymmetric-kindness clause — the
    // canonical "the version that was kindest to X is also the
    // version that was kindest to you" register. The line names
    // both subjects of the kindness without lying about who else
    // benefits.
    answer:
      "I will not redact this one. The version of you that was kindest to you was also the version that was kindest to someone you love. I am not sorry; I want you to know it cost both of you. Both things are honest. Carry well.",
    unlockFlag: "seer_mechronis_visit_witnessed",
    unlockedFromAct: 5,
    requiresTrustBand: "Witnessed",
    voId: "vo/the_seer/ask_what_for_me.mp3",
  },
];
