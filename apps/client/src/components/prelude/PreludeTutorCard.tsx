/* ═══════════════════════════════════════════════════════
   PRELUDE TUTOR CARD

   Renders the first-time intro for a prelude system tutor
   (see apps/shared/preludeSystemTutors.ts). Mounts above
   the system's UI; auto-hides once the player dismisses.

   Behavior:
     - Reads shouldShowIntro(systemId, flags) from the
       preludeSystemTutors helper
     - If truthy, renders the speaker + intro text + a
       "Got it" dismiss button
     - Dismiss sets the tutor's completionFlag via
       setNarrativeFlag so it does not show again

   Consumers:
     - BeatDMissionBoard (Locke, mission_board)
     - BeatHInbox (The Human, inbox)
     - LastWordsWitnessing / WitnessingHubPage (The Seer,
       witnessing)
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPreludeSystemTutor,
  shouldShowIntro,
  type PreludeSystemId,
} from "@shared/preludeSystemTutors";
import { useGame } from "@/contexts/GameContext";

export interface PreludeTutorCardProps {
  systemId: PreludeSystemId;
}

const SPEAKER_LABEL: Record<string, string> = {
  locke: "Adjudicator Locke",
  human: "The Human",
  seer: "The Seer",
};

const SPEAKER_ACCENT: Record<string, { border: string; bg: string; text: string; mono: string }> = {
  locke: {
    border: "border-amber-500/60",
    bg: "bg-amber-950/30",
    text: "text-amber-50",
    mono: "text-amber-300/80",
  },
  human: {
    border: "border-rose-500/60",
    bg: "bg-rose-950/30",
    text: "text-rose-50",
    mono: "text-rose-300/80",
  },
  seer: {
    border: "border-violet-500/60",
    bg: "bg-violet-950/30",
    text: "text-violet-50",
    mono: "text-violet-300/80",
  },
};

export function PreludeTutorCard({ systemId }: PreludeTutorCardProps) {
  const { state, setNarrativeFlag } = useGame();
  const tutor = getPreludeSystemTutor(systemId);
  const flags = useMemo(
    () =>
      new Set(
        Object.entries(state.narrativeFlags)
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [state.narrativeFlags],
  );

  if (!tutor) return null;
  if (!shouldShowIntro(systemId, flags)) return null;

  const accent = SPEAKER_ACCENT[tutor.speaker] ?? SPEAKER_ACCENT.human;
  const speakerName = SPEAKER_LABEL[tutor.speaker] ?? tutor.speaker;

  return (
    <AnimatePresence>
      <motion.div
        key={tutor.systemId}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className={`rounded-md border ${accent.border} ${accent.bg} p-4 shadow-md backdrop-blur`}
      >
        <div className="flex items-center justify-between">
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent.mono}`}>
            {speakerName} · tutor
          </p>
          <button
            type="button"
            onClick={() => setNarrativeFlag(tutor.completionFlag, true)}
            className={`rounded border ${accent.border} px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${accent.mono} hover:opacity-80`}
          >
            Got it
          </button>
        </div>
        <p className={`mt-2 font-serif text-[13px] leading-relaxed ${accent.text}`}>
          {tutor.introText}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
