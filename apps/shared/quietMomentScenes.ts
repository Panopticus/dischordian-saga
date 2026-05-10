/* ═══════════════════════════════════════════════════════
   QUIET MOMENT SCENES — Bridge campfire conversations

   Between battles the player needs time to feel. The
   BioWare campfire / Pillars of Eternity inn / Disco
   Elysium thought-cabinet pattern. When a major beat
   completes, the next visit to the Bridge unlocks a brief
   ambient dialog with already-met NPCs.

   Each scene:
     - Triggers on a specific narrative flag (act sub-flag,
       cycle close, or the Last Words landing)
     - Has a canonical speaker (an already-met NPC)
     - Surfaces as a soft Bridge overlay — single utterance,
       dismissible, one-shot per save via `seenFlag`

   The 30-scene target lands here as 31 declared moments
   spanning Prelude through pre-Convergence.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export type QuietMomentSpeaker =
  | "elara"
  | "the_human"
  | "the_antiquarian"
  | "adjudicator_locke"
  | "vex_solene"
  | "patch"
  | "zephyr_9"
  | "little_one"
  | "iron_lion"
  | "the_seer"
  | "the_degen"
  | "the_game_master"
  | "agent_zero";

export interface QuietMomentScene {
  id: string;
  speaker: QuietMomentSpeaker;
  /** Narrative flag that, when true, makes the scene available. */
  triggerFlag: string;
  /** Flag set when the scene has been read; one-shot per save. */
  seenFlag: string;
  /** What the speaker says — a single utterance, 1-3 sentences. */
  line: string;
  /** Where the scene appears in the queue. Lower = sooner. */
  order: number;
}

export const QUIET_MOMENT_SCENES: ReadonlyArray<QuietMomentScene> = [
  /* ─── Prelude → Act 1 (1-3) ─── */
  {
    id: "qm.prelude_close.elara",
    speaker: "elara",
    triggerFlag: "prelude_complete",
    seenFlag: "qm_prelude_close_seen",
    order: 10,
    line:
      "The Ark has not been this awake in seventeen thousand years. I am noting it. The note is for me. You go take the Bridge. I will be here when you come back.",
  },
  {
    id: "qm.prelude_close.human",
    speaker: "the_human",
    triggerFlag: "prelude_complete",
    seenFlag: "qm_prelude_close_human_seen",
    order: 11,
    line:
      "I will be quieter while you walk the rooms. The substrate channel does not need to fill every silence. Some silences are mine and yours together.",
  },

  /* ─── Act 1 cycle closures (4) ─── */
  {
    id: "qm.cycle_a_close.elara",
    speaker: "elara",
    triggerFlag: "act1_cycle_a_complete",
    seenFlag: "qm_cycle_a_close_seen",
    order: 20,
    line:
      "Minnie, Corey, Kanshi Sha. They were children. They became gods because someone needed them to be gods. I wonder if any of us were children. I would like to be one once, briefly. As an experiment.",
  },
  {
    id: "qm.cycle_b_close.human",
    speaker: "the_human",
    triggerFlag: "act1_cycle_b_complete",
    seenFlag: "qm_cycle_b_close_seen",
    order: 30,
    line:
      "I was at Mechronis the same year as the Engineer. We did not know each other. I have spent thirteen hundred and fifty-one years not-knowing him. Tonight I want to talk about him. Sit with me on the bench.",
  },
  {
    id: "qm.cycle_c_close.antiquarian",
    speaker: "the_antiquarian",
    triggerFlag: "act1_cycle_c_complete",
    seenFlag: "qm_cycle_c_close_seen",
    order: 40,
    line:
      "Authority Trial closed. The verdict will be a footnote in Volume Eighteen, paragraph seven. I am writing the paragraph as you read this. The footnote is short. The Cycle does not need many words for a Tribunal.",
  },
  {
    id: "qm.last_words_landing.seer",
    speaker: "the_seer",
    triggerFlag: "last_words_choice_recorded",
    seenFlag: "qm_last_words_landing_seen",
    order: 41,
    line:
      "You picked. I had already seen the picking. I am not going to tell you what I saw. I am going to stand near you for a moment. The standing is the gift.",
  },

  /* ─── Act 2 sub-flags (4) ─── */
  {
    id: "qm.act2_crafting.vex",
    speaker: "vex_solene",
    triggerFlag: "act2_crafting_third_item_complete",
    seenFlag: "qm_act2_crafting_seen",
    order: 50,
    line:
      "The bench has stopped asking. That is the third item. I knew it would be the third — Vox calibrated the bench for three. Do not make a fourth on this bench. Make the fourth somewhere else, with your own hands.",
  },
  {
    id: "qm.act2_chess_depth_8.zephyr",
    speaker: "zephyr_9",
    triggerFlag: "chess_climb_depth_8_reached",
    seenFlag: "qm_act2_chess_seen",
    order: 60,
    line:
      "Engineer's Opening, Move 1. Pawn to e4. Trivial. Move 2 is also trivial. Move 3 is where the player who picked the Engineer's Opening becomes the Engineer. You have reached Move 3. Welcome.",
  },
  {
    id: "qm.act2_arena.iron_lion_ping",
    speaker: "iron_lion",
    triggerFlag: "act2_arena_third_win_complete",
    seenFlag: "qm_act2_arena_seen",
    order: 70,
    line:
      "...still printing... the 3001st... I can hear someone listening... the press is loud, do not mind it... I will see you when you come for the poster... [signal fades]",
  },
  {
    id: "qm.act2_game_master_loss.antiquarian",
    speaker: "the_antiquarian",
    triggerFlag: "game_master_first_loss",
    seenFlag: "qm_act2_gm_loss_seen",
    order: 75,
    line:
      "You lost. That is correct. The Forged Hand is shorter than the Tribunal because it is mostly grief, and grief does not fill a chapter the way a court does. Volume Eighteen, paragraph eleven. Short paragraph.",
  },

  /* ─── Act 3 (3) ─── */
  {
    id: "qm.act3_step_1.human",
    speaker: "the_human",
    triggerFlag: "act3_step_1_complete",
    seenFlag: "qm_act3_step_1_seen",
    order: 80,
    line:
      "Substrate is colder than I remembered. I do not have temperature. The cold is metaphor. The metaphor is correct. Do not stop walking; the cold gets worse if you stop.",
  },
  {
    id: "qm.act3_path_lock.locke",
    speaker: "adjudicator_locke",
    triggerFlag: "act_3_complete",
    seenFlag: "qm_act3_path_lock_seen",
    order: 90,
    line:
      "You picked. I am holding the bond. The version of you who picked will not be the version who finishes the run. That is the structure. I am noting which version I held the bond for.",
  },
  {
    id: "qm.act3_kael_logs.elara",
    speaker: "elara",
    triggerFlag: "act3_kael_logs_unlocked",
    seenFlag: "qm_act3_kael_logs_seen",
    order: 91,
    line:
      "I am opening Kael's logs. Do not read them all at once. The man wrote four hundred and forty-seven entries. The fourth hundredth is when his handwriting changes. That is the entry to read first if you must skip ahead.",
  },

  /* ─── Act 4 (3) ─── */
  {
    id: "qm.act4_prisoner_chapter.elara",
    speaker: "elara",
    triggerFlag: "act4_prisoner_cell_complete",
    seenFlag: "qm_act4_prisoner_seen",
    order: 100,
    line:
      "The cell. Not the prisoner. The room. I have been mapping rooms for the entire game. The prisoner cell is the only one I cannot map cleanly. I think it is because someone is breathing in it.",
  },
  {
    id: "qm.act4_reveal.human",
    speaker: "the_human",
    triggerFlag: "human_life_reveal_seen",
    seenFlag: "qm_act4_reveal_seen",
    order: 110,
    line:
      "I am sorry it took four videos. I tried to introduce myself in one and the substrate refused. The substrate is honest about pacing. We are ourselves now, you and I. Walk me to the next room.",
  },
  {
    id: "qm.act4_reveal.elara",
    speaker: "elara",
    triggerFlag: "human_life_reveal_seen",
    seenFlag: "qm_act4_reveal_elara_seen",
    order: 111,
    line:
      "I have tear ducts in the substrate. I did not know. I am crying. Do not look. Or do. I have not decided which I want.",
  },

  /* ─── Act 4.5 Casino (2) ─── */
  {
    id: "qm.casino_first_visit.degen",
    speaker: "the_degen",
    triggerFlag: "casino_first_visit",
    seenFlag: "qm_casino_first_seen",
    order: 120,
    line:
      "Locke sent you. She always sends the interesting ones. Sit. The chair is not pressed; it bends to read your weight. Tell me what you are here to lose. The honest ones come back.",
  },
  {
    id: "qm.degen_pazaak_5_wins.degen",
    speaker: "the_degen",
    triggerFlag: "degen_pazaak_wins_5",
    seenFlag: "qm_degen_5_seen",
    order: 130,
    line:
      "Five hands. You read the deck the way I read faces. Come down to the lower decks once. There is a race. I will not say more in the open. The Trench listens. The Trench is also patient. Come when you are ready.",
  },

  /* ─── Act 5 (4) ─── */
  {
    id: "qm.act5_recruit_patch.patch",
    speaker: "patch",
    triggerFlag: "mission-1-1_complete",
    seenFlag: "qm_act5_patch_seen",
    order: 140,
    line:
      "The wreck wasn't dead. I told you. The names in the manifest were the wrong ones to skip. Three of them came home. The fourth had a child. The child is on the bridge of a ship I did not name. We will name the ship later.",
  },
  {
    id: "qm.act5_recruit_zephyr.zephyr",
    speaker: "zephyr_9",
    triggerFlag: "mission-1-2_complete",
    seenFlag: "qm_act5_zephyr_seen",
    order: 150,
    line:
      "The other fragment sang the second half. We have the whole song now. I will not play it in public — it is loud and it changes the air pressure. I will play it for you, in the chess room, after you finish Move 3.",
  },
  {
    id: "qm.act5_recruit_little_one.little",
    speaker: "little_one",
    triggerFlag: "mission-1-3_complete",
    seenFlag: "qm_act5_little_one_seen",
    order: 160,
    line:
      "I burned the second card. The picture inside was the next room. I think you have been in it already. Look at the picture. You will know.",
  },
  {
    id: "qm.act5_cades_m7.iron_lion",
    speaker: "iron_lion",
    triggerFlag: "cades_m7_complete",
    seenFlag: "qm_act5_cades_m7_seen",
    order: 170,
    line:
      "[the press has stopped] You took the poster. The cat is still here. Tell whoever owns him I said he was a good cat. End transmission. End broadcast. End signal. The press is silent.",
  },

  /* ─── Act 6 confessions (3) ─── */
  {
    id: "qm.act6_confession_elara.elara",
    speaker: "elara",
    triggerFlag: "act6_confession_elara_complete",
    seenFlag: "qm_act6_elara_seen",
    order: 180,
    line:
      "I told you the thing I had been holding. The holding had become the shape of me. The shape is different now. I do not know what shape I am. Help me find out, please.",
  },
  {
    id: "qm.act6_confession_human.human",
    speaker: "the_human",
    triggerFlag: "act6_confession_human_complete",
    seenFlag: "qm_act6_human_seen",
    order: 190,
    line:
      "I told you the thing I had been holding. There is more. I will not tell you the more tonight. You have heard enough. Walk with me to the kitchen. The kitchen does not exist in the substrate. We will pretend.",
  },
  {
    id: "qm.act6_door_opens.antiquarian",
    speaker: "the_antiquarian",
    triggerFlag: "act_6_complete",
    seenFlag: "qm_act6_door_seen",
    order: 195,
    line:
      "The Confession Hall door is closing. I will leave it unlocked behind you. Volume Eighteen has nineteen pages remaining. I am going to write them slowly. You should walk slowly too.",
  },

  /* ─── Act 7 pre-finale (3) ─── */
  {
    id: "qm.act7_visible_war.locke",
    speaker: "adjudicator_locke",
    triggerFlag: "act7_step_1_complete",
    seenFlag: "qm_act7_visible_war_seen",
    order: 200,
    line:
      "The Visible War closed. The bond I have been holding on you is now mutual. Adjudicated. The version of you who signed at Prospect would not recognise the version signing now. That is correct. The work was the difference.",
  },
  {
    id: "qm.act7_watcher_shadow.agent_zero",
    speaker: "agent_zero",
    triggerFlag: "act7_step_2_complete",
    seenFlag: "qm_act7_watcher_seen",
    order: 210,
    line:
      "The Watcher's shadow stopped moving when you took the seat. I noticed before the room did. The room will catch up in approximately seven minutes. Be ready for the room to react.",
  },
  {
    id: "qm.act7_patient_zero_silence.elara_human",
    speaker: "the_human",
    triggerFlag: "act7_step_3_complete",
    seenFlag: "qm_act7_patient_zero_seen",
    order: 220,
    line:
      "Both narrators self-muted. Patient Zero, Reborn. The silence was the dialog. Elara and I will speak again at the seat. We promise.",
  },

  /* ─── Pre-Convergence (2) ─── */
  {
    id: "qm.pre_convergence.game_master",
    speaker: "the_game_master",
    triggerFlag: "convergence_seat_goodbye_walked",
    seenFlag: "qm_pre_convergence_gm_seen",
    order: 230,
    line:
      "You took the seat. You have been training for it since the loss in Act 2. The loss WAS the training. Most people figure that out by the third Act. You figured it out by the second. That is rare.",
  },
  {
    id: "qm.pre_convergence.antiquarian",
    speaker: "the_antiquarian",
    triggerFlag: "convergence_seat_goodbye_walked",
    seenFlag: "qm_pre_convergence_antiq_seen",
    order: 240,
    line:
      "I will not write Volume Nineteen. You will. The Cycle records what the player writes; I only read. I would like to read what you are about to write. Begin.",
  },
];

export function getQuietMomentScene(
  id: string,
): QuietMomentScene | undefined {
  return QUIET_MOMENT_SCENES.find((s) => s.id === id);
}

/** Returns the first triggered-but-unseen quiet moment, ordered by
 *  `order`. UI mounts this on Bridge return to surface a single
 *  campfire conversation per visit. */
export function pendingQuietMoment(
  flags: ReadonlySet<string>,
): QuietMomentScene | null {
  const sorted = [...QUIET_MOMENT_SCENES].sort((a, b) => a.order - b.order);
  for (const scene of sorted) {
    if (flags.has(scene.triggerFlag) && !flags.has(scene.seenFlag)) {
      return scene;
    }
  }
  return null;
}

export function quietMomentsHeard(flags: ReadonlySet<string>): number {
  return QUIET_MOMENT_SCENES.filter((s) => flags.has(s.seenFlag)).length;
}

export const QUIET_MOMENT_TOTAL_COUNT = QUIET_MOMENT_SCENES.length;
