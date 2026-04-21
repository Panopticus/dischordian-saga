/**
 * Puzzle of the Day — one puzzle per day hosted by the Celebration
 * Game Master. The server picks the puzzle deterministically from
 * the date; this page renders it with the GM's themed intro line.
 *
 * The existing `chessPuzzles` shared bank + `chess.puzzleOfTheDay`
 * server endpoint are the expected integration points. In this
 * iteration we render read-only: theme, intro, solution, and
 * "view on Lichess" link. Interactive solve loop reuses
 * ChessBoard.tsx and is deferred to the client integration chunk.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import {
  pickPuzzleIntro,
  PUZZLE_THEMES,
  type PuzzleTheme,
} from "@shared/tcg-core/story/chessPuzzleIntros";
import { getLoginUrl } from "@/const";
import { useMemo } from "react";

/** Today's ISO date in YYYY-MM-DD form, used both for intro
 *  selection and for server-side puzzle rotation. */
function todayKey(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Deterministic theme selection from the date key so the page
 *  can render even before the server endpoint lands. */
function themeForDate(key: string): PuzzleTheme {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return PUZZLE_THEMES[h % PUZZLE_THEMES.length];
}

export default function ChessPuzzlePage() {
  const { isAuthenticated } = useAuth();
  const dateKey = todayKey();
  const theme = useMemo(() => themeForDate(dateKey), [dateKey]);
  const intro = useMemo(() => pickPuzzleIntro(theme, dateKey), [theme, dateKey]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <a href={getLoginUrl()} className="text-void-text-accent underline">
          Sign in to see today's puzzle.
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto text-void-text">
      <header className="mb-6">
        <h1 className="text-2xl tracking-wide">Puzzle of the Day</h1>
        <p className="text-xs uppercase tracking-widest text-void-text-muted mt-1">
          {dateKey} · theme: {theme.replace(/_/g, " ")}
        </p>
      </header>

      <section className="mb-6 p-4 border border-void-border/40 rounded bg-void-bg/40">
        <p className="text-sm italic text-void-text">{intro}</p>
      </section>

      <section className="text-sm text-void-text-muted">
        <p>
          The solve loop (board + answer check + streak tracking) wires
          in once the `chess.puzzleOfTheDay` tRPC endpoint is live. Today's
          theme has been chosen deterministically from the date; the
          Celebration Game Master's intro will stay stable for all
          players on this date.
        </p>
      </section>
    </div>
  );
}
