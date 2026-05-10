/* ═══════════════════════════════════════════════════════
   BRIDGE DIPLOMACY TABLE — visible-allies surface

   The Bridge already carries a Diplomacy Table hotspot with
   pre-existing VO. This module declares which NPCs sit at
   the table once the player has met them, growing the table
   from "empty + holo-frozen pre-launch delegates" to
   "every ally I have ever met" by the time of the Act 7
   Convergence Seat.

   Each seat:
     - Names the NPC.
     - Carries a `metFlag` — when this flag is true, the
       NPC physically appears at the table.
     - Carries a `seatPosition` so the UI can place chairs
       deterministically (1..16, clockwise from the head).

   The Convergence Seat goodbye walk reads this module to
   know who has earned a chair.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export interface DiplomacyTableSeat {
  /** Stable id for the chair / NPC. */
  npcId: string;
  /** Display name above the chair. */
  displayName: string;
  /** When this flag is true, the NPC is rendered at the table. */
  metFlag: string;
  /** 1-based seat position around the oval table (clockwise from the
   *  head — the Captain's chair, which remains empty until prestige). */
  seatPosition: number;
  /** Short descriptor of where the player first encountered them.
   *  Surfaces under the chair label so the meeting feels remembered. */
  firstMet: string;
}

export const DIPLOMACY_TABLE_SEATS: ReadonlyArray<DiplomacyTableSeat> = [
  // The head of the table (seat 1) is the Captain's chair — left
  // empty until prestige. Elara stands at seat 2 by default; she's
  // the AI, she does not sit but the chair is hers in fiction.
  {
    npcId: "elara",
    displayName: "Elara",
    metFlag: "prelude_cryo_bay_entered",
    seatPosition: 2,
    firstMet: "Beat A · Cryo wake",
  },
  {
    npcId: "the_human",
    displayName: "The Human",
    metFlag: "human_life_celebration_seen",
    seatPosition: 3,
    firstMet: "Beat C.5 · first whisper",
  },
  {
    npcId: "adjudicator_locke",
    displayName: "Adjudicator Locke",
    metFlag: "prelude_beat_h_inbox_first_open",
    seatPosition: 4,
    firstMet: "Beat H · first inbox",
  },
  {
    npcId: "the_antiquarian",
    displayName: "The Antiquarian",
    metFlag: "antiq_bridge_act_1_close_seen",
    seatPosition: 5,
    firstMet: "Beat J · first Loredex page",
  },
  {
    npcId: "patch",
    displayName: "Patch",
    metFlag: "prelude_crew_mission_1_complete",
    seatPosition: 6,
    firstMet: "Crew Mission 1 · DeMagi engineer",
  },
  {
    npcId: "zephyr_9",
    displayName: "Zephyr-9",
    metFlag: "prelude_crew_mission_2_complete",
    seatPosition: 7,
    firstMet: "Crew Mission 2 · Quarchon fragment",
  },
  {
    npcId: "little_one",
    displayName: "Little One",
    metFlag: "prelude_crew_mission_3_complete",
    seatPosition: 8,
    firstMet: "Crew Mission 3 · burnt-card carrier",
  },
  {
    npcId: "the_seer",
    displayName: "The Seer",
    metFlag: "act1_cycle_c_witnessing_unlocked",
    seatPosition: 9,
    firstMet: "Act 1 Cycle C · Last Words landing",
  },
  {
    npcId: "vex_solene",
    displayName: "Vex Solène",
    metFlag: "vex_solene_recruited",
    seatPosition: 10,
    firstMet: "Engineering bench · diary fingerprint",
  },
  {
    npcId: "the_game_master",
    displayName: "The Game Master",
    metFlag: "game_master_first_loss",
    seatPosition: 11,
    firstMet: "Act 2 · Chess Climb forced loss",
  },
  {
    npcId: "the_degen",
    displayName: "The Degen",
    metFlag: "casino_first_visit",
    seatPosition: 12,
    firstMet: "Act 4.5 · Casino unlock",
  },
  {
    npcId: "iron_lion",
    displayName: "Iron Lion",
    metFlag: "cades_m7_complete",
    seatPosition: 13,
    firstMet: "Cades M7 · 3001st poster",
  },
  {
    npcId: "agent_zero",
    displayName: "Agent Zero",
    metFlag: "armory_dog_tag_collected",
    seatPosition: 14,
    firstMet: "Armory · dog-tag pickup",
  },
  {
    npcId: "the_inventor",
    displayName: "The Inventor",
    metFlag: "palimpsest_episode_12_seen",
    seatPosition: 15,
    firstMet: "Palimpsest Ep 12 · 45-second hack",
  },
  {
    npcId: "malkia_enigma",
    displayName: "Malkia · The Enigma",
    metFlag: "last_words_full_song_heard",
    seatPosition: 16,
    firstMet: "Beat J → Act 7 · Last Words singer",
  },
];

/** Returns the subset of seats whose NPCs the player has already met. */
export function getDiplomacyTableSeats(
  flags: ReadonlySet<string>,
): DiplomacyTableSeat[] {
  return DIPLOMACY_TABLE_SEATS.filter((seat) => flags.has(seat.metFlag)).sort(
    (a, b) => a.seatPosition - b.seatPosition,
  );
}

/** Total possible seats (excluding the empty Captain's chair at seat 1). */
export const DIPLOMACY_TABLE_TOTAL_SEATS = DIPLOMACY_TABLE_SEATS.length;

/** True once every possible seat has been earned — used by the
 *  Convergence Seat goodbye walk. */
export function diplomacyTableFull(flags: ReadonlySet<string>): boolean {
  return DIPLOMACY_TABLE_SEATS.every((s) => flags.has(s.metFlag));
}
