/* ═══════════════════════════════════════════════════════
   COOPERATIVE RAID PAGE — Weekly bosses, guild contributions
   RPG-scaled damage, shared loot
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Skull, Swords, Shield, Heart, Zap,
  Trophy, Star, Clock, Users, ChevronRight, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "bosses" | "active" | "history";

export default function CoopRaidPage() {
  const [tab, setTab] = useState<Tab>("bosses");
  const [selectedBossKey, setSelectedBossKey] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"normal" | "heroic" | "mythic">("normal");

  const { data: availableBosses, isLoading } = trpc.coopRaid.getAvailableBosses.useQuery();
  const { data: activeRaids } = trpc.coopRaid.getActiveRaids.useQuery(undefined, { enabled: tab === "active" || tab === "history" });
  // History: reuse active raids data filtered by status

  const startMut = trpc.coopRaid.startRaid.useMutation({
    onSuccess: () => { toast.success("Raid started! Rally your guild!"); setTab("active"); },
    onError: (e: any) => toast.error(e.message),
  });
  const attackMut = trpc.coopRaid.dealDamage.useMutation({
    onSuccess: (d: any) => toast.success(`Dealt ${d.damageDealt} damage!`),
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
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
          <Skull size={18} className="text-destructive" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">COOPERATIVE RAIDS</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["bosses", "active", "history"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-destructive/20 text-destructive border border-destructive/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "bosses" ? "RAID BOSSES" : t === "active" ? "ACTIVE RAIDS" : "HISTORY"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "bosses" && (
          <>
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
              AVAILABLE BOSSES ({availableBosses?.length || 0})
            </p>
            {availableBosses && availableBosses.length > 0 ? (
              <div className="space-y-3">
                {availableBosses.map((boss: any, i: number) => (
                  <motion.div
                    key={boss.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-lg border p-4 transition-all cursor-pointer ${
                      selectedBossKey === boss.key
                        ? "border-destructive/40 bg-destructive/5"
                        : "border-border/30 bg-card/30 hover:border-destructive/20"
                    }`}
                    onClick={() => setSelectedBossKey(boss.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Skull size={24} className="text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold tracking-wide">{boss.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {boss.element} • Tier {boss.tier} • {boss.minPlayers}-{boss.maxPlayers} players
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground/40" />
                    </div>

                    {selectedBossKey === boss.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-border/20 space-y-3"
                      >
                        <p className="font-mono text-xs text-muted-foreground">{boss.description}</p>

                        {/* Difficulty selector */}
                        <div>
                          <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">DIFFICULTY</p>
                          <div className="flex gap-2">
                            {(["normal", "heroic", "mythic"] as const).map(d => (
                              <button
                                key={d}
                                onClick={(e) => { e.stopPropagation(); setDifficulty(d); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                                  difficulty === d
                                    ? d === "mythic" ? "bg-chart-4/20 text-chart-4 border border-chart-4/30"
                                    : d === "heroic" ? "bg-accent/20 text-accent border border-accent/30"
                                    : "bg-primary/20 text-primary border border-primary/30"
                                    : "bg-card/30 border border-border/20 text-muted-foreground"
                                }`}
                              >
                                {d.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Boss stats */}
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                          <div className="rounded-md bg-muted/10 p-2">
                            <p className="text-muted-foreground/60 text-[10px]">HP</p>
                            <p className="text-destructive font-bold">{(boss.hp?.[difficulty] || boss.hp?.normal || 10000).toLocaleString()}</p>
                          </div>
                          <div className="rounded-md bg-muted/10 p-2">
                            <p className="text-muted-foreground/60 text-[10px]">ATTACK</p>
                            <p className="text-accent font-bold">{boss.attack || "?"}</p>
                          </div>
                          <div className="rounded-md bg-muted/10 p-2">
                            <p className="text-muted-foreground/60 text-[10px]">DEFENSE</p>
                            <p className="text-primary font-bold">{boss.defense || "?"}</p>
                          </div>
                        </div>

                        {/* Loot preview */}
                        {boss.loot && (
                          <div>
                            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-1">LOOT TABLE</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(boss.loot).map(([key, val]: [string, any]) => (
                                <span key={key} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-mono">
                                  {key}: {typeof val === "object" ? `${val.min}-${val.max}` : val}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            startMut.mutate({ bossKey: boss.key, difficulty });
                          }}
                          disabled={startMut.isPending}
                        >
                          <Swords size={14} className="mr-1" />
                          {startMut.isPending ? "Starting..." : `START ${difficulty.toUpperCase()} RAID`}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Skull size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No bosses available this week</p>
              </div>
            )}
          </>
        )}

        {tab === "active" && (
          <div className="space-y-3">
            {activeRaids && activeRaids.length > 0 ? (
              activeRaids.map((raid: any, i: number) => {
                const hpPercent = raid.currentHp > 0 ? Math.round((raid.currentHp / raid.maxHp) * 100) : 0;
                return (
                  <motion.div
                    key={raid.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-lg border border-destructive/20 bg-card/40 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <Skull size={20} className="text-destructive" />
                      <div className="flex-1">
                        <p className="font-display text-sm font-bold">{raid.bossKey}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {raid.difficulty} • {raid.participants || 0} participants
                        </p>
                      </div>
                      <span className={`font-mono text-xs font-bold ${hpPercent > 50 ? "text-destructive" : hpPercent > 20 ? "text-accent" : "text-primary"}`}>
                        {hpPercent}% HP
                      </span>
                    </div>

                    {/* HP Bar */}
                    <div className="h-3 rounded-full bg-muted/20 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          hpPercent > 50 ? "bg-destructive" : hpPercent > 20 ? "bg-accent" : "bg-primary"
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => attackMut.mutate({ raidId: raid.id })}
                      disabled={attackMut.isPending || raid.currentHp <= 0}
                    >
                      <Swords size={12} className="mr-1" />
                      {attackMut.isPending ? "Attacking..." : raid.currentHp <= 0 ? "DEFEATED" : "ATTACK BOSS"}
                    </Button>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <Target size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No active raids</p>
                <Button size="sm" className="mt-4" onClick={() => setTab("bosses")}>
                  Start a Raid
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2">
            {activeRaids && activeRaids.filter((r: any) => r.status === "completed" || r.status === "failed").length > 0 ? (
              activeRaids.filter((r: any) => r.status === "completed" || r.status === "failed").map((raid: any, i: number) => (
                <motion.div
                  key={raid.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    raid.status === "completed" ? "bg-primary/10" : "bg-destructive/10"
                  }`}>
                    {raid.status === "completed" ? <Trophy size={14} className="text-primary" /> : <Skull size={14} className="text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold">{raid.bossKey} ({raid.difficulty})</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {new Date(raid.completedAt || raid.createdAt).toLocaleDateString()} • {raid.status}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Clock size={36} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-mono text-xs text-muted-foreground">No raid history yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
