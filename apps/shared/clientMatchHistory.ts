/**
 * Client-side TCG match history.
 *
 * The server's `cardGameMatches` table only records *active* matches
 * from the legacy 3-lane flow — there's no "recordResult" path for
 * tcg-core matches (see apps/server/routers/cardGame.ts). Until a
 * server-side result table lands, we keep a rolling history locally
 * in `localStorage` so the player at least sees "you beat the
 * Warlord yesterday" from the Bridge without waiting on a DB
 * migration.
 *
 * Entries are capped at MAX_ENTRIES to keep localStorage small;
 * oldest evicted first. A corruption-resistant read path falls
 * back to [] rather than throwing, so a malformed blob doesn't
 * brick the Bridge render.
 */

export const MATCH_HISTORY_STORAGE_KEY = "dischordia_match_history";
export const MAX_ENTRIES = 20;

export type MatchHistoryOutcome = "win" | "loss" | "withdrawn";

export interface MatchHistoryEntry {
  /** Epoch ms — the moment the match resolved. */
  at: number;
  outcome: MatchHistoryOutcome;
  /** Human-readable opponent / encounter label. */
  opponent: string;
  /** Canonical encounter id when the match was a named boss. */
  encounterId?: string;
  /** Turn count at resolution. */
  turns: number;
  /** Cards played by the player during the match. */
  cardsPlayed: number;
  /** Player faction chosen for the match. */
  playerFaction: string;
}

function isEntry(x: unknown): x is MatchHistoryEntry {
  if (!x || typeof x !== "object") return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e.at === "number" &&
    (e.outcome === "win" || e.outcome === "loss" || e.outcome === "withdrawn") &&
    typeof e.opponent === "string" &&
    typeof e.turns === "number" &&
    typeof e.cardsPlayed === "number" &&
    typeof e.playerFaction === "string"
  );
}

/**
 * Read the persisted history. Returns `[]` on missing / corrupt
 * blob so the UI renders an empty state rather than crashing.
 */
export function readMatchHistory(): MatchHistoryEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(MATCH_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry);
  } catch {
    return [];
  }
}

/**
 * Append an entry. Newest first; capped at MAX_ENTRIES. Silently
 * drops the write on localStorage failure (quota, sandboxed tab)
 * so a full-disk client still plays the match.
 */
export function appendMatchHistoryEntry(
  entry: MatchHistoryEntry,
): MatchHistoryEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const prev = readMatchHistory();
    const next = [entry, ...prev].slice(0, MAX_ENTRIES);
    localStorage.setItem(MATCH_HISTORY_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return readMatchHistory();
  }
}

/**
 * Win/loss summary. Handy for showing `W-L (last 20)` on the Bridge.
 */
export interface MatchHistoryStats {
  wins: number;
  losses: number;
  withdrawn: number;
  total: number;
}

export function summarizeMatchHistory(
  entries: readonly MatchHistoryEntry[],
): MatchHistoryStats {
  let wins = 0;
  let losses = 0;
  let withdrawn = 0;
  for (const e of entries) {
    if (e.outcome === "win") wins += 1;
    else if (e.outcome === "loss") losses += 1;
    else withdrawn += 1;
  }
  return { wins, losses, withdrawn, total: entries.length };
}
