import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import {
  Swords, Shield, Zap, Heart, Star, Crown, Flame,
  Sparkles, Eye, Skull, MapPin, Music, Users, Package,
  ChevronRight, Crosshair
} from "lucide-react";

interface CardData {
  id?: number;
  cardId: string;
  name: string;
  cardType: string;
  rarity: string;
  season?: string | null;
  power: number;
  health: number;
  cost: number;
  abilityText?: string | null;
  flavorText?: string | null;
  imageUrl?: string | null;
  element?: string | null;
  alignment?: string | null;
  characterClass?: string | null;
  faction?: string | null;
  species?: string | null;
  dimension?: string | null;
  keywords?: string[] | null;
}

interface GameCardProps {
  card: CardData;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  isSelected?: boolean;
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
  flipped?: boolean;
}

// ── Rarity Visual Config ──
const RARITY_CONFIG: Record<string, {
  border: string; glow: string; bg: string; text: string;
  badge: string; shimmerSpeed: string; holoIntensity: number;
  borderGradient: string;
}> = {
  common: {
    border: "border-zinc-600/40", glow: "", bg: "bg-zinc-800/30",
    text: "text-zinc-400", badge: "bg-zinc-700 text-zinc-300",
    shimmerSpeed: "0s", holoIntensity: 0,
    borderGradient: "from-zinc-600/40 via-zinc-500/20 to-zinc-600/40",
  },
  uncommon: {
    border: "border-green-500/40", glow: "shadow-[0_0_10px_rgba(34,197,94,0.15)]",
    bg: "bg-green-950/20", text: "text-green-400", badge: "bg-green-900/60 text-green-300",
    shimmerSpeed: "0s", holoIntensity: 0,
    borderGradient: "from-green-600/40 via-green-400/30 to-green-600/40",
  },
  rare: {
    border: "border-blue-500/40", glow: "shadow-[0_0_14px_rgba(59,130,246,0.2)]",
    bg: "bg-blue-950/20", text: "text-blue-400", badge: "bg-blue-900/60 text-blue-300",
    shimmerSpeed: "4s", holoIntensity: 0.08,
    borderGradient: "from-blue-600/50 via-blue-400/40 to-blue-600/50",
  },
  epic: {
    border: "border-purple-500/50", glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    bg: "bg-purple-950/20", text: "text-purple-400", badge: "bg-purple-900/60 text-purple-300",
    shimmerSpeed: "3s", holoIntensity: 0.15,
    borderGradient: "from-purple-600/60 via-purple-400/50 to-purple-600/60",
  },
  legendary: {
    border: "border-amber-500/60", glow: "shadow-[0_0_28px_rgba(245,158,11,0.35)]",
    bg: "bg-amber-950/20", text: "text-amber-400", badge: "bg-amber-900/60 text-amber-300",
    shimmerSpeed: "2s", holoIntensity: 0.25,
    borderGradient: "from-amber-500/70 via-yellow-400/60 to-amber-500/70",
  },
  mythic: {
    border: "border-red-500/60", glow: "shadow-[0_0_32px_rgba(239,68,68,0.4)]",
    bg: "bg-red-950/20", text: "text-red-400", badge: "bg-red-900/60 text-red-300",
    shimmerSpeed: "1.5s", holoIntensity: 0.35,
    borderGradient: "from-red-500/70 via-orange-400/60 to-red-500/70",
  },
  neyon: {
    border: "border-cyan-400/70", glow: "shadow-[0_0_40px_rgba(34,211,238,0.5)]",
    bg: "bg-cyan-950/25", text: "text-cyan-300", badge: "bg-cyan-900/60 text-cyan-200",
    shimmerSpeed: "1s", holoIntensity: 0.45,
    borderGradient: "from-cyan-400/80 via-teal-300/70 to-cyan-400/80",
  },
};

const TYPE_ICONS: Record<string, any> = {
  character: Users, action: Zap, combat: Swords, reaction: Shield,
  event: Flame, item: Package, location: MapPin, master: Crown,
  political: Eye, song: Music,
};

const ELEMENT_CONFIG: Record<string, { color: string; icon: string; particle: string; bgGlow: string }> = {
  earth: { color: "text-emerald-400", icon: "🜃", particle: "bg-emerald-400", bgGlow: "from-emerald-900/20" },
  fire: { color: "text-orange-400", icon: "🜂", particle: "bg-orange-400", bgGlow: "from-orange-900/20" },
  water: { color: "text-blue-400", icon: "🜄", particle: "bg-blue-400", bgGlow: "from-blue-900/20" },
  air: { color: "text-sky-300", icon: "🜁", particle: "bg-sky-300", bgGlow: "from-sky-900/20" },
};

const ALIGNMENT_CONFIG: Record<string, { glow: string; aura: string; symbol: string; label: string }> = {
  order: { glow: "shadow-[0_0_15px_rgba(147,197,253,0.2)]", aura: "from-blue-400/10 via-transparent to-transparent", symbol: "⚖", label: "ORDER" },
  chaos: { glow: "shadow-[0_0_15px_rgba(248,113,113,0.2)]", aura: "from-red-400/10 via-transparent to-transparent", symbol: "☢", label: "CHAOS" },
};

const KEYWORD_ICONS: Record<string, string> = {
  stealth: "👁", taunt: "🛡", drain: "🩸", pierce: "⚔",
  overcharge: "⚡", shield: "🔰", rally: "📯", resurrect: "♻",
  evolve: "🧬",
};

export default function GameCard({
  card,
  size = "md",
  onClick,
  isSelected = false,
  showDetails = false,
  animated = true,
  className = "",
  flipped = false,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const rarity = RARITY_CONFIG[card.rarity] ?? RARITY_CONFIG.common;
  const TypeIcon = TYPE_ICONS[card.cardType] ?? Sparkles;
  const element = card.element ? ELEMENT_CONFIG[card.element] : null;
  const alignment = card.alignment ? ALIGNMENT_CONFIG[card.alignment] : null;
  const isHighRarity = ["epic", "legendary", "mythic", "neyon"].includes(card.rarity);

  const sizeClasses = {
    sm: "w-28 h-40 sm:w-36 sm:h-52",
    md: "w-36 h-52 sm:w-48 sm:h-72",
    lg: "w-48 h-72 sm:w-64 sm:h-96",
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.04, y: -6 },
        whileTap: { scale: 0.97 },
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }
    : {};

  // 3D tilt based on mouse position
  const tiltX = isHovered ? (mousePos.y - 0.5) * -12 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 12 : 0;

  return (
    <Wrapper
      {...(wrapperProps as any)}
      ref={cardRef}
      className={`
        relative cursor-pointer select-none perspective-1000
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onMouseMove={handleMouseMove}
      style={{
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Card frame */}
      <div
        className={`
          relative w-full h-full rounded-lg overflow-hidden
          border-2 ${rarity.border} ${rarity.glow}
          ${isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
          transition-shadow duration-300
        `}
      >
        {/* Base background */}
        <div className={`absolute inset-0 ${rarity.bg}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-card/90 via-card/70 to-card/95" />

        {/* Alignment aura glow */}
        {alignment && (
          <div className={`absolute inset-0 bg-gradient-to-b ${alignment.aura} pointer-events-none`} />
        )}

        {/* Element background tint */}
        {element && (
          <div className={`absolute inset-0 bg-gradient-to-br ${element.bgGlow} to-transparent opacity-30 pointer-events-none`} />
        )}

        {/* Holographic rainbow effect for rare+ */}
        {isHighRarity && (
          <div
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? rarity.holoIntensity : rarity.holoIntensity * 0.3,
              background: `linear-gradient(
                ${135 + (mousePos.x - 0.5) * 60}deg,
                rgba(255,0,0,0.1) 0%,
                rgba(255,165,0,0.1) 15%,
                rgba(255,255,0,0.1) 30%,
                rgba(0,255,0,0.1) 45%,
                rgba(0,0,255,0.1) 60%,
                rgba(128,0,128,0.1) 75%,
                rgba(255,0,0,0.1) 100%
              )`,
            }}
          />
        )}

        {/* Animated shimmer for rare+ */}
        {rarity.shimmerSpeed !== "0s" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                animationDuration: rarity.shimmerSpeed,
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)",
              }}
            />
          </div>
        )}

        {/* Spotlight follow effect on hover */}
        {isHovered && animated && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              opacity: 0.15,
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        )}

        {/* Card content */}
        <div className="relative h-full flex flex-col p-2">
          {/* Top bar: Cost + Name + Type */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {/* Cost orb with element color */}
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center shrink-0
              ${element ? `bg-gradient-to-br ${element.bgGlow} to-primary/20` : "bg-primary/20"}
              border ${element ? "border-current" : "border-primary/40"}
              ${element?.color ?? ""}
            `}>
              <span className="font-display text-[11px] font-black text-primary drop-shadow-sm">{card.cost}</span>
            </div>
            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={`font-display text-[10px] font-bold tracking-wide truncate ${rarity.text}`}>
                {card.name}
              </p>
            </div>
            {/* Alignment symbol */}
            {alignment && (
              <span className={`text-xs ${card.alignment === "order" ? "text-blue-400" : "text-red-400"}`}>
                {alignment.symbol}
              </span>
            )}
          </div>

          {/* Card art area */}
          <div className="relative flex-1 rounded-md overflow-hidden mb-1.5 border border-border/30">
            {card.imageUrl ? (
              <>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
                  loading="lazy"
                />
                {/* Art overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </>
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${rarity.bg} relative`}>
                {/* Procedural art pattern based on card type */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id={`grid-${card.cardId}`} width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className={rarity.text} />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill={`url(#grid-${card.cardId})`} />
                    {/* Decorative circles */}
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className={rarity.text} opacity="0.3" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" className={rarity.text} opacity="0.2" />
                  </svg>
                </div>
                <TypeIcon size={size === "lg" ? 40 : size === "md" ? 28 : 20} className={`${rarity.text} opacity-50`} />
                {/* Element symbol overlay */}
                {element && (
                  <span className={`absolute bottom-2 right-2 text-2xl ${element.color} opacity-40`}>
                    {element.icon}
                  </span>
                )}
              </div>
            )}

            {/* Rarity badge */}
            <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${rarity.badge} backdrop-blur-sm`}>
              {card.rarity}
            </div>

            {/* Season badge */}
            {card.season && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm text-[8px] font-mono text-muted-foreground">
                S{card.season?.replace("Season ", "")}
              </div>
            )}

            {/* Type icon badge */}
            <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <TypeIcon size={10} className="text-muted-foreground" />
            </div>
          </div>

          {/* Type line with keywords */}
          <div className="flex items-center gap-1 mb-1">
            <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider truncate">
              {card.cardType}
              {card.species && card.species !== "unknown" && card.species !== "none" ? ` — ${card.species}` : ""}
            </span>
            {/* Keywords icons */}
            {card.keywords && card.keywords.length > 0 && (
              <div className="flex gap-0.5 ml-auto">
                {card.keywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="text-[8px]" title={kw}>
                    {KEYWORD_ICONS[kw] || "✦"}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ability text */}
          {card.abilityText && (
            <div className="flex-1 min-h-0 overflow-hidden mb-1">
              <p className="font-mono text-[8px] leading-tight text-foreground/70 line-clamp-3">
                {card.abilityText}
              </p>
            </div>
          )}

          {/* Flavor text on hover */}
          {isHovered && card.flavorText && showDetails && (
            <div className="absolute bottom-12 left-2 right-2 bg-background/90 backdrop-blur-sm rounded p-1.5 border border-border/30">
              <p className="font-mono text-[8px] italic text-muted-foreground line-clamp-2">
                "{card.flavorText}"
              </p>
            </div>
          )}

          {/* Bottom stats bar */}
          <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/20">
            <div className="flex items-center gap-2">
              {/* Power */}
              <div className="flex items-center gap-0.5">
                <Swords size={10} className="text-destructive" />
                <span className="font-display text-[10px] font-bold text-destructive">{card.power}</span>
              </div>
              {/* Health */}
              <div className="flex items-center gap-0.5">
                <Heart size={10} className="text-green-400" />
                <span className="font-display text-[10px] font-bold text-green-400">{card.health}</span>
              </div>
            </div>
            {/* Element */}
            {element && (
              <span className={`text-sm ${element.color}`}>
                {element.icon}
              </span>
            )}
            {/* Class */}
            {card.characterClass && card.characterClass !== "none" && (
              <span className="font-mono text-[8px] text-accent/70 uppercase">
                {card.characterClass}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Outer glow pulse for legendary+ */}
      {isHighRarity && (
        <div
          className={`absolute -inset-1 rounded-xl pointer-events-none ${rarity.glow} animate-pulse-slow`}
          style={{ opacity: isHovered ? 0.6 : 0.2 }}
        />
      )}
    </Wrapper>
  );
}
