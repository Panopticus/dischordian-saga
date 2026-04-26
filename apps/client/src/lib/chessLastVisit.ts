/**
 * Client-side last-visit tracking for the chess pages.
 *
 * The authoritative store is server-side
 * (`trpc.chess.getLastVisit` / `trpc.chess.markVisit`) so the
 * welcome banner is consistent across devices. localStorage is the
 * fallback for unauthenticated visitors and offline use — readers
 * should prefer the server value when present and fall back to
 * `readDaysSinceLastVisit()` here when the query is unavailable.
 *
 * `daysBetween` is exported separately so the page can compute the
 * server-derived band the same way without duplicating the math.
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

/** Convert two epoch-ms timestamps (or a Date + Date) into integer
 *  days between them, floored. Returns 0 if `prev` is at or after
 *  `now`. Exposed so server-derived timestamps can use the same
 *  banding as the localStorage fallback. */
export function daysBetween(
  prevMs: number,
  now: number = Date.now(),
): number {
  if (!Number.isFinite(prevMs)) return 0;
  const diff = now - prevMs;
  if (diff <= 0) return 0;
  return Math.floor(diff / MS_PER_DAY);
}
