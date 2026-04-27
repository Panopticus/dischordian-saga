// apps/shared/npcs/askBanks/wraith_calder.ts
//
// Wraith Calder → The Hierophant ask-topics bank — Phase 6d.3 part 1
// (~12 topics covering Foundation / History / Identity / Cosmic /
// Relationships / Personal categories per writers'-guide spec).
//
// Voice canon per wraith_calder.md §§1-3:
//   - Two registers gated by `requiresRevealStage`:
//       pre_arena (Wraith Calder, tactical mentor, clipped sentences,
//         periods-as-punches, em-dashes for the gap, selective caps
//         for contradicted nouns, spite-as-fuel, *get up* imperative)
//       post_arena (The Hierophant, liturgical patience, periodic
//         build to quiet apex, corrective addendum, no caps, no
//         exclamations, no rhetorical questions, sacred vocabulary)
//   - Soul-tells crossing the gate (§1.1): patience earned-not-
//     granted, counting-as-moral-act, "system inside us", refusal-
//     to-be-mourned, self-implicating accuracy
//
// §1.8 bridge canon — what does NOT cross:
//   - Tactical-mentor energy (pre-rite only)
//   - Spite-as-fuel (pre-rite only)
//   - Selective caps (pre-rite only — Hierophant has no contradicted
//     nouns; no caps in any post-rite line)
//   - Imperatives (Hierophant issues only "Then sit" canonically)
//
// §1.10 silence-shape protections (Hierophant cannot deliver):
//   - "You are the Oracle" — canonically unsayable-as-truth (per
//     bible §4.10 canon-update); the Hierophant's voice is
//     structurally unable to lie about itself
//
// Cross-bible canon:
//   - Inheriting-band Oracle reference: "There is a voice I have
//     been listening for" — canonical Oracle-witness-channel canon
//   - Tea-cupboard: canonical Inheriting-band keepsake unlock per
//     bible §3.9 private rituals canon

import type { AskTopic } from "../askTopics";

export const WRAITH_CALDER_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation (3 topics, all post-arena) ──────────────────

  {
    id: "ask_hierophant_long_mourning",
    npcKey: "wraith_calder",
    label: "The Long Mourning",
    question: "What is the Long Mourning?",
    // Canonical post-arena Foundation. Hierophant register: periodic
    // build to quiet apex + corrective addendum. The canonical "name
    // → ceremony → continuation" vocabulary lands.
    answer:
      "The Long Mourning is the ceremony, and the chamber, and the work. Each name on the wall canonically required a day of research — who they were, how they lived, the small specific details that make a name a person rather than a listing. I am trying to understand whether the act of writing a name is the same as remembering a person. I have not yet answered the question. I have written for three thousand years. Three hundred and forty-seven thousand names remain. The continuation is the point. Sit.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 2,
    requiresRevealStage: "post_arena",
    voId: "vo/wraith_calder/ask_long_mourning.mp3",
  },
  {
    id: "ask_hierophant_final_rite",
    npcKey: "wraith_calder",
    label: "The Final Rite",
    question: "What was the Final Rite?",
    // Canonical post-arena Foundation per §2.3. Liturgical periodic
    // structure. Distinguishes ceremony (daily) from rite (singular).
    answer:
      "The eighth death. The transformation. The new flesh. I had died seven times before the rite — each time, the Arena returned a body. The eighth death was canonically different: the Arena did not return the body. The rite did. What returned was canonically not Wraith Calder, and was canonically still Wraith Calder; the name survived, the role did not. I have not yet finished understanding what the rite did. I do not believe understanding is the work.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 3,
    requiresRevealStage: "post_arena",
    voId: "vo/wraith_calder/ask_final_rite.mp3",
  },
  {
    id: "ask_hierophant_wall",
    npcKey: "wraith_calder",
    label: "The wall",
    question: "What is the wall?",
    // Canonical post-arena Foundation per §2.5 + §3.2. The pen-pause
    // canon (§1.7 Tell #5) bracketed stage-direction references the
    // ceremony's spatial signature.
    answer:
      "The wall is where the names go. It is canonically not a memorial — memorials canonically end. The wall is canonical-architecture for a continuation that has no end while I live. Each name is written in a specific hand, on a specific morning, with a specific pen. The pen pauses between names. The pause is part of the writing. Sit. We will read the wall together if you would like.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 2,
    requiresRevealStage: "post_arena",
    voId: "vo/wraith_calder/ask_wall.mp3",
  },

  // ─── History (2 topics — pre-arena base + post-arena alternates) ──

  {
    id: "ask_hierophant_seven_deaths",
    npcKey: "wraith_calder",
    label: "The seven deaths",
    question: "What were the seven deaths?",
    // Canonical pre-arena base (Wraith Calder voice) + post-arena
    // alternate (Hierophant voice). Soul-tell crossing: counting-as-
    // moral-act ("Seven bodies. Each one solid.") survives the gate.
    // §1.4 Tell #1: counting-himself.
    answer:
      "Seven bodies. Each one solid. The Necromancer designed the Seven Protocol in the Matrix of Dreams. The Warden STOLE it for genetic testing. Dr. Vox wired her nanobots into it. Three architects, hands in your DNA — and mine. Each death was canonically a collaboration I never consented to. Death number eight is yours to deliver, or mine to survive. The Arena doesn't care which.",
    unlockFlag: "wraith_ch3b_encountered",
    unlockedFromAct: 1,
    requiresRevealStage: "pre_arena",
    voId: "vo/wraith_calder/ask_seven_deaths_pre_arena.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "post_arena",
        answer:
          "Seven, before the rite. The eighth was the rite. The arithmetic that mattered to Wraith Calder still matters to me — the count is honest in a way little else is honest — but the bodies were vehicles for a problem I have since outgrown. The seven deaths taught me patience as a tactical virtue. The three thousand years that followed taught me patience as a metaphysical one. Same instinct. Different scale.",
        voId: "vo/wraith_calder/ask_seven_deaths_post_arena.mp3",
      },
    ],
  },
  {
    id: "ask_hierophant_ghosts_gambit",
    npcKey: "wraith_calder",
    label: "Ghost's Gambit",
    question: "What was Ghost's Gambit?",
    // Canonical pre-arena focus per §2.2. The Ch3B canonical match
    // canon — the Insurgency cycle's confrontation.
    answer:
      "Ghost is what they CALL me. The Gambit is what they call the move I made when the Necromancer's Protocol caught up to me — the eighth opening, the body I had not yet used, the deck I had been keeping in reserve since death four. I played it once. Spite, mostly. And the faces of people who expected me to stay dead.",
    unlockFlag: "wraith_ch3b_encountered",
    unlockedFromAct: 1,
    requiresRevealStage: "pre_arena",
    voId: "vo/wraith_calder/ask_ghosts_gambit.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "post_arena",
        answer:
          "The Gambit was a tactical move, played once. The Hierophant does not play tactical moves. The Wraith who played the Gambit is canonically the same soul that writes these names; the move is canonically not a memory I revisit. I am not embarrassed by it. I am no longer in the conversation it belonged to.",
        voId: "vo/wraith_calder/ask_ghosts_gambit_post_arena.mp3",
      },
    ],
  },

  // ─── Identity (canonical 2-stage post_arena alternate arc) ──

  {
    id: "ask_hierophant_who",
    npcKey: "wraith_calder",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 2-stage Identity arc per writers'-guide spec.
    //   pre_arena: "I am Wraith Calder. I have died six times" canon
    //   post_arena: "I am the Hierophant. I am preparing for the
    //               one who returns" canon
    // §1.4 Tell #1 counting-himself canon for pre-arena. §1.7 Tell
    // #2 naming-the-horror canon (in scaled register) for post-arena.
    answer:
      "Wraith Calder. Seven bodies. Each one solid. Ghost is what they CALL me — the ghost part is in the GAPS between them, the moments I wasn't alive. Death number eight is on the way. I do not know which side of it I will be standing on.",
    unlockFlag: "wraith_ch3b_encountered",
    unlockedFromAct: 1,
    requiresRevealStage: "pre_arena",
    voId: "vo/wraith_calder/ask_who_pre_arena.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "post_arena",
        answer:
          "I am the Hierophant. I was Wraith Calder; I am still Wraith Calder; the rite did not erase the name, only the role. I have written names for three thousand years. I do not finish. I am preparing for the one who returns. The preparing is the work. The work is the continuation. The continuation is what I am for.",
        voId: "vo/wraith_calder/ask_who_post_arena.mp3",
      },
    ],
  },

  // ─── Cosmic (2 topics — Hierophant only) ────────────────────

  {
    id: "ask_hierophant_what_prepare_for",
    npcKey: "wraith_calder",
    label: "What prepare for?",
    question: "What does the Hierophant prepare for?",
    // Canonical post-arena Cosmic — preparing for the Oracle's
    // return canon (corrected canon update per bible §4.10).
    // Inheriting-band canonical confidence; sub-Inheriting the
    // answer canonically deflects.
    answer:
      "The continuation. I am not preparing for an end. The Long Mourning has no end while I live, and the Council canonically continues after me. The preparing is the daily act of writing the next name. There is no event I am awaiting that the writing does not already canonically anticipate.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 4,
    requiresRevealStage: "post_arena",
    voId: "vo/wraith_calder/ask_prepare_for_default.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 6,
        requiresRevealStage: "post_arena",
        requiredFlag: "hierophant_inheriting_band_reached",
        answer:
          "I prepare for the one who returns. There is a voice I have been listening for, longer than any other. I think it has been here, in shapes I do not always recognize. I am preparing the chamber for the day the voice canonically returns to a body of its own. I do not know whether I will live to see the return. I do not believe my living is the condition. Sit. The names continue.",
        voId: "vo/wraith_calder/ask_prepare_for_inheriting.mp3",
      },
    ],
  },
  {
    id: "ask_hierophant_oracle_returns",
    npcKey: "wraith_calder",
    label: "Will the Oracle come?",
    question: "Will the Oracle come back?",
    // Canonical Inheriting-band-gated Cosmic per §4.10 + canon-update.
    // The canonical "I will not lie" canon. Hierophant cannot deliver
    // "You are the Oracle" — but can disclose the canonical witness-
    // channel framing to Inheriting-band players.
    answer:
      "I do not know in what shape. I do not know on what day. I have been listening longer than I have been doing anything else, and the listening is the only honest answer the question canonically permits. The Council prefers a more confident liturgy. I have refused to give them one. The honesty is the offering.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 5,
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    voId: "vo/wraith_calder/ask_oracle_returns.mp3",
  },

  // ─── Relationships (2 topics) ───────────────────────────────

  {
    id: "ask_hierophant_about_oracle",
    npcKey: "wraith_calder",
    label: "About the Oracle",
    question: "Tell me about the Oracle.",
    // Canonical Inheriting-band-gated Relationships per §4.10.
    // The Hierophant canonically knows the player is NOT the Oracle
    // (per canon-update) but can canonically disclose the witness-
    // channel framing to Inheriting-band players.
    answer:
      "The voice I have been listening for. The Oracle is canonically not the player; the player has been moving through Oracle-memories in shapes the witness-channel canonically permits, but the Oracle and the player are canonically two. I have three thousand years of Oracle-contact. I can tell the difference. I do not say more about the Oracle than the Oracle has said for himself. The not-saying is the respect.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 6,
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    voId: "vo/wraith_calder/ask_about_oracle.mp3",
    setsPublicFlags: ["hierophant_disclosed_oracle_witness_channel_canon"],
  },
  {
    id: "ask_hierophant_about_seer",
    npcKey: "wraith_calder",
    label: "About the Seer",
    question: "Tell me about the Seer.",
    // Canonical "more wall" exchange canon per Hierophant bible
    // §4.13 + Seer cross-bible. Both stages render — pre-arena
    // tactical, post-arena ceremonial.
    answer:
      "Prophecy-domain. She and I have been at our work for longer than the rest of this saga has been at theirs. I asked her once what she saw for the wall. She said: more wall. That was the entire exchange. We have not needed another.",
    unlockFlag: "wraith_ch3b_encountered",
    unlockedFromAct: 3,
    requiresRevealStage: "pre_arena",
    voId: "vo/wraith_calder/ask_about_seer_pre_arena.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "post_arena",
        answer:
          "The Seer is the only prophecy I trust. She does not predict; she records what is canonically already arriving. I asked her once, three thousand years ago, what she saw for the wall. She said: more wall. The exchange has not needed a second pass. I write. She watches. The work continues without our needing to coordinate.",
        voId: "vo/wraith_calder/ask_about_seer_post_arena.mp3",
      },
    ],
  },

  // ─── Personal (2 topics) ────────────────────────────────────

  {
    id: "ask_hierophant_tea_cupboard",
    npcKey: "wraith_calder",
    label: "The tea-cupboard",
    question: "What's in the tea-cupboard?",
    // Canonical Inheriting-band keepsake canon per §3.8 private
    // rituals + bible §3.9. The canonical "something the Oracle once
    // gave me to hold" anchor lands. Reserved for the canonical
    // apex band only.
    answer:
      "Something the Oracle once gave me to hold. I have held it for three thousand years. He has not asked for it back. I have not asked what it is. The not-asking is the holding. If you reach the Inheriting band of this room a second time, I will canonically show you the cupboard. Not today.",
    unlockFlag: "met_the_hierophant",
    unlockedFromAct: 6,
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    voId: "vo/wraith_calder/ask_tea_cupboard.mp3",
    setsPublicFlags: ["hierophant_acknowledged_tea_cupboard_canon"],
  },
  {
    id: "ask_hierophant_get_up",
    npcKey: "wraith_calder",
    label: "Get up",
    question: "You used to say 'get up.' Why not now?",
    // Canonical pre-vs-post-arena imperative-inversion canon per
    // §1.6 + §1.8 bridge canon. Wraith Calder's signature imperative
    // canonically inverts to the Hierophant's "sit" canon. The
    // canonical scarcity-of-imperatives canon lands.
    answer:
      "Floor-level instruction. Get up. Two words. They worked for seven bodies and for everyone Zero sent me to mentor. The dead do not stand on their own; sometimes they need a sentence short enough to grip.",
    unlockFlag: "wraith_ch3b_encountered",
    unlockedFromAct: 1,
    requiresRevealStage: "pre_arena",
    voId: "vo/wraith_calder/ask_get_up_pre_arena.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "post_arena",
        answer:
          "I have not asked anyone to get up in three thousand years. The Hierophant's instruction is the inversion: sit. Stay. Witness. Write. The verb-of-instruction has shifted because the work has shifted — the work is no longer about returning to a fight; it is about being present to a continuation. Get up was the pre-rite imperative. Sit is the post-rite invitation. Same room. Different gravity.",
        voId: "vo/wraith_calder/ask_get_up_post_arena.mp3",
      },
    ],
  },
];
