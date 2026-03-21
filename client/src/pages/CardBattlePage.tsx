/* ═══════════════════════════════════════════════════════
   CARD BATTLE PAGE — AAA-quality turn-based card combat
   Holographic cards, particle systems, attack animations,
   screen shake, floating damage, dynamic board lighting
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Shield, Heart, Zap, Star, RotateCcw, X,
  ChevronRight, Skull, Trophy, Target, Flame, Sparkles,
  Eye, Crown, Volume2, VolumeX
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/contexts/SoundContext";
import { useGamification } from "@/contexts/GamificationContext";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import {
  initBattle, processBattleAction, getAvailableEnemies, getEnemyName,
  type BattleState, type BattleCard, type BattlePlayer,
} from "@/lib/cardBattle";
import { useLocation } from "wouter";
import {
  AmbientParticles, FloatingNumbers, ScreenFlash, TurnBanner,
  useVFX, type FloatingText, type ScreenEffect,
  AttackProjectile, DeployBurst, ComboChainCounter,
} from "@/components/BattleVFX";
import LandscapeEnforcer from "@/components/LandscapeEnforcer";
import {
  EnergyFieldOverlay, FactionBanners, WeatherEffects,
  DynamicBoardLighting, GraveyardSouls, ComboCounter,
} from "@/components/BoardEffects";

/* ─── ELEMENT COLORS ─── */
const ELEMENT_COLORS: Record<string, string> = {
  fire: "#f97316", water: "#3b82f6", earth: "#22c55e", air: "#38bdf8",
  void: "#a855f7", light: "#fbbf24", dark: "#ef4444",
};

const RARITY_GLOW: Record<string, { border: string; shadow: string; animClass: string }> = {
  common: { border: "rgba(161,161,170,0.25)", shadow: "none", animClass: "" },
  uncommon: { border: "rgba(74,222,128,0.35)", shadow: "0 0 8px rgba(74,222,128,0.15)", animClass: "" },
  rare: { border: "rgba(96,165,250,0.45)", shadow: "0 0 14px rgba(96,165,250,0.2)", animClass: "" },
  legendary: { border: "rgba(251,191,36,0.6)", shadow: "0 0 20px rgba(251,191,36,0.3)", animClass: "animate-legendary-border" },
};

/* ─── BATTLE CARD (AAA version) ─── */
function BattleCardView({
  card,
  onClick,
  selected,
  targetable,
  disabled,
  small,
  isPlayable,
  animClass,
}: {
  card: BattleCard;
  onClick?: () => void;
  selected?: boolean;
  targetable?: boolean;
  disabled?: boolean;
  small?: boolean;
  isPlayable?: boolean;
  animClass?: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rarity = RARITY_GLOW[card.rarity] || RARITY_GLOW.common;
  const TypeIcon = card.type === "unit" ? Swords : card.type === "spell" ? Zap : Shield;
  const hpPercent = card.defense > 0 ? (card.currentHP / card.defense) * 100 : 100;
  const isDamaged = card.currentHP < card.defense;
  const isDead = card.currentHP <= 0;
  const isLegendary = card.rarity === "legendary";
  const isRare = card.rarity === "rare" || isLegendary;
  const elementColor = card.element ? ELEMENT_COLORS[card.element] || "#33e2e6" : "#33e2e6";

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // 3D tilt
  const tiltX = isHovered ? (mousePos.y - 0.5) * -10 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 10 : 0;

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onMouseMove={handleMouseMove}
      whileHover={!disabled ? { scale: 1.08, y: -8, zIndex: 20 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      className={`
        relative cursor-pointer select-none perspective-1000
        ${small ? "w-[72px] h-[104px] sm:w-[88px] sm:h-[128px]" : "w-[88px] h-[128px] sm:w-[108px] sm:h-[156px]"}
        ${animClass || ""}
        ${isDead ? "opacity-20 grayscale pointer-events-none" : ""}
        ${disabled && !isDead ? "opacity-50" : ""}
      `}
      style={{
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Outer glow for selected/targetable/playable */}
      {(selected || targetable || isPlayable) && (
        <div
          className={`absolute -inset-1 rounded-xl pointer-events-none ${
            selected ? "" : targetable ? "animate-pulse" : "animate-playable-glow"
          }`}
          style={{
            boxShadow: selected
              ? "0 0 20px rgba(51,226,230,0.4), 0 0 40px rgba(51,226,230,0.15)"
              : targetable
              ? "0 0 16px rgba(239,68,68,0.3), 0 0 32px rgba(239,68,68,0.1)"
              : undefined,
            borderRadius: "12px",
          }}
        />
      )}

      {/* Card frame */}
      <div
        className={`
          relative w-full h-full rounded-lg overflow-hidden
          ${rarity.animClass}
          transition-all duration-300
        `}
        style={{
          border: `1.5px solid ${selected ? "rgba(51,226,230,0.7)" : targetable ? "rgba(239,68,68,0.6)" : rarity.border}`,
          boxShadow: selected
            ? "0 0 20px rgba(51,226,230,0.3), inset 0 0 15px rgba(51,226,230,0.05)"
            : targetable
            ? "0 0 15px rgba(239,68,68,0.2)"
            : rarity.shadow,
          background: "linear-gradient(180deg, rgba(12,12,35,0.97) 0%, rgba(5,5,18,0.99) 100%)",
        }}
      >
        {/* Holographic rainbow overlay for rare+ */}
        {isRare && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              opacity: isHovered ? 0.2 : 0.06,
              background: `linear-gradient(
                ${130 + (mousePos.x - 0.5) * 80}deg,
                rgba(255,0,0,0.15) 0%,
                rgba(255,200,0,0.15) 20%,
                rgba(0,255,100,0.15) 40%,
                rgba(0,100,255,0.15) 60%,
                rgba(150,0,255,0.15) 80%,
                rgba(255,0,100,0.15) 100%
              )`,
              transition: "opacity 0.3s",
            }}
          />
        )}

        {/* Shimmer sweep for rare+ */}
        {isRare && <div className="absolute inset-0 pointer-events-none z-10 animate-holo-shine" />}

        {/* Spotlight follow */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              opacity: 0.12,
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.35) 0%, transparent 45%)`,
            }}
          />
        )}

        {/* Card content */}
        <div className="relative h-full flex flex-col z-20">
          {/* Top: Cost orb + Name */}
          <div className="flex items-center gap-1 px-1.5 pt-1.5">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 relative"
              style={{
                background: `radial-gradient(circle, ${elementColor}33 0%, rgba(0,0,0,0.5) 100%)`,
                border: `1px solid ${elementColor}55`,
                boxShadow: `0 0 6px ${elementColor}33`,
              }}
            >
              <span className="font-display text-[9px] sm:text-[10px] font-black text-blue-300">{card.cost}</span>
            </div>
            <p className="font-display text-[8px] sm:text-[9px] font-bold tracking-wide text-foreground truncate flex-1">
              {card.name}
            </p>
          </div>

          {/* Card art area */}
          <div className="relative flex-1 mx-1.5 mt-1 rounded overflow-hidden" style={{ minHeight: 0 }}>
            {card.imageUrl ? (
              <>
                <img
                  src={card.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    filter: isDamaged ? "saturate(0.7) brightness(0.8)" : undefined,
                    transition: "filter 0.3s",
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${elementColor}15 0%, rgba(0,0,0,0.4) 100%)`,
                }}
              >
                <TypeIcon size={small ? 16 : 20} className="text-muted-foreground/40" />
              </div>
            )}

            {/* HP bar overlay */}
            {card.type === "unit" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/70">
                <motion.div
                  className="h-full"
                  style={{
                    background: hpPercent > 50
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : hpPercent > 25
                      ? "linear-gradient(90deg, #eab308, #facc15)"
                      : "linear-gradient(90deg, #dc2626, #ef4444)",
                  }}
                  animate={{ width: `${Math.max(0, hpPercent)}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Rarity gem */}
            <div
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{
                background: isLegendary ? "#fbbf24" : card.rarity === "rare" ? "#60a5fa" : card.rarity === "uncommon" ? "#4ade80" : "#71717a",
                boxShadow: isLegendary ? "0 0 6px #fbbf24" : card.rarity === "rare" ? "0 0 4px #60a5fa" : "none",
              }}
            />
          </div>

          {/* Ability text (truncated) */}
          {card.ability && (
            <div className="px-1.5 mt-0.5">
              <p className="font-mono text-[8px] sm:text-[8px] text-muted-foreground/70 line-clamp-2 leading-tight">
                {card.ability}
              </p>
            </div>
          )}

          {/* Bottom stats */}
          <div className="flex items-center justify-between px-1.5 pb-1 mt-auto">
            {card.type === "unit" ? (
              <>
                <div className="flex items-center gap-0.5">
                  <Swords size={8} className="text-red-400" />
                  <span className={`font-display text-[9px] sm:text-[10px] font-black ${
                    card.tempAttackMod > 0 ? "text-green-400" : card.tempAttackMod < 0 ? "text-red-300" : "text-red-400"
                  }`}>
                    {card.attack + card.tempAttackMod}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Heart size={8} className={isDamaged ? "text-yellow-400" : "text-green-400"} />
                  <span className={`font-display text-[9px] sm:text-[10px] font-black ${isDamaged ? "text-yellow-400" : "text-green-400"}`}>
                    {card.currentHP}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 mx-auto">
                <TypeIcon size={8} className="text-muted-foreground/50" />
                <span className="font-mono text-[7px] text-muted-foreground/50 uppercase">{card.type}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── ENERGY CRYSTALS ─── */
function EnergyCrystals({ current, max, color }: { current: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <motion.div
          key={i}
          className="relative"
          animate={i < current ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <div
            className={`w-3.5 h-4 sm:w-4 sm:h-5 rounded-sm ${i < current ? "" : "opacity-20"}`}
            style={{
              background: i < current
                ? `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${i < current ? color : "rgba(255,255,255,0.1)"}`,
              boxShadow: i < current ? `0 0 6px ${color}44` : "none",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── HP BAR (AAA version) ─── */
function HPBar({ current, max, label, color, isPlayer }: {
  current: number; max: number; label: string; color: string; isPlayer?: boolean;
}) {
  const pct = Math.max(0, (current / max) * 100);
  const isLow = pct < 25;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`p-1 rounded ${isLow ? "animate-pulse" : ""}`}>
        <Heart size={14} style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-0.5">
          <span className="font-display text-[10px] sm:text-xs tracking-wider text-muted-foreground/90">{label}</span>
          <span className="font-mono text-[10px] sm:text-xs font-bold" style={{ color }}>
            {current}/{max}
          </span>
        </div>
        <div className="h-2 sm:h-2.5 rounded-full overflow-hidden relative"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              boxShadow: `0 0 8px ${color}44`,
            }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Shine on HP bar */}
            <div className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }}
            />
          </motion.div>
          {/* Low HP danger pulse */}
          {isLow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ background: "#ef4444" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── BATTLE LOG (styled) ─── */
function BattleLog({ logs }: { logs: BattleState["logs"] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs.length]);

  return (
    <div
      ref={scrollRef}
      className="h-20 sm:h-24 overflow-y-auto rounded-lg p-2 no-scrollbar"
      style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(51,226,230,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      <AnimatePresence>
        {logs.slice(-12).map((log, i) => (
          <motion.p
            key={`${log.timestamp}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-mono text-[8px] sm:text-[9px] leading-relaxed ${
              log.actor === "system" ? "text-muted-foreground/40 italic" :
              log.actor === "player" ? "text-cyan-400/60" :
              "text-red-400/60"
            }`}
          >
            <span className="text-muted-foreground/25 mr-1">▸</span>
            {log.message}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── ENEMY SELECT (cinematic) ─── */
function EnemySelect({ onSelect }: { onSelect: (enemyId: string, diff: "easy" | "normal" | "hard") => void }) {
  const enemies = getAvailableEnemies();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030308 0%, #0a0a2e 50%, #050510 100%)" }}
    >
      <AmbientParticles count={30} color="rgba(239,68,68,0.2)" />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Swords size={36} className="text-red-400/50 mx-auto mb-3" />
          </motion.div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-[0.3em] text-white mb-2">
            COMBAT <span className="text-red-400">ARENA</span>
          </h1>
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground/50 tracking-wider">
            Choose your opponent, Operative.
          </p>
        </div>

        <div className="space-y-3">
          {enemies.map((enemy, i) => (
            <motion.button
              key={enemy.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", damping: 20 }}
              onClick={() => onSelect(enemy.id, enemy.difficulty.toLowerCase() as any)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="w-full text-left rounded-lg p-4 sm:p-5 transition-all group relative overflow-hidden"
              style={{
                background: hoveredIdx === i
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(12,12,35,0.8)",
                border: `1px solid ${hoveredIdx === i ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"}`,
                boxShadow: hoveredIdx === i ? "0 0 30px rgba(239,68,68,0.08)" : "none",
              }}
            >
              {/* Hover shimmer */}
              {hoveredIdx === i && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.05), transparent)",
                  }}
                />
              )}

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="font-display text-sm sm:text-base tracking-wider text-white group-hover:text-red-400 transition-colors">
                    {enemy.name}
                  </h3>
                  <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/40 mt-0.5">{enemy.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full ${
                    enemy.difficulty === "Easy" ? "bg-green-400/10 text-green-400/70 border border-green-400/20" :
                    enemy.difficulty === "Normal" ? "bg-yellow-400/10 text-yellow-400/70 border border-yellow-400/20" :
                    "bg-red-400/10 text-red-400/70 border border-red-400/20"
                  }`}>
                    {enemy.difficulty}
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground/25 group-hover:text-red-400/50 transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── GAME OVER (cinematic) ─── */
function GameOverScreen({
  winner, enemyName, turnCount, onPlayAgain, onExit,
}: {
  winner: "player" | "enemy"; enemyName: string; turnCount: number;
  onPlayAgain: () => void; onExit: () => void;
}) {
  const isVictory = winner === "player";
  const { addMaterial } = useGame();
  const [drops, setDrops] = useState<{ materialId: string; quantity: number; name: string; icon: string }[]>([]);
  const dropsGiven = useRef(false);

  useEffect(() => {
    if (isVictory && !dropsGiven.current) {
      dropsGiven.current = true;
      // Card battle drops: battle shards and occasional rare materials
      const battleDrops: { materialId: string; quantity: number; name: string; icon: string }[] = [];
      // Always drop battle shards
      const shardQty = 1 + Math.floor(Math.random() * 3);
      battleDrops.push({ materialId: "battle_shard", quantity: shardQty, name: "Battle Shard", icon: "⚔️" });
      addMaterial("battle_shard", shardQty);
      // 30% chance for champion's mark
      if (Math.random() < 0.3) {
        battleDrops.push({ materialId: "champions_mark", quantity: 1, name: "Champion's Mark", icon: "🏆" });
        addMaterial("champions_mark", 1);
      }
      // 15% chance for crystal shard (quick wins)
      if (turnCount <= 8 && Math.random() < 0.15) {
        battleDrops.push({ materialId: "crystal_shard", quantity: 1, name: "Crystal Shard", icon: "💎" });
        addMaterial("crystal_shard", 1);
      }
      setDrops(battleDrops);
    }
  }, [isVictory, turnCount, addMaterial]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.9)" }}
    >
      <AmbientParticles count={40} color={isVictory ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.2)"} />

      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 12, delay: 0.2 }}
        className="text-center max-w-sm relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: isVictory ? [0, 5, -5, 0] : [0, -3, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isVictory ? (
            <Trophy size={56} className="text-amber-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
          ) : (
            <Skull size={56} className="text-red-400/60 mx-auto mb-4" />
          )}
        </motion.div>

        <h2 className={`font-display text-3xl sm:text-4xl tracking-[0.3em] mb-2 ${
          isVictory ? "text-amber-400 animate-victory-glow" : "text-red-400"
        }`}>
          {isVictory ? "VICTORY" : "DEFEATED"}
        </h2>
        <p className="font-mono text-xs text-muted-foreground/60 mb-1">
          {isVictory ? `Defeated ${enemyName} in ${turnCount} turns` : `${enemyName} has destroyed you`}
        </p>
        {isVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <p className="font-mono text-[10px] text-amber-400/50 mb-2">+50 XP earned</p>
            {drops.length > 0 && (
              <div className="space-y-1">
                <p className="font-mono text-[9px] text-cyan-400/60 tracking-wider">MATERIALS FOUND</p>
                {drops.map((drop, i) => (
                  <motion.p
                    key={drop.materialId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.15 }}
                    className="font-mono text-[10px] text-emerald-400/70"
                  >
                    {drop.icon} +{drop.quantity} {drop.name}
                  </motion.p>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="px-6 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all"
            style={{
              background: "rgba(51,226,230,0.1)",
              border: "1px solid rgba(51,226,230,0.3)",
              color: "var(--neon-cyan)",
              boxShadow: "0 0 15px rgba(51,226,230,0.1)",
            }}
          >
            <RotateCcw size={12} className="inline mr-1.5" />
            PLAY AGAIN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className="px-6 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            EXIT ARENA
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── BATTLEFIELD DIVIDER ─── */
function BattlefieldDivider() {
  return (
    <div className="relative py-1">
      <div className="h-px w-full animate-divider-pulse"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(51,226,230,0.3), rgba(51,226,230,0.5), rgba(51,226,230,0.3), transparent)",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(5,5,18,0.9)",
          border: "1px solid rgba(51,226,230,0.3)",
          boxShadow: "0 0 10px rgba(51,226,230,0.15)",
        }}
      >
        <Swords size={10} className="text-cyan-400/50" />
      </div>
    </div>
  );
}

/* ─── MAIN BATTLE PAGE ─── */
export default function CardBattlePage() {
  const { state: gameState } = useGame();
  const { playSFX, initAudio, audioReady } = useSound();
  const { discoverEntry } = useGamification();
  const [, navigate] = useLocation();

  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  const [enemyId, setEnemyId] = useState<string | null>(null);
  const [showTurnBanner, setShowTurnBanner] = useState(false);
  const [turnBannerText, setTurnBannerText] = useState("");
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());

  const vfx = useVFX();
  const boardRef = useRef<HTMLDivElement>(null);
  const [activeProjectiles, setActiveProjectiles] = useState<Array<{ id: string; fromX: number; fromY: number; toX: number; toY: number; color: string }>>([]); 
  const [deployBursts, setDeployBursts] = useState<Array<{ id: string; x: number; y: number; color: string }>>([]); 
  const [comboChainCount, setComboChainCount] = useState(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate player deck
  const playerDeck = useMemo(() => {
    const choices = gameState.characterChoices;
    return generateStarterDeck({
      species: choices.species || undefined,
      characterClass: choices.characterClass || undefined,
      alignment: choices.alignment || undefined,
      element: choices.element || undefined,
      name: choices.name || undefined,
    });
  }, [gameState.characterChoices]);

  const startBattle = useCallback((eid: string, diff: "easy" | "normal" | "hard") => {
    setEnemyId(eid);
    const state = initBattle(playerDeck, eid, diff);
    setBattleState(state);
    if (audioReady) playSFX("turn_start");
    // Show initial turn banner
    setTurnBannerText("YOUR TURN");
    setShowTurnBanner(true);
    setTimeout(() => setShowTurnBanner(false), 1200);
  }, [playerDeck, audioReady, playSFX]);

  const dispatch = useCallback((action: Parameters<typeof processBattleAction>[1]) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const prevState = prev;
      const next = processBattleAction(prev, action);

      // VFX based on action type
      if (action.type === "PLAY_CARD") {
        // Find the card that was played
        const playedCard = prevState.player.hand.find(c => c.instanceId === action.cardInstanceId);
        if (playedCard) {
          // Play type-specific SFX
          if (audioReady) {
            if (playedCard.type === "spell") playSFX("card_spell");
            else if (playedCard.type === "artifact") playSFX("card_artifact");
            else playSFX("card_deploy");
          }
          setAnimatingCards(s => new Set(s).add(action.cardInstanceId));
          setTimeout(() => setAnimatingCards(s => { const n = new Set(s); n.delete(action.cardInstanceId); return n; }), 700);
          vfx.triggerFlash("blueFlash");
          // Deploy burst effect
          const bx = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
          const by = window.innerHeight * 0.55;
          const burstId = `burst-${Date.now()}`;
          setDeployBursts(prev => [...prev, { id: burstId, x: bx, y: by, color: "#33e2e6" }]);
          setTimeout(() => setDeployBursts(prev => prev.filter(b => b.id !== burstId)), 800);
        }
      }

      if (action.type === "ATTACK") {
        const attacker = prevState.player.field.find(c => c.instanceId === action.attackerInstanceId);
        if (attacker) {
          const damage = attacker.attack + attacker.tempAttackMod;
          // Play attack SFX — critical hit for 5+ damage
          if (audioReady) {
            if (damage >= 5) playSFX("critical_hit");
            else playSFX("card_attack");
          }
          // Spawn attack projectile trail
          const fromX = window.innerWidth * 0.3 + (Math.random() - 0.5) * 80;
          const fromY = window.innerHeight * 0.6;
          const toX = window.innerWidth * 0.5 + (Math.random() - 0.5) * 80;
          const toY = window.innerHeight * 0.25;
          const projId = `proj-${Date.now()}`;
          const projColor = damage >= 5 ? "#fbbf24" : "#ef4444";
          setActiveProjectiles(prev => [...prev, { id: projId, fromX, fromY, toX, toY, color: projColor }]);
          setTimeout(() => setActiveProjectiles(prev => prev.filter(p => p.id !== projId)), 500);
          // Spawn damage VFX at target
          const centerX = toX + (Math.random() - 0.5) * 30;
          const centerY = toY + (Math.random() - 0.5) * 20;
          if (damage >= 5) {
            vfx.spawnHeavyDamage(centerX, centerY, damage);
          } else {
            vfx.spawnDamage(centerX, centerY, damage);
          }
          // Combo chain tracking
          setComboChainCount(prev => prev + 1);
          if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => setComboChainCount(0), 3000);
        }
      }

      if (action.type === "END_TURN") {
        if (audioReady) playSFX("turn_end");
        setTurnBannerText("ENEMY TURN");
        setShowTurnBanner(true);
        setTimeout(() => setShowTurnBanner(false), 1200);

        // After enemy turn completes, show player turn banner
        if (next.turn === "player") {
          setTimeout(() => {
            if (audioReady) playSFX("turn_start");
            if (audioReady) playSFX("energy_charge");
            setTurnBannerText("YOUR TURN");
            setShowTurnBanner(true);
            setTimeout(() => setShowTurnBanner(false), 1200);
          }, 800);
        }

        // Check for enemy damage dealt
        if (next.player.hp < prevState.player.hp) {
          const dmg = prevState.player.hp - next.player.hp;
          setTimeout(() => {
            if (audioReady) playSFX(dmg >= 5 ? "critical_hit" : "card_attack");
            const x = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
            const y = window.innerHeight * 0.65;
            if (dmg >= 5) {
              vfx.spawnHeavyDamage(x, y, dmg);
            } else {
              vfx.spawnDamage(x, y, dmg);
            }
          }, 400);
        }

        // Check for card deaths
        const prevEnemyFieldIds = new Set(prevState.enemy.field.map(c => c.instanceId));
        const nextEnemyFieldIds = new Set(next.enemy.field.map(c => c.instanceId));
        const enemyDeaths = Array.from(prevEnemyFieldIds).filter(id => !nextEnemyFieldIds.has(id));
        if (enemyDeaths.length > 0 && audioReady) {
          setTimeout(() => playSFX("card_death"), 200);
        }

        const prevPlayerFieldIds = new Set(prevState.player.field.map(c => c.instanceId));
        const nextPlayerFieldIds = new Set(next.player.field.map(c => c.instanceId));
        const playerDeaths = Array.from(prevPlayerFieldIds).filter(id => !nextPlayerFieldIds.has(id));
        if (playerDeaths.length > 0 && audioReady) {
          setTimeout(() => playSFX("card_death"), 300);
        }

        // Check for victory/defeat
        if (next.winner === "player" && audioReady) {
          setTimeout(() => playSFX("battle_victory"), 600);
        } else if (next.winner === "enemy" && audioReady) {
          setTimeout(() => playSFX("battle_defeat"), 600);
        }
      }

      return next;
    });
    setSelectedCard(null);
    setSelectedAttacker(null);
    setTargetMode(false);
  }, [audioReady, playSFX, vfx]);

  // Handle card play from hand
  const handleHandCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;
    if (card.cost <= battleState.player.energy) {
      if (card.type === "unit" && battleState.player.field.length >= 5) return;
      dispatch({ type: "PLAY_CARD", cardInstanceId: card.instanceId });
    }
  }, [battleState, dispatch]);

  // Handle field card click
  const handleFieldCardClick = useCallback((card: BattleCard) => {
    if (!battleState || battleState.turn !== "player" || battleState.winner) return;
    if (card.hasAttacked || card.justDeployed) return;
    if (selectedAttacker === card.instanceId) {
      setSelectedAttacker(null);
      setTargetMode(false);
    } else {
      setSelectedAttacker(card.instanceId);
      setTargetMode(true);
    }
  }, [battleState, selectedAttacker]);

  // Handle target selection
  const handleTargetClick = useCallback((targetId: string | "face") => {
    if (!selectedAttacker || !battleState) return;
    dispatch({ type: "ATTACK", attackerInstanceId: selectedAttacker, targetInstanceId: targetId });
  }, [selectedAttacker, battleState, dispatch]);

  // Init audio
  useEffect(() => {
    if (!audioReady) {
      const handler = () => { initAudio(); window.removeEventListener("click", handler); };
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [audioReady, initAudio]);

  // Enemy select
  if (!battleState) {
    return <EnemySelect onSelect={startBattle} />;
  }

  const { player, enemy, turn, turnNumber, logs, winner } = battleState;

  return (
    <LandscapeEnforcer forceRotate message="Card battles are best experienced in landscape mode.">
    <div
      ref={boardRef}
      className={`min-h-screen flex flex-col relative overflow-hidden ${vfx.shakeClass}`}
      style={{
        background: "linear-gradient(180deg, #030308 0%, #080820 30%, #0a0a2e 50%, #080820 70%, #030308 100%)",
      }}
    >
      {/* ── VFX Layers ── */}
      <FloatingNumbers texts={vfx.floatingTexts} onComplete={vfx.removeFloatingText} />
      <ScreenFlash effects={vfx.screenEffects} onComplete={vfx.removeScreenEffect} />
      <AmbientParticles count={15} color="rgba(51,226,230,0.15)" />

      {/* ── Board State Effects ── */}
      <EnergyFieldOverlay
        playerFieldPower={player.field.reduce((sum, c) => sum + c.attack + c.tempAttackMod, 0)}
        enemyFieldPower={enemy.field.reduce((sum, c) => sum + c.attack + c.tempAttackMod, 0)}
        turn={turn}
      />
      <WeatherEffects
        turnNumber={turnNumber}
        playerHP={player.hp}
        playerMaxHP={player.maxHP}
        enemyHP={enemy.hp}
        enemyMaxHP={enemy.maxHP}
      />
      <DynamicBoardLighting
        lastAction={logs.length > 0 ? logs[logs.length - 1].message : undefined}
        turn={turn}
        turnNumber={turnNumber}
      />
      <GraveyardSouls
        playerGraveyardCount={player.graveyard.length}
        enemyGraveyardCount={enemy.graveyard.length}
      />
      <FactionBanners />

      {/* Attack Projectile Trails */}
      <AnimatePresence>
        {activeProjectiles.map(p => (
          <AttackProjectile key={p.id} fromX={p.fromX} fromY={p.fromY} toX={p.toX} toY={p.toY} color={p.color} />
        ))}
      </AnimatePresence>

      {/* Deploy Burst Effects */}
      <AnimatePresence>
        {deployBursts.map(b => (
          <DeployBurst key={b.id} x={b.x} y={b.y} color={b.color} />
        ))}
      </AnimatePresence>

      {/* Combo Chain Counter */}
      <AnimatePresence>
        <ComboChainCounter count={comboChainCount} />
      </AnimatePresence>

      {/* Turn banner */}
      <AnimatePresence>
        {showTurnBanner && (
          <TurnBanner
            text={turnBannerText}
            color={turnBannerText.includes("YOUR") ? "#33e2e6" : "#ef4444"}
          />
        )}
      </AnimatePresence>

      {/* Game Over */}
      {winner && (
        <GameOverScreen
          winner={winner}
          enemyName={getEnemyName(enemyId || "")}
          turnCount={turnNumber}
          onPlayAgain={() => { setBattleState(null); setEnemyId(null); }}
          onExit={() => navigate("/ark")}
        />
      )}

      {/* ═══ ENEMY ZONE ═══ */}
      <div className="px-3 sm:px-6 pt-3 pb-1 relative z-10">
        {/* Enemy HP + Energy */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <HPBar current={enemy.hp} max={enemy.maxHP} label={getEnemyName(enemyId || "")} color="#ef4444" />
          </div>
          <EnergyCrystals current={enemy.energy} max={enemy.maxEnergy} color="#ef4444" />
        </div>
        <p className="font-mono text-[8px] text-muted-foreground/25 mt-1 ml-6">
          Hand: {enemy.hand.length} | Deck: {enemy.deck.length}
        </p>
      </div>

      {/* ═══ ENEMY FIELD ═══ */}
      <div className="px-3 sm:px-6 py-2 relative z-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-h-[7rem] sm:min-h-[9rem]">
          {enemy.field.length === 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-border/40" />
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-border/40" />
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-border/40" />
            </div>
          ) : (
            enemy.field.map(card => (
              <BattleCardView
                key={card.instanceId}
                card={card}
                small
                targetable={targetMode}
                onClick={() => targetMode && handleTargetClick(card.instanceId)}
              />
            ))
          )}
        </div>
      </div>

      {/* ═══ BATTLEFIELD DIVIDER ═══ */}
      <BattlefieldDivider />

      {/* ═══ CENTER CONTROLS ═══ */}
      <div className="flex items-center justify-center gap-3 py-1.5 relative z-10">
        {targetMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTargetClick("face")}
            className="px-4 py-1.5 rounded-lg font-mono text-[10px] tracking-wider"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              boxShadow: "0 0 12px rgba(239,68,68,0.1)",
            }}
          >
            <Target size={10} className="inline mr-1" />
            ATTACK FACE
          </motion.button>
        )}

        <div className="text-center px-3">
          <p className="font-mono text-[9px] text-muted-foreground/35">
            Turn {turnNumber}
          </p>
          <p className={`font-display text-[10px] tracking-[0.2em] ${
            turn === "player" ? "text-cyan-400/70" : "text-red-400/70"
          }`}>
            {turn === "player" ? "YOUR MOVE" : "ENEMY MOVE"}
          </p>
        </div>

        {targetMode && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setSelectedAttacker(null); setTargetMode(false); }}
            className="px-3 py-1.5 rounded-lg font-mono text-[10px] text-muted-foreground/40 border border-white/08"
          >
            CANCEL
          </motion.button>
        )}
      </div>

      {/* ═══ PLAYER FIELD ═══ */}
      <div className="px-3 sm:px-6 py-2 relative z-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-h-[7rem] sm:min-h-[9rem]">
          {player.field.length === 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-cyan-400/8" />
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-cyan-400/8" />
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-dashed border-cyan-400/8" />
            </div>
          ) : (
            player.field.map(card => (
              <BattleCardView
                key={card.instanceId}
                card={card}
                small
                selected={selectedAttacker === card.instanceId}
                disabled={card.hasAttacked || card.justDeployed}
                animClass={
                  animatingCards.has(card.instanceId) ? "animate-summon-burst" :
                  !card.hasAttacked && !card.justDeployed && turn === "player" ? "animate-card-breathe" : ""
                }
                onClick={() => handleFieldCardClick(card)}
              />
            ))
          )}
        </div>
      </div>

      {/* ═══ BOTTOM: Player info + hand ═══ */}
      <div className="mt-auto relative z-10">
        {/* Battle log */}
        <div className="px-3 sm:px-6 mb-2">
          <BattleLog logs={logs} />
        </div>

        {/* Player info bar */}
        <div className="px-3 sm:px-6 py-2 flex items-center gap-3">
          <div className="flex-1">
            <HPBar current={player.hp} max={player.maxHP} label={gameState.characterChoices.name || "You"} color="#33e2e6" isPlayer />
          </div>
          <EnergyCrystals current={player.energy} max={player.maxEnergy} color="#3b82f6" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: "END_TURN" })}
            disabled={turn !== "player" || !!winner}
            className="px-4 py-2 rounded-lg font-display text-[10px] sm:text-xs tracking-[0.2em] transition-all disabled:opacity-20"
            style={{
              background: turn === "player" ? "rgba(51,226,230,0.1)" : "transparent",
              border: `1px solid rgba(51,226,230,${turn === "player" ? 0.3 : 0.08})`,
              color: "var(--neon-cyan)",
              boxShadow: turn === "player" ? "0 0 15px rgba(51,226,230,0.08)" : "none",
            }}
          >
            END TURN
          </motion.button>
        </div>

        {/* Player hand */}
        <div
          className="px-2 sm:px-4 py-3 overflow-x-auto no-scrollbar"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
            borderTop: "1px solid rgba(51,226,230,0.06)",
          }}
        >
          <div className="flex items-end justify-center gap-1 sm:gap-1.5">
            {player.hand.map((card, i) => {
              const isPlayable = card.cost <= player.energy && turn === "player" && !winner;
              const fanAngle = player.hand.length > 1
                ? -8 + (i / (player.hand.length - 1)) * 16
                : 0;
              const fanY = Math.abs(i - (player.hand.length - 1) / 2) * 4;

              return (
                <motion.div
                  key={card.instanceId}
                  style={{
                    transform: `rotate(${fanAngle}deg) translateY(${fanY}px)`,
                    zIndex: i,
                  }}
                  whileHover={{ y: -16, zIndex: 50, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <BattleCardView
                    card={card}
                    isPlayable={isPlayable}
                    disabled={!isPlayable}
                    onClick={() => handleHandCardClick(card)}
                  />
                </motion.div>
              );
            })}
            {player.hand.length === 0 && (
              <p className="font-mono text-[10px] text-muted-foreground/25 italic py-8">No cards in hand</p>
            )}
          </div>
          <p className="font-mono text-[7px] sm:text-[8px] text-muted-foreground/20 text-center mt-2">
            Deck: {player.deck.length} | Graveyard: {player.graveyard.length}
          </p>
        </div>
      </div>
    </div>
    </LandscapeEnforcer>
  );
}
