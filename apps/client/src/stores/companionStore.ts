/* ═══════════════════════════════════════════════════════
   COMPANION STORE (Zustand)

   Migration slice from GameContext.tsx for the companion
   relationship + quest + dialog-history surface.
   GameContext fields covered:
     - companionRelationships          → relationships
     - companionQuestsCompleted        → questsCompleted
     - companionQuestsActive           → questsActive
     - companionBackstoryUnlocked      → backstoryUnlocked
     - companionRomanceActive          → romanceActive
     - companionDialogHistory          → dialogHistory
     - giftsGiven                      → giftsGiven

   Subscribe narrowly so a relationship bump doesn't re-render
   pages that only care about the active quest list:

     const elara = useCompanionStore((s) => s.relationships.elara);
     const active = useCompanionStore((s) => s.questsActive);

   Migration plan: GameContext keeps its existing fields for
   back-compat. Pages adopt this store one at a time. Once every
   reader is on the store, GameContext drops the fields.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ─── */

export interface GiftRecord {
  giftId: string;
  companionId: string;
  timestamp: number;
}

export interface CompanionState {
  /** companionId → relationship score (0-100). */
  relationships: Record<string, number>;
  questsCompleted: string[];
  questsActive: string[];
  backstoryUnlocked: string[];
  romanceActive: string | null;
  /** companionId → array of dialog choice ids. */
  dialogHistory: Record<string, string[]>;
  giftsGiven: GiftRecord[];

  /* ─── Actions ─── */
  bumpRelationship: (companionId: string, delta: number) => void;
  setRelationship: (companionId: string, value: number) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  unlockBackstory: (stageId: string) => void;
  setRomance: (companionId: string | null) => void;
  recordDialogChoice: (companionId: string, choiceId: string) => void;
  recordGift: (record: GiftRecord) => void;
  /** Bulk-load from server hydration / GameContext migration. */
  hydrate: (snapshot: Partial<Omit<CompanionState,
    "bumpRelationship" | "setRelationship" | "startQuest" |
    "completeQuest" | "unlockBackstory" | "setRomance" |
    "recordDialogChoice" | "recordGift" | "hydrate" | "reset"
  >>) => void;
  /** Reset to defaults. Used by the G8 deleteMyAccount flow. */
  reset: () => void;
}

const DEFAULT_RELATIONSHIPS: Record<string, number> = {
  elara: 5,
  the_human: 0,
};

const DEFAULT_STATE = {
  relationships: { ...DEFAULT_RELATIONSHIPS },
  questsCompleted: [] as string[],
  questsActive: [] as string[],
  backstoryUnlocked: [] as string[],
  romanceActive: null as string | null,
  dialogHistory: {} as Record<string, string[]>,
  giftsGiven: [] as GiftRecord[],
};

function clampRelationship(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      bumpRelationship: (companionId, delta) =>
        set((s) => ({
          relationships: {
            ...s.relationships,
            [companionId]: clampRelationship((s.relationships[companionId] ?? 0) + delta),
          },
        })),

      setRelationship: (companionId, value) =>
        set((s) => ({
          relationships: {
            ...s.relationships,
            [companionId]: clampRelationship(value),
          },
        })),

      startQuest: (questId) =>
        set((s) =>
          s.questsActive.includes(questId)
            ? s
            : { questsActive: [...s.questsActive, questId] },
        ),

      completeQuest: (questId) =>
        set((s) => ({
          questsActive: s.questsActive.filter((q) => q !== questId),
          questsCompleted: s.questsCompleted.includes(questId)
            ? s.questsCompleted
            : [...s.questsCompleted, questId],
        })),

      unlockBackstory: (stageId) =>
        set((s) =>
          s.backstoryUnlocked.includes(stageId)
            ? s
            : { backstoryUnlocked: [...s.backstoryUnlocked, stageId] },
        ),

      setRomance: (companionId) => set({ romanceActive: companionId }),

      recordDialogChoice: (companionId, choiceId) =>
        set((s) => {
          const existing = s.dialogHistory[companionId] ?? [];
          if (existing.includes(choiceId)) return s;
          return {
            dialogHistory: {
              ...s.dialogHistory,
              [companionId]: [...existing, choiceId],
            },
          };
        }),

      recordGift: (record) =>
        set((s) => ({ giftsGiven: [...s.giftsGiven, record] })),

      hydrate: (snapshot) => set(snapshot),

      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: "loredex_companion_state_v1",
      // Persist only the data, not the action functions.
      partialize: (state) => ({
        relationships: state.relationships,
        questsCompleted: state.questsCompleted,
        questsActive: state.questsActive,
        backstoryUnlocked: state.backstoryUnlocked,
        romanceActive: state.romanceActive,
        dialogHistory: state.dialogHistory,
        giftsGiven: state.giftsGiven,
      }),
    },
  ),
);
