/**
 * Clue drop tables — which clues drop from which game-mode events,
 * at what rates. Pure data; consumed by `solveService.dropClues`.
 *
 * Drop rates are intentionally low: a clue that drops on every match
 * trivialises the discovery race. Tuning lives in this single file.
 */

import { getAllAcceptedClueKeys, getBoardsForClue } from "./definitions";

/** All possible drop sources. */
export type DropSource =
  | "pvp_card_win"
  | "pvp_card_loss"
  | "pvp_chess_win"
  | "pvp_chess_loss"
  | "coop_raid_clear"
  | "act_completed"
  | "kael_fragment_unlocked"
  | "narrative_milestone";

export interface ClueDropTable {
  readonly source: DropSource;
  /** Probability per event (0..1). */
  readonly dropRate: number;
  /** Pool of clue keys that may drop. */
  readonly pool: readonly string[];
}

/**
 * Default tables. Curated so each board has at least one event-driven
 * source AND at least one narrative source — preventing any single
 * gameType from dominating.
 */
export const DROP_TABLES: readonly ClueDropTable[] = [
  {
    source: "pvp_card_win",
    dropRate: 0.15,
    pool: [
      "clue_warlord_first_speech",
      "clue_warlord_orchestration",
      "clue_celebration_invite",
      "clue_iron_lion_inoculation",
      "clue_recruiter_mark_oath",
    ],
  },
  {
    source: "pvp_card_loss",
    // Losses still drop clues — slower, but no streak required.
    dropRate: 0.05,
    pool: [
      "clue_demagi_silence",
      "clue_celebration_redacted_minutes",
    ],
  },
  {
    source: "pvp_chess_win",
    dropRate: 0.15,
    pool: [
      "clue_celebration_blueprint",
      "clue_celebration_palimpsest",
      "clue_watcher_cipher_key",
      "clue_watcher_dead_drop",
    ],
  },
  {
    source: "pvp_chess_loss",
    dropRate: 0.05,
    pool: [
      "clue_celebration_witness_log",
    ],
  },
  {
    source: "coop_raid_clear",
    dropRate: 0.35,
    pool: [
      "clue_iron_lion_inoculation",
      "clue_cobra_crew_witness",
      "clue_recruiter_first_safehouse",
      "clue_recruiter_cell_network",
      "clue_kael_fragment_F1",
      "clue_kael_fragment_F2",
    ],
  },
  {
    source: "act_completed",
    dropRate: 1.0,
    pool: [
      "clue_celebration_archive",
      "clue_celebration_substrate",
      "clue_celebration_gameshow_archive",
      "clue_unspoken_dictionary",
      "clue_source_touched_signature",
      "clue_dischordia_cycle_b_complete",
      "clue_watcher_panopticon_relay",
      "clue_watcher_recruiter_inversion",
    ],
  },
  {
    source: "kael_fragment_unlocked",
    dropRate: 1.0,
    pool: [
      "clue_kael_fragment_F1",
      "clue_kael_fragment_F2",
    ],
  },
  {
    source: "narrative_milestone",
    dropRate: 0.5,
    pool: [
      "clue_recruiter_iron_lion_letter",
      "clue_recruiter_mechronis_records",
      "clue_watcher_handler_alpha",
      "clue_watcher_handler_beta",
    ],
  },
];

/**
 * Roll a clue drop for a given source. Returns the dropped clue key
 * or null. Caller passes a deterministic random function (so that
 * clue drops are reproducible for replay / testing).
 */
export function rollClueDrop(
  source: DropSource,
  rng: () => number = Math.random,
): string | null {
  const table = DROP_TABLES.find((t) => t.source === source);
  if (!table || table.pool.length === 0) return null;
  if (rng() > table.dropRate) return null;
  const idx = Math.floor(rng() * table.pool.length);
  return table.pool[idx] ?? null;
}

/** Validate (at module load / test time) that every clue in every drop
 *  table actually appears in at least one board's acceptedClues. */
export function validateDropTables(): readonly string[] {
  const accepted = new Set(getAllAcceptedClueKeys());
  const orphans: string[] = [];
  for (const table of DROP_TABLES) {
    for (const clue of table.pool) {
      if (!accepted.has(clue)) orphans.push(clue);
    }
  }
  return orphans;
}

export { getBoardsForClue };
