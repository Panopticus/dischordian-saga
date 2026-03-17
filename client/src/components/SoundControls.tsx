/* ═══════════════════════════════════════════════════════
   SOUND CONTROLS — Volume/mute + TTS + Ambient Music
   Shows in the AppShell header area
   ═══════════════════════════════════════════════════════ */
import { Volume2, VolumeX, Volume1, Mic, MicOff, Music, Music2 } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { useAmbientMusic } from "@/contexts/AmbientMusicContext";
import { useState, useRef, useEffect } from "react";

interface SoundControlsProps {
  ttsEnabled?: boolean;
  onToggleTTS?: () => void;
  isSpeaking?: boolean;
}

export default function SoundControls({ ttsEnabled, onToggleTTS, isSpeaking }: SoundControlsProps) {
  const { muted, volume, setMuted, setVolume, toggleMute, initAudio, audioReady } = useSound();
  const music = useAmbientMusic();
  const [showSlider, setShowSlider] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close slider on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSlider(false);
      }
    }
    if (showSlider) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSlider]);

  const handleClick = async () => {
    if (!audioReady) {
      await initAudio();
    }
    toggleMute();
  };

  const VolumeIcon = muted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      {/* Ambient Music Toggle */}
      <button
        onClick={() => music.toggleMusic()}
        className="p-1.5 rounded-md transition-all group relative"
        style={{
          background: music.musicEnabled ? "rgba(255,183,77,0.08)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${music.musicEnabled ? "rgba(255,183,77,0.15)" : "rgba(255,255,255,0.05)"}`,
        }}
        title={music.musicEnabled
          ? `Music: ON${music.currentTrack ? ` — ${music.currentTrack.title}` : ""}`
          : "Enable Ambient Music"
        }
      >
        {music.musicEnabled ? (
          <Music2
            size={13}
            className={`transition-colors ${music.isPlaying ? "text-[var(--orb-orange)] animate-pulse" : "text-[var(--orb-orange)]/60 group-hover:text-[var(--orb-orange)]"}`}
          />
        ) : (
          <Music size={13} className="text-white/20 group-hover:text-white/40 transition-colors" />
        )}
        {music.isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--orb-orange)] animate-pulse" />
        )}
      </button>

      {/* TTS Toggle */}
      {onToggleTTS && (
        <button
          onClick={onToggleTTS}
          className="p-1.5 rounded-md transition-all group relative"
          style={{
            background: ttsEnabled ? "rgba(51,226,230,0.08)" : "rgba(255,50,50,0.05)",
            border: `1px solid ${ttsEnabled ? "rgba(51,226,230,0.15)" : "rgba(255,255,255,0.05)"}`,
          }}
          title={ttsEnabled ? "Disable Elara Voice" : "Enable Elara Voice"}
        >
          {ttsEnabled ? (
            <Mic
              size={13}
              className={`transition-colors ${isSpeaking ? "text-[var(--neon-cyan)] animate-pulse" : "text-[var(--neon-cyan)]/60 group-hover:text-[var(--neon-cyan)]"}`}
            />
          ) : (
            <MicOff size={13} className="text-white/20 group-hover:text-white/40 transition-colors" />
          )}
          {isSpeaking && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
          )}
        </button>
      )}

      {/* Volume Control */}
      <button
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); setShowSlider(!showSlider); }}
        className="p-1.5 rounded-md transition-all group"
        style={{
          background: muted ? "rgba(255,50,50,0.08)" : "rgba(51,226,230,0.05)",
          border: `1px solid ${muted ? "rgba(255,50,50,0.15)" : "rgba(51,226,230,0.1)"}`,
        }}
        title={muted ? "Unmute (right-click for volume)" : "Mute (right-click for volume)"}
      >
        <VolumeIcon
          size={14}
          className={`transition-colors ${muted ? "text-red-400/60" : "text-[var(--neon-cyan)]/60 group-hover:text-[var(--neon-cyan)]"}`}
        />
      </button>

      {/* Volume slider popup */}
      {showSlider && (
        <div
          className="absolute top-full right-0 mt-1 rounded-lg p-3 z-50"
          style={{
            background: "rgba(1,0,32,0.97)",
            border: "1px solid rgba(51,226,230,0.2)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            minWidth: "180px",
          }}
        >
          {/* SFX Volume */}
          <p className="font-mono text-[9px] text-[var(--neon-cyan)]/50 tracking-[0.2em] mb-2">SFX VOLUME</p>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => {
              const v = parseInt(e.target.value) / 100;
              setVolume(v);
              if (v > 0 && muted) setMuted(false);
            }}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--neon-cyan) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
            }}
          />
          <p className="font-mono text-[10px] text-white/30 mt-1 text-center">{Math.round(volume * 100)}%</p>

          {/* Music Volume */}
          <p className="font-mono text-[9px] text-[var(--orb-orange)]/50 tracking-[0.2em] mb-2 mt-3">MUSIC VOLUME</p>
          <input
            type="range"
            min={0}
            max={100}
            value={music.volume}
            onChange={(e) => music.setVolume(parseInt(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--orb-orange) ${music.volume}%, rgba(255,255,255,0.1) ${music.volume}%)`,
            }}
          />
          <p className="font-mono text-[10px] text-white/30 mt-1 text-center">{music.volume}%</p>

          {/* Now Playing */}
          {music.currentTrack && music.isPlaying && (
            <div className="mt-3 pt-2 border-t border-white/5">
              <p className="font-mono text-[8px] text-[var(--orb-orange)]/40 tracking-[0.2em]">NOW PLAYING</p>
              <p className="font-mono text-[10px] text-white/60 truncate mt-0.5">{music.currentTrack.title}</p>
              <p className="font-mono text-[8px] text-white/30 truncate">{music.currentTrack.album}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
