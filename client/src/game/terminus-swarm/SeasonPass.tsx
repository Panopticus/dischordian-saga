/* ═══════════════════════════════════════════════════════
   ARK COMMANDER PASS — Season Pass UI
   Free and premium reward tracks with progress display.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Crown, Gift, Sparkles, X, Zap, ChevronRight } from "lucide-react";
import { ARK_COMMANDER_PASS, PREMIUM_PASS_BENEFITS, type SeasonPassTier, type PassReward } from "./baseSystem";

interface SeasonPassProps {
  currentPoints: number;
  isPremium: boolean;
  claimedTiers: Set<number>; // tier numbers already claimed
  onClaimTier: (tier: number) => void;
  onPurchasePremium: () => void;
  onClose: () => void;
}

export default function SeasonPass({ currentPoints, isPremium, claimedTiers, onClaimTier, onPurchasePremium, onClose }: SeasonPassProps) {
  const currentTier = ARK_COMMANDER_PASS.reduce((max, t) => currentPoints >= t.pointsRequired ? t.tier : max, 0);

  const renderReward = (reward: PassReward, locked: boolean) => {
    const items: string[] = [];
    if (reward.salvage) items.push(`${reward.salvage} Salvage`);
    if (reward.viralIchor) items.push(`${reward.viralIchor} Ichor`);
    if (reward.neuralCores) items.push(`${reward.neuralCores} Cores`);
    if (reward.voidCrystals) items.push(`${reward.voidCrystals} Void`);
    if (reward.dream) items.push(`${reward.dream} Dream`);
    if (reward.cardPack) items.push("Card Pack");
    if (reward.speedBoost) items.push(`${reward.speedBoost}h Speed Boost`);
    if (reward.turretSkin) items.push(`Skin: ${reward.turretSkin}`);
    if (reward.title) items.push(`Title: ${reward.title}`);

    return (
      <div className={`text-[9px] font-mono leading-relaxed ${locked ? "text-white/20" : "text-white/60"}`}>
        {items.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[85vh] bg-black/95 border border-amber-500/20 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-400" />
            <h2 className="font-display text-lg tracking-[0.2em] text-amber-400">ARK COMMANDER PASS</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        {/* Points progress */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-white/40">Season Points</span>
            <span className="font-mono text-xs text-amber-400 font-bold">{currentPoints}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
              style={{ width: `${Math.min(100, (currentPoints / 3200) * 100)}%` }} />
          </div>
        </div>

        {/* Premium purchase banner */}
        {!isPremium && (
          <button
            onClick={onPurchasePremium}
            className="mx-4 my-2 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 hover:from-amber-500/30 transition-all"
          >
            <Sparkles size={20} className="text-amber-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-mono text-xs font-bold text-amber-400">UPGRADE TO PREMIUM</p>
              <p className="font-mono text-[10px] text-white/40">20% faster upgrades, 15% more loot, daily card pack, exclusive skins</p>
            </div>
            <ChevronRight size={16} className="text-amber-400/60 shrink-0" />
          </button>
        )}

        {/* Premium benefits */}
        {isPremium && (
          <div className="mx-4 my-2 flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Crown size={14} className="text-amber-400" />
            <span className="font-mono text-[10px] text-amber-400">PREMIUM ACTIVE</span>
            <span className="font-mono text-[9px] text-white/30">+20% speed, +15% loot, daily pack</span>
          </div>
        )}

        {/* Tier list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {ARK_COMMANDER_PASS.map((tier) => {
            const unlocked = currentPoints >= tier.pointsRequired;
            const claimed = claimedTiers.has(tier.tier);
            const canClaim = unlocked && !claimed;

            return (
              <div key={tier.tier}
                className={`flex items-stretch gap-2 rounded-xl border overflow-hidden transition-all ${
                  unlocked ? "border-amber-500/20 bg-white/[0.02]" : "border-white/5 bg-black/20 opacity-50"
                }`}>
                {/* Tier number */}
                <div className={`w-12 flex items-center justify-center font-display text-lg ${
                  unlocked ? "text-amber-400" : "text-white/10"
                }`}>
                  {tier.tier}
                </div>

                {/* Free track */}
                <div className={`flex-1 p-2 border-r border-white/5 ${claimed ? "opacity-50" : ""}`}>
                  <p className="font-mono text-[8px] text-white/20 tracking-wider mb-1">FREE</p>
                  {renderReward(tier.freeReward, !unlocked)}
                </div>

                {/* Premium track */}
                <div className={`flex-1 p-2 ${!isPremium ? "opacity-30" : claimed ? "opacity-50" : ""}`}>
                  <p className="font-mono text-[8px] text-amber-400/40 tracking-wider mb-1 flex items-center gap-1">
                    <Crown size={7} /> PREMIUM
                  </p>
                  {renderReward(tier.premiumReward, !unlocked || !isPremium)}
                  {!isPremium && <Lock size={10} className="text-white/10 mt-1" />}
                </div>

                {/* Claim button */}
                <div className="w-16 flex items-center justify-center">
                  {canClaim ? (
                    <button onClick={() => onClaimTier(tier.tier)}
                      className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                      <Gift size={16} />
                    </button>
                  ) : claimed ? (
                    <span className="text-[9px] text-white/20 font-mono">✓</span>
                  ) : (
                    <span className="text-[9px] text-white/10 font-mono">{tier.pointsRequired}pts</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
