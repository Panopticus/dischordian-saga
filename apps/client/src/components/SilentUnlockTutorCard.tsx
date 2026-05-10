/* ═══════════════════════════════════════════════════════
   SILENT UNLOCK TUTOR CARD — global overlay

   Surfaces an in-fiction tutor card the moment one of the
   six silent-unlock triggers fires (see
   apps/shared/silentUnlockTutors.ts). Unlike PreludeTutorCard
   which is mounted page-locally, this component sits in
   App.tsx and renders the FIRST pending tutor in the queue
   so the player sees them in the order their triggers fired.

   Behavior:
     - Reads pending tutors via getPendingSilentUnlockTutors
     - Renders the first pending one as a slide-in card
     - Dismiss sets the completionFlag — the next pending
       tutor (if any) takes the slot on the next paint
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingSilentUnlockTutors,
  type SilentUnlockSpeaker,
} from "@shared/silentUnlockTutors";
import { useGame } from "@/contexts/GameContext";

const SPEAKER_LABEL: Record<SilentUnlockSpeaker, string> = {
  elara: "Elara",
  the_resurrectionist: "The Resurrectionist",
  the_antiquarian: "The Antiquarian",
  iron_lion: "Iron Lion",
  adjudicator_locke: "Adjudicator Locke",
};

const SPEAKER_ACCENT: Record<
  SilentUnlockSpeaker,
  { border: string; bg: string; text: string; mono: string }
> = {
  elara: {
    border: "border-cyan-500/60",
    bg: "bg-cyan-950/40",
    text: "text-cyan-50",
    mono: "text-cyan-300/80",
  },
  the_resurrectionist: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-950/40",
    text: "text-emerald-50",
    mono: "text-emerald-300/80",
  },
  the_antiquarian: {
    border: "border-amber-700/60",
    bg: "bg-amber-950/40",
    text: "text-amber-50",
    mono: "text-amber-300/80",
  },
  iron_lion: {
    border: "border-red-700/60",
    bg: "bg-red-950/40",
    text: "text-red-50",
    mono: "text-red-300/80",
  },
  adjudicator_locke: {
    border: "border-amber-500/60",
    bg: "bg-amber-950/30",
    text: "text-amber-50",
    mono: "text-amber-300/80",
  },
};

export function SilentUnlockTutorCard() {
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

  const pending = useMemo(() => getPendingSilentUnlockTutors(flags), [flags]);
  const tutor = pending[0];

  if (!tutor) return null;

  const accent = SPEAKER_ACCENT[tutor.speaker];
  const speakerName = SPEAKER_LABEL[tutor.speaker];

  return (
    <AnimatePresence>
      <motion.div
        key={tutor.systemId}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        className={`pointer-events-auto fixed bottom-6 right-6 z-[60] max-w-md rounded-md border ${accent.border} ${accent.bg} p-4 shadow-lg backdrop-blur`}
        data-testid={`silent-unlock-tutor-${tutor.systemId}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent.mono}`}
          >
            {speakerName} · tutor
          </p>
          <button
            type="button"
            onClick={() => setNarrativeFlag(tutor.completionFlag, true)}
            className={`rounded border ${accent.border} px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${accent.mono} hover:opacity-80`}
            data-testid={`silent-unlock-tutor-dismiss-${tutor.systemId}`}
          >
            Got it
          </button>
        </div>
        <p
          className={`mt-2 font-serif text-[13px] leading-relaxed ${accent.text}`}
        >
          {tutor.introText}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
