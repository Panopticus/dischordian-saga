/* ═══════════════════════════════════════════════════════
   ACT 1 CLOSING CHOICE PANEL — §6.3 three-way decision.

   ACT1_NARRATIVE_STRUCTURE.md §6.3 frames this as distinct
   from the §5.8.1 Light/Dark pillar: Light/Dark was the
   player's stance toward the PROPHECY; this is the player's
   stance toward the WITNESSES themselves.

   Mounts globally (via App.tsx) after the Section 6
   "Two Witnesses Meet Part 2" slideshow completes. Shows
   three options:

     Accept the burden  — Act 2 Antiquarian-as-companion default
     Decline the burden — Witnesses fade into background until
                          Act 3's Witness-return arc
     Deflect           — question unresolved, Act 2 ambiguous

   All three are canon-safe. The choice is permanent —
   act1_closing_choice_made guards re-showing.

   Spec §6.3, §6.6 forward-write surface.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";

export type Act1ClosingChoice = "accept" | "decline" | "deflect";

interface ChoiceOption {
  id: Act1ClosingChoice;
  label: string;
  description: string;
  /** Accent class applied to the button border. */
  accent: string;
  /** Narrative flag raised when the player picks this. */
  flag: string;
}

const OPTIONS: ChoiceOption[] = [
  {
    id: "accept",
    label: "Accept the burden",
    description:
      "Carry forward what the Engineer and the Witnesses started. The Antiquarian leads the way into Act 2; the Enigma follows at his pace.",
    accent: "border-amber-300/60 hover:bg-amber-300/10",
    flag: "act1_closing_choice_accept",
  },
  {
    id: "decline",
    label: "Decline the burden",
    description:
      "The Witnesses made an offer. You refuse it. Act 2 still opens — you carry the weight alone until you choose to reach back in Act 3.",
    accent: "border-stone-400/60 hover:bg-stone-400/10",
    flag: "act1_closing_choice_decline",
  },
  {
    id: "deflect",
    label: "Deflect — ask a question instead",
    description:
      "You neither accept nor decline. The Witnesses do not press. Act 2 opens with your companion track ambiguous.",
    accent: "border-indigo-300/60 hover:bg-indigo-300/10",
    flag: "act1_closing_choice_deflect",
  },
];

export function Act1ClosingChoicePanel() {
  const { state, setNarrativeFlag } = useGame();
  // Gate: Section 6 slideshow has completed AND no choice yet.
  const unlocked = !!state.narrativeFlags?.slideshow_two_witnesses_part_2_complete;
  const alreadyMade = !!state.narrativeFlags?.act1_closing_choice_made;

  const handleChoose = useCallback(
    (option: ChoiceOption) => {
      setNarrativeFlag(option.flag, true);
      setNarrativeFlag("act1_closing_choice_made", true);
    },
    [setNarrativeFlag],
  );

  // Inner-voice dispatch: audit 2H — any skill with a
  // choice_presented utterance whispers as the panel mounts.
  // Fires exactly once per playthrough via the alreadyMade guard.
  useEffect(() => {
    if (!unlocked || alreadyMade) return;
    dispatchVoiceWhisper(
      { type: "choice_presented" },
      (state.innerVoiceSkills ?? {}) as Record<string, number>,
    );
  }, [unlocked, alreadyMade, state.innerVoiceSkills]);

  if (!unlocked || alreadyMade) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Act 1 closing choice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
      >
        <div className="max-w-3xl w-full">
          <div className="mb-8 text-center">
            <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-stone-400/70 mb-2">
              Act 1 — closing choice
            </p>
            <p className="font-serif text-lg text-stone-200/80 italic">
              The silence sits. Neither Witness presses.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {OPTIONS.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                onClick={() => handleChoose(option)}
                className={
                  "flex flex-col gap-3 p-5 rounded border bg-stone-950/70 " +
                  "text-left transition-all duration-300 cursor-pointer " +
                  option.accent
                }
              >
                <span className="font-serif text-base tracking-wider text-stone-100">
                  {option.label}
                </span>
                <span className="font-serif text-[12px] leading-relaxed text-stone-300/75">
                  {option.description}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[9px] tracking-[0.3em] text-stone-500/50">
            All three are canon-safe. The choice is permanent.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
