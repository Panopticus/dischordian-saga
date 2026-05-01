/* ═══════════════════════════════════════════════════════
   GameMastersInterventionModal

   Two-mode component:

   • **Invocation prompt** (`mode="prompt"`) — shown when the
     player is on a sanctuary day with an eligible apprentice.
     A small button-shaped CTA explaining the cost (1 bond)
     and what's forgiven (1 missed day).

   • **Invocation result** (`mode="result"`) — shown after
     the player invokes. Renders the speaker's voice with
     visual treatment specific to which Game Master spoke:
       - Left  → cold, monospace, no caps in the body
       - Right → warm/coral accent, allowed caps, italic flourishes
       - Cult  → both speakers in sequence, redaction-styled

   Voice surface only — apps/shared/gameMastersTrialIntervention.ts
   owns the lines and the speaker assignments.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Eye } from "lucide-react";
import type {
  Intervention,
  GameMasterSpeaker,
} from "@shared/gameMastersTrialIntervention";

export interface GameMastersInterventionModalProps {
  /** The result event to display, or null. */
  event: {
    intervention: Intervention;
    bondAfter: number;
    missedDaysAfter: number;
    line: string;
    speaker: GameMasterSpeaker;
  } | null;
  onDismiss: () => void;
}

const SPEAKER_LABEL: Record<GameMasterSpeaker, string> = {
  left:  "THE LEFT GAME MASTER",
  right: "THE RIGHT GAME MASTER",
  cult:  "THE GAME MASTERS · PLURAL",
};

/** Each speaker gets a distinct accent color via Tailwind opacity
 *  modifiers on a single `text-primary` token (Void Energy compliant —
 *  no raw hexes). The cult uses muted-foreground deliberately. */
const SPEAKER_ACCENT: Record<GameMasterSpeaker, string> = {
  left:  "text-primary",
  right: "text-primary",
  cult:  "text-muted-foreground",
};

export function GameMastersInterventionModal({
  event,
  onDismiss,
}: GameMastersInterventionModalProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="gm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onDismiss}
        >
          <motion.div
            key={event.intervention.id}
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md void-surface p-5"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-1">
              <Eye size={16} className="text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide">
                {event.intervention.name}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 mb-4 pl-6">
              <div className={`w-1.5 h-1.5 rounded-full ${event.speaker === "right" ? "bg-primary animate-pulse" : "bg-primary"}`} />
              <span className={`font-mono text-[10px] tracking-[0.2em] ${SPEAKER_ACCENT[event.speaker]}`}>
                {SPEAKER_LABEL[event.speaker]}
              </span>
              <span className="font-mono text-[10px] opacity-50 ml-auto tracking-[0.15em]">
                DAY {event.intervention.day}/28
              </span>
            </div>

            {/* The intervention line. The cult line includes embedded
                [LEFT]/[RIGHT]/[CULT] tags + ~~strikethrough~~
                redaction; <pre> preserves the line breaks the shared
                module emits. */}
            <div className="rounded-md border border-primary/20 bg-background/50 p-4 mb-4">
              {event.speaker === "cult" ? (
                <CultLine line={event.line} />
              ) : (
                <p
                  className={
                    event.speaker === "right"
                      ? "text-sm leading-relaxed font-serif italic"
                      : "text-sm leading-relaxed font-mono"
                  }
                >
                  {event.line}
                </p>
              )}
            </div>

            {/* Trial state after the intervention. */}
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 mb-4 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="font-mono text-[9px] opacity-60 tracking-[0.15em] mb-0.5">
                  BOND
                </div>
                <div className="font-display text-sm font-bold text-primary">
                  {event.bondAfter}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] opacity-60 tracking-[0.15em] mb-0.5">
                  MISSED DAYS
                </div>
                <div className="font-display text-sm font-bold text-primary">
                  {event.missedDaysAfter}
                </div>
              </div>
            </div>

            <button
              onClick={onDismiss}
              autoFocus
              className="w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all tracking-wide"
            >
              ACKNOWLEDGE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Render the cult's three-voice closing line with each speaker on
 *  its own indented row. Strikethrough markdown ~~word~~ → <s>word</s>. */
function CultLine({ line }: { line: string }) {
  const rows = line.split("\n");
  return (
    <div className="space-y-2">
      {rows.map((row, i) => {
        const match = row.match(/^\[(LEFT|RIGHT|CULT)\]:\s*(.*)$/);
        if (!match) {
          return (
            <p key={i} className="text-sm leading-relaxed font-mono">
              {renderRedactions(row)}
            </p>
          );
        }
        const [, speaker, body] = match;
        const isCult = speaker === "CULT";
        const isRight = speaker === "RIGHT";
        return (
          <div key={i}>
            <div className={`font-mono text-[9px] tracking-[0.2em] mb-0.5 ${isCult ? "text-muted-foreground" : "text-primary opacity-70"}`}>
              {speaker}
            </div>
            <p
              className={
                isRight
                  ? "text-sm leading-relaxed font-serif italic pl-3"
                  : isCult
                    ? "text-sm leading-relaxed font-mono pl-3 opacity-80"
                    : "text-sm leading-relaxed font-mono pl-3"
              }
            >
              {renderRedactions(body)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Replace ~~word~~ with <s>word</s>. Preserves the cult's editorial
 *  signature without leaning on dangerouslySetInnerHTML. */
function renderRedactions(text: string): React.ReactNode {
  const parts = text.split(/(~~[^~]+~~)/g);
  return parts.map((p, i) => {
    if (p.startsWith("~~") && p.endsWith("~~")) {
      return (
        <s key={i} className="opacity-60">
          {p.slice(2, -2)}
        </s>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

/** Small inline CTA the page renders when the player is on a
 *  sanctuary day with an eligible apprentice. */
export function GameMastersInvocationPrompt({
  trialDay,
  onInvoke,
  invoking,
}: {
  trialDay: number;
  onInvoke: () => void;
  invoking: boolean;
}) {
  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 p-3 mb-4">
      <div className="flex items-center gap-1.5 mb-1.5">
        <ScrollText size={12} className="text-primary" />
        <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
          MATRIX OF DREAMS &middot; SANCTUARY DAY {trialDay}
        </span>
      </div>
      <p className="text-xs leading-relaxed opacity-90 mb-3">
        The Game Masters will absolve a missed day. Cost: 1 bond. The cult
        does not work for free, and ceremony has weight.
      </p>
      <button
        onClick={onInvoke}
        disabled={invoking}
        className="w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all tracking-wide disabled:opacity-50"
      >
        {invoking ? "INVOKING..." : "INVOKE INTERVENTION"}
      </button>
    </div>
  );
}
