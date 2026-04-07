/* ═══════════════════════════════════════════════════════
   RIVAL SYSTEM — Competitive PvP Rivalries
   Track frequent opponents, mark as rivals after 3+ matches.
   Rival matches get +50% ELO change and unique UI treatment.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface Rivalry {
  playerId: number;
  opponentId: number;
  matchCount: number;
  playerWins: number;
  opponentWins: number;
  lastMatch: Date;
  rivalSince: Date | null;  // null if not yet a rival (< 3 matches)
  isRival: boolean;
}

export interface RivalMatchBonus {
  eloMultiplier: number;
  borderStyle: "rival_gold";
  dialog: string;
}

/* ─── CONSTANTS ─── */

/** Minimum matches before two players become rivals */
export const RIVAL_THRESHOLD = 3;

/** Maximum number of rivals shown in the rival list */
export const MAX_RIVALS_SHOWN = 3;

/** ELO multiplier for rival matches */
export const RIVAL_ELO_MULTIPLIER = 1.5;

/** Dialog lines shown when facing a rival */
export const RIVAL_DIALOGS = [
  "Your rival awaits...",
  "Settle the score once and for all.",
  "They know your moves. Surprise them.",
  "A familiar foe steps into the arena.",
  "This one is personal.",
  "The crowd senses history between you two.",
  "Your rival's eyes burn with determination.",
  "Time to prove who's the better fighter.",
];

/* ─── STORAGE ─── */

/** In-memory rivalry store — in production, backed by database */
const rivalries = new Map<string, Rivalry>();

function getRivalryKey(id1: number, id2: number): string {
  return id1 < id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
}

/* ─── CORE FUNCTIONS ─── */

/**
 * Update or create a rivalry after a match between two players.
 * Returns the Rivalry if they have become or already are rivals,
 * null if they haven't played enough matches yet.
 */
export function updateRivalry(
  playerId: number,
  opponentId: number,
  result: "win" | "loss",
): Rivalry | null {
  const key = getRivalryKey(playerId, opponentId);
  const now = new Date();

  let rivalry = rivalries.get(key);

  if (!rivalry) {
    rivalry = {
      playerId: Math.min(playerId, opponentId),
      opponentId: Math.max(playerId, opponentId),
      matchCount: 0,
      playerWins: 0,
      opponentWins: 0,
      lastMatch: now,
      rivalSince: null,
      isRival: false,
    };
  }

  rivalry.matchCount++;
  rivalry.lastMatch = now;

  // Track wins from the canonical (lower ID) player's perspective
  const isCanonicalPlayer = playerId === rivalry.playerId;
  if (result === "win") {
    if (isCanonicalPlayer) {
      rivalry.playerWins++;
    } else {
      rivalry.opponentWins++;
    }
  } else {
    if (isCanonicalPlayer) {
      rivalry.opponentWins++;
    } else {
      rivalry.playerWins++;
    }
  }

  // Check rivalry threshold
  if (!rivalry.isRival && rivalry.matchCount >= RIVAL_THRESHOLD) {
    rivalry.isRival = true;
    rivalry.rivalSince = now;
  }

  rivalries.set(key, rivalry);
  return rivalry.isRival ? rivalry : null;
}

/**
 * Get top 3 rivals for a player, sorted by match count descending.
 */
export function getRivals(playerId: number): Rivalry[] {
  const playerRivals: Rivalry[] = [];

  for (const rivalry of rivalries.values()) {
    if (
      rivalry.isRival &&
      (rivalry.playerId === playerId || rivalry.opponentId === playerId)
    ) {
      playerRivals.push(rivalry);
    }
  }

  return playerRivals
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, MAX_RIVALS_SHOWN);
}

/**
 * Get the rivalry between two specific players, if it exists.
 */
export function getRivalry(playerId: number, opponentId: number): Rivalry | null {
  const key = getRivalryKey(playerId, opponentId);
  return rivalries.get(key) ?? null;
}

/**
 * Check if two players are rivals and return match bonuses if so.
 */
export function getRivalMatchBonus(
  playerId: number,
  opponentId: number,
): RivalMatchBonus | null {
  const rivalry = getRivalry(playerId, opponentId);
  if (!rivalry?.isRival) return null;

  const dialogIndex = (rivalry.matchCount + playerId) % RIVAL_DIALOGS.length;
  return {
    eloMultiplier: RIVAL_ELO_MULTIPLIER,
    borderStyle: "rival_gold",
    dialog: RIVAL_DIALOGS[dialogIndex],
  };
}

/**
 * Get a rivalry's stats from a specific player's perspective.
 */
export function getRivalryStats(
  playerId: number,
  opponentId: number,
): { wins: number; losses: number; total: number } | null {
  const rivalry = getRivalry(playerId, opponentId);
  if (!rivalry) return null;

  const isCanonical = playerId === rivalry.playerId;
  return {
    wins: isCanonical ? rivalry.playerWins : rivalry.opponentWins,
    losses: isCanonical ? rivalry.opponentWins : rivalry.playerWins,
    total: rivalry.matchCount,
  };
}

/**
 * Reset all rivalries — for testing only.
 */
export function _resetRivalries(): void {
  rivalries.clear();
}
