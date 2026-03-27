/* ═══════════════════════════════════════════════════════
   RADIO MODE — Ambient soundtrack that auto-plays songs
   grouped by epoch, faction, or mood while browsing.
   Floating mini-player overlay.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Play, Pause, SkipForward, SkipBack, Shuffle,
  Volume2, VolumeX, X, ChevronUp, ChevronDown, Disc3, Music
} from "lucide-react";

/* ─── STATION DEFINITIONS ─── */
interface RadioStation {
  id: string;
  name: string;
  description: string;
  filter: (entry: LoredexEntry) => boolean;
  color: string;
}

const STATIONS: RadioStation[] = [
  {
    id: "all",
    name: "ALL FREQUENCIES",
    description: "The complete Dischordian Saga soundtrack",
    filter: (e) => e.type === "song",
    color: "var(--neon-cyan)",
  },
  {
    id: "dischordian-logic",
    name: "DISCHORDIAN LOGIC",
    description: "The foundational album",
    filter: (e) => e.type === "song" && e.album === "Dischordian Logic",
    color: "var(--neon-cyan)",
  },
  {
    id: "age-of-privacy",
    name: "AGE OF PRIVACY",
    description: "Surveillance era anthems",
    filter: (e) => e.type === "song" && e.album === "The Age of Privacy",
    color: "var(--neon-amber)",
  },
  {
    id: "book-of-daniel",
    name: "BOOK OF DANIEL",
    description: "The Programmer's journey",
    filter: (e) => e.type === "song" && e.album === "The Book of Daniel 2:47",
    color: "var(--chart-4)",
  },
  {
    id: "silence-in-heaven",
    name: "SILENCE IN HEAVEN",
    description: "The final chapter",
    filter: (e) => e.type === "song" && e.album === "Silence in Heaven",
    color: "var(--neon-red)",
  },
  {
    id: "battle",
    name: "COMBAT FREQUENCY",
    description: "High-energy battle tracks",
    filter: (e) => {
      if (e.type !== "song") return false;
      const name = e.name.toLowerCase();
      return (
        name.includes("war") || name.includes("fight") || name.includes("battle") ||
        name.includes("iron") || name.includes("warlord") || name.includes("combat") ||
        name.includes("kill") || name.includes("sword") || name.includes("attack")
      );
    },
    color: "var(--neon-red)",
  },
  {
    id: "mystery",
    name: "ENIGMA CHANNEL",
    description: "Dark, atmospheric tracks",
    filter: (e) => {
      if (e.type !== "song") return false;
      const name = e.name.toLowerCase();
      return (
        name.includes("enigma") || name.includes("shadow") || name.includes("dark") ||
        name.includes("secret") || name.includes("oracle") || name.includes("mystery") ||
        name.includes("dream") || name.includes("vision") || name.includes("silence")
      );
    },
    color: "var(--orb-orange)",
  },
];

/* ─── RADIO STATE ─── */
const RADIO_KEY = "loredex-radio-state";

function getRadioState(): { stationId: string; shuffle: boolean } {
  try {
    return JSON.parse(localStorage.getItem(RADIO_KEY) || '{"stationId":"all","shuffle":true}');
  } catch {
    return { stationId: "all", shuffle: true };
  }
}

function saveRadioState(state: { stationId: string; shuffle: boolean }) {
  localStorage.setItem(RADIO_KEY, JSON.stringify(state));
}

/* ═══ RADIO TOGGLE BUTTON (for AppShell) ═══ */
export function RadioToggle({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
        isActive
          ? "bg-[var(--neon-cyan)]/10 border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] animate-pulse"
          : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-primary"
      }`}
    >
      <Radio size={10} />
      RADIO
    </button>
  );
}

/* ═══ MAIN RADIO PANEL ═══ */
export default function RadioMode() {
  const { entries } = useLoredex();
  const { playSong, setQueue, currentSong, isPlaying, pause, resume, next, prev } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [radioState, setRadioState] = useState(getRadioState);

  const currentStation = STATIONS.find((s) => s.id === radioState.stationId) || STATIONS[0];

  const stationSongs = useMemo(() => {
    return entries.filter(currentStation.filter);
  }, [entries, currentStation]);

  const switchStation = useCallback(
    (stationId: string) => {
      const newState = { ...radioState, stationId };
      setRadioState(newState);
      saveRadioState(newState);

      const station = STATIONS.find((s) => s.id === stationId);
      if (!station) return;

      const songs = entries.filter(station.filter);
      if (songs.length === 0) return;

      const ordered = radioState.shuffle ? [...songs].sort(() => Math.random() - 0.5) : songs;
      setQueue(ordered);
      playSong(ordered[0]);
    },
    [entries, radioState, setQueue, playSong]
  );

  const toggleShuffle = useCallback(() => {
    const newState = { ...radioState, shuffle: !radioState.shuffle };
    setRadioState(newState);
    saveRadioState(newState);
  }, [radioState]);

  const startRadio = useCallback(() => {
    if (stationSongs.length === 0) return;
    const ordered = radioState.shuffle
      ? [...stationSongs].sort(() => Math.random() - 0.5)
      : stationSongs;
    setQueue(ordered);
    playSong(ordered[0]);
    setIsOpen(true);
    setIsMinimized(false);
  }, [stationSongs, radioState.shuffle, setQueue, playSong]);

  return (
    <>
      {/* Floating Radio Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 left-4 z-40 w-10 h-10 rounded-full bg-card/90 border border-[var(--neon-cyan)]/30 flex items-center justify-center text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 hover:border-[var(--neon-cyan)]/50 transition-all backdrop-blur-sm shadow-lg"
          title="Open Radio"
        >
          <Radio size={16} />
        </motion.button>
      )}

      {/* Radio Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed z-40 backdrop-blur-md ${
              isMinimized
                ? "bottom-20 left-4 w-64"
                : "bottom-20 left-4 w-80 sm:w-96"
            }`}
          >
            <div
              className="rounded-lg border shadow-xl overflow-hidden"
              style={{ borderColor: `${currentStation.color}30`, backgroundColor: "var(--card)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <Radio size={12} style={{ color: currentStation.color }} className="animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider" style={{ color: currentStation.color }}>
                    RADIO MODE
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMinimized ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Now Playing */}
              {currentSong && (
                <div className="flex items-center gap-3 px-3 py-2 bg-secondary/20">
                  {currentSong.image ? (
                    <img src={currentSong.image} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                      <Music size={12} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium truncate">{currentSong.name}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/50 truncate">{currentSong.album}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={prev} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <SkipBack size={12} />
                    </button>
                    <button
                      onClick={isPlaying ? pause : resume}
                      className="p-1.5 rounded-full text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button onClick={next} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <SkipForward size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* Station List (expanded) */}
              {!isMinimized && (
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">STATIONS</span>
                    <button
                      onClick={toggleShuffle}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                        radioState.shuffle
                          ? "text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      <Shuffle size={9} />
                      {radioState.shuffle ? "ON" : "OFF"}
                    </button>
                  </div>
                  {STATIONS.map((station) => {
                    const songCount = entries.filter(station.filter).length;
                    const isActive = radioState.stationId === station.id;
                    return (
                      <button
                        key={station.id}
                        onClick={() => switchStation(station.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left transition-all ${
                          isActive
                            ? "bg-secondary/40 border border-border/30"
                            : "hover:bg-secondary/20 border border-transparent"
                        }`}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: station.color,
                            boxShadow: isActive ? `0 0 6px ${station.color}60` : "none",
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-mono font-bold tracking-wider truncate" style={{ color: isActive ? station.color : undefined }}>
                            {station.name}
                          </p>
                          <p className="text-[9px] font-mono text-muted-foreground/40 truncate">
                            {station.description} // {songCount} tracks
                          </p>
                        </div>
                        {!isActive && songCount > 0 && (
                          <Play size={10} className="text-muted-foreground/30 shrink-0" />
                        )}
                        {isActive && isPlaying && (
                          <div className="flex gap-0.5 shrink-0">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-0.5 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: station.color,
                                  height: `${6 + i * 3}px`,
                                  animationDelay: `${i * 0.15}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Start */}
              {!currentSong && !isMinimized && (
                <div className="p-3 border-t border-border/10">
                  <button
                    onClick={startRadio}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-mono bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-all"
                  >
                    <Play size={12} /> START RADIO
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
