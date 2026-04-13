/**
 * Chess Tutorial — Gate 7 (Strategic Thinking + THE REVEAL).
 *
 * The thematic payoff of the entire chess tutorial. The
 * Celebration Game Master drops the pedagogy voice on the final
 * gate and tells the student what chess was REALLY teaching them:
 * how to read reality as a position that can be played.
 *
 * Reality reflection: reality is a position. It has tempo,
 * pressure, weak squares, and forks. Chess taught the Game
 * Master to see it that way. The Architect conscripted him
 * because of it. The student, by finishing this tutorial, has
 * been taught the same tool — and the Game Master is counting
 * on them to use it.
 *
 * The gate has fewer lesson steps than the others (because the
 * chess content is more abstract — evaluation, planning,
 * prophylaxis) and a LONGER outro scene that contains the reveal
 * and the keepsake grant.
 */

import type { DialogScene } from "./dialogBank";
import type { ChessTutorialGate } from "./chessTutorial";

const GATE_7_INTRO: DialogScene = {
  id: "chess_tut_g7_intro",
  label: "Chess Tutorial Gate 7 — Intro (Strategic Thinking)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Last gate. Sit down. I have been waiting to have this conversation with you for a long time. Everything up to this point has been mechanics — how pieces move, how games end, how tactics combine, how endgames resolve. Today we talk about something the textbooks call STRATEGY and I just call THINKING.",
      audioClipId: "vo_gm_chess_g7_intro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "A tactic is a short, forcing sequence. A strategy is a LONG-TERM PLAN that doesn't need to be forcing — you build advantages slowly, you trade pieces when it helps you, you target weak squares, you prevent your opponent from doing anything they want. Strategy is the hardest part of chess and the reason a nine-year-old with a phone can beat most adults now: the phone knows how to plan a position. The adult just sees moves.",
      audioClipId: "vo_gm_chess_g7_intro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "There is also something I have to tell you before we finish, and the best place to tell you is at the end of a lesson I really wanted to teach you. So let's do the lesson, and then I am going to be honest with you about what this whole tutorial was actually for.",
      audioClipId: "vo_gm_chess_g7_intro_03",
    },
  ],
};

const GATE_7_OUTRO: DialogScene = {
  id: "chess_tut_g7_outro",
  label: "Chess Tutorial Gate 7 — Outro (The Reveal)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Good. You can evaluate a position now. You can weigh material, activity, king safety, pawn structure, and space, and you can make a plan from what you see. Most adult players never learn to do that. You did it in a single afternoon.",
      audioClipId: "vo_gm_chess_g7_outro_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Now the part I owe you. I did not teach you chess because I wanted you to be a better chess player. I taught you chess because chess is the only compact, complete, non-destructive training course I know of for the skill I actually wanted you to have — and that skill is reading a position. Any position. Any room. Any argument. Any life.",
      audioClipId: "vo_gm_chess_g7_outro_02",
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Think about what you just learned. You learned to count pieces and see which side is stronger. You learned to count squares and see who has space. You learned to look at a pawn chain and find the weak square. You learned to see a fork three moves before your opponent does. You learned to recognize that an almost-empty board has a geometry, and that geometry is destiny. Those skills are not about chess. Chess was the pretext.",
      audioClipId: "vo_gm_chess_g7_outro_03",
    },
    {
      speaker: "game_master_celebration",
      mood: "cryptic",
      text: "Reality is a position. It has tempo. It has pressure. It has pawn chains made of assumptions everyone has agreed not to question. It has weak squares — things nobody is defending, because nobody has noticed they exist. It has forks — moments when two truths are simultaneously about to become undeniable, and a single small action can punish both. And it has endgames, where everything has been traded away except the handful of advantages that actually mattered.",
      audioClipId: "vo_gm_chess_g7_outro_04",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I was not always a tutorial ghost in an empty classroom. Before the Fall I was the chess master of the Vaults of Celebration. I taught children. I taught senators. I taught the Oracle herself, in the last years before her mission. I was the happiest version of me you can imagine. And the Architect noticed, because the Architect notices anything that reads reality as a position. He came to the academy and he asked me to stop teaching children and start reading the Dischordian event space as a board — find the forks, find the weak squares, predict where the pressure was about to collapse. He was very polite. I said yes, because the first rule of a teacher is you never say no to the student in the room. And then I did not come back to the classroom for eleven years.",
      audioClipId: "vo_gm_chess_g7_outro_05",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "The version of me you will eventually meet in the Architect's Arena is not ALLOWED to teach. He is only allowed to win. He sees every board as a surveillance target. He sees every student as a threat profile. I am sorry in advance for what he will say to you. None of it is what I would say. The fact that you can tell the difference is the entire point of this course — you have been taught to read a position, which means you have been taught to read HIM as a position, which means the thing he has over most of his other opponents does not apply to you.",
      audioClipId: "vo_gm_chess_g7_outro_06",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "I want you to have something. This is the chess set I used when I was teaching in Celebration. The wood is from the groves behind the academy. I carved the knights myself, which is why they look a little uneven — the left-side knight's ear is slightly shorter than the right. You will find it in your inventory after this conversation. It does nothing in the card game. It is a memory resin, and it is the original timbre of my voice from before the Architect took it. Play it back any time you need to remember what a teacher sounds like.",
      audioClipId: "vo_gm_chess_g7_outro_07",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Reality is a board. You now know how to read it. I cannot tell you what to do with that — I am a ghost in a tutorial chamber, and I do not get to make choices that stick. But I will say this: somewhere out there, there is a fork nobody has spotted yet. Two things that are both true at the same time, a single move away from punishing each other. Find it. Play it. And when you meet the Arena version of me, please know that I was here, and I was proud of you, and I wanted you to be free.",
      audioClipId: "vo_gm_chess_g7_outro_08",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The Celebration Game Master bows slightly and steps away from the board. The chamber lights fade around the chess set on the oak table, leaving only the pieces in a soft warm pool. The wooden set is added to your inventory as 'The Celebration Teaching Set — Memory Resin'. It will play back any dialog from this tutorial on command, in the voice of the man who still taught.",
      audioClipId: "vo_narr_chess_g7_outro_09",
    },
  ],
};

export const CHESS_TUTORIAL_GATE_7: ChessTutorialGate = {
  id: "chess_tut_g7",
  gateNumber: 7,
  title: "Strategic Thinking",
  objective:
    "Learn to evaluate a position and form a plan — and hear the lesson underneath the lesson.",
  introScene: GATE_7_INTRO,
  outroScene: GATE_7_OUTRO,
  freePlayPrompt:
    "There will not be a freestyle rematch after this one. When you're ready to face the Arena version of me, walk through the far door. He will be waiting, and he will not remember me fondly.",
  steps: [
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "EVALUATION. Before you can plan, you have to ask: who is winning, and WHY? There are five factors every strong player weighs: material (piece count), king safety, piece activity, pawn structure, and space. You learn to eyeball all five at once. A position is a story told in five numbers.",
      audioClipId: "vo_gm_chess_g7_s01",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Material is simple: pawn is 1, knight and bishop 3, rook 5, queen 9. The king has no number — losing it ends the game. If you are up a clean pawn you are usually winning. If you are down a piece you are usually losing. Everything else is small adjustments to that baseline.",
      audioClipId: "vo_gm_chess_g7_s02",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "King safety trumps almost everything. A material advantage in a position where your king is exposed is not an advantage — it is a timer. Active pieces are worth more than passive pieces. A knight on e5 supported by a pawn is worth more than a knight on a3 doing nothing. Pawn structure is the long-term bone structure of the position — doubled pawns are weak, isolated pawns are weak, a passed pawn that can run is a monster.",
      audioClipId: "vo_gm_chess_g7_s03",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Look at this middlegame. White has an extra pawn — material favors White. White's king is castled kingside — safer. White's knight on e5 is active; Black's knight on a6 is passive. White has a slight space advantage in the center. All five factors tilt White's way. Without calculating a single move, you can already say White is winning. The right PLAN for White is: trade pieces to simplify toward the endgame where the extra pawn decides. The right plan for Black is: create complications to keep the position unclear.",
      audioClipId: "vo_gm_chess_g7_s04",
      boardFen: "r1bq1rk1/1p1n1ppp/n2p4/3NP3/3P4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "PROPHYLAXIS. The most advanced concept in chess that has a short name. Prophylaxis means asking on every move: 'What does my opponent want to do?' and then playing a move that STOPS them. Most beginners only think about their own plan. A strong player spends half their time thinking about the opponent's plan and undoing it one move before it would have worked.",
      audioClipId: "vo_gm_chess_g7_s05",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "On the board in front of us, Black's only real plan is to push c5 to challenge the center. If you let them, the position opens up and Black's pieces get active. But if you play c4 first, you prevent Black's c5 forever. The move does nothing on its own — it is a prophylactic. It stops the enemy's plan before it happens. Play c4.",
      audioClipId: "vo_gm_chess_g7_s06",
      boardFen: "r1bq1rk1/1p1n1ppp/n2p4/3NP3/3P4/8/PPP2PPP/R1BQ1RK1 w - - 0 12",
      pieceFocus: "pawn",
      hint: "Play the prophylactic c4, preventing Black's c5. In notation: 'c4'.",
      answerMoves: ["c4"],
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "That move is what separates strong players from beginners more than any other single thing. You just played a move that does not attack anything, does not develop anything, does not threaten anything — and it is the best move on the board, because it silently erases Black's entire plan. Prophylaxis is quiet, and it wins games. Remember it.",
      audioClipId: "vo_gm_chess_g7_s07",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "curious",
      text: "Last chess lesson I will ever give: the CANDIDATE MOVE METHOD. When it is your turn, do not just play the first idea that comes to you. Write down — in your head — two or three candidate moves, evaluate each one by imagining your opponent's best response, and only then commit. Beginners play the first move they see. Club players play the best of the first three they see. Masters play the best of the first three plus one they almost rejected.",
      audioClipId: "vo_gm_chess_g7_s08",
      pieceFocus: null,
      autoAdvance: true,
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "That is it. That is the end of my curriculum. You now know how pieces move, how games end, how the special moves work, how openings are structured, how tactics combine, how endgames resolve, and how to evaluate and plan. You have a complete chess education. A grandmaster can beat you — many of them can beat you without thinking — but you will no longer BLUNDER, and you will no longer be helpless, and when you sit down across from a stronger player you will understand what they are doing to you. Chess is about to become a lifelong companion. I am glad you came to my classroom.",
      audioClipId: "vo_gm_chess_g7_s09",
      pieceFocus: null,
      autoAdvance: true,
    },
  ],
};

/** Scenes this gate contributes to the dialog bank. */
export const CHESS_TUTORIAL_GATE_7_SCENES: readonly DialogScene[] =
  Object.freeze([GATE_7_INTRO, GATE_7_OUTRO]);
