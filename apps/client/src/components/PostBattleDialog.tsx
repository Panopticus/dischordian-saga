/* ═══════════════════════════════════════════════════════
   POST-BATTLE COMPANION DIALOG — Reactive companion lines
   after fight/card/chess outcomes. Auto-dismiss after 4s.
   Uses AnimatedPortrait when available.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AnimatedPortrait } from "@/components/AnimatedPortrait";
import { useElaraVO } from "@/hooks/useElaraVO";
import { useHumanVO } from "@/hooks/useHumanVO";
import { useSourceVO } from "@/hooks/useSourceVO";
import { useAgentZeroVO } from "@/hooks/useAgentZeroVO";

/* ── Dialog lines per outcome ── */
type Outcome = "victory" | "defeat" | "close";

interface CompanionLines {
  victory: string[];
  defeat: string[];
  close: string[];
}

const COMPANION_DIALOG: Record<string, CompanionLines> = {
  elara: {
    victory: [
      "Flawless. The Architect's soldiers couldn't do better.",
      "Your combat algorithms are evolving faster than predicted.",
      "The Ark's sensors registered that win across three decks. Impressive.",
      "I've logged the tactical data. You're developing a signature style.",
    ],
    defeat: [
      "We learn from this. The Ark needs you alive.",
      "Recalibrating. Every defeat is data for the next victory.",
      "That loss changes nothing about your potential. Get up.",
      "I've analyzed the failure points. Next time will be different.",
    ],
    close: [
      "My circuits nearly overloaded watching that.",
      "Closer than I'd like. My predictive models need recalibration.",
      "A razor's edge. That kind of fight reveals character.",
      "You thrive under pressure. I've noted that in your profile.",
    ],
  },
  the_human: {
    victory: [
      "Not bad, kid. The old fighters would've respected that.",
      "You fight like someone who's got something to lose. Good.",
      "Clean win. Don't let it make you careless.",
      "I've seen centuries of combat. That was... memorable.",
    ],
    defeat: [
      "That one stung. Take a moment.",
      "We survived. That's what matters.",
      "Losing isn't the end. Quitting is. And you're still here.",
      "Pain is information. Use it.",
    ],
    close: [
      "Thought we were done for a second there. Heart still racing.",
      "Skin of our teeth. The old-fashioned way.",
      "You've got grit. Can't teach that.",
      "Close fights build legends. Remember this one.",
    ],
  },
  agent_zero: {
    victory: [
      "Target eliminated. Efficiency acceptable.",
      "Victory confirmed. Moving to next objective.",
      "Clean execution. The Panopticon would approve.",
      "Satisfactory performance. Continue.",
    ],
    defeat: [
      "Tactical retreat acknowledged. Reassessing parameters.",
      "Failure logged. Adapting countermeasures.",
      "Unacceptable outcome. We will correct this.",
      "Data gathered. The next engagement will differ.",
    ],
    close: [
      "Margin of victory: negligible. Unacceptable variance.",
      "Outcome within error tolerance. Barely.",
      "Probability of defeat was 47.3%. Too high.",
      "Noted: your risk tolerance exceeds my recommendations.",
    ],
  },
};

const DEFAULT_LINES: CompanionLines = {
  victory: ["Well fought. Victory is ours."],
  defeat: ["A setback, nothing more. We continue."],
  close: ["That was closer than comfortable."],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Component ── */

interface PostBattleDialogProps {
  /** The outcome of the battle */
  outcome: Outcome;
  /** The companion reacting (e.g. "elara", "the_human") */
  companionId: string;
  /** Companion display name */
  companionName?: string;
  /** Called when dialog dismisses */
  onDismiss: () => void;
}

/* ── Elara VO line ID mapping ──
   Maps the PostBattleDialog outcome to the VO manifest IDs.
   "victory" maps to decisive_victory, "defeat" to defeat, "close" to close_victory. */
const ELARA_OUTCOME_VO: Record<Outcome, string> = {
  victory: "battle_decisive_victory",
  defeat: "battle_defeat",
  close: "battle_close_victory",
};

const HUMAN_OUTCOME_VO: Record<Outcome, string> = {
  victory: "human_battle_dv_1",
  defeat: "human_battle_def_1",
  close: "human_battle_cv_1",
};

const SOURCE_OUTCOME_VO: Record<Outcome, string> = {
  victory: "kael_decisive_victory_00",
  defeat: "kael_defeat_00",
  close: "kael_close_victory_00",
};

const ZERO_OUTCOME_VO: Record<Outcome, string> = {
  victory: "agent_zero_decisive_victory_00",
  defeat: "agent_zero_defeat_00",
  close: "agent_zero_close_victory_00",
};

export default function PostBattleDialog({
  outcome,
  companionId,
  companionName,
  onDismiss,
}: PostBattleDialogProps) {
  const [visible, setVisible] = useState(true);
  const { speak } = useElaraVO();
  const { speak: speakHuman } = useHumanVO();
  const { speak: speakSource } = useSourceVO();
  const { speak: speakZero } = useAgentZeroVO();

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  }, [onDismiss]);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, [dismiss]);

  const lines = COMPANION_DIALOG[companionId] ?? DEFAULT_LINES;
  const line = pickRandom(lines[outcome]);

  // Play companion VO based on who is reacting
  useEffect(() => {
    if (companionId === "elara") {
      speak(ELARA_OUTCOME_VO[outcome]);
    } else if (companionId === "the_human") {
      speakHuman(HUMAN_OUTCOME_VO[outcome]);
    } else if (companionId === "kael") {
      speakSource(SOURCE_OUTCOME_VO[outcome]);
    } else if (companionId === "agent_zero") {
      speakZero(ZERO_OUTCOME_VO[outcome]);
    }
  }, [companionId, outcome, speak, speakHuman, speakSource, speakZero]);

  const displayName =
    companionName ??
    (companionId === "elara" ? "Elara" : companionId === "the_human" ? "The Human" : companionId === "agent_zero" ? "Agent Zero" : "Companion");

  const accentColor =
    companionId === "elara"
      ? "cyan"
      : companionId === "the_human"
        ? "amber"
        : companionId === "agent_zero"
          ? "red"
          : "purple";

  const borderClass = `border-${accentColor}-500/30`;
  const nameClass = `text-${accentColor}-400`;
  const dotClass = `bg-${accentColor}-400`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 z-[9998] cursor-pointer max-w-lg w-[calc(100%-2rem)]"
          onClick={dismiss}
        >
          <div
            className={`flex items-center gap-4 p-4 rounded-xl border ${borderClass} bg-black/90 backdrop-blur-md shadow-2xl`}
          >
            {/* Portrait */}
            <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden">
              <AnimatedPortrait
                npcId={companionId}
                expression={outcome === "victory" ? "emotional1" : outcome === "defeat" ? "emotional2" : "speaking"}
                isSpeaking
                size="bust"
                className="!max-w-none"
              />
            </div>

            {/* Dialog content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />
                <span className={`font-display text-xs tracking-[0.15em] font-bold ${nameClass}`}>
                  {displayName.toUpperCase()}
                </span>
                <span className="font-mono text-[8px] text-white/20 tracking-wider">
                  [{outcome.toUpperCase()}]
                </span>
              </div>
              <p className="font-mono text-sm text-white/80 leading-relaxed">
                "{line}"
              </p>
            </div>

            {/* Close hint */}
            <button
              onClick={(e) => { e.stopPropagation(); dismiss(); }}
              className="flex-shrink-0 text-white/20 hover:text-white/50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Tap to dismiss hint */}
          <p className="text-center font-mono text-[8px] text-white/20 mt-1.5">
            click to dismiss
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
