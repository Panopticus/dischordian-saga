/* ═══════════════════════════════════════════════════════
   DISCHORDIA OPENING CINEMATIC — first-visit MP4 + AWAKEN gate

   Plays ONCE per device. Mounted by TitlePage ONLY after the
   SurveillanceOpening handshake completes — the user's
   CONFIRM OPERATOR / LOOK AWAY click satisfies the browser's
   autoplay-with-sound gesture requirement, so the meme
   transmission's own audio plays unmuted and is the only
   sound the player hears for the duration of the broadcast.

   The cinematic dismisses straight back to the title's login
   screen. T01 ("The Enigma's Lament") was pre-rolled muted on
   the surveillance gesture and unmuted in the broadcast's last
   10 seconds, so the player lands on login with the song already
   playing as the title bed. The 19-frame T01 slideshow is no
   longer played in the title flow — it surfaces in the Loredex
   as a "dream" entry once this cinematic completes naturally.

   Pattern mirrored from apps/client/src/components/OpeningCinematic.tsx:
     - Skip ("AWAKEN") fades in after 2 seconds
     - Safety timer ensures completion if `ended` never fires
     - reachedEndNaturally flag passed to onComplete so a
       skipped first-visit doesn't permanently lock the
       cinematic out — the player can replay it from INBOX

   Mounted by TitlePage; unmounts itself by calling
   onComplete and letting the parent's gate flag flip.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assetUrl } from "@/lib/assetUrl";
import { markOpeningSeen } from "@/lib/dischordiaOpeningSeen";

export const DISCHORDIA_OPENING_VIDEO_URL = assetUrl(
  "videos/title/the-dischordia-opening.mp4",
);

/** Producer-supplied duration in seconds. The safety timer fires at
 *  duration + 2 so a stuck `ended` event doesn't trap the player. */
const VIDEO_DURATION_S = 190;

/** When the meme video has this many seconds (or less) remaining, fire
 *  `onSongShouldStart` so the parent can pre-roll The Enigma's Lament.
 *  Picked to overlap the closing beats of the broadcast with the song's
 *  intro so the handoff to the slideshow lands with audio already
 *  playing — no autoplay-block risk on the cut, no second of silence. */
const SONG_PREROLL_LEAD_S = 10;

interface Props {
  /** Fires when the cinematic dismisses for any reason — natural end,
   *  AWAKEN click, or the safety timer expiring. The flag lets the
   *  parent decide whether to mark the device-flag (we mark it on
   *  every dismissal — players can replay from INBOX). */
  onComplete: (reachedEndNaturally: boolean) => void;
  /** Fires when the cinematic's video ends naturally OR the safety
   *  timer trips — distinct from `onComplete` which only fires after
   *  the 400ms fade-out. The parent uses this to start the T01
   *  audio + slideshow handoff while the cinematic is still fading. */
  onCinematicEnded?: () => void;
  /** Fires once, ~10 seconds before the meme video ends. The parent
   *  uses this to REVEAL The Enigma's Lament — the song was already
   *  pre-rolled muted on the user's CONFIRM/LOOK AWAY click (so iOS
   *  Safari accepts the audio.play() — sticky activation doesn't apply
   *  there). At cue time the parent seeks back to 0 and unmutes; the
   *  audible intro plays under the closing beats and continues under
   *  the login screen as the title bed. */
  onSongShouldStart?: () => void;
}

export default function DischordiaOpeningCinematic({
  onComplete,
  onCinematicEnded,
  onSongShouldStart,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const songCueFiredRef = useRef(false);
  const [phase, setPhase] = useState<
    "loading" | "ready" | "playing" | "needs-tap" | "ending"
  >("loading");
  const [showAwaken, setShowAwaken] = useState(false);

  // One-shot: fire the song pre-roll cue as soon as we're inside the
  // last `SONG_PREROLL_LEAD_S` seconds of the broadcast. Idempotent —
  // multiple timeupdate ticks after the threshold all no-op.
  const fireSongCue = useCallback(() => {
    if (songCueFiredRef.current) return;
    songCueFiredRef.current = true;
    onSongShouldStart?.();
  }, [onSongShouldStart]);

  // AWAKEN button fades in after 2 seconds, regardless of playback state,
  // so a hung video never traps the player.
  useEffect(() => {
    const t = setTimeout(() => setShowAwaken(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // The component only mounts AFTER the user clicks CONFIRM OPERATOR
  // or LOOK AWAY on the surveillance handshake, so we have a fresh
  // user gesture and can play unmuted (the meme transmission's audio
  // is the only thing the player hears during the broadcast). Once
  // metadata loads we kick off playback.
  useEffect(() => {
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
          // Safety timer: video.duration + 2s. If `ended` never
          // fires we bail out gracefully — and signal cinematic-
          // ended so the album intro stage still gets its handoff.
          if (!safetyTimerRef.current) {
            safetyTimerRef.current = setTimeout(() => {
              fireCinematicEnded();
              finish(false);
            }, (VIDEO_DURATION_S + 2) * 1000);
          }
        },
        () => {
          if (cancelled) return;
          // Even muted autoplay can fail in iframes / private modes.
          // Fall back to a tap-to-begin overlay.
          setPhase("needs-tap");
        },
      );
    };
    const onLoaded = () => startPlayback();
    const onError = () => {
      if (!cancelled) setPhase("needs-tap");
    };
    // Pre-roll the T01 song once we're inside the last
    // `SONG_PREROLL_LEAD_S` of the broadcast. We poll on an interval
    // rather than `timeupdate` because `timeupdate` cadence varies wildly
    // across browsers/codecs (sometimes ~250ms, sometimes seconds apart)
    // and on slow devices can skip the threshold entirely. A 250ms
    // poll is cheap and deterministic; falls back to VIDEO_DURATION_S
    // if the metadata-derived duration isn't finite.
    const cueInterval = setInterval(() => {
      if (songCueFiredRef.current) {
        clearInterval(cueInterval);
        return;
      }
      const total =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : VIDEO_DURATION_S;
      if (total - video.currentTime <= SONG_PREROLL_LEAD_S) {
        fireSongCue();
        clearInterval(cueInterval);
      }
    }, 250);
    if (video.readyState >= 1) {
      // Metadata already buffered (cached load) — start immediately.
      startPlayback();
    } else {
      video.addEventListener("loadedmetadata", onLoaded);
    }
    video.addEventListener("error", onError);
    return () => {
      cancelled = true;
      clearInterval(cueInterval);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cinematicEndedRef = useRef(false);
  const fireCinematicEnded = useCallback(() => {
    if (cinematicEndedRef.current) return;
    cinematicEndedRef.current = true;
    onCinematicEnded?.();
  }, [onCinematicEnded]);

  const finish = useCallback(
    (reachedEndNaturally: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      // The cinematic-ended signal fires here too if it hasn't
      // already (covers the AWAKEN-mid-playback case so the title
      // album intro can take over without waiting for the 400ms
      // fade-out).
      fireCinematicEnded();
      markOpeningSeen();
      setPhase("ending");
      // Brief fade-out before unmounting.
      setTimeout(() => onComplete(reachedEndNaturally), 400);
    },
    [onComplete, fireCinematicEnded],
  );

  // Tap-to-begin fallback for environments where even gesture-backed
  // autoplay is blocked (some iframes, private modes). The user's
  // explicit click here re-arms the gesture for the session.
  const handleTapToBegin = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setPhase("playing");
      if (!safetyTimerRef.current) {
        safetyTimerRef.current = setTimeout(() => {
          fireCinematicEnded();
          finish(false);
        }, (VIDEO_DURATION_S + 2) * 1000);
      }
    } catch {
      setPhase("needs-tap");
    }
  }, [finish, fireCinematicEnded]);

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
          aria-label="Dischordia opening transmission"
        >
          <video
            ref={videoRef}
            src={DISCHORDIA_OPENING_VIDEO_URL}
            playsInline
            preload="auto"
            onEnded={() => finish(true)}
            className="w-full h-full object-contain bg-black"
            // CSS scan-line overlay lives in a sibling div below
          />

          {/* Persistent CRT scan-line overlay — present in all phases */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
            }}
          />

          {/* TRANSMISSION INCOMING overlay — visible while buffering
              and as a tap-to-begin fallback if muted autoplay is
              blocked. Fades out the moment the video starts playing
              so it doesn't fight the surveillance handshake overlay
              running on top. */}
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
                  ▸ Late Night with the Meme
                </div>
                <div className="font-mono text-2xl md:text-4xl uppercase tracking-widest text-emerald-200 drop-shadow-[0_0_24px_rgba(16,185,129,0.6)]">
                  Transmission Incoming
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">
                  Signal hijacked · Unauthorized frequency
                </div>
                {phase === "loading" && (
                  <div className="font-mono text-xs text-emerald-500/50 mt-4">
                    Buffering transmission…
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

          {/* AWAKEN — in-world skip button. Visible from 2s onward,
              in every phase, so a stuck or unwanted video never traps.
              Always clickable: this is the player's escape hatch, and
              gating it behind isGameReady would trap a player whose
              auth/threshold check hangs. Downstream gates can deal
              with the not-ready case. */}
          <AnimatePresence>
            {showAwaken && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => finish(false)}
                aria-label="Skip the opening transmission"
                style={{
                  bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
                  right: "max(1.5rem, env(safe-area-inset-right, 0px))",
                }}
                className="absolute px-5 py-3 border border-emerald-500/60 bg-black/80 hover:bg-emerald-900/40 text-emerald-200 font-mono text-xs uppercase tracking-[0.3em] rounded backdrop-blur-sm shadow-[0_0_18px_rgba(16,185,129,0.4)]"
              >
                AWAKEN ▸
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
