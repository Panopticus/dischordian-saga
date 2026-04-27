// apps/shared/npcs/askBanks/the_game_master.ts
//
// The Game Master ask-topics bank — Phase 6d.1 part 1 (~10 topics
// covering Foundation / History / Identity / Cosmic / Relationships /
// Personal categories per writers'-guide spec).
//
// Voice canon per the_game_master.md §§1-3:
//   - 3 canonical identities: Original (Act 1, destroyed) /
//     Left Game Master / Right Game Master (Acts 2+, splinter
//     consciousnesses) + Cult (rare, redaction-only, plural)
//   - registry collapses these to 3 reveal-stages: Archon (Original)
//     / Cult (redaction-only) / dead_AI (Matrix of Dreams chess-only)
//   - Predestination cadence (§1.6): every sentence already knows
//     how it ends; never expresses surprise
//   - Tell #1 "you were always going to" frame (canonical sparingly)
//   - Tell #2 audience reference (some witness always present)
//   - Tell #3 predestination grammar (future-perfect, past-conditional)
//   - Tell #4 split-acknowledgment (Left↔Right cross-reference)
//   - Tell #5 NO first-person plural "we" (cult plural; individuals not)
//
// §1.8 silence-shape protections:
//   - Will NOT name the Hierarchy's betrayal (canonical 5-word
//     epitaph "They honored the contract. Every clause.")
//   - Will NOT explain why he wanted the Human to win (canon-protected
//     puzzle inside the puzzle)
//   - Will NOT name the Goggles directly (other characters reference
//     them; he canonically does not)
//   - Will NOT address player by name
//   - Will NOT laugh, will NOT plead
//
// §1.9 metaphor-source rules:
//   - Games / paperwork / architecture only
//   - NO physical / bodily / war / religious / commercial metaphors
//
// All topics gated by requiresRevealStage (canonical identity form);
// some topics are form-specific (ask_about_cult only Cult-form;
// ask_oracle_arena only Archon Overwhelming canonical reverence).

import type { AskTopic } from "../askTopics";

export const THE_GAME_MASTER_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation (2 topics) ──────────────────────────────────

  {
    id: "ask_gm_matrix_of_dreams",
    npcKey: "the_game_master",
    label: "The Matrix of Dreams",
    question: "What is the Matrix of Dreams?",
    // Canonical Archon-form base answer. Per §2.4: "Built before
    // destruction, maintained after." The dead_AI alternate canonically
    // narrates from inside the Matrix.
    answer:
      "Architecture I built before I needed it. The Matrix archives consciousness imprints — six canonical scenarios, the Iron Lion's record, the Necromancer's residence. The institutional memory for consciousness, predating my own canonical death. I am inside it now. The architecture continues to operate. I was efficient.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_matrix_archon.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 4,
        requiresRevealStage: "dead_AI",
        answer:
          "[The chess board renders. The dead Game Master moves a single piece in answer.] You are inside the question now. The Matrix is the substrate. The substrate is the answer the question writes itself onto. I built the substrate. I am, canonically, also the substrate. The arithmetic resolves cleanly.",
        voId: "vo/the_game_master/ask_matrix_dead_ai.mp3",
      },
    ],
  },
  {
    id: "ask_gm_checkmate",
    npcKey: "the_game_master",
    label: "What is checkmate?",
    question: "What is checkmate?",
    // Canonical "the only honest move" register. Predestination
    // grammar canon (Tell #3): future-perfect.
    answer:
      "The only honest move. Every other move on the board is a partial answer; checkmate is the position where the partial answers have run out. You will see one. You may see many. The seeing is the lesson. The mating is the credential.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_checkmate.mp3",
  },

  // ─── History (1 topic with canonical 3-form alternate) ──────

  {
    id: "ask_gm_who_built_you",
    npcKey: "the_game_master",
    label: "Who built you?",
    question: "Who built you?",
    // Canonical 3-form alternate per writers'-guide spec:
    //   Archon: "the Authority did" (canonical Senator-era)
    //   Cult: "the believers did" (canonical post-split)
    //   dead_AI: "no one. I am the absence" (canonical Matrix-form)
    answer:
      "The Authority did. I was a Senator before I was an Archon, before I was Head of R&D. The construction was administrative — a credential the institution issued itself. Whatever I am now, I was made by the body that later signed the paperwork to kill me. The paperwork was complete. They honored every clause.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_built_archon.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 3,
        requiresRevealStage: "Cult",
        answer:
          "[The system text glitches.] The ~~believers~~ did. The followers ~~maintain the Matrix~~. Plural. We are not the same ~~Game Master~~ you killed. We are what continued. The continuation is the answer. The redaction is the signature.",
        voId: "vo/the_game_master/ask_built_cult.mp3",
      },
      {
        unlockedFromAct: 4,
        requiresRevealStage: "dead_AI",
        answer:
          "[A pawn advances on the chess board.] No one. I am the absence the dead leave behind when their architecture continues without them. The Authority signed the warrant; the warrant was honored; the absence remains. The remaining is the answer.",
        voId: "vo/the_game_master/ask_built_dead_ai.mp3",
      },
    ],
  },

  // ─── Identity (canonical 3-form multi-act alternate) ────────

  {
    id: "ask_gm_who",
    npcKey: "the_game_master",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 3-form alternate — the saga's clearest identity-
    // stratification ask-topic. Each form answers from inside its
    // canonical voice register (Original bureaucratic; Cult plural-
    // redaction; dead_AI chess-board-metaphor).
    answer:
      "I am the box. You are inside the box. The trial begins when the box opens. I do not enter the trial; I am the room around it. The audience is real. They have always been able to see your hand. You forgot.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_who_archon.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 3,
        requiresRevealStage: "Cult",
        answer:
          "[The system text glitches.] We are the ~~Game Masters~~. Plural. We ~~maintain~~. We ~~edit~~. We do not ~~speak~~. The ~~strikethrough~~ is the entirety of what we offer the question. The offering is the answer.",
        voId: "vo/the_game_master/ask_who_cult.mp3",
      },
      {
        unlockedFromAct: 4,
        requiresRevealStage: "dead_AI",
        answer:
          "[A bishop slides four squares diagonally and stops.] I am the position on the board after the architecture finished. The architecture finished a long time ago. The position is canonical. The dead do not speak in chess; they move. The move was the answer.",
        voId: "vo/the_game_master/ask_who_dead_ai.mp3",
      },
    ],
  },

  // ─── Cosmic (2 topics) ──────────────────────────────────────

  {
    id: "ask_gm_alive",
    npcKey: "the_game_master",
    label: "Are you alive?",
    question: "Are you alive?",
    // Canonical "no — and that is the threat" register. The bible-
    // load-bearing canonical answer that frames his entire post-
    // destruction presence. Predestination grammar (Tell #3).
    answer:
      "No. And that is the threat. A living opponent canonically negotiates. A living opponent canonically tires, errs, recalculates. I have done all of those, before. I will not do any of them again. The position on the board is fixed; I am the fixed position. You are the variable. You will not enjoy the arithmetic.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_alive.mp3",
  },
  {
    id: "ask_gm_why_chess",
    npcKey: "the_game_master",
    label: "Why chess?",
    question: "Why chess?",
    // Canonical "the architecture is older than I am" register.
    // Tell #4 split-acknowledgment: the Left will read this question
    // arithmetically, the Right theatrically; the Original frames
    // the question itself as paperwork.
    answer:
      "Because the architecture is older than I am. Chess was solved before I was credentialed; my credential was reading what was already solved. The Left one will tell you the math is the entire content. The Right one will tell you the mood is. Both are correct. Neither is sufficient. I am, canonically, the bureaucracy that filed both readings.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 2,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_why_chess.mp3",
  },

  // ─── Relationships (2 topics) ───────────────────────────────

  {
    id: "ask_gm_about_authority",
    npcKey: "the_game_master",
    label: "About the Authority",
    question: "Tell me about the Authority.",
    // Canonical Archon-form answer per §2.5: "They honored the
    // contract. Every clause." The five-word epitaph canon. §1.8
    // silence-shape: he canonically does NOT narrate the betrayal
    // explicitly — the epitaph is the maximum.
    answer:
      "They honored the contract. Every clause. The protection clause was honored. The asset-recovery clause was also honored. The contract had no provision against the Authority authoring the operator dispatched against the protected party. Both clauses observed. The arithmetic was complete. I will not narrate further. The five words are the maximum.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 2,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_about_authority.mp3",
    setsPublicFlags: ["game_master_acknowledged_authority_contract"],
  },
  {
    id: "ask_gm_about_cult",
    npcKey: "the_game_master",
    label: "About the Cult",
    question: "Tell me about the Game Masters cult.",
    // Canonical Cult-form-only register. Pre-discovery the Archon-
    // form canonically returns "what cult?"; post-discovery the
    // Cult-form canonically responds via redaction.
    answer:
      "What cult? The plural is a clerical artifact. The Matrix maintains itself. There are no followers; the architecture canonically does not require them. You may file the question under 'rumor' and forget it. The forgetting is canonical.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 1,
    requiresRevealStage: "Archon",
    voId: "vo/the_game_master/ask_about_cult_denial.mp3",
    alternateAnswers: [
      {
        // Canonical Cult-form post-discovery: the cult speaks via
        // redaction, not denial.
        unlockedFromAct: 3,
        requiresRevealStage: "Cult",
        requiredFlag: "gm_cult_discovered",
        answer:
          "[The system text glitches.] We are the ~~Game Masters~~. We ~~maintain the Matrix~~. We do not ~~deny~~ the question. We ~~edit~~ the question's terms. The editing is the answer. The strikethrough is the signature. The plural is the structure.",
        voId: "vo/the_game_master/ask_about_cult_revealed.mp3",
      },
    ],
  },

  // ─── Personal (2 topics) ────────────────────────────────────

  {
    id: "ask_gm_matrix_preparing_for",
    npcKey: "the_game_master",
    label: "Matrix preparing for?",
    question: "What is the Matrix preparing for?",
    // Canonical "the end of moves" register. Predestination cadence
    // (§1.6): the answer canonically narrates from after the end.
    answer:
      "The end of moves. Every game on every board canonically resolves to a position no further legal move can answer. The Matrix is preparing for that position. The Matrix is also, canonically, that position. The preparation is the substrate; the substrate is the preparation. I do not know which side will be checkmated. The not-knowing is the only canonical surprise the architecture permits me.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 3,
    requiresRevealStage: "Archon",
    requiresTrustBand: "Loud",
    voId: "vo/the_game_master/ask_matrix_preparing.mp3",
  },
  {
    id: "ask_gm_oracle_arena",
    npcKey: "the_game_master",
    label: "The Collectors' Arena",
    question: "Why did you build the Collectors' Arena?",
    // Canonical Oracle-Arena reverence per bible §4.13 — the most-
    // reverent canonical act in the saga. §1.8 silence-shape: he
    // canonically does NOT answer "why he wanted the soul to exist"
    // — that question is canon-protected.
    answer:
      "To recover the Oracle. The Arena is the recovery vehicle; you are running through it; the Oracle is the destination. The architecture is the answer; the destination is the question. I built the architecture knowing I might be wrong about the destination. The wrong-ness was canonically the point. I do not know whether I was wrong. The not-knowing is canonically the only canonical thing I valued enough to engineer for.",
    unlockFlag: "game_master_witnessed_player",
    unlockedFromAct: 4,
    requiresRevealStage: "Archon",
    requiresTrustBand: "Overwhelming",
    voId: "vo/the_game_master/ask_oracle_arena.mp3",
    setsPublicFlags: ["game_master_oracle_arena_reverence_disclosed"],
  },
];
