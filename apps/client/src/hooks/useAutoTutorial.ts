/* ═══════════════════════════════════════════════════════
   useAutoTutorial — Auto-launches relevant tutorial on first visit
   Checks localStorage for visited pages, triggers tutorial engine
   if the player hasn't seen the tutorial for the current route.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { getTutorialForRoute, type LoreTutorial } from "@/data/loreTutorials";

const STORAGE_KEY = "loredex_auto_tutorial_dismissed";
const VISITED_KEY = "loredex_visited_pages";

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function getVisited(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VISITED_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDismissed(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function saveVisited(pages: string[]) {
  localStorage.setItem(VISITED_KEY, JSON.stringify(pages));
}

interface UseAutoTutorialResult {
  /** The tutorial that should auto-launch (null if none) */
  autoTutorial: LoreTutorial | null;
  /** Whether the auto-tutorial overlay should be shown */
  showAutoTutorial: boolean;
  /** Call to launch the full tutorial engine */
  launchTutorial: () => void;
  /** Call to dismiss the auto-tutorial prompt (won't show again) */
  dismissTutorial: () => void;
  /** Call to snooze (dismiss for this session only) */
  snoozeTutorial: () => void;
}

/**
 * Hook that auto-triggers tutorial prompts on first page visit.
 * @param route - The current route path (e.g., "/fight")
 */
export function useAutoTutorial(route: string): UseAutoTutorialResult {
  const { isTutorialCompleted } = useGame();
  const [showAutoTutorial, setShowAutoTutorial] = useState(false);
  const [autoTutorial, setAutoTutorial] = useState<LoreTutorial | null>(null);
  const [snoozed, setSnoozed] = useState(false);

  useEffect(() => {
    if (snoozed) return;

    const tutorial = getTutorialForRoute(route);
    if (!tutorial) return;

    // Already completed this tutorial
    if (isTutorialCompleted(tutorial.id)) return;

    // Already dismissed permanently
    const dismissed = getDismissed();
    if (dismissed.includes(tutorial.id)) return;

    // Check if this is the first visit to this page
    const visited = getVisited();
    if (visited.includes(route)) return;

    // Mark page as visited
    saveVisited([...visited, route]);

    // Auto-trigger after a short delay to let the page render
    const timer = setTimeout(() => {
      setAutoTutorial(tutorial);
      setShowAutoTutorial(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [route, isTutorialCompleted, snoozed]);

  const launchTutorial = useCallback(() => {
    setShowAutoTutorial(false);
  }, []);

  const dismissTutorial = useCallback(() => {
    if (autoTutorial) {
      const dismissed = getDismissed();
      if (!dismissed.includes(autoTutorial.id)) {
        saveDismissed([...dismissed, autoTutorial.id]);
      }
    }
    setShowAutoTutorial(false);
    setAutoTutorial(null);
  }, [autoTutorial]);

  const snoozeTutorial = useCallback(() => {
    setSnoozed(true);
    setShowAutoTutorial(false);
  }, []);

  return {
    autoTutorial,
    showAutoTutorial,
    launchTutorial,
    dismissTutorial,
    snoozeTutorial,
  };
}
