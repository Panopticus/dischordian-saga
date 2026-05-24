/* ═══════════════════════════════════════════════════════
   DISCHORDIAN SAGA EPISODE PLAYER

   Plays one episode of the in-fiction "Dischordian Saga"
   show. Modeled on DischordiaOpeningCinematic.tsx (the
   pre-login title sequence) but:

   - Accepts a `DischordianSagaEpisode` instead of a
     hardcoded URL, so the same component covers every
     episode that ever ships.
   - When the episode hasn't been produced yet (durationSec
     === null), renders a diegetic "signal received,
     decoding in progress" overlay and still calls
     onComplete so downstream gating (e.g. the violence
     vote opening on dismissal) is unblocked. The fallback
     is the asset, not an error state.
   - Does not pre-roll a separate audio bed — episodes
     ship with their own mix.

   Mounted by the consumer (observation-deck handler for
   the player's first encounter with Engineer Recording 3,
   or a Loredex "Replay Episode" button), unmounts itself
   by calling onComplete and letting the parent flip the
   gate flag.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assetUrl } from "@/lib/assetUrl";
import {
  type DischordianSagaEpisode,
  episodeIsProduced,
  episodeSeenFlag,
} from "@shared/dischordianSagaEpisodes";

interface Props {
  episode: DischordianSagaEpisode;
  /** Fires when the episode dismisses for any reason —
   *  natural end, skip, safety timer, or fallback dismiss.
   *  `reachedEndNaturally` distinguishes the "watched it
   *  through" case from the "skipped" case so unlocks
   *  like Loredex "witnessed the pilot" can be gated. */
  onComplete: (reachedEndNaturally: boolean) => void;
  /** When true, the seen-flag is not written. Used by the
   *  Loredex replay affordance so replays don't re-mark
   *  the device state. */
  isReplay?: boolean;
}

export default function DischordianSagaEpisodePlayer({
  episode,
  onComplete,
  isReplay = false,
}: Props) {
  const produced = episodeIsProduced(episode);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<
    "loading" | "playing" | "needs-tap" | "fallback" | "ending"
  >(produced ? "loading" : "fallback");
  const [showSkip, setShowSkip] = useState(false);

  const finish = useCallback(
    (reachedEndNaturally: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      if (!isReplay) {
        try {
          window.localStorage.setItem(episodeSeenFlag(episode), "1");
        } catch {
          // ignore — private mode / disabled storage
        }
      }
      setPhase("ending");
      setTimeout(() => onComplete(reachedEndNaturally), 400);
    },
    [episode, isReplay, onComplete],
  );

  // SKIP button appears after 2s in every phase so a hung
  // or unwanted video never traps the player.
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Real video path. Skipped entirely in fallback mode.
  useEffect(() => {
    if (!produced) return;
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    const startPlayback = () => {
      if (cancelled || completedRef.current) return;
      video.muted = false;
      video.play().then(
        () => {
          if (cancelled) return;
          setPhase("playing");
          if (!safetyTimerRef.current && episode.durationSec) {
            safetyTimerRef.current = setTimeout(
              () => finish(false),
              (episode.durationSec + 2) * 1000,
            );
          }
        },
        () => {
          if (cancelled) return;
          setPhase("needs-tap");
        },
      );
    };
    const onLoaded = () => startPlayback();
    const onError = () => {
      if (cancelled) return;
      // CDN miss — drop into the diegetic fallback instead
      // of stranding the player on a failed video element.
      setPhase("fallback");
    };
    if (video.readyState >= 1) {
      startPlayback();
    } else {
      video.addEventListener("loadedmetadata", onLoaded);
    }
    video.addEventListener("error", onError);
    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, [produced, episode.durationSec, finish]);

  const handleTapToBegin = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setPhase("playing");
      if (!safetyTimerRef.current && episode.durationSec) {
        safetyTimerRef.current = setTimeout(
          () => finish(false),
          (episode.durationSec + 2) * 1000,
        );
      }
    } catch {
      setPhase("needs-tap");
    }
  }, [episode.durationSec, finish]);

  const videoUrl = assetUrl(episode.videoPath);
  const seasonEpisodeLabel = `S${String(episode.season).padStart(2, "0")}E${String(episode.episode).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {phase !== "ending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          role="dialog"
          aria-label={`Dischordian Saga ${seasonEpisodeLabel}: ${episode.title}`}
        >
          {produced && phase !== "fallback" && (
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              preload="auto"
              onEnded={() => finish(true)}
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Persistent CRT scan-line overlay — present in
              all phases so the video itself reads as a
              broadcast, not a UI surface. */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
            }}
          />

          {/* Loading / needs-tap overlays for the real
              video path. */}
          <AnimatePresence>
            {(phase === "loading" || phase === "needs-tap") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
              >
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                  ▸ Dischordian Saga · {seasonEpisodeLabel}
                </div>
                <div className="font-mono text-2xl md:text-4xl uppercase tracking-widest text-emerald-200 drop-shadow-[0_0_24px_rgba(16,185,129,0.6)]">
                  {episode.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
                  Broadcast incoming · Authenticated
                </div>
                {phase === "loading" && (
                  <div className="font-mono text-xs text-emerald-500/50 mt-4">
                    Decoding transmission…
                  </div>
                )}
                {phase === "needs-tap" && (
                  <button
                    onClick={handleTapToBegin}
                    className="mt-6 px-10 py-3 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-sm rounded shadow-[0_0_36px_rgba(16,185,129,0.6)]"
                  >
                    ▸ Tap to begin
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Diegetic fallback — episode hasn't been
              produced yet (durationSec === null) OR the
              video URL failed to load. The player still
              gets to "watch" something, in-fiction: a
              partial decoding overlay that hands off to
              the vote on dismissal. */}
          <AnimatePresence>
            {phase === "fallback" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center max-w-3xl mx-auto"
              >
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/80">
                  ▸ Dischordian Saga · {seasonEpisodeLabel}
                </div>
                <div className="font-mono text-2xl md:text-3xl uppercase tracking-widest text-emerald-200 drop-shadow-[0_0_24px_rgba(16,185,129,0.6)]">
                  {episode.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/50">
                  Signal received · Decoding in progress
                </div>
                <p className="font-serif text-base md:text-lg italic text-emerald-100/80 leading-relaxed max-w-prose">
                  The full transmission will arrive when the Eyes finish
                  reassembling it. For now you hear the recording the
                  Engineer left behind, and you can already feel the
                  shape of the question it is going to ask you.
                </p>
                <p className="font-mono text-xs text-emerald-300/60 max-w-prose leading-relaxed">
                  {episode.synopsis}
                </p>
                <button
                  onClick={() => finish(true)}
                  className="mt-2 px-10 py-3 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-sm rounded shadow-[0_0_36px_rgba(16,185,129,0.6)]"
                >
                  ▸ The Vote is Open
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip — always available after 2s so a hung
              load never traps the player. Skipping the
              fallback also fires onComplete (the vote
              still opens). */}
          <AnimatePresence>
            {showSkip && phase !== "fallback" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => finish(false)}
                aria-label="Skip the episode"
                style={{
                  bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
                  right: "max(1.5rem, env(safe-area-inset-right, 0px))",
                }}
                className="absolute px-5 py-3 border border-emerald-500/60 bg-black/80 hover:bg-emerald-900/40 text-emerald-200 font-mono text-xs uppercase tracking-[0.3em] rounded backdrop-blur-sm shadow-[0_0_18px_rgba(16,185,129,0.4)]"
              >
                SKIP ▸
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
