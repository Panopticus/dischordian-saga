/* ═══════════════════════════════════════════════════════
   ACT 3 CARD LADDER STORE

   Tracks the player's progression through the three Act 3
   substrate-gate opponents (ACT_3_OPPONENTS from
   acts2to7Opponents.ts). Mirrors the Act 1 ladder store
   shape so the UI layer can render the two ladders with
   the same patterns.

   Persisted to localStorage under its own key — does not
   collide with Act 1 progression.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { ACT_3_OPPONENTS } from "@shared/acts2to7Opponents";
import type { ActNOpponent } from "@shared/acts2to7Opponents";

const STORAGE_KEY = "loredex-act3-ladder";

export interface Act3LadderSnapshot {
  wins: number;
  losses: number;
  defeatedOpponents: readonly string[];
  lastBattleOutcome: "win" | "loss" | null;
  lastBattleOpponentId: string | null;
}

interface Act3LadderStore extends Act3LadderSnapshot {
  recordWin: (opponentId: string) => void;
  recordLoss: (opponentId: string) => void;
  reset: () => void;
}

const DEFAULT_SNAPSHOT: Act3LadderSnapshot = {
  wins: 0,
  losses: 0,
  defeatedOpponents: [],
  lastBattleOutcome: null,
  lastBattleOpponentId: null,
};

function loadFromStorage(): Act3LadderSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<Act3LadderSnapshot>;
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

function writeToStorage(snapshot: Act3LadderSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useAct3LadderStore = create<Act3LadderStore>((set) => ({
  ...loadFromStorage(),

  recordWin: (opponentId) => {
    set((state) => {
      const currentStep = state.wins + 1;
      const expected = ACT_3_OPPONENTS.find((o) => o.actStep === currentStep);
      const isCurrentStepOpponent = expected?.id === opponentId;
      const next: Act3LadderSnapshot = {
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
      const next: Act3LadderSnapshot = {
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

export function getAct3LadderSnapshot(): Act3LadderSnapshot {
  return useAct3LadderStore.getState();
}

export function peekAct3NextOpponent(): ActNOpponent | null {
  const snapshot = useAct3LadderStore.getState();
  return ACT_3_OPPONENTS.find((o) => o.actStep === snapshot.wins + 1) ?? null;
}

/** Whether the player has cleared all three Act 3 gates. */
export function isAct3LadderComplete(): boolean {
  return useAct3LadderStore.getState().wins >= ACT_3_OPPONENTS.length;
}
