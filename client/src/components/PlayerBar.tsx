import { usePlayer } from "@/contexts/PlayerContext";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Play, Pause, SkipForward, SkipBack, ExternalLink, Music2, ChevronUp, ChevronDown
} from "lucide-react";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.282a10.16 10.16 0 00-1.564-.17C17.474.023 16.81 0 14.952 0h-5.9c-1.86 0-2.524.024-3.186.112-.55.064-1.1.174-1.62.33C3.13.77 2.39 1.77 2.07 3.08a9.23 9.23 0 00-.24 2.19c-.09.66-.112 1.324-.112 3.186v5.088c0 1.86.024 2.524.112 3.186.064.55.174 1.1.33 1.62.317 1.31 1.062 2.31 2.18 3.043.55.36 1.16.6 1.82.73.55.11 1.1.174 1.62.21.66.05 1.324.07 3.186.07h5.088c1.86 0 2.524-.024 3.186-.112.55-.064 1.1-.174 1.62-.33 1.31-.317 2.31-1.062 3.043-2.18.36-.55.6-1.16.73-1.82.11-.55.174-1.1.21-1.62.05-.66.07-1.324.07-3.186V9.31c0-1.86-.024-2.524-.112-3.186z"/>
    </svg>
  );
}

function TidalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004L8.008 8l4.004 4 4.004-4-4.004-4.008zM12.012 12l-4.004 4.004L4.004 12 0 16.004l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004L12.012 12zm3.996-8.008l4.004 4.004L24.016 3.992 20.012-.012l-4.004 4.004z"/>
    </svg>
  );
}

export default function PlayerBar() {
  const { currentSong, isPlaying, playSong, pause, resume, next, prev, showPlayer } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate progress for visual effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.5);
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  useEffect(() => { setProgress(0); }, [currentSong]);

  if (!showPlayer || !currentSong) return null;

  const mv = currentSong.music_video || {};
  const videoUrl = mv.official || mv.vevo || "";
  const streaming = currentSong.streaming_links || {};

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-[2px] bg-border/20 relative">
        <div
          className="h-full bg-gradient-to-r from-primary to-[#ff2d55] transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-[oklch(0.06_0.01_280)]/95 backdrop-blur-xl border-t border-border/10">
        {/* Mobile expanded view */}
        {expanded && (
          <div className="sm:hidden p-3 border-b border-border/10 space-y-3">
            {/* Streaming links */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-muted-foreground/40 tracking-wider">LISTEN ON</span>
              <div className="flex gap-2 ml-auto">
                {streaming.spotify && (
                  <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#1DB954]/10 text-[#1DB954] text-[10px] font-mono">
                    <SpotifyIcon /> Spotify
                  </a>
                )}
                {streaming.apple_music && (
                  <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#FC3C44]/10 text-[#FC3C44] text-[10px] font-mono">
                    <AppleMusicIcon /> Apple
                  </a>
                )}
                {streaming.tidal && (
                  <a href={streaming.tidal} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white text-[10px] font-mono">
                    <TidalIcon /> Tidal
                  </a>
                )}
              </div>
            </div>
            {videoUrl && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded bg-destructive/15 text-destructive text-xs font-mono border border-destructive/20">
                <ExternalLink size={12} /> WATCH MUSIC VIDEO
              </a>
            )}
          </div>
        )}

        <div className="flex items-center px-3 sm:px-4 py-2.5 gap-3">
          {/* Song Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-none sm:w-56">
            {currentSong.image ? (
              <img src={currentSong.image} alt={currentSong.name}
                className={`w-10 h-10 rounded object-cover ring-1 ring-border/20 shrink-0 ${isPlaying ? "animate-pulse-slow" : ""}`}
              />
            ) : (
              <div className="w-10 h-10 rounded bg-secondary/30 flex items-center justify-center shrink-0">
                <Music2 size={14} className="text-muted-foreground/40" />
              </div>
            )}
            <div className="min-w-0">
              <Link href={`/song/${currentSong.id}`}
                className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate block">
                {currentSong.name}
              </Link>
              <p className="text-[10px] font-mono text-muted-foreground/50 truncate">
                {currentSong.album || "Malkia Ukweli & the Panopticon"}
              </p>
            </div>
            {/* Mobile expand toggle */}
            <button onClick={() => setExpanded(!expanded)} className="sm:hidden p-1 text-muted-foreground/40">
              {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={prev} className="p-1.5 text-muted-foreground/60 hover:text-foreground transition-colors">
              <SkipBack size={14} />
            </button>
            <button
              onClick={isPlaying ? pause : resume}
              className="p-2 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <button onClick={next} className="p-1.5 text-muted-foreground/60 hover:text-foreground transition-colors">
              <SkipForward size={14} />
            </button>
          </div>

          {/* Desktop Streaming Links */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto">
            {videoUrl && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono hover:bg-destructive/20 transition-all">
                <Play size={8} /> VIDEO
              </a>
            )}
            {streaming.spotify && (
              <a href={streaming.spotify} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors" title="Spotify">
                <SpotifyIcon />
              </a>
            )}
            {streaming.apple_music && (
              <a href={streaming.apple_music} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded text-[#FC3C44] hover:bg-[#FC3C44]/10 transition-colors" title="Apple Music">
                <AppleMusicIcon />
              </a>
            )}
            {streaming.tidal && (
              <a href={streaming.tidal} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded text-foreground/60 hover:bg-secondary/30 transition-colors" title="Tidal">
                <TidalIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
