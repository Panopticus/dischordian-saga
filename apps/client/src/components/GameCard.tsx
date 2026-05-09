import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import {
  Swords, Shield, Zap, Heart, Star, Crown, Flame,
  Sparkles, Eye, Skull, MapPin, Music, Users, Package,
  ChevronRight, Crosshair
} from "lucide-react";

import { assetUrl } from "@/lib/assetUrl";
import { LockedCardBadge } from "@/components/LockedCardBadge";
import { KeywordTooltip } from "@/components/KeywordTooltip";
import type { CardUnlockCondition } from "@shared/tcg-core/types/Card";
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
  /** H5 — when set, surfaces the unlock-path chip on the card.
   *  Typed loosely so server-projected JSON values (which arrive as
   *  Record<string, unknown> through tRPC's superjson when the
   *  source is a JSON column) are accepted. The runtime cast at the
   *  render site relies on the engine schema's strictness — the
   *  Zod `cardUnlockConditionSchema` rejects malformed kinds at
   *  load time. */
  unlockCondition?: CardUnlockCondition | Record<string, unknown> | null;
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
    border: "void-border", glow: "", bg: "void-bg-canvas",
    text: "void-text", badge: "void-bg-canvas void-text",
    shimmerSpeed: "0s", holoIntensity: 0,
    borderGradient: "from-zinc-600/40 via-zinc-500/20 to-zinc-600/40",
  },
  uncommon: {
    border: "void-border-success", glow: "shadow-[0_0_10px_color-mix(in oklch, var(--energy-success) 15%, transparent)]",
    bg: "void-bg-success", text: "void-text-energy", badge: "void-bg-success void-text-energy",
    shimmerSpeed: "0s", holoIntensity: 0,
    borderGradient: "from-green-600/40 via-green-400/30 to-green-600/40",
  },
  rare: {
    border: "void-border", glow: "shadow-[0_0_14px_color-mix(in oklch, var(--electric-blue) 20%, transparent)]",
    bg: "void-bg-sunk", text: "void-text-energy", badge: "void-bg-sunk void-text-energy",
    shimmerSpeed: "4s", holoIntensity: 0.08,
    borderGradient: "from-blue-600/50 via-blue-400/40 to-blue-600/50",
  },
  epic: {
    border: "void-border-system", glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-system) 25%, transparent)]",
    bg: "void-bg-system", text: "void-text-system", badge: "void-bg-system void-text-system",
    shimmerSpeed: "3s", holoIntensity: 0.15,
    borderGradient: "from-purple-600/60 via-purple-400/50 to-purple-600/60",
  },
  legendary: {
    border: "void-border", glow: "shadow-[0_0_28px_color-mix(in oklch, var(--energy-accent) 35%, transparent)]",
    bg: "void-bg-sunk", text: "void-text-accent", badge: "void-bg-sunk void-text-accent",
    shimmerSpeed: "2s", holoIntensity: 0.25,
    borderGradient: "from-amber-500/70 via-yellow-400/60 to-amber-500/70",
  },
  mythic: {
    border: "void-border-error", glow: "shadow-[0_0_32px_color-mix(in oklch, var(--energy-error) 40%, transparent)]",
    bg: "void-bg-error", text: "void-text-error", badge: "void-bg-error void-text-error",
    shimmerSpeed: "1.5s", holoIntensity: 0.35,
    borderGradient: "from-red-500/70 via-orange-400/60 to-red-500/70",
  },
  neyon: {
    border: "void-border-success", glow: "shadow-[0_0_40px_color-mix(in oklch, var(--energy-primary) 50%, transparent)]",
    bg: "void-bg-success", text: "void-text-energy", badge: "void-bg-success void-text-energy",
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
  earth: { color: "void-text-energy", icon: "🜃", particle: "void-bg-success", bgGlow: "from-emerald-900/20" },
  fire: { color: "void-text-premium", icon: "🜂", particle: "void-bg-sunk", bgGlow: "from-orange-900/20" },
  water: { color: "void-text-energy", icon: "🜄", particle: "void-bg-sunk", bgGlow: "from-blue-900/20" },
  air: { color: "void-text-energy", icon: "🜁", particle: "void-bg-sunk", bgGlow: "from-sky-900/20" },
};

const ALIGNMENT_CONFIG: Record<string, { glow: string; aura: string; symbol: string; label: string }> = {
  order: { glow: "shadow-[0_0_15px_rgba(147,197,253,0.2)]", aura: "from-blue-400/10 via-transparent to-transparent", symbol: "⚖", label: "ORDER" },
  chaos: { glow: "shadow-[0_0_15px_color-mix(in oklch, var(--energy-error) 20%, transparent)]", aura: "from-red-400/10 via-transparent to-transparent", symbol: "☢", label: "CHAOS" },
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
      {/* ── CARD BACK (flipped state) ── */}
      {flipped ? (
        <div className="relative w-full h-full rounded-lg overflow-hidden border-2 void-border shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <img
            src={assetUrl("art/card-game/card-back-dischordia.png")}
            alt="Card Back"
            className="w-full h-full object-cover"
          />
          {/* Subtle animated sheen */}
          <div
            className="absolute inset-0 pointer-events-none card-back-sheen"
            style={{
              background: "linear-gradient(105deg, transparent 40%, color-mix(in oklch, var(--text-primary) 6%, transparent) 45%, color-mix(in oklch, var(--text-primary) 12%, transparent) 50%, color-mix(in oklch, var(--text-primary) 6%, transparent) 55%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
          {/* Energy border pulse */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none card-back-pulse"
            style={{ boxShadow: "inset 0 0 20px rgba(99,102,241,0.15)" }}
          />
          <style>{`
            @keyframes card-sheen-sweep {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes card-border-pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.8; }
            }
            .card-back-sheen { animation: card-sheen-sweep 4s ease-in-out infinite; }
            .card-back-pulse { animation: card-border-pulse 3s ease-in-out infinite; }
          `}</style>
        </div>
      ) : (
      /* ── CARD FRONT ── */
      <>
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
                background: "linear-gradient(105deg, transparent 40%, color-mix(in oklch, var(--text-primary) 6%, transparent) 45%, color-mix(in oklch, var(--text-primary) 12%, transparent) 50%, color-mix(in oklch, var(--text-primary) 6%, transparent) 55%, transparent 60%)",
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
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, color-mix(in oklch, var(--text-primary) 30%, transparent) 0%, transparent 50%)`,
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
              <span className={`text-xs ${card.alignment === "order" ? "void-text-energy" : "void-text-error"}`}>
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
                  // audit/16 PR 21 (TCG3) — keyword interaction tooltip.
                  // On hover, surfaces the rule + any live cross-keyword
                  // interactions on this card.
                  <KeywordTooltip key={kw} keyword={kw} cardKeywords={card.keywords ?? []}>
                    <span
                      className="text-[8px] cursor-help"
                      data-testid={`keyword-chip-${kw}`}
                    >
                      {KEYWORD_ICONS[kw] || "✦"}
                    </span>
                  </KeywordTooltip>
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

          {/* H5 — unlock-condition chip. Mounted in the top-right
              corner so it's visible at every card size without
              colliding with the cost / type / rarity badges along
              the top-left + bottom edges. */}
          {card.unlockCondition && (
            <div className="absolute top-1 right-1 pointer-events-none">
              <LockedCardBadge
                condition={card.unlockCondition as CardUnlockCondition}
                className="bg-background/85 backdrop-blur-sm border-border/40 text-foreground"
              />
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
                <Heart size={10} className="void-text-energy" />
                <span className="font-display text-[10px] font-bold void-text-energy">{card.health}</span>
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
      </>
      )}
    </Wrapper>
  );
}
