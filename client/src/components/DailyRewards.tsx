/* ═══════════════════════════════════════════════════════
   DAILY LOGIN REWARDS — 30-day reward cycle
   Claim daily rewards for logging in. Escalating value.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star, X, Sparkles, Package } from "lucide-react";
import { DAILY_LOGIN_REWARDS } from "@/game/unifiedEconomy";

interface DailyRewardsProps {
  currentDay: number;    // Which day of the cycle (1-30)
  claimedToday: boolean; // Has today's reward been claimed?
  onClaim: () => void;   // Called when player claims
  onClose: () => void;
}

export default function DailyRewards({ currentDay, claimedToday, onClaim, onClose }: DailyRewardsProps) {
  const todayReward = DAILY_LOGIN_REWARDS.find(r => r.day === currentDay);
  const nextReward = DAILY_LOGIN_REWARDS.find(r => r.day > currentDay);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/95 border border-amber-500/20 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-amber-400" />
            <h2 className="font-display text-lg tracking-[0.2em] text-amber-400">DAILY REWARDS</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        {/* Current day */}
        <div className="p-4 text-center">
          <p className="font-mono text-[10px] text-white/30 tracking-wider">DAY {currentDay} OF 30</p>
          <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
              style={{ width: `${(currentDay / 30) * 100}%` }} />
          </div>
        </div>

        {/* Today's reward */}
        {todayReward && (
          <div className="px-4 pb-4">
            <div className={`p-4 rounded-xl border ${claimedToday ? "border-white/10 bg-white/[0.02] opacity-50" : "border-amber-500/40 bg-amber-500/5"}`}>
              <p className="font-mono text-xs text-amber-400 font-bold mb-2">
                {claimedToday ? "CLAIMED TODAY" : "TODAY'S REWARD"}
              </p>
              <div className="flex flex-wrap gap-2">
                {todayReward.reward.dream && (
                  <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-xs">
                    +{todayReward.reward.dream} Dream
                  </span>
                )}
                {todayReward.reward.salvage && (
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs">
                    +{todayReward.reward.salvage} Salvage
                  </span>
                )}
                {todayReward.reward.voidCrystals && (
                  <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center gap-1">
                    <Sparkles size={10} /> +{todayReward.reward.voidCrystals} Void Crystals
                  </span>
                )}
                {todayReward.reward.cardPack && (
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 font-mono text-xs flex items-center gap-1">
                    <Package size={10} /> Card Pack
                  </span>
                )}
              </div>

              {!claimedToday && (
                <button onClick={onClaim}
                  className="w-full mt-3 py-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-sm font-bold hover:bg-amber-500/30 transition-colors">
                  CLAIM REWARD
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reward timeline */}
        <div className="px-4 pb-4">
          <p className="font-mono text-[9px] text-white/20 tracking-wider mb-2">UPCOMING</p>
          <div className="grid grid-cols-5 gap-1.5">
            {DAILY_LOGIN_REWARDS.map(reward => {
              const isPast = reward.day < currentDay;
              const isToday = reward.day === currentDay;
              const hasVoid = !!reward.reward.voidCrystals;
              const hasPack = !!reward.reward.cardPack;

              return (
                <div key={reward.day}
                  className={`p-1.5 rounded text-center transition-all ${
                    isToday ? "bg-amber-500/20 border border-amber-500/40 scale-110" :
                    isPast ? "bg-white/[0.02] opacity-30" :
                    hasVoid ? "bg-cyan-500/5 border border-cyan-500/10" :
                    hasPack ? "bg-purple-500/5 border border-purple-500/10" :
                    "bg-white/[0.02] border border-white/5"
                  }`}>
                  <p className="font-mono text-[8px] text-white/30">{reward.day}</p>
                  <p className={`font-mono text-[9px] font-bold ${
                    hasVoid ? "text-cyan-400" : hasPack ? "text-purple-400" : "text-amber-400/60"
                  }`}>
                    {hasVoid ? `💎${reward.reward.voidCrystals}` :
                     hasPack ? "📦" :
                     reward.reward.dream ? `${reward.reward.dream}D` :
                     `${reward.reward.salvage}S`}
                  </p>
                  {isPast && <span className="text-[7px] text-green-400">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Check if daily reward is available.
 * Returns { available, currentDay, claimedToday }
 */
export function checkDailyReward(): { available: boolean; currentDay: number; claimedToday: boolean } {
  const data = JSON.parse(localStorage.getItem("daily_rewards") || "{}");
  const today = new Date().toDateString();
  const lastClaim = data.lastClaimDate || "";
  const streak = data.streak || 0;
  const currentDay = Math.min(30, (streak % 30) + 1);

  return {
    available: lastClaim !== today,
    currentDay,
    claimedToday: lastClaim === today,
  };
}

/**
 * Claim today's reward. Returns the reward object.
 */
export function claimDailyReward(): { dream: number; salvage: number; voidCrystals: number } {
  const data = JSON.parse(localStorage.getItem("daily_rewards") || "{}");
  const today = new Date().toDateString();
  const streak = (data.streak || 0) + 1;
  const currentDay = Math.min(30, (streak % 30));

  const reward = DAILY_LOGIN_REWARDS.find(r => r.day === currentDay) || DAILY_LOGIN_REWARDS[0];

  localStorage.setItem("daily_rewards", JSON.stringify({
    lastClaimDate: today,
    streak,
    totalClaims: (data.totalClaims || 0) + 1,
  }));

  return {
    dream: reward.reward.dream || 0,
    salvage: reward.reward.salvage || 0,
    voidCrystals: reward.reward.voidCrystals || 0,
  };
}
