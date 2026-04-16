/**
 * §5.8 Authority trial — phase indicator.
 *
 * Mounted top-center of the match field when the match is a §5.8 trial
 * (gameState.trial is present). Displays the current phase name in
 * Empire-serif style + a small "Phase N of 10" counter.
 *
 * Visual palette follows spec §5.4.1 (Authority scale): black-marble
 * background + faint gold border + serif typography. Contrasts
 * deliberately with §5.5's dust-brown/brass palette so the two
 * mechanics read as different Act 1 set-pieces.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §2.
 *
 * The phase name and admitted categories come from the engine's
 * PHASE_RULES table (see engine/trialPhase.ts); this component
 * duplicates the names locally rather than importing because the
 * engine module pulls in Immer/types the client bundle doesn't need.
 * Keep in sync if the engine's phase names ever change.
 */

interface TrialPhaseIndicatorProps {
  /** Current phase 1..10 (== GameState.turnNumber during trial). */
  phaseNumber: number;
  /** The §5.8.1 verdict, if resolved. Triggers the resolved-state
   *  visual treatment (gold text, no phase counter). */
  outcome?: "overturn" | "sentence_passed";
}

const PHASE_NAMES: readonly string[] = [
  "", // index 0 unused; phases are 1-indexed
  "Charge",
  "Opening argument",
  "Evidence — presentation",
  "Evidence — cross-support",
  "Evidence — closing",
  "Cross-examination — first",
  "Cross-examination — second",
  "Cross-examination — closing",
  "Closing argument",
  "Verdict",
];

export function TrialPhaseIndicator({
  phaseNumber,
  outcome,
}: TrialPhaseIndicatorProps) {
  const phaseLabel =
    phaseNumber >= 1 && phaseNumber <= 10 ? PHASE_NAMES[phaseNumber] : "";

  // Verdict resolved — foreground the outcome word.
  if (outcome) {
    return (
      <div
        role="status"
        aria-live="assertive"
        aria-label={`Trial verdict: ${outcome.replace("_", " ")}`}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded border border-amber-300/60 bg-black/90 shadow-[0_0_16px_rgba(255,200,100,0.4)]"
      >
        <p className="font-serif text-xl tracking-[0.2em] uppercase text-amber-100">
          {outcome === "overturn" ? "OVERTURN" : "SENTENCE"}
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={`Trial phase ${phaseNumber} of 10: ${phaseLabel}`}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded border border-stone-300/30 bg-stone-950/90 shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-300/60">
          Phase {phaseNumber} / 10
        </span>
        <span className="font-serif text-base tracking-wide text-stone-100">
          {phaseLabel}
        </span>
      </div>
    </div>
  );
}
