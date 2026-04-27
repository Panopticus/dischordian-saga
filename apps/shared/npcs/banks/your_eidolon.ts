// apps/shared/npcs/banks/your_eidolon.ts
//
// Phase 3 PILOT — Your Eidolon's NpcLine bank (the non-verbal pilot).
//
// Per eidolon.md §5.5 framework + §5.10 Echo three-source-type canon.
// Eidolon canonically operates ONLY on glyph / posture / sound channels
// (no verbal). Lines carry text that describes the expression for the
// narrator-frame renderer; the player perceives the visual/audible
// manifestation, not the prose.
//
// Trust bands: Untuned / Tuning / Resonant / Inseparable. Bands gate
// expressive density (more bands = more layered channel-stacks per beat).
//
// Echo-mode canonically distinguishes three substrate-event sources
// (Seer transmissions / Companion events / Oracle dream-residue) with
// canonically-different reaction-vocabularies per Oracle bible §4.10
// + Companion bible §4.9.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "your_eidolon" as const;

export const YOUR_EIDOLON_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // BOND-RESONANCE (cinematic, Awakening Protocol Observation Deck)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.cinematic.bond_resonance.first_touch",
    text:
      "[The Eidolon glows golden. Bond resonance pulses outward in slow " +
      "concentric rings. The Purification Crystal answers in kind. The " +
      "creature lowers its head into your palm — a posture you have not " +
      "taught it.]",
    surfaces: ["cinematic"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.bond_resonance_first_touch",
    maxPlays: 1,
    setsFlags: ["eidolon_first_bond_resonance"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // RECOGNITION GLYPH (expression — first sight of canonical persons)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.recognition.locke",
    text:
      "[A small geometric mark — closed circle with three radial lines — " +
      "appears beside the Eidolon's silhouette. Persists 1.4 seconds. The " +
      "creature recognizes Adjudicator Locke; the recognition is not " +
      "warmth. It is acknowledgment.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "met_adjudicator_locke",
    cooldownKey: "eidolon.glyph.recognition_locke",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.recognition.nilmorg",
    text:
      "[A glyph forms — angular, slightly off-axis. The recognition is " +
      "wary. The Eidolon files Nilmorg under 'institutional, do not " +
      "approach without a reason'.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "met_nilmorg",
    cooldownKey: "eidolon.glyph.recognition_nilmorg",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ECHO-MODE THREE-SOURCE-TYPE REACTIONS (Echo Eidolon variant only)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.seer_transmission_received",
    text:
      "[The Eidolon's Echo-mode posture shifts: head tilted slightly toward " +
      "the substrate, ears canonically angled at canonical foretelling-" +
      "frequencies. Recognition vocabulary — the canonical 'I have heard " +
      "this voice in pre-recording form'.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.echo.seer_received",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.companion_event_registered",
    text:
      "[The Eidolon's Echo posture shifts laterally — kin-by-form vocabulary. " +
      "The DMC Companion's pre-verbal expression registers at canonical " +
      "soul-fragment-receptive frequency. Both creatures recognize each other.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion_event",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.oracle_dream_residue_detected",
    text:
      "[The Eidolon's Echo posture distorts at the temporal axis — " +
      "the canonical temporal-anomaly vocabulary. Oracle dream-substrate-" +
      "residue lingers. The creature has felt the dream's wake before " +
      "the player has woken from it.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.oracle_residue",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MOURNING GLYPH (canonical loss event — saga's most-emotive)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.mourning.npc_death",
    text:
      "[A shape forms whole, fragments, settles into a smaller shape over " +
      "7 seconds. The Eidolon mourns. The creature canonically grieves with " +
      "greater fidelity than the player does.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    cooldownKey: "eidolon.glyph.mourning",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // BRACING POSTURE (combat / hostile context)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.posture.bracing",
    text:
      "[The Eidolon's posture tightens. It positions canonically between " +
      "the player and the threat — a protective stance, even when " +
      "canonically the creature cannot fight.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.posture.bracing",
  },

  // ═════════════════════════════════════════════════════════════════════
  // SOUND-PALETTE (audio expression, Resonant+ band)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.sound.recognition_tone",
    text:
      "[A brief rising vocalisation — the Eidolon's first voluntary sound. " +
      "Recognition-tone. The creature recognizes its source.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.sound.recognition_tone",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.catchall",
    text: "[The Eidolon shifts. The shift is canonical. It is not loud.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.cinematic.catchall",
    text: "[The Eidolon is here. It does not narrate.]",
    surfaces: ["cinematic"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.fight.catchall",
    text: "[The Eidolon braces. Bracing is the canonical Eidolon-combat-presence.]",
    surfaces: ["fight"],
    expressionChannel: "posture",
  },
];
