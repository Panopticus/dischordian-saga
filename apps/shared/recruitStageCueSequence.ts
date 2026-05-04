/* ═══════════════════════════════════════════════════════
   RECRUIT STAGE CUE SEQUENCE — Prelude Integration

   Composes architectAwakeningLines + dreamerAwakeningLines +
   the new Engineer Recording 0 + Elara's existing prelude
   handoff into one ordered playback the runtime can consume
   without touching React state directly.

   Each entry pairs:
     - the speaker
     - the line text
     - the audibility band (Dreamer cues are layered)
     - the prerequisite player action that surfaces it (if any)

   The runtime (apps/shared/preludeSequence.ts already exists;
   this module is loaded by it) will iterate the sequence,
   firing each cue at its step, and pulling Dreamer cues into
   audibility based on player actions logged during the cryo
   wake-up sequence.

   See plan §3 (Recruit Stage — Architect & Dreamer Entry).
   ═══════════════════════════════════════════════════════ */

import {
  ARCHITECT_AWAKENING_CUES,
  type ArchitectAwakeningCue,
} from "./architectAwakeningLines";
import {
  DREAMER_AWAKENING_CUES,
  type DreamerAwakeningCue,
} from "./dreamerAwakeningLines";

/** Player actions logged during the cryo sequence. */
export interface RecruitStageActionsLog {
  readonly refusedRole: boolean;
  readonly askedForbiddenQuestion: boolean;
  readonly touchedWrongPanel: boolean;
  /** Recording 0 has played (fires at the close of the Prelude). */
  readonly recording0Heard: boolean;
}

/** A single resolved cue ready for the runtime to play. */
export interface ResolvedCue {
  readonly source: "architect" | "dreamer";
  readonly id: string;
  readonly step: number;
  readonly text: string;
  readonly band: "ambient" | "audible" | "unmistakable";
  /**
   * For Dreamer cues, the band may be downgraded if the surfacing
   * action did not occur. ambient = barely audible; audible = clearly
   * her voice but soft; unmistakable = full presence.
   */
}

/**
 * Build the ordered playback for a player given their logged actions.
 * Step ordering is preserved: every Architect cue at step N comes
 * before every Architect cue at step N+1; Dreamer cues at step N
 * are interleaved underneath, layered at the appropriate band.
 */
export function buildRecruitStageSequence(
  actions: RecruitStageActionsLog,
): readonly ResolvedCue[] {
  const out: ResolvedCue[] = [];
  // Determine the Architect's step 5 branch first
  const refused = actions.refusedRole;
  const sortedArchitect = [...ARCHITECT_AWAKENING_CUES].sort((a, b) => a.step - b.step);

  for (const arch of sortedArchitect) {
    // Skip the wrong branch of step 5
    if (arch.id === "arch_plinth_role_confirmed" && refused) continue;
    if (arch.id === "arch_plinth_role_refused" && !refused) continue;

    // Emit all Dreamer cues that layer under THIS step
    const dreamerUnder = DREAMER_AWAKENING_CUES.filter((d) => d.underStep === arch.step);
    for (const dreamer of dreamerUnder) {
      const resolvedBand = resolveDreamerBand(dreamer, actions);
      // Skip cues whose surfacing action did not occur AND that were not "always ambient"
      if (resolvedBand === null) continue;
      out.push({
        source: "dreamer",
        id: dreamer.id,
        step: arch.step,
        text: dreamer.text,
        band: resolvedBand,
      });
    }

    out.push({
      source: "architect",
      id: arch.id,
      step: arch.step,
      text: arch.text,
      band: "audible",
    });
  }
  return out;
}

/**
 * Determine the audibility band for a Dreamer cue given player actions.
 * Returns null if the cue should NOT play (its surfacing action did not
 * occur AND it is not an ambient default).
 */
function resolveDreamerBand(
  cue: DreamerAwakeningCue,
  actions: RecruitStageActionsLog,
): "ambient" | "audible" | "unmistakable" | null {
  if (cue.surfacedBy === "none") return cue.band;
  if (cue.surfacedBy === "refuse_role") return actions.refusedRole ? cue.band : null;
  if (cue.surfacedBy === "ask_question")
    return actions.askedForbiddenQuestion ? cue.band : null;
  if (cue.surfacedBy === "touch_panel") return actions.touchedWrongPanel ? cue.band : null;
  if (cue.surfacedBy === "post_recording_zero")
    return actions.recording0Heard ? cue.band : null;
  return null;
}

/* ─── EXPECTED-PLAYBACK HELPERS ─── */

/**
 * Total cue count for a "sanctioned" run — player picks a role, asks no
 * questions, touches no wrong panels, hears Recording 0. Used for the
 * Prelude completion progress bar.
 */
export function expectedSanctionedCueCount(): number {
  return buildRecruitStageSequence({
    refusedRole: false,
    askedForbiddenQuestion: false,
    touchedWrongPanel: false,
    recording0Heard: true,
  }).length;
}

/**
 * Total cue count for a "Dreamer-aligned" run — player refuses role, asks
 * a forbidden question, touches the wrong panel, hears Recording 0. The
 * maximum cue count any run can produce.
 */
export function expectedDreamerAlignedCueCount(): number {
  return buildRecruitStageSequence({
    refusedRole: true,
    askedForbiddenQuestion: true,
    touchedWrongPanel: true,
    recording0Heard: true,
  }).length;
}

/* ─── ARCHETYPE ALIGNMENT SUMMARY ─── */

/**
 * Summarize the player's three-axis allegiance lean from their
 * recruit-stage actions. Used as the seed for later tutorial gates.
 */
export interface RecruitStageAlignment {
  readonly architectScore: number; // 0-3, count of sanctioned choices
  readonly dreamerScore: number;   // 0-3, count of Dreamer-surfacing actions
  /** First-encounter verdict — used to color Act 1 dialog. */
  readonly leansToward: "architect" | "dreamer" | "neutral";
}

export function summarizeRecruitStageAlignment(
  actions: RecruitStageActionsLog,
): RecruitStageAlignment {
  let architectScore = 0;
  let dreamerScore = 0;

  if (!actions.refusedRole) architectScore += 1;
  else dreamerScore += 1;
  if (!actions.askedForbiddenQuestion) architectScore += 1;
  else dreamerScore += 1;
  if (!actions.touchedWrongPanel) architectScore += 1;
  else dreamerScore += 1;

  let leansToward: RecruitStageAlignment["leansToward"];
  if (architectScore > dreamerScore) leansToward = "architect";
  else if (dreamerScore > architectScore) leansToward = "dreamer";
  else leansToward = "neutral";

  return { architectScore, dreamerScore, leansToward };
}
