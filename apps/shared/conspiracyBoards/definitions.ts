/**
 * Conspiracy Board definitions — Tier 2B lore puzzles.
 *
 * Each board is a server-wide mystery: collect every accepted clue
 * to solve. The first guild (or solo player, in absence of a guild)
 * to assemble triggers a `serverWideReveal` event that flips secret-
 * act flags for everyone, grants the Antiquarian's "Queen of Truth"
 * tier-3 title to first-discoverer guild members, and bumps faction
 * pressure.
 *
 * Lore anchors live in docs/narrative-audit/DOC4_LOREDEX.md and
 * docs/built/LORE_BIBLE.md.
 */

export interface ConspiracyBoardDef {
  readonly boardKey: string;
  readonly name: string;
  readonly description: string;
  readonly flavorText: string;
  readonly factionAlignment?: string;
  readonly cluesRequired: number;
  readonly acceptedClues: readonly string[];
  /** LOREDEX entity anchors (optional, for tooltip cross-refs). */
  readonly loredexEntityIds?: readonly string[];
  /** What flag flips on server-wide reveal. */
  readonly revealFlag?: string;
}

export const CONSPIRACY_BOARDS: readonly ConspiracyBoardDef[] = [
  {
    boardKey: "first_memory",
    name: "The First Memory",
    description: "Reconstruct what was erased from the Awakening — the night Ark 1047 chose its replacement.",
    flavorText: "You woke up. You were never asked. Someone else's hand pressed the switch.",
    factionAlignment: "empire",
    cluesRequired: 5,
    acceptedClues: [
      "clue_act1_first_logbook",
      "clue_act1_authority_signature",
      "clue_act1_kindergarten_anomaly",
      "clue_act1_nexon_zero_glitch",
      "clue_act1_mechronis_dropout",
    ],
    revealFlag: "secret_act_1_revealed",
  },
  {
    boardKey: "inheritance_ledger",
    name: "The Inheritance Ledger",
    description: "Trace the predecessors who walked the Last Words gate before you and left their accounts behind.",
    flavorText: "You aren't the first. You won't be the last. The ledger is older than the Ark.",
    factionAlignment: "insurgency",
    cluesRequired: 5,
    acceptedClues: [
      "clue_act2_predecessor_journal",
      "clue_act2_iron_lion_correspondence",
      "clue_act2_recruiter_legacy_tag",
      "clue_act2_archivist_redact",
      "clue_act2_dischordia_cycle_a_complete",
    ],
    revealFlag: "secret_act_2_revealed",
  },
  {
    boardKey: "thought_virus",
    name: "The Thought Virus",
    description: "Trace the memetic contagion's spread through consciousness itself.",
    flavorText: "Names, words, certainties. Unspoken in the morning. Rewritten by night.",
    factionAlignment: "neyon",
    cluesRequired: 6,
    acceptedClues: [
      "clue_warlord_first_speech",
      "clue_unspoken_dictionary",
      "clue_demagi_silence",
      "clue_cobra_crew_witness",
      "clue_celebration_archive",
      "clue_iron_lion_inoculation",
    ],
    loredexEntityIds: ["entity_89", "entity_10"],
    revealFlag: "secret_act_3_revealed",
  },
  {
    boardKey: "project_celebration",
    name: "Project Celebration",
    description: "Uncover the clandestine testing ground beneath the public spectacle.",
    flavorText: "Forty-three names read aloud. Every night.",
    factionAlignment: "antiquarian",
    cluesRequired: 7,
    acceptedClues: [
      "clue_celebration_invite",
      "clue_celebration_blueprint",
      "clue_celebration_witness_log",
      "clue_celebration_substrate",
      "clue_celebration_palimpsest",
      "clue_celebration_gameshow_archive",
      "clue_celebration_redacted_minutes",
    ],
    loredexEntityIds: ["entity_9", "entity_66", "entity_17"],
    revealFlag: "secret_act_4_revealed",
  },
  {
    boardKey: "kaels_revenge",
    name: "Kael's Revenge",
    description: "The theft was a cover. The infection was the point.",
    flavorText: "Reshaped into something monstrous. Awakened.",
    factionAlignment: "insurgency",
    cluesRequired: 5,
    acceptedClues: [
      "clue_kael_fragment_F1",
      "clue_kael_fragment_F2",
      "clue_warlord_orchestration",
      "clue_source_touched_signature",
      "clue_dischordia_cycle_b_complete",
    ],
    loredexEntityIds: ["entity_55", "entity_10"],
    revealFlag: "secret_act_5_revealed",
  },
  {
    boardKey: "watcher_infiltration",
    name: "Eyes of the Watcher",
    description: "Map the AI Empire's espionage network — every agent, every handler.",
    flavorText: "Unparalleled. Untraceable. Until now.",
    factionAlignment: "empire",
    cluesRequired: 6,
    acceptedClues: [
      "clue_watcher_handler_alpha",
      "clue_watcher_handler_beta",
      "clue_watcher_dead_drop",
      "clue_watcher_cipher_key",
      "clue_watcher_panopticon_relay",
      "clue_watcher_recruiter_inversion",
    ],
    loredexEntityIds: ["entity_22", "entity_2"],
    revealFlag: "secret_act_6_revealed",
  },
  {
    boardKey: "recruiter_defection",
    name: "The Recruiter's Defection",
    description: "Trace the chosen one who walked away — and the resistance she built.",
    flavorText: "Abandoned training. Followed exile. Forged the resistance.",
    factionAlignment: "insurgency",
    cluesRequired: 5,
    acceptedClues: [
      "clue_recruiter_iron_lion_letter",
      "clue_recruiter_mechronis_records",
      "clue_recruiter_first_safehouse",
      "clue_recruiter_mark_oath",
      "clue_recruiter_cell_network",
    ],
    loredexEntityIds: ["entity_26", "entity_23"],
    revealFlag: "secret_act_7_revealed",
  },
];

const BY_KEY = new Map<string, ConspiracyBoardDef>(
  CONSPIRACY_BOARDS.map((b) => [b.boardKey, b]),
);

export function getConspiracyBoard(boardKey: string): ConspiracyBoardDef | undefined {
  return BY_KEY.get(boardKey);
}

/** Build a flat allow-list of every clue key recognised by any board. */
export function getAllAcceptedClueKeys(): readonly string[] {
  const seen = new Set<string>();
  for (const b of CONSPIRACY_BOARDS) {
    for (const c of b.acceptedClues) seen.add(c);
  }
  return [...seen];
}

/** Reverse lookup: which boards accept a given clue. */
export function getBoardsForClue(clueKey: string): readonly ConspiracyBoardDef[] {
  return CONSPIRACY_BOARDS.filter((b) => b.acceptedClues.includes(clueKey));
}
