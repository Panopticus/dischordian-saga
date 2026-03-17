/* ═══════════════════════════════════════════════════════
   GAME PREVIEW TOOLTIP — Hover tooltip showing character
   portraits from Loredex for CoNexus game cards.
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Shield, Star } from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";
import type { ConexusGame } from "@/data/conexusGames";
import { getAchievementByGameId } from "@/data/loreAchievements";

interface GamePreviewTooltipProps {
  game: ConexusGame;
  children: ReactNode;
}

export default function GamePreviewTooltip({ game, children }: GamePreviewTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("above");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getEntry } = useLoredex();

  // Get character portraits from Loredex
  const characterPortraits = game.characters.map(name => {
    const entry = getEntry(name);
    return {
      name,
      image: entry?.image || null,
      type: entry?.type || "character",
    };
  });

  const achievement = getAchievementByGameId(game.id);
  const hasPortraits = characterPortraits.some(c => c.image);

  // Determine tooltip position based on element position in viewport
  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // If element is in the top half of the viewport, show tooltip below
      setPosition(rect.top < viewportHeight / 2 ? "below" : "above");
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400); // 400ms delay to prevent flicker
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: position === "above" ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === "above" ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-40 left-1/2 -translate-x-1/2 w-64 pointer-events-none ${
              position === "above" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <div className="rounded-lg border border-purple-500/30 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden">
              {/* Character portraits row */}
              {hasPortraits && (
                <div className="flex items-center gap-0 border-b border-border/20">
                  {characterPortraits.map((char, i) => (
                    <div
                      key={char.name}
                      className="flex-1 relative overflow-hidden"
                      style={{ maxWidth: `${100 / Math.min(characterPortraits.length, 3)}%` }}
                    >
                      {char.image ? (
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={char.image}
                            alt={char.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                          <Users size={16} className="text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 right-1">
                        <p className="font-mono text-[7px] text-white/80 truncate text-center leading-tight">
                          {char.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Game info */}
              <div className="p-2.5">
                <p className="font-display text-[11px] font-bold text-foreground tracking-wide mb-1">
                  {game.title}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                  {game.description}
                </p>
                <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground/60">
                  <span className="flex items-center gap-0.5">
                    <Clock size={8} /> {game.estimatedTime}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Shield size={8} /> {game.difficulty}
                  </span>
                  {achievement && (
                    <span className="flex items-center gap-0.5 text-amber-400/60">
                      <Star size={8} /> +{achievement.xpReward} XP
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-card/95 border-purple-500/30 ${
                position === "above"
                  ? "bottom-[-5px] border-r border-b"
                  : "top-[-5px] border-l border-t"
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
