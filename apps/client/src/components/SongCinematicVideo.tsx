/* ═══════════════════════════════════════════════════════
   SONG CINEMATIC VIDEO — MP4 playback wrapper.

   Sibling of `SongSlideshow`. When a `SongSlideshowDef` carries a
   `videoUrl` (Acts 2-7 AAA Final drop), `SlideshowPlayerRoot` mounts
   this component instead of the still-frame slideshow. Plays the
   MP4 with the music bed riding underneath, fires `onEnd` on either
   natural end, user dismiss, or video error (so flag wiring + reward
   application still happen even if the MP4 404s).
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface SongCinematicVideoProps {
  /** The cinematic MP4 URL — required. */
  videoUrl: string;
  /** Optional music bed that plays underneath the video. */
  audioUrl?: string;
  /** Title rendered as a brief pre-roll card. */
  title?: string;
  /** Allow the viewer to dismiss early. Defaults to true. */
  dismissible?: boolean;
  /** Fired on natural end, dismiss, or unrecoverable video error. */
  onEnd?: () => void;
  /**
   * Fallback callback when the video fails to load. Lets the parent
   * mount the still-frame slideshow path instead. If unset, the
   * component just calls `onEnd`.
   */
  onVideoError?: () => void;
  /**
   * audit/16 PR 6 (Strm6) — chapter telegraph for streamers.
   *
   * Optional cinematic-chapter title rendered as a small badge in
   * the corner so spectators (and post-stream VOD viewers) can
   * orient themselves: "Act 3 · Chapter II — The Crystal Decryption".
   * Pre-roll card uses `title` (the song name); this is a
   * persistent secondary label that stays visible during playback.
   */
  chapterTitle?: string;
  /**
   * Optional stable id for the chapter — used by VOD-export
   * tooling (Strm7, queued separately) to write chapter markers
   * into the MP4 metadata. Ignored if `chapterTitle` is unset.
   */
  chapterId?: string;
}

const TITLE_HOLD_MS = 1200;

export default function SongCinematicVideo({
  videoUrl,
  audioUrl,
  title,
  dismissible = true,
  onEnd,
  onVideoError,
  chapterTitle,
  chapterId,
}: SongCinematicVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTitle, setShowTitle] = useState(Boolean(title));
  const [dismissed, setDismissed] = useState(false);

  // Title pre-roll
  useEffect(() => {
    if (!title) return;
    const t = setTimeout(() => setShowTitle(false), TITLE_HOLD_MS);
    return () => clearTimeout(t);
  }, [title]);

  // Music bed underneath
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.volume = 0.6;
    audio.play().catch(() => {
      /* autoplay blocked — silent fallback */
    });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  const handleEnd = () => {
    if (dismissed) return;
    setDismissed(true);
    audioRef.current?.pause();
    onEnd?.();
  };

  const handleError = () => {
    if (dismissed) return;
    audioRef.current?.pause();
    if (onVideoError) {
      // Don't mark dismissed — parent will swap to fallback
      onVideoError();
      return;
    }
    handleEnd();
  };

  const handleDismiss = () => {
    if (!dismissible) return;
    handleEnd();
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={dismissible ? handleDismiss : undefined}
      role="dialog"
      aria-label="Cinematic"
    >
      {dismissible && (
        <div className="absolute top-4 right-4 z-10">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            tap to skip
          </span>
        </div>
      )}

      {/* audit/16 PR 6 (Strm6) — chapter telegraph card. Persistent
          corner badge so spectators can orient mid-playback. */}
      {chapterTitle && (
        <div
          className="absolute top-4 left-4 z-10 pointer-events-none"
          data-testid="cinematic-chapter-badge"
          data-chapter-id={chapterId}
        >
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.25em] bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/10">
            {chapterTitle}
          </span>
        </div>
      )}

      {showTitle && title && (
        <motion.div
          key="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-white/90 px-8 text-center">
            {title}
          </h1>
        </motion.div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        // Cinematic music rides on the audio bed; mute the video's own track.
        muted
        onEnded={handleEnd}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </motion.div>
  );
}
