/* ═══════════════════════════════════════════════════════
   MORALITY MILESTONE REWARDS — Claim bonus items/cards
   at morality tier thresholds
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Cpu, Heart, Shield, Check, Star, Coins, Sparkles, BookOpen } from "lucide-react";
import { MORALITY_MILESTONE_REWARDS, getUnclaimedMilestones, type MoralityMilestoneReward } from "@shared/moralityThemes";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

export function MoralityMilestoneRewards() {
  const { state, unlockMoralityReward } = useGame();
  const score = state.moralityScore;
  const claimedMilestones: string[] = (state as any).claimedMoralityMilestones || state.moralityUnlocks || [];

  const unclaimed = getUnclaimedMilestones(score, claimedMilestones);
  const allMilestones = MORALITY_MILESTONE_REWARDS;

  const handleClaim = (milestone: MoralityMilestoneReward) => {
    const key = `${milestone.side}_${Math.abs(milestone.scoreThreshold)}`;
    // Dispatch rewards
    let totalCredits = 0;
    let totalXp = 0;
    let totalDT = 0;
    for (const r of milestone.rewards) {
      if (r.type === "credits") totalCredits += r.quantity;
      if (r.type === "xp") totalXp += r.quantity;
      if (r.type === "dream_tokens") totalDT += r.quantity;
    }
    // Mark as claimed via morality unlock system
    unlockMoralityReward(key);
    toast.success(`Claimed ${milestone.tierName} rewards!`, {
      description: milestone.rewards.map(r => `${r.name} x${r.quantity}`).join(", "),
    });
  };

  const isClaimable = (m: MoralityMilestoneReward) => {
    const key = `${m.side}_${Math.abs(m.scoreThreshold)}`;
    if (claimedMilestones.includes(key)) return false;
    if (m.side === "machine") return score <= m.scoreThreshold;
    if (m.side === "humanity") return score >= m.scoreThreshold;
    return false;
  };

  const isClaimed = (m: MoralityMilestoneReward) => {
    const key = `${m.side}_${Math.abs(m.scoreThreshold)}`;
    return claimedMilestones.includes(key);
  };

  const rewardIcon = (type: string) => {
    switch (type) {
      case "card": return <Star size={10} className="text-amber-400" />;
      case "credits": return <Coins size={10} className="text-yellow-400" />;
      case "xp": return <Sparkles size={10} className="text-cyan-400" />;
      case "dream_tokens": return <BookOpen size={10} className="text-purple-400" />;
      case "item": return <Gift size={10} className="text-green-400" />;
      case "title": return <Shield size={10} className="text-blue-400" />;
      default: return <Gift size={10} />;
    }
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-card/50">
        <div className="flex items-center gap-2">
          <Gift size={14} className="text-accent" />
          <span className="font-display text-xs font-bold tracking-[0.15em]">MORALITY MILESTONES</span>
        </div>
        {unclaimed.length > 0 && (
          <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-mono animate-pulse">
            {unclaimed.length} UNCLAIMED
          </span>
        )}
      </div>

      <div className="p-3 space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin">
        {allMilestones.map((m) => {
          const claimed = isClaimed(m);
          const claimable = isClaimable(m);
          return (
            <div
              key={`${m.side}_${m.scoreThreshold}`}
              className={`rounded-md border p-3 transition-all ${
                claimable ? "border-accent/50 bg-accent/10 ring-1 ring-accent/20" :
                claimed ? "border-border/20 bg-card/10 opacity-60" :
                "border-border/10 bg-card/5 opacity-40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {m.side === "machine" ? <Cpu size={12} className="text-red-400" /> :
                   <Heart size={12} className="text-green-400" />}
                  <span className="font-mono text-xs font-semibold">{m.tierName}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    ({m.scoreThreshold > 0 ? "+" : ""}{m.scoreThreshold})
                  </span>
                </div>
                {claimed ? (
                  <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                    <Check size={8} /> CLAIMED
                  </span>
                ) : claimable ? (
                  <button
                    onClick={() => handleClaim(m)}
                    className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded font-mono hover:bg-accent/30 transition-colors animate-pulse"
                  >
                    CLAIM
                  </button>
                ) : (
                  <span className="text-[9px] text-muted-foreground/50 font-mono">LOCKED</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.rewards.map((r, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-[9px] font-mono bg-background/30 px-1.5 py-0.5 rounded border border-border/10"
                  >
                    {rewardIcon(r.type)}
                    {r.name} x{r.quantity}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoralityMilestoneRewards;
