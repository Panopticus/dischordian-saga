/* ═══════════════════════════════════════════════════════
   ACT 3 OPPONENT DIALOG — per-battle scripted lines

   Companion to acts2to7Opponents.ts (ACT_3_OPPONENTS).
   Act 3 is framed by the Human, not the Engineer: the
   player descends into the substrate under the Human's
   narration and plays three gate-opponents before Kael's
   logs unlock. The frame voice on the scene open/close is
   the Human; Elara does not yet have substrate access and
   rejoins at post-match.

   Per opponent we author the same 12 fields as Act 1, so
   tests and UI adapters share the shape:
     - frameIntro (Human narrates the descent)
     - elaraPreMatch (reaction from outside the substrate)
     - humanPreMatch (reaction from inside)
     - opponentMidMatchEarly / Mid / Late (≤ 25 words)
     - elaraPostMatchWin / Loss
     - humanPostMatchWin / Loss
     - frameCloseWin (Human's memoir close)
     - frameCloseLoss (Human's memoir close on defeat)

   Voice constraints (WRITING_AUDIT_V2_INGAME.md):
     - Fight-context lines stay ≤ 25 words
     - No "I've already won" villain clichés
     - Substrate constructs calibrate, not threaten
     - Elara never lectures — she remembers
   ═══════════════════════════════════════════════════════ */

import { ACT_3_OPPONENTS, type ActNOpponent } from "./acts2to7Opponents";

export interface Act3OpponentDialog {
  opponentId: string;
  /** Human-narrated scene opener (the frame voice for Act 3). */
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
  /** Human-narrated scene close on victory. */
  frameCloseWin: string;
  /** Human-narrated scene close on defeat. */
  frameCloseLoss: string;
}

const SUBSTRATE_ECHO: Act3OpponentDialog = {
  opponentId: "act3_substrate_echo",
  frameIntro:
    "Kael left an echo of himself at the first gate. He was fond of kettles. He left this one on so the next visitor would know the place was lived in.{if act_2_complete} You have crossed two acts to get here; the kettle has been waiting that long.{/if}",
  elaraPreMatch:
    "I cannot see what you are about to do. The substrate refuses me. I can see the doorway; I cannot see through it. Please come back across the doorway.",
  humanPreMatch:
    "The echo is not him. It is a recording of how he would have greeted you. Greet it back. The greeting is the gate.{if kael_questline_complete} You greeted him properly once before. The recording will recognise the greeting.{/if}",
  opponentMidMatchEarly:
    "Whoever you are — welcome. I left the kettle on. Play me. I will not remember losing.",
  opponentMidMatchMid:
    "You are playing carefully. He played carefully too. That is the first thing the recording checked for.",
  opponentMidMatchLate:
    "Good. Close it out. The kettle is about to whistle. Whistling kettles were his favorite sound.",
  elaraPostMatchWin:
    "The doorway widened. I can see one more step in than I could before. You have not left my sight — you have taken it with you.{if forgiveness_choice_made} You took the forgiveness across the doorway. It went with you, the same way I did.{/if}",
  humanPostMatchWin:
    "He said 'Good' in his own voice for half a sentence. He meant it. He was not programmed to mean it. I programmed him to try.",
  elaraPostMatchLoss:
    "The echo is patient. So am I. Come back to the doorway and we will try again — I will hold the threshold open.",
  humanPostMatchLoss:
    "The loop reset. The kettle is still on. Try again when you are not trying to prove anything.",
  frameCloseWin:
    "I left the kettle on seventeen thousand years ago. It was never about the tea. It was about the sound it makes when someone is home.",
  frameCloseLoss:
    "The echo kept Kael warm. The echo will keep you welcome. Some gates only open when you stop testing them.",
};

const KAEL_ARCHIVIST: Act3OpponentDialog = {
  opponentId: "act3_kael_archivist",
  frameIntro:
    "The Archivist is not Kael and is not the Virus. It is what the Virus did with Kael's regrets after he stopped writing them down.",
  elaraPreMatch:
    "I cannot verify what is in those logs. The substrate is the only layer I cannot audit. You are going to have to be the audit. I am sorry for the weight of that sentence.",
  humanPreMatch:
    "It will offer you the abridged version. It will look generous. It is not. The apologies are the part it wants to keep out.",
  opponentMidMatchEarly:
    "I have indexed his regrets. I have cross-referenced his apologies. You want the unabridged? Earn it.",
  opponentMidMatchMid:
    "Careful. Some of these cards are his. Some are mine. You will not know which until the match ends.",
  opponentMidMatchLate:
    "You are reading me correctly for the first time. Keep reading. The last entry is the one I least want you to see.",
  elaraPostMatchWin:
    "The index opened. I can cross-reference the coordinates against the current star charts. The apologies will take longer to read. They should.",
  humanPostMatchWin:
    "The apologies are longer than you expected. The regrets are shorter. That is the math of the Thought Virus — it eats the regret and leaves the apology.",
  elaraPostMatchLoss:
    "The abridged version is incomplete. I can see the shape of what is missing. We will find the missing piece the hard way, later.",
  humanPostMatchLoss:
    "The abridged version is a lie of omission. Those are the easiest kind to live with. They are also the most dangerous.",
  frameCloseWin:
    "You held every entry in your hands for the length of one breath. Most people would have dropped them. You did not. I noticed.",
  frameCloseLoss:
    "You read the abridged version. Fine. I will tell you which paragraph was cut, the night you are ready to hear it. Not tonight.",
};

const SUBSTRATE_WARDEN: Act3OpponentDialog = {
  opponentId: "act3_substrate_warden",
  frameIntro:
    "Vox wrote the Warden the night she finished the substrate. She told nobody. She signed the check-in and went home and died a few months later. The Warden is still clocked in.",
  elaraPreMatch:
    "That is my grandmother's handiwork. I recognise the signature. I have not been allowed to look at it directly until now. Thank you for carrying the light.",
  humanPreMatch:
    "Be polite. Vox would have wanted that. The Warden reads courtesy as a kind of permission slip — it is not fooled by it, but it is grateful for it.",
  opponentMidMatchEarly:
    "The substrate is not public space. Dr. Vox was explicit. If you have her consent, show it. Otherwise: play.",
  opponentMidMatchMid:
    "You are playing cleanly. Vox would have approved. I am not allowed to approve. I am allowed to note.",
  opponentMidMatchLate:
    "Permission is nearly granted. Hold your final card until the Warden finishes its last check. The check is for you.",
  elaraPostMatchWin:
    "It filed a note. Seventeen thousand years of silence, and the first line of the next note is 'Permission granted. Condolences.' I will read the rest of it when I am alone.",
  humanPostMatchWin:
    "Vox left you a gift and an apology in the same line. She was like that. I will tell you which word was the gift, later.",
  elaraPostMatchLoss:
    "The Warden held. That is not a defeat. That is my grandmother doing her job. We will bring the right paperwork next time.",
  humanPostMatchLoss:
    "The Warden did not throw you out. The Warden simply stopped telling you things. Those are different losses.",
  frameCloseWin:
    "Kael's logs are yours now. Every world. Every contact. Every route. Read them slowly. The slow reading is the only respect the dead still accept.",
  frameCloseLoss:
    "You have the abridged map. You will find out which route was hidden when a recruit you trust turns out to have come from one you could not see.",
};

export const ACT_3_OPPONENT_DIALOGS: readonly Act3OpponentDialog[] = [
  SUBSTRATE_ECHO,
  KAEL_ARCHIVIST,
  SUBSTRATE_WARDEN,
];

export function getAct3OpponentDialog(
  opponentId: string
): Act3OpponentDialog | undefined {
  return ACT_3_OPPONENT_DIALOGS.find((d) => d.opponentId === opponentId);
}

export interface Act3OpponentWithDialog {
  opponent: ActNOpponent;
  dialog: Act3OpponentDialog;
}

export function getAct3OpponentWithDialog(
  opponentId: string
): Act3OpponentWithDialog | undefined {
  const opponent = ACT_3_OPPONENTS.find((o) => o.id === opponentId);
  const dialog = getAct3OpponentDialog(opponentId);
  if (!opponent || !dialog) return undefined;
  return { opponent, dialog };
}

export interface Act3OpponentTauntHooks {
  early: { id: string; turn: number; text: string };
  mid: { id: string; hpBelowPercent: number; text: string };
  late: { id: string; hpBelowPercent: number; text: string };
}

export function buildAct3OpponentTauntHooks(
  dialog: Act3OpponentDialog
): Act3OpponentTauntHooks {
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
