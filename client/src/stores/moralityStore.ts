/* ═══════════════════════════════════════════════════════
   MORALITY STORE (Zustand)

   Morality score (-100 Machine to +100 Humanity), moral
   choices history, morality-gated unlocks, and secret
   transmissions. Migration target for state.moralityScore /
   state.moralityChoices / state.moralityUnlocks /
   state.discoveredTransmissions.

   Use `useMoralityStore(s => s.score)` to subscribe to just
   the morality score — component will not re-render when
   choices or unlocks change.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MoralChoice {
  tutorialId: string;
  choiceId: string;
  shift: number;
}

interface MoralityStore {
  /** -100 (Machine) to +100 (Humanity) */
  score: number;
  /** History of morality-affecting choices */
  choices: MoralChoice[];
  /** IDs of morality-gated items/themes unlocked */
  unlocks: string[];
  /** IDs of secret morality-gated transmissions found */
  discoveredTransmissions: string[];

  // Actions
  shiftMorality: (amount: number, tutorialId?: string, choiceId?: string) => void;
  unlockReward: (rewardId: string) => void;
  discoverTransmission: (transmissionId: string) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  score: 0,
  choices: [] as MoralChoice[],
  unlocks: [] as string[],
  discoveredTransmissions: [] as string[],
};

export const useMoralityStore = create<MoralityStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      shiftMorality: (amount, tutorialId, choiceId) => set((state) => {
        const newScore = Math.max(-100, Math.min(100, state.score + amount));
        const newChoices = tutorialId && choiceId
          ? [...state.choices, { tutorialId, choiceId, shift: amount }]
          : state.choices;
        return { score: newScore, choices: newChoices };
      }),

      unlockReward: (rewardId) => set((state) => ({
        unlocks: state.unlocks.includes(rewardId)
          ? state.unlocks
          : [...state.unlocks, rewardId],
      })),

      discoverTransmission: (transmissionId) => set((state) => ({
        discoveredTransmissions: state.discoveredTransmissions.includes(transmissionId)
          ? state.discoveredTransmissions
          : [...state.discoveredTransmissions, transmissionId],
      })),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-morality",
      version: 1,
    },
  ),
);

/* ─── SELECTORS (for slice-level subscriptions) ─── */

export const selectScore = (s: MoralityStore) => s.score;
export const selectChoices = (s: MoralityStore) => s.choices;
export const selectUnlocks = (s: MoralityStore) => s.unlocks;

export const selectMoralityLabel = (s: MoralityStore): string => {
  const sc = s.score;
  if (sc <= -80) return "Machine Ascendant";
  if (sc <= -60) return "Machine Devoted";
  if (sc <= -40) return "Machine Aligned";
  if (sc <= -20) return "Machine Leaning";
  if (sc < 20) return "Balanced";
  if (sc < 40) return "Humanity Leaning";
  if (sc < 60) return "Humanity Aligned";
  if (sc < 80) return "Humanity Devoted";
  return "Humanity Ascendant";
};

export const selectMoralityTier = (s: MoralityStore): { tier: string; level: number } => {
  const abs = Math.abs(s.score);
  const side = s.score <= 0 ? "machine" : "humanity";
  if (abs >= 80) return { tier: side, level: 5 };
  if (abs >= 60) return { tier: side, level: 4 };
  if (abs >= 40) return { tier: side, level: 3 };
  if (abs >= 20) return { tier: side, level: 2 };
  return { tier: "balanced", level: 1 };
};

export const selectIsTransmissionDiscovered = (transmissionId: string) =>
  (s: MoralityStore) => s.discoveredTransmissions.includes(transmissionId);
