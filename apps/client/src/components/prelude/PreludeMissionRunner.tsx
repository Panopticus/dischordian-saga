/* ═══════════════════════════════════════════════════════
   PRELUDE MISSION RUNNER — text-adventure engine (§2.6)

   React wrapper around the pure `preludeMissionRunner`
   state machine. Walks the player through a single
   PreludeCrewMission one step at a time:

     - text / reveal / combat / puzzle steps render the
       narrative body and a Continue button.
     - choice steps render the options; picking one records
       its outcome and advances.

   On completion the wrapper:
     1. Raises every flag returned by
        `getPreludeCompletionFlags(state)` via
        `setNarrativeFlag` on GameContext.
     2. Credits the mission's material rewards via
        `addMaterial` (Patch's salvage, Zephyr-9's signal
        fragments, Little One's burnt tarot fragment, etc.).
     3. Applies the crew bond delta via
        `adjustNarratorBond` (a coarse proxy for per-crew
        bond; per-crew meters land post-Act-1).
     4. Fires `onComplete(outcomeTrail)` so the caller can
        navigate to the next beat or log the result.

   The component is deliberately visual-only and has no
   opinion on where it mounts. Callers: the Bridge away-
   mission console, the Act 1 Cycle B retrospective log,
   unit tests.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PRELUDE_CREW_MISSIONS,
  type PreludeCrewMission,
  type PreludeMissionStep,
} from "@shared/preludeCrewMissions";
import {
  advancePreludeStep,
  getCurrentPreludeStep,
  getPreludeCompletionFlags,
  getPreludeProgress,
  pickPreludeChoice,
  startPreludeRun,
  type PreludeRunState,
} from "@shared/preludeMissionRunner";
import { useGame } from "@/contexts/GameContext";

export interface PreludeMissionRunnerProps {
  /** The mission to run. */
  missionId: PreludeCrewMission["id"];
  /**
   * Called when the mission finishes. The outcome trail is the
   * ordered list of choice-option outcomes recorded during the run.
   * Callers can use it to print a post-mission log, gate downstream
   * beats on specific outcomes, etc.
   */
  onComplete?: (result: {
    missionId: PreludeCrewMission["id"];
    outcomeTrail: readonly string[];
    flagsRaised: readonly string[];
  }) => void;
  /** Called when the player aborts the mission early (ESC / Back button). */
  onAbort?: () => void;
}

type StepKind = PreludeMissionStep["kind"];

const CONTINUE_LABELS: Record<StepKind, string> = {
  text: "Continue",
  reveal: "Continue",
  combat: "Stand down",
  puzzle: "Lock in",
  choice: "Continue",
};

export function PreludeMissionRunner({
  missionId,
  onComplete,
  onAbort,
}: PreludeMissionRunnerProps) {
  const mission = PRELUDE_CREW_MISSIONS[missionId];
  const [run, setRun] = useState<PreludeRunState>(() =>
    startPreludeRun(missionId),
  );
  const [finished, setFinished] = useState(false);

  const { setNarrativeFlag, addMaterial, adjustNarratorBond } = useGame();

  const currentStep = useMemo(
    () => getCurrentPreludeStep(run),
    [run],
  );
  const progress = useMemo(() => getPreludeProgress(run), [run]);

  const applyCompletion = useCallback(
    (finalRun: PreludeRunState) => {
      if (finished) return;
      setFinished(true);
      const flags = getPreludeCompletionFlags(finalRun);
      for (const flag of flags) {
        setNarrativeFlag(flag, true);
      }
      for (const materialId of mission.rewards.materialIds) {
        addMaterial(materialId, 1);
      }
      if (mission.rewards.bondDelta) {
        adjustNarratorBond(mission.rewards.bondDelta);
      }
      onComplete?.({
        missionId: finalRun.missionId,
        outcomeTrail: finalRun.outcomeTrail,
        flagsRaised: flags,
      });
    },
    [
      finished,
      mission.rewards.materialIds,
      mission.rewards.bondDelta,
      setNarrativeFlag,
      addMaterial,
      adjustNarratorBond,
      onComplete,
    ],
  );

  const handleAdvance = useCallback(() => {
    setRun((prev) => {
      const next = advancePreludeStep(prev);
      if (next.complete) applyCompletion(next);
      return next;
    });
  }, [applyCompletion]);

  const handlePick = useCallback(
    (optionId: string) => {
      setRun((prev) => {
        const next = pickPreludeChoice(prev, optionId);
        if (next.complete) applyCompletion(next);
        return next;
      });
    },
    [applyCompletion],
  );

  const stepKind: StepKind = currentStep?.kind ?? "text";
  const isChoice = stepKind === "choice";
  const continueLabel = CONTINUE_LABELS[stepKind];

  return (
    <div
      role="region"
      aria-label={`Prelude mission: ${mission.title}`}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--bg-void)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Header — title + leader + progress */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-md) var(--space-lg)",
          borderBottom:
            "1px solid color-mix(in oklch, var(--energy-primary) 25%, transparent)",
          fontFamily: "monospace",
        }}
      >
        <div>
          <div
            style={{
              color: "var(--energy-primary)",
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {mission.title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "color-mix(in oklch, var(--text-primary) 55%, transparent)",
              letterSpacing: "0.1em",
              marginTop: 2,
            }}
          >
            Lead: {mission.leader} · ~{mission.durationMins} min ·{" "}
            {Math.round(progress * 100)}%
          </div>
        </div>
        {onAbort && !finished && (
          <button
            onClick={onAbort}
            aria-label="Abort mission"
            style={{
              background: "transparent",
              border:
                "1px solid color-mix(in oklch, var(--energy-primary) 35%, transparent)",
              color:
                "color-mix(in oklch, var(--energy-primary) 70%, transparent)",
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "var(--space-xs) var(--space-md)",
              cursor: "pointer",
            }}
          >
            Abort
          </button>
        )}
      </header>

      {/* Progress rail */}
      <div
        aria-hidden="true"
        style={{
          height: 2,
          width: "100%",
          background: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.round(progress * 100)}%`,
            background: "var(--energy-primary)",
            transition: "width 0.4s ease-out",
          }}
        />
      </div>

      {/* Step body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-lg) var(--space-xl)",
        }}
      >
        <AnimatePresence mode="wait">
          {!finished && currentStep && (
            <motion.article
              key={`step-${run.stepIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{
                maxWidth: 720,
                textAlign: "center",
              }}
            >
              <div
                aria-live="polite"
                style={{
                  fontSize: 11,
                  color: "color-mix(in oklch, var(--energy-primary) 60%, transparent)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                  fontFamily: "monospace",
                }}
              >
                {stepKind}
              </div>
              <p
                style={{
                  fontFamily: "serif",
                  fontSize: 18,
                  lineHeight: 1.6,
                  color:
                    "color-mix(in oklch, var(--text-primary) 90%, transparent)",
                }}
              >
                {currentStep.text}
              </p>

              {isChoice && currentStep.options && (
                <div
                  role="group"
                  aria-label="Mission choice"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: 28,
                    alignItems: "stretch",
                  }}
                >
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handlePick(opt.id)}
                      style={{
                        padding: "var(--space-sm) var(--space-md)",
                        background:
                          "color-mix(in oklch, var(--energy-primary) 12%, transparent)",
                        border:
                          "1px solid color-mix(in oklch, var(--energy-primary) 45%, transparent)",
                        color: "var(--energy-primary)",
                        fontFamily: "monospace",
                        fontSize: 13,
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {!isChoice && (
                <button
                  onClick={handleAdvance}
                  autoFocus
                  style={{
                    marginTop: 32,
                    padding: "var(--space-sm) var(--space-lg)",
                    background:
                      "color-mix(in oklch, var(--energy-primary) 18%, transparent)",
                    border:
                      "1px solid color-mix(in oklch, var(--energy-primary) 55%, transparent)",
                    color: "var(--energy-primary)",
                    fontFamily: "monospace",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {continueLabel} ›
                </button>
              )}
            </motion.article>
          )}

          {finished && (
            <motion.article
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ maxWidth: 640, textAlign: "center" }}
            >
              <h2
                style={{
                  color: "var(--energy-primary)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Mission complete
              </h2>
              <p
                style={{
                  fontFamily: "serif",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color:
                    "color-mix(in oklch, var(--text-primary) 80%, transparent)",
                }}
              >
                {mission.title}. Rewards logged. Bond with {mission.leader}{" "}
                strengthens.
              </p>
            </motion.article>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
