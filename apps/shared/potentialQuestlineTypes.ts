/* ═══════════════════════════════════════════════════════
   POTENTIAL QUESTLINE TYPES

   Shared chapter schema for every Potential Identity
   questline: race (DeMagi, Quarchon), class (Engineer,
   Oracle, Assassin, Soldier, Spy), and element (Fire,
   Earth, Time, Reality). One shape so every questline
   file can be validated by the same rule.
   ═══════════════════════════════════════════════════════ */

import type { WheelOption } from "./dialogWheel";

export interface PotentialQuestlineBeat {
  /** NPC id — one of the 8 faction NPCs or the 7 original Ark NPCs. */
  speaker: string;
  /** Speech text, or null for stage direction only. */
  text?: string;
  /** Italicized stage direction shown in the dialog overlay. */
  stageDirection?: string;
}

export interface PotentialQuestlineChapter {
  /** Globally unique chapter id — snake_case. */
  id: string;
  /** Stable flag set when the chapter is completed. */
  completionFlag: string;
  /** Optional flag required to unlock the chapter. */
  unlockFlag?: string;
  /** Human-readable title. */
  title: string;
  /** Short hook shown in the quest log. */
  hook: string;
  /** Sector the chapter primarily takes place in. */
  sectorId?: string;
  /** Optional per-chapter act gate, 1-7. Overrides the questline-level
   *  actGate when a single questline spans multiple acts. */
  actGate?: number;
  /** The opening monologue beats rendered before the wheel appears. */
  opener: PotentialQuestlineBeat[];
  /** The dialog wheel options the player chooses between. */
  wheel: WheelOption[];
  /** Per-option followup beats rendered after the player commits. */
  followups: Record<string, PotentialQuestlineBeat[]>;
  /** Flag set on a specific option (keyed by option id). Applied in addition to completionFlag. */
  optionFlags?: Record<string, string[]>;
  /** Unity contribution source keyed by option id — fed into ripple engine. */
  unityContributions?: Record<string, string>;
}

export interface PotentialQuestline {
  /** Questline id — snake_case. */
  id: string;
  /** Human-readable title. */
  title: string;
  /** Short lore blurb. */
  premise: string;
  /** Act gate — 1-7, matching the existing narrative acts. */
  actGate: number;
  /** Chapters in order. */
  chapters: PotentialQuestlineChapter[];
  /** Narrative flags set by the questline (for reachability tests). */
  flags: readonly string[];
}

/** All chapter ids across a set of questlines — used by reachability tests. */
export function getAllChapterIds(questlines: PotentialQuestline[]): string[] {
  return questlines.flatMap((q) => q.chapters.map((c) => c.id));
}

/** All completion flags across a set of questlines. */
export function getAllCompletionFlags(questlines: PotentialQuestline[]): string[] {
  return questlines.flatMap((q) => q.chapters.map((c) => c.completionFlag));
}
