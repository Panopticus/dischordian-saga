/* ═══════════════════════════════════════════════════════
   TITLES PAGE — Catalog, Equip, Progression
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { TitlePill } from "@/components/TitlePill";
import { TITLE_DEFINITIONS } from "@shared/titles/titleDefinitions";
import type { TitleDef } from "@shared/titles/types";

const CATEGORY_LABELS: Record<TitleDef["category"], string> = {
  pvp_rank: "PvP Rank",
  narrative: "Narrative",
  mystery: "Mystery",
  coop: "Co-op",
  faction_guild: "Faction & Guild",
  cross_game: "Cross-Game",
  cosmetic_purchase: "Cosmetic Shop",
  seasonal: "Seasonal",
};

const CATEGORY_ORDER: TitleDef["category"][] = [
  "pvp_rank", "narrative", "mystery", "coop", "faction_guild", "cross_game", "seasonal", "cosmetic_purchase",
];

export default function TitlesPage() {
  const { isAuthenticated } = useAuth();
  const myTitles = trpc.titles.getMyTitles.useQuery(undefined, { enabled: isAuthenticated });
  const myLoadout = trpc.titles.getMyLoadout.useQuery(undefined, { enabled: isAuthenticated });
  const progression = trpc.titles.getTitleProgression.useQuery(undefined, { enabled: isAuthenticated });

  const earnedKeys = useMemo(
    () => new Set((myTitles.data ?? []).map((t) => t.titleKey)),
    [myTitles.data],
  );
  const equippedKey = myLoadout.data?.equippedTitleKey ?? null;
  const utils = trpc.useUtils();

  const equipMutation = trpc.titles.equipTitle.useMutation({
    onSuccess: () => {
      utils.titles.getMyLoadout.invalidate();
    },
  });
  const unequipMutation = trpc.titles.unequipTitle.useMutation({
    onSuccess: () => {
      utils.titles.getMyLoadout.invalidate();
    },
  });
  const claimMutation = trpc.titles.claimNewlyUnlocked.useMutation({
    onSuccess: () => {
      utils.titles.getMyTitles.invalidate();
      utils.titles.getTitleProgression.invalidate();
    },
  });

  const [activeCategory, setActiveCategory] = useState<TitleDef["category"]>("pvp_rank");

  const titlesByCategory = useMemo(() => {
    const out = new Map<TitleDef["category"], TitleDef[]>();
    for (const t of TITLE_DEFINITIONS) {
      const list = out.get(t.category) ?? [];
      list.push(t);
      out.set(t.category, list);
    }
    return out;
  }, []);

  const visibleTitles = useMemo(() => {
    const list = titlesByCategory.get(activeCategory) ?? [];
    return [...list].sort((a, b) =>
      a.rootKey === b.rootKey ? a.tier - b.tier : a.rootKey.localeCompare(b.rootKey),
    );
  }, [titlesByCategory, activeCategory]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="font-mono text-sm text-muted-foreground">Sign in to view your titles.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft size={12} /> BACK
        </Link>
        <button
          type="button"
          className="font-mono text-xs px-3 py-1 border border-border/50 rounded hover:border-primary/50"
          disabled={claimMutation.isPending}
          onClick={() => claimMutation.mutate()}
        >
          <Sparkles size={11} className="inline mr-1" />
          {claimMutation.isPending ? "CLAIMING..." : "CHECK FOR NEW TITLES"}
        </button>
      </div>

      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3">
        <Award className="text-primary" size={28} />
        TITLES
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Lore-tiered honors earned across every PvP, narrative, and co-op surface.
      </p>

      {/* Currently equipped */}
      <div className="border border-border/50 rounded-lg p-4 mb-6 bg-secondary/30">
        <p className="font-mono text-[10px] text-muted-foreground mb-2">CURRENTLY EQUIPPED</p>
        {equippedKey ? (
          <div className="flex items-center justify-between">
            <TitlePill titleKey={equippedKey} size="md" />
            <button
              type="button"
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
              onClick={() => unequipMutation.mutate()}
            >
              Unequip
            </button>
          </div>
        ) : (
          <p className="font-mono text-xs italic opacity-60">No title equipped.</p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`font-mono text-xs px-3 py-1.5 border rounded ${
              activeCategory === cat
                ? "border-primary text-primary bg-primary/10"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Title cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTitles.map((def) => {
          const earned = earnedKeys.has(def.titleKey);
          const equipped = equippedKey === def.titleKey;
          const rootProgress = progression.data?.find((p) => p.rootKey === def.rootKey);
          const showProgress =
            !earned && rootProgress?.nextTier?.titleKey === def.titleKey;
          return (
            <motion.div
              key={def.titleKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-3 ${
                earned ? "border-primary/40 bg-primary/5" : "border-border/40 bg-secondary/20 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <TitlePill titleKey={def.titleKey} size="sm" />
                  <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                    Tier {def.tier} · {def.rarity}
                  </p>
                </div>
                {earned && !equipped && (
                  <button
                    type="button"
                    className="font-mono text-[10px] px-2 py-1 border border-primary/40 rounded text-primary hover:bg-primary/10"
                    onClick={() => equipMutation.mutate({ titleKey: def.titleKey })}
                  >
                    EQUIP
                  </button>
                )}
                {equipped && (
                  <span className="font-mono text-[10px] px-2 py-1 text-primary border border-primary/40 rounded bg-primary/10">
                    EQUIPPED
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">{def.description}</p>
              {def.flavorText && (
                <p className="font-mono text-[10px] italic mt-2 opacity-60">"{def.flavorText}"</p>
              )}
              {showProgress && rootProgress && (
                <div className="mt-3">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.round(rootProgress.nextTierProgress * 100)}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">
                    {Math.round(rootProgress.nextTierProgress * 100)}% to unlock
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
