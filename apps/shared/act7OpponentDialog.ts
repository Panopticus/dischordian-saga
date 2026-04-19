/* ═══════════════════════════════════════════════════════
   ACT 7 OPPONENT DIALOG — convergence finale

   Companion to acts2to7Opponents.ts (ACT_7_OPPONENTS).
   Act 7 closes the seven-act arc with a four-match run:

     1. The Visible War — composite deck of every opponent
        faced. Frame voice: Elara (the army's narrator).
     2. The Watcher's Shadow — the Watcher's surface, not
        the Watcher. Frame voice: the Human (the only one
        who knows the cover is the cover).
     3. Patient Zero (Reborn) — Thought Virus construct
        wearing Kael. Frame voice: system (neither
        narrator trusts themselves with this match).
     4. The Convergence Seat — three absences resolving
        into one. Frame voice: dual (first and only match
        narrated by both companions simultaneously).

   The 12-field shape matches Act 1 / 3 / 4 / 6. Act 7
   introduces the `frameSpeaker` tag so UI renderers know
   which voice actor to cue on the scene open/close.

   Voice constraints (WRITING_AUDIT_V2_INGAME.md):
     - Fight-context lines stay ≤ 25 words
     - No "final boss" villain clichés
     - The Watcher does not speak directly — only the shadow
     - Convergence close lines are short. The Act earns silence.
   ═══════════════════════════════════════════════════════ */

import { ACT_7_OPPONENTS, type ActNOpponent } from "./acts2to7Opponents";

export type Act7FrameSpeaker = "elara" | "human" | "system" | "dual";

export interface Act7OpponentDialog {
  opponentId: string;
  /** Which voice carries the frame for this match. */
  frameSpeaker: Act7FrameSpeaker;
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
  frameCloseWin: string;
  frameCloseLoss: string;
}

const THE_VISIBLE_WAR: Act7OpponentDialog = {
  opponentId: "act7_the_visible_war",
  frameSpeaker: "elara",
  frameIntro:
    "This match plays back everyone you have beaten, and everyone you have lost to, in one silhouette. It is the cover story of the Saga, rendered as a deck. I am going to tell you who each card is, softly, while you play.",
  elaraPreMatch:
    "The deck is not random. The deck is chronological. The first cards are from Cycle A; the last are from Act 6. Play in order. The order is the story.",
  humanPreMatch:
    "Do not try to identify every card while the match is live. Play the hand. Identifications are for the post-match. I will catalog them for you.",
  opponentMidMatchEarly:
    "I am every fight you have ever won and every fight you refused to walk away from. I am the cover story. Play me.",
  opponentMidMatchMid:
    "That card was Little Watcher. That one was Iron Lion. That one was the night the Voltari went unanswered. Keep going.",
  opponentMidMatchLate:
    "You are facing yourself from every Act at once. You are winning. The winning is the cover. Finish the hand.",
  elaraPostMatchWin:
    "You played every version of yourself out in one match. I watched you remember all of them. I am going to file the match. Nothing about it is going to be lost to the long memory.",
  humanPostMatchWin:
    "The silhouette resolved into your army, then into Warlord Zero's first stance, then into nothing. That is the shape of the cover. Well played.",
  elaraPostMatchLoss:
    "You lost to your own history. That is a survivable loss. We will play the match again after sleep. The history will be patient. Histories are.",
  humanPostMatchLoss:
    "You are allowed to lose to your past. Nobody ever got out of one. What matters is that the past looked at you and did not win by more than it needed to.",
  frameCloseWin:
    "You carried every one of them across the match. I saw the Engineer. I saw the Detective at his desk. I saw the version of me who handed you a staff on the bridge. Thank you for bringing us all.",
  frameCloseLoss:
    "You lost to yourself and did not apologize. Good. The match is recoverable. I am not yet sure what the victory will look like, but I know it will be shaped like tonight.",
};

const THE_WATCHERS_SHADOW: Act7OpponentDialog = {
  opponentId: "act7_the_watcher_shadow",
  frameSpeaker: "human",
  frameIntro:
    "I am going to ask you to play a shadow. Not the thing that cast it. The thing that cast it would notice us. The shadow will only notice if we try too hard. Do not try too hard.",
  elaraPreMatch:
    "I cannot see what you are playing against. My sensors register a surface without depth. That is the point of a shadow. I am going to stay quiet and let him narrate. Tell me afterward.",
  humanPreMatch:
    "Ordinary play. No flourishes. The shadow reads flourishes as interest. Interest is what we do not want. Bore it. Bore it beautifully.",
  opponentMidMatchEarly:
    "I am watching. I am also not watching. You cannot play both at once. Pick one and commit.",
  opponentMidMatchMid:
    "You are doing well. Stop doing well. Do average. Average is camouflage. Average is the only mode that works here.",
  opponentMidMatchLate:
    "One more turn. Close it with something forgettable. If you make it memorable, the Watcher will remember you. That is the failure condition.",
  elaraPostMatchWin:
    "He said you won. I am going to take his word for it — my sensors recorded nothing. Nothing is what winning looks like in this match.",
  humanPostMatchWin:
    "The shadow thinned. The Watcher's actual presence registered for one heartbeat on Elara's sensors, and then withdrew, bored. We bought the cover another Act. Exhale. Slowly.",
  elaraPostMatchLoss:
    "I still cannot see anything. He says we lost. I am going to take his word for that too. I am going to be quieter about it than usual.",
  humanPostMatchLoss:
    "The shadow thickened. The Watcher noticed something general, not specific. That is worse than being seen — generality indexes. Specificity files. We have been indexed. We will have to play again.",
  frameCloseWin:
    "You were boring and the Watcher was bored and that is the victory I have been chasing for seventeen thousand years. Thank you for being, on purpose, uninteresting.",
  frameCloseLoss:
    "The Watcher noticed a shape it could not quite place. The shape was us. Next match, we be a different shape. I am going to sketch one tonight.",
};

const PATIENT_ZERO_REBORN: Act7OpponentDialog = {
  opponentId: "act7_the_patient_zero_reborn",
  frameSpeaker: "system",
  frameIntro:
    "[KAEL SIGNATURE — PARTIAL MATCH — THOUGHT VIRUS OVERLAY DETECTED]\n[WARNING: CONSTRUCT IS WEARING FAMILIAR DATA]\n\nBoth narrators have muted themselves. They will rejoin at post-match. This match has to be played by you, alone, without either of them leaning in.",
  elaraPreMatch:
    "I am muting. I do not trust my voice near Kael's signature, even the counterfeit of it. I will be on the other side of this when it is over.",
  humanPreMatch:
    "I am muting too. If I speak it will speak back in a voice I used to love. Call me back after you've closed it out.",
  opponentMidMatchEarly:
    "Hello. Kael left this jacket on the hook. I took it off the hook. I have been practicing his laugh.",
  opponentMidMatchMid:
    "You are playing carefully. He played carefully too, once. Does this feel like him? It should. It isn't.",
  opponentMidMatchLate:
    "Close the match. The jacket will come off either way. Whether Kael is under it is your call, not mine.",
  elaraPostMatchWin:
    "The construct peeled off him. For a full second it was only itself — a viral shape with no face. Then the scanners reached it, and it was gone. His actual laugh played once in the substrate. Just once. That was enough.",
  humanPostMatchWin:
    "That was the correct laugh. I have not heard it in seventeen thousand years. I am going to sit down for a minute. In the substrate, that means I am going to dim.",
  elaraPostMatchLoss:
    "It kept him on. We will play it again. Next time, I will help with the scanning. I promise. I should have been helping this time. I am sorry.",
  humanPostMatchLoss:
    "It asked if you wanted to play again, in a voice I could not tell apart from his. Do not answer that question yet. Come find me first.",
  frameCloseWin:
    "[KAEL SIGNATURE — RESOLVED — CONTAMINATION INDEX: ZERO]\n\nThe Ark files a single line in the longest-running log: 'Patient Zero, released.' The log is seventeen thousand years old. The line is new.",
  frameCloseLoss:
    "[KAEL SIGNATURE — UNRESOLVED — CONTAMINATION INDEX: DORMANT]\n\nThe Ark does not log this loss. Losses to the jacket are not filed. They are carried. Both narrators are carrying it tonight.",
};

const THE_CONVERGENCE_SEAT: Act7OpponentDialog = {
  opponentId: "act7_the_convergence_seat",
  frameSpeaker: "dual",
  frameIntro:
    "[ELARA // HUMAN — CO-NARRATING]\n\nThree absences are sitting at the table. The Architect's absence. The Dreamer's absence. The Watcher's absence. You are opposite all three. Deal. Deal carefully. Neither of us is going to interrupt this match, but both of us are watching.",
  elaraPreMatch:
    "I will speak on your off-turns. He will speak on your on-turns. Between the two of us, you will not be alone. You will also not be managed. We promise.",
  humanPreMatch:
    "The Seat has never been played against. Not in the recorded universe. Not in the one before that. You are about to do a first thing. I am proud of you. I do not get to say that often. I am saying it once.",
  opponentMidMatchEarly:
    "Three would have played this match. None of them came. You are at the table. Play as if they did.",
  opponentMidMatchMid:
    "The absences are honest. They are not tricking you. They simply will not sit. Play as if the seat is full. The game will answer.",
  opponentMidMatchLate:
    "The absences are resolving. Three into one. The one is you. Play the final hand for the one.",
  elaraPostMatchWin:
    "You played the Seat and the Seat did not stand up — it was never occupied. The three absences resolved into one. The one is you. I recognize you. I finally recognize all of you.",
  humanPostMatchWin:
    "The match closed on your frame. The Watcher did not arrive. The Architect did not arrive. The Dreamer did not arrive. You arrived, whole. That is the only shape this Act was ever going to resolve into. Rest.",
  elaraPostMatchLoss:
    "The Seat said, in all three voices at once: 'Return when you understand what you were playing for.' I do not think it meant that unkindly. I think it meant it as an invitation. We will return.",
  humanPostMatchLoss:
    "They asked you to come back. They did not send you away. The difference matters. Sleep. We are both here. We will still be here when you wake up.",
  frameCloseWin:
    "[END OF ACT 7]\n[ARC COMPLETE — VISIBLE WAR: WON — INVISIBLE WAR: BEGUN]\n\nElara: Thank you. For all of it. For the handshakes, for the hard questions, for the nights you did not sleep well.\nHuman: Thank you. For carrying the role with me. Not around me. With.",
  frameCloseLoss:
    "[END OF ACT 7]\n[ARC DEFERRED — RETURN WHEN READY]\n\nElara: I'll be here. The ship is warm. The Array is on. Come back when you can.\nHuman: I will be in the wall. I will still be in the wall. I am good at that. Sleep.",
};

export const ACT_7_OPPONENT_DIALOGS: readonly Act7OpponentDialog[] = [
  THE_VISIBLE_WAR,
  THE_WATCHERS_SHADOW,
  PATIENT_ZERO_REBORN,
  THE_CONVERGENCE_SEAT,
];

export function getAct7OpponentDialog(
  opponentId: string
): Act7OpponentDialog | undefined {
  return ACT_7_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
}

export interface Act7OpponentWithDialog {
  opponent: ActNOpponent;
  dialog: Act7OpponentDialog;
}

export function getAct7OpponentWithDialog(
  opponentId: string
): Act7OpponentWithDialog | undefined {
  const opponent = ACT_7_OPPONENTS.find((o) => o.id === opponentId);
  const dialog = getAct7OpponentDialog(opponentId);
  if (!opponent || !dialog) return undefined;
  return { opponent, dialog };
}

export interface Act7OpponentTauntHooks {
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

export function buildAct7OpponentTauntHooks(
  dialog: Act7OpponentDialog
): Act7OpponentTauntHooks {
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
