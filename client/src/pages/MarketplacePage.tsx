import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, Search, ShoppingCart, Gavel, ArrowLeftRight,
  TrendingUp, Clock, Package, Loader2, X, Plus, Minus,
  ChevronRight, DollarSign, Sparkles, History, Filter,
  ArrowUpDown, AlertCircle, Check, Eye, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import season1Cards from "@/data/season1-cards.json";

type CardData = (typeof season1Cards)[number];

const RARITY_COLORS: Record<string, string> = {
  Common: "text-muted-foreground border-gray-500/30",
  Uncommon: "text-green-400 border-green-500/30",
  Rare: "text-blue-400 border-blue-500/30",
  Epic: "text-purple-400 border-purple-500/30",
  Legendary: "text-amber-400 border-amber-500/30",
};
const RARITY_BG: Record<string, string> = {
  Common: "bg-gray-500/10",
  Uncommon: "bg-green-500/10",
  Rare: "bg-blue-500/10",
  Epic: "bg-purple-500/10",
  Legendary: "bg-amber-500/10",
};

type Tab = "browse" | "auctions" | "buy_orders" | "exchange" | "my_listings" | "history";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "browse", label: "MARKET", icon: <Store size={14} /> },
  { key: "auctions", label: "AUCTIONS", icon: <Gavel size={14} /> },
  { key: "buy_orders", label: "BUY ORDERS", icon: <ShoppingCart size={14} /> },
  { key: "exchange", label: "EXCHANGE", icon: <ArrowLeftRight size={14} /> },
  { key: "my_listings", label: "MY LISTINGS", icon: <Package size={14} /> },
  { key: "history", label: "HISTORY", icon: <History size={14} /> },
];

export default function MarketplacePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const tabIndex = TABS.findIndex(t => t.key === activeTab);
  const swipeHandlers = useSwipeTabs({
    activeIndex: tabIndex,
    tabCount: TABS.length,
    onTabChange: (i: number) => setActiveTab(TABS[i].key),
  });

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
          <Store size={48} className="mx-auto text-primary mb-4" />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-3">INTERGALACTIC MARKETPLACE</h1>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Trade cards, materials, and items with operatives across the network.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm"
          >
            LOGIN TO TRADE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">INTERGALACTIC MARKET</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider">
          <span className="text-primary">MARKETPLACE</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Buy, sell, auction, and exchange across the network
        </p>
      </div>

      {/* Market Stats Bar */}
      <MarketStatsBar />

      {/* Tabs */}
      <div className="px-4 sm:px-6 mt-3">
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-mono text-xs transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-card border border-b-0 border-primary/30 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 mt-1" {...swipeHandlers}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "browse" && <BrowseTab />}
            {activeTab === "auctions" && <AuctionsTab />}
            {activeTab === "buy_orders" && <BuyOrdersTab />}
            {activeTab === "exchange" && <ExchangeTab />}
            {activeTab === "my_listings" && <MyListingsTab />}
            {activeTab === "history" && <HistoryTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MARKET STATS BAR
   ═══════════════════════════════════════════════════════ */
function MarketStatsBar() {
  const { data: stats } = trpc.marketplace.marketStats.useQuery();
  return (
    <div className="px-4 sm:px-6 mt-2">
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "LISTINGS", value: stats?.activeListings || 0, color: "text-primary" },
          { label: "AUCTIONS", value: stats?.activeAuctions || 0, color: "text-accent" },
          { label: "BUY ORDERS", value: stats?.activeBuyOrders || 0, color: "text-chart-4" },
          { label: "24H TRADES", value: stats?.recentTransactions || 0, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border/20 bg-card/30 p-2 text-center">
            <p className={`font-display text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="font-mono text-[9px] text-muted-foreground tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BROWSE TAB — Search and buy listings
   ═══════════════════════════════════════════════════════ */
function BrowseTab() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [itemType, setItemType] = useState<"all" | "card" | "material" | "crafted_item">("all");
  const [rarity, setRarity] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_low" | "price_high" | "oldest">("newest");
  const [currency, setCurrency] = useState<"any" | "dream" | "credits">("any");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.marketplace.searchListings.useQuery({
    itemType, search: search || undefined, rarity: rarity || undefined,
    sortBy, currency, page, limit: 20,
  });

  const buyMutation = trpc.marketplace.buyListing.useMutation({
    onSuccess: (res) => {
      toast.success(`Purchased! Paid ${res.totalPaid} (${res.tax} tax)`);
      utils.marketplace.searchListings.invalidate();
      utils.marketplace.marketStats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [buyingId, setBuyingId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={itemType}
            onChange={(e) => { setItemType(e.target.value as any); setPage(1); }}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs text-foreground"
          >
            <option value="all">All Types</option>
            <option value="card">Cards</option>
            <option value="material">Materials</option>
            <option value="crafted_item">Crafted</option>
          </select>
          <select
            value={rarity}
            onChange={(e) => { setRarity(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs text-foreground"
          >
            <option value="">Any Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs text-foreground"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low</option>
            <option value="price_high">Price: High</option>
            <option value="oldest">Oldest</option>
          </select>
          <select
            value={currency}
            onChange={(e) => { setCurrency(e.target.value as any); setPage(1); }}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs text-foreground"
          >
            <option value="any">Any Currency</option>
            <option value="dream">Dream Only</option>
            <option value="credits">Credits Only</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : !data?.listings.length ? (
        <div className="text-center py-12">
          <Store size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-mono text-sm text-muted-foreground">No listings found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.listings.map((listing) => (
              <div
                key={listing.id}
                className={`rounded-lg border border-border/30 bg-card/40 p-4 hover:border-primary/30 transition-colors ${
                  RARITY_BG[listing.rarity || "Common"] || ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold truncate">{listing.itemName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${RARITY_COLORS[listing.rarity || "Common"] || ""}`}>
                        {listing.rarity || "Common"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">{listing.itemType}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">x{listing.quantity}</span>
                    </div>
                  </div>
                  <Tag size={14} className="text-muted-foreground/30 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  {listing.priceDream > 0 && (
                    <div className="flex items-center gap-1">
                      <Sparkles size={12} className="text-accent" />
                      <span className="font-mono text-sm font-bold text-accent">{listing.priceDream}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">DREAM</span>
                    </div>
                  )}
                  {listing.priceCredits > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-chart-4" />
                      <span className="font-mono text-sm font-bold text-chart-4">{listing.priceCredits}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">CR</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {listing.expiresAt ? `Expires ${new Date(listing.expiresAt).toLocaleDateString()}` : ""}
                  </span>
                  <div className="flex gap-2">
                    {listing.priceDream > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-[10px] h-7 px-2 border-accent/30 text-accent hover:bg-accent/10"
                        disabled={buyMutation.isPending}
                        onClick={() => {
                          setBuyingId(listing.id);
                          buyMutation.mutate({ listingId: listing.id, quantity: 1, payWith: "dream" });
                        }}
                      >
                        {buyMutation.isPending && buyingId === listing.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        BUY (DREAM)
                      </Button>
                    )}
                    {listing.priceCredits > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-[10px] h-7 px-2 border-chart-4/30 text-chart-4 hover:bg-chart-4/10"
                        disabled={buyMutation.isPending}
                        onClick={() => {
                          setBuyingId(listing.id);
                          buyMutation.mutate({ listingId: listing.id, quantity: 1, payWith: "credits" });
                        }}
                      >
                        {buyMutation.isPending && buyingId === listing.id ? <Loader2 size={10} className="animate-spin" /> : <DollarSign size={10} />}
                        BUY (CR)
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                size="sm" variant="outline" disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="font-mono text-xs"
              >
                Previous
              </Button>
              <span className="font-mono text-xs text-muted-foreground self-center">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <Button
                size="sm" variant="outline" disabled={page >= Math.ceil(data.total / 20)}
                onClick={() => setPage(p => p + 1)}
                className="font-mono text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Listing Button */}
      <CreateListingPanel />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CREATE LISTING PANEL
   ═══════════════════════════════════════════════════════ */
function CreateListingPanel() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [itemType, setItemType] = useState<"card" | "material" | "crafted_item">("card");
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [rarity, setRarity] = useState("Common");
  const [quantity, setQuantity] = useState(1);
  const [priceDream, setPriceDream] = useState(0);
  const [priceCredits, setPriceCredits] = useState(0);
  const [duration, setDuration] = useState(24);

  const { data: myCards } = trpc.cardGame.myCollection.useQuery({ page: 1, limit: 100 });

  const createMutation = trpc.marketplace.createListing.useMutation({
    onSuccess: () => {
      toast.success("Listing created!");
      setOpen(false);
      setItemId(""); setItemName(""); setQuantity(1); setPriceDream(0); setPriceCredits(0);
      utils.marketplace.searchListings.invalidate();
      utils.marketplace.myListings.invalidate();
      utils.marketplace.marketStats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const cardOptions = useMemo(() => {
    if (!myCards?.cards) return [];
    return myCards.cards
      .filter((c) => c.userCard.quantity > 0)
      .map((c) => {
        const cardData = season1Cards.find((s: CardData) => s.id === c.userCard.cardId);
        return { id: c.userCard.cardId, name: cardData?.name || c.userCard.cardId, rarity: cardData?.rarity || "Common", qty: c.userCard.quantity };
      });
  }, [myCards]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full font-mono text-sm bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
        variant="outline"
      >
        <Plus size={14} className="mr-2" /> CREATE LISTING
      </Button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-primary/30 bg-card/60 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold tracking-wider text-primary">NEW LISTING</h3>
            <button onClick={() => setOpen(false)}><X size={16} className="text-muted-foreground" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">ITEM TYPE</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              >
                <option value="card">Card</option>
                <option value="material">Material</option>
                <option value="crafted_item">Crafted Item</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">DURATION</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
              </select>
            </div>
          </div>

          {itemType === "card" && cardOptions.length > 0 && (
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">SELECT CARD</label>
              <select
                value={itemId}
                onChange={(e) => {
                  const card = cardOptions.find(c => c.id === e.target.value);
                  if (card) { setItemId(card.id); setItemName(card.name); setRarity(card.rarity); }
                }}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              >
                <option value="">-- Select a card --</option>
                {cardOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.rarity}) x{c.qty}</option>
                ))}
              </select>
            </div>
          )}

          {itemType !== "card" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">ITEM ID</label>
                <input
                  value={itemId} onChange={(e) => setItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
                  placeholder="e.g. shadow_crystal"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">ITEM NAME</label>
                <input
                  value={itemName} onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
                  placeholder="Shadow Crystal"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">QUANTITY</label>
              <input
                type="number" min={1} max={9999} value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1 flex items-center gap-1">
                <Sparkles size={10} className="text-accent" /> DREAM PRICE
              </label>
              <input
                type="number" min={0} value={priceDream}
                onChange={(e) => setPriceDream(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1 flex items-center gap-1">
                <DollarSign size={10} className="text-chart-4" /> CREDIT PRICE
              </label>
              <input
                type="number" min={0} value={priceCredits}
                onChange={(e) => setPriceCredits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
              />
            </div>
          </div>

          <Button
            onClick={() => createMutation.mutate({
              itemType, itemId, itemName, rarity, quantity,
              priceDream, priceCredits, durationHours: duration,
            })}
            disabled={!itemId || !itemName || (priceDream === 0 && priceCredits === 0) || createMutation.isPending}
            className="w-full font-mono text-sm"
          >
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : <Plus size={14} className="mr-2" />}
            LIST FOR SALE
          </Button>
        </motion.div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   AUCTIONS TAB
   ═══════════════════════════════════════════════════════ */
function AuctionsTab() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"ending_soon" | "newest" | "highest_bid" | "lowest_bid">("ending_soon");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.marketplace.searchAuctions.useQuery({
    search: search || undefined, sortBy, page,
  });

  const bidMutation = trpc.marketplace.placeBid.useMutation({
    onSuccess: (res) => {
      toast.success(`Bid placed! Current: ${res.currentBid} Dream`);
      utils.marketplace.searchAuctions.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [bidAmounts, setBidAmounts] = useState<Record<number, number>>({});

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="Search auctions..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
        >
          <option value="ending_soon">Ending Soon</option>
          <option value="newest">Newest</option>
          <option value="highest_bid">Highest Bid</option>
          <option value="lowest_bid">Lowest Bid</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : !data?.auctions.length ? (
        <div className="text-center py-12">
          <Gavel size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-mono text-sm text-muted-foreground">No active auctions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.auctions.map((auction) => {
            const timeLeft = new Date(auction.endsAt).getTime() - Date.now();
            const hoursLeft = Math.max(0, Math.floor(timeLeft / 3600000));
            const minsLeft = Math.max(0, Math.floor((timeLeft % 3600000) / 60000));
            const minBid = auction.currentBid > 0 ? auction.currentBid + auction.bidIncrement : auction.startingBid;

            return (
              <div key={auction.id} className="rounded-lg border border-border/30 bg-card/40 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold">{auction.itemName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {auction.rarity && (
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${RARITY_COLORS[auction.rarity] || ""}`}>
                          {auction.rarity}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">x{auction.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-destructive">
                      <Clock size={12} />
                      <span className="font-mono text-xs font-bold">
                        {hoursLeft}h {minsLeft}m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3 pt-2 border-t border-border/20">
                  <div>
                    <p className="font-mono text-[9px] text-muted-foreground">CURRENT BID</p>
                    <p className="font-mono text-sm font-bold text-accent">
                      {auction.currentBid > 0 ? `${auction.currentBid} ✦` : `${auction.startingBid} ✦ (start)`}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-muted-foreground">MIN BID</p>
                    <p className="font-mono text-sm font-bold">{minBid} ✦</p>
                  </div>
                  {auction.buyoutPrice > 0 && (
                    <div>
                      <p className="font-mono text-[9px] text-muted-foreground">BUYOUT</p>
                      <p className="font-mono text-sm font-bold text-chart-4">{auction.buyoutPrice} ✦</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    min={minBid}
                    value={bidAmounts[auction.id] || minBid}
                    onChange={(e) => setBidAmounts(prev => ({ ...prev, [auction.id]: Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    className="font-mono text-[10px] h-8"
                    disabled={bidMutation.isPending}
                    onClick={() => bidMutation.mutate({
                      auctionId: auction.id,
                      bidAmount: bidAmounts[auction.id] || minBid,
                    })}
                  >
                    <Gavel size={12} className="mr-1" /> BID
                  </Button>
                  {auction.buyoutPrice > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-[10px] h-8 border-chart-4/30 text-chart-4"
                      disabled={bidMutation.isPending}
                      onClick={() => bidMutation.mutate({
                        auctionId: auction.id,
                        bidAmount: auction.buyoutPrice,
                      })}
                    >
                      BUYOUT
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BUY ORDERS TAB
   ═══════════════════════════════════════════════════════ */
function BuyOrdersTab() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.marketplace.searchBuyOrders.useQuery({
    search: search || undefined,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [orderItemType, setOrderItemType] = useState<"card" | "material" | "crafted_item">("card");
  const [orderItemId, setOrderItemId] = useState("");
  const [orderItemName, setOrderItemName] = useState("");
  const [orderQty, setOrderQty] = useState(1);
  const [orderMaxDream, setOrderMaxDream] = useState(0);
  const [orderMaxCredits, setOrderMaxCredits] = useState(0);

  const createMutation = trpc.marketplace.createBuyOrder.useMutation({
    onSuccess: () => {
      toast.success("Buy order created!");
      setShowCreate(false);
      utils.marketplace.searchBuyOrders.invalidate();
      utils.marketplace.myBuyOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="Search buy orders..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : !data?.orders.length ? (
        <div className="text-center py-12">
          <ShoppingCart size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-mono text-sm text-muted-foreground">No active buy orders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border/30 bg-card/40 p-3 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold">{order.itemName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[10px] text-muted-foreground">x{order.quantity - order.filledQuantity} wanted</span>
                  {order.maxPriceDream > 0 && (
                    <span className="font-mono text-xs text-accent">up to {order.maxPriceDream} ✦</span>
                  )}
                  {order.maxPriceCredits > 0 && (
                    <span className="font-mono text-xs text-chart-4">up to {order.maxPriceCredits} CR</span>
                  )}
                </div>
              </div>
              <Eye size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={() => setShowCreate(!showCreate)}
        variant="outline"
        className="w-full font-mono text-sm border-chart-4/30 text-chart-4 hover:bg-chart-4/10"
      >
        <Plus size={14} className="mr-2" /> CREATE BUY ORDER
      </Button>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-chart-4/30 bg-card/60 p-4 space-y-3"
        >
          <h3 className="font-display text-sm font-bold tracking-wider text-chart-4">NEW BUY ORDER</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">TYPE</label>
              <select value={orderItemType} onChange={(e) => setOrderItemType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs">
                <option value="card">Card</option>
                <option value="material">Material</option>
                <option value="crafted_item">Crafted</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">QUANTITY</label>
              <input type="number" min={1} value={orderQty} onChange={(e) => setOrderQty(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">ITEM ID</label>
              <input value={orderItemId} onChange={(e) => setOrderItemId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" placeholder="card_id" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">ITEM NAME</label>
              <input value={orderItemName} onChange={(e) => setOrderItemName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" placeholder="Card Name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">MAX DREAM/UNIT</label>
              <input type="number" min={0} value={orderMaxDream} onChange={(e) => setOrderMaxDream(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">MAX CREDITS/UNIT</label>
              <input type="number" min={0} value={orderMaxCredits} onChange={(e) => setOrderMaxCredits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" />
            </div>
          </div>
          <Button
            onClick={() => createMutation.mutate({
              itemType: orderItemType, itemId: orderItemId, itemName: orderItemName,
              quantity: orderQty, maxPriceDream: orderMaxDream, maxPriceCredits: orderMaxCredits,
            })}
            disabled={!orderItemId || !orderItemName || (orderMaxDream === 0 && orderMaxCredits === 0) || createMutation.isPending}
            className="w-full font-mono text-sm"
          >
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : <ShoppingCart size={14} className="mr-2" />}
            PLACE BUY ORDER
          </Button>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXCHANGE TAB — Dream ↔ Credits
   ═══════════════════════════════════════════════════════ */
function ExchangeTab() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.marketplace.exchangeOrders.useQuery({ page: 1 });
  const { data: myOrders } = trpc.marketplace.myExchangeOrders.useQuery();

  const [sellCurrency, setSellCurrency] = useState<"dream" | "credits">("dream");
  const [sellAmount, setSellAmount] = useState(100);
  const [buyAmount, setBuyAmount] = useState(1000);

  const createMutation = trpc.marketplace.createExchangeOrder.useMutation({
    onSuccess: () => {
      toast.success("Exchange order created!");
      utils.marketplace.exchangeOrders.invalidate();
      utils.marketplace.myExchangeOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const cancelMutation = trpc.marketplace.cancelExchangeOrder.useMutation({
    onSuccess: () => {
      toast.success("Order cancelled, funds refunded");
      utils.marketplace.exchangeOrders.invalidate();
      utils.marketplace.myExchangeOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-card/60 p-4 space-y-4">
        <h3 className="font-display text-sm font-bold tracking-wider text-primary flex items-center gap-2">
          <ArrowLeftRight size={14} /> CURRENCY EXCHANGE
        </h3>

        <div className="grid grid-cols-5 gap-2 items-end">
          <div className="col-span-2">
            <label className="font-mono text-[10px] text-muted-foreground block mb-1">SELL</label>
            <div className="flex gap-1">
              <select value={sellCurrency} onChange={(e) => setSellCurrency(e.target.value as any)}
                className="px-2 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs">
                <option value="dream">Dream ✦</option>
                <option value="credits">Credits</option>
              </select>
              <input type="number" min={1} value={sellAmount} onChange={(e) => setSellAmount(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" />
            </div>
          </div>
          <div className="flex justify-center pb-2">
            <ArrowLeftRight size={16} className="text-muted-foreground" />
          </div>
          <div className="col-span-2">
            <label className="font-mono text-[10px] text-muted-foreground block mb-1">RECEIVE</label>
            <div className="flex gap-1">
              <span className="px-2 py-2 rounded-lg bg-secondary/30 border border-border/20 font-mono text-xs text-muted-foreground">
                {sellCurrency === "dream" ? "Credits" : "Dream ✦"}
              </span>
              <input type="number" min={1} value={buyAmount} onChange={(e) => setBuyAmount(Number(e.target.value))}
                className="w-full px-2 py-2 rounded-lg bg-secondary/50 border border-border/30 font-mono text-xs" />
            </div>
          </div>
        </div>

        <div className="text-center font-mono text-[10px] text-muted-foreground">
          Rate: 1 {sellCurrency === "dream" ? "Dream" : "Credit"} = {(buyAmount / sellAmount).toFixed(2)} {sellCurrency === "dream" ? "Credits" : "Dream"}
        </div>

        <Button
          onClick={() => createMutation.mutate({
            sellCurrency,
            sellAmount,
            buyCurrency: sellCurrency === "dream" ? "credits" : "dream",
            buyAmount,
          })}
          disabled={createMutation.isPending || sellAmount <= 0 || buyAmount <= 0}
          className="w-full font-mono text-sm"
        >
          {createMutation.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : <ArrowLeftRight size={14} className="mr-2" />}
          CREATE EXCHANGE ORDER
        </Button>
      </div>

      {/* My Exchange Orders */}
      {myOrders && myOrders.length > 0 && (
        <div>
          <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground mb-2">MY ORDERS</h3>
          <div className="space-y-2">
            {myOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border/30 bg-card/40 p-3 flex items-center justify-between">
                <div className="font-mono text-xs">
                  <span className="text-destructive">{order.sellAmount} {order.sellCurrency}</span>
                  {" → "}
                  <span className="text-accent">{order.buyAmount} {order.buyCurrency}</span>
                </div>
                <Button size="sm" variant="ghost" className="h-6 px-2 font-mono text-[10px] text-destructive"
                  onClick={() => cancelMutation.mutate({ orderId: order.id })}>
                  <X size={10} /> CANCEL
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Orders */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : data?.orders && data.orders.length > 0 ? (
        <div>
          <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground mb-2">OPEN EXCHANGE ORDERS</h3>
          <div className="space-y-2">
            {data.orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border/20 bg-card/30 p-3 flex items-center justify-between">
                <div className="font-mono text-xs">
                  <span className="text-destructive">{order.sellAmount} {order.sellCurrency}</span>
                  {" → "}
                  <span className="text-accent">{order.buyAmount} {order.buyCurrency}</span>
                  <span className="text-muted-foreground ml-2">
                    (1:{(order.buyAmount / order.sellAmount).toFixed(1)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MY LISTINGS TAB
   ═══════════════════════════════════════════════════════ */
function MyListingsTab() {
  const utils = trpc.useUtils();
  const { data: listings, isLoading } = trpc.marketplace.myListings.useQuery();
  const { data: myBuyOrders } = trpc.marketplace.myBuyOrders.useQuery();

  const cancelListingMutation = trpc.marketplace.cancelListing.useMutation({
    onSuccess: () => {
      toast.success("Listing cancelled, items returned");
      utils.marketplace.myListings.invalidate();
      utils.marketplace.marketStats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const cancelBuyOrderMutation = trpc.marketplace.cancelBuyOrder.useMutation({
    onSuccess: () => {
      toast.success("Buy order cancelled, funds refunded");
      utils.marketplace.myBuyOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      {/* My Sell Listings */}
      <div>
        <h3 className="font-display text-xs font-bold tracking-wider text-primary mb-3 flex items-center gap-2">
          <Tag size={12} /> MY SELL LISTINGS
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
        ) : !listings?.length ? (
          <p className="font-mono text-xs text-muted-foreground text-center py-6">No active listings</p>
        ) : (
          <div className="space-y-2">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-lg border border-border/30 bg-card/40 p-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold">{listing.itemName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">x{listing.quantity}</span>
                    {listing.priceDream > 0 && <span className="font-mono text-xs text-accent">{listing.priceDream} ✦</span>}
                    {listing.priceCredits > 0 && <span className="font-mono text-xs text-chart-4">{listing.priceCredits} CR</span>}
                  </div>
                </div>
                <Button
                  size="sm" variant="ghost"
                  className="h-7 px-2 font-mono text-[10px] text-destructive hover:bg-destructive/10"
                  disabled={cancelListingMutation.isPending}
                  onClick={() => cancelListingMutation.mutate({ listingId: listing.id })}
                >
                  <X size={10} className="mr-1" /> CANCEL
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Buy Orders */}
      <div>
        <h3 className="font-display text-xs font-bold tracking-wider text-chart-4 mb-3 flex items-center gap-2">
          <ShoppingCart size={12} /> MY BUY ORDERS
        </h3>
        {!myBuyOrders?.length ? (
          <p className="font-mono text-xs text-muted-foreground text-center py-6">No active buy orders</p>
        ) : (
          <div className="space-y-2">
            {myBuyOrders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border/30 bg-card/40 p-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold">{order.itemName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {order.filledQuantity}/{order.quantity} filled
                    </span>
                    {order.maxPriceDream > 0 && <span className="font-mono text-xs text-accent">max {order.maxPriceDream} ✦</span>}
                    {order.maxPriceCredits > 0 && <span className="font-mono text-xs text-chart-4">max {order.maxPriceCredits} CR</span>}
                  </div>
                </div>
                <Button
                  size="sm" variant="ghost"
                  className="h-7 px-2 font-mono text-[10px] text-destructive hover:bg-destructive/10"
                  disabled={cancelBuyOrderMutation.isPending}
                  onClick={() => cancelBuyOrderMutation.mutate({ orderId: order.id })}
                >
                  <X size={10} className="mr-1" /> CANCEL
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HISTORY TAB
   ═══════════════════════════════════════════════════════ */
function HistoryTab() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.marketplace.myTransactions.useQuery({ page });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : !data?.transactions.length ? (
        <div className="text-center py-12">
          <History size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-mono text-sm text-muted-foreground">No transaction history</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.transactions.map((tx) => {
            const isSeller = tx.sellerId === user?.id;
            return (
              <div key={tx.id} className="rounded-lg border border-border/20 bg-card/30 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold">{tx.itemName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isSeller ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                        {isSeller ? "SOLD" : "BOUGHT"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">x{tx.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {tx.priceDream > 0 && (
                      <p className={`font-mono text-sm font-bold ${isSeller ? "text-green-400" : "text-destructive"}`}>
                        {isSeller ? "+" : "-"}{tx.priceDream * tx.quantity} ✦
                      </p>
                    )}
                    {tx.priceCredits > 0 && (
                      <p className={`font-mono text-sm font-bold ${isSeller ? "text-green-400" : "text-destructive"}`}>
                        {isSeller ? "+" : "-"}{tx.priceCredits * tx.quantity} CR
                      </p>
                    )}
                    <p className="font-mono text-[9px] text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
