/* ═══════════════════════════════════════════════════════
   ACT 1 CARD LADDER STORE

   Persists the player's progression through the twelve
   canonical Act 1 Dischordia matches (§4.3 / §4.4 / §4.5).

   Each step corresponds to one entry in ACT_1_OPPONENTS.
   The store tracks:
     - `wins`    — total Act 1 ladder wins (0-12)
     - `losses`  — total Act 1 ladder losses for stats
     - `defeatedOpponents` — ordered list of defeated
       opponent ids (may include "retry" dupes if the player
       lost and then won against the same step)
     - `lastBattleOutcome` — the most recent outcome tag,
       used by the Ladder page to fade in the post-match
       narrative beat.

   Persisted to localStorage with a dedicated key so it
   doesn't collide with the generic Dischordia `wins` counter
   used by unranked matches.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import type { Act1Opponent } from "@shared/act1Opponents";
import { ACT_1_OPPONENTS, getAct1Opponent } from "@shared/act1Opponents";

const STORAGE_KEY = "loredex-act1-ladder";

export interface Act1LadderSnapshot {
  wins: number;
  losses: number;
  /** Ordered list of defeated opponent ids. */
  defeatedOpponents: readonly string[];
  /** Outcome of the most recent battle — used by the UI. */
  lastBattleOutcome: "win" | "loss" | null;
  /** Canonical opponent id of the last battle played. */
  lastBattleOpponentId: string | null;
}

interface Act1LadderStore extends Act1LadderSnapshot {
  /** Record a win against the current ladder opponent. */
  recordWin: (opponentId: string) => void;
  /** Record a loss. Losses do not advance the ladder. */
  recordLoss: (opponentId: string) => void;
  /** Reset the ladder. Used by New Game and tests. */
  reset: () => void;
}

const DEFAULT_SNAPSHOT: Act1LadderSnapshot = {
  wins: 0,
  losses: 0,
  defeatedOpponents: [],
  lastBattleOutcome: null,
  lastBattleOpponentId: null,
};

function loadFromStorage(): Act1LadderSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<Act1LadderSnapshot>;
    return {
      wins: typeof parsed.wins === "number" ? parsed.wins : 0,
      losses: typeof parsed.losses === "number" ? parsed.losses : 0,
      defeatedOpponents: Array.isArray(parsed.defeatedOpponents)
        ? (parsed.defeatedOpponents as string[])
        : [],
      lastBattleOutcome:
        parsed.lastBattleOutcome === "win" ||
        parsed.lastBattleOutcome === "loss"
          ? parsed.lastBattleOutcome
          : null,
      lastBattleOpponentId:
        typeof parsed.lastBattleOpponentId === "string"
          ? parsed.lastBattleOpponentId
          : null,
    };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

function writeToStorage(snapshot: Act1LadderSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useAct1LadderStore = create<Act1LadderStore>((set) => ({
  ...loadFromStorage(),

  recordWin: (opponentId) => {
    set((state) => {
      // Only count as progress if the opponent matches the
      // current ladder step — otherwise the player is
      // replaying a retry against the same step.
      const currentStep = state.wins + 1;
      const expected = ACT_1_OPPONENTS.find((o) => o.act1Step === currentStep);
      // Resolve through legacy aliases so recordWin("little_meme")
      // matches the canonical "minnie_meme" at step 1, etc.
      const resolved = getAct1Opponent(opponentId);
      const isCurrentStepOpponent =
        expected !== undefined && resolved?.id === expected.id;
      const next: Act1LadderSnapshot = {
        wins: isCurrentStepOpponent ? state.wins + 1 : state.wins,
        losses: state.losses,
        defeatedOpponents: isCurrentStepOpponent
          ? [...state.defeatedOpponents, opponentId]
          : state.defeatedOpponents,
        lastBattleOutcome: "win",
        lastBattleOpponentId: opponentId,
      };
      writeToStorage(next);
      return next;
    });
  },

  recordLoss: (opponentId) => {
    set((state) => {
      const next: Act1LadderSnapshot = {
        ...state,
        losses: state.losses + 1,
        lastBattleOutcome: "loss",
        lastBattleOpponentId: opponentId,
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

/* ─── PLAIN-FUNCTION HELPERS ─── */

/** Read the current snapshot without subscribing (for non-React code). */
export function getAct1LadderSnapshot(): Act1LadderSnapshot {
  return useAct1LadderStore.getState();
}

/** Return the opponent the player should face next, or null if complete. */
export function peekAct1NextOpponent(): Act1Opponent | null {
  const snapshot = useAct1LadderStore.getState();
  return (
    ACT_1_OPPONENTS.find((o) => o.act1Step === snapshot.wins + 1) ?? null
  );
}
