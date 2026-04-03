/* ═══════════════════════════════════════════════════════
   PACK OPENING — Pokemon TCG Pocket-style card reveal ceremony
   The dopamine loop that drives collection and monetization.

   Flow: Pack Selection → Pack Rip → Card Reveals → Summary
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, ChevronRight, Star, X } from "lucide-react";

interface PackCard {
  id: string;
  name: string;
  rarity: string;
  imageUrl?: string;
  attack?: number;
  health?: number;
  manaCost: number;
  cardType: string;
  faction?: string;
  isNew?: boolean;
  isFoil?: boolean;
}

interface PackType {
  id: string;
  name: string;
  description: string;
  color: string;
  glowColor: string;
  season: string;
  cost?: number; // 0 = free daily pack
}

const PACK_TYPES: PackType[] = [
  { id: "season1", name: "Season 1: Genesis", description: "The first wave of the Dischordian conflict", color: "#00bcd4", glowColor: "#00bcd480", season: "1", cost: 0 },
  { id: "season2", name: "Season 2: Schism", description: "The factions fracture and new alliances form", color: "#9c27b0", glowColor: "#9c27b080", season: "2", cost: 100 },
  { id: "season3", name: "Season 3: Convergence", description: "The final battle approaches", color: "#ff9800", glowColor: "#ff980080", season: "3", cost: 100 },
];

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common:    { bg: "bg-zinc-800", border: "border-zinc-600", text: "text-zinc-400", glow: "" },
  uncommon:  { bg: "bg-emerald-900/50", border: "border-emerald-500/60", text: "text-emerald-400", glow: "" },
  rare:      { bg: "bg-blue-900/50", border: "border-blue-500/60", text: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  epic:      { bg: "bg-purple-900/50", border: "border-purple-500/60", text: "text-purple-400", glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]" },
  legendary: { bg: "bg-amber-900/50", border: "border-amber-500/60", text: "text-amber-400", glow: "shadow-[0_0_40px_rgba(245,158,11,0.5)]" },
  mythic:    { bg: "bg-red-900/50", border: "border-red-500/60", text: "text-red-400", glow: "shadow-[0_0_50px_rgba(239,68,68,0.6)]" },
  neyon:     { bg: "bg-cyan-900/50", border: "border-cyan-400/60", text: "text-cyan-300", glow: "shadow-[0_0_60px_rgba(34,211,238,0.7)]" },
};

interface PackOpeningProps {
  /** Cards to reveal (from server booster pack opening) */
  cards: PackCard[];
  packType: string;
  onComplete: () => void;
  onClose: () => void;
}

type Phase = "intro" | "ripping" | "revealing" | "summary";

export default function PackOpening({ cards, packType, onComplete, onClose }: PackOpeningProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [revealIndex, setRevealIndex] = useState(-1);
  const [revealedCards, setRevealedCards] = useState<PackCard[]>([]);

  const pack = PACK_TYPES.find(p => p.id === packType) || PACK_TYPES[0];

  const handleRip = useCallback(() => {
    setPhase("ripping");
    // Ripping animation plays for 1.5 seconds, then start reveals
    setTimeout(() => {
      setPhase("revealing");
      setRevealIndex(0);
    }, 1500);
  }, []);

  const handleRevealNext = useCallback(() => {
    if (revealIndex < cards.length - 1) {
      setRevealedCards(prev => [...prev, cards[revealIndex]]);
      setRevealIndex(i => i + 1);
    } else {
      // Last card revealed
      setRevealedCards(prev => [...prev, cards[revealIndex]]);
      setTimeout(() => setPhase("summary"), 800);
    }
  }, [revealIndex, cards]);

  const currentCard = phase === "revealing" && revealIndex >= 0 ? cards[revealIndex] : null;
  const rarityStyle = currentCard ? (RARITY_COLORS[currentCard.rarity] || RARITY_COLORS.common) : RARITY_COLORS.common;
  const isHighRarity = currentCard && ["legendary", "mythic", "neyon", "epic"].includes(currentCard.rarity);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        {/* ═══ PACK INTRO — Tap to open ═══ */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Pack visual */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative cursor-pointer"
              onClick={handleRip}
            >
              <div
                className="w-48 h-72 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
                style={{
                  backgroundColor: pack.color + "15",
                  borderColor: pack.color,
                  boxShadow: `0 0 40px ${pack.glowColor}, 0 0 80px ${pack.glowColor}`,
                }}
              >
                <Package size={48} style={{ color: pack.color }} />
                <div className="text-center px-4">
                  <p className="font-display text-sm font-bold text-white">{pack.name}</p>
                  <p className="text-[10px] text-white/40 font-mono mt-1">5 CARDS</p>
                </div>
              </div>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 animate-pulse"
                />
              </div>
            </motion.div>

            <p className="font-mono text-sm text-white/40 animate-pulse">TAP TO OPEN</p>
          </motion.div>
        )}

        {/* ═══ RIPPING ANIMATION ═══ */}
        {phase === "ripping" && (
          <motion.div
            key="ripping"
            initial={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 1, rotateZ: 0 }}
              animate={{
                scale: [1, 1.1, 1.2, 0.8, 0],
                rotateZ: [0, -5, 5, -3, 0],
                opacity: [1, 1, 1, 0.8, 0],
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-48 h-72 rounded-2xl border-2 flex items-center justify-center"
              style={{
                backgroundColor: pack.color + "15",
                borderColor: pack.color,
                boxShadow: `0 0 60px ${pack.glowColor}`,
              }}
            >
              <Package size={48} style={{ color: pack.color }} />
            </motion.div>
            {/* Particle burst */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute w-64 h-64 rounded-full"
              style={{ boxShadow: `0 0 100px 50px ${pack.glowColor}` }}
            />
          </motion.div>
        )}

        {/* ═══ CARD REVEAL ═══ */}
        {phase === "revealing" && currentCard && (
          <motion.div
            key={`reveal-${revealIndex}`}
            initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-6 cursor-pointer"
            onClick={handleRevealNext}
          >
            {/* High rarity background glow */}
            {isHighRarity && (
              <div
                className="absolute w-96 h-96 rounded-full opacity-30 animate-pulse"
                style={{ boxShadow: `0 0 120px 60px ${RARITY_COLORS[currentCard.rarity]?.glow || ""}` }}
              />
            )}

            {/* Card */}
            <div className={`w-56 h-80 rounded-2xl border-2 overflow-hidden ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow} transition-all`}>
              {/* Header: cost + rarity */}
              <div className="flex items-center justify-between px-3 pt-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-mono text-sm font-bold">
                  {currentCard.manaCost}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${rarityStyle.text}`}>
                  {currentCard.rarity}
                </span>
              </div>

              {/* Card image */}
              <div className="px-3 py-2">
                {currentCard.imageUrl ? (
                  <img src={currentCard.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <div className={`w-full h-32 rounded-lg ${rarityStyle.bg} flex items-center justify-center`}>
                    <span className="text-4xl font-display text-white/20">{currentCard.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="px-3">
                <p className="font-mono text-sm font-bold text-white truncate">{currentCard.name}</p>
                <p className="text-[10px] text-white/40 font-mono">{currentCard.cardType}</p>
              </div>

              {/* Stats */}
              {currentCard.cardType === "unit" && (
                <div className="flex gap-4 px-3 mt-2">
                  <span className="text-xs font-mono text-red-400">ATK {currentCard.attack}</span>
                  <span className="text-xs font-mono text-green-400">HP {currentCard.health}</span>
                </div>
              )}

              {/* Foil indicator */}
              {currentCard.isFoil && (
                <div className="absolute top-2 right-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                </div>
              )}

              {/* NEW badge */}
              {currentCard.isNew && (
                <div className="absolute top-12 right-3 px-2 py-0.5 rounded bg-cyan-500 text-black text-[9px] font-mono font-bold">
                  NEW
                </div>
              )}
            </div>

            {/* Card counter */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/30">{revealIndex + 1} / {cards.length}</span>
              <span className="font-mono text-[10px] text-white/20 animate-pulse">TAP FOR NEXT</span>
            </div>
          </motion.div>
        )}

        {/* ═══ SUMMARY ═══ */}
        {phase === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 max-w-lg w-full px-4"
          >
            <h2 className="font-display text-xl tracking-[0.2em] text-white">PACK OPENED</h2>

            {/* All revealed cards in a row */}
            <div className="flex gap-2 flex-wrap justify-center">
              {revealedCards.map((card, i) => {
                const rs = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-24 rounded-lg border p-2 ${rs.bg} ${rs.border}`}
                  >
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt="" className="w-full h-16 object-cover rounded mb-1" />
                    ) : (
                      <div className={`w-full h-16 rounded mb-1 ${rs.bg} flex items-center justify-center`}>
                        <span className="text-lg text-white/20">{card.name.charAt(0)}</span>
                      </div>
                    )}
                    <p className="text-[9px] font-mono text-white/80 truncate">{card.name}</p>
                    <p className={`text-[8px] font-mono ${rs.text}`}>{card.rarity}</p>
                    {card.isNew && <span className="text-[8px] text-cyan-400 font-mono">NEW!</span>}
                  </motion.div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-center">
              <div>
                <p className="font-mono text-lg font-bold text-white">{revealedCards.filter(c => c.isNew).length}</p>
                <p className="text-[10px] text-white/40 font-mono">NEW CARDS</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-amber-400">{revealedCards.filter(c => c.isFoil).length}</p>
                <p className="text-[10px] text-white/40 font-mono">FOILS</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-purple-400">
                  {revealedCards.filter(c => ["epic", "legendary", "mythic", "neyon"].includes(c.rarity)).length}
                </p>
                <p className="text-[10px] text-white/40 font-mono">RARE+</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { onComplete(); onClose(); }}
                className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-colors"
              >
                DONE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors">
        <X size={20} />
      </button>
    </div>
  );
}

export { PACK_TYPES, RARITY_COLORS, type PackCard, type PackType };
