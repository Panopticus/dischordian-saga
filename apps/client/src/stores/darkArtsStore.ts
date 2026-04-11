/* ═══════════════════════════════════════════════════════
   DARK ARTS STORE (Zustand)

   Corruption level + purge ritual history + dark ability
   tracking. Migration target for state.corruptionLevel /
   state.purgeRitualsCompleted / state.darkAbilitiesUsed.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDarkTier, type DarkTierInfo } from "@shared/darkArts";

interface DarkArtsStore {
  /** 0-100 corruption */
  corruptionLevel: number;
  /** IDs of dark variants the player has activated */
  abilitiesUsed: string[];
  /** IDs of purge rituals completed */
  purgeRitualsCompleted: string[];

  // Actions
  addCorruption: (amount: number) => void;
  removeCorruption: (amount: number) => void;
  recordAbilityUse: (abilityId: string) => void;
  completeRitual: (ritualId: string, reduction: number) => void;
  reset: () => void;
}

const INITIAL = {
  corruptionLevel: 0,
  abilitiesUsed: [] as string[],
  purgeRitualsCompleted: [] as string[],
};

export const useDarkArtsStore = create<DarkArtsStore>()(
  persist(
    (set) => ({
      ...INITIAL,

      addCorruption: (amount) => set((state) => ({
        corruptionLevel: Math.max(0, Math.min(100, state.corruptionLevel + amount)),
      })),

      removeCorruption: (amount) => set((state) => ({
        corruptionLevel: Math.max(0, state.corruptionLevel - amount),
      })),

      recordAbilityUse: (abilityId) => set((state) => ({
        abilitiesUsed: state.abilitiesUsed.includes(abilityId)
          ? state.abilitiesUsed
          : [...state.abilitiesUsed, abilityId],
      })),

      completeRitual: (ritualId, reduction) => set((state) => ({
        corruptionLevel: Math.max(0, state.corruptionLevel - reduction),
        purgeRitualsCompleted: [...state.purgeRitualsCompleted, ritualId],
      })),

      reset: () => set(INITIAL),
    }),
    {
      name: "dischordian-dark-arts",
      version: 1,
    },
  ),
);

/* ─── SELECTORS ─── */

export const selectCorruption = (s: DarkArtsStore) => s.corruptionLevel;
export const selectTier = (s: DarkArtsStore): DarkTierInfo => getDarkTier(s.corruptionLevel);
export const selectHasUsedDarkArts = (s: DarkArtsStore) => s.abilitiesUsed.length > 0;
export const selectPurgeCount = (s: DarkArtsStore) => s.purgeRitualsCompleted.length;
