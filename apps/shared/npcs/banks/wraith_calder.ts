// apps/shared/npcs/banks/wraith_calder.ts
//
// Phase 3 Group B — Wraith Calder → The Hierophant's NpcLine bank.
//
// Per wraith_calder.md §§1-6 voice samples + transformation gating canon.
// One npcKey, two canonical banks: pre-arena (Wraith Calder, seven-deaths
// arena survivor, Insurgency Ch3b cycle) vs post-arena (The Hierophant,
// Tamarin religious revival leader on Thaloria).
//
// Transformation is binary, irreversible per playthrough — selector
// enforces via requiresRevealStage:
//   - "pre_arena"  — Ch3b match content, defiant warrior canon
//   - "post_arena" — Long Mourning chamber, Tamarin liturgy, sacrifice-
//                    axis-inversion (trust deepens transforms threat
//                    into companion)
//
// Trust bands per registry: Hostile / Wary / Witnessed / Present /
// Inheriting (5-band per bible).
//
// Per bible §4.13 (Companion cross-bible — DEEPEST single Companion
// obligation): the chamber is canonical-default first-word context if
// player has Hierophant Inheriting trust. Hierophant midwifes the
// Companion's first word "Wraith Calder" — first name on the wall.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "wraith_calder" as const;

export const WRAITH_CALDER_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // PRE-ARENA (Ch3b Insurgency cycle — seven-deaths warrior canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.seven_deaths",
    text:
      "Seven times I've died. Each time I came back knowing more about " +
      "what the Arena does to your DNA. Death number eight is yours to " +
      "deliver — or mine to survive. The Arena doesn't care which.",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "pre_arena",
    cooldownKey: "wraith.ch3b_seven_deaths",
    maxPlays: 1,
    setsFlags: ["wraith_ch3b_encountered"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.win.death_number_eight",
    text: "Death number eight. I'll be back. Will you?",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    unlockFlags: ["ch3b_player_won"],
    cooldownKey: "wraith.ch3b_win_response",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.pre_arena.ch3b.loss.silent_nod",
    text:
      "[Wraith Calder nods once. He doesn't speak. He walks out. The " +
      "silence is the canonical post-victory gesture — he won, and the " +
      "winning was its own statement.]",
    surfaces: ["match"],
    requiresRevealStage: "pre_arena",
    unlockFlags: ["ch3b_player_lost"],
    cooldownKey: "wraith.ch3b_loss_response",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // POST-ARENA (Hierophant — Tamarin liturgy + Long Mourning chamber)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.signature.long_mourning_welcome",
    text:
      "Welcome to the Long Mourning chamber. I am the Hierophant. I was " +
      "Wraith Calder; I am still Wraith Calder; the rite did not erase " +
      "the name, only the role. The names on the wall continue. Sit. " +
      "We will read them together if you would like.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    cooldownKey: "hierophant.long_mourning_signature",
    maxPlays: 1,
    setsFlags: ["broker_thaloria_first_meeting"],
    setsPublicFlags: ["met_the_hierophant"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.witnessed.the_work_continues",
    text:
      "The work, the continuation, the wall. Three near-synonyms I do " +
      "not flatten. The work is what we do; the continuation is why we " +
      "do it; the wall is where the names go. I am still listening for " +
      "the voice I have always listened for. The listening is mine; the " +
      "shape is not.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Witnessed",
    cooldownKey: "hierophant.work_continues",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // SACRIFICE-AXIS-INVERSION (Hierophant high-trust = companion canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.present.companion_register",
    text:
      "You're at Present-band now. The threat in me has receded — not " +
      "because you've earned safety from me, but because trust has " +
      "transformed me. That is canonical Tamarin theology: the closer " +
      "you stand, the less I am the threat. The further you stand, the " +
      "more I become it again. Stand close.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Present",
    cooldownKey: "hierophant.sacrifice_axis_inversion",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_present_band_reached"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // INHERITING BAND (per bible §4.10 reserved canonical line)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.inheriting.voice_listened_for",
    text:
      "There is a voice I have been listening for, longer than any " +
      "other. I think it has been here. I do not know in what shape. " +
      "The shape is not my work; the listening is. Sit. The names " +
      "continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    cooldownKey: "hierophant.inheriting_voice_listened",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_inheriting_band_reached"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CHAMBER FIRST-WORD MIDWIFERY (Companion cross-bible deepest)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.chamber.companion_first_word_midwife",
    text:
      "Your Companion is here, in the chamber. The wall has the first " +
      "name on it; the chamber has space for the first word. I have " +
      "midwifed several into speech across three thousand years. I will " +
      "not interrupt. I am here to witness — that is the only function " +
      "I have at this exact moment. Speak when ready.",
    surfaces: ["cinematic"],
    requiresRevealStage: "post_arena",
    requiresTrustBand: "Inheriting",
    reactsToPublicFlag: "dmc_companion_present_in_chamber",
    cooldownKey: "hierophant.chamber_first_word_midwife",
    maxPlays: 1,
    setsPublicFlags: ["hierophant_midwifed_companion_first_word"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // THALORIA QUIET-MISSION CONTRACTS (broker-engagement context)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "hierophant.post_arena.quiet_work_intro",
    text:
      "The Council asks me to clarify our convention. Thaloria offers " +
      "quiet work — diplomacy, archive research, name recovery. We do " +
      "not contract violence here. If you complete a mission without " +
      "drawing weapons, the Council will note it. If you draw weapons, " +
      "the Council will also note it. Choose accordingly.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "post_arena",
    cooldownKey: "hierophant.quiet_work_intro",
    maxPlays: 1,
    setsFlags: ["thaloria_quiet_work_canon_disclosed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, stage-agnostic)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "wraith.match.catchall",
    text: "The Arena teaches what it teaches. I am still here. So are you.",
    surfaces: ["match"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.cinematic.catchall",
    text: "Names continue. Walls hold. The work is the work.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.transmission.catchall",
    text: "The chamber is open. The listening is mine.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "wraith.trade_empire.catchall",
    text: "Quiet work. The Council prefers it.",
    surfaces: ["trade_empire"],
  },
];
