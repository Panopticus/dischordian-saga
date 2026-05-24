/* ═══════════════════════════════════════════════════════
   ENGINEER RECORDING DISCOVERY MODAL

   Pops a full-screen holographic modal the first time an
   Engineer recording unlocks. Shows the transcript + both
   NPC reactions (Elara / The Human). Dismissable. Mounted
   in AppShellImmersive so it triggers regardless of which
   page the player is on when the discovery flag flips.

   The discovery flags themselves are set by the
   CARD_BATTLE_MILESTONES watcher in useNarrativeIntegration.ts.
   This modal only READS the flag; it never sets one.

   Each flag fires the modal exactly once per session. After
   the player dismisses, a ref records the flag so a flag-
   update cycle doesn't re-open it in the same session. The
   flag stays set across saves so future sessions don't
   re-surface the same recording.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  ENGINEER_RECORDINGS,
  type HoloRecording,
} from "@shared/engineerRecordings";
import {
  findEpisodeForRecording,
  episodeSeenFlag,
} from "@shared/dischordianSagaEpisodes";
import DischordianSagaEpisodePlayer from "@/components/DischordianSagaEpisodePlayer";
import EngineerVoteOverlay from "@/components/EngineerVoteOverlay";

export default function EngineerRecordingDiscoveryModal() {
  const { state } = useGame();
  const flags = state.narrativeFlags ?? {};

  // Session-level suppression: once dismissed this session, don't
  // reopen even if the flag stays set.
  const shownThisSessionRef = useRef<Set<string>>(new Set());
  const [queue, setQueue] = useState<HoloRecording[]>([]);

  // Build the list of recordings whose discovery flag is hot AND
  // haven't been shown in this session yet. Sorted by `order` so
  // the modal queue respects canonical sequence even if two flags
  // flipped on the same render.
  const pending = useMemo<HoloRecording[]>(() => {
    return ENGINEER_RECORDINGS.filter((r) => {
      if (!flags[r.discoveryFlag]) return false;
      if (shownThisSessionRef.current.has(r.id)) return false;
      return true;
    })
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [flags]);

  // Merge newly-pending recordings into the queue exactly once.
  useEffect(() => {
    if (pending.length === 0) return;
    setQueue((prev) => {
      const prevIds = new Set(prev.map((r) => r.id));
      const next = [...prev];
      for (const r of pending) {
        if (!prevIds.has(r.id)) next.push(r);
      }
      return next;
    });
  }, [pending]);

  const active = queue[0] ?? null;

  function dismissActive() {
    if (!active) return;
    shownThisSessionRef.current.add(active.id);
    setQueue((prev) => prev.slice(1));
  }

  // Dischordian Saga episode interception: if the active
  // recording is paired with an episode AND the player
  // hasn't seen the episode on this device yet, play the
  // episode first. The companion vote opens immediately
  // on episode dismissal. The text-only recording modal
  // is suppressed in that case — Recording 3's content
  // *is* the episode, and the in-fiction artifact has
  // already been delivered.
  const pairedEpisode = active
    ? findEpisodeForRecording(active.id)
    : null;
  const episodeAlreadySeen =
    pairedEpisode && typeof window !== "undefined"
      ? window.localStorage.getItem(episodeSeenFlag(pairedEpisode)) === "1"
      : false;
  const playingEpisodeFor = pairedEpisode && !episodeAlreadySeen ? pairedEpisode : null;
  const [voteOverlayOpen, setVoteOverlayOpen] = useState(false);

  return (
    <AnimatePresence>
      {playingEpisodeFor && (
        <DischordianSagaEpisodePlayer
          key={`episode-${playingEpisodeFor.slug}`}
          episode={playingEpisodeFor}
          onComplete={() => {
            // Suppress the text-only recording modal for
            // this recording — the episode covered it —
            // and open the vote overlay directly.
            if (active) shownThisSessionRef.current.add(active.id);
            setQueue((prev) => prev.slice(1));
            if (playingEpisodeFor.voteId) setVoteOverlayOpen(true);
          }}
        />
      )}
      {voteOverlayOpen && pairedEpisode?.voteId && (
        <EngineerVoteOverlay
          key={`vote-${pairedEpisode.voteId}`}
          voteId={pairedEpisode.voteId}
          onClose={() => setVoteOverlayOpen(false)}
        />
      )}
      {active && !playingEpisodeFor && (
        <motion.div
          key={active.id}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/85 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissActive}
        >
          <motion.div
            className="relative w-full max-w-2xl rounded border border-amber-400/30 bg-stone-950/95 p-6 shadow-[0_0_60px_rgba(245,158,11,0.18)]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Dismiss recording"
              onClick={dismissActive}
              className="absolute right-3 top-3 rounded p-1 text-amber-200/70 hover:text-amber-100 hover:bg-stone-900/60"
            >
              <X size={16} />
            </button>

            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
              Engineer Recording · #{active.order}
            </p>
            <h2 className="mt-1 font-serif text-2xl italic text-amber-50">
              {active.title}
            </h2>

            <blockquote className="mt-5 border-l-2 border-amber-400/40 pl-4 font-serif italic leading-relaxed text-[14px] text-amber-100/90">
              {active.transcript}
            </blockquote>

            {active.npcReactions.elara && (
              <div className="mt-4 rounded border border-cyan-500/30 bg-cyan-950/15 p-3">
                <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/80">
                  Elara
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-cyan-100/90">
                  {active.npcReactions.elara}
                </p>
              </div>
            )}

            {active.npcReactions.the_human && (
              <div className="mt-3 rounded border border-indigo-500/30 bg-indigo-950/15 p-3">
                <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/80">
                  The Human
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-indigo-100/90">
                  {active.npcReactions.the_human}
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="font-mono text-[10px] text-stone-500">
                {queue.length > 1
                  ? `${queue.length - 1} more recording${queue.length - 1 === 1 ? "" : "s"} queued`
                  : "Filed into the Antiquarian's journal"}
              </p>
              <button
                type="button"
                onClick={dismissActive}
                className="rounded border border-amber-400/40 bg-amber-950/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
