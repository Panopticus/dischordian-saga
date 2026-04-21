/**
 * Player Profile — dynamic reveal generation.
 *
 * The three "I see you" reveals in the chess climb dialog
 * ([Tier 1, Tier 2, Tier 3]) are written with PLACEHOLDER
 * specifics (e.g. "thirty-one of forty draws"). At runtime the
 * Game Master should speak REAL specifics drawn from the
 * player's own event log.
 *
 * This module produces those specifics. Each builder function
 * takes a profile snapshot + a recent-events slice and returns
 * one or two ready-to-speak sentences.
 *
 * Every builder tolerates missing data — if the log has no
 * matching events, it returns a generic line appropriate to
 * the reveal rather than throwing. The GM should never fall
 * silent for lack of data; he should simply fall back to the
 * themed generic.
 */

import {
  buildPortraitSentences,
  getProfileBlurb,
  type PlayerProfile,
} from "./playerProfile";

export interface ProfileEventSummary {
  source: string;
  payload: Record<string, unknown> | null;
  createdAt: Date;
}

/* ─── Reveal 1 — Chess Tier 1, mid-series ────────────────────
   Two concrete chess-history facts. In-domain. */

export function buildReveal1Lines(input: {
  profile: PlayerProfile;
  recentEvents: readonly ProfileEventSummary[];
}): readonly string[] {
  const { recentEvents } = input;

  // Count draw-offer decisions specifically.
  const drawsOffered = recentEvents.filter(
    (e) => e.source === "chess_draw_offer_made",
  ).length;
  const drawsDeclined = recentEvents.filter(
    (e) => e.source === "chess_draw_offer_declined",
  ).length;

  const lines: string[] = [];
  if (drawsOffered + drawsDeclined >= 3) {
    lines.push(
      `I notice you have declined ${drawsDeclined} of ${drawsOffered + drawsDeclined} draws offered to you in this universe. That is not a chess style. That is a personality.`,
    );
  } else {
    lines.push(
      "You do not like draws. I notice that. Two of the games in your recent log ended with a decisive result you pushed for; one ended with you accepting draw only because the opponent's clock forced it.",
    );
  }

  // Aggression / mercy summary.
  const agg = getProfileBlurb("aggression", input.profile);
  lines.push(
    `On the board you are ${agg}. That is not a value judgement. It is an observation.`,
  );

  return lines;
}

/* ─── Reveal 2 — Chess Tier 2, post-series ──────────────────
   Two facts from OUTSIDE chess. "You spared the Programmer in
   Act 1. You did not spare me in Game 2." */

export function buildReveal2Lines(input: {
  profile: PlayerProfile;
  recentEvents: readonly ProfileEventSummary[];
}): readonly string[] {
  const { recentEvents, profile } = input;

  // Pull any card-game mercy event.
  const mercyOutsideChess = recentEvents.find(
    (e) =>
      e.source === "card_match_concede_accepted" ||
      (e.source === "card_dialog_choice" &&
        e.payload?.choiceId?.toString().includes("spare")),
  );
  const chessAggression = recentEvents.find(
    (e) =>
      e.source === "chess_draw_offer_declined" ||
      e.source === "chess_resign:winning",
  );

  const lines: string[] = [];
  if (mercyOutsideChess && chessAggression) {
    const who = (mercyOutsideChess.payload?.opponentName as string) ?? "an opponent you outranked";
    lines.push(
      `You spared ${who} in a card battle earlier this season. You did not spare me in Game 2. I am not insulted. I am noting the consistency of your INCONSISTENCY.`,
    );
  } else {
    const mercy = getProfileBlurb("mercy", profile);
    lines.push(
      `You are ${mercy}. The pattern repeats across games I was not in, and games I was. I have been comparing notes.`,
    );
  }

  lines.push(
    "Cross-system consistency is rare. Most players have one style in a board game and another in a dialog tree. You do not. That is interesting.",
  );

  return lines;
}

/* ─── Reveal 3 — Chess Tier 3, post-win ─────────────────────
   The seven-sentence portrait. Delegates to
   buildPortraitSentences and then pairs it with the Engineer's
   (in-world, static) portrait for the "same instrument" beat. */

/** The Engineer's portrait in the same seven-sentence shape.
 *  Static because he has been dead a long time; the numbers do
 *  not move. Used as the counterpoint to the player's portrait
 *  in the Reveal 3 beat.  */
const ENGINEER_PORTRAIT: readonly string[] = Object.freeze([
  "On the board he was fiercely predator.",
  "When the win was his he was clearly ruthless.",
  "When the world offered a question he was fiercely inquisitive.",
  "When a teacher offered a path he was fiercely iconoclast.",
  "When a stranger spoke he was clearly suspicious.",
  "When a friend asked he was quietly guarded.",
  "When the silence opened he was quietly playful.",
]);

export function buildReveal3Lines(input: {
  profile: PlayerProfile;
}): { playerPortrait: readonly string[]; engineerPortrait: readonly string[]; closer: string } {
  return {
    playerPortrait: buildPortraitSentences(input.profile),
    engineerPortrait: ENGINEER_PORTRAIT,
    closer:
      "This is who he was at your age, by the same instrument. You are not him. He is not you. The instrument is the same.",
  };
}
