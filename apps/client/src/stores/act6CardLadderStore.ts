/* ═══════════════════════════════════════════════════════
   ACT 6 CARD LADDER STORE — confession-side mirrors

   Tracks the two Act 6 confession matches (ACT_6_OPPONENTS
   from acts2to7Opponents.ts): The Woman She Was, The
   Detective in the Wall. Linear progression — both gate on
   the prior confession-heard flag.

   Mirrors the Act 1 / Act 3 store shape exactly so UI can
   render them with the same patterns.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { ACT_6_OPPONENTS } from "@shared/acts2to7Opponents";
import type { ActNOpponent } from "@shared/acts2to7Opponents";

const STORAGE_KEY = "loredex-act6-ladder";

export interface Act6LadderSnapshot {
  wins: number;
  losses: number;
  defeatedOpponents: readonly string[];
  lastBattleOutcome: "win" | "loss" | null;
  lastBattleOpponentId: string | null;
}

interface Act6LadderStore extends Act6LadderSnapshot {
  recordWin: (opponentId: string) => void;
  recordLoss: (opponentId: string) => void;
  reset: () => void;
}

const DEFAULT_SNAPSHOT: Act6LadderSnapshot = {
  wins: 0,
  losses: 0,
  defeatedOpponents: [],
  lastBattleOutcome: null,
  lastBattleOpponentId: null,
};

function loadFromStorage(): Act6LadderSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<Act6LadderSnapshot>;
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

function writeToStorage(snapshot: Act6LadderSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useAct6LadderStore = create<Act6LadderStore>((set) => ({
  ...loadFromStorage(),

  recordWin: (opponentId) => {
    set((state) => {
      const currentStep = state.wins + 1;
      const expected = ACT_6_OPPONENTS.find((o) => o.actStep === currentStep);
      const isCurrentStepOpponent = expected?.id === opponentId;
      const next: Act6LadderSnapshot = {
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
      const next: Act6LadderSnapshot = {
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

export function getAct6LadderSnapshot(): Act6LadderSnapshot {
  return useAct6LadderStore.getState();
}

export function peekAct6NextOpponent(): ActNOpponent | null {
  const snapshot = useAct6LadderStore.getState();
  return ACT_6_OPPONENTS.find((o) => o.actStep === snapshot.wins + 1) ?? null;
}

export function isAct6LadderComplete(): boolean {
  return useAct6LadderStore.getState().wins >= ACT_6_OPPONENTS.length;
}
