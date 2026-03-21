import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Star, Lock, Check, Crown, Gem, Gift, ChevronLeft, ChevronRight,
  Loader2, Zap, Shield, Swords, Trophy
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const TIER_COLORS: Record<string, string> = {
  common: "border-zinc-500/30 bg-zinc-500/5",
  rare: "border-cyan-400/30 bg-cyan-400/5",
  epic: "border-purple-400/30 bg-purple-400/5",
  legendary: "border-amber-400/30 bg-amber-400/5",
  mythic: "border-red-400/30 bg-red-400/5",
};

function getRewardIcon(reward: Record<string, unknown>) {
  if (reward.cardPack) return <Gift size={16} className="text-cyan-400" />;
  if (reward.dream) return <Gem size={16} className="text-purple-400" />;
  if (reward.title) return <Crown size={16} className="text-amber-400" />;
  if (reward.fighter) return <Swords size={16} className="text-red-400" />;
  if (reward.emblem) return <Shield size={16} className="text-green-400" />;
  if (reward.materials) return <Star size={16} className="text-cyan-400" />;
  if (reward.credits) return <Zap size={16} className="text-amber-400" />;
  if (reward.xp) return <Trophy size={16} className="text-blue-400" />;
  return <Gift size={16} className="text-muted-foreground" />;
}

function getRewardLabel(reward: Record<string, unknown>): string {
  const parts: string[] = [];
  if (reward.dream) parts.push(`${reward.dream} Dream`);
  if (reward.credits) parts.push(`${reward.credits} Credits`);
  if (reward.cardPack) parts.push(`${String(reward.cardPack).toUpperCase()} Pack`);
  if (reward.title) parts.push(`Title: ${reward.title}`);
  if (reward.fighter) parts.push(`Fighter: ${reward.fighter}`);
  if (reward.emblem) parts.push(`Emblem: ${reward.emblem}`);
  if (reward.materials) {
    const m = reward.materials as { type: string; amount: number };
    parts.push(`${m.amount}x ${m.type.replace(/_/g, " ")}`);
  }
  if (reward.xp) parts.push(`${reward.xp} XP`);
  return parts.join(" + ") || "Reward";
}

export default function BattlePassPage() {
  const { isAuthenticated } = useAuth();
  const [viewPage, setViewPage] = useState(0); // Each page shows 10 tiers
  const TIERS_PER_PAGE = 10;

  const { data: season } = trpc.battlePass.currentSeason.useQuery();
  const { data: progressData, refetch: refetchProgress } = trpc.battlePass.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const { data: allRewards } = trpc.battlePass.tierRewards.useQuery();

  const claimMut = trpc.battlePass.claimReward.useMutation({
    onSuccess: (data) => {
      refetchProgress();
      toast.success("Reward claimed!", { description: getRewardLabel(data.reward as Record<string, unknown>) });
    },
    onError: (err) => toast.error(err.message),
  });

  const upgradeMut = trpc.battlePass.upgradePremium.useMutation({
    onSuccess: () => {
      refetchProgress();
      toast.success("Premium Pass activated!");
    },
    onError: (err) => toast.error(err.message),
  });

  const progress = progressData?.progress;
  const currentTier = progress?.currentTier || 0;
  const currentXp = progress?.currentXp || 0;
  const isPremium = progress?.isPremium || false;
  const claimedFree = progress?.claimedFreeTiers || [];
  const claimedPremium = progress?.claimedPremiumTiers || [];
  const totalTiers = season?.totalTiers || 50;
  const xpPerTier = season?.xpPerTier || 1000;
  const xpInCurrentTier = currentXp % xpPerTier;
  const xpPercent = Math.min((xpInCurrentTier / xpPerTier) * 100, 100);

  const pageStart = viewPage * TIERS_PER_PAGE + 1;
  const pageEnd = Math.min(pageStart + TIERS_PER_PAGE - 1, totalTiers);
  const totalPages = Math.ceil(totalTiers / TIERS_PER_PAGE);

  const visibleTiers = useMemo(() => {
    const tiers = [];
    for (let i = pageStart; i <= pageEnd; i++) {
      const tierData = allRewards?.[String(i)];
      tiers.push({
        tier: i,
        free: tierData?.free || null,
        premium: tierData?.premium || null,
        reached: i <= currentTier,
        freeClaimed: claimedFree.includes(i),
        premiumClaimed: claimedPremium.includes(i),
      });
    }
    return tiers;
  }, [pageStart, pageEnd, allRewards, currentTier, claimedFree, claimedPremium]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center">
          <Star size={48} className="text-amber-400 mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-xl font-bold mb-2">EPOCH PASS</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to track your pass progress.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all">
            AUTHENTICATE <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="text-amber-400" />
              <h1 className="font-display text-xl font-bold tracking-wider">EPOCH PASS</h1>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {season?.name || "Season 1: Rise of the Panopticon"} — {totalTiers} Tiers
            </p>
          </div>
          {!isPremium && (
            <button
              onClick={() => upgradeMut.mutate()}
              disabled={upgradeMut.isPending}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-400 font-mono text-xs font-bold tracking-wider hover:from-amber-500/30 hover:to-purple-500/30 transition-all"
            >
              {upgradeMut.isPending ? <Loader2 size={14} className="animate-spin" /> : "UPGRADE PREMIUM"}
            </button>
          )}
          {isPremium && (
            <div className="px-3 py-1.5 rounded-md bg-amber-400/10 border border-amber-400/30">
              <span className="font-mono text-xs text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                <Crown size={12} /> PREMIUM
              </span>
            </div>
          )}
        </div>

        {/* XP Progress Bar */}
        <div className="p-4 rounded-lg bg-card/30 border border-border/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-muted-foreground">TIER {currentTier} / {totalTiers}</span>
            <span className="font-mono text-xs text-primary">{xpInCurrentTier.toLocaleString()} / {xpPerTier.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-3 rounded-full bg-secondary/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
            Total XP: {currentXp.toLocaleString()} — {Math.max(0, (currentTier + 1) * xpPerTier - currentXp).toLocaleString()} to next tier
          </p>
        </div>
      </div>

      {/* Tier Grid */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Page Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewPage(Math.max(0, viewPage - 1))}
            disabled={viewPage === 0}
            className="p-2 rounded-md bg-card/30 border border-border/20 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            TIERS {pageStart}–{pageEnd}
          </span>
          <button
            onClick={() => setViewPage(Math.min(totalPages - 1, viewPage + 1))}
            disabled={viewPage >= totalPages - 1}
            className="p-2 rounded-md bg-card/30 border border-border/20 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Tier Rows */}
        <div className="space-y-2">
          {/* Header Row */}
          <div className="grid grid-cols-[60px_1fr_40px_1fr] gap-2 px-2">
            <div />
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider text-center">FREE TRACK</div>
            <div />
            <div className="font-mono text-[10px] text-amber-400/70 tracking-wider text-center">
              <Crown size={10} className="inline mr-1" />PREMIUM
            </div>
          </div>

          {visibleTiers.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-[60px_1fr_40px_1fr] gap-2 items-center ${
                t.reached ? "" : "opacity-50"
              }`}
            >
              {/* Tier Number */}
              <div className={`text-center py-2 rounded-md font-display text-sm font-bold ${
                t.reached ? "text-primary" : "text-muted-foreground"
              }`}>
                {t.tier}
              </div>

              {/* Free Reward */}
              <div className={`p-2 rounded-md border ${
                t.free ? (t.freeClaimed ? "border-green-500/30 bg-green-500/5" : t.reached ? "border-primary/30 bg-primary/5" : "border-border/20 bg-card/20") : "border-border/10 bg-card/10"
              }`}>
                {t.free ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRewardIcon(t.free as Record<string, unknown>)}
                      <span className="font-mono text-[10px] text-foreground/80 truncate">
                        {getRewardLabel(t.free as Record<string, unknown>)}
                      </span>
                    </div>
                    {t.freeClaimed ? (
                      <Check size={14} className="text-green-400 shrink-0" />
                    ) : t.reached ? (
                      <button
                        onClick={() => claimMut.mutate({ tier: t.tier, track: "free" })}
                        disabled={claimMut.isPending}
                        className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[9px] hover:bg-primary/30 shrink-0"
                      >
                        CLAIM
                      </button>
                    ) : (
                      <Lock size={12} className="text-muted-foreground/40 shrink-0" />
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground/30">—</span>
                )}
              </div>

              {/* Center Divider */}
              <div className="flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${t.reached ? "bg-primary" : "bg-muted-foreground/20"}`} />
              </div>

              {/* Premium Reward */}
              <div className={`p-2 rounded-md border ${
                !isPremium ? "border-amber-400/10 bg-amber-400/3" :
                t.premium ? (t.premiumClaimed ? "border-green-500/30 bg-green-500/5" : t.reached ? "border-amber-400/30 bg-amber-400/5" : "border-border/20 bg-card/20") : "border-border/10 bg-card/10"
              }`}>
                {t.premium ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRewardIcon(t.premium as Record<string, unknown>)}
                      <span className="font-mono text-[10px] text-foreground/80 truncate">
                        {getRewardLabel(t.premium as Record<string, unknown>)}
                      </span>
                    </div>
                    {!isPremium ? (
                      <Lock size={12} className="text-amber-400/40 shrink-0" />
                    ) : t.premiumClaimed ? (
                      <Check size={14} className="text-green-400 shrink-0" />
                    ) : t.reached ? (
                      <button
                        onClick={() => claimMut.mutate({ tier: t.tier, track: "premium" })}
                        disabled={claimMut.isPending}
                        className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono text-[9px] hover:bg-amber-400/30 shrink-0"
                      >
                        CLAIM
                      </button>
                    ) : (
                      <Lock size={12} className="text-muted-foreground/40 shrink-0" />
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground/30">—</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
