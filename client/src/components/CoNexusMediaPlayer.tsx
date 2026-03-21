/**
 * CoNexusMediaPlayer.tsx — Persistent Media Hub
 * 
 * Replaces the old PlayerBar with a full media experience:
 * - Audio: Play/pause/skip through 89 tracks across 4 albums
 * - Video: Inline YouTube player for music videos
 * - Saga Browser: Browse epochs, episodes, and CoNexus games
 * - Character Overlay: See characters in current media, click to view dossier
 * 
 * States: Collapsed (mini bar) → Expanded (full panel) → Fullscreen (video takeover)
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Music2, ChevronUp, ChevronDown,
  ExternalLink, Disc3, Tv, Gamepad2, Users, X, Maximize2, Minimize2,
  Shuffle, Repeat, List, Radio, Film, Volume2, VolumeX, Search,
  ChevronRight, Eye, Clock, Zap, Globe, Layers, BookOpen
} from "lucide-react";

/* ─── STREAMING ICONS ─── */
function SpotifyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function AppleMusicIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.282a10.16 10.16 0 00-1.564-.17C17.474.023 16.81 0 14.952 0h-5.9c-1.86 0-2.524.024-3.186.112-.55.064-1.1.174-1.62.33C3.13.77 2.39 1.77 2.07 3.08a9.23 9.23 0 00-.24 2.19c-.09.66-.112 1.324-.112 3.186v5.088c0 1.86.024 2.524.112 3.186.064.55.174 1.1.33 1.62.317 1.31 1.062 2.31 2.18 3.043.55.36 1.16.6 1.82.73.55.11 1.1.174 1.62.21.66.05 1.324.07 3.186.07h5.088c1.86 0 2.524-.024 3.186-.112.55-.064 1.1-.174 1.62-.33 1.31-.317 2.31-1.062 3.043-2.18.36-.55.6-1.16.73-1.82.11-.55.174-1.1.21-1.62.05-.66.07-1.324.07-3.186V9.31c0-1.86-.024-2.524-.112-3.186z"/>
    </svg>
  );
}

/* ─── ALBUM DATA ─── */
const ALBUMS = [
  { slug: "dischordian-logic", name: "Dischordian Logic", year: "2025", tracks: 29 },
  { slug: "age-of-privacy", name: "The Age of Privacy", year: "2025", tracks: 20 },
  { slug: "book-of-daniel", name: "The Book of Daniel 2:47", year: "2025", tracks: 22 },
  { slug: "silence-in-heaven", name: "Silence in Heaven", year: "2026", tracks: 18 },
];

/* ─── EPOCH DATA (for saga browser) ─── */
interface EpochInfo {
  id: string;
  title: string;
  subtitle: string;
  playlistUrl: string;
  color: string;
  keyCharacters: string[];
}

const SAGA_EPOCHS: EpochInfo[] = [
  { id: "fall-of-reality", title: "THE FALL OF REALITY", subtitle: "Epoch Zero", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1", color: "#FF3C40", keyCharacters: ["The Architect", "The Enigma", "The Human", "The Warlord"] },
  { id: "epoch-1a", title: "THE AWAKENING", subtitle: "First Epoch", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaRniDT5eztLsXFTzbR0JaCu", color: "#33E2E6", keyCharacters: ["The Oracle", "The Collector", "Iron Lion", "The Source"] },
  { id: "epoch-1b", title: "THE ENGINEER", subtitle: "Fall of Reality", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQfuKeeqx7cLOfhZ1Fr1-jb", color: "#33E2E6", keyCharacters: ["The Architect", "The Human", "The Enigma"] },
  { id: "epoch-2", title: "THE AGE OF PRIVACY", subtitle: "Second Epoch", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaRcuVOdFiT1YZRQR0GQXR4D", color: "#FFB800", keyCharacters: ["The Enigma", "Agent Zero", "The Spy"] },
  { id: "epoch-3", title: "THE AGE OF REVELATION", subtitle: "Third Epoch", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaS-7bVGxdWLLfPxKjG5WNQP", color: "#A855F7", keyCharacters: ["The Necromancer", "The Oracle", "The Collector"] },
  { id: "epoch-4", title: "SILENCE IN HEAVEN", subtitle: "Fourth Epoch", playlistUrl: "https://youtube.com/playlist?list=PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1", color: "#EC4899", keyCharacters: ["The Source", "The Meme", "The Programmer"] },
];

/* ─── TAB TYPES ─── */
type MediaTab = "queue" | "albums" | "saga" | "characters";

/* ─── MINI PLAYER (Collapsed State) ─── */
function MiniPlayer({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onExpand,
}: {
  song: LoredexEntry;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.5);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, song]);

  useEffect(() => { setProgress(0); }, [song]);

  const streaming = song.streaming_links || {};
  const mv = song.music_video || {};
  const videoUrl = mv.official || mv.vevo || "";

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="h-[2px] relative" style={{ background: "var(--glass-border)" }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${progress}%`, background: "var(--brand-gradient, linear-gradient(90deg, #33E2E6, #3875FA))" }}
        />
      </div>

      <div className="flex items-center px-3 sm:px-4 py-2 gap-2 sm:gap-3">
        {/* Album Art */}
        <button onClick={onExpand} className="shrink-0 group relative">
          {song.image ? (
            <img src={song.image} alt={song.name}
              className={`w-10 h-10 rounded-md object-cover ring-1 ring-white/10 ${isPlaying ? "animate-pulse-slow" : ""}`}
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-muted/40 flex items-center justify-center">
              <Music2 size={14} className="text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 rounded-md bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ChevronUp size={16} className="text-foreground" />
          </div>
        </button>

        {/* Song Info */}
        <div className="min-w-0 flex-1">
          <Link href={`/song/${song.id}`}
            className="text-xs font-mono text-foreground/85 hover:text-[var(--neon-cyan)] transition-colors truncate block">
            {song.name}
          </Link>
          <p className="text-[9px] font-mono text-muted-foreground/50 truncate">
            {song.album || "Malkia Ukweli & the Panopticon"}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-1.5 text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors hidden sm:block">
            <SkipBack size={14} />
          </button>
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(51,226,230,0.2), var(--glass-border))",
              border: "1px solid rgba(51,226,230,0.3)",
            }}
          >
            {isPlaying ? <Pause size={14} className="text-[var(--neon-cyan)]" /> : <Play size={14} className="text-[var(--neon-cyan)] ml-0.5" />}
          </button>
          <button onClick={onNext} className="p-1.5 text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors hidden sm:block">
            <SkipForward size={14} />
          </button>
        </div>

        {/* Desktop streaming links */}
        <div className="hidden md:flex items-center gap-1.5 ml-1">
          {videoUrl && (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[var(--alert-red)] text-[9px] font-mono hover:bg-[var(--alert-red)]/10 transition-colors border border-[var(--alert-red)]/20">
              <Film size={10} /> VIDEO
            </a>
          )}
          {streaming.spotify && (
            <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-md text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors" title="Spotify">
              <SpotifyIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {streaming.apple_music && (
            <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-md text-[#FC3C44] hover:bg-[#FC3C44]/10 transition-colors" title="Apple Music">
              <AppleMusicIcon className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Expand Button */}
        <button onClick={onExpand} className="p-1.5 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── QUEUE TAB ─── */
function QueueTab({ queue, currentSong, onPlay }: {
  queue: LoredexEntry[];
  currentSong: LoredexEntry | null;
  onPlay: (song: LoredexEntry) => void;
}) {
  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <List size={24} className="text-muted-foreground/25 mb-2" />
        <p className="font-mono text-xs text-muted-foreground/50">Queue is empty</p>
        <p className="font-mono text-[9px] text-muted-foreground/25 mt-1">Browse albums or play a song to start</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 max-h-60 overflow-y-auto custom-scrollbar">
      {queue.map((song, i) => {
        const active = currentSong?.id === song.id;
        return (
          <button
            key={`${song.id}-${i}`}
            onClick={() => onPlay(song)}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-left transition-all ${
              active ? "bg-muted/30 border border-border/60" : "hover:bg-foreground/4 border border-transparent"
            }`}
          >
            <span className="font-mono text-[9px] text-muted-foreground/35 w-5 text-right shrink-0">
              {active ? (
                <div className="flex gap-0.5 items-end justify-end h-3">
                  <div className="w-0.5 bg-[var(--neon-cyan)] animate-pulse" style={{ height: "60%" }} />
                  <div className="w-0.5 bg-[var(--neon-cyan)] animate-pulse" style={{ height: "100%", animationDelay: "0.15s" }} />
                  <div className="w-0.5 bg-[var(--neon-cyan)] animate-pulse" style={{ height: "40%", animationDelay: "0.3s" }} />
                </div>
              ) : (
                i + 1
              )}
            </span>
            {song.image && (
              <img src={song.image} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`font-mono text-[10px] truncate ${active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/80"}`}>
                {song.name}
              </p>
              <p className="font-mono text-[8px] text-muted-foreground/35 truncate">{song.album}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── ALBUMS TAB ─── */
function AlbumsTab({ onPlayAlbum }: {
  onPlayAlbum: (albumName: string) => void;
}) {
  const { getByAlbum } = useLoredex();

  return (
    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
      {ALBUMS.map((album) => {
        const tracks = getByAlbum(album.name);
        const firstTrack = tracks[0];
        return (
          <button
            key={album.slug}
            onClick={() => onPlayAlbum(album.name)}
            className="group flex flex-col rounded-lg border border-border/50 overflow-hidden hover:border-border/80 transition-all text-left"
            
          >
            <div className="aspect-square overflow-hidden relative">
              {firstTrack?.image ? (
                <img src={firstTrack.image} alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                  <Disc3 size={24} className="text-muted-foreground/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="font-mono text-[10px] font-bold text-foreground truncate">{album.name}</p>
                <p className="font-mono text-[8px] text-muted-foreground/70">{album.tracks} tracks · {album.year}</p>
              </div>
              <div className="absolute inset-0 bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={24} className="text-foreground" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── SAGA BROWSER TAB ─── */
function SagaTab() {
  const { getEntry } = useLoredex();
  const [, navigate] = useLocation();

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
      <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.2em] px-1 uppercase">The Dischordian Saga — Epochs</p>
      {SAGA_EPOCHS.map((epoch) => (
        <div key={epoch.id} className="rounded-lg border border-border/50 overflow-hidden" >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-2 h-8 rounded-full shrink-0" style={{ background: epoch.color }} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-bold text-foreground/85 tracking-wider">{epoch.title}</p>
              <p className="font-mono text-[8px] text-muted-foreground/50">{epoch.subtitle}</p>
            </div>
            <a
              href={epoch.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[var(--alert-red)] text-[9px] font-mono border border-[var(--alert-red)]/20 hover:bg-[var(--alert-red)]/10 transition-colors shrink-0"
            >
              <Tv size={10} /> WATCH
            </a>
          </div>
          {/* Key Characters */}
          <div className="flex items-center gap-1.5 px-3 pb-2 overflow-x-auto">
            {epoch.keyCharacters.map((name) => {
              const entry = getEntry(name);
              return (
                <Link
                  key={name}
                  href={entry ? `/entity/${entry.id}` : "#"}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/40 hover:bg-muted/30 transition-colors shrink-0"
                >
                  {entry?.image && (
                    <img src={entry.image} alt="" className="w-4 h-4 rounded-full object-cover" />
                  )}
                  <span className="font-mono text-[8px] text-muted-foreground/60 whitespace-nowrap">{name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* CoNexus Games Link */}
      <Link
        href="/conexus-portal"
        className="flex items-center gap-3 px-3 py-3 rounded-lg border border-[var(--orb-orange)]/20 hover:border-[var(--orb-orange)]/40 transition-all"
        style={{ background: "rgba(255,184,0,0.03)" }}
      >
        <Gamepad2 size={16} className="text-[var(--orb-orange)] shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold text-[var(--orb-orange)] tracking-wider">CoNexus STORY GAMES</p>
          <p className="font-mono text-[8px] text-muted-foreground/50">34 interactive narrative experiences</p>
        </div>
        <ChevronRight size={14} className="text-muted-foreground/35" />
      </Link>
    </div>
  );
}

/* ─── CHARACTER OVERLAY TAB ─── */
function CharactersTab({ song }: { song: LoredexEntry | null }) {
  const { getEntry } = useLoredex();

  if (!song) return null;

  const characters = song.characters_featured || [];

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users size={24} className="text-muted-foreground/25 mb-2" />
        <p className="font-mono text-xs text-muted-foreground/50">No characters tagged</p>
        <p className="font-mono text-[9px] text-muted-foreground/25 mt-1">Character data unavailable for this track</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
      <p className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.2em] px-1 uppercase mb-2">
        Characters in "{song.name}"
      </p>
      {characters.map((name) => {
        const entry = getEntry(name);
        if (!entry) return null;
        return (
          <Link
            key={name}
            href={`/entity/${entry.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-all group"
          >
            {entry.image ? (
              <img src={entry.image} alt={entry.name}
                className="w-9 h-9 rounded-md object-cover ring-1 ring-white/10 shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-md bg-muted/40 flex items-center justify-center shrink-0">
                <Users size={14} className="text-muted-foreground/35" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] text-muted-foreground/90 group-hover:text-[var(--neon-cyan)] transition-colors truncate">
                {entry.name}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground/40 truncate">
                {entry.affiliation || entry.era || entry.type}
              </p>
            </div>
            <Eye size={12} className="text-muted-foreground/25 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}

/* ─── EXPANDED PLAYER ─── */
function ExpandedPlayer({
  song,
  isPlaying,
  queue,
  onPlayPause,
  onNext,
  onPrev,
  onPlay,
  onPlayAlbum,
  onCollapse,
}: {
  song: LoredexEntry;
  isPlaying: boolean;
  queue: LoredexEntry[];
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPlay: (song: LoredexEntry) => void;
  onPlayAlbum: (albumName: string) => void;
  onCollapse: () => void;
}) {
  const [activeTab, setActiveTab] = useState<MediaTab>("queue");
  const streaming = song.streaming_links || {};
  const mv = song.music_video || {};
  const videoUrl = mv.official || mv.vevo || "";

  const tabs: { id: MediaTab; label: string; icon: typeof List }[] = [
    { id: "queue", label: "QUEUE", icon: List },
    { id: "albums", label: "ALBUMS", icon: Disc3 },
    { id: "saga", label: "SAGA", icon: Tv },
    { id: "characters", label: "CAST", icon: Users },
  ];

  return (
    <div className="px-3 sm:px-4 pb-3">
      {/* Header with collapse */}
      <div className="flex items-center justify-between py-2 border-b border-border/40 mb-3">
        <div className="flex items-center gap-2">
          <Radio size={12} className="text-[var(--neon-cyan)]" />
          <span className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.3em]">CoNexus MEDIA</span>
        </div>
        <button onClick={onCollapse} className="p-1 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Now Playing Section */}
      <div className="flex gap-4 mb-3">
        {/* Album Art */}
        <div className="shrink-0">
          {song.image ? (
            <img src={song.image} alt={song.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover ring-1 ring-white/10 ${isPlaying ? "shadow-[0_0_20px_rgba(51,226,230,0.15)]" : ""}`}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted/40 flex items-center justify-center">
              <Music2 size={24} className="text-muted-foreground/35" />
            </div>
          )}
        </div>

        {/* Song Details + Controls */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/song/${song.id}`}
              className="font-mono text-sm font-bold text-foreground hover:text-[var(--neon-cyan)] transition-colors truncate block">
              {song.name}
            </Link>
            <p className="font-mono text-[10px] text-muted-foreground/50 truncate mt-0.5">
              {song.album || "Malkia Ukweli & the Panopticon"}
            </p>
            {song.track_number && (
              <p className="font-mono text-[9px] text-muted-foreground/25 mt-0.5">
                Track {song.track_number}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button onClick={onPrev} className="p-1.5 text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors">
              <SkipBack size={16} />
            </button>
            <button
              onClick={onPlayPause}
              className="p-2.5 rounded-full transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(51,226,230,0.25), rgba(56,117,250,0.25))",
                border: "1px solid rgba(51,226,230,0.4)",
                boxShadow: isPlaying ? "0 0 15px rgba(51,226,230,0.2)" : "none",
              }}
            >
              {isPlaying ? <Pause size={16} className="text-[var(--neon-cyan)]" /> : <Play size={16} className="text-[var(--neon-cyan)] ml-0.5" />}
            </button>
            <button onClick={onNext} className="p-1.5 text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors">
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        {/* Streaming Links */}
        <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
          {videoUrl && (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[var(--alert-red)] text-[9px] font-mono border border-[var(--alert-red)]/20 hover:bg-[var(--alert-red)]/10 transition-colors">
              <Film size={11} /> MUSIC VIDEO
            </a>
          )}
          {streaming.spotify && (
            <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#1DB954] text-[9px] font-mono border border-[#1DB954]/20 hover:bg-[#1DB954]/10 transition-colors">
              <SpotifyIcon className="w-3 h-3" /> Spotify
            </a>
          )}
          {streaming.apple_music && (
            <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[#FC3C44] text-[9px] font-mono border border-[#FC3C44]/20 hover:bg-[#FC3C44]/10 transition-colors">
              <AppleMusicIcon className="w-3 h-3" /> Apple Music
            </a>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-0.5 mb-2 border-b border-border/40 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-mono text-[9px] tracking-wider transition-all ${
                active
                  ? "text-[var(--neon-cyan)] border-b-2 border-[var(--neon-cyan)]"
                  : "text-muted-foreground/50 hover:text-muted-foreground/70"
              }`}
            >
              <Icon size={11} />
              {tab.label}
              {tab.id === "queue" && queue.length > 0 && (
                <span className="text-[8px] text-muted-foreground/35 ml-0.5">({queue.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "queue" && <QueueTab queue={queue} currentSong={song} onPlay={onPlay} />}
        {activeTab === "albums" && <AlbumsTab onPlayAlbum={onPlayAlbum} />}
        {activeTab === "saga" && <SagaTab />}
        {activeTab === "characters" && <CharactersTab song={song} />}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function CoNexusMediaPlayer() {
  const { currentSong, isPlaying, queue, playSong, pause, resume, next, prev, setQueue, showPlayer } = usePlayer();
  const { getByAlbum, entries } = useLoredex();
  const [expanded, setExpanded] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, pause, resume]);

  const handlePlayAlbum = useCallback((albumName: string) => {
    const tracks = getByAlbum(albumName);
    if (tracks.length > 0) {
      setQueue(tracks);
      playSong(tracks[0]);
    }
  }, [getByAlbum, setQueue, playSong]);

  if (!showPlayer || !currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[48]">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-depth) 100%)",
              borderTop: "1px solid var(--glass-border)",
              backdropFilter: "blur(30px)",
            }}
          >
            <ExpandedPlayer
              song={currentSong}
              isPlaying={isPlaying}
              queue={queue}
              onPlayPause={handlePlayPause}
              onNext={next}
              onPrev={prev}
              onPlay={playSong}
              onPlayAlbum={handlePlayAlbum}
              onCollapse={() => setExpanded(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="mini"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-depth) 100%)",
              borderTop: "1px solid var(--glass-border)",
              backdropFilter: "blur(20px)",
            }}
          >
            <MiniPlayer
              song={currentSong}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={next}
              onPrev={prev}
              onExpand={() => setExpanded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
