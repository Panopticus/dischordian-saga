/* ═══════════════════════════════════════════════════════
   RANK DECAY — ELO decay for inactive PvP players

   Players who stop competing gradually lose ELO to keep
   the leaderboard reflective of active skill levels.
   Decay only applies above Silver (1200 ELO).
   ═══════════════════════════════════════════════════════ */

/* ─── CONSTANTS ─── */

/** ELO floor below which no decay applies */
export const DECAY_ELO_FLOOR = 1200;

/** Days of inactivity before decay begins */
export const DECAY_GRACE_DAYS = 14;

/** ELO lost per week of inactivity after grace period */
export const DECAY_PER_WEEK = 25;

/** Maximum total ELO that can be lost to decay */
export const DECAY_CAP = 100;

/** Days before decay starts to issue a warning */
export const DECAY_WARNING_DAYS = 3;

/* ─── HELPERS ─── */

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(b.getTime() - a.getTime()) / msPerDay;
}

/* ─── DECAY CALCULATION ─── */

/**
 * Calculate the ELO decay amount for an inactive player.
 *
 * @param lastMatchDate - Date of the player's most recent ranked match
 * @param currentElo - The player's current ELO rating
 * @param now - Current date (defaults to Date.now for testability)
 * @returns The amount of ELO to subtract (always >= 0). Returns 0 if
 *   no decay applies (below floor, within grace period, etc.)
 */
export function calculateDecay(
  lastMatchDate: Date,
  currentElo: number,
  now: Date = new Date(),
): number {
  // No decay below the ELO floor
  if (currentElo <= DECAY_ELO_FLOOR) return 0;

  const inactiveDays = daysBetween(lastMatchDate, now);

  // Within grace period — no decay
  if (inactiveDays <= DECAY_GRACE_DAYS) return 0;

  // Calculate weeks of decay past the grace period
  const decayDays = inactiveDays - DECAY_GRACE_DAYS;
  const decayWeeks = decayDays / 7;
  const rawDecay = Math.floor(decayWeeks * DECAY_PER_WEEK);

  // Cap total decay
  const cappedDecay = Math.min(rawDecay, DECAY_CAP);

  // Don't decay below the floor
  const maxDecay = Math.max(0, currentElo - DECAY_ELO_FLOOR);

  return Math.min(cappedDecay, maxDecay);
}

/**
 * Apply decay to an ELO value and return the new rating.
 */
export function applyDecay(
  lastMatchDate: Date,
  currentElo: number,
  now: Date = new Date(),
): number {
  const decay = calculateDecay(lastMatchDate, currentElo, now);
  return currentElo - decay;
}

/* ─── DECAY WARNING ─── */

/**
 * Returns a warning message if the player is approaching or currently
 * experiencing rank decay. Returns null if no warning is needed.
 *
 * @param lastMatchDate - Date of the player's most recent ranked match
 * @param now - Current date (defaults to Date.now for testability)
 */
export function getDecayWarning(
  lastMatchDate: Date,
  now: Date = new Date(),
): string | null {
  const inactiveDays = daysBetween(lastMatchDate, now);

  // Already decaying
  if (inactiveDays > DECAY_GRACE_DAYS) {
    const decayDays = inactiveDays - DECAY_GRACE_DAYS;
    const weeksDecayed = Math.floor(decayDays / 7);
    const currentDecay = Math.min(weeksDecayed * DECAY_PER_WEEK, DECAY_CAP);

    if (currentDecay >= DECAY_CAP) {
      return "Maximum rank decay reached (-100 ELO). Play a match to reset decay!";
    }

    return `Rank decay active: -${currentDecay} ELO so far. Play a match to stop further decay!`;
  }

  // Approaching decay threshold
  const daysUntilDecay = DECAY_GRACE_DAYS - inactiveDays;
  if (daysUntilDecay <= DECAY_WARNING_DAYS) {
    const daysLeft = Math.ceil(daysUntilDecay);
    if (daysLeft <= 0) {
      return "Rank decay begins today! Play a match to avoid losing ELO.";
    }
    if (daysLeft === 1) {
      return "Play a match within 1 day to avoid rank decay!";
    }
    return `Play a match within ${daysLeft} days to avoid rank decay.`;
  }

  return null;
}

/* ─── DECAY STATUS ─── */

export interface DecayStatus {
  /** Whether decay is currently active */
  isDecaying: boolean;
  /** Total ELO lost to decay */
  totalDecay: number;
  /** Days until decay starts (0 if already decaying) */
  daysUntilDecay: number;
  /** Warning message, if any */
  warning: string | null;
  /** Whether maximum decay cap has been reached */
  atCap: boolean;
}

/**
 * Get a comprehensive decay status summary for display in the UI.
 */
export function getDecayStatus(
  lastMatchDate: Date,
  currentElo: number,
  now: Date = new Date(),
): DecayStatus {
  const inactiveDays = daysBetween(lastMatchDate, now);
  const decay = calculateDecay(lastMatchDate, currentElo, now);
  const isDecaying = decay > 0;
  const daysUntilDecay = isDecaying ? 0 : Math.max(0, Math.ceil(DECAY_GRACE_DAYS - inactiveDays));

  return {
    isDecaying,
    totalDecay: decay,
    daysUntilDecay,
    warning: getDecayWarning(lastMatchDate, now),
    atCap: decay >= DECAY_CAP,
  };
}
