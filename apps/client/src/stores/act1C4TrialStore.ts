/* ═══════════════════════════════════════════════════════
   ACT 1 C4 TRIAL STORE — Wayne Warden's Authority Tribunal

   Wraps the pure-function Trial-format state machine from
   apps/client/src/game/duelyst/trialFormat.ts with a
   localStorage-persisted Zustand store for use by
   Act1C4TrialPage.tsx.

   Canonical spec: Act 1 Ship-Ready Bible §§2.13, 16.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import {
  createTrialState,
  engineerResponds,
  tribunalPlays,
  type TrialFormatState,
  type TrialOutcome,
} from "@/game/duelyst/trialFormat";

const STORAGE_KEY = "loredex-act1-c4-trial";

/**
 * Engineer's canonical C4 starting hand — per §16.3 counter-table.
 * The player's C4 match starts with every Cycle-A-through-C3 card
 * unlock they've accumulated, held back for thematic counters.
 * For the first-pass UI we seed the canonical maximum set; variant
 * tuning keyed to real player progression is a follow-up.
 */
export const CANONICAL_ENGINEER_HAND: readonly string[] = [
  "countermelody",
  "jar_wouldnt_close",
  "first_card",
  "iron_stance",
  "recruiters_gift",
  "weapon_i_didnt_build",
  "memorized_page",
  "classmates_compass",
  "only_reason_i_stayed",
  "standstill",
  "converter",
  "friend_i_saved",
];

export interface Act1C4TrialStore {
  state: TrialFormatState;
  /** True if the player has started the match (past matchup view). */
  hasStarted: boolean;
  /** Counter of turns completed, for UI progression display. */
  turnsCompleted: number;
  /** Tribunal's next move — advances the state machine one step. */
  advanceTribunal: () => void;
  /** Engineer plays a counter; `null` = no-counter (Tribunal resolves at full weight). */
  counterWith: (cardId: string | null) => void;
  /** Restart the match. */
  reset: () => void;
}

function loadFromStorage(): TrialFormatState {
  if (typeof localStorage === "undefined") {
    return createTrialState(CANONICAL_ENGINEER_HAND);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createTrialState(CANONICAL_ENGINEER_HAND);
    const parsed = JSON.parse(raw) as TrialFormatState;
    // Basic shape validation; fall back to fresh state on corruption.
    if (
      typeof parsed.inkLines !== "number" ||
      !Array.isArray(parsed.tribunalDeck) ||
      !Array.isArray(parsed.engineerHand)
    ) {
      return createTrialState(CANONICAL_ENGINEER_HAND);
    }
    return parsed;
  } catch {
    return createTrialState(CANONICAL_ENGINEER_HAND);
  }
}

function writeToStorage(state: TrialFormatState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* best-effort persistence */
  }
}

export const useAct1C4TrialStore = create<Act1C4TrialStore>((set) => ({
  state: loadFromStorage(),
  hasStarted: false,
  turnsCompleted: 0,

  advanceTribunal: () => {
    set((store) => {
      const next = tribunalPlays(store.state);
      writeToStorage(next);
      return { ...store, state: next, hasStarted: true };
    });
  },

  counterWith: (cardId) => {
    set((store) => {
      const next = engineerResponds(store.state, cardId);
      writeToStorage(next);
      return {
        ...store,
        state: next,
        turnsCompleted: store.turnsCompleted + 1,
      };
    });
  },

  reset: () => {
    const fresh = createTrialState(CANONICAL_ENGINEER_HAND);
    writeToStorage(fresh);
    set({ state: fresh, hasStarted: false, turnsCompleted: 0 });
  },
}));

/** Narrow helper: read current outcome (null until the match resolves). */
export function getC4TrialOutcome(): TrialOutcome | null {
  return useAct1C4TrialStore.getState().state.outcome;
}
