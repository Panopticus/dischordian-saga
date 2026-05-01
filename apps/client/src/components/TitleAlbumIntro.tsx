/* ═══════════════════════════════════════════════════════
   TITLE ALBUM INTRO — T01 audio + slideshow handoff

   Plays after the DischordiaOpeningCinematic ends (or AWAKEN
   fires from inside it). Owns:
     - Playback of ALBUM1_T01_SLIDESHOW.audioUrl via PlayerContext
     - Visual rendering of the slideshow synced to currentTime
     - The persistent AWAKEN button (gated on isGameReady)

   Pixel-identical handoff: ALBUM1_T01_SLIDESHOW.frames[0] is
   the same frame the cinematic ended on (verified by the
   loginMemeSequence test). Mounting this component while the
   cinematic is in its 400ms fade-out gives a seamless cut.

   Calls onComplete on:
     - audio.ended (natural completion → completed=true)
     - AWAKEN click (early skip → completed=false)
     - safety timer (audio failed to load → completed=false)
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SlideshowFrames from "@/components/SlideshowFrames";
import { ALBUM1_T01_SLIDESHOW } from "@shared/songSlideshows";
import { usePlayer } from "@/contexts/PlayerContext";
import { markT01SeenInTitle } from "@/lib/dischordiaT01SeenInTitle";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { LoredexEntry } from "@/contexts/LoredexContext";

interface Props {
  /** Fires when the stage dismisses for any reason. completed=true
   *  ONLY on natural song-end so the server can advance the album
   *  cursor past T01. AWAKEN/safety => completed=false. */
  onComplete: (completed: boolean) => void;
  /** Drives the AWAKEN button's enabled state. While false, AWAKEN
   *  reads "Stand by…" and is non-interactive. */
  isGameReady?: boolean;
}

const T01_SYNTH_LOREDEX_ENTRY: LoredexEntry = {
  id: `album1_${ALBUM1_T01_SLIDESHOW.songId.replace(/^album1_/, "")}`,
  type: "song",
  name: ALBUM1_T01_SLIDESHOW.title,
  audio_url: ALBUM1_T01_SLIDESHOW.audioUrl,
  album: "Dischordian Logic",
};

/** Exported so the cinematic stage can pre-roll The Enigma's Lament a
 *  few seconds before the meme video ends — by the time TitleAlbumIntro
 *  mounts, the song is already playing and the slideshow picks up at
 *  the corresponding currentTime. TitleAlbumIntro detects this case and
 *  skips its own playSong call. */
export const TITLE_T01_LOREDEX_ENTRY = T01_SYNTH_LOREDEX_ENTRY;

export default function TitleAlbumIntro({
  onComplete,
  isGameReady = true,
}: Props) {
  const player = usePlayer();
  const { isAuthenticated } = useAuth();
  const acceptAlbumMutation = trpc.transmissions.acceptAlbumTransmission.useMutation();
  const [phase, setPhase] = useState<"playing" | "ending">("playing");
  const [needsTap, setNeedsTap] = useState(false);
  const completedRef = useRef(false);
  const cursorNotifiedRef = useRef(false);

  // Kick off audio playback synchronously on mount. PlayerContext.playSong
  // calls audio.play() under the hood — autoplay-policy may reject this
  // since it's a programmatic transition (not a fresh user gesture). If
  // it does, we fall back to a tap-to-begin button.
  //
  // If the parent (TitlePage) already pre-rolled T01 in the cinematic's
  // last 10 seconds, the song is mid-playback and currentTime is non-
  // zero — calling playSong again would reset the song and the slide-
  // show to frame 0, breaking the seamless handoff. Detect that and
  // skip; the slideshow already syncs to player.currentTime.
  useEffect(() => {
    let cancelled = false;
    const alreadyPlayingT01 =
      player.currentSong?.id === T01_SYNTH_LOREDEX_ENTRY.id;
    if (alreadyPlayingT01) return;
    const tryPlay = () => {
      if (cancelled) return;
      try {
        player.playSong(T01_SYNTH_LOREDEX_ENTRY);
      } catch {
        if (!cancelled) setNeedsTap(true);
      }
    };
    tryPlay();
    return () => {
      cancelled = true;
    };
    // playSong identity is stable enough; we run this once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the audio engine settles into a non-playing state (autoplay
  // blocked, network failure, or the player was paused elsewhere) and
  // currentTime is still at zero, surface the tap-to-begin overlay so
  // the player can re-arm the gesture. We only flip TO needsTap; once
  // playback starts we hide the overlay via the same effect.
  useEffect(() => {
    if (completedRef.current) return;
    const isOurSong = player.currentSong?.id === T01_SYNTH_LOREDEX_ENTRY.id;
    if (!isOurSong) return;
    if (player.isPlaying) {
      if (needsTap) setNeedsTap(false);
      return;
    }
    if (player.currentTime > 0) return;
    if (!needsTap) setNeedsTap(true);
  }, [player.isPlaying, player.currentSong?.id, player.currentTime, needsTap]);

  const finish = useCallback(
    (completed: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      markT01SeenInTitle();
      // Notify the server cursor exactly once: completed=true advances
      // past T01 and grants the reward; completed=false marks
      // firstEverDelivered so the cinematic doesn't replay on refresh
      // but the cursor stays at T01 for next session's modal pop.
      if (isAuthenticated && !cursorNotifiedRef.current) {
        cursorNotifiedRef.current = true;
        acceptAlbumMutation.mutate({ trackId: "T01", completed });
      }
      // Stop the song if we're bailing early so the title boot
      // doesn't get a song fading underneath it.
      if (!completed) {
        try {
          player.pause();
        } catch {
          /* swallow — title flow is taking over anyway */
        }
      }
      setPhase("ending");
      // Brief fade-out before unmounting.
      setTimeout(() => onComplete(completed), 400);
    },
    [onComplete, player, isAuthenticated, acceptAlbumMutation],
  );

  // Watch the audio engine for completion. Using a tolerance of 0.5s
  // because some browsers settle currentTime slightly before/after
  // duration when ended fires.
  useEffect(() => {
    if (phase !== "playing") return;
    if (completedRef.current) return;
    const isOurSong = player.currentSong?.id === T01_SYNTH_LOREDEX_ENTRY.id;
    if (!isOurSong) return;
    if (player.duration <= 0) return;
    if (player.currentTime > 0 && player.currentTime >= player.duration - 0.5) {
      finish(true);
    }
  }, [phase, player.currentSong?.id, player.currentTime, player.duration, finish]);

  // Safety timer: audio.duration + 5s. If the engine somehow stalls,
  // bail rather than trapping the player.
  useEffect(() => {
    const t = setTimeout(
      () => {
        if (!completedRef.current) finish(false);
      },
      (ALBUM1_T01_SLIDESHOW.durationMs + 5_000),
    );
    return () => clearTimeout(t);
  }, [finish]);

  const handleTapToBegin = useCallback(() => {
    setNeedsTap(false);
    try {
      player.playSong(T01_SYNTH_LOREDEX_ENTRY);
    } catch {
      // If playSong throws, the song just won't play. AWAKEN still
      // works to bail. Don't trap the player.
    }
  }, [player]);

  const currentTimeMs = player.currentTime * 1000;

  return (
    <AnimatePresence>
      {phase !== "ending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-black"
          role="dialog"
          aria-label="The Enigma's Lament — slideshow"
        >
          {/* Slideshow takes the full surface. Its first frame is
              pixel-identical to the cinematic's last frame so the
              handoff reads as a single uninterrupted shot. */}
          <SlideshowFrames
            frames={ALBUM1_T01_SLIDESHOW.frames}
            currentTimeMs={currentTimeMs}
            containerMode="fullscreen"
            brightness={0.7}
          />

          {/* CRT scan-line overlay — matches the cinematic so the
              transition is visually continuous. */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-25 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
            }}
          />

          {/* Title strip — small, top-left, doesn't fight the slideshow */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/70">
              ▸ Dischordian Logic · Track 01
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-emerald-200 mt-1">
              {ALBUM1_T01_SLIDESHOW.title}
            </div>
          </div>

          {/* Tap-to-begin overlay — only if autoplay was rejected */}
          <AnimatePresence>
            {needsTap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/60"
              >
                <button
                  onClick={handleTapToBegin}
                  className="px-10 py-3 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-sm rounded shadow-[0_0_36px_rgba(16,185,129,0.6)]"
                >
                  ▸ Tap to begin the song
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AWAKEN — always present; gated on isGameReady. Bottom
              right matches the cinematic's button placement so the
              player's eye never has to relocate. Sits above the
              tap-to-begin overlay (z-40 vs z-30) so a blocked autoplay
              never traps the player behind a backdrop. */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => isGameReady && finish(false)}
            disabled={!isGameReady}
            aria-label="Skip the song and proceed to login"
            aria-disabled={!isGameReady}
            className={
              isGameReady
                ? "absolute bottom-6 right-6 z-40 px-5 py-2 border border-emerald-500/60 bg-black/60 hover:bg-emerald-900/40 text-emerald-200 font-mono text-xs uppercase tracking-[0.3em] rounded backdrop-blur-sm shadow-[0_0_18px_rgba(16,185,129,0.4)]"
                : "absolute bottom-6 right-6 z-40 px-5 py-2 border border-emerald-900/60 bg-black/60 text-emerald-500/40 font-mono text-xs uppercase tracking-[0.3em] rounded backdrop-blur-sm cursor-not-allowed"
            }
          >
            {isGameReady ? "AWAKEN ▸" : "Stand by…"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
