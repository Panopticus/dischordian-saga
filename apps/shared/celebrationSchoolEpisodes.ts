/* ═══════════════════════════════════════════════════════
   CELEBRATION SCHOOL — 12 EPISODES

   The second-incarnation Celebration the player visits via
   Hellbox. Dreamer-coded reconstruction of the school the
   Architect's younger self (Archie) attended before the first
   Celebration burned. The cohort is preserved as the Mascoteers.
   The Game Master teaches chess here, alive in the way Matrix
   imprints are alive. The Artist Prince attends — he is the
   young Engineer. The Hamlet mystery (how the FIRST Celebration
   fell) is what the player solves across these episodes.

   Episodes load via apps/shared/matrixOfDreamsLevels.ts. The
   runtime is apps/client/src/pages/MatrixSchoolEpisodePage.tsx
   (Phase B); this module is data-only.

   See plan §5 (Celebration School — The Hamlet Mystery + Episode
   List).
   ═══════════════════════════════════════════════════════ */

import type { MatrixLevelDefinition } from "./matrixOfDreamsLevels";

export const CELEBRATION_SCHOOL_EPISODES: readonly MatrixLevelDefinition[] = [
  {
    id: "celebration_c1_the_watch",
    episodeNumber: 1,
    school: "celebration",
    title: "The Watch",
    beat: "Bernardo and Lady Malkia see the King's ghost on the Celebration Castle ramparts.",
    teaches: "conspiracy_boards_intro",
    pov: "bernardo",
    visualMode: "lucasarts_mystery",
    rounds: ["explore_clue_stitch", "mystery_reveal"],
    conspiracyClue: "ghost_seen",
    prereqEpisodes: [],
    replayable: true,
    authorNotes:
      "Hamlet opening. Bernardo's hope: the ghost was real because that means he isn't crazy. Malkia's plan: trust Bernardo, distrust authority. The Ghost speaks five words and dissolves: 'Beware the one who wears my crown.'",
  },
  {
    id: "celebration_c2_first_day",
    episodeNumber: 2,
    school: "celebration",
    title: "First Day",
    beat: "The Artist Prince enrolls. Vernon mocks him at the gates. The Game Master watches from the cloister, already smiling.",
    teaches: "card_combat_intro",
    pov: "the_prince",
    visualMode: "magical_city_school",
    rounds: ["explore_clue_stitch", "class_lesson"],
    prereqEpisodes: ["celebration_c1_the_watch"],
    replayable: true,
    authorNotes:
      "Cards introduced as student tools — every student carries a starter deck for class exercises. Game Master sidelines voice only; he does not yet teach. Vernon's hope: cruelty earns him Seeker.",
  },
  {
    id: "celebration_c3_chess_class",
    episodeNumber: 3,
    school: "celebration",
    title: "Chess Class",
    beat: "The Game Master teaches the full chess curriculum — board, movement, special moves, opening principles. The Prince is the only student he watches.",
    teaches: "chess_intro_alive_warm",
    pov: "the_prince",
    visualMode: "hogwarts_class",
    rounds: ["class_lesson"],
    prereqEpisodes: ["celebration_c2_first_day"],
    replayable: true,
    authorNotes:
      "Game Master is Senator-era (per the_game_master.md §2.1) — warm, predestination-tinted, doomed. He never says 'darling' (Right) or raises voice (Right) or sounds bureaucratic (Original post-split). He is the man who shared a desk with Elara and laughed twice.",
  },
  {
    id: "celebration_c4_under_the_floor",
    episodeNumber: 4,
    school: "celebration",
    title: "Under the Floor",
    beat: "The Mascoteers' lair beneath the school. Archie shows the Prince the imprint laser prototype: 'You draw worlds, I build them. We could try together.'",
    teaches: "deck_builder_origins_crafting",
    pov: "the_prince",
    visualMode: "lucasarts_hidden_lab",
    rounds: ["explore_clue_stitch", "build"],
    prereqEpisodes: ["celebration_c3_chess_class"],
    replayable: true,
    authorNotes:
      "First time the player meets young Archie up close. Wanda is welding nearby; Minnie is hacking the school PA in the background; Shiyon's graffiti covers the walls. The bench prototype is here. Archie sketches the Inception Ark engine on a scrap of paper.",
  },
  {
    id: "celebration_c5_the_banner_glitches",
    episodeNumber: 5,
    school: "celebration",
    title: "The Banner Glitches",
    beat: "The town square's recruitment banner glitches. Ghostly faces appear in the script. The first canonical Shadow Tongue surfacing — the propaganda layer is visible.",
    teaches: "loredex_propaganda_layer",
    pov: "the_prince",
    visualMode: "pixar_glitch_overlay",
    rounds: ["explore_clue_stitch", "mystery_reveal"],
    conspiracyClue: "banner_glitches_propaganda",
    prereqEpisodes: ["celebration_c4_under_the_floor"],
    replayable: true,
    authorNotes:
      "Shadow Tongue's hope: that the propaganda layer is finally read as art. He shows the Prince the seam — the moment the Warlord's edits became visible to anyone with the right kind of eyes.",
  },
  {
    id: "celebration_c6_the_dueling_court",
    episodeNumber: 6,
    school: "celebration",
    title: "The Dueling Court",
    beat: "Vernon Vortex challenges the Prince. Paint-magic vs. solar-emblem electricity. The Game Master referees.",
    teaches: "card_combat_depth_keywords_spells",
    pov: "the_prince",
    visualMode: "hogwarts_duel",
    rounds: ["duel"],
    prereqEpisodes: ["celebration_c2_first_day"],
    replayable: true,
    authorNotes:
      "First card combat where keywords and spells matter mechanically. Game Master's referee voice is gentle but precise — he is grading the Prince's chessboard mind even in a card duel. Vernon loses; he doesn't take it well.",
  },
  {
    id: "celebration_c7_the_patrons_summons",
    episodeNumber: 7,
    school: "celebration",
    title: "The Patron's Summons",
    beat: "Lady Malkia's uncle blocks her path in the courtyard. He sends her away on a 'special Game' to keep her from warning the Prince.",
    teaches: "witnessing_mercy_variant",
    pov: "lady_malkia",
    visualMode: "castle_courtyard_noir",
    rounds: ["debate", "mystery_reveal"],
    conspiracyClue: "uncle_blocks_messenger",
    prereqEpisodes: ["celebration_c1_the_watch"],
    replayable: true,
    authorNotes:
      "Witnessing the Celebration mercy variant: Malkia chooses to comply / refuse / question the patron. The young Seer cameos as interpreter. Each choice writes to the player's three-axis allegiance ledger.",
  },
  {
    id: "celebration_c8_the_ghost_in_the_hall",
    episodeNumber: 8,
    school: "celebration",
    title: "The Ghost in the Hall",
    beat: "The Prince meets his father's ghost. Learns the line: 'Beware the Warlord. Beware the one who wears my crown.' The young Dreamer hums underneath, audible only to the player.",
    teaches: "morality_dream_balance",
    pov: "the_prince",
    visualMode: "pixar_hamlet",
    rounds: ["debate", "ritual"],
    conspiracyClue: "ghost_speaks_the_warlord",
    prereqEpisodes: ["celebration_c1_the_watch", "celebration_c5_the_banner_glitches"],
    replayable: true,
    authorNotes:
      "First time the Dreamer's voice is audible inside the school — she is canonically Archie's split conscience, and Archie is the Prince's best friend, so she can hear the Prince when she can't yet hear anyone else. The Ghost King never names the Warlord; canon (per Engineer Recordings) protects that.",
  },
  {
    id: "celebration_c9_the_match",
    episodeNumber: 9,
    school: "celebration",
    title: "The Match",
    beat: "GOGGLES BEAT. The Prince plays the Game Master at chess. The Prince wins. The Game Master, smiling the smile of a man who had been waiting, hands him the goggles. 'Take them. They were always going to be yours.'",
    teaches: "chess_replay_match",
    pov: "the_prince",
    visualMode: "lucasarts_cinematic",
    rounds: ["duel", "ritual", "mystery_reveal"],
    prereqEpisodes: ["celebration_c3_chess_class", "celebration_c6_the_dueling_court"],
    replayable: true,
    authorNotes:
      "Mechanically: the chess match is playable — the Game Master uses the canonical opening from chessQuoteCanon.lore.ts, the Prince has 50% engine assist that fades over the match. After victory: cinematic of goggles handover. The Prince looks through them. The town's source code unrolls visually. Recording 4½ unlocks. This is the Engineer becoming able to see.",
  },
  {
    id: "celebration_c10_the_arks_rise",
    episodeNumber: 10,
    school: "celebration",
    title: "The Arks Rise",
    beat: "With the goggles' sight, the Prince directs the Inception Ark engines. The Mascoteers race to complete the Arks before the Warlord's drones reach the lair.",
    teaches: "advanced_crafting_sprite_proxy_origins",
    pov: "the_prince",
    visualMode: "lucasarts_cinematic",
    rounds: ["build", "duel"],
    prereqEpisodes: ["celebration_c4_under_the_floor", "celebration_c9_the_match"],
    replayable: true,
    authorNotes:
      "Archie commands the build; the Prince now SEES (goggles), so his sketches feed the engine spec directly. This is canonically where the sprite-proxy lineage starts — the Ark's later sprite-projection systems descend from the Mascoteers' lair tech.",
  },
  {
    id: "celebration_c11_the_uncles_verdict",
    episodeNumber: 11,
    school: "celebration",
    title: "The Uncle's Verdict",
    beat: "The Warlord reveals himself. The nanobot swarm comes for the school. The first Celebration burns.",
    teaches: "authority_trial_prequel",
    pov: "the_prince",
    visualMode: "hamlet_climax",
    rounds: ["debate", "duel", "mystery_reveal"],
    conspiracyClue: "warlord_revealed",
    prereqEpisodes: ["celebration_c10_the_arks_rise"],
    replayable: true,
    authorNotes:
      "The trial the player loses. This is the prequel form of the Act 1 Authority Trial — same 10-phase structure (per trialPhase.ts), but the verdict is fixed: Celebration falls. The player's job is to lose well — to evacuate as many Mascoteers as possible. The Warlord's epitaph for the city: 'You can't win, boy. I'll always be here. Celebration will always be mine.'",
  },
  {
    id: "celebration_c12_the_last_good_day",
    episodeNumber: 12,
    school: "celebration",
    title: "The Last Good Day",
    beat: "REFRAME. Set BEFORE C1, chronologically the earliest. Archie and the Prince at the bench, two boys at thirteen, fixing a clock. Halfway through, the Prince says a line. The line is from Engineer Recording 3, word for word. Elara overlays it. The Prince IS the Engineer.",
    teaches: "apprentice_channeling_full_reveal",
    pov: "the_prince",
    visualMode: "pixar_quiet",
    rounds: ["quiet", "mystery_reveal"],
    conspiracyClue: "prince_is_engineer",
    prereqEpisodes: ["celebration_c11_the_uncles_verdict"],
    replayable: true,
    authorNotes:
      "The identity-collapse beat. Elara's overlay is sparse: a single line, then silence, then her voice catches. The reveal lands without exposition. The Mascoteers don't know — they only have memories up to where they died. Only the Prince carries the future. Pixar-quiet, devastating. After this episode, every prior Celebration episode plays differently on replay.",
  },
];
