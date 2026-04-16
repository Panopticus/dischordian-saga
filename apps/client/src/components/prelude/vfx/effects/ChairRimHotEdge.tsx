/**
 * ChairRimHotEdge — 3-phase amber rim-light on the askew eighth chair.
 *
 * Phases: 28s build → 14s hold → 3s fade
 * Beat F.5. Bible §12.6, §18.2.
 */
import { useEffect, useState } from "react";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type RimPhase = "build" | "hold" | "fade" | "done";

const PHASE_DURATIONS: Record<Exclude<RimPhase, "done">, number> = {
  build: 28,
  hold: 14,
  fade: 3,
};

const PHASE_ANIMATIONS: Record<Exclude<RimPhase, "done">, string> = {
  build: `pvfx-rim-build ${PHASE_DURATIONS.build}s ease-in forwards`,
  hold: `pvfx-rim-hold ${PHASE_DURATIONS.hold}s ease-in-out infinite`,
  fade: `pvfx-rim-fade ${PHASE_DURATIONS.fade}s ease-out forwards`,
};

export function ChairRimHotEdge({ active, state, onComplete, className = "" }: PreludeVfxProps) {
  const [phase, setPhase] = useState<RimPhase>("build");

  useEffect(() => {
    if (!active) {
      setPhase("build");
      return;
    }

    // Allow manual phase override via state prop
    if (state === "build" || state === "hold" || state === "fade") {
      setPhase(state as RimPhase);
      return;
    }

    // Auto-advance through phases
    const buildTimer = setTimeout(() => setPhase("hold"), PHASE_DURATIONS.build * 1000);
    return () => clearTimeout(buildTimer);
  }, [active, state]);

  useEffect(() => {
    if (phase === "hold") {
      const holdTimer = setTimeout(() => setPhase("fade"), PHASE_DURATIONS.hold * 1000);
      return () => clearTimeout(holdTimer);
    }
    if (phase === "fade") {
      const fadeTimer = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, PHASE_DURATIONS.fade * 1000);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase, onComplete]);

  if (!active || phase === "done") return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "80px",
        height: "120px",
        borderRadius: "8px",
        animation: PHASE_ANIMATIONS[phase],
        pointerEvents: "none",
      }}
    />
  );
}

registerPreludeVfx("vfx_chair_rim_hot_edge", {
  component: ChairRimHotEdge,
  label: "Chair Rim Hot Edge",
  mode: "stateful",
});
