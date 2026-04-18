/* ═══════════════════════════════════════════════════════
   FORGIVENESS CHOICE PANEL — §1.5 Bond-80 moral decision.

   Mounts when `forgiveness_choice_unlocked` is true. Shows
   the three-option wheel from §1.5 / §12 C10:

     Forgive Both     — +200 community light, narrators stay
     Forgive Elara    — Elara carries the rest of the game
     Forgive The Human — The Human carries the rest of the game
     Forgive Neither  — +100 dark, +1 vortex, unlocks Dr. Lyra
                        Vox as the third narrator slot

   "The single most impactful moral decision in the Prelude /
   Act 1 arc" per §1.5. The choice is permanent — once made,
   the panel doesn't show again (guarded by
   `forgiveness_choice_made`).
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { applyDischordiaEnergy } from "@/stores/dischordiaCycleStore";
import { recordMemorableMoment } from "@/stores/memorableMomentsStore";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";

export type ForgivenessChoice =
  | "forgive_both"
  | "forgive_elara"
  | "forgive_human"
  | "forgive_neither";

interface ChoiceOption {
  id: ForgivenessChoice;
  label: string;
  description: string;
  /** Accent color class applied to the button border. */
  accent: string;
  /** Narrative flag raised when the player picks this. */
  flag: string;
}

const OPTIONS: ChoiceOption[] = [
  {
    id: "forgive_both",
    label: "Forgive Both",
    description:
      "Neither of them is finished. Neither of them is the one who broke you. They stay.",
    accent: "void-border-success void-bg-success",
    flag: "forgiveness_forgave_both",
  },
  {
    id: "forgive_elara",
    label: "Forgive Elara",
    description:
      "She was the one who signed the bill, and she was the one who sat in your chair for a thousand years. Elara carries the rest.",
    accent: "void-border-success void-bg-success",
    flag: "forgiveness_forgave_elara",
  },
  {
    id: "forgive_human",
    label: "Forgive The Human",
    description:
      "He arrested the woman who drew the card. He was the only one who ever made the Engineer laugh. The Human carries the rest.",
    accent: "void-border void-bg-sunk",
    flag: "forgiveness_forgave_human",
  },
  {
    id: "forgive_neither",
    label: "Forgive Neither",
    description:
      "The universe pays its debts. Neither of them gets out of this clean. A third voice answers when both of them are gone.",
    accent: "void-border-error void-bg-error",
    flag: "forgiveness_forgave_neither",
  },
];

export function ForgivenessChoicePanel() {
  const { state, setNarrativeFlag } = useGame();
  const unlocked = !!state.narrativeFlags?.forgiveness_choice_unlocked;
  const alreadyMade = !!state.narrativeFlags?.forgiveness_choice_made;

  // Inner-voice dispatch: audit 2H — choice_presented whispers as
  // the Bond-80 panel mounts, once per playthrough.
  useEffect(() => {
    if (!unlocked || alreadyMade) return;
    dispatchVoiceWhisper(
      { type: "choice_presented" },
      (state.innerVoiceSkills ?? {}) as Record<string, number>,
    );
  }, [unlocked, alreadyMade, state.innerVoiceSkills]);

  const handleChoose = useCallback(
    (option: ChoiceOption) => {
      setNarrativeFlag(option.flag, true);
      setNarrativeFlag("forgiveness_choice_made", true);

      // §3.6 — apply the right energy row for the choice.
      //   forgive_both   → two_witnesses_forgive (+200 light)
      //   forgive_elara  → two_witnesses_forgive (+200 light, but
      //                     half-measure — still the "forgive" row)
      //   forgive_human  → same
      //   forgive_neither → two_witnesses_refuse (+100 dark, +1 vortex)
      if (option.id === "forgive_neither") {
        applyDischordiaEnergy("two_witnesses_refuse");
        // §1.5 — refusing both unlocks the third narrator slot:
        // the voice of the ship itself, Dr. Lyra Vox, speaking
        // through the substrate.
        setNarrativeFlag("lyra_vox_unlocked", true);
      } else {
        applyDischordiaEnergy("two_witnesses_forgive");
      }

      // Witnessing §11.2 — this is one of the biggest single
      // moments the Antiquarian will remember.
      recordMemorableMoment(
        "bond_peak",
        `The night you chose to ${option.label.toLowerCase()}.`,
        undefined,
        { choice: option.id },
      );
    },
    [setNarrativeFlag],
  );

  if (!unlocked || alreadyMade) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="forgiveness-choice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[95] bg-black/90 flex items-center justify-center p-6"
        role="dialog"
        aria-label="Forgiveness choice"
        data-testid="forgiveness-choice-panel"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="max-w-3xl w-full"
        >
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] tracking-[0.5em] text-white/40 mb-3">
              ♦ THE MEMORIAL CORRIDOR ♦
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white mb-4">
              They are waiting for your judgment.
            </h1>
            <p className="font-mono text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
              Two holograms stand in front of you. Neither speaks. Every
              plaque in the corridor is empty. You get to decide whose
              name goes on which one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChoose(option)}
                className={`text-left p-5 rounded-lg border backdrop-blur-sm bg-black/40 transition ${option.accent}`}
                data-testid={`forgiveness-option-${option.id}`}
              >
                <p className="font-display text-lg font-bold text-white mb-2">
                  {option.label}
                </p>
                <p className="font-mono text-xs text-white/60 leading-relaxed">
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          <p className="text-center mt-8 font-mono text-[10px] text-white/30 italic">
            This choice is permanent. Choose slowly.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
