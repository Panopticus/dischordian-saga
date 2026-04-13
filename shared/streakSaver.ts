/* ═══════════════════════════════════════════════════════
   STREAK SAVER — One Free Miss Per Season
   Once per season, a player can miss 1 day without
   losing their login streak. Auto-applied on login check.
   ═══════════════════════════════════════════════════════ */

export interface StreakSaverResult {
  /** Whether the streak is still alive after this check */
  streakAlive: boolean;
  /** Whether the saver is still available (not yet used this season) */
  saverAvailable: boolean;
  /** Whether the saver was used during this specific check */
  saverUsedToday: boolean;
  /** Toast message to display, if any */
  toastMessage: string | null;
}

/** Maximum gap (in ms) allowed without losing streak: 2 days */
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
/** Normal gap: 1 day */
const ONE_DAY_MS = 1 * 24 * 60 * 60 * 1000;

/**
 * Determine if a login streak should be preserved, broken, or
 * saved by the streak saver mechanic.
 *
 * @param lastLogin - The player's last login date
 * @param streakDays - Current streak length in days
 * @param saverUsed - Whether the streak saver has already been used this season
 * @returns StreakSaverResult with streak status and toast info
 */
export function useStreakSaver(
  lastLogin: Date,
  streakDays: number,
  saverUsed: boolean,
): StreakSaverResult {
  const now = new Date();
  const gap = now.getTime() - lastLogin.getTime();

  // Same day or consecutive day — streak continues normally
  if (gap < ONE_DAY_MS) {
    return {
      streakAlive: true,
      saverAvailable: !saverUsed,
      saverUsedToday: false,
      toastMessage: null,
    };
  }

  // Missed exactly 1 day (between 1 and 2 days gap)
  if (gap < TWO_DAYS_MS) {
    // Normal consecutive login (e.g., logged in yesterday)
    // Check if this is actually a missed day by comparing calendar dates
    const lastDay = getDayStart(lastLogin);
    const today = getDayStart(now);
    const dayDiff = Math.round((today.getTime() - lastDay.getTime()) / ONE_DAY_MS);

    if (dayDiff <= 1) {
      // Consecutive day — streak continues
      return {
        streakAlive: true,
        saverAvailable: !saverUsed,
        saverUsedToday: false,
        toastMessage: null,
      };
    }

    // Missed exactly 1 day — try to use saver
    if (!saverUsed) {
      return {
        streakAlive: true,
        saverAvailable: false,
        saverUsedToday: true,
        toastMessage: `Streak Saver activated! Your ${streakDays}-day streak is safe.`,
      };
    }

    // Saver already used — streak broken
    return {
      streakAlive: false,
      saverAvailable: false,
      saverUsedToday: false,
      toastMessage: null,
    };
  }

  // Gap > 2 days — streak is broken regardless
  return {
    streakAlive: false,
    saverAvailable: !saverUsed,
    saverUsedToday: false,
    toastMessage: null,
  };
}

/**
 * Get the start of the day (midnight) for a given date.
 */
function getDayStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if the streak saver has reset for a new season.
 * Seasons are roughly 3 months: Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec.
 */
export function hasSeasonReset(saverUsedDate: Date | null, currentDate: Date): boolean {
  if (!saverUsedDate) return true; // Never used

  const getSeason = (d: Date) => Math.floor(d.getMonth() / 3);
  const getYear = (d: Date) => d.getFullYear();

  return (
    getYear(saverUsedDate) !== getYear(currentDate) ||
    getSeason(saverUsedDate) !== getSeason(currentDate)
  );
}
