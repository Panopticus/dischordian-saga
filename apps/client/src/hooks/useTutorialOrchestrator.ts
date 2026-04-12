/* ═══════════════════════════════════════════════════════
   useTutorialOrchestrator — React hook for FTUE pacing
   Creates and caches a TutorialOrchestrator instance,
   reads completed flags from player progress, and
   provides methods to check/complete/skip tutorials.
   Integrates with LoreTutorialEngine via the existing
   GameContext tutorial system.
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { getTutorialById } from "@/data/loreTutorials";
import type { LoreTutorial, TutorialReward } from "@/data/loreTutorials";
import {
  TutorialOrchestrator,
  FTUE_SEQUENCE,
  type TutorialStep,
  type TutorialContext,
  type TutorialProgress,
} from "@/lib/tutorialOrchestrator";

const FTUE_FLAGS_STORAGE_KEY = "loredex_ftue_flags";
const FTUE_SKIPPED_KEY = "loredex_ftue_skipped";

/* ─── PERSISTENCE HELPERS ─── */

function loadPersistedFlags(): Set<string> {
  try {
    const raw = localStorage.getItem(FTUE_FLAGS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistFlags(flags: Set<string>): void {
  try {
    localStorage.setItem(FTUE_FLAGS_STORAGE_KEY, JSON.stringify([...flags]));
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

function loadSkippedState(): boolean {
  try {
    return localStorage.getItem(FTUE_SKIPPED_KEY) === "true";
  } catch {
    return false;
  }
}

function persistSkipped(): void {
  try {
    localStorage.setItem(FTUE_SKIPPED_KEY, "true");
  } catch {
    // noop
  }
}

/* ─── HOOK RETURN TYPE ─── */

export interface UseTutorialOrchestratorResult {
  /** Check if a tutorial should fire for the current context; returns the matching step or null. */
  checkTutorial: (context: TutorialContext) => TutorialStep | null;
  /** Mark a tutorial step as completed (by step ID). Also marks the underlying LoreTutorial as completed. */
  completeTutorial: (stepId: string) => void;
  /** Handle the full completion callback from LoreTutorialEngine (rewards, morality, flags). */
  handleTutorialComplete: (
    stepId: string,
    rewards: TutorialReward[],
    moralityTotal: number,
    flags: Record<string, boolean>,
  ) => void;
  /** Skip all remaining FTUE tutorials. */
  skipAll: () => void;
  /** Current FTUE progress stats. */
  progress: TutorialProgress;
  /** Whether the player is still in FTUE. */
  isInFTUE: boolean;
  /** Resolve a tutorial step's tutorialId to the full LoreTutorial data (for rendering). */
  getTutorialData: (tutorialId: string) => LoreTutorial | undefined;
  /** The currently active tutorial step (set by checkTutorial, cleared on complete/skip). */
  activeStep: TutorialStep | null;
  /** Dismiss the active tutorial prompt without completing it. */
  dismissActive: () => void;
}

/* ─── HOOK ─── */

export function useTutorialOrchestrator(): UseTutorialOrchestratorResult {
  const {
    state,
    completeTutorial: gameCompleteTutorial,
    shiftMorality,
    collectCard,
  } = useGame();

  // Build initial flag set from both FTUE persistence and GameContext completedTutorials
  const initialFlags = useMemo(() => {
    const persisted = loadPersistedFlags();
    // Also seed from GameContext's completedTutorials — map tutorial IDs back to FTUE flags
    for (const tutId of state.completedTutorials) {
      const step = FTUE_SEQUENCE.find((s) => s.tutorialId === tutId);
      if (step) {
        persisted.add(step.completedFlag);
      }
    }
    return persisted;
  }, []); // Only compute once on mount — subsequent updates go through complete()

  // Stable ref-backed orchestrator (recreated only when completedTutorials change externally)
  const orchestratorRef = useRef<TutorialOrchestrator | null>(null);
  if (!orchestratorRef.current) {
    orchestratorRef.current = new TutorialOrchestrator(initialFlags);
    // Restore skipped state
    if (loadSkippedState()) {
      orchestratorRef.current.skipAll();
    }
  }
  const orchestrator = orchestratorRef.current;

  // Track the currently active (prompted) tutorial step
  const [activeStep, setActiveStep] = useState<TutorialStep | null>(null);

  // Re-derive progress on flag changes
  const [progress, setProgress] = useState<TutorialProgress>(() =>
    orchestrator.getProgress()
  );
  const [isInFTUE, setIsInFTUE] = useState<boolean>(() =>
    orchestrator.isInFTUE()
  );

  const refreshState = useCallback(() => {
    setProgress(orchestrator.getProgress());
    setIsInFTUE(orchestrator.isInFTUE());
  }, [orchestrator]);

  // Sync if GameContext completedTutorials changes (e.g., from another tab or server sync)
  useEffect(() => {
    let changed = false;
    for (const tutId of state.completedTutorials) {
      const step = FTUE_SEQUENCE.find((s) => s.tutorialId === tutId);
      if (step && !orchestrator.getCompletedFlags().has(step.completedFlag)) {
        orchestrator.complete(step.id);
        changed = true;
      }
    }
    if (changed) {
      persistFlags(orchestrator.getCompletedFlags());
      refreshState();
    }
  }, [state.completedTutorials, orchestrator, refreshState]);

  /** Check if a tutorial should fire right now. Sets activeStep if one is found. */
  const checkTutorial = useCallback(
    (context: TutorialContext): TutorialStep | null => {
      // Don't overwrite an already-active tutorial prompt
      if (activeStep) return activeStep;

      const next = orchestrator.getNextTutorial(context);
      if (next) {
        setActiveStep(next);
      }
      return next;
    },
    [orchestrator, activeStep]
  );

  /** Mark a step completed (flag persistence + GameContext sync). */
  const completeTutorial = useCallback(
    (stepId: string) => {
      const step = orchestrator.getStep(stepId);
      if (!step) return;

      orchestrator.complete(stepId);
      persistFlags(orchestrator.getCompletedFlags());

      // Also mark in GameContext so the rest of the app knows
      gameCompleteTutorial(step.tutorialId);

      // Clear active step if it matches
      setActiveStep((prev) => (prev?.id === stepId ? null : prev));
      refreshState();
    },
    [orchestrator, gameCompleteTutorial, refreshState]
  );

  /** Full completion handler — call from LoreTutorialEngine's onComplete callback. */
  const handleTutorialComplete = useCallback(
    (
      stepId: string,
      rewards: TutorialReward[],
      moralityTotal: number,
      flags: Record<string, boolean>,
    ) => {
      // Apply morality shift
      if (moralityTotal !== 0) {
        const step = orchestrator.getStep(stepId);
        shiftMorality(moralityTotal, step?.tutorialId);
      }

      // Apply card rewards
      for (const reward of rewards) {
        if (reward.type === "card" && reward.id) {
          collectCard(reward.id);
        }
      }

      // Complete the step
      completeTutorial(stepId);
    },
    [orchestrator, shiftMorality, collectCard, completeTutorial]
  );

  /** Skip all remaining FTUE tutorials. */
  const skipAll = useCallback(() => {
    orchestrator.skipAll();
    persistFlags(orchestrator.getCompletedFlags());
    persistSkipped();
    setActiveStep(null);
    refreshState();
  }, [orchestrator, refreshState]);

  /** Dismiss the active tutorial without completing it (snooze). */
  const dismissActive = useCallback(() => {
    setActiveStep(null);
  }, []);

  /** Resolve a tutorialId to LoreTutorial data for rendering in LoreTutorialEngine. */
  const getTutorialData = useCallback(
    (tutorialId: string): LoreTutorial | undefined => {
      return getTutorialById(tutorialId);
    },
    []
  );

  return {
    checkTutorial,
    completeTutorial,
    handleTutorialComplete,
    skipAll,
    progress,
    isInFTUE,
    getTutorialData,
    activeStep,
    dismissActive,
  };
}
