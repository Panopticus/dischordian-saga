/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL — phase definitions and timing
   docs/design/NEXUS_TRIAL_PLAN.md → Server Architecture

   Pure data describing the six-phase Trial schedule. The
   tick service (apps/server/services/nexusTrialTickService.ts)
   schedules phase transitions on the boundaries declared
   here. Live production runs at 12 hours per phase (72-hour
   Trial); staging dry-runs compress to 12 minutes per phase
   using the same definitions with a scaled duration.
   ═══════════════════════════════════════════════════════ */

/** Stable identifier for each phase of the Nexus Trial. Order is
 *  significant — `TRIAL_PHASES` is the canonical sequence. */
export type TrialPhase =
  | "charge"
  | "opening"
  | "evidence"
  | "cross_examination"
  | "confession"
  | "verdict";

/** The six phases in canonical order. */
export const TRIAL_PHASES = [
  "charge",
  "opening",
  "evidence",
  "cross_examination",
  "confession",
  "verdict",
] as const satisfies readonly TrialPhase[];

/** Duration per phase in milliseconds. Production: 12 hours; staging
 *  dry-run: 12 minutes. The tick service reads this at trial creation. */
export const PHASE_DURATION_PRODUCTION_MS = 12 * 60 * 60 * 1000;
export const PHASE_DURATION_STAGING_MS = 12 * 60 * 1000;

/** Trial lifecycle status. */
export type TrialStatus =
  | "pre_trial"
  | "live"
  | "verdict_resolving"
  | "closed"
  | "aborted";

/** Returns the next phase in the canonical sequence, or null when the
 *  current phase is the last. */
export function nextPhase(phase: TrialPhase): TrialPhase | null {
  const idx = TRIAL_PHASES.indexOf(phase);
  if (idx < 0) throw new Error(`Unknown trial phase: ${phase}`);
  if (idx === TRIAL_PHASES.length - 1) return null;
  return TRIAL_PHASES[idx + 1];
}

/** Returns the phase that contains a given offset from trial start
 *  (in ms), or null if the offset is past the end of the Trial. Used
 *  by the tick service to recover from missed boundary ticks — the
 *  scheduler can recompute "which phase should we be in" from the
 *  wall clock alone. */
export function phaseAtOffset(
  offsetMs: number,
  phaseDurationMs: number,
): TrialPhase | null {
  if (offsetMs < 0) return null;
  const idx = Math.floor(offsetMs / phaseDurationMs);
  if (idx >= TRIAL_PHASES.length) return null;
  return TRIAL_PHASES[idx];
}

/** Total Trial duration in ms for a given per-phase duration. */
export function trialDurationMs(phaseDurationMs: number): number {
  return TRIAL_PHASES.length * phaseDurationMs;
}

/** Significant resolution points within the Trial — moments where
 *  Sprint 10+ vote aggregators / cinematic selectors fire. Sprint 9
 *  ships the timing infrastructure; the resolvers themselves land
 *  later. */
export const PHASE_RESOLUTION_HOOKS = {
  /** At cross-examination close, the second-death ballot resolves
   *  and the Verdict cinematic preloads for hour 60. */
  resolveBallotAt: "cross_examination",
  /** At confession close, the companion-sacrifice vote resolves
   *  and the Confession cinematic fires for all clients. */
  resolveCompanionSacrificeAt: "confession",
  /** At verdict close, the Trial closes and the Season 2 patch
   *  service fires Wave 1. */
  trialClosesAt: "verdict",
} as const satisfies Record<string, TrialPhase>;
