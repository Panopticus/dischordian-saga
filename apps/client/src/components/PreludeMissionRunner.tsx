/* ═══════════════════════════════════════════════════════
   PRELUDE MISSION RUNNER — playable text adventure

   Walks a PreludeCrewMission step-by-step. Consumes the
   pure state machine in apps/shared/preludeMissionRunner.ts
   and renders a terminal-style narrative frame with Continue
   and Choice buttons. On completion, raises every flag in
   getPreludeCompletionFlags() via GameContext.setNarrativeFlag.

   Visual: manuscript-bezel frame matching the Matrix of
   Dreams bezel (Appendix A.1) — gold manuscript rule, black
   stone background, framer-motion fade between steps.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Sparkles } from "lucide-react";
import {
  advancePreludeStep,
  getCurrentPreludeStep,
  getPreludeCompletionFlags,
  getPreludeProgress,
  pickPreludeChoice,
  startPreludeRun,
  type PreludeRunState,
} from "@shared/preludeMissionRunner";
import {
  PRELUDE_CREW_MISSIONS,
  type PreludeCrewMission,
} from "@shared/preludeCrewMissions";
import { PRELUDE_CREW } from "@shared/preludeCrew";
import { useGame } from "@/contexts/GameContext";

export interface PreludeMissionRunnerProps {
  missionId: PreludeCrewMission["id"];
  onClose?: () => void;
  /** Called once on completion, after flags are raised. */
  onComplete?: (state: PreludeRunState) => void;
}

const STEP_BADGE: Record<string, string> = {
  text: "NARRATION",
  reveal: "REVEAL",
  combat: "ENCOUNTER",
  puzzle: "PUZZLE",
  choice: "CHOICE",
};

const STEP_ACCENT: Record<string, string> = {
  text: "void-text-accent",
  reveal: "void-text-system",
  combat: "void-text-error",
  puzzle: "void-text-energy",
  choice: "void-text-energy",
};

export function PreludeMissionRunner({
  missionId,
  onClose,
  onComplete,
}: PreludeMissionRunnerProps) {
  const { setNarrativeFlag } = useGame();
  const [state, setState] = useState<PreludeRunState>(() =>
    startPreludeRun(missionId),
  );

  const mission = PRELUDE_CREW_MISSIONS[missionId];
  const leader = PRELUDE_CREW[mission.leader];
  const step = getCurrentPreludeStep(state);
  const progress = getPreludeProgress(state);
  const progressPct = Math.round(progress * 100);

  // Raise flags when the run completes.
  useEffect(() => {
    if (!state.complete) return;
    const flags = getPreludeCompletionFlags(state);
    for (const flag of flags) {
      setNarrativeFlag(flag, true);
    }
    onComplete?.(state);
  }, [state, setNarrativeFlag, onComplete]);

  const handleAdvance = useCallback(() => {
    setState((prev) => advancePreludeStep(prev));
  }, []);

  const handleChoice = useCallback((optionId: string) => {
    setState((prev) => pickPreludeChoice(prev, optionId));
  }, []);

  // Animated step counter for the key prop so AnimatePresence
  // fires on every step change.
  const stepKey = useMemo(
    () => `${missionId}_${state.stepIndex}_${state.complete ? "done" : "running"}`,
    [missionId, state.stepIndex, state.complete],
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center void-bg-canvas backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Prelude mission: ${mission.title}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        className="w-full max-w-2xl rounded-md border void-border void-bg-canvas shadow-[0_0_40px_color-mix(in oklch, var(--energy-accent) 20%, transparent)]"
      >
        {/* Top bezel — mission header */}
        <div className="flex items-center justify-between border-b void-border px-5 py-3">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="void-text-accent" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
                PRELUDE MISSION · LED BY {leader.name.toUpperCase()}
              </p>
              <h2 className="font-display text-base void-text-accent">
                {mission.title}
              </h2>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 void-text-accent void-text-accent void-bg-sunk transition-colors"
              aria-label="Close mission"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-3">
          <div className="h-0.5 w-full rounded void-bg-sunk overflow-hidden">
            <motion.div
              className="h-full void-bg-sunk"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-wider void-text-accent">
            Step {Math.min(state.stepIndex + 1, mission.steps.length)} / {mission.steps.length}
          </p>
        </div>

        {/* Step body */}
        <div className="min-h-[220px] px-6 py-5">
          <AnimatePresence mode="wait">
            {step && !state.complete ? (
              <motion.div
                key={stepKey}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35 }}
              >
                <p
                  className={`mb-3 font-mono text-[10px] uppercase tracking-[0.25em] ${STEP_ACCENT[step.kind] ?? "void-text-accent"}`}
                >
                  {STEP_BADGE[step.kind] ?? step.kind.toUpperCase()}
                </p>
                <p className="font-serif text-base leading-relaxed void-text">
                  {step.text}
                </p>

                {/* Choice options */}
                {step.kind === "choice" && step.options && (
                  <div className="mt-5 space-y-2">
                    {step.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleChoice(opt.id)}
                        className="group flex w-full items-center justify-between rounded-sm border void-border-success void-bg-success px-4 py-3 text-left font-mono text-[13px] void-text-energy void-border-success void-bg-success transition-all"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight
                          size={14}
                          className="void-text-energy group-hover:translate-x-0.5 group-void-text-energy transition-all"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <Sparkles size={28} className="mb-3 void-text-accent" />
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] void-text-accent">
                  MISSION COMPLETE
                </p>
                <p className="mb-4 max-w-md font-serif text-sm void-text">
                  {mission.title} is on the record. {leader.name} will remember this.
                </p>
                <div className="mb-4 flex flex-wrap justify-center gap-2 font-mono text-[10px] void-text-accent">
                  <span className="rounded border void-border px-2 py-0.5">
                    +{mission.rewards.memoryEnergy} Memory Energy
                  </span>
                  <span className="rounded border void-border px-2 py-0.5">
                    +{mission.rewards.bondDelta} Bond with {leader.name}
                  </span>
                  {mission.rewards.materialIds.map((m) => (
                    <span
                      key={m}
                      className="rounded border void-border px-2 py-0.5"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                {state.outcomeTrail.length > 0 && (
                  <details className="mb-4 font-mono text-[10px] void-text-accent">
                    <summary className="cursor-pointer">
                      Outcome trail ({state.outcomeTrail.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-left">
                      {state.outcomeTrail.map((o, i) => (
                        <li key={i}>· {o}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer — Continue / Close button */}
        <div className="flex items-center justify-between border-t void-border px-5 py-3">
          <p className="font-mono text-[9px] uppercase tracking-wider void-text-accent">
            {leader.role.replace("_", " ")} · {mission.durationMins} min
          </p>
          {!state.complete && step && step.kind !== "choice" ? (
            <button
              type="button"
              onClick={handleAdvance}
              className="flex items-center gap-2 rounded-sm border void-border void-bg-sunk px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider void-text-accent void-border void-bg-sunk transition-colors"
            >
              Continue
              <ChevronRight size={12} />
            </button>
          ) : state.complete ? (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-sm border void-border-success void-bg-success px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider void-text-energy void-border-success void-bg-success transition-colors"
            >
              Return to Hub
              <ChevronRight size={12} />
            </button>
          ) : (
            <span className="font-mono text-[10px] void-text-accent">
              Make a choice above
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
