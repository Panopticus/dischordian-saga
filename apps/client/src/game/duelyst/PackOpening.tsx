/* ═══════════════════════════════════════════════════════
   PACK OPENING — Pokemon TCG Pocket-style card reveal ceremony
   The dopamine loop that drives collection and monetization.

   Flow: Pack Selection → Pack Rip → Card Reveals → Summary
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, ChevronRight, Star, X, Gem } from "lucide-react";
import { CARD_VARIANTS, type CardVariant } from "../cardGameDepth";

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
  /** Visual variant (holographic, full art, animated, etc.) */
  variant?: CardVariant;
  /** If duplicate, converts to this many shards */
  shardValue?: number;
  isDuplicate?: boolean;
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
  common:    { bg: "void-bg-canvas", border: "void-border", text: "void-text", glow: "" },
  uncommon:  { bg: "void-bg-success", border: "void-border-success", text: "void-text-energy", glow: "" },
  rare:      { bg: "void-bg-sunk", border: "void-border", text: "void-text-energy", glow: "shadow-[0_0_20px_color-mix(in oklch, var(--electric-blue) 30%, transparent)]" },
  epic:      { bg: "void-bg-system", border: "void-border-system", text: "void-text-system", glow: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-system) 40%, transparent)]" },
  legendary: { bg: "void-bg-sunk", border: "void-border", text: "void-text-accent", glow: "shadow-[0_0_40px_color-mix(in oklch, var(--energy-accent) 50%, transparent)]" },
  mythic:    { bg: "void-bg-error", border: "void-border-error", text: "void-text-error", glow: "shadow-[0_0_50px_color-mix(in oklch, var(--energy-error) 60%, transparent)]" },
  neyon:     { bg: "void-bg-success", border: "void-border-success", text: "void-text-energy", glow: "shadow-[0_0_60px_color-mix(in oklch, var(--energy-primary) 70%, transparent)]" },
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
                <span className="w-8 h-8 flex items-center justify-center rounded-full void-bg-sunk void-text-energy font-mono text-sm font-bold">
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
                  <span className="text-xs font-mono void-text-error">ATK {currentCard.attack}</span>
                  <span className="text-xs font-mono void-text-energy">HP {currentCard.health}</span>
                </div>
              )}

              {/* Variant indicator */}
              {(currentCard.isFoil || (currentCard.variant && currentCard.variant !== "standard")) && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {currentCard.variant === "holographic" && <Sparkles size={14} className="void-text-energy" />}
                  {currentCard.variant === "animated" && <Sparkles size={14} className="void-text-system animate-pulse" />}
                  {currentCard.variant === "golden" && <Star size={14} className="void-text-accent fill-amber-400" />}
                  {currentCard.variant === "void_touched" && <Gem size={14} className="void-text-energy" />}
                  {currentCard.variant === "signature" && <Star size={14} className="void-text-error fill-red-400" />}
                  {currentCard.isFoil && !currentCard.variant && <Star size={14} className="void-text-accent fill-amber-400" />}
                </div>
              )}
              {/* Variant label */}
              {currentCard.variant && currentCard.variant !== "standard" && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                  <span className="font-mono text-[7px] void-text-accent tracking-wider">{currentCard.variant.replace(/_/g, " ").toUpperCase()}</span>
                </div>
              )}

              {/* NEW badge */}
              {currentCard.isNew && (
                <div className="absolute top-12 right-3 px-2 py-0.5 rounded void-bg-success text-black text-[9px] font-mono font-bold">
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
                    {card.variant && card.variant !== "standard" && (
                      <span className="text-[7px] void-text-accent font-mono">✦ {card.variant.replace(/_/g, " ")}</span>
                    )}
                    {card.isNew && <span className="text-[8px] void-text-energy font-mono">NEW!</span>}
                    {card.isDuplicate && card.shardValue && (
                      <span className="text-[7px] void-text-system font-mono flex items-center gap-0.5">
                        <Gem size={7} /> +{card.shardValue} shards
                      </span>
                    )}
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
                <p className="font-mono text-lg font-bold void-text-accent">{revealedCards.filter(c => c.isFoil).length}</p>
                <p className="text-[10px] text-white/40 font-mono">FOILS</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold void-text-system">
                  {revealedCards.filter(c => ["epic", "legendary", "mythic", "neyon"].includes(c.rarity)).length}
                </p>
                <p className="text-[10px] text-white/40 font-mono">RARE+</p>
              </div>
              {revealedCards.some(c => c.variant && c.variant !== "standard") && (
                <div>
                  <p className="font-mono text-lg font-bold void-text-energy">
                    {revealedCards.filter(c => c.variant && c.variant !== "standard").length}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono">VARIANTS</p>
                </div>
              )}
              {revealedCards.some(c => c.isDuplicate && c.shardValue) && (
                <div>
                  <p className="font-mono text-lg font-bold void-text-system">
                    {revealedCards.reduce((sum, c) => sum + (c.isDuplicate && c.shardValue ? c.shardValue : 0), 0)}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono">SHARDS</p>
                </div>
              )}
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
