/* ═══════════════════════════════════════════════════════
   QUEST TRACKER — Cross-game quest progress display
   Shows daily, weekly, and epoch quests with progress
   bars, rewards, and claim buttons.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Clock, Calendar, Trophy, Star, Gift,
  ChevronDown, ChevronUp, Sparkles, X, Medal,
} from "lucide-react";
import {
  getDailyQuests, getWeeklyQuests, EPOCH_QUESTS, ACHIEVEMENTS,
  TITLES, type QuestDef, type QuestProgress, type AchievementDef,
} from "./quests";

interface QuestTrackerProps {
  /** Current progress for each quest (keyed by quest ID) */
  progress: Record<string, QuestProgress>;
  /** Called when player claims a quest reward */
  onClaimReward: (questId: string) => void;
  /** Called to close the tracker */
  onClose: () => void;
  /** Player's current title */
  currentTitle?: string;
  /** Called when player selects a title */
  onSelectTitle?: (titleId: string) => void;
}

type Tab = "daily" | "weekly" | "epoch" | "achievements" | "titles";

const TAB_CONFIG: { id: Tab; label: string; icon: typeof Target }[] = [
  { id: "daily", label: "DAILY", icon: Clock },
  { id: "weekly", label: "WEEKLY", icon: Calendar },
  { id: "epoch", label: "EPOCH", icon: Star },
  { id: "achievements", label: "ACHIEVE", icon: Trophy },
  { id: "titles", label: "TITLES", icon: Medal },
];

const GAME_COLORS: Record<string, string> = {
  terminus: "#ff4444",
  dischordia: "#00bcd4",
  chess: "#ffd700",
  fight: "#ff6600",
  any: "#aa88ff",
};

const TIER_COLORS: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  diamond: "#b388ff",
  legendary: "#ff4444",
};

export default function QuestTracker({ progress, onClaimReward, onClose, currentTitle, onSelectTitle }: QuestTrackerProps) {
  const [tab, setTab] = useState<Tab>("daily");
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

  const dailyQuests = getDailyQuests();
  const weeklyQuests = getWeeklyQuests();

  const getQuestProgress = (questId: string): QuestProgress => {
    return progress[questId] || { questId, progress: 0, completed: false, claimedReward: false, startedAt: Date.now(), expiresAt: Date.now() + 86400000 };
  };

  const renderQuestCard = (quest: QuestDef, index: number) => {
    const prog = getQuestProgress(quest.id);
    const pct = Math.min(100, (prog.progress / quest.requirement.count) * 100);
    const isExpanded = expandedQuest === quest.id;
    const gameColor = GAME_COLORS[quest.game] || GAME_COLORS.any;

    return (
      <motion.div
        key={quest.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl border overflow-hidden transition-all ${
          prog.claimedReward ? "border-white/5 bg-white/[0.01] opacity-50" :
          prog.completed ? "border-emerald-500/40 bg-emerald-500/5" :
          "border-white/10 bg-white/[0.02]"
        }`}
      >
        <button
          onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
          className="w-full flex items-center gap-3 p-3 text-left"
        >
          {/* Game indicator */}
          <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: gameColor }} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs font-bold text-white/90 truncate">{quest.name}</p>
              {prog.completed && !prog.claimedReward && (
                <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold">COMPLETE</span>
              )}
              {prog.claimedReward && (
                <span className="shrink-0 px-1.5 py-0.5 rounded bg-white/10 text-white/30 text-[8px] font-mono">CLAIMED</span>
              )}
            </div>
            <p className="font-mono text-[10px] text-white/40 truncate">{quest.description}</p>

            {/* Progress bar */}
            <div className="mt-1.5 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: prog.completed ? "#22c55e" : gameColor,
                }}
              />
            </div>
            <p className="font-mono text-[9px] text-white/20 mt-0.5">{prog.progress}/{quest.requirement.count}</p>
          </div>

          {isExpanded ? <ChevronUp size={12} className="text-white/20 shrink-0" /> : <ChevronDown size={12} className="text-white/20 shrink-0" />}
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 px-3 py-2 space-y-2"
            >
              {quest.loreText && (
                <p className="text-[10px] text-white/30 italic">{quest.loreText}</p>
              )}

              {/* Rewards */}
              <div className="flex flex-wrap gap-1.5">
                {quest.reward.salvage && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">{quest.reward.salvage} Salvage</span>
                )}
                {quest.reward.viralIchor && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-mono">{quest.reward.viralIchor} Ichor</span>
                )}
                {quest.reward.neuralCores && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">{quest.reward.neuralCores} Cores</span>
                )}
                {quest.reward.voidCrystals && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">{quest.reward.voidCrystals} Void</span>
                )}
                {quest.reward.dream && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">{quest.reward.dream} Dream</span>
                )}
                {quest.reward.xp && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{quest.reward.xp} XP</span>
                )}
                {quest.reward.titleUnlock && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono flex items-center gap-1">
                    <Medal size={8} /> {quest.reward.titleUnlock}
                  </span>
                )}
                {quest.reward.cardPack && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono flex items-center gap-1">
                    <Gift size={8} /> Card Pack
                  </span>
                )}
              </div>

              {/* Claim button */}
              {prog.completed && !prog.claimedReward && (
                <button
                  onClick={(e) => { e.stopPropagation(); onClaimReward(quest.id); }}
                  className="w-full py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles size={12} /> CLAIM REWARD
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderAchievement = (ach: AchievementDef, index: number) => {
    const prog = getQuestProgress(ach.id);
    const pct = Math.min(100, (prog.progress / ach.requirement.count) * 100);
    const tierColor = TIER_COLORS[ach.tier] || TIER_COLORS.bronze;

    return (
      <motion.div
        key={ach.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`flex items-center gap-3 p-3 rounded-xl border ${
          prog.completed ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.01]"
        }`}
      >
        <span className="text-xl">{ach.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs font-bold text-white/80">{ach.name}</p>
            <span className="text-[8px] px-1 py-0.5 rounded font-mono font-bold" style={{ color: tierColor, backgroundColor: tierColor + "15" }}>
              {ach.tier.toUpperCase()}
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/30">{ach.description}</p>
          <div className="mt-1 w-full h-1 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tierColor }} />
          </div>
        </div>
        {prog.completed && <Trophy size={14} style={{ color: tierColor }} />}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg max-h-[85vh] bg-black/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="font-display text-lg tracking-[0.2em] text-white">MISSIONS</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {TAB_CONFIG.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 font-mono text-[10px] tracking-wider transition-colors ${
                  tab === t.id ? "text-white border-b-2 border-white" : "text-white/30 hover:text-white/50"
                }`}
              >
                <Icon size={11} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tab === "daily" && dailyQuests.map((q, i) => renderQuestCard(q, i))}
          {tab === "weekly" && weeklyQuests.map((q, i) => renderQuestCard(q, i))}
          {tab === "epoch" && EPOCH_QUESTS.map((q, i) => renderQuestCard(q, i))}
          {tab === "achievements" && ACHIEVEMENTS.map((a, i) => renderAchievement(a, i))}
          {tab === "titles" && (
            <div className="space-y-2">
              {TITLES.map((title, i) => (
                <motion.button
                  key={title.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelectTitle?.(title.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    currentTitle === title.id ? "border-white/30 bg-white/10" : "border-white/5 bg-white/[0.01] hover:border-white/10"
                  }`}
                >
                  <Medal size={16} style={{ color: title.color }} />
                  <div className="flex-1">
                    <p className="font-mono text-xs font-bold" style={{ color: title.color }}>{title.name}</p>
                    <p className="font-mono text-[10px] text-white/30">{title.description}</p>
                    <p className="font-mono text-[9px] text-white/15">{title.source}</p>
                  </div>
                  {currentTitle === title.id && <span className="text-[9px] text-white/40 font-mono">EQUIPPED</span>}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
