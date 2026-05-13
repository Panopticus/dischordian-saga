/* ═══════════════════════════════════════════════════════
   SAGA STATUS RENDERER
   The pure-data renderer that produces saga-status display
   payloads from the canon-foundation registries. Any UI
   surface (Hub, Codex, status panel, saga-walkthrough page)
   reads from THIS module rather than reaching into the
   foundation registries directly.

   Design:
     - Pure functions. No I/O. No React. The renderer
       produces typed display data; the UI renders it.
     - Reads from: sagaPhases / mysteryEngineCanon /
       crossArcReactivity / realWorldChronicle.
     - Returns: a flat StatusPayload the client can JSON-
       serialize, persist, or render directly.

   Three primary surfaces:
     1. The saga-phase status panel — current phase + next-
        phase guidance + completed-phase count.
     2. The Mystery Engine catalog surface — arcs available
        at the player's current saga act.
     3. The Real-World Chronicle surface — next scheduled
        service trip + upcoming partnership.

   See plan §VIII (Build Sequence) Phase D + E + G — this
   module is the connective tissue that closes the
   foundation layer's wiring to the UI.
   ═══════════════════════════════════════════════════════ */

import {
  CROSS_ARC_BINDINGS,
  type CrossArcBinding,
  getCrossArcPreview,
} from "./crossArcReactivity";
import {
  type MysteryEngineArcCanon,
  getArcsAvailableAtAct,
} from "./mysteryEngineCanon";
import {
  type ServiceTripEntry,
  getNextScheduledTrip,
} from "./realWorldChronicle";
import {
  type SagaPhase,
  type SagaPhaseDefinition,
  type SagaPhaseInput,
  getCompletedPhases,
  getNextPhaseGuidance,
  getSagaPhaseDefinition,
  resolveCurrentSagaPhase,
} from "./sagaPhases";

/* ═══════════════════════════════════════════════════════
   PAYLOAD TYPES
   ═══════════════════════════════════════════════════════ */

/** Display payload for the saga-phase status panel. */
export interface SagaPhaseStatusPayload {
  currentPhase: SagaPhase;
  currentPhaseDefinition: SagaPhaseDefinition;
  /**
   * The next phase the player has not yet reached. `null` if the
   * player is at Phase 14 (no next phase).
   */
  nextPhaseGuidance: SagaPhaseDefinition | null;
  /** Completed phases (0 .. currentPhase - 1). */
  completedPhases: readonly SagaPhase[];
  /**
   * Display percentage (0-100) of saga progress. Computed as
   * `currentPhase / 14`. Rounds to nearest integer.
   */
  progressPercent: number;
  /** Display title for the panel header. */
  panelTitle: string;
}

/** Display payload for the Mystery Engine catalog surface. */
export interface MysteryEngineCatalogPayload {
  /** Arcs the player has unlocked at the current narrative act. */
  availableArcs: readonly MysteryEngineArcCanon[];
  /** Arcs still gated behind future acts (preview only). */
  upcomingArcs: readonly MysteryEngineArcCanon[];
  /** Currently-active arc count. */
  availableCount: number;
  /** Total arcs in the catalog (canonical 6). */
  totalCount: number;
}

/** Display payload for cross-arc reactivity preview surface. */
export interface CrossArcPreviewPayload {
  /** Bindings whose source arc is currently available to the player. */
  activeBindings: readonly CrossArcBinding[];
  /** Player-facing preview strings for each binding. */
  previews: readonly { binding: CrossArcBinding; previewText: string }[];
  /** Total cross-arc bindings registered. */
  totalBindings: number;
}

/** Display payload for the Real-World Chronicle surface. */
export interface RealWorldChroniclePayload {
  /** The next scheduled service trip from the given ISO date. */
  nextTrip: ServiceTripEntry | null;
  /** Days until the next trip's start (negative if past). */
  daysUntilNextTrip: number | null;
  /** Whether the next trip carries a partnership anchor. */
  hasPartnership: boolean;
}

/** The complete saga-status payload. Top-level UI surface reads this. */
export interface SagaStatusPayload {
  phase: SagaPhaseStatusPayload;
  mysteries: MysteryEngineCatalogPayload;
  crossArcs: CrossArcPreviewPayload;
  realWorld: RealWorldChroniclePayload;
}

/* ═══════════════════════════════════════════════════════
   RENDERERS — pure functions
   ═══════════════════════════════════════════════════════ */

/**
 * Renders the saga-phase status panel payload from a state +
 * narrativeAct input.
 */
export function renderSagaPhaseStatus(
  input: SagaPhaseInput,
): SagaPhaseStatusPayload {
  const currentPhase = resolveCurrentSagaPhase(input);
  const currentPhaseDefinition = getSagaPhaseDefinition(currentPhase);
  const nextPhaseGuidance = getNextPhaseGuidance(input);
  const completedPhases = getCompletedPhases(input);
  const progressPercent = Math.round((currentPhase / 14) * 100);

  return {
    currentPhase,
    currentPhaseDefinition,
    nextPhaseGuidance,
    completedPhases,
    progressPercent,
    panelTitle: `Phase ${currentPhase} — ${currentPhaseDefinition.title}`,
  };
}

/**
 * Renders the Mystery Engine catalog surface payload. Returns
 * which canonical arcs the player has unlocked at their current
 * narrative act, and which are still upcoming.
 */
export function renderMysteryEngineCatalog(
  input: SagaPhaseInput,
): MysteryEngineCatalogPayload {
  const availableArcs = getArcsAvailableAtAct(input.narrativeAct);
  // Compute upcoming arcs: gate at act+1 and above.
  const allArcsAtMax = getArcsAvailableAtAct(99);
  const availableSet = new Set(availableArcs.map((a) => a.arcId));
  const upcomingArcs = allArcsAtMax.filter((a) => !availableSet.has(a.arcId));

  return {
    availableArcs,
    upcomingArcs,
    availableCount: availableArcs.length,
    totalCount: allArcsAtMax.length,
  };
}

/**
 * Renders the cross-arc reactivity preview payload. For each
 * binding whose source arc is currently available to the player,
 * generates a player-facing preview string.
 */
export function renderCrossArcPreviews(
  input: SagaPhaseInput,
): CrossArcPreviewPayload {
  const availableArcs = getArcsAvailableAtAct(input.narrativeAct);
  const availableArcIds = new Set(availableArcs.map((a) => a.arcId));

  const activeBindings = CROSS_ARC_BINDINGS.filter((b) =>
    availableArcIds.has(b.sourceArc),
  );

  const previews = activeBindings.map((binding) => ({
    binding,
    previewText: getCrossArcPreview(binding),
  }));

  return {
    activeBindings,
    previews,
    totalBindings: CROSS_ARC_BINDINGS.length,
  };
}

/**
 * Renders the Real-World Chronicle surface payload. The
 * `currentIsoDate` parameter is passed by the caller (typically
 * server-side) so the function stays pure — it does NOT call
 * `new Date()` internally.
 */
export function renderRealWorldChronicle(
  currentIsoDate: string,
): RealWorldChroniclePayload {
  const nextTrip = getNextScheduledTrip(currentIsoDate);

  let daysUntilNextTrip: number | null = null;
  if (nextTrip) {
    const tripStart = new Date(nextTrip.dateRange.startIso).getTime();
    const current = new Date(currentIsoDate).getTime();
    const msPerDay = 1000 * 60 * 60 * 24;
    daysUntilNextTrip = Math.round((tripStart - current) / msPerDay);
  }

  return {
    nextTrip,
    daysUntilNextTrip,
    hasPartnership: nextTrip?.partnership !== null && nextTrip?.partnership !== undefined,
  };
}

/**
 * The top-level renderer. Produces the complete saga-status
 * payload by composing all four surfaces. The caller passes the
 * player's state + the current ISO date (for trip-proximity
 * calculations); the renderer returns a typed payload ready for
 * any UI surface to consume.
 */
export function renderSagaStatus(
  input: SagaPhaseInput,
  currentIsoDate: string,
): SagaStatusPayload {
  return {
    phase: renderSagaPhaseStatus(input),
    mysteries: renderMysteryEngineCatalog(input),
    crossArcs: renderCrossArcPreviews(input),
    realWorld: renderRealWorldChronicle(currentIsoDate),
  };
}

/* ═══════════════════════════════════════════════════════
   Convenience helpers for specific UI surfaces
   ═══════════════════════════════════════════════════════ */

/**
 * Returns a one-line "what should the player do next" hint string.
 * The Hub UI uses this as a Status-row caption.
 *
 * Examples:
 *   - "Your path continues: Phase 2 — Fall of the First Wave."
 *   - "Your saga is complete. The Servant Hero Academy era continues."
 */
export function renderNextStepHint(input: SagaPhaseInput): string {
  const next = getNextPhaseGuidance(input);
  if (!next) {
    return "Your saga is complete. The Servant Hero Academy era continues.";
  }
  return `Your path continues: Phase ${next.phase} — ${next.title}.`;
}

/**
 * Returns the canonical Antiquarian-narrator caption for a given
 * saga phase. Used as the Codex header for that phase's chronicle
 * section.
 */
export function renderPhaseChronicleCaption(phase: SagaPhase): string {
  const def = getSagaPhaseDefinition(phase);
  return `Phase ${phase} of the chronicle: ${def.title}. ${def.premise}`;
}

/**
 * Returns the count of cross-arc bindings whose narrative meaning
 * is currently visible to the player at their saga act. Used by
 * the Hub's "active threads" badge.
 */
export function countActiveCrossArcThreads(input: SagaPhaseInput): number {
  return renderCrossArcPreviews(input).activeBindings.length;
}
