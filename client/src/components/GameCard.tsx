import { motion } from "framer-motion";
import { useState } from "react";
import {
  Swords, Shield, Zap, Heart, Star, Crown, Flame,
  Sparkles, Eye, Skull, MapPin, Music, Users, Package,
  ChevronRight
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
}

interface GameCardProps {
  card: CardData;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  isSelected?: boolean;
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

const RARITY_COLORS: Record<string, { border: string; glow: string; bg: string; text: string; badge: string }> = {
  common: { border: "border-zinc-600/40", glow: "", bg: "bg-zinc-800/20", text: "text-zinc-400", badge: "bg-zinc-700 text-zinc-300" },
  uncommon: { border: "border-green-500/40", glow: "shadow-[0_0_8px_rgba(34,197,94,0.15)]", bg: "bg-green-900/10", text: "text-green-400", badge: "bg-green-900/60 text-green-300" },
  rare: { border: "border-blue-500/40", glow: "shadow-[0_0_12px_rgba(59,130,246,0.2)]", bg: "bg-blue-900/10", text: "text-blue-400", badge: "bg-blue-900/60 text-blue-300" },
  epic: { border: "border-purple-500/50", glow: "shadow-[0_0_16px_rgba(168,85,247,0.25)]", bg: "bg-purple-900/15", text: "text-purple-400", badge: "bg-purple-900/60 text-purple-300" },
  legendary: { border: "border-amber-500/60", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]", bg: "bg-amber-900/15", text: "text-amber-400", badge: "bg-amber-900/60 text-amber-300" },
  mythic: { border: "border-red-500/60", glow: "shadow-[0_0_24px_rgba(239,68,68,0.35)]", bg: "bg-red-900/15", text: "text-red-400", badge: "bg-red-900/60 text-red-300" },
  neyon: { border: "border-cyan-400/70", glow: "shadow-[0_0_30px_rgba(34,211,238,0.4)]", bg: "bg-cyan-900/20", text: "text-cyan-300", badge: "bg-cyan-900/60 text-cyan-200" },
};

const TYPE_ICONS: Record<string, any> = {
  character: Users,
  action: Zap,
  combat: Swords,
  reaction: Shield,
  event: Flame,
  item: Package,
  location: MapPin,
  master: Crown,
  political: Eye,
  song: Music,
};

const ELEMENT_COLORS: Record<string, string> = {
  earth: "text-emerald-400",
  fire: "text-orange-400",
  water: "text-blue-400",
  air: "text-sky-300",
};

const ELEMENT_ICONS: Record<string, string> = {
  earth: "🜃",
  fire: "🜂",
  water: "🜄",
  air: "🜁",
};

export default function GameCard({
  card,
  size = "md",
  onClick,
  isSelected = false,
  showDetails = false,
  animated = true,
  className = "",
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rarity = RARITY_COLORS[card.rarity] ?? RARITY_COLORS.common;
  const TypeIcon = TYPE_ICONS[card.cardType] ?? Sparkles;

  const sizeClasses = {
    sm: "w-36 h-52",
    md: "w-48 h-72",
    lg: "w-64 h-96",
  };

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.03, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={`
        relative cursor-pointer select-none
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card frame */}
      <div
        className={`
          relative w-full h-full rounded-lg overflow-hidden
          border-2 ${rarity.border} ${rarity.glow}
          ${isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
          transition-all duration-300
        `}
      >
        {/* Background gradient based on rarity */}
        <div className={`absolute inset-0 ${rarity.bg}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-card/90 via-card/70 to-card/95" />

        {/* Animated rarity shimmer for epic+ */}
        {["epic", "legendary", "mythic", "neyon"].includes(card.rarity) && (
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
              style={{ animationDuration: card.rarity === "neyon" ? "1.5s" : "3s" }}
            />
          </div>
        )}

        {/* Card content */}
        <div className="relative h-full flex flex-col p-2">
          {/* Top bar: Cost + Name + Type */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {/* Cost orb */}
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <span className="font-display text-[10px] font-bold text-primary">{card.cost}</span>
            </div>
            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={`font-display text-[10px] font-bold tracking-wide truncate ${rarity.text}`}>
                {card.name}
              </p>
            </div>
            {/* Type icon */}
            <TypeIcon size={12} className="text-muted-foreground shrink-0" />
          </div>

          {/* Card art area */}
          <div className="relative flex-1 rounded-md overflow-hidden mb-1.5 border border-border/30">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${rarity.bg}`}>
                <TypeIcon size={size === "lg" ? 40 : size === "md" ? 28 : 20} className={`${rarity.text} opacity-40`} />
                {/* Element symbol */}
                {card.element && (
                  <span className={`absolute bottom-1 right-1 text-lg ${ELEMENT_COLORS[card.element] ?? "text-muted-foreground"}`}>
                    {ELEMENT_ICONS[card.element] ?? ""}
                  </span>
                )}
              </div>
            )}
            {/* Rarity badge */}
            <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${rarity.badge}`}>
              {card.rarity}
            </div>
            {/* Season badge */}
            {card.season && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[8px] font-mono text-muted-foreground">
                S{card.season?.replace("Season ", "")}
              </div>
            )}
          </div>

          {/* Type line */}
          <div className="flex items-center gap-1 mb-1">
            <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
              {card.cardType}
              {card.species && card.species !== "none" ? ` — ${card.species}` : ""}
            </span>
            {card.alignment && (
              <span className={`font-mono text-[8px] ml-auto ${card.alignment === "order" ? "text-blue-400" : "text-red-400"}`}>
                {card.alignment === "order" ? "⚖" : "☢"}
              </span>
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

          {/* Bottom stats bar */}
          <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Swords size={10} className="text-destructive" />
                <span className="font-display text-[10px] font-bold text-destructive">{card.power}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Heart size={10} className="text-green-400" />
                <span className="font-display text-[10px] font-bold text-green-400">{card.health}</span>
              </div>
            </div>
            {card.element && (
              <span className={`text-xs ${ELEMENT_COLORS[card.element] ?? ""}`}>
                {ELEMENT_ICONS[card.element] ?? ""}
              </span>
            )}
            {card.characterClass && card.characterClass !== "none" && (
              <span className="font-mono text-[8px] text-accent/70 uppercase">
                {card.characterClass}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      {isHovered && animated && (
        <div className={`absolute inset-0 rounded-lg pointer-events-none ${rarity.glow} opacity-50`} />
      )}
    </Wrapper>
  );
}

// CSS for shimmer animation (add to index.css)
// @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
// .animate-shimmer { animation: shimmer 3s infinite; }
