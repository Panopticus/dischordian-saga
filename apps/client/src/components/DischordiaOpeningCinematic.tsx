/* ═══════════════════════════════════════════════════════
   DISCHORDIA OPENING CINEMATIC — first-visit MP4 + AWAKEN gate

   Plays ONCE per device, after the SurveillanceOpening
   handshake and before the title boot sequence. The 3:09
   MP4 is The Meme's hijacked broadcast — Track 01 of
   Dischordian Logic visualized — and hands off pixel-
   identical to the title screen, which continues playing
   The Enigma's Lament as ambient audio under the auth
   buttons. The auth buttons effectively serve as the
   "Start Game" surface the user spec referenced.

   Pattern mirrored from apps/client/src/components/OpeningCinematic.tsx:
     - "BEGIN" splash satisfies the browser autoplay gesture
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

interface Props {
  /** Fires when the cinematic dismisses for any reason — natural end,
   *  AWAKEN click, or the safety timer expiring. The flag lets the
   *  parent decide whether to mark the device-flag (we mark it on
   *  every dismissal — players can replay from INBOX). */
  onComplete: (reachedEndNaturally: boolean) => void;
}

export default function DischordiaOpeningCinematic({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<
    "loading" | "ready" | "playing" | "needs-tap" | "ending"
  >("loading");
  const [showAwaken, setShowAwaken] = useState(false);

  // AWAKEN button fades in after 2 seconds, regardless of playback state,
  // so a hung video never traps the player.
  useEffect(() => {
    const t = setTimeout(() => setShowAwaken(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Once the video element is mounted with metadata loaded, surface the
  // "BEGIN" splash. The user's click satisfies the browser autoplay
  // policy for the rest of the session.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setPhase("ready");
    const onError = () => setPhase("needs-tap");
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, []);

  const finish = useCallback(
    (reachedEndNaturally: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      markOpeningSeen();
      setPhase("ending");
      // Brief fade-out before unmounting.
      setTimeout(() => onComplete(reachedEndNaturally), 400);
    },
    [onComplete],
  );

  const handleBegin = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    try {
      await video.play();
      setPhase("playing");
    } catch {
      // Unmuted blocked — fall back to muted, which always succeeds in
      // modern browsers as long as the click came from a user gesture.
      video.muted = true;
      try {
        await video.play();
        setPhase("playing");
      } catch {
        setPhase("needs-tap");
      }
    }
    // Safety timer: video.duration + 2s. If `ended` never fires we
    // bail out gracefully.
    safetyTimerRef.current = setTimeout(
      () => finish(false),
      (VIDEO_DURATION_S + 2) * 1000,
    );
  }, [finish]);

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

          {/* TRANSMISSION INCOMING overlay — fades in on splash, fades
              out 4s after playback begins. */}
          <AnimatePresence>
            {(phase === "loading" || phase === "ready" || phase === "needs-tap") && (
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
                {(phase === "ready" || phase === "needs-tap") && (
                  <button
                    onClick={handleBegin}
                    className="mt-6 px-10 py-3 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-sm rounded shadow-[0_0_36px_rgba(16,185,129,0.6)]"
                  >
                    ▸ Accept Transmission
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AWAKEN — in-world skip button. Visible from 2s onward, in
              every phase, so a stuck or unwanted video never traps. */}
          <AnimatePresence>
            {showAwaken && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => finish(false)}
                aria-label="Skip the opening transmission"
                className="absolute bottom-6 right-6 px-5 py-2 border border-emerald-500/60 bg-black/60 hover:bg-emerald-900/40 text-emerald-200 font-mono text-xs uppercase tracking-[0.3em] rounded backdrop-blur-sm"
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
