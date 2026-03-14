/* ═══════════════════════════════════════════════════════
   GAMIFICATION CONTEXT
   Manages XP, achievements, progress, trophy case.
   Uses localStorage for anonymous users, syncs to DB for logged-in users.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import {
  type AchievementDef,
  type UserProgressData,
  type GameSaveData,
  type ArkThemeDef,
  DEFAULT_PROGRESS,
  DEFAULT_GAME_SAVE,
  DISCHORDIAN_ACHIEVEMENTS,
  ARK_THEMES,
  getLevelForXp,
  getTitleForLevel,
  LEVEL_THRESHOLDS,
} from "../../../shared/gamification";

const STORAGE_KEY = "loredex_gamification";

interface GamificationState {
  xp: number;
  level: number;
  points: number;
  title: string;
  progress: UserProgressData;
  gameSave: GameSaveData;
  earnedAchievements: string[];
  selectedThemeId: string;
  newAchievement: AchievementDef | null;
}

interface GamificationContextValue extends GamificationState {
  // Actions
  discoverEntry: (entryId: string) => void;
  watchEpisode: (episodeId: string) => void;
  recordFightWin: (difficulty: string, perfect: boolean) => void;
  recordFightLoss: () => void;
  useSpecial: () => void;
  findConnection: (count?: number) => void;
  readDoomScroll: (count?: number) => void;
  markTimelineExplored: () => void;
  markBoardExplored: () => void;
  unlockFighter: (fighterId: string) => boolean;
  spendPoints: (amount: number) => boolean;
  setTheme: (themeId: string) => void;
  dismissNewAchievement: () => void;
  // Computed
  achievements: AchievementDef[];
  themes: ArkThemeDef[];
  availableThemes: ArkThemeDef[];
  currentTheme: ArkThemeDef;
  xpToNextLevel: number;
  xpProgress: number;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

function loadState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        xp: parsed.xp ?? 0,
        level: parsed.level ?? 1,
        points: parsed.points ?? 0,
        title: parsed.title ?? "Recruit",
        progress: { ...DEFAULT_PROGRESS, ...parsed.progress },
        gameSave: { ...DEFAULT_GAME_SAVE, ...parsed.gameSave },
        earnedAchievements: parsed.earnedAchievements ?? [],
        selectedThemeId: parsed.selectedThemeId ?? "default",
        newAchievement: null,
      };
    }
  } catch { /* ignore */ }
  return {
    xp: 0, level: 1, points: 0, title: "Recruit",
    progress: { ...DEFAULT_PROGRESS },
    gameSave: { ...DEFAULT_GAME_SAVE },
    earnedAchievements: [],
    selectedThemeId: "default",
    newAchievement: null,
  };
}

function saveState(state: GamificationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      xp: state.xp,
      level: state.level,
      points: state.points,
      title: state.title,
      progress: state.progress,
      gameSave: state.gameSave,
      earnedAchievements: state.earnedAchievements,
      selectedThemeId: state.selectedThemeId,
    }));
  } catch { /* ignore */ }
}

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(loadState);

  // Persist on every change
  useEffect(() => { saveState(state); }, [state]);

  // Check achievements after state changes
  const checkAchievements = useCallback((s: GamificationState): GamificationState => {
    let newState = { ...s };
    let awarded: AchievementDef | null = null;

    for (const ach of DISCHORDIAN_ACHIEVEMENTS) {
      if (newState.earnedAchievements.includes(ach.achievementId)) continue;

      let earned = false;
      const cond = ach.condition;

      switch (cond.type) {
        case "discover_entries":
          earned = newState.progress.discoveredEntries.length >= (cond.count ?? 0);
          break;
        case "watch_episodes":
          earned = newState.progress.watchedEpisodes.length >= (cond.count ?? 0);
          break;
        case "fight_wins":
          earned = newState.progress.fightWins >= (cond.count ?? 0);
          break;
        case "perfect_wins":
          earned = newState.progress.perfectWins >= (cond.count ?? 0);
          break;
        case "win_streak":
          earned = newState.gameSave.bestWinStreak >= (cond.count ?? 0);
          break;
        case "nightmare_win":
          earned = newState.gameSave.highestDifficulty === "nightmare";
          break;
        case "unlock_fighters":
          earned = newState.gameSave.unlockedFighters.length >= (cond.count ?? 0);
          break;
        case "connections_found":
          earned = newState.progress.connectionsFound >= (cond.count ?? 0);
          break;
        case "doom_scroll_read":
          earned = newState.progress.doomScrollRead >= (cond.count ?? 0);
          break;
        case "timeline_explored":
          earned = newState.progress.timelineExplored;
          break;
        case "board_explored":
          earned = newState.progress.boardExplored;
          break;
        case "reach_level":
          earned = newState.level >= (cond.count ?? 0);
          break;
      }

      if (earned) {
        newState.earnedAchievements = [...newState.earnedAchievements, ach.achievementId];
        newState.xp += ach.xpReward;
        newState.points += ach.pointsReward;
        awarded = ach;
        // Recalculate level
        newState.level = getLevelForXp(newState.xp);
        newState.title = getTitleForLevel(newState.level);
      }
    }

    if (awarded) {
      newState.newAchievement = awarded;
    }

    return newState;
  }, []);

  const update = useCallback((updater: (s: GamificationState) => GamificationState) => {
    setState(prev => {
      const updated = updater(prev);
      return checkAchievements(updated);
    });
  }, [checkAchievements]);

  const discoverEntry = useCallback((entryId: string) => {
    update(s => {
      if (s.progress.discoveredEntries.includes(entryId)) return s;
      return {
        ...s,
        xp: s.xp + 5,
        level: getLevelForXp(s.xp + 5),
        title: getTitleForLevel(getLevelForXp(s.xp + 5)),
        progress: {
          ...s.progress,
          discoveredEntries: [...s.progress.discoveredEntries, entryId],
        },
      };
    });
  }, [update]);

  const watchEpisode = useCallback((episodeId: string) => {
    update(s => {
      if (s.progress.watchedEpisodes.includes(episodeId)) return s;
      return {
        ...s,
        xp: s.xp + 15,
        level: getLevelForXp(s.xp + 15),
        title: getTitleForLevel(getLevelForXp(s.xp + 15)),
        progress: {
          ...s.progress,
          watchedEpisodes: [...s.progress.watchedEpisodes, episodeId],
        },
      };
    });
  }, [update]);

  const recordFightWin = useCallback((difficulty: string, perfect: boolean) => {
    const xpGain = difficulty === "nightmare" ? 50 : difficulty === "hard" ? 30 : difficulty === "normal" ? 20 : 10;
    const ptGain = difficulty === "nightmare" ? 100 : difficulty === "hard" ? 60 : difficulty === "normal" ? 40 : 20;
    update(s => {
      const newStreak = s.gameSave.winStreak + 1;
      const diffOrder = ["easy", "normal", "hard", "nightmare"];
      const currentIdx = diffOrder.indexOf(s.gameSave.highestDifficulty);
      const newIdx = diffOrder.indexOf(difficulty);
      return {
        ...s,
        xp: s.xp + xpGain,
        points: s.points + ptGain,
        level: getLevelForXp(s.xp + xpGain),
        title: getTitleForLevel(getLevelForXp(s.xp + xpGain)),
        progress: {
          ...s.progress,
          fightWins: s.progress.fightWins + 1,
          perfectWins: perfect ? s.progress.perfectWins + 1 : s.progress.perfectWins,
        },
        gameSave: {
          ...s.gameSave,
          fightPoints: s.gameSave.fightPoints + ptGain,
          totalFights: s.gameSave.totalFights + 1,
          winStreak: newStreak,
          bestWinStreak: Math.max(s.gameSave.bestWinStreak, newStreak),
          highestDifficulty: newIdx > currentIdx ? difficulty : s.gameSave.highestDifficulty,
        },
      };
    });
  }, [update]);

  const recordFightLoss = useCallback(() => {
    update(s => ({
      ...s,
      xp: s.xp + 3,
      level: getLevelForXp(s.xp + 3),
      title: getTitleForLevel(getLevelForXp(s.xp + 3)),
      progress: { ...s.progress, fightLosses: s.progress.fightLosses + 1 },
      gameSave: { ...s.gameSave, totalFights: s.gameSave.totalFights + 1, winStreak: 0 },
    }));
  }, [update]);

  const useSpecial = useCallback(() => {
    update(s => ({
      ...s,
      progress: { ...s.progress, specialsUsed: s.progress.specialsUsed + 1 },
    }));
  }, [update]);

  const findConnection = useCallback((count = 1) => {
    update(s => ({
      ...s,
      xp: s.xp + 2 * count,
      level: getLevelForXp(s.xp + 2 * count),
      title: getTitleForLevel(getLevelForXp(s.xp + 2 * count)),
      progress: { ...s.progress, connectionsFound: s.progress.connectionsFound + count },
    }));
  }, [update]);

  const readDoomScroll = useCallback((count = 1) => {
    update(s => ({
      ...s,
      progress: { ...s.progress, doomScrollRead: s.progress.doomScrollRead + count },
    }));
  }, [update]);

  const markTimelineExplored = useCallback(() => {
    update(s => ({
      ...s,
      xp: s.xp + 10,
      level: getLevelForXp(s.xp + 10),
      title: getTitleForLevel(getLevelForXp(s.xp + 10)),
      progress: { ...s.progress, timelineExplored: true },
    }));
  }, [update]);

  const markBoardExplored = useCallback(() => {
    update(s => ({
      ...s,
      xp: s.xp + 10,
      level: getLevelForXp(s.xp + 10),
      title: getTitleForLevel(getLevelForXp(s.xp + 10)),
      progress: { ...s.progress, boardExplored: true },
    }));
  }, [update]);

  const unlockFighter = useCallback((fighterId: string): boolean => {
    let success = false;
    update(s => {
      if (s.gameSave.unlockedFighters.includes(fighterId)) return s;
      // Find cost from game data (imported separately)
      success = true;
      return {
        ...s,
        gameSave: {
          ...s.gameSave,
          unlockedFighters: [...s.gameSave.unlockedFighters, fighterId],
        },
      };
    });
    return success;
  }, [update]);

  const spendPoints = useCallback((amount: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.gameSave.fightPoints >= amount) {
        success = true;
        const newState = {
          ...prev,
          gameSave: { ...prev.gameSave, fightPoints: prev.gameSave.fightPoints - amount },
        };
        saveState(newState);
        return newState;
      }
      return prev;
    });
    return success;
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setState(prev => {
      const newState = { ...prev, selectedThemeId: themeId };
      saveState(newState);
      return newState;
    });
  }, []);

  const dismissNewAchievement = useCallback(() => {
    setState(prev => ({ ...prev, newAchievement: null }));
  }, []);

  const currentTheme = ARK_THEMES.find(t => t.id === state.selectedThemeId) ?? ARK_THEMES[0];
  const availableThemes = ARK_THEMES.filter(t => state.level >= t.unlockLevel);
  const currentLevelThreshold = LEVEL_THRESHOLDS[state.level - 1] ?? 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[state.level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpToNextLevel = nextLevelThreshold - state.xp;
  const xpProgress = nextLevelThreshold > currentLevelThreshold
    ? ((state.xp - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100
    : 100;

  return (
    <GamificationContext.Provider value={{
      ...state,
      discoverEntry,
      watchEpisode,
      recordFightWin,
      recordFightLoss,
      useSpecial,
      findConnection,
      readDoomScroll,
      markTimelineExplored,
      markBoardExplored,
      unlockFighter,
      spendPoints,
      setTheme,
      dismissNewAchievement,
      achievements: DISCHORDIAN_ACHIEVEMENTS,
      themes: ARK_THEMES,
      availableThemes,
      currentTheme,
      xpToNextLevel,
      xpProgress,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
