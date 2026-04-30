/* ═══════════════════════════════════════════════════════
   LOGIN MEME BROADCAST — first-words / intro / playing / outro

   Full-screen CRT broadcast modal that drives the on-login
   transmission. Two payload variants:
     - kind="album": audio is owned by the global PlayerContext;
       this component renders the now-playing card and lets the
       hook detect completion via player.currentTime/duration.
     - kind="tv": video plays inline (Cloudinary/S3 → <video>,
       Drive → <iframe>). The component fires onTvCompleted when
       the native video.ended event lands.

   For the very first album transmission ever (firstEver=true),
   the firstEver phase walks through the 15-shot, 3:45 cinematic
   spec one dialog line at a time as kinetic text. TV
   transmissions skip the first-words phase entirely.

   Three actions on the intro phase:
     - WATCH (onAccept): plays the audio/video.
     - SKIP (onSkip): closes the modal, queues in the inbox.
     - MUTE FUTURE (onMuteFuture): closes + flips the global
       setting so future transmissions auto-route to the inbox.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellOff, Inbox, Minimize2, Play, X } from "lucide-react";
import { useKinetic } from "@/hooks/useKinetic";
import {
  LOGIN_MEME_FIRST_EVER_SHOTS,
  SHOT_DURATION_MS,
} from "@shared/expansionArt/loginMemeSequence";
import { driveEmbedUrl } from "@shared/transmissions";
import type {
  LoginMemePhase,
  LoginTransmission,
} from "@/hooks/useLoginAlbumTransmission";
import { usePlayer } from "@/contexts/PlayerContext";

interface Props {
  transmission: LoginTransmission;
  phase: LoginMemePhase;
  onAccept: () => void;
  onSkip: () => void;
  onMuteFuture: () => void;
  onDismiss: () => void;
  onMinimize: () => void;
  onPhaseChange: (next: LoginMemePhase) => void;
  /** Fired by the inline TV video on natural end. */
  onTvCompleted: () => void;
}

export default function LoginMemeBroadcast({
  transmission,
  phase,
  onAccept,
  onSkip,
  onMuteFuture,
  onDismiss,
  onMinimize,
  onPhaseChange,
  onTvCompleted,
}: Props) {
  const player = usePlayer();
  const [shotIndex, setShotIndex] = useState(0);

  const isAlbum = transmission.kind === "album";

  // First-words cinematic walkthrough — album-only.
  useEffect(() => {
    if (phase !== "first-words") return;
    if (shotIndex >= LOGIN_MEME_FIRST_EVER_SHOTS.length - 1) return;
    const t = setTimeout(() => {
      setShotIndex((i) => Math.min(i + 1, LOGIN_MEME_FIRST_EVER_SHOTS.length - 1));
    }, SHOT_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, shotIndex]);

  // Outro auto-closes after a hold so the player isn't trapped.
  useEffect(() => {
    if (phase !== "outro") return;
    const t = setTimeout(() => onPhaseChange("done"), 8000);
    return () => clearTimeout(t);
  }, [phase, onPhaseChange]);

  const currentLine =
    phase === "first-words"
      ? LOGIN_MEME_FIRST_EVER_SHOTS[shotIndex]?.dialog ?? ""
      : phase === "intro"
        ? transmission.intro
        : phase === "outro"
          ? transmission.outro
          : "";

  const { displayText } = useKinetic({
    mode: "word",
    text: currentLine,
    speed: 60,
    autoStart: true,
  });

  if (
    phase === "dismissed" ||
    phase === "done" ||
    phase === "minimized" ||
    phase === "idle"
  ) {
    return null;
  }

  const subtitle =
    phase === "first-words"
      ? "Signal Hijacked"
      : phase === "intro"
        ? "Transmission Incoming"
        : phase === "playing"
          ? isAlbum
            ? `Now Playing · T${transmission.trackId.slice(1)} · ${transmission.title}`
            : `Now Broadcasting · ${transmission.title}`
          : "Transmission Complete";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[201] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        role="dialog"
        aria-label="TRANSMISSION INCOMING — Late Night with the Meme"
      >
        <div
          className="crt-bezel relative w-full max-w-5xl mx-4 overflow-hidden rounded-lg border-2 border-emerald-900/60 bg-black shadow-[0_0_120px_rgba(16,185,129,0.25)]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(20,40,30,0.4) 0%, rgba(0,0,0,0.95) 70%), repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)",
          }}
        >
          <header className="flex items-center justify-between px-4 py-2 border-b border-emerald-900/40 text-xs font-mono uppercase tracking-widest text-emerald-300">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>▸ Late Night with the Meme</span>
              <span className="text-emerald-500/60">/</span>
              <span className="text-emerald-500/80">{subtitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMinimize}
                disabled={phase !== "playing" || !isAlbum}
                aria-label="Minimize"
                className="p-1 rounded hover:bg-emerald-900/40 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                aria-label="Close"
                className="p-1 rounded hover:bg-red-900/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="aspect-video relative flex items-center justify-center px-8 py-12">
            {/* CRT scanlines + chroma fringe */}
            <div
              className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
              }}
            />
            <AnimatePresence mode="wait">
              {phase === "playing" && isAlbum ? (
                <NowPlayingCard
                  key="album-playing"
                  title={transmission.title}
                  trackId={transmission.trackId}
                  currentTime={player.currentTime}
                  duration={
                    player.duration > 0
                      ? player.duration
                      : transmission.durationMs / 1000
                  }
                />
              ) : phase === "playing" && !isAlbum ? (
                <TvPlayer
                  key="tv-playing"
                  videoUrl={transmission.videoUrl}
                  driveFileId={transmission.driveFileId}
                  onEnded={onTvCompleted}
                />
              ) : (
                <motion.div
                  key={`${phase}-${shotIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="relative max-w-3xl text-center"
                >
                  <div className="font-mono text-xs text-emerald-500/60 mb-4 uppercase tracking-[0.3em]">
                    The Meme
                  </div>
                  <p className="text-emerald-100 text-xl md:text-2xl leading-relaxed font-serif">
                    {displayText}
                  </p>
                  {phase === "first-words" && isAlbum && (
                    <div className="mt-6 text-emerald-500/40 text-xs font-mono">
                      Shot {shotIndex + 1} / {LOGIN_MEME_FIRST_EVER_SHOTS.length}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lower-third chyron */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 px-3 py-1 border-t border-emerald-900/40">
              <span>▸ {chyronText(phase)}</span>
              <span className="text-emerald-500/40">PAC</span>
            </div>
          </div>

          {(phase === "first-words" || phase === "intro") && (
            <footer className="flex flex-wrap items-center justify-end gap-2 px-4 py-3 border-t border-emerald-900/40 bg-black">
              <button
                onClick={onMuteFuture}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest text-emerald-500/60 hover:text-emerald-300 border border-emerald-900/40 rounded"
                title="Auto-route future transmissions to the INBOX without popping"
              >
                <BellOff className="w-3.5 h-3.5" />
                Mute Future
              </button>
              <button
                onClick={onSkip}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-widest text-emerald-400/80 hover:text-emerald-200 border border-emerald-700/40 rounded"
                title="Save to inbox for later"
              >
                <Inbox className="w-3.5 h-3.5" />
                Skip · Watch Later
              </button>
              <button
                onClick={onAccept}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-sm rounded shadow-[0_0_24px_rgba(16,185,129,0.4)]"
              >
                <Play className="w-4 h-4" />
                Watch
              </button>
            </footer>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function chyronText(phase: LoginMemePhase): string {
  switch (phase) {
    case "first-words":
      return "the architect is watching · silence in heaven imminent · the witnesses are not who you think";
    case "intro":
      return "transmission incoming · play it loud · they hate that";
    case "playing":
      return "now broadcasting on an unauthorized frequency · do not adjust your set";
    case "outro":
      return "end of transmission · the next signal arrives when it can";
    default:
      return "";
  }
}

interface NowPlayingProps {
  title: string;
  trackId: string;
  currentTime: number;
  duration: number;
}

function NowPlayingCard({ title, trackId, currentTime, duration }: NowPlayingProps) {
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center text-emerald-100 max-w-2xl"
    >
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500/60 mb-3">
        Dischordian Logic · Track {trackId.slice(1)}
      </div>
      <h2 className="font-serif text-3xl md:text-4xl mb-8 text-emerald-50">{title}</h2>
      <div className="h-1.5 bg-emerald-950 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="font-mono text-xs text-emerald-500/70 flex justify-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </motion.div>
  );
}

interface TvPlayerProps {
  videoUrl: string | null;
  driveFileId: string | null;
  onEnded: () => void;
}

function TvPlayer({ videoUrl, driveFileId, onEnded }: TvPlayerProps) {
  // Cloudinary / S3 / direct MP4 → native <video> with onEnded.
  // Drive fallback → <iframe>; iframe can't fire onEnded reliably,
  // so we surface a manual "Mark watched" button on iframe play.
  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        controls
        playsInline
        onEnded={onEnded}
        className="w-full h-full object-contain bg-black"
      />
    );
  }
  if (driveFileId) {
    return (
      <div className="relative w-full h-full">
        <iframe
          src={driveEmbedUrl(driveFileId)}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full"
          title="Transmission video"
        />
        <button
          onClick={onEnded}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-[10px] rounded"
        >
          ✓ Mark Watched
        </button>
      </div>
    );
  }
  return (
    <div className="text-center text-emerald-300 font-mono text-sm">
      ▸ Transmission unavailable
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
