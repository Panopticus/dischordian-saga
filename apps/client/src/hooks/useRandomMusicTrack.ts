/* ═══════════════════════════════════════════════════════
   useRandomMusicTrack — React hook for Dischordia music

   Plays a music track by id and picks a random variant per
   interaction. Each time the hook unmounts + remounts (or you
   call `reshuffle()`) it rolls a new variant, so repeat visits
   to a scene don't always play the same take.

   Usage:
     const { audioProps, currentVariantUrl, reshuffle } =
       useRandomMusicTrack("main_menu", { autoPlay: true, loop: true });
     <audio {...audioProps} />

   Or use the url directly with a custom player:
     const url = useRandomVariantUrl("arena_battle");
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getRandomMusicVariant,
  getRandomMusicVariantExcluding,
  getMusicTrack,
  type MusicTrackId,
} from "../../../shared/musicRegistry";

export interface UseRandomMusicTrackOptions {
  /** Whether to start playing on mount. Default false. */
  autoPlay?: boolean;
  /** Whether to loop the track. When a track loops, the variant does NOT change mid-loop; call reshuffle() or restart the hook to pick a new one. Default false. */
  loop?: boolean;
  /** Volume 0-1. Default 0.7. */
  volume?: number;
  /** Muted flag. Default false. */
  muted?: boolean;
  /** When true, consecutive mounts never play the same variant (until reshuffled manually). Default true. */
  avoidRepeats?: boolean;
  /** RNG override for deterministic tests. */
  rng?: () => number;
}

export interface UseRandomMusicTrackResult {
  /** The currently selected variant URL. */
  currentVariantUrl: string;
  /**
   * Props to spread onto an <audio> element. Binds the src and
   * respects autoPlay / loop / volume / muted options.
   */
  audioProps: {
    src: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload: "metadata";
    ref: React.RefObject<HTMLAudioElement | null>;
  };
  /** Pick a fresh variant immediately. */
  reshuffle: () => void;
  /** Metadata about the current track. */
  track: {
    id: MusicTrackId;
    title: string;
    variantCount: number;
    bpm: number | null;
  };
}

/** Per-track memory of the last-played variant, persists across hook remounts. */
const lastPlayedByTrack = new Map<MusicTrackId, string>();

/**
 * Play a music track with a random variant. The variant is selected
 * once per hook instance; remount or call `reshuffle()` for a new one.
 */
export function useRandomMusicTrack(
  trackId: MusicTrackId,
  options: UseRandomMusicTrackOptions = {},
): UseRandomMusicTrackResult {
  const {
    autoPlay = false,
    loop = false,
    volume = 0.7,
    muted = false,
    avoidRepeats = true,
    rng,
  } = options;

  const track = useMemo(() => getMusicTrack(trackId), [trackId]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initial variant selection — one per hook instance
  const [currentVariantUrl, setCurrentVariantUrl] = useState(() => {
    const last = avoidRepeats ? lastPlayedByTrack.get(trackId) ?? null : null;
    const picked = last
      ? getRandomMusicVariantExcluding(trackId, last, rng)
      : getRandomMusicVariant(trackId, rng);
    lastPlayedByTrack.set(trackId, picked);
    return picked;
  });

  const reshuffle = useCallback(() => {
    const last = avoidRepeats ? lastPlayedByTrack.get(trackId) ?? null : null;
    const picked = last
      ? getRandomMusicVariantExcluding(trackId, last, rng)
      : getRandomMusicVariant(trackId, rng);
    lastPlayedByTrack.set(trackId, picked);
    setCurrentVariantUrl(picked);
  }, [trackId, avoidRepeats, rng]);

  // Apply volume + muted to the audio element
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, volume));
    el.muted = muted;
  }, [volume, muted]);

  return {
    currentVariantUrl,
    audioProps: {
      src: currentVariantUrl,
      autoPlay,
      loop,
      muted,
      preload: "metadata",
      ref: audioRef,
    },
    reshuffle,
    track: {
      id: track.id,
      title: track.title,
      variantCount: track.variantCount,
      bpm: track.bpm,
    },
  };
}

/**
 * Lightweight alternative when you only need the URL. Selects once
 * on mount (or when `dep` changes).
 */
export function useRandomVariantUrl(
  trackId: MusicTrackId,
  dep: unknown = null,
): string {
  return useMemo(() => {
    const last = lastPlayedByTrack.get(trackId) ?? null;
    const picked = last
      ? getRandomMusicVariantExcluding(trackId, last)
      : getRandomMusicVariant(trackId);
    lastPlayedByTrack.set(trackId, picked);
    return picked;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, dep]);
}
