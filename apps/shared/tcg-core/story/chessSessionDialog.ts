/**
 * Chess Session Dialog — moments around a single match that
 * aren't covered by the gates, climb tiers, or mid-game mind
 * game cues. Things that happen at the edges of the match
 * itself: resignation, draw offers, opening a daily session,
 * hitting a puzzle streak milestone, returning to the chamber
 * after a long absence.
 *
 * Selection is deterministic from a seed (game id, date key,
 * or streak length) so a given moment shows the same line on
 * re-visit.
 *
 * Voice: Celebration GM unless the moment is explicitly
 * Arena-tinted (the corrupted version handles cocky resign
 * banter when fighting the Arena GM at game_master mode).
 */

/* ═══════════════════════════════════════════════════════
   RESIGNATION — player resigns mid-game.
   Tone bands: GRACEFUL (loss after a clean game) vs.
   PREMATURE (the player resigned a position the GM
   considers still playable). The renderer picks based on
   eval delta at the moment of resignation: a position
   within ~250 cp of equal is PREMATURE; worse than -800
   cp is GRACEFUL.
   ═══════════════════════════════════════════════════════ */

const RESIGN_GRACEFUL_LINES: readonly string[] = Object.freeze([
  "Resignation accepted. The position was lost, you saw it lost, and you stopped pretending it wasn't. That is the second hardest skill in chess. The hardest is winning. Come back tomorrow.",
  "You resigned cleanly. No counterplay attempts, no swindles, no pretending the queen sacrifice was deliberate. I respect that more than the swindle that almost works. Same time tomorrow?",
  "Good resignation. Most players hold on for another six moves, prove the loss to the engine that already knew, and then resent the engine. You stopped at the right move. That habit is worth fifty rating points.",
  "Resigned. The position was three pieces past saving and you noticed. Noticing is a SKILL. Most beginners cannot resign because they cannot see that the game is over; you can. Note the muscle. Use it.",
]);

const RESIGN_PREMATURE_LINES: readonly string[] = Object.freeze([
  "Resignation accepted, but I have to be honest with you — that position was still playable. The eval was about negative two pawns. I have seen worse positions become wins. Replay the last six moves and look for the survival resource. It is there.",
  "You resigned a difficult position, not a lost one. It happens. Tilt is real and tilt is fixable. The exercise for next time: when you feel the urge to resign, sit on your hands for ninety seconds and look for ONE counterplay idea. There usually is one. Today there was.",
  "Premature resignation. I am not lecturing — I am noting. Players in your bracket resign roughly twice as often as the position warrants. The cure is patience. The cure is also losing-on-the-board sometimes, because losing-on-the-board teaches what almost-losing felt like.",
  "You stopped before the position did. The eval bar dipped, your spirits dipped harder, and you offered me the handshake before I had earned it. Replay it. Find the move that says 'still here'. The move exists in the position you resigned.",
]);

/** Pick a resignation line based on the position's eval at the
 *  moment of resignation. `evalCpFromPlayer` is the engine eval
 *  in centipawns relative to the player (negative = player worse). */
export function pickResignationLine(
  evalCpFromPlayer: number,
  seed: number,
): string {
  const isGraceful = evalCpFromPlayer <= -800;
  const lines = isGraceful ? RESIGN_GRACEFUL_LINES : RESIGN_PREMATURE_LINES;
  const index = Math.abs(Math.floor(seed)) % lines.length;
  return lines[index];
}

/* ═══════════════════════════════════════════════════════
   OPPONENT RESIGNS — the GM (or remote opponent) resigns.
   Read by the Celebration GM after the player wins by
   resignation in a tutor-mode match.
   ═══════════════════════════════════════════════════════ */

const OPPONENT_RESIGNS_LINES: readonly string[] = Object.freeze([
  "I resign. The position is past saving and there is no point making you find the mate when you have already proven you would. The handshake is real. The win is recorded. Well played.",
  "I tip my king. You found the move I was relying on you not to find — and then the move after that, which I had not even calculated. That is rare in this room. Note the moment.",
  "Resignation from across the table. You had me five ply before I admitted it; I held out for the satisfaction of confirming the variation in my head. The variation confirms. The variation says you win. Take it.",
  "I am resigning. Conventional courtesy: I tell you why. You would have queened the d-pawn in four moves; I had no defender that could stop it; my counterplay on the kingside was a tempo too slow. The arithmetic is yours. Congratulations.",
]);

export function pickOpponentResignLine(seed: number): string {
  const index = Math.abs(Math.floor(seed)) % OPPONENT_RESIGNS_LINES.length;
  return OPPONENT_RESIGNS_LINES[index];
}

/* ═══════════════════════════════════════════════════════
   DRAW OFFERS — the four shapes a draw offer can take.
   Player-offer accepted, player-offer declined, GM-offer
   incoming, and the post-draw line for any draw outcome.
   ═══════════════════════════════════════════════════════ */

const DRAW_PLAYER_OFFERS_GM_DECLINES: readonly string[] = Object.freeze([
  "Draw offer noted. Declined. Not because I cannot draw — I can — but because the position is not yet a draw, and I owe you the honest reading. Play on.",
  "I decline the draw. The arithmetic on the board still has a winner and a loser hiding in it. Force one of us to find which. If you are confident the position is drawn, you can prove it by holding it. I am hoping you can.",
  "Decline. The Architect's audit log records draw offers, in case you were wondering. He prefers contestants who play it out. I do not work for him in this register, but the habit of playing it out is good chess regardless.",
]);

const DRAW_PLAYER_OFFERS_GM_ACCEPTS: readonly string[] = Object.freeze([
  "Accepted. The position was a textbook draw — opposite-coloured bishops, equal pawns, no breakthrough on either wing. Calling it a draw is the correct evaluation, and I respect a draw offered from the correct evaluation.",
  "I take the draw. You read the position the way a strong player reads it: even, drawable, not worth the next forty minutes of pretending one of us could win. Half a point each. Until next time.",
  "Draw accepted. Capablanca said the supreme art of war is to subdue the enemy without fighting. He was paraphrasing Sun Tzu. The draw is the version of that art where neither of us was the enemy.",
]);

const DRAW_GM_OFFERS: readonly string[] = Object.freeze([
  "I offer a draw. The position is balanced, the clocks are even, and there is no sharp line either of us can take that does not lose to a defender's resource. You can accept, or you can play the position and prove me wrong. Either is acceptable.",
  "Draw offer from this side. I see no win and I see no loss. You may see something I do not — please, prove it on the board if so. I am not insulted by a refusal.",
  "I offer the half point. The position is dead-even. Most of the next thirty moves are technique, and the technique converges on draw. Accept and we go home; decline and we play the technique. Your call.",
]);

const DRAW_OUTCOME_LINES: readonly string[] = Object.freeze([
  "Draw. Half a point each. The position said draw and we agreed with it. Most chess games at high level end this way; the games people remember are the exceptions, not the rule.",
  "Drawn. The board did not yield a winner because there was no winner to find. That is a real result, not a failure of nerve. The next game starts with a fresh half point shortfall and the same intensity.",
  "Half a point. Bigger than zero, smaller than one, exactly equal to honest. We will play again.",
]);

export function pickPlayerDrawOfferDeclineLine(seed: number): string {
  const lines = DRAW_PLAYER_OFFERS_GM_DECLINES;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

export function pickPlayerDrawOfferAcceptLine(seed: number): string {
  const lines = DRAW_PLAYER_OFFERS_GM_ACCEPTS;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

export function pickGmDrawOfferLine(seed: number): string {
  const lines = DRAW_GM_OFFERS;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

export function pickDrawOutcomeLine(seed: number): string {
  const lines = DRAW_OUTCOME_LINES;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}

/* ═══════════════════════════════════════════════════════
   PUZZLE STREAK MILESTONES — fires once per milestone
   reached in the daily Puzzle of the Day. Tiers:
     3 days   → "noticing the discipline"
     7 days   → "first week"
     14 days  → "fortnight" (halfway to the keepsake)
     30 days  → "monthly streak — Engineer-tier"
     100 days → "hundred-day streak — Oracle-tier"
   Any longer streak repeats the 100-day line for now.
   ═══════════════════════════════════════════════════════ */

export const STREAK_MILESTONES = [3, 7, 14, 30, 100] as const;
export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

const STREAK_LINES: Readonly<Record<StreakMilestone, readonly string[]>> =
  Object.freeze({
    3: [
      "Three days in a row. The discipline is starting to feel like a routine. Routines are the cheap part of mastery; the expensive part is the moments when the routine wants to lapse and you keep going. You have done the cheap part. The expensive part is in your future.",
      "Three-day streak. Most people stop here. You did not. Note the muscle. Feed it.",
    ],
    7: [
      "First week. Seven puzzles, seven themes — by chance you have probably seen at least four of the named tactical patterns in Gate 5. Your eye is starting to find them on its own. That eye is the actual reward for daily puzzle work; the streak counter is just bookkeeping.",
      "A full week of puzzles. The Engineer kept his daily puzzle streak going for fourteen years before the Architect interrupted his calendar. Seven days is a fine first chapter of that habit.",
    ],
    14: [
      "Fourteen days. Half a month. You are halfway to the Engineer's bookmark — at thirty he had decided the daily puzzle was a personality trait, not a hobby. You are starting to look like that kind of person.",
      "Two weeks of puzzles. Most chess habits die in the second week because the first week was a novelty and the third week is the real practice. You are in the second week. This is the dangerous one. Continue.",
    ],
    30: [
      "Thirty days. Engineer-tier streak. The Engineer kept a streak of thirty days at four points in his life and he counted them in his memoir as the most important time he ever spent on chess. I am giving you a memory resin entry to mark this — it will appear in your inventory as 'Thirty Days at the Board'. Do not lose the streak today. Do not lose it tomorrow either. The shape of the habit is the reward.",
      "A monthly streak. The number stops mattering past thirty — what matters is that you proved to yourself you can do the thing daily for a month. That is a different person than the one who started. The new person plays better chess. Welcome them.",
    ],
    100: [
      "One hundred days. The Oracle had a hundred-day puzzle streak the year she went missing, and the missing year is also the year she made the predictions that survived the Architect's editing. There is something about the discipline of the hundredth day that other days do not have. I will not name it; you will know it when you finish today's puzzle. A keepsake has been added to your inventory: 'The Oracle's Notebook, Re-bound'.",
      "Hundred-day streak. There is a chair in this chamber that has only ever been sat in by students who reached this milestone. Sit in it. Solve today's puzzle. Then go home and do the same thing tomorrow.",
    ],
  });

export function pickStreakMilestoneLine(
  streakDays: number,
  seed: number,
): string | undefined {
  // Pick the largest milestone that has been REACHED.
  const reached = [...STREAK_MILESTONES]
    .reverse()
    .find((m) => streakDays >= m);
  if (!reached) return undefined;
  if (streakDays === reached) {
    const lines = STREAK_LINES[reached];
    return lines[Math.abs(Math.floor(seed)) % lines.length];
  }
  // Past the milestone but not on it — return undefined so the
  // UI can stay quiet on intervening days.
  return undefined;
}

/* ═══════════════════════════════════════════════════════
   DAILY WELCOME — fires the first time the player loads
   any chess page in a calendar day. Tone bands track
   absence length: SAME_DAY (no welcome), FRESH (1 day),
   BACK (2-6 days), RETURNING (7-29 days), LONG_GONE (30+).
   ═══════════════════════════════════════════════════════ */

export type DailyWelcomeBand =
  | "fresh"
  | "back"
  | "returning"
  | "long_gone";

const WELCOME_FRESH: readonly string[] = Object.freeze([
  "Back at the table. Yesterday's lesson is still warm. Pick up where we left off.",
  "Daily classroom open. The board is set, the chair is warm, the kettle has not boiled but the kettle is rarely needed. Begin.",
  "Good. You came back. Most students come back exactly once. You are now better than most students.",
]);

const WELCOME_BACK: readonly string[] = Object.freeze([
  "A few days. The board has been waiting; it does not mind. Where were we — Gate 4? Climb tier 1? Today's puzzle? Pick the door and walk through it.",
  "Welcome back. Three days, four — I lost count. You did not lose your eye for the position; the eye does not corrode that fast. Sit.",
  "It has been a few days. The chamber holds the position you left it in. We can resume, or we can start a new game, or we can just talk about the game you were thinking about while you were away. Your choice.",
]);

const WELCOME_RETURNING: readonly string[] = Object.freeze([
  "It has been a couple of weeks. I do not say that to scold — I say it because the eye DOES decay, slightly, after about ten days, and we should warm it up before any high-stakes climb session. Pick a puzzle to start. Easy theme, easy intro. Limber.",
  "Welcome back. Two weeks is the threshold where the calculation muscle benefits from a single Gate 5 review session before any real game. I have queued a soft tactics drill for you in the Studies tab. Run it before you face anything ranked.",
  "You have been gone long enough that your last opening repertoire might feel slightly unfamiliar. That is normal. Play a tutor-mode game first, slow tempo, and let the ideas come back. They come back fast. They always do.",
]);

const WELCOME_LONG_GONE: readonly string[] = Object.freeze([
  "It has been a month. Possibly more. I am not going to count out loud — that would be unkind. The chamber has not changed. The board has not changed. The lessons have not changed. You have changed, by virtue of the time, and we are going to find out how. Welcome back.",
  "Long absence. You probably remember about sixty percent of what we covered. The remaining forty percent is in the lessons themselves — every gate is replayable, every puzzle still has its intro, every climb tier still has its chair. Begin where you like. The classroom is patient.",
  "Welcome back to the chamber. I do not know what you went and did with the time. I hope it was good. Whatever it was, the chess habit is a thing that recovers in about a week of daily practice. The first day is today. We do not need to make today significant; we only need to start it.",
]);

export function bandForDaysSinceLastVisit(daysSince: number): DailyWelcomeBand | null {
  if (daysSince < 1) return null;
  if (daysSince === 1) return "fresh";
  if (daysSince <= 6) return "back";
  if (daysSince <= 29) return "returning";
  return "long_gone";
}

export function pickDailyWelcomeLine(
  daysSinceLastVisit: number,
  seed: number,
): string | undefined {
  const band = bandForDaysSinceLastVisit(daysSinceLastVisit);
  if (!band) return undefined;
  const lines =
    band === "fresh" ? WELCOME_FRESH
    : band === "back" ? WELCOME_BACK
    : band === "returning" ? WELCOME_RETURNING
    : WELCOME_LONG_GONE;
  return lines[Math.abs(Math.floor(seed)) % lines.length];
}
