/* ═══════════════════════════════════════════════════════
   BOSS MASTERY PAGE — Track kills, earn mastery levels,
   unlock cosmetics, compete on leaderboards
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Skull, Crown, Star, Trophy,
  Shield, Zap, Target, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "mastery" | "leaderboard" | "bosses";

export default function BossMasteryPage() {
  const [tab, setTab] = useState<Tab>("mastery");
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);

  const { data: myMastery, isLoading } = trpc.bossMastery.getMyMastery.useQuery();
  const { data: masteryDefs } = trpc.bossMastery.getMasteryDefs.useQuery();
  const { data: leaderboard } = trpc.bossMastery.getLeaderboard.useQuery(
    { bossKey: selectedBoss || "" },
    { enabled: tab === "leaderboard" && !!selectedBoss }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-chart-4 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Crown size={18} className="text-chart-4" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">BOSS MASTERY</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["mastery", "leaderboard", "bosses"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-chart-4/20 text-chart-4 border border-chart-4/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "mastery" ? "MY MASTERY" : t === "leaderboard" ? "LEADERBOARD" : "ALL BOSSES"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "mastery" && (
          <>
            {myMastery && myMastery.length > 0 ? (
              <div className="space-y-3">
                {myMastery.map((m: any, i: number) => (
                  <motion.div
                    key={m.id || m.bossKey}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                        <Skull size={20} className="text-chart-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-sm font-bold tracking-wide">{m.bossKey}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Level {m.masteryLevel} • {m.totalKills} kills • Best: {m.bestTime || "N/A"}s
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-chart-4 font-bold">LVL {m.masteryLevel}</p>
                      </div>
                    </div>
                    {/* XP Bar */}
                    <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-chart-4 transition-all"
                        style={{ width: `${Math.min(100, ((m.masteryXp || 0) % 1000) / 10)}%` }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-muted-foreground/60 mt-1 text-right">
                      {m.masteryXp || 0} XP
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Crown size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No boss mastery yet</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">Defeat bosses in Cooperative Raids to earn mastery!</p>
              </div>
            )}
          </>
        )}

        {tab === "leaderboard" && (
          <div className="space-y-3">
            {/* Boss selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {masteryDefs?.map((def: any) => (
                <button
                  key={def.key}
                  onClick={() => setSelectedBoss(def.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                    selectedBoss === def.key
                      ? "bg-chart-4/20 text-chart-4 border border-chart-4/30"
                      : "bg-card/30 border border-border/20 text-muted-foreground"
                  }`}
                >
                  {def.name}
                </button>
              ))}
            </div>

            {selectedBoss && leaderboard ? (
              <div className="space-y-2">
                {leaderboard.map((entry: any, i: number) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                  >
                    <span className={`font-display text-sm font-bold w-8 text-center ${
                      i === 0 ? "text-chart-4" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground/60"
                    }`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-mono text-xs font-semibold">Player #{entry.userId}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        LVL {entry.masteryLevel} • {entry.totalKills} kills
                      </p>
                    </div>
                    <span className="font-mono text-xs text-chart-4">{entry.masteryXp} XP</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy size={36} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-mono text-xs text-muted-foreground">Select a boss to view leaderboard</p>
              </div>
            )}
          </div>
        )}

        {tab === "bosses" && (
          <div className="space-y-2">
            {masteryDefs?.map((def: any, i: number) => (
              <motion.div
                key={def.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center">
                  <Skull size={18} className="text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-semibold">{def.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    {def.element} • Tier {def.tier} • {def.maxMasteryLevel || 10} mastery levels
                  </p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/40" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
