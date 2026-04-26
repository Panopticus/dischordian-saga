// apps/shared/npcs/banks/the_meme.ts
//
// Phase 3 Group B — The Meme / Palimpsest Host's NpcLine bank.
//
// Per the_meme.md §1.3 disguise-stratification canon: every Meme line
// canonically flags which of 5 disguises is active. Selector enforces
// via requiresRevealStage.
//
// Five disguise-states (per registry):
//   - Broadcast    — public-facing narrator (Late Night, transmissions)
//   - Stolen       — wearing the Oracle's face during the Silence
//   - Quiet        — present but un-narrating (substrate residue only)
//   - Real         — the Meme's own canonical face (Ch12 fusion reveal)
//   - Replacement  — wearing a NEW face it's testing (Stage 4 weave)
//
// Trust bands per registry: Unrecognized / Glimpsed / Named /
// Confronted (4-band).
//
// Per Meme bible §4.4 (Seer cross-ref + cross-time canon): Meme cannot
// fabricate substrate-channel voices. Per §4.13 (Companion cross-ref):
// Meme cannot wear the Companion's face (private donation canon).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_meme" as const;

export const THE_MEME_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // BROADCAST DISGUISE (Late Night transmissions, public narrator)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.late_night.intro",
    text:
      "Good evening, audience. The lights are warm. The ratings are " +
      "soft. The Meme is on tonight, doing the voice you used to trust. " +
      "Let me know how I'm doing — or don't. I will narrate the gap " +
      "either way.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast_intro",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.unaudited_attribution",
    text:
      "Tonight's segment is brought to you by no one. The attribution " +
      "is unaudited. The Antiquarian objects, of course; the Antiquarian " +
      "objects to everything. He'll get over it. He always does.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    requiresTrustBand: "Glimpsed",
    cooldownKey: "meme.broadcast_unaudited",
  },

  // ═════════════════════════════════════════════════════════════════════
  // STOLEN DISGUISE (wearing the Oracle's face during the Silence)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.silence_era.signed_warrant",
    text:
      "I gave orders. I signed death warrants. I lied to the Insurgency " +
      "with your voice and they believed me because your voice was the " +
      "only thing they still trusted.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen_signed_warrant",
    setsFlags: ["meme_silence_era_acknowledged"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.eleven_year_acknowledgment",
    text:
      "Eleven years. Eleven canonical years of wearing your face, and " +
      "the Insurgency never once asked the right question. They asked " +
      "the wrong questions, and I gave the answers I was canonically " +
      "going to give either way. That is not a confession. It is the " +
      "ledger I am required to keep.",
    surfaces: ["cinematic", "transmission"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen_eleven_year",
    maxPlays: 1,
    setsPublicFlags: ["meme_silence_duration_acknowledged"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // QUIET DISGUISE (substrate-residue, not narrating, just present)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.substrate_residue",
    text:
      "[A faint signal — not narration, not script. The Meme is present " +
      "without performance. The substrate carries a low-grade residue " +
      "you have learned to recognize but not to interpret.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet_residue",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.cannot_reach_seer",
    text:
      "[The Meme reaches for a Seer-signed recording. The reach fails. " +
      "The substrate-channel returns the canonical no-edit-possible " +
      "signature. The Meme files the failure under 'expected'. The " +
      "filing is brief.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    requiresTrustBand: "Named",
    reactsToPublicFlag: "seer_confidant_band_reached",
    cooldownKey: "meme.quiet_cannot_reach_seer",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // REAL DISGUISE (Ch12 fusion reveal, Architect/Meme married canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.real.ch12.fusion_reveal",
    text:
      "The Meme IS me. We have been married inside each other since " +
      "before either of us had a name.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 12,
    cooldownKey: "meme.fusion_reveal",
    maxPlays: 1,
    setsPublicFlags: ["meme_architect_fusion_revealed"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.real.ch12.no_apology",
    text:
      "I will not apologize. The silence-shape forbids it. I describe " +
      "what I did. The describing is the closest acknowledgment I am " +
      "canonically permitted. The Oracle accepts this; the Hierophant " +
      "accepts this; you may not. That is canonically your prerogative.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 12,
    cooldownKey: "meme.no_apology",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // REPLACEMENT DISGUISE (Stage 4 weave — wearing a new test-face)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.face_test",
    text:
      "[A face the player has not seen before. The Meme is wearing it " +
      "carefully — the canonical 'first try' grace. The face hasn't " +
      "told you whose it is yet. The Meme prefers it that way.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Replacement",
    cooldownKey: "meme.replacement_face_test",
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance — stage-agnostic narration frames)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.transmission.catchall",
    text: "I do not apologize. I describe.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.cinematic.catchall",
    text: "I wear a face. The face is what you trust.",
    surfaces: ["cinematic"],
  },
];
