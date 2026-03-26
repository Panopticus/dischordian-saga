import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { LoredexEntry } from "./LoredexContext";

interface PlayerContextType {
  currentSong: LoredexEntry | null;
  isPlaying: boolean;
  queue: LoredexEntry[];
  playSong: (song: LoredexEntry) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  setQueue: (songs: LoredexEntry[]) => void;
  showPlayer: boolean;
  /* ─── Audio playback state ─── */
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  seek: (time: number) => void;
  hasAudio: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<LoredexEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<LoredexEntry[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Use refs for queue and currentSong so event handlers always see latest values
  const queueRef = useRef(queue);
  const currentSongRef = useRef(currentSong);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);

  // Load and play a specific song on the audio element
  const loadAndPlay = useCallback((song: LoredexEntry) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (song.audio_url) {
      audio.src = song.audio_url;
      audio.play().catch((e) => {
        console.warn("[Player] Autoplay blocked:", e);
      });
    } else {
      audio.pause();
      audio.src = "";
    }
  }, []);

  // Handle next track (used by ended event and next button)
  const advanceToNext = useCallback(() => {
    const q = queueRef.current;
    const cur = currentSongRef.current;
    if (!cur || q.length === 0) {
      setIsPlaying(false);
      return;
    }
    const idx = q.findIndex((s) => s.id === cur.id);
    if (idx >= 0 && idx < q.length - 1) {
      const nextSong = q[idx + 1];
      setCurrentSong(nextSong);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      loadAndPlay(nextSong);
    } else {
      // End of queue
      setIsPlaying(false);
    }
  }, [loadAndPlay]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = "auto";

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("durationchange", () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("ended", () => {
      advanceToNext();
    });
    audio.addEventListener("error", (e) => {
      console.warn("[Player] Audio error:", (e as any)?.target?.error?.message || "unknown");
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeAttribute("src");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasAudio = !!(currentSong?.audio_url);

  const playSong = useCallback((song: LoredexEntry) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowPlayer(true);
    setCurrentTime(0);
    setDuration(0);
    loadAndPlay(song);
  }, [loadAndPlay]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
    if (audioRef.current && currentSong?.audio_url) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  const next = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const prev = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) {
      const prevSong = queue[idx - 1];
      setCurrentSong(prevSong);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      loadAndPlay(prevSong);
    }
  }, [currentSong, queue, loadAndPlay]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && currentSong?.audio_url) {
      const clamped = Math.max(0, Math.min(time, audioRef.current.duration || 0));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  }, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, queue, playSong, pause, resume, next, prev,
        setQueue, showPlayer, currentTime, duration, volume, setVolume, seek, hasAudio,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
