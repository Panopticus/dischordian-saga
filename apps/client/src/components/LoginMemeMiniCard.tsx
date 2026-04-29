/* ═══════════════════════════════════════════════════════
   LOGIN MEME MINI CARD — minimized PiP for the broadcast

   When the player minimizes the LoginMemeBroadcast modal,
   this card sits in the bottom-right corner and lets the
   audio keep playing across route changes. Click expand
   to return to the full modal.
   ═══════════════════════════════════════════════════════ */
import { motion } from "framer-motion";
import { Maximize2, Pause, Play, X } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import type { LoginAlbumTransmission } from "@/hooks/useLoginAlbumTransmission";

interface Props {
  transmission: LoginAlbumTransmission;
  onExpand: () => void;
  onClose: () => void;
}

export default function LoginMemeMiniCard({ transmission, onExpand, onClose }: Props) {
  const player = usePlayer();
  const isOurSong =
    player.currentSong?.id === `album1_${transmission.trackId.toLowerCase()}`;

  if (!isOurSong) return null;

  const duration = player.duration > 0 ? player.duration : transmission.durationMs / 1000;
  const pct = duration > 0 ? Math.min(100, (player.currentTime / duration) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-[199] w-80 bg-black border border-emerald-900/60 rounded-md shadow-[0_0_36px_rgba(16,185,129,0.3)] overflow-hidden"
      role="region"
      aria-label="Login transmission · minimized"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
        }}
      />
      <div className="relative px-3 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-emerald-300 border-b border-emerald-900/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>▸ Late Night · {transmission.trackId}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            aria-label="Expand"
            className="p-0.5 rounded hover:bg-emerald-900/40"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            aria-label="Stop and close"
            className="p-0.5 rounded hover:bg-red-900/40"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative px-3 py-3">
        <div className="font-serif text-emerald-100 text-sm mb-2 truncate">
          {transmission.title}
        </div>

        <div className="h-1 bg-emerald-950 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-emerald-500/70">
          <button
            onClick={() => (player.isPlaying ? player.pause() : player.resume())}
            aria-label={player.isPlaying ? "Pause" : "Resume"}
            className="flex items-center gap-1 hover:text-emerald-300"
          >
            {player.isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            {player.isPlaying ? "Pause" : "Play"}
          </button>
          <span>
            {formatTime(player.currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
