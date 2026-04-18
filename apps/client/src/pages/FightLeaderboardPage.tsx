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
  grandmaster: { label: "GRANDMASTER", color: "void-text-accent", bg: "void-bg-sunk void-border", min: 2200 },
  master: { label: "MASTER", color: "void-text-system", bg: "void-bg-system void-border-system", min: 1900 },
  diamond: { label: "DIAMOND", color: "void-text-energy", bg: "void-bg-success void-border-success", min: 1600 },
  platinum: { label: "PLATINUM", color: "void-text-energy", bg: "void-bg-success void-border-success", min: 1400 },
  gold: { label: "GOLD", color: "void-text-premium", bg: "void-bg-sunk void-border", min: 1200 },
  silver: { label: "SILVER", color: "text-muted-foreground", bg: "void-bg-canvas void-border", min: 1000 },
  bronze: { label: "BRONZE", color: "void-text-premium", bg: "void-bg-sunk void-border", min: 0 },
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
      <div className="border-b border-border/60 bg-muted/60">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fight" className="text-muted-foreground/70 hover:text-foreground transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="font-display text-lg tracking-[0.2em] text-foreground flex items-center gap-2">
                  <Trophy size={18} className="void-text-accent" />
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
                <div className="font-mono text-sm void-text-accent">{myStats.elo} ELO</div>
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
                      ? "bg-muted/50 text-foreground border-b-2 border-primary"
                      : "text-muted-foreground/60 hover:text-muted-foreground/80"
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
                  <Trophy size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                  <p className="font-mono text-muted-foreground">No fighters ranked yet.</p>
                  <p className="font-mono text-xs text-muted-foreground/50 mt-2">Win fights to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 font-mono text-[10px] text-muted-foreground/50 tracking-wider">
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
                            ? "void-bg-sunk void-border void-border"
                            : "bg-muted/15 border-border/40 hover:border-border/80"
                        }`}
                      >
                        <div className="col-span-1 flex items-center">
                          {i === 0 ? <Crown size={16} className="void-text-accent" /> :
                           i === 1 ? <Medal size={16} className="text-muted-foreground" /> :
                           i === 2 ? <Medal size={16} className="void-text-premium" /> :
                           <span className="font-mono text-sm text-muted-foreground/60">{entry.rank}</span>}
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
                        <div className="col-span-1 text-center font-mono text-sm void-text-accent">{entry.elo}</div>
                        <div className="col-span-1 text-center font-mono text-sm void-text-energy">{entry.wins}</div>
                        <div className="col-span-1 text-center font-mono text-sm void-text-error">{entry.losses}</div>
                        <div className="col-span-1 text-center font-mono text-sm text-muted-foreground/80">{entry.winRate}%</div>
                        <div className="col-span-1 text-center font-mono text-sm void-text-energy">
                          {entry.winStreak > 0 ? `${entry.winStreak}🔥` : "-"}
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          {entry.mainFighter ? (
                            <img
                              src={getFighterImage(entry.mainFighter)}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <span className="text-muted-foreground/35">-</span>
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
                        <div className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-1">CURRENT RANK</div>
                        <div className={`font-display text-3xl tracking-wider ${RANK_TIERS[myStats.rankTier ?? "bronze"]?.color}`}>
                          {RANK_TIERS[myStats.rankTier ?? "bronze"]?.label}
                        </div>
                        <div className="font-mono text-sm void-text-accent mt-1">{myStats.elo} ELO</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-1">GLOBAL RANK</div>
                        <div className="font-display text-3xl text-foreground">#{myStats.rank}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "WINS", value: myStats.wins, color: "void-text-energy", icon: TrendingUp },
                      { label: "LOSSES", value: myStats.losses, color: "void-text-error", icon: TrendingDown },
                      { label: "WIN RATE", value: `${myStats.winRate}%`, color: "void-text-energy", icon: BarChart3 },
                      { label: "BEST STREAK", value: myStats.bestStreak, color: "void-text-accent", icon: Flame },
                      { label: "TOTAL KOs", value: myStats.totalKOs, color: "void-text-system", icon: Zap },
                      { label: "PERFECTS", value: myStats.perfectWins, color: "void-text-error", icon: Star },
                      { label: "BEST COMBO", value: myStats.bestCombo, color: "void-text-premium", icon: Target },
                      { label: "CUR. STREAK", value: myStats.winStreak, color: "void-text-energy", icon: Flame },
                    ].map(stat => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="void-surface p-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon size={12} className={stat.color} />
                            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">{stat.label}</span>
                          </div>
                          <div className={`font-display text-2xl ${stat.color}`}>{stat.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top Fighters */}
                  {myStats.topFighters && myStats.topFighters.length > 0 && (
                    <div>
                      <h3 className="font-display text-sm tracking-[0.2em] text-muted-foreground/80 mb-3 flex items-center gap-2">
                        <Users size={14} /> TOP FIGHTERS
                      </h3>
                      <div className="space-y-2">
                        {myStats.topFighters.map((f: { fighter: string; matches: number; wins: number; winRate: number }) => (
                          <div key={f.fighter} className="flex items-center gap-3 void-surface p-3">
                            <img
                              src={getFighterImage(f.fighter)}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-border/60"
                            />
                            <div className="flex-1">
                              <div className="font-mono text-sm text-foreground">{getFighterName(f.fighter)}</div>
                              <div className="font-mono text-[10px] text-muted-foreground/60">
                                {f.matches} matches // {f.winRate}% win rate
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm void-text-energy">{f.wins}W</div>
                              <div className="font-mono text-[10px] void-text-error">{f.matches - f.wins}L</div>
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
                  <History size={48} className="mx-auto text-muted-foreground/20 mb-4" />
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
                          ? "void-bg-success void-border-success"
                          : "void-bg-error void-border-error"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        match.won ? "void-bg-success" : "void-bg-error"
                      }`}>
                        {match.won ? (
                          <Trophy size={20} className="void-text-energy" />
                        ) : (
                          <Minus size={20} className="void-text-error" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={getFighterImage(match.playerFighter)}
                          alt=""
                          className="w-8 h-8 rounded object-cover border border-border/60 flex-shrink-0"
                        />
                        <span className="font-mono text-xs text-muted-foreground/60">vs</span>
                        <img
                          src={getFighterImage(match.opponentFighter)}
                          alt=""
                          className="w-8 h-8 rounded object-cover border border-border/60 flex-shrink-0"
                        />
                        <div className="ml-2 min-w-0">
                          <div className="font-mono text-sm text-foreground truncate">
                            {getFighterName(match.playerFighter)} vs {getFighterName(match.opponentFighter)}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground/50">
                            {match.difficulty} // {match.arena}
                            {match.perfect ? " // PERFECT" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className={`font-mono text-sm ${match.eloChange >= 0 ? "void-text-energy" : "void-text-error"}`}>
                          {match.eloChange >= 0 ? "+" : ""}{match.eloChange} ELO
                        </div>
                        {match.bestCombo > 0 && (
                          <div className="font-mono text-[10px] void-text-accent">{match.bestCombo}x combo</div>
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
