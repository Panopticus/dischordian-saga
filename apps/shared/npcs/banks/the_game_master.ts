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
