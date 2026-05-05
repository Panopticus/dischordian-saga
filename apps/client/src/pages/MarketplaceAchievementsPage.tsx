/* ═══════════════════════════════════════════════════════
   MARKETPLACE ACHIEVEMENTS — Player surface for the
   marketAchievements router (Phase I).

   75+ achievements across 7 domains (marketplace, social,
   combat, exploration, crafting, collector, economy). The
   server-side trackIncrement calls in marketplace.ts auto-
   unlock these via the achievementTracker → marketStatsService
   path; this page reads `getAll` and renders progress per
   category with earned-state styling.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Loader2, Trophy, ShoppingBag, Users, Swords, Compass, Hammer, Layers, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const CATEGORY_ICONS: Record<string, typeof ShoppingBag> = {
  marketplace: ShoppingBag,
  social: Users,
  combat: Swords,
  exploration: Compass,
  crafting: Hammer,
  collector: Layers,
  economy: TrendingUp,
};

const TIER_STYLES: Record<string, string> = {
  bronze: "void-text-accent void-border",
  silver: "text-muted-foreground void-border",
  gold: "void-text-premium void-border",
  platinum: "void-text-energy void-border-success",
  legendary: "void-text-energy void-bg-success void-border-success",
};

type Tab = "all" | "marketplace" | "social" | "combat" | "exploration" | "crafting" | "collector" | "economy";

const TABS: readonly Tab[] = [
  "all", "marketplace", "social", "combat", "exploration", "crafting", "collector", "economy",
];

export default function MarketplaceAchievementsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("all");
  const all = trpc.marketAchievements.getAll.useQuery(undefined, { enabled: isAuthenticated });

  const filtered = useMemo(() => {
    if (!all.data) return [];
    if (tab === "all") return all.data.achievements;
    return all.data.achievements.filter((a) => a.category === tab);
  }, [all.data, tab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <Trophy className="mx-auto mb-4 text-accent" size={48} />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-3">
            MARKETPLACE ACHIEVEMENTS
          </h1>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Sign in to track your marketplace, social, exploration, and economy milestones.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-2 rounded-md bg-primary/15 border border-primary/40 text-primary font-mono text-xs tracking-wider hover:bg-primary/25"
          >
            SIGN IN
          </a>
        </div>
      </div>
    );
  }

  if (all.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 max-w-5xl mx-auto">
      <Link href="/marketplace" className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono text-xs mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Marketplace
      </Link>

      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-display text-2xl tracking-[0.2em]">MARKETPLACE ACHIEVEMENTS</h1>
        {all.data && (
          <span className="font-mono text-xs text-muted-foreground tracking-wider">
            {all.data.stats.earned} / {all.data.stats.total}
          </span>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const Icon = CATEGORY_ICONS[t] ?? Trophy;
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-mono text-[11px] tracking-wider transition-all ${
                isActive
                  ? "void-bg-system void-border-system void-text-system border"
                  : "bg-card/30 border border-border/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={12} />
              {t.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((a) => {
          const tierClass = TIER_STYLES[a.tier] ?? "";
          return (
            <div
              key={a.id}
              className={`p-3 rounded-lg border ${tierClass} ${
                a.earned ? "" : "opacity-60"
              } bg-card/30`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display text-sm font-bold tracking-wide">
                  {a.name}
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {a.tier}
                </span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground mb-2">
                {a.description}
              </p>
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>+{a.xpReward} XP · +{a.pointsReward} pts</span>
                {a.earned ? (
                  <span className="void-text-energy">EARNED</span>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="font-mono text-xs text-muted-foreground text-center py-12">
          No achievements in this category yet.
        </p>
      )}
    </div>
  );
}
