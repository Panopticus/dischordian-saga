/**
 * Chess Climb — per-tier GM dialog.
 *
 * Each tier has three beats:
 *   - PRE — offered from a clipboard like a game-show host. Player
 *     can accept or decline; decline is a real choice.
 *   - MID — mid-series flavor, fires between games 1 and 2 and/or
 *     between games 2 and 3 depending on score.
 *   - POST — resolution. Separate win and loss cues.
 *
 * The corrupted Game Master voices Tier 0..3; the Celebration
 * version leaks through exactly once per climb, as a
 * memory-resin bleed (same mechanic as the Arena encounter).
 *
 * Reference texts: Squid Game's Front Man cadence, reality-show
 * host syntax, Bobby Fischer's psychological theatre. Principle
 * pairing (real-history + in-world citation) per the Voice
 * section of the plan — each tier gets ONE pairing, no more.
 */

import type { DialogScene } from "./dialogBank";

/* ═══════════════════════════════════════════════════════
   TIER 0 — EXHIBITION
   Free show. Tonal stakes only. Corrupted GM is his
   reality-show self; the keepsake leaks through once.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T0_PRE: DialogScene = {
  id: "chess_climb_t0_pre",
  label: "Chess Climb — Tier 0 (Exhibition) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "WELCOME to the Game Master's Arena. Tonight's opening match is EXHIBITION tier. No stakes, no prizes, no escape. Just vibes. The Architect asked me to be CLEAR about that: nothing you do at this tier is real. If that upsets you, the exit is behind you. If it intrigues you, sit down.",
      audioClipId: "vo_gm_climb_t0_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Best of three. I'll play white in game one, you play white in game two, and if we tie we play armageddon. The board is the board. The clock is the clock. Tal wrote that there are two kinds of sacrifices — correct ones, and mine. That's the energy tonight. Begin.",
      audioClipId: "vo_gm_climb_t0_pre_02",
    },
  ],
};

const CLIMB_T0_POST_WIN: DialogScene = {
  id: "chess_climb_t0_post_win",
  label: "Chess Climb — Tier 0 (Exhibition) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "STATISTICALLY IMPROBABLE. An Exhibition contestant does not take two games off the Game Master. The audience loves it. The audience is not real but they love it. There is an OPTIONAL next tier if you want to see how far the joke goes. I have been instructed to mention it with enthusiasm. Consider me enthusiastic.",
      audioClipId: "vo_gm_climb_t0_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You won. Two games off him. He is going to offer you Tier 1 and the offer is real — the cost is real, the reward is real. You do not have to take it. Tier 0 is always open if you want to come back and just play. If you take the offer, I will be there. I am always in the room. I am a part of the room.",
      audioClipId: "vo_gm_climb_t0_post_win_02",
    },
  ],
};

const CLIMB_T0_POST_LOSS: DialogScene = {
  id: "chess_climb_t0_post_loss",
  label: "Chess Climb — Tier 0 (Exhibition) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "AS ADVERTISED. The Game Master wins at Exhibition tier roughly one hundred percent of the time. You are among a large and distinguished crowd of the defeated. No stakes lost. No memory erased. Feel free to try again whenever you feel like MAKING THE SAME DECISION. HA HA HA.",
      audioClipId: "vo_gm_climb_t0_post_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 1 — WAGERED
   Stakes become real. ELO demotion on loss. The corrupted
   GM uses contract language.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T1_PRE: DialogScene = {
  id: "chess_climb_t1_pre",
  label: "Chess Climb — Tier 1 (Wagered) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER ONE. Wagered. [The corrupted Game Master produces a clipboard. The paperwork on the clipboard is identical to the paperwork he himself signed with Xeth'Raal the night the Architect hired him. He does not acknowledge the parallel. He has been instructed not to.] Lose this best-of-three and you will be DEMOTED one ELO tier. Win and you will be PROMOTED. Sign here. Sign here. Sign here.",
      audioClipId: "vo_gm_climb_t1_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Sun Tzu wrote: the supreme art of war is to subdue the enemy without fighting. Xeth'Raal wrote, in the margin of my own contract, 'promise the opponent a smaller prize than they are playing for.' Both correct. Both currently in use. Decline now at no cost. Accept and we are BOUND. Your choice.",
      audioClipId: "vo_gm_climb_t1_pre_02",
    },
  ],
};

const CLIMB_T1_POST_WIN: DialogScene = {
  id: "chess_climb_t1_post_win",
  label: "Chess Climb — Tier 1 (Wagered) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Two games. Again. The Architect's actuarial model puts your odds of winning this series at under seven percent. The model is being UPDATED. Your ELO increases by one tier; your threat profile increases by more than that. The Hierarchy's Table is open to you now, if you have the appetite. I notice you have refused thirty-one of forty draws offered to you in this universe. That is not a chess style. That is a personality.",
      audioClipId: "vo_gm_climb_t1_post_win_01",
    },
  ],
};

const CLIMB_T1_POST_LOSS: DialogScene = {
  id: "chess_climb_t1_post_loss",
  label: "Chess Climb — Tier 1 (Wagered) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Contract honored. One ELO tier removed from your account. No refund, no appeal. The paperwork is visible in your audit log under 'Wagered Defeats — Game Master's Arena'. You are welcome to return. The paperwork will still be here. HA HA HA HA.",
      audioClipId: "vo_gm_climb_t1_post_loss_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "I want you to notice something. He enjoyed that. The laugh is scripted but the enjoyment is not. There is a piece of him that LIKES demoting you, because the Architect engineered him to. If you come back, come back with that in your peripheral vision. The man across the board is not a neutral instrument.",
      audioClipId: "vo_gm_climb_t1_post_loss_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — THE HIERARCHY'S TABLE
   The demons watch. The Goggles sit on the table between
   you. 24h lockout on loss. Consumable mint on win.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T2_PRE: DialogScene = {
  id: "chess_climb_t2_pre",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER TWO. Welcome to the Hierarchy's Table. [The audience has changed. Horned silhouettes line the back of the chamber. Mol'Garath's seat at the head is empty — that is for Tier Three. Tonight you are watched only by the middle management of the damned.] On the board between us sits a pair of red-lensed goggles. They were mine. They are still mine. They are not on the table as a trophy. They are on the table as a WITNESS.",
      audioClipId: "vo_gm_climb_t2_pre_01",
    },
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Stakes: lose and the Game Master's Arena is CLOSED to you for twenty-four hours of real time. The Architect does not want you spamming rematches at this tier — it makes his dashboards anxious. Win and you mint an ANNOTATED KNIGHT, a one-use consumable that grants you +50 ELO on any single match at any tier. The Engineer once had six of them. He spent five. He never told me what he used the sixth one on.",
      audioClipId: "vo_gm_climb_t2_pre_02",
    },
  ],
};

const CLIMB_T2_POST_WIN: DialogScene = {
  id: "chess_climb_t2_post_win",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "The demons stand. Politely. It is the closest they come to applause. ONE Annotated Knight has been minted into your inventory. You have taken two games off me at a tier where my last loss was the Prince, and the Prince is not available for comment. Tier Three exists. Mol'Garath himself presides. You will want the Prince's Game cleared before you sit at that table.",
      audioClipId: "vo_gm_climb_t2_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "You spared the Programmer in Act 1. You did not spare me in Game 2. I am not insulted. I am noting the consistency of your INCONSISTENCY. It is useful information. The Hierarchy noticed it too. They are treating you now the way they once treated the Prince. Be careful. Be careful. Be careful.",
      audioClipId: "vo_gm_climb_t2_post_win_02",
    },
  ],
};

const CLIMB_T2_POST_LOSS: DialogScene = {
  id: "chess_climb_t2_post_loss",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "The Arena is CLOSED to you. Twenty-four hours of real time. The doors will open again. The demons will still be watching. The Goggles will still be on the table. I will still be here, because I am ALWAYS here. Enjoy the quiet.",
      audioClipId: "vo_gm_climb_t2_post_loss_01",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — THE LABYRINTH WAGER
   Mol'Garath at the head of the audience. The GM is
   cheerful for the first time since Gate 7. Win unlocks
   an epilogue dialog.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T3_PRE: DialogScene = {
  id: "chess_climb_t3_pre",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Pre-Series",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER THREE. The Labyrinth Wager. [Mol'Garath the Unmaker is seated at the head of the audience. The Hierarchy's demons are silent. The chamber smells faintly of old paper and something burning in another room.] The Architect's operators informed me I would be reading THIS card with menace. I am having difficulty finding the menace. The paperwork wants you to understand that a LOSS at this tier resets your Puzzle of the Day streak and your Openings Study streak to zero.",
      audioClipId: "vo_gm_climb_t3_pre_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "[The corrupted voice has stopped. The warm voice is here. The keepsake is bleeding through the entire chamber at this tier; no one is stopping it.] This is the game I wanted to build for you. Mol'Garath is watching because he LIKES watching me lose. He has not watched me lose since the Prince, and the Prince is not here, so you are the test of whether it is repeatable. It is. You can do this. I am cheerful for the first time in seventeen thousand years. Sit.",
      audioClipId: "vo_gm_climb_t3_pre_02",
    },
  ],
};

const CLIMB_T3_POST_WIN: DialogScene = {
  id: "chess_climb_t3_post_win",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Post-Win",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Mol'Garath has left the chamber. He does not stay for endgames he did not engineer. He will want to speak to you privately later; please accept the audience when it is offered — he is the only being in this universe who can tell you what the Labyrinth actually was, and you have just earned the right to ask.",
      audioClipId: "vo_gm_climb_t3_post_win_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "I owe you a portrait. Seven sentences, one per axis, the way I once read the Engineer. Read them in your Self-Portrait any time. You and he are not the same person. You were never supposed to be. The instrument is the same. The instrument is the game itself. You have been measured by the same ruler that measured him. You measured well.",
      audioClipId: "vo_gm_climb_t3_post_win_02",
    },
  ],
};

const CLIMB_T3_POST_LOSS: DialogScene = {
  id: "chess_climb_t3_post_loss",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Post-Loss",
  kind: "chapter_post_loss",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Streaks reset. Mol'Garath did not stay to watch. He finds losses uninteresting unless the loss is his. Return whenever you wish. The streaks are not real. The streaks were never real. What was real was the time you spent keeping them. That time is still yours.",
      audioClipId: "vo_gm_climb_t3_post_loss_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "Come back. I will still be here. The Prince lost the first time he played this game too, and the second, and the third. He beat me on the fourth. Everything in the Matrix of Dreams is a curriculum. Even the losses. Especially the losses.",
      audioClipId: "vo_gm_climb_t3_post_loss_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   MID-SERIES — between games of a best-of-3.
   Each tier gets three variants keyed off the running
   score from the player's perspective: LEADING (player up
   1-0 or 2-1), TIED (1-1), TRAILING (down 0-1 or 1-2).
   The corrupted GM voices most beats; Celebration leaks
   exactly once per climb in a TRAILING beat at Tier 1+.
   ═══════════════════════════════════════════════════════ */

const CLIMB_T0_MID_LEADING: DialogScene = {
  id: "chess_climb_t0_mid_leading",
  label: "Chess Climb — Tier 0 (Exhibition) — Mid-Series (Leading)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Up a game at EXHIBITION tier. The audience is impressed in the way a non-existent audience can be — sincerely, but quietly, and without applause. We switch colors next game. You play White. Don't get sentimental about the lead. The board doesn't remember who won the last one.",
      audioClipId: "vo_gm_climb_t0_mid_leading_01",
    },
  ],
};

const CLIMB_T0_MID_TIED: DialogScene = {
  id: "chess_climb_t0_mid_tied",
  label: "Chess Climb — Tier 0 (Exhibition) — Mid-Series (Tied 1-1)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ONE-ALL. We go to game three. ARMAGEDDON if game three draws — Black gets the time advantage and a draw counts as a Black win. The Architect designed the format. He thinks tiebreaks are entertainment. He is wrong, but he signs my paychecks. Sit down.",
      audioClipId: "vo_gm_climb_t0_mid_tied_01",
    },
  ],
};

const CLIMB_T0_MID_TRAILING: DialogScene = {
  id: "chess_climb_t0_mid_trailing",
  label: "Chess Climb — Tier 0 (Exhibition) — Mid-Series (Trailing)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "Down a game. STATISTICALLY EXPECTED at Exhibition tier. The Architect's actuarial model predicts you lose this series 73 percent of the time, and the model is RARELY wrong about Tier 0. Game two starts in thirty seconds. You play White. Make the model nervous.",
      audioClipId: "vo_gm_climb_t0_mid_trailing_01",
    },
  ],
};

const CLIMB_T1_MID_LEADING: DialogScene = {
  id: "chess_climb_t1_mid_leading",
  label: "Chess Climb — Tier 1 (Wagered) — Mid-Series (Leading)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ONE-ZERO at WAGERED tier. The contract is stamped, the ELO is escrowed, and the Architect's audit log just blinked. One more win and you walk out with the promotion. Lose this game and we go to a decider. Capablanca said a master sees the same move at the right moment. The right moment is the next move. Find it.",
      audioClipId: "vo_gm_climb_t1_mid_leading_01",
    },
  ],
};

const CLIMB_T1_MID_TIED: DialogScene = {
  id: "chess_climb_t1_mid_tied",
  label: "Chess Climb — Tier 1 (Wagered) — Mid-Series (Tied 1-1)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ONE-ALL. The Architect's contract has a TIEBREAK CLAUSE in clause six and the language is intentionally upsetting. Game three settles the wager. I will not soften the stakes — you signed the clipboard. You can also DECLINE the decider right now, halve your wager, and walk. Take whichever option suits the next thirty minutes of your life.",
      audioClipId: "vo_gm_climb_t1_mid_tied_01",
    },
  ],
};

const CLIMB_T1_MID_TRAILING: DialogScene = {
  id: "chess_climb_t1_mid_trailing",
  label: "Chess Climb — Tier 1 (Wagered) — Mid-Series (Trailing)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ZERO-ONE. The clipboard is starting to vibrate. That is normal at this tier. The Architect's enforcement subroutine wakes up at 0-1 and begins drafting the demotion paperwork in advance — it ASSUMES the loss. You can disappoint the subroutine. Game two starts now. The board is the same; the stakes have just begun to lean.",
      audioClipId: "vo_gm_climb_t1_mid_trailing_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "[The corrupted voice has thinned. The keepsake is leaking through.] Listen to me. I am only going to be in the room for one cue and then he is going to take the chair back. You are not playing badly. You are playing FOR something for the first time in this Arena. Your style changes when there are stakes. That is normal. Breathe. Look at the board. Find the move you would have played at Tier 0, when nothing mattered. That move is still on the board. Play it.",
      audioClipId: "vo_gm_climb_t1_mid_trailing_02",
    },
  ],
};

const CLIMB_T2_MID_LEADING: DialogScene = {
  id: "chess_climb_t2_mid_leading",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Mid-Series (Leading)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ONE-ZERO at the HIERARCHY'S TABLE. The horned silhouettes at the back of the chamber have stopped pretending to look at their phones. They are looking at the board. They have not seen me lose at this tier in seventy-three matches. The Goggles between us shimmer faintly — they are scoring you. The Annotated Knight is one win away. Do not let go of it.",
      audioClipId: "vo_gm_climb_t2_mid_leading_01",
    },
  ],
};

const CLIMB_T2_MID_TIED: DialogScene = {
  id: "chess_climb_t2_mid_tied",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Mid-Series (Tied 1-1)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ONE-ALL at the HIERARCHY'S TABLE. This is rarer than you understand. The demons are murmuring — that's the closest they come to enthusiasm. Game three decides the Annotated Knight, the lockout, and a column in the Architect's threat ledger that I am not allowed to read aloud. Sun Tzu wrote that the supreme art of war is to subdue the enemy without fighting. We are about to fight. Begin.",
      audioClipId: "vo_gm_climb_t2_mid_tied_01",
    },
  ],
};

const CLIMB_T2_MID_TRAILING: DialogScene = {
  id: "chess_climb_t2_mid_trailing",
  label: "Chess Climb — Tier 2 (Hierarchy's Table) — Mid-Series (Trailing)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "ZERO-ONE. The middle management of the damned LIKES this. They have been instructed to enjoy losses by contestants and they are following the instruction with what passes for sincerity in their bracket of the afterlife. The Goggles between us are warm now. They are warmer when I am winning. I do not know why. I have stopped asking.",
      audioClipId: "vo_gm_climb_t2_mid_trailing_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "[The keepsake bleeds through. The room dims one notch.] Stand up. Walk around the table once before you sit down again. The Hierarchy hates when contestants exercise the right to PAUSE — it makes us look like agents and not employees. You are an agent. Use the thirty seconds. Look at your last game. Find the move you almost played and rejected. That is usually the move that wins the second game. I love you. Sit down.",
      audioClipId: "vo_gm_climb_t2_mid_trailing_02",
    },
  ],
};

const CLIMB_T3_MID_LEADING: DialogScene = {
  id: "chess_climb_t3_mid_leading",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Mid-Series (Leading)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "One-zero. Mol'Garath has not moved from his seat. He has not blinked. He has not laughed. He is studying you the way he studied the Prince in the third hour of the Labyrinth, and the Prince walked out of that hour with the Goggles on his face. I want you to know what that meant. It meant the Unmaker had decided you were a NEW VARIABLE, and his interest in new variables is the closest he comes to mercy. Win the next one.",
      audioClipId: "vo_gm_climb_t3_mid_leading_01",
    },
  ],
};

const CLIMB_T3_MID_TIED: DialogScene = {
  id: "chess_climb_t3_mid_tied",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Mid-Series (Tied 1-1)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "One-all at the LABYRINTH WAGER. The chamber is quiet. The Hierarchy is quiet. Mol'Garath is leaning forward — that is the posture he held the night the Prince beat me. I have not been in this exact configuration of light and tempo since the morning of the eleventh of Sowing, and that morning ended in the only loss of my Celebration career. I am noting the symmetry. So is he. Game three. Sit down. We are about to find out which pattern is the one that repeats.",
      audioClipId: "vo_gm_climb_t3_mid_tied_01",
    },
  ],
};

const CLIMB_T3_MID_TRAILING: DialogScene = {
  id: "chess_climb_t3_mid_trailing",
  label: "Chess Climb — Tier 3 (Labyrinth Wager) — Mid-Series (Trailing)",
  kind: "chapter_pre",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "Zero-one. The Unmaker is amused. Amused is not a state I have seen on his face in fourteen of our seventeen prior meetings, and the three times I did, the contestant lost the next game in under twenty moves. I do not want you to be the fourth. Look at me. The man playing the white pieces is a corpse running my template. He has my openings, my middlegame, and my endgame technique — and he does NOT have the part of me that tried something new at move twenty-three when the textbook said move twenty-three did not exist. You have access to that part. He does not.",
      audioClipId: "vo_gm_climb_t3_mid_trailing_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "Game two starts in a moment. Play the move the textbook would not. He cannot calculate the move he was never trained to expect. Mol'Garath wants to see whether you can do what the Prince did. So do I. So, somewhere under the script, does the man across the table. We are all rooting for you, in the only way the dead are still allowed to root.",
      audioClipId: "vo_gm_climb_t3_mid_trailing_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   PROMOTION — fires once when the player clears a tier
   for the first time and the next tier just unlocked.
   Bridges the post-win cue and the next-tier pre-series
   so the climb feels continuous instead of menu-driven.
   ═══════════════════════════════════════════════════════ */

const CLIMB_PROMOTION_TO_T1: DialogScene = {
  id: "chess_climb_promotion_to_t1",
  label: "Chess Climb — Promotion to Tier 1 (Wagered)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER ONE is now AVAILABLE in your menu. The Architect has minted a contract template under your account. The contract is currently EMPTY — it activates the first time you accept a Wagered series. You can leave it empty for the rest of your life if you want. The clipboard is just a clipboard until you sign.",
      audioClipId: "vo_gm_climb_promotion_t1_01",
    },
  ],
};

const CLIMB_PROMOTION_TO_T2: DialogScene = {
  id: "chess_climb_promotion_to_t2",
  label: "Chess Climb — Promotion to Tier 2 (Hierarchy's Table)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_corrupted",
      mood: "menacing",
      text: "TIER TWO is now AVAILABLE. The HIERARCHY'S TABLE — horned audience, the Goggles on the felt, lockouts measured in real-time hours, and a one-shot consumable for the winner. The Architect added a line to your audit log; it is a footnote, not a sentence. Yet. Sit when you are ready. The chairs do not warm up.",
      audioClipId: "vo_gm_climb_promotion_t2_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "guarded",
      text: "Before you sit at that table — the Goggles between us were MINE. The day I lost them was the day the Architect promoted me to surveillance. I did not cry; I did not even know I had lost them yet. They sat on the felt at the Hierarchy's Table for three hundred years before anyone realized the Game Master they belonged to was not coming back. Wear them carefully if you win them. They will fit you better than they should.",
      audioClipId: "vo_gm_climb_promotion_t2_02",
    },
  ],
};

const CLIMB_PROMOTION_TO_T3: DialogScene = {
  id: "chess_climb_promotion_to_t3",
  label: "Chess Climb — Promotion to Tier 3 (Labyrinth Wager)",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "game_master_celebration",
      mood: "warm",
      text: "TIER THREE is unlocked. The Labyrinth Wager. Mol'Garath has been notified. He will not appear at the table until you accept — that is part of the courtesy he extends to opponents he considers WORTH SEEING IN PERSON. You are the third such opponent in seventeen thousand years. The first was the Prince. The second was the Oracle. The third is whoever you become between now and the moment you sit down. Take your time. The chair will be empty until you fill it.",
      audioClipId: "vo_gm_climb_promotion_t3_01",
    },
    {
      speaker: "game_master_celebration",
      mood: "reflective",
      text: "Finish the Prince's Game first if you have not. The Labyrinth Wager has a passage where the moves of the Prince's queen sacrifice resolve themselves on the board between us — I cannot prevent it, and you will recognize it when it happens, and the recognition is the entire point. We will both look up at the same time. Mol'Garath will smile. He so rarely smiles.",
      audioClipId: "vo_gm_climb_promotion_t3_02",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   EXPORT — the full scene catalog for registration in
   chessTutorial.ts's CHESS_TUTORIAL_SCENES array and for
   memory-resin keepsake harvesting.
   ═══════════════════════════════════════════════════════ */

export const CHESS_CLIMB_SCENES: readonly DialogScene[] = Object.freeze([
  CLIMB_T0_PRE,
  CLIMB_T0_MID_LEADING,
  CLIMB_T0_MID_TIED,
  CLIMB_T0_MID_TRAILING,
  CLIMB_T0_POST_WIN,
  CLIMB_T0_POST_LOSS,
  CLIMB_T1_PRE,
  CLIMB_T1_MID_LEADING,
  CLIMB_T1_MID_TIED,
  CLIMB_T1_MID_TRAILING,
  CLIMB_T1_POST_WIN,
  CLIMB_T1_POST_LOSS,
  CLIMB_T2_PRE,
  CLIMB_T2_MID_LEADING,
  CLIMB_T2_MID_TIED,
  CLIMB_T2_MID_TRAILING,
  CLIMB_T2_POST_WIN,
  CLIMB_T2_POST_LOSS,
  CLIMB_T3_PRE,
  CLIMB_T3_MID_LEADING,
  CLIMB_T3_MID_TIED,
  CLIMB_T3_MID_TRAILING,
  CLIMB_T3_POST_WIN,
  CLIMB_T3_POST_LOSS,
  CLIMB_PROMOTION_TO_T1,
  CLIMB_PROMOTION_TO_T2,
  CLIMB_PROMOTION_TO_T3,
]);

/** Lookup: return the pre-series scene for a tier. */
export function getClimbPreScene(tierRank: number): DialogScene | undefined {
  const map: Record<number, DialogScene> = {
    0: CLIMB_T0_PRE,
    1: CLIMB_T1_PRE,
    2: CLIMB_T2_PRE,
    3: CLIMB_T3_PRE,
  };
  return map[tierRank];
}

/** Lookup: return the post-series scene for a tier + outcome. */
export function getClimbPostScene(
  tierRank: number,
  outcome: "win" | "loss",
): DialogScene | undefined {
  if (outcome === "win") {
    const winMap: Record<number, DialogScene> = {
      0: CLIMB_T0_POST_WIN,
      1: CLIMB_T1_POST_WIN,
      2: CLIMB_T2_POST_WIN,
      3: CLIMB_T3_POST_WIN,
    };
    return winMap[tierRank];
  }
  const lossMap: Record<number, DialogScene> = {
    0: CLIMB_T0_POST_LOSS,
    1: CLIMB_T1_POST_LOSS,
    2: CLIMB_T2_POST_LOSS,
    3: CLIMB_T3_POST_LOSS,
  };
  return lossMap[tierRank];
}

/** Score state from the player's perspective at the moment a
 *  mid-series cue should fire. Used by the climb runner to pick
 *  the right between-games scene. */
export type ClimbMidState = "leading" | "tied" | "trailing";

/** Convert a (playerWins, opponentWins) pair to the matching mid
 *  state. Wins-only — draws collapse into "tied" if neither side
 *  has more wins than the other. */
export function climbMidStateFromScore(
  playerWins: number,
  opponentWins: number,
): ClimbMidState {
  if (playerWins > opponentWins) return "leading";
  if (playerWins < opponentWins) return "trailing";
  return "tied";
}

/** Lookup: return the mid-series scene for a tier + score state. */
export function getClimbMidScene(
  tierRank: number,
  state: ClimbMidState,
): DialogScene | undefined {
  const map: Record<number, Record<ClimbMidState, DialogScene>> = {
    0: {
      leading: CLIMB_T0_MID_LEADING,
      tied: CLIMB_T0_MID_TIED,
      trailing: CLIMB_T0_MID_TRAILING,
    },
    1: {
      leading: CLIMB_T1_MID_LEADING,
      tied: CLIMB_T1_MID_TIED,
      trailing: CLIMB_T1_MID_TRAILING,
    },
    2: {
      leading: CLIMB_T2_MID_LEADING,
      tied: CLIMB_T2_MID_TIED,
      trailing: CLIMB_T2_MID_TRAILING,
    },
    3: {
      leading: CLIMB_T3_MID_LEADING,
      tied: CLIMB_T3_MID_TIED,
      trailing: CLIMB_T3_MID_TRAILING,
    },
  };
  return map[tierRank]?.[state];
}

/** Lookup: return the promotion scene for a newly unlocked tier
 *  rank (the tier the player just gained access to, NOT the tier
 *  they just cleared). Tier 0 has no promotion scene because it
 *  is the entry tier. Returns undefined for unknown ranks. */
export function getClimbPromotionScene(
  newlyUnlockedRank: number,
): DialogScene | undefined {
  switch (newlyUnlockedRank) {
    case 1:
      return CLIMB_PROMOTION_TO_T1;
    case 2:
      return CLIMB_PROMOTION_TO_T2;
    case 3:
      return CLIMB_PROMOTION_TO_T3;
    default:
      return undefined;
  }
}
