import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState } from "react";
import {
  ShoppingCart, Gem, Zap, Package, Shield, Rocket, Fuel,
  ChevronLeft, Star, Crown, Sparkles, Coins, Loader2,
  CheckCircle, XCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Toast via simple alert for now

type Category = "all" | "dream" | "cards" | "ship" | "cosmetic" | "bundle";

const CATEGORY_ICONS: Record<Category, typeof Gem> = {
  all: ShoppingCart,
  dream: Coins,
  cards: Sparkles,
  ship: Rocket,
  cosmetic: Star,
  bundle: Package,
};

const RARITY_COLORS: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
  mythic: "text-rose-400",
};

export default function StorePage() {
  const { user, isAuthenticated } = useAuth();
  const toast = (opts: { title: string; description?: string; variant?: string }) => {
    console.log(`[Toast] ${opts.title}: ${opts.description || ""}`);
  };
  const [category, setCategory] = useState<Category>("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const { data: products } = trpc.store.listProducts.useQuery();
  const { data: featured } = trpc.store.getFeatured.useQuery();
  const { data: dreamBalance } = trpc.store.myDreamBalance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: purchases } = trpc.store.myPurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const checkoutMutation = trpc.store.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast({ title: "Redirecting to checkout...", description: "A new tab will open for payment." });
        window.open(data.checkoutUrl, "_blank");
      }
      setPurchasing(null);
    },
    onError: (err) => {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
      setPurchasing(null);
    },
  });

  const dreamPurchaseMutation = trpc.store.purchaseWithDream.useMutation({
    onSuccess: (data) => {
      toast({ title: "Purchase complete!", description: data.message });
      setPurchasing(null);
    },
    onError: (err) => {
      toast({ title: "Purchase failed", description: err.message, variant: "destructive" });
      setPurchasing(null);
    },
  });

  const filteredProducts = products?.filter(
    (p) => category === "all" || p.category === category
  ) || [];

  const handleBuyWithStripe = (productKey: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setPurchasing(productKey);
    checkoutMutation.mutate({ productKey, quantity: 1 });
  };

  const handleBuyWithDream = (productKey: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setPurchasing(productKey);
    dreamPurchaseMutation.mutate({ productKey, quantity: 1 });
  };

  const formatPrice = (cents: number) => {
    if (cents <= 0) return null;
    return `$${(cents / 100).toFixed(2)}`;
  };

  const urlParams = new URLSearchParams(window.location.search);
  const showSuccess = urlParams.get("success") === "true";
  const showCanceled = urlParams.get("canceled") === "true";

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={18} />
              </Link>
              <div>
                <h1 className="font-display text-base sm:text-xl font-bold tracking-wider flex items-center gap-2">
                  <ShoppingCart size={16} className="text-accent" />
                  INTERGALACTIC MARKET
                </h1>
                <p className="font-mono text-[10px] sm:text-xs text-muted-foreground">
                  Resources, upgrades, and rare acquisitions
                </p>
              </div>
            </div>

            {isAuthenticated && dreamBalance && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-purple-500/10 border border-purple-500/30">
                  <Gem size={12} className="text-purple-400" />
                  <span className="font-mono text-xs sm:text-sm text-purple-300">{dreamBalance.dreamTokens}</span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-purple-400/60">DREAM</span>
                </div>
                {dreamBalance.soulBoundDream > 0 && (
                  <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-rose-500/10 border border-rose-500/30">
                    <Crown size={12} className="text-rose-400" />
                    <span className="font-mono text-xs sm:text-sm text-rose-300">{dreamBalance.soulBoundDream}</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-rose-400/60">SOUL</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Success/Cancel banners */}
        {showSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircle size={20} className="text-green-400" />
            <div>
              <p className="font-mono text-sm text-green-300 font-semibold">Payment successful!</p>
              <p className="font-mono text-xs text-green-400/60">Your items have been delivered to your account.</p>
            </div>
          </div>
        )}
        {showCanceled && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <XCircle size={20} className="text-amber-400" />
            <div>
              <p className="font-mono text-sm text-amber-300 font-semibold">Payment canceled</p>
              <p className="font-mono text-xs text-amber-400/60">No charges were made. You can try again anytime.</p>
            </div>
          </div>
        )}

        {/* Featured Products */}
        {featured && featured.length > 0 && (
          <section>
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2 mb-4">
              <Star size={15} className="text-accent" />
              FEATURED
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((product) => (
                <div
                  key={product.key}
                  className="relative rounded-lg border border-accent/30 bg-gradient-to-br from-accent/5 to-card/40 p-5 hover:border-accent/50 transition-all group"
                >
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent font-mono text-[10px] tracking-wider">
                      FEATURED
                    </span>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-display text-base font-bold text-foreground">{product.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Rewards preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.rewards.dreamTokens && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px]">
                        +{product.rewards.dreamTokens} Dream
                      </span>
                    )}
                    {product.rewards.cardPacks && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                        {product.rewards.cardPacks} Card Pack{product.rewards.cardPacks > 1 ? "s" : ""}
                      </span>
                    )}
                    {product.rewards.shipUpgrade && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
                        Ship Upgrade
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {product.priceUsd > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-accent/40 text-accent hover:bg-accent/10"
                        disabled={purchasing === product.key}
                        onClick={() => handleBuyWithStripe(product.key)}
                      >
                        {purchasing === product.key ? (
                          <Loader2 size={12} className="animate-spin mr-1" />
                        ) : (
                          <Zap size={12} className="mr-1" />
                        )}
                        {formatPrice(product.priceUsd)}
                      </Button>
                    )}
                    {product.priceDream > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
                        disabled={purchasing === product.key}
                        onClick={() => handleBuyWithDream(product.key)}
                      >
                        <Gem size={12} className="mr-1" />
                        {product.priceDream} Dream
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "dream", "cards", "ship", "cosmetic", "bundle"] as Category[]).map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-primary/20 border border-primary/40 text-primary"
                    : "bg-card/30 border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50"
                }`}
              >
                <Icon size={13} />
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.key}
              className="rounded-lg border border-border/30 bg-card/30 p-4 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  product.category === "dream" ? "bg-purple-500/10 text-purple-400" :
                  product.category === "cards" ? "bg-blue-500/10 text-blue-400" :
                  product.category === "ship" ? "bg-cyan-500/10 text-cyan-400" :
                  product.category === "cosmetic" ? "bg-green-500/10 text-green-400" :
                  "bg-amber-500/10 text-amber-400"
                }`}>
                  {product.category.toUpperCase()}
                </span>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Rewards */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.rewards.dreamTokens && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[9px]">
                    +{product.rewards.dreamTokens} Dream
                  </span>
                )}
                {product.rewards.soulBoundDream && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[9px]">
                    +{product.rewards.soulBoundDream} Soul Dream
                  </span>
                )}
                {product.rewards.cardPacks && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[9px]">
                    {product.rewards.cardPacks} Pack{product.rewards.cardPacks > 1 ? "s" : ""}
                    {product.rewards.cardPackRarity && ` (${product.rewards.cardPackRarity}+)`}
                  </span>
                )}
                {product.rewards.shipUpgrade && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[9px]">
                    {product.rewards.shipUpgrade.type} Lv{product.rewards.shipUpgrade.level}
                  </span>
                )}
                {product.rewards.baseUpgrade && (
                  <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-mono text-[9px]">
                    Base: {product.rewards.baseUpgrade.type}
                  </span>
                )}
                {product.rewards.cargoExpansion && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px]">
                    +Cargo
                  </span>
                )}
                {product.rewards.fuelCapacity && (
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono text-[9px]">
                    +Fuel
                  </span>
                )}
              </div>

              {/* Price buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {product.priceUsd > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-[11px] h-7 border-accent/30 text-accent hover:bg-accent/10"
                    disabled={purchasing === product.key}
                    onClick={() => handleBuyWithStripe(product.key)}
                  >
                    {purchasing === product.key ? (
                      <Loader2 size={11} className="animate-spin mr-1" />
                    ) : (
                      <Zap size={11} className="mr-1" />
                    )}
                    {formatPrice(product.priceUsd)}
                  </Button>
                )}
                {product.priceDream > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-[11px] h-7 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    disabled={purchasing === product.key}
                    onClick={() => handleBuyWithDream(product.key)}
                  >
                    <Gem size={11} className="mr-1" />
                    {product.priceDream}
                  </Button>
                )}
                {product.priceCredits > 0 && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    or {product.priceCredits.toLocaleString()} credits
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-mono text-sm text-muted-foreground">No products in this category</p>
          </div>
        )}

        {/* Purchase History */}
        {isAuthenticated && purchases && purchases.length > 0 && (
          <section>
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground flex items-center gap-2 mb-4">
              <Package size={15} className="text-muted-foreground" />
              PURCHASE HISTORY
            </h2>
            <div className="rounded-lg border border-border/30 bg-card/20 overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead>
                  <tr className="border-b border-border/20">
                    <th className="text-left font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider p-2 sm:p-3">ITEM</th>
                    <th className="text-left font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider p-2 sm:p-3">METHOD</th>
                    <th className="text-left font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider p-2 sm:p-3 hidden sm:table-cell">QTY</th>
                    <th className="text-left font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-wider p-2 sm:p-3">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.slice(0, 20).map((p, i) => (
                    <tr key={i} className="border-b border-border/10 last:border-0">
                      <td className="p-2 sm:p-3 font-mono text-[10px] sm:text-xs text-foreground max-w-[120px] truncate">
                        {p.product?.name || p.productKey}
                      </td>
                      <td className="p-2 sm:p-3">
                        <span className={`font-mono text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded ${
                          p.paymentMethod === "stripe" ? "bg-blue-500/10 text-blue-400" :
                          p.paymentMethod === "dream" ? "bg-purple-500/10 text-purple-400" :
                          "bg-amber-500/10 text-amber-400"
                        }`}>
                          {(p.paymentMethod || "unknown").toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{p.quantity}</td>
                      <td className="p-2 sm:p-3 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ═══ THE POTENTIALS NFT SECTION ═══ */}
        <section className="rounded-lg border border-purple-500/30 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(79,70,229,0.08) 50%, rgba(51,226,230,0.05) 100%)' }}>
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/15 border border-purple-500/30">
                <Gem size={24} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-sm font-bold tracking-wider text-purple-300">THE POTENTIALS</h3>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">NFT</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground/80 mb-4 leading-relaxed">
                  Own a Potential NFT? Connect your Ethereum wallet to claim your exclusive 1/1 Loredex card.
                  Each card is unique — generated from your NFT's art with lore attributes mapped from on-chain metadata.
                  <span className="text-purple-400"> 1,000 Potentials. 1,000 unique cards. Claim once, yours forever.</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/potentials">
                    <Button variant="outline" className="gap-2 border-purple-500/40 text-purple-300 hover:bg-purple-500/15 hover:text-purple-200">
                      <Gem size={14} />
                      VIEW COLLECTION
                      <ArrowRight size={12} />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/20 border border-border/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-muted-foreground">Ethereum Mainnet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test card info */}
        <div className="rounded-lg border border-border/20 bg-card/10 p-4">
          <p className="font-mono text-[10px] text-muted-foreground/60">
            <span className="text-accent/60">TEST MODE</span> — Use card number{" "}
            <span className="text-foreground/80">4242 4242 4242 4242</span> with any future expiry and CVC for test purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
