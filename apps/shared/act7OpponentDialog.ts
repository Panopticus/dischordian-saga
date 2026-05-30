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
    "You played every version of yourself out in one match. I watched you remember all of them. I am going to file the match. Nothing about it is going to be lost to the long memory.{if forgiveness_choice_made} The version of you who forgave someone in Cycle A was in the deck too. I saw that card land. It is still the one I am proudest of.{/if}",
  humanPostMatchWin:
    "The silhouette resolved into your army, then into Warlord Zero's first stance, then into nothing. That is the shape of the cover. Well played.",
  elaraPostMatchLoss:
    "You lost to your own history. That is a survivable loss. We will play the match again after sleep. The history will be patient. Histories are.",
  humanPostMatchLoss:
    "You are allowed to lose to your past. Nobody ever got out of one. What matters is that the past looked at you and did not win by more than it needed to.",
  frameCloseWin:
    "You carried every one of them across the match. I saw the Engineer. I saw the Detective at his desk. I saw the version of me who handed you a staff on the bridge. Thank you for bringing us all.{if vortex_endgame_light_variant} Every silhouette in that deck leaned toward the light at the end. That was you. That was the whole of you, leaning.{/if}{if vortex_endgame_dark_variant} Every silhouette in that deck carried a shadow at the end. I am not going to pretend it was someone else's. It was yours. I narrated it anyway.{/if}",
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
    "The shadow thinned. The Watcher's actual presence registered for one heartbeat on Elara's sensors, and then withdrew, bored. We bought the cover another Act. Exhale. Slowly.{if human_dark_confession_unlocked} You know what the Watcher is to me now. You heard me say it. Boring it tonight cost you nothing and cost me everything, and you let me pay quietly. Thank you.{/if}",
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
    "That was the correct laugh. I have not heard it in seventeen thousand years. I am going to sit down for a minute. In the substrate, that means I am going to dim.{if kael_questline_complete} You did the slow work with Kael already. That is the only reason the construct could not hold his laugh. You unhooked it before tonight. Tonight just proved it.{/if}",
  elaraPostMatchLoss:
    "It kept him on. We will play it again. Next time, I will help with the scanning. I promise. I should have been helping this time. I am sorry.",
  humanPostMatchLoss:
    "It asked if you wanted to play again, in a voice I could not tell apart from his. Do not answer that question yet. Come find me first.",
  frameCloseWin:
    "[KAEL SIGNATURE — RESOLVED — CONTAMINATION INDEX: ZERO]\n\nThe Ark files a single line in the longest-running log: 'Patient Zero, released.' The log is seventeen thousand years old. The line is new.",
  frameCloseLoss:
    "[KAEL SIGNATURE — UNRESOLVED — CONTAMINATION INDEX: DORMANT]\n\nThe Ark does not log this loss. Losses to the jacket are not filed. They are carried. Both narrators are carrying it tonight.",
};

/* The former THE_CONVERGENCE_SEAT block was removed in the
 * 2026-05-10 Phase 9 rename. The Oracle/Meme dual final form
 * (THE_ORACLE_MEME_DIALOG below, opponentId
 * `act7_oracle_meme_final`) now serves as the saga-final dialog
 * — the Convergence Seat IS the Oracle/Meme. The dialog count
 * stays at 5 (was 6 in the cherry-picked commit; was 4 before
 * Phase 8+9). */

/* ── SCAFFOLD dialog (Phase 8, 2026-05-10) — bible §3.16.
 *    Voicing: the Dreamer in dual frame (both Elara + Human
 *    narrate; the Dreamer never claims a frame voice).
 *    Writer review before ship. */
const THE_DREAMER_DIALOG: Act7OpponentDialog = {
  opponentId: "act7_the_dreamer",
  frameSpeaker: "dual",
  frameIntro:
    "Both of us are going to narrate this one. Not because we agree — because the Dreamer is a tableau, and a tableau needs more than one voice to render. We will alternate. Try not to listen for which of us is which.",
  elaraPreMatch:
    "My sensors do not have a profile for the Dreamer. They have a place where a profile would go. That place is currently full. I cannot tell you what is in it.",
  humanPreMatch:
    "I have been told, by people I trust, that the Dreamer arrives when the community wins enough small kindnesses to make the universe notice. The community has been winning. Play.",
  opponentMidMatchEarly:
    "I am the dream you let yourselves have. I came because enough of you wanted me to. Play. I will not remember winning.",
  opponentMidMatchMid:
    "That card is one I have not seen played in this combination. The Dreamer notices the combination. The Dreamer does not remember it.",
  opponentMidMatchLate:
    "Finish the hand. I will not be here when the hand is finished. That is the point of dreams.",
  elaraPostMatchWin:
    "The tableau folded. There is no log entry. There is, however, a softening across the community sensors. I am going to credit you with the softening. You will not be able to point to it later.",
  humanPostMatchWin:
    "You played a dream and did not wake it up. That is the only way to play one. Thank you.{if act_6_complete} The Dreamer only arrives when enough small kindnesses stack up to bend the universe. Everything you closed through Act 6 is in that stack. You built the conditions for this without knowing it.{/if}",
  elaraPostMatchLoss:
    "The Dreamer did not win. The Dreamer waited. The match ended without a verdict. We will play again when you have rested.",
  humanPostMatchLoss:
    "Dreams do not lose. Dreams pause. The pause is not a loss. Take the pause as instruction.",
  frameCloseWin:
    "The Ark's sensors return to ordinary readings. The Dreamer leaves no log. The community, somewhere, registers a softening that nobody can attribute to a specific event. We will keep that quiet on your behalf.",
  frameCloseLoss:
    "The dream will be patient. Dreams are. We will set the table again when you are ready, and the Dreamer will arrive, and the match will resume from the place it paused.",
};

/* ── SCAFFOLD dialog (Phase 9, 2026-05-10) — bible §3.17.
 *    Voicing: Oracle/Meme dual final form. Voice register
 *    intentionally OSCILLATES line-by-line between Oracle (high
 *    register, mythic distance) and Meme (low register, refusing
 *    distance) to match the bible's "ambiguous final form".
 *    Writer review before ship: this single dialog block is
 *    alignment-agnostic; future PR can branch text on
 *    oracle_alignment vs meme_alignment flags once those are
 *    defined. */
const THE_ORACLE_MEME_DIALOG: Act7OpponentDialog = {
  opponentId: "act7_oracle_meme_final",
  frameSpeaker: "system",
  frameIntro:
    "The face that arrives at the table is the face the previous six acts decided you needed. Neither of us is going to tell you which. Both of us hope you can already see.",
  elaraPreMatch:
    "I prepared two briefings. I am going to leave them both on the table, in case the face changes mid-match. Sometimes it does. Sometimes the briefings are interchangeable.",
  humanPreMatch:
    "I have played both of them in different cycles. They play the same hand differently. Tonight you will only see one. Be honest about which one you wanted.",
  opponentMidMatchEarly:
    "I have been waiting for one of two of you. You arrived. You were the expected one. Play. No pretense from me.",
  opponentMidMatchMid:
    "(Oracle.) The card was prophesied seventeen thousand years ago. (Meme.) The prophecy was a joke. The joke was the prophecy. Play.",
  opponentMidMatchLate:
    "Finish the hand. The face holds one beat, then changes. You should know what it changes to. If not, the change tells you.",
  elaraPostMatchWin:
    "You closed the seven acts on the face you earned. I am not going to tell you which face. I am going to tell you it was the right one. You will know later that I am right.{if act6_elara_confession_heard} You heard what I confessed before the convergence. The face you earned tonight knows it too. I am glad you carried it in instead of leaving it at the door.{/if}",
  humanPostMatchWin:
    "Both faces get the credit. That is the courtesy. The credits will, in fact, name both. Live with the ambiguity. The ambiguity is the prize.{if act6_human_confession_heard} You let me finish the confession back in Act 6. I have wondered, every cycle since, whether you would. Tonight is the answer. Both faces saw you choose to stay.{/if}",
  elaraPostMatchLoss:
    "Both faces wait. Neither gloats. The match restarts when you do. I will be at the table either way. So will the other one.",
  humanPostMatchLoss:
    "You are allowed to lose to the saga's last face. That is, on average, what happens. Try again in the morning. The face will be different. Not the meaning — the face.",
  frameCloseWin:
    "The face holds — Oracle or Meme, depending on you — and then resolves into the other for one frame, as a courtesy. The seven acts close on the resolution. The credits, when they come, name both.{if vortex_endgame_light_variant} It settles, at the last, on the lighter of the two faces. You spent seven acts earning which one it would be. It remembers.{/if}{if vortex_endgame_dark_variant} It settles, at the last, on the darker of the two faces. It is not a punishment. It is a mirror. You spent seven acts earning the reflection.{/if}",
  frameCloseLoss:
    "The face says the same line in two voices at once: 'Come back. The other face will be waiting too.' The match restarts when you do.",
};

export const ACT_7_OPPONENT_DIALOGS: readonly Act7OpponentDialog[] = [
  THE_VISIBLE_WAR,
  THE_WATCHERS_SHADOW,
  PATIENT_ZERO_REBORN,
  THE_ORACLE_MEME_DIALOG,
  THE_DREAMER_DIALOG,
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
