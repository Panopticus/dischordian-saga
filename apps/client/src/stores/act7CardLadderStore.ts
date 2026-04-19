/* ═══════════════════════════════════════════════════════
   ACT 7 CARD LADDER STORE — convergence finale

   Tracks the four Act 7 finale matches (ACT_7_OPPONENTS):
   The Visible War, The Watcher's Shadow, Patient Zero
   (Reborn), The Convergence Seat. Linear; the final step
   closes the seven-act arc.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { ACT_7_OPPONENTS } from "@shared/acts2to7Opponents";
import type { ActNOpponent } from "@shared/acts2to7Opponents";

const STORAGE_KEY = "loredex-act7-ladder";

export interface Act7LadderSnapshot {
  wins: number;
  losses: number;
  defeatedOpponents: readonly string[];
  lastBattleOutcome: "win" | "loss" | null;
  lastBattleOpponentId: string | null;
}

interface Act7LadderStore extends Act7LadderSnapshot {
  recordWin: (opponentId: string) => void;
  recordLoss: (opponentId: string) => void;
  reset: () => void;
}

const DEFAULT_SNAPSHOT: Act7LadderSnapshot = {
  wins: 0,
  losses: 0,
  defeatedOpponents: [],
  lastBattleOutcome: null,
  lastBattleOpponentId: null,
};

function loadFromStorage(): Act7LadderSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<Act7LadderSnapshot>;
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

function writeToStorage(snapshot: Act7LadderSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useAct7LadderStore = create<Act7LadderStore>((set) => ({
  ...loadFromStorage(),

  recordWin: (opponentId) => {
    set((state) => {
      const currentStep = state.wins + 1;
      const expected = ACT_7_OPPONENTS.find((o) => o.actStep === currentStep);
      const isCurrentStepOpponent = expected?.id === opponentId;
      const next: Act7LadderSnapshot = {
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
      const next: Act7LadderSnapshot = {
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

export function getAct7LadderSnapshot(): Act7LadderSnapshot {
  return useAct7LadderStore.getState();
}

export function peekAct7NextOpponent(): ActNOpponent | null {
  const snapshot = useAct7LadderStore.getState();
  return ACT_7_OPPONENTS.find((o) => o.actStep === snapshot.wins + 1) ?? null;
}

export function isAct7LadderComplete(): boolean {
  return useAct7LadderStore.getState().wins >= ACT_7_OPPONENTS.length;
}
