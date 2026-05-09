/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY — 12 EPISODES

   The cold school. Architect-coded. Adult-Archon Professors
   (canonized in mechronisProfessors.ts) teach the same systems
   the Mascoteers teach in Celebration, but Architect-programmed:
   graded, surveilled, weaponized. Each Professor's hiddenAgenda
   surfaces as a Round-3 reveal beat.

   Mechronis is the Architect's institutional response to losing
   the first Celebration — a school he can control. The Professors
   believe they ARE the Archons; they aren't. They cannot
   recognize a student who exceeds them. The Mechronis-side player
   meets variants of the same lessons as Celebration, and the
   contrast IS the lesson.

   Cross-school first-take routing: which version did the player
   take FIRST shapes how the second lands. Took chess from the
   Game Master alive in C3? Then Kanevas's drill in M1 hurts.

   See plan §6 (Mechronis Academy — Episode List).
   ═══════════════════════════════════════════════════════ */

import type { MatrixLevelDefinition } from "./matrixOfDreamsLevels";

export const MECHRONIS_ACADEMY_EPISODES: readonly MatrixLevelDefinition[] = [
  {
    id: "mechronis_m1_choric_compliance",
    episodeNumber: 1,
    school: "mechronis",
    title: "Choric Compliance Drill",
    beat: "Headmaster Kanevas's Harmony Drill. Thirty students recite a text in unison. One speaks wrong. The class restarts.",
    teaches: "card_combat_compliance_variant",
    pov: "kanevas_classroom",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson", "ritual", "mystery_reveal"],
    /* Path canon: Mechronis is "the Architect's institutional response
     * to losing the first Celebration." The player must have walked the
     * warm school's first chamber before the cold school registers them
     * as a deviation worth drilling. C1 is the door into the Matrix; M1
     * is the door into the Architect's classroom. */
    prereqEpisodes: ["celebration_c1_the_watch"],
    replayable: true,
    authorNotes:
      "Hidden agenda surfaces in Round 3: students are being conditioned to hear the Architect's story-engine as their own inner voice (per mechronisProfessors.ts). Kanevas is what a teacher-shaped CoNexus looks like. The lesson is card combat under a compliance rubric — every card must be played in unison or the cohort restarts. M1 also gates the first-visit Mechronis cinematic (apps/client/public/videos/openings/mechronis/) — the cohort scene opens with Kanevas registering the player as an off-axis arrival.",
  },
  {
    id: "mechronis_m2_applied_surveillance",
    episodeNumber: 2,
    school: "mechronis",
    title: "Applied Surveillance",
    beat: "Professor Aoki's Observation Triangulation. Three students watch a fourth. The fourth never knows who they are.",
    teaches: "witnessing_surveillance_variant",
    pov: "aoki_classroom",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson", "ritual"],
    prereqEpisodes: [],
    replayable: true,
    authorNotes:
      "Hidden agenda: training students to internalize self-surveillance — the watcher watches themselves forever. The real Watcher enjoyed being seen; Aoki forbids it. If the player took Witnessing first at Celebration C7 (mercy variant), this lesson is uncomfortable in a way Aoki can't measure.",
  },
  {
    id: "mechronis_m3_the_trade_exercise",
    episodeNumber: 3,
    school: "mechronis",
    title: "The Trade Exercise",
    beat: "Curator Halverez. Every question costs you a memory of a prior answer. Choose your questions.",
    teaches: "trade_empire_intro",
    pov: "halverez_classroom",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson", "ritual"],
    prereqEpisodes: [],
    replayable: true,
    authorNotes:
      "Hidden agenda: training acquisition instinct — students will later strip-mine enemy souls for the Architect. The real Collector traded fairly; Halverez rigs the exchanges. The market sim is Trade Empire's intro, but every transaction extracts something the Curator never names.",
  },
  {
    id: "mechronis_m4_the_patrons_game",
    episodeNumber: 4,
    school: "mechronis",
    title: "The Patron's Game",
    beat: "Lady Malkia's exam. The Patron — an Architect proxy — sets a witness-statement test. She does not yet know what she is being graded for.",
    teaches: "apprentice_trial_wrapper",
    pov: "lady_malkia",
    visualMode: "castle_courtyard_noir",
    rounds: ["debate", "ritual", "mystery_reveal"],
    prereqEpisodes: ["celebration_c7_the_patrons_summons"],
    replayable: true,
    authorNotes:
      "Pre-graduate conditioning. Wraps celebrationTrial.ts as a Mechronis-side rite — the 28-day Apprentice Trial is a Mechronis assessment exercised through Celebration's Mascoteers. The two schools collaborate on this one; the player sees the seam.",
  },
  {
    id: "mechronis_m5_the_necromancers_lecture",
    episodeNumber: 5,
    school: "mechronis",
    title: "The Necromancer's Lecture",
    beat: "When he was faculty. The Necromancer teaches consciousness preservation — the prestige cycle is his protocol.",
    teaches: "prestige_system",
    pov: "kanevas_classroom",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson", "ritual"],
    prereqEpisodes: ["mechronis_m1_choric_compliance"],
    replayable: true,
    authorNotes:
      "The Necromancer's hope: the Red Death never finds him. Goal: protect the consciousness buffer. Plan: stay useful enough to live. He delivers the prestige curriculum frankly — but watch his eyes when he names the buffer's failure modes. He has died once. He remembers it.",
  },
  {
    id: "mechronis_m6_the_antiquarian_visits",
    episodeNumber: 6,
    school: "mechronis",
    title: "The Antiquarian Visits",
    beat: "Guest lecture. The Antiquarian (himself, not a Professor) speaks at Mechronis. He is the only honest visiting voice.",
    teaches: "lore_journal",
    pov: "antiquarian_visitor",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson", "quiet"],
    prereqEpisodes: ["mechronis_m1_choric_compliance"],
    replayable: true,
    authorNotes:
      "No hidden agenda — the contrast IS the lesson. The Antiquarian's hope: that no ending is forgotten. He treats grief like a vintage. Students who took Loredex at Celebration C5 (with him + Shadow Tongue) feel the difference here: the same man, different room, no propaganda layer.",
  },
  {
    id: "mechronis_m7_trade_practicum",
    episodeNumber: 7,
    school: "mechronis",
    title: "Trade Practicum",
    beat: "Veska as a senior student. The cohort runs a market sim across the Hierarchy harbormasters. Veska is being graded for defection. She passes. Then she leaves.",
    teaches: "trade_wars_sector",
    pov: "veska_student",
    visualMode: "magical_city_school",
    rounds: ["build", "ritual", "mystery_reveal"],
    prereqEpisodes: ["mechronis_m3_the_trade_exercise"],
    replayable: true,
    authorNotes:
      "Veska's hope: her sectors stay free of Hierarchy harbormasters. She is the only student in the practicum who builds a route the Curator cannot rig. Halverez gives her full marks because he can't read what she did. She walks out the next morning. The student version of her is who the player meets in the Trade Empire tutorials later.",
  },
  {
    id: "mechronis_m8_the_apprentice_trial",
    episodeNumber: 8,
    school: "mechronis",
    title: "The Apprentice Trial",
    beat: "Mechronis hosts the 28-day rite. The Mascoteers run the daily decisions; Professors grade the outcomes.",
    teaches: "apprentice_trial_wrapper",
    pov: "veska_student",
    visualMode: "magical_city_school",
    rounds: ["ritual"],
    prereqEpisodes: ["mechronis_m4_the_patrons_game"],
    replayable: false,
    authorNotes:
      "Wraps celebrationTrial.ts (already canon, 28-day Mascoteer decisions). The episode is the cap — the player's bonded Apprentice graduates here. Apprentice's archetype shapes which mascoteer-decisions land. After this, Apprentice channeling (apprenticeChanneledLines.ts) starts firing in Engineer-domain tutorials.",
  },
  {
    id: "mechronis_m9_the_oracles_counterclaim",
    episodeNumber: 9,
    school: "mechronis",
    title: "The Oracle's Counterclaim",
    beat: "Guest lecture by the white Oracle (re-awakened, per loreData). She offers a counter-Architect reading of timelines.",
    teaches: "prestige_quests",
    pov: "the_oracle",
    visualMode: "hogwarts_class",
    rounds: ["debate", "mystery_reveal"],
    prereqEpisodes: ["mechronis_m5_the_necromancers_lecture"],
    replayable: true,
    authorNotes:
      "Counterpoint to the Seer's Celebration teaching (C7). The Oracle's hope: counterpoint to her sister-prophet. Goal: keep the player choosing on purpose across cycles. She names a prestige quest the Architect hadn't sanctioned. The Headmaster does not interrupt; he can't.",
  },
  {
    id: "mechronis_m10_the_final_exam",
    episodeNumber: 10,
    school: "mechronis",
    title: "The Final Exam",
    beat: "Public dueling. Zephyr-9 grades. She scores on what the Architect cannot measure: kindness during victory.",
    teaches: "boss_mastery",
    pov: "zephyr_proctor",
    visualMode: "hogwarts_duel",
    rounds: ["duel", "quiet"],
    prereqEpisodes: ["mechronis_m1_choric_compliance"],
    replayable: true,
    authorNotes:
      "Zephyr-9 is precise-evaluative. Boss Mastery's score-attack frame fits her perfectly. The hidden grade — kindness during victory — is the Dreamer's seam inside the Architect's exam. Players who take it kindly score higher in a way no Mechronis transcript records.",
  },
  {
    id: "mechronis_m11_the_patrons_true_face",
    episodeNumber: 11,
    school: "mechronis",
    title: "The Patron's True Face",
    beat: "Reveal. The Patron — who has graded students for centuries — is finally visible as an Architect proxy. The hand behind the syllabus is named.",
    teaches: "conspiracy_boards_architect_branch",
    pov: "lady_malkia",
    visualMode: "castle_courtyard_noir",
    rounds: ["mystery_reveal", "debate"],
    conspiracyClue: "patron_is_architect_proxy",
    prereqEpisodes: ["mechronis_m4_the_patrons_game", "mechronis_m9_the_oracles_counterclaim"],
    replayable: true,
    authorNotes:
      "Mechronis-side Conspiracy Board branch. The clue this episode adds is the seam to the Celebration board — the Patron's grading rubric was the Architect's, written in his hand. Cross-school connection becomes available.",
  },
  {
    id: "mechronis_m12_the_diploma_that_isnt",
    episodeNumber: 12,
    school: "mechronis",
    title: "The Diploma That Isn't",
    beat: "The dropout / refusal arc. The player can refuse the diploma and walk. The Dreamer stirs in the room. Someone hums.",
    teaches: "class_mastery_dreamer_refusal",
    pov: "lady_malkia",
    visualMode: "pixar_quiet",
    rounds: ["debate", "ritual", "quiet"],
    prereqEpisodes: ["mechronis_m11_the_patrons_true_face"],
    replayable: true,
    authorNotes:
      "Class Mastery's Dreamer-aligned exit. Players who took Celebration C12 first hear Archie's hum here — the Dreamer remembers him, even at Mechronis. The diploma refusal locks a high-Dreamer alignment beat. Players who accept the diploma get a high-Architect beat instead. Both are valid; both close the chapter.",
  },
];
