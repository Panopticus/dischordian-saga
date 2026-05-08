import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GameCard from "@/components/GameCard";
import { Link } from "wouter";
import {
  ChevronLeft, Trophy, Star, Crown, Sparkles,
  Lock, Palette, Eye, Shield, Swords, Flame,
  Heart, Zap, Package
} from "lucide-react";
import { getGoogleLoginUrl } from "@/const";
import { ACHIEVEMENT_CHAINS, type AchievementChain } from "@/game/achievementChains";
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import LivingBackground from "@/components/LivingBackground";
import { WitnessingWallPanel } from "@/components/WitnessingWallPanel";

import { assetUrl } from "@/lib/assetUrl";
// Trophy room themes
const ROOM_THEMES = [
  {
    id: "void",
    name: "Void Chamber",
    description: "A dark, minimalist display against the endless void",
    bg: "bg-gradient-to-b from-[#0a0a0f] to-[#0d0d15]",
    accent: "void-border-success",
    glow: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-primary) 5%, transparent)]",
    unlocked: true,
  },
  {
    id: "neon",
    name: "Neon Gallery",
    description: "Pulsing neon lights illuminate your finest cards",
    bg: "bg-gradient-to-b from-[#0a0510] to-[#100520]",
    accent: "void-border-system",
    glow: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-system) 10%, transparent)]",
    unlocked: true,
  },
  {
    id: "gold",
    name: "Golden Vault",
    description: "A prestigious display worthy of legendary cards",
    bg: "bg-gradient-to-b from-[#151005] to-[#0f0d05]",
    accent: "void-border",
    glow: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-accent) 10%, transparent)]",
    unlocked: false,
    requirement: "Collect 10 Legendary cards",
  },
  {
    id: "fire",
    name: "Inferno Shrine",
    description: "Flames dance around your battle-hardened collection",
    bg: "bg-gradient-to-b from-[#150505] to-[#100505]",
    accent: "void-border-error",
    glow: "shadow-[0_0_30px_color-mix(in oklch, var(--energy-error) 10%, transparent)]",
    unlocked: false,
    requirement: "Win 50 card game matches",
  },
  {
    id: "crystal",
    name: "Crystal Sanctum",
    description: "Prismatic crystals refract light across your cards",
    bg: "bg-gradient-to-b from-[#050f15] to-[#050a10]",
    accent: "void-border-success",
    glow: "shadow-[0_0_30px_rgba(20,184,166,0.1)]",
    unlocked: false,
    requirement: "Complete Season 1 collection",
  },
  {
    id: "neyon",
    name: "Neyon Throne Room",
    description: "The ultimate display — reserved for Neyon collectors",
    bg: "bg-gradient-to-b from-[#0f0a15] to-[#0a0510]",
    accent: "void-border-error",
    glow: "shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    unlocked: false,
    requirement: "Own all 10 Neyon cards",
  },
];

// Display layouts
const DISPLAY_LAYOUTS = [
  { id: "grid", name: "Grid", cols: 4 },
  { id: "showcase", name: "Showcase", cols: 3 },
  { id: "wall", name: "Wall", cols: 6 },
];

export default function TrophyRoomPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();
  const gam = useGamification();
  const [activeTheme, setActiveTheme] = useState(ROOM_THEMES[0]);
  const [layout, setLayout] = useState(DISPLAY_LAYOUTS[0]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Fetch user's best cards (highest rarity/power)
  const { data: topCards } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 24,
    sortBy: "power",
    sortDir: "desc",
  });

  // Fetch stats
  const { data: rarityStats } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 1,
    rarity: "legendary",
  });

  const { data: neyonCards } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 10,
    rarity: "neyon",
  });

  const displayCards = topCards?.cards ?? [];

  return (
    <div className={`min-h-screen ${activeTheme.bg} transition-colors duration-700 relative overflow-hidden`}>
      <LivingBackground src={assetUrl("art/rooms/room-trophy-room.png")} accent="var(--energy-accent)" opacity={0.15} particleCount={6} scanlines={false} />
      <div className="relative z-10">
      {/* Header */}
      <div className="border-b border-border/20 bg-muted/50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <div>
                <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
                  <Trophy size={18} className="void-text-accent" />
                  TROPHY ROOM
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                  {activeTheme.name.toUpperCase()} // {displayCards.length} CARDS DISPLAYED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Layout toggle */}
              <div className="flex rounded-md border border-border/20 overflow-hidden">
                {DISPLAY_LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l)}
                    className={`px-2 py-1 font-mono text-[9px] transition-colors ${
                      layout.id === l.id
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>

              {/* Theme selector */}
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="p-2 rounded-md bg-secondary/30 border border-border/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <Palette size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {/* Theme selector panel */}
        <AnimatePresence>
          {showThemeSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROOM_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => theme.unlocked && setActiveTheme(theme)}
                    disabled={!theme.unlocked}
                    className={`relative rounded-lg border p-3 text-left transition-all ${
                      activeTheme.id === theme.id
                        ? `${theme.accent} ring-1 ring-primary`
                        : `border-border/20 hover:border-border/40`
                    } ${!theme.unlocked ? "void-glitch void-glitch-lock" : ""}`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${theme.bg}`} />
                    <p className="font-mono text-xs font-bold text-foreground">{theme.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{theme.description}</p>
                    {!theme.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                        <div className="text-center">
                          <Lock size={16} className="mx-auto text-muted-foreground mb-1" />
                          <p className="font-mono text-[8px] text-muted-foreground">{theme.requirement}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "TOTAL CARDS", value: topCards?.total ?? 0, icon: Package, color: "text-primary" },
            { label: "LEGENDARY", value: rarityStats?.total ?? 0, icon: Crown, color: "void-text-accent" },
            { label: "NEYON", value: neyonCards?.total ?? 0, icon: Sparkles, color: "void-text-error" },
            { label: "THEMES", value: ROOM_THEMES.filter(t => t.unlocked).length, icon: Palette, color: "void-text-system" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-lg border ${activeTheme.accent} bg-muted/40 p-3 ${activeTheme.glow}`}
              >
                <Icon size={14} className={stat.color} />
                <p className="font-display text-lg font-bold text-foreground mt-1">{stat.value}</p>
                <p className="font-mono text-[8px] text-muted-foreground tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Featured display - Neyon cards */}
        {neyonCards && neyonCards.cards.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-sm font-bold tracking-wider void-text-error mb-4 flex items-center gap-2">
              <Sparkles size={14} />
              NEYON COLLECTION
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {neyonCards.cards.map((card, i) => (
                <motion.div
                  key={card.cardId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="shrink-0"
                >
                  <GameCard
                    card={card}
                    size="md"
                    onClick={() => setSelectedCard(card)}
                    className={`${activeTheme.glow} hover:scale-105 transition-transform`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main card display grid */}
        <div className="mb-6">
          <h2 className="font-display text-sm font-bold tracking-wider text-foreground mb-4 flex items-center gap-2">
            <Trophy size={14} className="void-text-accent" />
            TOP CARDS
          </h2>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))` }}
          >
            {displayCards.map((card, i) => (
              <motion.div
                key={card.cardId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <GameCard
                  card={card}
                  size={layout.id === "showcase" ? "md" : "sm"}
                  onClick={() => setSelectedCard(card)}
                  className={`${activeTheme.glow} hover:scale-105 transition-transform`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ACHIEVEMENT CHAINS ═══ */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} className="void-text-accent" />
          <h2 className="font-display text-sm font-bold tracking-[0.2em] void-text-accent">ACHIEVEMENT CHAINS</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.values(ACHIEVEMENT_CHAINS).map((chain: AchievementChain) => {
            // Calculate real progress from game state
            const completedCount = chain.requirements.reduce((count, req) => {
              // Check common requirement patterns by chain ID
              if (chain.id === "master_of_the_ark") {
                // Count discovered rooms
                return Object.values(gameState.rooms).filter(r => r.unlocked).length >= req.target ? count + 1 : count;
              }
              if (chain.id === "the_diplomat") {
                // Count NPCs at trust 40+
                const trusts = [gameState.elaraTrust || 0, gameState.humanTrust || 0, ...Object.values(gameState.npcTrust || {})];
                return trusts.filter(t => t >= 40).length >= req.target ? count + 1 : count;
              }
              if (chain.id === "combat_legend") {
                return (gam.gameSave?.totalFights || 0) >= req.target ? count + 1 : count;
              }
              if (chain.id === "lore_keeper") {
                return (gameState.completedGames?.length || 0) >= req.target ? count + 1 : count;
              }
              if (chain.id === "the_witness") {
                return (gameState.completedGames?.length || 0) >= req.target ? count + 1 : count;
              }
              return count;
            }, 0);
            const total = chain.requirements.length;
            const percent = Math.round((completedCount / total) * 100);
            const done = completedCount >= total;
            return (
              <div
                key={chain.id}
                className={`p-3 rounded-lg border transition-all ${
                  done ? "void-border void-bg-sunk" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{chain.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-xs font-bold ${done ? "void-text-accent" : "text-white/70"}`}>
                      {chain.name}
                    </p>
                    <p className="font-mono text-[9px] text-white/30 mt-0.5">{chain.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full void-bg-sunk transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="font-mono text-[8px] text-white/20">{completedCount}/{total}</span>
                </div>
                <p className="font-mono text-[8px] void-text-accent">
                  Reward: {chain.reward.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Witnessing Wall — Appendix A.10 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <WitnessingWallPanel />
      </div>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full"
            >
              <GameCard card={selectedCard} size="lg" />
              <div className="mt-4 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  Click outside to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
