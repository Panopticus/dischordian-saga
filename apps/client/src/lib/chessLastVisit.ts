/**
 * Client-side last-visit tracking for the chess pages.
 *
 * Stored in localStorage under `chess_last_visit_ms` as a numeric
 * milliseconds-since-epoch timestamp. Read on chess-page mount via
 * `readDaysSinceLastVisit`, then immediately stamped to "now" via
 * `markVisitedNow`.
 *
 * Server-side cross-device tracking is intentionally deferred —
 * a single-device welcome is good enough for the first iteration.
 */

const KEY = "chess_last_visit_ms";

const MS_PER_DAY = 86_400_000;

/** Read the days-since-last-visit, or 0 if no prior visit was
 *  recorded (in which case the welcome banner is suppressed by
 *  the caller). Robust to a missing or corrupted localStorage
 *  value. */
export function readDaysSinceLastVisit(now: number = Date.now()): number {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const prev = Number(raw);
    if (!Number.isFinite(prev)) return 0;
    const diff = now - prev;
    if (diff <= 0) return 0;
    return Math.floor(diff / MS_PER_DAY);
  } catch {
    return 0;
  }
}

/** Stamp the current time as the most recent chess-page visit. */
export function markVisitedNow(now: number = Date.now()): void {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    /* swallow — quota or private mode */
  }
}
