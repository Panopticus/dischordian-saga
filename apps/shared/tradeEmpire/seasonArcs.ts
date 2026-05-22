/* ═══════════════════════════════════════════════════════
   COMPANION SEASON ARCS — five chained narrative arcs that
   gate card unlocks through `CardUnlockCondition`.

   Each arc is a chain of 5 chapter flags. The chapters are
   the `cq_w_*` weekly entries in companionQuestCatalog.ts.
   Closing the final chapter sets a terminal episode flag the
   `expansionUnlockService.arc_episode_complete` evaluator
   already understands.

   Arc IDs reuse canonical ARC_* identifiers from
   apps/shared/episodeMysteries.ts where possible — extending
   that taxonomy rather than forking it.
   ═══════════════════════════════════════════════════════ */

import type { CompanionQuestAnchor } from "./companionQuestCatalog";

export interface SeasonArcChapter {
  /** Companion quest id that closes the chapter (cq_w_*). */
  weeklyQuestId: string;
  /** The mystery-engine episode id closed when the weekly fires.
   *  Matches the `mystery_episode_complete:<arcId>:<episodeId>`
   *  flag pattern that the unlock service derives. */
  episodeId: string;
  /** One-line summary of what the chapter delivers narratively. */
  beat: string;
}

export interface SeasonArc {
  /** Display name for the season-pass / archive UI. */
  title: string;
  /** Mystery-engine arc id (`arc.*`). Reuses ARC_* canonical ids
   *  where they exist; the finale invents a new id only when no
   *  existing arc fits. */
  arcId: string;
  /** Primary anchor NPCs for the arc. */
  anchors: ReadonlyArray<CompanionQuestAnchor>;
  /** Five chapter beats, in canonical order. */
  chapters: readonly [
    SeasonArcChapter,
    SeasonArcChapter,
    SeasonArcChapter,
    SeasonArcChapter,
    SeasonArcChapter,
  ];
  /** Card ids unlocked when the terminal episode (chapter 5) closes.
   *  These cards' definitions should carry a matching
   *  `unlockCondition: { kind: "arc_episode_complete", arcId, episodeId }`. */
  cardsUnlocked: ReadonlyArray<string>;
}

const ECHOES_OF_THE_ARK: SeasonArc = {
  title: "Echoes of the Ark",
  arcId: "arc.the_collector",
  anchors: ["elara", "the_antiquarian"],
  chapters: [
    {
      weeklyQuestId: "cq_w_elara_antiquarian_wreckage",
      episodeId: "ark_echoes.chapter_1",
      beat: "Elara files the first witness note from the debris field.",
    },
    {
      weeklyQuestId: "cq_w_cross_drael_quiet_account",
      episodeId: "ark_echoes.chapter_2",
      beat: "Daniel sells a page downstream. The Archive cannot refuse the sale.",
    },
    {
      weeklyQuestId: "cq_w_architect_dreamer_order_wonder",
      episodeId: "ark_echoes.chapter_3",
      beat: "The Architect signs the order; the Dreamer dreams the wonder.",
    },
    {
      weeklyQuestId: "cq_w_source_elara_origin",
      episodeId: "ark_echoes.chapter_4",
      beat: "The Source answers what Elara has already asked.",
    },
    {
      weeklyQuestId: "cq_w_pan_faction_memento",
      episodeId: "ark_echoes.e5",
      beat: "Five sectors walked. The Collector's ledger closes a chapter.",
    },
  ],
  cardsUnlocked: ["s1_pack_048"],
};

const FIRST_WITNESS: SeasonArc = {
  title: "First Witness",
  arcId: "arc.the_seer",
  anchors: ["the_seer", "engineer_zero", "the_human"],
  chapters: [
    {
      weeklyQuestId: "cq_w_seer_zero_calibration",
      episodeId: "first_witness.chapter_1",
      beat: "The Seer reads the fork. The Engineer calibrates.",
    },
    {
      weeklyQuestId: "cq_w_human_seer_branching",
      episodeId: "first_witness.chapter_2",
      beat: "The Human's Light/Shadow band shifts under the Seer's gaze.",
    },
    {
      weeklyQuestId: "cq_w_vex_zero_second_first",
      episodeId: "first_witness.chapter_3",
      beat: "Vex never names the Maestro. Zero stays silent.",
    },
    {
      weeklyQuestId: "cq_w_locke_nilmorg_severance",
      episodeId: "first_witness.chapter_4",
      beat: "Two voices, one ledger.",
    },
    {
      weeklyQuestId: "cq_w_seer_zero_calibration",
      episodeId: "fw.e5",
      beat: "The first witness's broadcast finally reaches the Coda.",
    },
  ],
  cardsUnlocked: ["s1_pack_014"],
};

const SUCCESSORS_OATH: SeasonArc = {
  title: "Successor's Oath",
  arcId: "arc.jericho_jones",
  anchors: ["iron_lion_prefall", "jericho_jones", "drael_mon"],
  chapters: [
    {
      weeklyQuestId: "cq_w_drael_iron_lion_leverage",
      episodeId: "successor_oath.chapter_1",
      beat: "Leverage versus oath. The first witness signs nothing.",
    },
    {
      weeklyQuestId: "cq_w_iron_lion_jericho_succession",
      episodeId: "successor_oath.chapter_2",
      beat: "The Walk inherits.",
    },
    {
      weeklyQuestId: "cq_w_drael_iron_lion_leverage",
      episodeId: "successor_oath.chapter_3",
      beat: "Drael'Mon files the standard. The Iron Lion does not survive the chain.",
    },
    {
      weeklyQuestId: "cq_w_iron_lion_jericho_succession",
      episodeId: "successor_oath.chapter_4",
      beat: "Jericho carries the banner without naming it.",
    },
    {
      weeklyQuestId: "cq_w_iron_lion_jericho_succession",
      episodeId: "so.e5",
      beat: "The cadre is the formation. The formation is the oath.",
    },
  ],
  cardsUnlocked: ["s1_char_105"],
};

const EIGHT_ENDINGS: SeasonArc = {
  title: "Eight Endings",
  arcId: "arc.the_necromancer",
  anchors: ["the_antiquarian", "the_necromancer", "the_resurrectionist"],
  chapters: [
    {
      weeklyQuestId: "cq_w_antiquarian_scholar_year",
      episodeId: "eight_endings.chapter_1",
      beat: "Daniel catalogues the year.",
    },
    {
      weeklyQuestId: "cq_w_necromancer_resurrectionist_hinge",
      episodeId: "eight_endings.chapter_2",
      beat: "Name and walk. The cycle hinges.",
    },
    {
      weeklyQuestId: "cq_w_degen_antiquarian_tales",
      episodeId: "eight_endings.chapter_3",
      beat: "The casino is also a library.",
    },
    {
      weeklyQuestId: "cq_w_game_master_twelve_endings",
      episodeId: "eight_endings.chapter_4",
      beat: "Twelve endings narrow to eight.",
    },
    {
      weeklyQuestId: "cq_w_pan_faction_memento",
      episodeId: "ee.e5",
      beat: "Eight endings. One reader. The reader chooses.",
    },
  ],
  cardsUnlocked: ["s1_char_018"],
};

const MEMENTO_DISCHORDIA: SeasonArc = {
  title: "Memento Dischordia",
  arcId: "arc.memento_dischordia",
  anchors: ["the_antiquarian", "elara", "the_human"],
  chapters: [
    {
      weeklyQuestId: "cq_w_pan_faction_memento",
      episodeId: "md.chapter_1",
      beat: "Five sectors. One memorial. The phrase predates the speaker.",
    },
    {
      weeklyQuestId: "cq_w_elara_antiquarian_wreckage",
      episodeId: "md.chapter_2",
      beat: "Elara's note and Daniel's transcript braid into the same page.",
    },
    {
      weeklyQuestId: "cq_w_human_seer_branching",
      episodeId: "md.chapter_3",
      beat: "The Human's band settles. The Seer notes the settling.",
    },
    {
      weeklyQuestId: "cq_w_game_master_twelve_endings",
      episodeId: "md.chapter_4",
      beat: "The Game Master sets down one of the twelve endings.",
    },
    {
      weeklyQuestId: "cq_w_pan_faction_memento",
      episodeId: "md.e5",
      beat: "Remember discord. Remember harmony. Remember the choosing.",
    },
  ],
  cardsUnlocked: ["s1_pack_id_elara_advocate"],
};

export const SEASON_ARCS: ReadonlyArray<SeasonArc> = [
  ECHOES_OF_THE_ARK,
  FIRST_WITNESS,
  SUCCESSORS_OATH,
  EIGHT_ENDINGS,
  MEMENTO_DISCHORDIA,
];

/** Look up the arc that owns a given chapter's weekly quest id. Returns
 *  every arc that lists the quest as a chapter (one weekly can feed
 *  multiple arcs — Memento Dischordia braids existing weeklies into a
 *  finale braid). */
export function arcsForWeeklyQuestId(weeklyQuestId: string): ReadonlyArray<SeasonArc> {
  return SEASON_ARCS.filter((arc) =>
    arc.chapters.some((c) => c.weeklyQuestId === weeklyQuestId),
  );
}

/** Produce the canonical `mystery_episode_complete:<arcId>:<episodeId>`
 *  flag for a given arc + chapter. */
export function chapterFlag(arc: SeasonArc, chapterIndex: 0 | 1 | 2 | 3 | 4): string {
  const ep = arc.chapters[chapterIndex].episodeId;
  return `mystery_episode_complete:${arc.arcId}:${ep}`;
}
