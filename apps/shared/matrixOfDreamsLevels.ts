/* ═══════════════════════════════════════════════════════
   MATRIX OF DREAMS — LEVEL REGISTRY

   The Hellbox in the medbay (canonized in
   docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md, Beats B/C)
   is a neural-lattice fast-travel portal. First touch is a
   compelled cinematic transport to Celebration. Subsequent
   touches reuse it as a portal selector.

   The destinations are LEVELS — playable scripted scenes
   inside the Matrix of Dreams (the Game Master's masterwork,
   per the_game_master.md §2.4, maintained post-destruction
   by the Game Masters cult per cadesNarrativeIntegration.ts).

   Two schools live inside the Matrix:
     • CELEBRATION SCHOOL (second incarnation) — Dreamer-coded,
       warm, magical, slightly too perfect because it's a
       reconstruction. The Game Master teaches chess here,
       alive in the way Matrix imprints are alive. The Artist
       Prince attends — he is the young Engineer. The Hamlet
       mystery (how the FIRST Celebration fell) is what the
       player solves across these episodes.
     • MECHRONIS ACADEMY — Architect-coded, cold, formal,
       Hogwarts-procedural. The Professors believe they ARE
       the Archons; they aren't.

   Same player, same systems, different lessons. Cross-school
   first-take routing colors second-take.

   See plan §4 (The Hellbox & The Two Schools as Matrix-of-
   Dreams Levels).
   ═══════════════════════════════════════════════════════ */

/** Which school the level belongs to. */
export type SchoolId = "celebration" | "mechronis";

/** Visual style register for the level. */
export type VisualMode =
  | "lucasarts_mystery"      // clue-stitching, point-and-click cadence
  | "hogwarts_class"         // benches, blackboard, formal lesson
  | "hogwarts_duel"          // dueling court
  | "magical_city_school"    // Pixar-magical interior
  | "lucasarts_hidden_lab"   // secret-lair register
  | "pixar_glitch_overlay"   // bright surface, distorted underlayer
  | "castle_courtyard_noir"  // night, lanterns, conspiracy
  | "pixar_hamlet"           // Pixar palette, Shakespearean weight
  | "lucasarts_cinematic"    // long, scripted, lightly interactive
  | "hamlet_climax"          // the Warlord-attacks register
  | "pixar_quiet";           // bittersweet, low motion

/** Canonical POV character the player inhabits during this level. */
export type LevelPov =
  | "the_prince"          // young Engineer / Artist Prince
  | "young_archie"        // young Architect
  | "lady_malkia"
  | "bernardo"
  | "mascoteer_collective"
  | "young_seer"
  | "elara_witness"       // a future Elara stitched into the memory
  | "kanevas_classroom"   // Mechronis-side; player IS the cohort
  | "aoki_classroom"
  | "halverez_classroom"
  | "veska_student"
  | "antiquarian_visitor"
  | "the_oracle"
  | "zephyr_proctor";

/** Episode-runtime round configuration (LucasArts / Hogwarts / Mystery). */
export type RoundFormat =
  | "explore_clue_stitch"   // LucasArts-style room exploration + clue board
  | "class_lesson"          // a teacher delivers a lesson; player participates
  | "duel"                  // a one-vs-one combat scene
  | "ritual"                // a structured ceremony
  | "debate"                // a dialog-heavy public exchange
  | "build"                 // construction or repair sequence
  | "mystery_reveal"        // a beat where a clue lands hard
  | "quiet";                // low-motion character scene

/** Game system this episode is the canonical first-introduction for, when player picks this school. */
export type LevelTeaches =
  | "card_combat_intro"
  | "card_combat_compliance_variant"
  | "card_combat_depth_keywords_spells"
  | "chess_intro_alive_warm"
  | "chess_compliance_variant"
  | "chess_replay_match"
  | "deck_builder_origins_crafting"
  | "loredex_propaganda_layer"
  | "witnessing_mercy_variant"
  | "witnessing_surveillance_variant"
  | "morality_dream_balance"
  | "conspiracy_boards_intro"
  | "conspiracy_boards_architect_branch"
  | "trade_empire_intro"
  | "trade_wars_sector"
  | "prestige_system"
  | "lore_journal"
  | "trophy_room"
  | "apprentice_trial_wrapper"
  | "prestige_quests"
  | "boss_mastery"
  | "class_mastery_dreamer_refusal"
  | "authority_trial_prequel"
  | "apprentice_channeling_full_reveal"
  | "advanced_crafting_sprite_proxy_origins"
  | "potential_origin_full";

/** Where in the Hamlet conspiracy board this episode contributes a clue. */
export type ConspiracyClueId =
  | "ghost_seen"
  | "uncle_blocks_messenger"
  | "banner_glitches_propaganda"
  | "ghost_speaks_the_warlord"
  | "warlord_revealed"
  | "patron_is_architect_proxy"
  | "first_celebration_destroyed"
  | "prince_is_engineer";

export interface MatrixLevelDefinition {
  /** Episode id, e.g. "celebration_c1_the_watch". */
  readonly id: string;
  /** Stable episode number within its school (1-based). */
  readonly episodeNumber: number;
  /** Which school. */
  readonly school: SchoolId;
  /** Display title shown in the Hellbox portal selector. */
  readonly title: string;
  /** Story-beat one-liner. */
  readonly beat: string;
  /** Game system the episode teaches. */
  readonly teaches: LevelTeaches;
  /** POV character. */
  readonly pov: LevelPov;
  /** Visual mode the runtime renders in. */
  readonly visualMode: VisualMode;
  /** Round structure of the episode. */
  readonly rounds: readonly RoundFormat[];
  /** Conspiracy-board clue (if any) granted on first completion. */
  readonly conspiracyClue?: ConspiracyClueId;
  /**
   * Episode prerequisites — other episode ids that must be completed
   * before this one becomes selectable in the Hellbox.
   */
  readonly prereqEpisodes: readonly string[];
  /** Whether this episode is replayable for additional layers. */
  readonly replayable: boolean;
  /** Free-form notes for narrative authoring (not shown to player). */
  readonly authorNotes?: string;
}

/* ─── REGISTRY (populated by Celebration + Mechronis episode files) ─── */

import { CELEBRATION_SCHOOL_EPISODES } from "./celebrationSchoolEpisodes";
import { MECHRONIS_ACADEMY_EPISODES } from "./mechronisAcademyEpisodes";

export const MATRIX_OF_DREAMS_LEVELS: readonly MatrixLevelDefinition[] = Object.freeze([
  ...CELEBRATION_SCHOOL_EPISODES,
  ...MECHRONIS_ACADEMY_EPISODES,
]);

/* ─── LOOKUP HELPERS ─── */

export function getLevelById(id: string): MatrixLevelDefinition | undefined {
  return MATRIX_OF_DREAMS_LEVELS.find((l) => l.id === id);
}

export function getLevelsBySchool(school: SchoolId): readonly MatrixLevelDefinition[] {
  return MATRIX_OF_DREAMS_LEVELS.filter((l) => l.school === school);
}

/**
 * Given the set of completed episode ids, return the levels the player
 * can currently select from the Hellbox portal.
 */
export function getAvailableLevels(
  completedIds: ReadonlySet<string>,
): readonly MatrixLevelDefinition[] {
  return MATRIX_OF_DREAMS_LEVELS.filter((l) => {
    if (completedIds.has(l.id) && !l.replayable) return false;
    return l.prereqEpisodes.every((p) => completedIds.has(p));
  });
}

/**
 * Cross-school routing helper: which school did the player learn this
 * subject in FIRST? Drives the "took chess from the Game Master alive
 * — Kanevas's drill *hurts*" delivery shift.
 */
export function getFirstSchoolForTeaching(
  completedIds: ReadonlySet<string>,
  teaches: LevelTeaches,
): SchoolId | undefined {
  // Iterate in registration order — first completed match wins.
  for (const level of MATRIX_OF_DREAMS_LEVELS) {
    if (!completedIds.has(level.id)) continue;
    if (level.teaches === teaches) return level.school;
    // Variants of the same family count for cross-routing too:
    if (
      (teaches === "chess_intro_alive_warm" || teaches === "chess_compliance_variant") &&
      (level.teaches === "chess_intro_alive_warm" || level.teaches === "chess_compliance_variant")
    ) {
      return level.school;
    }
    if (
      (teaches === "witnessing_mercy_variant" || teaches === "witnessing_surveillance_variant") &&
      (level.teaches === "witnessing_mercy_variant" || level.teaches === "witnessing_surveillance_variant")
    ) {
      return level.school;
    }
    if (
      (teaches === "card_combat_intro" || teaches === "card_combat_compliance_variant") &&
      (level.teaches === "card_combat_intro" || level.teaches === "card_combat_compliance_variant")
    ) {
      return level.school;
    }
  }
  return undefined;
}
