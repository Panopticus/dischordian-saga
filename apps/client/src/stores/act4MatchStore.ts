/* ═══════════════════════════════════════════════════════
   ACT 4 MATCH STORE — path-resolved single encounter

   Unlike Acts 3 / 6 / 7, Act 4 is not a ladder — the player
   plays exactly ONE match (The Bridge on Path A, Elara
   Learning on Path B, Elara Betrayed on Path C). Which
   opponent plays is resolved at runtime from narrative
   flags via resolveAct4Dialog.

   This store tracks outcome persistence — whether the match
   has been played, which opponent was resolved, and what
   the result was. No "wins" counter.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";

const STORAGE_KEY = "loredex-act4-match";

export interface Act4MatchSnapshot {
  /** Opponent id that was resolved for this playthrough, or null
   *  if the match has not been played yet. */
  resolvedOpponentId: string | null;
  /** Outcome of the most recent match, or null if unplayed. */
  outcome: "win" | "loss" | null;
  /** Total matches played — includes retries. */
  attempts: number;
}

interface Act4MatchStore extends Act4MatchSnapshot {
  recordOutcome: (opponentId: string, outcome: "win" | "loss") => void;
  reset: () => void;
}

const DEFAULT_SNAPSHOT: Act4MatchSnapshot = {
  resolvedOpponentId: null,
  outcome: null,
  attempts: 0,
};

function loadFromStorage(): Act4MatchSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<Act4MatchSnapshot>;
    return {
      resolvedOpponentId:
        typeof parsed.resolvedOpponentId === "string"
          ? parsed.resolvedOpponentId
          : null,
      outcome:
        parsed.outcome === "win" || parsed.outcome === "loss"
          ? parsed.outcome
          : null,
      attempts: typeof parsed.attempts === "number" ? parsed.attempts : 0,
    };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

function writeToStorage(snapshot: Act4MatchSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useAct4MatchStore = create<Act4MatchStore>((set) => ({
  ...loadFromStorage(),

  recordOutcome: (opponentId, outcome) => {
    set((state) => {
      const next: Act4MatchSnapshot = {
        resolvedOpponentId: opponentId,
        outcome,
        attempts: state.attempts + 1,
      };
      writeToStorage(next);
      return next;
    });
  },

  reset: () => {
    writeToStorage(DEFAULT_SNAPSHOT);
    set(DEFAULT_SNAPSHOT);
  },
}));

export function getAct4MatchSnapshot(): Act4MatchSnapshot {
  return useAct4MatchStore.getState();
}

/** Whether the player has completed the Act 4 match (with any outcome). */
export function isAct4MatchPlayed(): boolean {
  return useAct4MatchStore.getState().outcome !== null;
}
