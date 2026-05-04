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
import { WATCHER_COMMENTS } from "@shared/watcher/watcherLines";
import {
  onCompanionComment,
  readPlayedCommentIds,
  recordCommentPlay,
} from "@/lib/companionCommentQueue";

/** Authored toast lines plus Watcher additions. Computed once at
 *  module scope; both arrays are static, so this is cheap and stable. */
const ALL_COMMENTS: readonly CompanionComment[] = [
  ...COMPANION_COMMENTS,
  ...WATCHER_COMMENTS,
];

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
  for (const c of ALL_COMMENTS) {
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
  // not on your side, exactly." The Watcher reuses the
  // SurveillanceOpening red so toast-time reads as continuous with
  // the cold-boot handshake.
  const accent =
    active?.speaker === "elara"
      ? { border: "border-cyan-500/60", bg: "bg-cyan-950/60", text: "text-cyan-50", mono: "text-cyan-300/80" }
      : active?.speaker === "antiquarian"
        ? { border: "border-amber-500/60", bg: "bg-amber-950/60", text: "text-amber-50", mono: "text-amber-300/80" }
        : active?.speaker === "architect"
          ? { border: "border-violet-500/40", bg: "bg-slate-950/70", text: "text-slate-100", mono: "text-violet-300/70" }
          : active?.speaker === "watcher"
            ? { border: "border-rose-600/70", bg: "bg-black/80", text: "text-rose-50", mono: "text-rose-400/90" }
            : { border: "border-rose-500/60", bg: "bg-rose-950/60", text: "text-rose-50", mono: "text-rose-300/80" };
  const speakerName =
    active?.speaker === "elara"
      ? "Elara"
      : active?.speaker === "antiquarian"
        ? "The Antiquarian"
        : active?.speaker === "architect"
          ? "The Architect"
          : active?.speaker === "watcher"
            ? "// UPLINK"
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
              {active.speaker === "watcher" ? (
                // Surveillance LED — visually echoes SurveillanceOpening so
                // the Watcher reads as the same diegetic entity that ran
                // the cold-boot handshake.
                <span
                  aria-hidden
                  className="inline-block h-[8px] w-[8px] rounded-full bg-rose-500"
                  style={{ boxShadow: "0 0 10px rgba(255,60,64,0.85)" }}
                />
              ) : (
                <MessageCircle size={12} className={accent.mono} />
              )}
              <p className={`font-mono text-[9px] uppercase tracking-[0.25em] ${accent.mono}`}>
                {speakerName}
              </p>
            </div>
            <p
              className={`mt-1 leading-relaxed ${accent.text} ${
                active.speaker === "watcher"
                  ? "font-mono text-[12px] tracking-[0.06em]"
                  : "font-serif text-[12px]"
              }`}
            >
              {active.voiceLine}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
