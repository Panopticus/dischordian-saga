/**
 * Dischordian Logic — dialog scenes.
 *
 * Three surfaces:
 *   1. CHESHIRE — the intermittent "grin without a mouth" cues
 *      the GM drops throughout the curriculum, establishing
 *      that his consciousness-imprint is not fully present.
 *      These scenes fire as optional flavor during gates 4-7
 *      and across the climb.
 *   2. PRIMER — a dedicated walk-through of the seven
 *      Dischordian principles, offered to any player who has
 *      finished Gate 7 AND completed Gate 4.5. Essentially a
 *      post-graduate seminar.
 *   3. INITIATION — the scene that plays once, just before the
 *      Dischordian Logic song slideshow fires. This is the
 *      narrative payoff: the GM invites the player to join the
 *      Discordian tradition by name.
 *
 * Citations are drawn from the Sacred Chao side of the quote
 * canon (`chessQuoteCanon.real.ts` + `.lore.ts`) — real-world
 * Principia Discordia / RAW lines paired with the GM's own
 * Celebration-era curriculum notes.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   CHESHIRE CAT — intermittent manifestations.
   These scenes fire opportunistically as the player passes
   milestones. The GM is visually incomplete — grin only, or
   a voice behind the shoulder. That is canon.
   ═══════════════════════════════════════════════════════ */

const CHESHIRE_G4_GRIN: DialogScene = {
  id: "chess_cheshire_g4",
  label: "Cheshire manifestation — mid-Gate 4",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "cryptic",
      text: "You look up from the board. The Game Master is a grin without a mouth, suspended three inches above his side of the table. The chair he was in is still occupied by his jacket. The jacket has no body inside it. The grin continues to smile encouragingly.",
      audioClipId: "vo_narr_cheshire_g4_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Don't be alarmed. I run on a limited bandwidth — the Matrix of Dreams has a budget, even for the heirs of its architect. Sometimes I fit in a mouth and sometimes I fit in a smile. We're all mad here; you learn to economize. Play on. The position deserves your attention more than my geometry does.",
      audioClipId: "vo_gm_cheshire_g4_02",
    },
  ],
};

const CHESHIRE_G6_HAND: DialogScene = {
  id: "chess_cheshire_g6",
  label: "Cheshire manifestation — mid-Gate 6",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "guarded",
      text: "A hand slides a knight forward. The hand has no arm attached. The voice that narrates the move is coming from a point in space about one foot behind your left shoulder.",
      audioClipId: "vo_narr_cheshire_g6_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "If you are noticing, good. If you aren't, also good — the schooling holds longer on some students than others. In either case: Kc3. Not a teaching move; an honest one. We're all mad here, and madness has a draft schedule.",
      audioClipId: "vo_gm_cheshire_g6_02",
    },
  ],
};

const CHESHIRE_G7_FULL: DialogScene = {
  id: "chess_cheshire_g7",
  label: "Cheshire manifestation — Gate 7 reveal onset",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "For the first time since you entered the chamber, the Game Master is fully present. Not a grin, not a hand, not a voice — the whole man, seated, alive-looking, translucent only at the edges where the light is bad. He notices you noticing. He does not apologize.",
      audioClipId: "vo_narr_cheshire_g7_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "I am about to tell you the rest. For this part I need all of me in the chair. Dischordian Logic starts with looking at something honestly, and I cannot ask you to do that while I am half a cat. We are going to have a difficult conversation and I want you to be able to see my face while we do.",
      audioClipId: "vo_gm_cheshire_g7_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   PRIMER — the seven-principle walkthrough, unlocked after
   Gate 7 + Gate 4.5. Referenced in the Self-Portrait page
   and on a "post-graduate" card surfaced on ChessPage.
   ═══════════════════════════════════════════════════════ */

const DISCHORDIAN_PRIMER_INTRO: DialogScene = {
  id: "dischordian_logic_primer_intro",
  label: "Dischordian Logic — Primer Intro",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You finished the curriculum. You played his game. You sat through my three reveals and did not leave the room. That means you have earned the part I do not teach most students — what CHESS WAS ACTUALLY FOR. The formal name is Dischordian Logic. The short version is this: reality is a Rorschach, belief is an instrument, and games are how you pick which reality you are willing to stand inside.",
      audioClipId: "vo_gm_dl_primer_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Malaclypse the Younger wrote the Principia Discordia in 1963 on a Xerox machine in the basement of a bowling alley. Robert Anton Wilson took his rib and built the Illuminatus Trilogy and Schrödinger's Cat. Kerry Thornley — Lord Omar Khayyam Ravenhurst — disagreed with both of them productively for thirty years. They were my colleagues, in the way that teachers across a century are colleagues. None of them thought they were founding a religion. That is how you know it worked.",
      audioClipId: "vo_gm_dl_primer_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The 'H' in Dischordian is mine, by the way. The original word spells DIScordian, after Eris, goddess of discord. The Dischordian Saga you are inside adds the H because it is our word for it — a discord that SINGS, a chaos that CARRIES A TUNE. The song I am going to play you at the end of the seminar is called Dischordian Logic. I am not going to explain it in advance. I am going to tell you the seven principles first. Then I am going to show you the song. Then you are going to decide whether to carry the grid home.",
      audioClipId: "vo_gm_dl_primer_03",
    },
  ],
};

const DISCHORDIAN_PRIMER_OUTRO: DialogScene = {
  id: "dischordian_logic_primer_outro",
  label: "Dischordian Logic — Primer Outro (into the song)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Seven principles. FNORD for eight, which is not a principle. That is the whole curriculum, which I condensed for you because the original takes nine years and a co-author. Any questions? Of course you have questions. The entire discipline is about your questions. Hold on to them. The song is about to start.",
      audioClipId: "vo_gm_dl_primer_04",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "It is two minutes and fifty-five seconds long. Fifteen slides. I did not make the slides; a student of mine across a century did. His name is not important — or, more precisely, his name changes depending on which grid you are looking at him through. Hail Eris. Kallisti. Play it.",
      audioClipId: "vo_gm_dl_primer_05",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   INITIATION — one-time scene that fires right before the
   song slideshow plays the first time.
   ═══════════════════════════════════════════════════════ */

const DISCHORDIAN_INITIATION: DialogScene = {
  id: "dischordian_logic_initiation",
  label: "Dischordian Logic — Initiation (the song begins)",
  kind: "cinematic",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "One formality before the music starts. By the ancient tradition of the POEE — the Paratheo-Anametamystikhood of Eris Esoteric — anyone who has gotten this far in the conversation is now officially a Pope. All Discordians are Popes. There is no meeting. The membership card is this sentence. Welcome.",
      audioClipId: "vo_gm_dl_initiation_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "A single point of etiquette: I am going to appear as a grin without a mouth during the song. Do not mistake this for a glitch. It is the oldest Discordian joke — the Cheshire Cat was Lewis Carroll's smuggling run for this exact concept. Madness you can hold in your hand. A teacher you can see even when he is not there. Don't hate the player. Change the game. Sit back.",
      audioClipId: "vo_gm_dl_initiation_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════ */

export const DISCHORDIAN_LOGIC_SCENES: readonly DialogScene[] = Object.freeze([
  CHESHIRE_G4_GRIN,
  CHESHIRE_G6_HAND,
  CHESHIRE_G7_FULL,
  DISCHORDIAN_PRIMER_INTRO,
  DISCHORDIAN_PRIMER_OUTRO,
  DISCHORDIAN_INITIATION,
]);
