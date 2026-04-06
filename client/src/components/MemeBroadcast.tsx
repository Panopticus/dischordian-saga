/* ═══════════════════════════════════════════════════════
   MEME BROADCAST PLAYER

   Retro news-reel video player for the Meme's Late Night
   transmissions. Embedded Google Drive videos wrapped in a
   CRT-scanline + old-TV-grain overlay.

   Flow:
     1. Meme's INTRO commentary (typewriter)
     2. Static transition → video plays
     3. Meme's OUTRO commentary after video
     4. Rewards granted on first completion
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, SkipForward, Radio } from "lucide-react";
import { driveEmbedUrl, type Transmission } from "@shared/transmissions";
import { useKinetic } from "@/hooks/useKinetic";

interface Props {
  transmission: Transmission;
  onClose: () => void;
  onComplete: (transmissionId: string) => void;
  /** Has the player already watched this one (affects rewards display) */
  alreadyWatched: boolean;
  /** Is the Oracle reveal active? Shifts Meme's visual tone */
  oracleRevealActive: boolean;
}

type Phase = "intro" | "broadcast" | "outro" | "done";

export default function MemeBroadcast({ transmission, onClose, onComplete, alreadyWatched, oracleRevealActive }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");

  // Physics-aware kinetic typography for Meme commentary
  const intro = useKinetic({ mode: "word", text: transmission.memeIntro, speed: 20, autoStart: phase === "intro" });
  const outro = useKinetic({ mode: "word", text: transmission.memeOutro, speed: 20, autoStart: phase === "outro" });

  const typedIntro = intro.displayText;
  const typedOutro = outro.displayText;

  const handleComplete = () => {
    onComplete(`ep${transmission.epoch}-${transmission.episodeNumber}`);
    setPhase("done");
    setTimeout(onClose, 2000);
  };

  // Subtle visual shift when Oracle reveal is active
  const accent = oracleRevealActive ? "text-purple-300" : "text-pink-400";
  const borderColor = oracleRevealActive ? "border-purple-400/60" : "border-pink-500/60";
  const glow = oracleRevealActive ? "shadow-purple-500/30" : "shadow-pink-500/30";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-2 sm:p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        data-testid="meme-broadcast"
      >
        {/* Old TV frame */}
        <div className={`relative w-full max-w-4xl bg-gradient-to-b from-zinc-950 to-black border-4 ${borderColor} rounded-lg overflow-hidden shadow-2xl ${glow}`}>
          {/* CRT scan-line overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay opacity-40"
               style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)" }} />
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none z-20"
               style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
          {/* Film grain */}
          <div className="absolute inset-0 pointer-events-none z-20 opacity-10 mix-blend-screen"
               style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22/></svg>')" }} />

          {/* Header — Late Night with the Meme */}
          <div className="relative z-40 flex items-center justify-between px-4 py-2 bg-black border-b border-border/30">
            <div className="flex items-center gap-2">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <Radio size={14} className="text-red-500" />
              </motion.div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">LIVE</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                Late Night with the Meme · Transmission #{transmission.broadcastOrder}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground/60 hover:text-foreground" data-testid="close-broadcast">
              <X size={16} />
            </button>
          </div>

          {/* Title card */}
          <div className="relative z-40 px-6 py-3 bg-black/60 border-b border-border/20">
            <p className={`font-mono text-[8px] uppercase tracking-[0.4em] ${accent} mb-1`}>Epoch {transmission.epoch} · Episode {transmission.episodeNumber}</p>
            <h2 className={`font-display text-2xl font-bold tracking-wider ${oracleRevealActive ? "text-purple-200" : "text-pink-200"}`}>{transmission.title}</h2>
          </div>

          {/* CONTENT AREA */}
          <div className="relative z-40 min-h-[400px] max-h-[60vh] overflow-y-auto">
            {/* INTRO */}
            {phase === "intro" && (
              <div className="p-6">
                <div className="flex gap-3 items-start mb-4">
                  <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${borderColor} flex items-center justify-center font-display font-bold text-lg ${accent}`}>
                    M
                  </div>
                  <div className="flex-1">
                    <div className={`font-mono text-[9px] uppercase tracking-wider ${accent} mb-1`}>
                      THE MEME · opening comments
                    </div>
                    <p className="font-mono text-sm italic text-foreground/85 leading-relaxed min-h-[120px]">
                      {typedIntro}
                      {typedIntro.length < transmission.memeIntro.length && <span className="animate-pulse">▊</span>}
                    </p>
                  </div>
                </div>
                {typedIntro.length === transmission.memeIntro.length && (
                  <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setPhase("broadcast")}
                    className={`w-full px-4 py-3 rounded border-2 ${borderColor} bg-black/60 hover:bg-black/80 font-mono text-[11px] uppercase tracking-[0.25em] ${accent} flex items-center justify-center gap-2`}
                    data-testid="start-broadcast"
                  >
                    <Play size={14} /> ROLL THE TAPE
                  </motion.button>
                )}
              </div>
            )}

            {/* BROADCAST (video) */}
            {phase === "broadcast" && (
              <div className="relative aspect-video bg-black">
                {transmission.videoUrl ? (
                  <video
                    src={transmission.videoUrl}
                    className="w-full h-full"
                    controls
                    autoPlay
                    onEnded={() => setPhase("outro")}
                    title={transmission.title}
                  />
                ) : transmission.driveFileId ? (
                  <iframe
                    src={driveEmbedUrl(transmission.driveFileId)}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={transmission.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400 mb-3"
                    >
                      ▸ SIGNAL PENDING UPLOAD
                    </motion.div>
                    <p className="font-mono text-xs text-muted-foreground/80 max-w-md leading-relaxed mb-3">
                      Video file not yet linked. The Antiquarian's transcription is below.
                    </p>
                    <p className={`font-mono text-[10px] italic ${accent}`}>
                      {transmission.synopsis}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setPhase("outro")}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded bg-black/80 border border-border/40 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80 hover:text-foreground hover:bg-black flex items-center gap-1.5 z-50"
                  data-testid="skip-to-outro"
                >
                  SKIP · Meme's Outro <SkipForward size={10} />
                </button>
              </div>
            )}

            {/* OUTRO */}
            {phase === "outro" && (
              <div className="p-6">
                <div className="flex gap-3 items-start mb-4">
                  <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${borderColor} flex items-center justify-center font-display font-bold text-lg ${accent}`}>
                    M
                  </div>
                  <div className="flex-1">
                    <div className={`font-mono text-[9px] uppercase tracking-wider ${accent} mb-1`}>
                      THE MEME · closing comments
                    </div>
                    <p className="font-mono text-sm italic text-foreground/85 leading-relaxed min-h-[100px]">
                      {typedOutro}
                      {typedOutro.length < transmission.memeOutro.length && <span className="animate-pulse">▊</span>}
                    </p>
                  </div>
                </div>
                {typedOutro.length === transmission.memeOutro.length && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                    {!alreadyWatched && (
                      <div className="mb-3 p-2 rounded border border-amber-500/30 bg-amber-500/5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">REWARDS</span>
                        <div className="flex gap-3 mt-1 font-mono text-[10px]">
                          <span className="text-amber-300">+{transmission.reward.xp} XP</span>
                          <span className="text-purple-300">+{transmission.reward.dream} Dream</span>
                          {transmission.reward.achievement && (
                            <span className="text-cyan-300">◈ {transmission.reward.achievement}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleComplete}
                      className={`w-full px-4 py-3 rounded border-2 ${borderColor} bg-black/60 hover:bg-black/80 font-mono text-[11px] uppercase tracking-[0.25em] ${accent}`}
                      data-testid="complete-broadcast"
                    >
                      {alreadyWatched ? "CLOSE" : "SIGN OFF & CLAIM REWARDS"}
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* DONE */}
            {phase === "done" && (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={`font-mono text-[11px] uppercase tracking-[0.4em] ${accent} mb-2`}
                >
                  ▸ TRANSMISSION ARCHIVED
                </motion.div>
                <p className="font-mono text-[9px] text-muted-foreground/60">
                  The Antiquarian writes in his journal…
                </p>
              </div>
            )}
          </div>

          {/* Footer — broadcast info */}
          <div className="relative z-40 px-4 py-2 bg-black/80 border-t border-border/30 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
              Signal intercepted · transmission reconstructed
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
              {Math.floor(transmission.lengthSeconds / 60)}:{String(transmission.lengthSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
