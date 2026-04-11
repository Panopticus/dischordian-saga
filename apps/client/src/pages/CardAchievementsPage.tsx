import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Shield, Swords, Crown, Zap, Target,
  Medal, Gift, Lock, Check, ChevronRight, Loader2,
  Flame, Eye, Heart, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, any> = {
  combat: Swords,
  collection: Star,
  pvp: Shield,
  draft: Crown,
  trading: Heart,
  exploration: Eye,
  mastery: Flame,
  social: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  combat: "text-red-400 bg-red-500/10 border-red-500/30",
  collection: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  pvp: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  draft: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  trading: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  exploration: "text-green-400 bg-green-500/10 border-green-500/30",
  mastery: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  social: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
};

const TIER_COLORS: Record<string, string> = {
  bronze: "text-amber-700 bg-amber-900/20 border-amber-700/30",
  silver: "text-muted-foreground bg-gray-500/20 border-gray-400/30",
  gold: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  platinum: "text-cyan-300 bg-cyan-500/20 border-cyan-400/30",
  diamond: "text-blue-300 bg-blue-500/20 border-blue-400/30",
};

type FilterCategory = "all" | string;

export default function CardAchievementsPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // tRPC
  const achievements = trpc.cardAchievements.getAll.useQuery(undefined, { enabled: isAuthenticated });
  const summary = trpc.cardAchievements.getSummary.useQuery(undefined, { enabled: isAuthenticated });
  const claimReward = trpc.cardAchievements.claimReward.useMutation({
    onSuccess: (data) => {
      utils.cardAchievements.getAll.invalidate();
      utils.cardAchievements.getSummary.invalidate();
      toast.success(`Reward claimed! +${data.dreamReward} Dream tokens`);
    },
    onError: (err) => toast.error(err.message),
  });

  const categories = useMemo(() => {
    if (!achievements.data) return [];
    const cats = new Set<string>();
    achievements.data.forEach((a: any) => cats.add(a.category || "combat"));
    return Array.from(cats);
  }, [achievements.data]);

  const filteredAchievements = useMemo(() => {
    if (!achievements.data) return [];
    let list = achievements.data as any[];
    if (filterCategory !== "all") {
      list = list.filter((a) => a.category === filterCategory);
    }
    if (!showCompleted) {
      list = list.filter((a) => !a.completed);
    }
    return list;
  }, [achievements.data, filterCategory, showCompleted]);

  const allCategoryKeys = useMemo(() => ["all", ...categories], [categories]);
  const activeCatIndex = allCategoryKeys.indexOf(filterCategory);
  const { handlers: swipeHandlers, swipeStyle } = useSwipeTabs({
    tabCount: allCategoryKeys.length,
    activeIndex: activeCatIndex >= 0 ? activeCatIndex : 0,
    onTabChange: (idx) => setFilterCategory(allCategoryKeys[idx] as FilterCategory),
  });

  const completedCount = useMemo(
    () => (achievements.data || []).filter((a: any) => a.completed).length,
    [achievements.data]
  );
  const totalCount = (achievements.data || []).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Trophy className="mx-auto mb-4 text-accent" size={48} />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-3">CARD ACHIEVEMENTS</h1>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Track your card game milestones and earn rewards. Login to view your progress.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm"
          >
            LOGIN TO VIEW
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-accent/50" />
          <span className="font-mono text-[10px] text-accent/70 tracking-[0.3em]">ACHIEVEMENTS</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider">
          CARD <span className="text-accent">ACHIEVEMENTS</span>
        </h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Trophy size={18} className="mx-auto mb-1 text-accent" />
          <p className="font-display text-xl font-bold">{completedCount}/{totalCount}</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">COMPLETED</p>
        </div>
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Star size={18} className="mx-auto mb-1 text-yellow-400" />
          <p className="font-display text-xl font-bold">{summary.data?.totalDreamEarned || 0}</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">DREAM EARNED</p>
        </div>
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Gift size={18} className="mx-auto mb-1 text-primary" />
          <p className="font-display text-xl font-bold">{summary.data?.claimed || 0}</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">REWARDS CLAIMED</p>
        </div>
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Zap size={18} className="mx-auto mb-1 text-green-400" />
          <p className="font-display text-xl font-bold">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">COMPLETION</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
            initial={{ width: 0 }}
            animate={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            filterCategory === "all"
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-secondary/30 text-muted-foreground border border-transparent hover:bg-secondary/50"
          }`}
        >
          ALL
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Star;
          const color = CATEGORY_COLORS[cat] || "text-muted-foreground bg-gray-500/10 border-gray-500/30";
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all border ${
                filterCategory === cat ? color : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/50"
              }`}
            >
              <Icon size={12} />
              {cat.toUpperCase()}
            </button>
          );
        })}
        <div className="ml-auto">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
              showCompleted ? "bg-green-500/10 text-green-400" : "bg-secondary/30 text-muted-foreground"
            }`}
          >
            {showCompleted ? <Eye size={12} /> : <Lock size={12} />}
            {showCompleted ? "SHOWING ALL" : "HIDE COMPLETED"}
          </button>
        </div>
      </div>

      {/* Achievement List with swipe */}
      <div className="space-y-2" {...swipeHandlers} style={swipeStyle}>
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="mx-auto mb-3 text-muted-foreground/30" size={48} />
            <p className="font-mono text-sm text-muted-foreground">No achievements found</p>
          </div>
        ) : (
          filteredAchievements.map((achievement: any) => {
            const Icon = CATEGORY_ICONS[achievement.category] || Star;
            const catColor = CATEGORY_COLORS[achievement.category] || "text-muted-foreground bg-gray-500/10 border-gray-500/30";
            const tierColor = TIER_COLORS[achievement.tier] || "";
            const progress = achievement.target > 0
              ? Math.min(100, (achievement.progress / achievement.target) * 100)
              : achievement.completed ? 100 : 0;
            const isExpanded = expandedId === achievement.key;

            return (
              <motion.div
                key={achievement.key}
                layout
                className={`border rounded-lg overflow-hidden transition-all ${
                  achievement.completed
                    ? "border-accent/30 bg-accent/5"
                    : "border-border/20 bg-card/30"
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : achievement.key)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    achievement.completed ? "bg-accent/20" : "bg-secondary/50"
                  }`}>
                    {achievement.completed ? (
                      <Check size={18} className="text-accent" />
                    ) : (
                      <Icon size={18} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`font-mono text-sm font-semibold truncate ${
                        achievement.completed ? "text-accent" : ""
                      }`}>
                        {achievement.title}
                      </p>
                      {achievement.tier && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${tierColor}`}>
                          {achievement.tier}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                    {/* Progress bar */}
                    {achievement.target > 0 && !achievement.completed && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reward */}
                  <div className="flex items-center gap-2 shrink-0">
                    {achievement.dreamReward > 0 && (
                      <span className="font-mono text-xs text-accent">+{achievement.dreamReward} 💎</span>
                    )}
                    {achievement.completed && !achievement.rewardClaimed && (
                      <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[9px] font-mono font-bold animate-pulse">
                        CLAIM
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/10"
                    >
                      <div className="p-4 space-y-3">
                        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Star size={12} className="text-yellow-400" />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {achievement.points || 10} points
                            </span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${catColor}`}>
                            <Icon size={10} />
                            <span className="font-mono text-[9px]">{(achievement.category || "combat").toUpperCase()}</span>
                          </div>
                        </div>
                        {achievement.completed && !achievement.rewardClaimed && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              claimReward.mutate({ achievementKey: achievement.key });
                            }}
                            disabled={claimReward.isPending}
                            className="font-mono text-xs"
                          >
                            {claimReward.isPending ? (
                              <Loader2 className="animate-spin mr-1" size={14} />
                            ) : (
                              <Gift className="mr-1" size={14} />
                            )}
                            CLAIM REWARD (+{achievement.dreamReward} 💎)
                          </Button>
                        )}
                        {achievement.rewardClaimed && (
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Check size={14} />
                            <span className="font-mono text-xs">Reward claimed</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
