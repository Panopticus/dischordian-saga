/* ═══════════════════════════════════════════════════════
   MEME BROADCAST PLAYER — "Late Night with the Meme"

   Retro CRT television player for the Meme's transmissions.
   Designed to feel like tuning into a pirate broadcast on
   a stolen frequency — static bursts, CRT curvature, film
   grain, scanline overlay, and the Meme's chaotic warmth.

   Flow:
     1. Static burst → Meme's INTRO commentary (kinetic word-mode)
     2. "ROLL THE TAPE" → static transition → video plays
     3. Video ends → static burst → Meme's OUTRO commentary
     4. First-watch: Loredex entries unlock + rewards granted
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, SkipForward, Radio, BookOpen } from "lucide-react";
import { driveEmbedUrl, type Transmission } from "@shared/transmissions";
import { getLoredexUnlocksForTransmission } from "@shared/transmissionLoredexUnlocks";
import { useKinetic } from "@/hooks/useKinetic";
import { emitDiscoveryNotification } from "@/components/DiscoveryNotification";
import { getNPCPortrait } from "@/game/npcPortraits";

interface Props {
  transmission: Transmission;
  onClose: () => void;
  onComplete: (transmissionId: string) => void;
  alreadyWatched: boolean;
  oracleRevealActive: boolean;
}

type Phase = "static-in" | "intro" | "static-to-video" | "broadcast" | "static-to-outro" | "outro" | "done";

export default function MemeBroadcast({ transmission, onClose, onComplete, alreadyWatched, oracleRevealActive }: Props) {
  const [phase, setPhase] = useState<Phase>("static-in");
  const [loredexRevealed, setLoredexRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Opening static burst → intro
  useEffect(() => {
    if (phase === "static-in") {
      const t = setTimeout(() => setPhase("intro"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "static-to-video") {
      const t = setTimeout(() => setPhase("broadcast"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "static-to-outro") {
      const t = setTimeout(() => setPhase("outro"), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Kinetic typography for Meme commentary
  const intro = useKinetic({ mode: "word", text: transmission.memeIntro, speed: 18, autoStart: phase === "intro" });
  const outro = useKinetic({ mode: "word", text: transmission.memeOutro, speed: 18, autoStart: phase === "outro" });

  const transmissionId = `ep${transmission.epoch}-${transmission.episodeNumber}`;

  const handleComplete = () => {
    onComplete(transmissionId);

    // Fire Loredex unlocks on first watch
    if (!alreadyWatched && !loredexRevealed) {
      setLoredexRevealed(true);
      const unlocks = getLoredexUnlocksForTransmission(transmissionId);
      if (unlocks && unlocks.entityIds.length > 0) {
        // Mark entities as discovered in localStorage
        const discovered: string[] = JSON.parse(localStorage.getItem("loredex_discovered") || "[]");
        const newIds = unlocks.entityIds.filter(id => !discovered.includes(id));
        if (newIds.length > 0) {
          localStorage.setItem("loredex_discovered", JSON.stringify([...discovered, ...newIds]));
          // Emit discovery notification
          emitDiscoveryNotification({
            featureKey: `transmission-${transmissionId}`,
            featureLabel: `${unlocks.discoveryLabel} — ${newIds.length} Loredex ${newIds.length === 1 ? "entry" : "entries"} unlocked`,
            roomName: "Late Night with the Meme",
            path: `/entity/${newIds[0]}`,
          });
        }
      }
    }

    setPhase("done");
    setTimeout(onClose, 2500);
  };

  // Visual theming — shifts when Oracle reveal active (Episode 11+)
  const accent = oracleRevealActive ? "text-purple-300" : "text-pink-400";
  const borderColor = oracleRevealActive ? "border-purple-400/60" : "border-pink-500/60";
  const glowColor = oracleRevealActive ? "rgba(168,85,247,0.2)" : "rgba(236,72,153,0.2)";
  const memeColor = oracleRevealActive ? "#c084fc" : "#f472b6";

  // Meme portrait expressions — shifts face based on broadcast phase
  const memePortrait = getNPCPortrait("the_meme");
  const memeExpression = phase === "intro"
    ? memePortrait?.expressions.neutral    // broadcasting — his default on-air face
    : phase === "outro"
      ? memePortrait?.expressions.emotional1 // sympathetic — wrapping up, warmer
      : memePortrait?.bustPortrait;           // base fallback

  // Static noise component
  const StaticBurst = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.8, 1, 0.6, 1] }}
      className="absolute inset-0 z-50"
      style={{
        background: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(#n)" opacity="0.4"/></svg>')}")`,
        mixBlendMode: "overlay",
      }}
    />
  );

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
        {/* CRT TV frame with curvature */}
        <div
          className="relative w-full max-w-4xl overflow-hidden"
          style={{
            borderRadius: "12px",
            border: `3px solid ${memeColor}40`,
            boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}, inset 0 0 60px rgba(0,0,0,0.5)`,
            background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
          }}
        >
          {/* CRT barrel distortion (subtle via border-radius inner content) */}
          <div className="relative overflow-hidden" style={{ borderRadius: "8px" }}>

            {/* Scanline overlay — covers EVERYTHING including video */}
            <div
              className="absolute inset-0 pointer-events-none z-[60]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                mixBlendMode: "multiply",
              }}
            />

            {/* Vignette — curved CRT edge darkening */}
            <div
              className="absolute inset-0 pointer-events-none z-[55]"
              style={{
                background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            {/* Film grain — animated noise */}
            <div
              className="absolute inset-0 pointer-events-none z-[50] opacity-[0.06] mix-blend-screen"
              style={{
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/></filter><rect width="100" height="100" filter="url(#g)"/></svg>')}")`,
                animation: "meme-grain 0.15s steps(3) infinite",
              }}
            />

            {/* ═══ HEADER BAR ═══ */}
            <div className="relative z-[70] flex items-center justify-between px-4 py-2 bg-black/90 border-b border-white/5">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: "0 0 6px rgba(239,68,68,0.8)" }} />
                </motion.div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-red-500 font-bold">LIVE</span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-white/30">
                  Late Night with the Meme · #{transmission.broadcastOrder}
                </span>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* ═══ TITLE STRIP ═══ */}
            <div className="relative z-[70] px-5 py-2.5 bg-black/70 border-b border-white/5">
              <p className={`font-mono text-[7px] uppercase tracking-[0.5em] ${accent} mb-0.5`}>
                Epoch {transmission.epoch} · Episode {transmission.episodeNumber}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-white/90">
                {transmission.title}
              </h2>
            </div>

            {/* ═══ CONTENT AREA ═══ */}
            <div className="relative z-[40] min-h-[350px] sm:min-h-[400px]">

              {/* STATIC BURSTS (transitions) */}
              {(phase === "static-in" || phase === "static-to-video" || phase === "static-to-outro") && (
                <div className="aspect-video flex items-center justify-center bg-black relative">
                  <StaticBurst />
                  <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="font-mono text-xs uppercase tracking-[0.4em] text-white/40 z-[60]"
                  >
                    {phase === "static-in" ? "TUNING FREQUENCY..." : "ADJUSTING SIGNAL..."}
                  </motion.div>
                </div>
              )}

              {/* INTRO — Meme's opening commentary */}
              {phase === "intro" && (
                <div className="p-5 sm:p-6">
                  <div className="flex gap-3 items-start mb-5">
                    {/* Meme avatar — broadcasting expression */}
                    <motion.div
                      animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.03, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="shrink-0 w-14 h-14 rounded-full overflow-hidden"
                      style={{
                        border: `2px solid ${memeColor}60`,
                        background: `linear-gradient(135deg, ${memeColor}20, transparent)`,
                        boxShadow: `0 0 16px ${memeColor}40`,
                      }}
                    >
                      {memeExpression ? (
                        <img src={memeExpression} alt="The Meme" className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-display font-black text-lg" style={{ color: memeColor }}>M</div>
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-mono text-[8px] uppercase tracking-[0.3em] ${accent} mb-1.5`}>
                        THE MEME · opening commentary
                      </div>
                      <p className="font-mono text-[13px] sm:text-sm italic text-white/80 leading-relaxed">
                        {intro.displayText}
                        {!intro.isComplete && (
                          <span className="inline-block w-[2px] h-[1em] ml-[2px] align-text-bottom animate-pulse" style={{ background: memeColor }} />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ROLL THE TAPE button */}
                  <AnimatePresence>
                    {intro.isComplete && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => setPhase("static-to-video")}
                        className="w-full py-3 rounded font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all"
                        style={{
                          border: `1px solid ${memeColor}40`,
                          color: memeColor,
                          background: `${memeColor}08`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${memeColor}15`; e.currentTarget.style.boxShadow = `0 0 20px ${memeColor}15`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${memeColor}08`; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <Play size={12} /> ROLL THE TAPE
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* BROADCAST — video plays on the CRT */}
              {phase === "broadcast" && (
                <div className="relative aspect-video bg-black">
                  {transmission.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={transmission.videoUrl}
                      className="w-full h-full"
                      controls
                      autoPlay
                      onEnded={() => setPhase("static-to-outro")}
                      title={transmission.title}
                      style={{ filter: "contrast(1.05) brightness(0.95)" }}
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
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-3"
                      >
                        ▸ SIGNAL PENDING
                      </motion.div>
                      <p className="font-mono text-xs text-white/50 max-w-md leading-relaxed">
                        {transmission.synopsis}
                      </p>
                    </div>
                  )}

                  {/* Skip button */}
                  <button
                    onClick={() => setPhase("static-to-outro")}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded bg-black/80 border border-white/10 font-mono text-[8px] uppercase tracking-wider text-white/50 hover:text-white hover:bg-black flex items-center gap-1.5 z-[70]"
                  >
                    SKIP <SkipForward size={9} />
                  </button>
                </div>
              )}

              {/* OUTRO — Meme's closing commentary */}
              {phase === "outro" && (
                <div className="p-5 sm:p-6">
                  <div className="flex gap-3 items-start mb-5">
                    <motion.div
                      animate={{ rotate: [0, -2, 2, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="shrink-0 w-14 h-14 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${memeColor}60`, boxShadow: `0 0 16px ${memeColor}40` }}
                    >
                      {memeExpression ? (
                        <img src={memeExpression} alt="The Meme" className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-display font-black text-lg" style={{ color: memeColor }}>M</div>
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-mono text-[8px] uppercase tracking-[0.3em] ${accent} mb-1.5`}>
                        THE MEME · closing commentary
                      </div>
                      <p className="font-mono text-[13px] sm:text-sm italic text-white/80 leading-relaxed">
                        {outro.displayText}
                        {!outro.isComplete && (
                          <span className="inline-block w-[2px] h-[1em] ml-[2px] align-text-bottom animate-pulse" style={{ background: memeColor }} />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Rewards + Loredex unlocks */}
                  <AnimatePresence>
                    {outro.isComplete && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        {!alreadyWatched && (
                          <div className="mb-3 p-3 rounded" style={{ border: `1px solid ${memeColor}25`, background: `${memeColor}05` }}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-[8px] uppercase tracking-[0.3em]" style={{ color: memeColor }}>TRANSMISSION REWARDS</span>
                            </div>
                            <div className="flex gap-4 font-mono text-[10px]">
                              <span className="text-amber-300">+{transmission.reward.xp} XP</span>
                              <span className="text-purple-300">+{transmission.reward.dream} Dream</span>
                              {transmission.reward.achievement && (
                                <span className="text-cyan-300">◈ {transmission.reward.achievement.replace(/_/g, " ")}</span>
                              )}
                            </div>
                            {/* Loredex unlock preview */}
                            {(() => {
                              const unlocks = getLoredexUnlocksForTransmission(transmissionId);
                              if (!unlocks || unlocks.entityIds.length === 0) return null;
                              return (
                                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                                  <BookOpen size={10} className="text-cyan-400" />
                                  <span className="font-mono text-[9px] text-cyan-400/80">
                                    {unlocks.discoveryLabel} — {unlocks.entityIds.length} Loredex {unlocks.entityIds.length === 1 ? "entry" : "entries"}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        <button
                          onClick={handleComplete}
                          className="w-full py-3 rounded font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all"
                          style={{
                            border: `1px solid ${memeColor}40`,
                            color: memeColor,
                            background: `${memeColor}08`,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${memeColor}15`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${memeColor}08`; }}
                        >
                          {alreadyWatched ? "SIGN OFF" : "SIGN OFF & CLAIM REWARDS"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* DONE — brief confirmation */}
              {phase === "done" && (
                <div className="p-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-3">
                    <Radio size={32} style={{ color: memeColor }} />
                  </motion.div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                    TRANSMISSION COMPLETE
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes meme-grain {
            0% { transform: translate(0, 0); }
            33% { transform: translate(-2px, 1px); }
            66% { transform: translate(1px, -2px); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
