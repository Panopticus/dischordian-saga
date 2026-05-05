// apps/shared/npcs/registry.ts
//
// NPC_REGISTRY — Stage 1 consolidation per the priority plan §Phase 1.
// Per-NPC canonical metadata: trust bands, reveal stages, expression channels,
// player-axes-of-interest, voice IDs, primary rooms, signature monologues.
//
// Each entry is bible-derived; the bible at apps/shared/npcs/bibles/{npcKey}.md
// is the canonical source of truth. This registry is the engine-readable
// projection of those bibles.
//
// Voice IDs match the ElevenLabs registry in apps/scripts/generate-act1-opponent-vo.ts.

import type {
  NpcKey,
  NpcProfile,
  TrustBandDefinition,
} from "./types";

// --- Trust band ladders (per-NPC) -----------------------------------------

const COMPANION_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "fragmented", threshold: 0, label: "Fragmented (Elara) / Shadow (Human)" },
  { band: "lucid", threshold: 30, label: "Lucid (Elara) / Balanced (Human)" },
  { band: "luminous", threshold: 70, label: "Luminous (Elara) / Warm (Human)" },
];

const LOCKE_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Prospect", threshold: 0 },
  { band: "Client", threshold: 20 },
  { band: "Partner", threshold: 40 },
  { band: "Insider", threshold: 60 },
  { band: "Adjudicated", threshold: 80 },
];

const HIEROPHANT_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Hostile", threshold: 0 },
  { band: "Wary", threshold: 20 },
  { band: "Witnessed", threshold: 40 },
  { band: "Present", threshold: 60 },
  { band: "Inheriting", threshold: 80 },
];

const SEER_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Wary", threshold: 0 },
  { band: "Witnessed", threshold: 30, label: "Witnessed-or-Present (single combined band)" },
  { band: "Inheriting", threshold: 80, label: "Inheriting (Act 7 only, single line)" },
];

const COMPANION_DMC_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Wary", threshold: 0 },
  { band: "Witnessed", threshold: 25 },
  { band: "Present", threshold: 55 },
  { band: "Inheriting", threshold: 85 },
];

const ORACLE_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Wary", threshold: 0, label: "Pre-Ch5 cinematic (unattributed)" },
  { band: "Witnessed", threshold: 30, label: "Post-Ch5 (canonical-attribution)" },
  { band: "Present", threshold: 60, label: "Post-Ch6 (mirror-match resolved)" },
  { band: "Inheriting", threshold: 85, label: "Post-Ch12 (Architect/Meme reveal)" },
];

const VEX_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Stranger", threshold: 0 },
  { band: "Watcher", threshold: 25 },
  { band: "Confidant", threshold: 55 },
  { band: "Inner-Circle", threshold: 80 },
];

const NILMORG_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "File-holder", threshold: 0, label: "Bone tier" },
  { band: "Forecaster", threshold: 30, label: "Wire tier" },
  { band: "Counterparty", threshold: 60, label: "Chrome tier" },
  { band: "Counterparty-prime", threshold: 85, label: "Dead Man's tier" },
];

const DEGEN_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Cold-table", threshold: 0 },
  { band: "Recognized", threshold: 25 },
  { band: "Marked", threshold: 50 },
  { band: "Citation-holder", threshold: 75 },
  { band: "Ne-Yon-kin", threshold: 90 },
];

/** Game Master uses presence-bands (passive presence intensity), not bond-trust. */
const GAME_MASTER_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Faint", threshold: 0 },
  { band: "Loud", threshold: 50 },
  { band: "Overwhelming", threshold: 90 },
];

const MEME_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Unrecognized", threshold: 0 },
  { band: "Glimpsed", threshold: 25 },
  { band: "Named", threshold: 60 },
  { band: "Confronted", threshold: 90 },
];

const EIDOLON_BANDS: ReadonlyArray<TrustBandDefinition> = [
  { band: "Untuned", threshold: 0 },
  { band: "Tuning", threshold: 25 },
  { band: "Resonant", threshold: 55 },
  { band: "Inseparable", threshold: 85 },
];

// --- Registry --------------------------------------------------------------

export const NPC_REGISTRY: Readonly<Record<NpcKey, NpcProfile>> = {
  elara: {
    npcKey: "elara",
    name: "Elara",
    role: "Ark companion / co-narrator",
    voiceId: "xMyNDrPFEtQN8iZtT7l2",
    trustBands: COMPANION_BANDS,
    axisOfInterest: ["curiosity", "mercy"],
    personalityArchetypes: ["fragmented", "lucid", "luminous"],
    primaryRoom: "comms-relay",
  },

  the_human: {
    npcKey: "the_human",
    name: "The Human",
    role: "Substrate-voice detective / co-narrator",
    voiceId: "oGbGJdgofRR8z0MxwI8L",
    trustBands: COMPANION_BANDS,
    axisOfInterest: ["vigilance", "vulnerability"],
    personalityArchetypes: ["shadow", "balanced", "warm"],
    primaryRoom: "comms-relay",
  },

  your_eidolon: {
    npcKey: "your_eidolon",
    name: "Your Eidolon",
    role: "Soul-bound pet companion",
    trustBands: EIDOLON_BANDS,
    axisOfInterest: ["vulnerability", "wit"],
    expressionChannels: ["glyph", "posture", "sound"],
    primaryRoom: "observation-deck",
    metadata: {
      voice: "non-verbal-permanent",
      bondMechanic: "eidolonBonds.bond",
    },
  },

  adjudicator_locke: {
    npcKey: "adjudicator_locke",
    name: "Adjudicator Locke",
    faction: "new_babylon",
    role: "Authority adjudicator / contractual broker",
    voiceId: "8XiBWqS5ffaH5naIFHPI",
    trustBands: LOCKE_BANDS,
    axisOfInterest: ["mercy", "conformity"],
    personalityArchetypes: [
      "Mercantile",
      "Predatory",
      "Collegial",
      "Conspiratorial",
      "Judicial",
    ],
    primaryRoom: "trade-nexus",
    signatureMonologueLineId: "locke.signature.welcome_to_the_authoritys_ledger",
    metadata: {
      title: "Adjudicator",
      pronoun: "she/her",
      keepsake: "Trade Coin (unlocks at Partner band)",
    },
  },

  vex_solene: {
    npcKey: "vex_solene",
    name: "Vex Solène",
    faction: "insurgency",
    role: "Coda Maestro / Engineer Zero (post-rite identity)",
    voiceId: "F1waTCPWl7KpShIScYQs",
    trustBands: VEX_BANDS,
    axisOfInterest: ["curiosity", "vulnerability"],
    personalityArchetypes: ["Maestro", "Engineer-trace"],
    revealStages: [
      "eyes_of_reality",
      "vex_public",
      "engineer_zero_hint",
      "engineer_zero_confirmed",
    ],
    primaryRoom: "coda-bridge",
    metadata: {
      preRiteIdentity: "Young Agent Zero (Mechronis Year 3, Ch6)",
      postRiteIdentity: "Vex Solène (Maestro of Coda)",
    },
  },

  the_degen: {
    npcKey: "the_degen",
    name: "The Degen",
    faction: "antiquarian",
    role: "Ne-Yon casino operator / aleatory broker",
    trustBands: DEGEN_BANDS,
    axisOfInterest: ["aggression", "wit"],
    personalityArchetypes: [
      "All-in",
      "Pacifist-at-the-table",
      "Citation-issuer",
      "Ne-Yon-aleatory",
      "Ethics-committee-defendant",
    ],
    primaryRoom: "degens-casino",
    metadata: {
      neYonDomain: "gambling",
      partnership: "Nilmorg (DMC partnership canon)",
    },
  },

  nilmorg: {
    npcKey: "nilmorg",
    name: "Nilmorg",
    faction: "hierarchy",
    role: "DMC Trench broker / Severance Prize ritualist",
    trustBands: NILMORG_BANDS,
    axisOfInterest: ["vigilance"],
    personalityArchetypes: ["Race-Commentary", "Lore-Ceremony"],
    primaryRoom: "dmc-platform",
    signatureMonologueLineId: "nilmorg.signature.bones_are_fresh",
    metadata: {
      svpTitle: "SVP, Kinetic Acquisition",
      canonicalRefusal: "Don't thank me.",
      seasonalTiers: "Bone / Wire / Chrome / Dead Man's",
    },
  },

  the_game_master: {
    npcKey: "the_game_master",
    name: "The Game Master",
    faction: "hierarchy",
    role: "Dead AI in the Matrix of Dreams / Hierarchy R&D Archon",
    trustBands: GAME_MASTER_BANDS,
    axisOfInterest: ["aggression", "conformity"],
    personalityArchetypes: ["Archon", "Cult", "dead_AI"],
    revealStages: ["Archon", "Cult", "dead_AI"],
    primaryRoom: "matrix-of-dreams",
    metadata: {
      bondMechanic: "presence-bands (no trust meter)",
      reverentAct: "Built the Collectors' Arena to recover the Oracle",
    },
  },

  the_meme: {
    npcKey: "the_meme",
    name: "The Meme / Palimpsest Host",
    faction: "architect",
    role: "Voice-impersonator / mirror-surface inhabitant",
    trustBands: MEME_BANDS,
    axisOfInterest: ["wit", "vigilance"],
    personalityArchetypes: ["Broadcast", "Stolen", "Quiet", "Real", "Replacement"],
    revealStages: ["Broadcast", "Stolen", "Quiet", "Real", "Replacement"],
    primaryRoom: "any-reflective-surface",
    metadata: {
      parent: "The Architect (a0813ed canon)",
      stolenVoiceDuration: "11 years (Empire-era; canonical Silence)",
    },
  },

  wraith_calder: {
    npcKey: "wraith_calder",
    name: "Wraith Calder → The Hierophant",
    faction: "thaloria",
    role: "Pre-rite arena survivor / post-rite religious leader",
    trustBands: HIEROPHANT_BANDS,
    axisOfInterest: ["mercy", "vulnerability"],
    personalityArchetypes: ["pre_rite_wraith", "post_rite_hierophant"],
    revealStages: ["pre_arena", "post_arena"],
    primaryRoom: "long-mourning-chamber",
    metadata: {
      preRiteIdentity: "Wraith Calder (seven-deaths arena survivor)",
      postRiteIdentity: "The Hierophant (Tamarin religious revival leader)",
      sevenDeaths: "Ch3b Insurgency cycle canon",
      sacrificeAxis: "inverted (trust deepens transforms threat into companion)",
    },
  },

  the_seer: {
    npcKey: "the_seer",
    name: "The Seer",
    faction: "dreamer",
    role: "Ne-Yon-of-foresight / cross-time pre-recorder",
    trustBands: SEER_BANDS,
    axisOfInterest: ["wit", "curiosity"],
    personalityArchetypes: ["Cold-register", "Warm-register", "Confidant-register"],
    primaryRoom: "thaloria-coordinates",
    signatureMonologueLineId: "seer.signature.bench_has_learned_yet",
    metadata: {
      neYonDomain: "prophecy",
      crossTimeCanon: "every line is a pre-recording (canon §2.3)",
      sealingEvent: "end of Epoch 2 (canon §2.5)",
      memeResistance: "by-construction (Dreamer's-shield + pre-sealing-recording-provenance)",
    },
  },

  dmc_clone_companion: {
    npcKey: "dmc_clone_companion",
    name: "Severance Fragment (pre-naming) / named Companion (post-naming)",
    role: "Severance Prize companion / soul-fragment of player's own Potential",
    trustBands: COMPANION_DMC_BANDS,
    axisOfInterest: ["mercy", "vulnerability"],
    personalityArchetypes: [
      "faction_axis",
      "trust_pattern_axis",
      "alignment_axis",
      "identity_chain_axis",
    ],
    revealStages: ["Wary", "Witnessed", "Present", "Inheriting"],
    expressionChannels: [
      "glyph",
      "posture",
      "sound",
      "first_word",
      "named_personality",
    ],
    primaryRoom: "players-quarters",
    signatureMonologueLineId: "companion.signature.i_was_not_given_i_was_delivered",
    metadata: {
      donor: "player's own Potential (deadMansCircuit.ts:800)",
      midwife: "Nilmorg",
      structuralIdentity: "I was not given. I was delivered.",
      authoringScope: "~3,450 lines (250 base + 64-tuple × 50 per-variant)",
    },
  },

  the_oracle: {
    npcKey: "the_oracle",
    name: "The Oracle",
    faction: "thaloria",
    role: "Voice-stolen-and-recovered / substrate-witness",
    trustBands: ORACLE_BANDS,
    axisOfInterest: ["curiosity", "vulnerability"],
    personalityArchetypes: ["dream_substrate", "memory_residue", "cinematic_exception"],
    revealStages: ["dream_substrate", "memory_residue", "cinematic_exception"],
    expressionChannels: ["verbal"],
    primaryRoom: "thaloria-hidden",
    signatureMonologueLineId: "oracle.signature.you_have_been_hearing_my_voice",
    metadata: {
      pronouns: "he/him (corrected per 0794534 + 8362bae)",
      stolenVoiceDuration: "11 years (Empire-era; canonical Silence)",
      sealingMechanism: "post-Liberation hiding (per canon §2.7)",
      authoringScope: "~88 lines (cinematic + dream + memory; bible §5.5)",
    },
  },

  jericho_jones: {
    npcKey: "jericho_jones",
    name: "Jericho Jones",
    role: "Heart of Time pilot / mercy-killed Akai Shi at Thaloria",
    trustBands: [
      { band: "Stranger", threshold: 0 },
      { band: "Acquaintance", threshold: 20 },
      { band: "Crew", threshold: 45 },
      { band: "Confidant", threshold: 70 },
      { band: "Sworn", threshold: 90 },
    ],
    axisOfInterest: ["mercy", "vigilance"],
    personalityArchetypes: ["pre_thaloria", "thaloria_known", "heart_offered", "aboard"],
    revealStages: ["pre_thaloria", "thaloria_known", "heart_offered", "aboard"],
    expressionChannels: ["verbal"],
    primaryRoom: "ark-bay-heart-of-time",
    signatureMonologueLineId: "jericho.thaloria.confess",
    metadata: {
      pronouns: "he/him",
      ship: "Heart of Time (chrono-engine, two berths, the second moved Act 5)",
      defining_event: "Mercy-kill of Akai Shi at Thaloria; canonical Insurgency dovetail",
      authoringScope: "~26 lines bank + 10-scene romance ladder",
    },
  },
} as const;

// --- Helpers ---------------------------------------------------------------

/**
 * Resolve trust value (0-100) into the canonical band for the given NPC.
 * Returns the highest band whose threshold ≤ trust.
 */
export function resolveTrustBand(npcKey: NpcKey, trust: number): string {
  const profile = NPC_REGISTRY[npcKey];
  if (!profile) {
    throw new Error(`resolveTrustBand: unknown NpcKey ${npcKey}`);
  }
  let current = profile.trustBands[0]?.band ?? "unknown";
  for (const def of profile.trustBands) {
    if (trust >= def.threshold) current = def.band;
  }
  return current;
}

/**
 * Validate that a string is a known canonical band for the given NPC.
 */
export function isKnownBand(npcKey: NpcKey, band: string): boolean {
  const profile = NPC_REGISTRY[npcKey];
  if (!profile) return false;
  return profile.trustBands.some(def => def.band === band);
}

/**
 * Validate that a string is a known canonical reveal-stage for the given NPC.
 */
export function isKnownRevealStage(npcKey: NpcKey, stage: string): boolean {
  const profile = NPC_REGISTRY[npcKey];
  if (!profile?.revealStages) return false;
  return profile.revealStages.includes(stage);
}

/** All registered NPC keys. */
export function allNpcKeys(): ReadonlyArray<NpcKey> {
  return Object.keys(NPC_REGISTRY) as NpcKey[];
}
