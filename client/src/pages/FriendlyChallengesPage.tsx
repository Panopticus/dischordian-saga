/* ═══════════════════════════════════════════════════════
   FRIENDLY CHALLENGES PAGE — Unranked matches, custom rules
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Swords, Plus, Clock, Check, X,
  Trophy, Target, Zap, Star, Users, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "challenges" | "daily" | "create";

export default function FriendlyChallengesPage() {
  const [tab, setTab] = useState<Tab>("challenges");
  const [opponentId, setOpponentId] = useState("");
  const [gameType, setGameType] = useState("card_battle");

  const { data: myChallenges, isLoading, refetch } = trpc.friendlyChallenge.getMyChallenges.useQuery({});
  const { data: dailyChallenge } = trpc.friendlyChallenge.getDailyChallenge.useQuery(undefined, { enabled: tab === "daily" });
  const allTraitBonuses = trpc.nft.getAllTraitBonuses.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const friendlyBonuses = allTraitBonuses.data?.friendlyChallenge;

  const createMut = trpc.friendlyChallenge.createChallenge.useMutation({
    onSuccess: () => { toast.success("Challenge sent!"); refetch(); setTab("challenges"); },
    onError: (e: any) => toast.error(e.message),
  });
  const acceptMut = trpc.friendlyChallenge.acceptChallenge.useMutation({
    onSuccess: () => { toast.success("Challenge accepted!"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  // Decline = complete with status decline (no separate endpoint)
  const handleDecline = (id: number) => toast.info("Challenge declined (feature coming soon)");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <Swords size={18} className="text-accent" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">FRIENDLY CHALLENGES</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["challenges", "daily", "create"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-accent/20 text-accent border border-accent/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "challenges" ? "MY CHALLENGES" : t === "daily" ? "DAILY" : "CREATE"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {/* RPG Bonuses */}
        {friendlyBonuses && friendlyBonuses.breakdown.length > 0 && (
          <div className="border border-accent/20 rounded-lg bg-accent/5 p-4">
            <h3 className="font-display text-xs font-bold tracking-[0.15em] mb-2 flex items-center gap-2">
              <Zap size={12} className="text-accent" />
              CHALLENGE BONUSES
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {friendlyBonuses.xpMultiplier > 1 && (
                <div className="border border-primary/20 bg-primary/5 rounded p-2 text-center">
                  <p className="font-display text-sm font-bold text-primary">+{Math.round((friendlyBonuses.xpMultiplier - 1) * 100)}%</p>
                  <p className="font-mono text-[8px] text-muted-foreground">XP</p>
                </div>
              )}
              {friendlyBonuses.dreamMultiplier > 1 && (
                <div className="border border-amber-500/20 bg-amber-500/5 rounded p-2 text-center">
                  <p className="font-display text-sm font-bold text-amber-400">x{friendlyBonuses.dreamMultiplier.toFixed(1)}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">DREAM TOKENS</p>
                </div>
              )}
              {friendlyBonuses.dailyChallengeBonus > 0 && (
                <div className="border border-green-500/20 bg-green-500/5 rounded p-2 text-center">
                  <p className="font-display text-sm font-bold text-green-400">+{Math.round(friendlyBonuses.dailyChallengeBonus * 100)}%</p>
                  <p className="font-mono text-[8px] text-muted-foreground">DAILY BONUS</p>
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              {friendlyBonuses.breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-accent">▸</span>
                  <span className="text-muted-foreground">{b.source}:</span>
                  <span className="text-foreground">{b.effect}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "challenges" && (
          <>
            {(!myChallenges || myChallenges.length === 0) ? (
              <div className="text-center py-16">
                <Swords size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No challenges yet</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">Create a challenge or wait for one!</p>
                <Button size="sm" className="mt-4" onClick={() => setTab("create")}>
                  <Plus size={12} className="mr-1" /> Create Challenge
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {myChallenges.map((ch: any, i: number) => (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        ch.status === "pending" ? "bg-accent/10" : ch.status === "accepted" ? "bg-primary/10" : "bg-muted/10"
                      }`}>
                        {ch.status === "pending" ? <Clock size={16} className="text-accent" /> :
                         ch.status === "accepted" ? <Check size={16} className="text-primary" /> :
                         <X size={16} className="text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs font-semibold">
                          {ch.gameType} Challenge
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          vs Player #{ch.challengedId} • {ch.status}
                        </p>
                      </div>
                      {ch.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acceptMut.mutate({ challengeId: ch.id })}
                            disabled={acceptMut.isPending}
                          >
                            <Check size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDecline(ch.id)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "daily" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-accent/20 bg-card/50 p-5 text-center space-y-4"
          >
            <Star size={32} className="mx-auto text-accent" />
            <h3 className="font-display text-sm font-bold tracking-wide">CHALLENGE OF THE DAY</h3>
            {dailyChallenge ? (
              <>
                <p className="font-mono text-xs text-muted-foreground">{dailyChallenge.title}</p>
                <p className="font-mono text-xs text-foreground">{dailyChallenge.description}</p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono">
                  <span className="text-accent">Type: {dailyChallenge.gameType}</span>
                  <span className="text-primary">Reward: {dailyChallenge.reward.amount} {dailyChallenge.reward.type}</span>
                </div>
              </>
            ) : (
              <p className="font-mono text-xs text-muted-foreground">Loading daily challenge...</p>
            )}
          </motion.div>
        )}

        {tab === "create" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/20 bg-card/50 p-5 space-y-4"
          >
            <h3 className="font-display text-sm font-bold tracking-wide flex items-center gap-2">
              <Plus size={14} className="text-primary" />
              CREATE CHALLENGE
            </h3>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground/60 tracking-wider block mb-1">OPPONENT USER ID</label>
              <input
                type="text"
                value={opponentId}
                onChange={(e) => setOpponentId(e.target.value)}
                placeholder="Enter opponent's user ID..."
                className="w-full px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground/60 tracking-wider block mb-1">GAME TYPE</label>
              <div className="flex gap-2 flex-wrap">
                {["card_battle", "tower_defense", "chess", "pvp"].map(gt => (
                  <button
                    key={gt}
                    onClick={() => setGameType(gt)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                      gameType === gt ? "bg-primary/20 text-primary border border-primary/30" : "bg-card/30 border border-border/20 text-muted-foreground"
                    }`}
                  >
                    {gt.replace(/_/g, " ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!opponentId || isNaN(Number(opponentId))) {
                  toast.error("Enter a valid user ID");
                  return;
                }
                createMut.mutate({
                  opponentId: Number(opponentId),
                  gameType,
                });
              }}
              disabled={createMut.isPending}
            >
              <Swords size={14} className="mr-1" />
              {createMut.isPending ? "Sending..." : "Send Challenge"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
