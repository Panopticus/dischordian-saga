/* ═══════════════════════════════════════════════════════
   COMPANION ASK PANEL

   Non-invasive render surface for the companionAskTopics
   data layer. Mount it wherever the UI wants to let the
   player ask Elara or The Human about a topic — comms
   array, room hubs, inside a scripted wheel, etc.

   Behavior:
     - Reads getAvailableAskTopics(speaker, flags, act)
     - Shows each topic as a button; clicking shows the
       answer in-place; a Back button returns to the list
     - If a topic declares a follow-up, the answer view
       offers a one-tap continuation

   No dependency on the existing DialogWheel typing — this
   composes alongside it. Consumers pass the current narrative
   flags + act number; the panel filters topics accordingly.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, MessageCircle } from "lucide-react";
import {
  getAskTopic,
  getAvailableAskTopics,
  resolveAskAnswer,
  type AskSpeaker,
  type CompanionAskTopic,
} from "@shared/companionAskTopics";

export interface CompanionAskPanelProps {
  /** Which companion is on the other side of the conversation. */
  speaker: AskSpeaker;
  /** Narrative flags the player has set. */
  flags: ReadonlySet<string>;
  /** Current narrative act (1-7). */
  currentAct: number;
  /** Optional heading; defaults to "Ask Elara" / "Ask The Human". */
  heading?: string;
  /** Called when the player dismisses the panel. */
  onClose?: () => void;
}

const SPEAKER_ACCENT: Record<AskSpeaker, { border: string; bg: string; text: string; mono: string }> = {
  elara: {
    border: "border-cyan-500/50",
    bg: "bg-cyan-950/30",
    text: "text-cyan-50",
    mono: "text-cyan-300/80",
  },
  human: {
    border: "border-rose-500/50",
    bg: "bg-rose-950/30",
    text: "text-rose-50",
    mono: "text-rose-300/80",
  },
};

export function CompanionAskPanel({
  speaker,
  flags,
  currentAct,
  heading,
  onClose,
}: CompanionAskPanelProps) {
  const accent = SPEAKER_ACCENT[speaker];
  const title = heading ?? (speaker === "elara" ? "Ask Elara" : "Ask The Human");
  const topics = useMemo(
    () => getAvailableAskTopics(speaker, flags, currentAct),
    [speaker, flags, currentAct],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: CompanionAskTopic | null = selectedId
    ? (getAskTopic(selectedId) ?? null)
    : null;

  return (
    <div
      className={`rounded-md border ${accent.border} ${accent.bg} p-4 shadow-lg backdrop-blur`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className={accent.mono} />
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${accent.mono}`}>
            {title}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`font-mono text-[9px] uppercase tracking-wider ${accent.mono} hover:opacity-80`}
          >
            Close
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3 space-y-2"
          >
            {topics.length === 0 && (
              <p className={`font-serif italic text-[12px] ${accent.text} opacity-70`}>
                Nothing unlocked yet. Keep witnessing.
              </p>
            )}
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`w-full rounded border ${accent.border} bg-stone-950/40 px-3 py-2 text-left transition-colors hover:bg-stone-900/60`}
              >
                <p className={`font-mono text-[9px] uppercase tracking-wider ${accent.mono}`}>
                  {t.label}
                </p>
                <p className={`mt-1 font-serif text-[12px] ${accent.text}`}>
                  {t.question}
                </p>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-3 space-y-3"
          >
            <div>
              <p className={`font-mono text-[9px] uppercase tracking-wider ${accent.mono}`}>
                You asked
              </p>
              <p className={`mt-1 font-serif text-[12px] ${accent.text} opacity-90`}>
                {selected.question}
              </p>
            </div>
            <div>
              <p className={`font-mono text-[9px] uppercase tracking-wider ${accent.mono}`}>
                {speaker === "elara" ? "Elara" : "The Human"} · answer
              </p>
              <p className={`mt-1 font-serif text-[13px] leading-relaxed ${accent.text}`}>
                {resolveAskAnswer(selected, currentAct, flags)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${accent.mono} hover:opacity-80`}
              >
                <ChevronLeft size={10} />
                Back
              </button>
              {selected.followUp && getAskTopic(selected.followUp) && (
                <button
                  type="button"
                  onClick={() => setSelectedId(selected.followUp!)}
                  className={`rounded border ${accent.border} px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${accent.mono} hover:bg-stone-900/40`}
                >
                  Follow up →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
