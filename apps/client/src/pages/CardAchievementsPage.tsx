import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getGoogleLoginUrl } from "@/const";
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
import { GalleryFilterChip } from "@/components/gallery";

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
  combat: "void-text-error void-bg-error void-border-error",
  collection: "void-text-accent void-bg-sunk void-border",
  pvp: "void-text-energy void-bg-sunk void-border",
  draft: "void-text-system void-bg-system void-border-system",
  trading: "void-text-error void-bg-error void-border-error",
  exploration: "void-text-energy void-bg-success void-border-success",
  mastery: "void-text-premium void-bg-sunk void-border",
  social: "void-text-energy void-bg-success void-border-success",
};

const TIER_COLORS: Record<string, string> = {
  bronze: "void-text-accent void-bg-sunk void-border",
  silver: "text-muted-foreground void-bg-canvas void-border",
  gold: "void-text-premium void-bg-sunk void-border",
  platinum: "void-text-energy void-bg-success void-border-success",
  diamond: "void-text-energy void-bg-sunk void-border",
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
            href={getGoogleLoginUrl()}
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
          <Star size={18} className="mx-auto mb-1 void-text-premium" />
          <p className="font-display text-xl font-bold">{summary.data?.totalDreamEarned || 0}</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">DREAM EARNED</p>
        </div>
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Gift size={18} className="mx-auto mb-1 text-primary" />
          <p className="font-display text-xl font-bold">{summary.data?.claimed || 0}</p>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">REWARDS CLAIMED</p>
        </div>
        <div className="border border-border/20 rounded-lg bg-card/30 p-3 text-center">
          <Zap size={18} className="mx-auto mb-1 void-text-energy" />
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

      {/* Filters — migrated to the shared GalleryFilterChip. */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <GalleryFilterChip
          active={filterCategory === "all"}
          onClick={() => setFilterCategory("all")}
        >
          ALL
        </GalleryFilterChip>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Star;
          return (
            <GalleryFilterChip
              key={cat}
              active={filterCategory === cat}
              onClick={() => setFilterCategory(cat)}
              leading={<Icon size={12} />}
            >
              {cat.toUpperCase()}
            </GalleryFilterChip>
          );
        })}
        <div className="ml-auto">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all ${
              showCompleted ? "void-bg-success void-text-energy" : "bg-secondary/30 text-muted-foreground"
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
            const catColor = CATEGORY_COLORS[achievement.category] || "text-muted-foreground void-bg-canvas void-border";
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
                    : "border-border/20 bg-card/30 void-glitch void-glitch-lock"
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
                      <span className="px-2 py-0.5 rounded void-bg-success void-text-energy text-[9px] font-mono font-bold animate-pulse">
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
                            <Star size={12} className="void-text-premium" />
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
                          <div className="flex items-center gap-1.5 void-text-energy">
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
