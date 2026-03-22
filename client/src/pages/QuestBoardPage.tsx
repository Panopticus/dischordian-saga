import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scroll, Swords, Calendar, Gift, ChevronRight, Loader2,
  Target, Trophy, Star, Clock, Flame, Zap, Shield, Check,
  Lock, Sparkles, Crown, TrendingUp, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showBonusToast } from "@/components/BonusToast";

const QUEST_TYPE_ICONS: Record<string, typeof Swords> = {
  fight: Swords, card_battle: Shield, trade: TrendingUp,
  craft: Zap, explore: Target, social: Star,
};
const QUEST_TYPE_COLORS: Record<string, string> = {
  fight: "text-red-400", card_battle: "text-blue-400", trade: "text-amber-400",
  craft: "text-purple-400", explore: "text-cyan-400", social: "text-green-400",
};

const TAB_IDS = ["daily", "weekly", "epoch", "calendar"] as const;
type TabId = (typeof TAB_IDS)[number];
const TAB_LABELS: Record<TabId, string> = {
  daily: "DAILY", weekly: "WEEKLY", epoch: "EPOCH", calendar: "LOGIN",
};
const TAB_ICONS: Record<TabId, typeof Scroll> = {
  daily: Scroll, weekly: Calendar, epoch: Crown, calendar: Gift,
};

export default function QuestBoardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("daily");
  const tabIndex = TAB_IDS.indexOf(activeTab);
  const { handlers } = useSwipeTabs({
    tabCount: TAB_IDS.length,
    activeIndex: tabIndex,
    onTabChange: (i: number) => setActiveTab(TAB_IDS[i]),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="text-center max-w-md">
          <Scroll className="mx-auto mb-4 text-primary" size={48} />
          <h1 className="font-display text-2xl font-bold mb-2">MISSION BOARD</h1>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Login to access daily, weekly, and epoch missions with exclusive rewards.
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-primary text-primary-foreground">
            LOGIN TO ACCESS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">OPERATIONS CENTER</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider">
          MISSION <span className="text-primary glow-cyan">BOARD</span>
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex gap-1 p-1 rounded-lg bg-card/50 border border-border/30">
          {TAB_IDS.map(tab => {
            const Icon = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-mono transition-all ${
                  activeTab === tab
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{TAB_LABELS[tab]}</span>
                <span className="sm:hidden">{TAB_LABELS[tab].slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div
        {...handlers}
        className="px-4 sm:px-6 pb-24"
      >
        <AnimatePresence mode="wait">
          {activeTab === "daily" && <QuestListTab key="daily" period="daily" />}
          {activeTab === "weekly" && <QuestListTab key="weekly" period="weekly" />}
          {activeTab === "epoch" && <QuestListTab key="epoch" period="epoch" />}
          {activeTab === "calendar" && <LoginCalendarTab key="calendar" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUEST LIST TAB — Shared for daily/weekly/epoch
   ═══════════════════════════════════════════════════════ */
function QuestListTab({ period }: { period: "daily" | "weekly" | "epoch" }) {
  const { data, isLoading, refetch } = trpc.quests.getAll.useQuery();
  const claimMutation = trpc.quests.claimReward.useMutation({
    onSuccess: (res: any) => {
      toast.success(`Reward claimed! +${res.rewardDream} Dream, +${res.rewardXp} XP${res.rewardCredits ? `, +${res.rewardCredits} Credits` : ""}${res.bonusReward ? ` + ${res.bonusReward}` : ""}`);
      // Show trait bonus toast if applicable
      if (res.traitMultiplier && res.traitMultiplier > 1) {
        showBonusToast({
          system: "Quest",
          baseAmount: Math.round(res.rewardDream / res.traitMultiplier),
          finalAmount: res.rewardDream,
          multiplier: res.traitMultiplier,
          currency: "Dream",
          sources: res.traitSources || ["Character Bonus"],
        });
      }
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading || !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={24} />
      </motion.div>
    );
  }

  const quests = data[period];
  const periodLabel = period === "daily" ? "Today" : period === "weekly" ? `Week ${data.week?.split("-W")[1] || ""}` : `Epoch: ${data.epoch_period?.split("-")[1] || ""}`;
  const completedCount = quests.filter(q => q.completed).length;
  const claimedCount = quests.filter(q => q.claimed).length;
  const allComplete = completedCount === quests.length && quests.length > 0;

  const periodIcon = period === "daily" ? Scroll : period === "weekly" ? Calendar : Crown;
  const PeriodIcon = periodIcon;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Period Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PeriodIcon size={16} className="text-primary" />
          <span className="font-mono text-xs text-muted-foreground">{periodLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {completedCount}/{quests.length} COMPLETE
          </span>
          {allComplete && (
            <span className="font-mono text-[10px] text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
              ALL DONE
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Quest Cards */}
      {quests.length === 0 ? (
        <div className="text-center py-12">
          <Scroll className="mx-auto mb-3 text-muted-foreground/40" size={40} />
          <p className="font-mono text-sm text-muted-foreground">No missions available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quests.map((quest, i) => {
            const Icon = QUEST_TYPE_ICONS[quest.questType] || Target;
            const color = QUEST_TYPE_COLORS[quest.questType] || "text-primary";
            const progress = quest.targetCount > 0 ? Math.min(quest.currentCount / quest.targetCount, 1) : 0;
            const isComplete = quest.completed;
            const isClaimed = quest.claimed;

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-lg border p-4 transition-all ${
                  isClaimed
                    ? "border-accent/20 bg-accent/5 opacity-60"
                    : isComplete
                    ? "border-primary/40 bg-primary/5 box-glow-cyan"
                    : "border-border/30 bg-card/40 hover:border-border/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md ${isComplete ? "bg-primary/20" : "bg-secondary/50"}`}>
                    {isClaimed ? <Check size={16} className="text-accent" /> : <Icon size={16} className={color} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-mono text-sm font-semibold truncate ${isClaimed ? "line-through text-muted-foreground" : ""}`}>
                        {quest.title}
                      </h3>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                        isComplete ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {quest.questType.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-2">{quest.description}</p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${isComplete ? "bg-primary" : "bg-primary/50"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {quest.currentCount >= 1000 ? `${(quest.currentCount / 1000).toFixed(1)}k` : quest.currentCount}
                        /
                        {quest.targetCount >= 1000 ? `${(quest.targetCount / 1000).toFixed(1)}k` : quest.targetCount}
                      </span>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {quest.rewardDream > 0 && (
                        <span className="font-mono text-[10px] text-purple-400 flex items-center gap-1">
                          <Sparkles size={10} /> {quest.rewardDream} Dream
                        </span>
                      )}
                      {quest.rewardXp > 0 && (
                        <span className="font-mono text-[10px] text-cyan-400 flex items-center gap-1">
                          <Zap size={10} /> {quest.rewardXp} XP
                        </span>
                      )}
                      {quest.rewardCredits > 0 && (
                        <span className="font-mono text-[10px] text-amber-400 flex items-center gap-1">
                          <TrendingUp size={10} /> {quest.rewardCredits.toLocaleString()} Credits
                        </span>
                      )}
                      {quest.bonusReward && (
                        <span className="font-mono text-[10px] text-accent flex items-center gap-1">
                          <Gift size={10} /> {quest.bonusReward}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Claim Button */}
                  {isComplete && !isClaimed && (
                    <Button
                      size="sm"
                      onClick={() => claimMutation.mutate({ questId: quest.questId, questDate: quest.questDate })}
                      disabled={claimMutation.isPending}
                      className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 text-xs"
                    >
                      {claimMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : "CLAIM"}
                    </Button>
                  )}
                  {isClaimed && (
                    <span className="font-mono text-[10px] text-accent flex items-center gap-1">
                      <Check size={12} /> CLAIMED
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Completion Bonus */}
      {allComplete && claimedCount === quests.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-center"
        >
          <Trophy className="mx-auto mb-2 text-accent" size={24} />
          <p className="font-display text-sm font-bold text-accent tracking-wider">
            ALL {period.toUpperCase()} MISSIONS COMPLETE
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {period === "daily" ? "New missions in 24 hours" : period === "weekly" ? "New missions next week" : "New missions next season"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN CALENDAR TAB
   ═══════════════════════════════════════════════════════ */
function LoginCalendarTab() {
  const { data, isLoading, refetch } = trpc.quests.getLoginCalendar.useQuery();
  const claimLogin = trpc.quests.claimLogin.useMutation({
    onSuccess: (res) => {
      toast.success(`Day ${res.streak} reward: ${res.rewardLabel}!`);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading || !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={24} />
      </motion.div>
    );
  }

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  const monthClaims = new Set(data.monthClaims || []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Streak Display */}
      <div className="rounded-lg border border-primary/30 bg-card/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={18} className="text-accent" />
              <span className="font-display text-lg font-bold tracking-wider">{data.streak}-DAY STREAK</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Total logins: {data.totalDays} | {data.claimedToday ? "Claimed today" : "Not claimed today"}
            </p>
          </div>
          {!data.claimedToday && (
            <Button
              onClick={() => claimLogin.mutate()}
              disabled={claimLogin.isPending}
              className="bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30"
            >
              {claimLogin.isPending ? <Loader2 size={14} className="animate-spin" /> : (
                <>
                  <Gift size={14} className="mr-1.5" />
                  CLAIM
                </>
              )}
            </Button>
          )}
        </div>

        {/* Streak Milestones */}
        <div className="grid grid-cols-5 gap-2">
          {data.rewards.map((reward) => {
            const reached = data.streak >= reward.day;
            return (
              <div
                key={reward.day}
                className={`rounded-md border p-2 text-center transition-all ${
                  reached
                    ? "border-accent/40 bg-accent/10"
                    : "border-border/20 bg-secondary/20 opacity-50"
                }`}
              >
                <div className="font-mono text-[10px] text-muted-foreground mb-1">DAY {reward.day}</div>
                <div className={`font-mono text-xs font-bold ${reached ? "text-accent" : "text-muted-foreground"}`}>
                  {reward.label.split(" ").slice(0, 2).join(" ")}
                </div>
                {reached && <Check size={10} className="mx-auto mt-1 text-accent" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            {today.toLocaleString("default", { month: "long", year: "numeric" }).toUpperCase()}
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            {monthClaims.size}/{daysInMonth} days
          </span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center font-mono text-[10px] text-muted-foreground/50 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: new Date(today.getFullYear(), today.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const claimed = monthClaims.has(day);
            const isToday = day === currentDay;
            const isPast = day < currentDay;

            return (
              <div
                key={day}
                className={`aspect-square rounded-md flex items-center justify-center text-xs font-mono transition-all ${
                  claimed
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : isToday
                    ? "bg-accent/10 text-accent border border-accent/40 animate-pulse"
                    : isPast
                    ? "bg-secondary/20 text-muted-foreground/30"
                    : "bg-secondary/10 text-muted-foreground/50"
                }`}
              >
                {claimed ? <Check size={12} /> : day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Login Rewards Info */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <h3 className="font-display text-sm font-bold tracking-wider mb-3 flex items-center gap-2">
          <Award size={14} className="text-accent" />
          STREAK REWARDS
        </h3>
        <div className="space-y-2">
          {data.rewards.map((reward) => (
            <div key={reward.day} className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                Day {reward.day}
              </span>
              <span className={`font-mono text-xs ${data.streak >= reward.day ? "text-accent" : "text-muted-foreground/50"}`}>
                {reward.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
