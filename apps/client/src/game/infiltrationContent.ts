/* ═══════════════════════════════════════════════════════
   INFILTRATION CONTENT — Per-stage scripts for the Eyes Path
   §7.3 of WITNESSING_NARRATIVE_PROPOSAL.md

   Each of Act 3's six faction infiltration paths is a series
   of narrative stages. This file defines the bespoke content
   for every one of them (21 stages across 6 factions) and
   exposes it via a typed map the runner component consumes.

   Per-stage content is one of 9 minigame shapes:
     - choice        moral/plot fork with multiple options
     - judgment      rule on one or more cases; each verdict flags
     - dialogue      NPC exchanges with player response picks
     - rewrite       loredex entry rewrite (writes override at commit)
     - ritual        multi-beat click-through (atmospheric weight)
     - decrypt       signal pattern-match minigame
     - dark_flip     session of cards flipping to Dark counterparts
     - silence       atmospheric no-input beat with long pauses
     - time_skip     "time passes" atmospheric fragments

   Content files land per-faction in the following commits. An
   empty INFILTRATION_STAGES map is exported here as a stable
   interface so the runner can be built against types immediately.
   ═══════════════════════════════════════════════════════ */

import type { Act3FactionId } from "./tradeEmpire";

/* ─── SHARED TYPES ─── */

export type InfiltrationStageType =
  | "choice"
  | "judgment"
  | "dialogue"
  | "rewrite"
  | "ritual"
  | "decrypt"
  | "dark_flip"
  | "silence"
  | "time_skip";

interface StageBase {
  /** Must match the stage id in ACT3_FACTION_ARCS (e.g. "nb_i_1") */
  stageId: string;
  factionId: Act3FactionId;
  title: string;
  /** Short scene-setting paragraph shown at the top of the minigame */
  intro: string;
  type: InfiltrationStageType;
  /** Flags to set on any successful completion of this stage */
  flagsOnComplete?: string[];
}

/* ─── "choice" — multi-option moral/plot fork ─── */

export interface ChoiceOption {
  id: string;
  label: string;
  /** Narrative description shown after pick */
  outcome: string;
  /** Flags to set for THIS specific option (stacks with stage.flagsOnComplete) */
  flags?: string[];
  /** Some choices cause the path to FAIL rather than advance */
  fails?: boolean;
}

export interface ChoiceStage extends StageBase {
  type: "choice";
  prompt: string;
  options: ChoiceOption[];
}

/* ─── "judgment" — rule on one or more cases ─── */

export interface JudgmentCase {
  id: string;
  caseTitle: string;
  prompt: string;
  /** Verdict options — each is a ChoiceOption with its own outcome/flags */
  verdicts: ChoiceOption[];
}

export interface JudgmentStage extends StageBase {
  type: "judgment";
  cases: JudgmentCase[];
  /** Optional finale line shown after all cases resolved */
  finalLine?: string;
}

/* ─── "dialogue" — NPC exchanges with picked responses ─── */

export interface DialogueResponse extends ChoiceOption {
  /** NPC's follow-up line keyed to this response */
  npcReply?: string;
}

export interface DialogueExchange {
  npcLine: string;
  responses: DialogueResponse[];
}

export interface DialogueStage extends StageBase {
  type: "dialogue";
  speaker: string;
  /** Optional portrait path */
  portrait?: string;
  exchanges: DialogueExchange[];
}

/* ─── "rewrite" — loredex entry rewrite ─── */

export interface RewriteTemplate {
  id: string;
  /** Player-facing label for this rewrite option */
  label: string;
  /** The "claim" the player is committing to */
  claim: string;
  /** The fragment to find in the entry's bio */
  find: string;
  /** The text to replace it with */
  replace: string;
}

export interface RewriteStage extends StageBase {
  type: "rewrite";
  /** Loredex entity id to rewrite (e.g. "entity_22") */
  entityId: string;
  /** Display name shown in the UI */
  entityName: string;
  /** Excerpt from the entry shown for context */
  entityPreview: string;
  templates: RewriteTemplate[];
  /** true = commits to localStorage via loredexRewrite.ts */
  binding: boolean;
}

/* ─── "ritual" — multi-beat click-through ─── */

export interface RitualBeat {
  /** Short label above the beat (e.g. "FIRST CUT") */
  label?: string;
  text: string;
  buttonLabel: string;
}

export interface RitualStage extends StageBase {
  type: "ritual";
  beats: RitualBeat[];
  /** Line shown after all beats are done */
  closingLine: string;
}

/* ─── "decrypt" — signal pattern-match ─── */

export interface DecryptSlot {
  correct: string;
  decoys: string[];
}

export interface DecryptStage extends StageBase {
  type: "decrypt";
  hint: string;
  slots: DecryptSlot[];
  /** Max wrong picks before the stage fails */
  maxWrongPicks: number;
}

/* ─── "dark_flip" — cards flipping to Dark counterparts ─── */

export interface DarkFlipPair {
  light: string;
  dark: string;
  /** Short wry note about the flip */
  note: string;
}

export interface DarkFlipStage extends StageBase {
  type: "dark_flip";
  pairs: DarkFlipPair[];
  closingLine: string;
}

/* ─── "silence" / "time_skip" — atmospheric fragments ─── */

export interface AtmosphericFragment {
  text: string;
  /** How long this fragment dwells before advancing (ms) */
  pauseMs: number;
}

export interface SilenceStage extends StageBase {
  type: "silence";
  fragments: AtmosphericFragment[];
  finalButton: string;
}

export interface TimeSkipStage extends StageBase {
  type: "time_skip";
  fragments: AtmosphericFragment[];
  finalButton: string;
}

export type InfiltrationStage =
  | ChoiceStage
  | JudgmentStage
  | DialogueStage
  | RewriteStage
  | RitualStage
  | DecryptStage
  | DarkFlipStage
  | SilenceStage
  | TimeSkipStage;

/* ─── STAGE MAP ─── */

/**
 * Keyed by stageId. Populated incrementally per-faction in sibling commits.
 * Consumers should treat a missing key as "stage content not yet authored"
 * and fall back to the generic "MARK STAGE COMPLETE" flow in TradeEmpirePage.
 */
export const INFILTRATION_STAGES: Record<string, InfiltrationStage> = {};

/** Lookup helper. Returns null when the stage has no bespoke content yet. */
export function getInfiltrationStage(stageId: string): InfiltrationStage | null {
  return INFILTRATION_STAGES[stageId] ?? null;
}

/**
 * Result shape the runner posts back to TradeEmpirePage when a stage resolves.
 * Flags are merged by the caller; loredex overrides are written by the caller
 * via loredexRewrite.ts so the runner stays purely presentational.
 */
export interface InfiltrationStageResult {
  success: boolean;
  /** Flags to set on the player's narrative state */
  flagsToSet: string[];
  /** If a rewrite stage was just committed, the override to apply */
  loredexOverride?: {
    entityId: string;
    field: "bio";
    originalFragment: string;
    rewrittenFragment: string;
    authoredByStage: string;
  };
  /** Optional short text the caller can log in the event feed */
  logLabel?: string;
}
