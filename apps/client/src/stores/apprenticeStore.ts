/* ═══════════════════════════════════════════════════════
   APPRENTICE STORE (Zustand)

   First greenfield Zustand store — migration target for the
   state.apprentice / state.apprenticeFallen / state.legionGraduates
   fields currently in GameContext.

   Not yet wired as primary source — components currently still
   read from GameContext. This store exists as the migration
   destination, with a bridge layer planned for when GameContext
   consumers are gradually swapped over.

   Use `useApprenticeStore(s => s.current)` to subscribe to just
   the current apprentice — component will not re-render when
   fallen/graduates change.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Apprentice } from "@shared/apprentices";

interface ApprenticeStore {
  /** The currently-living Apprentice (in training, graduated, companion, corrupted) */
  current: Apprentice | null;
  /** History of fallen Apprentices */
  fallen: Apprentice[];
  /** Graduated apprentices available for deployment */
  graduates: Record<string, Apprentice>;
  /** Cooldown timestamp after a fallen apprentice */
  recruitCooldownUntil: number;

  // Actions
  setCurrent: (apprentice: Apprentice | null) => void;
  updateCurrent: (partial: Partial<Apprentice>) => void;
  recordFallen: (apprentice: Apprentice) => void;
  addGraduate: (apprentice: Apprentice) => void;
  removeGraduate: (id: string) => void;
  setRecruitCooldown: (untilTs: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  current: null,
  fallen: [],
  graduates: {},
  recruitCooldownUntil: 0,
};

export const useApprenticeStore = create<ApprenticeStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCurrent: (apprentice) => set({ current: apprentice }),

      updateCurrent: (partial) => set((state) => ({
        current: state.current ? { ...state.current, ...partial } : null,
      })),

      recordFallen: (apprentice) => set((state) => ({
        fallen: [...state.fallen, apprentice],
        current: state.current?.id === apprentice.id ? null : state.current,
      })),

      addGraduate: (apprentice) => set((state) => ({
        graduates: { ...state.graduates, [apprentice.id]: apprentice },
        current: state.current?.id === apprentice.id ? null : state.current,
      })),

      removeGraduate: (id) => set((state) => {
        const next = { ...state.graduates };
        delete next[id];
        return { graduates: next };
      }),

      setRecruitCooldown: (untilTs) => set({ recruitCooldownUntil: untilTs }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-apprentice",
      version: 1,
    },
  ),
);

/* ─── SELECTORS (for slice-level subscriptions) ─── */

export const selectCurrentApprentice = (s: ApprenticeStore) => s.current;
export const selectFallenCount = (s: ApprenticeStore) => s.fallen.length;
export const selectGraduateCount = (s: ApprenticeStore) => Object.keys(s.graduates).length;
export const selectCanRecruit = (s: ApprenticeStore) =>
  !s.current && Date.now() >= s.recruitCooldownUntil;
