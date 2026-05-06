/* ═══════════════════════════════════════════════════════
   COSMETIC CATALOG PAGE — 3-tier monetization shop

   The "pay to enhance, not pay to win" UI surface. Renders the
   tier-stratified catalog from apps/shared/cosmeticCatalog.ts and
   lets the player buy with Dream OR Void Crystals depending on tier.

   Coexists with the legacy /cosmetic-shop page — that page serves
   the older RPG-themed Dream-only catalog. This page serves the
   new monetization-shaped catalog (T1 Dream / T2 Hybrid / T3
   Premium VC). New cosmetic SKUs go here.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Sparkles, Gem, Lock, Check, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tier = "all" | "earnable" | "hybrid" | "premium";

const TIER_LABEL: Record<Exclude<Tier, "all">, string> = {
  earnable: "T1 Earnable",
  hybrid: "T2 Hybrid",
  premium: "T3 Premium",
};

const TIER_DESCRIPTION: Record<Exclude<Tier, "all">, string> = {
  earnable: "Dream-only. Earn through play.",
  hybrid: "Dream OR Void Crystals — pick your path.",
  premium: "Void Crystals only. The signature cosmetics.",
};

export default function CosmeticCatalogPage() {
  const [tier, setTier] = useState<Tier>("all");

  const { data: items, isLoading, refetch } = trpc.cosmeticCatalog.list.useQuery();
  const { data: balance } = trpc.store.myDreamBalance.useQuery();

  const purchaseDream = trpc.cosmeticCatalog.purchaseWithDream.useMutation({
    onSuccess: () => { toast.success("Cosmetic purchased!"); refetch(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });
  const purchaseVc = trpc.cosmeticCatalog.purchaseWithVoidCrystals.useMutation({
    onSuccess: () => { toast.success("Cosmetic unlocked!"); refetch(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const filtered = (items ?? []).filter((c) =>
    tier === "all" ? true : c.tier === tier,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-chart-4 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/store" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Sparkles size={18} className="text-chart-4" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">
            COSMETIC CATALOG
          </h1>
          <div className="ml-auto flex items-center gap-3 text-xs font-mono">
            <span className="text-chart-4 inline-flex items-center gap-1">
              <Sparkles size={12} /> {balance?.dreamTokens ?? 0}
            </span>
            <span className="text-purple-400 inline-flex items-center gap-1">
              <Gem size={12} /> {balance?.gems ?? 0}
            </span>
          </div>
        </div>

        <div className="px-4 sm:px-6 flex gap-1 pb-2 overflow-x-auto">
          {(["all", "earnable", "hybrid", "premium"] as Tier[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                tier === t
                  ? "bg-chart-4/20 text-chart-4 border border-chart-4/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "ALL" : TIER_LABEL[t].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {tier !== "all" && (
        <div className="px-4 sm:px-6 py-3 text-xs text-muted-foreground italic">
          {TIER_DESCRIPTION[tier]}
        </div>
      )}

      <div className="px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <CosmeticCard
            key={item.id}
            item={item}
            onBuyDream={() => purchaseDream.mutate({ cosmeticId: item.id })}
            onBuyVc={() => purchaseVc.mutate({ cosmeticId: item.id })}
            buying={purchaseDream.isPending || purchaseVc.isPending}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 sm:px-6 py-12 text-center text-muted-foreground">
          No cosmetics in this tier yet.
        </div>
      )}
    </div>
  );
}

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  tier: "earnable" | "hybrid" | "premium";
  slot: string;
  visibility: string;
  priceDream: number;
  priceVoidCrystals: number;
  minLevel: number;
  owned: boolean;
  affordableWithDream: boolean;
  affordableWithVoidCrystals: boolean;
  exclusivity?: string;
}

function CosmeticCard({
  item,
  onBuyDream,
  onBuyVc,
  buying,
}: {
  item: CatalogItem;
  onBuyDream: () => void;
  onBuyVc: () => void;
  buying: boolean;
}) {
  const tierBorder = {
    earnable: "border-chart-2/40",
    hybrid: "border-chart-4/40",
    premium: "border-purple-400/40",
  }[item.tier];

  const tierBadge = {
    earnable: "bg-chart-2/15 text-chart-2",
    hybrid: "bg-chart-4/15 text-chart-4",
    premium: "bg-purple-400/15 text-purple-300",
  }[item.tier];

  return (
    <div className={`void-surface p-4 border ${tierBorder} flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm font-bold flex items-center gap-1">
          {item.tier === "premium" && <Crown size={12} className="text-purple-300" />}
          {item.name}
        </h3>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${tierBadge}`}>
          {item.tier === "earnable" ? "T1" : item.tier === "hybrid" ? "T2" : "T3"}
        </span>
      </div>

      <p className="text-xs text-muted-foreground flex-1">{item.description}</p>

      <div className="text-[10px] font-mono text-muted-foreground inline-flex gap-2">
        <span>{item.slot}</span>
        <span>·</span>
        <span>{item.visibility}</span>
        {item.minLevel > 1 && (
          <>
            <span>·</span>
            <span>L{item.minLevel}+</span>
          </>
        )}
      </div>

      {item.owned ? (
        <div className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 text-xs text-chart-2 border border-chart-2/30 rounded">
          <Check size={12} /> OWNED
        </div>
      ) : item.exclusivity && item.priceDream === 0 && item.priceVoidCrystals === 0 ? (
        <div className="mt-2 inline-flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground border border-border/30 rounded">
          <Lock size={12} /> Bundle exclusive
        </div>
      ) : (
        <div className="mt-2 grid gap-1.5">
          {item.priceDream > 0 && (
            <Button
              size="sm"
              variant="outline"
              disabled={buying || !item.affordableWithDream}
              onClick={onBuyDream}
              className="text-xs justify-center gap-1"
            >
              <Sparkles size={12} /> {item.priceDream} Dream
            </Button>
          )}
          {item.priceVoidCrystals > 0 && (
            <Button
              size="sm"
              variant="outline"
              disabled={buying || !item.affordableWithVoidCrystals}
              onClick={onBuyVc}
              className="text-xs justify-center gap-1 border-purple-400/30 text-purple-300 hover:bg-purple-400/10"
            >
              <Gem size={12} /> {item.priceVoidCrystals} Void Crystals
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
