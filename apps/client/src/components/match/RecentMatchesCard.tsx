/**
 * RecentMatchesCard — compact recent-match list for the Bridge Console.
 *
 * Reads the client-side localStorage history (see
 * apps/shared/clientMatchHistory.ts) and renders a tight 3-row
 * list: outcome pill, opponent name, turns taken, relative time.
 * Collapses to nothing when the player has never completed a
 * match, so fresh saves don't see an awkward empty panel.
 *
 * Intentionally presentation-only — the match recording happens
 * in DuelystGameUI's match-end effect, not here. Re-reading from
 * localStorage on every mount is cheap (≤20 entries) and dodges
 * the need for a subscription / context.
 */
import { useMemo } from "react";
import { Swords } from "lucide-react";
import { readMatchHistory, summarizeMatchHistory } from "@shared/clientMatchHistory";

function formatRelativeTime(now: number, then: number): string {
  const delta = Math.max(0, now - then);
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString();
}

function outcomeStyle(outcome: string): string {
  if (outcome === "win") return "text-emerald-400 border-emerald-400/40 bg-emerald-400/5";
  if (outcome === "withdrawn") return "text-amber-400 border-amber-400/40 bg-amber-400/5";
  return "text-rose-400 border-rose-400/40 bg-rose-400/5";
}

export function RecentMatchesCard() {
  const history = useMemo(() => readMatchHistory(), []);
  const stats = useMemo(() => summarizeMatchHistory(history), [history]);
  const now = useMemo(() => Date.now(), []);

  if (history.length === 0) return null;

  return (
    <div className="px-4 mb-5" data-testid="bridge-recent-matches">
      <div className="flex items-center gap-2 mb-3">
        <Swords size={10} className="text-primary/60" />
        <span className="font-mono text-[9px] text-primary/60 tracking-[0.2em]">
          RECENT MATCHES
        </span>
        <span className="font-mono text-[9px] text-stone-500 ml-auto">
          {stats.wins}W · {stats.losses}L
          {stats.withdrawn > 0 && ` · ${stats.withdrawn}F`}
        </span>
      </div>
      <ul className="space-y-1.5">
        {history.slice(0, 5).map((entry, i) => (
          <li
            key={`${entry.at}-${i}`}
            className="flex items-center gap-3 p-2.5 rounded border border-stone-800 bg-stone-950/60"
          >
            <span
              className={
                "font-mono text-[9px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded border " +
                outcomeStyle(entry.outcome)
              }
            >
              {entry.outcome === "withdrawn" ? "WDRW" : entry.outcome.toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[13px] text-stone-200 truncate">
                {entry.opponent}
              </p>
              <p className="font-mono text-[9px] text-stone-500">
                {entry.turns} turn{entry.turns === 1 ? "" : "s"} · {entry.cardsPlayed} card
                {entry.cardsPlayed === 1 ? "" : "s"} · {entry.playerFaction}
              </p>
            </div>
            <span className="font-mono text-[9px] text-stone-600 shrink-0">
              {formatRelativeTime(now, entry.at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentMatchesCard;
