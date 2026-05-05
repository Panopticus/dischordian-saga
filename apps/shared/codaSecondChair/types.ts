/* ═══════════════════════════════════════════════════════
   SECOND CHAIR — types

   Vex Solène's "second chair" is an authored fragment corpus
   delivered to the operative as if a model of the Engineer
   were whispering counsel. There is no LLM call: the corpus
   is a deterministic library of pre-written lines, and the
   selector picks one based on (mission, archetype, reveal
   stage, bond tier). A corruption layer rewrites the text to
   simulate Vex's reconstruction drifting at low confidence.

   The voice rule is strict: lines sound technical and
   precise, often ending on a half-thought, with memory
   fragments that are spatial (hallways, machine sounds,
   windows) and never political. vexAware lines call her
   "Vex" — those are rare and only fire at the deepest reveal
   stage.

   See selector.ts for the picker and corpus.ts for the
   authored library. Stage names mirror VexRevealStage from
   apps/shared/vexRevealStage.ts.
   ═══════════════════════════════════════════════════════ */

import type { MissionKind } from "../vexSoleneCommissions";

/**
 * Mission archetypes the Second Chair can advise on. Reuses the
 * canonical MissionKind union plus a "general" pool that always
 * matches.
 */
export type SecondChairArchetype = MissionKind | "general";

export type SecondChairTone =
  | "warning"
  | "encouragement"
  | "technical"
  | "philosophical"
  | "doubt"
  | "memory"
  | "self_correction";

export type SecondChairCorruption =
  | "stutter"
  | "fade"
  | "loop"
  | "interrupt"
  | "none";

export type SecondChairRevealStage =
  | "vex_public"
  | "engineer_zero_hint"
  | "engineer_zero_confirmed";

export interface SecondChairFragment {
  /** Stable id, format `te-sc-NNN`. */
  id: string;
  /** Mission archetypes this fragment is eligible for. */
  archetypes: readonly SecondChairArchetype[];
  tone: SecondChairTone;
  /** The pristine line as Vex remembers him saying it. */
  text: string;
  /**
   * Set true on lines that leak Vex-specific intimacy. These
   * only fire at engineer_zero_confirmed + bondTier >= 3.
   */
  vexAware?: boolean;
  /** Per-fragment corruption preference. Renderer applies it. */
  defaultCorruption?: SecondChairCorruption;
}

export interface SecondChairAdviceContext {
  /** Stable per-mission id; same id → same advice. */
  missionId: string;
  archetype: SecondChairArchetype;
  /** 0..1 — Vex's confidence in her reconstruction this run. */
  reconstructionConfidence: number;
  revealStage: SecondChairRevealStage;
  /** 0..4 inclusive. Gates vexAware lines. */
  vexBondTier: 0 | 1 | 2 | 3 | 4;
}

export interface SecondChairAdvice {
  fragmentId: string;
  /** Text after corruption rendering. */
  rendered: string;
  /** 0..1; high when reconstruction is shaky / reveal is early. */
  hauntedness: number;
  /** True when the selected fragment was a vexAware one. */
  isVexAware: boolean;
}
