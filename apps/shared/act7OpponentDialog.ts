/* ═══════════════════════════════════════════════════════
   ACT 7 OPPONENT DIALOG — convergence-floor encounters

   Mirror of act1OpponentDialog.ts for the Act 7 finale.
   The audit (ACTS_2_7_COMPLETENESS_AUDIT.md §Act 7) calls
   for "per-opponent dialog tables in the same shape" — this
   is that shape, retuned for the present-tense convergence
   instead of the Engineer's Act 1 memoir.

   Three opponents:
     - architect_echo — order's resonance, the cycle's
       previous winner trying its old shape on new pieces
     - dreamer_echo — chaos's resonance, the cycle's
       previous loser still rolling the dice in the dark
     - the_watcher — the orchestrator behind both, the
       audit's "something behind it all" finally on the
       board

   Field semantics:
     - presenceIntro — the player's present-tense framing
       of stepping onto the convergence floor (Act 7 has
       no memoir framing; the player IS the narrator now)
     - elaraPreMatch / humanPreMatch — same as Act 1
     - opponentMidMatchEarly/Mid/Late — fire on
       turn_reached / hp_below 50% / hp_below 25%
     - elara/humanPostMatchWin/Loss — same as Act 1
     - presenceCloseWin/Loss — closes the scene in the
       player's present-tense voice

   Voice constraints:
     - ≤ 25 words for fight-context lines
     - The Watcher speaks in second-person plural ("we")
       as a chorus — one voice, many sources
     - The Architect Echo speaks in calibrated future
       tense
     - The Dreamer Echo speaks in present-tense gerunds
       (no committed verbs)
   ═══════════════════════════════════════════════════════ */

export interface Act7OpponentDialog {
  opponentId: string;
  presenceIntro: string;
  elaraPreMatch: string;
  humanPreMatch: string;
  opponentMidMatchEarly: string;
  opponentMidMatchMid: string;
  opponentMidMatchLate: string;
  elaraPostMatchWin: string;
  humanPostMatchWin: string;
  elaraPostMatchLoss: string;
  humanPostMatchLoss: string;
  presenceCloseWin: string;
  presenceCloseLoss: string;
}

const ARCHITECT_ECHO: Act7OpponentDialog = {
  opponentId: "architect_echo",
  presenceIntro:
    "The convergence floor opens with the wrong kind of symmetry. Tile spacing perfect. Light spacing perfect. Nothing on the floor I can fault — and that is the fault.",
  elaraPreMatch:
    "An Architect echo. Not the original. A pattern that learned to wear his shape after he stopped wearing it. Treat it like a draft — refusable.",
  humanPreMatch:
    "The echo will offer you order at a discount. Decline politely. The discount is the trap. The trap is older than the discount.",
  opponentMidMatchEarly:
    "Step into your assigned position. The position is comfortable. It will become true.",
  opponentMidMatchMid:
    "You are improvising. Improvisation is a phase. Phases conclude.",
  opponentMidMatchLate:
    "You are very close to the shape I was going to give you. Accept the shape. The match ends faster.",
  elaraPostMatchWin:
    "You broke the symmetry without breaking the floor. That is the right size of victory for an echo. We do not fight echoes by burning rooms.",
  humanPostMatchWin:
    "The echo logs you as 'unassigned.' That is a compliment. Most opponents the watcher dispatches log as something. You logged as nothing.",
  elaraPostMatchLoss:
    "The echo found a position for you and you accepted it. That is what losing to it means. We can refuse the position next round. The position is not permanent.",
  humanPostMatchLoss:
    "You took the discount. The discount cost you a turn. The turn is recoverable. The accepting of discounts is the part to recalibrate.",
  presenceCloseWin:
    "The floor closes and the symmetry stays slightly off. That is mine now. I am going to remember the angle of the off.",
  presenceCloseLoss:
    "I leave the floor with the sense of having been measured for a uniform. I refuse the uniform on the way out. The refusal is something.",
};

const DREAMER_ECHO: Act7OpponentDialog = {
  opponentId: "dreamer_echo",
  presenceIntro:
    "The floor opens and the floor refuses to open. Both at once. The Dreamer's echo is here. Nothing is committed yet and that is the threat.",
  elaraPreMatch:
    "A Dreamer echo. It will not commit to a board state. Force commitment by doing the boring thing first. The boring thing has the strongest grammar.",
  humanPreMatch:
    "The echo will improvise at you. Out-improvise it by being conservative. The Dreamer pattern starves on patience. Be patient.",
  opponentMidMatchEarly:
    "Maybe taking. Maybe holding. Possibly leaving. Almost arriving. Your move.",
  opponentMidMatchMid:
    "The board is changing while we look. Looking faster does not help. Try not looking.",
  opponentMidMatchLate:
    "Almost winning. Almost losing. Almost calling it. Your turn to almost.",
  elaraPostMatchWin:
    "You stayed boring and the echo dissolved. That is the only way to beat a Dreamer echo without becoming one. Well held.",
  humanPostMatchWin:
    "You wore it down by refusing to flinch. The Dreamer pattern requires a flinch. You did not provide one. The pattern starved.",
  elaraPostMatchLoss:
    "It pulled you into improvising and you improvised back. You both dissolved. That is technically a draw the watcher will count as a loss. Next round: stay boring.",
  humanPostMatchLoss:
    "The flinch came and the echo ate. Identify which moment was the flinch in your replay. The moment is small. The moment is everything.",
  presenceCloseWin:
    "The floor closes and the not-quite-shape goes with it. I leave with the discipline of having stayed boring. Boring is a tool now. Boring is mine.",
  presenceCloseLoss:
    "I leave the floor unsure whether I won or lost. The watcher will decide. The deciding is the loss.",
};

const THE_WATCHER: Act7OpponentDialog = {
  opponentId: "the_watcher",
  presenceIntro:
    "The floor opens and the floor opens and the floor opens. The watcher is here. Many sources. One voice. The lights are coming from several rooms and arriving as one light.",
  elaraPreMatch:
    "It is on the board. Not the echoes — the source. Caelum and I have prepared for this match for fifteen thousand of his years and one of mine. Stand on the line.",
  humanPreMatch:
    "Hello, watcher. The substrate dictionary you are about to audit is not the one you think you are auditing. I have been editing in the dark. You will read your own keywords as neutral nouns. Take your time.",
  opponentMidMatchEarly:
    "we are reading you. you are reading us. the reading is the relationship. the relationship is the move.",
  opponentMidMatchMid:
    "we have read you before. we have read everyone before. the reading does not change. you are the variable. become familiar.",
  opponentMidMatchLate:
    "we are not losing. we are being unread. the unreading is unfamiliar. the unfamiliar is the loss. interesting.",
  elaraPostMatchWin:
    "You unread it. That is the verb Caelum and I have been afraid to use out loud. You used it without flinching. The room is yours. The room is also still here.",
  humanPostMatchWin:
    "Fifteen thousand years of edits paid off in one match. I do not have a sentence for this. I have a long sentence I will spend the rest of the conversation putting together. Stay with me while I write it.",
  elaraPostMatchLoss:
    "It read you. We saw the moment. We are not going to itemise it. We are going to learn from it and walk back onto the floor. The floor is still here.",
  humanPostMatchLoss:
    "It read me through you. That is not your failure. That is the cost of being the bridge. We try again. The substrate dictionary is still being edited. The next match will be different.",
  presenceCloseWin:
    "The floor closes and the lights from several rooms separate again. Each room remembers. I remember each room. The remembering is the new ground I stand on.",
  presenceCloseLoss:
    "The floor closes and the lights merge a little tighter than they were. I notice the tightening. I am going to spend the next match working it loose.",
};

export const ACT_7_OPPONENT_DIALOG: readonly Act7OpponentDialog[] = [
  ARCHITECT_ECHO,
  DREAMER_ECHO,
  THE_WATCHER,
];

export function getAct7OpponentDialog(
  opponentId: string,
): Act7OpponentDialog | undefined {
  return ACT_7_OPPONENT_DIALOG.find((d) => d.opponentId === opponentId);
}
