/* ═══════════════════════════════════════════════════════
   TOME VIEWER — In-app CoNexus story game viewer
   Book-opening cinematic → story details → embedded play
   Replaces window.open with an immersive in-app experience.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, X, ExternalLink, Clock, Users, Sparkles,
  CheckCircle2, BookMarked, ChevronRight, Scroll, Star,
} from "lucide-react";
import type { ConexusGame, Age } from "@/data/conexusGames";
import { DIFFICULTY_COLORS } from "@/data/conexusGames";
import { getAchievementByGameId } from "@/data/loreAchievements";
import { TOME_PLACEMENTS, type TomePlacement } from "@/game/livingArk";

const AGE_COLORS: Record<Age, { text: string; border: string; bg: string; glow: string }> = {
  "The Foundation": { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", glow: "rgba(245,158,11,0.3)" },
  "The Age of Privacy": { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", glow: "rgba(59,130,246,0.3)" },
  "Haven: Sundown Bazaar": { text: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", glow: "rgba(239,68,68,0.3)" },
  "Fall of Reality (Prequel)": { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", glow: "rgba(168,85,247,0.3)" },
  "Age of Potentials": { text: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10", glow: "rgba(6,182,212,0.3)" },
  "Visions": { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", glow: "rgba(52,211,153,0.3)" },
};

interface TomeViewerProps {
  game: ConexusGame;
  isCompleted: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function TomeViewer({ game, isCompleted, onComplete, onClose }: TomeViewerProps) {
  const [phase, setPhase] = useState<"opening" | "details" | "playing">("opening");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  const achievement = getAchievementByGameId(game.id);
  const placement = TOME_PLACEMENTS.find(p => p.tomeId === game.id);
  const ageColor = AGE_COLORS[game.age] || AGE_COLORS["The Foundation"];
  const diffColor = DIFFICULTY_COLORS?.[game.difficulty] || "text-white/60";

  // Book opening animation → auto-advance to details after 2s
  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("details"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Iframe timeout — if doesn't load in 5s, fall back
  useEffect(() => {
    if (phase === "playing" && !iframeLoaded) {
      const t = setTimeout(() => {
        if (!iframeLoaded) setIframeFailed(true);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [phase, iframeLoaded]);

  const handlePlay = useCallback(() => {
    setPhase("playing");
  }, []);

  const handleExternalOpen = useCallback(() => {
    window.open(game.conexusUrl, "_blank");
  }, [game.conexusUrl]);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* ── BACKDROP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={phase === "opening" ? undefined : onClose}
      />

      {/* ── BOOK OPENING CINEMATIC ── */}
      <AnimatePresence>
        {phase === "opening" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            {/* Radial glow */}
            <div className="absolute w-[300px] h-[300px] rounded-full blur-3xl animate-pulse"
              style={{ background: `radial-gradient(circle, ${ageColor.glow} 0%, transparent 70%)` }} />

            {/* Book */}
            <motion.div
              className="relative"
              initial={{ rotateY: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "800px" }}
            >
              <div className={`w-48 h-64 sm:w-56 sm:h-72 rounded-lg ${ageColor.border} border-2 ${ageColor.bg} flex flex-col items-center justify-center p-6`}
                style={{ boxShadow: `0 0 60px ${ageColor.glow}, inset 0 0 30px ${ageColor.glow}` }}>
                <BookOpen size={48} className={`${ageColor.text} mb-4`} />
                <p className={`font-display text-sm tracking-[0.3em] ${ageColor.text} text-center`}>{game.title}</p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />
                <p className="font-mono text-[8px] text-white/30 tracking-[0.4em]">{game.age.toUpperCase()}</p>
              </div>
            </motion.div>

            {/* Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: ageColor.glow }}
                initial={{
                  x: 0, y: 0, opacity: 0, scale: 0,
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * (120 + Math.random() * 80),
                  y: Math.sin(i * 30 * Math.PI / 180) * (120 + Math.random() * 80),
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 2, delay: 0.5 + i * 0.05, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOME DETAILS VIEW ── */}
      <AnimatePresence>
        {phase === "details" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black/95 border ${ageColor.border} rounded-2xl`}
              style={{ boxShadow: `0 0 40px ${ageColor.glow}` }}
              onClick={e => e.stopPropagation()}>

              {/* Cover Image */}
              {game.coverImage && (
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 grid-bg opacity-20" />
                </div>
              )}

              {/* Header */}
              <div className={`relative px-6 ${game.coverImage ? "-mt-16" : "pt-6"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookMarked size={14} className={ageColor.text} />
                      <span className={`font-mono text-[9px] tracking-[0.3em] ${ageColor.text}`}>{game.age.toUpperCase()}</span>
                    </div>
                    <h2 className={`font-display text-2xl sm:text-3xl font-black tracking-wider ${ageColor.text} mb-2`}>{game.title}</h2>
                  </div>
                  <button onClick={onClose} className="text-white/30 hover:text-white/60 mt-2">
                    <X size={20} />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${ageColor.bg} ${ageColor.text} ${ageColor.border} border`}>
                    <Clock size={8} className="inline mr-1" />{game.estimatedTime}
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${diffColor}`}>
                    {game.difficulty.toUpperCase()}
                  </span>
                  {isCompleted && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle2 size={8} className="inline mr-1" />COMPLETED
                    </span>
                  )}
                  {placement?.cardReward && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Star size={8} className="inline mr-1" />Card: {placement.cardReward}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 pb-4">
                <p className="font-mono text-sm text-white/70 leading-relaxed mb-4">{game.description}</p>

                {/* Characters */}
                {game.characters.length > 0 && (
                  <div className="mb-4">
                    <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">
                      <Users size={10} className="inline mr-1" />FEATURED CHARACTERS
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {game.characters.map(c => (
                        <span key={c} className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lore Fragment (if achievement exists) */}
                {achievement && (
                  <div className={`rounded-lg border ${ageColor.border} ${ageColor.bg} p-4 mb-4`}>
                    <p className="font-mono text-[9px] text-white/40 tracking-wider mb-2">
                      <Scroll size={10} className="inline mr-1" />LORE FRAGMENT — {achievement.title}
                    </p>
                    <p className={`font-mono text-xs ${isCompleted ? `${ageColor.text} leading-relaxed` : "text-white/20 italic"}`}>
                      {isCompleted
                        ? achievement.loreFragment
                        : "Complete this story to unlock the hidden lore fragment..."}
                    </p>
                    {achievement.xpReward > 0 && (
                      <p className="font-mono text-[9px] text-amber-400/60 mt-2">
                        <Sparkles size={8} className="inline mr-1" />+{achievement.xpReward} XP on completion
                      </p>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {game.tags.map(tag => (
                    <span key={tag} className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/30 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePlay}
                    className={`flex-1 py-3 rounded-lg ${ageColor.bg} border ${ageColor.border} ${ageColor.text} font-mono text-sm font-bold hover:brightness-125 transition-all flex items-center justify-center gap-2`}
                    style={{ boxShadow: `0 0 20px ${ageColor.glow}` }}
                  >
                    <BookOpen size={16} /> ENTER THE STORY
                  </button>
                  {!isCompleted && (
                    <button
                      onClick={onComplete}
                      className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-xs hover:bg-green-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> MARK COMPLETE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EMBEDDED PLAY VIEW ── */}
      <AnimatePresence>
        {phase === "playing" && (
          <motion.div
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-white/10 z-10">
              <div className="flex items-center gap-3">
                <BookOpen size={14} className={ageColor.text} />
                <span className={`font-display text-sm tracking-wider ${ageColor.text}`}>{game.title}</span>
                <span className="font-mono text-[9px] text-white/30">— {game.age}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExternalOpen}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[10px] hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink size={10} /> OPEN IN NEW TAB
                </button>
                {!isCompleted && (
                  <button
                    onClick={onComplete}
                    className="px-3 py-1.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[10px] hover:bg-green-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={10} /> COMPLETE
                  </button>
                )}
                <button
                  onClick={() => setPhase("details")}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[10px] hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={10} className="rotate-180 inline mr-1" /> BACK
                </button>
                <button onClick={onClose} className="text-white/30 hover:text-white/60 ml-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Iframe */}
            <div className="flex-1 relative bg-black">
              {!iframeFailed ? (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-3 mx-auto"
                          style={{ borderColor: ageColor.glow, borderTopColor: "transparent" }} />
                        <p className="font-mono text-xs text-white/40">Loading story...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={game.conexusUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setIframeFailed(true)}
                    allow="fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    title={game.title}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <BookOpen size={48} className={`${ageColor.text} mx-auto mb-4 opacity-50`} />
                    <p className="font-mono text-sm text-white/60 mb-2">This story opens best in a new tab</p>
                    <p className="font-mono text-[10px] text-white/30 mb-6">CoNexus stories are hosted externally and may not embed directly.</p>
                    <button
                      onClick={handleExternalOpen}
                      className={`px-6 py-3 rounded-lg ${ageColor.bg} border ${ageColor.border} ${ageColor.text} font-mono text-sm font-bold hover:brightness-125 transition-all flex items-center gap-2 mx-auto`}
                      style={{ boxShadow: `0 0 20px ${ageColor.glow}` }}
                    >
                      <ExternalLink size={16} /> OPEN ON CONEXUS.INK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
