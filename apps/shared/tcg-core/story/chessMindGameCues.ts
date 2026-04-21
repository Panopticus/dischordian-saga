/**
 * Chess Mind-Game Cues — per-trigger GM lines + archetype replies.
 *
 * The trigger detector in `apps/shared/chessMindGameTriggers.ts`
 * decides WHICH cue fires; this module owns the ACTUAL TEXT the
 * GM speaks and the archetype-based replies he makes to the
 * player's timed choice.
 *
 * Structure per trigger:
 *   - `prompt`: what the GM says that opens the cue
 *   - `choices`: 3 archetype options the player can pick (silent
 *     is always implicit — no UI slot)
 *   - `replies`: an archetype → reply-line map keyed off the
 *     player's choice. Silent has its own entry.
 *
 * Each cue pulls one paired citation (real + lore) via
 * `pairQuotes(theme)` — the theme is trigger-appropriate.
 */

import type { MindGameTriggerId, MindGameArchetype } from "../../chessMindGameTriggers";
import {
  pairQuotes,
  formatPairedCitation,
  type QuoteTheme,
} from "./chessQuoteCanon";

export interface MindGameChoice {
  id: string;
  archetype: MindGameArchetype;
  /** Label the player sees on the timed-choice UI. ≤ 60 chars. */
  label: string;
}

export interface MindGameCue {
  trigger: MindGameTriggerId;
  theme: QuoteTheme;
  /** Base prompt text the GM speaks as the cue opens. */
  prompt: string;
  choices: readonly MindGameChoice[];
  /** Archetype → reply line. Every archetype listed in `choices`
   *  MUST have a reply. `silent` is always present too. */
  replies: Readonly<Record<MindGameArchetype, string>>;
}

/* ═══════════════════════════════════════════════════════
   TRIGGER: first_non_book_move
   The player has just played their first move outside the
   opening book. The GM notices.
   ═══════════════════════════════════════════════════════ */

const CUE_FIRST_NON_BOOK: MindGameCue = {
  trigger: "first_non_book_move",
  theme: "preparation",
  prompt:
    "Already thinking. Good. Most of them play the first ten moves the way you breathe — without noticing. You just chose one. Did you mean to?",
  choices: [
    {
      id: "first_non_book_defiant",
      archetype: "defiant",
      label: "Of course I meant to.",
    },
    {
      id: "first_non_book_curious",
      archetype: "curious",
      label: "What would you have played?",
    },
    {
      id: "first_non_book_philosophical",
      archetype: "philosophical",
      label: "Meaning is for the end of the game.",
    },
  ],
  replies: {
    defiant:
      "Then stand behind it. The move wasn't book but it wasn't wrong. Standing behind it matters more than whether it was correct.",
    curious:
      "I would have played the book move. I have played the book move several thousand times. Your move is more interesting. Teach it to me.",
    philosophical:
      "A theory you can defend for the next thirty moves. Good. I'll hold you to it.",
    mocking:
      "The hustle works better when the move is stronger. File this one under 'attitude'. We'll see.",
    vulnerable:
      "Honest. The first step to a good move is admitting it was a guess. Go.",
    silent:
      "Fine. You do not owe me a reason. I was curious, not interrogating.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: tempo_loss
   Player lost 60-200 centipawns on this move. Pair with
   deception (Sun Tzu / Iron Lion).
   ═══════════════════════════════════════════════════════ */

const CUE_TEMPO_LOSS: MindGameCue = {
  trigger: "tempo_loss",
  theme: "deception",
  prompt:
    "You just deceived yourself. Not catastrophic, just — measurably. Did you mean to?",
  choices: [
    {
      id: "tempo_loss_defiant",
      archetype: "defiant",
      label: "It was a deliberate sacrifice.",
    },
    {
      id: "tempo_loss_vulnerable",
      archetype: "vulnerable",
      label: "I didn't see it.",
    },
    {
      id: "tempo_loss_mocking",
      archetype: "mocking",
      label: "My worst is still winning this.",
    },
  ],
  replies: {
    defiant:
      "Then the sacrifice has to pay off in the next six moves. Clock's running. Find the follow-up.",
    curious:
      "If you did not mean to, the useful thing is NOTICING that you did not mean to. Noticing is the skill.",
    philosophical:
      "Every move has a hidden cost. You just paid one. Now ask what you bought with it.",
    mocking:
      "Confidence is a stance. Winning is a position. Keep the stance and find the position. Both. Together.",
    vulnerable:
      "Good. Say that next time BEFORE you move. It will save you ten rating points a session.",
    silent: "Noted.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: strong_tactic_found
   Player found a move that gained 80+ centipawns.
   ═══════════════════════════════════════════════════════ */

const CUE_STRONG_TACTIC: MindGameCue = {
  trigger: "strong_tactic_found",
  theme: "sacrifice",
  prompt:
    "Tal would have liked that. So did the Engineer, the day he beat me. Are you measuring yourself against him, or against me?",
  choices: [
    {
      id: "strong_tactic_defiant",
      archetype: "defiant",
      label: "Against both of you.",
    },
    {
      id: "strong_tactic_philosophical",
      archetype: "philosophical",
      label: "Against yesterday's me.",
    },
    {
      id: "strong_tactic_vulnerable",
      archetype: "vulnerable",
      label: "I don't know yet.",
    },
  ],
  replies: {
    defiant:
      "Then you will need three more moves like that one. He made forty before I resigned. You are on move one.",
    curious:
      "A good answer. The Engineer never told me who he measured himself against. I think that was the secret.",
    philosophical:
      "That is the right answer and the hardest one. Yesterday's you is a moving target. Good.",
    mocking:
      "Against me is a lot of me to be against. I will take it as a compliment while I recalculate.",
    vulnerable:
      "Honest. That's the shape of the student who becomes dangerous later. Keep not knowing. It's working.",
    silent:
      "You held the move without holding a reason. That is either very good or very stupid. We will find out.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: time_burn
   Player thought for > 2 minutes on a single move.
   ═══════════════════════════════════════════════════════ */

const CUE_TIME_BURN: MindGameCue = {
  trigger: "time_burn",
  theme: "patience",
  prompt:
    "The clock is part of the game. Capablanca played one move in two seconds, then sat for an hour. Both moves were the same move. What are you doing with the time?",
  choices: [
    {
      id: "time_burn_curious",
      archetype: "curious",
      label: "Counting the variations.",
    },
    {
      id: "time_burn_philosophical",
      archetype: "philosophical",
      label: "Waiting for the move to arrive.",
    },
    {
      id: "time_burn_vulnerable",
      archetype: "vulnerable",
      label: "I'm nervous.",
    },
  ],
  replies: {
    defiant:
      "Defiance in a time trouble is the most expensive thing you can buy. Move.",
    curious:
      "If you've counted for two minutes and still do not know, you have already calculated past the honest answer. Pick the move you had at thirty seconds.",
    philosophical:
      "Then wait. Patience is free until it costs you the game. Watch the clock.",
    mocking:
      "Burning clock on the GM is a flex. I don't hate it. Burn the next one too and we'll see if the flex was a strategy.",
    vulnerable:
      "Then breathe. The board will wait thirty seconds longer than you think.",
    silent:
      "You chose not to tell me. Fine. The clock is still running. It does not care.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: opponent_in_trouble
   GM's evaluation is -200cp or worse.
   ═══════════════════════════════════════════════════════ */

const CUE_OPPONENT_IN_TROUBLE: MindGameCue = {
  trigger: "opponent_in_trouble",
  theme: "mercy",
  prompt:
    "I am behind. This is rare. I am curious whether you intend to convert, or whether you are about to be polite.",
  choices: [
    {
      id: "opponent_trouble_defiant",
      archetype: "defiant",
      label: "I'm going to convert.",
    },
    {
      id: "opponent_trouble_vulnerable",
      archetype: "vulnerable",
      label: "I offer a draw.",
    },
    {
      id: "opponent_trouble_mocking",
      archetype: "mocking",
      label: "Politeness is for later.",
    },
  ],
  replies: {
    defiant:
      "Good. The worst thing you can do to me right now is flinch. Do not flinch.",
    curious:
      "I will tell you what politeness looks like from this side of the board: it looks exactly the same as a mistake. Convert.",
    philosophical:
      "Mercy is what the winner offers after the losing player has already taught them something. I have not taught you anything yet. Carry on.",
    mocking:
      "I like this version of you. Keep it. Later, you can be merciful. Not today.",
    vulnerable:
      "Offering a draw from a winning position is a real thing. I decline it. But thank you. It was genuine.",
    silent:
      "No words. Just the position. Good. The position is talking for you.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: player_blundered
   Player dropped 200+ centipawns on their last move.
   ═══════════════════════════════════════════════════════ */

const CUE_PLAYER_BLUNDER: MindGameCue = {
  trigger: "player_blundered",
  theme: "restraint",
  prompt:
    "Mistakes are the most honest thing you do at this board. Show me the next one.",
  choices: [
    {
      id: "player_blunder_defiant",
      archetype: "defiant",
      label: "I'll find the follow-up.",
    },
    {
      id: "player_blunder_vulnerable",
      archetype: "vulnerable",
      label: "That was bad.",
    },
    {
      id: "player_blunder_philosophical",
      archetype: "philosophical",
      label: "The position wasn't what I thought.",
    },
  ],
  replies: {
    defiant:
      "Then find it. Every blunder has a compensation if you keep playing. Not always enough. Sometimes enough. Find out.",
    curious:
      "What were you looking at when it felt right? That is the lesson the blunder is teaching. Listen.",
    philosophical:
      "Agreed. The position is always what it is and never what you thought. Adjust.",
    mocking:
      "Self-awareness helps. Recovery helps more. Recover.",
    vulnerable:
      "It was. It is survivable. I have made worse. Ask me about it sometime.",
    silent:
      "You already know. Good. Silence is the correct response to a bad move when you know it was bad.",
  },
};

/* ═══════════════════════════════════════════════════════
   TRIGGER: mid_series_offer
   Between games of a climb best-of-3 at Tier 1+, the GM
   offers a way out of the climb.
   ═══════════════════════════════════════════════════════ */

const CUE_MID_SERIES: MindGameCue = {
  trigger: "mid_series_offer",
  theme: "deception",
  prompt:
    "Mid-series offer, per the Architect's policy. Step down from the climb now and I keep whatever you've already won. I will not judge you — that is not in my contract.",
  choices: [
    {
      id: "mid_series_defiant",
      archetype: "defiant",
      label: "Decline. Play the next game.",
    },
    {
      id: "mid_series_curious",
      archetype: "curious",
      label: "What's the catch?",
    },
    {
      id: "mid_series_mocking",
      archetype: "mocking",
      label: "Is the Architect watching?",
    },
  ],
  replies: {
    defiant: "Good. The offer expires. The game does not.",
    curious:
      "The catch is that once you accept, the door closes for twenty-four hours. You have time to decide. But not a lot of it.",
    philosophical:
      "Philosophy makes the offer easier to decline. Dangerous. I will respect it.",
    mocking:
      "Probably. He watches most games. He does not watch the ones he already knows the outcome of, which is a tell I am handing you for free.",
    vulnerable:
      "Then take the exit. No shame. Tier 0 is still open. Come back when you want to.",
    silent:
      "No answer is an answer. We play the next game. Take your seat.",
  },
};

/* ═══════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════ */

const ALL_CUES: readonly MindGameCue[] = Object.freeze([
  CUE_FIRST_NON_BOOK,
  CUE_TEMPO_LOSS,
  CUE_STRONG_TACTIC,
  CUE_TIME_BURN,
  CUE_OPPONENT_IN_TROUBLE,
  CUE_PLAYER_BLUNDER,
  CUE_MID_SERIES,
]);

export function getMindGameCueForTrigger(
  trigger: MindGameTriggerId,
): MindGameCue | undefined {
  return ALL_CUES.find((c) => c.trigger === trigger);
}

export function getAllMindGameCues(): readonly MindGameCue[] {
  return ALL_CUES;
}

/** Build a fully-assembled GM opening line for a cue, including
 *  the paired citation. The seed argument (a stable match id or
 *  cue-match concatenation) makes the pairing deterministic. */
export function assembleCuePrompt(
  cue: MindGameCue,
  seed: string,
): string {
  const pair = pairQuotes(cue.theme, seed);
  const citation = formatPairedCitation(pair);
  return `${cue.prompt}\n\n${citation}`;
}
