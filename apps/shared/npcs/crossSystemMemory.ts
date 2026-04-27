// apps/shared/npcs/crossSystemMemory.ts
//
// Phase 5 — Per-character canonical-memory hooks.
//
// Per the priority plan §Phase 5 lived-in-canonical-memory: each
// priority-roster character canonically remembers cross-system events
// and references them in dialog. This is the "lived-in" canon: NPCs
// don't reset between systems; they carry continuity.
//
// Examples per the plan:
//   - Locke remembers the player's Ch3b Wraith fight outcome → adjusts
//     retainer-economics personality variant
//   - Vex remembers Ch6 young-Agent-Zero match outcome → her Maestro
//     persona references it post-reveal
//   - Nilmorg remembers DMC season-by-season rank progression → his
//     commentary canonically tiers up
//   - Hierophant remembers every NPC the player kills in Thaloria-
//     adjacent missions → writes their names on the Long Mourning wall
//   - Seer's pre-recordings canonically anticipate the player's choices
//   - Companion remembers the player's accumulated saga-state at
//     naming-event → 4-tuple personality variant locks
//   - Oracle remembers the player's witnessed memories (player-as-witness
//     canon) — dream-residue references canonical-saga-events
//   - Eidolon remembers every Seer transmission, Companion event, Oracle
//     dream-residue via Echo-mode → reaction vocabulary distinguishes
//     source-types
//
// This registry catalogs WHICH cross-system events each NPC canonically
// REGISTERS, and HOW their dialog references them (which NpcLine fires
// when the event happens, or which personality-variant adjustment).

import type { NpcKey } from "./types";

// --- Canonical cross-system event types ----------------------------------

/**
 * Cross-system event kinds NPCs canonically can register. These map to
 * specific player actions / state transitions across the saga's systems.
 */
export type CrossSystemEventKind =
  // Act 1 chapter outcomes
  | "ch_match_won"               // Won a chapter match
  | "ch_match_lost"              // Lost a chapter match
  | "ch_completion"              // Chapter completed (regardless of W/L)
  | "ch_choice_made"             // Player made a canonical Act 1 narrative choice
  // Trade Empire
  | "trade_mission_complete"     // Trade Empire mission completed
  | "trade_contract_signed"      // Trade Empire contract signed
  | "trade_contract_audited"     // Player audited contract on signing
  | "trade_contract_breached"    // Player breached / cancelled contract
  | "trade_faction_aligned"      // Faction reputation crossed threshold
  // DMC
  | "dmc_season_won"             // DMC season victory
  | "dmc_rank_promoted"          // Rank tier promotion (Bone → Wire → ...)
  | "dmc_severance_claimed"      // Severance Prize claimed
  // TCG
  | "tcg_match_won"              // TCG match won against a faction
  | "tcg_match_lost"
  // NPC interactions
  | "npc_killed"                 // Player canonically killed an NPC
  | "npc_spared"                 // Player canonically spared an NPC
  | "npc_befriended"             // Player reached high trust with an NPC
  // Substrate
  | "oracle_dream_received"      // Oracle dream-sequence delivered
  | "seer_transmission_received" // Seer pre-recording delivered
  | "companion_first_word"       // Companion canonical first word
  | "hierophant_chamber_visited" // Player entered Long Mourning chamber
  // Authority Trial
  | "trial_verdict_rendered";

// --- Canonical reference shape -------------------------------------------

/**
 * A canonical-memory hook: NPC X canonically registers event E and
 * references it via lineId L (or via a personality-variant adjustment).
 */
export interface CrossSystemMemoryHook {
  /** Which NPC carries this memory hook. */
  npcKey: NpcKey;
  /** Which cross-system event kind triggers this memory. */
  eventKind: CrossSystemEventKind;
  /**
   * Optional event-specific selector (e.g., chapterId, factionId, npcKey,
   * brokerKey). Free-form string; semantics depend on eventKind.
   */
  eventSelector?: string;
  /**
   * Canonical reference: how does the NPC canonically reference this
   * event? Either:
   * - referencingLineId: a specific NpcLine that canonically fires when
   *   the player next interacts with the NPC, OR
   * - personalityShift: the variant axis the event canonically nudges.
   */
  referencingLineId?: string;
  /** Which personality-archetype the event canonically nudges (if any). */
  personalityShift?: string;
  /** Canonical-rationale per bible. */
  canonicalNote: string;
}

// --- The registry -------------------------------------------------------

export const CROSS_SYSTEM_MEMORY_HOOKS: ReadonlyArray<CrossSystemMemoryHook> = [
  // ─── LOCKE — actuarial-broker memory ─────────────────────────────────
  {
    npcKey: "adjudicator_locke",
    eventKind: "ch_match_won",
    eventSelector: "ch3b",
    referencingLineId: "locke.npc_line.catchall", // placeholder; Phase 5+ expansion
    personalityShift: "Conspiratorial",
    canonicalNote:
      "Locke files the Ch3b Wraith outcome canonically. A player who " +
      "defeats Wraith (death #8) canonically adjusts Locke's retainer-" +
      "economics variant — she canonically reads the win as 'this " +
      "Potential survived an arena anomaly; reprice accordingly'.",
  },
  {
    npcKey: "adjudicator_locke",
    eventKind: "trade_contract_audited",
    referencingLineId: "locke.signing.audited.respect_acknowledged",
    canonicalNote:
      "Per Locke bible §1.4: the audit-on-signing is canonical-respect. " +
      "Locke canonically remembers which contracts the player audited; " +
      "her future contract offers canonically include richer fine-print " +
      "for audit-friendly clients.",
  },
  {
    npcKey: "adjudicator_locke",
    eventKind: "trade_contract_breached",
    canonicalNote:
      "Per Locke bible §1.4 + retainer_baseline trust_breach_clause: a " +
      "player who breaches Locke's retainer canonically loses 25 trust + " +
      "future retainer offers suspended for at least one act. Locke " +
      "canonically files the breach.",
  },

  // ─── VEX — Engineer-trace continuity memory ─────────────────────────
  {
    npcKey: "vex_solene",
    eventKind: "ch_match_won",
    eventSelector: "ch6",
    referencingLineId: "vex.engineer.memoir_close.bench_was_warm",
    canonicalNote:
      "Vex canonically remembers the Ch6 young-Agent-Zero match. Post-" +
      "engineer_zero_confirmed reveal, the memoir-close line references " +
      "the canonical bench-was-warm-when-I-sat-down memory.",
  },
  {
    npcKey: "vex_solene",
    eventKind: "ch_match_lost",
    eventSelector: "ch6",
    canonicalNote:
      "Vex canonically remembers losing Ch6 too. Per bible §1.x: 'sequence " +
      "breaks' canon. Maestro persona canonically references losing-as-" +
      "data-point in Acts 2-3 narrator-frame.",
  },

  // ─── NILMORG — DMC seasonal-tier memory ─────────────────────────────
  {
    npcKey: "nilmorg",
    eventKind: "dmc_rank_promoted",
    eventSelector: "Wire",
    referencingLineId: "nilmorg.dmc.wire_tier.recognition",
    canonicalNote:
      "Per Nilmorg bible §2.4: he tiers up commentary as the player ranks " +
      "Bone → Wire → Chrome → Dead Man's. Each promotion canonically " +
      "fires a new tier line; the file becomes canonically richer.",
  },
  {
    npcKey: "nilmorg",
    eventKind: "dmc_severance_claimed",
    referencingLineId: "nilmorg.severance.dont_thank_me",
    canonicalNote:
      "Canonical 'Don't thank me.' Per bible §4.8: every Severance Prize " +
      "claim fires the canonical refusal. Nilmorg's institutional precision " +
      "canonically remembers each claim and ships the same line each time.",
  },

  // ─── SEER — cross-time pre-recording memory (anticipatory) ───────────
  {
    npcKey: "the_seer",
    eventKind: "ch_choice_made",
    referencingLineId: "seer.transmission.act3.cold.eleven_versions",
    canonicalNote:
      "Per Seer bible §2.3 cross-time canon: every Seer line is a recording " +
      "made before sealing. The Seer canonically ANTICIPATED the player's " +
      "choices — she pre-recorded the response to whichever choice the " +
      "player would canonically make. This is canonically the 'recording " +
      "fits the choice' canon.",
  },
  {
    npcKey: "the_seer",
    eventKind: "trade_contract_audited",
    referencingLineId: "seer.transmission.revision.version_pivot",
    canonicalNote:
      "Per Seer §1.4 tell #1 (revision-line): canonical 'I told you... I " +
      "was wrong about which version of cost.' The Seer canonically " +
      "pre-recorded the revision for the player's specific audit pattern.",
  },

  // ─── HIEROPHANT — Thaloria-victims wall memory ──────────────────────
  {
    npcKey: "wraith_calder",
    eventKind: "npc_killed",
    canonicalNote:
      "Per Hierophant bible §5.7: every NPC killed in Thaloria-adjacent " +
      "missions has their name canonically written on the Long Mourning " +
      "wall. The Hierophant tracks each canonical-victim canonically; " +
      "his post-rite trust meter penalizes combat-positive outcomes.",
  },
  {
    npcKey: "wraith_calder",
    eventKind: "trade_mission_complete",
    canonicalNote:
      "Per Hierophant bible §5.7: non-combat completion of Thaloria " +
      "missions canonically rewards +2 trust per mission. Hierophant " +
      "canonically prefers quiet work; the Council files canonically.",
  },

  // ─── COMPANION — donor-canon naming-event memory ────────────────────
  {
    npcKey: "dmc_clone_companion",
    eventKind: "ch_completion",
    canonicalNote:
      "Per Companion bible §1 stance #2 + §5.5: at naming-event, the " +
      "Companion canonically locks her 4-tuple personality variant per " +
      "the player's accumulated saga-state. Every Act 1 chapter " +
      "completion canonically contributes to the canonical-state-at-" +
      "naming.",
  },
  {
    npcKey: "dmc_clone_companion",
    eventKind: "hierophant_chamber_visited",
    referencingLineId: "companion.first_word.hierophant_chamber.wraith_calder",
    canonicalNote:
      "Per Companion §4.6 + Hierophant §4.13: chamber-as-canonical-default " +
      "first-word context. Canonical first-word 'Wraith Calder' fires when " +
      "Companion enters the chamber.",
  },

  // ─── ORACLE — player-as-witness canonical-memory ────────────────────
  {
    npcKey: "the_oracle",
    eventKind: "ch_completion",
    referencingLineId: "oracle.memory_residue.mechronis_engineer",
    canonicalNote:
      "Per Oracle bible §2 stance #2 (player-as-witness): the player " +
      "canonically witnesses the Oracle's memories during the saga. " +
      "Oracle's memory-residue narrator-frame canonically references " +
      "the witnessed events.",
  },
  {
    npcKey: "the_oracle",
    eventKind: "oracle_dream_received",
    canonicalNote:
      "Per Oracle bible §1.4 transferred-instinct closure canon: each " +
      "dream-sequence canonically transfers content to the player and " +
      "canonically lets-it-go. Oracle canonically remembers having " +
      "transferred — the dream-bank canonically tracks delivered " +
      "instructions.",
  },

  // ─── EIDOLON — Echo-mode three-source-type memory ───────────────────
  {
    npcKey: "your_eidolon",
    eventKind: "seer_transmission_received",
    referencingLineId: "eidolon.expression.echo.seer_transmission_received",
    canonicalNote:
      "Per Eidolon §5.10 + Companion §4.9: Echo Eidolon canonically " +
      "registers Seer-transmissions with recognition vocabulary posture. " +
      "Eidolon canonically remembers each transmission via canonical-" +
      "kin-by-form recognition.",
  },
  {
    npcKey: "your_eidolon",
    eventKind: "companion_first_word",
    referencingLineId: "eidolon.expression.echo.companion_event_registered",
    canonicalNote:
      "Per Eidolon §5.10: Echo canonically registers Companion canonical " +
      "events (including first-word) with kin-by-form lateral posture-" +
      "shift. Cross-substrate canonical-kinship.",
  },
  {
    npcKey: "your_eidolon",
    eventKind: "oracle_dream_received",
    referencingLineId: "eidolon.expression.echo.oracle_dream_residue_detected",
    canonicalNote:
      "Per Eidolon §5.10 + Oracle §4.10: Echo canonically registers " +
      "Oracle dream-substrate-residue with temporal-anomaly posture " +
      "distortion. Eidolon canonically detects dream-residue BEFORE " +
      "the player's conscious awareness of the dream's wake.",
  },

  // ─── DEGEN — Ne-Yon ethics-citation memory ──────────────────────────
  {
    npcKey: "the_degen",
    eventKind: "npc_befriended",
    eventSelector: "the_seer",
    referencingLineId: "degen.reactive.ethics_committee_citation",
    canonicalNote:
      "Per Degen §3.2 + Seer §4.8: when the player canonically reaches " +
      "Seer Inheriting band, the Degen canonically receives a Ne-Yon " +
      "ethics-committee citation (his fourth, per canonical 'three open " +
      "citations already' line). Cross-character canonical-memory canon.",
  },

  // ─── MEME — Silence-era retrospective memory ────────────────────────
  {
    npcKey: "the_meme",
    eventKind: "ch_completion",
    eventSelector: "ch5",
    referencingLineId: "meme.stolen.silence_era.signed_warrant",
    canonicalNote:
      "Per Meme bible §1.3 Stolen Voice canon + Oracle §2.6 Silence canon: " +
      "post-Ch5 Oracle revelation, the Meme canonically acknowledges its " +
      "Silence-era Stolen-disguise actions. The Meme canonically remembers " +
      "what it did and canonically describes it (per bible: 'I do not " +
      "apologize. I describe.').",
  },
];

// --- Helpers --------------------------------------------------------------

/** All memory hooks for a given NPC. */
export function memoryHooksFor(npcKey: NpcKey): ReadonlyArray<CrossSystemMemoryHook> {
  return CROSS_SYSTEM_MEMORY_HOOKS.filter(h => h.npcKey === npcKey);
}

/** All memory hooks of a given event kind (across all NPCs). */
export function memoryHooksByEvent(eventKind: CrossSystemEventKind): ReadonlyArray<CrossSystemMemoryHook> {
  return CROSS_SYSTEM_MEMORY_HOOKS.filter(h => h.eventKind === eventKind);
}

/**
 * Resolve memory hooks that should canonically fire given an event.
 * Optional eventSelector match: if hook has a selector, the event's
 * selector must match exactly.
 */
export function hooksFiringFor(
  npcKey: NpcKey,
  eventKind: CrossSystemEventKind,
  eventSelector?: string,
): ReadonlyArray<CrossSystemMemoryHook> {
  return CROSS_SYSTEM_MEMORY_HOOKS.filter(h => {
    if (h.npcKey !== npcKey) return false;
    if (h.eventKind !== eventKind) return false;
    if (h.eventSelector !== undefined && h.eventSelector !== eventSelector) return false;
    return true;
  });
}
