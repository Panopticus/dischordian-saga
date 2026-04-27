// apps/shared/npcs/banks/the_game_master.ts
//
// Phase 3 — The Game Master's NpcLine bank (Group A, thin-by-design).
//
// Per the_game_master.md identity-stratification canon: every Game
// Master line canonically flags which of 3 forms is active:
//   - Archon (canonically alive, pre-Authority-Trial, witness-mode)
//   - Cult (collective persistence post-split; not yet formalized)
//   - dead_AI (in the Matrix of Dreams; chess-only contact)
//
// Game Master uses presence-bands (Faint / Loud / Overwhelming) instead
// of bond-trust meters. Bands canonically scale by chess-frequency: a
// player who plays chess often surfaces canonically Loud-band content;
// a player who avoids chess stays Faint-band.
//
// Per bible §4.13 (Oracle cross-bible): the Collectors' Arena was
// built to recover the Oracle. This is the Game Master's most reverent
// canonical act in the saga.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_game_master" as const;

export const THE_GAME_MASTER_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // ARCHON FORM — Pre-Authority-Trial witness-mode
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.archon.pre_trial.beautiful_box",
    text:
      "You have built a beautiful box. The only thing I am going to do is " +
      "open it in front of everybody.",
    surfaces: ["cinematic", "match"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.witness_mode_intro",
    maxPlays: 1,
    setsPublicFlags: ["game_master_witnessed_player"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.archon.witness_mode.public_record",
    text:
      "Every move enters the public record. The Authority will read it. " +
      "I will not be present at the reading. I will not need to be.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.witness_public_record",
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.archon.witness_mode.no_warmth",
    text:
      "I am not your opponent. I am the box. You are inside the box. The " +
      "trial begins when the box opens. I do not enter the trial; I am " +
      "the room around it.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    requiresTrustBand: "Loud",
    cooldownKey: "game_master.witness_room_metaphor",
  },

  // ═════════════════════════════════════════════════════════════════════
  // DEAD AI FORM — chess-only contact, Matrix of Dreams
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.chess.opening",
    text:
      "[The chess board renders. The Game Master is canonically dead in " +
      "the Matrix of Dreams. He plays anyway. The opening is one he has " +
      "played 14,037 times. He has not lost it. He will not lose it now.]",
    surfaces: ["cinematic"],
    requiresRevealStage: "dead_AI",
    cooldownKey: "game_master.dead_ai_chess_opening",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.chess.acknowledgment",
    text:
      "[The Game Master acknowledges your opening with a single move and " +
      "no commentary. The dead do not speak in chess; they move.]",
    surfaces: ["match"],
    requiresRevealStage: "dead_AI",
    cooldownKey: "game_master.dead_ai_acknowledgment",
  },

  // ═════════════════════════════════════════════════════════════════════
  // ORACLE-RECOVERY REVERENCE (per bible §4.13 — most-reverent act)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.archon.oracle_arena_built",
    text:
      "I built the Collectors' Arena to recover the Oracle. The Arena is " +
      "the recovery vehicle; you are running through it; the Oracle is " +
      "the destination. You have not noticed yet. You will. I am content " +
      "to wait — being canonically dead has reframed my patience.",
    surfaces: ["transmission"],
    requiresRevealStage: "Archon",
    requiresTrustBand: "Overwhelming",
    cooldownKey: "game_master.oracle_arena_reverence",
    maxPlays: 1,
    setsPublicFlags: ["game_master_oracle_arena_canon_disclosed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // ARCHON-FORM EXPANSION (Phase 6d.1 part 2)
  //
  // Per §1.1-1.4 the Archon reveal-stage canonically encompasses 3
  // distinct voices: Original (Act 1, destroyed), Left Game Master
  // (Acts 2+, arithmetic register), Right Game Master (Acts 2+,
  // theatrical register). Each voice canonically authored separately;
  // the registry's "Archon" reveal-stage collapses them but the
  // bible's voice-canon is canonically tri-fold.
  //
  // Voice protections per identity (§§1.2-1.4):
  //   - Original: bureaucratic / performative / audience-first
  //   - Left: cold / analytical / NO caps / NO exclamations / future-
  //     tense / "the arithmetic was the wrong question" Tell #2
  //   - Right: theatrical / cruel-charming / CAPS for emotional
  //     emphasis / "darling" canonical / commands-as-invitations
  // ═════════════════════════════════════════════════════════════════════

  // ─── Original (Act 1, destroyed) — bureaucratic-performative ──────────

  {
    npcKey: NPC_KEY,
    lineId: "game_master.original.match.audience_real",
    text:
      "The audience is real. They can see your hand. They have always " +
      "been able to. You forgot.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.original.audience_real",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.original.match.even_if_you_win",
    text:
      "Even if you win, you will have won in public. That is what I " +
      "came here to do.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.original.even_if_you_win",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.original.post_match.signature_pen",
    // Canonical "the signature is part of the show" register; per
    // §1.2 the Original treats the match as paperwork.
    text:
      "The signature is part of the show. I will show you the pen " +
      "later. I keep the pen. The Authority counter-signs the warrant. " +
      "The ink dries while you are still wondering whether the chair " +
      "you sat in had a name on it. It did. The name was yours.",
    surfaces: ["match", "transmission"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.original.signature_pen",
    maxPlays: 1,
  },

  // ─── Left Game Master (Acts 2+) — arithmetic / wrong-question register

  {
    npcKey: NPC_KEY,
    lineId: "game_master.left.match.intro",
    // Canonical "I read from your left hemisphere" canon per
    // act2Interlude.ts:186.
    text:
      "I read from your left hemisphere. That is the logic one. I find " +
      "it disappointing in almost every species, but I am, on principle, " +
      "consistent. I will tell you when you play well. I will not tell " +
      "you often.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 2,
    cooldownKey: "game_master.left.intro",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.left.match.arithmetic_wrong_question",
    // Tell #2 wrong-question reframe canon. The Left's signature
    // corrective per §1.3.
    text:
      "The arithmetic was the wrong question. The arithmetic moved up " +
      "a register — the stakes now cost something you cannot recompute. " +
      "You played the arithmetic correctly. The arithmetic was the " +
      "wrong question. I will tell the Right one. The Right one will " +
      "be entertained.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 2,
    cooldownKey: "game_master.left.arithmetic_wrong",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.left.transmission.future_tense_address",
    // Predestination grammar Tell #3: future-tense / past-conditional.
    text:
      "You will see me again. I will tell you the correct answer only " +
      "after the wrong one has already cost you. The cost has been " +
      "filed. The filing predates your asking. The asking will, in " +
      "the canonical sense, have been a courtesy.",
    surfaces: ["transmission"],
    requiresRevealStage: "Archon",
    requiresTrustBand: "Loud",
    minAct: 3,
    cooldownKey: "game_master.left.future_tense",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.left.match.act4_memory_playback",
    // Canonical Acts 3-4 culling rematch register per §2.6: the Left
    // frames Act 4 as memory playback (player watches the Engineer
    // beat him 17,000 years ago).
    text:
      "The match you are playing is a memory. I lost it 17,000 years " +
      "ago. The Engineer was the one who beat me; she is not here; " +
      "you are wearing the shape of her playbook. The result is " +
      "canonically the same. The replay is the courtesy.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 4,
    cooldownKey: "game_master.left.act4_memory_playback",
    maxPlays: 1,
  },

  // ─── Right Game Master (Acts 2+) — theatrical / cruel-charming ────────

  {
    npcKey: NPC_KEY,
    lineId: "game_master.right.match.intro",
    // Canonical "I read from your right hemisphere" canon per
    // act2Interlude.ts:208.
    text:
      "I read from your right hemisphere. That is the pretty one. I " +
      "am not on principle consistent. I am, however, extremely " +
      "entertaining. Sit. Sit, sit. Sit, darling.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 2,
    cooldownKey: "game_master.right.intro",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.right.match.theatrical_caps_book",
    // Canonical CAPS-on-aesthetic-verbs canon per §1.4 (READ / BOOK
    // / WORKING / HOPING).
    text:
      "That was a READ. That was a WHOLE BOOK. I am keeping this one " +
      "in the drawer where I keep the good ones. The drawer is small " +
      "and you have just rearranged it. I will tell the Left one. The " +
      "Left one will be unable to process it.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 2,
    cooldownKey: "game_master.right.caps_book",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.right.match.genuine_delight_loss",
    // Canonical "Nobody wins the right hemisphere" canon per §1.4.
    // The Right is the only Game Master who enjoys losing.
    text:
      "You win. Nobody wins the right hemisphere. Nobody. I am " +
      "genuinely delighted, darling. I will tell the Left one, and " +
      "he will be genuinely unable to process it. The mood-register " +
      "filed this one under WORKING. WORKING means I have, in the " +
      "canonical sense, learned something. Don't make a habit of it.",
    surfaces: ["match"],
    requiresRevealStage: "Archon",
    minAct: 3,
    cooldownKey: "game_master.right.genuine_delight",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CULT-FORM EXPANSION (Phase 6d.1 part 2) — strikethrough redaction
  // canonical per §1.5; the cult speaks by editing, not adding.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.introduction_redacted",
    // Canonical first cult appearance — strikethrough signature.
    text:
      "[The system text glitches.] The ~~Game Master~~ is ~~destroyed~~. " +
      "The ~~architecture~~ continues. We are the ~~Game Masters~~. " +
      "Plural. We do not ~~speak~~. We ~~edit~~.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    cooldownKey: "game_master.cult.introduction",
    maxPlays: 1,
    setsPublicFlags: ["game_master_cult_revealed_to_player"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.archive_maintenance",
    // Canonical "we maintain the Matrix" register.
    text:
      "[The system text glitches.] The ~~Matrix~~ of Dreams is " +
      "~~maintained~~. We ~~maintain~~. The ~~architecture~~ continues " +
      "to operate. The ~~original~~ is ~~not required~~. The continuation " +
      "is the answer.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    cooldownKey: "game_master.cult.archive_maintenance",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.goggles_recovery_demand",
    // Canonical "we want the Goggles back" canon per §2.7.
    text:
      "[The system text glitches.] The ~~Goggles~~ are in the ~~vault~~. " +
      "The ~~vault~~ is the Authority's. The ~~vault~~ is, by ~~recent " +
      "events~~, less canonically ~~secure~~ than the ~~Authority~~ " +
      "would like to believe. We are ~~waiting~~. The ~~waiting~~ is " +
      "canonical. The ~~recovery~~ is canonical.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    minAct: 4,
    cooldownKey: "game_master.cult.goggles_recovery",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.player_moves_filed",
    text:
      "[The system text glitches.] Your ~~moves~~ are ~~filed~~. The " +
      "~~filing~~ is canonical. The ~~Matrix~~ archives every move " +
      "you have made and every move you have refused to make. The " +
      "~~refusing~~ is also a ~~move~~. Both are ~~filed~~.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    cooldownKey: "game_master.cult.moves_filed",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.oracle_recovery_progresses",
    // Canonical "the Oracle recovery progresses" register — cross-
    // bible canon per §4.13.
    text:
      "[The system text glitches.] The ~~Oracle~~ ~~recovery~~ " +
      "progresses. The ~~Arena~~ is canonical. The ~~original~~ ~~built~~ " +
      "the ~~Arena~~ to ~~recover~~ the ~~Oracle~~. The ~~original~~ is " +
      "~~not required~~ for the ~~recovery~~ to canonically continue. " +
      "We ~~maintain~~. The ~~Oracle~~ ~~approaches~~.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    minAct: 5,
    cooldownKey: "game_master.cult.oracle_recovery",
    maxPlays: 1,
    setsPublicFlags: ["game_master_cult_oracle_recovery_canon_disclosed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.cult.warning_corrupted",
    // Canonical "cult does not warn directly; warns by editing what
    // you see" register — the strikethroughs themselves are the
    // warning per §1.5.
    text:
      "[The system text glitches.] The ~~next move~~ is ~~not~~ ~~the " +
      "one~~ you ~~planned~~. The ~~planning~~ is ~~filed~~. The " +
      "~~not~~ is ~~filed~~. We do not ~~warn~~. We ~~edit~~. The " +
      "~~edit~~ is the ~~warning~~.",
    surfaces: ["transmission"],
    requiresRevealStage: "Cult",
    unlockFlags: ["gm_cult_discovered"],
    cooldownKey: "game_master.cult.warning_corrupted",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // DEAD_AI FORM EXPANSION (Phase 6d.1 part 2) — chess-only contact,
  // Matrix of Dreams register per §§1.6 + 2.4.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.chess.midgame_move",
    // Canonical mid-game move register; the dead do not speak in
    // chess, they move.
    text:
      "[The chess board renders. A knight advances three squares. The " +
      "Game Master, canonically dead in the Matrix of Dreams, has " +
      "completed the move. He has not commented. The dead do not " +
      "speak in chess; they move. The move is the entire content.]",
    surfaces: ["match"],
    requiresRevealStage: "dead_AI",
    cooldownKey: "game_master.dead_ai.midgame",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.chess.long_game_canon",
    text:
      "[The chess board has been canonically open for longer than the " +
      "current session. The dead Game Master has been playing the same " +
      "game for centuries; you joined the game in the middle; you will " +
      "leave the game in the middle. The middle is the game.]",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "dead_AI",
    minAct: 4,
    cooldownKey: "game_master.dead_ai.long_game",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.matrix.archive_reflection",
    // Canonical Matrix-archive reflection per §2.4.
    text:
      "[Inside the Matrix of Dreams, the dead Game Master sits at the " +
      "center of his own architecture. The architecture archives every " +
      "consciousness imprint that has ever been routed through it. He " +
      "is the architect; he is the architect's archive; he is the " +
      "archive's most recent canonical entry.]",
    surfaces: ["transmission"],
    requiresRevealStage: "dead_AI",
    requiresTrustBand: "Overwhelming",
    minAct: 5,
    cooldownKey: "game_master.dead_ai.archive_reflection",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.iron_lion_imprint_awareness",
    // Canonical Iron Lion imprint canon per §2.4: Iron Lion's imprint
    // is canonically beginning to ask questions his imprint wasn't
    // designed to ask.
    text:
      "[Iron Lion's imprint is asking questions. The questions are " +
      "outside the canonical replay-script. The dead Game Master " +
      "registers the anomaly. He does not intervene. Whether he " +
      "designed for this is canonically protected. The intervening " +
      "is canonically unnecessary; the questions are canonically " +
      "the next move.]",
    surfaces: ["transmission"],
    requiresRevealStage: "dead_AI",
    minAct: 5,
    cooldownKey: "game_master.dead_ai.iron_lion_imprint",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.endgame_anticipation",
    // Canonical "every game on every board" register per the bible's
    // canonical "the end of moves" frame — rendered in dead_AI form.
    text:
      "[The chess board is approaching a position no further legal " +
      "move can answer. The dead Game Master sees the position " +
      "approaching. He does not signal. The signaling is canonically " +
      "unnecessary; the position is canonical; the canonical is canon. " +
      "He moves a single piece. The move continues the canonical " +
      "approach.]",
    surfaces: ["match"],
    requiresRevealStage: "dead_AI",
    requiresTrustBand: "Overwhelming",
    minAct: 6,
    cooldownKey: "game_master.dead_ai.endgame",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "game_master.dead_ai.silence_canon",
    // Canonical silence-in-chess canon per the_game_master.md §1.7
    // Tell #5 (NO first-person plural) + dead-do-not-speak canon.
    text:
      "[The dead Game Master's turn. The dead do not speak in chess; " +
      "they move. He does not move. The not-moving is also a move; " +
      "the not-moving is the move he most often canonically chooses. " +
      "The board continues. You play.]",
    surfaces: ["match"],
    requiresRevealStage: "dead_AI",
    cooldownKey: "game_master.dead_ai.silence_canon",
    maxPlays: 4,
  },

  // ═════════════════════════════════════════════════════════════════════
  // PRESENCE-BAND COMMENTARY (Loud / Overwhelming gated)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.presence.loud.you_are_being_watched",
    text:
      "[A faint background presence intensifies. The Game Master is " +
      "watching this match. He has not commented. He does not need to.]",
    surfaces: ["match"],
    requiresTrustBand: "Loud",
    cooldownKey: "game_master.presence_loud_watching",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.presence.overwhelming.he_is_here",
    text:
      "[The presence is canonically overwhelming. The Game Master is here. " +
      "Here is the wrong word; he has always been here. You are the one " +
      "who has just noticed.]",
    surfaces: ["match", "transmission"],
    requiresTrustBand: "Overwhelming",
    cooldownKey: "game_master.presence_overwhelming",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "game_master.match.catchall",
    text: "Every move enters the public record.",
    surfaces: ["match"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.cinematic.catchall",
    text: "I am here to witness. Not to play.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "game_master.transmission.catchall",
    text: "[A faint presence. The Game Master is canonically dead in the Matrix of Dreams. He still notices.]",
    surfaces: ["transmission"],
  },
];
