/* ═══════════════════════════════════════════════════════
   MORALITY LEADERBOARD PAGE
   Community-wide morality distribution showing faction
   breakdown, player rankings, and alignment visualization.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users, ChevronLeft, Crown, Shield, Zap, Heart, Brain,
  BarChart3, TrendingUp, Award, Cpu, Leaf, Scale
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useMoralityTheme } from "@/contexts/MoralityThemeContext";
import { MoralityBar } from "@/components/MoralityMeter";

/* ─── FACTION STYLING ─── */
const FACTION_CONFIG = {
  machine: {
    label: "Machine",
    color: "#FF4444",
    bgColor: "rgba(255, 68, 68, 0.1)",
    borderColor: "rgba(255, 68, 68, 0.3)",
    icon: Cpu,
    description: "Those who embrace the cold logic of the Panopticon. Order through control.",
    motto: "\"Efficiency is the highest virtue.\"",
  },
  balanced: {
    label: "Balanced",
    color: "#33E2E6",
    bgColor: "rgba(51, 226, 230, 0.1)",
    borderColor: "rgba(51, 226, 230, 0.3)",
    icon: Scale,
    description: "Operatives who walk the razor's edge between order and freedom.",
    motto: "\"The truth lies in the tension.\"",
  },
  humanity: {
    label: "Humanity",
    color: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    icon: Leaf,
    description: "Champions of free will who resist the machine's embrace. Freedom through chaos.",
    motto: "\"Every soul is worth saving.\"",
  },
};

export default function MoralityLeaderboardPage() {
  const { state } = useGame();
  const moralityTheme = useMoralityTheme();
  const { data: distribution, isLoading } = trpc.moralityLeaderboard.getDistribution.useQuery();
  const { data: myRank } = trpc.moralityLeaderboard.getMyRank.useQuery();

  const factionPercentages = useMemo(() => {
    if (!distribution || distribution.total === 0) return { machine: 0, balanced: 0, humanity: 0 };
    return {
      machine: Math.round((distribution.machine / distribution.total) * 100),
      balanced: Math.round((distribution.balanced / distribution.total) * 100),
      humanity: Math.round((distribution.humanity / distribution.total) * 100),
    };
  }, [distribution]);

  // Determine the dominant faction
  const dominantFaction = useMemo(() => {
    if (!distribution) return "balanced";
    const { machine, balanced, humanity } = distribution;
    if (machine > balanced && machine > humanity) return "machine";
    if (humanity > balanced && humanity > machine) return "humanity";
    return "balanced";
  }, [distribution]);

  const machinePlayers = useMemo(() =>
    distribution?.players.filter(p => p.alignment === "machine") ?? [], [distribution]);
  const humanityPlayers = useMemo(() =>
    distribution?.players.filter(p => p.alignment === "humanity") ?? [], [distribution]);
  const balancedPlayers = useMemo(() =>
    distribution?.players.filter(p => p.alignment === "balanced") ?? [], [distribution]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-muted-foreground">Scanning alignment signatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 animate-materialize">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider text-foreground flex items-center gap-2">
              <Heart size={18} className="text-primary" />
              MORALITY CENSUS
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              COMMUNITY ALIGNMENT DISTRIBUTION // {distribution?.total ?? 0} OPERATIVES SCANNED
            </p>
          </div>
        </div>

        {/* Your alignment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-4 mb-4"
          style={{
            borderColor: FACTION_CONFIG[moralityTheme.side].borderColor,
            background: FACTION_CONFIG[moralityTheme.side].bgColor,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">YOUR ALIGNMENT</span>
            {myRank && (
              <span className="font-mono text-[10px]" style={{ color: FACTION_CONFIG[moralityTheme.side].color }}>
                RANK #{myRank.rank} of {myRank.total} // TOP {myRank.percentile}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-md" style={{ background: FACTION_CONFIG[moralityTheme.side].bgColor, border: `1px solid ${FACTION_CONFIG[moralityTheme.side].borderColor}` }}>
              {(() => { const Icon = FACTION_CONFIG[moralityTheme.side].icon; return <Icon size={20} style={{ color: FACTION_CONFIG[moralityTheme.side].color }} />; })()}
            </div>
            <div>
              <p className="font-display text-base font-bold" style={{ color: FACTION_CONFIG[moralityTheme.side].color }}>
                {moralityTheme.label}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                Score: {state.moralityScore} // Intensity: {Math.round(moralityTheme.intensity * 100)}%
              </p>
            </div>
          </div>
          <MoralityBar />
        </motion.div>
      </div>

      {/* Faction War Visualization */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border/30 bg-card/30 p-4"
        >
          <h2 className="font-display text-sm font-bold tracking-[0.15em] text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" />
            FACTION BALANCE
          </h2>

          {/* Visual bar */}
          <div className="relative h-10 rounded-lg overflow-hidden mb-3 border border-border/20">
            <div className="absolute inset-0 flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${factionPercentages.machine}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full relative"
                style={{ background: "linear-gradient(90deg, #8B0000 0%, #FF4444 100%)" }}
              >
                {factionPercentages.machine > 10 && (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white font-bold">
                    {factionPercentages.machine}%
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${factionPercentages.balanced}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full relative"
                style={{ background: "linear-gradient(90deg, #1a8a8e 0%, #33E2E6 100%)" }}
              >
                {factionPercentages.balanced > 10 && (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white font-bold">
                    {factionPercentages.balanced}%
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${factionPercentages.humanity}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full relative"
                style={{ background: "linear-gradient(90deg, #22C55E 0%, #86efac 100%)" }}
              >
                {factionPercentages.humanity > 10 && (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white font-bold">
                    {factionPercentages.humanity}%
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* Faction cards */}
          <div className="grid grid-cols-3 gap-3">
            {(["machine", "balanced", "humanity"] as const).map((faction, i) => {
              const config = FACTION_CONFIG[faction];
              const count = distribution?.[faction] ?? 0;
              const Icon = config.icon;
              const isDominant = faction === dominantFaction;
              return (
                <motion.div
                  key={faction}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`rounded-lg border p-3 text-center relative ${isDominant ? "ring-1" : ""}`}
                  style={{
                    borderColor: config.borderColor,
                    background: config.bgColor,
                    ...(isDominant ? { ringColor: config.color } : {}),
                  }}
                >
                  {isDominant && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <Crown size={12} style={{ color: config.color }} />
                    </div>
                  )}
                  <Icon size={20} className="mx-auto mb-1.5" style={{ color: config.color }} />
                  <p className="font-display text-xl font-bold" style={{ color: config.color }}>{count}</p>
                  <p className="font-mono text-[9px] text-muted-foreground tracking-wider uppercase">{config.label}</p>
                  <p className="font-mono text-[9px] mt-1" style={{ color: config.color }}>{factionPercentages[faction]}%</p>
                </motion.div>
              );
            })}
          </div>

          {/* Community average */}
          <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">COMMUNITY AVERAGE SCORE</span>
            <span className="font-mono text-sm font-bold" style={{
              color: (distribution?.averageScore ?? 0) < -10 ? "#FF4444" :
                     (distribution?.averageScore ?? 0) > 10 ? "#22C55E" : "#33E2E6"
            }}>
              {distribution?.averageScore ?? 0}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Faction Lore */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["machine", "balanced", "humanity"] as const).map((faction, i) => {
            const config = FACTION_CONFIG[faction];
            const Icon = config.icon;
            return (
              <motion.div
                key={faction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-lg border p-3"
                style={{ borderColor: config.borderColor, background: config.bgColor }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: config.color }} />
                  <span className="font-display text-xs font-bold tracking-wider" style={{ color: config.color }}>
                    {config.label.toUpperCase()} PATH
                  </span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mb-2">
                  {config.description}
                </p>
                <p className="font-mono text-[10px] italic" style={{ color: config.color }}>
                  {config.motto}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Player Rankings by Faction */}
      <div className="px-4 sm:px-6 space-y-4">
        {/* Machine Champions */}
        <FactionRankings
          faction="machine"
          players={machinePlayers}
          delay={0.5}
        />
        {/* Balanced Operatives */}
        <FactionRankings
          faction="balanced"
          players={balancedPlayers}
          delay={0.6}
        />
        {/* Humanity Champions */}
        <FactionRankings
          faction="humanity"
          players={humanityPlayers}
          delay={0.7}
        />
      </div>
    </div>
  );
}

/* ─── FACTION RANKINGS COMPONENT ─── */
function FactionRankings({
  faction,
  players,
  delay,
}: {
  faction: "machine" | "balanced" | "humanity";
  players: Array<{
    userId: number;
    name: string;
    score: number;
    alignment: string;
    tierLabel: string;
    level: number;
    title: string;
  }>;
  delay: number;
}) {
  const config = FACTION_CONFIG[faction];
  const Icon = config.icon;

  if (players.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-lg border bg-card/30 overflow-hidden"
      style={{ borderColor: config.borderColor }}
    >
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: config.bgColor }}>
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: config.color }} />
          <span className="font-display text-xs font-bold tracking-wider" style={{ color: config.color }}>
            {config.label.toUpperCase()} CHAMPIONS
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{players.length} operatives</span>
      </div>
      <div className="divide-y divide-border/10">
        {players.slice(0, 10).map((player, i) => (
          <div key={player.userId} className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/15 transition-colors">
            <span className="font-mono text-[10px] text-muted-foreground w-6 text-right">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-foreground truncate">{player.name}</p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {player.tierLabel} // LV.{player.level} {player.title}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold" style={{ color: config.color }}>
                {Math.abs(player.score)}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">commitment</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
