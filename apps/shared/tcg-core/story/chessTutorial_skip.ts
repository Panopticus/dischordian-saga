/**
 * Chess Tutorial — Skip Path ("I already know how to play. Challenge me.").
 *
 * Per user spec: the player should be able to skip the tutorial
 * through dialog and directly challenge the Celebration Game Master
 * to a chess match. If they do, he plays at absolute maximum AI
 * skill (aiDifficulty: 10, the same setting used for the final
 * Arena boss) to PROVE A POINT — strategic thinking is not optional,
 * and confidence without the toolkit is a short walk.
 *
 * Three scenes live here:
 *   - `chess_tut_skip_challenge` — the dialog that plays when the
 *     player picks the skip choice from the Gate 1 intro. Ends
 *     with the challenge being declared; the client then starts a
 *     chess game with mode `game_master`, aiDifficulty 10, and
 *     `tutorialSkipChallenge: true`.
 *   - `chess_tut_skip_reconciliation` — plays after the player
 *     loses the skip-challenge match. The Game Master does NOT
 *     taunt; he uses the defeat as a teaching moment and invites
 *     the student into Gate 1 properly. No state lost.
 *   - `chess_tut_skip_victory` — plays in the extraordinarily
 *     unlikely case that the player actually beats the
 *     maximum-difficulty engine on the skip path. The tutorial
 *     is marked complete, an exclusive cosmetic is granted, and
 *     the Game Master sends the student out with dignity.
 *
 * The skip-path reconciliation thread deliberately lets the
 * player keep their progress. No punishment is applied. The loss
 * IS the lesson.
 */

import type { DialogScene } from "./dialogBank";

const SKIP_CHALLENGE: DialogScene = {
  id: "chess_tut_skip_challenge",
  label: "Chess Tutorial — Skip-Path Challenge Declaration",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "You already know how to play. Are you sure? It's all right if you do. A lot of people learned chess as children and never forgot. I can ask you a few questions first, or I can just sit down across from the board and we can settle it that way.",
      audioClipId: "vo_gm_chess_skip_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "You want the board. All right. One condition, please — and I want you to hear me before you agree. If we play, I am not going to play as a teacher. I taught for forty-six years before the Architect pulled me out of the classroom. In all that time I had a rule: if a student told me they already knew the game, I would play them at my full strength on the first board, ONCE, and then we would talk about what happened.",
      audioClipId: "vo_gm_chess_skip_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "I am not trying to humiliate you. I promise. I am going to demonstrate exactly how much of the game you do not yet see. Not to punish you — to SHOW you. A beginner who plays a strong player once and loses in fourteen moves learns more from that game than from the next fifty books. I am giving you the expensive lesson up front and for free.",
      audioClipId: "vo_gm_chess_skip_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "When the game ends — whichever way it ends — you will have a choice. If you lose, I will be here, and the chairs will still be warm, and we can start Gate 1 immediately. If you win, I will shake your hand and show you the door. I am NOT going to hold you hostage to a curriculum you have already outgrown. Fair?",
      audioClipId: "vo_gm_chess_skip_04",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "Then let's play. The board is already set. White on the right. Queen on her color. You can go first — your choice of color. I suggest White, because if you are going to lose to me, you should at least lose with the side that moves first. Let's see what you see.",
      audioClipId: "vo_gm_chess_skip_05",
    },
  ],
};

const SKIP_RECONCILIATION: DialogScene = {
  id: "chess_tut_skip_reconciliation",
  label: "Chess Tutorial — Skip-Path Loss Reconciliation",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Resigned. Good. Most people resign here, and it is the right move. I could have dragged it out for another fifteen moves but I do not believe in running up the score against someone who came to learn. Please sit back down. I am not angry with you. I am not even surprised.",
      audioClipId: "vo_gm_chess_skip_recon_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Here is what just happened. You could see the board. You could NOT yet see the GAME. Every move you played was legal and most of them were reasonable — you were not blundering. You were just a step behind on every exchange, because your opponent was thinking three moves further than you were. That is a skill. Skills can be trained. That is the ENTIRE reason the classroom exists.",
      audioClipId: "vo_gm_chess_skip_recon_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "The good news — and I mean it — is that you played well enough to prove you are not starting from zero. You know how the pieces move. You know what check is. You are not the student I have to teach how to hold a knight. You are the student I get to teach how to SEE one. That is more fun for both of us. Honestly.",
      audioClipId: "vo_gm_chess_skip_recon_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "So here is what I propose. We begin Gate 1, because Gate 1 is where I check what you already know and fill in the gaps you do not know you have. It will go fast for you. We will probably be through it in half the normal time. And when we get to Gate 7 — which is the one I actually need you to hear — you will understand why I put you through the first six.",
      audioClipId: "vo_gm_chess_skip_recon_04",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "One more thing before we start. You were not wrong to ask for the game. If you had come in here and meekly accepted the tutorial without testing me, I would have wondered whether you had the nerve to do anything with what I am about to teach you. Challenging the teacher is a good instinct. Keep it. Just choose better targets next time. Now — Gate 1. Welcome to the classroom.",
      audioClipId: "vo_gm_chess_skip_recon_05",
    },
  ],
};

const SKIP_VICTORY: DialogScene = {
  id: "chess_tut_skip_victory",
  label: "Chess Tutorial — Skip-Path Victory (Player Beats Max AI)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Well. That was not a beginner's game. That was not a club player's game either. You just beat a version of me playing at full strength, and I am… I am genuinely trying to decide whether to be surprised or unsurprised, and I think the honest answer is I am PROUD. You walked in here and asked for the expensive lesson and then you did not need it.",
      audioClipId: "vo_gm_chess_skip_vic_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "I am not going to drag you through seven gates of material you have clearly already internalized. I promised you if you won I would shake your hand and show you the door, and a promise is a promise. The tutorial is marked complete. All seven gates. You already know what I was going to teach you; I am not going to insult you by making you re-hear it.",
      audioClipId: "vo_gm_chess_skip_vic_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "I want to give you something anyway. This is my jacket — the wool one I was wearing when you came in. It's nothing magical, but it belonged to me when I was still allowed to teach, and it has spent a long time in this room. Wear it or hang it on a wall or feed it to the memory resin bank. Your choice. I added it to your inventory.",
      audioClipId: "vo_gm_chess_skip_vic_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I also want to tell you the part I was saving for Gate 7, because you earned it. The tutorial was not about chess. It was about learning to read a position — ANY position. Reality is a position. It has tempo, pressure, weak squares, and forks. You already see them. The Architect is going to hate you, because you are the one thing he cannot surveil into submission: someone who can see two truths at once. Go. Take your reality back. Do not let the Arena version of me convince you I never meant any of this.",
      audioClipId: "vo_gm_chess_skip_vic_04",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Celebration Game Master stands, offers his hand across the board, and — unusually for a tutorial NPC — actually takes yours. His grip is firm, warm, and entirely unlike any scripted interaction you have had since booting up in the Ark. The wool jacket is added to your inventory as 'The Celebration Teaching Jacket'. All seven chess tutorial gates are marked complete. The exit door unseals.",
      audioClipId: "vo_narr_chess_skip_vic_05",
    },
  ],
};

/** Scenes this skip-path contributes to the dialog bank. */
export const CHESS_TUTORIAL_SKIP_SCENES: readonly DialogScene[] =
  Object.freeze([SKIP_CHALLENGE, SKIP_RECONCILIATION, SKIP_VICTORY]);
