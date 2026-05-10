/* ═══════════════════════════════════════════════════════
   QUIET MOMENT OVERLAY — Bridge campfire moments

   Surfaces the first triggered-but-unseen quiet moment from
   apps/shared/quietMomentScenes.ts as a soft Bridge overlay.
   Mounted globally (via App.tsx); the overlay only renders
   when the player's flag set has produced a pending scene.

   This is the BioWare-tier campfire pattern — a single
   utterance from an already-met NPC, dismissible, one-shot
   per save.
   ═══════════════════════════════════════════════════════ */

import { useMemo, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  pendingQuietMoment,
  type QuietMomentSpeaker,
} from "@shared/quietMomentScenes";
import { useGame } from "@/contexts/GameContext";

const SPEAKER_LABEL: Record<QuietMomentSpeaker, string> = {
  elara: "Elara",
  the_human: "The Human",
  the_antiquarian: "The Antiquarian",
  adjudicator_locke: "Adjudicator Locke",
  vex_solene: "Vex Solène",
  patch: "Patch",
  zephyr_9: "Zephyr-9",
  little_one: "Little One",
  iron_lion: "Iron Lion",
  the_seer: "The Seer",
  the_degen: "The Degen",
  the_game_master: "The Game Master",
  agent_zero: "Agent Zero",
};

const SPEAKER_ACCENT: Record<QuietMomentSpeaker, string> = {
  elara: "border-cyan-500/50 bg-cyan-950/30 text-cyan-50",
  the_human: "border-rose-500/50 bg-rose-950/30 text-rose-50",
  the_antiquarian: "border-amber-700/60 bg-amber-950/30 text-amber-50",
  adjudicator_locke: "border-amber-500/50 bg-amber-950/25 text-amber-50",
  vex_solene: "border-violet-500/50 bg-violet-950/30 text-violet-50",
  patch: "border-rose-400/50 bg-rose-950/20 text-rose-50",
  zephyr_9: "border-cyan-400/50 bg-cyan-950/20 text-cyan-50",
  little_one: "border-violet-400/50 bg-violet-950/20 text-violet-50",
  iron_lion: "border-red-700/60 bg-red-950/30 text-red-50",
  the_seer: "border-violet-600/60 bg-violet-950/30 text-violet-50",
  the_degen: "border-emerald-500/40 bg-emerald-950/25 text-emerald-50",
  the_game_master: "border-stone-500/50 bg-stone-900/30 text-stone-50",
  agent_zero: "border-stone-400/50 bg-stone-900/25 text-stone-50",
};

export function QuietMomentOverlay(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();

  const flags = useMemo(
    () =>
      new Set(
        Object.entries(state.narrativeFlags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [state.narrativeFlags],
  );

  const scene = useMemo(() => pendingQuietMoment(flags), [flags]);

  if (!scene) return null;

  const accent = SPEAKER_ACCENT[scene.speaker];
  const speakerName = SPEAKER_LABEL[scene.speaker];

  return (
    <AnimatePresence>
      <motion.div
        key={scene.id}
        role="dialog"
        aria-label={`${speakerName} speaks — quiet moment`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className={`pointer-events-auto fixed top-6 left-1/2 -translate-x-1/2 z-[55] max-w-xl rounded-md border ${accent} p-4 shadow-md backdrop-blur`}
        data-testid={`quiet-moment-${scene.id}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-80">
            {speakerName} · quiet moment
          </p>
          <button
            type="button"
            onClick={() => setNarrativeFlag(scene.seenFlag, true)}
            className="rounded border border-current/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider opacity-80 hover:opacity-100"
            data-testid={`quiet-moment-dismiss-${scene.id}`}
          >
            Continue
          </button>
        </div>
        <p className="mt-2 font-serif italic text-[13px] leading-relaxed">
          {scene.line}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default QuietMomentOverlay;
