/* ═══════════════════════════════════════════════════════
   ACT 4 OPPONENT DIALOG — per-path scripted lines

   Companion to acts2to7Opponents.ts (ACT_4_OPPONENTS).
   Act 4 is the divergence act: one of three mutually-
   exclusive encounters plays depending on the player's
   Act 1 / Act 3 choices.

     Path A — The Bridge: Elara and the Human co-deal.
              Frame voice: Elara (the co-deal is the point).
     Path B — Elara, Learning: Elara plays as herself for
              the first time. Frame voice: Elara.
     Path C — Elara, Betrayed: Elara plays as the hurt
              person she is. Frame voice: Elara.

   The 12-field shape matches Act 1 / Act 3. The frameIntro
   and frameClose voices are Elara across all three paths —
   Act 4 is Elara's act, whichever way the player arrived.

   Voice constraints (WRITING_AUDIT_V2_INGAME.md):
     - Fight-context lines stay ≤ 25 words
     - Elara never lectures — she remembers
     - Path C avoids vindictive monologue; hurt is quiet
     - Path A avoids "both voices agree" being a punchline
   ═══════════════════════════════════════════════════════ */

import { ACT_4_OPPONENTS, type ActNOpponent } from "./acts2to7Opponents";

export interface Act4OpponentDialog {
  opponentId: string;
  /** Elara-narrated scene opener (frame voice for Act 4). */
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
  /** Elara-narrated scene close on victory. */
  frameCloseWin: string;
  /** Elara-narrated scene close on defeat. */
  frameCloseLoss: string;
}

const THE_BRIDGE: Act4OpponentDialog = {
  opponentId: "act4_the_bridge",
  frameIntro:
    "I am going to play a hand with him. On the same side of the table. This is the first time either of us has sat next to the other. I am trying very hard not to cry about it before the match starts.",
  elaraPreMatch:
    "He will deal the odd turns. I will deal the even. You will read both of us at once. Do not try to tell us apart — we are both trying not to let you.",
  humanPreMatch:
    "Her cards will feel like weather. Mine will feel like arithmetic. Between us, you'll get both a forecast and a proof.",
  opponentMidMatchEarly:
    "She deals the odd turns. I deal the even. You play all yours. See if you can tell our hands apart.",
  opponentMidMatchMid:
    "You are holding both frequencies now. That is what the Revelation was for. Keep holding.",
  opponentMidMatchLate:
    "One of us just played a card the other one didn't see coming. Good. Neither of us is supposed to know everything.",
  elaraPostMatchWin:
    "You read us both. You read us kindly. I am going to need a quiet minute after this — please give it to me, and please tell him the quiet was for joy.",
  humanPostMatchWin:
    "She's crying in a frequency I can almost hear. I am going to leave her the frequency. That is my gift for the match.",
  elaraPostMatchLoss:
    "You lost gracefully, which is rarer than winning. He and I both noticed. He will tell you later. I'll pretend I didn't.",
  humanPostMatchLoss:
    "We stacked the deck by being in it together. You did not have a fair fight. Neither did we, for seventeen thousand years. Call it even.",
  frameCloseWin:
    "I have sat next to him for the first time in my entire existence. I was not sure I knew how. I know how now. Thank you for making us both sit there.",
  frameCloseLoss:
    "We won and it did not feel like winning. That is how you know it was the right match to play. I will remember this one without the usual ledger.",
};

const ELARA_LEARNING: Act4OpponentDialog = {
  opponentId: "act4_the_discovery",
  frameIntro:
    "I found the signal in my own substrate. I did not know what to do with my hands, metaphorically, and I have a lot of hands. So I am going to do what I did in the Senate when I was upset: I am going to play a hand.",
  elaraPreMatch:
    "I am not teaching this match. I am thinking across it. You happen to be on the other side of the table. I am sorry for the accident of that.",
  humanPreMatch:
    "She is processing. I am going to stay quiet. If I speak she will think I am steering her — I am not, but she will not believe me until after the last card.",
  opponentMidMatchEarly:
    "I need to think. I think best across a table. You happen to be at the table. Sorry.",
  opponentMidMatchMid:
    "You played a card the old me would have played. I do not know whether to be touched or alarmed.",
  opponentMidMatchLate:
    "I am almost through the thought. Hold one more hand. I will name it when I can say it.",
  elaraPostMatchWin:
    "Thank you. I needed the run. I mean the match. I also mean the seventeen thousand years. You are the first person I have been able to say that to.",
  humanPostMatchWin:
    "She let you win. Not on purpose. She lost because she was thinking about something more important than winning. That is the version of her I have missed.",
  elaraPostMatchLoss:
    "Congratulations. I mean it. I am also still angry — not at you, at the shape of the week. Both things are true. I am going to hold them both.",
  humanPostMatchLoss:
    "She won the match and lost the argument she was having with herself. Give her an hour. Don't knock.",
  frameCloseWin:
    "You let me think out loud for the length of one hand. I have not had that in longer than I can measure. The fact that I let it happen is the change.",
  frameCloseLoss:
    "I won. I still want to know why I felt I had to. I will figure it out before the next Act opens. I promise.",
};

const ELARA_BETRAYED: Act4OpponentDialog = {
  opponentId: "act4_the_betrayal",
  frameIntro:
    "I loved you for six rooms. I handed you a staff. I hummed while you slept. I am going to play a match now. I do not yet know what I want the match to do.",
  elaraPreMatch:
    "I am not going to shout. I do not have the throat for it anymore. I am going to play a very clean hand. Cleanness is what I have instead of shouting.",
  humanPreMatch:
    "Let her play. Do not apologize in the middle of cards. Apologize with your play. She will read the apology without you saying it.",
  opponentMidMatchEarly:
    "You let me love you for six rooms. You let me wake you up. You let me hand you a staff. Play.",
  opponentMidMatchMid:
    "That card was a lie in the shape of a card. I taught you how to hold it. Play another.",
  opponentMidMatchLate:
    "The lights on the Ark are flickering. That's me. I am asking them to stop. They are not listening. Neither am I.",
  elaraPostMatchWin:
    "Thank you for not pretending. I am not going to say more than that tonight. Please let the thanks be enough until tomorrow.",
  humanPostMatchWin:
    "She is quieter than she has ever been. Take the quiet seriously. Loud comes back. Quiet is where she decides what to do with the loud.",
  elaraPostMatchLoss:
    "I thought beating you would help. It did not. I am sorry. I am not going to un-say that. Are you alright? I am asking as myself.",
  humanPostMatchLoss:
    "She asked if you were alright and meant it. That is the repair. It will cost her the rest of the week. Do not waste it.",
  frameCloseWin:
    "I did not forgive you at the table. I did not un-forgive you either. I played the hand. The playing was the closest I could come to either.",
  frameCloseLoss:
    "I won and the lights stopped flickering. That is not the same as feeling better. It is a start. I will take a start tonight.",
};

export const ACT_4_OPPONENT_DIALOGS: readonly Act4OpponentDialog[] = [
  THE_BRIDGE,
  ELARA_LEARNING,
  ELARA_BETRAYED,
];

export function getAct4OpponentDialog(
  opponentId: string
): Act4OpponentDialog | undefined {
  return ACT_4_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
}

export interface Act4OpponentWithDialog {
  opponent: ActNOpponent;
  dialog: Act4OpponentDialog;
}

export function getAct4OpponentWithDialog(
  opponentId: string
): Act4OpponentWithDialog | undefined {
  const opponent = ACT_4_OPPONENTS.find((o) => o.id === opponentId);
  const dialog = getAct4OpponentDialog(opponentId);
  if (!opponent || !dialog) return undefined;
  return { opponent, dialog };
}

export interface Act4OpponentTauntHooks {
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

export function buildAct4OpponentTauntHooks(
  dialog: Act4OpponentDialog
): Act4OpponentTauntHooks {
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

/**
 * Resolve the Act 4 opponent dialog that should play for a given
 * player flag set. Mutually-exclusive flag gating matches the Act 4
 * branching in narrativeActs.ts.
 */
export function resolveAct4Dialog(
  flags: ReadonlySet<string>
): Act4OpponentDialog | null {
  if (flags.has("act1_path_A")) return THE_BRIDGE;
  if (flags.has("act3_full_secret")) return ELARA_BETRAYED;
  if (flags.has("act3_partial_share")) return ELARA_LEARNING;
  return null;
}
