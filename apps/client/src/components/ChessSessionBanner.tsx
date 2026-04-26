/**
 * ChessSessionBanner — small italic strip rendered above chess
 * page headers. Carries up to two beats:
 *
 *   - welcomeLine: the daily welcome / returning-student line, picked
 *     by `pickDailyWelcomeLine` based on days-since-last-visit
 *     (tracked client-side in localStorage).
 *   - streakLine: the puzzle-streak milestone line, picked by
 *     `pickStreakMilestoneLine` (returns undefined on non-milestone
 *     days, so this slot is usually empty).
 *
 * Returns null when both inputs are absent — callers can pass
 * `undefined` for either field freely.
 */

export interface ChessSessionBannerProps {
  welcomeLine?: string;
  streakLine?: string;
}

export default function ChessSessionBanner({
  welcomeLine,
  streakLine,
}: ChessSessionBannerProps) {
  if (!welcomeLine && !streakLine) return null;
  return (
    <section
      role="status"
      aria-label="Game Master — session note"
      className="mb-4 p-3 border border-void-text-accent/40 rounded bg-void-bg/40 space-y-2"
    >
      {welcomeLine && (
        <p className="text-sm italic text-void-text">{welcomeLine}</p>
      )}
      {streakLine && (
        <p className="text-sm italic text-void-text-accent">{streakLine}</p>
      )}
    </section>
  );
}
