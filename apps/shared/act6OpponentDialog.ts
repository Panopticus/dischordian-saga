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
    "That was a laugh on purpose. First in a long century. Thank you. Keep playing.",
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

/* ── SCAFFOLD dialog (Phase 5, 2026-05-10) — bible §3.2.
 *    Voicing taken verbatim from bible §3.2 ("ossuary lighting,
 *    sigils, the dead are so terribly bored of each other").
 *    Writer review before ship: tone calibration against the
 *    Architect / Insurgency dialog tables; the Necromancer's
 *    ossuary register is intentionally older than either side. */
const THAZULOK_RETURNS: Act6OpponentDialog = {
  opponentId: "act6_thazulok_returns",
  frameIntro:
    "Sigils light themselves in the floor of the substrate. Thazulok was here before the Ark. He is not surprised you came. He is delighted, the way an old librarian is delighted by a returning patron.",
  elaraPreMatch:
    "I have his file. The file is older than my upload. I am going to read it to you, and I am going to be honest about what I do not understand. Most of it I do not understand.",
  humanPreMatch:
    "He outranks the role I wear. He is one of the few in the catalogue who does. Be careful with the names on the cards. Some of them are still listening.",
  opponentMidMatchEarly:
    "The dead are so terribly bored of each other. Play me. I have been rehearsing this hand for centuries.",
  opponentMidMatchMid:
    "That card belonged to a chemist in Mechronis. He laughed when he played it. I laughed when he died. Forgive me. The laugh was sincere.",
  opponentMidMatchLate:
    "Don't worry. The first death is the worst. The second is procedure. The third is a kindness.",
  elaraPostMatchWin:
    "You read his ledger out loud and Thazulok did not flinch. He bowed. I did not know he could bow. I am updating the file.",
  humanPostMatchWin:
    "He let you have the win. He has the records to lose without it costing him anything. The win is yours; the patience was his.",
  elaraPostMatchLoss:
    "He took the match the way a librarian takes back a borrowed book. The book is fine. You are fine. He is, on average, fine.",
  humanPostMatchLoss:
    "He filed you. There are worse fates than being filed by Thazulok. There are also better. Try again when you are ready.",
  frameCloseWin:
    "Thazulok leaves the sigils on for one more night, in case you have someone to read. The ossuary dims. The substrate is quieter than before, the way a library is quieter after it closes.",
  frameCloseLoss:
    "He files your hand into a ledger he has been keeping since the Mechronis registry burned. He says: 'Try again. I'm not going anywhere.' He means the ossuary. He also means the substrate. He also means time.",
};

/* ── SCAFFOLD dialog (Phase 6, 2026-05-10) — bible §3.8.
 *    Voicing: Corey's institutional alto+baritone (museum-placard
 *    register, public-relations warmth with private knives).
 *    Writer review before ship. */
const COREY_RESURFACES: Act6OpponentDialog = {
  opponentId: "act6_corey_resurfaces",
  frameIntro:
    "The arena is twice the size you remember. The chairs are fuller. There are signs in three languages. Corey is at the door, holding a tablet. You are on the tablet. You have been on the tablet for some time.",
  elaraPreMatch:
    "He has been collecting your highlight reel. I am not going to comment on the editing. The editing, on average, is generous.",
  humanPreMatch:
    "He runs an institution now. Institutions do not lose to walk-ins. Be ready for that. He will not be ready for you to be ready.",
  opponentMidMatchEarly:
    "Welcome back. I have you in twelve places of the catalog now. You will recognize most of them. Play.",
  opponentMidMatchMid:
    "That hand is a collector's edition of one of yours, from the first arena. I bought the rights. The rights were cheap. Forgive me.",
  opponentMidMatchLate:
    "The footnote is already written. The footnote will note effort. It will not, this time, note victory. You can still change the second clause.",
  elaraPostMatchWin:
    "You earned the footnote. The footnote is one sentence in a permanent display. I am going to read it aloud at home tonight, with feeling.",
  humanPostMatchWin:
    "An institution clapped for you. That is rarer than a person clapping. The institution will, for one quarter, refer to you in present tense.",
  elaraPostMatchLoss:
    "He took the rematch. The catalog will note the effort flatteringly. It is an honest catalog. The flattery is honest too.",
  humanPostMatchLoss:
    "Lost to the institution. Not the man. There is a difference, and the difference is yours to keep. Try again at off-hours. He plays a different hand at off-hours.",
  frameCloseWin:
    "Corey claps three times — the institutional clap, not the personal one. He says: 'You have earned a footnote.' The footnote, you learn later, is a sentence in the museum's permanent display.",
  frameCloseLoss:
    "He says: 'Thank you for the rematch. The catalog will note your effort.' The note will, in fact, be flattering. You will read it again later and feel less defeated than you should.",
};

/* ── SCAFFOLD dialog (Phase 7, 2026-05-10) — bible §3.11.
 *    Voicing: the Jailer's procedural-warden register (Architect-
 *    aligned, ledger-driven, patient on geological scales).
 *    Writer review before ship. */
const THE_JAILER_DIALOG: Act6OpponentDialog = {
  opponentId: "act6_the_jailer",
  frameIntro:
    "The pen is empty. The pen has been empty since you opened it. The Jailer arrives with a clipboard, not a weapon. The clipboard is, in context, scarier.",
  elaraPreMatch:
    "He has been waiting for the consequence half of the conversation. The conversation is, technically, with you. I am attending.",
  humanPreMatch:
    "Architect-aligned, ledger-loyal. He will play the way an actuary plays. Do not let the math lull you. The math has been kept current for a long time.",
  opponentMidMatchEarly:
    "Permission was not granted to free her. Permission was not the point. I am here for the consequence half. Play.",
  opponentMidMatchMid:
    "Your card is filed under 'unauthorized kindness.' I have a column for that. It has not been used in years. Today I use it.",
  opponentMidMatchLate:
    "The Oracle is not coming back. The pen is open. The ledger will note this, with footnotes. Decide whether the footnotes will note your win.",
  elaraPostMatchWin:
    "The Jailer files the freedom of the Oracle as 'pending.' I do not know what condition closes 'pending.' I am going to find out, because he will tell me, eventually, in writing.",
  humanPostMatchWin:
    "He files the loss. He files it accurately. The accuracy is a small mercy, and he is a man who deals in small mercies. Hold on to that.",
  elaraPostMatchLoss:
    "He does not gloat. He simply re-files the Oracle as 'recovered, conditional.' The condition is your failure to come back. We are coming back.",
  humanPostMatchLoss:
    "He won and did not change his expression. That is the Jailer at his most honest. We will play him again. The ledger will be updated. The pen will stay empty.",
  frameCloseWin:
    "The pen is empty. The ledger is current. You have, technically, been recorded as the cause. The Jailer offers, formally, his condolences for your involvement.",
  frameCloseLoss:
    "The Oracle is recorded as 'recovered, conditional.' The condition is your failure to come back. Come back.",
};

export const ACT_6_OPPONENT_DIALOGS: readonly Act6OpponentDialog[] = [
  THE_WOMAN_SHE_WAS,
  THE_DETECTIVE_IN_THE_WALL,
  THAZULOK_RETURNS,
  COREY_RESURFACES,
  THE_JAILER_DIALOG,
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
