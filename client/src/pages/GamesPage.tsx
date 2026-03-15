/* ═══════════════════════════════════════════════════════
   SAGAVERSE GAMES — Hub for all games in the Dischordian Saga
   Card Game, Trade Wars, Combat Simulator, Inception Ark,
   Deck Builder, Trophy Room, Research Lab
   ═══════════════════════════════════════════════════════ */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Gamepad2, Swords, Rocket, ScrollText, Trophy, FlaskConical,
  ChevronRight, Zap, Shield, Crown, Crosshair, Ship
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

interface GameTile {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Gamepad2;
  color: string;
  glowColor: string;
  badge?: string;
}

const GAMES: GameTile[] = [
  {
    href: "/cards/play",
    title: "CARD GAME",
    subtitle: "VTES-Inspired Strategy",
    description: "Battle AI opponents across 3-lane battlefields. Deploy characters, cast spells, and dominate with your deck.",
    icon: ScrollText,
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.3)",
    badge: "PLAY NOW",
  },
  {
    href: "/trade-wars",
    title: "TRADE WARS",
    subtitle: "BBS Space Trading",
    description: "Navigate the galaxy, trade commodities, colonize planets, and engage in ship-to-ship combat.",
    icon: Ship,
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,0.3)",
    badge: "PLAY NOW",
  },
  {
    href: "/fight",
    title: "COMBAT SIMULATOR",
    subtitle: "Fall of Reality",
    description: "Select your fighter and battle in 2.5D arena combat. Unlock hidden roster characters with fight points.",
    icon: Swords,
    color: "#ef4444",
    glowColor: "rgba(239,68,68,0.3)",
    badge: "FIGHT",
  },
  {
    href: "/ark",
    title: "INCEPTION ARK",
    subtitle: "Explore the Ship",
    description: "Navigate the decks of the Inception Ark. Discover rooms, unlock secrets, and uncover hidden lore.",
    icon: Rocket,
    color: "#a855f7",
    glowColor: "rgba(168,85,247,0.3)",
  },
  {
    href: "/cards",
    title: "CARD BROWSER",
    subtitle: "3000+ Cards",
    description: "Browse the complete card collection. Filter by season, type, rarity, element, and class.",
    icon: Crown,
    color: "#ec4899",
    glowColor: "rgba(236,72,153,0.3)",
  },
  {
    href: "/deck-builder",
    title: "DECK BUILDER",
    subtitle: "Build Your Strategy",
    description: "Construct custom decks from your collection. Save, load, and optimize your card loadouts.",
    icon: Shield,
    color: "#22c55e",
    glowColor: "rgba(34,197,94,0.3)",
  },
  {
    href: "/research-lab",
    title: "RESEARCH LAB",
    subtitle: "Card Crafting",
    description: "Fuse duplicate cards, transmute elements, and craft powerful new cards from your collection.",
    icon: FlaskConical,
    color: "#6366f1",
    glowColor: "rgba(99,102,241,0.3)",
  },
  {
    href: "/trophy",
    title: "TROPHY ROOM",
    subtitle: "Your Collection",
    description: "Display your rarest cards, track achievements, and customize your trophy room theme.",
    icon: Trophy,
    color: "#eab308",
    glowColor: "rgba(234,179,8,0.3)",
  },
];

export default function GamesPage() {
  const gam = useGamification();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Gamepad2 size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-black tracking-wider text-foreground">
              SAGAVERSE <span className="text-primary glow-cyan">GAMES</span>
            </h1>
            <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">
              THE DISCHORDIAN SAGA INTERACTIVE EXPERIENCES
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-3 font-mono text-[10px]">
          <span className="text-muted-foreground">
            <span className="text-primary">{gam.level}</span> LV
          </span>
          <span className="text-muted-foreground">
            <span className="text-amber-400">{gam.points}</span> PTS
          </span>
          <span className="text-muted-foreground">
            <span className="text-green-400">{gam.earnedAchievements.length}</span> ACHIEVEMENTS
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMES.map((game, i) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={game.href}
                className="group block rounded-lg border border-border/30 bg-card/60 overflow-hidden hover:border-opacity-60 transition-all duration-300"
                style={{
                  ["--game-color" as any]: game.color,
                }}
              >
                <div className="p-4">
                  {/* Top row: icon + badge */}
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                      style={{
                        background: game.color + "15",
                        border: `1px solid ${game.color}30`,
                        boxShadow: `0 0 15px ${game.glowColor}`,
                      }}
                    >
                      <Icon size={20} style={{ color: game.color }} />
                    </div>
                    {game.badge && (
                      <span
                        className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: game.color + "20",
                          color: game.color,
                          border: `1px solid ${game.color}40`,
                        }}
                      >
                        {game.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-sm font-bold tracking-wider mb-0.5 transition-colors group-hover:brightness-125"
                    style={{ color: game.color }}
                  >
                    {game.title}
                  </h3>
                  <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider mb-2">
                    {game.subtitle}
                  </p>

                  {/* Description */}
                  <p className="font-mono text-[10px] text-muted-foreground/80 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-end mt-3">
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground/30 group-hover:translate-x-1 transition-all"
                      style={{ color: game.color + "60" }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
