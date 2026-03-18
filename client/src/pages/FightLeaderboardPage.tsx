/* ═══════════════════════════════════════════════════════
   FIGHT LEADERBOARD — Online Ranked Ladder
   ELO ratings, rank tiers, match history, and stats
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Trophy, Swords, Shield, Star, Crown, ChevronLeft,
  TrendingUp, TrendingDown, Minus, Target, Flame,
  Medal, Zap, Users, BarChart3, History
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ALL_FIGHTERS } from "@/game/gameData";

/* ─── Rank Tier Config ─── */
const RANK_TIERS: Record<string, { label: string; color: string; bg: string; min: number }> = {
  grandmaster: { label: "GRANDMASTER", color: "text-amber-300", bg: "bg-amber-500/20 border-amber-500/40", min: 2200 },
  master: { label: "MASTER", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/40", min: 1900 },
  diamond: { label: "DIAMOND", color: "text-cyan-300", bg: "bg-cyan-500/20 border-cyan-500/40", min: 1600 },
  platinum: { label: "PLATINUM", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/40", min: 1400 },
  gold: { label: "GOLD", color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/40", min: 1200 },
  silver: { label: "SILVER", color: "text-gray-300", bg: "bg-gray-500/20 border-gray-500/40", min: 1000 },
  bronze: { label: "BRONZE", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/40", min: 0 },
};

function getFighterName(id: string): string {
  const f = ALL_FIGHTERS.find(f => f.id === id);
  return f?.name ?? id;
}

function getFighterImage(id: string): string | undefined {
  const f = ALL_FIGHTERS.find(f => f.id === id);
  return f?.image;
}

type Tab = "rankings" | "mystats" | "history";

export default function FightLeaderboardPage() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("rankings");

  const { data: leaderboard, isLoading: lbLoading } = trpc.fightLeaderboard.getLeaderboard.useQuery({
    limit: 50, offset: 0,
  });
  const { data: myStats } = trpc.fightLeaderboard.getMyStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: matchHistory } = trpc.fightLeaderboard.getMatchHistory.useQuery({
    limit: 20, offset: 0,
  }, { enabled: isAuthenticated });

  const tabs: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: "rankings", label: "RANKINGS", icon: Trophy },
    { id: "mystats", label: "MY STATS", icon: BarChart3 },
    { id: "history", label: "HISTORY", icon: History },
  ];

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fight" className="text-white/50 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="font-display text-lg tracking-[0.2em] text-foreground flex items-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  FIGHT LEADERBOARD
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                  RANKED LADDER // ELO SYSTEM
                </p>
              </div>
            </div>
            {myStats && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded border ${RANK_TIERS[myStats.rankTier ?? "bronze"]?.bg}`}>
                  <span className={`font-display text-xs tracking-wider ${RANK_TIERS[myStats.rankTier ?? "bronze"]?.color}`}>
                    {RANK_TIERS[myStats.rankTier ?? "bronze"]?.label}
                  </span>
                </div>
                <div className="font-mono text-sm text-amber-400">{myStats.elo} ELO</div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-t font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all ${
                    tab === t.id
                      ? "bg-white/10 text-white border-b-2 border-primary"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {tab === "rankings" && (
            <motion.div key="rankings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {lbLoading ? (
                <div className="text-center py-20 font-mono text-muted-foreground">Loading rankings...</div>
              ) : !leaderboard?.entries.length ? (
                <div className="text-center py-20">
                  <Trophy size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-mono text-muted-foreground">No fighters ranked yet.</p>
                  <p className="font-mono text-xs text-muted-foreground/50 mt-2">Win fights to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 font-mono text-[10px] text-white/30 tracking-wider">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">OPERATIVE</div>
                    <div className="col-span-2">RANK</div>
                    <div className="col-span-1 text-center">ELO</div>
                    <div className="col-span-1 text-center">W</div>
                    <div className="col-span-1 text-center">L</div>
                    <div className="col-span-1 text-center">WIN%</div>
                    <div className="col-span-1 text-center">STREAK</div>
                    <div className="col-span-1 text-center">MAIN</div>
                  </div>

                  {leaderboard.entries.map((entry, i) => {
                    const tier = RANK_TIERS[entry.rankTier ?? "bronze"];
                    const isMe = myStats && entry.userId === myStats.userId;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          isMe
                            ? "bg-primary/10 border-primary/30"
                            : i < 3
                            ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30"
                            : "bg-white/[0.02] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="col-span-1 flex items-center">
                          {i === 0 ? <Crown size={16} className="text-amber-400" /> :
                           i === 1 ? <Medal size={16} className="text-gray-300" /> :
                           i === 2 ? <Medal size={16} className="text-orange-400" /> :
                           <span className="font-mono text-sm text-white/40">{entry.rank}</span>}
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <span className="font-mono text-sm text-foreground truncate">
                            {entry.userName || "Unknown"}
                          </span>
                          {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">YOU</span>}
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className={`font-mono text-xs ${tier?.color}`}>{tier?.label}</span>
                        </div>
                        <div className="col-span-1 text-center font-mono text-sm text-amber-400">{entry.elo}</div>
                        <div className="col-span-1 text-center font-mono text-sm text-green-400">{entry.wins}</div>
                        <div className="col-span-1 text-center font-mono text-sm text-red-400">{entry.losses}</div>
                        <div className="col-span-1 text-center font-mono text-sm text-white/60">{entry.winRate}%</div>
                        <div className="col-span-1 text-center font-mono text-sm text-cyan-400">
                          {entry.winStreak > 0 ? `${entry.winStreak}🔥` : "-"}
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          {entry.mainFighter ? (
                            <img
                              src={getFighterImage(entry.mainFighter)}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border border-white/20"
                            />
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {tab === "mystats" && (
            <motion.div key="mystats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {!isAuthenticated ? (
                <div className="text-center py-20 font-mono text-muted-foreground">
                  Log in to view your stats.
                </div>
              ) : !myStats ? (
                <div className="text-center py-20 font-mono text-muted-foreground">Loading stats...</div>
              ) : (
                <div className="space-y-6">
                  {/* Rank Card */}
                  <div className={`rounded-xl border p-6 ${RANK_TIERS[myStats.rankTier ?? "bronze"]?.bg}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-[10px] text-white/40 tracking-wider mb-1">CURRENT RANK</div>
                        <div className={`font-display text-3xl tracking-wider ${RANK_TIERS[myStats.rankTier ?? "bronze"]?.color}`}>
                          {RANK_TIERS[myStats.rankTier ?? "bronze"]?.label}
                        </div>
                        <div className="font-mono text-sm text-amber-400 mt-1">{myStats.elo} ELO</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[10px] text-white/40 tracking-wider mb-1">GLOBAL RANK</div>
                        <div className="font-display text-3xl text-foreground">#{myStats.rank}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "WINS", value: myStats.wins, color: "text-green-400", icon: TrendingUp },
                      { label: "LOSSES", value: myStats.losses, color: "text-red-400", icon: TrendingDown },
                      { label: "WIN RATE", value: `${myStats.winRate}%`, color: "text-cyan-400", icon: BarChart3 },
                      { label: "BEST STREAK", value: myStats.bestStreak, color: "text-amber-400", icon: Flame },
                      { label: "TOTAL KOs", value: myStats.totalKOs, color: "text-purple-400", icon: Zap },
                      { label: "PERFECTS", value: myStats.perfectWins, color: "text-pink-400", icon: Star },
                      { label: "BEST COMBO", value: myStats.bestCombo, color: "text-orange-400", icon: Target },
                      { label: "CUR. STREAK", value: myStats.winStreak, color: "text-emerald-400", icon: Flame },
                    ].map(stat => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon size={12} className={stat.color} />
                            <span className="font-mono text-[9px] text-white/30 tracking-wider">{stat.label}</span>
                          </div>
                          <div className={`font-display text-2xl ${stat.color}`}>{stat.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top Fighters */}
                  {myStats.topFighters && myStats.topFighters.length > 0 && (
                    <div>
                      <h3 className="font-display text-sm tracking-[0.2em] text-white/60 mb-3 flex items-center gap-2">
                        <Users size={14} /> TOP FIGHTERS
                      </h3>
                      <div className="space-y-2">
                        {myStats.topFighters.map((f: { fighter: string; matches: number; wins: number; winRate: number }) => (
                          <div key={f.fighter} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                            <img
                              src={getFighterImage(f.fighter)}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-white/10"
                            />
                            <div className="flex-1">
                              <div className="font-mono text-sm text-foreground">{getFighterName(f.fighter)}</div>
                              <div className="font-mono text-[10px] text-white/40">
                                {f.matches} matches // {f.winRate}% win rate
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm text-green-400">{f.wins}W</div>
                              <div className="font-mono text-[10px] text-red-400/60">{f.matches - f.wins}L</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {!isAuthenticated ? (
                <div className="text-center py-20 font-mono text-muted-foreground">
                  Log in to view match history.
                </div>
              ) : !matchHistory?.matches.length ? (
                <div className="text-center py-20">
                  <History size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-mono text-muted-foreground">No matches yet.</p>
                  <p className="font-mono text-xs text-muted-foreground/50 mt-2">Fight to build your history!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matchHistory.matches.map((match, i) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        match.won
                          ? "bg-green-500/5 border-green-500/10"
                          : "bg-red-500/5 border-red-500/10"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        match.won ? "bg-green-500/20" : "bg-red-500/20"
                      }`}>
                        {match.won ? (
                          <Trophy size={20} className="text-green-400" />
                        ) : (
                          <Minus size={20} className="text-red-400" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={getFighterImage(match.playerFighter)}
                          alt=""
                          className="w-8 h-8 rounded object-cover border border-white/10 flex-shrink-0"
                        />
                        <span className="font-mono text-xs text-white/40">vs</span>
                        <img
                          src={getFighterImage(match.opponentFighter)}
                          alt=""
                          className="w-8 h-8 rounded object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="ml-2 min-w-0">
                          <div className="font-mono text-sm text-foreground truncate">
                            {getFighterName(match.playerFighter)} vs {getFighterName(match.opponentFighter)}
                          </div>
                          <div className="font-mono text-[10px] text-white/30">
                            {match.difficulty} // {match.arena}
                            {match.perfect ? " // PERFECT" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className={`font-mono text-sm ${match.eloChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {match.eloChange >= 0 ? "+" : ""}{match.eloChange} ELO
                        </div>
                        {match.bestCombo > 0 && (
                          <div className="font-mono text-[10px] text-amber-400/60">{match.bestCombo}x combo</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
