/* ═══════════════════════════════════════════════════════
   GAMEMASTER'S ARENA — Spectator & Betting System

   Watch live quiz show games, bet Dream tokens on outcomes.
   Framed as "The Matrix of Dreams broadcasts to all
   connected Arks" — spectators tune into the frequency.

   Betting creates engagement even when not playing.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface SpectatorSession {
  id: string;
  /** The game being watched */
  gameId: string;
  /** Player(s) in the game */
  players: { userId: number; userName: string; cloneNumber: number }[];
  /** Game mode */
  mode: "solo" | "pvp";
  /** Current round */
  currentRound: number;
  /** Spectator count */
  spectatorCount: number;
  /** Is game still live */
  isLive: boolean;
  /** Start time */
  startedAt: number;
}

export interface SpectatorBet {
  id: string;
  spectatorUserId: number;
  gameId: string;
  /** What you're betting on */
  betType: BetType;
  /** Dream tokens wagered */
  amount: number;
  /** Potential payout multiplier */
  odds: number;
  /** Result */
  result: "pending" | "won" | "lost";
}

export type BetType =
  | { type: "player_wins"; playerId: number }           // Bet on who wins (PvP)
  | { type: "survives_round"; round: number }            // Bet player survives to round N
  | { type: "perfect_run" }                              // Bet player gets all 10 right
  | { type: "uses_lifeline"; beforeRound: number }       // Bet player uses a lifeline before round N
  | { type: "dies_on_round"; round: number }             // Bet player dies on specific round
  ;

/* ─── ODDS CALCULATION ─── */

const BASE_ODDS: Record<string, number> = {
  player_wins: 1.8,     // ~55% implied probability
  survives_round: 1.0,  // Adjusted by round number
  perfect_run: 12.0,    // ~8% chance
  uses_lifeline: 2.5,   // ~40% chance
  dies_on_round: 8.0,   // ~12.5% per specific round
};

export function calculateOdds(betType: BetType): number {
  switch (betType.type) {
    case "player_wins":
      return BASE_ODDS.player_wins;
    case "survives_round":
      // Harder to survive later rounds
      return 1 + (betType.round * 0.3);
    case "perfect_run":
      return BASE_ODDS.perfect_run;
    case "uses_lifeline":
      // Earlier lifeline use = more likely
      return 1 + (betType.beforeRound * 0.2);
    case "dies_on_round":
      return BASE_ODDS.dies_on_round;
    default:
      return 2.0;
  }
}

export function calculatePayout(amount: number, odds: number): number {
  return Math.floor(amount * odds);
}

/* ─── BET LIMITS ─── */

export const MIN_BET = 5;
export const MAX_BET = 500;
export const MAX_BETS_PER_GAME = 3;

export function canPlaceBet(
  currentBets: SpectatorBet[],
  dreamBalance: number,
  amount: number,
): { allowed: boolean; reason?: string } {
  if (amount < MIN_BET) return { allowed: false, reason: `Minimum bet is ${MIN_BET} Dream` };
  if (amount > MAX_BET) return { allowed: false, reason: `Maximum bet is ${MAX_BET} Dream` };
  if (currentBets.length >= MAX_BETS_PER_GAME) return { allowed: false, reason: "Maximum 3 bets per game" };
  if (dreamBalance < amount) return { allowed: false, reason: "Not enough Dream tokens" };
  return { allowed: true };
}

/* ─── SPECTATOR CHAT ─── */

export interface SpectatorMessage {
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
  type: "chat" | "reaction" | "bet_placed" | "bet_won" | "system";
}

export const QUICK_REACTIONS = [
  { emoji: "🧠", label: "Big brain" },
  { emoji: "💀", label: "RIP clone" },
  { emoji: "🎉", label: "Nice!" },
  { emoji: "😱", label: "Close!" },
  { emoji: "🤔", label: "Hmm..." },
  { emoji: "⏰", label: "Time!" },
  { emoji: "💰", label: "Payday" },
  { emoji: "🎪", label: "Entertainment" },
];

/* ─── GAME MASTER COMMENTARY FOR SPECTATORS ─── */

export const SPECTATOR_COMMENTARY: Record<string, string[]> = {
  game_start: [
    "A new contestant approaches! Place your bets, dead audience!",
    "Fresh clone detected. The odds are... well, they're odds.",
    "Welcome back to the show that never ends — because I never stop running it!",
  ],
  correct_answer: [
    "They got it! Someone's been studying at Mechronis Academy!",
    "Correct! The audience goes wild! Well, they would if they were alive.",
    "Right answer! My circuits tingle with approval!",
  ],
  wrong_answer: [
    "WRONG! And there goes another clone. They really are disposable.",
    "Incorrect! The correct answer was obvious to anyone who paid attention in class.",
    "TERMINATED! That's what happens when you guess on MY show!",
  ],
  lifeline_used: [
    "Using a lifeline? How delightfully mortal of them!",
    "A lifeline! The audience murmurs... the ghost audience, that is.",
    "Reaching for help? In MY matrix? How quaint.",
  ],
  round_5: [
    "Halfway through! The questions get... interesting from here.",
    "Round 5! At this point, most contestants are sweating. Do clones sweat?",
  ],
  round_10: [
    "The FINAL question! Even I get nervous. Just kidding. I'm a robot.",
    "Round 10! If they get this right, I'll have to actually pay out. How tedious.",
  ],
  perfect_run: [
    "A PERFECT RUN! Impossible! Well, improbable. My programming allows for it.",
    "10 for 10! Someone notify the Architect — we have a genius on our hands!",
  ],
};

export function getSpectatorCommentary(event: string): string {
  const lines = SPECTATOR_COMMENTARY[event];
  if (!lines || lines.length === 0) return "";
  return lines[Math.floor(Math.random() * lines.length)];
}
