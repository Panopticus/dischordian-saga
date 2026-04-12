/* ═══════════════════════════════════════════════════════
   TUTORIAL ORCHESTRATOR — FTUE Flow Manager
   Manages the first-time user experience by sequencing
   tutorials based on triggers, prerequisites, and player
   progress. Works with LoreTutorialEngine to present
   tutorials at the right moment.
   ═══════════════════════════════════════════════════════ */

export interface TutorialStep {
  id: string;
  trigger: "auto" | "room_enter" | "first_action" | "level_up" | "manual";
  triggerCondition?: string;     // e.g., room ID, action name, level number
  tutorialId: string;           // Maps to LoreTutorialEngine tutorial ID
  priority: number;             // Higher = fires first when multiple are ready
  prerequisite?: string;        // ID of step that must complete first
  skippable: boolean;
  completedFlag: string;        // Flag name stored in completedTutorials / narrativeFlags
}

export interface TutorialContext {
  currentRoom?: string;
  lastAction?: string;
  playerLevel?: number;
}

export interface TutorialProgress {
  completed: number;
  total: number;
  percent: number;
}

// ─── THE FIRST SESSION FLOW ───
// Defines what tutorials fire and when, ordered by phase and priority.
export const FTUE_SEQUENCE: TutorialStep[] = [
  // Phase 1: Awakening (first 2 minutes)
  {
    id: "welcome",
    trigger: "auto",
    tutorialId: "awakening_intro",
    priority: 100,
    skippable: false,
    completedFlag: "tutorial_welcome",
  },
  {
    id: "navigation",
    trigger: "auto",
    prerequisite: "welcome",
    tutorialId: "nav_basics",
    priority: 90,
    skippable: true,
    completedFlag: "tutorial_nav",
  },

  // Phase 2: First Exploration (minutes 2-5)
  {
    id: "first_room",
    trigger: "room_enter",
    triggerCondition: "any",
    prerequisite: "navigation",
    tutorialId: "room_explore",
    priority: 80,
    skippable: true,
    completedFlag: "tutorial_first_room",
  },
  {
    id: "first_dialog",
    trigger: "first_action",
    triggerCondition: "npc_talk",
    prerequisite: "first_room",
    tutorialId: "dialog_basics",
    priority: 70,
    skippable: true,
    completedFlag: "tutorial_dialog",
  },

  // Phase 3: First Game Mode (minutes 5-10)
  {
    id: "games_intro",
    trigger: "room_enter",
    triggerCondition: "games_page",
    prerequisite: "first_dialog",
    tutorialId: "games_overview",
    priority: 60,
    skippable: true,
    completedFlag: "tutorial_games",
  },
  {
    id: "first_fight",
    trigger: "first_action",
    triggerCondition: "enter_fight",
    tutorialId: "fight_basics",
    priority: 50,
    skippable: true,
    completedFlag: "tutorial_fight",
  },

  // Phase 4: Systems (minutes 10-20)
  {
    id: "inventory_intro",
    trigger: "room_enter",
    triggerCondition: "inventory_page",
    tutorialId: "inventory_basics",
    priority: 40,
    skippable: true,
    completedFlag: "tutorial_inventory",
  },
  {
    id: "quest_intro",
    trigger: "first_action",
    triggerCondition: "quest_available",
    tutorialId: "quest_basics",
    priority: 35,
    skippable: true,
    completedFlag: "tutorial_quests",
  },
  {
    id: "loredex_intro",
    trigger: "first_action",
    triggerCondition: "discover_entry",
    tutorialId: "loredex_basics",
    priority: 30,
    skippable: true,
    completedFlag: "tutorial_loredex",
  },

  // Phase 5: Social (after level thresholds)
  {
    id: "guild_intro",
    trigger: "level_up",
    triggerCondition: "5",
    tutorialId: "guild_basics",
    priority: 20,
    skippable: true,
    completedFlag: "tutorial_guild",
  },
  {
    id: "pvp_intro",
    trigger: "level_up",
    triggerCondition: "10",
    tutorialId: "pvp_basics",
    priority: 15,
    skippable: true,
    completedFlag: "tutorial_pvp",
  },
];

/* ─── ORCHESTRATOR CLASS ─── */
export class TutorialOrchestrator {
  private completedFlags: Set<string>;
  private skippedAll: boolean;
  private sequence: TutorialStep[];

  constructor(completedFlags: Set<string>, sequence: TutorialStep[] = FTUE_SEQUENCE) {
    this.completedFlags = new Set(completedFlags);
    this.skippedAll = false;
    this.sequence = sequence;
  }

  /**
   * Check if any tutorial should fire given the current game context.
   * Returns the highest-priority ready step, or null if none qualify.
   */
  getNextTutorial(context: TutorialContext): TutorialStep | null {
    if (this.skippedAll) return null;

    const candidates = this.sequence.filter((step) => {
      // Already completed
      if (this.completedFlags.has(step.completedFlag)) return false;

      // Prerequisite not yet met
      if (step.prerequisite) {
        const prereqStep = this.sequence.find((s) => s.id === step.prerequisite);
        if (prereqStep && !this.completedFlags.has(prereqStep.completedFlag)) {
          return false;
        }
      }

      // Check trigger condition against context
      return this.matchesTrigger(step, context);
    });

    if (candidates.length === 0) return null;

    // Sort by priority descending — highest priority fires first
    candidates.sort((a, b) => b.priority - a.priority);
    return candidates[0];
  }

  /** Mark a tutorial step as completed by its step ID. */
  complete(stepId: string): void {
    const step = this.sequence.find((s) => s.id === stepId);
    if (step) {
      this.completedFlags.add(step.completedFlag);
    }
  }

  /** Skip all remaining tutorials. The FTUE is over for this player. */
  skipAll(): void {
    this.skippedAll = true;
    // Mark all skippable steps as completed so they never fire
    for (const step of this.sequence) {
      if (step.skippable) {
        this.completedFlags.add(step.completedFlag);
      }
    }
  }

  /** Returns the overall FTUE completion progress. */
  getProgress(): TutorialProgress {
    const total = this.sequence.length;
    const completed = this.sequence.filter((s) =>
      this.completedFlags.has(s.completedFlag)
    ).length;
    return {
      completed,
      total,
      percent: total === 0 ? 100 : Math.round((completed / total) * 100),
    };
  }

  /**
   * Is the player still in FTUE? Returns true if there are still
   * uncompleted tutorial steps remaining and the player hasn't skipped.
   */
  isInFTUE(): boolean {
    if (this.skippedAll) return false;
    return this.sequence.some(
      (s) => !this.completedFlags.has(s.completedFlag)
    );
  }

  /** Get all completed flag names (useful for persisting state). */
  getCompletedFlags(): Set<string> {
    return new Set(this.completedFlags);
  }

  /** Get a specific step by ID. */
  getStep(stepId: string): TutorialStep | undefined {
    return this.sequence.find((s) => s.id === stepId);
  }

  /* ─── PRIVATE ─── */

  private matchesTrigger(step: TutorialStep, context: TutorialContext): boolean {
    switch (step.trigger) {
      case "auto":
        // Auto-triggers fire as soon as prerequisites are met
        return true;

      case "room_enter":
        if (!context.currentRoom) return false;
        // "any" matches any room entry
        if (step.triggerCondition === "any") return true;
        return context.currentRoom === step.triggerCondition;

      case "first_action":
        if (!context.lastAction) return false;
        return context.lastAction === step.triggerCondition;

      case "level_up": {
        if (context.playerLevel == null) return false;
        const requiredLevel = parseInt(step.triggerCondition || "0", 10);
        return context.playerLevel >= requiredLevel;
      }

      case "manual":
        // Manual triggers are never auto-matched; they must be
        // explicitly invoked via getStep() + complete()
        return false;

      default:
        return false;
    }
  }
}
