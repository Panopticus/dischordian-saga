import { createContext, useContext, useState, type ReactNode } from "react";
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
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<LoredexEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<LoredexEntry[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);

  const playSong = (song: LoredexEntry) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowPlayer(true);
  };

  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);

  const next = () => {
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx < queue.length - 1) {
      setCurrentSong(queue[idx + 1]);
      setIsPlaying(true);
    }
  };

  const prev = () => {
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    if (idx > 0) {
      setCurrentSong(queue[idx - 1]);
      setIsPlaying(true);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ currentSong, isPlaying, queue, playSong, pause, resume, next, prev, setQueue, showPlayer }}
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
