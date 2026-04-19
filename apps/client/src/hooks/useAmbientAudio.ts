/* ═══════════════════════════════════════════════════════
   useAmbientAudio

   Lightweight looping-audio hook for page-level ambient
   scores (Mascoteer leitmotifs, classroom ambience). Fails
   silently on missing assets or autoplay blocks — matches
   the graceful-degradation pattern used by SongSlideshow.

   Usage:
     useAmbientAudio(land?.ambientAudio, { volume: 0.15 });

   The hook swaps tracks when `src` changes. On unmount or
   when src becomes undefined, the currently-playing audio
   is paused and released.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";

export interface UseAmbientAudioOptions {
  /** 0–1; defaults to 0.18 (subtle room tone, not foreground music). */
  volume?: number;
  /** Loop the track; defaults to true. */
  loop?: boolean;
}

export function useAmbientAudio(src: string | undefined, opts: UseAmbientAudioOptions = {}) {
  const { volume = 0.18, loop = true } = opts;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;
    // Autoplay is frequently blocked until user interaction. Silent catch
    // matches SongSlideshow pattern — the UI remains functional without audio.
    audio.play().catch(() => { /* autoplay blocked or file missing */ });

    return () => {
      audio.pause();
      audio.src = "";
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [src, loop, volume]);
}
