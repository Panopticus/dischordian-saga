/**
 * useLoadingProgress — React hook wrapping loadingManager for reactive UI.
 *
 * Returns current progress percentage, task label, and completion/error flags.
 * Automatically subscribes on mount and unsubscribes on unmount.
 */
import { useState, useEffect, useCallback } from "react";
import { loadingManager } from "@/lib/loadingProgress";

export interface LoadingProgressState {
  /** Overall progress 0-100 */
  progress: number;
  /** Current task label for display */
  label: string;
  /** All tasks complete */
  isComplete: boolean;
  /** Any task errored */
  isError: boolean;
}

export function useLoadingProgress(): LoadingProgressState {
  const [state, setState] = useState<LoadingProgressState>(() => ({
    progress: loadingManager.getProgress(),
    label: loadingManager.getCurrentLabel(),
    isComplete: loadingManager.isComplete(),
    isError: loadingManager.hasError(),
  }));

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((progress, label) => {
      setState({
        progress,
        label,
        isComplete: loadingManager.isComplete(),
        isError: loadingManager.hasError(),
      });
    });
    return unsubscribe;
  }, []);

  return state;
}

/**
 * useLoadingWithFallback — Uses real progress when tasks are registered,
 * otherwise falls back to the simulated progress animation.
 *
 * This lets LoadingScreen work with both the new real-progress system
 * and legacy call-sites that don't register tasks.
 */
export function useLoadingWithFallback(): LoadingProgressState & { isReal: boolean } {
  const real = useLoadingProgress();
  const [simulated, setSimulated] = useState(0);

  const hasTasks = loadingManager.tasks.length > 0;

  useEffect(() => {
    if (hasTasks) return; // real progress active, skip simulation
    const interval = setInterval(() => {
      setSimulated((p) => Math.min(p + 2 + Math.random() * 5, 95));
    }, 200);
    return () => clearInterval(interval);
  }, [hasTasks]);

  if (hasTasks) {
    return { ...real, isReal: true };
  }

  return {
    progress: simulated,
    label: "",
    isComplete: false,
    isError: false,
    isReal: false,
  };
}
