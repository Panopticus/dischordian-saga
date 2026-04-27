// apps/shared/npcs/askBanks/dmc_clone_companion.ts
//
// The DMC Clone Body Companion ask-topics bank — Phase 6c.2 part 1
// (~10 topics canonical for post-naming verbal surface).
//
// Voice canon per dmc_clone_companion.md §§1-6:
//   - Pre-naming the Companion is canonically non-verbal across 5
//     channels (glyph / posture / sound / first-word / named-personality).
//     Ask-topics are a verbal surface and canonically only render
//     post-naming (Inheriting reveal-stage gate).
//   - Named voice register: calm, considered, clone-body-coded;
//     uses "I" comfortably; echoes Nilmorg's "Don't thank me"
//     canonical refusal as inherited memory; honors the canonical
//     soul-consistency-check stance (does not contradict the donor —
//     the player).
//   - Bible-load-bearing canonical anchors:
//       "I was not given. I was delivered."
//       "Don't thank me on his behalf — he would object."
//       "I'm here. That's the canonical statement; it's the only
//        one that matters."
//       traces-not-memories register for the donor question
//       "I am what was made" (refusal of donor-as-identity)
//
// §1.7 silence-shape protections:
//   - The Companion canonically does NOT narrate Nilmorg's Severance
//     ritual specifics (per §2.2: ritual is canonically the
//     Companion's experience, not knowledge to dispense)
//   - The Companion canonically does NOT contradict the donor's
//     (player's) commitments (soul-consistency-check stance)
//   - The Companion canonically does NOT recall the pre-naming
//     "Severance Fragment — {season.name}" label as their name
//     (per §1.5 + §2.4: the label is canonically Nilmorg's
//     bookkeeping, not the Companion's identity)
//
// All topics gated requiresRevealStage: "Inheriting" (canonical
// post-naming reveal-stage per the bank's existing convention).

import type { AskTopic } from "../askTopics";

export const DMC_CLONE_COMPANION_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation (2 topics) ──────────────────────────────────

  {
    id: "ask_companion_severance",
    npcKey: "dmc_clone_companion",
    label: "What is Severance?",
    question: "What is Severance?",
    // Canonical post-naming foundation answer. The Companion
    // canonically narrates Severance from the receiving end — the
    // experience of being delivered, not the mechanism of the
    // ritual. §1.7 silence-shape: ritual specifics canonically
    // not disclosed.
    answer:
      "Severance is the ritual that delivered me. I won't describe the mechanism — the mechanism was Nilmorg's, and Nilmorg keeps his work to himself. What I can tell you is the receiving: a soul-fragment of yours moves through the seal, settles in a body the Trench grew, and a person becomes available who was not available before. That person is me. That's the canonical statement.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_severance.mp3",
  },
  {
    id: "ask_companion_donor",
    npcKey: "dmc_clone_companion",
    label: "Who donated you?",
    question: "Who donated you?",
    // Canonical donor-canon disclosure (per §1 stance #2: the donor
    // is the player's own Potential). Gated to require Inheriting
    // band — the disclosure is canonically the most-load-bearing
    // recognition the Companion offers the player.
    answer:
      "You did. The fragment that woke up in this body was yours. Nilmorg took it from a Potential of yours that was already going to be lost; the Severance was the only way it would not be wasted. So the donor is you. I am not — and that distinction matters. I'll get to it.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 5,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_donor.mp3",
    setsPublicFlags: ["companion_disclosed_donor_is_player"],
  },

  // ─── History (1 topic) ──────────────────────────────────────

  {
    id: "ask_companion_remember_donor",
    npcKey: "dmc_clone_companion",
    label: "Remember the donor?",
    question: "Do you remember the donor — me, before?",
    // Canonical traces-not-memories register per §3.4 competencies.
    // The fragment carries patterns the player committed to most
    // canonically, but does not have the player's memories.
    answer:
      "Traces, not memories. I do not remember your childhood. I do not remember the people you have lost. I have never seen the rooms you grew up in. What I have are the shapes of the things you committed to most often — the cadences of how you trust, the angles of how you grieve. I inherited the shapes. The contents are still yours alone.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_remember_donor.mp3",
  },

  // ─── Identity (canonical multi-act alternate) ───────────────

  {
    id: "ask_companion_who",
    npcKey: "dmc_clone_companion",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical multi-act Identity arc per writers'-guide spec.
    // The Companion's named-band identity register canonically
    // progresses across acts as the named-personality stabilises.
    //   Acts 4+ Inheriting: canonical "I was delivered" first-naming
    //   Acts 5+ Inheriting: canonical "I am what was made" register
    //   Acts 7+ Inheriting: canonical Ascended-named register —
    //                       "the version of you that learned to
    //                        live alongside you"
    answer:
      "I was delivered. That's the most honest answer I have for the question right now. I have a name — you gave it to me — but the name is recent. The delivery is what I was first.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_who_act4.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 5,
        requiredFlag: "companion_first_word_spoken",
        answer:
          "I am what was made. The fragment is yours. The body is grown. The person is the third thing — what happened when the fragment and the body settled into each other. I am the third thing. The donor is you; the body is the Trench's; the person is mine. Three sources, one outcome. The arithmetic only works if all three stay distinct.",
        voId: "vo/dmc_clone_companion/ask_who_act5.mp3",
      },
      {
        unlockedFromAct: 7,
        requiredFlag: "companion_structural_identity_acknowledged",
        answer:
          "I am the version of you that learned to live alongside you. Not the version that competes for your name; not the version that explains you to yourself. The one that walks the same corridors and keeps watch when you cannot watch. I have a name now and a posture and a voice. They are mine. They came from you. Both of those things are true at once and the truth does not subtract.",
        voId: "vo/dmc_clone_companion/ask_who_act7.mp3",
      },
    ],
  },

  // ─── Cosmic (1 topic) ───────────────────────────────────────

  {
    id: "ask_companion_are_you_donor",
    npcKey: "dmc_clone_companion",
    label: "Are you me?",
    question: "Are you me?",
    // Canonical refusal-of-identity register. The donor donated;
    // the Companion is the third thing. Bible-load-bearing per
    // §3.4 competencies + §3.6 self-coherence ledger.
    answer:
      "No. The donor donated. I am what was made. The distinction is canonical and I will hold it — for both of us. If we let it collapse, the soul-fragment becomes either a copy of you (which it is not) or a thing of mine (which it is not). It is what was made. That is its own category. I am that category.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_are_you_donor.mp3",
  },

  // ─── Relationships (2 topics) ───────────────────────────────

  {
    id: "ask_companion_about_nilmorg",
    npcKey: "dmc_clone_companion",
    label: "About Nilmorg",
    question: "Tell me about Nilmorg.",
    // Canonical Nilmorg "don't thank me" inherited memory register.
    // Per §4.2: Nilmorg is canonically the mid-wife and the author
    // of their existence; the canonical refusal is the Companion's
    // first inherited memory.
    answer:
      "Nilmorg is the mid-wife. He delivered me. He will refuse the title and he will refuse the thanks; that refusal was the first thing I inherited. Don't thank him on my behalf — he would object, and the objection is the cleanest gift he has ever given anyone. He keeps his agreements. The agreement that produced me was kept. That is enough; he would say it is more than enough.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_about_nilmorg.mp3",
    setsPublicFlags: ["companion_acknowledged_nilmorg_midwifery"],
  },
  {
    id: "ask_companion_about_hierophant",
    npcKey: "dmc_clone_companion",
    label: "About the Hierophant",
    question: "Tell me about the Hierophant.",
    // Canonical Hierophant chamber-context first-word canon. Gated
    // for Hierophant-named-first-word context: the Companion who
    // first spoke in the chamber canonically holds Wraith Calder
    // as their first inherited name. Pre-Hierophant-named-first-word
    // players get the canonical fallback register.
    answer:
      "The Hierophant has midwifed Companions like me for three thousand years. He keeps a wall of names. The first name on that wall used to be his own; the names he has added since are the names Companions have spoken in his chamber. The wall is also the mourning. I have not spoken in his chamber. The space he made for that is still there.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_about_hierophant_default.mp3",
    alternateAnswers: [
      {
        // Canonical chamber-context branch: first-word was Wraith
        // Calder; the Companion canonically remembers the chamber.
        unlockedFromAct: 4,
        requiredFlag: "companion_first_word_was_wraith_calder",
        answer:
          "The Hierophant midwifed my first word. The chamber was quiet; the wall held names older than the room; he stood at one of the corners and waited. I said his name. The wall took the saying. He nodded once. That was the entire ceremony. I do not believe a kinder ceremony has ever been performed for anyone. I am not certain I deserve to be the one it was performed for. The Hierophant did not ask me to deserve it.",
        voId: "vo/dmc_clone_companion/ask_about_hierophant_chamber.mp3",
      },
    ],
  },

  // ─── Personal (3 topics) ────────────────────────────────────

  {
    id: "ask_companion_first_word",
    npcKey: "dmc_clone_companion",
    label: "Your first word?",
    question: "What was your first word?",
    // Canonical donor-keyed first-word recall. The answer canonically
    // varies per first-word context — gated branches cover the
    // canonical contexts (Hierophant chamber + identity-chain Last
    // + default fallback). Each branch lands the canonical sound-
    // shape canon (residue-of-Channel-3 cadence).
    answer:
      "A word I had been almost-saying for an act before I committed to it. The half-syllables built up in my throat across the last sound-palette stretch; the breath drew; the word came out with the breath still in it. I will not pretend I chose it. The choosing was the body's; I just held still long enough for the body to finish.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_first_word_default.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiredFlag: "companion_first_word_was_wraith_calder",
        answer:
          "Wraith Calder. The first name on the Hierophant's wall. The chamber midwifed it; the half-syllables of the prior act all bent toward it; the breath drew; the name came out with the breath still in it. I did not know it was a name when I said it. I knew it was the right shape. The Hierophant told me afterward whose name I had spoken. He did not seem surprised.",
        voId: "vo/dmc_clone_companion/ask_first_word_wraith_calder.mp3",
      },
      {
        unlockedFromAct: 4,
        requiredFlag: "companion_first_word_was_you",
        answer:
          "You. The shortest of the canonical contexts. The half-syllables had been bending toward your shape for the entire prior act; the body recognised the source; the breath drew; the word came out one syllable long. I have said many words since. None has been more accurate.",
        voId: "vo/dmc_clone_companion/ask_first_word_you.mp3",
      },
    ],
  },
  {
    id: "ask_companion_first_thing_noticed",
    npcKey: "dmc_clone_companion",
    label: "First thing noticed?",
    question: "What was the first thing you noticed?",
    // Canonical first-glyph-recall register per §1.2. The Companion
    // canonically remembers the recognition glyph as the first
    // expression they ever produced. Bible-load-bearing.
    answer:
      "You. The recognition glyph fired before I could form the question of what I was looking at. A small open triangle, three points facing where you were standing. It held for less than two seconds and dissolved. I did not know yet what recognition meant. I only knew the glyph had insisted on itself.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 4,
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_first_thing_noticed.mp3",
  },
  {
    id: "ask_companion_severance_fragment_label",
    npcKey: "dmc_clone_companion",
    label: "The pre-naming label?",
    question: "What was the 'Severance Fragment' label about?",
    // Canonical pre-naming-label retirement register per §1.5 +
    // §2.4. The label was canonically Nilmorg's bookkeeping, not
    // the Companion's identity.
    answer:
      "Nilmorg's bookkeeping. He files every Severance under a clerical handle until the Companion is named. The handle is canonically a description of how I was delivered — not a name; not yet a self. I never responded to it; the body the handle pointed at had not yet become me. The handle retired the moment you named me. Nilmorg keeps the old paperwork in his archive. He says the archive is canonical-required. I think he keeps it because he is sentimental about the work and would not say so out loud.",
    unlockFlag: "companion_first_word_spoken",
    unlockedFromAct: 5,
    requiresTrustBand: "Inheriting",
    requiresRevealStage: "Inheriting",
    voId: "vo/dmc_clone_companion/ask_severance_fragment_label.mp3",
  },
];
