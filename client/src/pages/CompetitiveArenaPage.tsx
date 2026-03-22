/* ═══════════════════════════════════════════════════════
   COMPETITIVE ARENA — Trophy/League System, Daily Streaks
   Chrono Shards, Raid Leaderboard. RPG stats affect
   league placement and streak rewards.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Trophy, Crown, Star, Flame, Shield,
  Zap, Target, Clock, ChevronRight, Sparkles,
  Calendar, Award, TrendingUp, Medal, ChevronUp,
  ChevronDown, Swords
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LEAGUE_COLORS: Record<string, { text: string; bg: string; border: string; icon: string }> = {
  bronze: { text: "text-amber-600", bg: "bg-amber-900/10", border: "border-amber-600/30", icon: "🥉" },
  silver: { text: "text-zinc-300", bg: "bg-zinc-500/10", border: "border-zinc-400/30", icon: "🥈" },
  gold: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-400/30", icon: "🥇" },
  platinum: { text: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-400/30", icon: "💎" },
  diamond: { text: "text-blue-300", bg: "bg-blue-500/10", border: "border-blue-400/30", icon: "💠" },
  champion: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-400/30", icon: "👑" },
};

function getLeague(trophies: number, thresholds: any[]): string {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (trophies >= thresholds[i].minTrophies) return thresholds[i].league;
  }
  return "bronze";
}

export default function CompetitiveArenaPage() {
  const { data: myTrophies } = trpc.towerDefense.getTrophies.useQuery();
  const [leaderboardLimit] = useState(25);
  const { data: leaderboard } = trpc.towerDefense.getLeaderboard.useQuery({ limit: leaderboardLimit });
  const { data: leagues } = trpc.towerDefense.getLeagueThresholds.useQuery();
  const { data: streak, refetch: refetchStreak } = trpc.towerDefense.getStreak.useQuery();
  const { data: streakRewards } = trpc.towerDefense.getStreakRewards.useQuery();
  const checkIn = trpc.towerDefense.checkIn.useMutation({
    onSuccess: (result) => {
      refetchStreak();
      if (result.success) {
        toast.success(`Day ${result.streak}! +${result.shardsEarned || 0} Chrono Shards${result.usedRepair ? " (streak repaired!)" : ""}`);
      } else {
        toast.info(result.error || "Already checked in today");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const [activeTab, setActiveTab] = useState<"leaderboard" | "streaks" | "leagues">("leaderboard");

  const myLeague = myTrophies && leagues ? getLeague(myTrophies.trophies, leagues) : "bronze";
  const leagueStyle = LEAGUE_COLORS[myLeague] || LEAGUE_COLORS.bronze;

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/ark" className="p-1.5 rounded-lg hover:bg-card/40 transition-colors">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              <Swords size={20} className="text-amber-400" />
              COMPETITIVE <span className="text-amber-400">ARENA</span>
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              Trophies, leagues, streaks, and raid rankings — your RPG build affects everything
            </p>
          </div>
        </div>

        {/* My Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className={`border ${leagueStyle.border} ${leagueStyle.bg} rounded-lg p-3`}>
            <span className="font-mono text-[8px] text-muted-foreground block">LEAGUE</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg">{leagueStyle.icon}</span>
              <span className={`font-display text-sm font-bold capitalize ${leagueStyle.text}`}>
                {myLeague}
              </span>
            </div>
          </div>
          <div className="border border-amber-500/20 bg-amber-950/10 rounded-lg p-3">
            <span className="font-mono text-[8px] text-muted-foreground block">TROPHIES</span>
            <span className="font-display text-xl font-bold text-amber-400 mt-1 block">
              {myTrophies?.trophies || 0}
            </span>
          </div>
          <div className="border border-orange-500/20 bg-orange-950/10 rounded-lg p-3">
            <span className="font-mono text-[8px] text-muted-foreground block">STREAK</span>
            <div className="flex items-center gap-1 mt-1">
              <Flame size={14} className="text-orange-400" />
              <span className="font-display text-xl font-bold text-orange-400">
                {streak?.currentStreak || 0}
              </span>
              <span className="font-mono text-[7px] text-muted-foreground ml-1">days</span>
            </div>
          </div>
          <div className="border border-purple-500/20 bg-purple-950/10 rounded-lg p-3">
            <span className="font-mono text-[8px] text-muted-foreground block">CHRONO SHARDS</span>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles size={14} className="text-purple-400" />
              <span className="font-display text-xl font-bold text-purple-400">
                {streak?.chronoShards || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-4 border-b border-border/20 pb-2">
          {[
            { key: "leaderboard" as const, label: "RAID RANKINGS", icon: TrendingUp, color: "text-amber-400" },
            { key: "streaks" as const, label: "DAILY STREAK", icon: Flame, color: "text-orange-400" },
            { key: "leagues" as const, label: "LEAGUES", icon: Medal, color: "text-purple-400" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
                activeTab === tab.key
                  ? `bg-card/40 border border-border/30 ${tab.color}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ LEADERBOARD TAB ═══ */}
        {activeTab === "leaderboard" && (
          <div>
            <div className="space-y-1">
              {(leaderboard || []).map((entry: any, i: number) => {
                const league = leagues ? getLeague(entry.trophies, leagues) : "bronze";
                const ls = LEAGUE_COLORS[league] || LEAGUE_COLORS.bronze;
                const isMe = myTrophies && entry.userId === myTrophies.userId;

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      isMe
                        ? `${ls.border} ${ls.bg} ring-1 ring-primary/10`
                        : "border-border/10 bg-card/10 hover:bg-card/20"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-amber-500/20 text-amber-400" :
                      i === 1 ? "bg-zinc-400/20 text-zinc-300" :
                      i === 2 ? "bg-amber-700/20 text-amber-600" :
                      "bg-zinc-800/20 text-muted-foreground"
                    }`}>
                      <span className="font-display text-xs font-bold">#{i + 1}</span>
                    </div>
                    <span className="text-sm">{ls.icon}</span>
                    <div className="flex-1">
                      <span className={`font-mono text-xs ${isMe ? "text-primary font-bold" : ""}`}>
                        {entry.displayName || `Player ${entry.userId}`}
                        {isMe && " (You)"}
                      </span>
                      <span className={`font-mono text-[8px] ${ls.text} ml-2 capitalize`}>{league}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono text-[7px] text-muted-foreground block">W/L</span>
                        <span className="font-mono text-[9px]">
                          <span className="text-emerald-400">{entry.wins}</span>
                          /
                          <span className="text-red-400">{entry.losses}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[7px] text-muted-foreground block">Trophies</span>
                        <span className="font-display text-sm font-bold text-amber-400">{entry.trophies}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {(!leaderboard || leaderboard.length === 0) && (
                <div className="border border-border/20 rounded-lg bg-card/20 p-8 text-center">
                  <Trophy size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-mono text-xs text-muted-foreground">
                    No raid rankings yet. Launch raids to earn trophies!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ DAILY STREAK TAB ═══ */}
        {activeTab === "streaks" && (
          <div>
            <div className="border border-orange-500/20 bg-orange-950/10 rounded-xl p-5 mb-6 text-center">
              <Flame size={32} className="text-orange-400 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold mb-1">
                Day <span className="text-orange-400">{streak?.currentStreak || 0}</span> Streak
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground mb-4">
                Longest: {streak?.longestStreak || 0} days • Total check-ins: {streak?.totalCheckIns || 0}
                {(streak?.repairItems ?? 0) > 0 ? ` • Repair items: ${streak?.repairItems}` : ""}
              </p>
              <Button
                className="bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
                onClick={() => checkIn.mutate()}
                disabled={checkIn.isPending}
              >
                {checkIn.isPending ? "Checking in..." : (
                  <>
                    <Calendar size={14} className="mr-1" />
                    Daily Check-In
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-amber-400" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">STREAK REWARDS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(streakRewards || []).map((reward: any, i: number) => {
                const isAchieved = (streak?.currentStreak || 0) > i;
                const isCurrent = (streak?.currentStreak || 0) === i + 1;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`border rounded-lg p-3 text-center transition-all ${
                      isCurrent
                        ? "border-orange-500/40 bg-orange-950/20 ring-1 ring-orange-500/10"
                        : isAchieved
                        ? "border-emerald-500/20 bg-emerald-950/10"
                        : "border-border/10 bg-card/10 opacity-50"
                    }`}
                  >
                    <span className="font-mono text-[8px] text-muted-foreground block mb-1">
                      Day {reward.day}
                    </span>
                    <span className="text-lg block mb-1">{reward.icon || "🎁"}</span>
                    <span className="font-mono text-[9px] font-bold block">{reward.label}</span>
                    {reward.chronoShards && (
                      <span className="font-mono text-[7px] text-purple-400 block mt-0.5">
                        +{reward.chronoShards} shards
                      </span>
                    )}
                    {isAchieved && (
                      <span className="font-mono text-[7px] text-emerald-400 block mt-0.5">Claimed</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ LEAGUES TAB ═══ */}
        {activeTab === "leagues" && (
          <div>
            <div className="space-y-3">
              {(leagues || []).map((league: any, i: number) => {
                const ls = LEAGUE_COLORS[league.league] || LEAGUE_COLORS.bronze;
                const isCurrentLeague = myLeague === league.league;
                const myTrophyCount = myTrophies?.trophies || 0;
                const nextLeague = leagues && leagues[i + 1];
                const progressToNext = nextLeague
                  ? Math.min(1, Math.max(0, (myTrophyCount - league.minTrophies) / (nextLeague.minTrophies - league.minTrophies)))
                  : 1;

                return (
                  <motion.div
                    key={league.league}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`border rounded-lg p-4 transition-all ${
                      isCurrentLeague
                        ? `${ls.border} ${ls.bg} ring-1 ring-primary/10`
                        : "border-border/20 bg-card/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ls.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-display text-sm font-bold capitalize ${ls.text}`}>
                            {league.league}
                          </h3>
                          {isCurrentLeague && (
                            <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {league.minTrophies}+ trophies required
                        </span>
                      </div>
                      {league.rewards && (
                        <div className="text-right">
                          <span className="font-mono text-[8px] text-muted-foreground block">Rewards</span>
                          <span className="font-mono text-[9px] text-amber-400">{league.rewards}</span>
                        </div>
                      )}
                    </div>

                    {isCurrentLeague && nextLeague && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[8px] text-muted-foreground">
                            Progress to {nextLeague.league}
                          </span>
                          <span className="font-mono text-[8px] text-primary">
                            {myTrophyCount}/{nextLeague.minTrophies}
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all"
                            style={{ width: `${progressToNext * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
