/**
 * loadingProgress — Real progress tracking for loading screens.
 *
 * Replaces the fake 2-5% increment simulation with weight-based task tracking.
 * Each loading sequence registers tasks with relative weights; overall progress
 * is (completed weight / total weight) * 100.
 */

export interface LoadingTask {
  id: string;
  label: string;
  weight: number;
  status: "pending" | "loading" | "complete" | "error";
}

type ProgressCallback = (progress: number, label: string) => void;

function createLoadingManager() {
  let tasks: LoadingTask[] = [];
  let subscribers = new Set<ProgressCallback>();

  function notify() {
    const progress = getProgress();
    const label = getCurrentLabel();
    subscribers.forEach((cb) => cb(progress, label));
  }

  function getProgress(): number {
    if (tasks.length === 0) return 0;
    const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);
    if (totalWeight === 0) return 0;
    const completedWeight = tasks
      .filter((t) => t.status === "complete")
      .reduce((sum, t) => sum + t.weight, 0);
    // Give partial credit (50% of weight) to tasks currently loading
    const loadingWeight = tasks
      .filter((t) => t.status === "loading")
      .reduce((sum, t) => sum + t.weight * 0.5, 0);
    return Math.min(Math.round(((completedWeight + loadingWeight) / totalWeight) * 100), 100);
  }

  function getCurrentLabel(): string {
    // Return the label of the first task currently loading
    const loading = tasks.find((t) => t.status === "loading");
    if (loading) return loading.label;
    // If nothing is loading, show the next pending task
    const pending = tasks.find((t) => t.status === "pending");
    if (pending) return pending.label;
    // All done or errored
    const errored = tasks.find((t) => t.status === "error");
    if (errored) return `Error: ${errored.label}`;
    return "Complete";
  }

  return {
    get tasks(): LoadingTask[] {
      return tasks;
    },

    registerTasks(defs: Pick<LoadingTask, "id" | "label" | "weight">[]) {
      tasks = defs.map((d) => ({ ...d, status: "pending" as const }));
      notify();
    },

    startTask(id: string) {
      const task = tasks.find((t) => t.id === id);
      if (task && task.status !== "complete") {
        task.status = "loading";
        notify();
      }
    },

    completeTask(id: string) {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.status = "complete";
        notify();
      }
    },

    failTask(id: string) {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.status = "error";
        notify();
      }
    },

    getProgress,
    getCurrentLabel,

    reset() {
      tasks = [];
      notify();
    },

    subscribe(callback: ProgressCallback): () => void {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    /** Check whether every task is complete */
    isComplete(): boolean {
      return tasks.length > 0 && tasks.every((t) => t.status === "complete");
    },

    /** Check whether any task has errored */
    hasError(): boolean {
      return tasks.some((t) => t.status === "error");
    },
  };
}

/** Singleton loading manager */
export const loadingManager = createLoadingManager();

// ---------------------------------------------------------------------------
// Pre-defined task sets for common loading scenarios
// ---------------------------------------------------------------------------

export const LOADING_TASKS = {
  appInit: [
    { id: "auth", label: "Authenticating signal...", weight: 2 },
    { id: "profile", label: "Loading identity matrix...", weight: 1 },
    { id: "gameData", label: "Downloading Ark schematics...", weight: 3 },
    { id: "assets", label: "Materializing resources...", weight: 2 },
    { id: "ws", label: "Establishing neural link...", weight: 1 },
  ],
  roomTransition: [
    { id: "roomData", label: "Scanning destination...", weight: 2 },
    { id: "npcLoad", label: "Locating inhabitants...", weight: 1 },
    { id: "ambience", label: "Calibrating atmosphere...", weight: 1 },
  ],
  gameMode: [
    { id: "rules", label: "Loading combat protocols...", weight: 1 },
    { id: "opponent", label: "Analyzing opponent...", weight: 2 },
    { id: "arena", label: "Constructing arena...", weight: 2 },
  ],
} as const;
