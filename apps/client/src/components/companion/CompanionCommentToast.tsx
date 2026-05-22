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
import { NPC_REACTIVE_COMMENTS } from "@shared/npcCompanionExtensions";
import {
  onCompanionComment,
  readPlayedCommentIds,
  recordCommentPlay,
} from "@/lib/companionCommentQueue";

/**
 * Resolve `{chronosphere}` and any future `{token}` placeholders in a
 * companion-comment voice line. Today's only token is `chronosphere` —
 * the operator's IANA timezone (e.g. "America/New_York"), read live
 * from Intl.DateTimeFormat at fire time. Mirrors the FINGERPRINT
 * cold-boot read in SurveillanceOpening so the Watcher's diegetic
 * "we placed you" line can name the actual placement.
 *
 * Unrecognised tokens are left intact so authoring typos surface as
 * literal "{nonsense}" in the toast rather than silently disappearing.
 */
function resolveLineTokens(line: string): string {
  if (!line.includes("{")) return line;
  return line.replace(/\{(\w+)\}/g, (match, token) => {
    if (token === "chronosphere") {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || match;
      } catch {
        return match;
      }
    }
    return match;
  });
}

/** Unified comment shape — widens CompanionComment.speaker to string
 *  so NamedNpcKey-keyed comments from NPC_REACTIVE_COMMENTS share the
 *  same renderer. The speaker is keyed into the accent/label maps
 *  below; unknown keys fall through to the default palette. */
type UnifiedComment = Omit<CompanionComment, "speaker"> & { speaker: string };

/** Adapter: NpcReactiveComment → UnifiedComment. Both shapes are
 *  structurally compatible apart from speaker; the unified view lets
 *  one toast pipeline serve both registries. */
const NPC_COMMENTS_UNIFIED: readonly UnifiedComment[] = NPC_REACTIVE_COMMENTS.map(
  (c) => ({
    id: c.id,
    speaker: c.speaker as string,
    trigger: c.trigger,
    voiceLine: c.voiceLine,
    loreReveal: c.loreReveal,
    timing: c.timing,
    maxPlays: c.maxPlays as 1 | 2,
  }),
);

/** Authored toast lines plus Watcher + named-NPC additions. Computed
 *  once at module scope; all sources are static, so this is cheap. */
const ALL_COMMENTS: readonly UnifiedComment[] = [
  ...(COMPANION_COMMENTS as readonly UnifiedComment[]),
  ...(WATCHER_COMMENTS as readonly UnifiedComment[]),
  ...NPC_COMMENTS_UNIFIED,
];

const TOAST_HOLD_MS = 10_000;

type Pending = {
  comment: UnifiedComment;
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

/** Pick ALL comments matching the trigger that still have plays
 *  remaining. The original pipeline picked a single comment (first
 *  match); the NPC reactive layer wants every NPC with a matching
 *  reaction to surface in sequence so the player hears every
 *  witness react at once. The toast renderer queues them. */
function pickComments(trigger: string): UnifiedComment[] {
  const plays = readPlayedCommentIds();
  const matched: UnifiedComment[] = [];
  for (const c of ALL_COMMENTS) {
    if (c.trigger !== trigger) continue;
    const played = plays[c.id] ?? 0;
    if (played >= c.maxPlays) continue;
    matched.push(c);
  }
  return matched;
}

export function CompanionCommentToast() {
  const [active, setActive] = useState<UnifiedComment | null>(null);
  const queueRef = useRef<Pending[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function schedule(comment: UnifiedComment) {
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
      const comments = pickComments(trigger);
      for (const c of comments) schedule(c);
    });

    return () => {
      unsubscribe();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Speaker accent palettes. The original four (elara/human/
  // antiquarian/architect/watcher) keep their canonical hues. The 12
  // NamedNpcKey speakers from NPC_REACTIVE_COMMENTS each get a hue
  // that matches their bible register — the necromancer in
  // emerald (cycle), Iron Lion in orange (standard cloth), Drael'Mon
  // in red (predatory), the Dreamer in purple (substrate), and so on.
  // Unknown speakers fall through to the default rose palette.
  const speakerKey = active?.speaker ?? "";
  const accent = (() => {
    switch (speakerKey) {
      // Original four
      case "elara":
        return { border: "border-cyan-500/60", bg: "bg-cyan-950/60", text: "text-cyan-50", mono: "text-cyan-300/80" };
      case "antiquarian":
      case "the_antiquarian":
        return { border: "border-amber-500/60", bg: "bg-amber-950/60", text: "text-amber-50", mono: "text-amber-300/80" };
      case "architect":
      case "the_architect":
        return { border: "border-violet-500/40", bg: "bg-slate-950/70", text: "text-slate-100", mono: "text-violet-300/70" };
      case "watcher":
        return { border: "border-rose-600/70", bg: "bg-black/80", text: "text-rose-50", mono: "text-rose-400/90" };
      // Named-NPC additions
      case "the_seer":
        return { border: "border-indigo-500/60", bg: "bg-indigo-950/60", text: "text-indigo-50", mono: "text-indigo-300/80" };
      case "the_necromancer":
        return { border: "border-emerald-500/60", bg: "bg-emerald-950/60", text: "text-emerald-50", mono: "text-emerald-300/80" };
      case "engineer_zero":
        return { border: "border-sky-500/60", bg: "bg-slate-950/70", text: "text-sky-50", mono: "text-sky-300/80" };
      case "iron_lion_prefall":
        return { border: "border-orange-500/60", bg: "bg-orange-950/60", text: "text-orange-50", mono: "text-orange-300/80" };
      case "drael_mon":
        return { border: "border-red-600/70", bg: "bg-red-950/70", text: "text-red-50", mono: "text-red-300/80" };
      case "the_dreamer":
        return { border: "border-purple-500/60", bg: "bg-purple-950/60", text: "text-purple-50", mono: "text-purple-300/80" };
      case "the_source":
        return { border: "border-fuchsia-500/60", bg: "bg-fuchsia-950/60", text: "text-fuchsia-50", mono: "text-fuchsia-300/80" };
      case "the_degen":
        return { border: "border-yellow-500/60", bg: "bg-stone-950/70", text: "text-yellow-50", mono: "text-yellow-300/80" };
      case "the_game_master":
        return { border: "border-stone-500/60", bg: "bg-stone-950/70", text: "text-stone-50", mono: "text-stone-300/80" };
      case "the_resurrectionist":
        return { border: "border-teal-500/60", bg: "bg-teal-950/60", text: "text-teal-50", mono: "text-teal-300/80" };
      default:
        return { border: "border-rose-500/60", bg: "bg-rose-950/60", text: "text-rose-50", mono: "text-rose-300/80" };
    }
  })();

  const speakerName = (() => {
    switch (speakerKey) {
      case "elara":            return "Elara";
      case "antiquarian":
      case "the_antiquarian":  return "Daniel Cross";
      case "architect":
      case "the_architect":    return "The Architect";
      case "watcher":          return "// UPLINK";
      case "the_seer":         return "The Seer";
      case "the_necromancer":  return "The Necromancer";
      case "engineer_zero":    return "Engineer Zero";
      case "iron_lion_prefall": return "Iron Lion";
      case "drael_mon":        return "Drael'Mon";
      case "the_dreamer":      return "The Dreamer";
      case "the_source":       return "// THE SOURCE";
      case "the_degen":        return "The Degen";
      case "the_game_master":  return "The Game Master";
      case "the_resurrectionist": return "The Resurrectionist";
      default:                 return "The Human";
    }
  })();

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
                // Mono register for the diegetic-signal speakers:
                // the Watcher's uplink, and the Source's substrate
                // pulses (which carry literal //— [...] markers in
                // their authored lines).
                active.speaker === "watcher" || active.speaker === "the_source"
                  ? "font-mono text-[12px] tracking-[0.06em]"
                  : "font-serif text-[12px]"
              }`}
            >
              {resolveLineTokens(active.voiceLine)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
