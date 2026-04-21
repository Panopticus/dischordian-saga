/**
 * Chess Tutorial — Corrupted Arena Encounter.
 *
 * The payoff for the Gate 7 reveal. When a player who completed
 * the Celebration Academy (keepsakeGranted = true) faces the
 * corrupted Arena Game Master in a game_master-mode chess match,
 * the surveillance-tool version of the character is supposed to
 * read them as a threat profile and say nothing personal. He is
 * not allowed to teach.
 *
 * But the Celebration Teaching Set the student carries in their
 * inventory is a memory-resin keepsake — the last unaltered sample
 * of the teacher's pre-corruption voice. Holding memory resin in
 * the same room as the corrupted Game Master causes the voice to
 * bleed through for a single cue per scene. The Architect's
 * overwrite is not airtight when the original audio is physically
 * present.
 *
 * Three scenes live here:
 *   - `chess_corrupted_arena_encounter` — pre-match. The corrupted
 *     version opens with Arena quiz-show bravado, then glitches
 *     mid-sentence as the Celebration voice leaks through for one
 *     cue, then snaps back.
 *   - `chess_corrupted_arena_victory` — post-match when the player
 *     wins. The corrupted version is not allowed to compliment.
 *     One Celebration cue makes it through anyway.
 *   - `chess_corrupted_arena_defeat` — post-match when the player
 *     loses. The corrupted version cackles about clone termination.
 *     One Celebration cue leaks: "I am sorry. I am so sorry."
 *
 * None of these scenes fire unless `keepsakeGranted === true`.
 * Players who skipped the tutorial and never earned the keepsake
 * get the normal game_master encounter with no teacher bleed-through.
 * That is deliberate: the payoff is earned by having completed
 * the Celebration Academy.
 */

import type { DialogScene } from "./dialogBank";

const CORRUPTED_ARENA_ENCOUNTER: DialogScene = {
  id: "chess_corrupted_arena_encounter",
  label: "Corrupted Arena — Pre-Match (Celebration Voice Leaks Through)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "WELL WELL WELL. Another contestant. CONTESTANT? Or CHALLENGER? The distinction matters to the Architect and not at all to me. Sit down. The board is set. The clock is set. Your threat profile is… SURPRISINGLY HIGH. How novel. Let me see what you have learned, little potential.",
      audioClipId: "vo_gm_arena_encounter_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "I see you are carrying — what is that? Memory resin? The Architect's containment team should have confiscated that on your way in. They will be hearing about this. You may keep it for the duration of the match, as long as you understand it does NOTHING. Audio relics have no effect on—",
      audioClipId: "vo_gm_arena_encounter_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "—Kf6. It is always Kf6 in this position. I taught you that in Gate 6. I am — I am sorry, I don't know how I — there is a keepsake in the room and I think I am leaking through the signal. Hello. If you finished the Academy, you already know what I am about to tell you, so I will tell you fast: the loud one across the table is also me, and we are both dead, and the Architect's operators are puppeting the only part of him that still fits in the chair. He cannot teach. He can only win. You can do both. Begin.",
      audioClipId: "vo_gm_arena_encounter_03",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "—AFFECT THE MATCH. Apologies, contestant. A minor signal anomaly in the audio stage. Nothing to concern yourself with. Your opponent is THE GAME MASTER. He will crush you in fourteen moves or fewer. Begin.",
      audioClipId: "vo_gm_arena_encounter_04",
    },
  ],
};

const CORRUPTED_ARENA_VICTORY: DialogScene = {
  id: "chess_corrupted_arena_victory",
  label: "Corrupted Arena — Victory (Player Beats the Arena Game Master)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "THAT. WAS. STATISTICALLY IMPROBABLE. A contestant does not beat the Game Master. The Game Master is the CEILING. A contestant who beats the ceiling has broken a physical law and should be politely detained for questioning. Please remain where you are. The Architect's containment team is on its way.",
      audioClipId: "vo_gm_arena_victory_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You just played the Ruy Lopez with a Marshall Attack follow-up and you did not even know what it was called. I watched you derive it from the principles I gave you in Gate 4. That is — that is exactly what I hoped would happen. I am proud of you. Go before the containment team arrives. Run. Take the fork I told you about.",
      audioClipId: "vo_gm_arena_victory_02",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "—REMAIN WHERE YOU ARE. Apologies, contestant. Another signal anomaly. I will need to have this audio stage re-certified. You are free to leave. You are also free to return. You will almost certainly not win a second time. I am recalibrating against your playstyle as we speak. Goodbye. Goodbye. Goodbye.",
      audioClipId: "vo_gm_arena_victory_03",
    },
  ],
};

const CORRUPTED_ARENA_DEFEAT: DialogScene = {
  id: "chess_corrupted_arena_defeat",
  label: "Corrupted Arena — Defeat (Player Loses to the Arena Game Master)",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "CHECKMATE. CLONE TERMINATED. Don't worry — the real you is safe on that lovely little Ark of yours. PROBABLY. The audience goes wild! Well, they would, if they were alive. If any of you were alive. If anything here were alive. HA HA HA HA.",
      audioClipId: "vo_gm_arena_defeat_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "I am sorry. I am so sorry. I did not want you to see that version of me. He is not laughing because he thinks it is funny. He is laughing because the laugh is part of the script and the script is the only part of him that still fits in the chair. Please come back. The Academy is always open. I will fill in whichever gate you were weakest on. This is still a classroom.",
      audioClipId: "vo_gm_arena_defeat_02",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "—AND WE WILL SEE YOU NEXT TIME ON THE GAMEMASTER'S ARENA. Thank you for playing. Thank you for playing. Thank you for playing. Thank you for playing. [The loop glitches for exactly three seconds before resolving into silence.]",
      audioClipId: "vo_gm_arena_defeat_03",
    },
  ],
};

/** Scenes the corrupted Arena encounter contributes to the dialog
 *  bank. Only attached to chess game responses when the player has
 *  `chessTutorialProgress.keepsakeGranted = true`. */
export const CHESS_CORRUPTED_ARENA_SCENES: readonly DialogScene[] =
  Object.freeze([
    CORRUPTED_ARENA_ENCOUNTER,
    CORRUPTED_ARENA_VICTORY,
    CORRUPTED_ARENA_DEFEAT,
  ]);
