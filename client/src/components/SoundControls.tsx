/* ═══════════════════════════════════════════════════════
   SOUND CONTROLS — Volume/mute toggle for the Ark
   Shows in the AppShell header area
   ═══════════════════════════════════════════════════════ */
import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { useState, useRef, useEffect } from "react";

export default function SoundControls() {
  const { muted, volume, setMuted, setVolume, toggleMute, initAudio, audioReady } = useSound();
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
    <div ref={containerRef} className="relative">
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
            minWidth: "160px",
          }}
        >
          <p className="font-mono text-[9px] text-[var(--neon-cyan)]/50 tracking-[0.2em] mb-2">VOLUME</p>
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
        </div>
      )}
    </div>
  );
}
