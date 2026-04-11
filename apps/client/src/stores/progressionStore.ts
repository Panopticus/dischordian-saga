/* ═══════════════════════════════════════════════════════
   PROGRESSION STORE (Zustand)

   Player progression: game phase, narrative act, completed
   tutorials/games, CoNexus XP, lore achievements, room &
   item totals. Migration target for state.phase /
   state.narrativeAct / state.completedTutorials /
   state.completedGames / state.conexusXp /
   state.loreAchievements / state.totalRoomsUnlocked /
   state.totalItemsFound.

   Use `useProgressionStore(s => s.phase)` to subscribe to
   just the game phase — component will not re-render when
   XP or achievements change.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GamePhase = "FIRST_VISIT" | "AWAKENING" | "QUARTERS_UNLOCKED" | "EXPLORING" | "FULL_ACCESS";

interface ProgressionStore {
  /** Current game phase */
  phase: GamePhase;
  /** Current narrative act (0 = not started, 1-7) */
  narrativeAct: number;
  /** Tutorial IDs the player has completed */
  completedTutorials: string[];
  /** CoNexus game IDs the player has completed */
  completedGames: string[];
  /** XP earned from CoNexus game completions */
  conexusXp: number;
  /** Lore achievement IDs earned */
  loreAchievements: string[];
  /** Total rooms unlocked so far */
  totalRoomsUnlocked: number;
  /** Total items found so far */
  totalItemsFound: number;

  // Actions
  setPhase: (phase: GamePhase) => void;
  setNarrativeAct: (actId: number) => void;
  completeTutorial: (tutorialId: string) => void;
  completeGame: (gameId: string) => void;
  addConexusXp: (amount: number) => void;
  earnLoreAchievement: (achievementId: string, xpGain: number) => void;
  setTotalRoomsUnlocked: (count: number) => void;
  setTotalItemsFound: (count: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  phase: "FIRST_VISIT" as GamePhase,
  narrativeAct: 0,
  completedTutorials: [] as string[],
  completedGames: [] as string[],
  conexusXp: 0,
  loreAchievements: [] as string[],
  totalRoomsUnlocked: 0,
  totalItemsFound: 0,
};

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setPhase: (phase) => set({ phase }),

      setNarrativeAct: (actId) => set({ narrativeAct: actId }),

      completeTutorial: (tutorialId) => set((state) => ({
        completedTutorials: state.completedTutorials.includes(tutorialId)
          ? state.completedTutorials
          : [...state.completedTutorials, tutorialId],
      })),

      completeGame: (gameId) => set((state) => ({
        completedGames: state.completedGames.includes(gameId)
          ? state.completedGames
          : [...state.completedGames, gameId],
      })),

      addConexusXp: (amount) => set((state) => ({
        conexusXp: state.conexusXp + amount,
      })),

      earnLoreAchievement: (achievementId, xpGain) => set((state) => ({
        loreAchievements: state.loreAchievements.includes(achievementId)
          ? state.loreAchievements
          : [...state.loreAchievements, achievementId],
        conexusXp: state.loreAchievements.includes(achievementId)
          ? state.conexusXp
          : state.conexusXp + xpGain,
      })),

      setTotalRoomsUnlocked: (count) => set({ totalRoomsUnlocked: count }),

      setTotalItemsFound: (count) => set({ totalItemsFound: count }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "dischordian-progression",
      version: 1,
    },
  ),
);

/* ─── SELECTORS (for slice-level subscriptions) ─── */

export const selectPhase = (s: ProgressionStore) => s.phase;
export const selectNarrativeAct = (s: ProgressionStore) => s.narrativeAct;
export const selectConexusXp = (s: ProgressionStore) => s.conexusXp;
export const selectCompletedTutorials = (s: ProgressionStore) => s.completedTutorials;
export const selectIsTutorialComplete = (tutorialId: string) =>
  (s: ProgressionStore) => s.completedTutorials.includes(tutorialId);
export const selectIsGameComplete = (gameId: string) =>
  (s: ProgressionStore) => s.completedGames.includes(gameId);
export const selectLoreAchievementCount = (s: ProgressionStore) => s.loreAchievements.length;
export const selectTotalRoomsUnlocked = (s: ProgressionStore) => s.totalRoomsUnlocked;
export const selectTotalItemsFound = (s: ProgressionStore) => s.totalItemsFound;
export const selectIsFullAccess = (s: ProgressionStore) => s.phase === "FULL_ACCESS";
