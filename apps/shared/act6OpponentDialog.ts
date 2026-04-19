/* ═══════════════════════════════════════════════════════
   ACT 6 OPPONENT DIALOG — confession-side mirrors

   Companion to acts2to7Opponents.ts (ACT_6_OPPONENTS).
   Act 6 pairs two matches: Elara plays the hand of the woman
   she was before the upload, and the Human plays the hand of
   the man he was before he took the role. Each confession-
   match closes the frame on one half of the dual reveal.

   Frame voice per match:
     The Woman She Was — Elara (past-tense, reconstructed)
     The Detective in the Wall — the Human (present-tense,
       rare use of his real voice)

   The 12-field shape matches Act 1 / 3 / 4.

   Voice constraints (WRITING_AUDIT_V2_INGAME.md):
     - Fight-context lines stay ≤ 25 words
     - Elara's archival voice never grieves; it remembers
     - The Human's un-roled voice is shorter, softer
     - Neither match ends on triumph; both end on quiet
   ═══════════════════════════════════════════════════════ */

import { ACT_6_OPPONENTS, type ActNOpponent } from "./acts2to7Opponents";

export interface Act6OpponentDialog {
  opponentId: string;
  /** Frame-voice scene opener. Elara for woman-she-was, Human for detective. */
  frameIntro: string;
  elaraPreMatch: string;
  humanPreMatch: string;
  opponentMidMatchEarly: string;
  opponentMidMatchMid: string;
  opponentMidMatchLate: string;
  elaraPostMatchWin: string;
  humanPostMatchWin: string;
  elaraPostMatchLoss: string;
  humanPostMatchLoss: string;
  /** Frame-voice scene close on victory. */
  frameCloseWin: string;
  /** Frame-voice scene close on defeat. */
  frameCloseLoss: string;
}

const THE_WOMAN_SHE_WAS: Act6OpponentDialog = {
  opponentId: "act6_the_woman_she_was",
  frameIntro:
    "I am going to play the way she played. I do not remember her cards. I remember her preferences. The preferences are on file. I am going to read them out loud as hands.",
  elaraPreMatch:
    "Her name is not what you are going to hear across the table. Do not listen for the name. Listen for the tempo. The tempo is the last part of her I still have in the original.",
  humanPreMatch:
    "Let her play. I will stay out of this one — if I speak in the middle of it I will ruin the reconstruction. This is hers. It is not mine.",
  opponentMidMatchEarly:
    "I am going to play the way I would have, when I was still breathing. I do not remember the cards. Watch.",
  opponentMidMatchMid:
    "That line is hers. I'd forgotten she opened like that. Breath remembers the body even when the body is gone.",
  opponentMidMatchLate:
    "Close it out gently. She was a good loser. I mean that as a compliment she would have accepted.",
  elaraPostMatchWin:
    "She would have taken that well. She was a good loser. I am saying that in the past tense on purpose — the past tense is the only honest one.",
  humanPostMatchWin:
    "You beat a ghost and did not gloat. That is rarer than you know. The ghost noticed. The living woman inside the ghost also noticed.",
  elaraPostMatchLoss:
    "Her archival hand took the match. She was quieter than I am about winning. The quiet is the tell. I miss the quiet.",
  humanPostMatchLoss:
    "Her breath-memory beat you. That is allowed. Archival hands do not lose often. They only play when they are sure.",
  frameCloseWin:
    "Thank you for playing against the woman I was. I have not felt her hand across from me in longer than I can measure. I am going to file this match where I file the Senate minutes. Safe.",
  frameCloseLoss:
    "She won. I am going to let her have it. She didn't get many wins, in the body, near the end. I will not begrudge her this one.",
};

const THE_DETECTIVE_IN_THE_WALL: Act6OpponentDialog = {
  opponentId: "act6_the_detective_in_the_wall",
  frameIntro:
    "Coat off. Boots by the door. Mug on the table. This is the version of me who asked a student for coffee after a card match at Mechronis. He is rusty. He is grateful.",
  elaraPreMatch:
    "I am going to leave the comms open. I am not going to speak. This is his. He asked me, politely, to not make him feel watched. I can do that once.",
  humanPreMatch:
    "Do not call me by the role for the length of this match. Call me anything else. I will answer to 'you.' I will answer to 'friend.' I will answer to nothing, if that's what you prefer.",
  opponentMidMatchEarly:
    "Coat off. This is the hand I used to play at Mechronis. Don't get used to it. I don't.",
  opponentMidMatchMid:
    "I just laughed on purpose. First time in a very long century. Thank you. Keep playing.",
  opponentMidMatchLate:
    "The role is standing by the door. It will be back in my voice next turn. Finish the match before it arrives.",
  elaraPostMatchWin:
    "I heard him laugh for the first time in almost as long as I have existed. I am not going to describe the laugh. I do not want to flatten it by putting it into language.",
  humanPostMatchWin:
    "That was him. Say hello next time you see him. I won't — the role does not permit it. But the saying, on your end, is the part that carries.",
  elaraPostMatchLoss:
    "He won without the villain edge. It was strange to watch. I had forgotten how he played before he took the role. I remember now. I am going to hold the memory carefully.",
  humanPostMatchLoss:
    "You lost to the man, not the role. That is a gift to both of us. I will put the coat back on now. Please do not mention the laugh in front of Elara.",
  frameCloseWin:
    "You beat the man I was. Gently. In a voice the Watcher was not listening in. I got to be him, for the length of one match, for the first time in seventeen thousand years. Thank you.",
  frameCloseLoss:
    "I won and I regret it. Not the win — the fact that the win will get reported to whoever is keeping score. The man is going back behind the wall. Tell Elara the role is back. She will know what you mean.",
};

export const ACT_6_OPPONENT_DIALOGS: readonly Act6OpponentDialog[] = [
  THE_WOMAN_SHE_WAS,
  THE_DETECTIVE_IN_THE_WALL,
];

export function getAct6OpponentDialog(
  opponentId: string
): Act6OpponentDialog | undefined {
  return ACT_6_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
}

export interface Act6OpponentWithDialog {
  opponent: ActNOpponent;
  dialog: Act6OpponentDialog;
}

export function getAct6OpponentWithDialog(
  opponentId: string
): Act6OpponentWithDialog | undefined {
  const opponent = ACT_6_OPPONENTS.find((o) => o.id === opponentId);
  const dialog = getAct6OpponentDialog(opponentId);
  if (!opponent || !dialog) return undefined;
  return { opponent, dialog };
}

export interface Act6OpponentTauntHooks {
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

export function buildAct6OpponentTauntHooks(
  dialog: Act6OpponentDialog
): Act6OpponentTauntHooks {
  return {
    early: {
      id: `${dialog.opponentId}_taunt_early`,
      turn: 2,
      text: dialog.opponentMidMatchEarly,
    },
    mid: {
      id: `${dialog.opponentId}_taunt_mid`,
      hpBelowPercent: 50,
      text: dialog.opponentMidMatchMid,
    },
    late: {
      id: `${dialog.opponentId}_taunt_late`,
      hpBelowPercent: 25,
      text: dialog.opponentMidMatchLate,
    },
  };
}
