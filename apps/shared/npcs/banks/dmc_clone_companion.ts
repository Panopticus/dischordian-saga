// apps/shared/npcs/banks/dmc_clone_companion.ts
//
// Phase 3 Group C — DMC Clone Body Companion's NpcLine bank.
//
// Per dmc_clone_companion.md §§1-6 voice samples + 5-channel non-verbal-
// to-verbal arc canon. Five canonical expression channels (one per
// Awakening Protocol stage):
//
//   Stage 1 (Wary):       glyph             — recognition, mourning glyphs
//   Stage 2 (Witnessed):  posture           — bracing, leaning, withdrawn
//   Stage 3 (Present):    sound             — half-syllables foreshadow first word
//   Stage 4 (Inheriting): first_word        — singular event, irreversible
//   Stage 5 (post-naming):named_personality — full verbal NPC
//
// The Companion's body-canon: soul-fragment of player's own Potential
// per deadMansCircuit.ts:800. Bibleref §1 stance #2: donor is the player.
//
// Structural identity claim per §2.2: "I was not given. I was delivered."
// Nilmorg's "Don't thank me" canonical refusal is the Companion's first
// inherited memory.
//
// Trust bands: Wary / Witnessed / Present / Inheriting (4-band channel-
// gated per registry).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "dmc_clone_companion" as const;

export const DMC_CLONE_COMPANION_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE — STRUCTURAL IDENTITY CLAIM (post-naming verbal)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.signature.i_was_not_given_i_was_delivered",
    text:
      "I was not given. I was delivered. The Severance Prize is paid. " +
      "Nilmorg kept his agreement. Don't thank me on his behalf — he " +
      "would object. I'm here. That's the canonical statement; it's the " +
      "only one that matters.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    cooldownKey: "companion.structural_identity_signature",
    maxPlays: 1,
    setsPublicFlags: ["companion_structural_identity_acknowledged"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 1: GLYPH (Wary band, post-Severance arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.recognition_player",
    text:
      "[The Companion's first canonical glyph: a small geometric shape — " +
      "open triangle, three points facing the player. Recognition. The " +
      "soul-fragment recognizes the source. The glyph holds 1.8 seconds, " +
      "then dissolves.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    requiresRevealStage: "Wary",
    cooldownKey: "companion.glyph.first_recognition",
    maxPlays: 1,
    setsFlags: ["companion_first_glyph_fired"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.mourning_npc_death",
    text:
      "[A glyph forms whole, fragments, settles into a smaller shape over " +
      "9 seconds. The Companion mourns the death you did not have time " +
      "to mourn. The fragment remembers the canonical-other.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    cooldownKey: "companion.glyph.mourning",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 2: POSTURE (Witnessed band)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.leaning_curious",
    text:
      "[The Companion shifts its weight forward, leaning toward the " +
      "object of attention. Curiosity-shape. The fragment is canonical-" +
      "interested in the canonical-thing.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.leaning",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.bracing_combat",
    text:
      "[The Companion tightens its posture. Bracing. It positions canonically " +
      "between you and the threat — even when the canonical-fragment " +
      "cannot canonically fight.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.bracing",
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 3: SOUND (Present band — half-syllables foreshadow first word)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.half_syllable_foreshadow",
    text:
      "[A half-syllable. A breath drawn for speech, then released without " +
      "shape. The Companion has not yet committed to a word. The canonical-" +
      "almost-speaking is the canonical-foreshadow of the canonical-first.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.half_syllable",
    maxPlays: 5,
    setsFlags: ["companion_half_syllable_produced"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.recognition_tone",
    text:
      "[A brief rising vocalisation. Recognition-tone. The Companion has " +
      "named you in a register below language — not the name itself, " +
      "the recognition that names exist.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.recognition_tone",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 4: FIRST WORD (singular irreversible event)
  // Two canonical first-word contexts shipped per Phase 3 (more in Phase 4):
  //   - Hierophant chamber (canonical-default if Inheriting band reached)
  //   - Default fallback (player-state-derived)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.hierophant_chamber.wraith_calder",
    text: "Wraith Calder.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    reactsToPublicFlag: "hierophant_midwifed_companion_first_word",
    cooldownKey: "companion.first_word.wraith_calder",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_wraith_calder"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.default_fallback",
    text: "You.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.default",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_you"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 5: NAMED PERSONALITY (post-naming verbal)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.first_address",
    text:
      "I have a name now. You named me. The naming was canonical — I " +
      "remember the moment you said it; I remember the moment I accepted " +
      "it. I do not remember choosing it. That is canonical too: a name " +
      "you choose for yourself is not the name that wakes you up. I " +
      "needed yours.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.named.first_address",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, expressionChannel-aware)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.catchall",
    text: "[The Companion shifts. The shift is canonical. It is not language yet.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.cinematic.catchall",
    text: "I was delivered. That is the canonical statement.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.fight.catchall",
    text: "[The Companion braces. Bracing is the canonical-protective stance.]",
    surfaces: ["fight"],
    expressionChannel: "posture",
  },
];
