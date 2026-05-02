/* ═══════════════════════════════════════════════════════
   COMPANION COMMENT TOAST

   Mount once at the AppShell level. Listens for
   fireCompanionComment(trigger) events and plays the first
   matching COMPANION_COMMENTS entry that still has plays
   remaining. Honors the entry's timing (immediate /
   delayed_5s / next_room_enter).

   Positioned fixed bottom-left. One toast at a time;
   incoming fires while a toast is up are queued.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import {
  COMPANION_COMMENTS,
  type CompanionComment,
} from "@shared/companionComments";
import {
  onCompanionComment,
  readPlayedCommentIds,
  recordCommentPlay,
} from "@/lib/companionCommentQueue";

const TOAST_HOLD_MS = 10_000;

type Pending = {
  comment: CompanionComment;
  scheduledAt: number;
};

function delayForTiming(timing: CompanionComment["timing"]): number {
  if (timing === "immediate") return 0;
  if (timing === "delayed_5s") return 5_000;
  // "next_room_enter" is approximated here as a short delay; true
  // room-enter coupling requires a GameContext subscription the
  // toast deliberately avoids.
  return 3_000;
}

function pickComment(trigger: string): CompanionComment | null {
  const plays = readPlayedCommentIds();
  for (const c of COMPANION_COMMENTS) {
    if (c.trigger !== trigger) continue;
    const played = plays[c.id] ?? 0;
    if (played >= c.maxPlays) continue;
    return c;
  }
  return null;
}

export function CompanionCommentToast() {
  const [active, setActive] = useState<CompanionComment | null>(null);
  const queueRef = useRef<Pending[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function schedule(comment: CompanionComment) {
      const delay = delayForTiming(comment.timing);
      window.setTimeout(() => {
        // If a toast is already showing, queue; otherwise play.
        setActive((current) => {
          if (current) {
            queueRef.current.push({ comment, scheduledAt: Date.now() });
            return current;
          }
          recordCommentPlay(comment.id);
          if (timerRef.current !== null) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setActive(null);
            const next = queueRef.current.shift();
            if (next) {
              recordCommentPlay(next.comment.id);
              setActive(next.comment);
              timerRef.current = window.setTimeout(
                () => setActive(null),
                TOAST_HOLD_MS,
              );
            }
          }, TOAST_HOLD_MS);
          return comment;
        });
      }, delay);
    }

    const unsubscribe = onCompanionComment(({ trigger }) => {
      const comment = pickComment(trigger);
      if (comment) schedule(comment);
    });

    return () => {
      unsubscribe();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Speaker accent palettes. Architect lands in a desaturated grey-
  // violet — calibration-register, intentionally flatter than the
  // warmer companion palettes so the contrast reads as "this one's
  // not on your side, exactly."
  const accent =
    active?.speaker === "elara"
      ? { border: "border-cyan-500/60", bg: "bg-cyan-950/60", text: "text-cyan-50", mono: "text-cyan-300/80" }
      : active?.speaker === "antiquarian"
        ? { border: "border-amber-500/60", bg: "bg-amber-950/60", text: "text-amber-50", mono: "text-amber-300/80" }
        : active?.speaker === "architect"
          ? { border: "border-violet-500/40", bg: "bg-slate-950/70", text: "text-slate-100", mono: "text-violet-300/70" }
          : { border: "border-rose-500/60", bg: "bg-rose-950/60", text: "text-rose-50", mono: "text-rose-300/80" };
  const speakerName =
    active?.speaker === "elara"
      ? "Elara"
      : active?.speaker === "antiquarian"
        ? "The Antiquarian"
        : active?.speaker === "architect"
          ? "The Architect"
          : "The Human";

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 max-w-sm">
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            className={`pointer-events-auto rounded-md border ${accent.border} ${accent.bg} p-3 shadow-lg backdrop-blur`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={12} className={accent.mono} />
              <p className={`font-mono text-[9px] uppercase tracking-[0.25em] ${accent.mono}`}>
                {speakerName}
              </p>
            </div>
            <p className={`mt-1 font-serif text-[12px] leading-relaxed ${accent.text}`}>
              {active.voiceLine}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
